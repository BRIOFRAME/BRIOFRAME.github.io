from pathlib import Path
import json
import re
import sys
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://brioframe.github.io"
FORBIDDEN_SUFFIXES = {".zip", ".7z", ".rar", ".env", ".liquid", ".psd", ".ai", ".sketch"}
FORBIDDEN_PARTS = {"customer-files", "paid-source", "shopify-export", "fulfillment"}
FORBIDDEN_TEXT = re.compile(r"(api[_-]?key|access[_-]?token|private[_-]?key|Kia Supreme Kreations|\bKSK\b)", re.I)
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
APPROVED_BATCH_ONE = {
    "velvet-nail-atelier": ("Velvet Nail Atelier", "https://1gsa1w-f1.myshopify.com/products/velvet-nail-atelier"),
    "amara-braid-house": ("Amara Braid House", "https://1gsa1w-f1.myshopify.com/products/amara-braid-house"),
    "meridian-supply-co": ("Meridian Supply Co.", "https://1gsa1w-f1.myshopify.com/products/meridian-supply-co"),
}
REQUIRED_DEMO_META = (
    ('name="description"', "meta description"),
    ('rel="canonical"', "canonical link"),
    ('property="og:title"', "og:title"),
    ('property="og:description"', "og:description"),
    ('property="og:type"', "og:type"),
    ('property="og:url"', "og:url"),
)
REQUIRED_INDEX_META = REQUIRED_DEMO_META + (
    ('name="twitter:card"', "twitter:card"),
    ('name="twitter:title"', "twitter:title"),
    ('name="twitter:description"', "twitter:description"),
)

errors = []
for required_path in (
    "data/templates.json", "assets/js/library.js", "assets/css/site.css", "index.html", "404.html",
    ".nojekyll", "demos/README.md", "docs/operations/publishing-checklist.md", "robots.txt", "sitemap.xml",
):
    if not (ROOT / required_path).is_file():
        errors.append(f"missing required file: {required_path}")

for path in ROOT.rglob("*"):
    if ".git" in path.parts or not path.is_file():
        continue
    rel = path.relative_to(ROOT)
    if path.suffix.lower() in FORBIDDEN_SUFFIXES:
        errors.append(f"forbidden file type: {rel}")
    if any(part.lower() in FORBIDDEN_PARTS for part in rel.parts):
        errors.append(f"forbidden path: {rel}")
    publishable = rel.parts[0] not in {"docs", "tests"} and rel.name != "README.md"
    if publishable and path.suffix.lower() in {".html", ".css", ".js", ".json", ".txt"}:
        text = path.read_text(encoding="utf-8", errors="ignore")
        if FORBIDDEN_TEXT.search(text):
            errors.append(f"forbidden text: {rel}")

catalog_path = ROOT / "data" / "templates.json"
catalog = []
if catalog_path.exists():
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    if not isinstance(catalog, list):
        errors.append("catalog root must be an array")
        catalog = []
    else:
        required = {"id", "slug", "name", "category", "description", "previewImage", "demoUrl", "shopifyProductUrl", "availability"}
        ids = set()
        slugs = set()
        for index, item in enumerate(catalog):
            missing = required - set(item)
            if missing:
                errors.append(f"catalog[{index}] missing: {sorted(missing)}")
            if "slug" in item and not SLUG.fullmatch(item["slug"]):
                errors.append(f"catalog[{index}] invalid slug")
            if "id" in item:
                if item["id"] in ids:
                    errors.append(f"catalog[{index}] duplicate id")
                ids.add(item["id"])
            if "slug" in item:
                if item["slug"] in slugs:
                    errors.append(f"catalog[{index}] duplicate slug")
                slugs.add(item["slug"])
            if "slug" in item and item.get("demoUrl") != f"/demos/{item['slug']}/":
                errors.append(f"catalog[{index}] demoUrl must match slug")
            if "previewImage" in item and not item["previewImage"].startswith("/assets/"):
                errors.append(f"catalog[{index}] previewImage must start with /assets/")
            if "previewImage" in item:
                preview_path = ROOT / item["previewImage"].lstrip("/")
                if not preview_path.is_file():
                    errors.append(f"catalog[{index}] missing preview asset: {item['previewImage']}")

            availability = item.get("availability")
            shopify_url = item.get("shopifyProductUrl", "")
            if availability == "Available":
                if not shopify_url.startswith("https://"):
                    errors.append(f"catalog[{index}] Available item Shopify URL must use HTTPS")
                elif "/products/" not in shopify_url:
                    errors.append(f"catalog[{index}] Available item Shopify URL must point to a product")
            elif availability == "Preview":
                if shopify_url:
                    errors.append(f"catalog[{index}] Preview item must not expose an unverified Shopify URL")
            else:
                errors.append(f"catalog[{index}] invalid availability: {availability}")

            if "slug" in item:
                demo_path = ROOT / "demos" / item["slug"] / "index.html"
                if not demo_path.is_file():
                    errors.append(f"catalog[{index}] missing demo index")
                else:
                    demo_text = demo_path.read_text(encoding="utf-8")
                    if 'href="/"' not in demo_text:
                        errors.append(f"catalog[{index}] demo missing return link")
                    if shopify_url and shopify_url not in demo_text:
                        errors.append(f"catalog[{index}] demo missing Shopify URL")
                    if availability == "Preview" and "myshopify.com/products/" in demo_text:
                        errors.append(f"catalog[{index}] Preview demo contains unverified Shopify path")
                    for needle, label in REQUIRED_DEMO_META:
                        if needle not in demo_text:
                            errors.append(f"catalog[{index}] demo missing {label}")
                    expected_canonical = f'{SITE}/demos/{item["slug"]}/'
                    if f'href="{expected_canonical}"' not in demo_text and f"href='{expected_canonical}'" not in demo_text:
                        errors.append(f"catalog[{index}] demo canonical must be {expected_canonical}")
                    expected_og_url = f'content="{expected_canonical}"'
                    if 'property="og:url"' in demo_text and expected_og_url not in demo_text:
                        errors.append(f"catalog[{index}] demo og:url must match canonical demo route")
            for forbidden in {"downloadUrl", "packagePath", "customerId", "fulfillmentId", "protectedFilename"}:
                if forbidden in item:
                    errors.append(f"catalog[{index}] forbidden key: {forbidden}")

