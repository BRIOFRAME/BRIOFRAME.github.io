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

for slug in (
    "velvet-nail-atelier",
    "amara-braid-house",
    "meridian-supply-co",
    "altitude-aviation-services",
    "aerolustre-aircraft-detailing",
    "nexa-systems",
    "avery-cole-law",
    "monarch-estates",
    "crescent-private-wealth",
    "elevate-catering",
    "common-ground-foundation-nonprofit-community-website-template",
    "harbor-dental-studio-dental-medical-practice-website-template",
    "ledgerline-tax-accounting-accounting-firm-website-template",
    "little-grove-early-learning-daycare-childcare-website-template",
    "tidalmark-yacht-charter",
    "bluewater-charter-fishing",
    "apex-auto-detail-auto-detailing-website-template",
    "atlas-freight-logistics-logistics-freight-website-template",
    "lumiere-photography-studio-photography-website-template",
    "northstar-home-climate-hvac-home-services-website-template",
    "northstar-advisory-group",
    "maison-elan-catering",
    "pulsewell-studio",
    "encore-creator-studio",
):
    preview_path = ROOT / "assets" / "previews" / f"{slug}.svg"
    if not preview_path.is_file():
        errors.append(f"missing premium catalog preview for {slug}")
        continue
    preview = preview_path.read_text(encoding="utf-8")
    for marker in ("data-premium-preview", "<image", "data-device-frame"):
        if marker not in preview:
            errors.append(f"{slug} catalog preview missing {marker}")

for slug, visual in (
    ("altitude-aviation-services", "aviation"),
    ("nexa-systems", "tech"),
    ("avery-cole-law", "legal"),
    ("monarch-estates", "realestate"),
    ("crescent-private-wealth", "wealth"),
    ("elevate-catering", "catering"),
    ("common-ground-foundation-nonprofit-community-website-template", "nonprofit"),
    ("harbor-dental-studio-dental-medical-practice-website-template", "dental"),
    ("ledgerline-tax-accounting-accounting-firm-website-template", "accounting"),
    ("little-grove-early-learning-daycare-childcare-website-template", "childcare"),
    ("apex-auto-detail-auto-detailing-website-template", "auto"),
    ("atlas-freight-logistics-logistics-freight-website-template", "freight"),
    ("lumiere-photography-studio-photography-website-template", "photo"),
    ("northstar-home-climate-hvac-home-services-website-template", "hvac"),
):
    item = config.get(slug, {})
    hero_image = item.get("heroImage", "")
    if not hero_image.startswith("https://images.unsplash.com/"):
        errors.append(f"{slug} must use a verified photographic hero image")
    if item.get("visual") != visual:
        errors.append(f"{slug} must retain the {visual} visual identity")

for slug, visual in (
    ("tidalmark-yacht-charter", "marine"),
    ("bluewater-charter-fishing", "fishing"),
    ("northstar-advisory-group", "advisory"),
    ("maison-elan-catering", "catering"),
    ("pulsewell-studio", "wellness"),
    ("encore-creator-studio", "photo"),
):
    demo_path = ROOT / "demos" / slug / "index.html"
    if not demo_path.is_file():
        errors.append(f"missing inline premium demo for {slug}")
        continue
    demo = demo_path.read_text(encoding="utf-8")
    if '\"heroImage\":\"https://images.unsplash.com/' not in demo:
        errors.append(f"{slug} must use a verified photographic hero image")
    if f'\"visual\":\"{visual}\"' not in demo:
        errors.append(f"{slug} must retain the {visual} visual identity")

# AeroLustre is an inline-config runtime demo. It was explicitly rejected in
# desktop visual QA and must independently prove photographic aviation recovery.
aerolustre_path = ROOT / "demos" / "aerolustre-aircraft-detailing" / "index.html"
if not aerolustre_path.is_file():
    errors.append("missing AeroLustre aircraft-detailing demo")
else:
    aerolustre = aerolustre_path.read_text(encoding="utf-8")
    if '\"heroImage\":\"https://images.unsplash.com/' not in aerolustre:
        errors.append("aerolustre-aircraft-detailing must use a verified photographic hero image")
    if '\"visual\":\"aviation\"' not in aerolustre:
        errors.append("aerolustre-aircraft-detailing must retain the aviation visual identity")

if errors:
    print("\n".join(errors))
    sys.exit(1)

print("BRIOFRAME premium visual acceptance passed")
