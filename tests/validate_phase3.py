from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

motion_path = ROOT / "assets" / "js" / "phase3-motion.js"
library_path = ROOT / "assets" / "js" / "library.js"
detail_path = ROOT / "assets" / "js" / "template-detail.js"
index_path = ROOT / "index.html"
templates_path = ROOT / "data" / "templates.json"
sitemap_path = ROOT / "sitemap.xml"
robots_path = ROOT / "robots.txt"

for path in (motion_path, library_path, detail_path, index_path, templates_path, sitemap_path, robots_path):
    if not path.is_file():
        errors.append(f"missing Phase 3 file: {path.relative_to(ROOT)}")

motion = motion_path.read_text(encoding="utf-8") if motion_path.is_file() else ""
library = library_path.read_text(encoding="utf-8") if library_path.is_file() else ""
detail = detail_path.read_text(encoding="utf-8") if detail_path.is_file() else ""
index = index_path.read_text(encoding="utf-8") if index_path.is_file() else ""
sitemap = sitemap_path.read_text(encoding="utf-8") if sitemap_path.is_file() else ""
robots = robots_path.read_text(encoding="utf-8") if robots_path.is_file() else ""

motion_requirements = {
    'matchMedia("(prefers-reduced-motion: reduce)")': "reduced-motion media query",
    "IntersectionObserver": "intersection-based reveal behavior",
    "phase3-reveal": "Phase 3 reveal class",
    "phase3-reveal--visible": "visible reveal state",
    "@media (prefers-reduced-motion: reduce)": "reduced-motion CSS override",
    "export { applyMotion }": "reusable applyMotion export",
}
for needle, label in motion_requirements.items():
    if needle not in motion:
        errors.append(f"phase3-motion.js missing {label}")

if 'import("/assets/js/phase3-motion.js")' not in library:
    errors.append("library.js must load the Phase 3 motion module after catalog rendering")
if "applyMotion" not in library:
    errors.append("library.js must apply Phase 3 motion after rerendering")

conversion_requirements = {
    "Choose the right BRIOFRAME path": "Template Studio vs Design Studio decision path",
    "Template Studio": "Template Studio guidance",
    "Design Studio": "Design Studio guidance",
    "Evaluate before you decide": "trust/evaluation guidance",
    "addRelatedTemplates": "same-industry related-template section",
    "item.industry === template.industry": "same-industry related-template filtering",
    "/templates/${item.slug}/": "internal related-template links",
    'import("/assets/js/phase3-motion.js")': "Phase 3 motion integration",
}
for needle, label in conversion_requirements.items():
    if needle not in detail:
        errors.append(f"template-detail.js missing {label}")

# Phase 3 catalog presentation: expose industry-first discovery without replacing
# or bypassing the Phase 1 URL/filter behavior.
for needle, label in {
    'id="industry-discovery"': "industry discovery region",
    'id="industry-shortcuts"': "industry shortcut container",
}.items():
    if needle not in index:
        errors.append(f"index.html missing {label}")

for needle, label in {
    "populateIndustryDiscovery": "industry discovery renderer",
    "industryFilter.value = industry.id": "industry shortcut filter selection",
    "populateCategoryOptions(industry.id)": "industry-aware specialty refresh",
    "applyFilters()": "existing Phase 1 filter application path",
}.items():
    if needle not in library:
        errors.append(f"library.js missing {label}")

# SEO/discovery acceptance: every authoritative template detail page must carry
# title/meta/canonical/social markup and safe structured data, and appear in the sitemap.
if templates_path.is_file():
    templates = json.loads(templates_path.read_text(encoding="utf-8"))
    for template in templates:
        slug = template.get("slug", "")
        if not slug:
            errors.append("catalog record missing slug")
            continue
        detail_file = ROOT / "templates" / slug / "index.html"
        if not detail_file.is_file():
            errors.append(f"missing detail page for {slug}")
            continue
        html = detail_file.read_text(encoding="utf-8")
        canonical = f"https://brioframe.github.io/templates/{slug}/"
        required_markup = {
            "<title>": "title",
            'name="description"': "meta description",
            f'rel="canonical" href="{canonical}"': "canonical URL",
            'property="og:title"': "Open Graph title",
            'property="og:description"': "Open Graph description",
            'property="og:url"': "Open Graph URL",
            'name="twitter:card"': "Twitter card",
            'type="application/ld+json"': "structured data",
        }
        for needle, label in required_markup.items():
            if needle not in html:
                errors.append(f"{slug} detail page missing {label}")
        if canonical not in sitemap:
            errors.append(f"sitemap missing template detail URL: {slug}")

if "Sitemap:" not in robots or "sitemap.xml" not in robots:
    errors.append("robots.txt must advertise sitemap.xml")

# Guard against introducing unsupported commercial claims into Phase 3 runtime copy.
for forbidden in ("guaranteed results", "guaranteed sales", "best-selling", "#1 template"):
    if forbidden.lower() in detail.lower():
        errors.append(f"template-detail.js contains unsupported commercial claim: {forbidden}")

if errors:
    print("\n".join(errors))
    sys.exit(1)

print("BRIOFRAME Phase 3 validation passed")
