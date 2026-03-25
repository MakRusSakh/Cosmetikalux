"""
Модуль 1: Парсер HTML-страницы товара cosmetikalux.ru
Извлекает: название, цену, описание, состав, изображения, характеристики.
"""

import re
from bs4 import BeautifulSoup
from typing import Optional


def parse_product_page(html: str, product_url: str) -> dict:
    """Парсит HTML страницы товара и возвращает словарь с данными."""
    soup = BeautifulSoup(html, "lxml")

    return {
        "url": product_url,
        "external_id": _extract_external_id(product_url),
        "name": _extract_name(soup),
        "price": _extract_price(soup),
        "old_price": _extract_old_price(soup),
        "description": _extract_description(soup),
        "ingredients": _extract_ingredients(soup),
        "usage": _extract_usage(soup),
        "volume": _extract_volume(soup),
        "images": _extract_images(soup),
        "og_image": _extract_og_image(soup),
        "og_description": _extract_og_description(soup),
    }


def _extract_external_id(url: str) -> str:
    """Извлекает product_id из URL."""
    match = re.search(r"/products/(\d+)", url)
    return match.group(1) if match else ""


def _extract_name(soup: BeautifulSoup) -> str:
    """Название из .product__name или og:title."""
    el = soup.find(class_="product__name")
    if el:
        return el.get_text(strip=True)
    meta = soup.find("meta", property="og:title")
    if meta:
        return meta.get("content", "").strip()
    h1 = soup.find("h1")
    return h1.get_text(strip=True) if h1 else ""


def _extract_price(soup: BeautifulSoup) -> Optional[float]:
    """Цена из data-cost атрибута."""
    el = soup.find("span", class_="product-price-data")
    if el and el.get("data-cost"):
        try:
            return float(el["data-cost"])
        except ValueError:
            pass
    return None


def _extract_old_price(soup: BeautifulSoup) -> Optional[float]:
    """Старая цена (зачёркнутая)."""
    el = soup.find(class_=re.compile(r"old.?price|price.?old|crossed"))
    if el:
        text = re.sub(r"[^\d.,]", "", el.get_text())
        text = text.replace(",", ".")
        try:
            return float(text)
        except ValueError:
            pass
    # Поиск через <s> или <del> рядом с ценой
    for tag in soup.find_all(["s", "del"]):
        text = tag.get_text(strip=True)
        nums = re.sub(r"[^\d]", "", text)
        if nums and len(nums) >= 2:
            try:
                return float(nums)
            except ValueError:
                pass
    return None


def _extract_description(soup: BeautifulSoup) -> str:
    """Полное описание товара из параграфов p.p1."""
    paragraphs = soup.find_all("p", class_="p1")
    desc_parts = []
    for p in paragraphs:
        text = p.get_text(strip=True)
        # Пропускаем строки про способ применения и состав
        if text.lower().startswith("способ применения"):
            continue
        if text.startswith("•"):
            continue
        if text.lower().startswith("основные компоненты"):
            continue
        if text.lower().startswith("состав"):
            continue
        # Пропускаем слишком короткие (типа "Объём: 50 мл")
        if len(text) > 30:
            desc_parts.append(text)
    if not desc_parts:
        meta = soup.find("meta", property="og:description")
        if meta:
            desc_parts.append(meta.get("content", "").strip())
    return "\n\n".join(desc_parts)


def _extract_ingredients(soup: BeautifulSoup) -> list[str]:
    """Ключевые ингредиенты из списка с • маркерами."""
    ingredients = []
    in_ingredients_section = False
    for p in soup.find_all("p", class_="p1"):
        text = p.get_text(strip=True)
        if "компонент" in text.lower() or "состав" in text.lower():
            in_ingredients_section = True
            continue
        if in_ingredients_section and text.startswith("•"):
            ingredient = text.lstrip("•").strip()
            if ingredient:
                ingredients.append(ingredient)
        elif in_ingredients_section and not text.startswith("•"):
            in_ingredients_section = False
    return ingredients


def _extract_usage(soup: BeautifulSoup) -> str:
    """Способ применения."""
    for p in soup.find_all("p", class_="p1"):
        text = p.get_text(strip=True)
        if text.lower().startswith("способ применения"):
            # Убираем префикс
            clean = re.sub(r"^способ применения\s*:?\s*", "", text, flags=re.I)
            return clean
    return ""


def _extract_volume(soup: BeautifulSoup) -> str:
    """Объём/вес из описания или og:description."""
    # Ищем в p.p1 типа "Объём: 50 мл"
    for p in soup.find_all("p", class_="p1"):
        text = p.get_text(strip=True)
        match = re.match(r"^Объ[её]м\s*:?\s*(.+)$", text, re.I)
        if match:
            return match.group(1).strip()
    # Ищем в og:description
    meta = soup.find("meta", property="og:description")
    if meta:
        content = meta.get("content", "")
        match = re.search(r"(\d+\s*(?:мл|ml|г|g|шт|pcs))", content, re.I)
        if match:
            return match.group(1).strip()
    # Ищем в названии
    name_el = soup.find(class_="product__name")
    if name_el:
        name = name_el.get_text(strip=True)
        match = re.search(r"\(?\s*(\d+\s*(?:мл|ml|г|g|шт))\s*\)?", name, re.I)
        if match:
            return match.group(1).strip()
    return ""


def _extract_images(soup: BeautifulSoup) -> list[str]:
    """Все URL изображений товара."""
    images = []
    seen = set()
    for img in soup.find_all("img"):
        src = img.get("src", "") or img.get("data-src", "")
        if "siteapi" in src and "logo" not in src:
            # Убираем fit-in ограничения для получения полного размера
            full_src = re.sub(r"/fit-in/\d+x\d*/", "/fit-in/1024x1024/", src)
            if not full_src.startswith("http"):
                full_src = "https:" + full_src
            if full_src not in seen:
                seen.add(full_src)
                images.append(full_src)
    return images


def _extract_og_image(soup: BeautifulSoup) -> str:
    """OG-изображение (основное фото)."""
    meta = soup.find("meta", property="og:image")
    if meta:
        url = meta.get("content", "")
        if not url.startswith("http"):
            url = "https:" + url
        return url
    return ""


def _extract_og_description(soup: BeautifulSoup) -> str:
    """OG-описание (краткое)."""
    meta = soup.find("meta", property="og:description")
    return meta.get("content", "").strip() if meta else ""
