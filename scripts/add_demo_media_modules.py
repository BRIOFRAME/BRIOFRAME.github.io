from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
p=ROOT/'demos'/'solara-villa-collection'/'index.html'
s=p.read_text(encoding='utf-8')
m=re.search(r'<script type="application/json" data-demo-config>(.*?)</script>',s)
obj=json.loads(m.group(1))
obj['videoSrc']='/assets/demo-media/solara-villa-sample.mp4'
obj['videoPoster']=obj['heroImage']
obj['galleryImages']=[obj['heroImage'],'/assets/demo-media/2857ef204fa01db0.jpg','/assets/demo-media/ce62efca6451f462.jpg']
script='<script type="application/json" data-demo-config>'+json.dumps(obj,separators=(',',':'))+'</script>'
s=s[:m.start()]+script+s[m.end():]
p.write_text(s,encoding='utf-8')
print('added playable video and slider media to Solara variant')
