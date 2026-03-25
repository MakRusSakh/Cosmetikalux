"""
Модуль: Обогащение товаров через yesstyle.com и japanesetaste.com.
Для БАДов, гигиены, лечебных средств — не покрытых incidecoder.
"""

import re
import time
import json
import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
CACHE_DIR = os.path.join(os.path.dirname(__file__), "../../data/general_cache")
DELAY = 1.5


def ensure_cache():
    os.makedirs(CACHE_DIR, exist_ok=True)


def _cache_path(key: str) -> str:
    safe = re.sub(r"[^\w-]", "_", key)[:100]
    return os.path.join(CACHE_DIR, f"{safe}.json")


def _load_cache(key: str) -> dict | None:
    path = _cache_path(key)
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return None


def _save_cache(key: str, data: dict):
    ensure_cache()
    with open(_cache_path(key), "w") as f:
        json.dump(data, f, ensure_ascii=False)


def build_search_query(product: dict) -> str:
    """Строит поисковый запрос из названия и бренда."""
    name = product.get("name", "")
    brand = product.get("brand", "")
    # Извлекаем английские слова
    eng = re.findall(r"[A-Za-z][A-Za-z0-9'.+\-]+", name)
    if eng:
        query = " ".join(eng[:6])
    else:
        query = name[:60]
    if brand and brand != "Generic" and brand.lower() not in query.lower():
        query = f"{brand} {query}"
    return query.strip()


def search_yesstyle(query: str, session: requests.Session) -> dict | None:
    """Ищет товар на yesstyle.com."""
    cached = _load_cache(f"ys_{query}")
    if cached:
        return cached

    url = f"https://www.yesstyle.com/en/search?q={quote_plus(query)}&bpt=48"
    try:
        r = session.get(url, timeout=20)
        if r.status_code != 200:
            return None
    except requests.RequestException:
        return None

    soup = BeautifulSoup(r.text, "lxml")
    # Ищем первый продукт
    product_link = soup.find("a", class_=re.compile(r"product"))
    if product_link and product_link.get("href"):
        href = product_link["href"]
        if not href.startswith("http"):
            href = f"https://www.yesstyle.com{href}"
        result = parse_yesstyle_product(href, session)
        if result:
            _save_cache(f"ys_{query}", result)
            return result
    return None


def parse_yesstyle_product(url: str, session: requests.Session) -> dict | None:
    """Парсит страницу товара yesstyle."""
    try:
        r = session.get(url, timeout=20)
        if r.status_code != 200:
            return None
    except requests.RequestException:
        return None

    soup = BeautifulSoup(r.text, "lxml")
    desc_el = soup.find(class_=re.compile(r"product.*desc|desc.*product"))
    description = desc_el.get_text(strip=True)[:500] if desc_el else ""
    ingredients_el = soup.find(string=re.compile(r"ingredient", re.I))
    ingredients = ""
    if ingredients_el and ingredients_el.parent:
        next_el = ingredients_el.parent.find_next_sibling()
        if next_el:
            ingredients = next_el.get_text(strip=True)[:500]

    meta = soup.find("meta", attrs={"name": "description"})
    meta_desc = meta.get("content", "").strip()[:300] if meta else ""

    return {
        "source": "yesstyle",
        "source_url": url,
        "description": description or meta_desc,
        "ingredients_raw": ingredients,
    }


def search_japanesetaste(query: str, session: requests.Session) -> dict | None:
    """Ищет товар на japanesetaste.com."""
    cached = _load_cache(f"jt_{query}")
    if cached:
        return cached

    url = f"https://int.japanesetaste.com/search?q={quote_plus(query)}"
    try:
        r = session.get(url, timeout=20)
        if r.status_code != 200:
            return None
    except requests.RequestException:
        return None

    soup = BeautifulSoup(r.text, "lxml")
    product_link = soup.find("a", class_=re.compile(r"product"))
    if product_link and product_link.get("href"):
        href = product_link["href"]
        if not href.startswith("http"):
            href = f"https://int.japanesetaste.com{href}"
        result = parse_japanesetaste_product(href, session)
        if result:
            _save_cache(f"jt_{query}", result)
            return result
    return None


def parse_japanesetaste_product(url: str, session: requests.Session) -> dict | None:
    """Парсит страницу товара japanesetaste."""
    try:
        r = session.get(url, timeout=20)
        if r.status_code != 200:
            return None
    except requests.RequestException:
        return None

    soup = BeautifulSoup(r.text, "lxml")
    desc = ""
    for el in soup.find_all(["div", "section"], class_=re.compile(r"desc|detail|about")):
        text = el.get_text(strip=True)
        if len(text) > len(desc):
            desc = text[:500]

    ingredients = ""
    ingr_header = soup.find(string=re.compile(r"ingredient", re.I))
    if ingr_header and ingr_header.parent:
        next_el = ingr_header.parent.find_next_sibling()
        if next_el:
            ingredients = next_el.get_text(strip=True)[:500]

    meta = soup.find("meta", attrs={"name": "description"})
    meta_desc = meta.get("content", "").strip()[:300] if meta else ""

    return {
        "source": "japanesetaste",
        "source_url": url,
        "description": desc or meta_desc,
        "ingredients_raw": ingredients,
    }


def enrich_product_general(product: dict, session: requests.Session) -> dict:
    """Обогащает товар через yesstyle или japanesetaste."""
    query = build_search_query(product)
    country = product.get("country", "")

    # Япония → japanesetaste первый, потом yesstyle
    if country == "Япония":
        time.sleep(DELAY)
        result = search_japanesetaste(query, session)
        if result:
            return {"status": "found", **result}
        time.sleep(DELAY)
        result = search_yesstyle(query, session)
        if result:
            return {"status": "found", **result}
    else:
        time.sleep(DELAY)
        result = search_yesstyle(query, session)
        if result:
            return {"status": "found", **result}

    return {"status": "not_found", "query": query}


def run_batch(products: list[dict], output_file: str):
    """Обогащает батч товаров."""
    ensure_cache()
    session = requests.Session()
    session.headers.update(HEADERS)

    results = {}
    found = not_found = 0

    for i, p in enumerate(products):
        pid = p.get("externalId", "")
        result = enrich_product_general(p, session)

        if result["status"] == "found":
            found += 1
        else:
            not_found += 1

        results[pid] = result

        if (i + 1) % 10 == 0 or i + 1 == len(products):
            print(f"  [{i+1}/{len(products)}] found={found} not_found={not_found}")

    with open(output_file, "w") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Saved: {output_file} ({len(results)} records)")
    return results
