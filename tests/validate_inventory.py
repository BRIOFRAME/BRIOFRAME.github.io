from pathlib import Path
import json, re, sys, html
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://brioframe.github.io'
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
    'id', 'slug', 'name', 'industry', 'category', 'tags', 'description', 'previewImage',
    'demoUrl', 'shopifyProductUrl', 'availability'
}
VALID_AVAILABILITY = {'Available', 'Preview'}
SLUG = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
FORBIDDEN_BRANDS = re.compile(r'LaunchPoint|LP Inbox|Kia Supreme Kreations|\bKSK\b', re.I)
REQUIRED_DEMO_META = (
    'name="description"',
    'rel="canonical"',
    'property="og:title"',
    'property="og:description"',
    'property="og:type"',
    'property="og:url"',
)

errors = []
catalog_path = ROOT / 'data' / 'templates.json'
taxonomy_path = ROOT / 'data' / 'taxonomy.json'
taxonomy_ids = set()

if not taxonomy_path.is_file():
    errors.append('missing data/taxonomy.json')
else:
    taxonomy = json.loads(taxonomy_path.read_text(encoding='utf-8'))
    if not isinstance(taxonomy, dict) or not isinstance(taxonomy.get('industries'), list):
        errors.append('taxonomy.json must contain an industries array')
    else:
        seen = []
        for index, industry in enumerate(taxonomy['industries'], start=1):
            if not isinstance(industry, dict):
                errors.append(f'taxonomy industry {index} must be an object')
                continue
            missing = {'id', 'label', 'order'}.difference(industry)
            if missing:
                errors.append(f'taxonomy industry {index} missing fields: {sorted(missing)}')
                continue
            if not SLUG.fullmatch(str(industry['id'])):
                errors.append(f'taxonomy industry invalid id: {industry["id"]}')
            if industry['id'] in seen:
                errors.append(f'taxonomy duplicate industry id: {industry["id"]}')
            seen.append(industry['id'])
            if not str(industry['label']).strip():
                errors.append(f'taxonomy industry missing label: {industry["id"]}')
        taxonomy_ids = set(seen)

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

demo_dirs = {p.name for p in (ROOT / 'demos').iterdir() if p.is_dir()} if (ROOT / 'demos').is_dir() else set()
orphan_demos = sorted(demo_dirs.difference(by_slug))
if orphan_demos:
    errors.append(f'demo folders missing from catalog: {orphan_demos}')

