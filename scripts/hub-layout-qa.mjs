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
const port = 9227;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-hub-layout-"));
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
    await new Promise(resolve => setTimeout(resolve, 600));
  }

  async function screenshot(name, width) {
    const image = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    fs.writeFileSync(path.join(outputDir, `hub-layout-${width}-${name}.png`), Buffer.from(image.data, "base64"));
  }

  for (const width of widths) {
    await setViewport(width);

    await navigate("/recommendations");
    const recommendations = await evaluate(cdp.send, `(() => {
      const display = selector => {
        const el = document.querySelector(selector);
        return el ? getComputedStyle(el).display : "missing";
      };
      const root = document.documentElement;
      const heading = document.querySelector('.rec-hero h1');
      const headingRect = heading?.getBoundingClientRect();
      return {
        overflow: root.scrollWidth - root.clientWidth,
        heroActions: display('.rec-hero-actions'),
        startRow: display('.rec-start-card>a'),
        proof: display('.rec-hero-proof'),
        nav: display('.rec-nav'),
        principles: display('.rec-principle-grid'),
        startRows: document.querySelectorAll('.rec-start-card>a').length,
        navLinks: document.querySelectorAll('.rec-nav a').length,
        headingSize: heading ? parseFloat(getComputedStyle(heading).fontSize) : 0,
        headingRight: headingRect?.right || 0,
        viewport: innerWidth
      };
    })()`);
    results.push({ width, page: "recommendations", ...recommendations });
    const compactRecommendations = width <= 520;
    const expectedActionDisplay = compactRecommendations ? "grid" : "flex";
    const expectedProofDisplay = compactRecommendations ? "grid" : "flex";
    if ((recommendations?.overflow || 0) > 5) failures.push(`${width}px recommendations overflows by ${recommendations.overflow}px`);
    if (recommendations?.heroActions !== expectedActionDisplay) failures.push(`${width}px recommendations hero actions should be ${expectedActionDisplay} (${recommendations?.heroActions})`);
    if (recommendations?.startRow !== "grid") failures.push(`${width}px recommendations start card rows collapsed (${recommendations?.startRow})`);
    if (recommendations?.proof !== expectedProofDisplay) failures.push(`${width}px recommendations proof row should be ${expectedProofDisplay} (${recommendations?.proof})`);
    if (recommendations?.nav !== "flex") failures.push(`${width}px recommendations section nav collapsed (${recommendations?.nav})`);
    if (recommendations?.principles !== "grid") failures.push(`${width}px recommendations principle grid collapsed (${recommendations?.principles})`);
    if ((recommendations?.startRows || 0) !== 4) failures.push(`${width}px recommendations start card is incomplete`);
    if ((recommendations?.navLinks || 0) < 8) failures.push(`${width}px recommendations section nav is incomplete`);
    if ((recommendations?.headingSize || 0) < 36) failures.push(`${width}px recommendations hero heading lost route styling`);
    if ((recommendations?.headingRight || 0) > (recommendations?.viewport || width) + 5) failures.push(`${width}px recommendations heading is clipped`);
    await screenshot("recommendations", width);

    await navigate("/gear/helmets");
    const helmets = await evaluate(cdp.send, `(() => {
      const display = selector => {
        const el = document.querySelector(selector);
        return el ? getComputedStyle(el).display : "missing";
      };
      const root = document.documentElement;
      const heading = document.querySelector('.helmet-hub-page>.page-head h1');
      const headingRect = heading?.getBoundingClientRect();
      return {
        overflow: root.scrollWidth - root.clientWidth,
        actions: display('.helmet-shop-actions'),
        facts: display('.helmet-hub-page .brand-facts'),
        nav: display('.helmet-master-nav'),
        introGrid: display('.helmet-master-intro .topic-grid'),
        productGrid: display('.helmet-master-section .product-grid'),
        factsCount: document.querySelectorAll('.helmet-hub-page .brand-facts>div').length,
        navLinks: document.querySelectorAll('.helmet-master-nav a').length,
        introCards: document.querySelectorAll('.helmet-master-intro .topic-grid>article').length,
        headingSize: heading ? parseFloat(getComputedStyle(heading).fontSize) : 0,
        headingRight: headingRect?.right || 0,
        viewport: innerWidth
      };
    })()`);
    results.push({ width, page: "helmet-hub", ...helmets });
    if ((helmets?.overflow || 0) > 5) failures.push(`${width}px helmet hub overflows by ${helmets.overflow}px`);
    if (!["flex", "grid"].includes(helmets?.actions)) failures.push(`${width}px helmet hub actions collapsed (${helmets?.actions})`);
    if (helmets?.facts !== "grid") failures.push(`${width}px helmet hub facts collapsed (${helmets?.facts})`);
    if (helmets?.nav !== "flex") failures.push(`${width}px helmet hub nav collapsed (${helmets?.nav})`);
    if (helmets?.introGrid !== "grid") failures.push(`${width}px helmet intro cards collapsed (${helmets?.introGrid})`);
    if (helmets?.productGrid !== "grid") failures.push(`${width}px helmet product grid collapsed (${helmets?.productGrid})`);
    if ((helmets?.factsCount || 0) !== 4) failures.push(`${width}px helmet hub facts are incomplete`);
    if ((helmets?.navLinks || 0) < 8) failures.push(`${width}px helmet hub nav is incomplete`);
    if ((helmets?.introCards || 0) !== 4) failures.push(`${width}px helmet intro grid is incomplete`);
    if ((helmets?.headingSize || 0) < 32) failures.push(`${width}px helmet hub heading lost route styling`);
    if ((helmets?.headingRight || 0) > (helmets?.viewport || width) + 5) failures.push(`${width}px helmet hub heading is clipped`);
    await screenshot("helmets", width);
  }
} finally {
  if (proc.exitCode === null) {
    proc.kill("SIGTERM");
    await Promise.race([
      new Promise(resolve => proc.once("exit", resolve)),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);
  }
  try {
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  } catch (error) {
    if (error?.code !== "ENOTEMPTY") throw error;
  }
}

fs.writeFileSync(path.join(outputDir, "hub-layout-report.json"), JSON.stringify({ results, failures }, null, 2));
if (failures.length) {
  console.error(`Hub layout QA failed:\n${failures.map(item => `- ${item}`).join("\n")}`);
  process.exit(1);
}
console.log(`Recommendations + helmet hub layout QA passed: ${results.length} route/viewport checks.`);
