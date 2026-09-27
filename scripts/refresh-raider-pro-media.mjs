import path from "node:path";
import sharp from "sharp";

const root=process.cwd();
const id="suzuki-raider-pro";
const file=path.join(root,"public","media","motorcycles",id+".webp");

const source=await sharp(file,{failOn:"warning"})
  .rotate()
  .trim({background:"#ffffff",threshold:12})
  .flatten({background:"#ffffff"})
  .png()
  .toBuffer();

const fitted=await sharp(source)
  .resize({width:780,height:620,fit:"inside",withoutEnlargement:false})
  .png()
  .toBuffer();

const meta=await sharp(fitted).metadata();
const left=Math.round((1200-(meta.width||0))/2);
const top=Math.round((1200-(meta.height||0))/2);

await sharp({create:{width:1200,height:1200,channels:4,background:"#ffffff"}})
  .composite([{input:fitted,left,top}])
  .flatten({background:"#ffffff"})
  .webp({quality:90,effort:5,smartSubsample:true})
  .toFile(file+".tmp.webp");

await sharp(file+".tmp.webp").toFile(file);
await import("node:fs/promises").then(fs=>fs.unlink(file+".tmp.webp"));
console.log("normalized "+id+" to "+(meta.width||0)+"x"+(meta.height||0)+" on 1200x1200 white");
