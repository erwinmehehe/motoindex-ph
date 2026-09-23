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

async function fetchWithRetry(url, options, attempts=3) {
  let lastError;
  for (let attempt=1; attempt<=attempts; attempt++) {
    try {
      const response=await fetch(url, options);
      if (response.ok || response.status < 500) return response;
      lastError=new Error(`HTTP ${response.status} ${url}`);
    } catch (error) {
      lastError=error;
    }
    if (attempt < attempts) await new Promise(resolve=>setTimeout(resolve, 1200*attempt));
  }
  throw lastError || new Error(`fetch failed ${url}`);
}

const targets = [
  ["cfmoto-300nk","CFMOTO 300NK","https://www.cfmotoph.com/motorcycle/300nk",["300nk","300 nk"],"CFMOTO Philippines","Official Philippine distributor image reference · CFMOTO 300NK"],
  ["keeway-cafe-racer-152","Keeway Cafe Racer 152","https://www.keeway.com/ph-en/products/cafe-racer-152",["cafe racer 152","cafe-racer-152"],"Keeway","Manufacturer-hosted image reference · Keeway Cafe Racer 152"],
  ["bajaj-dominar-400","Bajaj Dominar 400","https://www.bajajauto.com/bikes/dominar/dominar-400",["dominar 400","dominar-400"],"Bajaj Auto","Manufacturer-hosted image reference · Bajaj Dominar 400"],
  ["bristol-maxxie-160","Bristol Maxxie 160","https://www.bristol-motorcycles.com/maxxie-160",["maxxie 160","maxxie"],"Bristol Motorcycles","Philippine distributor image reference · Bristol Maxxie 160"],
  ["bajaj-pulsar-n160","Bajaj Pulsar N160","https://www.bajajauto.com/bikes/pulsar/pulsar-n160",["pulsar n160","n160"],"Bajaj Auto","Manufacturer-hosted image reference · Bajaj Pulsar N160"],
  ["bajaj-pulsar-ns400z","Bajaj Pulsar NS400Z","https://www.bajajauto.com/bikes/pulsar/pulsar-ns400z",["pulsar ns400z","ns400z"],"Bajaj Auto","Manufacturer-hosted image reference · Bajaj Pulsar NS400Z"],
  ["bajaj-pulsar-rs200","Bajaj Pulsar RS200","https://www.bajajauto.com/bikes/pulsar/pulsar-rs200",["pulsar rs200","rs200"],"Bajaj Auto","Manufacturer-hosted image reference · Bajaj Pulsar RS200"],
  ["benelli-302s","Benelli 302S","https://www.benelli.com/ph-en/products/302s-2",["302s","302 s"],"Benelli","Manufacturer-hosted image reference · Benelli 302S"],
  ["benelli-leoncino-250","Benelli Leoncino 250","https://www.benelli.com/ph-en/products/leoncino-250",["leoncino 250","leoncino"],"Benelli","Manufacturer-hosted image reference · Benelli Leoncino 250"],
  ["benelli-tnt-135","Benelli TNT 135","https://www.benelli.com/ph-en/products/tnt-135",["tnt 135","tnt135"],"Benelli","Manufacturer-hosted image reference · Benelli TNT 135"],
  ["benelli-trk-502","Benelli TRK 502","https://www.benelli.com/ph-en/products/trk-502-3/",["trk 502","trk502"],"Benelli","Manufacturer-hosted image reference · Benelli TRK 502"],
  ["bristol-basilica-125","Bristol Basilica 125","https://www.bristol-motorcycles.com/basilica",["basilica 125","basilica"],"Bristol Motorcycles","Philippine distributor image reference · Bristol Basilica 125"],
  ["kawasaki-ninja-zx-25r","Kawasaki Ninja ZX-25R","https://kawasakileisurebikes.ph/motorcycles/supersports/ninja-zx-25r-standard/",["ninja zx-25r","zx-25r","zx25r"],"Kawasaki Motors Philippines","Manufacturer-hosted image reference · Kawasaki Ninja ZX-25R"],
  ["royal-enfield-shotgun-650","Royal Enfield Shotgun 650","https://www.royalenfield.com/ph/en/motorcycles/shotgun-650/",["shotgun 650","shotgun-650"],"Royal Enfield","Manufacturer-hosted image reference · Royal Enfield Shotgun 650"],
  ["kymco-agility-eco-125i","Kymco Agility Eco 125i","https://kymco.com.ph/product/agility-eco-125i/",["agility eco 125i","agility-eco-125i"],"Kymco Philippines","Manufacturer-hosted image reference · Kymco Agility Eco 125i"],
  ["kymco-dink-r-150","Kymco Dink R 150","https://kymco.com.ph/product/dink-r-150/",["dink r 150","dink-r-150"],"Kymco Philippines","Manufacturer-hosted image reference · Kymco Dink R 150"],
  ["kymco-dink-s-150","Kymco Dink S 150","https://kymco.com.ph/product/dink-s-150/",["dink s 150","dink-s-150"],"Kymco Philippines","Manufacturer-hosted image reference · Kymco Dink S 150"],
  ["kymco-dollar-150","Kymco Dollar 150","https://kymco.com.ph/product/dollar-150/",["dollar 150","dollar-150"],"Kymco Philippines","Manufacturer-hosted image reference · Kymco Dollar 150"],
  ["kymco-sky-town-150","Kymco Sky Town 150","https://kymco.com.ph/product/sky-town-150/",["sky town 150","sky-town-150","skytown 150"],"Kymco Philippines","Manufacturer-hosted image reference · Kymco Sky Town 150"],
  ["kymco-dtx360-300","Kymco DTX360 300","https://kymco.com.ph/product/dtx-360-300/",["dtx360","dtx 360","dtx-360"],"Kymco Philippines","Manufacturer-hosted image reference · Kymco DTX360 300"]
].map(([entityId,name,pageUrl,terms,rightsHolder,sourceLabel]) => ({entityId,name,pageUrl,terms,rightsHolder,sourceLabel}));

