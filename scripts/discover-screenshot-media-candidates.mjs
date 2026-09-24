import sharp from "sharp";

const targets = [
  ["triumph-speed-twin-900","https://www.triumphmotorcycles.com/motorcycles/classic/bonneville-speed-twin-900/models"],
  ["triumph-tiger-sport-660","https://www.triumphmotorcycles.com/motorcycles/adventure/tiger-sport-660/models"],
  ["triumph-daytona-660","https://www.triumphmotorcycles.com/motorcycles/sport/daytona/daytona-660"],
  ["kawasaki-ninja-650","https://www.kawasaki.eu/en/EICMA/Ninja_650.html"],
  ["kawasaki-versys-650","https://www.kawasaki.eu/en/EICMA/Versys_650.html"],
  ["kawasaki-vulcan-s","https://www.kawasaki.eu/en/EICMA/Vulcan_S.html"],
  ["bmw-s-1000-rr","https://www.bmw-motorrad.com/en/models/sport/s1000rr.html"],
  ["bmw-m-1000-rr","https://www.bmw-motorrad.com/en/models/m/m1000rr.html"],
  ["bmw-s-1000-r","https://www.bmw-motorrad.com/en/models/roadster/s1000r.html"],
  ["motorstar-cafe-400","https://www.zigwheels.ph/new-motorcycles/motorstar/cafe-400"]
];

const ua="Mozilla/5.0 MotoIndexMediaResearch/1.0";

function decode(s){
  return s
    .replaceAll("\\/","/")
    .replaceAll("\\u002F","/")
    .replaceAll("\\u0026","&")
    .replaceAll("&amp;","&")
    .replaceAll("&#x2F;","/")
    .replaceAll("&quot;",'"');
}

function imageUrls(html,page){
  const clean=decode(html);
  const out=new Set();
  const absolute=clean.match(/https?:\/\/[^"'<>\\s)]+/g)||[];
  for(let u of absolute){
    u=u.replace(/[;,]$/,"");
    if(/\.(?:jpe?g|png|webp|avif)(?:\?|$)/i.test(u) || /image\/upload|mediapool|content\/dam|static\.wixstatic|imgcdn\.zigwheels/i.test(u)) out.add(u);
  }
  const attrs=[...clean.matchAll(/(?:src|data-src|srcset|content)=["']([^"']+)["']/gi)].map(m=>m[1]);
  for(const value of attrs){
    for(let part of value.split(",")){
      let u=part.trim().split(/\s+/)[0];
      if(!u)continue;
      try{u=new URL(u,page).href;}catch{continue;}
      if(/\.(?:jpe?g|png|webp|avif)(?:\?|$)/i.test(u) || /image\/upload|mediapool|content\/dam|imgcdn\.zigwheels/i.test(u))out.add(u);
    }
  }
  return [...out];
}

function borderWhiteRatio(data,info){
  const {width,height,channels}=info;
  const band=Math.max(3,Math.floor(Math.min(width,height)/40));
  let white=0,total=0;
  const check=(x,y)=>{
    const p=(y*width+x)*channels; total++;
    if(data[p]>=238&&data[p+1]>=238&&data[p+2]>=238)white++;
  };
  for(let y=0;y<band;y++)for(let x=0;x<width;x++)check(x,y);
  for(let y=height-band;y<height;y++)for(let x=0;x<width;x++)check(x,y);
  for(let x=0;x<band;x++)for(let y=0;y<height;y++)check(x,y);
  for(let x=width-band;x<width;x++)for(let y=0;y<height;y++)check(x,y);
  return total?white/total:0;
}

for(const [id,page] of targets){
  try{
    const res=await fetch(page,{headers:{"user-agent":ua,accept:"text/html,*/*"}});
    console.log("\n###",id,"PAGE",res.status,page);
    if(!res.ok)continue;
    const html=await res.text();
    const urls=imageUrls(html,page).slice(0,120);
    if(id.startsWith("triumph-")) console.log("RAW_CANDIDATES", JSON.stringify(urls.filter(u=>/triumph|media\./i.test(u)).slice(0,40),null,2));
    const scored=[];
    for(const url of urls){
      try{
        const ir=await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(10000),headers:{"user-agent":ua,referer:page,accept:"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8"}});
        if(!ir.ok)continue;
        const type=(ir.headers.get("content-type")||"").toLowerCase();
        if(!type.startsWith("image/"))continue;
        const buf=Buffer.from(await ir.arrayBuffer());
        if(buf.length<12000)continue;
        const meta=await sharp(buf).metadata();
        if((meta.width||0)<500||(meta.height||0)<350)continue;
        const sample=await sharp(buf).rotate().flatten({background:"#fff"}).resize({width:320,height:320,fit:"inside"}).removeAlpha().raw().toBuffer({resolveWithObject:true});
        const white=borderWhiteRatio(sample.data,sample.info);
        scored.push({url,width:meta.width,height:meta.height,bytes:buf.length,white:Number(white.toFixed(3))});
      }catch{}
      if(scored.length>=35)break;
    }
    scored.sort((a,b)=>b.white-a.white || b.bytes-a.bytes);
    console.log(JSON.stringify(scored.slice(0,12),null,2));
  }catch(e){
    console.log("\n###",id,"ERROR",e?.message||String(e));
  }
}
