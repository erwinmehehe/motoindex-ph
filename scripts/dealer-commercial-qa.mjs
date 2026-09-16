import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const widths = [390, 1440];
const cityRoutes = [
  { slug: "angeles-city", name: "Angeles City" },
  { slug: "cebu-city", name: "Cebu City" },
  { slug: "davao-city", name: "Davao City" },
  { slug: "manila", name: "Manila" },
  { slug: "san-fernando", name: "San Fernando" },
];
const outputDir = path.join(process.cwd(), "artifacts", "visual-qa");
fs.mkdirSync(outputDir, { recursive: true });

function chromePath() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  for (const candidate of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const result = spawnSync("which", [candidate], { encoding: "utf8" });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
  }
  throw new Error("Chrome/Chromium was not found.");
}

async function waitPort(port) {
  const end = Date.now() + 20_000;
  while (Date.now() < end) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error("Chrome remote debugging endpoint did not become ready.");
}

async function tab(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
  return response.json();
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

async function ready(send) {
  const end = Date.now() + 15_000;
  while (Date.now() < end) {
    if (await evalJs(send, "document.readyState").catch(() => "") === "complete") return;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

const port = 9231;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-dealer-commercial-"));
const proc = spawn(chromePath(), [
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
  await waitPort(port);
  const browserTab = await tab(port);
  const client = cdp(browserTab.webSocketDebuggerUrl);
  await client.ready;
  await client.send("Page.enable");
  await client.send("Runtime.enable");

  async function viewport(width) {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width <= 430 ? 844 : 900,
      deviceScaleFactor: 1,
      mobile: width <= 768,
    });
  }

  async function nav(pathname) {
    await client.send("Page.navigate", { url: new URL(pathname, base).toString() });
    await ready(client.send);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async function shot(name, width) {
    const image = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    fs.writeFileSync(path.join(outputDir, `dealer-commercial-${width}-${name}.png`), Buffer.from(image.data, "base64"));
  }

  for (const width of widths) {
    await viewport(width);

    for (const cityRoute of cityRoutes) {
      await nav(`/dealers/${cityRoute.slug}`);
      const city = await evalJs(client.send, `(() => {
        const root = document.documentElement;
        const callouts = [...document.querySelectorAll('.dealer-listing-callout')];
        return {
          overflow: root.scrollWidth - root.clientWidth,
          title: document.querySelector('h1')?.textContent?.trim() || '',
          callouts: callouts.length,
          firstWidth: callouts[0]?.getBoundingClientRect().width || 0,
          free: [...document.querySelectorAll('a')].some(a => /listed free|dealership free/i.test(a.textContent || '')),
          featured: [...document.querySelectorAll('a')].some(a => /featured/i.test(a.textContent || '')),
          cards: document.querySelectorAll('.dealer-result-card').length,
          paidSections: document.querySelectorAll('.dealer-featured-section').length,
        };
      })()`);
      results.push({ width, page: `dealer-city-${cityRoute.slug}`, ...city });
      if ((city?.overflow || 0) > 5) failures.push(`${width}px ${cityRoute.slug} dealer city overflow`);
      if (!city?.title.includes(cityRoute.name)) failures.push(`${width}px ${cityRoute.slug} city heading is wrong`);
      if ((city?.callouts || 0) < 2) failures.push(`${width}px ${cityRoute.slug} dealer callouts missing`);
      if ((city?.firstWidth || 0) < (width <= 430 ? 330 : 900)) failures.push(`${width}px ${cityRoute.slug} dealer callout too narrow`);
      if (!city?.free || !city?.featured) failures.push(`${width}px ${cityRoute.slug} dealer CTAs incomplete`);
      if ((city?.cards || 0) < 3) failures.push(`${width}px ${cityRoute.slug} dealer cards missing`);
      if ((city?.paidSections || 0) !== 0) failures.push(`${width}px ${cityRoute.slug} unconfigured paid placement rendered`);
      await shot(cityRoute.slug, width);
    }

    await nav("/dealers");
    const directory = await evalJs(client.send, `(() => {
      const root = document.documentElement;
      return {
        overflow: root.scrollWidth - root.clientWidth,
        cityLinks: document.querySelectorAll('.dealer-city-links a[href^="/dealers/"]').length,
        free: [...document.querySelectorAll('a')].some(a => /listed free/i.test(a.textContent || '')),
        featured: [...document.querySelectorAll('a')].some(a => /featured/i.test(a.textContent || '')),
        dealerCards: document.querySelectorAll('.dealer-result-card').length,
      };
    })()`);
    results.push({ width, page: "dealer-directory", ...directory });
    if ((directory?.overflow || 0) > 5) failures.push(`${width}px main dealer directory overflow`);
    if ((directory?.cityLinks || 0) < 5) failures.push(`${width}px main dealer directory city links incomplete`);
    if (!directory?.free || !directory?.featured) failures.push(`${width}px main dealer directory commercial CTAs missing`);
    if ((directory?.dealerCards || 0) < 3) failures.push(`${width}px main dealer directory cards missing`);
    await shot("directory", width);

    await nav("/dealers/pampanga");
    const pampanga = await evalJs(client.send, `(() => {
      const root = document.documentElement;
      return {
        overflow: root.scrollWidth - root.clientWidth,
        callouts: document.querySelectorAll('.dealer-listing-callout').length,
        free: [...document.querySelectorAll('a')].some(a => /listed free|dealership free/i.test(a.textContent || '')),
        featured: [...document.querySelectorAll('a')].some(a => /featured/i.test(a.textContent || '')),
        cards: document.querySelectorAll('.dealer-result-card').length,
      };
    })()`);
    results.push({ width, page: "dealer-pampanga", ...pampanga });
    if ((pampanga?.overflow || 0) > 5) failures.push(`${width}px Pampanga dealer guide overflow`);
    if ((pampanga?.callouts || 0) < 2) failures.push(`${width}px Pampanga dealer callouts missing`);
    if (!pampanga?.free || !pampanga?.featured) failures.push(`${width}px Pampanga commercial CTAs missing`);
    if ((pampanga?.cards || 0) < 5) failures.push(`${width}px Pampanga dealer cards missing`);
    await shot("pampanga", width);

    await nav("/dealers/join?city=Cebu%20City&province=Cebu&plan=featured-city&source=%2Fdealers%2Fcebu-city#featured-options");
    const join = await evalJs(client.send, `(() => {
      const root = document.documentElement;
      const selected = document.querySelector('input[name="listingPlan"]:checked');
      return {
        overflow: root.scrollWidth - root.clientWidth,
        grid: getComputedStyle(document.querySelector('.dealer-pricing-grid')).display,
        cards: document.querySelectorAll('.dealer-plan-card').length,
        choices: document.querySelectorAll('input[name="listingPlan"]').length,
        selected: selected?.value || '',
        freeText: document.body.innerText.includes('Free Verified Listing'),
        verifyText: document.body.innerText.includes('Verification is never for sale'),
      };
    })()`);
    results.push({ width, page: "dealer-join", ...join });
    if ((join?.overflow || 0) > 5) failures.push(`${width}px dealer join overflow`);
    if (join?.grid !== "grid") failures.push(`${width}px pricing grid collapsed`);
    if (join?.cards !== 4 || join?.choices !== 4) failures.push(`${width}px dealer plans incomplete`);
    if (join?.selected !== "featured-city") failures.push(`${width}px plan preselection failed`);
    if (!join?.freeText || !join?.verifyText) failures.push(`${width}px trust copy missing`);
    await shot("join", width);
  }
} finally {
  if (proc.exitCode === null) {
    proc.kill("SIGTERM");
    await Promise.race([
      new Promise(resolve => proc.once("exit", resolve)),
      new Promise(resolve => setTimeout(resolve, 1500)),
    ]);
  }
  try {
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  } catch (error) {
    if (error?.code !== "ENOTEMPTY") throw error;
  }
}

fs.writeFileSync(path.join(outputDir, "dealer-commercial-report.json"), JSON.stringify({ results, failures }, null, 2));
if (failures.length) {
  console.error(`Dealer commercial QA failed:\n${failures.map(item => `- ${item}`).join("\n")}`);
  process.exit(1);
}
console.log(`Dealer commercial QA passed: ${results.length} route/viewport checks across every published dealer city, the main directory, Pampanga guide and join page.`);
