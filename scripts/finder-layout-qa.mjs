import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const outputDir = path.join(process.cwd(), "artifacts", "visual-qa");
fs.mkdirSync(outputDir, { recursive: true });
const failures = [];

function chromePath() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const hit = spawnSync("which", [name], { encoding: "utf8" });
    if (hit.status === 0 && hit.stdout.trim()) return hit.stdout.trim();
  }
  throw new Error("Chrome/Chromium was not found.");
}
async function waitPort(port) {
  const until = Date.now() + 20000;
  while (Date.now() < until) {
    try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) return; } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error("Chrome debugging port did not become ready.");
}
async function tab(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  if (!response.ok) throw new Error(`Unable to create Chrome tab: ${response.status}`);
  return response.json();
}
function cdp(url) {
  const ws = new WebSocket(url); let id = 1; const pending = new Map();
  const ready = new Promise((resolve, reject) => { ws.addEventListener("open", resolve, { once:true }); ws.addEventListener("error", reject, { once:true }); });
  ws.addEventListener("message", event => { const msg = JSON.parse(String(event.data)); if (!msg.id || !pending.has(msg.id)) return; const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result); });
  const send = (method, params={}) => new Promise((resolve,reject) => { const next=id++; pending.set(next,{resolve,reject}); ws.send(JSON.stringify({id:next,method,params})); });
  return { ws, ready, send };
}
async function evalJs(send, expression) {
  const out = await send("Runtime.evaluate", { expression, returnByValue:true, awaitPromise:true });
  return out.result?.value;
}
async function waitReady(send) {
  const until = Date.now() + 15000;
  while (Date.now() < until) {
    if (await evalJs(send, "document.readyState").catch(()=>"") === "complete") { await new Promise(r=>setTimeout(r,700)); return; }
    await new Promise(r=>setTimeout(r,150));
  }
  throw new Error("Finder page did not finish loading.");
}
async function screenshot(send, name) {
  const shot = await send("Page.captureScreenshot", { format:"png", captureBeyondViewport:false });
  fs.writeFileSync(path.join(outputDir, name), Buffer.from(shot.data, "base64"));
}
function check(condition, message) { if (!condition) failures.push(message); }

