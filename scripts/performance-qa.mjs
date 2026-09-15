import fs from "node:fs";
import os from "node:os";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const routes = [
  { name: "home", path: "/" },
  { name: "catalog", path: "/motorcycles" },
  { name: "model", path: "/motorcycles/yamaha/aerox-v3" },
  { name: "compare", path: "/compare/selection?bikes=aerox-v3,nmax-v3" },
  { name: "finder", path: "/finder", interaction: ".finder-choice-grid button" },
];
const budgets = { lcpMs: 2500, cls: 0.1, interactionMs: 200 };

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
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (await evaluate(send, "document.readyState").catch(() => "") === "complete") return;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error("Page did not finish loading.");
}

const chrome = findChrome();
const port = 9666;
const profile = fs.mkdtempSync(`${os.tmpdir()}/motoindex-performance-`);
const proc = spawn(chrome, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--disable-background-networking",
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
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", { source: `
    (() => {
      window.__miVitals = { lcp: 0, cls: 0, interaction: 0 };
      try { new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__miVitals.lcp = Math.max(window.__miVitals.lcp, entry.startTime || 0); }).observe({type:'largest-contentful-paint', buffered:true}); } catch {}
      try { new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__miVitals.cls += entry.value || 0; }).observe({type:'layout-shift', buffered:true}); } catch {}
      addEventListener('click', () => { const started = performance.now(); requestAnimationFrame(() => requestAnimationFrame(() => { window.__miVitals.interaction = Math.max(window.__miVitals.interaction, performance.now() - started); })); }, true);
    })();
  `});

  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1365, height: 900, deviceScaleFactor: 1, mobile: false });

  for (const route of routes) {
    await cdp.send("Page.navigate", { url: new URL(route.path, base).toString() });
    await waitForComplete(cdp.send);
    await new Promise(resolve => setTimeout(resolve, 900));

    if (route.interaction) {
      const rect = await evaluate(cdp.send, `(() => { const el=document.querySelector(${JSON.stringify(route.interaction)}); if(!el)return null; const r=el.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2}; })()`);
      if (!rect) failures.push(`${route.name}: interaction target ${route.interaction} was not found`);
      else {
        await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rect.x, y: rect.y });
        await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: rect.x, y: rect.y, button: "left", clickCount: 1 });
        await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: rect.x, y: rect.y, button: "left", clickCount: 1 });
        await new Promise(resolve => setTimeout(resolve, 450));
      }
    }

    const vitals = await evaluate(cdp.send, `(() => ({ ...window.__miVitals, href: location.pathname + location.search }))()`);
    results.push({ name: route.name, ...vitals });
    if (!vitals || vitals.lcp <= 0) failures.push(`${route.name}: LCP could not be measured`);
    else if (vitals.lcp > budgets.lcpMs) failures.push(`${route.name}: LCP ${Math.round(vitals.lcp)}ms exceeds ${budgets.lcpMs}ms`);
    if ((vitals?.cls || 0) > budgets.cls) failures.push(`${route.name}: CLS ${vitals.cls.toFixed(3)} exceeds ${budgets.cls}`);
    if (route.interaction && (vitals?.interaction || 0) > budgets.interactionMs) failures.push(`${route.name}: interaction response proxy ${Math.round(vitals.interaction)}ms exceeds ${budgets.interactionMs}ms`);
  }

  console.log("Browser performance budgets:");
  for (const row of results) console.log(`- ${row.name}: LCP ${Math.round(row.lcp)}ms, CLS ${row.cls.toFixed(3)}${row.interaction ? `, interaction ${Math.round(row.interaction)}ms` : ""}`);

  if (failures.length) {
    console.error("Browser performance budget failed:");
    failures.forEach(item => console.error(`- ${item}`));
    process.exitCode = 1;
  } else {
    console.log("Browser performance budget passed (LCP <= 2.5s, CLS <= 0.1, Finder interaction proxy <= 200ms). ");
  }
} finally {
  proc.kill("SIGTERM");
  await new Promise(resolve => setTimeout(resolve, 250));
  try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch {}
}
