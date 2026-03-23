#!/usr/bin/env python3
"""
Rename downloaded media files with proper transliteration.
Format: {product_id}_{first_3_words_transliterated}.jpg
"""
import os
import re
import csv
import json

DOWNLOAD_DIR = "/home/user/Cosmetikalux/media/downloaded"
LOG_FILE = "/home/user/Cosmetikalux/media/download_log.csv"
MAPPING_FILE = "/home/user/Cosmetikalux/media/downloaded/file_mapping.json"

# Transliteration map
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
    """Transliterate Russian text to Latin."""
    result = ''
    for c in text:
        result += TR.get(c, c)
    return result

def decode_unicode_escapes(text):
    """Decode \\uXXXX sequences in text."""
    try:
        return text.encode('utf-8').decode('unicode_escape').encode('latin1').decode('utf-8')
    except:
        try:
            return text.encode('raw_unicode_escape').decode('unicode_escape')
        except:
            return text

def get_first_3_words(name):
    """Extract first 3 meaningful words, transliterate, and clean."""
    decoded = decode_unicode_escapes(name)
    translit = transliterate(decoded)
    # Extract alphanumeric words
    words = re.findall(r'[A-Za-z0-9]+', translit)
    # Take first 3 words
    first3 = '_'.join(words[:3]).lower()
    return first3 if first3 else 'product'

def main():
    mapping = {}
    renamed = 0
    errors = 0

    # Read the log file
    if not os.path.exists(LOG_FILE):
        print("Log file not found!")
        return

    with open(LOG_FILE, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)  # skip header

        for row in reader:
            if len(row) < 4:
                continue

            prod_id, img_url, original_name, old_filename = row[0], row[1], row[2], row[3]

            # Generate proper transliterated name
            first3 = get_first_3_words(original_name)
            new_filename = f"{prod_id}_{first3}.jpg"

            old_path = os.path.join(DOWNLOAD_DIR, old_filename)
            new_path = os.path.join(DOWNLOAD_DIR, new_filename)

            # Handle duplicate names by adding suffix
            counter = 1
            while os.path.exists(new_path) and new_path != old_path:
                new_filename = f"{prod_id}_{first3}_{counter}.jpg"
                new_path = os.path.join(DOWNLOAD_DIR, new_filename)
                counter += 1

            if os.path.exists(old_path):
                if old_path != new_path:
                    os.rename(old_path, new_path)
                    renamed += 1

                decoded_name = decode_unicode_escapes(original_name)
                mapping[new_filename] = {
                    "product_id": prod_id,
                    "original_name": decoded_name,
                    "image_url": img_url,
                    "first_3_words": first3
                }
            else:
                errors += 1

    # Save mapping
    with open(MAPPING_FILE, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)

    print(f"Renamed: {renamed} files")
    print(f"Errors: {errors}")
    print(f"Total in mapping: {len(mapping)}")
    print(f"Mapping saved to: {MAPPING_FILE}")

if __name__ == '__main__':
    main()
