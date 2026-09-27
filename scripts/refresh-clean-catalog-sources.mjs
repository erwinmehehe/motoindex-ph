import path from "node:path";
import sharp from "sharp";

const root=process.cwd();
const targets=[
  {
    "id": "bmw-s-1000-r",
    "urls": [
      "https://www.vertumotors.com/new/vertu/bike/bmw/s1000/BMW-S1000R-Sport-M-Pack-25MY%5E1024x768%5E.jpg",
      "https://www.motociclismo.es/uploads/s1/78/40/48/2/bmw-s1000r-2021-05_7_1200x690.jpeg"
    ]
  },
  {
    "id": "ducati-streetfighter-v4",
    "urls": [
      "https://cdn.luxatic.com/wp-content/uploads/2022/11/Ducati-Streetfighter-V4-S-768x576.jpg",
      "https://images5.1000ps.net/g-000326-g_W3261418-ducati-streetfighter-v4-638833592863634830.jpg?height=480&mode=crop&scale=both&width=640"
    ]
  },
  {
    "id": "kawasaki-ninja-h2",
    "urls": [
      "https://media.caranddriver.gr/filesystem/images/20250904/engine/kawa-ninja-h2-26-6_252864_470592_type15035.jpg",
      "https://images5.1000ps.net/images_bikekat/2018/6-Kawasaki/8760-Ninja_H2_Carbon/004.jpg"
    ]
  },
  {
    "id": "ducati-panigale-v4",
    "urls": [
      "https://www.konigmoto.ru/upload/iblock/afe/i5m70qt8z9gr7xliiasjzogdeid09zdn.jpeg",
      "https://xedoisong.vn/uploads/20221030/xedoisong_cac_mau_sieu_mo_to_manh_nhat_thi_truong_viet_nam_nam_2022_11__pfgd.jpg"
    ]
  },
  {
    "id": "ktm-790-duke",
    "urls": [
      "https://1113070120.rsc.cdn77.org/temp/1719325435_b5f4d04e5c61ff5c43afe474b079fa35.jpg"
    ]
  },
  {
    "id": "bmw-s-1000-rr",
    "urls": [
      "https://carroemotos.com.br/wp-content/uploads/2024/03/2-15.jpg",
      "https://images5.1000ps.net/images_bikekat/2020/7-BMW/3723-S_1000_RR/039-637111500664572767.jpg"
    ]
  },
  {
    "id": "bmw-m-1000-rr",
    "urls": [
      "https://hydramotto.com/image/catalog/blog/2025-bmw-m-1000-rr-pyrvi-pogled/bmw-m-1000-rr-white.jpg",
      "https://images5.1000ps.net/images_bikekat/2022/7-BMW/10295-M_1000_RR/019-637776702862726202-bmw-m-1000-rr.jpg"
    ]
  },
  {
    "id": "kawasaki-ninja-1000",
    "urls": [
      "https://www.motosati.pl/uploads/kawasaki-ninja-1000sx-2022-metallic-diablo-black--pearl-robotic-white-motosati-2994859.jpg"
    ]
  },
  {
    "id": "bajaj-pulsar-ns400z",
    "urls": [
      "https://i5-mx.walmartimages.com/samsmx/images/product-images/img_large/981036531-4l.jpg"
    ]
  }
];
const headers={"user-agent":"Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)","accept":"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8"};

async function downloadAny(urls){
  let last;
  for(const url of urls){
    try{
      const res=await fetch(url,{redirect:"follow",headers,signal:AbortSignal.timeout(30000)});
      if(!res.ok) throw new Error("HTTP "+res.status);
      const type=(res.headers.get("content-type")||"").toLowerCase();
      if(!type.startsWith("image/")) throw new Error("not image "+type);
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

async function normalize(id,urls){
  const bytes=await downloadAny(urls);
  let image=sharp(bytes,{failOn:"warning"}).rotate().flatten({background:"#ffffff"});
  let normalized;
  try{ normalized=await image.trim({background:"#ffffff",threshold:22}).png().toBuffer(); }
  catch{ normalized=await image.png().toBuffer(); }
  const resized=await sharp(normalized).resize({width:920,height:760,fit:"inside",withoutEnlargement:false}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const pixels=Buffer.from(resized.data);
  for(let i=0;i<pixels.length;i+=resized.info.channels){
    const r=pixels[i],g=pixels[i+1],b=pixels[i+2];
    const max=Math.max(r,g,b),min=Math.min(r,g,b);
    if(min>=238 && max-min<=16){pixels[i]=255;pixels[i+1]=255;pixels[i+2]=255;}
  }
  const fitted=await sharp(pixels,{raw:resized.info}).png().toBuffer();
  const meta=await sharp(fitted).metadata();
  const left=Math.round((1200-(meta.width||0))/2),top=Math.round((1200-(meta.height||0))/2);
  const out=path.join(root,"public","media","motorcycles",id+".webp");
  await sharp({create:{width:1200,height:1200,channels:4,background:"#ffffff"}})
    .composite([{input:fitted,left,top}]).flatten({background:"#ffffff"})
    .webp({quality:90,effort:5,smartSubsample:true}).toFile(out);
  console.log("refreshed "+id+" -> "+(meta.width||0)+"x"+(meta.height||0));
}
for(const target of targets) await normalize(target.id,target.urls);


async function cleanAdv160Badge(){
  const file=path.join(root,"public","media","motorcycles","honda-adv-160.webp");
  const white=await sharp({create:{width:280,height:250,channels:4,background:"#ffffff"}}).png().toBuffer();
  await sharp(file).composite([{input:white,left:850,top:105}]).flatten({background:"#ffffff"}).webp({quality:90,effort:5,smartSubsample:true}).toFile(file+".tmp.webp");
  await import("node:fs/promises").then(fs=>fs.rename(file+".tmp.webp",file));
  console.log("removed standalone ADV160 badge on white canvas");
}
await cleanAdv160Badge();
