import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const mediaPath = path.join(root, "lib/media.ts");
let source = fs.readFileSync(mediaPath, "utf8");
const UA = "Mozilla/5.0 (compatible; MotoIndexMediaRepair/1.0; +https://motoindexph.com)";
const WHITE = { r:255, g:255, b:255, alpha:1 };

const targets = [
  "honda-xl750-transalp","honda-crf1100l-africa-twin","motorstar-cafe-400",
  "husqvarna-svartpilen-401","royal-enfield-guerrilla-450","royal-enfield-classic-350",
  "ktm-790-duke","ducati-streetfighter-v4","ducati-panigale-v4","honda-x-adv",
  "honda-cbr650r","kawasaki-ninja-1000","bajaj-pulsar-ns400z","bmw-f-900-gs",
  "triumph-speed-twin-900","triumph-tiger-sport-660","bmw-s-1000-rr","bmw-m-1000-rr",
  "bmw-s-1000-r","triumph-daytona-660","kawasaki-ninja-650","kawasaki-versys-650",
  "kawasaki-vulcan-s"
];

const pageOverride = {
  "honda-xl750-transalp":"https://powersports.honda.com/motorcycle/adventure/transalp",
  "honda-crf1100l-africa-twin":"https://powersports.honda.com/motorcycle/adventure/africa-twin",
  "honda-cbr650r":"https://powersports.honda.com/motorcycle/sport/cbr650r",
  "royal-enfield-guerrilla-450":"https://www.royalenfield.com/ph/en/motorcycles/guerrilla-450/campaign/",
  "royal-enfield-classic-350":"https://www.royalenfield.com/ph/en/motorcycles/classic-350/",
  "ktm-790-duke":"https://www.ktm.com/en-int/models/naked-bike/2025-ktm-790-duke.html",
  "ducati-streetfighter-v4":"https://www.ducati.com/us/en/bikes/streetfighter/streetfighter-v4",
  "ducati-panigale-v4":"https://www.ducati.com/us/en/bikes/panigale/panigale-v4",
  "husqvarna-svartpilen-401":"https://www.husqvarna-motorcycles.com/en-be/models/naked/svartpilen/svartpilen-401-2026.html",
  "bajaj-pulsar-ns400z":"https://www.bajajauto.com/en-ph/bikes/pulsar-ns400z",
  "bmw-s-1000-rr":"https://www.bmwmotorcycles.com/en/models/sport/s1000rr.html",
  "bmw-m-1000-rr":"https://www.bmwmotorcycles.com/en/models/m/m1000rr.html",
  "bmw-s-1000-r":"https://www.press.bmwgroup.com/global/photo/detail/P90573634/the-new-bmw-s-1000-r-10/2024",
  "bmw-s-1000-rr":"https://www.press.bmwgroup.com/global/photo/detail/P90573621/the-new-bmw-s-1000-rr-10/2024",
  "bmw-m-1000-rr":"https://www.press.bmwgroup.com/canada/article/detail/T0404638EN/the-new-bmw-m-1000-rr-and-m-1000-rr-m-competition",
  "triumph-speed-twin-900":"https://www.triumphmotorcycles.com/motorcycles/classic/bonneville-speed-twin-900",
  "triumph-tiger-sport-660":"https://www.triumphmotorcycles.ph/bikes/adventure/tiger-sport-660",
  "triumph-daytona-660":"https://www.triumphmotorcycles.ph/bikes/sport/daytona-660",
  "kawasaki-ninja-650":"https://www.kawasaki.eu/en/Motorcycles/A2_Bikes/Ninja_650_2026.html/EX650STFNN/EX650STFNN/MetallicFlatSparkBlackMetallicCarbonGray",
  "kawasaki-versys-650":"https://www.kawasaki.eu/en/Motorcycles/Adventure_Tourer/Versys_650_2026.html",
  "kawasaki-vulcan-s":"https://www.kawasaki.eu/en/Motorcycles/A2_Bikes/Vulcan_S_2026.html/EN650MTFNN/EN650MTFNNTR/MetallicFlatSparkBlack"
};