config_path = ROOT / 'data' / 'demo-config.json'
if config_path.is_file():
    demo_config = json.loads(config_path.read_text(encoding='utf-8'))
    if not isinstance(demo_config, dict):
        errors.append('demo-config.json must be an object')
    else:
        for slug, cfg in demo_config.items():
            if slug not in by_slug:
                errors.append(f'demo-config references unknown slug: {slug}')
            if isinstance(cfg, dict) and 'purchaseMode' in cfg:
                errors.append(f'demo-config[{slug}] uses deprecated purchaseMode')

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
    if item.get('industry') not in taxonomy_ids:
        errors.append(f'unknown industry for {slug}: {item.get("industry")}')
    if not isinstance(item.get('category'), str) or not item['category'].strip():
        errors.append(f'invalid category for {slug}')
    if not isinstance(item.get('tags'), list) or not item['tags'] or any(not isinstance(tag, str) or not tag.strip() for tag in item['tags']):
        errors.append(f'invalid tags for {slug}')

    preview = ROOT / str(item.get('previewImage', '')).lstrip('/')
    demo_path = ROOT / str(item.get('demoUrl', '')).lstrip('/') / 'index.html'
    if not preview.is_file():
        errors.append(f'missing preview: {slug}')
    if item.get('demoUrl') != f'/demos/{slug}/':
        errors.append(f'demoUrl must match slug route: {slug}')
    if not demo_path.is_file():
        errors.append(f'missing demo: {slug}')
        continue

    detail_path = ROOT / 'templates' / slug / 'index.html'
    if not detail_path.is_file():
        errors.append(f'missing template detail page: {slug}')
    else:
        detail_text = detail_path.read_text(encoding='utf-8')
        expected_detail_canonical = f'{SITE}/templates/{slug}/'
        if f'href="{expected_detail_canonical}"' not in detail_text:
            errors.append(f'template detail canonical mismatch: {slug}')
        if 'src="/assets/js/template-detail.js"' not in detail_text:
            errors.append(f'template detail missing runtime script: {slug}')
        if name not in detail_text:
            errors.append(f'template detail missing name metadata: {slug}')

    text = demo_path.read_text(encoding='utf-8')
    decoded = html.unescape(text)
    for needle in [name, 'data-brioframe-demo="true"', 'href="/"', 'Simulated demo']:
        if needle not in decoded:
            errors.append(f'demo missing {needle}: {slug}')
    if FORBIDDEN_BRANDS.search(text):
        errors.append(f'demo contains forbidden legacy/separate-brand text: {slug}')

    for needle in REQUIRED_DEMO_META:
        if needle not in text:
            errors.append(f'demo missing metadata {needle}: {slug}')
    expected_canonical = f'{SITE}/demos/{slug}/'
    if f'href="{expected_canonical}"' not in text:
        errors.append(f'demo canonical mismatch: {slug}')
    if f'content="{expected_canonical}"' not in text:
        errors.append(f'demo og:url mismatch: {slug}')

    if 'data-demo-config' in text:
        match = re.search(r'<script type="application/json" data-demo-config>(.*?)</script>', text, re.S)
        if not match:
            errors.append(f'demo has broken inline config: {slug}')
        else:
            try:
                inline_cfg = json.loads(match.group(1))
            except json.JSONDecodeError:
                errors.append(f'demo inline config is invalid JSON: {slug}')
            else:
                if isinstance(inline_cfg, dict) and 'purchaseMode' in inline_cfg:
                    errors.append(f'demo inline config uses deprecated purchaseMode: {slug}')

    if availability == 'Available':
        if not url or 'myshopify.com/products/' not in url:
            errors.append(f'Available record missing verified-looking Shopify URL: {slug}')
        if text.count(url) != 1:
            errors.append(f'demo must contain exact Shopify URL once: {slug}')
        if 'data-purchase-link="verified"' not in text:
            errors.append(f'Available demo missing verified purchase marker: {slug}')
        if 'Premium Preview · Shopify listing coming soon' in decoded:
            errors.append(f'Available demo still shows coming-soon purchase copy: {slug}')
    elif availability == 'Preview':
        if url:
            errors.append(f'Preview record must not contain Shopify URL: {slug}')
        if 'data-purchase-link="verified"' in text or 'myshopify.com/products/' in text:
            errors.append(f'Preview demo contains unverified purchase path: {slug}')
        if 'Premium Preview' not in decoded:
            errors.append(f'Preview demo missing Premium Preview label: {slug}')

index_path = ROOT / 'index.html'
if not index_path.is_file():
    errors.append('missing index.html')
else:
    index = index_path.read_text(encoding='utf-8')
    for needle in ['id="template-search"', 'id="industry-filter"', 'id="category-filter"',
                   'id="availability-filter"', 'id="template-grid"', 'rel="canonical"',
                   'property="og:title"', 'property="og:description"', 'property="og:url"',
                   'name="twitter:card"', 'name="description"']:
        if needle not in index:
            errors.append(f'index missing {needle}')
    if catalog and str(len(catalog)) not in index:
        errors.append(f'index should mention current catalog size ({len(catalog)})')

for required in ['robots.txt', 'sitemap.xml']:
    if not (ROOT / required).is_file():
        errors.append(f'missing {required}')

sitemap_path = ROOT / 'sitemap.xml'
if sitemap_path.is_file() and catalog:
    try:
        root = ET.fromstring(sitemap_path.read_text(encoding='utf-8'))
        ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        locs = [node.text.strip() for node in root.findall('sm:url/sm:loc', ns) if node.text]
        expected = (
            [f'{SITE}/']
            + [f'{SITE}/templates/{slug}/' for slug in by_slug]
            + [f'{SITE}/demos/{slug}/' for slug in by_slug]
        )
        missing = [url for url in expected if url not in locs]
        extras = [url for url in locs if url not in expected]
        if missing:
            errors.append(f'sitemap missing urls: {missing}')
        if extras:
            errors.append(f'sitemap unexpected urls: {extras}')
    except ET.ParseError as exc:
        errors.append(f'sitemap parse error: {exc}')

robots_path = ROOT / 'robots.txt'
if robots_path.is_file() and f'Sitemap: {SITE}/sitemap.xml' not in robots_path.read_text(encoding='utf-8'):
    errors.append('robots.txt missing sitemap declaration')

if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'BRIOFRAME inventory validation passed: {len(catalog)}/{TARGET_INVENTORY} catalog records')
