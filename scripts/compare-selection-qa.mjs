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

async function waitForComplete(send) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (await evaluate(send, "document.readyState").catch(() => "") === "complete") return;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error("Page did not finish loading.");
}

async function waitForPath(send, pathname) {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    const current = await evaluate(send, "location.pathname").catch(() => "");
    if (current === pathname) {
      await waitForComplete(send);
      await new Promise(resolve => setTimeout(resolve, 350));
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 120));
  }
  return false;
}

const chrome = findChrome();
const port = 9444;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-compare-selection-"));
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
    await waitForComplete(cdp.send);
    await new Promise(resolve => setTimeout(resolve, 350));
  }

  async function screenshot(name, width) {
    const image = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
    fs.writeFileSync(path.join(outputDir, `compare-selection-${width}-${name}.png`), Buffer.from(image.data, "base64"));
  }

  async function auditSelection(width, source) {
    const audit = await evaluate(cdp.send, `(() => {
      const root=document.documentElement;
      const h1=document.querySelector('h1');
      const h1Rect=h1?.getBoundingClientRect();
      const robots=document.querySelector('meta[name="robots"]')?.getAttribute('content')||'';
      const canonical=document.querySelector('link[rel="canonical"]')?.getAttribute('href')||'';
      return {
        url:location.pathname+location.search,
        overflow:root.scrollWidth-root.clientWidth,
        h1Right:h1Rect?.right||0,
        viewport:innerWidth,
        robots,
        canonical,
        summary:Boolean(document.querySelector('[aria-label="2 motorcycles selected"]')),
        modelColumns:document.querySelectorAll('.detailed-compare-table thead th').length-1,
        table:Boolean(document.querySelector('.detailed-compare-table')),
        tray:Boolean(document.querySelector('.compare-tray'))
      };
    })()`);
    results.push({ width, source, ...audit });
    if (!audit?.url?.startsWith('/compare/selection?bikes=')) failures.push(`${width}px ${source}: did not land on /compare/selection with bikes query`);
    if (!String(audit?.robots||'').toLowerCase().includes('noindex')) failures.push(`${width}px ${source}: selection page is missing noindex robots metadata`);
    if (!String(audit?.canonical||'').endsWith('/compare/selection')) failures.push(`${width}px ${source}: selection page canonical is not /compare/selection`);
    if (!audit?.summary || audit?.modelColumns !== 2 || !audit?.table) failures.push(`${width}px ${source}: two-bike comparison content did not render`);
    if (audit?.tray) failures.push(`${width}px ${source}: floating Compare Tray is still visible on a comparison result route`);
    if ((audit?.overflow||0) > 5) failures.push(`${width}px ${source}: selection page overflows horizontally by ${audit.overflow}px`);
    if ((audit?.h1Right||0) > (audit?.viewport||width) + 5) failures.push(`${width}px ${source}: selection heading leaves the viewport`);
    await screenshot(source, width);
  }

  for (const width of widths) {
    await setViewport(width);

    try {
      await navigate('/compare');
      const first = await evaluate(cdp.send, `(() => {
        const selects=[...document.querySelectorAll('.compare-builder select')];
        const value=[...selects[0].options].find(option=>option.value&&!option.disabled)?.value||'';
        if(value){selects[0].value=value;selects[0].dispatchEvent(new Event('change',{bubbles:true}));}
        return value;
      })()`);
      await new Promise(resolve => setTimeout(resolve, 180));
      const second = await evaluate(cdp.send, `(() => {
        const selects=[...document.querySelectorAll('.compare-builder select')];
        const value=[...selects[1].options].find(option=>option.value&&!option.disabled&&option.value!==${JSON.stringify(first)})?.value||'';
        if(value){selects[1].value=value;selects[1].dispatchEvent(new Event('change',{bubbles:true}));}
        return value;
      })()`);
      await new Promise(resolve => setTimeout(resolve, 220));
      const clicked = await evaluate(cdp.send, `(() => {
        const button=[...document.querySelectorAll('.compare-actions button')].find(el=>(el.textContent||'').includes('Compare two'));
        const ready=Boolean(button&&!button.disabled&&${JSON.stringify(first)}&&${JSON.stringify(second)});
        if(ready) button.click();
        return ready;
      })()`);
      const arrived = clicked && await waitForPath(cdp.send, '/compare/selection');
      if (!arrived) failures.push(`${width}px builder: Compare two did not navigate to /compare/selection`);
      else await auditSelection(width, 'builder');
    } catch (error) {
      failures.push(`${width}px builder: ${error instanceof Error ? error.message : String(error)}`);
    }

    try {
      await navigate('/motorcycles');
      await evaluate(cdp.send, `(() => { localStorage.removeItem('motoindex-compare-v1'); window.dispatchEvent(new CustomEvent('motoindex-compare')); return true; })()`);
      await new Promise(resolve => setTimeout(resolve, 180));
      const clicked = await evaluate(cdp.send, `(() => {
        const buttons=[...document.querySelectorAll('.model-card .compare-button')].filter(button=>!button.disabled).slice(0,2);
        buttons.forEach(button=>button.click());
        return buttons.length;
      })()`);
      await new Promise(resolve => setTimeout(resolve, 300));
      const tray = await evaluate(cdp.send, `(() => ({
        clicked:${clicked},
        stored:JSON.parse(localStorage.getItem('motoindex-compare-v1')||'[]').length,
        exists:Boolean(document.querySelector('.compare-tray')),
        href:document.querySelector('.compare-tray-actions a')?.getAttribute('href')||''
      }))()`);
      results.push({ width, source: 'tray', ...tray });
      const hasLink = tray?.clicked >= 2 && tray?.stored >= 2 && tray?.exists && String(tray?.href||'').startsWith('/compare/selection?bikes=');
      if (!hasLink) failures.push(`${width}px tray: two selected motorcycles did not produce the selection link`);

      if (width <= 430 && tray?.exists) {
        await evaluate(cdp.send, `document.querySelector('.compare-tray-mobile-toggle')?.click()`);
        await new Promise(resolve => setTimeout(resolve, 160));
        const expanded = await evaluate(cdp.send, `document.querySelector('.compare-tray-mobile-toggle')?.getAttribute('aria-expanded')`);
        if (expanded !== 'true') failures.push(`${width}px tray: mobile Compare Tray did not expand`);
      }

      if (hasLink) {
        await evaluate(cdp.send, `document.querySelector('.compare-tray-actions a')?.click()`);
        const arrived = await waitForPath(cdp.send, '/compare/selection');
        if (!arrived) failures.push(`${width}px tray: Compare link did not navigate to /compare/selection`);
        else await auditSelection(width, 'tray');
      }
    } catch (error) {
      failures.push(`${width}px tray: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  try {
    await setViewport(1440);
    await navigate('/compare/aerox-vs-nmax');
    const curated = await evaluate(cdp.send, `(() => ({
      path:location.pathname,
      h1:(document.querySelector('h1')?.textContent||'').trim(),
      canonical:document.querySelector('link[rel="canonical"]')?.getAttribute('href')||'',
      table:Boolean(document.querySelector('.detailed-compare-table'))
    }))()`);
    results.push({ width: 1440, source: 'curated', ...curated });
    if (curated?.path !== '/compare/aerox-vs-nmax' || !curated?.h1 || !curated?.table || !String(curated?.canonical||'').endsWith('/compare/aerox-vs-nmax')) failures.push('Curated comparison URL /compare/aerox-vs-nmax no longer renders in place.');
  } catch (error) {
    failures.push(`Curated comparison: ${error instanceof Error ? error.message : String(error)}`);
  }

  fs.writeFileSync(path.join(outputDir, 'compare-selection-report.json'), JSON.stringify({ results, failures }, null, 2));
  if (failures.length) {
    console.error(`Compare selection QA failed:\n${failures.map(item=>`- ${item}`).join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log(`Compare selection QA passed: ${results.length} checks across mobile, desktop, builder, tray and curated comparison flow.`);
  }
  await cdp.send('Browser.close').catch(() => {});
} finally {
  if (proc.exitCode === null) {
    proc.kill('SIGTERM');
    await Promise.race([
      new Promise(resolve => proc.once('exit', resolve)),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);
  }
  try {
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  } catch {}
}
