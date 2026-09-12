import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const widths = (process.env.QA_WIDTHS || "360,390,430,768,1024,1440").split(",").map(Number).filter(Number.isFinite);
const pages = [
  ["home", "/"],
  ["motorcycles", "/motorcycles"],
  ["finder", "/finder"],
  ["compare", "/compare"],
  ["electric", "/motorcycles/electric"],
  ["click-160", "/motorcycles/honda/click-160"],
  ["helmets", "/gear/helmets"],
  ["dealers", "/dealers"],
];
const outputDir = path.join(process.cwd(), "artifacts", "visual-qa");
fs.mkdirSync(outputDir, { recursive: true });

function findChrome() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  for (const candidate of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const result = spawnSync("which", [candidate], { encoding: "utf8" });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
  }
  throw new Error("Chrome/Chromium was not found. GitHub ubuntu-latest should provide google-chrome.");
}

async function waitForDebugPort(port) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Chrome remote debugging endpoint did not become ready.");
}

async function createTab(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  if (!response.ok) throw new Error(`Unable to create Chrome tab: ${response.status}`);
  return response.json();
}

function connectCdp(webSocketDebuggerUrl) {
  if (typeof WebSocket === "undefined") throw new Error("Node.js WebSocket global is unavailable; Node 22+ is required.");
  const ws = new WebSocket(webSocketDebuggerUrl);
  let nextId = 1;
  const pending = new Map();
  const events = new Map();
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
      return;
    }
    if (message.method && events.has(message.method)) {
      const handlers = events.get(message.method);
      events.delete(message.method);
      for (const handler of handlers) handler(message.params);
    }
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  function once(method, timeoutMs = 12_000) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), timeoutMs);
      const handler = (params) => { clearTimeout(timeout); resolve(params); };
      const handlers = events.get(method) || [];
      handlers.push(handler);
      events.set(method, handlers);
    });
  }
  return { ws, ready, send, once };
}

async function readyState(send) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    try {
      const result = await send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
      if (result.result?.value === "complete") return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

const auditExpression = `(() => {
  const root = document.documentElement;
  const viewportWidth = root.clientWidth;
  const bodyOverflow = Math.max(root.scrollWidth, document.body?.scrollWidth || 0) - viewportWidth;
  const visible = (el) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0.05 && rect.width > 2 && rect.height > 2 && rect.bottom > 0 && rect.top < innerHeight;
  };
  const critical = [...document.querySelectorAll('header, nav, [class*="popover"], [class*="mobile-menu"], [class*="compare-builder"], [class*="product-entity-nav"]')]
    .filter(visible)
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, cls: String(el.className || '').slice(0, 120), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) };
    })
    .filter((row) => row.left < -5 || row.right > innerWidth + 5)
    .slice(0, 15);
  const brokenImages = [...document.images]
    .filter((img) => visible(img) && img.complete && img.currentSrc && img.naturalWidth === 0)
    .map((img) => img.currentSrc)
    .slice(0, 15);
  const tinyTargets = [...document.querySelectorAll('a,button')]
    .filter(visible)
    .map((el) => { const r = el.getBoundingClientRect(); return { text: (el.textContent || '').trim().slice(0, 50), w: Math.round(r.width), h: Math.round(r.height) }; })
    .filter((row) => row.w < 24 || row.h < 24)
    .slice(0, 20);
  return { title: document.title, bodyOverflow, critical, brokenImages, tinyTargets, viewportWidth, scrollWidth: root.scrollWidth };
})()`;

const chrome = findChrome();
const port = 9222;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-chrome-"));
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
    const height = width <= 430 ? 844 : width <= 768 ? 1024 : 900;
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 768 });
    for (const [name, pathname] of pages) {
      const url = new URL(pathname, base).toString();
      await cdp.send("Page.navigate", { url });
      await readyState(cdp.send);
      await new Promise((resolve) => setTimeout(resolve, 350));
      const evaluated = await cdp.send("Runtime.evaluate", { expression: auditExpression, returnByValue: true });
      const audit = evaluated.result?.value || {};
      const screenshot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
      const file = path.join(outputDir, `${String(width).padStart(4, "0")}-${name}.png`);
      fs.writeFileSync(file, Buffer.from(screenshot.data, "base64"));
      const row = { width, name, pathname, ...audit };
      results.push(row);
      if ((audit.bodyOverflow || 0) > 5) failures.push(`${width}px ${pathname}: document overflows horizontally by ${audit.bodyOverflow}px`);
      if (audit.critical?.length) failures.push(`${width}px ${pathname}: critical navigation/layout element leaves the viewport: ${JSON.stringify(audit.critical[0])}`);
      if (audit.brokenImages?.length) failures.push(`${width}px ${pathname}: visible broken image ${audit.brokenImages[0]}`);
    }
  }

  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify({ base: base.origin, results, failures }, null, 2)}\n`);
  const summary = ["# MotoIndex visual QA", "", `Base: ${base.origin}`, `Viewports: ${widths.join(", ")}`, `Pages per viewport: ${pages.length}`, `Failures: ${failures.length}`, "", ...(failures.length ? failures.map((item) => `- ${item}`) : ["No horizontal overflow, critical off-screen navigation, or visible broken images were detected."]), "", "Note: tinyTargets are recorded in report.json for manual accessibility review but do not fail this check because inline text links can legitimately be smaller than 24px."];
  fs.writeFileSync(path.join(outputDir, "report.md"), `${summary.join("\n")}\n`);
  if (failures.length) {
    console.error(`Visual QA failed:\n- ${failures.join("\n- ")}`);
    process.exitCode = 1;
  } else {
    console.log(`Visual QA passed: ${results.length} viewport/page combinations checked.`);
  }
  await cdp.send("Browser.close").catch(() => {});
} finally {
  proc.kill("SIGKILL");
  fs.rmSync(profile, { recursive: true, force: true });
}
