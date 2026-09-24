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
  "royal-enfield-guerrilla-450":"https://www.royalenfield.com/ph/en/motorcycles/guerrilla-450/",
  "royal-enfield-classic-350":"https://www.royalenfield.com/ph/en/motorcycles/classic-350/",
  "ktm-790-duke":"https://www.ktm.com/en-int/models/naked-bike/2025-ktm-790-duke.html",
  "ducati-streetfighter-v4":"https://www.ducati.com/us/en/bikes/streetfighter/streetfighter-v4",
  "ducati-panigale-v4":"https://www.ducati.com/us/en/bikes/panigale/panigale-v4",
  "husqvarna-svartpilen-401":"https://www.husqvarna-motorcycles.com/en-ph/models/naked/svartpilen/svartpilen-401-2023.html",
  "bajaj-pulsar-ns400z":"https://www.bajajauto.com/en-ph/bikes/pulsar-ns400z",
  "bmw-s-1000-rr":"https://www.bmwmotorcycles.com/en/models/sport/s1000rr.html",
  "bmw-m-1000-rr":"https://www.bmwmotorcycles.com/en/models/m/m1000rr.html",
  "bmw-s-1000-r":"https://www.bmwmotorcycles.com/en/models/roadster/s1000r.html",
  "triumph-speed-twin-900":"https://www.triumphmotorcycles.ph/bikes/classic/speed/speed-twin-900",
  "triumph-tiger-sport-660":"https://www.triumphmotorcycles.ph/bikes/adventure/tiger-sport-660",
  "triumph-daytona-660":"https://www.triumphmotorcycles.ph/bikes/sport/daytona-660",
  "kawasaki-ninja-650":"https://www.kawasaki.com/en-us/motorcycle/ninja/sport/ninja-650",
  "kawasaki-versys-650":"https://www.kawasaki.com/en-us/motorcycle/versys/adventure-touring/versys-650",
  "kawasaki-vulcan-s":"https://www.kawasaki.com/en-us/motorcycle/vulcan/sport-cruiser/vulcan-s"
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
function field(block,name){return block.match(new RegExp("\\b"+name+"\\s*:\\s*[\\"']([^\\"']+)[\\"']"))?.[1]||"";}
function setField(block,name,value){
  const re=new RegExp("\\b"+name+"\\s*:\\s*[\\"'][^\\"']*[\\"']");
  if(re.test(block))return block.replace(re,name+":"+JSON.stringify(value));
  return block.replace(/(\brole\s*:\s*["'][^"']+["']\s*,?)/,"$1 "+name+":"+JSON.stringify(value)+",");
}
function decode(v){return v.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'");}
function attrs(tag){const o={}; for(const m of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs))o[m[1].toLowerCase()]=decode(m[3]);return o;}
function abs(raw,base){try{return new URL(decode(raw),base).href}catch{return null}}
function words(v){return [...new Set(v.toLowerCase().replace(/[^a-z0-9]+/g," ").split(/\s+/).filter(x=>x.length>2&&!["motorcycle","bike","official","product","image"].includes(x)))];}
const good=/(?:product|colour|color|360|studio|cgi|pers|revo|right|left|side|model)/i;
const bad=/(?:logo|icon|sprite|banner|hero|campaign|action|rider|lifestyle|track|on-road|stills|feature|teaser|social|video|thumbnail)/i;

