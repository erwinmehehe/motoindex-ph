import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const pages = [
  ["recommendations", "/recommendations"],
  ["guides", "/guides"],
  ["tools", "/tools"],
  ["honda-brand", "/motorcycles/honda"],
  ["ownership", "/ownership"],
  ["search", "/search"],
];
const widths = [430, 1440];
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
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Chrome debugging endpoint did not become ready.");
}

async function createTab(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  if (!response.ok) throw new Error(`Unable to create Chrome tab: ${response.status}`);
  return response.json();
}

function connectCdp(url) {
  const ws = new WebSocket(url);
  let nextId = 1;
  const pending = new Map();
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  return { ws, ready, send };
}

async function evaluate(send, expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return result.result?.value;
}

async function waitForComplete(send) {
  for (let i = 0; i < 60; i++) {
    const state = await evaluate(send, "document.readyState").catch(() => "loading");
    if (state === "complete") return;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}

const chrome = findChrome();
const port = 9333;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-editorial-"));
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
    const height = width <= 430 ? 844 : 900;
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 430 });

    for (const [name, pathname] of pages) {
      await cdp.send("Page.navigate", { url: new URL(pathname, base).toString() });
      await waitForComplete(cdp.send);
      await new Promise((resolve) => setTimeout(resolve, 350));

      const audit = await evaluate(cdp.send, `(() => {
        const root=document.documentElement;
        const visible=(el)=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>.05&&r.width>2&&r.height>2};
        const broken=[...document.images].filter(img=>visible(img)&&img.complete&&img.currentSrc&&img.naturalWidth===0).map(img=>img.currentSrc).slice(0,8);
        const h1=document.querySelector('h1');
        const safety=document.querySelector('#safety-efficiency');
        return {
          title:document.title,
          overflow:root.scrollWidth-root.clientWidth,
          broken,
          hasRecommendationsRoot:Boolean(document.querySelector('.recommendations-v2')),
          legacyRecommendationGrids:document.querySelectorAll('.guide-master-bike-grid').length,
          bikeCards:document.querySelectorAll('.rec-bike-card').length,
          principleCards:document.querySelectorAll('.rec-principle-grid article').length,
          h1Size:h1?parseFloat(getComputedStyle(h1).fontSize||'0'):0,
          duplicateAutomaticHeading:(document.body.innerText.match(/Lowest-price automatic options/g)||[]).length,
          unsafeAbsNames:safety?['MotorStar Xplorer 250R','Keeway Cafe Racer 152','Rusi Classic 250i','Kymco Agility Eco 125i'].filter(name=>safety.innerText.includes(name)):[],
          contentHeight:Math.round(root.scrollHeight)
        };
      })()`);

      results.push({ width, name, pathname, ...audit });
      if ((audit?.overflow || 0) > 5) failures.push(`${width}px ${pathname}: horizontal overflow ${audit.overflow}px`);
      if (audit?.broken?.length) failures.push(`${width}px ${pathname}: broken visible image ${audit.broken[0]}`);

      if (pathname === "/recommendations") {
        if (!audit?.hasRecommendationsRoot) failures.push(`${width}px /recommendations: premium recommendations root is missing`);
        if ((audit?.legacyRecommendationGrids || 0) > 0) failures.push(`${width}px /recommendations: legacy repetitive bike grid is still rendered`);
        if ((audit?.bikeCards || 0) < 8) failures.push(`${width}px /recommendations: image-led recommendation cards are missing`);
        if (audit?.principleCards !== 4) failures.push(`${width}px /recommendations: decision hierarchy is incomplete`);
        if (width === 1440 && (audit?.h1Size || 0) < 64) failures.push(`1440px /recommendations: hero type is too small (${audit.h1Size}px)`);
        if (width === 430 && (audit?.h1Size || 0) < 40) failures.push(`430px /recommendations: mobile hero type is too small (${audit.h1Size}px)`);
        if ((audit?.duplicateAutomaticHeading || 0) > 0) failures.push(`${width}px /recommendations: duplicate automatic-options section returned`);
        if (audit?.unsafeAbsNames?.length) failures.push(`${width}px /recommendations: unconfirmed ABS models shown as confirmed: ${audit.unsafeAbsNames.join(', ')}`);
      }

      const shot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
      fs.writeFileSync(path.join(outputDir, `${String(width).padStart(4,"0")}-${name}-editorial.png`), Buffer.from(shot.data, "base64"));

      if (pathname === "/recommendations") {
        const metrics = await cdp.send("Page.getLayoutMetrics");
        const size = metrics.cssContentSize || metrics.contentSize;
        const fullHeight = Math.min(Math.max(Math.ceil(size.height || 0), 1), 12000);
        const fullShot = await cdp.send("Page.captureScreenshot", {
          format: "png",
          fromSurface: true,
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width, height: fullHeight, scale: 1 }
        });
        fs.writeFileSync(path.join(outputDir, `${String(width).padStart(4,"0")}-recommendations-editorial-full.png`), Buffer.from(fullShot.data, "base64"));
      }
    }
  }

  fs.writeFileSync(path.join(outputDir, "editorial-report.json"), JSON.stringify({ failures, results }, null, 2));
  console.log(`Editorial visual QA: ${results.length} renders, ${failures.length} failures`);
  if (failures.length) {
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  }
} finally {
  proc.kill("SIGTERM");
  fs.rmSync(profile, { recursive: true, force: true });
}
