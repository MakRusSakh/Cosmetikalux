#!/bin/bash
# Script to download all product images from cosmetikalux.ru
# Names: {product_id}_{first_3_words_transliterated}.jpg

OUTDIR="/home/user/Cosmetikalux/media/downloaded"
LOGFILE="/home/user/Cosmetikalux/media/download_log.csv"
mkdir -p "$OUTDIR"

# CSV header
echo "product_id,image_url,original_name,filename" > "$LOGFILE"

# Transliteration function (Russian to Latin)
transliterate() {
    echo "$1" | python3 -c "
import sys
text = sys.stdin.read().strip()
# Decode unicode escapes if present
try:
    text = text.encode('utf-8').decode('unicode_escape').encode('latin1').decode('utf-8')
except:
    pass

tr = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh',
    'з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o',
    'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts',
    'ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
    'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh',
    'З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O',
    'П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'Kh','Ц':'Ts',
    'Ч':'Ch','Ш':'Sh','Щ':'Shch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya'
}
result = ''
for c in text:
    result += tr.get(c, c)

# Get first 3 words, clean non-alphanumeric
import re
words = re.findall(r'[A-Za-z0-9]+', result)
first3 = '_'.join(words[:3]).lower()
print(first3)
"
}

# Read all product URLs
URLS_FILE="/home/user/Cosmetikalux/site_product_cards.txt"
PRODUCT_URLS=$(grep -oP 'cosmetikalux\.ru/products/\K[0-9]+' "$URLS_FILE")
TOTAL=$(echo "$PRODUCT_URLS" | wc -l)
COUNT=0
FAILED=0

echo "Starting download of $TOTAL product images..."

for PROD_ID in $PRODUCT_URLS; do
    COUNT=$((COUNT + 1))

    # Fetch product page
    PAGE=$(curl -s --connect-timeout 10 --max-time 15 "https://www.cosmetikalux.ru/products/$PROD_ID" 2>/dev/null)

    if [ -z "$PAGE" ]; then
        echo "[$COUNT/$TOTAL] SKIP $PROD_ID - page fetch failed"
        FAILED=$((FAILED + 1))
        continue
    fi

    # Extract image URL (1024x768 version)
    IMG_URL=$(echo "$PAGE" | grep -oP '//i\.siteapi\.org/[^"'"'"'\s]+/fit-in/1024x768/[^"'"'"'\s]+' | head -1)

    if [ -z "$IMG_URL" ]; then
        # Try any image URL
        IMG_URL=$(echo "$PAGE" | grep -oP '//i\.siteapi\.org/[^"'"'"'\s]+/img/[^"'"'"'\s]+' | head -1)
    fi

    if [ -z "$IMG_URL" ]; then
        echo "[$COUNT/$TOTAL] SKIP $PROD_ID - no image found"
        FAILED=$((FAILED + 1))
        continue
    fi

    # Extract product name (from JSON-LD or structured data)
    TITLE=$(echo "$PAGE" | grep -oP '"name"\s*:\s*"\K[^"]+' | head -1)

    # Transliterate first 3 words
    TRANSLIT=$(transliterate "$TITLE")

    if [ -z "$TRANSLIT" ] || [ "$TRANSLIT" = "" ]; then
        TRANSLIT="product"
    fi

    FILENAME="${PROD_ID}_${TRANSLIT}.jpg"

    # Download image
    curl -s --connect-timeout 10 --max-time 20 -o "$OUTDIR/$FILENAME" "https:$IMG_URL" 2>/dev/null

    # Verify it's an image
    FTYPE=$(file -b "$OUTDIR/$FILENAME" 2>/dev/null)
    if echo "$FTYPE" | grep -qiE "image|jpeg|png|webp|gif"; then
        FSIZE=$(stat -f%z "$OUTDIR/$FILENAME" 2>/dev/null || stat -c%s "$OUTDIR/$FILENAME" 2>/dev/null)
        echo "[$COUNT/$TOTAL] OK $FILENAME (${FSIZE}b)"
        echo "$PROD_ID,https:$IMG_URL,$TITLE,$FILENAME" >> "$LOGFILE"
    else
        echo "[$COUNT/$TOTAL] FAIL $PROD_ID - not an image ($FTYPE)"
        rm -f "$OUTDIR/$FILENAME"
        FAILED=$((FAILED + 1))
    fi

    # Small delay to not overload the server
    if [ $((COUNT % 10)) -eq 0 ]; then
        sleep 0.5
    fi
done

echo ""
echo "=== DONE ==="
echo "Downloaded: $((COUNT - FAILED)) / $TOTAL"
echo "Failed: $FAILED"
echo "Files saved to: $OUTDIR"
echo "Log saved to: $LOGFILE"
