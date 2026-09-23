import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const mediaPath = path.join(root, "lib/media.ts");
const coveragePath = path.join(root, "scripts/audit-motorcycle-media-coverage.mjs");
const outDir = path.join(root, "public/media/motorcycles");
fs.mkdirSync(outDir, { recursive: true });

const UA = "Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)";
const checkedAt = "2026-09-23";

const targets = [
  { entityId:"bmw-f-900-gs", id:"bmw-f-900-gs-bmw-official", pageUrl:"https://www.bmwmotorcycles.com/en/models/adventure/f900gs.html", terms:["f 900 gs","f900gs"], alt:"BMW F 900 GS adventure motorcycle", rightsHolder:"BMW Motorrad", sourceLabel:"Manufacturer-hosted image reference · BMW F 900 GS" },
  { entityId:"bmw-m-1000-rr", id:"bmw-m-1000-rr-bmw-official", pageUrl:"https://www.bmwmotorcycles.com/en/models/m/m1000rr.html", terms:["m 1000 rr","m1000rr"], alt:"BMW M 1000 RR superbike", rightsHolder:"BMW Motorrad", sourceLabel:"Manufacturer-hosted image reference · BMW M 1000 RR" },
  { entityId:"bmw-s-1000-r", id:"bmw-s-1000-r-bmw-official", pageUrl:"https://www.bmwmotorcycles.com/en/models/roadster/s1000r.html", terms:["s 1000 r","s1000r"], alt:"BMW S 1000 R roadster motorcycle", rightsHolder:"BMW Motorrad", sourceLabel:"Manufacturer-hosted image reference · BMW S 1000 R" },
  { entityId:"bmw-s-1000-rr", id:"bmw-s-1000-rr-bmw-official", pageUrl:"https://www.bmwmotorcycles.com/en/models/sport/s1000rr.html", terms:["s 1000 rr","s1000rr"], alt:"BMW S 1000 RR superbike", rightsHolder:"BMW Motorrad", sourceLabel:"Manufacturer-hosted image reference · BMW S 1000 RR" },
  { entityId:"ducati-panigale-v4", id:"ducati-panigale-v4-ducati-official", pageUrl:"https://www.ducati.com/us/en/bikes/panigale/panigale-v4", terms:["panigale v4"], alt:"Ducati Panigale V4 superbike", rightsHolder:"Ducati", sourceLabel:"Manufacturer-hosted image reference · Ducati Panigale V4" },
  { entityId:"ducati-streetfighter-v4", id:"ducati-streetfighter-v4-ducati-official", pageUrl:"https://www.ducati.com/us/en/bikes/streetfighter/streetfighter-v4", terms:["streetfighter v4"], alt:"Ducati Streetfighter V4 motorcycle", rightsHolder:"Ducati", sourceLabel:"Manufacturer-hosted image reference · Ducati Streetfighter V4" },
  { entityId:"honda-cb500-hornet-e-clutch", id:"honda-cb500-hornet-e-clutch-honda-uk", pageUrl:"https://www.honda.co.uk/motorcycles/range/street/cb500-hornet/overview.html", terms:["cb500 hornet","e-clutch"], alt:"Honda CB500 Hornet E-Clutch motorcycle", rightsHolder:"Honda Motor Europe", sourceLabel:"Manufacturer-hosted image reference · Honda CB500 Hornet E-Clutch" },
  { entityId:"kawasaki-eliminator", id:"kawasaki-eliminator-kawasaki-official", pageUrl:"https://www.kawasaki.com/en-us/motorcycle/eliminator/cruiser/eliminator/2026-eliminator", terms:["eliminator"], alt:"Kawasaki Eliminator cruiser motorcycle", rightsHolder:"Kawasaki Motors Corp., U.S.A.", sourceLabel:"Manufacturer-hosted image reference · Kawasaki Eliminator" },
  { entityId:"kawasaki-ninja-650", id:"kawasaki-ninja-650-kawasaki-official", pageUrl:"https://www.kawasaki.com/en-us/motorcycle/ninja/sport/ninja-650/2026-ninja-650", terms:["ninja 650","ninja-650"], alt:"Kawasaki Ninja 650 sport motorcycle", rightsHolder:"Kawasaki Motors Corp., U.S.A.", sourceLabel:"Manufacturer-hosted image reference · Kawasaki Ninja 650" },
  { entityId:"kawasaki-ninja-h2", id:"kawasaki-ninja-h2-kawasaki-official", pageUrl:"https://www.kawasaki.com/en-us/motorcycle/ninja/hypersport/ninja-h2", terms:["ninja h2"], alt:"Kawasaki Ninja H2 supercharged motorcycle", rightsHolder:"Kawasaki Motors Corp., U.S.A.", sourceLabel:"Manufacturer-hosted image reference · Kawasaki Ninja H2" },
  { entityId:"kawasaki-versys-650", id:"kawasaki-versys-650-kawasaki-official", pageUrl:"https://www.kawasaki.com/en-us/motorcycle/versys/adventure-touring/versys-650", terms:["versys 650","versys-650"], alt:"Kawasaki Versys 650 touring motorcycle", rightsHolder:"Kawasaki Motors Corp., U.S.A.", sourceLabel:"Manufacturer-hosted image reference · Kawasaki Versys 650" },
  { entityId:"kawasaki-vulcan-s", id:"kawasaki-vulcan-s-kawasaki-official", pageUrl:"https://www.kawasaki.com/en-us/motorcycle/vulcan/sport-cruiser/vulcan-s", terms:["vulcan s"], alt:"Kawasaki Vulcan S cruiser motorcycle", rightsHolder:"Kawasaki Motors Corp., U.S.A.", sourceLabel:"Manufacturer-hosted image reference · Kawasaki Vulcan S" },
  { entityId:"kawasaki-z-h2", id:"kawasaki-z-h2-kawasaki-official", pageUrl:"https://www.kawasaki.com/en-us/motorcycle/z/z-hypernaked/z-h2", terms:["z h2"], alt:"Kawasaki Z H2 supercharged motorcycle", rightsHolder:"Kawasaki Motors Corp., U.S.A.", sourceLabel:"Manufacturer-hosted image reference · Kawasaki Z H2" },
  { entityId:"kawasaki-z650", id:"kawasaki-z650-kawasaki-official", pageUrl:"https://www.kawasaki.com/en-us/motorcycle/z/supernaked/z650", terms:["z650","z 650"], alt:"Kawasaki Z650 naked motorcycle", rightsHolder:"Kawasaki Motors Corp., U.S.A.", sourceLabel:"Manufacturer-hosted image reference · Kawasaki Z650" },
  { entityId:"ktm-200-duke", id:"ktm-200-duke-ktm-ph", pageUrl:"https://www.ktm.com/en-ph/models/naked-bike/2023-ktm-200-duke.html", terms:["200 duke","duke-200"], alt:"KTM 200 Duke naked motorcycle", rightsHolder:"KTM", sourceLabel:"Manufacturer-hosted Philippine image reference · KTM 200 Duke" },
  { entityId:"ktm-790-duke", id:"ktm-790-duke-ktm-official", pageUrl:"https://www.ktm.com/en-lk/ktm-world/news/the-original-scalpel-gets-a-sharpening-for-2025-.html", terms:["790 duke","790-duke"], alt:"KTM 790 Duke naked motorcycle", rightsHolder:"KTM", sourceLabel:"Manufacturer-hosted image reference · KTM 790 Duke" },
  { entityId:"triumph-daytona-660", id:"triumph-daytona-660-triumph-official", pageUrl:"https://www.triumphmotorcycles.com/motorcycles/sport/daytona/daytona-660", terms:["daytona 660"], alt:"Triumph Daytona 660 sport motorcycle", rightsHolder:"Triumph Motorcycles", sourceLabel:"Manufacturer-hosted image reference · Triumph Daytona 660" },
  { entityId:"triumph-tiger-sport-660", id:"triumph-tiger-sport-660-triumph-official", pageUrl:"https://www.triumphmotorcycles.com/motorcycles/adventure/tiger-sport/tiger-sport-660", terms:["tiger sport 660"], alt:"Triumph Tiger Sport 660 motorcycle", rightsHolder:"Triumph Motorcycles", sourceLabel:"Manufacturer-hosted image reference · Triumph Tiger Sport 660" },
  { entityId:"royal-enfield-super-meteor-650", id:"royal-enfield-super-meteor-650-re-ph", pageUrl:"https://www.royalenfield.com/ph/en/motorcycles/super-meteor-650/", terms:["super meteor 650"], alt:"Royal Enfield Super Meteor 650 cruiser motorcycle", rightsHolder:"Royal Enfield", sourceLabel:"Manufacturer-hosted Philippine image reference · Super Meteor 650" },
  { entityId:"royal-enfield-classic-650", id:"royal-enfield-classic-650-re-ph", pageUrl:"https://www.royalenfield.com/ph/en/motorcycles/classic-650/", terms:["classic 650"], alt:"Royal Enfield Classic 650 motorcycle", rightsHolder:"Royal Enfield", sourceLabel:"Manufacturer-hosted Philippine image reference · Classic 650" }
];

