"""Build the home-page hero film from the site's own photographs.

    python tools/hero-video.py [--ffmpeg PATH]

Requires Python 3.9+, Pillow and an ffmpeg binary (on PATH, via --ffmpeg,
or from `pip install imageio-ffmpeg`). Writes:

    assets/video/hero-1080.mp4   1920x1080 H.264, no audio (desktop)
    assets/video/hero-720.mp4    1280x720 H.264, no audio (smaller screens)
    assets/video/hero-poster.jpg first frame, shown until the film plays

To use your own footage instead, replace those three files (keep the names, or
change config.media.heroVideo in assets/js/config.js). To rebuild from other
photographs, edit SHOTS below: slug of a photograph in assets/img/photo, the
vertical focus (0 = top, 1 = bottom) and the camera move.
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHOTO = os.path.join(ROOT, "assets", "img", "photo")
OUT = os.path.join(ROOT, "assets", "video")

SHOTS = [
    ("lefka-01", 0.55, "in"),
    ("halden-01", 0.50, "out"),
    ("oriel-06", 0.50, "pan-right"),
    ("serai-02", 0.62, "in"),
    ("kanu-01", 0.50, "out"),
    ("lumen-01", 0.55, "in"),
]
SHOT = 5.0      # seconds each photograph is on screen
FADE = 1.2      # crossfade length
FPS = 30
BASE = (2880, 1620)  # working resolution; oversampled so the slow zoom stays smooth


def find_ffmpeg(explicit):
    if explicit:
        return explicit
    if shutil.which("ffmpeg"):
        return "ffmpeg"
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found: install it, pass --ffmpeg, or pip install imageio-ffmpeg")


def source(slug):
    for size in (2560, 1920, 1280):
        path = os.path.join(PHOTO, f"{slug}-{size}.webp")
        if os.path.exists(path):
            return path
    sys.exit(f"No photograph found for {slug}")


def prepare(slug, focus, tmp):
    im = Image.open(source(slug)).convert("RGB")
    w, h = BASE
    scale = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    x = (im.width - w) // 2
    y = round((im.height - h) * focus)
    path = os.path.join(tmp, f"{slug}.png")
    im.crop((x, y, x + w, y + h)).save(path)
    return path


def move(kind, frames):
    t = f"(on/{frames - 1})"
    centre = "x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2'"
    if kind == "in":
        return f"z='1+0.10*{t}':{centre}"
    if kind == "out":
        return f"z='1.10-0.10*{t}':{centre}"
    return f"z='1.10':x='(iw-iw/zoom)*{t}':y='(ih-ih/zoom)/2'"


def build(ffmpeg, frames_dir, size, crf, target):
    frames = round(SHOT * FPS)
    args = [ffmpeg, "-y", "-loglevel", "error"]
    for slug, _, _ in SHOTS:
        args += ["-i", os.path.join(frames_dir, f"{slug}.png")]
    parts = []
    for k, (_, _, kind) in enumerate(SHOTS):
        parts.append(f"[{k}:v]zoompan={move(kind, frames)}:d={frames}:s={size}:fps={FPS},setsar=1,format=yuv420p[v{k}]")
    last = "v0"
    for k in range(1, len(SHOTS)):
        offset = k * (SHOT - FADE)
        parts.append(f"[{last}][v{k}]xfade=transition=fade:duration={FADE}:offset={offset:.2f}[x{k}]")
        last = f"x{k}"
    args += ["-filter_complex", ";".join(parts), "-map", f"[{last}]", "-an",
             "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-pix_fmt", "yuv420p",
             "-movflags", "+faststart", target]
    subprocess.run(args, check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ffmpeg")
    ffmpeg = find_ffmpeg(ap.parse_args().ffmpeg)
    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for slug, focus, _ in SHOTS:
            prepare(slug, focus, tmp)
        build(ffmpeg, tmp, "1920x1080", 28, os.path.join(OUT, "hero-1080.mp4"))
        build(ffmpeg, tmp, "1280x720", 29, os.path.join(OUT, "hero-720.mp4"))
    poster = os.path.join(OUT, "hero-poster.jpg")
    subprocess.run([ffmpeg, "-y", "-loglevel", "error", "-i", os.path.join(OUT, "hero-1080.mp4"),
                    "-frames:v", "1", "-q:v", "4", poster], check=True)
    for name in ("hero-1080.mp4", "hero-720.mp4", "hero-poster.jpg"):
        print(f"{name}: {os.path.getsize(os.path.join(OUT, name)) / 1e6:.2f} MB")


if __name__ == "__main__":
    main()
