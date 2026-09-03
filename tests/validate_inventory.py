from pathlib import Path
import json, re, sys, html

ROOT = Path(__file__).resolve().parents[1]
TARGET_INVENTORY = 90
MIN_BASELINE_INVENTORY = 17

REQUIRED_ACTIVE_INVENTORY = {
    'velvet-nail-atelier': ('Velvet Nail Atelier', 'https://1gsa1w-f1.myshopify.com/products/velvet-nail-atelier'),
    'amara-braid-house': ('Amara Braid House', 'https://1gsa1w-f1.myshopify.com/products/amara-braid-house'),
    'meridian-supply-co': ('Meridian Supply Co.', 'https://1gsa1w-f1.myshopify.com/products/meridian-supply-co'),
    'apex-auto-detail-auto-detailing-website-template': ('Apex Auto Detail', 'https://1gsa1w-f1.myshopify.com/products/apex-auto-detail-auto-detailing-website-template'),
    'atlas-freight-logistics-logistics-freight-website-template': ('Atlas Freight & Logistics', 'https://1gsa1w-f1.myshopify.com/products/atlas-freight-logistics-logistics-freight-website-template'),
    'avery-cole-law': ('Avery Cole Law', 'https://1gsa1w-f1.myshopify.com/products/avery-cole-law'),
    'common-ground-foundation-nonprofit-community-website-template': ('Common Ground Foundation', 'https://1gsa1w-f1.myshopify.com/products/common-ground-foundation-nonprofit-community-website-template'),
    'crescent-private-wealth': ('Crescent Private Wealth', 'https://1gsa1w-f1.myshopify.com/products/crescent-private-wealth'),
    'elevate-catering': ('Elevate Catering', 'https://1gsa1w-f1.myshopify.com/products/elevate-catering'),
    'harbor-dental-studio-dental-medical-practice-website-template': ('Harbor Dental Studio', 'https://1gsa1w-f1.myshopify.com/products/harbor-dental-studio-dental-medical-practice-website-template'),
    'ledgerline-tax-accounting-accounting-firm-website-template': ('Ledgerline Tax & Accounting', 'https://1gsa1w-f1.myshopify.com/products/ledgerline-tax-accounting-accounting-firm-website-template'),
    'little-grove-early-learning-daycare-childcare-website-template': ('Little Grove Early Learning', 'https://1gsa1w-f1.myshopify.com/products/little-grove-early-learning-daycare-childcare-website-template'),
    'lumiere-photography-studio-photography-website-template': ('Lumiere Photography Studio', 'https://1gsa1w-f1.myshopify.com/products/lumiere-photography-studio-photography-website-template'),
    'monarch-estates': ('Monarch Estates', 'https://1gsa1w-f1.myshopify.com/products/monarch-estates'),
    'nexa-systems': ('Nexa Systems', 'https://1gsa1w-f1.myshopify.com/products/nexa-systems'),
    'northstar-home-climate-hvac-home-services-website-template': ('Northstar Home Climate', 'https://1gsa1w-f1.myshopify.com/products/northstar-home-climate-hvac-home-services-website-template'),
}

REQUIRED_FIELDS = {
    'id', 'slug', 'name', 'category', 'description', 'previewImage',
    'demoUrl', 'shopifyProductUrl', 'availability'
}
VALID_AVAILABILITY = {'Available', 'Preview'}
FORBIDDEN_BRANDS = re.compile(r'LaunchPoint|LP Inbox|Kia Supreme Kreations|\\bKSK\\b', re.I)

errors = []
catalog_path = ROOT / 'data' / 'templates.json'
if not catalog_path.is_file():
    errors.append('missing data/templates.json')
    catalog = []
else:
    catalog = json.loads(catalog_path.read_text(encoding='utf-8'))

if not isinstance(catalog, list):
    errors.append('catalog root must be a list')
    catalog = []

