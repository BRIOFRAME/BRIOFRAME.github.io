from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

runtime_path = ROOT / "assets" / "js" / "demo-runtime.js"
css_path = ROOT / "assets" / "css" / "demo-runtime.css"
config_path = ROOT / "data" / "demo-config.json"

for path in (runtime_path, css_path, config_path):
    if not path.is_file():
        errors.append(f"missing premium visual file: {path.relative_to(ROOT)}")

runtime = runtime_path.read_text(encoding="utf-8") if runtime_path.is_file() else ""
css = css_path.read_text(encoding="utf-8") if css_path.is_file() else ""
config = json.loads(config_path.read_text(encoding="utf-8")) if config_path.is_file() else {}

# A premium demo must be able to render real photographic hero art rather than
# only abstract placeholder geometry.
for needle, label in {
    "cfg.heroImage": "configuration-driven photographic hero support",
    "demo-hero-photo": "dedicated hero-photo presentation hook",
}.items():
    if needle not in runtime:
        errors.append(f"demo-runtime.js missing {label}")

for needle, label in {
    ".demo-hero-photo": "premium hero image styling",
    "object-fit:cover": "non-warping photographic crop behavior",
}.items():
    if needle not in css.replace(" ", ""):
        errors.append(f"demo-runtime.css missing {label}")

# Phase 3 recovery gate: the three flagship static demos must render actual
# photographic imagery at the hero and content-card level. Gradient-only art
# is an automatic failure because it does not match the approved BRIOFRAME
# concept direction.
flagship_static_demos = {
    "velvet-nail-atelier": ["data-premium-hero-photo", "data-premium-gallery"],
    "amara-braid-house": ["data-premium-hero-photo", "data-premium-gallery"],
    "meridian-supply-co": ["data-premium-hero-photo", "data-premium-gallery"],
}
for slug, required_markers in flagship_static_demos.items():
    page_path = ROOT / "demos" / slug / "index.html"
    style_path = ROOT / "demos" / slug / "assets" / "style.css"
    if not page_path.is_file() or not style_path.is_file():
        errors.append(f"missing flagship recovery files for {slug}")
        continue
    page = page_path.read_text(encoding="utf-8")
    style = style_path.read_text(encoding="utf-8").replace(" ", "")
    for marker in required_markers:
        if marker not in page:
            errors.append(f"{slug} missing {marker}")
    if "<img" not in page:
        errors.append(f"{slug} must include real image elements")
    if "object-fit:cover" not in style:
        errors.append(f"{slug} must preserve photographic proportions with object-fit: cover")

# Altitude Aviation is the first shared-runtime recovery reference because the
# approved BRIOFRAME concepts explicitly call for cinematic aircraft imagery.
altitude = config.get("altitude-aviation-services", {})
hero_image = altitude.get("heroImage", "")
if not hero_image.startswith("https://images.unsplash.com/"):
    errors.append("Altitude Aviation must use a verified photographic hero image")

if altitude.get("visual") != "aviation":
    errors.append("Altitude Aviation must retain the aviation visual identity")

if errors:
    print("\n".join(errors))
    sys.exit(1)

print("BRIOFRAME premium visual acceptance passed")
