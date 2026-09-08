from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data" / "templates.json"
COMMERCE_PATH = ROOT / "data" / "commerce.json"
ALLOWED_STATUSES = {"preview", "ready_for_sale", "live"}

errors = []

if not CATALOG_PATH.is_file():
    errors.append("missing public catalog: data/templates.json")
    catalog = []
else:
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))

if not COMMERCE_PATH.is_file():
    errors.append("missing commercial contract: data/commerce.json")
    commerce = []
else:
    commerce = json.loads(COMMERCE_PATH.read_text(encoding="utf-8"))

if not isinstance(catalog, list):
    errors.append("public catalog must be an array")
    catalog = []
if not isinstance(commerce, list):
    errors.append("commercial contract must be an array")
    commerce = []

catalog_by_slug = {item.get("slug"): item for item in catalog if isinstance(item, dict) and item.get("slug")}
seen = set()
for index, item in enumerate(commerce):
    if not isinstance(item, dict):
        errors.append(f"commerce[{index}] must be an object")
        continue
    missing = {"slug", "commercialStatus", "shopifyProductUrl"} - set(item)
    if missing:
        errors.append(f"commerce[{index}] missing: {sorted(missing)}")
        continue
    slug = item["slug"]
    status = item["commercialStatus"]
    url = item["shopifyProductUrl"]
    if slug in seen:
        errors.append(f"duplicate commerce slug: {slug}")
    seen.add(slug)
    if slug not in catalog_by_slug:
        errors.append(f"unknown commerce slug: {slug}")
        continue
    if status not in ALLOWED_STATUSES:
        errors.append(f"{slug}: invalid commercialStatus {status!r}")
        continue
    catalog_item = catalog_by_slug[slug]
    catalog_url = catalog_item.get("shopifyProductUrl", "")
    availability = catalog_item.get("availability")
    if status == "live":
        if not isinstance(url, str) or not url.startswith("https://") or "/products/" not in url:
            errors.append(f"{slug}: live status requires an HTTPS Shopify product URL")
        if url != catalog_url:
            errors.append(f"{slug}: live commerce URL must exactly match public catalog URL")
        if availability != "Available":
            errors.append(f"{slug}: live commerce status requires catalog availability Available")
    elif status == "preview":
        if url:
            errors.append(f"{slug}: preview status must not expose a Shopify product URL")
        if availability != "Preview":
            errors.append(f"{slug}: preview commerce status requires catalog availability Preview")
    elif status == "ready_for_sale":
        if url:
            errors.append(f"{slug}: ready_for_sale must remain non-purchasable until Shopify verification")
        if availability != "Preview":
            errors.append(f"{slug}: ready_for_sale must remain Preview in the public catalog")

catalog_slugs = set(catalog_by_slug)
if seen != catalog_slugs:
    missing = sorted(catalog_slugs - seen)
    extra = sorted(seen - catalog_slugs)
    if missing:
        errors.append(f"commercial contract missing catalog slugs: {missing}")
    if extra:
        errors.append(f"commercial contract contains unknown slugs: {extra}")

if len(commerce) != len(catalog):
    errors.append(f"commercial contract record count {len(commerce)} != catalog count {len(catalog)}")

if errors:
    print("BRIOFRAME commercial release validation failed:")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print(f"BRIOFRAME commercial release validation passed: {len(commerce)} records")
