#!/usr/bin/env python3
import csv, re

SRC = '/home/user/Cosmetikalux/site_product_cards.txt'
OUT = '/home/user/Cosmetikalux/products_tagged.csv'

COUNTRY = {}
for c, brands in {
    'Япония': ['DHC','FANCL','ORIHIRO','Kobayashi','Lion','KAO','Rohto','Santen','SATO','Pigeon','EBISU','Taisho',
               'Fine Japan','FINE JAPAN','FUJIMA','Seedcoms','Nature Made','WAKODO','Asahi','Mentholatum','NOGUCHI',
               'Showa Siko','Nissan','Unimat','Yuwa','Kowa','Ohta','JAY','HARELU','Holidays','Vita Labs','WIBI',
               'Hanmi','Lipton','UCC','Seiko','MJB','AVANCE','AGF','Hap Ycon','ЖИВАЯ КОЖА','Tamsaŭ','IYA',
               'Boukoren','Aneron','Travelop','Bonaring','IIOVER','PIP','UNIMAT','Sante',
               'Panshiron','Biofermin','Chikunain','Dear-Natura'],
    'Корея': ['Round Lab','Dr.Jart+','Torriden','Manyo','MANYO','SKIN1004','Medicube','AHC','SULWHASOO','OHUI',
              'HERA','Anua','Heimish','AXIS-Y','Celimax','CELIMAX','Bueno','Lagom','CKD','COSRX','Beauty of Joseon',
              'Dr.Ceuracle','Abib','JMsolution','JMSolution','Medi-Peel','BeauGreen','Beauugreen','BeauuGreen',
              'Wonjin','Neogen','Isntree','ILLIYOON','KUNDAL','Mukunghwa','Mashimaro','Misorang','MISSHA',
              'PrettySkin','FarmStay','Farmstay','JIGOTT','Jigott','EKEL','Medi Flower','BellmonaBio','Coreana',
              'WellDerma','Singi','Right Life','Guanbo','Olive Deco','Ayoume','Sandokkaebi','Some By Mi',
              'VT Cosmetics','Vijam','By Wishtrend','Nutri d-day','Nutri D-Day','Nutri D-day','TENZERO','Tenzero',
              'Christian Dean','Meditime','MEDITIME','Solomeya','Eye Charm','Medi-Peel',"d'Alba",
              'Su:m37','SU:M37','The History of Whoo','The Saga','Mezzo','LACTO-FIT','Nutri'],
    'Италия': ['Biorepair','Kamill'],
    'Таиланд': ['Green Herb','Peppermint Field'],
    'Китай': ['Duba','MIAO YAO'],
    'США': ['Guess','MakeUp','Feather PIANY','Air Doctor'],
}.items():
    for b in brands:
        COUNTRY[b.lower()] = c

def get_country(brand, name=''):
    bl = brand.lower()
    nl = name.lower()
    # Check brand field first
    for key, c in COUNTRY.items():
        if key in bl or (bl and bl in key): return c
    # Check product name for brand mentions
    for key, c in COUNTRY.items():
        if len(key) > 2 and key in nl: return c
    # Fallback: Korean cosmetics keywords in name
    if re.search(r'cream|крем|emulsion|эмульси|serum|сыворотк|patch|патчи|lotion|лосьон|moisturiz|gel.cream|tone.up|brighten|barrier|firming|calming|soothing|hydrogel|sleeping|ampoule|ампул', nl):
        return 'Корея'
    return ''

