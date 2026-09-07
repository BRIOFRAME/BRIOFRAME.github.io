from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "templates.json"

REQUIRED_PHASE4 = {
    "sable-skin-studio": "Beauty & Personal Care",
    "vertex-cyber-partners": "Technology",
    "sterling-family-law": "Professional Services",
    "meridian-concierge-medicine": "Health & Family",
    "skytable-aviation-catering": "Aviation",
    "runway-club-aviation-society": "Aviation",
    "azure-cay-villa-estates": "Real Estate & Stays",
    "mariners-house-yacht-club": "Marine",
    "aurelia-med-spa": "Beauty & Personal Care",
}


def main() -> None:
    records = json.loads(CATALOG.read_text(encoding="utf-8"))
    assert len(records) >= 35, f"Phase 4 requires at least 35 templates; found {len(records)}"
    by_slug = {item["slug"]: item for item in records}
    missing = [slug for slug in REQUIRED_PHASE4 if slug not in by_slug]
    assert not missing, f"Missing Phase 4 templates: {missing}"
    for slug in REQUIRED_PHASE4:
        item = by_slug[slug]
        assert item["availability"] == "Preview", f"{slug} must launch as Preview until Shopify URL is verified"
        assert not item.get("shopifyProductUrl"), f"{slug} must not invent a Shopify URL"
        demo = ROOT / item["demoUrl"].strip("/") / "index.html"
        preview = ROOT / item["previewImage"].lstrip("/")
        assert demo.exists(), f"Missing demo for {slug}"
        assert preview.exists(), f"Missing preview for {slug}"
    print("Phase 4 inventory validation: PASS")


if __name__ == "__main__":
    main()
