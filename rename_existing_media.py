#!/usr/bin/env python3
"""
Rename existing media files in hero/, ingredients/, products/, banners/
with proper transliterated names and IDs.
"""
import os
import re
import json

TR = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh',
    'з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o',
    'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts',
    'ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
    'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh',
    'З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O',
    'П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'Kh','Ц':'Ts',
    'Ч':'Ch','Ш':'Sh','Щ':'Shch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya'
}

def transliterate(text):
    return ''.join(TR.get(c, c) for c in text)

def make_slug(name):
    """Create slug from name: first 3 words transliterated."""
    translit = transliterate(name)
    words = re.findall(r'[A-Za-z0-9]+', translit)
    return '_'.join(words[:3]).lower() if words else 'unnamed'

MEDIA_BASE = "/home/user/Cosmetikalux/media"

# Define existing files with their categories and IDs
existing_files = {
    # Hero images (concern/category images)
    "hero": {
        "Фото 1.png": ("hero_001", "Фото 1"),
        "Anti-age .png": ("hero_002", "Anti-age"),
        "Увлажнение.png": ("hero_003", "Увлажнение"),
        "Против акне.png": ("hero_004", "Против акне"),
        "Чистота пор .png": ("hero_005", "Чистота пор"),
        "SPF-защита.png": ("hero_006", "SPF-защита"),
    },
    # Ingredient images
    "ingredients": {
        "Гиалуроновая кислота.png": ("ingr_001", "Гиалуроновая кислота"),
        "Муцин улитки.png": ("ingr_002", "Муцин улитки"),
        "Ниацинамид (Vitamin B3).png": ("ingr_003", "Ниацинамид Vitamin B3"),
        "Центелла азиатика.png": ("ingr_004", "Центелла азиатика"),
    },
    # Product images
    "products": {
        "JMsolution Гидрогелевые патчи с протеинами шёлка 60 шт.png": ("prod_001", "JMsolution Гидрогелевые патчи"),
        "Sum37 Secret Eye Cream.png": ("prod_002", "Sum37 Secret Eye"),
        "WellDerma Eye Mask Warming — Согревающая и расслабляющая маска для глаз 1 шт.png": ("prod_003", "WellDerma Eye Mask"),
        "Крем для век с ретинолом.png": ("prod_004", "Крем для век"),
        "Липосомная омолаживающая сыворотка для век Beauty (30мл).png": ("prod_005", "Липосомная омолаживающая сыворотка"),
        "Осветляющий крем для век с транексамовой кислотой и глутатионом (30мл).png": ("prod_006", "Осветляющий крем для"),
        "Разглаживающий крем для кожи вокруг глаз с коллагеном TENZERO Moisture Collagen Eye Cream 40 мл.png": ("prod_007", "Разглаживающий крем для"),
    },
    # Banner images
    "banners": {
        "Весенняя забота о коже.png": ("banner_001", "Весенняя забота о"),
    },
}

# Also handle root-level media files
root_files = {
    "Anti-age .png": ("hero_002", "Anti-age"),
    "JMsolution Гидрогелевые патчи с протеинами шёлка 60 шт.png": ("prod_001", "JMsolution Гидрогелевые патчи"),
    "SPF-защита.png": ("hero_006", "SPF-защита"),
    "Sum37 Secret Eye Cream.png": ("prod_002", "Sum37 Secret Eye"),
    "WellDerma Eye Mask Warming — Согревающая и расслабляющая маска для глаз 1 шт.png": ("prod_003", "WellDerma Eye Mask"),
    "Весенняя забота о коже.png": ("banner_001", "Весенняя забота о"),
    "Гиалуроновая кислота.png": ("ingr_001", "Гиалуроновая кислота"),
    "Крем для век с ретинолом.png": ("prod_004", "Крем для век"),
    "Липосомная омолаживающая сыворотка для век Beauty (30мл).png": ("prod_005", "Липосомная омолаживающая сыворотка"),
    "Муцин улитки.png": ("ingr_002", "Муцин улитки"),
    "Ниацинамид (Vitamin B3).png": ("ingr_003", "Ниацинамид Vitamin B3"),
    "Осветляющий крем для век с транексамовой кислотой и глутатионом (30мл).png": ("prod_006", "Осветляющий крем для"),
    "Против акне.png": ("hero_004", "Против акне"),
    "Разглаживающий крем для кожи вокруг глаз с коллагеном TENZERO Moisture Collagen Eye Cream 40 мл.png": ("prod_007", "Разглаживающий крем для"),
    "Увлажнение.png": ("hero_003", "Увлажнение"),
    "Фото 1.png": ("hero_001", "Фото 1"),
    "Центелла азиатика.png": ("ingr_004", "Центелла азиатика"),
    "Чистота пор .png": ("hero_005", "Чистота пор"),
}

mapping = {}
renamed_count = 0

# Process subdirectory files
for subdir, files in existing_files.items():
    dir_path = os.path.join(MEDIA_BASE, subdir)
    for old_name, (file_id, display_name) in files.items():
        old_path = os.path.join(dir_path, old_name)
        if not os.path.exists(old_path):
            print(f"  SKIP (not found): {old_path}")
            continue

        slug = make_slug(display_name)
        ext = os.path.splitext(old_name)[1]
        new_name = f"{file_id}_{slug}{ext}"
        new_path = os.path.join(dir_path, new_name)

        os.rename(old_path, new_path)
        print(f"  {subdir}/{old_name} -> {new_name}")
        renamed_count += 1

        mapping[new_name] = {
            "id": file_id,
            "category": subdir,
            "original_name": old_name,
            "display_name": display_name,
            "slug": slug
        }

# Process root-level files
for old_name, (file_id, display_name) in root_files.items():
    old_path = os.path.join(MEDIA_BASE, old_name)
    if not os.path.exists(old_path):
        continue

    slug = make_slug(display_name)
    ext = os.path.splitext(old_name)[1]
    new_name = f"{file_id}_{slug}{ext}"
    new_path = os.path.join(MEDIA_BASE, new_name)

    os.rename(old_path, new_path)
    print(f"  root/{old_name} -> {new_name}")
    renamed_count += 1

    mapping[new_name] = {
        "id": file_id,
        "category": "root",
        "original_name": old_name,
        "display_name": display_name,
        "slug": slug
    }

# Save mapping
mapping_path = os.path.join(MEDIA_BASE, "existing_media_mapping.json")
with open(mapping_path, 'w', encoding='utf-8') as f:
    json.dump(mapping, f, ensure_ascii=False, indent=2)

print(f"\nRenamed: {renamed_count} files")
print(f"Mapping saved to: {mapping_path}")
