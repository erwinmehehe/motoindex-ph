import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const root=process.cwd(), mediaPath=path.join(root,'lib/media.ts'), coveragePath=path.join(root,'scripts/audit-motorcycle-media-coverage.mjs'), outDir=path.join(root,'public/media/motorcycles');
fs.mkdirSync(outDir,{recursive:true});
const UA='Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)', checkedAt='2026-09-24';
const targets=[
['aprilia-tuareg-660','Aprilia Tuareg 660','https://www.aprilia.com/us_EN/models/tuareg/AP6136500YCT00/',['tuareg','660'],'Aprilia'],
['aprilia-tuono-660','Aprilia Tuono 660','https://www.aprilia.com/my_EN/models/tuono-660/',['tuono','660'],'Aprilia'],
['bajaj-dominar-400','Bajaj Dominar 400','https://www.bajajauto.com/en-ph/bikes/dominar-d400',['dominar','400'],'Bajaj Auto'],
['bajaj-pulsar-n125','Bajaj Pulsar N125','https://www.bajajauto.com/en-ph/bikes/pulsar-n125',['pulsar','n125'],'Bajaj Auto'],
['bajaj-pulsar-n160','Bajaj Pulsar N160','https://www.bajajauto.com/en-ph/bikes/pulsar-n160',['pulsar','n160'],'Bajaj Auto'],
['bajaj-pulsar-ns400z','Bajaj Pulsar NS400Z','https://www.bajajauto.com/en-ph/bikes/pulsar-ns400z',['pulsar','ns400'],'Bajaj Auto'],
['bajaj-pulsar-rs200','Bajaj Pulsar RS200','https://www.bajajauto.com/en-ph/bikes/pulsar-rs200',['pulsar','rs200'],'Bajaj Auto'],
['benelli-302s','Benelli 302S','https://www.benelli.com/ph-en/products/302s-2',['302s','302'],'Benelli'],
['benelli-leoncino-250','Benelli Leoncino 250','https://www.benelli.com/int-en/products/leoncino-250-2/',['leoncino','250'],'Benelli'],
['benelli-trk-502','Benelli TRK 502','https://www.benelli.com/int-en/products/trk-502-2/',['trk','502'],'Benelli'],
['benelli-tnt-135','Benelli TNT 135','https://www.benelli.com/ph-en/products/tnt-135',['tnt','135'],'Benelli'],
['cfmoto-300nk','CFMOTO 300NK','https://www.cfmotoph.com/motorcycle/300nk',['300nk','300 nk'],'CFMOTO Philippines'],
['husqvarna-norden-901','Husqvarna Norden 901','https://www.husqvarna-motorcycles.com/en-ph/models/travel/norden-901-2022.html',['norden','901'],'Husqvarna Motorcycles'],
['husqvarna-svartpilen-200','Husqvarna Svartpilen 200','https://www.husqvarna-motorcycles.com/en-ph/models/naked/svartpilen/svartpilen-200-2023.html',['svartpilen','200'],'Husqvarna Motorcycles'],
['kawasaki-ninja-1000','Kawasaki Ninja 1000SX','https://content.kawasaki.com/en-us/motorcycle/ninja',['ninja','1000sx'],'Kawasaki Motors'],
['kawasaki-ninja-zx-25r','Kawasaki Ninja ZX-25R','https://www.kawasakileisurebikes.ph/motorcycles/supersports/ninja-zx-25r/',['zx-25r','zx25r'],'Kawasaki Motors Philippines'],
['kawasaki-z1000-r-edition','Kawasaki Z1000 R Edition','https://www.kawasakileisurebikes.ph/motorcycles/sports/z100r/',['z1000','z100r'],'Kawasaki Motors Philippines'],
['royal-enfield-shotgun-650','Royal Enfield Shotgun 650','https://www.royalenfield.com/ph/en/motorcycles/shotgun-650/',['shotgun','650'],'Royal Enfield'],
['vespa-primavera-150','Vespa Primavera 150','https://www.vespa.com/en_EN/models/primavera/primavera-150-4s3v-2026/',['primavera','150'],'Piaggio Group'],
['zontes-703rr','Zontes 703RR','https://www.zontes.com/en/Products/ModelsDetailed.aspx?Cid=AB8F10BD02C11226',['703rr','703'],'Zontes']
].map(x=>({entityId:x[0],name:x[1],pageUrl:x[2],terms:x[3],rightsHolder:x[4]}));
function dec(s=''){return s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>')}
function attrs(tag){const o={}; for(const m of tag.matchAll(/([:\\w-]+)\\s*=\\s*(["'])(.*?)\\2/gs))o[m[1].toLowerCase()]=dec(m[3]); return o}
function abs(raw,base){try{return new URL(dec(raw),base).href}catch{return null}}
function bad(u){return /(?:logo|favicon|sprite|icon|placeholder|spinner|loading|badge|avatar|tracking|pixel|qr|newsletter|flag|footer|header|banner|promo)/i.test(u)}
function esc(s){return s.replace(/[.*+?^$()|[\\]\\{}]/g,'\\$&')}
async function getImg(url,referer){const r=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(30000),headers:{'user-agent':UA,accept:'image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8',...(referer?{referer}:{})}}); if(!r.ok)throw new Error('HTTP '+r.status); const type=(r.headers.get('content-type')||'').toLowerCase(); if(!type.startsWith('image/'))throw new Error('not image '+type); const bytes=Buffer.from(await r.arrayBuffer()), meta=await sharp(bytes).metadata(); if((meta.width||0)<400||(meta.height||0)<250)throw new Error('too small '+(meta.width||0)+'x'+(meta.height||0)); return {bytes,finalUrl:r.url||url,width:meta.width||0,height:meta.height||0}}
async function discover(t){const r=await fetch(t.pageUrl,{redirect:'follow',signal:AbortSignal.timeout(30000),headers:{'user-agent':UA,accept:'text/html,application/xhtml+xml'}}); if(!r.ok)throw new Error('page HTTP '+r.status); const html=await r.text(), pageUrl=r.url||t.pageUrl, title=dec((html.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i)||[,''])[1]), pageHay=(title+' '+pageUrl).toLowerCase(), pageMatch=t.terms.some(x=>pageHay.includes(x)); const c=[]; const add=(raw,base,label='')=>{const u=raw&&abs(raw,pageUrl); if(!u||!/^https?:/i.test(u)||bad(u))return; const hay=(u+' '+label).toLowerCase(), matches=t.terms.filter(x=>hay.includes(x)).length; if(!matches&&!pageMatch)return; c.push({url:u,score:base+matches*80+(matches===t.terms.length?80:0),label})};
for(const tag of html.match(/<img\\b[^>]*>/gi)||[]){const a=attrs(tag), label=(a.alt||'')+' '+(a.title||''), ss=(a.srcset||'').split(',').map(x=>x.trim().split(/\\s+/)[0]).filter(Boolean); [a.src,a['data-src'],a['data-lazy-src'],a['data-original'],a['data-image'],...ss].filter(Boolean).forEach(x=>add(x,120,label))}
for(const tag of html.match(/<meta\\b[^>]*>/gi)||[]){const a=attrs(tag), k=(a.property||a.name||'').toLowerCase(); if(['og:image','og:image:url','og:image:secure_url'].includes(k))add(a.content,80,k+' '+title); if(['twitter:image','twitter:image:src'].includes(k))add(a.content,70,k+' '+title)}
const uniq=[...new Map(c.sort((a,b)=>b.score-a.score).map(x=>[x.url,x])).values()]; let last; for(const x of uniq.slice(0,40)){try{return {...await getImg(x.url,pageUrl),pageUrl,label:x.label,score:x.score}}catch(e){last=e}} throw last||new Error('no usable image')}
function arrayClose(src,name){const s=src.indexOf(name), open=src.indexOf('[',src.indexOf('=',s)); let d=0,q='',str=false,e=false; for(let i=open;i<src.length;i++){const ch=src[i]; if(str){if(e)e=false; else if(ch==='\\\\')e=true; else if(ch===q)str=false; continue} if(ch==='"'||ch==="'"||ch==='`'){str=true;q=ch;continue} if(ch==='[')d++; else if(ch===']'&&--d===0)return i} throw new Error('array close')}
function rec(t,u){return '  {\\n    id: '+JSON.stringify(t.entityId+'-manufacturer')+', entityType: "motorcycle", entityId: '+JSON.stringify(t.entityId)+', role: "primary",\\n    src: '+JSON.stringify('/media/motorcycles/'+t.entityId+'.webp')+', sourceImageUrl: '+JSON.stringify(u)+', alt: '+JSON.stringify(t.name+' motorcycle')+', width: 1200, height: 1200,\\n    rightsStatus: "external-reference", rightsHolder: '+JSON.stringify(t.rightsHolder)+', sourceLabel: '+JSON.stringify('Manufacturer-hosted image reference - '+t.name)+', sourceUrl: '+JSON.stringify(t.pageUrl)+', lastChecked: '+JSON.stringify(checkedAt)+'\\n  },'}
let media=fs.readFileSync(mediaPath,'utf8'), coverage=fs.readFileSync(coveragePath,'utf8'); const done=[];
for(const t of targets){console.log('Processing '+t.entityId); const s=await discover(t); console.log('candidate '+s.width+'x'+s.height+' score='+s.score+' '+s.label); await sharp(s.bytes).rotate().resize({width:1200,height:1200,fit:'contain',background:{r:255,g:255,b:255,alpha:1}}).webp({quality:88,effort:4}).toFile(path.join(outDir,t.entityId+'.webp')); const exists=new RegExp('entityId\\\\s*:\\\\s*["\\\']'+esc(t.entityId)+'["\\\']').test(media); if(!exists){const c=arrayClose(media,'export const entityMedia'); media=media.slice(0,c)+rec(t,s.finalUrl)+'\\n'+media.slice(c)} coverage=coverage.replace(new RegExp('\\\\n\\\\s*"'+esc(t.entityId)+'",?'),''); done.push({entityId:t.entityId,sourceImageUrl:s.finalUrl,pageUrl:t.pageUrl}); console.log('OK '+t.entityId)}
fs.writeFileSync(mediaPath,media); fs.writeFileSync(coveragePath,coverage); fs.writeFileSync(path.join(root,'artifacts/motorcycle-image-wave9.json'),JSON.stringify({checkedAt,done},null,2)); console.log('Completed '+done.length+'/'+targets.length);
