from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def patch(slug, architecture, replacements):
    p=ROOT/'demos'/slug/'index.html'
    s=p.read_text(encoding='utf-8')
    s=s.replace('data-brioframe-demo="true"',f'data-brioframe-demo="true" data-layout-family="{architecture}"',1)
    for old,new in replacements:
        s=s.replace(old,new,1)
    p.write_text(s,encoding='utf-8')

patch('velvet-nail-atelier','editorial-beauty',[
 ('<section id="services" class="section">','<section id="services" class="section" data-section-role="service-menu">'),
 ('<section id="book" class="booking">','<section id="book" class="booking" data-section-role="booking-flow">'),
])
patch('meridian-supply-co','operations-wholesale',[
 ('<section id="catalog" class="catalog">','<section id="catalog" class="catalog" data-section-role="catalog-path">'),
 ('<section id="account" class="account">','<section id="account" class="account" data-section-role="quote-flow">'),
])
print('marked bespoke architecture roles')
