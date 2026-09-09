from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
ARCH={
'aerolustre-aircraft-detailing':('aviation-detailing',['service-hangar','finish-proof']),
'altitude-aviation-services':('cinematic-aviation',['fleet-capabilities','safety-proof']),
'apex-auto-detail-auto-detailing-website-template':('performance-auto',['transformation-gallery','service-booking']),
'atlas-freight-logistics-logistics-freight-website-template':('logistics-control',['lane-capabilities','quote-proof']),
'aurelia-med-spa':('medspa-luxury',['treatment-menu','consultation-flow']),
'avery-cole-law':('authority-legal',['practice-areas','case-proof']),
'azure-cay-villa-estates':('villa-estates',['estate-gallery','concierge-flow']),
'bluewater-charter-fishing':('charter-adventure',['trip-options','booking-proof']),
'common-ground-foundation-nonprofit-community-website-template':('nonprofit-impact',['impact-programs','donor-proof']),
'crescent-private-wealth':('wealth-editorial',['planning-framework','fiduciary-proof']),
'elevate-catering':('catering-editorial',['occasion-menu','event-flow']),
'encore-creator-studio':('creator-portfolio',['showcase-grid','inquiry-flow']),
'founders-circle-club':('membership-club',['member-benefits','join-flow']),
'harbor-dental-studio-dental-medical-practice-website-template':('dental-care',['care-services','patient-flow']),
'ledgerline-tax-accounting-accounting-firm-website-template':('accounting-clarity',['advisory-services','client-flow']),
'little-grove-early-learning-daycare-childcare-website-template':('childcare-warm',['programs','tour-flow']),
'lumiere-photography-studio-photography-website-template':('photo-editorial',['portfolio-story','availability-flow']),
'maison-elan-catering':('catering-luxury',['menu-story','event-planning']),
'mariners-house-yacht-club':('yacht-club',['club-life','membership-flow']),
'meridian-concierge-medicine':('trust-healthcare',['care-model','appointment-flow']),
'monarch-estates':('luxury-realestate',['property-portfolio','showing-flow']),
'nexa-systems':('tech-systems',['solution-stack','review-flow']),
'northstar-advisory-group':('advisory-executive',['advisory-model','fit-call']),
'northstar-home-climate-hvac-home-services-website-template':('home-service',['service-priority','schedule-flow']),
'pulsewell-studio':('wellness-studio',['program-path','membership-flow']),
'runway-club-aviation-society':('aviation-club',['club-programs','member-flow']),
'sable-skin-studio':('skincare-editorial',['treatment-story','consultation-flow']),
'skytable-aviation-catering':('aviation-catering',['flight-menus','dispatch-flow']),
'solara-villa-collection':('immersive-villa',['property-story','availability-flow']),
'sterling-family-law':('family-law',['family-practices','consultation-flow']),
'tidalmark-yacht-charter':('yacht-charter',['charter-fleet','inquiry-flow']),
'vertex-cyber-partners':('cybersecurity',['risk-capabilities','assessment-flow']),
}
base_path=ROOT/'data'/'demo-config.json'
base=json.loads(base_path.read_text(encoding='utf-8'))
for slug,(architecture,roles) in ARCH.items():
    if slug in base:
        base[slug]['architecture']=architecture
        base[slug]['sectionRoles']=roles
base_path.write_text(json.dumps(base,indent=2),encoding='utf-8')

for slug,(architecture,roles) in ARCH.items():
    if slug in base:
        continue
    p=ROOT/'demos'/slug/'index.html'
    if not p.is_file():
        continue
    s=p.read_text(encoding='utf-8')
    m=re.search(r'<script type="application/json" data-demo-config>(.*?)</script>',s)
    if not m:
        continue
    obj=json.loads(m.group(1))
    obj['architecture']=architecture
    obj['sectionRoles']=roles
    script='<script type="application/json" data-demo-config>'+json.dumps(obj,separators=(',',':'))+'</script>'
    p.write_text(s[:m.start()]+script+s[m.end():],encoding='utf-8')
print(f'assigned {len(ARCH)} runtime industry architectures')
