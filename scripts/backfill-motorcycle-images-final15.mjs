import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const mediaPath = path.join(root, "lib/media.ts");
const coveragePath = path.join(root, "scripts/audit-motorcycle-media-coverage.mjs");
const outDir = path.join(root, "public/media/motorcycles");
const artifactsDir = path.join(root, "artifacts");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(artifactsDir, { recursive: true });

const UA = "Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)";
const checkedAt = "2026-09-24";

const targets = [
  {entityId:"aprilia-tuareg-660",id:"aprilia-tuareg-660-aprilia-store",pageUrl:"https://storeusa.aprilia.com/tuareg660.aspx",terms:["tuareg","660"],alt:"Aprilia Tuareg 660 adventure motorcycle",rightsHolder:"Aprilia",sourceLabel:"Manufacturer store image reference · Aprilia Tuareg 660"},
  {entityId:"aprilia-tuono-660",id:"aprilia-tuono-660-aprilia-store",pageUrl:"https://storeusa.aprilia.com/aprilia-tuono660.aspx",terms:["tuono","660"],alt:"Aprilia Tuono 660 motorcycle",rightsHolder:"Aprilia",sourceLabel:"Manufacturer store image reference · Aprilia Tuono 660"},
  {entityId:"bajaj-pulsar-n125",id:"bajaj-pulsar-n125-bajaj-official",pageUrl:"https://www.bajajauto.com/bikes/pulsar/pulsar-n125",terms:["pulsar","n125"],alt:"Bajaj Pulsar N125 motorcycle",rightsHolder:"Bajaj Auto",sourceLabel:"Manufacturer-hosted image reference · Bajaj Pulsar N125"},
  {entityId:"husqvarna-norden-901",id:"husqvarna-norden-901-husqvarna-ph",pageUrl:"https://www.husqvarna-motorcycles.com/en-ph/models/travel/norden-901-2022.html",terms:["norden","901"],alt:"Husqvarna Norden 901 adventure motorcycle",rightsHolder:"Husqvarna Motorcycles",sourceLabel:"Manufacturer-hosted Philippine image reference · Husqvarna Norden 901"},
  {entityId:"husqvarna-svartpilen-200",id:"husqvarna-svartpilen-200-husqvarna-ph",pageUrl:"https://www.husqvarna-motorcycles.com/en-ph/models/naked/svartpilen/svartpilen-200-2023.html",terms:["svartpilen","200"],alt:"Husqvarna Svartpilen 200 motorcycle",rightsHolder:"Husqvarna Motorcycles",sourceLabel:"Manufacturer-hosted Philippine image reference · Husqvarna Svartpilen 200"},
  {entityId:"kawasaki-ninja-1000",id:"kawasaki-ninja-1000-kawasaki-jp",pageUrl:"https://www.kawasaki-motors.com/ja-jp/motorcycle/ninja/sport/ninja-1000sx/2024-ninja-1000sx",terms:["ninja","1000sx","1000"],alt:"Kawasaki Ninja 1000SX sport touring motorcycle",rightsHolder:"Kawasaki Motors Japan",sourceLabel:"Manufacturer-hosted image reference · Kawasaki Ninja 1000SX"},
  {entityId:"kawasaki-z1000-r-edition",id:"kawasaki-z1000-r-edition-kawasaki-br",pageUrl:"https://kmb.kawasaki-global.com/pt-br/motocicletas/z/supernaked/z1000/2024-z1000-r-edition",terms:["z1000","r edition","z1000 r"],alt:"Kawasaki Z1000 R Edition motorcycle",rightsHolder:"Kawasaki Motors",sourceLabel:"Manufacturer-hosted image reference · Kawasaki Z1000 R Edition"},
  {entityId:"rusi-adventure-x-150i-v2",id:"rusi-adventure-x-150i-v2-kamote",pageUrl:"https://www.kamote.ph/motorcycle/rusi-adventure-x-150i-v2",terms:["adventure x","150i","v2"],alt:"Rusi Adventure X 150i V2 scooter",rightsHolder:"Kamote.ph",sourceLabel:"Philippine exact-model image reference · Rusi Adventure X 150i V2"},
  {entityId:"rusi-cyclone-400",id:"rusi-cyclone-400-kamote",pageUrl:"https://www.kamote.ph/motorcycle/rusi-cyclone-400",terms:["cyclone","400"],alt:"Rusi Cyclone 400 motorcycle",rightsHolder:"Kamote.ph",sourceLabel:"Philippine exact-model image reference · Rusi Cyclone 400"},
  {entityId:"rusi-flash-150x",id:"rusi-flash-150x-kamote",pageUrl:"https://www.kamote.ph/motorcycle/rusi-flash-150x",terms:["flash","150x"],alt:"Rusi Flash 150X motorcycle",rightsHolder:"Kamote.ph",sourceLabel:"Philippine exact-model image reference · Rusi Flash 150X"},
  {entityId:"suzuki-raider-pro",id:"suzuki-raider-pro-suzuki-ph-final",pageUrl:"https://mc.suzuki.com.ph/motorcycles/underbone/",terms:["raider pro","raider","pro"],alt:"Suzuki Raider PRO motorcycle",rightsHolder:"Suzuki Philippines",sourceLabel:"Manufacturer-hosted Philippine image reference · Suzuki Raider PRO"},
  {entityId:"vespa-primavera-150",id:"vespa-primavera-150-vespa-store",pageUrl:"https://storeusa.vespa.com/primavera/primavera-150.aspx",terms:["primavera","150"],alt:"Vespa Primavera 150 scooter",rightsHolder:"Piaggio Group",sourceLabel:"Manufacturer store image reference · Vespa Primavera 150"},
  {entityId:"zontes-150x",id:"zontes-150x-bristol-ph",pageUrl:"https://www.bristol-motorcycles.com/150x",terms:["150x","zontes"],alt:"Zontes 150X scooter",rightsHolder:"Bristol Motorcycles / Zontes",sourceLabel:"Official Philippine distributor image reference · Zontes 150X"},
  {entityId:"zontes-400g",id:"zontes-400g-bristol-ph-final",pageUrl:"https://www.bristol-motorcycles.com/400g",terms:["400g","zontes"],alt:"Zontes 400G adventure scooter",rightsHolder:"Bristol Motorcycles / Zontes",sourceLabel:"Official Philippine distributor image reference · Zontes 400G"},
  {entityId:"zontes-703rr",id:"zontes-703rr-zontes-peru",pageUrl:"https://zontesperu.com/703rr/",terms:["703rr","703 rr","zontes"],alt:"Zontes 703RR sport motorcycle",rightsHolder:"Zontes",sourceLabel:"Official distributor image reference · Zontes 703RR"}
]

