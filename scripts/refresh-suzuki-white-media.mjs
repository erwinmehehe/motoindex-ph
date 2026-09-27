import path from "node:path";
import sharp from "sharp";

const root=process.cwd();
const targets=[
  ["suzuki-raider-pro","https://mc.suzuki.com.ph/wp-content/uploads/2025/11/RPTYNov11-1.png"],
  ["suzuki-gixxer-155","https://mc.suzuki.com.ph/wp-content/uploads/2024/10/GIXXER155PrevFeb6.png"],
];
const headers={
  "user-agent":"Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)",
  "accept":"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8"
};

async function fetchImage(url){
  const res=await fetch(url,{redirect:"follow",headers,signal:AbortSignal.timeout(30000)});
  if(!res.ok) throw new Error(url+": HTTP "+res.status);
  const type=(res.headers.get("content-type")||"").toLowerCase();
  if(!type.startsWith("image/")) throw new Error(url+": not image ("+type+")");
  const bytes=Buffer.from(await res.arrayBuffer());
  if(bytes.length<5000) throw new Error(url+": too small");
  return bytes;
}

for(const [id,url] of targets){
  const bytes=await fetchImage(url);
  let image=sharp(bytes,{failOn:"warning"}).rotate().flatten({background:"#ffffff"});
  let trimmed;
  try{
    trimmed=await image.trim({background:"#ffffff",threshold:18}).png().toBuffer();
  }catch{
    trimmed=await image.png().toBuffer();
  }

  const fitted=await sharp(trimmed)
    .resize({width:860,height:700,fit:"inside",withoutEnlargement:false})
    .png()
    .toBuffer();

  const meta=await sharp(fitted).metadata();
  const left=Math.round((1200-(meta.width||0))/2);
  const top=Math.round((1200-(meta.height||0))/2);
  const output=path.join(root,"public","media","motorcycles",id+".webp");

  await sharp({create:{width:1200,height:1200,channels:4,background:"#ffffff"}})
    .composite([{input:fitted,left,top}])
    .flatten({background:"#ffffff"})
    .webp({quality:90,effort:5,smartSubsample:true})
    .toFile(output);

  console.log("normalized "+id+" -> "+(meta.width||0)+"x"+(meta.height||0)+" on white 1200x1200");
}
