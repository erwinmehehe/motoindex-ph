import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root=process.cwd();
const WHITE={r:255,g:255,b:255,alpha:1};
const targets=[
  {id:"honda-cb650r", localCleanup:true},
  {id:"honda-xl750-transalp", urls:[
    "https://mundohonda.cr/cdn/shop/files/2026-XL750_TRANSALP_studio_D002_MT_NH-196_Ross_White_RhSide_S.jpg?v=1779398821&width=940",
    "https://powersports.honda.com/motorcycle/adventure/-/media/products/family/transalp/trims/trim-main/transalp-e-clutch/2026/2026-transalp-e-clutch-white-1505x923.png?imwidth=1600"
  ]},
  {id:"honda-crf1100l-africa-twin", urls:[
    "https://powersports.honda.com/-/media/products/family/africa-twin/trim-hero/gallery/africa-twin-dct/2026/pearl-white/2026-africa-twin-dct-pearl_white-gallery-01.png",
    "https://powersports.honda.com/motorcycle/adventure/-/media/products/family/africa-twin/trims/trim-main/africa-twin/2026/2026-africa-twin-matte_black_metallic-1505x923.png?imwidth=1600"
  ]},
  {id:"motorstar-cafe-400", urls:[
    "https://www.kamote.ph/cdn-cgi/image/lossless%3Dtrue%2Cw%3D1200%2Ch%3D1200%2Cf%3Dwebp%2Cfit%3Dcontain/https%3A/www.kamote.ph/Gallery/Motorstar/Cafe_400.webp",
    "https://imgcdn.zigwheels.ph/large/gallery/color/78/1899/motorstar-cafe-400-color-385267.jpg"
  ]}
];
const headers={"user-agent":"Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)","accept":"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8"};

async function downloadAny(urls){
  let last;
  for(const url of urls){
    try{
      const res=await fetch(url,{redirect:"follow",headers,signal:AbortSignal.timeout(30000)});
      if(!res.ok) throw new Error("HTTP "+res.status);
      const type=(res.headers.get("content-type")||"").toLowerCase();
      if(!type.startsWith("image/")) throw new Error("not image ("+type+")");
      const bytes=Buffer.from(await res.arrayBuffer());
      if(bytes.length<5000) throw new Error("too small");
      console.log("source ok "+url);
      return bytes;
    }catch(error){
      last=error;
      console.log("source failed "+url+" -> "+(error instanceof Error?error.message:String(error)));
    }
  }
  throw last||new Error("no usable source");
}

async function cleanNeutralLocal(input){
  const trimmed=await sharp(input,{failOn:"warning"}).rotate().trim({background:"#ffffff",threshold:12}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const {data,info}=trimmed;
  const {width,height,channels}=info;
  const samples=[];
  const band=Math.max(4,Math.floor(Math.min(width,height)*0.04));
  const add=(x,y)=>{const p=(y*width+x)*channels;samples.push([data[p],data[p+1],data[p+2]]);};
  for(let y=0;y<band;y+=2)for(let x=0;x<width;x+=6)add(x,y);
  for(let y=Math.max(0,height-band);y<height;y+=2)for(let x=0;x<width;x+=6)add(x,y);
  for(let x=0;x<band;x+=2)for(let y=0;y<height;y+=6)add(x,y);
  for(let x=Math.max(0,width-band);x<width;x+=2)for(let y=0;y<height;y+=6)add(x,y);
  const median=i=>samples.map(s=>s[i]).sort((a,b)=>a-b)[Math.floor(samples.length/2)]||240;
  const bg=[median(0),median(1),median(2)];
  const mask=Buffer.alloc(width*height);
  for(let i=0;i<width*height;i++){
    const p=i*channels,r=data[p],g=data[p+1],b=data[p+2];
    const dist=Math.hypot(r-bg[0],g-bg[1],b-bg[2]);
    const sat=Math.max(r,g,b)-Math.min(r,g,b);
    const dark=255-Math.max(r,g,b);
    mask[i]=(dist>30||sat>24||dark>58)?255:0;
  }
  const softened=await sharp(mask,{raw:{width,height,channels:1}}).blur(1.8).threshold(80).toBuffer();
  const rgba=await sharp(data,{raw:{width,height,channels}}).joinChannel(softened,{raw:{width,height,channels:1}}).png().toBuffer();
  return sharp(rgba).trim({background:{r:255,g:255,b:255,alpha:0},threshold:8}).flatten({background:"#ffffff"}).png().toBuffer();
}

async function normalize(target){
  const output=path.join(root,"public","media","motorcycles",target.id+".webp");
  let normalized;
  if(target.localCleanup){
    normalized=await cleanNeutralLocal(output);
    console.log("cleaned local neutral background "+target.id);
  }else{
    const bytes=await downloadAny(target.urls);
    let image=sharp(bytes,{failOn:"warning"}).rotate().flatten({background:"#ffffff"});
    try{ normalized=await image.trim({background:"#ffffff",threshold:20}).png().toBuffer(); }
    catch{ normalized=await image.png().toBuffer(); }
  }
  const fitted=await sharp(normalized).resize({width:920,height:760,fit:"inside",withoutEnlargement:false}).png().toBuffer();
  const meta=await sharp(fitted).metadata();
  const left=Math.round((1200-(meta.width||0))/2),top=Math.round((1200-(meta.height||0))/2);
  await sharp({create:{width:1200,height:1200,channels:4,background:WHITE}})
    .composite([{input:fitted,left,top}]).flatten({background:"#ffffff"})
    .webp({quality:90,effort:5,smartSubsample:true}).toFile(output);
  console.log("refreshed "+target.id+" -> "+(meta.width||0)+"x"+(meta.height||0)+" on #fff");
}
for(const target of targets) await normalize(target);