function decodeHtml(s){ return s.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">"); }
function attrs(tag){ const out={}; for(const m of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) out[m[1].toLowerCase()]=decodeHtml(m[3]); return out; }
function absolute(raw,base){ try{return new URL(decodeHtml(raw),base).href}catch{return null} }
function badImage(url){ return /(?:logo|favicon|sprite|icon|payment|placeholder|spinner|loading|badge|avatar|tracking|pixel|qr|newsletter|flag|footer|header|promotion\.png)/i.test(url); }

async function fetchImage(url, referer){
  const response=await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(30000),headers:{"user-agent":UA,accept:"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",...(referer?{referer}:{})}});
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const type=(response.headers.get("content-type")||"").toLowerCase();
  if(!type.startsWith("image/")) throw new Error(`not image ${type}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  const meta=await sharp(bytes).metadata();
  if((meta.width||0)<300 || (meta.height||0)<250) throw new Error(`too small ${meta.width||0}x${meta.height||0}`);
  return {bytes,url:response.url||url,width:meta.width||0,height:meta.height||0};
}

async function discover(t){
  const response=await fetch(t.pageUrl,{redirect:"follow",signal:AbortSignal.timeout(30000),headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml"}});
  if(!response.ok) throw new Error(`page HTTP ${response.status}`);
  const html=await response.text(); const pageUrl=response.url||t.pageUrl;
  const pageText=html.replace(/<[^>]+>/g," ").replace(/\s+/g," ").toLowerCase();
  if(!t.terms.some(term=>pageText.includes(term.toLowerCase()))) throw new Error("source page does not verify target model");
  const candidates=[];
  const add=(raw,score,label="")=>{
    const url=raw&&absolute(raw,pageUrl); if(!url||!/^https?:/i.test(url)||badImage(url)) return;
    const hay=`${url} ${label}`.toLowerCase();
    const matches=t.terms.filter(term=>hay.includes(term.toLowerCase())).length;
    candidates.push({url,score:score+matches*80,matches});
  };
  for(const tag of html.match(/<img\b[^>]*>/gi)||[]){
    const a=attrs(tag), label=`${a.alt||""} ${a.title||""}`;
    const srcset=a.srcset?.split(",").map(x=>x.trim().split(/\s+/)[0]).filter(Boolean)||[];
    for(const raw of [a.src,a["data-src"],a["data-lazy-src"],a["data-original"],...srcset]) if(raw) add(raw,70,label);
  }
  for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){
    const a=attrs(tag), key=(a.property||a.name||"").toLowerCase();
    if(["og:image","og:image:url","og:image:secure_url"].includes(key)) add(a.content,160,key);
    if(["twitter:image","twitter:image:src"].includes(key)) add(a.content,145,key);
  }
  for(const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
    try{
      const data=JSON.parse(m[1].trim());
      const visit=node=>{
        if(!node)return; if(Array.isArray(node)) return node.forEach(visit); if(typeof node!=="object")return;
        const label=typeof node.name==="string"?node.name:""; const imgs=Array.isArray(node.image)?node.image:[node.image];
        for(const img of imgs){ if(typeof img==="string")add(img,170,label); else if(img&&typeof img.url==="string")add(img.url,170,label); }
        for(const v of Object.values(node)) if(v&&typeof v==="object") visit(v);
      }; visit(data);
    }catch{}
  }
  const unique=[...new Map(candidates.sort((a,b)=>b.score-a.score).map(c=>[c.url,c])).values()];
  let last;
  for(const c of unique.slice(0,35)){
    try{ const hit=await fetchImage(c.url,pageUrl); return {...hit,pageUrl,matched:c.matches}; }catch(e){last=e}
  }
  throw last||new Error("no usable image candidates");
}

function findArrayClose(source,declaration){
  const start=source.indexOf(declaration); if(start<0)throw new Error(`Missing ${declaration}`);
  const open=source.indexOf("[",source.indexOf("=",start)); let depth=0,quote="",inString=false,escaped=false;
  for(let i=open;i<source.length;i++){const ch=source[i]; if(inString){if(escaped)escaped=false;else if(ch==="\\")escaped=true;else if(ch===quote)inString=false;continue;} if(ch==='"'||ch==="'"||ch==="`"){inString=true;quote=ch;continue;} if(ch==="[")depth++; else if(ch==="]"&&--depth===0)return i;}
  throw new Error("Could not find media array close");
}
function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}
function record(t,src){return `  {
    id: ${JSON.stringify(t.id)}, entityType: "motorcycle", entityId: ${JSON.stringify(t.entityId)}, role: "primary",
    src: ${JSON.stringify(`/media/motorcycles/${t.entityId}.webp`)}, sourceImageUrl: ${JSON.stringify(src)}, alt: ${JSON.stringify(t.alt)}, width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: ${JSON.stringify(t.rightsHolder)}, sourceLabel: ${JSON.stringify(t.sourceLabel)}, sourceUrl: ${JSON.stringify(t.pageUrl)}, lastChecked: ${JSON.stringify(checkedAt)}
  },`; }