const decode = s => (s || "").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">");
function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) out[m[1].toLowerCase()] = decode(m[3]);
  return out;
}
function absolute(raw, base) { try { return new URL(decode(raw), base).href; } catch { return null; } }
function bad(url) { return /(?:logo|favicon|sprite|icon|payment|placeholder|spinner|loading|badge|avatar|tracking|pixel|qr|newsletter|flag|footer|header|map|banner|engine|power|torque|speedometer|display|console|brake|suspension|headlight|tail.?light|feature|metric|performance|technology|specification|specs|bike-bg|background|promo|360-bg|sports-shift|shift|whats-new|radial|tyre|tire)/i.test(url); }

async function fetchImage(url, referer) {
  const response = await fetchWithRetry(url,{redirect:"follow",signal:AbortSignal.timeout(30000),headers:{"user-agent":UA,accept:"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",...(referer?{referer}:{})}},3);
  if (!response.ok) throw new Error(`HTTP ${response.status} ${url}`);
  const type=(response.headers.get("content-type")||"").toLowerCase();
  const bytes=Buffer.from(await response.arrayBuffer());
  let meta;
  try { meta=await sharp(bytes).metadata(); } catch { throw new Error(`not decodable image: ${type||"unknown"}`); }
  if((meta.width||0)<450 || (meta.height||0)<180) throw new Error(`too small ${meta.width||0}x${meta.height||0}`);
  return {bytes,url:response.url||url,width:meta.width||0,height:meta.height||0};
}

