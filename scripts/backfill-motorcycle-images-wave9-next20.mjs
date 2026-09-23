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
["aprilia-tuareg-660","https://storeusa.aprilia.com/tuareg660.aspx",["tuareg","660"],"Aprilia Tuareg 660 adventure motorcycle","Aprilia"],
["aprilia-tuono-660","https://storeusa.aprilia.com/tuono660.aspx",["tuono","660"],"Aprilia Tuono 660 motorcycle","Aprilia"],
["bajaj-dominar-400","https://www.bajajauto.com/en-ph/bikes/dominar-d400",["dominar","d400"],"Bajaj Dominar 400 motorcycle","Bajaj Auto"],
["bajaj-pulsar-n125","https://www.bajajauto.com/en-ph/bikes/pulsar-n125",["pulsar","n125"],"Bajaj Pulsar N125 motorcycle","Bajaj Auto"],
["bajaj-pulsar-n160","https://www.bajajauto.com/en-ph/bikes/pulsar-n160",["pulsar","n160"],"Bajaj Pulsar N160 motorcycle","Bajaj Auto"],
["bajaj-pulsar-ns400z","https://www.bajajauto.com/en-ph/bikes/pulsar-ns400z",["pulsar","ns400z"],"Bajaj Pulsar NS400Z motorcycle","Bajaj Auto"],
["bajaj-pulsar-rs200","https://www.bajajauto.com/en-ph/bikes/pulsar-rs200",["pulsar","rs200"],"Bajaj Pulsar RS200 motorcycle","Bajaj Auto"],
["benelli-302s","https://www.benelli.com/ph-en/products/302s-2",["302s"],"Benelli 302S motorcycle","Benelli"],
["benelli-leoncino-250","https://www.benelli.com/ph-en/products/leoncino-250",["leoncino","250"],"Benelli Leoncino 250 motorcycle","Benelli"],
["benelli-tnt-135","https://www.benelli.com/ph-en/products/tnt-135",["tnt","135"],"Benelli TNT 135 motorcycle","Benelli"],
["benelli-trk-502","https://www.benelli.com/ph-en/products/trk-502-3/",["trk","502"],"Benelli TRK 502 adventure motorcycle","Benelli"],
["cfmoto-300nk","https://www.cfmotoph.com/motorcycle/300nk",["300nk"],"CFMOTO 300NK motorcycle","CFMOTO Philippines"],
["husqvarna-norden-901","https://www.husqvarna-motorcycles.com/en-ph/models/travel/norden-901-2022.html",["norden","901"],"Husqvarna Norden 901 adventure motorcycle","Husqvarna Motorcycles"],
["husqvarna-svartpilen-200","https://www.husqvarna-motorcycles.com/en-ph/models/naked/svartpilen/svartpilen-200-2023.html",["svartpilen","200"],"Husqvarna Svartpilen 200 motorcycle","Husqvarna Motorcycles"],
["kawasaki-ninja-zx-25r","https://kawasakileisurebikes.ph/motorcycles/supersports/ninja-zx-25r-standard/",["ninja","zx-25r"],"Kawasaki Ninja ZX-25R motorcycle","Kawasaki Motors Philippines"],
["kawasaki-z1000-r-edition","https://www.kawasakileisurebikes.ph/motorcycles/sports/z100r/",["z1000","z100r"],"Kawasaki Z1000 R Edition motorcycle","Kawasaki Motors Philippines"],
["kymco-dink-r-150","https://kymco.com.ph/product/dink-r-150/",["dink","150"],"KYMCO Dink R 150 scooter","KYMCO Philippines"],
["kymco-dtx360-300","https://kymco.com.ph/product/dtx-360-300/",["dtx","360"],"KYMCO DTX360-300 scooter","KYMCO Philippines"],
["royal-enfield-shotgun-650","https://www.royalenfield.com/ph/en/motorcycles/shotgun-650/",["shotgun","650"],"Royal Enfield Shotgun 650 motorcycle","Royal Enfield"],
["vespa-primavera-150","https://storeusa.vespa.com/primavera/primavera-150.aspx",["primavera","150"],"Vespa Primavera 150 scooter","Vespa"]
].map(([entityId,pageUrl,terms,alt,rightsHolder]) => ({entityId,pageUrl,terms,alt,rightsHolder}));

function decodeHtml(s) {
  return s.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">");
}
function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) out[m[1].toLowerCase()] = decodeHtml(m[3]);
  return out;
}
function abs(raw, base) { try { return new URL(decodeHtml(raw), base).href; } catch { return null; } }
function bad(url) { return /logo|favicon|sprite|icon|placeholder|spinner|loading|badge|avatar|tracking|pixel|newsletter|footer|header|cookie|social/i.test(url); }

async function getImage(url, referer) {
  const res = await fetch(url, {redirect:"follow", signal:AbortSignal.timeout(30000), headers:{"user-agent":UA, accept:"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8", ...(referer?{referer}:{})}});
  if (!res.ok) throw new Error("image HTTP " + res.status);
  const type = (res.headers.get("content-type") || "").toLowerCase();
  if (!type.startsWith("image/")) throw new Error("not image: " + type);
  const bytes = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(bytes).metadata();
  if (bytes.length < 5000 || (meta.width||0) < 350 || (meta.height||0) < 250) throw new Error("image too small");
  return {bytes, url:res.url||url, width:meta.width||0, height:meta.height||0};
}

