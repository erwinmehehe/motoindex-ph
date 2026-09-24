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
  {entityId:"bristol-basilica-125",id:"bristol-basilica-125-bristol-official",pageUrl:"https://www.bristol-motorcycles.com/basilica",terms:["basilica","125"],alt:"Bristol Basilica 125 scooter",rightsHolder:"Bristol Motorcycles",sourceLabel:"Official Philippine distributor image reference · Bristol Basilica 125"},
  {entityId:"bristol-maxxie-160",id:"bristol-maxxie-160-bristol-official",pageUrl:"https://www.bristol-motorcycles.com/maxxie-160",terms:["maxxie","160"],alt:"Bristol Maxxie 160 scooter",rightsHolder:"Bristol Motorcycles",sourceLabel:"Official Philippine distributor image reference · Bristol Maxxie 160"},
  {entityId:"bajaj-dominar-400",id:"bajaj-dominar-400-bajaj-ph",pageUrl:"https://www.bajajauto.com/en-ph/bikes/dominar-d400",terms:["dominar","d400","400"],alt:"Bajaj Dominar 400 motorcycle",rightsHolder:"Bajaj Auto",sourceLabel:"Manufacturer-hosted Philippine image reference · Bajaj Dominar D400"},
  {entityId:"bajaj-pulsar-n125",id:"bajaj-pulsar-n125-bajaj-ph",pageUrl:"https://www.bajajauto.com/en-ph/bikes/pulsar-n125",terms:["pulsar","n125"],alt:"Bajaj Pulsar N125 motorcycle",rightsHolder:"Bajaj Auto",sourceLabel:"Manufacturer-hosted Philippine image reference · Bajaj Pulsar N125"},
  {entityId:"bajaj-pulsar-n160",id:"bajaj-pulsar-n160-bajaj-ph",pageUrl:"https://www.bajajauto.com/en-ph/bikes/pulsar-n160",terms:["pulsar","n160"],alt:"Bajaj Pulsar N160 motorcycle",rightsHolder:"Bajaj Auto",sourceLabel:"Manufacturer-hosted Philippine image reference · Bajaj Pulsar N160"},
  {entityId:"bajaj-pulsar-ns400z",id:"bajaj-pulsar-ns400z-bajaj-ph",pageUrl:"https://www.bajajauto.com/en-ph/bikes/pulsar-ns400z",terms:["pulsar","ns400","400z"],alt:"Bajaj Pulsar NS400Z motorcycle",rightsHolder:"Bajaj Auto",sourceLabel:"Manufacturer-hosted Philippine image reference · Bajaj Pulsar NS400Z"},
  {entityId:"bajaj-pulsar-rs200",id:"bajaj-pulsar-rs200-bajaj-ph",pageUrl:"https://www.bajajauto.com/en-ph/bikes/pulsar-rs200",terms:["pulsar","rs200"],alt:"Bajaj Pulsar RS200 motorcycle",rightsHolder:"Bajaj Auto",sourceLabel:"Manufacturer-hosted Philippine image reference · Bajaj Pulsar RS200"},
  {entityId:"cfmoto-300nk",id:"cfmoto-300nk-cfmoto-ph",pageUrl:"https://www.cfmotoph.com/motorcycle/300nk",terms:["300nk","300 nk"],alt:"CFMOTO 300NK motorcycle",rightsHolder:"CFMOTO Philippines",sourceLabel:"Manufacturer-hosted Philippine image reference · CFMOTO 300NK"},
  {entityId:"husqvarna-norden-901",id:"husqvarna-norden-901-husqvarna-ph",pageUrl:"https://www.husqvarna-motorcycles.com/en-ph/models/travel/norden-901-2022.html",terms:["norden","901"],alt:"Husqvarna Norden 901 adventure motorcycle",rightsHolder:"Husqvarna Motorcycles",sourceLabel:"Manufacturer-hosted Philippine image reference · Husqvarna Norden 901"},
  {entityId:"husqvarna-svartpilen-200",id:"husqvarna-svartpilen-200-husqvarna-ph",pageUrl:"https://www.husqvarna-motorcycles.com/en-ph/models/naked/svartpilen/svartpilen-200-2023.html",terms:["svartpilen","200"],alt:"Husqvarna Svartpilen 200 motorcycle",rightsHolder:"Husqvarna Motorcycles",sourceLabel:"Manufacturer-hosted Philippine image reference · Husqvarna Svartpilen 200"},
  {entityId:"kawasaki-ninja-1000",id:"kawasaki-ninja-1000-kawasaki-jp",pageUrl:"https://www.kawasaki-motors.com/ja-jp/motorcycle/ninja/sport/ninja-1000sx/2024-ninja-1000sx",terms:["ninja","1000sx","1000"],alt:"Kawasaki Ninja 1000SX sport touring motorcycle",rightsHolder:"Kawasaki Motors Japan",sourceLabel:"Manufacturer-hosted image reference · Kawasaki Ninja 1000SX"},
  {entityId:"kawasaki-ninja-zx-25r",id:"kawasaki-ninja-zx-25r-kawasaki-jp",pageUrl:"https://www.kawasaki-motors.com/ja-jp/motorcycle/ninja/supersport/ninja-zx-25r/2027-ninja-zx-25r-se",terms:["ninja","zx-25r","zx25r"],alt:"Kawasaki Ninja ZX-25R SE motorcycle",rightsHolder:"Kawasaki Motors Japan",sourceLabel:"Manufacturer-hosted image reference · Kawasaki Ninja ZX-25R SE"},
  {entityId:"kymco-agility-eco-125i",id:"kymco-agility-eco-125i-kymco-ph",pageUrl:"https://kymco.com.ph/product/agility-eco-125i/",terms:["agility","eco","125"],alt:"KYMCO Agility Eco 125i scooter",rightsHolder:"KYMCO Philippines",sourceLabel:"Manufacturer-hosted Philippine image reference · KYMCO Agility Eco 125i"},
  {entityId:"kymco-dink-r-150",id:"kymco-dink-r-150-kymco-ph",pageUrl:"https://kymco.com.ph/product/dink-r-150/",terms:["dink","r 150","r-150"],alt:"KYMCO Dink R 150 scooter",rightsHolder:"KYMCO Philippines",sourceLabel:"Manufacturer-hosted Philippine image reference · KYMCO Dink R 150"},
  {entityId:"kymco-dink-s-150",id:"kymco-dink-s-150-kymco-ph",pageUrl:"https://kymco.com.ph/product/dink-s-150/",terms:["dink","s 150","s-150"],alt:"KYMCO Dink S 150 scooter",rightsHolder:"KYMCO Philippines",sourceLabel:"Manufacturer-hosted Philippine image reference · KYMCO Dink S 150"},
  {entityId:"kymco-dtx360-300",id:"kymco-dtx360-300-kymco-ph",pageUrl:"https://kymco.com.ph/product/dtx-360-300/",terms:["dtx360","dtx 360","300"],alt:"KYMCO DTX360 300 scooter",rightsHolder:"KYMCO Philippines",sourceLabel:"Manufacturer-hosted Philippine image reference · KYMCO DTX360-300"},
  {entityId:"kymco-sky-town-150",id:"kymco-sky-town-150-kymco-ph",pageUrl:"https://kymco.com.ph/product/sky-town-150/",terms:["sky town","skytown","150"],alt:"KYMCO Sky Town 150 scooter",rightsHolder:"KYMCO Philippines",sourceLabel:"Manufacturer-hosted Philippine image reference · KYMCO Sky Town 150"},
  {entityId:"kymco-dollar-150",id:"kymco-dollar-150-kymco-ph",pageUrl:"https://kymco.com.ph/product/dollar-150/",terms:["dollar","150"],alt:"KYMCO Dollar 150 scooter",rightsHolder:"KYMCO Philippines",sourceLabel:"Manufacturer-hosted Philippine image reference · KYMCO Dollar 150"},
  {entityId:"royal-enfield-shotgun-650",id:"royal-enfield-shotgun-650-re-ph",pageUrl:"https://www.royalenfield.com/ph/en/motorcycles/shotgun-650/",terms:["shotgun","650"],alt:"Royal Enfield Shotgun 650 motorcycle",rightsHolder:"Royal Enfield",sourceLabel:"Manufacturer-hosted Philippine image reference · Royal Enfield Shotgun 650"},
  {entityId:"keeway-cafe-racer-152",id:"keeway-cafe-racer-152-keeway-ph",pageUrl:"https://www.keeway.com/ph-en/products/cafe-racer-152",terms:["cafe racer","152"],alt:"Keeway Cafe Racer 152 motorcycle",rightsHolder:"Keeway",sourceLabel:"Manufacturer-hosted Philippine image reference · Keeway Cafe Racer 152"}
];

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
  const response=await fetch(target.pageUrl,{redirect:"follow",signal:AbortSignal.timeout(30000),headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml"}});
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
fs.writeFileSync(path.join(artifactsDir,"motorcycle-image-wave9.json"),JSON.stringify({checkedAt,completed,failures},null,2));
console.log("Completed "+completed.length+"/"+targets.length+"; failures: "+failures.length);
if(failures.length)process.exit(2);
