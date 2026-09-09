from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "assets/css/site.css").read_text(encoding="utf-8")
DESIGN = ROOT / "design-studio" / "index.html"

checks = {
    "studio switcher": 'class="studio-switcher"' in HTML,
    "design studio route": 'href="/design-studio/"' in HTML,
    "template studio destination": 'href="#templates"' in HTML,
    "signature wall section": 'class="signature-wall"' in HTML,
    "BR signature mark": 'class="signature-wall__mark"' in HTML,
    "natural wall treatment": '.signature-wall' in CSS and 'linear-gradient' in CSS,
    "responsive storefront": '@media (max-width: 760px)' in CSS,
    "clean copyright encoding": "Â©" not in HTML,
    "design studio page exists": DESIGN.exists(),
}
if DESIGN.exists():
    design_html = DESIGN.read_text(encoding="utf-8")
    checks.update({
        "design studio premium hero": 'class="design-hero"' in design_html,
        "design studio services": 'id="services"' in design_html,
        "design studio portfolio": 'id="portfolio"' in design_html,
        "design studio process": 'id="process"' in design_html,
        "template studio cross-link": 'href="/#templates"' in design_html,
    })
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit("FAIL storefront: " + ", ".join(failed))
print("PASS storefront finalization")
