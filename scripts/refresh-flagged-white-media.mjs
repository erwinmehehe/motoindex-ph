import path from "node:path";
import sharp from "sharp";

const root=process.cwd();
const targets=[
  ["honda-cb650r","https://m.cdn.autotraderspecialty.com/2026-Honda-CB650R-motorcycle--Motorcycle-201883898-68723cd25e28c7ac8c7a29f9d96332f9.jpg?c=%23f5f5f5&h=800&r=pad&w=800"],
  ["honda-xl750-transalp","https://mundohonda.cr/cdn/shop/files/2026-XL750_TRANSALP_studio_D002_MT_NH-196_Ross_White_RhSide_S.jpg?v=1779398821&width=940"],
  ["honda-crf1100l-africa-twin","https://powersports.honda.com/-/media/products/family/africa-twin/trim-hero/gallery/africa-twin-dct/2026/pearl-white/2026-africa-twin-dct-pearl_white-gallery-01.png"],
  ["motorstar-cafe-400","https://www.kamote.ph/cdn-cgi/image/lossless%3Dtrue%2Cw%3D1200%2Ch%3D1200%2Cf%3Dwebp%2Cfit%3Dcontain/https%3A/www.kamote.ph/Gallery/Motorstar/Cafe_400.webp"],
];
const headers={"user-agent":"Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)","accept":"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8"};

async function download(url){
  const res=await fetch(url,{redirect:"follow",headers,signal:AbortSignal.timeout(30000)});
  if(!res.ok) throw new Error(url+": HTTP "+res.status);
  const type=(res.headers.get("content-type")||"").toLowerCase();
  if(!type.startsWith("image/")) throw new Error(url+": not image ("+type+")");
  const bytes=Buffer.from(await res.arrayBuffer());
  if(bytes.length<5000) throw new Error(url+": too small");
  return bytes;
}

async function normalize(id,url){
  const bytes=await download(url);
  let image=sharp(bytes,{failOn:"warning"}).rotate().flatten({background:"#ffffff"});
  let normalized;
  try {
    normalized=await image.trim({background:"#ffffff",threshold:18}).png().toBuffer();
  } catch {
    normalized=await image.png().toBuffer();
  }
  const fitted=await sharp(normalized).resize({width:920,height:760,fit:"inside",withoutEnlargement:false}).png().toBuffer();
  const meta=await sharp(fitted).metadata();
  const left=Math.round((1200-(meta.width||0))/2);
  const top=Math.round((1200-(meta.height||0))/2);
  const output=path.join(root,"public","media","motorcycles",id+".webp");
  await sharp({create:{width:1200,height:1200,channels:4,background:"#ffffff"}})
    .composite([{input:fitted,left,top}])
    .flatten({background:"#ffffff"})
    .webp({quality:90,effort:5,smartSubsample:true})
    .toFile(output);
  console.log("refreshed "+id+" -> "+(meta.width||0)+"x"+(meta.height||0)+" on white 1200x1200");
}
for(const [id,url] of targets) await normalize(id,url);
