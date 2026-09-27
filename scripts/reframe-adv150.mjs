import path from "node:path";
import sharp from "sharp";

const file=path.join(process.cwd(),"public","media","motorcycles","honda-adv-150.webp");
const source=await sharp(file).trim({background:"#ffffff",threshold:18}).png().toBuffer();
const fitted=await sharp(source).resize({width:800,height:720,fit:"inside",withoutEnlargement:false}).png().toBuffer();
const meta=await sharp(fitted).metadata();
const left=Math.round((1200-(meta.width||0))/2);
const top=Math.round((1200-(meta.height||0))/2);
const tmp=file+".tmp.webp";
await sharp({create:{width:1200,height:1200,channels:4,background:"#ffffff"}})
  .composite([{input:fitted,left,top}])
  .flatten({background:"#ffffff"})
  .webp({quality:90,effort:5,smartSubsample:true})
  .toFile(tmp);
await import("node:fs/promises").then(fs=>fs.rename(tmp,file));
console.log("ADV150 reframed to "+(meta.width||0)+"x"+(meta.height||0)+" on 1200x1200 white canvas");
