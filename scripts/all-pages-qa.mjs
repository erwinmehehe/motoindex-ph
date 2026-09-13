import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const widths = (process.env.ALL_PAGES_QA_WIDTHS || "430,1440").split(",").map(Number).filter(Number.isFinite);
const saveAllScreenshots = process.env.ALL_PAGES_QA_SCREENSHOTS !== "0";
const outputDir = path.join(process.cwd(), "artifacts", "all-pages-qa");
fs.mkdirSync(outputDir, { recursive: true });

const routeSources = new Map();
const failures = [];
const warnings = [];
const statusResults = [];
const visualResults = [];
const internalLinks = new Set();

function addRoute(raw, source) {
  if (!raw) return;
  let url;
  try { url = new URL(raw, base); } catch { return; }
  const pathname = url.pathname.replace(/\/{2,}/g, "/");
  if (!pathname.startsWith("/")) return;
  const key = `${pathname}${url.search}`;
  const sources = routeSources.get(key) || new Set();
  sources.add(source);
  routeSources.set(key, sources);
}

function isMetadataOrNonPage(route) {
  const pathname = route.split("?")[0];
  return pathname === "/_not-found" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/go/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/sitemaps/") ||
    pathname === "/llms.txt" ||
    pathname === "/llms-full.txt" ||
    pathname === "/deployment-info.json" ||
    /\.(?:xml|txt|json|ico|png|jpg|jpeg|webp|svg|avif|css|js|map)$/i.test(pathname);
}

function intentionallyHiddenAppRoute(route) {
  const pathname = route.split("?")[0].replace(/\/$/, "") || "/";
  if (pathname === "/price-alerts" || pathname === "/sellers" || pathname === "/used-motorcycles") return true;
  if (pathname.startsWith("/get-quote/")) return true;
  if (/^\/motorcycles\/[^/]+\/[^/]+\/(?:used-value|new-vs-used)$/.test(pathname)) return true;
  if (pathname.startsWith("/sellers/")) return true;
  return false;
}

function loadBuildRoutes() {
  const prerenderFile = path.join(process.cwd(), ".next", "prerender-manifest.json");
  if (fs.existsSync(prerenderFile)) {
    const manifest = JSON.parse(fs.readFileSync(prerenderFile, "utf8"));
    for (const route of Object.keys(manifest.routes || {})) {
      if (!route.includes("[") && !isMetadataOrNonPage(route)) addRoute(route, "prerender");
    }
  } else {
    failures.push("Build route inventory missing .next/prerender-manifest.json");
  }

  const appPathsFile = path.join(process.cwd(), ".next", "server", "app-paths-manifest.json");
  if (fs.existsSync(appPathsFile)) {
    const manifest = JSON.parse(fs.readFileSync(appPathsFile, "utf8"));
    for (const key of Object.keys(manifest)) {
      if (!key.endsWith("/page") || key.includes("[") || key.includes("(")) continue;
      let route = key.slice(0, -5) || "/";
      if (!route.startsWith("/")) route = `/${route}`;
      if (!isMetadataOrNonPage(route) && !intentionallyHiddenAppRoute(route)) addRoute(route, "app-static");
    }
  } else {
    failures.push("Build route inventory missing .next/server/app-paths-manifest.json");
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(url, { ...options, signal: controller.signal }); }
  finally { clearTimeout(timer); }
}

