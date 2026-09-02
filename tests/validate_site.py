from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
FORBIDDEN_SUFFIXES = {".zip", ".7z", ".rar", ".env", ".liquid", ".psd", ".ai", ".sketch"}
FORBIDDEN_PARTS = {"customer-files", "paid-source", "shopify-export", "fulfillment"}
FORBIDDEN_TEXT = re.compile(
    r"(api[_-]?key|access[_-]?token|private[_-]?key|Kia Supreme Kreations|\bKSK\b)",
    re.I,
)
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
PUBLIC_ORIGIN = "https://brioframe.github.io"
APPROVED_BATCH_ONE = {
    "velvet-nail-atelier": (
        "Velvet Nail Atelier",
        "https://1gsa1w-f1.myshopify.com/products/velvet-nail-atelier",
    ),
    "amara-braid-house": (
        "Amara Braid House",
        "https://1gsa1w-f1.myshopify.com/products/amara-braid-house",
    ),
    "meridian-supply-co": (
        "Meridian Supply Co.",
        "https://1gsa1w-f1.myshopify.com/products/meridian-supply-co",
    ),
}

errors = []
for required_path in (
    "data/templates.json",
    "assets/js/library.js",
    "assets/css/site.css",
    "index.html",
    "404.html",
    ".nojekyll",
    "robots.txt",
    "sitemap.xml",
    "demos/README.md",
    "docs/operations/publishing-checklist.md",
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
if catalog_path.exists():
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    if not isinstance(catalog, list):
        errors.append("catalog root must be an array")
    else:
        required = {
            "id",
            "slug",
            "name",
            "category",
            "description",
            "previewImage",
            "demoUrl",
            "shopifyProductUrl",
            "availability",
        }
        ids = set()
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
            if "slug" in item and item.get("demoUrl") != f"/demos/{item['slug']}/":
                errors.append(f"catalog[{index}] demoUrl must match slug")
            if "previewImage" in item and not item["previewImage"].startswith("/assets/"):
                errors.append(f"catalog[{index}] previewImage must start with /assets/")
            if "shopifyProductUrl" in item and not item["shopifyProductUrl"].startswith("https://"):
                errors.append(f"catalog[{index}] Shopify URL must use HTTPS")
            if "slug" in item:
                demo_path = ROOT / "demos" / item["slug"] / "index.html"
                if not demo_path.is_file():
                    errors.append(f"catalog[{index}] missing demo index")
                else:
                    demo_text = demo_path.read_text(encoding="utf-8")
                    if 'href="/"' not in demo_text:
                        errors.append(f"catalog[{index}] demo missing return link")
                    shopify_url = item.get("shopifyProductUrl")
                    if shopify_url and shopify_url not in demo_text:
                        errors.append(f"catalog[{index}] demo missing Shopify URL")
            for forbidden in {
                "downloadUrl",
                "packagePath",
                "customerId",
                "fulfillmentId",
                "protectedFilename",
            }:
                if forbidden in item:
                    errors.append(f"catalog[{index}] forbidden key: {forbidden}")

index_path = ROOT / "index.html"
if index_path.exists():
    index_text = index_path.read_text(encoding="utf-8")
    required_markup = {
        'id="template-grid"': "template grid",
        'id="library-status"': "library status",
        'rel="stylesheet"': "stylesheet link",
        'src="/assets/js/library.js"': "library script",
        "defer": "deferred script",
        '<meta name="robots" content="index,follow">': "indexable robots meta",
        f'<link rel="canonical" href="{PUBLIC_ORIGIN}/">': "canonical link",
    }
    for needle, label in required_markup.items():
        if index_text.count(needle) != 1:
            errors.append(f"index.html must contain one {label}")

robots_path = ROOT / "robots.txt"
if robots_path.exists():
    robots_text = robots_path.read_text(encoding="utf-8")
    for needle in (
        "User-agent: *",
        "Allow: /",
        f"Sitemap: {PUBLIC_ORIGIN}/sitemap.xml",
    ):
        if needle not in robots_text:
            errors.append(f"robots.txt missing: {needle}")

sitemap_path = ROOT / "sitemap.xml"
if sitemap_path.exists():
    sitemap_text = sitemap_path.read_text(encoding="utf-8")
    required_public_urls = [f"{PUBLIC_ORIGIN}/"] + [
        f"{PUBLIC_ORIGIN}/demos/{slug}/" for slug in APPROVED_BATCH_ONE
    ]
    for public_url in required_public_urls:
        if f"<loc>{public_url}</loc>" not in sitemap_text:
            errors.append(f"sitemap.xml missing URL: {public_url}")

catalog_by_slug = {
    item.get("slug"): item
    for item in (catalog if isinstance(catalog, list) else [])
}
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
    if "Simulated demo" not in demo_text:
        errors.append(f"pending Batch 1 demo missing simulated-action disclosure: {slug}")
    if "data-demo-form" not in demo_text:
        errors.append(f"pending Batch 1 demo missing simulated form marker: {slug}")
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
