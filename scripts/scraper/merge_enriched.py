"""
Модуль: Слияние обогащённых данных в products.json.
Объединяет данные из incidecoder + yesstyle/japanesetaste.
"""

import json
import os
import glob

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
PRODUCTS_FILE = os.path.join(PROJECT_ROOT, "src/data/products.json")
ENRICHED_DIR = os.path.join(PROJECT_ROOT, "data/enriched")


def load_products() -> list[dict]:
    with open(PRODUCTS_FILE) as f:
        return json.load(f)


def load_enriched_files() -> dict:
    """Загружает все файлы обогащения и объединяет в один словарь."""
    merged = {}
    pattern = os.path.join(ENRICHED_DIR, "*.json")
    for filepath in sorted(glob.glob(pattern)):
        with open(filepath) as f:
            data = json.load(f)
        for pid, info in data.items():
            if info.get("status") == "found":
                if pid not in merged:
                    merged[pid] = info
                else:
                    # Объединяем: incidecoder имеет приоритет для INCI
                    existing = merged[pid]
                    if info.get("source") == "incidecoder":
                        merged[pid] = {**existing, **info}
                    elif not existing.get("description") and info.get("description"):
                        existing["description"] = info["description"]
    return merged


def merge_inci_into_product(product: dict, inci_data: dict) -> dict:
    """Обогащает товар данными INCI."""
    if inci_data.get("inci_list"):
        product["inciList"] = inci_data["inci_list"]
        # Обновляем ингредиенты если были пустые
        inci_ingredients = inci_data.get("inci_ingredients", [])
        if not product.get("ingredients") and inci_ingredients:
            # Берём первые 5 заметных ингредиентов (не воду/глицерин)
            skip = {"water", "aqua", "eau", "glycerin", "butylene glycol",
                    "1,2-hexanediol", "dipropylene glycol", "propanediol"}
            key = []
            for ingr in inci_ingredients:
                clean = ingr.strip().lower()
                if clean not in skip and len(clean) > 3:
                    key.append(ingr.strip())
                if len(key) >= 5:
                    break
            product["ingredients"] = key

    if inci_data.get("inci_name"):
        product["nameEnglish"] = inci_data["inci_name"]

    product["inciSource"] = inci_data.get("source", "")
    product["inciSourceUrl"] = inci_data.get("source_url", "")
    return product


def merge_general_into_product(product: dict, gen_data: dict) -> dict:
    """Обогащает товар общими данными (описание, ингредиенты)."""
    if gen_data.get("description") and len(gen_data["description"]) > len(product.get("description", "")):
        product["descriptionEnriched"] = gen_data["description"]

    if gen_data.get("ingredients_raw") and not product.get("inciList"):
        product["inciList"] = gen_data["ingredients_raw"]

    product["enrichSource"] = gen_data.get("source", "")
    product["enrichSourceUrl"] = gen_data.get("source_url", "")
    return product


def run_merge():
    """Главная функция: загрузка, слияние, сохранение."""
    products = load_products()
    enriched = load_enriched_files()

    print(f"Products: {len(products)}, Enriched records: {len(enriched)}")

    stats = {"inci_merged": 0, "general_merged": 0, "untouched": 0}

    for product in products:
        pid = product.get("externalId", "")
        if pid in enriched:
            data = enriched[pid]
            if data.get("source") == "incidecoder":
                merge_inci_into_product(product, data)
                stats["inci_merged"] += 1
            else:
                merge_general_into_product(product, data)
                stats["general_merged"] += 1
        else:
            stats["untouched"] += 1

    # Сохраняем
    with open(PRODUCTS_FILE, "w") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    size_kb = os.path.getsize(PRODUCTS_FILE) / 1024
    print(f"Merged: INCI={stats['inci_merged']}, "
          f"General={stats['general_merged']}, "
          f"Untouched={stats['untouched']}")
    print(f"Saved: {PRODUCTS_FILE} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    run_merge()
