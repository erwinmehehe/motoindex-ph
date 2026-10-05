import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root=process.cwd();
const mediaSource=await fs.readFile(path.join(root,"lib/media.ts"),"utf8");
const ids=["gille-astral-pro","evo-gsx3000-v2","sec-surge","sec-dynasty","sec-sportgrade-v2","sec-ace"];
const outDir=path.join(root,"public/media/helmets");
await fs.mkdir(outDir,{recursive:true});

function recordFor(id){
  const marker=`entityId: "${id}"`;
  const start=mediaSource.indexOf(marker);
  if(start<0) throw new Error(`media record missing for ${id}`);
  const block=mediaSource.slice(Math.max(0,start-250),start+2200);
  const image=block.match(/sourceImageUrl:\s*"([^"]+)"/)?.[1];
  const page=block.match(/sourceUrl:\s*"([^"]+)"/)?.[1];
  if(!image) throw new Error(`sourceImageUrl missing for ${id}`);
  return {id,image,page};
}

async function download(url,referer){
  let last;
  for(let attempt=1;attempt<=3;attempt++){
    try{
      const response=await fetch(url,{
        redirect:"follow",
        signal:AbortSignal.timeout(25000),
        headers:{
          "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153 Safari/537.36",
          accept:"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",
          ...(referer?{referer}: {})
        }
      });
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const type=response.headers.get("content-type")||"";
      if(!type.toLowerCase().startsWith("image/")) throw new Error(`not image: ${type||"unknown"}`);
      const bytes=Buffer.from(await response.arrayBuffer());
      if(bytes.length<5000) throw new Error(`image too small: ${bytes.length}`);
      return bytes;
    }catch(error){
      last=error;
      if(attempt<3) await new Promise(r=>setTimeout(r,1500*attempt));
    }
  }
  throw last;
}

async function normalize(id,bytes){
  const output=path.join(outDir,`${id}.webp`);
  const white={r:255,g:255,b:255,alpha:1};
  const normalized=sharp(bytes).rotate().flatten({background:white}).trim({
    background:white,
    threshold:10
  });
  const buf=await normalized
    .resize({width:900,height:900,fit:"contain",background:white,withoutEnlargement:false})
    .extend({top:150,bottom:150,left:150,right:150,background:white})
    .webp({quality:90,effort:4})
    .toBuffer();

  await fs.writeFile(output,buf);
  const meta=await sharp(buf).metadata();
  if(meta.width!==1200||meta.height!==1200) throw new Error(`${id}: expected 1200x1200, got ${meta.width}x${meta.height}`);

  const {data,info}=await sharp(buf).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const channels=info.channels;
  let checked=0, whitePixels=0;
  const band=12;
  for(let y=0;y<info.height;y++){
    for(let x=0;x<info.width;x++){
      if(y>=band&&y<info.height-band&&x>=band&&x<info.width-band) continue;
      const i=(y*info.width+x)*channels;
      checked++;
      if(data[i]>=248&&data[i+1]>=248&&data[i+2]>=248) whitePixels++;
    }
  }
  const ratio=whitePixels/checked;
  if(ratio<0.995) throw new Error(`${id}: white border ${(ratio*100).toFixed(2)}%`);
  console.log(`✓ ${id} -> 1200x1200, white border ${(ratio*100).toFixed(2)}%`);
}

for(const rec of ids.map(recordFor)){
  console.log(`Downloading ${rec.id}`);
  const bytes=await download(rec.image,rec.page);
  await normalize(rec.id,bytes);
}

console.log(`Localized ${ids.length}/${ids.length} helmet images.`);
