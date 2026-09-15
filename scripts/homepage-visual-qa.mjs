import fs from "node:fs";
import os from "node:os";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");

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
  throw new Error("Homepage did not finish loading.");
}

const inspect = `(() => {
  const hero = document.querySelector('.mi-hero');
  const layout = document.querySelector('.mi-hero-layout');
  const heading = document.querySelector('.mi-hero h1');
  const search = document.querySelector('.mi-search');
  const searchInput = document.querySelector('.mi-search input');
  const searchButton = document.querySelector('.mi-search button');
  const research = document.querySelector('.mi-research-shell');
  if (!hero || !layout || !heading || !search || !searchInput || !searchButton || !research) {
    return { missing: true, found: { hero:!!hero, layout:!!layout, heading:!!heading, search:!!search, searchInput:!!searchInput, searchButton:!!searchButton, research:!!research } };
  }
  const heroStyle = getComputedStyle(hero);
  const layoutStyle = getComputedStyle(layout);
  const headingStyle = getComputedStyle(heading);
  const searchStyle = getComputedStyle(search);
  const heroRect = hero.getBoundingClientRect();
  const layoutRect = layout.getBoundingClientRect();
  const researchRect = research.getBoundingClientRect();
  const inputRect = searchInput.getBoundingClientRect();
  const buttonRect = searchButton.getBoundingClientRect();
  return {
    missing:false,
    width:innerWidth,
    scrollWidth:document.documentElement.scrollWidth,
    heroBackground:heroStyle.backgroundImage,
    heroBackgroundColor:heroStyle.backgroundColor,
    layoutDisplay:layoutStyle.display,
    layoutColumns:layoutStyle.gridTemplateColumns,
    headingColor:headingStyle.color,
    headingSize:parseFloat(headingStyle.fontSize || '0'),
    searchDisplay:searchStyle.display,
    heroHeight:Math.round(heroRect.height),
    layoutWidth:Math.round(layoutRect.width),
    researchWidth:Math.round(researchRect.width),
    researchLeft:Math.round(researchRect.left),
    layoutLeft:Math.round(layoutRect.left),
    inputHeight:Math.round(inputRect.height),
    buttonHeight:Math.round(buttonRect.height)
  };
})()`;

const chrome = findChrome();
const port = 9777;
const profile = fs.mkdtempSync(`${os.tmpdir()}/motoindex-homepage-qa-`);
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

  for (const width of [1440, 390]) {
    const height = width === 390 ? 844 : 900;
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 430 });
    await cdp.send("Page.navigate", { url: base.toString() });
    await waitForComplete(cdp.send);
    await new Promise(resolve => setTimeout(resolve, 450));
    const row = await evaluate(cdp.send, inspect);
    results.push(row);

    if (!row || row.missing) {
      failures.push(`${width}px: required homepage hero elements are missing: ${JSON.stringify(row?.found || {})}`);
      continue;
    }
    if (row.layoutDisplay !== "grid") failures.push(`${width}px: hero layout is ${row.layoutDisplay}, expected grid`);
    if (row.searchDisplay !== "grid") failures.push(`${width}px: homepage search is ${row.searchDisplay}, expected grid`);
    if (row.scrollWidth > width + 5) failures.push(`${width}px: homepage overflows horizontally by ${row.scrollWidth - width}px`);
    if (row.inputHeight < 40 || row.buttonHeight < 40) failures.push(`${width}px: search controls collapsed below a usable 40px height`);
    if (/rgb\(9,\s*10,\s*13\)|rgb\(7,\s*8,\s*10\)/.test(row.heroBackground) || /rgb\(9,\s*10,\s*13\)|rgb\(7,\s*8,\s*10\)/.test(row.heroBackgroundColor)) failures.push(`${width}px: retired near-black homepage hero returned`);
    if (!/rgb\(255,\s*255,\s*255\)|rgb\(248,\s*250,\s*252\)/.test(row.heroBackground)) failures.push(`${width}px: homepage hero is not using the light premium background`);
    if (!/rgb\(15,\s*23,\s*42\)/.test(row.headingColor)) failures.push(`${width}px: hero heading color ${row.headingColor} is not the intended readable slate ink`);
    if (width === 1440) {
      if (row.headingSize > 61) failures.push(`1440px: homepage H1 is ${row.headingSize}px, above the 60px design cap`);
      if (row.researchWidth < 420) failures.push(`1440px: research snapshot collapsed to ${row.researchWidth}px`);
      if (!row.layoutColumns || row.layoutColumns.split(" ").length < 2) failures.push(`1440px: hero no longer resolves to two desktop columns (${row.layoutColumns})`);
    } else {
      if (row.headingSize > 50) failures.push(`390px: homepage H1 is ${row.headingSize}px, too large for mobile`);
      if (row.researchWidth > row.layoutWidth + 2) failures.push(`390px: research snapshot is wider than the hero layout`);
      if (Math.abs(row.researchLeft - row.layoutLeft) > 6) failures.push(`390px: research snapshot is misaligned with the mobile hero shell`);
    }
  }

  console.log("Homepage visual guard:");
  for (const row of results) console.log(`- ${row?.width || "unknown"}px: H1 ${row?.headingSize || 0}px, layout ${row?.layoutDisplay || "missing"}, research ${row?.researchWidth || 0}px`);
  if (failures.length) {
    console.error("Homepage visual guard failed:");
    failures.forEach(item => console.error(`- ${item}`));
    process.exitCode = 1;
  } else {
    console.log("Homepage visual guard passed at 1440px and 390px.");
  }
} finally {
  proc.kill("SIGTERM");
  await new Promise(resolve => setTimeout(resolve, 250));
  try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch {}
}
