import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const widths = [390, 1440];
const catalogSource = fs.readFileSync(path.join(process.cwd(), "lib", "catalog.ts"), "utf8");

function catalogBlock(startMarker, endMarker) {
  const start = catalogSource.indexOf(startMarker);
  if (start < 0) return "";
  const end = endMarker ? catalogSource.indexOf(endMarker, start) : -1;
  return catalogSource.slice(start, end > start ? end : undefined);
}

function representativeHelmetRoutes(block) {
  const pattern = /\{\s*id:"[^"]+"\s*,\s*brand:"([^"]+)"\s*,\s*brandSlug:"([^"]+)"\s*,\s*model:"([^"]+)"\s*,\s*slug:"([^"]+)"/g;
  const seen = new Set();
  const routes = [];
  for (const match of block.matchAll(pattern)) {
    const [, brand, brandSlug, model, slug] = match;
    if (seen.has(brandSlug)) continue;
    seen.add(brandSlug);
    routes.push({
      key: `helmet-${brandSlug}-${slug}`.replace(/[^a-z0-9-]+/gi, "-").toLowerCase(),
      path: `/gear/helmets/${brandSlug}/${slug}`,
      brand,
      model,
    });
  }
  return routes;
}

function representativeTopBoxRoutes(block) {
  const recordPattern = /\{\s*id:"[^"]+"[^}]*?brand:"([^"]+)"[^}]*?model:"([^"]+)"[^}]*?slug:"([^"]+)"/gs;
  const seen = new Set();
  const routes = [];
  for (const match of block.matchAll(recordPattern)) {
    const [, brand, model, slug] = match;
    const brandKey = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (seen.has(brandKey)) continue;
    seen.add(brandKey);
    routes.push({
      key: `topbox-${brandKey}-${slug}`.replace(/[^a-z0-9-]+/gi, "-").toLowerCase(),
      path: `/accessories/top-box/${slug}`,
      brand,
      model,
    });
  }
  return routes;
}


function representativeTireRoutes(block) {
  const recordPattern = /\{\s*id:"[^"]+"\s*,\s*brand:"([^"]+)"\s*,\s*brandSlug:"([^"]+)"\s*,\s*model:"([^"]+)"\s*,\s*slug:"([^"]+)"/g;
  const seen = new Set();
  const routes = [];
  for (const match of block.matchAll(recordPattern)) {
    const [, brand, brandSlug, model, slug] = match;
    if (seen.has(brandSlug)) continue;
    seen.add(brandSlug);
    routes.push({
      key: `tire-${brandSlug}-${slug}`.replace(/[^a-z0-9-]+/gi, "-").toLowerCase(),
      path: `/tires/${brandSlug}/${slug}`,
      brand,
      model,
    });
  }
  return routes;
}

const exactRegressionRoutes = [
  { key: "helmet-gille-kerena", path: "/gear/helmets/gille/kerena-ff007" },
  { key: "helmet-spyder-surge", path: "/gear/helmets/spyder/surge-plain-v2" },
  { key: "topbox-givi-v58", path: "/accessories/top-box/v58-maxia-5" },
  { key: "tire-michelin-city-grip-2", path: "/tires/michelin/city-grip-2" },
];
const helmetBrandRoutes = representativeHelmetRoutes(catalogBlock("export const helmetProducts", "export const tireProducts"));
const tireBrandRoutes = representativeTireRoutes(catalogBlock("export const tireProducts", "export const topBoxProducts"));
const topBoxBrandRoutes = representativeTopBoxRoutes(catalogBlock("export const topBoxProducts"));
const routes = [...new Map([...exactRegressionRoutes, ...helmetBrandRoutes, ...tireBrandRoutes, ...topBoxBrandRoutes].map(route => [route.path, route])).values()];

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
    try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error("Chrome remote debugging endpoint did not become ready.");
}
async function newTab(port) {
  return (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
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
const proc = spawn(chromePath(), ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
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
    await client.send("Emulation.setDeviceMetricsOverride", { width, height: width <= 430 ? 844 : 1000, deviceScaleFactor: 1, mobile: width <= 768 });
  }
  async function navigate(pathname) {
    await client.send("Page.navigate", { url: new URL(pathname, base).toString() });
    await waitReady(client.send);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  async function screenshot(name, width) {
    const metrics = await client.send("Page.getLayoutMetrics");
    const content = metrics.cssContentSize || metrics.contentSize;
    const image = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: true, clip: { x: 0, y: 0, width: Math.ceil(content.width), height: Math.min(Math.ceil(content.height), 12000), scale: 1 } });
    fs.writeFileSync(path.join(outputDir, `product-entity-${width}-${name}.png`), Buffer.from(image.data, "base64"));
  }

  for (const width of widths) {
    await viewport(width);
    for (const route of routes) {
      await navigate(route.path);
      const state = await evalJs(client.send, `(()=>{
        const root=document.documentElement;
        const page=document.querySelector('.product-entity-page');
        const hero=document.querySelector('.product-detail-hero');
        const summary=hero?.querySelector('.product-detail-summary');
        const heading=summary?.querySelector('h1');
        const lede=summary?.querySelector('.product-detail-lede');
        const media=hero?.querySelector('.product-detail-media > .entity-media');
        const fallback=media?.querySelector('.product-hero-card');
        const image=media?.querySelector('img');
        const facts=summary?.querySelector('.product-detail-facts');
        const factEls=facts?[...facts.children]:[];
        const trust=summary?.querySelector('.product-trust-row');
        const nav=document.querySelector('.product-entity-nav');
        const sections=[...document.querySelectorAll('.product-entity-section')];
        const sectionHeading=sections[0]?.querySelector('h2');
        const spec=document.querySelector('.entity-spec-table');
        const specLabel=spec?.querySelector('span');
        const editorial=document.querySelector('.product-editorial');
        const priceGrid=document.querySelector('.entity-price-grid');
        const compareRow=document.querySelector('.mini-compare-table > div:not(.head)');
        const r=el=>{if(!el)return null;const rect=el.getBoundingClientRect();return {left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height};};
        const px=el=>el?parseFloat(getComputedStyle(el).fontSize)||0:0;
        const objectFit=image?getComputedStyle(image).objectFit:'';
        return {
          title:heading?.textContent?.trim()||'', overflow:root.scrollWidth-root.clientWidth,
          page:r(page), hero:r(hero), summary:r(summary), heading:r(heading), lede:r(lede), media:r(media), fallback:r(fallback), image:r(image), facts:r(facts), trust:r(trust), nav:r(nav), spec:r(spec),
          heroDisplay:hero?getComputedStyle(hero).display:'', heroColumns:hero?getComputedStyle(hero).gridTemplateColumns:'',
          headingSize:px(heading), sectionHeadingSize:px(sectionHeading), specLabelSize:px(specLabel),
          mediaRadius:media?parseFloat(getComputedStyle(media).borderRadius)||0:0, objectFit,
          factsDisplay:facts?getComputedStyle(facts).display:'', factWidths:factEls.slice(0,6).map(el=>Math.round(r(el).width)),
          sectionWidths:sections.slice(0,8).map(el=>Math.round(r(el).width)),
          compareDisplay:compareRow?getComputedStyle(compareRow).display:'',
          compareColumns:compareRow?getComputedStyle(compareRow).gridTemplateColumns:'',
          editorial:r(editorial), priceGrid:r(priceGrid)
        };
      })()`);
      results.push({ width, route: route.path, ...state });

      const mobile = width <= 430;
      if (!state?.title) failures.push(`${width}px ${route.key}: redesigned H1 missing`);
      if ((state?.overflow || 0) > 5) failures.push(`${width}px ${route.key}: horizontal overflow ${state.overflow}px`);
      if (state?.heroDisplay !== "grid") failures.push(`${width}px ${route.key}: product detail hero is ${state?.heroDisplay || "missing"}, expected grid`);
      if (!state?.media || !state?.summary || !state?.heading || !state?.lede) failures.push(`${width}px ${route.key}: redesigned hero content/media missing`);
      if (!state?.trust) failures.push(`${width}px ${route.key}: compact product trust row missing`);
      if (!state?.nav) failures.push(`${width}px ${route.key}: product section navigation missing`);
      if ((state?.headingSize || 0) < (mobile ? 34 : 40)) failures.push(`${width}px ${route.key}: H1 typography is too small (${state?.headingSize || 0}px)`);
      if ((state?.mediaRadius || 0) < 17) failures.push(`${width}px ${route.key}: media stage radius regressed (${state?.mediaRadius || 0}px)`);
      if ((state?.media?.width || 0) < (mobile ? 330 : 400)) failures.push(`${width}px ${route.key}: hero media collapsed to ${Math.round(state?.media?.width || 0)}px`);
      if (mobile && state?.summary && state?.media && state.summary.top < state.media.bottom - 2) failures.push(`${width}px ${route.key}: product summary overlaps the media stage on mobile`);
      if (!mobile && state?.summary && state?.media && state.summary.left < state.media.right - 2) failures.push(`${width}px ${route.key}: product summary overlaps the media stage on desktop`);
      if (state?.factsDisplay !== "grid" || !state?.factWidths?.length) failures.push(`${width}px ${route.key}: 2x2 product facts grid missing`);
      if (state?.factWidths?.some(value => value < (mobile ? 145 : 150))) failures.push(`${width}px ${route.key}: product fact collapsed (${state.factWidths.join(', ')}px)`);
      if (!state?.sectionWidths?.length || state.sectionWidths.some(value => value < (mobile ? 330 : 900))) failures.push(`${width}px ${route.key}: product section collapsed (${state?.sectionWidths?.join(', ') || 'missing'}px)`);
      if ((state?.sectionHeadingSize || 0) < 24) failures.push(`${width}px ${route.key}: section heading hierarchy too small (${state?.sectionHeadingSize || 0}px)`);
      if (state?.spec && (state?.specLabelSize || 0) < 10) failures.push(`${width}px ${route.key}: spec labels are unreadably small (${state?.specLabelSize || 0}px)`);
      if (state?.compareDisplay && state.compareDisplay !== "grid") failures.push(`${width}px ${route.key}: comparison row is ${state.compareDisplay}, expected grid`);
      if (state?.objectFit && state.objectFit !== "contain") failures.push(`${width}px ${route.key}: product image uses ${state.objectFit}, expected contain`);
      if (state?.image && state?.media && (state.image.width > state.media.width + 2 || state.image.height > state.media.height + 2)) failures.push(`${width}px ${route.key}: hero image exceeds media stage`);
      if (state?.fallback && state?.media && (state.fallback.width > state.media.width + 2 || state.fallback.height > state.media.height + 2)) failures.push(`${width}px ${route.key}: placeholder exceeds media stage`);
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

fs.writeFileSync(path.join(outputDir, "product-entity-layout-report.json"), JSON.stringify({ routes: routes.map(({ key, path, brand, model }) => ({ key, path, brand, model })), results, failures }, null, 2));
if (failures.length) {
  console.error(`Product entity layout QA failed:\n${failures.map(item => `- ${item}`).join("\n")}`);
  process.exit(1);
}
console.log(`Product entity layout QA passed: ${results.length} checks across ${helmetBrandRoutes.length} helmet brands, ${tireBrandRoutes.length} tire brands and ${topBoxBrandRoutes.length} top-box brands.`);