demo_dirs = {p.name for p in (ROOT / "demos").iterdir() if p.is_dir()} if (ROOT / "demos").is_dir() else set()
catalog_slugs = {item.get("slug") for item in catalog if isinstance(item, dict)}
orphan_demos = sorted(demo_dirs - catalog_slugs)
if orphan_demos:
    errors.append(f"demo folders missing from catalog: {orphan_demos}")

config_path = ROOT / "data" / "demo-config.json"
if config_path.is_file():
    demo_config = json.loads(config_path.read_text(encoding="utf-8"))
    if not isinstance(demo_config, dict):
        errors.append("demo-config.json must be an object")
    else:
        for slug in demo_config:
            if slug not in catalog_slugs:
                errors.append(f"demo-config references unknown slug: {slug}")
            if isinstance(demo_config[slug], dict) and "purchaseMode" in demo_config[slug]:
                errors.append(f"demo-config[{slug}] must not use deprecated purchaseMode; use catalog availability")

index_path = ROOT / "index.html"
if index_path.exists():
    index_text = index_path.read_text(encoding="utf-8")
    required_markup = {
        'id="template-grid"': "template grid",
        'id="library-status"': "library status",
        'rel="stylesheet"': "stylesheet link",
        'src="/assets/js/library.js"': "library script",
        "defer": "deferred script",
    }
    for needle, label in required_markup.items():
        if index_text.count(needle) != 1:
            errors.append(f"index.html must contain one {label}")
    for needle, label in REQUIRED_INDEX_META:
        if needle not in index_text:
            errors.append(f"index.html missing {label}")
    if catalog and str(len(catalog)) not in index_text:
        errors.append(f"index.html should mention current catalog size ({len(catalog)})")

sitemap_path = ROOT / "sitemap.xml"
if sitemap_path.is_file() and catalog:
    try:
        root = ET.fromstring(sitemap_path.read_text(encoding="utf-8"))
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        locs = [node.text.strip() for node in root.findall("sm:url/sm:loc", ns) if node.text]
        expected = [f"{SITE}/"] + [f"{SITE}/demos/{item['slug']}/" for item in catalog if "slug" in item]
        missing = [url for url in expected if url not in locs]
        extras = [url for url in locs if url not in expected]
        if missing:
            errors.append(f"sitemap.xml missing urls: {missing}")
        if extras:
            errors.append(f"sitemap.xml has unexpected urls: {extras}")
    except ET.ParseError as exc:
        errors.append(f"sitemap.xml parse error: {exc}")

robots_path = ROOT / "robots.txt"
if robots_path.is_file():
    robots_text = robots_path.read_text(encoding="utf-8")
    if f"Sitemap: {SITE}/sitemap.xml" not in robots_text:
        errors.append("robots.txt must declare the public sitemap URL")

catalog_by_slug = {item.get("slug"): item for item in catalog}
for slug, (public_name, product_url) in APPROVED_BATCH_ONE.items():
    demo_path = ROOT / "demos" / slug / "index.html"
    if not demo_path.is_file():
        errors.append(f"pending Batch 1 demo missing: {demo_path.relative_to(ROOT)}")
        continue
    demo_text = demo_path.read_text(encoding="utf-8")
    if public_name not in demo_text:
        errors.append(f"pending Batch 1 demo missing approved identity: {slug}")
    if 'data-brioframe-demo="true"' not in demo_text:
        errors.append(f"pending Batch 1 demo missing BRIOFRAME demo marker: {slug}")
    if 'href="/"' not in demo_text:
        errors.append(f"pending Batch 1 demo missing return-to-library link: {slug}")
    if "Simulated demo" not in demo_text or "data-demo-form" not in demo_text:
        errors.append(f"pending Batch 1 demo missing simulated-action disclosure: {slug}")
    if demo_text.count(product_url) != 1:
        errors.append(f"Batch 1 demo must contain its exact verified purchase URL once: {slug}")
    if 'data-purchase-link="verified"' not in demo_text:
        errors.append(f"Batch 1 demo missing verified purchase marker: {slug}")
    if re.search(r"LaunchPoint|LP Inbox", demo_text, re.I):
        errors.append(f"Batch 1 demo contains legacy or private-integration copy: {slug}")
    record = catalog_by_slug.get(slug)
    if not record:
        errors.append(f"Batch 1 catalog record missing: {slug}")
    elif record.get("shopifyProductUrl") != product_url:
        errors.append(f"Batch 1 catalog URL does not match verified product URL: {slug}")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print("BRIOFRAME public-site validation passed")
