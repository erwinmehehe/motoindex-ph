import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const outputDir = path.join(process.cwd(), "artifacts", "visual-qa");
fs.mkdirSync(outputDir, { recursive: true });
const failures = [];
const results = [];

function findChrome() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  for (const candidate of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const result = spawnSync("which", [candidate], { encoding: "utf8" });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
  }
  throw new Error("Chrome/Chromium was not found.");
}

async function waitForDebugPort(port) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error("Chrome remote debugging endpoint did not become ready.");
}

async function createTab(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  if (!response.ok) throw new Error(`Unable to create Chrome tab: ${response.status}`);
  return response.json();
}

function connectCdp(webSocketDebuggerUrl) {
  const ws = new WebSocket(webSocketDebuggerUrl);
  let nextId = 1;
  const pending = new Map();
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  ws.addEventListener("message", event => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  return { ws, ready, send };
}

async function evaluate(send, expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return result.result?.value;
}

async function waitForComplete(send) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (await evaluate(send, "document.readyState").catch(() => "") === "complete") return;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error("Page did not finish loading.");
}

async function waitFor(send, expression, timeout = 8000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(send, expression).catch(() => false)) return true;
    await new Promise(resolve => setTimeout(resolve, 120));
  }
  return false;
}

const chrome = findChrome();
const port = 9555;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-search-trust-"));
const proc = spawn(chrome, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank"
], { stdio: "ignore" });

