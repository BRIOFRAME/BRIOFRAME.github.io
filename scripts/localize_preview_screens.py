from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PREVIEWS = ROOT / "assets" / "previews"

for svg in sorted(PREVIEWS.glob("*.svg")):
    text = svg.read_text(encoding="utf-8")
    matches = list(re.finditer(r'href="https://images\.unsplash\.com[^"]+"', text))
    if len(matches) != 2:
        raise SystemExit(f"{svg.name}: expected 2 remote device images, found {len(matches)}")
    replacements = [
        f'href="/assets/screenshots/{svg.stem}-desktop.jpg"',
        f'href="/assets/screenshots/{svg.stem}-mobile.jpg"',
    ]
    for match, replacement in zip(reversed(matches), reversed(replacements)):
        text = text[:match.start()] + replacement + text[match.end():]
    svg.write_text(text, encoding="utf-8")
    print(f"localized {svg.name}")
