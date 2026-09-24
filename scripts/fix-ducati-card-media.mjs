import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "media", "motorcycles");
const mediaPath = path.join(root, "lib", "media.ts");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153 Safari/537.36";

const targets = [
  {
    id: "ducati-monster-937-plus",
    file: "ducati-monster-937-plus.webp",
    page: "https://www.ducati.com/br/pt/motos/monster/monster-937",
    imageUrl: "https://images.ctfassets.net/x7j9qwvpvr5s/6pN73T6u1I1qaq8cizP7qV/b71f8207bba199bff55afb8198559993/Monster-937-Rd-MY22-Model-Preview-1050x650-v06.png",
    altNeedles: ["Nova Monster - Ducati Red"],
    label: "Manufacturer-hosted product image · Ducati Monster 937",
    holder: "Ducati"
  },
  {
    id: "ducati-scrambler-nightshift",
    file: "ducati-scrambler-nightshift.webp",
    page: "https://www.ducatiomaha.com/products/2026-ducati-scrambler-nightshift-emerald-green",
    altNeedles: ["2026 Ducati Scrambler Nightshift - Emerald Green"],
    label: "Exact product image · Ducati Omaha dealer listing · Scrambler Nightshift",
    holder: "Ducati"
  }
];

function decode(v="") {
  return v.replaceAll("&amp;","&").replaceAll("&#038;","&").replaceAll("&quot;",'"').replaceAll("&#39;","'").replaceAll("&lt;","<").replaceAll("&gt;",">");
}
function attr(tag, name) {
  return decode(tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1] || "");
}
function bestFromSrcset(value) {
  if (!value) return "";
  const parts=value.split(",").map(x=>x.trim()).filter(Boolean).map(part=>{
    const [url,size]=part.split(/\s+/);
    const n=Number((size||"0").replace(/[^0-9.]/g,""))||0;
    return {url:decode(url),n};
  }).sort((a,b)=>b.n-a.n);
  return parts[0]?.url || "";
}
async function pageImage(page, needles) {
  const res=await fetch(page,{redirect:"follow",headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml"},signal:AbortSignal.timeout(30000)});
  if(!res.ok) throw new Error(`Page HTTP ${res.status}: ${page}`);
  const html=await res.text();
  const tags=html.match(/<img\b[^>]*>/gi)||[];
  for(const needle of needles){
    const lower=needle.toLowerCase();
    for(const tag of tags){
      const alt=attr(tag,"alt");
      if(!alt.toLowerCase().includes(lower)) continue;
      const candidates=[
        bestFromSrcset(attr(tag,"data-srcset")),
        bestFromSrcset(attr(tag,"srcset")),
        attr(tag,"data-lazy-src"),
        attr(tag,"data-src"),
        attr(tag,"src")
      ].filter(Boolean);
      for(const candidate of candidates){
        if(candidate.startsWith("data:")) continue;
        return {url:new URL(candidate,page).href,alt};
      }
    }
  }
  throw new Error(`Could not find product image for ${needles.join(" / ")}`);
}
async function fetchImage(url, referer) {
  const res=await fetch(url,{redirect:"follow",headers:{"user-agent":UA,accept:"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",referer},signal:AbortSignal.timeout(30000)});
  if(!res.ok) throw new Error(`Image HTTP ${res.status}: ${url}`);
  const bytes=Buffer.from(await res.arrayBuffer());
  const meta=await sharp(bytes).metadata();
  if(!meta.width||!meta.height||meta.width<400||meta.height<250) throw new Error(`Bad product image dimensions ${meta.width}x${meta.height}`);
  return {bytes,url:res.url||url};
}
async function normalize(bytes, dest) {
  const rgba=await sharp(bytes,{failOn:"warning"}).rotate().ensureAlpha().png().toBuffer();
  const stats=await sharp(rgba).stats();
  const alpha=stats.channels[3];
  let subject=sharp(rgba);
  if(alpha && alpha.min < 250) subject=subject.trim({background:{r:0,g:0,b:0,alpha:0},threshold:8});
  else subject=subject.trim({background:"#ffffff",threshold:12});
  const fitted=await subject.resize({width:1000,height:880,fit:"inside",withoutEnlargement:false}).png().toBuffer();
  await sharp({create:{width:1200,height:1200,channels:4,background:{r:255,g:255,b:255,alpha:1}}})
    .composite([{input:fitted,gravity:"centre"}]).flatten({background:"#fff"}).webp({quality:90,effort:6}).toFile(dest);
}
function replaceField(source, entityId, field, value) {
  const markerA=`entityId: "${entityId}"`;
  const markerB=`entityId:"${entityId}"`;
  let i=source.indexOf(markerA);
  if(i<0) i=source.indexOf(markerB);
  if(i<0) throw new Error(`Missing media entity ${entityId}`);
  const start=source.lastIndexOf("{",i);
  const end=source.indexOf("\n  },",i)+5;
  let block=source.slice(start,end);
  const fieldRe=new RegExp(`\\b${field}\\s*:\\s*"[^"]*"`);
  if(!fieldRe.test(block)) throw new Error(`Missing field ${field} on ${entityId}`);
  block=block.replace(fieldRe,`${field}: ${JSON.stringify(value)}`);
  return source.slice(0,start)+block+source.slice(end);
}

let media=await fs.readFile(mediaPath,"utf8");
for(const target of targets){
  const found=target.imageUrl ? {url: target.imageUrl, alt: target.altNeedles[0]} : await pageImage(target.page,target.altNeedles);
  console.log(`Found ${target.id}: ${found.alt} -> ${found.url}`);
  const image=await fetchImage(found.url,target.page);
  await normalize(image.bytes,path.join(outDir,target.file));
  media=replaceField(media,target.id,"sourceImageUrl",image.url);
  media=replaceField(media,target.id,"sourceUrl",target.page);
  media=replaceField(media,target.id,"sourceLabel",target.label);
  media=replaceField(media,target.id,"rightsHolder",target.holder);
  media=replaceField(media,target.id,"lastChecked","2026-09-24");
}
await fs.writeFile(mediaPath,media);
console.log("Updated exact Ducati Monster 937 Plus and Scrambler Nightshift product media.");
