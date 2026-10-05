import fs from "node:fs/promises";
import path from "node:path";

const ROOT=process.cwd();
const ids=[
  "studds-helios",
  "studds-trooper-sport",
  "scorpion-exo-r1-air-carbon",
  "scorpion-exo-adx-2",
  "scorpion-exo-adf-9000-air",
  "scorpion-exo-covert-fx",
  "scorpion-covert-2",
  "nolan-n120-1",
  "nolan-n70-2-x",
  "nolan-n21-visor",
  "nolan-x-804rs-ultra-carbon",
  "nolan-x-552-ultra-carbon",
  "ryo-rf-4sv",
  "ryo-rf-5v",
  "ryo-rf-6v",
  "ryo-ro-4sv",
  "evo-vxr-5000",
  "evo-gt-sport",
  "evo-xt-300-riot-ii",
  "evo-gx-1",
  "evo-dx-7",
  "sec-windstorm-v3",
  "sec-whirlwind",
  "sec-rise-v2",
  "sec-element",
  "oneal-2srs",
  "oneal-3srs",
  "oneal-3srs-ii"
];
const source=await fs.readFile(path.join(ROOT,"lib","media.ts"),"utf8");
const outDir=path.join(ROOT,"public","media","helmets");
await fs.mkdir(outDir,{recursive:true});

function recordBlock(id){
  const needle=`entityId: "${id}"`;
  const at=source.indexOf(needle);
  if(at<0) throw new Error(`Media record missing for ${id}`);
  const start=source.lastIndexOf("  {",at);
  const end=source.indexOf("\n  },",at);
  if(start<0||end<0) throw new Error(`Could not parse media block for ${id}`);
  return source.slice(start,end+5);
}
function field(block,name){
  const m=block.match(new RegExp(`${name}:\\s*("[^"]*"|'[^']*')`));
  if(!m)return "";
  return m[1].slice(1,-1);
}
function htmlImageCandidates(html,base){
  const raw=[];
  for(const re of [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/ig,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/ig,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/ig,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/ig,
    /"image"\s*:\s*"([^"]+)"/ig
  ]){
    let m; while((m=re.exec(html))) raw.push(m[1]);
  }
  return [...new Set(raw.map(v=>v.replace(/&amp;/g,"&")).map(v=>{try{return new URL(v,base).href}catch{return ""}}).filter(Boolean))];
}
async function request(url){
  let lastError;
  for(let attempt=1;attempt<=2;attempt+=1){
    try{
      const res=await fetch(url,{
        redirect:"follow",
        signal:AbortSignal.timeout(20000),
        headers:{
          "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153 Safari/537.36",
          "accept":"image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "accept-language":"en-US,en;q=0.9"
        }
      });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    }catch(error){
      lastError=error;
      if(attempt<2) await new Promise(resolve=>setTimeout(resolve,500));
    }
  }
  throw lastError;
}
async function fetchImage(url){
  const res=await request(url);
  const type=(res.headers.get("content-type")||"").toLowerCase();
  const bytes=new Uint8Array(await res.arrayBuffer());
  if(bytes.length<1000) throw new Error(`response too small (${bytes.length} bytes)`);
  if(type.includes("text/html")) throw new Error("received HTML instead of image");
  return bytes;
}

const failures=[];
for(const id of ids){
  const block=recordBlock(id);
  const direct=field(block,"sourceImageUrl");
  const page=field(block,"sourceUrl");
  const attempts=[];
  let bytes;
  if(direct) attempts.push(direct);
  if(page){
    try{
      const pageRes=await request(page);
      const html=await pageRes.text();
      attempts.push(...htmlImageCandidates(html,page));
    }catch(error){
      console.warn(`${id}: product page lookup failed: ${error.message}`);
    }
  }

  const seen=new Set();
  for(const url of attempts){
    if(!url||seen.has(url))continue;
    seen.add(url);
    try{
      bytes=await fetchImage(url);
      console.log(`${id}: fetched ${bytes.length} bytes from ${url}`);
      break;
    }catch(error){
      console.warn(`${id}: failed ${url}: ${error.message}`);
    }
  }
  if(!bytes){
    failures.push(id);
    continue;
  }
  await fs.writeFile(path.join(outDir,`${id}.webp`),bytes);
}
if(failures.length){
  console.error(`Helmet image sync failed for ${failures.length}: ${failures.join(", ")}`);
  process.exit(1);
}
console.log(`Helmet image sync downloaded ${ids.length}/${ids.length} exact-model sources.`);
