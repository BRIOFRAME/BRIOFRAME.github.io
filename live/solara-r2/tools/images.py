"""
BRIOFRAME · SOLARA Private Villas Master · BF-SOLARA-PV-M1
Image tool. Requires Python 3.9+ and Pillow (pip install Pillow).

  python tools/images.py                      rebuild assets/js/images.js from assets/img/photo
  python tools/images.py add photo.jpg ...    convert photos to responsive WebP, then rebuild
  python tools/images.py add --hero hero.jpg  also emit a 2560px size (full-bleed heroes)

Demo slugs listed in assets/js/photo-sources.js load their source photograph from the web and
stay in images.js until you add a local photo with the same slug (which retires the remote one).

The slug is the file name without extension ("villa-nova-01.jpg" -> "villa-nova-01"),
which is the value you use in data.js and in <img data-photo="..."> tags.
Use originals at least 1920px wide (2560px for heroes); smaller sizes are never upscaled.
"""
import json
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required: pip install Pillow")

ROOT = Path(__file__).resolve().parents[1]
PHOTO = ROOT / "assets" / "img" / "photo"
MAP = ROOT / "assets" / "js" / "images.js"
SOURCES = ROOT / "assets" / "js" / "photo-sources.js"
WIDTHS = [640, 1280, 1920]
HERO = 2560
QUALITY = 76


def _sources():
    if not SOURCES.exists():
        return None, {}
    text = SOURCES.read_text(encoding="utf-8")
    return text, json.loads(text[text.index("{"): text.rindex("}") + 1])


def _retire(slugs):
    """Your own photograph now owns these slugs: stop loading the demo source for them."""
    text, data = _sources()
    photos = data.get("photos", {})
    gone = [s for s in slugs if s in photos]
    if not gone:
        return
    for s in gone:
        del photos[s]
    head = text[: text.index("{")]
    SOURCES.write_text(head + json.dumps(data, indent=2) + ";\n", encoding="utf-8")
    print(f"photo-sources.js: {', '.join(gone)} now use your local files")


def add(files, hero):
    PHOTO.mkdir(parents=True, exist_ok=True)
    for f in files:
        src = Path(f)
        slug = re.sub(r"[^a-z0-9-]+", "-", src.stem.lower()).strip("-")
        im = Image.open(src).convert("RGB")
        made = []
        for w in WIDTHS + ([HERO] if hero else []):
            if w > im.width:
                continue
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(PHOTO / f"{slug}-{w}.webp", "WEBP", quality=QUALITY, method=6)
            made.append(w)
        if not made:
            print(f"skipped {src.name}: narrower than {WIDTHS[0]}px")
            continue
        if im.width < WIDTHS[-1]:
            print(f"warning {src.name}: only {im.width}px wide; HD layouts expect 1920px+")
        print(f"{slug}: {made}")
        _retire([slug])


def rebuild():
    found = {}
    for p in PHOTO.glob("*.webp"):
        m = re.match(r"^(.*)-(\d+)$", p.stem)
        if m:
            found.setdefault(m.group(1), []).append(int(m.group(2)))
    old = {}
    if MAP.exists():
        t = MAP.read_text(encoding="utf-8")
        old = json.loads(t[t.index("{"): t.rindex("}") + 1])
    remote = _sources()[1].get("photos", {})
    keep = {s: old[s] for s in remote if s in old and s not in found}
    lines = []
    for slug in sorted(set(found) | set(keep)):
        if slug in keep:
            w, h, widths = keep[slug]
            lines.append(f'  "{slug}": [{w}, {h}, [{", ".join(map(str, widths))}]]')
            continue
        widths = sorted(found[slug])
        with Image.open(PHOTO / f"{slug}-{widths[-1]}.webp") as im:
            w, h = im.size
        lines.append(f'  "{slug}": [{w}, {h}, [{", ".join(map(str, widths))}]]')
    head = "/* BRIOFRAME · SOLARA Private Villas · BF-SOLARA-PV-M1 · image dimension map (regenerate when photography changes) */\n"
    MAP.write_text(head + "window.SOLARA_IMAGES = {\n" + ",\n".join(lines) + "\n};\n", encoding="utf-8")
    print(f"images.js: {len(lines)} photos")


if __name__ == "__main__":
    args = sys.argv[1:]
    if args[:1] == ["add"]:
        rest = args[1:]
        hero = "--hero" in rest
        files = [a for a in rest if a != "--hero"]
        if not files:
            sys.exit("usage: python tools/images.py add [--hero] photo.jpg ...")
        add(files, hero)
    rebuild()