const port = 9777;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-finder-"));
const proc = spawn(chromePath(), ["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,"about:blank"], { stdio:"ignore" });

try {
  await waitPort(port);
  const page = await tab(port); const session = cdp(page.webSocketDebuggerUrl); await session.ready;
  await session.send("Page.enable"); await session.send("Runtime.enable");
  const setViewport = (width,height) => session.send("Emulation.setDeviceMetricsOverride", { width,height,deviceScaleFactor:1,mobile:width<=768 });
  const navigate = async (path="/finder") => { await session.send("Page.navigate", { url:new URL(path,base).href }); await waitReady(session.send); };

  await setViewport(1440,1000); await navigate();
  const desktop = await evalJs(session.send, `(()=>{const q=s=>document.querySelector(s),r=e=>{if(!e)return null;const x=e.getBoundingClientRect();return{left:x.left,right:x.right,top:x.top,bottom:x.bottom,width:x.width,height:x.height}},cs=e=>e?getComputedStyle(e):null;const shell=q('.finder-stage-shell'),main=q('.finder-stage-main'),preview=q('.finder-live-preview'),progress=q('.finder-progress'),choice=q('.finder-choice-grid'),card=q('.finder-stage-card');return {shellDisplay:cs(shell)?.display,progressDisplay:cs(progress)?.display,choiceDisplay:cs(choice)?.display,shell:r(shell),main:r(main),preview:r(preview),card:r(card),steps:progress?.querySelectorAll('button').length||0,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,choiceCols:cs(choice)?.gridTemplateColumns,winner:!!q('.decision-winner'),pending:preview?.classList.contains('pending'),answerRows:q('.finder-answer-summary')?.children.length||0};})()`);
  check(desktop.shellDisplay === "grid", `desktop Finder shell must be grid, got ${desktop.shellDisplay}`);
  check(desktop.progressDisplay === "grid", `desktop Finder progress must be grid, got ${desktop.progressDisplay}`);
  check(desktop.choiceDisplay === "grid", `desktop Finder choices must be grid, got ${desktop.choiceDisplay}`);
  check(desktop.steps === 6, `Finder must expose 6 progress steps, got ${desktop.steps}`);
  check(desktop.preview && desktop.main && desktop.preview.left >= desktop.main.right - 2, "desktop answer summary must remain to the right of the questionnaire");
  check(desktop.preview?.width >= 240 && desktop.preview?.width <= 310, `desktop summary width is out of bounds: ${desktop.preview?.width}`);
  check(desktop.card?.height >= 260 && desktop.card?.height <= 580, `desktop questionnaire height is unreasonable: ${desktop.card?.height}`);
  check(desktop.choiceCols && desktop.choiceCols.split(" ").length >= 2, `desktop choices lost columns: ${desktop.choiceCols}`);
  check(!desktop.winner, "Finder must not reveal a winner before the wizard is completed");
  check(desktop.pending, "Finder should show an answer summary before completion");
  check(desktop.answerRows === 4, `Finder answer summary should have 4 rows, got ${desktop.answerRows}`);
  check(desktop.overflow <= 2, `desktop Finder overflows horizontally by ${desktop.overflow}px`);

  for (let index=0; index<6; index++) {
    const clicked = await evalJs(session.send, `(()=>{const b=document.querySelectorAll('.finder-progress button')[${index}];if(!b)return false;b.click();return true;})()`);
    check(clicked, `unable to activate Finder step ${index+1}`);
    await new Promise(r=>setTimeout(r,80));
    const text = await evalJs(session.send, "document.querySelector('.finder-stage-kicker')?.textContent || ''");
    check(text.includes(`Step ${index+1} of 6`), `Finder step ${index+1} did not render after progress navigation`);
  }
  const finished = await evalJs(session.send, `(()=>{const b=[...document.querySelectorAll('.finder-stage-actions button')].find(x=>x.textContent.includes('Show my 3 best matches'));if(!b)return false;b.click();return true;})()`);
  check(finished, "Finder final step must provide a Show my 3 best matches action");
  await new Promise(r=>setTimeout(r,500));
  const revealed = await evalJs(session.send, `(()=>{const winner=document.querySelector('.decision-winner');const list=document.querySelectorAll('.decision-result-card');return{winner:!!winner,winnerDisplay:winner?getComputedStyle(winner).display:null,alternatives:list.length,intro:document.querySelector('.finder-result-intro h2')?.textContent||'',complete:document.querySelector('.finder-live-preview')?.classList.contains('complete')};})()`);
  check(revealed.winner && revealed.winnerDisplay === "grid", `completed Finder must reveal a grid winner, got ${revealed.winnerDisplay}`);
  check(revealed.alternatives <= 2, `Finder should show no more than 2 alternatives after the winner, got ${revealed.alternatives}`);
  check(revealed.intro.includes("Start with these motorcycles"), "Finder result hierarchy intro is missing");
  check(revealed.complete, "Finder side summary should switch to the completed best match state");

  await evalJs(session.send, `(()=>{const b=[...document.querySelectorAll('.finder-advanced-row button')].find(x=>x.textContent.includes('Advanced filters'));if(!b)return false;b.click();return true;})()`);
  await new Promise(r=>setTimeout(r,100));
  const advanced = await evalJs(session.send, `(()=>{const e=document.querySelector('.finder-advanced-panel');return e?{display:getComputedStyle(e).display,count:e.querySelectorAll('label').length}:null})()`);
  check(advanced?.display === "grid", `advanced filters must be a grid, got ${advanced?.display}`);
  check(advanced?.count === 8, `advanced filters should contain 8 controls, got ${advanced?.count}`);
  await screenshot(session.send,"finder-layout-desktop.png");

  await navigate("/finder?budget=100000&use=city&traffic=mixed");
  const shared = await evalJs(session.send, `(()=>({winner:!!document.querySelector('.decision-winner'),complete:document.querySelector('.finder-live-preview')?.classList.contains('complete'),url:location.search}))()`);
  check(shared.winner && shared.complete, "shared Finder URLs must restore the completed recommendation state");
  check(shared.url.includes("budget=100000"), "shared Finder URL lost the budget parameter");

  await setViewport(390,844); await navigate();
  const mobile = await evalJs(session.send, `(()=>{const q=s=>document.querySelector(s),r=e=>{if(!e)return null;const x=e.getBoundingClientRect();return{left:x.left,right:x.right,top:x.top,bottom:x.bottom,width:x.width,height:x.height}},cs=e=>e?getComputedStyle(e):null;const shell=q('.finder-stage-shell'),main=q('.finder-stage-main'),preview=q('.finder-live-preview'),choice=q('.finder-choice-grid'),progress=q('.finder-progress');return {shellDisplay:cs(shell)?.display,shellCols:cs(shell)?.gridTemplateColumns,main:r(main),preview:r(preview),choiceCols:cs(choice)?.gridTemplateColumns,progressOverflow:cs(progress)?.overflowX,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,winner:!!q('.decision-winner')};})()`);
  check(mobile.shellDisplay === "grid", `mobile Finder shell must stay grid, got ${mobile.shellDisplay}`);
  check(mobile.shellCols && !mobile.shellCols.includes(" "), `mobile Finder must collapse to one column, got ${mobile.shellCols}`);
  check(mobile.preview && mobile.main && mobile.preview.top >= mobile.main.bottom - 2, "mobile answer summary must appear after the questionnaire");
  check(mobile.choiceCols && !mobile.choiceCols.includes(" "), `mobile choices must collapse to one column, got ${mobile.choiceCols}`);
  check(["auto","scroll"].includes(mobile.progressOverflow), `mobile progress must be horizontally scrollable, got ${mobile.progressOverflow}`);
  check(!mobile.winner, "mobile Finder must not dump results before the wizard is completed");
  check(mobile.overflow <= 2, `mobile Finder overflows horizontally by ${mobile.overflow}px`);
  await screenshot(session.send,"finder-layout-mobile.png");

  console.log(`Finder layout QA: ${failures.length ? failures.length+' failures' : 'passed wizard gating, 3-bike shortlist, shared state, desktop and mobile structure'}`);
  if (failures.length) { for (const failure of failures) console.error(`- ${failure}`); process.exitCode=1; }
} finally {
  proc.kill("SIGTERM");
  await new Promise(r=>setTimeout(r,300));
  try { fs.rmSync(profile,{recursive:true,force:true,maxRetries:4,retryDelay:100}); } catch {}
}
