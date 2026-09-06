from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

motion_path = ROOT / "assets" / "js" / "phase3-motion.js"
library_path = ROOT / "assets" / "js" / "library.js"
detail_path = ROOT / "assets" / "js" / "template-detail.js"

for path in (motion_path, library_path, detail_path):
    if not path.is_file():
        errors.append(f"missing Phase 3 file: {path.relative_to(ROOT)}")

motion = motion_path.read_text(encoding="utf-8") if motion_path.is_file() else ""
library = library_path.read_text(encoding="utf-8") if library_path.is_file() else ""
detail = detail_path.read_text(encoding="utf-8") if detail_path.is_file() else ""

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
    "Related templates": "same-industry related-template section",
    "/templates/${related.slug}/": "internal related-template links",
    'import("/assets/js/phase3-motion.js")': "Phase 3 motion integration",
}
for needle, label in conversion_requirements.items():
    if needle not in detail:
        errors.append(f"template-detail.js missing {label}")

# Guard against introducing unsupported commercial claims into Phase 3 runtime copy.
for forbidden in ("guaranteed results", "guaranteed sales", "best-selling", "#1 template"):
    if forbidden.lower() in detail.lower():
        errors.append(f"template-detail.js contains unsupported commercial claim: {forbidden}")

if errors:
    print("\n".join(errors))
    sys.exit(1)

print("BRIOFRAME Phase 3 validation passed")
