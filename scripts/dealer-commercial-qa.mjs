import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base=new URL(process.env.BASE_URL||"http://127.0.0.1:3000");
const widths=[390,1440];
const outputDir=path.join(process.cwd(),"artifacts","visual-qa");
fs.mkdirSync(outputDir,{recursive:true});

function findChrome(){
  if(process.env.CHROME_BIN&&fs.existsSync(process.env.CHROME_BIN))return process.env.CHROME_BIN;
  for(const candidate of ["google-chrome","google-chrome-stable","chromium","chromium-browser"]){
    const result=spawnSync("which",[candidate],{encoding:"utf8"});
    if(result.status===0&&result.stdout.trim())return result.stdout.trim();
  }
  throw new Error("Chrome/Chromium was not found.");
}
async function waitForDebugPort(port){const deadline=Date.now()+20000;while(Date.now()<deadline){try{const response=await fetch(`http://127.0.0.1:${port}/json/version`);if(response.ok)return;}catch{}await new Promise(r=>setTimeout(r,250));}throw new Error("Chrome remote debugging endpoint did not become ready.");}
async function createTab(port){const response=await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:"PUT"});if(!response.ok)throw new Error(`Unable to create Chrome tab: ${response.status}`);return response.json();}
function connectCdp(url){const ws=new WebSocket(url);let nextId=1;const pending=new Map();const ready=new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});ws.addEventListener("message",event=>{const message=JSON.parse(String(event.data));if(!message.id||!pending.has(message.id))return;const {resolve,reject}=pending.get(message.id);pending.delete(message.id);message.error?reject(new Error(message.error.message)):resolve(message.result);});const send=(method,params={})=>new Promise((resolve,reject)=>{const id=nextId++;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});return{ws,ready,send};}
async function evaluate(send,expression){const result=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});return result.result?.value;}
async function waitForReady(send){const deadline=Date.now()+15000;while(Date.now()<deadline){if(await evaluate(send,"document.readyState").catch(()=>"")==="complete")return;await new Promise(r=>setTimeout(r,200));}}

const chrome=findChrome();
const port=9231;
const profile=fs.mkdtempSync(path.join(os.tmpdir(),"motoindex-dealer-commercial-"));
const proc=spawn(chrome,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,"about:blank"],{stdio:"ignore"});
const failures=[];const results=[];

try{
  await waitForDebugPort(port);
  const tab=await createTab(port);const cdp=connectCdp(tab.webSocketDebuggerUrl);await cdp.ready;await cdp.send("Page.enable");await cdp.send("Runtime.enable");
  async function viewport(width){await cdp.send("Emulation.setDeviceMetricsOverride",{width,height:width<=430?844:900,deviceScaleFactor:1,mobile:width<=768});}
  async function navigate(pathname){await cdp.send("Page.navigate",{url:new URL(pathname,base).toString()});await waitForReady(cdp.send);await new Promise(r=>setTimeout(r,500));}
  async function shot(name,width){const image=await cdp.send("Page.captureScreenshot",{format:"png",fromSurface:true});fs.writeFileSync(path.join(outputDir,`dealer-commercial-${width}-${name}.png`),Buffer.from(image.data,"base64"));}

  for(const width of widths){
    await viewport(width);
    await navigate("/dealers/cebu-city");
    const city=await evaluate(cdp.send,`(()=>{const root=document.documentElement;const callouts=[...document.querySelectorAll('.dealer-listing-callout')];const first=callouts[0]?.getBoundingClientRect();return{overflow:root.scrollWidth-root.clientWidth,callouts:callouts.length,firstWidth:first?.width||0,free:[...document.querySelectorAll('a')].some(a=>a.textContent?.includes('Get listed free')),featured:[...document.querySelectorAll('a')].some(a=>a.textContent?.includes('See featured options')),dealerCards:document.querySelectorAll('.dealer-result-card').length,paidSections:document.querySelectorAll('.dealer-featured-section').length};})()`);
    results.push({width,page:"dealer-city",...city});
    if((city?.overflow||0)>5)failures.push(`${width}px dealer city overflows by ${city.overflow}px`);
    if((city?.callouts||0)<2)failures.push(`${width}px dealer city missing acquisition callouts`);
    if((city?.firstWidth||0)<(width<=430?330:900))failures.push(`${width}px dealer city callout is too narrow (${city?.firstWidth}px)`);
    if(!city?.free||!city?.featured)failures.push(`${width}px dealer city CTAs are incomplete`);
    if((city?.dealerCards||0)<3)failures.push(`${width}px dealer cards are missing`);
    if((city?.paidSections||0)!==0)failures.push(`${width}px dealer city shows a paid placement without configured promotions`);
    await shot("cebu-city",width);

    await navigate("/dealers/join?city=Cebu%20City&province=Cebu&plan=featured-city#featured-options");
    const join=await evaluate(cdp.send,`(()=>{const root=document.documentElement;const grid=document.querySelector('.dealer-pricing-grid');const cards=[...document.querySelectorAll('.dealer-plan-card')];const choices=[...document.querySelectorAll('input[name="placementInterest"]')];const selected=document.querySelector('input[name="placementInterest"]:checked');return{overflow:root.scrollWidth-root.clientWidth,grid:grid?getComputedStyle(grid).display:'missing',cards:cards.length,choices:choices.length,selected:selected?.value||'',freeText:document.body.innerText.includes('Free Verified Listing'),verifyText:document.body.innerText.includes('Verification is never for sale')};})()`);
    results.push({width,page:"dealer-join",...join});
    if((join?.overflow||0)>5)failures.push(`${width}px dealer join overflows by ${join.overflow}px`);
    if(join?.grid!=="grid")failures.push(`${width}px dealer pricing grid collapsed (${join?.grid})`);
    if((join?.cards||0)!==4)failures.push(`${width}px dealer pricing should show 4 plans (${join?.cards})`);
    if((join?.choices||0)!==4)failures.push(`${width}px dealer form should show 4 placement choices (${join?.choices})`);
    if(join?.selected!=="featured-city")failures.push(`${width}px dealer plan query did not preselect featured-city (${join?.selected})`);
    if(!join?.freeText||!join?.verifyText)failures.push(`${width}px dealer trust/pricing copy is incomplete`);
    await shot("join",width);
  }
}finally{
  if(proc.exitCode===null){proc.kill("SIGTERM");await Promise.race([new Promise(resolve=>proc.once("exit",resolve)),new Promise(resolve=>setTimeout(resolve,1500))]);}
  try{fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});}catch(error){if(error?.code!=="ENOTEMPTY")throw error;}
}

fs.writeFileSync(path.join(outputDir,"dealer-commercial-report.json"),JSON.stringify({results,failures},null,2));
if(failures.length){console.error(`Dealer commercial QA failed:\n${failures.map(item=>`- ${item}`).join("\n")}`);process.exit(1);}
console.log(`Dealer commercial QA passed: ${results.length} route/viewport checks.`);