let media=fs.readFileSync(mediaPath,"utf8");
let coverage=fs.readFileSync(coveragePath,"utf8");
const done=[];
for(const t of targets){
  console.log(`Processing ${t.entityId}...`);
  const hit=await discover(t);
  await sharp(hit.bytes).rotate().resize({width:1200,height:1200,fit:"contain",background:{r:255,g:255,b:255,alpha:1}}).webp({quality:86,effort:4}).toFile(path.join(outDir,`${t.entityId}.webp`));
  const rx=new RegExp(`entityId\\s*:\\s*["']${esc(t.entityId)}["']`);
  if(!rx.test(media)){ const close=findArrayClose(media,"export const entityMedia"); media=media.slice(0,close)+record(t,hit.url)+"\n"+media.slice(close); }
  coverage=coverage.replace(new RegExp(`\\n\\s*"${esc(t.entityId)}",?`),"");
  done.push({entityId:t.entityId,sourceImageUrl:hit.url,sourcePage:t.pageUrl,width:hit.width,height:hit.height,matchedTerms:hit.matched});
  console.log(`✓ ${t.entityId} <- ${hit.url} (${hit.width}x${hit.height})`);
}
fs.writeFileSync(mediaPath,media); fs.writeFileSync(coveragePath,coverage);
console.log(JSON.stringify({completed:done.length,done},null,2));
