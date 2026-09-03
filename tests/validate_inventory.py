from pathlib import Path
import json, re, sys, html

ROOT = Path(__file__).resolve().parents[1]

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

REQUIRED_PREVIEW_INVENTORY = {
    'altitude-aviation-services': ('Altitude Aviation Services', 'Aviation & Aviation Services')
}

errors = []
catalog_path = ROOT / 'data' / 'templates.json'
if not catalog_path.is_file():
    errors.append('missing data/templates.json')
    catalog = []
else:
    catalog = json.loads(catalog_path.read_text(encoding='utf-8'))

by_slug = {item.get('slug'): item for item in catalog if isinstance(item, dict)}
if len(catalog) != 17:
    errors.append(f'expected 17 catalog records, found {len(catalog)}')

ids = [item.get('id') for item in catalog if isinstance(item, dict)]
if len(ids) != len(set(ids)):
    errors.append('catalog IDs must be unique')

for slug, (name, url) in REQUIRED_ACTIVE_INVENTORY.items():
    item = by_slug.get(slug)
    if not item:
        errors.append(f'missing catalog record: {slug}')
        continue
    if item.get('shopifyProductUrl') != url:
        errors.append(f'wrong Shopify URL: {slug}')
    if item.get('availability') != 'Available':
        errors.append(f'not Available: {slug}')
    preview = ROOT / item.get('previewImage', '').lstrip('/')
    demo = ROOT / 'demos' / slug / 'index.html'
    if not preview.is_file():
        errors.append(f'missing preview: {slug}')
    if not demo.is_file():
        errors.append(f'missing demo: {slug}')
        continue
    text = demo.read_text(encoding='utf-8')
    if name not in html.unescape(text):
        errors.append(f'demo missing identity: {slug}')
    if 'data-brioframe-demo="true"' not in text:
        errors.append(f'demo missing BRIOFRAME marker: {slug}')
    if 'href="/"' not in text:
        errors.append(f'demo missing library return link: {slug}')
    if 'Simulated demo' not in text or 'data-demo-form' not in text:
        errors.append(f'demo missing simulated-form disclosure: {slug}')
    if text.count(url) != 1:
        errors.append(f'demo must contain exact Shopify URL once: {slug}')
    if 'data-purchase-link="verified"' not in text:
        errors.append(f'demo missing verified purchase marker: {slug}')
    if re.search(r'LaunchPoint|LP Inbox|Kia Supreme Kreations|\\bKSK\\b', text, re.I):
        errors.append(f'demo contains forbidden legacy/separate-brand text: {slug}')

for slug, (name, category) in REQUIRED_PREVIEW_INVENTORY.items():
    item = by_slug.get(slug)
    if not item:
        errors.append(f'missing preview catalog record: {slug}')
        continue
    if item.get('name') != name or item.get('category') != category:
        errors.append(f'wrong aviation preview identity: {slug}')
    if item.get('availability') != 'Preview':
        errors.append(f'aviation item must be Preview: {slug}')
    if item.get('shopifyProductUrl'):
        errors.append(f'aviation preview must not invent Shopify URL: {slug}')
    preview = ROOT / item.get('previewImage', '').lstrip('/')
    demo = ROOT / 'demos' / slug / 'index.html'
    if not preview.is_file():
        errors.append(f'missing preview: {slug}')
    if not demo.is_file():
        errors.append(f'missing demo: {slug}')
        continue
    text = demo.read_text(encoding='utf-8')
    for needle in [name, 'data-brioframe-demo="true"', 'href="/"', 'Simulated demo', 'data-demo-form', 'Premium Preview']:
        if needle not in html.unescape(text):
            errors.append(f'aviation demo missing {needle}: {slug}')
    if 'data-purchase-link="verified"' in text or 'myshopify.com/products/' in text:
        errors.append(f'aviation preview contains unverified purchase path: {slug}')
    if re.search(r'LaunchPoint|LP Inbox|Kia Supreme Kreations|\\bKSK\\b', text, re.I):
        errors.append(f'demo contains forbidden legacy/separate-brand text: {slug}')

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
print('BRIOFRAME 16 active + 1 aviation preview inventory validation passed')
