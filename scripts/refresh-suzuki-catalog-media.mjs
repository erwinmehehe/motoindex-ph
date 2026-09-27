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

async function fetchImage(id,url){
  const res=await fetch(url,{redirect:"follow",headers,signal:AbortSignal.timeout(30000)});
  if(!res.ok) throw new Error(id+": HTTP "+res.status);
  const type=(res.headers.get("content-type")||"").toLowerCase();
  if(!type.startsWith("image/")) throw new Error(id+": not image");
  const bytes=Buffer.from(await res.arrayBuffer());
  if(bytes.length<5000) throw new Error(id+": source too small");
  return bytes;
}

async function cropToForeground(bytes){
  const raw=await sharp(bytes,{failOn:"warning"})
    .rotate()
    .flatten({background:"#ffffff"})
    .removeAlpha()
    .raw()
    .toBuffer({resolveWithObject:true});
  const {data,info}=raw;
  const {width,height,channels}=info;
  let x0=width,y0=height,x1=-1,y1=-1;
  for(let y=0;y<height;y++){
    for(let x=0;x<width;x++){
      const p=(y*width+x)*channels;
      if(data[p]<245 || data[p+1]<245 || data[p+2]<245){
        if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;
      }
    }
  }
  if(x1<x0||y1<y0) throw new Error("no foreground");
  const pad=10;
  x0=Math.max(0,x0-pad); y0=Math.max(0,y0-pad);
  x1=Math.min(width-1,x1+pad); y1=Math.min(height-1,y1+pad);
  return sharp(data,{raw:{width,height,channels}})
    .extract({left:x0,top:y0,width:x1-x0+1,height:y1-y0+1})
    .png()
    .toBuffer();
}

for(const [id,url] of targets){
  const bytes=await fetchImage(id,url);
  const cropped=await cropToForeground(bytes);
  const fitted=await sharp(cropped)
    .resize({width:840,height:680,fit:"inside",withoutEnlargement:false})
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
  console.log("normalized "+id+" -> "+(meta.width||0)+"x"+(meta.height||0)+" foreground on 1200x1200 #fff");
}