const forcedImage = {
  "honda-xl750-transalp":"https://global.honda/content/dam/site/global-en/newsroom-new/cq_img/news/2026/03/2260306eng-xl750/web/2260306-xl750_001L.jpg",
  "honda-crf1100l-africa-twin":"https://global.honda/content/dam/site/global-en/newsroom-new/cq_img/news/2026/01/2260123eng-crf1100l/web/2260123-crf1100l_001L.jpg",
  "honda-cbr650r":"https://global.honda/content/dam/site/global-en/newsroom-new/cq_img/news/2023/11/dl/c231107a_004H.jpg",
  "husqvarna-svartpilen-401":"https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_90_RE_Svartpilen-401-MY24-90-right_%23SALL_%23AEPI_%23V2.png",
  "ktm-790-duke":"https://cdn.visordown.com/field/image/422060_MY22%20KTM%20790%20DUKE%20_45_%20right%20front_.jpg?aspect_ratio=1%3A1&width=1600",
  "bmw-f-900-gs":"https://mediapool.bmwgroup.com/cache/P9/202402/P90539201/P90539201-the-bmw-f-900-gs-on-road-stills-02-2024-2250px.jpg",
  "bmw-s-1000-rr":"https://mediapool.bmwgroup.com/cache/P9/202410/P90573621/P90573621-the-new-bmw-s-1000-rr-10-2024-2666px.jpg",
  "bmw-s-1000-r":"https://mediapool.bmwgroup.com/cache/P9/202410/P90573634/P90573634-the-new-bmw-s-1000-r-10-2024-2121px.jpg",
  "triumph-speed-twin-900":"https://images5.1000ps.net/images_bikekat/2026/37-Triumph/11248-Speed_Twin_900/006-639008772224739700-triumph-speed-twin-900.jpg",
  "kawasaki-ninja-1000":"https://images5.1000ps.net/images_bikekat/2024/6-Kawasaki/9954-Ninja_1000SX/015-638384932469909422-kawasaki-ninja-1000sx.jpg",
  "bajaj-pulsar-ns400z":"https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/web-header-navigator-images/pulsar-ns400z.webp",
  "kawasaki-ninja-650":"https://www.kawasaki.eu/content/dam/products/pim/studio/s/Resource_320285_26EX650P_S_44TBK1DRF3CG_A.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.png",
  "kawasaki-versys-650":"https://www.kawasaki.eu/content/dam/products/pim/studio/j/Resource_329910_27KLE650H_J_K_44TGN1DRF3CG_A.jpg/_jcr_content/renditions/cq5dam.thumbnail.600.600.png",
  "kawasaki-vulcan-s":"https://www.kawasaki.eu/content/dam/products/pim/studio/m/Resource_329865_27EN650D_M_44TGY1DRF1CG_A.jpg/_jcr_content/renditions/cq5dam.thumbnail.600.600.png"
};

