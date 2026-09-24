from pathlib import Path
from urllib.parse import urljoin
import json, re, requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO

ROOT = Path.cwd()
MEDIA = ROOT / 'lib/media.ts'
COVERAGE = ROOT / 'scripts/audit-motorcycle-media-coverage.mjs'
OUT = ROOT / 'public/media/motorcycles'
ART = ROOT / 'artifacts'
OUT.mkdir(parents=True, exist_ok=True)
ART.mkdir(parents=True, exist_ok=True)
UA = 'Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)'
DATE = '2026-09-24'

TARGETS = [
('aprilia-tuareg-660','Aprilia Tuareg 660','https://press.piaggiogroup.com/en_EN/post/show/227651/the-piaggio-group-at-eicma-202.html',['tuareg','660'],'Aprilia'),
('aprilia-tuono-660','Aprilia Tuono 660','https://press.piaggiogroup.com/en_EN/post/show/227150/aprilia-tuono-660-factory.html',['tuono','660'],'Aprilia'),
('bajaj-dominar-400','Bajaj Dominar 400','https://www.bajajauto.com/en-ph/bikes/dominar-d400',['dominar','400'],'Bajaj Auto'),
('bajaj-pulsar-n125','Bajaj Pulsar N125','https://www.bajajauto.com/en-ph/bikes/pulsar-n125',['pulsar','n125'],'Bajaj Auto'),
('bajaj-pulsar-n160','Bajaj Pulsar N160','https://www.bajajauto.com/en-ph/bikes/pulsar-n160',['pulsar','n160'],'Bajaj Auto'),
('bajaj-pulsar-ns400z','Bajaj Pulsar NS400Z','https://www.bajajauto.com/en-ph/bikes/pulsar-ns400z',['pulsar','ns400'],'Bajaj Auto'),
('bajaj-pulsar-rs200','Bajaj Pulsar RS200','https://www.bajajauto.com/en-ph/bikes/pulsar-rs200',['pulsar','rs200'],'Bajaj Auto'),
('benelli-302s','Benelli 302S','https://www.benelli.com/ph-en/products/302s-2',['302s','302'],'Benelli'),
('benelli-leoncino-250','Benelli Leoncino 250','https://www.benelli.com/int-en/products/leoncino-250-2/',['leoncino','250'],'Benelli'),
('benelli-trk-502','Benelli TRK 502','https://www.benelli.com/int-en/products/trk-502-2/',['trk','502'],'Benelli'),
('benelli-tnt-135','Benelli TNT 135','https://www.benelli.com/ph-en/products/tnt-135',['tnt','135'],'Benelli'),
('cfmoto-300nk','CFMOTO 300NK','https://www.cfmotoph.com/motorcycle/300nk',['300nk','300 nk'],'CFMOTO Philippines'),
('husqvarna-norden-901','Husqvarna Norden 901','https://www.husqvarna-motorcycles.com/en-ph/models/travel/norden-901-2022.html',['norden','901'],'Husqvarna Motorcycles'),
('husqvarna-svartpilen-200','Husqvarna Svartpilen 200','https://www.husqvarna-motorcycles.com/en-ph/models/naked/svartpilen/svartpilen-200-2023.html',['svartpilen','200'],'Husqvarna Motorcycles'),
('kawasaki-ninja-1000','Kawasaki Ninja 1000SX','https://content.kawasaki.com/en-us/motorcycle/ninja',['ninja','1000sx'],'Kawasaki Motors'),
('kawasaki-ninja-zx-25r','Kawasaki Ninja ZX-25R','https://www.kawasakileisurebikes.ph/motorcycles/supersports/ninja-zx-25r/',['zx-25r','zx25r'],'Kawasaki Motors Philippines'),
('kawasaki-z1000-r-edition','Kawasaki Z1000 R Edition','https://www.kawasakileisurebikes.ph/motorcycles/sports/z100r/',['z1000','z100r'],'Kawasaki Motors Philippines'),
('royal-enfield-shotgun-650','Royal Enfield Shotgun 650','https://www.royalenfield.com/ph/en/motorcycles/shotgun-650/',['shotgun','650'],'Royal Enfield'),
('vespa-primavera-150','Vespa Primavera 150','https://www.vespa.com/en_EN/models/primavera/primavera-150-4s3v-2026/',['primavera','150'],'Piaggio Group'),
('zontes-703rr','Zontes 703RR','https://www.zontes.com/en/Products/ModelsDetailed.aspx?Cid=AB8F10BD02C11226',['703rr','703'],'Zontes'),
]

BAD = re.compile(r'(logo|favicon|sprite|icon|placeholder|spinner|loading|badge|avatar|tracking|pixel|qr|newsletter|flag|footer|header|banner|promo)', re.I)

def fetch(url, accept='text/html,application/xhtml+xml', referer=None):
    h={'User-Agent':UA,'Accept':accept}
    if referer: h['Referer']=referer
    r=requests.get(url,headers=h,timeout=30,allow_redirects=True)
    r.raise_for_status()
    return r