function candidates(html, pageUrl, terms) {
  const list = [];
  const add = (raw, base, label="") => {
    const url = raw && abs(raw,pageUrl);
    if (!url || !/^https?:/i.test(url) || bad(url)) return;
    const hay = (url+" "+label).toLowerCase();
    const matches = terms.filter(t=>hay.includes(t.toLowerCase())).length;
    list.push({url,score:base+matches*60,matches,label});
  };
  for (const tag of html.match(/<img\b[^>]*>/gi)||[]) {
    const a=attrs(tag), label=(a.alt||"")+" "+(a.title||"");
    const srcset=(a.srcset||"").split(",").map(x=>x.trim().split(/\s+/)[0]).filter(Boolean);
    for (const raw of [a.src,a["data-src"],a["data-lazy-src"],a["data-original"],a["data-lazy"],...srcset]) if(raw) add(raw,120,label);
  }
  for (const tag of html.match(/<meta\b[^>]*>/gi)||[]) {
    const a=attrs(tag), key=(a.property||a.name||"").toLowerCase();
    if (key==="og:image"||key==="og:image:url"||key==="og:image:secure_url") add(a.content,150,key);
    if (key==="twitter:image"||key==="twitter:image:src") add(a.content,140,key);
  }
  const seen=new Set();
  return list.sort((a,b)=>b.score-a.score).filter(x=>!seen.has(x.url)&&seen.add(x.url));
}

async function discover(t) {
  const res=await fetch(t.pageUrl,{redirect:"follow",signal:AbortSignal.timeout(30000),headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml"}});
  if(!res.ok) throw new Error("page HTTP "+res.status);
  const html=await res.text(), pageUrl=res.url||t.pageUrl;
  const list=candidates(html,pageUrl,t.terms);
  let last;
  for(const c of list.slice(0,40)){
    try {
      const img=await getImage(c.url,pageUrl);
      if(c.matches===0 && c.score<150) continue;
      return {...img,pageUrl,matches:c.matches,label:c.label};
    } catch(e){ last=e; }
  }
  throw last||new Error("no usable exact image candidate");
}

function closeIndex(source) {
  const start=source.indexOf("export const entityMedia"), open=source.indexOf("[",source.indexOf("=",start));
  let depth=0,quote="",str=false,esc=false;
  for(let i=open;i<source.length;i++){
    const ch=source[i];
    if(str){ if(esc)esc=false; else if(ch==="\\")esc=true; else if(ch===quote)str=false; continue; }
    if(ch==='"'||ch==="'"){str=true;quote=ch;continue;}
    if(ch==="[")depth++; else if(ch==="]"&&--depth===0)return i;
  }
  throw new Error("entityMedia close not found");
}

function record(t,img){
  const sourceLabel="Manufacturer-hosted image reference · "+t.alt.replace(/ (motorcycle|scooter|adventure motorcycle)$/,"");
  return "  {\n"+
    "    id: "+JSON.stringify(t.entityId+"-official-wave9")+", entityType: \"motorcycle\", entityId: "+JSON.stringify(t.entityId)+", role: \"primary\",\n"+
    "    src: "+JSON.stringify("/media/motorcycles/"+t.entityId+".webp")+", sourceImageUrl: "+JSON.stringify(img.url)+", alt: "+JSON.stringify(t.alt)+", width: 1200, height: 1200,\n"+
    "    rightsStatus: \"external-reference\", rightsHolder: "+JSON.stringify(t.rightsHolder)+", sourceLabel: "+JSON.stringify(sourceLabel)+", sourceUrl: "+JSON.stringify(img.pageUrl)+", lastChecked: "+JSON.stringify(checkedAt)+"\n"+
    "  },";
}

let media=fs.readFileSync(mediaPath,"utf8");
let coverage=fs.readFileSync(coveragePath,"utf8");
const done=[], failures=[];
for(const t of targets){
  try{
    console.log("Processing "+t.entityId);
    const img=await discover(t);
    await sharp(img.bytes).rotate().resize({width:1200,height:1200,fit:"contain",background:{r:255,g:255,b:255,alpha:1}}).webp({quality:86,effort:4}).toFile(path.join(outDir,t.entityId+".webp"));
    const exactNeedle="entityId:"+JSON.stringify(t.entityId);
    const exactNeedleSpaced="entityId: "+JSON.stringify(t.entityId);
    if(!media.includes(exactNeedle)&&!media.includes(exactNeedleSpaced)){
      const i=closeIndex(media); media=media.slice(0,i)+record(t,img)+"\n"+media.slice(i);
    } else if(t.entityId==="vespa-primavera-150"){
      const i=closeIndex(media); media=media.slice(0,i)+record(t,img)+"\n"+media.slice(i);
    }
    coverage=coverage.replace("\n  "+JSON.stringify(t.entityId)+",","");
    done.push({entityId:t.entityId,pageUrl:img.pageUrl,sourceImageUrl:img.url,dimensions:img.width+"x"+img.height,termMatches:img.matches});
    console.log("OK "+t.entityId+" "+img.url);
  }catch(e){
    failures.push({entityId:t.entityId,error:e instanceof Error?e.message:String(e)});
    console.error("FAIL "+t.entityId+" "+(e instanceof Error?e.message:String(e)));
  }
}
fs.mkdirSync(path.join(root,"artifacts"),{recursive:true});
fs.writeFileSync(path.join(root,"artifacts/motorcycle-image-wave9-next20.json"),JSON.stringify({checkedAt,done,failures},null,2));
if(failures.length){ console.error("Resolved "+done.length+"/20; refusing manifest writes."); process.exit(1); }
fs.writeFileSync(mediaPath,media);
fs.writeFileSync(coveragePath,coverage);
console.log("Completed 20/20.");