try {
  await waitForDebugPort(port);
  const tab = await createTab(port);
  const cdp = connectCdp(tab.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  async function setViewport(width) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width <= 430 ? 844 : 900,
      deviceScaleFactor: 1,
      mobile: width <= 768
    });
  }

  async function navigate(pathname) {
    await cdp.send("Page.navigate", { url: new URL(pathname, base).toString() });
    await waitForComplete(cdp.send);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async function screenshot(name) {
    const image = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    fs.writeFileSync(path.join(outputDir, `search-trust-${name}.png`), Buffer.from(image.data, "base64"));
  }

  await setViewport(1440);
  await navigate("/");

  const apiAudit = await evaluate(cdp.send, `(async()=>{
    const response=await fetch('/api/search-index');
    const data=await response.json().catch(()=>null);
    return {status:response.status,isArray:Array.isArray(data),count:Array.isArray(data)?data.length:0};
  })()`);
  results.push({ check: "search-index", ...apiAudit });
  if (apiAudit?.status !== 200 || !apiAudit?.isArray || apiAudit?.count < 20) failures.push(`Search index endpoint returned ${apiAudit?.status} with ${apiAudit?.count || 0} items.`);

  const trigger = await evaluate(cdp.send, `(() => { const el=document.querySelector('.nav-actions .nav-search'); if(!el)return false; el.click(); return true; })()`);
  if (!trigger) failures.push("Desktop command-search trigger was not found.");
  const dialogReady = await waitFor(cdp.send, `Boolean(document.querySelector('[role="dialog"][aria-label="Search MotoIndex"]'))`);
  if (!dialogReady) failures.push("Command-search dialog did not open.");

  const dialogAudit = await evaluate(cdp.send, `(() => {
    const dialog=document.querySelector('[role="dialog"][aria-label="Search MotoIndex"]');
    const input=dialog?.querySelector('input');
    return {dialog:Boolean(dialog),focused:document.activeElement===input,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  })()`);
  results.push({ check: "dialog", ...dialogAudit });
  if (!dialogAudit?.focused) failures.push("Command-search input was not focused after opening.");
  if ((dialogAudit?.overflow || 0) > 5) failures.push(`Homepage overflows by ${dialogAudit.overflow}px while command search is open.`);

  await evaluate(cdp.send, `(() => {
    const input=document.querySelector('[role="dialog"][aria-label="Search MotoIndex"] input');
    if(!input)return false;
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    setter.call(input,'Aerox');
    input.dispatchEvent(new Event('input',{bubbles:true}));
    return true;
  })()`);
  const hasResult = await waitFor(cdp.send, `document.querySelectorAll('[role="dialog"][aria-label="Search MotoIndex"] [role="option"]').length>0`);
  if (!hasResult) failures.push("Command search returned no instant result for Aerox.");
  const resultAudit = await evaluate(cdp.send, `(() => ({
    options:document.querySelectorAll('[role="dialog"][aria-label="Search MotoIndex"] [role="option"]').length,
    text:document.querySelector('[role="dialog"][aria-label="Search MotoIndex"] [role="option"]')?.textContent||''
  }))()`);
  results.push({ check: "aerox-results", ...resultAudit });
  if (!/Aerox/i.test(resultAudit?.text || "")) failures.push("The first Aerox command-search result is not relevant.");
  await screenshot("desktop-command-search");
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  const closed = await waitFor(cdp.send, `!document.querySelector('[role="dialog"][aria-label="Search MotoIndex"]')`, 3000);
  if (!closed) failures.push("Escape did not close command search.");

  await navigate("/motorcycles");
  const catalogTrust = await evaluate(cdp.send, `(() => {
    const cardBadges=[...document.querySelectorAll('.model-card [data-source-trust]')];
    const method=document.querySelector('.motorcycle-index-method');
    return {cardBadgeCount:cardBadges.length,method:Boolean(method),methodText:method?.textContent?.trim()||'',overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  })()`);
  results.push({ check: "catalog-trust", ...catalogTrust });
  if ((catalogTrust?.cardBadgeCount || 0) > 0) failures.push(`Motorcycle browse cards expose ${catalogTrust.cardBadgeCount} source-trust badges instead of deferring evidence to model pages.`);
  if (!catalogTrust?.method || !/verify|evidence|dated price/i.test(catalogTrust?.methodText || "")) failures.push("Motorcycle catalog no longer explains that detailed verification belongs on model pages.");
  if ((catalogTrust?.overflow || 0) > 5) failures.push(`Motorcycle catalog overflows by ${catalogTrust.overflow}px.`);
  await screenshot("catalog-trust");

  await navigate("/motorcycles/yamaha/aerox-v3");
  const modelTrust = await evaluate(cdp.send, `(() => {
    const freshness=document.querySelector('.freshness');
    const badge=freshness?.querySelector('[data-source-trust]');
    return {freshness:Boolean(freshness),kind:badge?.getAttribute('data-source-trust')||'',text:badge?.textContent?.trim()||'',overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  })()`);
  results.push({ check: "model-trust", ...modelTrust });
  if (!modelTrust?.freshness || !modelTrust?.kind) failures.push("Aerox model freshness block is missing source-trust provenance.");
  if ((modelTrust?.overflow || 0) > 5) failures.push(`Aerox detail page overflows by ${modelTrust.overflow}px after trust badge.`);
  await screenshot("model-trust");

  await setViewport(390);
  await navigate("/");
  const mobileAudit = await evaluate(cdp.send, `(() => ({
    overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    mobileSearch:Boolean(document.querySelector('.mobile-search')),
    navTriggerVisible:!!document.querySelector('.nav-actions .nav-search')&&getComputedStyle(document.querySelector('.nav-actions .nav-search')).display!=='none'
  }))()`);
  results.push({ check: "mobile-header", ...mobileAudit });
  if ((mobileAudit?.overflow || 0) > 5) failures.push(`390px homepage overflows horizontally by ${mobileAudit.overflow}px.`);
  if (!mobileAudit?.mobileSearch) failures.push("Mobile header lost the Search fallback link.");
  await screenshot("mobile-home");

  fs.writeFileSync(path.join(outputDir, "search-trust-qa.json"), JSON.stringify({ results, failures }, null, 2));
  if (failures.length) {
    console.error("Search and trust QA failed:");
    failures.forEach(failure => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log(`Search and trust QA passed: ${results.length} checks, command search and provenance are responsive.`);
  }

  cdp.ws.close();
} finally {
  proc.kill("SIGTERM");
  await new Promise(resolve => {
    if (proc.exitCode !== null) return resolve();
    proc.once("exit", resolve);
    setTimeout(resolve, 1500);
  });
  try {
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
  } catch (error) {
    console.warn(`Chrome QA profile cleanup skipped: ${error instanceof Error ? error.message : String(error)}`);
  }
}