def candidates(page_url, terms):
    r=fetch(page_url)
    soup=BeautifulSoup(r.text,'html.parser')
    page_url=r.url
    title=(soup.title.string if soup.title and soup.title.string else '')
    page_match=any(t.lower() in (title+' '+page_url).lower() for t in terms)
    out=[]
    def add(raw, base, label=''):
        if not raw: return
        u=urljoin(page_url,raw)
        if not u.startswith(('http://','https://')) or BAD.search(u): return
        hay=(u+' '+label).lower()
        matches=sum(1 for t in terms if t.lower() in hay)
        if not matches and not page_match: return
        out.append((base+matches*80+(80 if matches==len(terms) else 0),u,label))
    for img in soup.find_all('img'):
        label=' '.join(filter(None,[img.get('alt'),img.get('title')]))
        for key in ('src','data-src','data-lazy-src','data-original','data-image'):
            add(img.get(key),120,label)
        for bit in (img.get('srcset') or '').split(','):
            if bit.strip(): add(bit.strip().split()[0],120,label)
    for meta in soup.find_all('meta'):
        k=(meta.get('property') or meta.get('name') or '').lower()
        if k in ('og:image','og:image:url','og:image:secure_url'): add(meta.get('content'),80,k+' '+title)
        if k in ('twitter:image','twitter:image:src'): add(meta.get('content'),70,k+' '+title)
    dedup={}
    for score,u,label in sorted(out,reverse=True): dedup.setdefault(u,(score,u,label))
    return page_url,list(dedup.values())

def get_image(page_url, terms):
    final_page, items=candidates(page_url,terms)
    last=None
    for score,u,label in items[:40]:
        try:
            r=fetch(u,'image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8',final_page)
            ctype=(r.headers.get('content-type') or '').lower()
            if not ctype.startswith('image/'): continue
            im=Image.open(BytesIO(r.content)); im.load()
            if im.width<400 or im.height<250: continue
            return final_page,u,r.content,im.width,im.height,score,label
        except Exception as e: last=e
    raise RuntimeError(f'no usable image for {page_url}: {last}')

def array_close(src, marker):
    s=src.index(marker); open_i=src.index('[',src.index('=',s)); d=0; q=None; esc=False
    for i,ch in enumerate(src[open_i:],open_i):
        if q:
            if esc: esc=False
            elif ch=='\\': esc=True
            elif ch==q: q=None
            continue
        if ch in ('"',"'",'`'): q=ch
        elif ch=='[': d+=1
        elif ch==']':
            d-=1
            if d==0:return i
    raise RuntimeError('array close not found')

def record(eid,name,page,holder,imgurl):
    return f'''  {{\n    id: {json.dumps(eid+'-manufacturer')}, entityType: "motorcycle", entityId: {json.dumps(eid)}, role: "primary",\n    src: {json.dumps('/media/motorcycles/'+eid+'.webp')}, sourceImageUrl: {json.dumps(imgurl)}, alt: {json.dumps(name+' motorcycle')}, width: 1200, height: 1200,\n    rightsStatus: "external-reference", rightsHolder: {json.dumps(holder)}, sourceLabel: {json.dumps('Manufacturer-hosted image reference Â· '+name)}, sourceUrl: {json.dumps(page)}, lastChecked: {json.dumps(DATE)}\n  }},'''

media=MEDIA.read_text('utf-8'); coverage=COVERAGE.read_text('utf-8'); done=[]
for eid,name,page,terms,holder in TARGETS:
    print('Processing',eid,flush=True)
    final_page,imgurl,data,w,h,score,label=get_image(page,terms)
    print('candidate',w,h,score,label,imgurl,flush=True)
    im=Image.open(BytesIO(data)).convert('RGB')
    im.thumbnail((1040,900),Image.Resampling.LANCZOS)
    canvas=Image.new('RGB',(1200,1200),'white')
    canvas.paste(im,((1200-im.width)//2,(1200-im.height)//2))
    canvas.save(OUT/f'{eid}.webp','WEBP',quality=88,method=6)
    if not re.search(r'entityId\s*:\s*["\']'+re.escape(eid)+r'["\']',media):
        c=array_close(media,'export const entityMedia')
        media=media[:c]+record(eid,name,page,holder,imgurl)+'\n'+media[c:]
    coverage=re.sub(r'\n\s*"'+re.escape(eid)+r'",?', '', coverage)
    done.append({'entityId':eid,'sourceImageUrl':imgurl,'sourceUrl':page,'finalPage':final_page,'width':w,'height':h,'score':score,'label':label})
    print('OK',eid,flush=True)
MEDIA.write_text(media,'utf-8'); COVERAGE.write_text(coverage,'utf-8')
(ART/'motorcycle-image-wave9.json').write_text(json.dumps({'checkedAt':DATE,'done':done},indent=2),'utf-8')
print('Completed',len(done),'/',len(TARGETS))