function decodeHtml(s){return s.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">");}
function attrs(tag){const out={};for(const m of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs))out[m[1].toLowerCase()]=decodeHtml(m[3]);return out;}
function absolute(raw,base){try{return new URL(decodeHtml(raw),base).href}catch{return null}}
function badImage(url){return /(?:logo|favicon|sprite|icon|payment|placeholder|spinner|loading|badge|avatar|tracking|pixel|qr|newsletter|flag|footer|header|banner|promo)/i.test(url);}

async function fetchImage(url,referer){
  const response=await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(30000),headers:{"user-agent":UA,accept:"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",...(referer?{referer}:{})}});
  if(!response.ok)throw new Error("HTTP "+response.status);
  const type=(response.headers.get("content-type")||"").toLowerCase();
  const bytes=Buffer.from(await response.arrayBuffer());
  const meta=await sharp(bytes).metadata();
  if((meta.width||0)<400||(meta.height||0)<250)throw new Error("too small "+(meta.width||0)+"x"+(meta.height||0));
  return {bytes,finalUrl:response.url||url,width:meta.width||0,height:meta.height||0};
}

async function discover(target){
  let response;
  let pageError;
  for(let attempt=1;attempt<=3;attempt++){
    try{
      response=await fetch(target.pageUrl,{redirect:"follow",signal:AbortSignal.timeout(30000),headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml","accept-language":"en-US,en;q=0.9","cache-control":"no-cache"}});
      if(response.ok) break;
      pageError=new Error("page HTTP "+response.status);
    }catch(error){pageError=error;}
    await new Promise(resolve=>setTimeout(resolve,500*attempt));
  }
  if(!response||!response.ok) throw pageError||new Error("page fetch failed");
  if(!response.ok)throw new Error("page HTTP "+response.status);
  const html=await response.text();
  const pageUrl=response.url||target.pageUrl;
  const candidates=[];
  const add=(raw,base,label="")=>{
    const url=raw&&absolute(raw,pageUrl);if(!url||!/^https?:/i.test(url)||badImage(url))return;
    const hay=(url+" "+label).toLowerCase();
    const matches=target.terms.filter(t=>hay.includes(t.toLowerCase())).length;
    if(matches===0&&base<120)return;
    candidates.push({url,score:base+matches*60,label});
  };
  for(const tag of html.match(/<img\b[^>]*>/gi)||[]){
    const a=attrs(tag),label=(a.alt||"")+" "+(a.title||"")+" "+(a.class||"");
    const srcset=(a.srcset||"").split(",").map(x=>x.trim().split(/\s+/)[0]).filter(Boolean);
    for(const raw of [a.src,a["data-src"],a["data-lazy-src"],a["data-original"],...srcset])if(raw)add(raw,90,label);
  }
  for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){
    const a=attrs(tag),key=(a.property||a.name||"").toLowerCase();
    if(["og:image","og:image:url","og:image:secure_url"].includes(key))add(a.content,130,key);
    if(["twitter:image","twitter:image:src"].includes(key))add(a.content,125,key);
  }
  for(const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
    try{
      const data=JSON.parse(m[1].trim());
      const visit=node=>{
        if(!node)return;if(Array.isArray(node))return node.forEach(visit);if(typeof node!=="object")return;
        const label=typeof node.name==="string"?node.name:"";
        const imgs=Array.isArray(node.image)?node.image:[node.image];
        for(const img of imgs){if(typeof img==="string")add(img,145,label);else if(img&&typeof img.url==="string")add(img.url,145,label);}
        for(const v of Object.values(node))if(v&&typeof v==="object")visit(v);
      };visit(data);
    }catch{}
  }
  const unique=[...new Map(candidates.sort((a,b)=>b.score-a.score).map(c=>[c.url,c])).values()];
  let last;
  for(const c of unique.slice(0,35)){
    try{const hit=await fetchImage(c.url,pageUrl);return {...hit,pageUrl,score:c.score,label:c.label};}catch(e){last=e;}
  }
  throw last||new Error("no usable exact-model image candidate");
}

function findArrayClose(source,declaration){
  const start=source.indexOf(declaration);if(start<0)throw new Error("Missing "+declaration);
  const open=source.indexOf("[",source.indexOf("=",start));let depth=0,quote="",inString=false,escaped=false;
  for(let i=open;i<source.length;i++){const ch=source[i];if(inString){if(escaped)escaped=false;else if(ch==="\\")escaped=true;else if(ch===quote)inString=false;continue;}if(ch==='"'||ch==="'"||ch==="`"){inString=true;quote=ch;continue;}if(ch==="[")depth++;else if(ch==="]"&&--depth===0)return i;}
  throw new Error("Could not find entityMedia array close");
}
function esc(s){return s.replace(/[.*+?^$()|[\]\\]/g,"\\$&");}
function renderRecord(t,sourceImageUrl){
  return '  {\n    id: '+JSON.stringify(t.id)+', entityType: "motorcycle", entityId: '+JSON.stringify(t.entityId)+', role: "primary",\n    src: '+JSON.stringify("/media/motorcycles/"+t.entityId+".webp")+', sourceImageUrl: '+JSON.stringify(sourceImageUrl)+', alt: '+JSON.stringify(t.alt)+', width: 1200, height: 1200,\n    rightsStatus: "external-reference", rightsHolder: '+JSON.stringify(t.rightsHolder)+', sourceLabel: '+JSON.stringify(t.sourceLabel)+', sourceUrl: '+JSON.stringify(t.pageUrl)+', lastChecked: '+JSON.stringify(checkedAt)+'\n  },';
}

let media=fs.readFileSync(mediaPath,"utf8");
let coverage=fs.readFileSync(coveragePath,"utf8");
const completed=[],failures=[];

for(const target of targets){
  try{
    console.log("Processing "+target.entityId+"...");
    const source=await discover(target);
    const output=path.join(outDir,target.entityId+".webp");
    await sharp(source.bytes).rotate().resize({width:1200,height:1200,fit:"contain",withoutEnlargement:false,background:{r:255,g:255,b:255,alpha:1}}).webp({quality:86,effort:4}).toFile(output);
    const existing=new RegExp('entityId\\s*:\\s*["\\\']'+esc(target.entityId)+'["\\\']').test(media);
    if(!existing){const close=findArrayClose(media,"export const entityMedia");media=media.slice(0,close)+renderRecord(target,source.finalUrl)+"\n"+media.slice(close);}
    coverage=coverage.replace(new RegExp('\\n\\s*"'+esc(target.entityId)+'",?'),"");
    completed.push({entityId:target.entityId,sourceImageUrl:source.finalUrl,sourceUrl:target.pageUrl,width:source.width,height:source.height});
    console.log("✓ "+target.entityId+" <- "+source.finalUrl);
  }catch(error){
    const message=error instanceof Error?error.message:String(error);
    failures.push({entityId:target.entityId,error:message});
    console.log("✗ "+target.entityId+": "+message);
  }
}
fs.writeFileSync(mediaPath,media);
fs.writeFileSync(coveragePath,coverage);
fs.writeFileSync(path.join(artifactsDir,"motorcycle-image-final15.json"),JSON.stringify({checkedAt,completed,failures},null,2));
console.log("Final image backlog: completed "+completed.length+"/"+targets.length+"; failures: "+failures.length);
if(failures.length)process.exit(2);
