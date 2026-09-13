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
const fullPageNames = new Set(["home", "motorcycles", "finder", "click-160"]);
const fullPageWidths = new Set([430, 1440]);
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
  return { ws, ready, send };
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

async function evaluate(send, expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return result.result?.value;
}

const auditExpression = `(() => {
  const root = document.documentElement;
  const viewportWidth = root.clientWidth;
  const bodyOverflow = root.scrollWidth - viewportWidth;
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

  const finderHead = document.querySelector('.page:has(.finder-v4) > .page-head');
  const finderHeadGap = finderHead ? Math.max(0, Math.round(viewportWidth - finderHead.getBoundingClientRect().right)) : 0;
  const mobileDock = document.querySelector('.mobile-quick-tabs');
  const mobileDockVisible = Boolean(mobileDock && visible(mobileDock));
  const featuredCards = [...document.querySelectorAll('.mi-model-grid > .model-card')].map((el) => Math.round(el.getBoundingClientRect().width)).filter((v) => v > 0);
  const featuredCardRatio = featuredCards.length > 1 ? Math.max(...featuredCards) / Math.min(...featuredCards) : 1;
  const modelHero = document.querySelector('.motorcycle-entity-hero');
  const modelHeroHeading = modelHero?.querySelector('h1');
  const modelHeroTheme = modelHero && modelHeroHeading ? {
    background: getComputedStyle(modelHero).backgroundImage,
    headingColor: getComputedStyle(modelHeroHeading).color,
    headingSize: parseFloat(getComputedStyle(modelHeroHeading).fontSize || '0')
  } : null;

  return { title: document.title, bodyOverflow, critical, brokenImages, tinyTargets, viewportWidth, scrollWidth: root.scrollWidth, finderHeadGap, mobileDockVisible, featuredCardRatio, featuredCards, modelHeroTheme };
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
const functionalFailures = [];
const results = [];
const functionalResults = [];

try {
  await waitForDebugPort(port);
  const tab = await createTab(port);
  const cdp = connectCdp(tab.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  async function setViewport(width) {
    const height = width <= 430 ? 844 : width <= 768 ? 1024 : 900;
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 768 });
    return height;
  }

  async function navigate(pathname, settleMs = 450) {
    const url = new URL(pathname, base).toString();
    await cdp.send("Page.navigate", { url });
    await readyState(cdp.send);
    await new Promise((resolve) => setTimeout(resolve, settleMs));
    return url;
  }

  for (const width of widths) {
    await setViewport(width);
    for (const [name, pathname] of pages) {
      await navigate(pathname, 350);
      const evaluated = await cdp.send("Runtime.evaluate", { expression: auditExpression, returnByValue: true });
      const audit = evaluated.result?.value || {};
      const screenshot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
      const file = path.join(outputDir, `${String(width).padStart(4, "0")}-${name}.png`);
      fs.writeFileSync(file, Buffer.from(screenshot.data, "base64"));

      if (fullPageWidths.has(width) && fullPageNames.has(name)) {
        const metrics = await cdp.send("Page.getLayoutMetrics");
        const size = metrics.cssContentSize || metrics.contentSize;
        const fullHeight = Math.min(Math.max(Math.ceil(size.height || 0), 1), 12000);
        const fullWidth = Math.min(Math.max(Math.ceil(size.width || width), width), width);
        const fullScreenshot = await cdp.send("Page.captureScreenshot", {
          format: "png",
          fromSurface: true,
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width: fullWidth, height: fullHeight, scale: 1 }
        });
        fs.writeFileSync(path.join(outputDir, `${String(width).padStart(4, "0")}-${name}-full.png`), Buffer.from(fullScreenshot.data, "base64"));
      }

      const row = { width, name, pathname, ...audit };
      results.push(row);
      if ((audit.bodyOverflow || 0) > 5) failures.push(`${width}px ${pathname}: document overflows horizontally by ${audit.bodyOverflow}px`);
      if (audit.critical?.length) failures.push(`${width}px ${pathname}: critical navigation/layout element leaves the viewport: ${JSON.stringify(audit.critical[0])}`);
      if (audit.brokenImages?.length) failures.push(`${width}px ${pathname}: visible broken image ${audit.brokenImages[0]}`);
      if (pathname === "/finder" && (audit.finderHeadGap || 0) > 4) failures.push(`${width}px ${pathname}: finder hero leaves a ${audit.finderHeadGap}px uncovered strip at the right edge`);
      if (width <= 768 && audit.mobileDockVisible) failures.push(`${width}px ${pathname}: redundant mobile bottom dock is covering page content`);
      if (pathname === "/" && (audit.featuredCardRatio || 1) > 1.35) failures.push(`${width}px ${pathname}: featured motorcycle cards have inconsistent widths (ratio ${audit.featuredCardRatio.toFixed(2)})`);
      if (pathname.includes("/motorcycles/honda/click-160") && audit.modelHeroTheme) {
        const background = String(audit.modelHeroTheme.background || "");
        const headingColor = String(audit.modelHeroTheme.headingColor || "");
        const lightHeading = /rgb\(255,\s*255,\s*255\)/.test(headingColor);
        const legacyLightHero = /rgb\(245,\s*244,\s*240\)|rgb\(255,\s*255,\s*255\)/.test(background);
        if (lightHeading && legacyLightHero) failures.push(`${width}px ${pathname}: white model title is rendered on the legacy light hero background`);
      }
    }
  }

  // Interaction QA runs once at desktop width against the production build.
  await setViewport(1440);
  await navigate("/motorcycles?q=Click");
  const filteredCatalog = await evaluate(cdp.send, `(() => ({
    url: location.pathname + location.search,
    names: [...document.querySelectorAll('.model-card h3')].map((el) => (el.textContent || '').trim()),
    count: document.querySelectorAll('.model-card').length
  }))()`);
  functionalResults.push({ test: "catalog-search", ...filteredCatalog });
  if (!filteredCatalog?.url?.includes("q=Click") || !filteredCatalog?.names?.some((name) => /Click/i.test(name))) functionalFailures.push("Catalog search/query state did not return a Click model.");

  await evaluate(cdp.send, `(() => { localStorage.removeItem('motoindex-shortlist-v1'); localStorage.removeItem('motoindex-compare-v1'); return true; })()`);
  await navigate("/motorcycles?q=Click");
  await evaluate(cdp.send, `(() => { document.querySelector('.model-card .shortlist-button')?.click(); return true; })()`);
  await new Promise((resolve) => setTimeout(resolve, 180));
  const shortlistState = await evaluate(cdp.send, `(() => ({
    pressed: document.querySelector('.model-card .shortlist-button')?.getAttribute('aria-pressed'),
    stored: JSON.parse(localStorage.getItem('motoindex-shortlist-v1') || '[]')
  }))()`);
  functionalResults.push({ test: "shortlist-toggle", ...shortlistState });
  if (shortlistState?.pressed !== "true" || !Array.isArray(shortlistState?.stored) || shortlistState.stored.length !== 1) functionalFailures.push("Shortlist button did not persist the selected motorcycle.");

  await evaluate(cdp.send, `(() => { const buttons = [...document.querySelectorAll('.model-card .compare-button')].slice(0,2); buttons.forEach((button) => button.click()); return buttons.length; })()`);
  await new Promise((resolve) => setTimeout(resolve, 180));
  const compareState = await evaluate(cdp.send, `(() => ({
    stored: JSON.parse(localStorage.getItem('motoindex-compare-v1') || '[]'),
    selected: [...document.querySelectorAll('.model-card .compare-button[aria-pressed="true"]')].length
  }))()`);
  functionalResults.push({ test: "compare-toggle", ...compareState });
  if (!Array.isArray(compareState?.stored) || compareState.stored.length < 2 || (compareState?.selected || 0) < 2) functionalFailures.push("Compare buttons did not persist two selected motorcycles.");

  await navigate("/finder");
  const finderStart = await evaluate(cdp.send, `(() => ({ active: [...document.querySelectorAll('.finder-progress button')].findIndex((el) => el.classList.contains('active')), choices: document.querySelectorAll('.finder-choice-grid button').length }))()`);
  await evaluate(cdp.send, `(() => { const buttons = [...document.querySelectorAll('.finder-choice-grid.budget button')]; (buttons[1] || buttons[0])?.click(); return buttons.length; })()`);
  await new Promise((resolve) => setTimeout(resolve, 320));
  const finderAdvanced = await evaluate(cdp.send, `(() => ({
    active: [...document.querySelectorAll('.finder-progress button')].findIndex((el) => el.classList.contains('active')),
    url: location.pathname + location.search,
    preview: (document.querySelector('.finder-live-preview h3')?.textContent || '').trim()
  }))()`);
  functionalResults.push({ test: "finder-step", start: finderStart, advanced: finderAdvanced });
  if (finderStart?.active !== 0 || finderAdvanced?.active !== 1 || !finderAdvanced?.preview) functionalFailures.push("Finder did not advance from budget to riding use while keeping a live recommendation.");

  await navigate("/compare");
  const compareBuilder = await evaluate(cdp.send, `(() => ({
    selects: document.querySelectorAll('select').length,
    hasBuilder: Boolean(document.querySelector('.compare-builder')),
    text: (document.querySelector('.compare-builder')?.textContent || '').slice(0,180)
  }))()`);
  functionalResults.push({ test: "compare-builder", ...compareBuilder });
  if (!compareBuilder?.hasBuilder || (compareBuilder?.selects || 0) < 2) functionalFailures.push("Compare page is missing the interactive comparison builder/selectors.");

  fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify({ base: base.origin, results, failures, functionalResults, functionalFailures }, null, 2)}\n`);
  const allFailures = [...failures, ...functionalFailures];
  const summary = [
    "# MotoIndex visual + functional QA",
    "",
    `Base: ${base.origin}`,
    `Viewports: ${widths.join(", ")}`,
    `Pages per viewport: ${pages.length}`,
    `Visual failures: ${failures.length}`,
    `Functional failures: ${functionalFailures.length}`,
    "",
    ...(allFailures.length ? allFailures.map((item) => `- ${item}`) : ["No viewport overflow, critical off-screen navigation, visible broken images, known hero/card regressions, or tested shopping-flow failures were detected."]),
    "",
    "Full-page screenshots are captured at 430px and 1440px for the homepage, motorcycle catalog, Finder and Honda Click 160 detail page.",
    "Interaction coverage: catalog query filtering, shortlist persistence, compare persistence, Finder step progression and compare-builder presence.",
    "Tiny targets remain recorded in report.json for manual accessibility review."
  ];
  fs.writeFileSync(path.join(outputDir, "report.md"), `${summary.join("\n")}\n`);
  if (allFailures.length) {
    console.error(`Visual/functional QA failed:\n- ${allFailures.join("\n- ")}`);
    process.exitCode = 1;
  } else {
    console.log(`Visual/functional QA passed: ${results.length} viewport/page combinations plus ${functionalResults.length} interaction checks.`);
  }
  await cdp.send("Browser.close").catch(() => {});
} finally {
  proc.kill("SIGKILL");
  await new Promise((resolve) => setTimeout(resolve, 250));
  try {
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  } catch {}
}
