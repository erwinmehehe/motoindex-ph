// Repair retry after QA guards landed.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const MEDIA_DIR = path.join(ROOT, "public", "media", "motorcycles");
const MEDIA_TS = path.join(ROOT, "lib", "media.ts");
const CONTACT_SHEET = path.join(ROOT, "artifacts", "screenshot-media-contact-sheet.jpg");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153 Safari/537.36";

const targets = [
  { id:"honda-crf300-rally", imageUrl:"https://powersports.honda.com/motorcycle/dual-sport/crf300l-rally/2026/-/media/products/family/crf300l-rally/trims/trim-main/crf300l-rally/2026/2026-crf300l-rally-red-1505x923.png?imwidth=1600", page:"https://powersports.honda.com/motorcycle/dual-sport/crf300l-rally/2026/crf300l-rally", holder:"Honda", label:"Manufacturer product image · Honda CRF300L Rally" },
  { id:"honda-cb500-hornet-e-clutch", imageUrl:"https://www.honda.co.uk/content/dam/central/motorcycles/colour-picker/street/cb500_hornet/cb500_hornet_2026/nh-b01_graphite_black/K002_26YM_CB500HORNET_MT_NH-B01_GraphiteBlack_RhSide.png", page:"https://www.honda.co.uk/motorcycles/range/street/cb500-hornet/overview.html", holder:"Honda", label:"Manufacturer product image · Honda CB500 Hornet" },

  { id:"suzuki-avenis", imageUrl:"https://motortrade.com.ph/wp-content/uploads/2022/08/1.jpg", page:"https://motortrade.com.ph/motorcycles/suzuki-avenis/", holder:"Motortrade / Suzuki", label:"Dealer product image · Suzuki Avenis" },
  { id:"suzuki-smash-fi", imageUrl:"https://motortrade.com.ph/wp-content/uploads/2025/09/Untitled-design-300x251.png", page:"https://motortrade.com.ph/motorcycles/suzuki-smash-fi/", holder:"Motortrade / Suzuki", label:"Dealer product image · Suzuki Smash FI" },
  { id:"suzuki-raider-j-crossover", current:true },
  { id:"suzuki-gixxer-155", imageUrl:"https://mc.suzuki.com.ph/wp-content/uploads/2024/10/GIXXER155PrevFeb6.png", page:"https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-155/", holder:"Suzuki Philippines", label:"Manufacturer product image · Suzuki Gixxer 155" },
  { id:"suzuki-gixxer-sf-155", imageUrl:"https://mc.suzuki.com.ph/wp-content/uploads/2024/10/PMRGSF155Feb6-2.png", page:"https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-sf155/", holder:"Suzuki Philippines", label:"Manufacturer product image · Suzuki Gixxer SF 155" },
  { id:"suzuki-gixxer-250", imageUrl:"https://motortrade.com.ph/wp-content/uploads/2022/05/GIXXER-GSX250RL-1.jpg", page:"https://motortrade.com.ph/motorcycles/suzuki-gixxer-250-2/", holder:"Motortrade / Suzuki", label:"Dealer product image · Suzuki Gixxer 250" },
  { id:"suzuki-gixxer-sf250", current:true },
  { id:"suzuki-v-strom-250-sx", imageUrl:"https://mc.suzuki.com.ph/wp-content/uploads/2023/10/V-Strom-250-SX-Champion-Yellow-1.png", page:"https://mc.suzuki.com.ph/motorcycles/backbone/v-strom-250-sx/", holder:"Suzuki Philippines", label:"Manufacturer product image · Suzuki V-Strom 250 SX" },
  { id:"suzuki-v-strom-160", imageUrl:"https://mc.suzuki.com.ph/wp-content/uploads/2026/04/Solid-Cool-Yellow-VS160SCYApr15_5.png", page:"https://mc.suzuki.com.ph/motorcycles/backbone/v-strom-160/", holder:"Suzuki Philippines", label:"Manufacturer product image · Suzuki V-Strom 160" },
  { id:"suzuki-dr160", imageUrl:"https://mc.suzuki.com.ph/wp-content/uploads/2026/04/DR160SWApr15-5.png", page:"https://mc.suzuki.com.ph/motorcycles/backbone/dr-160/", holder:"Suzuki Philippines", label:"Manufacturer product image · Suzuki DR160" },
  { id:"suzuki-access", imageUrl:"https://mc.suzuki.com.ph/wp-content/uploads/2025/10/Access-Standard.png", page:"https://mc.suzuki.com.ph/motorcycles/scooter/access/", holder:"Suzuki Philippines", label:"Manufacturer product image · Suzuki Access" },
  { id:"suzuki-skydrive-sport", imageUrl:"https://mc.suzuki.com.ph/wp-content/uploads/2024/05/Skydrive_Black_1-1.png", page:"https://mc.suzuki.com.ph/motorcycles/scooter/skydrive-sport/", holder:"Suzuki Philippines", label:"Manufacturer product image · Suzuki Skydrive Sport" },
  { id:"suzuki-burgman-street", imageUrl:"https://mc.suzuki.com.ph/wp-content/uploads/2023/11/Burgman-Street-Standard-Candy-Red.png", page:"https://mc.suzuki.com.ph/motorcycles/scooter/burgman-street/", holder:"Suzuki Philippines", label:"Manufacturer product image · Suzuki Burgman Street" },
  { id:"suzuki-burgman-400", imageUrl:"https://mc.suzuki.com.ph/wp-content/uploads/2023/11/19-17-1024x576.webp", page:"https://mc.suzuki.com.ph/motorcycles/big-bike/burgman-400/", holder:"Suzuki Philippines", label:"Manufacturer product image · Suzuki Burgman 400" },

  { id:"motorstar-cafe-400", imageUrl:"https://imgcdn.zigwheels.ph/large/gallery/exterior/78/1899/motorstar-cafe-400-right-side-viewfull-image-779807.jpg", page:"https://www.zigwheels.ph/new-motorcycles/motorstar/cafe-400", holder:"Zigwheels Philippines", label:"Catalog product image · MotorStar Cafe 400" },
  { id:"motorstar-xplorer-250r", imageUrl:"https://imgcdn.zigwheels.ph/large/gallery/color/78/1034/motorstar-xplorer-250r-color-270316.jpg", page:"https://www.zigwheels.ph/new-motorcycles/motorstar/xplorer-250r/images", holder:"Zigwheels Philippines", label:"Philippine catalog color image · MotorStar Xplorer 250R" },
  { id:"sym-cruisym-150", current:true },

  { id:"cfmoto-450mt", imageUrl:"https://static.wixstatic.com/media/0a0f90_33a69b54405f4f13914f06ee5db819e0~mv2.png", page:"https://www.cfmotoph.com/motorcycle/450mt", holder:"CFMOTO Philippines", label:"Manufacturer product image · CFMOTO 450MT" },
  { id:"cfmoto-450sr", imageUrl:"https://static.wixstatic.com/media/0a0f90_1b3274884ee545a781231cbefcb0d7d9~mv2.png", page:"https://www.cfmotoph.com/motorcycle/450sr", holder:"CFMOTO Philippines", label:"Manufacturer product image · CFMOTO 450SR" },
  { id:"cfmoto-675sr-r", imageUrl:"https://static.wixstatic.com/media/0a0f90_bcd5406be72d403295a51deca80f557b~mv2.png", page:"https://www.cfmotoph.com/motorcycle/675sr", holder:"CFMOTO Philippines", label:"Manufacturer product image · CFMOTO 675SR-R" },

  { id:"bristol-adx-160", imageUrl:"https://static.wixstatic.com/media/fc6fc6_fe7a98c0324d4b33aaa16db8539bff20~mv2.png", page:"https://www.bristol-motorcycles.com/adx160", holder:"Bristol Motorcycles Philippines", label:"Manufacturer product image · Bristol ADX 160" },
  { id:"benelli-180s", imageUrl:"https://cdn.keeway.com/benelli-3-0/media/8842/conversions/180S-White-md.png", page:"https://www.benelli.com/np-en/products/180s", holder:"Benelli", label:"Manufacturer product image · Benelli 180S" },
  { id:"benelli-trk-502x", imageUrl:"https://cdn.keeway.com/benelli-3-0/media/481/conversions/TRK-502X-%5B2020%5D-45-Blue-md.png", page:"https://www.benelli.com/my-en/products/trk-502x", holder:"Benelli", label:"Manufacturer product image · Benelli TRK 502X" },
  { id:"ktm-390-duke", imageUrl:"https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_PERS_REVO_MY23-KTM-390-DUKE--45-degree-front-right---INDIA-CTG--LIQUID-METAL-India-CTG_%23SALL_%23AEPI_%23V1.png", page:"https://www.ktm.com/en-my/models/naked-bike/2023-ktm-390-duke.html", holder:"KTM", label:"Manufacturer product image · KTM 390 Duke" },
  { id:"royal-enfield-hunter-350", imageUrl:"https://static-cdn.cars24.com/prod/new-bike-cms/Royal-Enfield/Hunter-350/2025/01/01/b9127f64-b4f2-425b-aa82-01bce35d485d-Royal-Enfield_Hunter-350_Dapper-White_-cce0fd.png?dpr=3&format=auto&optimize=low&quality=80&w=1000", page:"https://www.bikes24.com/royal-enfield/hunter-350/", holder:"Bikes24 / Royal Enfield", label:"Catalog product image · Royal Enfield Hunter 350" },
  { id:"royal-enfield-himalayan-450", imageUrl:"https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/himalayan/colors/new-studio-shots/mana-black/mana-black-000.webp", page:"https://www.royalenfield.com/ph/en/motorcycles/new-himalayan/", holder:"Royal Enfield", label:"Manufacturer studio image · Royal Enfield Himalayan 450" },

  { id:"bmw-g-310-gs", imageUrl:"https://mediapool.bmwgroup.com/download/edown/pressclub/publicq?actEvent=image&attachment=1&dokNo=P90402134", page:"https://www.press.bmwgroup.com/global/photo/detail/P90402134/BMW-G-310-GS-plain-polar-white-10-2020", holder:"BMW Group", label:"Official BMW Motorrad studio image · G 310 GS" },
  { id:"bmw-g-310-r", imageUrl:"https://mediapool.bmwgroup.com/download/edown/pressclub/publicq?actEvent=image&attachment=1&dokNo=P90407659", page:"https://www.press.bmwgroup.com/global/photo/detail/P90407659/The-new-BMW-G-310-R-base-colour-Polar-White-11-2020", holder:"BMW Group", label:"Official BMW Motorrad studio image · G 310 R" },
  { id:"bmw-r-1300-gs", imageUrl:"https://mediapool.bmwgroup.com/download/edown/pressclub/publicq?actEvent=image&attachment=1&dokNo=P90524533", page:"https://www.press.bmwgroup.com/global/photo/detail/P90524533/die-neue-bmw-r-1300-gs-trophy-09/2023", holder:"BMW Group", label:"Official BMW Motorrad studio image · R 1300 GS" },
  { id:"vespa-primavera-150", imageUrl:"https://storeusa.vespa.com/img/models/PRIMAVERA%20150/415/mainimg_primavera-150-metallic-orange.png", page:"https://storeusa.vespa.com/primavera/primavera-150.aspx", holder:"Vespa", label:"Manufacturer product image · Vespa Primavera 150" },
  { id:"husqvarna-vitpilen-401", imageUrl:"https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_PERS_REVO_HQV-22-Vitpilen-401-hd_%23SALL_%23AEPI_%23V1.png", page:"https://www.husqvarna-motorcycles.com/en-ph/models/naked/vitpilen/vitpilen-401-2023.html", holder:"Husqvarna Motorcycles", label:"Manufacturer product image · Husqvarna Vitpilen 401" }
];

