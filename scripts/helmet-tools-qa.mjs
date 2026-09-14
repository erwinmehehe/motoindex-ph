import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const widths = [390, 1440];
const outputDir = path.join(process.cwd(), "artifacts", "visual-qa");
fs.mkdirSync(outputDir, { recursive: true });

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
    await new Promise(resolve => setTimeout(resolve, 250));
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

async function waitForReady(send) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const state = await evaluate(send, "document.readyState").catch(() => "");
    if (state === "complete") return;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

const chrome = findChrome();
const port = 9223;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-helmet-tools-"));
const proc = spawn(chrome, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank"
], { stdio: "ignore" });

const failures = [];
const results = [];

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
    await waitForReady(cdp.send);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async function screenshot(name, width) {
    const image = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    fs.writeFileSync(path.join(outputDir, `helmet-tools-${width}-${name}.png`), Buffer.from(image.data, "base64"));
  }

  for (const width of widths) {
    await setViewport(width);
    await navigate("/gear/helmets/finder");
    const finder = await evaluate(cdp.send, `(() => {
      const root=document.documentElement;
      const card=document.querySelector('.helmet-finder-card');
      const media=document.querySelector('.helmet-finder-media');
      const heading=document.querySelector('h1');
      const cardRect=card?.getBoundingClientRect();
      const mediaRect=media?.getBoundingClientRect();
      const headingRect=heading?.getBoundingClientRect();
      return {
        overflow:root.scrollWidth-root.clientWidth,
        filters:document.querySelectorAll('.helmet-finder-grid select').length,
        cards:document.querySelectorAll('.helmet-finder-card').length,
        cardRight:cardRect?.right||0,
        mediaWidth:mediaRect?.width||0,
        mediaHeight:mediaRect?.height||0,
        headingRight:headingRect?.right||0,
        viewport:innerWidth
      };
    })()`);
    results.push({ width, page: "finder", ...finder });
    if ((finder?.overflow||0) > 5) failures.push(`${width}px helmet finder overflows by ${finder.overflow}px`);
    if ((finder?.filters||0) < 8) failures.push(`${width}px helmet finder did not render all filters`);
    if ((finder?.cards||0) < 1) failures.push(`${width}px helmet finder rendered no result cards`);
    if ((finder?.mediaWidth||0) < 90 || (finder?.mediaHeight||0) < 90) failures.push(`${width}px helmet finder media collapsed`);
    if ((finder?.cardRight||0) > (finder?.viewport||width) + 5) failures.push(`${width}px helmet finder result leaves viewport`);
    if ((finder?.headingRight||0) > (finder?.viewport||width) + 5) failures.push(`${width}px helmet finder heading is clipped`);
    await screenshot("finder", width);

    await navigate("/gear/helmets/compare");
    const first = await evaluate(cdp.send, `(() => {
      const select=document.querySelectorAll('.helmet-compare-picks select')[0];
      const value=select?.options?.[1]?.value||'';
      if(value){select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));}
      return value;
    })()`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const second = await evaluate(cdp.send, `(() => {
      const selects=document.querySelectorAll('.helmet-compare-picks select');
      const select=selects[1];
      const options=[...select.options].filter(option=>option.value&&!option.disabled);
      const value=options[0]?.value||'';
      if(value){select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));}
      return value;
    })()`);
    await new Promise(resolve => setTimeout(resolve, 800));
    const compare = await evaluate(cdp.send, `(() => {
      const root=document.documentElement;
      const wrap=document.querySelector('.helmet-compare-wrap');
      const heading=document.querySelector('h1');
      const headingRect=heading?.getBoundingClientRect();
      return {
        overflow:root.scrollWidth-root.clientWidth,
        picks:document.querySelectorAll('.helmet-compare-picks select').length,
        products:document.querySelectorAll('.helmet-comparison-grid>article').length,
        table:Boolean(document.querySelector('.helmet-spec-table')),
        wrapWidth:wrap?.getBoundingClientRect().width||0,
        headingRight:headingRect?.right||0,
        viewport:innerWidth,
        selected:[${JSON.stringify(first)},${JSON.stringify(second)}].filter(Boolean).length
      };
    })()`);
    results.push({ width, page: "compare", ...compare });
    if ((compare?.overflow||0) > 5) failures.push(`${width}px helmet compare overflows document by ${compare.overflow}px`);
    if ((compare?.picks||0) !== 3) failures.push(`${width}px helmet compare picker is incomplete`);
    if ((compare?.products||0) < 2 || !compare?.table) failures.push(`${width}px helmet compare did not render selected product comparison`);
    if ((compare?.headingRight||0) > (compare?.viewport||width) + 5) failures.push(`${width}px helmet compare heading is clipped`);
    await screenshot("compare", width);
  }
} finally {
  proc.kill("SIGTERM");
  fs.rmSync(profile, { recursive: true, force: true });
}

fs.writeFileSync(path.join(outputDir, "helmet-tools-report.json"), JSON.stringify({ results, failures }, null, 2));
if (failures.length) {
  console.error(`Helmet tools QA failed:\n${failures.map(item=>`- ${item}`).join("\n")}`);
  process.exit(1);
}
console.log(`Helmet tools responsive QA passed: ${results.length} route/viewport checks.`);