function candidates(html,pageUrl,terms){
  const arr=[]; const add=(raw,score,label="")=>{const url=raw&&abs(raw,pageUrl);if(!url||!/^https?:/.test(url))return;
    const hay=(url+" "+label).toLowerCase(); if(/logo|icon|sprite|favicon|payment|badge|avatar|tracking|pixel/.test(hay))return;
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
  const r=await fetch(url,{redirect:"follow",signal:AbortSignal.timeout(20000),headers:{"user-agent":UA,accept:"image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",...(referer?{referer}:{})}});
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
  const list=[]; if(record.sourceImageUrl) list.push({url:record.sourceImageUrl,score:30,label:"current"});
  if(pageUrl){
    try{const r=await fetch(pageUrl,{redirect:"follow",signal:AbortSignal.timeout(20000),headers:{"user-agent":UA,accept:"text/html,application/xhtml+xml"}});if(r.ok){const html=await r.text();list.push(...candidates(html,r.url||pageUrl,terms));}}catch(e){console.warn("page fetch",record.entityId,String(e));}
  }
  const seen=new Set(); const uniq=list.filter(x=>!seen.has(x.url)&&seen.add(x.url)).slice(0,28);
  let best=null;
  for(const cand of uniq){try{const bytes=await fetchImage(cand.url,pageUrl);const vs=await visualScore(bytes);const total=cand.score+vs;if(!best||total>best.total)best={...cand,bytes,total,vs};}catch{}}
  if(!best)throw new Error("no usable candidate"); return {...best,pageUrl};
}
async function normalize(bytes,dest){
  const rotated=await sharp(bytes,{failOn:"none"}).rotate().png().toBuffer();
  const flat=await sharp(rotated).flatten({background:WHITE}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const {data,info}=flat; const band=Math.max(4,Math.floor(Math.min(info.width,info.height)/100));let near=0,total=0;
  const check=(x,y)=>{const p=(y*info.width+x)*info.channels;total++;if(data[p]>232&&data[p+1]>232&&data[p+2]>232&&Math.max(data[p],data[p+1],data[p+2])-Math.min(data[p],data[p+1],data[p+2])<18)near++;};
  for(let x=0;x<info.width;x++){for(let y=0;y<band;y++)check(x,y);for(let y=info.height-band;y<info.height;y++)check(x,y);}
  for(let y=0;y<info.height;y++){for(let x=0;x<band;x++)check(x,y);for(let x=info.width-band;x<info.width;x++)check(x,y);}
  let subject=sharp(rotated).flatten({background:WHITE}); if(total&&near/total>.86)subject=subject.trim({background:"#ffffff",threshold:12});
  const fitted=await subject.resize({width:1000,height:880,fit:"inside",withoutEnlargement:false}).png().toBuffer();
  await sharp({create:{width:1200,height:1200,channels:4,background:WHITE}}).composite([{input:fitted,gravity:"centre"}]).flatten({background:WHITE}).webp({quality:90,effort:5,smartSubsample:true}).toFile(dest);
}
const blocks=objects(extractArray(source,"export const entityMedia"));
const report=[];
for(const id of targets){
  const block=blocks.find(b=>field(b,"entityType")==="motorcycle"&&field(b,"entityId")===id&&field(b,"role")==="primary");
  if(!block){report.push({id,status:"missing-record"});continue;}
  const rec={entityId:id,sourceImageUrl:field(block,"sourceImageUrl"),sourceUrl:field(block,"sourceUrl"),alt:field(block,"alt")};
  try{
    const chosen=await choose(rec); const dest=path.join(root,"public/media/motorcycles",id+".webp"); fs.mkdirSync(path.dirname(dest),{recursive:true}); await normalize(chosen.bytes,dest);
    let updated=block; updated=setField(updated,"src","/media/motorcycles/"+id+".webp"); updated=setField(updated,"sourceImageUrl",chosen.url); updated=setField(updated,"sourceUrl",chosen.pageUrl); updated=setField(updated,"sourceLabel","Refreshed product image · "+(rec.alt||id));
    source=source.replace(block,updated); report.push({id,status:"updated",score:Math.round(chosen.total),visual:Math.round(chosen.vs),url:chosen.url,page:chosen.pageUrl}); console.log("✓",id,Math.round(chosen.total),chosen.url);
  }catch(e){report.push({id,status:"failed",error:String(e)});console.error("✗",id,String(e));}
}
fs.writeFileSync(mediaPath,source); fs.mkdirSync(path.join(root,"artifacts"),{recursive:true}); fs.writeFileSync(path.join(root,"artifacts/priority-media-repair.json"),JSON.stringify(report,null,2));
const failed=report.filter(x=>x.status!=="updated"); console.log("updated",report.length-failed.length,"of",report.length); if(failed.length){console.error(failed);process.exit(1);}