if len(catalog) < MIN_BASELINE_INVENTORY:
    errors.append(f'catalog regressed below {MIN_BASELINE_INVENTORY} records: found {len(catalog)}')
if len(catalog) > TARGET_INVENTORY:
    errors.append(f'catalog exceeds locked target of {TARGET_INVENTORY}: found {len(catalog)}')

ids = []
slugs = []
by_slug = {}
for index, item in enumerate(catalog, start=1):
    if not isinstance(item, dict):
        errors.append(f'catalog record {index} must be an object')
        continue
    missing = REQUIRED_FIELDS.difference(item)
    if missing:
        errors.append(f'catalog record {index} missing fields: {sorted(missing)}')
        continue
    ids.append(item.get('id'))
    slugs.append(item.get('slug'))
    by_slug[item.get('slug')] = item

if len(ids) != len(set(ids)):
    errors.append('catalog IDs must be unique')
if len(slugs) != len(set(slugs)):
    errors.append('catalog slugs must be unique')

for slug, (name, url) in REQUIRED_ACTIVE_INVENTORY.items():
    item = by_slug.get(slug)
    if not item:
        errors.append(f'missing required commercial catalog record: {slug}')
        continue
    if item.get('name') != name:
        errors.append(f'wrong required commercial name: {slug}')
    if item.get('shopifyProductUrl') != url:
        errors.append(f'wrong Shopify URL: {slug}')
    if item.get('availability') != 'Available':
        errors.append(f'not Available: {slug}')

for item in catalog:
    if not isinstance(item, dict) or REQUIRED_FIELDS.difference(item):
        continue
    slug = item['slug']
    availability = item['availability']
    url = item['shopifyProductUrl']
    name = item['name']

    if availability not in VALID_AVAILABILITY:
        errors.append(f'invalid availability {availability!r}: {slug}')
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug or ''):
        errors.append(f'invalid slug format: {slug}')

    preview = ROOT / str(item.get('previewImage', '')).lstrip('/')
    demo_path = ROOT / str(item.get('demoUrl', '')).lstrip('/') / 'index.html'
    if not preview.is_file():
        errors.append(f'missing preview: {slug}')
    if not demo_path.is_file():
        errors.append(f'missing demo: {slug}')
        continue

    text = demo_path.read_text(encoding='utf-8')
    decoded = html.unescape(text)
    for needle in [name, 'data-brioframe-demo="true"', 'href="/"', 'Simulated demo']:
        if needle not in decoded:
            errors.append(f'demo missing {needle}: {slug}')
    if FORBIDDEN_BRANDS.search(text):
        errors.append(f'demo contains forbidden legacy/separate-brand text: {slug}')

    if availability == 'Available':
        if not url or 'myshopify.com/products/' not in url:
            errors.append(f'Available record missing verified-looking Shopify URL: {slug}')
        if text.count(url) != 1:
            errors.append(f'demo must contain exact Shopify URL once: {slug}')
        if 'data-purchase-link="verified"' not in text:
            errors.append(f'Available demo missing verified purchase marker: {slug}')
    elif availability == 'Preview':
        if url:
            errors.append(f'Preview record must not contain Shopify URL: {slug}')
        if 'data-purchase-link="verified"' in text or 'myshopify.com/products/' in text:
            errors.append(f'Preview demo contains unverified purchase path: {slug}')
        if 'Premium Preview' not in decoded:
            errors.append(f'Preview demo missing Premium Preview label: {slug}')

index = (ROOT / 'index.html').read_text(encoding='utf-8')
for needle in ['id="template-search"', 'id="industry-filter"', 'id="template-grid"', 'rel="canonical"']:
    if needle not in index:
        errors.append(f'index missing {needle}')
for required in ['robots.txt', 'sitemap.xml']:
    if not (ROOT / required).is_file():
        errors.append(f'missing {required}')

if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'BRIOFRAME inventory validation passed: {len(catalog)}/{TARGET_INVENTORY} catalog records')
