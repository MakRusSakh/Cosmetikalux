"""
Модуль 2: Загрузчик страниц товаров с retry и rate limiting.
Скачивает HTML страницы, сохраняет в кэш, отдаёт для парсинга.
"""

import os
import time
import hashlib
import requests
from typing import Optional

BASE_URL = "https://www.cosmetikalux.ru/products/"
CACHE_DIR = os.path.join(os.path.dirname(__file__), "../../data/html_cache")
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
}
MAX_RETRIES = 3
RETRY_DELAYS = [2, 4, 8]  # секунды
REQUEST_DELAY = 0.5  # пауза между запросами


def ensure_cache_dir():
    """Создаёт директорию кэша если не существует."""
    os.makedirs(CACHE_DIR, exist_ok=True)


def get_cache_path(product_id: str) -> str:
    """Путь к кэшированному HTML файлу."""
    return os.path.join(CACHE_DIR, f"{product_id}.html")


def is_cached(product_id: str) -> bool:
    """Проверяет есть ли страница в кэше."""
    path = get_cache_path(product_id)
    return os.path.exists(path) and os.path.getsize(path) > 1000


def load_from_cache(product_id: str) -> Optional[str]:
    """Загружает HTML из кэша."""
    path = get_cache_path(product_id)
    if is_cached(product_id):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return None


def save_to_cache(product_id: str, html: str):
    """Сохраняет HTML в кэш."""
    path = get_cache_path(product_id)
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)


def fetch_product_page(product_id: str, session: Optional[requests.Session] = None) -> Optional[str]:
    """
    Скачивает страницу товара. Сначала проверяет кэш.
    Возвращает HTML или None при ошибке.
    """
    # Проверяем кэш
    cached = load_from_cache(product_id)
    if cached:
        return cached

    url = f"{BASE_URL}{product_id}"
    s = session or requests.Session()
    s.headers.update(HEADERS)

    for attempt in range(MAX_RETRIES):
        try:
            resp = s.get(url, timeout=15)
            if resp.status_code == 200 and len(resp.text) > 1000:
                save_to_cache(product_id, resp.text)
                return resp.text
            if resp.status_code == 404:
                print(f"  [404] {product_id} — страница не найдена")
                return None
            print(f"  [{resp.status_code}] {product_id} — попытка {attempt + 1}")
        except requests.RequestException as e:
            print(f"  [ERR] {product_id} — {e} — попытка {attempt + 1}")

        if attempt < MAX_RETRIES - 1:
            time.sleep(RETRY_DELAYS[attempt])

    return None


def fetch_batch(product_ids: list[str], progress_every: int = 20) -> dict[str, Optional[str]]:
    """
    Скачивает пакет страниц с прогрессом.
    Возвращает {product_id: html_or_None}.
    """
    ensure_cache_dir()
    results = {}
    session = requests.Session()
    session.headers.update(HEADERS)

    total = len(product_ids)
    cached_count = 0
    fetched_count = 0
    failed_count = 0

    for i, pid in enumerate(product_ids):
        if is_cached(pid):
            results[pid] = load_from_cache(pid)
            cached_count += 1
        else:
            html = fetch_product_page(pid, session)
            results[pid] = html
            if html:
                fetched_count += 1
            else:
                failed_count += 1
            # Rate limiting — только для реальных запросов
            time.sleep(REQUEST_DELAY)

        # Прогресс
        done = i + 1
        if done % progress_every == 0 or done == total:
            print(
                f"[{done}/{total}] "
                f"кэш: {cached_count}, загружено: {fetched_count}, "
                f"ошибок: {failed_count}"
            )

    return results


def extract_product_ids_from_urls(urls: list[str]) -> list[str]:
    """Извлекает product_id из списка URL."""
    ids = []
    for url in urls:
        url = url.strip()
        if "/products/" in url:
            pid = url.split("/products/")[-1].strip("/")
            if pid.isdigit():
                ids.append(pid)
    return ids
