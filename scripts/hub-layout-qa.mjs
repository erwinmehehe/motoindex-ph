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

    await navigate("/recommendations/motorcycles-under-100k");
    const recommendationDetail = await evaluate(cdp.send, `(() => {
      const display = selector => {
        const el = document.querySelector(selector);
        return el ? getComputedStyle(el).display : "missing";
      };
      const root = document.documentElement;
      const heading = document.querySelector('.recommendation-detail-scope .guide-page-head h1');
      const headingRect = heading?.getBoundingClientRect();
      const firstModel = document.querySelector('.guide-model-analysis');
      const firstModelRect = firstModel?.getBoundingClientRect();
      return {
        overflow: root.scrollWidth - root.clientWidth,
        scope: Boolean(document.querySelector('.recommendation-detail-scope')),
        picks: display('.guide-pick-grid'),
        method: display('.guide-method-grid'),
        model: display('.guide-model-analysis'),
        decision: display('.guide-decision-grid'),
        related: display('.guide-related-grid'),
        tableWidth: document.querySelector('.guide-table-wrap')?.getBoundingClientRect().width || 0,
        firstModelWidth: firstModelRect?.width || 0,
        headingSize: heading ? parseFloat(getComputedStyle(heading).fontSize) : 0,
        headingRight: headingRect?.right || 0,
        viewport: innerWidth
      };
    })()`);
    results.push({ width, page: "recommendation-detail", ...recommendationDetail });
    if (!recommendationDetail?.scope) failures.push(`${width}px recommendation detail scope is missing`);
    if ((recommendationDetail?.overflow || 0) > 5) failures.push(`${width}px recommendation detail overflows by ${recommendationDetail.overflow}px`);
    if (recommendationDetail?.picks !== "grid") failures.push(`${width}px recommendation quick picks collapsed (${recommendationDetail?.picks})`);
    if (recommendationDetail?.method !== "grid") failures.push(`${width}px recommendation method grid collapsed (${recommendationDetail?.method})`);
    if (recommendationDetail?.model !== "grid") failures.push(`${width}px recommendation model analysis collapsed (${recommendationDetail?.model})`);
    if (recommendationDetail?.decision !== "grid") failures.push(`${width}px recommendation decision grid collapsed (${recommendationDetail?.decision})`);
    if ((recommendationDetail?.tableWidth || 0) < (width <= 430 ? 330 : 900)) failures.push(`${width}px recommendation table wrapper is too narrow (${recommendationDetail?.tableWidth}px)`);
    if ((recommendationDetail?.firstModelWidth || 0) < (width <= 430 ? 330 : 900)) failures.push(`${width}px recommendation model block is too narrow (${recommendationDetail?.firstModelWidth}px)`);
    if ((recommendationDetail?.headingSize || 0) < 34) failures.push(`${width}px recommendation detail heading lost route styling`);
    if ((recommendationDetail?.headingRight || 0) > (recommendationDetail?.viewport || width) + 5) failures.push(`${width}px recommendation detail heading is clipped`);
    await screenshot("recommendation-detail", width);

    await navigate("/gear/helmets");
    const helmets = await evaluate(cdp.send, `(() => {
      const display = selector => {
        const el = document.querySelector(selector);
        return el ? getComputedStyle(el).display : "missing";
      };
      const root = document.documentElement;
      const heading = document.querySelector('.helmet-hub-page .ui-page-hero h1');
      const headingRect = heading?.getBoundingClientRect();
      const cardWidths = [...document.querySelectorAll('#full-face .ui-product-grid>.ui-product-card-shell')].slice(0,6).map(el => Math.round(el.getBoundingClientRect().width));
      const firstMedia=document.querySelector('#full-face .ui-product-media');
      const firstImage=firstMedia?.querySelector('img');
      const mediaRect=firstMedia?.getBoundingClientRect();
      const imageRect=firstImage?.getBoundingClientRect();
      const intro=document.querySelector('.helmet-master-intro');
      return {
        overflow: root.scrollWidth - root.clientWidth,
        actions: display('.helmet-hub-page .ui-cta-group'),
        facts: display('.helmet-hub-page .ui-stat-row'),
        nav: display('.helmet-master-nav'),
        introGrid: display('.helmet-master-intro .ui-content-grid'),
        productGrid: display('.helmet-master-section .ui-product-grid'),
        factsCount: document.querySelectorAll('.helmet-hub-page .ui-stat-row__item').length,
        navLinks: document.querySelectorAll('.helmet-master-nav a').length,
        introCards: document.querySelectorAll('.helmet-master-intro .ui-content-card').length,
        placeholderImages: document.querySelectorAll('.helmet-hub-page img[src*="/media/placeholders/"]').length,
        cardWidths,
        mediaPosition:firstMedia?getComputedStyle(firstMedia).position:'missing',
        mediaHeight:mediaRect?.height||0,
        imageEscapes:Boolean(mediaRect&&imageRect&&(imageRect.left<mediaRect.left-2||imageRect.right>mediaRect.right+2||imageRect.top<mediaRect.top-2||imageRect.bottom>mediaRect.bottom+2)),
        introBg:intro?getComputedStyle(intro).backgroundColor:'',
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
    if ((helmets?.placeholderImages || 0) > 0) failures.push(`${width}px helmet hub renders ${helmets.placeholderImages} placeholder product image(s)`);
    if ((helmets?.headingSize || 0) < 32) failures.push(`${width}px helmet hub heading lost route styling`);
    if ((helmets?.headingRight || 0) > (helmets?.viewport || width) + 5) failures.push(`${width}px helmet hub heading is clipped`);
    if (helmets?.mediaPosition !== "relative") failures.push(`${width}px helmet media stage is not positioned (${helmets?.mediaPosition})`);
    if ((helmets?.mediaHeight || 0) > 220) failures.push(`${width}px helmet media stage escaped its card height (${helmets?.mediaHeight}px)`);
    if (helmets?.imageEscapes) failures.push(`${width}px helmet image escapes its media stage`);
    if (!/rgb\(255, 255, 255\)/.test(helmets?.introBg || "")) failures.push(`${width}px helmet intro is not using the light surface (${helmets?.introBg || "missing"})`);
    const cardWidths = helmets?.cardWidths || [];
    if (cardWidths.length < 3) failures.push(`${width}px helmet full-face grid has too few cards`);
    const expectedMinCard = width <= 620 ? 300 : 250;
    if (cardWidths.some(cardWidth => cardWidth < expectedMinCard)) failures.push(`${width}px helmet card collapsed (${cardWidths.join(', ')}px)`);
    if (width > 900 && cardWidths.length > 1) {
      const minCard = Math.min(...cardWidths);
      const maxCard = Math.max(...cardWidths);
      if (minCard > 0 && maxCard / minCard > 1.2) failures.push(`${width}px helmet card widths are inconsistent (${cardWidths.join(', ')}px)`);
    }
    await screenshot("helmets", width);

    await navigate("/tires");
    const tires = await evaluate(cdp.send, `(() => {
      const root=document.documentElement;
      const grid=document.querySelector('[data-tire-size-index]');
      const first=grid?.querySelector('article');
      const products=document.querySelector('[data-tire-product-section]');
      return {
        overflow:root.scrollWidth-root.clientWidth,
        gridDisplay:grid?getComputedStyle(grid).display:'missing',
        rowCount:grid?.querySelectorAll('article').length||0,
        firstWidth:first?.getBoundingClientRect().width||0,
        firstHeight:first?.getBoundingClientRect().height||0,
        firstPadding:first?parseFloat(getComputedStyle(first).paddingTop):0,
        linkCount:first?.querySelectorAll('a').length||0,
        productsBeforeIndex:Boolean(products&&grid&&products.getBoundingClientRect().top<grid.getBoundingClientRect().top)
      };
    })()`);
    results.push({ width, page: "tires", ...tires });
    if ((tires?.overflow || 0) > 5) failures.push(`${width}px tires page overflows by ${tires.overflow}px`);
    if (tires?.gridDisplay !== "grid") failures.push(`${width}px common tire sizes are not structured as a compact grid (${tires?.gridDisplay})`);
    if ((tires?.rowCount || 0) < 8) failures.push(`${width}px common tire-size index is incomplete`);
    if ((tires?.firstWidth || 0) < (width <= 430 ? 300 : 180) || (tires?.firstHeight || 0) < 58) failures.push(`${width}px common tire-size row collapsed (${tires?.firstWidth}x${tires?.firstHeight})`);
    if ((tires?.firstPadding || 0) < 12) failures.push(`${width}px common tire-size row lost vertical padding (${tires?.firstPadding}px)`);
    if ((tires?.linkCount || 0) < 2) failures.push(`${width}px common tire-size row lost model links`);
    if (!tires?.productsBeforeIndex) failures.push(`${width}px verified tire products no longer appear before the common-size index`);
    await screenshot("tires", width);

    await navigate("/accessories/top-box");
    const topbox = await evaluate(cdp.send, `(() => {
      const root=document.documentElement;
      const page=document.querySelector('.topbox-master-page');
      const records=document.querySelector('.checked-record-list');
      const firstRecord=records?.querySelector('a');
      const research=document.querySelector('.research-brand-grid');
      const firstBrand=research?.querySelector('article');
      return {
        overflow:root.scrollWidth-root.clientWidth,
        scoped:Boolean(page&&page.classList.contains('accessories-master-page')),
        recordsDisplay:records?getComputedStyle(records).display:'missing',
        firstRecordHeight:firstRecord?.getBoundingClientRect().height||0,
        researchDisplay:research?getComputedStyle(research).display:'missing',
        firstBrandWidth:firstBrand?.getBoundingClientRect().width||0,
        firstBrandHeight:firstBrand?.getBoundingClientRect().height||0
      };
    })()`);
    results.push({ width, page: "top-box", ...topbox });
    if ((topbox?.overflow || 0) > 5) failures.push(`${width}px top-box page overflows by ${topbox.overflow}px`);
    if (!topbox?.scoped) failures.push(`${width}px top-box page is missing accessories layout scope`);
    if (!["grid","flex","block"].includes(topbox?.recordsDisplay)) failures.push(`${width}px checked top-box records collapsed (${topbox?.recordsDisplay})`);
    if ((topbox?.firstRecordHeight || 0) < 50) failures.push(`${width}px checked top-box record is visually collapsed (${topbox?.firstRecordHeight}px)`);
    if (topbox?.researchDisplay !== "grid") failures.push(`${width}px top-box research brands are not a grid (${topbox?.researchDisplay})`);
    if ((topbox?.firstBrandWidth || 0) < (width <= 430 ? 300 : 180) || (topbox?.firstBrandHeight || 0) < 100) failures.push(`${width}px top-box research card collapsed (${topbox?.firstBrandWidth}x${topbox?.firstBrandHeight})`);
    await screenshot("top-box", width);
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
console.log(`Recommendations + recommendation detail + helmet/tire/top-box hub layout QA passed: ${results.length} route/viewport checks.`);
