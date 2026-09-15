import fs from "node:fs";
import os from "node:os";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const checks = [
  { name: "catalog", path: "/motorcycles", selector: ".model-card-media", maxHeight: { 390: 190, 1440: 205 } },
  { name: "comparison media", path: "/compare/selection?bikes=aerox-v3,nmax-v3", selector: ".compare-product-media", maxHeight: { 390: 125, 1440: 160 } },
  { name: "comparison card", path: "/compare/selection?bikes=aerox-v3,nmax-v3", selector: ".compare-product-card", requireWhite: true, maxHeight: { 390: 220, 1440: 230 } },
  { name: "motorcycle hero", path: "/motorcycles/yamaha/aerox-v3", selector: ".motorcycle-hero-media", maxHeight: { 390: 270, 1440: 430 } },
];
const widths = [390, 1440];

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
  return { ready, send };
}

async function evaluate(send, expression) {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return response.result?.value;
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
const port = 9555;
const profile = fs.mkdtempSync(`${os.tmpdir()}/motoindex-image-stage-`);
const proc = spawn(chrome, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
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

  for (const width of widths) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width <= 430 ? 844 : 900,
      deviceScaleFactor: 1,
      mobile: width <= 768,
    });

    for (const check of checks) {
      await cdp.send("Page.navigate", { url: new URL(check.path, base).toString() });
      await waitForComplete(cdp.send);
      await new Promise(resolve => setTimeout(resolve, 350));
      const result = await evaluate(cdp.send, `(() => {
        const stage=document.querySelector(${JSON.stringify(check.selector)});
        const image=stage?.querySelector('img');
        const placeholder=stage?.matches('.model-media-placeholder,.media-unavailable') ? stage : stage?.querySelector('.model-media-placeholder,.media-unavailable');
        const root=document.documentElement;
        const rect=stage?.getBoundingClientRect();
        const section=document.querySelector('.motorcycle-entity-section');
        const sectionStyle=section ? getComputedStyle(section) : null;
        const heading=document.querySelector('.section-head h2');
        return {
          found:Boolean(stage),
          background:stage ? getComputedStyle(stage).backgroundColor : '',
          imageBackground:image ? getComputedStyle(image).backgroundColor : '',
          overflow:root.scrollWidth-root.clientWidth,
          right:rect?.right||0,
          height:rect?.height||0,
          viewport:innerWidth,
          placeholderBackground:placeholder ? getComputedStyle(placeholder).backgroundColor : '',
          sectionPaddingTop:sectionStyle ? parseFloat(sectionStyle.paddingTop)||0 : 0,
          sectionPaddingBottom:sectionStyle ? parseFloat(sectionStyle.paddingBottom)||0 : 0,
          headingSize:heading ? parseFloat(getComputedStyle(heading).fontSize)||0 : 0
        };
      })()`);
      results.push({ width, ...check, ...result });
      if (!result?.found) failures.push(`${width}px ${check.name}: shared product surface is missing`);
      const expectsWhite = check.requireWhite !== false;
      if (expectsWhite && result?.background !== "rgb(255, 255, 255)") failures.push(`${width}px ${check.name}: background is ${result?.background || "missing"}, expected white`);
      if (result?.imageBackground && result.imageBackground !== "rgb(255, 255, 255)") failures.push(`${width}px ${check.name}: image background is ${result.imageBackground}, expected white`);
      if ((result?.overflow||0) > 5) failures.push(`${width}px ${check.name}: page overflows horizontally by ${result.overflow}px`);
      if ((result?.right||0) > (result?.viewport||width) + 5) failures.push(`${width}px ${check.name}: surface leaves the viewport`);
      const maxHeight = check.maxHeight?.[width];
      if (maxHeight && (result?.height||0) > maxHeight + 1) failures.push(`${width}px ${check.name}: ${Math.round(result.height)}px tall, expected no more than ${maxHeight}px`);
      if (result?.placeholderBackground && result.placeholderBackground !== "rgb(255, 255, 255)") failures.push(`${width}px ${check.name}: missing-photo placeholder is not white`);
      if (check.name === "motorcycle hero") {
        if ((result?.sectionPaddingTop||0) > 50 || (result?.sectionPaddingBottom||0) > 50) failures.push(`${width}px detail page: section spacing is oversized (${result.sectionPaddingTop}/${result.sectionPaddingBottom}px)`);
        if ((result?.headingSize||0) > 41) failures.push(`${width}px detail page: section heading is ${result.headingSize}px, expected compact product hierarchy`);
      }
    }
  }

  if (failures.length) {
    console.error(`Shared product visual QA failed:\n${failures.map(item=>`- ${item}`).join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log(`Shared product visual QA passed: ${results.length} catalog, comparison and detail checks use compact white product surfaces.`);
  }
} finally {
  proc.kill("SIGTERM");
  await new Promise(resolve => setTimeout(resolve, 250));
  try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch {}
}
