from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
records = json.loads((ROOT / "data" / "templates.json").read_text(encoding="utf-8"))
failures = []

for item in records:
    slug = item["slug"]
    expected = f"/assets/previews/{slug}.jpg"
    if item.get("previewImage") != expected:
        failures.append(f"{slug}: catalog preview must be self-contained raster")
    if not (ROOT / expected.lstrip("/")).exists():
        failures.append(f"{slug}: missing raster catalog preview")
    svg = ROOT / "assets" / "previews" / f"{slug}.svg"
    if svg.exists() and "https://images.unsplash.com" in svg.read_text(encoding="utf-8"):
        failures.append(f"{slug}: source preview still hotlinks remote imagery")

if failures:
    raise SystemExit("FAIL preview screens:\n" + "\n".join(failures))
print(f"PASS preview screens: {len(records)} self-contained previews")
