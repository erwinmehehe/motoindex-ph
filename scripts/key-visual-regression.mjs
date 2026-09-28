import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import sharp from "sharp";

const baselineBase = new URL(process.env.BASELINE_URL || "http://127.0.0.1:3100");
const candidateBase = new URL(process.env.CANDIDATE_URL || "http://127.0.0.1:3200");
const widths = [390, 768, 1440];
const routes = [
  { name: "motorcycles", path: "/motorcycles" },
  { name: "honda-brand", path: "/motorcycles/honda" },
  { name: "yamaha-brand", path: "/motorcycles/yamaha" },
  { name: "aerox-detail", path: "/motorcycles/yamaha/aerox-v3" },
  { name: "helmets", path: "/gear/helmets" },
];
const changedPixelThreshold = Number(process.env.VISUAL_CHANGED_PIXEL_RATIO || "0.03");
const meanDeltaThreshold = Number(process.env.VISUAL_MEAN_DELTA || "3.5");
const outputDir = path.join(process.cwd(), "artifacts", "visual-qa", "key-regression");
const baselineDir = path.join(outputDir, "baseline");
const candidateDir = path.join(outputDir, "candidate");
fs.mkdirSync(baselineDir, { recursive: true });
fs.mkdirSync(candidateDir, { recursive: true });

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
    const item = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  return { ready, send, ws };
}

async function evaluate(send, expression) {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return response.result?.value;
}

async function waitForComplete(send) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (await evaluate(send, "document.readyState").catch(() => "") === "complete") return;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error("Page did not finish loading.");
}

async function settlePage(send) {
  await evaluate(send, `(() => {
    const style=document.createElement("style");
    style.textContent="*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}";
    document.head.appendChild(style);
    for(const image of document.images){image.loading="eager";image.setAttribute("fetchpriority","high");}
    return document.fonts?.ready || Promise.resolve();
  })()`);
  await evaluate(send, `new Promise(resolve => {
    const images=[...document.images];
    const pending=images.filter(image=>!image.complete);
    if(!pending.length){resolve(true);return;}
    let remaining=pending.length;
    const done=()=>{remaining-=1;if(remaining<=0){clearTimeout(timer);resolve(true);}};
    const timer=setTimeout(()=>resolve(false),5000);
    for(const image of pending){
      image.addEventListener("load",done,{once:true});
      image.addEventListener("error",done,{once:true});
    }
  })`);
  await new Promise(resolve => setTimeout(resolve, 350));
}

async function capture(send, base, route, width) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: width <= 430 ? 844 : width <= 768 ? 1024 : 900,
    deviceScaleFactor: 1,
    mobile: width <= 768,
  });
  await send("Page.navigate", { url: new URL(route.path, base).toString() });
  await waitForComplete(send);
  await settlePage(send);
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  return Buffer.from(shot.data, "base64");
}

async function comparePngs(baseline, candidate) {
  const a = await sharp(baseline).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(candidate).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (a.info.width !== b.info.width || a.info.height !== b.info.height || a.info.channels !== b.info.channels) {
    return { dimensionsMatch: false, changedPixelRatio: 1, meanDelta: 255, widthA: a.info.width, heightA: a.info.height, widthB: b.info.width, heightB: b.info.height };
  }
  const channels = a.info.channels;
  const pixels = a.info.width * a.info.height;
  let changed = 0;
  let sum = 0;
  for (let i = 0; i < a.data.length; i += channels) {
    let pixelDelta = 0;
    for (let c = 0; c < Math.min(3, channels); c += 1) pixelDelta += Math.abs(a.data[i + c] - b.data[i + c]);
    pixelDelta /= Math.min(3, channels);
    sum += pixelDelta;
    if (pixelDelta > 12) changed += 1;
  }
  return { dimensionsMatch: true, changedPixelRatio: changed / pixels, meanDelta: sum / pixels, width: a.info.width, height: a.info.height };
}

const chrome = findChrome();
const port = 9666;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-key-visual-"));
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
    for (const route of routes) {
      const baseline = await capture(cdp.send, baselineBase, route, width);
      const candidate = await capture(cdp.send, candidateBase, route, width);
      const filename = `${route.name}-${width}.png`;
      fs.writeFileSync(path.join(baselineDir, filename), baseline);
      fs.writeFileSync(path.join(candidateDir, filename), candidate);
      const diff = await comparePngs(baseline, candidate);
      results.push({ route: route.path, width, ...diff });
      if (
        !diff.dimensionsMatch ||
        diff.changedPixelRatio > changedPixelThreshold ||
        diff.meanDelta > meanDeltaThreshold
      ) {
        failures.push(`${route.path} at ${width}px changed too much: ${(diff.changedPixelRatio * 100).toFixed(2)}% changed pixels, mean RGB delta ${diff.meanDelta.toFixed(2)}`);
      }
    }
  }

  fs.writeFileSync(path.join(outputDir, "comparison.json"), JSON.stringify({
    baseline: baselineBase.toString(),
    candidate: candidateBase.toString(),
    thresholds: { changedPixelThreshold, meanDeltaThreshold },
    results,
    failures,
  }, null, 2));

  if (failures.length) {
    console.error("Key visual regression failed:");
    failures.forEach(failure => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log(`Key visual regression passed: ${results.length} baseline/candidate viewport comparisons are within tolerance.`);
  }
  cdp.ws.close();
} finally {
  proc.kill("SIGTERM");
  await new Promise(resolve => setTimeout(resolve, 250));
  try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch {}
}