async function discover(target) {
  const response=await fetchWithRetry(target.pageUrl,{redirect:"follow",signal:AbortSignal.timeout(30000),headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml"}},3);
  if(!response.ok) throw new Error(`page HTTP ${response.status}`);
  const html=await response.text();
  const pageUrl=response.url||target.pageUrl;
  const pageText=html.toLowerCase();
  if(!target.terms.some(t=>pageText.includes(t.toLowerCase()))) throw new Error("source page does not contain model term");
  const candidates=[];
  const add=(raw,base,label="")=>{
    const url=raw&&absolute(raw,pageUrl);
    if(!url||!/^https?:/i.test(url)||bad(url)) return;
    const hay=`${url} ${label}`.toLowerCase();
    const matches=target.terms.filter(t=>hay.includes(t.toLowerCase())).length;
    const productBoost=/(?:360degree|360-degree|16-axis|variant|colour|color|colors|colours|\/00\.(?:png|webp|jpg|jpeg))/i.test(url)?60:0;
    candidates.push({url,score:base+matches*80+productBoost,matches,label});
    if(/static\.wixstatic\.com\/media\//i.test(url)&&/\/v1\//i.test(url)){
      const original=url.replace(/\/v1\/.*$/,"");
      if(original!==url&&!bad(original)) candidates.push({url:original,score:base+matches*80+productBoost+90,matches,label});
    }
  };
  for(const tag of html.match(/<img\b[^>]*>/gi)||[]){
    const a=attrs(tag), label=`${a.alt||""} ${a.title||""}`;
    const srcset=(a.srcset||a["data-srcset"]||"").split(",").map(v=>v.trim().split(/\s+/)[0]).filter(Boolean);
    for(const raw of [a.src,a["data-src"],a["data-lazy-src"],a["data-original"],...srcset]) if(raw) add(raw,100,label);
  }
  for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){
    const a=attrs(tag), key=(a.property||a.name||"").toLowerCase();
    if(["og:image","og:image:url","og:image:secure_url"].includes(key)) add(a.content,170,key);
    if(["twitter:image","twitter:image:src"].includes(key)) add(a.content,155,key);
  }
  for(const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
    try{
      const data=JSON.parse(m[1].trim());
      const visit=node=>{
        if(!node)return;
        if(Array.isArray(node))return node.forEach(visit);
        if(typeof node!=="object")return;
        const label=typeof node.name==="string"?node.name:"";
        const imgs=Array.isArray(node.image)?node.image:[node.image];
        for(const img of imgs){
          if(typeof img==="string")add(img,190,label);
          else if(img&&typeof img.url==="string")add(img.url,190,label);
        }
        for(const v of Object.values(node)) if(v&&typeof v==="object")visit(v);
      };
      visit(data);
    }catch{}
  }
  const unique=[...new Map(candidates.sort((a,b)=>b.score-a.score).map(c=>[c.url,c])).values()];
  const preferred=unique.filter(c=>c.matches>0);
  const pool=preferred.length?preferred:unique;
  let last;
  for(const c of pool.slice(0,30)){
    try{
      const hit=await fetchImage(c.url,pageUrl);
      return {...hit,pageUrl,candidate:c};
    }catch(e){last=e;}
  }
  throw last||new Error("no usable image candidate");
}

function arrayClose(source,declaration){
  const start=source.indexOf(declaration), open=source.indexOf("[",source.indexOf("=",start));
  if(start<0||open<0)throw new Error("media array not found");
  let depth=0,q="",str=false,esc=false;
  for(let i=open;i<source.length;i++){
    const ch=source[i];
    if(str){if(esc)esc=false;else if(ch==="\\")esc=true;else if(ch===q)str=false;continue;}
    if(ch==='"'||ch==="'"||ch==="`"){str=true;q=ch;continue;}
    if(ch==="[")depth++;else if(ch==="]"&&--depth===0)return i;
  }
  throw new Error("media array close not found");
}
const escRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");

let media=fs.readFileSync(mediaPath,"utf8");
let coverage=fs.readFileSync(coveragePath,"utf8");
const completed=[];

for(const t of targets){
  console.log(`Processing ${t.entityId}...`);
  const src=await discover(t);
  const localSrc=`/media/motorcycles/${t.entityId}.webp`;
  await sharp(src.bytes).rotate().flatten({background:"#ffffff"}).resize({width:1200,height:1200,fit:"contain",background:"#ffffff"}).webp({quality:88,effort:4}).toFile(path.join(root,"public",localSrc.slice(1)));

  const newRecordId=t.entityId+"-verified-20260923";
  const exists=new RegExp(`id\\s*:\\s*["']${escRe(newRecordId)}["']`).test(media);
  if(!exists){
    const record=`  {
    id: ${JSON.stringify(newRecordId)}, entityType: "motorcycle", entityId: ${JSON.stringify(t.entityId)}, role: "primary",
    src: ${JSON.stringify(localSrc)}, sourceImageUrl: ${JSON.stringify(src.url)}, alt: ${JSON.stringify(t.name+" motorcycle")}, width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: ${JSON.stringify(t.rightsHolder)}, sourceLabel: ${JSON.stringify(t.sourceLabel)}, sourceUrl: ${JSON.stringify(src.pageUrl)}, lastChecked: ${JSON.stringify(checkedAt)}
  },`;
    const close=arrayClose(media,"export const entityMedia");
    media=media.slice(0,close)+record+"\n"+media.slice(close);
  }
  coverage=coverage.replace(new RegExp(`\\n\\s*"${escRe(t.entityId)}",?`),"");
  completed.push({entityId:t.entityId,sourceUrl:src.pageUrl,sourceImageUrl:src.url,matchedTerms:src.candidate.matches});
  console.log(`✓ ${t.entityId} <- ${src.url}`);
}

fs.writeFileSync(mediaPath,media);
fs.writeFileSync(coveragePath,coverage);
console.log(JSON.stringify(completed,null,2));
console.log(`Completed ${completed.length}/${targets.length} exact-model image backfills.`);
