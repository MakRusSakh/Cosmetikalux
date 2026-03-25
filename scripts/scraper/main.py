"""
Модуль 4: Главный скрипт — парсинг всех товаров и генерация JSON.
Объединяет CSV (исходные данные) + HTML (спарсенные описания) + enrichment.
Результат: src/data/products.json, src/data/categories.json, src/data/brands.json
"""

import csv
import json
import os
import sys
import re

# Добавляем корень проекта в sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, PROJECT_ROOT)

from scripts.scraper.parser import parse_product_page
from scripts.scraper.fetcher import fetch_batch, extract_product_ids_from_urls
from scripts.scraper.enricher import enrich_product, make_slug

CSV_PATH = os.path.join(PROJECT_ROOT, "products_tagged.csv")
URLS_FILE = os.path.join(PROJECT_ROOT, "site_product_cards.txt")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "src/data")


def load_csv_products() -> list[dict]:
    """Загружает товары из CSV."""
    products = []
    with open(CSV_PATH, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            products.append(dict(row))
    print(f"CSV: загружено {len(products)} товаров")
    return products


def load_product_urls() -> list[str]:
    """Загружает URL товаров из site_product_cards.txt."""
    urls = []
    with open(URLS_FILE, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("https://www.cosmetikalux.ru/products/"):
                urls.append(line)
    print(f"URLs: загружено {len(urls)} ссылок")
    return urls


def extract_id_from_csv_url(photo_url: str) -> str:
    """Извлекает product_id из поля photo_url в CSV."""
    match = re.search(r"/products/(\d+)", photo_url)
    return match.group(1) if match else ""


def build_csv_index(csv_products: list[dict]) -> dict[str, dict]:
    """Индекс CSV-товаров по product_id."""
    index = {}
    for row in csv_products:
        pid = extract_id_from_csv_url(row.get("photo_url", ""))
        if pid:
            index[pid] = row
    return index


def generate_categories(products: list[dict]) -> list[dict]:
    """Генерирует список категорий из товаров."""
    cats = {}
    for p in products:
        cat = p.get("category", "")
        cat_slug = p.get("categorySlug", "")
        subcat = p.get("subcategory", "")
        if cat and cat not in cats:
            cats[cat] = {"name": cat, "slug": cat_slug, "subcategories": set()}
        if cat in cats and subcat:
            cats[cat]["subcategories"].add(subcat)

    result = []
    for name, data in cats.items():
        subcats = [
            {"name": s, "slug": make_slug(s)}
            for s in sorted(data["subcategories"])
        ]
        result.append({
            "name": name,
            "slug": data["slug"],
            "subcategories": subcats,
        })
    return result


def generate_brands(products: list[dict]) -> list[dict]:
    """Генерирует список брендов из товаров."""
    brands = {}
    for p in products:
        brand = p.get("brand", "").strip()
        if not brand or brand == "Generic":
            continue
        if brand not in brands:
            brands[brand] = {
                "name": brand,
                "slug": p.get("brandSlug", make_slug(brand)),
                "country": p.get("country", ""),
                "countryCode": p.get("countryCode", ""),
                "productCount": 0,
            }
        brands[brand]["productCount"] += 1
    return sorted(brands.values(), key=lambda b: b["name"])


def save_json(data, filename: str):
    """Сохраняет данные в JSON."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    size_kb = os.path.getsize(path) / 1024
    print(f"Сохранено: {path} ({size_kb:.1f} KB, {len(data)} записей)")


def main():
    print("=" * 60)
    print("CosmetikaLux — Парсинг и генерация JSON данных")
    print("=" * 60)

    # 1. Загрузка исходных данных
    csv_products = load_csv_products()
    urls = load_product_urls()
    product_ids = extract_product_ids_from_urls(urls)
    csv_index = build_csv_index(csv_products)
    print(f"Product IDs: {len(product_ids)}, CSV index: {len(csv_index)}")

    # 2. Парсинг HTML-страниц
    print("\n--- Загрузка и парсинг страниц ---")
    html_pages = fetch_batch(product_ids, progress_every=50)

    # 3. Парсинг + обогащение
    print("\n--- Обогащение данных ---")
    enriched_products = []
    stats = {"parsed": 0, "no_html": 0, "no_csv": 0}

    for pid in product_ids:
        html = html_pages.get(pid)
        csv_row = csv_index.get(pid, {})

        if html:
            parsed = parse_product_page(html, f"https://www.cosmetikalux.ru/products/{pid}")
            stats["parsed"] += 1
        else:
            parsed = {"external_id": pid, "name": csv_row.get("name", ""), "price": None}
            stats["no_html"] += 1

        if not csv_row:
            stats["no_csv"] += 1

        enriched = enrich_product(parsed, csv_row)
        enriched_products.append(enriched)

    print(f"Спарсено: {stats['parsed']}, без HTML: {stats['no_html']}, без CSV: {stats['no_csv']}")

    # 4. Сохранение JSON
    print("\n--- Сохранение ---")
    save_json(enriched_products, "products.json")
    save_json(generate_categories(enriched_products), "categories.json")
    save_json(generate_brands(enriched_products), "brands.json")

    # 5. Статистика
    print("\n--- Статистика ---")
    with_desc = sum(1 for p in enriched_products if p.get("description"))
    with_ingr = sum(1 for p in enriched_products if p.get("ingredients"))
    with_vol = sum(1 for p in enriched_products if p.get("unit"))
    with_price = sum(1 for p in enriched_products if p.get("price"))
    print(f"С описанием: {with_desc}/{len(enriched_products)}")
    print(f"С ингредиентами: {with_ingr}/{len(enriched_products)}")
    print(f"С объёмом: {with_vol}/{len(enriched_products)}")
    print(f"С ценой: {with_price}/{len(enriched_products)}")
    print("\nГотово!")


if __name__ == "__main__":
    main()
