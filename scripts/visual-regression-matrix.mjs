import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base=new URL(process.env.BASE_URL||"http://127.0.0.1:3000");
const widths=[390,768,1440];
const routes=[
  {name:"home",path:"/"},
  {name:"motorcycles",path:"/motorcycles"},
  {name:"brand",path:"/motorcycles/honda"},
  {name:"motorcycle-detail",path:"/motorcycles/yamaha/aerox-v3"},
  {name:"compare-index",path:"/compare"},
  {name:"compare",path:"/compare/selection?bikes=aerox-v3,nmax-v3"},
  {name:"helmets",path:"/gear/helmets"},
  {name:"helmet-detail",path:"/gear/helmets/gille/kerena-ff007"},
  {name:"tires",path:"/tires"},
  {name:"accessories",path:"/accessories"},
  {name:"top-box",path:"/accessories/top-box"},
  {name:"top-box-detail",path:"/accessories/top-box/v58-maxia-5"},
  {name:"finder",path:"/finder"},
  {name:"recommendations",path:"/recommendations"}
];

const outputDir=path.join(process.cwd(),"artifacts","visual-qa","matrix");
fs.mkdirSync(outputDir,{recursive:true});

function findChrome(){
  if(process.env.CHROME_BIN&&fs.existsSync(process.env.CHROME_BIN))return process.env.CHROME_BIN;
  for(const candidate of ["google-chrome","google-chrome-stable","chromium","chromium-browser"]){
    const result=spawnSync("which",[candidate],{encoding:"utf8"});
    if(result.status===0&&result.stdout.trim())return result.stdout.trim();
  }
  throw new Error("Chrome/Chromium was not found.");
}

async function waitForDebugPort(port){
  const deadline=Date.now()+20_000;
  while(Date.now()<deadline){
    try{const response=await fetch(`http://127.0.0.1:${port}/json/version`);if(response.ok)return;}catch{}
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  throw new Error("Chrome remote debugging endpoint did not become ready.");
}

async function createTab(port){
  const response=await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:"PUT"});
  if(!response.ok)throw new Error(`Unable to create Chrome tab: ${response.status}`);
  return response.json();
}

function connectCdp(webSocketDebuggerUrl){
  const ws=new WebSocket(webSocketDebuggerUrl);
  let nextId=1;
  const pending=new Map();
  const ready=new Promise((resolve,reject)=>{
    ws.addEventListener("open",resolve,{once:true});
    ws.addEventListener("error",reject,{once:true});
  });
  ws.addEventListener("message",event=>{
    const message=JSON.parse(String(event.data));
    if(!message.id||!pending.has(message.id))return;
    const item=pending.get(message.id);
    pending.delete(message.id);
    if(message.error)item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  });
  const send=(method,params={})=>new Promise((resolve,reject)=>{
    const id=nextId++;
    pending.set(id,{resolve,reject});
    ws.send(JSON.stringify({id,method,params}));
  });
  return {ready,send,ws};
}

async function evaluate(send,expression){
  const response=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  return response.result?.value;
}

async function waitForComplete(send){
  const deadline=Date.now()+15_000;
  while(Date.now()<deadline){
    if(await evaluate(send,"document.readyState").catch(()=>"")==="complete")return;
    await new Promise(resolve=>setTimeout(resolve,150));
  }
  throw new Error("Page did not finish loading.");
}

