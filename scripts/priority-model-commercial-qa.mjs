import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const outputDir = path.join(process.cwd(), "artifacts", "visual-qa");
fs.mkdirSync(outputDir, { recursive: true });

const pages = [
  ["lexi-155", "/motorcycles/yamaha/lexi-155"],
  ["yzf-r3", "/motorcycles/yamaha/yzf-r3"],
  ["rebel-500", "/motorcycles/honda/rebel-500"],
  ["zontes-400g", "/motorcycles/zontes/400g"],
  ["gold-wing", "/motorcycles/honda/gold-wing"],
  ["rc-390", "/motorcycles/ktm/rc-390"],
  ["honda-navi", "/motorcycles/honda/navi"],
  ["honda-beat", "/motorcycles/honda/beat"],
  ["honda-crf150l", "/motorcycles/honda/crf150l"],
  ["yamaha-aerox-v3", "/motorcycles/yamaha/aerox-v3"]
];
const widths = [390, 1440];
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
const port = 9777;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-priority-growth-"));
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

  for (const width of widths) {
    const height = width <= 768 ? 844 : 900;
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 768 });

    for (const [name, pathname] of pages) {
      await cdp.send("Page.navigate", { url: new URL(pathname, base).toString() });
      await waitForComplete(cdp.send);
      await new Promise(resolve => setTimeout(resolve, 250));

      const audit = await evaluate(cdp.send, `(() => {
        const h1=document.querySelector('.motorcycle-hero-copy h1');
        const sections=[...document.querySelectorAll('.priority-model-brief')];
        const commercial=sections.find(section=>/price, monthly payment and alternatives/i.test(section.querySelector('h2')?.textContent||''));
        const links=commercial?[...commercial.querySelectorAll('a')].map(a=>a.getAttribute('href')||''):[];
        const rect=commercial?.getBoundingClientRect();
        return {
          title:document.title,
          h1:Boolean(h1),
          h1Size:parseFloat(h1?getComputedStyle(h1).fontSize:'0'),
          commercial:Boolean(commercial),
          authority:Boolean(document.querySelector('.authority-decision-section')),
          briefCount:sections.length,
          canonicalPath:(()=>{const href=document.querySelector('link[rel="canonical"]')?.getAttribute('href')||'';try{return href?new URL(href,location.href).pathname:'';}catch{return '';}})(),
          sectionLeft:rect?.left||0,
          sectionRight:rect?.right||0,
          priceLink:links.some(href=>href==='#price'),
          installmentLink:links.some(href=>href==='#installment'),
          priceIndex:links.some(href=>href.includes('/research/motorcycle-price-index-philippines')),
          financeIndex:links.some(href=>href.includes('/research/motorcycle-financing-index-philippines')),
          quoteLink:links.some(href=>href.includes('/get-quote/')),
          overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
        };
      })()`);

      results.push({ width, pathname, ...audit });
      if (!audit?.h1) failures.push(`${width}px ${pathname}: model H1 is missing.`);
      if (!audit?.commercial && name !== "honda-crf150l") failures.push(`${width}px ${pathname}: priority commercial section is missing.`);
      if (audit?.canonicalPath !== pathname) failures.push(`${width}px ${pathname}: canonical path is ${audit?.canonicalPath || "missing"}.`);
      if (name === "honda-navi" && !audit?.authority) failures.push(`${width}px ${pathname}: Honda Navi authority section is missing.`);
      if (name === "honda-navi" && audit?.briefCount !== 1) failures.push(`${width}px ${pathname}: expected one commercial buyer brief after deduplication, found ${audit?.briefCount ?? 0}.`);
      if (name === "honda-beat" && !audit?.authority) failures.push(`${width}px ${pathname}: Honda BeAT authority section is missing.`);
      if (name === "honda-beat" && audit?.briefCount !== 1) failures.push(`${width}px ${pathname}: expected one commercial buyer brief after deduplication, found ${audit?.briefCount ?? 0}.`);
      if (name === "honda-crf150l" && !audit?.authority) failures.push(`${width}px ${pathname}: Honda CRF150L authority section is missing.`);
      if (name === "honda-crf150l" && audit?.commercial) failures.push(`${width}px ${pathname}: uncertain CRF150L must not render financing/commercial purchase CTAs.`);
      if (name === "honda-crf150l" && audit?.briefCount !== 1) failures.push(`${width}px ${pathname}: expected one commercial buyer brief after deduplication, found ${audit?.briefCount ?? 0}.`);
      if (name === "yamaha-aerox-v3" && !audit?.authority) failures.push(`${width}px ${pathname}: Yamaha Aerox V3 authority section is missing.`);
      if (name === "yamaha-aerox-v3" && audit?.briefCount !== 1) failures.push(`${width}px ${pathname}: expected one commercial buyer brief after deduplication, found ${audit?.briefCount ?? 0}.`);
      if (name !== "honda-crf150l") {
        if (!audit?.priceLink || !audit?.installmentLink) failures.push(`${width}px ${pathname}: price/monthly anchor links are incomplete.`);
        if (!audit?.priceIndex || !audit?.financeIndex) failures.push(`${width}px ${pathname}: research dataset links are incomplete.`);
        if (!audit?.quoteLink) failures.push(`${width}px ${pathname}: dealer quote link is missing.`);
      }
      if ((audit?.overflow || 0) > 5) failures.push(`${width}px ${pathname}: horizontal overflow is ${audit.overflow}px.`);
      if (audit?.commercial && (audit.sectionLeft < -5 || audit.sectionRight > width + 5)) failures.push(`${width}px ${pathname}: commercial section leaves the viewport.`);
      if (width <= 768 && (audit?.h1Size || 0) > 40) failures.push(`${width}px ${pathname}: mobile H1 is oversized at ${audit.h1Size}px.`);
      if (width >= 1000 && (audit?.h1Size || 0) > 60) failures.push(`${width}px ${pathname}: desktop H1 is oversized at ${audit.h1Size}px.`);

      const image = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
      fs.writeFileSync(path.join(outputDir, `priority-growth-${width}-${name}.png`), Buffer.from(image.data, "base64"));
    }
  }

  fs.writeFileSync(path.join(outputDir, "priority-model-commercial-qa.json"), JSON.stringify({ results, failures }, null, 2));
  if (failures.length) {
    console.error("Priority model commercial QA failed:");
    failures.forEach(failure => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log("Priority model commercial QA passed for six priority pages at 390px and 1440px.");
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
