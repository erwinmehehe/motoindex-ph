import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public/media/motorcycles");
const mediaPath = path.join(root, "lib/media.ts");
const contactDir = path.join(root, "artifacts/motorcycle-media-contact-sheets");
fs.mkdirSync(contactDir, { recursive: true });

const UA = "Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)";

async function fetchImage(url, referer) {
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
    headers: { "user-agent": UA, accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8", ...(referer ? { referer } : {}) }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const type=(res.headers.get("content-type")||"").toLowerCase();
  if (!type.startsWith("image/")) throw new Error(`Not image: ${type}`);
  const bytes=Buffer.from(await res.arrayBuffer());
  const meta=await sharp(bytes).metadata();
  if ((meta.width||0)<400 || (meta.height||0)<300) throw new Error(`Image too small ${meta.width}x${meta.height}`);
  return {bytes,url:res.url||url,meta};
}

async function writeWhiteCanvas(bytes, output, opts={}) {
  let image=sharp(bytes).rotate();
  if (opts.extract) image=image.extract(opts.extract);
  if (opts.trim) image=image.trim({ background: {r:255,g:255,b:255,alpha:0}, threshold: 8 });
  const normalized=await image
    .resize({width:1040,height:900,fit:"inside",withoutEnlargement:false})
    .png()
    .toBuffer();
  const meta=await sharp(normalized).metadata();
  const left=Math.floor((1200-(meta.width||0))/2);
  const top=Math.floor((1200-(meta.height||0))/2)+18;
  await sharp({
    create:{width:1200,height:1200,channels:4,background:{r:255,g:255,b:255,alpha:1}}
  }).composite([{input:normalized,left:Math.max(0,left),top:Math.max(0,Math.min(1200-(meta.height||0),top))}])
    .webp({quality:90,effort:4})
    .toFile(output);
}

function replaceField(source, entityId, field, value) {
  const entityNeedle=`entityId: "${entityId}"`;
  const i=source.indexOf(entityNeedle);
  if(i<0) throw new Error(`Missing media entity ${entityId}`);
  const start=source.lastIndexOf("{",i);
  const end=source.indexOf("\n  },",i)+5;
  let block=source.slice(start,end);
  const rx=new RegExp(`\\b${field}\\s*:\\s*"[^"]*"`);
  if(!rx.test(block)) throw new Error(`Missing ${field} on ${entityId}`);
  block=block.replace(rx,`${field}: ${JSON.stringify(value)}`);
  return source.slice(0,start)+block+source.slice(end);
}

const airUrl="https://cdn.honda.com.vn/motorbike-versions/Image360/November2025/1762148885/0.png";
const airPage="https://www.honda.com.vn/xe-may/san-pham/air-blade-160125?changeVersionFlag=2025";
const air=await fetchImage(airUrl,airPage);
await writeWhiteCanvas(air.bytes,path.join(outDir,"honda-airblade-160.webp"),{trim:true});

const tuaregUrl="https://apriliaindia.com/images/tuareg-660/aprilia_tuareg_660_feature1.png";
const tuaregPage="https://apriliaindia.com/aprilia-tuareg-660.php";
const tuareg=await fetchImage(tuaregUrl,tuaregPage);
const tw=tuareg.meta.width||900, th=tuareg.meta.height||675;
await writeWhiteCanvas(tuareg.bytes,path.join(outDir,"aprilia-tuareg-660.webp"),{
  extract:{left:Math.round(tw*0.47),top:Math.round(th*0.10),width:tw-Math.round(tw*0.47),height:Math.round(th*0.80)},
  trim:true
});

let media=fs.readFileSync(mediaPath,"utf8");
media=replaceField(media,"honda-airblade-160","sourceImageUrl",air.url);
media=replaceField(media,"honda-airblade-160","sourceUrl",airPage);
media=replaceField(media,"honda-airblade-160","sourceLabel","Manufacturer-hosted transparent product image · Honda AirBlade 160");
media=replaceField(media,"honda-airblade-160","rightsHolder","Honda Vietnam");
media=replaceField(media,"honda-airblade-160","lastChecked","2026-09-24");
media=replaceField(media,"aprilia-tuareg-660","sourceImageUrl",tuareg.url);
media=replaceField(media,"aprilia-tuareg-660","sourceUrl",tuaregPage);
media=replaceField(media,"aprilia-tuareg-660","sourceLabel","Manufacturer-hosted product image · Aprilia India Tuareg 660");
media=replaceField(media,"aprilia-tuareg-660","rightsHolder","Aprilia India");
media=replaceField(media,"aprilia-tuareg-660","lastChecked","2026-09-24");
fs.writeFileSync(mediaPath,media);

const files=fs.readdirSync(outDir).filter(f=>f.endsWith(".webp")).sort();
const perSheet=30, cellW=260, cellH=245, cols=5, rows=6;
for(let s=0;s<Math.ceil(files.length/perSheet);s++){
  const group=files.slice(s*perSheet,(s+1)*perSheet);
  const comps=[];
  for(let i=0;i<group.length;i++){
    const f=group[i], x=(i%cols)*cellW, y=Math.floor(i/cols)*cellH;
    const thumb=await sharp(path.join(outDir,f)).resize({width:230,height:175,fit:"contain",background:"#fff"}).png().toBuffer();
    const label=f.replace(/\.webp$/,"").slice(0,34);
    const svg=Buffer.from(`<svg width="250" height="55"><rect width="250" height="55" fill="white"/><text x="5" y="20" font-family="Arial" font-size="13" fill="black">${label}</text><text x="5" y="40" font-family="Arial" font-size="11" fill="#555">${s*perSheet+i+1}/${files.length}</text></svg>`);
    comps.push({input:thumb,left:x+15,top:y+5});
    comps.push({input:svg,left:x+5,top:y+182});
  }
  await sharp({create:{width:cols*cellW,height:rows*cellH,channels:3,background:"#fff"}})
    .composite(comps).jpeg({quality:86}).toFile(path.join(contactDir,`sheet-${String(s+1).padStart(2,"0")}.jpg`));
}
console.log(`Refreshed AirBlade 160 + Tuareg 660 and generated ${Math.ceil(files.length/perSheet)} contact sheets for ${files.length} motorcycle images.`);
