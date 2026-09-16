import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const widths = [390, 1440];
const routes = [
  { key: "helmet-spyder-surge", path: "/gear/helmets/spyder/surge-plain-v2" },
  { key: "topbox-givi-v58", path: "/accessories/top-box/v58-maxia-5" }
];
const outputDir = path.join(process.cwd(), "artifacts", "visual-qa");
fs.mkdirSync(outputDir, { recursive: true });

function chromePath() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  for (const candidate of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const found = spawnSync("which", [candidate], { encoding: "utf8" });
    if (found.status === 0 && found.stdout.trim()) return found.stdout.trim();
  }
  throw new Error("Chrome/Chromium was not found.");
}

async function waitPort(port) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error("Chrome remote debugging endpoint did not become ready.");
}

async function newTab(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  return response.json();
}

function cdp(url) {
  const ws = new WebSocket(url);
  let id = 1;
  const pending = new Map();
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  ws.addEventListener("message", event => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const next = id++;
    pending.set(next, { resolve, reject });
    ws.send(JSON.stringify({ id: next, method, params }));
  });
  return { ws, ready, send };
}

async function evalJs(send, expression) {
  return (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.value;
}

async function waitReady(send) {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (await evalJs(send, "document.readyState").catch(() => "") === "complete") return;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

const port = 9237;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-product-entity-"));
const proc = spawn(chromePath(), [
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
  await waitPort(port);
  const browserTab = await newTab(port);
  const client = cdp(browserTab.webSocketDebuggerUrl);
  await client.ready;
  await client.send("Page.enable");
  await client.send("Runtime.enable");

  async function viewport(width) {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width <= 430 ? 844 : 1000,
      deviceScaleFactor: 1,
      mobile: width <= 768
    });
  }

  async function navigate(pathname) {
    await client.send("Page.navigate", { url: new URL(pathname, base).toString() });
    await waitReady(client.send);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async function screenshot(name, width) {
    const metrics = await client.send("Page.getLayoutMetrics");
    const content = metrics.cssContentSize || metrics.contentSize;
    const image = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width: Math.ceil(content.width), height: Math.ceil(content.height), scale: 1 }
    });
    fs.writeFileSync(path.join(outputDir, `product-entity-${width}-${name}.png`), Buffer.from(image.data, "base64"));
  }

  for (const width of widths) {
    await viewport(width);
    for (const route of routes) {
      await navigate(route.path);
      const state = await evalJs(client.send, `(()=>{
        const root=document.documentElement;
        const page=document.querySelector('.product-entity-page');
        const hero=document.querySelector('.product-hero');
        const media=document.querySelector('.product-hero-media');
        const copy=document.querySelector('.product-hero-copy');
        const facts=document.querySelector('.product-facts');
        const factEls=[...document.querySelectorAll('.product-facts .product-fact')];
        const sections=[...document.querySelectorAll('.product-section')];
        const spec=document.querySelector('.entity-spec-table');
        const editorial=document.querySelector('.product-editorial');
        const editorialChildren=editorial?[...editorial.children]:[];
        const priceGrid=document.querySelector('.entity-price-grid');
        const priceChildren=priceGrid?[...priceGrid.children]:[];
        const r=el=>el?el.getBoundingClientRect():null;
        return {
          title:document.querySelector('h1')?.textContent?.trim()||'',
          overflow:root.scrollWidth-root.clientWidth,
          page:r(page), hero:r(hero), media:r(media), copy:r(copy), facts:r(facts), spec:r(spec),
          heroDisplay:hero?getComputedStyle(hero).display:'',
          heroColumns:hero?getComputedStyle(hero).gridTemplateColumns:'',
          factsDisplay:facts?getComputedStyle(facts).display:'',
          factWidths:factEls.slice(0,6).map(el=>Math.round(r(el).width)),
          sectionWidths:sections.slice(0,8).map(el=>Math.round(r(el).width)),
          editorialWidths:editorialChildren.map(el=>Math.round(r(el).width)),
          priceWidths:priceChildren.map(el=>Math.round(r(el).width)),
          mediaImage:r(document.querySelector('.product-hero-media img')),
          bodyWidth:Math.round(document.body.getBoundingClientRect().width)
        };
      })()`);
      results.push({ width, route: route.path, ...state });

      const mobile = width <= 430;
      if (!state?.title) failures.push(`${width}px ${route.key}: H1 missing`);
      if ((state?.overflow || 0) > 5) failures.push(`${width}px ${route.key}: horizontal overflow ${state.overflow}px`);
      if (state?.heroDisplay !== "grid") failures.push(`${width}px ${route.key}: product hero is ${state?.heroDisplay || "missing"}, expected grid`);
      if (!state?.media || !state?.copy) failures.push(`${width}px ${route.key}: hero media/copy missing`);
      if ((state?.media?.width || 0) < (mobile ? 330 : 400)) failures.push(`${width}px ${route.key}: hero media collapsed to ${Math.round(state?.media?.width || 0)}px`);
      if ((state?.copy?.width || 0) < (mobile ? 330 : 320)) failures.push(`${width}px ${route.key}: hero copy collapsed to ${Math.round(state?.copy?.width || 0)}px`);
      if (mobile && state?.copy && state?.media && state.copy.top <= state.media.top + 40) failures.push(`${width}px ${route.key}: hero did not stack on mobile`);
      if (!mobile && state?.copy && state?.media && Math.abs(state.copy.top - state.media.top) > 20) failures.push(`${width}px ${route.key}: desktop hero columns are vertically misaligned`);
      if (state?.factsDisplay !== "grid") failures.push(`${width}px ${route.key}: product facts are ${state?.factsDisplay || "missing"}, expected grid`);
      if (!state?.factWidths?.length) failures.push(`${width}px ${route.key}: product facts missing`);
      if (state?.factWidths?.some(value => value < (mobile ? 320 : 180))) failures.push(`${width}px ${route.key}: product fact collapsed (${state.factWidths.join(', ')}px)`);
      if (state?.sectionWidths?.some(value => value < (mobile ? 330 : 900))) failures.push(`${width}px ${route.key}: product section collapsed (${state.sectionWidths.join(', ')}px)`);
      if (state?.spec && state.spec.width < (mobile ? 330 : 800)) failures.push(`${width}px ${route.key}: spec table too narrow (${Math.round(state.spec.width)}px)`);
      if (state?.editorialWidths?.some(value => value < (mobile ? 320 : 200))) failures.push(`${width}px ${route.key}: editorial column collapsed (${state.editorialWidths.join(', ')}px)`);
      if (state?.priceWidths?.some(value => value < (mobile ? 320 : 250))) failures.push(`${width}px ${route.key}: price panel collapsed (${state.priceWidths.join(', ')}px)`);
      if (state?.mediaImage && (state.mediaImage.width > state.media.width + 2 || state.mediaImage.height > state.media.height + 2)) failures.push(`${width}px ${route.key}: hero image exceeds media stage`);

      await screenshot(route.key, width);
    }
  }
} finally {
  if (proc.exitCode === null) {
    proc.kill("SIGTERM");
    await Promise.race([new Promise(resolve => proc.once("exit", resolve)), new Promise(resolve => setTimeout(resolve, 1500))]);
  }
  try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch (error) { if (error?.code !== "ENOTEMPTY") throw error; }
}

fs.writeFileSync(path.join(outputDir, "product-entity-layout-report.json"), JSON.stringify({ results, failures }, null, 2));
if (failures.length) {
  console.error(`Product entity layout QA failed:\n${failures.map(item => `- ${item}`).join("\n")}`);
  process.exit(1);
}
console.log(`Product entity layout QA passed: ${results.length} helmet/top-box route and viewport checks.`);