def classify(name, brand):
    n = (name + ' ' + brand).lower()
    # Skip price-only / unnamed stubs — classify by brand context
    if re.match(r'^(price|price range|product \(|unnamed|- price)', n):
        # Try brand-based classification
        if re.search(r'sante|rohto|lion|santen|wibi|dhc.*bilberr', n): return 'Здоровье и БАДы', 'Для зрения'
        if re.search(r'dhc|orihiro|fancl|nutri|fine japan|unimat|showa', n): return 'Здоровье и БАДы', 'Витамины и минералы'
        return 'Продукты и разное', 'Аксессуары'
    # Brand-only stubs (from "- Brand: X" lines)
    stripped = re.sub(r'\s+', ' ', n).strip()
    if stripped in ['yuwa yuwa','nutri d-day premium nutri d-day premium','nutri-d day nutri-d day',
                    'nutri d-day nutri d-day','unimat riken zoo series unimat riken zoo series',
                    'unimat riken zoo unimat riken zoo']:
        return 'Здоровье и БАДы', 'Витамины и минералы'
    if stripped in ['lion lion']: return 'Здоровье и БАДы', 'Для зрения'
    if stripped in ['showa siko showa siko']: return 'Здоровье и БАДы', 'Для зрения'
    # Лечебные средства
    if re.search(r'ointment|мазь|antifungal|противогриб|psoriasis|псориаз|dermatit|дерматит|scar|рубц|шрам|stomatit|стоматит|papilloma|бородавк|insect bite|укус.*(комар|насеком)|bandage|бинт|living skin|живая кожа', n):
        return 'Лечебные средства', 'Лечебные мази и кремы'
    if re.search(r'пластырь.*(ран|женьшен)|cooling (gel |)sheet|cooling.*(patch|пластырь)|охлаждающ|жаропонижающ|cool pak|l\.mo soft|от температур', n):
        return 'Лечебные средства', 'Пластыри'
    if re.search(r'motion sickness|укачиван|bonaring|aneron|travelop', n):
        return 'Лечебные средства', 'От укачивания'
    # Гигиена полости рта
    if re.search(r'зубн\w+ паст|toothpaste|sumigaki.*паст|xyldent.*паст|clear clean|vitamin health clinic зубн|sumigaki отбелив', n):
        return 'Гигиена полости рта', 'Зубные пасты'
    if re.search(r'зубн\w+ щ[её]тк|toothbrush|брекет', n):
        return 'Гигиена полости рта', 'Зубные щётки'
    if re.search(r'floss|зубн\w+ нит|[ёе]ршик|флосспик', n):
        return 'Гигиена полости рта', 'Зубная нить и ёршики'
    if re.search(r'nonio|mouthwash|ополаскиват|fafa make', n):
        return 'Гигиена полости рта', 'Ополаскиватели'
    if re.search(r'xyldent|sumigaki', n):
        return 'Гигиена полости рта', 'Зубные пасты'
    # Уход за телом
    if re.search(r'hand cream|hand.*(крем|cream)|крем для рук', n) and not re.search(r'nail', n):
        return 'Уход за телом', 'Кремы для рук'
    if re.search(r'hand (pack|mask)|маск\w* для рук|hand care pack|mask hand', n):
        return 'Уход за телом', 'Маски для рук'
    if re.search(r'gua sha|sponge|pore extractor|razor|powder puff|comb|brush(?!.*tooth)|nail|cuticle|travel bottle', n):
        return 'Уход за телом', 'Аксессуары для ухода'
    # Здоровье subcategories
    if re.search(r'isoflavone|изофлавон|гранат.*женск|pregnan|беременн|harmony|мать жизни|женщин|women|женск|комплекс.*на.*трав.*inochi|шофусан', n):
        return 'Здоровье и БАДы', 'Для женского здоровья'
    if re.search(r'probiotic|пробиотик|stomach|желуд|biofermin|lacto|ohta.isan|guard.*желуд|\bguard\b.*табл|bifidobact|бифидобакт|laxative|слабительн|пищевар|изжог|жкт|панширон|panshiron|lactis|spore.*lactic', n) and not re.search(r'cream|крем|\d+ml|emulsion|serum|patch|skin\b', n):
        return 'Здоровье и БАДы', 'Для ЖКТ и пищеварения'
    if re.search(r'glucosamin|глюкозамин|chondroitin|хондроитин|\bmsm\b|calcium|кальци[йя]|bone|кост|gh creation|рост\b|ichirokujuni|магний|magnesium', n):
        return 'Здоровье и БАДы', 'Для суставов и костей'
    if re.search(r'liver|печен|curcum|куркум|corbicula|корбикул|liverurso|лецитин|lecithin', n):
        return 'Здоровье и БАДы', 'Для печени'
    if re.search(r'\bcold\b|простуд|throat|горл|nasal|назал|\bnose\b|насморк|inhaler|ингалятор|air doctor|virus|chikunain|dasmoke|бронх|nodonuru|rhinit|sinusit|от комар|спрей.*дет', n):
        return 'Здоровье и БАДы', 'Для иммунитета и при простуде'
    if re.search(r'ginkgo|гинкго|biloba|brain|мозг|memory|памят|sleep|сон\b|stress|стресс|\bgaba\b|зверобо|pansedan|панседан|успокоит', n):
        return 'Здоровье и БАДы', 'Для мозга, сна и стресса'
    if re.search(r'nattokinase|наттокиназа|\bdha\b|\bepa\b|cholesterol|холестерин|давлен|blood pressure|сосуд|ансерин', n) and not re.search(r'беременн', n):
        return 'Здоровье и БАДы', 'Для сердца и сосудов'
    if re.search(r'collagen|коллаген|placenta|плацент|resveratrol|ресвератрол|astaxanthin|астаксантин|coq10|коэнзим|biotin|биотин|volume top|волос|deacnea|здоров\w+ кож', n) and not re.search(r'eye|neck|cream|patch|hand|jelly|lifting|peptide 9|retino|emulsion|serum|intensive', n):
        return 'Здоровье и БАДы', 'Для красоты и молодости'
    if re.search(r'eye drop|капли для глаз|blueberr|черник|bilberr|lutein|лютеин|sharp vision|lens wipe|megane|sante fx|sante 40|rohto.*drop|lion smile|rohto z|rohto v |rohto gold|wibi eye', n):
        return 'Здоровье и БАДы', 'Для зрения'
    if re.search(r'cystit|цистит|boukoren|hemorrhoid|геморро|свечи|suppositor|zassle|zassuru', n):
        return 'Здоровье и БАДы', 'Мочеполовая система'
    if re.search(r'pomegranate.*premium|гранат', n):
        return 'Здоровье и БАДы', 'Для женского здоровья'
    if re.search(r'vitamin|витамин|supplement|бад\b|extract|экстракт|\bacid\b|кислот\w|complex|комплекс|capsul|капсул|tablet|omega|enzyme|folic|фолиев|chlorella|хлорелл|\biron\b|железо|\bzinc\b|цинк|мультивитамин|донник|овощ|йод|аминокислот|герпес|аллерг|\bмака\b|\bmaca\b|palmetto|пальм|oyster|устриц|turtle|уксус|чеснок|перилл|aodziru|barley|fight комплекс|full of energy|mudzu|donnik', n):
        return 'Здоровье и БАДы', 'Витамины и минералы'
    # Уход за лицом
    if re.search(r'eye cream|eye serum|eye patch|патчи|patch.*eye|eye.*patch|для век|для глаз|eyecream|eye zone|eye mask|warming.*eye|hydrogel.*patch|patch.*hydrogel|powder patch|cellmazing(?!.*cream)', n) and not re.search(r'eye drop|капли|eyelid', n):
        return 'Уход за лицом', 'Кремы для век и патчи'
    if re.search(r'neck cream|крем.*шеи|для шеи|guasha neck', n):
        return 'Уход за лицом', 'Кремы для шеи'
    if re.search(r'\bspf\b|\buv\b|sun protect|солнцезащит', n):
        return 'Уход за лицом', 'SPF-защита'
    if re.search(r'serum|сыворотк|ampoule|ампул', n):
        return 'Уход за лицом', 'Сыворотки и ампулы'
    if re.search(r'toner|тонер|lotion|лосьон|essence(?!.*cream)', n):
        return 'Уход за лицом', 'Тонеры и лосьоны'
    if re.search(r'cream|крем|emulsion|эмульси|moisturiz|gel[- ]cream|sleeping|tone.up|brighten|barrier|firming|jelly|balm|gel.*oily|kombucha.*set', n):
        return 'Уход за лицом', 'Кремы и эмульсии'
    # Продукты и разное
    if re.search(r'coffee|кофе|sencha|earl grey|cafe au lait|lipton', n) and not re.search(r'eye patch|hydrogel', n):
        return 'Продукты и разное', 'Чай и кофе'
    if re.search(r'чай(?!.*крем)|tea\b', n) and not re.search(r'tea\s*tree|kombucha|tea.tox|ferment|cream|emulsion|\d+ml', n):
        return 'Продукты и разное', 'Чай и кофе'
    if re.search(r'diffuser|aroma', n):
        return 'Продукты и разное', 'Бытовая химия'
    if re.search(r'eyelid tape|underwear|ожерель|magneloop|visor|tank top', n):
        return 'Продукты и разное', 'Аксессуары'
    # Fallback: brands known as eye-drop makers
    if re.search(r'\b(sante|rohto|lion smile|santen|wibi)\b', n):
        return 'Здоровье и БАДы', 'Для зрения'
    # Fallback: health/supplement brands
    if re.search(r'\b(dhc|orihiro|fancl|fujima|nutri|fine japan|unimat|kobayashi|seedcoms|nature made)\b', n):
        return 'Здоровье и БАДы', 'Витамины и минералы'
    # Korean cosmetics brands -> face care
    if re.search(r'jmsolution|jigott|prettyskin|the history of whoo|whoo|torriden|beauugreen|beaugreen', n):
        return 'Уход за лицом', 'Кремы и эмульсии'
    if re.search(r'propolis stick', n):
        return 'Уход за лицом', 'Кремы и эмульсии'
    if re.search(r'hanmi|mokn spray', n):
        return 'Здоровье и БАДы', 'Для иммунитета и при простуде'
    if re.search(r'children|дет', n):
        return 'Продукты и разное', 'Аксессуары'
    return 'Продукты и разное', 'Аксессуары'