const forcedMeta = {
  "ktm-790-duke":{rightsHolder:"KTM / Visordown",sourceUrl:"https://press.ktm.com/news-2022-ktm-790-duke-the-original-scalpel-returns?id=152835&l=uk&menueid=5904",sourceLabel:"Clean exact-model product image · KTM 790 Duke"},
  "triumph-speed-twin-900":{rightsHolder:"1000PS / Triumph",sourceUrl:"https://www.1000ps.com/en-us/model/11248/triumph-speed-twin-900",sourceLabel:"Exact-model studio image · Triumph Speed Twin 900"},
  "kawasaki-ninja-1000":{rightsHolder:"1000PS / Kawasaki",sourceUrl:"https://www.1000ps.com/en-us/model/9954/kawasaki-ninja-1000sx",sourceLabel:"Exact-model studio image · Kawasaki Ninja 1000SX"},
  "kawasaki-ninja-650":{rightsHolder:"Kawasaki Motors Europe",sourceUrl:"https://www.kawasaki.eu/en/Motorcycles/A2_Bikes/Ninja_650_2026.html/EX650STFNN/EX650STFNN/MetallicFlatSparkBlackMetallicCarbonGray",sourceLabel:"Manufacturer studio image · Kawasaki Ninja 650"},
  "kawasaki-versys-650":{rightsHolder:"Kawasaki Motors Europe",sourceUrl:"https://www.kawasaki.eu/en/Motorcycles/Adventure_Tourer/Versys_650_2027.html",sourceLabel:"Manufacturer studio image · Kawasaki Versys 650"},
  "kawasaki-vulcan-s":{rightsHolder:"Kawasaki Motors Europe",sourceUrl:"https://www.kawasaki.eu/en/Motorcycles/Urban_Cruiser/Vulcan_S_2027.html",sourceLabel:"Manufacturer studio image · Kawasaki Vulcan S"},
  "bajaj-pulsar-ns400z":{rightsHolder:"Bajaj Auto",sourceUrl:"https://www.bajajauto.com/booking/pulsar-ns400",sourceLabel:"Manufacturer product image · Bajaj Pulsar NS400Z"},
  "bmw-f-900-gs":{rightsHolder:"BMW Motorrad",sourceUrl:"https://www.press.bmwgroup.com/global/photo/detail/P90539201/The-BMW-F-900-GS-On-road-stills-02-2024",sourceLabel:"Manufacturer image · BMW F 900 GS"}
};

function extractArray(text, declaration){
  const start=text.indexOf(declaration); if(start<0)return "";
  const open=text.indexOf("[",text.indexOf("=",start)); if(open<0)return "";
  let q="",str=false,esc=false,depth=0;
  for(let i=open;i<text.length;i++){const ch=text[i];
    if(str){if(esc)esc=false;else if(ch==="\\")esc=true;else if(ch===q)str=false;continue;}
    if(ch==='"'||ch==="'"||ch==='\`'){str=true;q=ch;continue;}
    if(ch==="[")depth++; else if(ch==="]"&&--depth===0)return text.slice(open+1,i);
  } return "";
}
function objects(text){
  const out=[];let q="",str=false,esc=false,depth=0,start=-1;
  for(let i=0;i<text.length;i++){const ch=text[i];
    if(str){if(esc)esc=false;else if(ch==="\\")esc=true;else if(ch===q)str=false;continue;}
    if(ch==='"'||ch==="'"||ch==='\`'){str=true;q=ch;continue;}
    if(ch==="{"){if(depth===0)start=i;depth++;} else if(ch==="}"&&--depth===0&&start>=0){out.push(text.slice(start,i+1));start=-1;}
  } return out;
}
function field(block,name){
  const doubleQuoted=block.match(new RegExp("\\b"+name+"\\s*:\\s*\\\"([^\\\"]+)\\\""));
  if(doubleQuoted)return doubleQuoted[1];
  return block.match(new RegExp("\\b"+name+"\\s*:\\s*'([^']+)'"))?.[1]||"";
}
function setField(block,name,value){
  let re=new RegExp("\\b"+name+"\\s*:\\s*\\\"[^\\\"]*\\\"");
  if(!re.test(block)) re=new RegExp("\\b"+name+"\\s*:\\s*'[^']*'");
  if(re.test(block))return block.replace(re,name+":"+JSON.stringify(value));
  return block.replace(/(\brole\s*:\s*["'][^"']+["']\s*,?)/,"$1 "+name+":"+JSON.stringify(value)+",");
}
function decode(v){return v.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'");}
function attrs(tag){const o={}; for(const m of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs))o[m[1].toLowerCase()]=decode(m[3]);return o;}
function abs(raw,base){try{return new URL(decode(raw),base).href}catch{return null}}
function words(v){return [...new Set(v.toLowerCase().replace(/[^a-z0-9]+/g," ").split(/\s+/).filter(x=>x.length>2&&!["motorcycle","bike","official","product","image"].includes(x)))];}
const good=/(?:product|colour|color|360|studio|cgi|pers|revo|right|left|side|model|rhs|90-right|profile|spec)/i;
const bad=/(?:logo|icon|sprite|banner|hero|campaign|action|rider|lifestyle|track|on-road|stills|feature|teaser|social|video|thumbnail|highlight|ride-|cross-gray|loader|warranty)/i;

