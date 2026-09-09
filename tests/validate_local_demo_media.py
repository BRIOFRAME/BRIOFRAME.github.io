from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
scan=[]
for base in (ROOT/'demos', ROOT/'data'):
    for p in base.rglob('*'):
        if p.is_file() and p.suffix.lower() in {'.html','.json','.css','.js'}:
            scan.append(p)
remote=[]
for p in scan:
    text=p.read_text(encoding='utf-8', errors='replace')
    if 'images.unsplash.com' in text:
        remote.append(str(p.relative_to(ROOT)))
if remote:
    raise SystemExit('FAIL remote demo media remains:\n'+'\n'.join(remote))
print('PASS demo media is local')