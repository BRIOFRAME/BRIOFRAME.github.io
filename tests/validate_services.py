from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
SERVICE = ROOT / "services" / "index.html"
SITEMAP = ROOT / "sitemap.xml"
INDEX = ROOT / "index.html"
errors = []

if not SERVICE.is_file():
    errors.append("missing services/index.html")
else:
    html = SERVICE.read_text(encoding="utf-8")
    required = {
        '<link rel="canonical" href="https://brioframe.github.io/services/">': "services canonical",
        "Template Customization": "template customization path",
        "Custom Website Design": "custom website path",
        "Managed Launch": "managed launch scope",
        "Starting price available during consultation": "non-fabricated pricing treatment",
        'href="/"': "Template Studio return path",
    }
    for needle, label in required.items():
        if needle not in html:
            errors.append(f"services page missing {label}")
    forbidden = ("<form", "data-purchase-link=", "myshopify.com/products/")
    for needle in forbidden:
        if needle in html:
            errors.append(f"services page contains unverified behavior: {needle}")

if INDEX.is_file():
    index_html = INDEX.read_text(encoding="utf-8")
    if 'href="/services/"' not in index_html:
        errors.append("Template Studio missing Services navigation")

if SITEMAP.is_file():
    sitemap = SITEMAP.read_text(encoding="utf-8")
    if "https://brioframe.github.io/services/" not in sitemap:
        errors.append("sitemap missing services URL")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print("BRIOFRAME services validation passed")