async function warmLazyMedia(send){
  await evaluate(send,`(() => {
    for(const image of document.querySelectorAll(".ui-product-media img,.entity-media-contained img")){
      image.loading="eager";
      image.setAttribute("fetchpriority","high");
    }
    return true;
  })()`);

  const positions=await evaluate(send,`(() => {
    const height=Math.max(document.documentElement.scrollHeight,document.body?.scrollHeight||0);
    const viewport=Math.max(innerHeight,1);
    const max=Math.max(0,height-viewport);
    return [0,.2,.4,.6,.8,1].map(ratio=>Math.round(max*ratio));
  })()`)||[0];

  for(const y of [...new Set(positions)]){
    await evaluate(send,`window.scrollTo({top:${y},behavior:"instant"}); true`);
    await new Promise(resolve=>setTimeout(resolve,260));
  }

  await evaluate(send,`new Promise(resolve => {
    const images=[...document.querySelectorAll(".ui-product-media img,.entity-media-contained img")];
    const pending=images.filter(image=>!image.complete);
    if(!pending.length){resolve(true);return;}
    let remaining=pending.length;
    const done=()=>{
      remaining-=1;
      if(remaining<=0){clearTimeout(timer);resolve(true);}
    };
    const timer=setTimeout(()=>resolve(false),5000);
    for(const image of pending){
      image.addEventListener("load",done,{once:true});
      image.addEventListener("error",done,{once:true});
    }
  })`);

  await evaluate(send,'window.scrollTo({top:0,behavior:"instant"}); true');
  await new Promise(resolve=>setTimeout(resolve,450));
}

const inspect=`(() => {
  const rgb=value=>{
    const parts=(value.match(/[\\d.]+/g)||[]).slice(0,4).map(Number);
    return parts.length>=3?{r:parts[0],g:parts[1],b:parts[2],a:parts[3]??1}:null;
  };
  const luminance=color=>{
    if(!color)return null;
    const channel=value=>{
      const n=value/255;
      return n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4);
    };
    return .2126*channel(color.r)+.7152*channel(color.g)+.0722*channel(color.b);
  };
  const contrast=(a,b)=>{
    const la=luminance(a),lb=luminance(b);
    if(la==null||lb==null)return null;
    return (Math.max(la,lb)+.05)/(Math.min(la,lb)+.05);
  };
  const effectiveBackground=el=>{
    let node=el;
    while(node&&node!==document.documentElement){
      const color=rgb(getComputedStyle(node).backgroundColor||"");
      if(color&&color.a>.75)return color;
      node=node.parentElement;
    }
    return rgb(getComputedStyle(document.body).backgroundColor||"rgb(255,255,255)")||{r:255,g:255,b:255,a:1};
  };

  const root=document.documentElement;
  const bodyText=(document.body?.innerText||"").toLowerCase();
  const h1=document.querySelector("h1");
  const h1Rect=h1?.getBoundingClientRect();
  const h1Style=h1?getComputedStyle(h1):null;
  const h1Contrast=h1Style?contrast(rgb(h1Style.color),effectiveBackground(h1)):null;

  const media=[...document.querySelectorAll(".ui-product-media,.entity-media-contained")];
  const mediaProblems=[];
  let productImages=0;
  let unloadedProductImages=0;
  for(const stage of media){
    const stageRect=stage.getBoundingClientRect();
    for(const image of stage.querySelectorAll("img")){
      productImages++;
      const rect=image.getBoundingClientRect();
      const style=getComputedStyle(image);
      if(!image.complete||image.naturalWidth<2||image.naturalHeight<2)unloadedProductImages++;
      const escapes=rect.left<stageRect.left-2||rect.right>stageRect.right+2||rect.top<stageRect.top-2||rect.bottom>stageRect.bottom+2;
      if(escapes||style.objectFit!=="contain"){
        mediaProblems.push({
          stage:stage.className,
          objectFit:style.objectFit,
          stage:[Math.round(stageRect.width),Math.round(stageRect.height)],
          image:[Math.round(rect.width),Math.round(rect.height)],
          escapes
        });
      }
    }
  }

  const compareBuilder=document.querySelector("[data-compare-builder]");
  const compareBuilderRect=compareBuilder?.getBoundingClientRect();
  const deferredSections=[...document.querySelectorAll("section")].filter(section=>getComputedStyle(section).contentVisibility==="auto").length;
  const recommendationGuideCards=document.querySelectorAll("[data-recommendation-guide-card]").length;
  const recommendationArchiveLinks=document.querySelectorAll("[data-recommendation-archive-link]").length;
  const recommendationArchiveGroups=document.querySelectorAll("[data-recommendation-guide-library] details").length;

  const standardMotorcycleCards=[...document.querySelectorAll('[data-motorcycle-card="standard"]')];
  const standardMotorcycleCardModes=standardMotorcycleCards.map(card=>({
    mode:getComputedStyle(card).display,
    catalog:Boolean(card.closest(".motorcycle-catalog-grid")),
    brand:Boolean(card.closest(".ph-brand-model-grid")),
    home:Boolean(card.closest(".mi-model-grid"))
  }));
  const cards=[...document.querySelectorAll(".ui-product-card")];
  const collapsedCards=cards.filter(card=>{
    const rect=card.getBoundingClientRect();
    return rect.width<100||rect.height<90;
  }).length;

  return {
    title:document.title,
    overflow:root.scrollWidth-root.clientWidth,
    bodyWidth:root.clientWidth,
    h1:Boolean(h1),
    h1Text:(h1?.textContent||"").trim().slice(0,120),
    h1Size:h1Style?parseFloat(h1Style.fontSize||"0"):0,
    h1Right:h1Rect?.right||0,
    h1Left:h1Rect?.left||0,
    h1Contrast,
    productImages,
    unloadedProductImages,
    unavailableProductMedia:document.querySelectorAll(".ui-product-media .media-unavailable,.entity-media-contained .media-unavailable").length,
    mediaProblems,
    productCards:cards.length,
    collapsedCards,
    standardMotorcycleCards:standardMotorcycleCards.length,
    standardMotorcycleCardModes,
    compareBuilderHeight:compareBuilderRect?.height||0,
    deferredSections,
    recommendationGuideCards,
    recommendationArchiveLinks,
    recommendationArchiveGroups,
    cloudflareError:/worker exceeded resource limits|error 1102|error 503|service unavailable/.test(bodyText),
    empty:(document.body?.innerText||"").trim().length<80
  };
})()`;