PREMIUM = {'sulwhasoo','ohui','hera','the history of whoo','su:m37','sum37',"d'alba",'fancl'}

def get_tags(name, brand):
    n = (name + ' ' + brand).lower()
    tags = []
    if re.search(r"\bmen'?s?\b|мужск|\bmaca\b|\bмака\b|palmetto|пальма сереноа|oyster.*мужск|turtle extract", n):
        tags.append('для_мужчин')
    if re.search(r'child|дет[а-яё]|kids?\b|baby|беби|pigeon', n):
        tags.append('для_детей')
    if any(p in n for p in PREMIUM):
        tags.append('премиум')
    return ','.join(tags)

lines = open(SRC, encoding='utf-8').readlines()
products, urls = [], []
for line in lines:
    line = line.rstrip()
    if line.startswith('https://'): urls.append(line); continue
    m = re.match(r'\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.*?)\s*\|\s*([\d,]+)₽\s*\|\s*(.*)', line)
    if not m: continue
    _, raw_name, brand, price, unit = m.groups()
    inner = re.match(r'\|\s*\d+\s*\|\s*(.+)', raw_name)
    name = inner.group(1).strip() if inner else raw_name.strip()
    for pat, rep in [(r'^Name:\s*"?',''), (r'\*+.*$',''), (r'\(repeat\)|\(variant\)|\(duplicate listing\)','')]:
        name = re.sub(pat, rep, name).strip().strip('"')
    brand = re.sub(r'^-\s*Brand:\s*', '', brand).strip().strip('"')
    bm = re.match(r'- Brand:\s*(.+)', name)
    if not brand and bm: brand = bm.group(1).strip(); name = brand
    price = price.replace(',', '')
    unit = unit.strip().strip('—').strip()
    if unit and not re.match(r'^\d+\s*(g|ml|шт|tablets?|pieces?|days?|дн|капсул|пакет|m)\b', unit, re.I):
        um = re.search(r'(\d+)\s*(g|ml|шт|m)\b', unit, re.I)
        unit = um.group() if um else ''
    products.append({'name': name, 'brand': brand, 'price': price, 'unit': unit})

with open(OUT, 'w', newline='', encoding='utf-8') as f:
    w = csv.writer(f)
    w.writerow(['id','name','brand','price','unit','photo_url','category','subcategory','tags','country'])
    for i, p in enumerate(products):
        cat, sub = classify(p['name'], p['brand'])
        tags = get_tags(p['name'], p['brand'])
        url = urls[i] if i < len(urls) else ''
        country = get_country(p['brand'], p['name'])
        w.writerow([i+1, p['name'], p['brand'], p['price'], p['unit'], url, cat, sub, tags, country])

from collections import Counter
cats, subs = Counter(), Counter()
for p in products:
    c, s = classify(p['name'], p['brand']); cats[c] += 1; subs[f"{c} > {s}"] += 1
print(f"Total: {len(products)} products, {len(urls)} URLs\n\nCategories:")
for c, n in cats.most_common(): print(f"  {c}: {n}")
print("\nSubcategories:")
for s, n in sorted(subs.items()): print(f"  {s}: {n}")
print(f"\nCSV: {OUT}")