async function discoverSitemapRoutes() {
  const queue = ["/sitemap.xml"];
  const seen = new Set();
  while (queue.length) {
    const current = queue.shift();
    if (!current || seen.has(current)) continue;
    seen.add(current);
    let response;
    try {
      response = await fetchWithTimeout(new URL(current, base), { redirect: "follow" });
    } catch (error) {
      failures.push(`${current}: sitemap discovery failed: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    if (!response.ok) {
      failures.push(`${current}: sitemap discovery returned ${response.status}`);
      continue;
    }
    const body = await response.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
    for (const raw of locs) {
      let target;
      try { target = new URL(raw, base); } catch { failures.push(`${current}: invalid sitemap URL ${raw}`); continue; }
      const localPath = `${target.pathname}${target.search}`;
      if (/\.xml$/i.test(target.pathname)) queue.push(localPath);
      else addRoute(localPath, "sitemap");
    }
  }
}

function findChrome() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  for (const candidate of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const found = spawnSync("which", [candidate], { encoding: "utf8" });
    if (found.status === 0 && found.stdout.trim()) return found.stdout.trim();
  }
  throw new Error("Chrome/Chromium was not found");
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
  throw new Error("Chrome remote debugging endpoint did not become ready");
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
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const pair = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) pair.reject(new Error(message.error.message));
    else pair.resolve(message.result);
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
  const deadline = Date.now() + 12_000;
  while (Date.now() < deadline) {
    try {
      const result = await send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
      if (result.result?.value === "complete") return true;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
}

async function evaluate(send, expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return result.result?.value;
}

const auditExpression = `(() => {
  const root = document.documentElement;
  const visible = (el) => {
    const style = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > .03 && r.width > 2 && r.height > 2;
  };
  const parseRgb = (value) => {
    const raw = String(value || '').trim();
    const nums = raw.match(/[\\d.]+/g)?.map(Number) || [];
    if (nums.length < 3) return null;
    if (raw.startsWith('color(srgb ')) {
      return { r: nums[0] * 255, g: nums[1] * 255, b: nums[2] * 255, a: nums.length > 3 ? nums[3] : 1 };
    }
    if (/^rgba?\\(/i.test(raw)) {
      const percent = raw.includes('%');
      return { r: percent ? nums[0] * 2.55 : nums[0], g: percent ? nums[1] * 2.55 : nums[1], b: percent ? nums[2] * 2.55 : nums[2], a: nums.length > 3 ? nums[3] : 1 };
    }
    return null;
  };
  const luminance = ({r,g,b}) => {
    const convert = (v) => { const x=v/255; return x <= .03928 ? x/12.92 : Math.pow((x+.055)/1.055,2.4); };
    return .2126*convert(r)+.7152*convert(g)+.0722*convert(b);
  };
  const contrast = (a,b) => { const x=luminance(a), y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
  const effectiveBg = (el) => {
    let node=el;
    while(node && node !== document.documentElement){
      const s=getComputedStyle(node);
      if(s.backgroundImage && s.backgroundImage !== 'none') return null;
      const bg=parseRgb(s.backgroundColor);
      if(bg && bg.a >= .96) return bg;
      node=node.parentElement;
    }
    return parseRgb(getComputedStyle(document.body).backgroundColor) || {r:255,g:255,b:255,a:1};
  };
  const h1s=[...document.querySelectorAll('h1')].filter(visible);
  const headings=[...document.querySelectorAll('h1,h2,h3')].filter(visible);
  const brokenImages=[...document.images].filter(img=>visible(img)&&img.complete&&img.currentSrc&&img.naturalWidth===0).map(img=>img.currentSrc).slice(0,12);
  const pathologicalHeadings=headings.map(el=>{const r=el.getBoundingClientRect(), s=getComputedStyle(el), text=(el.textContent||'').trim();return {text:text.slice(0,90),w:Math.round(r.width),h:Math.round(r.height),font:parseFloat(s.fontSize||'0')}}).filter(x=>x.text.length>=7&&x.font>=24&&x.w<95&&x.h>x.font*2.8).slice(0,10);
  const clippedHeadings=headings.map(el=>{const s=getComputedStyle(el);return {text:(el.textContent||'').trim().slice(0,90),client:el.clientWidth,scroll:el.scrollWidth,overflow:s.overflowX,nowrap:s.whiteSpace==='nowrap'}}).filter(x=>x.scroll>x.client+8&&['hidden','clip'].includes(x.overflow)&&!x.nowrap).slice(0,10);
  const lowContrast=[...document.querySelectorAll('h1,h2,h3,p,a,button,strong')].filter(visible).map(el=>{const s=getComputedStyle(el), fg=parseRgb(s.color), bg=effectiveBg(el);if(!fg||!bg||fg.a<.9)return null;return {text:(el.textContent||'').trim().replace(/\\s+/g,' ').slice(0,80),ratio:contrast(fg,bg),font:parseFloat(s.fontSize||'0')};}).filter(Boolean).filter(x=>x.text.length>2&&x.ratio<1.35).slice(0,12);
  const emptySections=[...document.querySelectorAll('main > section, main > div > section')].filter(visible).map(el=>{const r=el.getBoundingClientRect();return {cls:String(el.className||'').slice(0,100),h:Math.round(r.height),text:(el.innerText||'').trim().length,media:el.querySelectorAll('img,video,canvas,svg,form').length};}).filter(x=>x.h>650&&x.text<45&&x.media===0).slice(0,10);
  const cardWalls=[...document.querySelectorAll('main [class*="grid"],main [class*="list"],main [class*="rail"]')].filter(visible).map(el=>({cls:String(el.className||'').slice(0,110),count:el.querySelectorAll(':scope > article,:scope > .model-card,:scope > .product-card,:scope > a[class*="card"]').length})).filter(x=>x.count>30).slice(0,10);
  const tinyTargets=[...document.querySelectorAll('button,a,input,select')].filter(visible).filter(el=>!el.closest('.breadcrumbs')).map(el=>{const hit=(el.matches('input,select')&&el.closest('label'))||el;const r=hit.getBoundingClientRect();return {text:(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,50),w:Math.round(r.width),h:Math.round(r.height)}}).filter(x=>(x.w>0&&x.h>0)&&(x.w<18&&x.h<18)).slice(0,12);
  const firstHero=document.querySelector('main > .hero,main > .model-hero,main .page-head,main .product-hero');
  const heroHeight=firstHero&&visible(firstHero)?Math.round(firstHero.getBoundingClientRect().height):0;
  const bodyText=(document.querySelector('main')?.innerText||'').trim();
  const errorText=/Error 1102|Worker exceeded resource limits|Internal Server Error|Application error|This page could not be found|Server Error/i.test(document.body.innerText||'');
  const links=[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(Boolean).filter(h=>h.startsWith('/')).slice(0,1000);
  return {
    title:document.title,
    bodyOverflow:Math.max(0,root.scrollWidth-root.clientWidth),
    h1Count:h1s.length,
    h1:h1s.map(h=>(h.textContent||'').trim().slice(0,120)),
    brokenImages,pathologicalHeadings,clippedHeadings,lowContrast,emptySections,cardWalls,tinyTargets,heroHeight,
    mainTextLength:bodyText.length,
    docHeight:Math.round(root.scrollHeight),
    errorText,links
  };
})()`;

function routeFileName(route) {
  const clean = route.split("?")[0].replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 90) || "home";
  const hash = crypto.createHash("sha1").update(route).digest("hex").slice(0, 8);
  return `${clean}-${hash}`;
}

async function preflightRoutes() {
  const routes = [...routeSources.keys()].sort();
  const htmlRoutes = [];
  for (const route of routes) {
    const sources = [...routeSources.get(route)];
    if (isMetadataOrNonPage(route)) continue;
    if (intentionallyHiddenAppRoute(route) && !sources.includes("sitemap")) continue;
    const started = Date.now();
    try {
      const response = await fetchWithTimeout(new URL(route, base), { redirect: "manual", headers: { accept: "text/html" } });
      const elapsed = Date.now() - started;
      const contentType = response.headers.get("content-type") || "";
      statusResults.push({ route, sources, status: response.status, elapsed, contentType });
      if (response.status >= 500) failures.push(`${route}: returned ${response.status} during all-pages preflight`);
      if (sources.includes("sitemap") && response.status !== 200) failures.push(`${route}: sitemap URL must return 200, got ${response.status}`);
      if (sources.includes("prerender") && response.status === 404) failures.push(`${route}: prerendered page returned 404`);
      if (response.status === 200 && contentType.includes("text/html")) htmlRoutes.push(route);
    } catch (error) {
      failures.push(`${route}: preflight request failed: ${error instanceof Error ? error.message : String(error)}`);
      statusResults.push({ route, sources, status: 0, elapsed: Date.now() - started, error: String(error) });
    }
  }
  return htmlRoutes;
}

async function runBrowserAudit(routes) {
  const chrome = findChrome();
  const port = 9333;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-all-pages-"));
  const proc = spawn(chrome, ["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,"about:blank"], { stdio: "ignore" });
  try {
    await waitForDebugPort(port);
    const tab = await createTab(port);
    const cdp = connectCdp(tab.webSocketDebuggerUrl);
    await cdp.ready;
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");

    for (const width of widths) {
      const height = width <= 430 ? 844 : 900;
      await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 768 });
      const widthDir = path.join(outputDir, String(width));
      fs.mkdirSync(widthDir, { recursive: true });
      for (let index = 0; index < routes.length; index++) {
        const route = routes[index];
        const url = new URL(route, base).toString();
        let audit;
        try {
          await cdp.send("Page.navigate", { url });
          const complete = await readyState(cdp.send);
          if (!complete) warnings.push(`${width}px ${route}: document.readyState did not reach complete within 12s`);
          await new Promise((resolve) => setTimeout(resolve, 90));
          await evaluate(cdp.send, `(async()=>{const max=Math.max(document.documentElement.scrollHeight-innerHeight,0);for(const ratio of [.25,.5,.75,1]){scrollTo(0,max*ratio);await new Promise(r=>setTimeout(r,25));}scrollTo(0,0);return true})()`);
          await new Promise((resolve) => setTimeout(resolve, 40));
          audit = await evaluate(cdp.send, auditExpression);
        } catch (error) {
          failures.push(`${width}px ${route}: browser audit failed: ${error instanceof Error ? error.message : String(error)}`);
          continue;
        }

        const row = { width, route, ...audit };
        visualResults.push(row);
        for (const href of audit.links || []) internalLinks.add(href);
        const routeFailures = [];
        if ((audit.bodyOverflow || 0) > 5) routeFailures.push(`document overflows horizontally by ${audit.bodyOverflow}px`);
        if (audit.errorText) routeFailures.push("visible server/error page text detected");
        if ((audit.h1Count || 0) !== 1) routeFailures.push(`expected exactly one visible H1, found ${audit.h1Count}`);
        if ((audit.mainTextLength || 0) < 20) routeFailures.push(`main content is suspiciously empty (${audit.mainTextLength || 0} characters)`);
        if (audit.brokenImages?.length) routeFailures.push(`visible broken image: ${audit.brokenImages[0]}`);
        if (audit.pathologicalHeadings?.length) routeFailures.push(`pathologically collapsed heading: ${JSON.stringify(audit.pathologicalHeadings[0])}`);
        if (audit.clippedHeadings?.length) routeFailures.push(`heading text is clipped: ${JSON.stringify(audit.clippedHeadings[0])}`);
        if (audit.lowContrast?.length) routeFailures.push(`near-invisible text contrast: ${JSON.stringify(audit.lowContrast[0])}`);
        if (audit.emptySections?.length) routeFailures.push(`giant empty section: ${JSON.stringify(audit.emptySections[0])}`);
        if (audit.cardWalls?.length) warnings.push(`${width}px ${route}: high repeated-card density: ${JSON.stringify(audit.cardWalls[0])}`);
        if (audit.tinyTargets?.length) routeFailures.push(`extremely small interactive target: ${JSON.stringify(audit.tinyTargets[0])}`);
        if (width >= 1024 && (audit.heroHeight || 0) > height * 1.18) routeFailures.push(`first hero/section is too tall (${audit.heroHeight}px in ${height}px viewport)`);
        if ((audit.docHeight || 0) > 30000) warnings.push(`${width}px ${route}: unusually long page (${audit.docHeight}px)`);

        for (const item of routeFailures) failures.push(`${width}px ${route}: ${item}`);

        const filename = path.join(widthDir, `${String(index + 1).padStart(4, "0")}-${routeFileName(route)}.jpg`);
        if (saveAllScreenshots || routeFailures.length) {
          const screenshot = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 48, fromSurface: true, captureBeyondViewport: false });
          fs.writeFileSync(filename, Buffer.from(screenshot.data, "base64"));
        }
        if (routeFailures.length) {
          try {
            const metrics = await cdp.send("Page.getLayoutMetrics");
            const size = metrics.cssContentSize || metrics.contentSize;
            const fullHeight = Math.min(Math.max(Math.ceil(size.height || height), height), 12000);
            const full = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 55, fromSurface: true, captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: fullHeight, scale: 1 } });
            fs.writeFileSync(path.join(widthDir, `${String(index + 1).padStart(4, "0")}-${routeFileName(route)}-FAIL-FULL.jpg`), Buffer.from(full.data, "base64"));
          } catch {}
        }
      }
    }
    await cdp.send("Browser.close").catch(() => {});
  } finally {
    proc.kill("SIGKILL");
    await new Promise((resolve) => setTimeout(resolve, 200));
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); } catch {}
  }
}

async function auditInternalLinks() {
  const links = [...internalLinks].filter((href) => !href.startsWith("//") && !href.startsWith("/#") && !href.startsWith("/go/") && !href.startsWith("/api/")).map((href) => href.split("#")[0]).filter(Boolean);
  const unique = [...new Set(links)];
  for (const href of unique) {
    try {
      const response = await fetchWithTimeout(new URL(href, base), { redirect: "manual" }, 6000);
      if (response.status >= 500 || response.status === 404) failures.push(`Internal link ${href} returns ${response.status}`);
    } catch (error) {
      failures.push(`Internal link ${href} failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

loadBuildRoutes();
await discoverSitemapRoutes();
const htmlRoutes = await preflightRoutes();
if (!htmlRoutes.length) failures.push("No public HTML routes were discovered for all-pages QA");
else await runBrowserAudit(htmlRoutes);
await auditInternalLinks();

const routeInventory = [...routeSources.entries()].map(([route, sources]) => ({ route, sources: [...sources] })).sort((a,b)=>a.route.localeCompare(b.route));
const report = { base: base.origin, widths, discoveredRoutes: routeInventory.length, htmlRoutes: htmlRoutes.length, routeInventory, statusResults, visualResults, failures, warnings };
fs.writeFileSync(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
const md = [
  "# MotoIndex all-pages QA",
  "",
  `Base: ${base.origin}`,
  `Concrete routes discovered: ${routeInventory.length}`,
  `Public HTML routes rendered: ${htmlRoutes.length}`,
  `Viewport widths rendered for every HTML route: ${widths.join(", ")}`,
  `Total browser renders: ${visualResults.length}`,
  `Failures: ${failures.length}`,
  `Warnings: ${warnings.length}`,
  "",
  "## Failures",
  ...(failures.length ? failures.map((item)=>`- ${item}`) : ["- None"]),
  "",
  "## Warnings",
  ...(warnings.length ? warnings.slice(0,200).map((item)=>`- ${item}`) : ["- None"]),
  "",
  "Every discovered public HTML page is browser-rendered at both a 430px mobile viewport and a 1440px desktop viewport. JPEG evidence is retained for every render; failures also receive a full-page screenshot."
];
fs.writeFileSync(path.join(outputDir, "report.md"), `${md.join("\n")}\n`);
console.log(`All-pages QA: ${routeInventory.length} routes discovered, ${htmlRoutes.length} HTML pages, ${visualResults.length} browser renders, ${failures.length} failures, ${warnings.length} warnings.`);
if (failures.length) {
  console.error(`All-pages QA failed:\n- ${failures.slice(0,120).join("\n- ")}${failures.length > 120 ? `\n... ${failures.length - 120} more failures in artifacts/all-pages-qa/report.json` : ""}`);
  process.exit(1);
}
