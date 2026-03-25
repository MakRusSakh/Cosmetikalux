"""
Модуль 3: Обогащение данных товаров.
Добавляет: slug, skinTypes, routineStep, keyIngredients, rating (generated).
"""

import re
import random
import hashlib
from transliterate import translit

# Маппинг подкатегорий → шаг K-beauty рутины (1-9)
ROUTINE_MAP = {
    "kremy": 7,           # Увлажнение
    "glaza": 7,           # Уход за зоной глаз
    "syvorotki": 5,       # Сыворотки
    "tonery": 3,          # Тонер
    "sheya": 8,           # Шея = после увлажнения
    "spf": 9,             # SPF последний шаг
    "kremy-dlya-ruk": None,
    "maski-dlya-ruk": None,
    "instrumenty": None,
}

ROUTINE_NAMES = {
    1: "Очищение маслом",
    2: "Пенка для умывания",
    3: "Тонер",
    4: "Эссенция",
    5: "Сыворотка",
    6: "Маска",
    7: "Увлажнение",
    8: "Крем для век/шеи",
    9: "SPF-защита",
}

# Ключевые слова → тип кожи
SKIN_TYPE_KEYWORDS = {
    "dry": ["сух", "питат", "увлажн", "moisture", "hydrat", "nourish", "barrier"],
    "sensitive": ["чувствит", "sensitive", "успокаив", "calm", "cica", "centella", "пантенол"],
    "oily": ["жирн", "матир", "oil control", "pore", "себум", "zero pore"],
    "combination": ["комби", "combinat", "баланс"],
    "normal": ["для всех типов", "all skin", "универсал"],
    "acne": ["проблемн", "акне", "acne", "teatree", "blemish", "anti-blemish"],
    "aging": ["антивозраст", "anti-age", "anti-wrinkle", "морщин", "лифтинг", "retinol", "collagen"],
}

# Подкатегория → slug категории
SUBCATEGORY_TO_CATEGORY_SLUG = {
    "Кремы и эмульсии": "uhod-za-litsom",
    "Кремы для век и патчи": "uhod-za-litsom",
    "Сыворотки и ампулы": "uhod-za-litsom",
    "Тонеры и лосьоны": "uhod-za-litsom",
    "Кремы для шеи": "uhod-za-litsom",
    "SPF-защита": "uhod-za-litsom",
    "Кремы для рук": "uhod-za-telom",
    "Маски для рук": "uhod-za-telom",
    "Инструменты для ухода": "uhod-za-telom",
    "Витамины и минералы": "zdorovye",
    "Для женского здоровья": "zdorovye",
    "Для ЖКТ и пищеварения": "zdorovye",
    "Для суставов и костей": "zdorovye",
    "Для печени": "zdorovye",
    "Для иммунитета и при простуде": "zdorovye",
    "Для мозга, сна и от стресса": "zdorovye",
    "Для красоты и молодости": "zdorovye",
    "Для зрения": "zdorovye",
    "Для сердца и сосудов": "zdorovye",
    "Мочеполовая система": "zdorovye",
    "Зубные пасты": "gigiena-rta",
    "Зубные щётки": "gigiena-rta",
    "Зубная нить и ёршики": "gigiena-rta",
    "Ополаскиватели": "gigiena-rta",
    "Лечебные мази и кремы": "lechebnye",
    "Обезболивающие пластыри и мази": "lechebnye",
    "Пластыри для ран и жаропонижающие": "lechebnye",
    "От укачивания": "lechebnye",
    "Чай и кофе": "produkty-raznoe",
    "Бытовая химия": "produkty-raznoe",
    "Аксессуары": "produkty-raznoe",
}

COUNTRY_CODES = {
    "Корея": "KR", "Япония": "JP", "Китай": "CN",
    "США": "US", "Италия": "IT", "Таиланд": "TH",
}


def make_slug(name: str, brand: str = "") -> str:
    """Генерирует URL-slug из названия товара."""
    text = f"{brand} {name}" if brand else name
    # Убираем скобки и спецсимволы
    text = re.sub(r"[()[\]{}]", "", text)
    try:
        text = translit(text, "ru", reversed=True)
    except Exception:
        pass
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text[:80]


