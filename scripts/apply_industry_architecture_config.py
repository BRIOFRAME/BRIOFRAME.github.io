from pathlib import Path
import json, re

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / 'data' / 'demo-config.json'
ARCH = {
 'velvet-nail-atelier': ('editorial-beauty',['service-menu','booking-flow'],['image-slider']),
 'altitude-aviation-services': ('cinematic-aviation',['fleet-capabilities','safety-proof'],['media-player','image-slider']),
 'avery-cole-law': ('authority-legal',['practice-areas','case-proof'],[]),
 'apex-auto-detail-auto-detailing-website-template': ('performance-auto',['transformation-gallery','service-booking'],['before-after','image-slider']),
 'solara-villa-collection': ('immersive-villa',['property-story','availability-flow'],['media-player','image-slider']),
 'meridian-supply-co': ('operations-wholesale',['catalog-path','quote-flow'],[]),
 'meridian-concierge-medicine': ('trust-healthcare',['care-model','appointment-flow'],[]),
}

def enhance(obj, slug):
    architecture, roles, modules = ARCH[slug]
    obj['architecture'] = architecture
    obj['sectionRoles'] = roles
    obj['modules'] = modules
    return obj
cfg = json.loads(CONFIG.read_text(encoding='utf-8'))
for slug in ARCH:
    if slug in cfg:
        cfg[slug] = enhance(cfg[slug], slug)
CONFIG.write_text(json.dumps(cfg, indent=2), encoding='utf-8')

for slug in ARCH:
    page = ROOT / 'demos' / slug / 'index.html'
    if not page.is_file() or slug in cfg:
        continue
    text = page.read_text(encoding='utf-8')
    m = re.search(r'<script type="application/json" data-demo-config>(.*?)</script>', text)
    if not m:
        print(f'skipping bespoke demo: {slug}')
        continue
    obj = enhance(json.loads(m.group(1)), slug)
    script = '<script type="application/json" data-demo-config>' + json.dumps(obj,separators=(',',':')) + '</script>'
    text = text[:m.start()] + script + text[m.end():]
    page.write_text(text, encoding='utf-8')
print('applied representative industry architecture config')
