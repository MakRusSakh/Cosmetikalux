"""
Модуль: Обогащение данных товаров через incidecoder.com.
Ищет INCI-составы, ключевые ингредиенты для K-beauty продуктов.
"""

import re
import time
import json
import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
INCIDECODER_BASE = "https://incidecoder.com"
CACHE_DIR = os.path.join(os.path.dirname(__file__), "../../data/inci_cache")
DELAY = 1.0


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


def extract_english_name(full_name: str) -> str:
    """Извлекает английскую часть названия для поиска."""
    # Убираем объём в скобках
    name = re.sub(r"\(?\d+\s*(?:мл|ml|г|g|шт)\)?", "", full_name, flags=re.I)
    # Пытаемся найти английское название (слова латиницей)
    eng_parts = re.findall(r"[A-Za-z][A-Za-z0-9'.+\-]+(?:\s+[A-Za-z][A-Za-z0-9'.+\-]+)*", name)
    if eng_parts:
        result = " ".join(eng_parts)
        # Убираем лишние пробелы
        return re.sub(r"\s+", " ", result).strip()
    return name.strip()


def search_incidecoder(query: str, session: requests.Session) -> list[dict]:
    """Поиск продукта на incidecoder.com. Возвращает [{url, name}]."""
    url = f"{INCIDECODER_BASE}/search?query={quote_plus(query)}"
    try:
        r = session.get(url, timeout=15)
        if r.status_code != 200:
            return []
    except requests.RequestException:
        return []

    soup = BeautifulSoup(r.text, "lxml")
    results = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "/products/" in href and href != "/products/create":
            name = a.get_text(strip=True)
            if name:
                results.append({
                    "url": f"{INCIDECODER_BASE}{href}",
                    "name": name,
                })
    return results[:5]


def parse_incidecoder_page(url: str, session: requests.Session) -> dict | None:
    """Парсит страницу продукта на incidecoder.com."""
    cached = _load_cache(url)
    if cached:
        return cached

    try:
        r = session.get(url, timeout=15)
        if r.status_code != 200:
            return None
    except requests.RequestException:
        return None

    soup = BeautifulSoup(r.text, "lxml")

    # INCI список
    inci_el = soup.find(id="ingredlist-short")
    inci = inci_el.get_text(strip=True) if inci_el else ""

    # Название
    title = soup.find("h1")
    name = title.get_text(strip=True) if title else ""

    # Ключевые ингредиенты (notable ingredients)
    key_ingredients = []
    for section in soup.find_all(class_=re.compile(r"ingred.*details|notable|highlight")):
        text = section.get_text(strip=True)
        if text and len(text) < 200:
            key_ingredients.append(text)

    # Описание из meta
    meta = soup.find("meta", attrs={"name": "description"})
    description = meta.get("content", "").strip() if meta else ""

    data = {
        "source_url": url,
        "source": "incidecoder",
        "inci_name": name,
        "inci_list": inci,
        "inci_ingredients": [i.strip() for i in inci.split(",") if i.strip()] if inci else [],
        "key_ingredients_raw": key_ingredients[:10],
    }

    _save_cache(url, data)
    return data


def find_best_match(product_name: str, search_results: list[dict]) -> dict | None:
    """Находит лучшее совпадение среди результатов поиска."""
    if not search_results:
        return None
    eng_name = extract_english_name(product_name).lower()
    best = None
    best_score = 0
    for result in search_results:
        r_name = result["name"].lower()
        # Считаем совпадающие слова
        words = set(eng_name.split())
        r_words = set(r_name.split())
        common = words & r_words
        score = len(common) / max(len(words), 1)
        if score > best_score:
            best_score = score
            best = result
    return best if best_score >= 0.3 else None


def enrich_product_inci(product: dict, session: requests.Session) -> dict:
    """Обогащает товар данными INCI из incidecoder.com."""
    eng_name = extract_english_name(product.get("name", ""))
    if len(eng_name) < 3:
        return {"status": "skip", "reason": "no_english_name"}

    time.sleep(DELAY)
    results = search_incidecoder(eng_name, session)
    if not results:
        return {"status": "not_found", "query": eng_name}

    match = find_best_match(product["name"], results)
    if not match:
        return {"status": "no_match", "query": eng_name, "candidates": len(results)}

    time.sleep(DELAY)
    data = parse_incidecoder_page(match["url"], session)
    if not data:
        return {"status": "parse_error", "url": match["url"]}

    return {"status": "found", **data}


def run_batch(products: list[dict], output_file: str):
    """Обогащает батч товаров и сохраняет результаты."""
    ensure_cache()
    session = requests.Session()
    session.headers.update(HEADERS)

    results = {}
    found = skip = not_found = 0

    for i, p in enumerate(products):
        pid = p.get("externalId", "")
        result = enrich_product_inci(p, session)

        if result["status"] == "found":
            found += 1
        elif result["status"] == "skip":
            skip += 1
        else:
            not_found += 1

        results[pid] = result

        if (i + 1) % 10 == 0 or i + 1 == len(products):
            print(f"  [{i+1}/{len(products)}] found={found} skip={skip} not_found={not_found}")

    with open(output_file, "w") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Saved: {output_file} ({len(results)} records)")
    return results