def detect_skin_types(name: str, description: str) -> list[str]:
    """Определяет типы кожи по тексту."""
    combined = f"{name} {description}".lower()
    types = []
    for skin_type, keywords in SKIN_TYPE_KEYWORDS.items():
        if any(kw in combined for kw in keywords):
            types.append(skin_type)
    return types if types else ["normal"]


def detect_routine_step(subcategory: str, name: str) -> dict | None:
    """Определяет шаг K-beauty рутины."""
    # По подкатегории
    for subcat_key, step in ROUTINE_MAP.items():
        if subcat_key in subcategory.lower() and step:
            return {"step": step, "name": ROUTINE_NAMES.get(step, "")}
    # По названию
    name_lower = name.lower()
    if any(w in name_lower for w in ["тонер", "lotion", "лосьон", "эмульси"]):
        return {"step": 3, "name": ROUTINE_NAMES[3]}
    if any(w in name_lower for w in ["сыворотк", "serum", "ампул", "ampoule"]):
        return {"step": 5, "name": ROUTINE_NAMES[5]}
    if any(w in name_lower for w in ["spf", "солнцезащ", "sunscreen", "sun "]):
        return {"step": 9, "name": ROUTINE_NAMES[9]}
    if any(w in name_lower for w in ["патч", "patch", "mask", "маск"]):
        return {"step": 6, "name": ROUTINE_NAMES[6]}
    return None


def generate_rating(product_id: str) -> dict:
    """Генерирует детерминированный фейковый рейтинг на основе product_id."""
    seed = int(hashlib.md5(product_id.encode()).hexdigest()[:8], 16)
    rng = random.Random(seed)
    score = round(rng.uniform(3.8, 4.9), 1)
    count = rng.randint(8, 280)
    purchase_count = rng.randint(30, 500)
    return {
        "score": score,
        "count": count,
        "source": "generated",
        "purchaseCount": purchase_count,
    }


def compute_price_per_unit(price: float | None, volume: str) -> float | None:
    """Вычисляет цену за единицу (₽/мл или ₽/шт)."""
    if not price or not volume:
        return None
    match = re.search(r"(\d+)\s*(мл|ml|г|g|шт|pcs)", volume, re.I)
    if match:
        amount = int(match.group(1))
        if amount > 0:
            return round(price / amount, 1)
    return None


def enrich_product(parsed: dict, csv_row: dict) -> dict:
    """Обогащает спарсенные данные мета-информацией."""
    name = parsed.get("name") or csv_row.get("name", "")
    brand = csv_row.get("brand", "").strip()
    description = parsed.get("description", "")
    price = parsed.get("price") or _parse_csv_price(csv_row.get("price"))
    volume = parsed.get("volume") or csv_row.get("unit", "")
    subcategory = csv_row.get("subcategory", "")
    country = csv_row.get("country", "").strip()
    external_id = parsed.get("external_id", "")

    rating_data = generate_rating(external_id)

    return {
        "id": f"prod_{external_id}",
        "externalId": external_id,
        "slug": make_slug(name, brand),
        "name": name,
        "brand": brand,
        "brandSlug": make_slug(brand) if brand else "",
        "price": price,
        "oldPrice": parsed.get("old_price"),
        "unit": volume,
        "pricePerUnit": compute_price_per_unit(price, volume),
        "category": csv_row.get("category", ""),
        "categorySlug": SUBCATEGORY_TO_CATEGORY_SLUG.get(subcategory, ""),
        "subcategory": subcategory,
        "country": country,
        "countryCode": COUNTRY_CODES.get(country, ""),
        "description": description,
        "ingredients": parsed.get("ingredients", []),
        "usage": parsed.get("usage", ""),
        "skinTypes": detect_skin_types(name, description),
        "routineStep": detect_routine_step(subcategory, name),
        "images": parsed.get("images", []),
        "ogImage": parsed.get("og_image", ""),
        "tags": csv_row.get("tags", "").split(",") if csv_row.get("tags") else [],
        "rating": {
            "score": rating_data["score"],
            "count": rating_data["count"],
            "source": "generated",
        },
        "purchaseCount": rating_data["purchaseCount"],
        "isActive": True,
    }


def _parse_csv_price(val) -> float | None:
    """Парсит цену из CSV строки."""
    if not val:
        return None
    try:
        return float(str(val).replace(",", "").replace(" ", ""))
    except ValueError:
        return None
