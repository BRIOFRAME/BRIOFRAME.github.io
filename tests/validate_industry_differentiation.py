from pathlib import Path
import json, re, sys
ROOT = Path(__file__).resolve().parents[1]
BASE = json.loads((ROOT/'data'/'demo-config.json').read_text(encoding='utf-8'))
REQUIRED = {
 'velvet-nail-atelier':('editorial-beauty',['service-menu','booking-flow']),
 'altitude-aviation-services':('cinematic-aviation',['fleet-capabilities','safety-proof']),
 'avery-cole-law':('authority-legal',['practice-areas','case-proof']),
 'apex-auto-detail-auto-detailing-website-template':('performance-auto',['transformation-gallery','service-booking']),
 'solara-villa-collection':('immersive-villa',['property-story','availability-flow']),
 'meridian-supply-co':('operations-wholesale',['catalog-path','quote-flow']),
 'meridian-concierge-medicine':('trust-healthcare',['care-model','appointment-flow']),
}
def inline_config(slug):
    text=(ROOT/'demos'/slug/'index.html').read_text(encoding='utf-8')
    m=re.search(r'<script type="application/json" data-demo-config>(.*?)</script>',text)
    return json.loads(m.group(1)) if m else None
errors=[]
signatures=set()
for slug,(architecture,roles) in REQUIRED.items():
    page=ROOT/'demos'/slug/'index.html'
    if not page.is_file():
        errors.append(f'missing representative demo: {slug}')
        continue
    cfg=BASE.get(slug) or inline_config(slug)
    html=page.read_text(encoding='utf-8')
    if cfg:
        if cfg.get('architecture')!=architecture:
            errors.append(f'{slug} missing architecture {architecture}')
        if cfg.get('sectionRoles')!=roles:
            errors.append(f'{slug} missing differentiated roles {roles}')
    else:
        if f'data-layout-family="{architecture}"' not in html:
            errors.append(f'{slug} missing architecture marker {architecture}')
        for role in roles:
            if f'data-section-role="{role}"' not in html:
                errors.append(f'{slug} missing differentiated section {role}')
    signatures.add((architecture,tuple(roles)))
if len(signatures)!=len(REQUIRED):
    errors.append('representative industries must use unique architecture signatures')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print('PASS industry differentiation contract')