function decode(v="") {
  return v.replaceAll("&amp;","&").replaceAll("&quot;",'"').replaceAll("&#39;","'").replaceAll("&#038;","&");
}
function getAttr(tag,name) {
  const m=tag.match(new RegExp("\\\\b"+name+"=[\"']([^\"']+)[\"']","i"));
  return decode(m?.[1] || "");
}
function srcsetUrls(v="") {
  return v.split(",").map(x=>x.trim().split(/\s+/)[0]).filter(Boolean);
}
async function discoverImage({page,needles}) {
  const res=await fetch(page,{redirect:"follow",headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml"},signal:AbortSignal.timeout(30000)});
  if(!res.ok) throw new Error("Page HTTP "+res.status+" "+page);
  const html=await res.text();
  const tags=html.match(/<(?:img|source|meta)\b[^>]*>/gi)||[];
  const candidates=[];
  for(const tag of tags) {
    const alt=getAttr(tag,"alt");
    const title=getAttr(tag,"title");
    const attrs=[
      getAttr(tag,"src"),getAttr(tag,"data-src"),getAttr(tag,"data-lazy-src"),
      getAttr(tag,"data-original"),getAttr(tag,"content"),
      ...srcsetUrls(getAttr(tag,"srcset")),...srcsetUrls(getAttr(tag,"data-srcset"))
    ].filter(Boolean);
    for(const raw of attrs) {
      if(raw.startsWith("data:")) continue;
      let url; try { url=new URL(raw,res.url).href; } catch { continue; }
      if(!/^https?:/i.test(url) || /(?:logo|icon|sprite|placeholder|1x1|spinner)/i.test(url)) continue;
      const hay=(alt+" "+title+" "+url).toLowerCase();
      let score=0;
      for(const needle of needles) {
        const words=needle.toLowerCase().split(/\s+/).filter(w=>w.length>2);
        const hits=words.filter(w=>hay.includes(w)).length;
        score=Math.max(score,hits*3);
        if(hay.includes(needle.toLowerCase())) score+=8;
      }
      if(/(?:color|colour|variant|product|model|main|studio|360)/i.test(hay)) score+=3;
      if(/(?:feature|detail|engine|meter|headlight|gallery|action|campaign|video|thumbnail)/i.test(hay)) score-=5;
      if(/\.(?:png|webp)(?:\?|$)/i.test(url)) score+=2;
      candidates.push({url,score,alt,title});
    }
  }
  const seen=new Set();
  for(const candidate of candidates.sort((a,b)=>b.score-a.score)) {
    if(seen.has(candidate.url)) continue;
    seen.add(candidate.url);
    try {
      const image=await fetchImage(candidate.url,page);
      if(image.width>=240 && image.height>=140) {
        console.log("Discovered",page,candidate.score,candidate.alt,candidate.url,image.width+"x"+image.height);
        return candidate.url;
      }
    } catch {}
  }
  throw new Error("No usable product image discovered from "+page);
}
async function fetchImage(url,referer) {
  const res=await fetch(url,{redirect:"follow",headers:{"user-agent":UA,accept:"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",referer:referer||url},signal:AbortSignal.timeout(45000)});
  if(!res.ok) throw new Error("Image HTTP "+res.status+" "+url);
  const bytes=Buffer.from(await res.arrayBuffer());
  const meta=await sharp(bytes,{failOn:"warning"}).metadata();
  if(!meta.width || !meta.height) throw new Error("Unreadable image "+url);
  if(meta.width<220 || meta.height<130) throw new Error("Source too small "+meta.width+"x"+meta.height+" "+url);
  return {bytes,url:res.url||url,width:meta.width,height:meta.height,hasAlpha:Boolean(meta.hasAlpha)};
}
function mediaBlock(source,id) {
  let i=source.indexOf('entityId:"'+id+'"');
  if(i<0) i=source.indexOf('entityId: "'+id+'"');
  if(i<0) throw new Error("Missing media entity "+id);
  const start=source.lastIndexOf("{",i);
  const endMarker=source.indexOf("\n  },",i);
  if(start<0 || endMarker<0) throw new Error("Cannot isolate media entity "+id);
  return {start,end:endMarker+5,block:source.slice(start,endMarker+5)};
}
function field(block,key) {
  return block.match(new RegExp("\\b"+key+"\\s*:\\s*\"([^\"]*)\""))?.[1] || "";
}
function replaceField(source,id,key,value) {
  const part=mediaBlock(source,id);
  const re=new RegExp("\\b"+key+"\\s*:\\s*\"[^\"]*\"");
  if(!re.test(part.block)) throw new Error("Missing "+key+" on "+id);
  const updated=part.block.replace(re,key+": "+JSON.stringify(value));
  return source.slice(0,part.start)+updated+source.slice(part.end);
}
async function normalize(bytes,dest) {
  let image=sharp(bytes,{failOn:"warning"}).rotate();
  const meta=await image.metadata();
  if(meta.hasAlpha) {
    image=image.ensureAlpha().trim({background:{r:0,g:0,b:0,alpha:0},threshold:6});
  } else {
    // Safe trim only removes a uniform white outer border. It never segments the motorcycle.
    image=image.trim({background:"#ffffff",threshold:10});
  }
  const fitted=await image.resize({width:1000,height:880,fit:"inside",withoutEnlargement:false,kernel:sharp.kernel.lanczos3}).png().toBuffer();
  const fmeta=await sharp(fitted).metadata();
  const left=Math.round((1200-(fmeta.width||1000))/2);
  const top=Math.round((1200-(fmeta.height||880))/2);
  await sharp({create:{width:1200,height:1200,channels:4,background:{r:255,g:255,b:255,alpha:1}}})
    .composite([{input:fitted,left,top}])
    .flatten({background:"#ffffff"})
    .webp({quality:91,effort:6})
    .toFile(dest);
}
async function makeContactSheet(ids) {
  const tileW=300,tileH=275,cols=4,rows=Math.ceil(ids.length/cols);
  const composites=[];
  for(let i=0;i<ids.length;i++){
    const id=ids[i];
    const img=await sharp(path.join(MEDIA_DIR,id+".webp")).resize({width:270,height:210,fit:"contain",background:"#ffffff"}).png().toBuffer();
    const x=(i%cols)*tileW+15, y=Math.floor(i/cols)*tileH+8;
    composites.push({input:img,left:x,top:y});
    const safe=id.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
    const label=Buffer.from('<svg width="285" height="45" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="4" y="25" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#111827">'+safe+'</text></svg>');
    composites.push({input:label,left:(i%cols)*tileW+8,top:Math.floor(i/cols)*tileH+224});
  }
  await fs.mkdir(path.dirname(CONTACT_SHEET),{recursive:true});
  await sharp({create:{width:cols*tileW,height:rows*tileH,channels:3,background:"#f7f8fb"}})
    .composite(composites).jpeg({quality:88}).toFile(CONTACT_SHEET);
}

let media=await fs.readFile(MEDIA_TS,"utf8");
const results=[];
for(const target of targets) {
  try {
    const block=mediaBlock(media,target.id).block;
    const existingImage=field(block,"sourceImageUrl");
    const existingPage=field(block,"sourceUrl");
    let sourceUrl=target.imageUrl || existingImage;
    if(target.discover) sourceUrl=await discoverImage(target.discover);
    if(!sourceUrl) throw new Error("No source image for "+target.id);
    const referer=target.page || target.discover?.page || existingPage || sourceUrl;
    const image=await fetchImage(sourceUrl,referer);
    const dest=path.join(MEDIA_DIR,target.id+".webp");
    await normalize(image.bytes,dest);
    if(!target.current) {
      media=replaceField(media,target.id,"sourceImageUrl",image.url);
      media=replaceField(media,target.id,"sourceUrl",target.page || target.discover?.page || referer);
      media=replaceField(media,target.id,"sourceLabel",target.label);
      media=replaceField(media,target.id,"rightsHolder",target.holder);
    }
    media=replaceField(media,target.id,"lastChecked","2026-09-24");
    results.push({id:target.id,status:"updated",source:image.url,dimensions:image.width+"x"+image.height});
    console.log("UPDATED",target.id,image.width+"x"+image.height,image.url);
  } catch(error) {
    results.push({id:target.id,status:"error",error:String(error)});
    console.error("ERROR",target.id,String(error));
  }
}
await fs.writeFile(MEDIA_TS,media);
await makeContactSheet(results.filter(x=>x.status==="updated").map(x=>x.id));
await fs.writeFile(path.join(ROOT,"artifacts","screenshot-media-repair.json"),JSON.stringify(results,null,2));
const errors=results.filter(x=>x.status==="error");
console.log("Repair summary",results.length-errors.length,"/",results.length,"updated");
if(errors.length) process.exitCode=1;
