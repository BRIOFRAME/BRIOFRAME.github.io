from pathlib import Path
import re

path = Path(__file__).resolve().parents[1] / "data" / "templates.json"
text = path.read_text(encoding="utf-8")
updated, count = re.subn(
    r'("previewImage":"/assets/previews/[^"]+)\.svg("\s*,\s*"demoUrl")',
    r'\1.jpg\2',
    text,
)
if count != 35:
    raise SystemExit(f"expected 35 preview paths, updated {count}")
path.write_text(updated, encoding="utf-8")
print(f"updated {count} preview paths")
