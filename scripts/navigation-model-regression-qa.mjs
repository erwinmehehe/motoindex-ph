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
    const waiter = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(message.error.message));
    else waiter.resolve(message.result);
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

const chrome = findChrome();
const port = 9666;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-nav-model-"));
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

  async function viewport(width, height = 900) {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 768 });
  }
  async function navigate(pathname) {
    await cdp.send("Page.navigate", { url: new URL(pathname, base).toString() });
    await waitForComplete(cdp.send);
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  async function screenshot(name) {
    const image = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    fs.writeFileSync(path.join(outputDir, `navigation-model-${name}.png`), Buffer.from(image.data, "base64"));
  }

  await viewport(1440);
  await navigate("/gear/helmets");
  const navAudit = await evaluate(cdp.send, `(() => {
    const menu=document.querySelector('details.nav-motorcycles');
    if(menu) menu.open=true;
    const electric=document.querySelector('.nav-motorcycles a[href="/motorcycles/electric"]');
    const all=document.querySelector('.nav-motorcycles a[href="/motorcycles"]');
    const popover=document.querySelector('.nav-motorcycles .nav-popover-menu');
    const rect=electric?.getBoundingClientRect();
    const style=electric?getComputedStyle(electric):null;
    return {
      electric:Boolean(electric),
      all:Boolean(all),
      text:electric?.textContent?.trim()||'',
      display:style?.display||'',
      visibility:style?.visibility||'',
      opacity:style?.opacity||'',
      width:rect?.width||0,
      height:rect?.height||0,
      inViewport:Boolean(rect&&rect.left>=0&&rect.right<=innerWidth&&rect.top>=0&&rect.bottom<=innerHeight),
      popoverWidth:popover?.getBoundingClientRect().width||0,
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
    };
  })()`);
  results.push({ check: "motorcycle-menu", ...navAudit });
  if (!navAudit?.electric || !/Electric motorcycles/i.test(navAudit?.text || "")) failures.push("Electric motorcycles is missing from the motorcycle menu.");
  if (navAudit?.display === "none" || navAudit?.visibility === "hidden" || Number(navAudit?.opacity || 1) < .5 || navAudit?.width < 80 || navAudit?.height < 36) failures.push("Electric motorcycles exists but is not visibly usable in the desktop menu.");
  if (!navAudit?.inViewport) failures.push("Motorcycle dropdown content leaves the desktop viewport.");
  if ((navAudit?.overflow || 0) > 5) failures.push(`Helmet page overflows horizontally by ${navAudit.overflow}px with motorcycle menu open.`);
  await screenshot("desktop-motorcycle-menu");

  await navigate("/motorcycles/yamaha/aerox-v3");
  const modelAudit = await evaluate(cdp.send, `(() => {
    const h1=document.querySelector('.motorcycle-hero-copy h1');
    const media=document.querySelector('.motorcycle-hero-media');
    const facts=document.querySelector('.motorcycle-hero-facts');
    const factStrong=facts?.querySelector('strong');
    const verdict=document.querySelector('.authority-verdict');
    const h1Style=h1?getComputedStyle(h1):null;
    const mediaRect=media?.getBoundingClientRect();
    const factsStyle=facts?getComputedStyle(facts):null;
    const strongStyle=factStrong?getComputedStyle(factStrong):null;
    return {
      h1:Boolean(h1),
      h1Text:h1?.textContent?.trim()||'',
      h1Size:parseFloat(h1Style?.fontSize||'0'),
      h1Height:h1?.getBoundingClientRect().height||0,
      media:Boolean(media),
      mediaHeight:mediaRect?.height||0,
      facts:Boolean(facts),
      factsBg:factsStyle?.backgroundColor||'',
      factColor:strongStyle?.color||'',
      verdict:Boolean(verdict),
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
    };
  })()`);
  results.push({ check: "desktop-model", ...modelAudit });
  if (!modelAudit?.h1 || modelAudit.h1Size > 60) failures.push(`Desktop model H1 is still oversized at ${modelAudit?.h1Size || 0}px.`);
  if (!modelAudit?.media || modelAudit.mediaHeight > 340) failures.push(`Desktop model media stage is still too tall at ${modelAudit?.mediaHeight || 0}px.`);
  if (!modelAudit?.facts || !/rgb\(255, 255, 255\)/.test(modelAudit.factsBg || "")) failures.push(`Model facts surface is not white (${modelAudit?.factsBg || "missing"}).`);
  if ((modelAudit?.overflow || 0) > 5) failures.push(`Aerox detail page overflows horizontally by ${modelAudit.overflow}px.`);
  await screenshot("desktop-model");

  await viewport(390, 844);
  await navigate("/motorcycles/yamaha/aerox-v3");
  const mobileModel = await evaluate(cdp.send, `(() => {
    const h1=document.querySelector('.motorcycle-hero-copy h1');
    const media=document.querySelector('.motorcycle-hero-media');
    return {
      h1Size:parseFloat(h1?getComputedStyle(h1).fontSize:'0'),
      mediaHeight:media?.getBoundingClientRect().height||0,
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
    };
  })()`);
  results.push({ check: "mobile-model", ...mobileModel });
  if ((mobileModel?.h1Size || 0) > 40) failures.push(`390px model H1 is oversized at ${mobileModel.h1Size}px.`);
  if ((mobileModel?.mediaHeight || 0) > 255) failures.push(`390px model media stage is too tall at ${mobileModel.mediaHeight}px.`);
  if ((mobileModel?.overflow || 0) > 5) failures.push(`390px Aerox page overflows horizontally by ${mobileModel.overflow}px.`);
  await screenshot("mobile-model");

  fs.writeFileSync(path.join(outputDir, "navigation-model-regression-qa.json"), JSON.stringify({ results, failures }, null, 2));
  if (failures.length) {
    console.error("Navigation/model regression QA failed:");
    failures.forEach(failure => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log("Navigation/model regression QA passed: electric navigation is visible and model detail sizing is bounded.");
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
