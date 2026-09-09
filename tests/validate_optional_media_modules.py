from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
page=(ROOT/'demos'/'solara-villa-collection'/'index.html').read_text(encoding='utf-8')
m=re.search(r'<script type="application/json" data-demo-config>(.*?)</script>',page)
errors=[]
if not m:
    errors.append('Solara demo missing inline config')
else:
    cfg=json.loads(m.group(1))
    mods=cfg.get('modules',[])
    for required in ('media-player','image-slider'):
        if required not in mods: errors.append(f'Solara missing optional module {required}')
    video=cfg.get('videoSrc','')
    target=ROOT/video.lstrip('/') if video else None
    if not target or not target.is_file() or target.stat().st_size<100_000:
        errors.append('Solara sample video missing or too small')
    if len(cfg.get('galleryImages',[]))<3:
        errors.append('Solara image slider needs at least three images')
runtime=(ROOT/'assets'/'js'/'demo-runtime.js').read_text(encoding='utf-8')
for needle in ('<video controls','data-module="image-slider"','data-slider-prev','data-slider-next'):
    if needle not in runtime:
        errors.append(f'runtime missing optional media support: {needle}')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print('PASS optional media modules with playable local sample video')