function candidates(html,pageUrl,terms){
  const arr=[]; const add=(raw,score,label="")=>{const url=raw&&abs(raw,pageUrl);if(!url||!/^https?:/.test(url))return;
    const hay=(url+" "+label).toLowerCase(); if(/logo|icon|sprite|favicon|payment|badge|avatar|tracking|pixel|cross-gray|loader/.test(hay))return;
    if(!/\.(?:png|jpe?g|webp)(?:[?#]|$)/i.test(url))return;
    const matches=terms.filter(t=>hay.includes(t)).length; score+=matches*25; if(good.test(hay))score+=22; if(bad.test(hay))score-=45; arr.push({url,score,label});
  };
  for(const tag of html.match(/<img\b[^>]*>/gi)||[]){const a=attrs(tag);const label=(a.alt||"")+" "+(a.title||"");const vals=[a.src,a["data-src"],a["data-lazy-src"],a["data-original"]];
    if(a.srcset) vals.push(...a.srcset.split(",").map(x=>x.trim().split(/\s+/)[0]));
    for(const v of vals) if(v) add(v,70,label);
  }
  for(const tag of html.match(/<meta\b[^>]*>/gi)||[]){const a=attrs(tag);const key=(a.property||a.name||"").toLowerCase();if(["og:image","og:image:url","og:image:secure_url","twitter:image","twitter:image:src"].includes(key))add(a.content,45,key);}
  for(const m of html.matchAll(/https?:\\?\/\\?\/[^"'<>\s]+?\.(?:png|jpe?g|webp)(?:\\?[^"'<>\s]*)?/gi)){add(m[0].replace(/\\\//g,"/"),20,"html-url");}
  const seen=new Set();return arr.sort((a,b)=>b.score-a.score).filter(x=>!seen.has(x.url)&&seen.add(x.url));
}
async function fetchImage(url,referer){
  const r=await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(10000),headers:{"user-agent":UA,accept:"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",...(referer?{referer}:{})}});
  if(!r.ok)throw new Error("HTTP "+r.status); const type=(r.headers.get("content-type")||"").toLowerCase(); if(!type.startsWith("image/"))throw new Error("not image "+type);
  const bytes=Buffer.from(await r.arrayBuffer()); if(bytes.length<8000)throw new Error("too small"); return bytes;
}
async function visualScore(bytes){
  const meta=await sharp(bytes,{failOn:"none"}).metadata(); if((meta.width||0)<500||(meta.height||0)<400)return -999;
  const {data,info}=await sharp(bytes,{failOn:"none"}).rotate().flatten({background:WHITE}).resize(240,240,{fit:"fill"}).raw().toBuffer({resolveWithObject:true});
  const vals=[]; const px=(x,y)=>{const p=(y*info.width+x)*info.channels;return [data[p],data[p+1],data[p+2]]};
  for(let x=0;x<240;x++){vals.push(px(x,0),px(x,239));} for(let y=0;y<240;y++){vals.push(px(0,y),px(239,y));}
  const mean=[0,0,0];for(const v of vals)for(let k=0;k<3;k++)mean[k]+=v[k]/vals.length;
  let variance=0,sat=0;for(const v of vals){variance+=((v[0]-mean[0])**2+(v[1]-mean[1])**2+(v[2]-mean[2])**2)/3; sat+=Math.max(...v)-Math.min(...v);}
  const std=Math.sqrt(variance/vals.length), avgSat=sat/vals.length, lum=(mean[0]+mean[1]+mean[2])/3;
  let score=Math.max(0,48-std*1.2)+Math.max(0,22-avgSat*.5); if(lum>180)score+=15;
  const ar=(meta.width||1)/(meta.height||1); if(ar>.72&&ar<1.8)score+=10;
  return score;
}
async function choose(record){
  const pageUrl=pageOverride[record.entityId]||record.sourceUrl;
  const terms=words(record.alt+" "+record.entityId.replace(/-/g," "));
  const list=[];
  if(forcedImage[record.entityId]) list.push({url:forcedImage[record.entityId],score:260,label:"forced-product"});
  if(record.sourceImageUrl && !forcedImage[record.entityId]) list.push({url:record.sourceImageUrl,score:20,label:"current"});
  if(pageUrl){
    try{
      const r=await fetch(pageUrl,{redirect:"follow",signal:AbortSignal.timeout(10000),headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml"}});
      if(r.ok){const html=await r.text();list.push(...candidates(html,r.url||pageUrl,terms));}
    }catch(e){console.warn("page fetch",record.entityId,String(e));}
  }
  let filtered=list;
  if(record.entityId==="husqvarna-svartpilen-401") filtered=filtered.filter(x=>/svartpilen[-_%20]*401/i.test(x.url+" "+x.label)&&!/svartpilen[-_%20]*200/i.test(x.url+" "+x.label));
  if(record.entityId==="royal-enfield-guerrilla-450") filtered=filtered.filter(x=>!/highlights|ride-lean|banner|desktop|mobile/i.test(x.url));
  const seen=new Set(); const uniq=filtered.filter(x=>!seen.has(x.url)&&seen.add(x.url)).slice(0,18);
  let best=null;
  for(const cand of uniq){
    try{
      const bytes=await fetchImage(cand.url,pageUrl);
      const vs=await visualScore(bytes);
      if(vs<0) continue;
      let total=cand.score+vs;
      const hay=(cand.url+" "+cand.label).toLowerCase();
      if(/360|color|colour|studio|90-right|rhs|profile/.test(hay)) total+=60;
      if(/rider|lifestyle|track|on-road|stills|highlight|banner|ride-lean/.test(hay)) total-=90;
      if(!best||total>best.total)best={...cand,bytes,total,vs};
    }catch{}
  }
  if(!best)throw new Error("no usable candidate");
  return {...best,pageUrl};
}

async function cropLargestForeground(input){
  const meta=await sharp(input,{failOn:"none"}).metadata();
  const W=meta.width||0,H=meta.height||0;
  if(W<200||H<200)return input;
  const sample=await sharp(input,{failOn:"none"}).rotate().flatten({background:WHITE}).resize(320,320,{fit:"fill"}).raw().toBuffer({resolveWithObject:true});
  const {data,info}=sample, n=info.width*info.height, mask=new Uint8Array(n);
  const corners=[[0,0],[info.width-1,0],[0,info.height-1],[info.width-1,info.height-1]];
  let cornerLum=0; for(const [x,y] of corners){const p=(y*info.width+x)*info.channels;cornerLum+=(data[p]+data[p+1]+data[p+2])/3;}
  cornerLum/=4;
  if(cornerLum<220)return input;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
    const p=(y*info.width+x)*info.channels,r=data[p],g=data[p+1],b=data[p+2];
    const lum=(r+g+b)/3,sat=Math.max(r,g,b)-Math.min(r,g,b);
    if(lum<232||sat>22)mask[y*info.width+x]=1;
  }
  const seen=new Uint8Array(n); let best=null;
  const qx=new Int16Array(n),qy=new Int16Array(n);
  for(let sy=0;sy<info.height;sy++)for(let sx=0;sx<info.width;sx++){
    const si=sy*info.width+sx;if(!mask[si]||seen[si])continue;
    let head=0,tail=0,count=0,minX=sx,maxX=sx,minY=sy,maxY=sy;
    qx[tail]=sx;qy[tail++]=sy;seen[si]=1;
    while(head<tail){const x=qx[head],y=qy[head++];count++;if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=info.width||ny>=info.height)continue;const ni=ny*info.width+nx;if(mask[ni]&&!seen[ni]){seen[ni]=1;qx[tail]=nx;qy[tail++]=ny;}}
    }
    if(!best||count>best.count)best={count,minX,maxX,minY,maxY};
  }
  if(!best||best.count<n*0.015)return input;
  const pad=10,minX=Math.max(0,best.minX-pad),minY=Math.max(0,best.minY-pad),maxX=Math.min(info.width-1,best.maxX+pad),maxY=Math.min(info.height-1,best.maxY+pad);
  const left=Math.floor(minX/info.width*W),top=Math.floor(minY/info.height*H),width=Math.max(1,Math.ceil((maxX-minX+1)/info.width*W)),height=Math.max(1,Math.ceil((maxY-minY+1)/info.height*H));
  if(width/W>.97&&height/H>.97)return input;
  return sharp(input,{failOn:"none"}).extract({left,top,width:Math.min(width,W-left),height:Math.min(height,H-top)}).png().toBuffer();
}
async function normalize(bytes,dest,id){
  let rotated=await sharp(bytes,{failOn:"none"}).rotate().png().toBuffer();
  if(["honda-xl750-transalp","honda-crf1100l-africa-twin","honda-cbr650r"].includes(id)){
    const meta=await sharp(rotated).metadata();
    const W=meta.width||0,H=meta.height||0;
    if(W>0&&H>0) rotated=await sharp(rotated).extract({left:0,top:0,width:W,height:Math.max(1,Math.floor(H*0.75))}).png().toBuffer();
  }
  const cropped=await cropLargestForeground(rotated);
  const fitted=await sharp(cropped,{failOn:"none"}).flatten({background:WHITE}).resize({width:1000,height:880,fit:"inside",withoutEnlargement:false}).png().toBuffer();
  await sharp({create:{width:1200,height:1200,channels:4,background:WHITE}}).composite([{input:fitted,gravity:"centre"}]).flatten({background:WHITE}).webp({quality:90,effort:5,smartSubsample:true}).toFile(dest);
}
const blocks=objects(extractArray(source,"export const entityMedia"));
const report=[];
for(const id of targets){
  const block=blocks.find(b=>field(b,"entityType")==="motorcycle"&&field(b,"entityId")===id&&field(b,"role")==="primary");
  if(!block){report.push({id,status:"missing-record"});continue;}
  const rec={entityId:id,sourceImageUrl:field(block,"sourceImageUrl"),sourceUrl:field(block,"sourceUrl"),alt:field(block,"alt")};
  try{
    const chosen=await choose(rec); const dest=path.join(root,"public/media/motorcycles",id+".webp"); fs.mkdirSync(path.dirname(dest),{recursive:true}); await normalize(chosen.bytes,dest,id);
    let updated=block; updated=setField(updated,"src","/media/motorcycles/"+id+".webp"); updated=setField(updated,"sourceImageUrl",chosen.url); updated=setField(updated,"sourceUrl",chosen.pageUrl); const meta=forcedMeta[id];
    updated=setField(updated,"sourceLabel",meta?.sourceLabel||("Refreshed product image · "+(rec.alt||id)));
    if(meta?.sourceUrl) updated=setField(updated,"sourceUrl",meta.sourceUrl);
    if(meta?.rightsHolder) updated=setField(updated,"rightsHolder",meta.rightsHolder);
    source=source.replace(block,updated); report.push({id,status:"updated",score:Math.round(chosen.total),visual:Math.round(chosen.vs),url:chosen.url,page:chosen.pageUrl}); console.log("✓",id,Math.round(chosen.total),chosen.url);
  }catch(e){report.push({id,status:"failed",error:String(e)});console.error("✗",id,String(e));}
}
fs.writeFileSync(mediaPath,source); fs.mkdirSync(path.join(root,"artifacts"),{recursive:true}); fs.writeFileSync(path.join(root,"artifacts/priority-media-repair.json"),JSON.stringify(report,null,2));
const failed=report.filter(x=>x.status!=="updated"); console.log("updated",report.length-failed.length,"of",report.length); if(failed.length){console.error("Unresolved targets:",failed);}
