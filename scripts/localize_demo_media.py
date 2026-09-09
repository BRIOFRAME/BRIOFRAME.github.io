from pathlib import Path
from urllib.request import Request, urlopen
import hashlib, re
ROOT=Path(__file__).resolve().parents[1]
MEDIA=ROOT/'assets'/'demo-media'; MEDIA.mkdir(parents=True, exist_ok=True)
files=[]
for base in (ROOT/'demos', ROOT/'data'):
    for p in base.rglob('*'):
        if p.is_file() and p.suffix.lower() in {'.html','.json','.css','.js'}:
            files.append(p)
pattern=re.compile(r'https://images\.unsplash\.com/[^"\' )<\\]+')
urls={}
for p in files:
    text=p.read_text(encoding='utf-8', errors='replace')
    for raw in pattern.findall(text):
        url=raw.replace('&amp;','&')
        urls[raw]=url
for i,(raw,url) in enumerate(sorted(urls.items()),1):
    name=hashlib.sha1(url.encode()).hexdigest()[:16]+'.jpg'
    out=MEDIA/name
    if not out.exists() or out.stat().st_size<10000:
        req=Request(url, headers={'User-Agent':'Mozilla/5.0'})
        with urlopen(req, timeout=30) as r:
            out.write_bytes(r.read())
    local='/assets/demo-media/'+name
    for p in files:
        text=p.read_text(encoding='utf-8', errors='replace')
        if raw in text:
            p.write_text(text.replace(raw,local),encoding='utf-8')
    print(f'{i}/{len(urls)} {name} {out.stat().st_size}')
print(f'localized {len(urls)} demo images')