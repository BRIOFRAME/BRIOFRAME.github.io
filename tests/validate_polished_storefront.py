from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
t=(ROOT/"index.html").read_text(encoding="utf-8")
d=(ROOT/"design-studio/index.html").read_text(encoding="utf-8")
c=(ROOT/"assets/css/site.css").read_text(encoding="utf-8")
checks={
 "template premium hero": "template-hero__stage" in t,
 "template trust strip": "studio-proof" in t,
 "design client scene": "studio-people" in d,
 "design large display": "studio-display" in d,
 "design portfolio visuals": "portfolio-card__visual" in d,
 "sideways type": "side-label" in d,
 "premium responsive scene": "studio-people" in c and "@media (max-width: 760px)" in c,
 "clean copyright": "??" not in t and "??" not in t,
}
failed=[k for k,v in checks.items() if not v]
if failed: raise SystemExit("FAIL polished storefront: "+", ".join(failed))
print("PASS polished storefront")