const chrome=findChrome();
const port=9233;
const profile=fs.mkdtempSync(path.join(os.tmpdir(),"motoindex-visual-matrix-"));
const proc=spawn(chrome,[
  "--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  `--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,"about:blank"
],{stdio:"ignore"});

const failures=[];
const results=[];

try{
  await waitForDebugPort(port);
  const tab=await createTab(port);
  const cdp=connectCdp(tab.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  for(const width of widths){
    const height=width<=390?844:width<=768?1024:900;
    await cdp.send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<=768});

    for(const route of routes){
      await cdp.send("Page.navigate",{url:new URL(route.path,base).toString()});
      await waitForComplete(cdp.send);
      await new Promise(resolve=>setTimeout(resolve,450));
      await warmLazyMedia(cdp.send);

      const row=await evaluate(cdp.send,inspect);
      results.push({width,route:route.name,path:route.path,...row});

      if(!row?.h1)failures.push(`${width}px ${route.name}: missing H1`);
      if(row?.empty)failures.push(`${width}px ${route.name}: page body is unexpectedly empty`);
      if(row?.cloudflareError)failures.push(`${width}px ${route.name}: Cloudflare/503 error content rendered`);
      if((row?.overflow||0)>5)failures.push(`${width}px ${route.name}: horizontal overflow ${row.overflow}px`);
      if((row?.h1Right||0)>width+5||(row?.h1Left||0)<-5)failures.push(`${width}px ${route.name}: H1 is clipped outside viewport`);
      const maxH1=width<=390?58:width<=768?64:76;
      if((row?.h1Size||0)<28||(row?.h1Size||0)>maxH1)failures.push(`${width}px ${route.name}: H1 size ${row?.h1Size}px is outside approved range`);
      if(row?.h1Contrast!=null&&row.h1Contrast<3)failures.push(`${width}px ${route.name}: H1 contrast ratio ${row.h1Contrast.toFixed(2)} is below 3:1`);
      if((row?.mediaProblems||[]).length)failures.push(`${width}px ${route.name}: ${row.mediaProblems.length} product image(s) escape their stage or are not object-fit:contain`);
      if((row?.unloadedProductImages||0)>0)failures.push(`${width}px ${route.name}: ${row.unloadedProductImages} product image(s) failed to load after lazy-media warmup`);
      if((row?.unavailableProductMedia||0)>0)failures.push(`${width}px ${route.name}: ${row.unavailableProductMedia} product media fallback(s) rendered as unavailable`);
      if((row?.collapsedCards||0)>0)failures.push(`${width}px ${route.name}: ${row.collapsedCards} canonical product card(s) collapsed`);
      const motorcycleCardModes=row?.standardMotorcycleCardModes||[];
      const routeCardModes=route.name==="motorcycles"
        ? motorcycleCardModes.filter(card=>card.catalog)
        : route.name==="brand"
          ? motorcycleCardModes.filter(card=>card.brand)
          : route.name==="home"
            ? motorcycleCardModes.filter(card=>card.home)
            : [];
      if(["home","motorcycles","brand"].includes(route.name)&&routeCardModes.length<1)failures.push(`${width}px ${route.name}: standard MotorcycleCard did not render in its primary route context`);
      if(width===1440&&["motorcycles","brand"].includes(route.name)&&routeCardModes.some(card=>card.mode!=="grid"))failures.push(`${width}px ${route.name}: wide MotorcycleCard did not switch to its component-owned row layout`);
      if(width===390&&["home","motorcycles","brand"].includes(route.name)&&routeCardModes.some(card=>card.mode==="grid"))failures.push(`${width}px ${route.name}: narrow MotorcycleCard stayed in wide row layout`);
      if(route.name==="compare-index"&&width===1440&&(row?.compareBuilderHeight||0)>260)failures.push(`${width}px compare-index: builder is too tall (${row.compareBuilderHeight}px)`);
      if(route.name==="compare-index"&&width===390&&(row?.compareBuilderHeight||0)>620)failures.push(`${width}px compare-index: mobile builder is too tall (${row.compareBuilderHeight}px)`);
      if(["helmets","tires","accessories","top-box"].includes(route.name)&&(row?.deferredSections||0)>0)failures.push(`${width}px ${route.name}: ${row.deferredSections} top-level section(s) still defer rendering with content-visibility:auto`);
      if(route.name==="recommendations"&&(row?.recommendationGuideCards||0)>6)failures.push(`${width}px recommendations: ${row.recommendationGuideCards} visual guide cards exceed the six-card archive limit`);
      if(route.name==="recommendations"&&(row?.recommendationArchiveGroups||0)<3)failures.push(`${width}px recommendations: grouped guide library is missing or too flat`);
      if(route.name==="recommendations"&&(row?.recommendationArchiveLinks||0)<20)failures.push(`${width}px recommendations: compact guide library lost too many indexable guide links (${row.recommendationArchiveLinks})`);

      const metrics=await cdp.send("Page.getLayoutMetrics");
      const contentSize=metrics.cssContentSize||metrics.contentSize;
      const captureHeight=Math.min(Math.max(contentSize?.height||height,height),12000);
      const shot=await cdp.send("Page.captureScreenshot",{
        format:"jpeg",
        quality:68,
        fromSurface:true,
        captureBeyondViewport:true,
        clip:{x:0,y:0,width,height:captureHeight,scale:1}
      });
      fs.writeFileSync(path.join(outputDir,`${width}-${route.name}.jpg`),Buffer.from(shot.data,"base64"));
    }
  }
}finally{
  proc.kill("SIGTERM");
  await new Promise(resolve=>{
    if(proc.exitCode!==null)return resolve();
    const timer=setTimeout(resolve,1000);
    proc.once("exit",()=>{clearTimeout(timer);resolve();});
  });
  try{
    fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
  }catch(error){
    console.warn("Visual matrix Chrome profile cleanup skipped:",error instanceof Error?error.message:String(error));
  }
}

fs.writeFileSync(path.join(outputDir,"matrix-results.json"),JSON.stringify({results,failures},null,2));

if(failures.length){
  console.error("Visual regression matrix failed:");
  for(const failure of failures)console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Visual regression matrix passed: ${routes.length} routes × ${widths.length} widths (${results.length} states).`);
