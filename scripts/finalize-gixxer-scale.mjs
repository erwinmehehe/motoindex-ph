import path from "node:path";
import sharp from "sharp";

const root=process.cwd();
const url="https://mc.suzuki.com.ph/wp-content/uploads/2024/10/GIXXER155PrevFeb6.png";
const headers={
  "user-agent":"Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)",
  "accept":"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8"
};

const res=await fetch(url,{redirect:"follow",headers,signal:AbortSignal.timeout(30000)});
if(!res.ok) throw new Error("HTTP "+res.status);
const bytes=Buffer.from(await res.arrayBuffer());

const trimmed=await sharp(bytes,{failOn:"warning"})
  .rotate()
  .flatten({background:"#ffffff"})
  .trim({background:"#ffffff",threshold:55})
  .png()
  .toBuffer();

const fitted=await sharp(trimmed)
  .resize({width:1090,height:820,fit:"inside",withoutEnlargement:false})
  .png()
  .toBuffer();

const meta=await sharp(fitted).metadata();
const left=Math.round((1200-(meta.width||0))/2);
const top=Math.round((1200-(meta.height||0))/2);
const output=path.join(root,"public","media","motorcycles","suzuki-gixxer-155.webp");

await sharp({create:{width:1200,height:1200,channels:4,background:"#ffffff"}})
  .composite([{input:fitted,left,top}])
  .flatten({background:"#ffffff"})
  .webp({quality:90,effort:5,smartSubsample:true})
  .toFile(output);

console.log("finalized suzuki-gixxer-155 -> "+(meta.width||0)+"x"+(meta.height||0)+" on white 1200x1200");
