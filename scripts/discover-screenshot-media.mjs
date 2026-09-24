const targets = [
  ["honda-crf300-rally","https://powersports.honda.com/motorcycle/dual-sport/crf300l-rally/2026/crf300l-rally",["crf300","rally"]],
  ["honda-cb500-hornet-e-clutch","https://www.honda.co.uk/motorcycles/range/street/cb500-hornet/overview.html",["cb500","hornet"]],
  ["suzuki-avenis","https://mc.suzuki.com.ph/motorcycles/scooter/avenis/",["avenis"]],
  ["suzuki-smash-fi","https://mc.suzuki.com.ph/motorcycles/underbone/smash-fi/",["smash","fi"]],
  ["suzuki-gixxer-155","https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-155/",["gixxer","155"]],
  ["suzuki-gixxer-sf-155","https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-sf155/",["gixxer","sf","155"]],
  ["suzuki-gixxer-250","https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-250/",["gixxer","250"]],
  ["suzuki-gixxer-sf250","https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-sf-250/",["gixxer","sf250"]],
  ["suzuki-v-strom-250-sx","https://mc.suzuki.com.ph/motorcycles/backbone/v-strom-250-sx/",["strom","250"]],
  ["suzuki-v-strom-160","https://mc.suzuki.com.ph/motorcycles/backbone/v-strom-160/",["strom","160"]],
  ["suzuki-dr160","https://mc.suzuki.com.ph/motorcycles/backbone/dr160/",["dr160"]],
  ["suzuki-access","https://mc.suzuki.com.ph/motorcycles/scooter/access/",["access"]],
  ["suzuki-skydrive-sport","https://mc.suzuki.com.ph/motorcycles/scooter/skydrive-sport/",["skydrive"]],
  ["suzuki-burgman-street","https://mc.suzuki.com.ph/motorcycles/scooter/burgman-street/",["burgman","street"]],
  ["suzuki-burgman-400","https://mc.suzuki.com.ph/motorcycles/big-bike/burgman-400/",["burgman","400"]],
  ["cfmoto-450mt","https://www.cfmotoph.com/motorcycle/450mt",["450mt"]],
  ["cfmoto-450sr","https://www.cfmotoph.com/motorcycle/450sr",["450sr"]],
  ["cfmoto-675sr-r","https://www.cfmotoph.com/motorcycle/675sr",["675","sr"]],
  ["bristol-adx-160","https://www.bristol-motorcycles.com/adx160",["adx","160"]],
  ["benelli-180s","https://www.benelli.com/np-en/products/180s",["180s"]],
  ["benelli-trk-502x","https://www.benelli.com/my-en/products/trk-502x/",["trk","502"]],
  ["ktm-390-duke","https://www.ktm.com/en-my/models/naked-bike/2023-ktm-390-duke.html",["390","duke"]],
  ["royal-enfield-hunter-350","https://www.royalenfield.com/in/en/motorcycles/hunter-350/",["hunter","350"]],
  ["royal-enfield-himalayan-450","https://www.royalenfield.com/ph/en/motorcycles/new-himalayan/",["himalayan","450"]],
  ["bmw-g-310-gs","https://www.bmwmotorrad.com.ph/en/models/adventure/g310gs.html",["g310","310","gs"]],
  ["bmw-g-310-r","https://www.bmwmotorrad.com.ph/en/models/roadster/g310r.html",["g310","310","r"]],
  ["bmw-r-1300-gs","https://www.bmwmotorrad.com.ph/en/models/adventure/r1300gs.html",["1300","gs"]],
  ["vespa-primavera-150","https://storeusa.vespa.com/primavera/primavera-150.aspx",["primavera","150"]],
  ["husqvarna-vitpilen-401","https://www.husqvarna-motorcycles.com/en-ph/models/naked/vitpilen/vitpilen-401-2023.html",["vitpilen","401"]],
  ["motorstar-cafe-400","https://www.zigwheels.ph/new-motorcycles/motorstar/cafe-400",["cafe","400"]],
  ["motorstar-xplorer-250r","https://www.zigwheels.ph/new-motorcycles/motorstar/xplorer-250r/images",["xplorer","250r"]],
  ["sym-cruisym-150","https://www.xsmt.com/product/show-4288.html",["cruisym","150"]]
];

function decode(v=""){return v.replaceAll("&amp;","&").replaceAll("&quot;",'"').replaceAll("&#39;","'").replaceAll("\\/","/");}
function attrs(tag){
  const out={};
  for(const m of tag.matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)) out[m[1].toLowerCase()]=decode(m[2]);
  return out;
}
function bestSrc(a,page){
  const candidates=[];
  for(const key of ["src","data-src","data-lazy-src","data-original","data-image","data-background-image","content"]) if(a[key]) candidates.push(a[key]);
  for(const key of ["srcset","data-srcset"]){
    if(!a[key]) continue;
    for(const part of a[key].split(",")){
      const bits=part.trim().split(/\s+/);
      if(bits[0]) candidates.push(bits[0]);
    }
  }
  for(const c of candidates){
    if(!c || c.startsWith("data:")) continue;
    try{return new URL(c,page).href}catch{}
  }
  return "";
}
for(const [id,page,keywords] of targets){
  console.log("\n###",id,page);
  try{
    const res=await fetch(page,{redirect:"follow",headers:{"user-agent":"Mozilla/5.0 Chrome/153 Safari/537.36","accept":"text/html,*/*"},signal:AbortSignal.timeout(30000)});
    console.log("HTTP",res.status,res.url);
    const html=await res.text();
    const tags=html.match(/<(?:img|source|meta)\b[^>]*>/gi)||[];
    const scored=[];
    for(const tag of tags){
      const a=attrs(tag);
      const src=bestSrc(a,res.url);
      if(!src) continue;
      const hay=[a.alt,a.title,a.class,a.id,a.src,a["data-src"],a["srcset"],a.content].filter(Boolean).join(" ").toLowerCase();
      const score=keywords.reduce((n,k)=>n+(hay.includes(k.toLowerCase())?3:0),0)
        +(hay.includes("color")||hay.includes("colour")?2:0)
        +(hay.includes("model")||hay.includes("bike")||hay.includes("motorcycle")?1:0)
        +(src.match(/\.(png|webp)(\?|$)/i)?1:0)
        -(hay.includes("logo")||hay.includes("icon")||hay.includes("feature")?3:0);
      scored.push({score,alt:a.alt||"",title:a.title||"",src});
    }
    const uniq=[]; const seen=new Set();
    for(const x of scored.sort((a,b)=>b.score-a.score)){
      if(seen.has(x.src)) continue; seen.add(x.src); uniq.push(x); if(uniq.length>=18) break;
    }
    for(const x of uniq) console.log(JSON.stringify(x));
  }catch(e){console.log("ERROR",String(e));}
}
