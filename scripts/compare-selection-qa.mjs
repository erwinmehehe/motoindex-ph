import fs from "node:fs";
import os from "node:os";
import path from "node:path";
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
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
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

async function evaluate(send, expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Browser evaluation failed");
  return result.result?.value;
}

async function waitForComplete(send) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const state = await evaluate(send, "document.readyState").catch(() => "loading");
    if (state === "complete") return;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
}

async function navigate(send, pathname) {
  await send("Page.navigate", { url: new URL(pathname, base).toString() });
  await waitForComplete(send);
  await new Promise(resolve => setTimeout(resolve, 450));
}

async function waitForPath(send, expectedPath) {
  const deadline = Date.now() + 6_000;
  while (Date.now() < deadline) {
    const pathname = await evaluate(send, "location.pathname").catch(() => "");
    if (pathname === expectedPath) {
      await new Promise(resolve => setTimeout(resolve, 450));
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 120));
  }
  const current = await evaluate(send, "location.pathname + location.search").catch(() => "unknown");
  throw new Error(`Timed out waiting for ${expectedPath}; browser remained at ${current}`);
}

async function chooseOption(send, selectIndex, excluded = []) {
  const value = await evaluate(send, `(() => {
    const select = document.querySelectorAll('.compare-builder select')[${selectIndex}];
    if (!select) return '';
    const excluded = ${JSON.stringify(excluded)};
    const option = [...select.options].find(item => item.value && !item.disabled && !excluded.includes(item.value));
    if (!option) return '';
    select.value = option.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return option.value;
  })()`);
  if (!value) throw new Error(`Could not select motorcycle ${selectIndex + 1}`);
  await new Promise(resolve => setTimeout(resolve, 220));
  return value;
}

async function openComparison(send, count) {
  await navigate(send, "/compare");
  const first = await chooseOption(send, 0);
  const second = await chooseOption(send, 1, [first]);
  const selected = [first, second];
  if (count === 3) selected.push(await chooseOption(send, 2, selected));

  const clickResult = await evaluate(send, `(() => {
    const buttons = [...document.querySelectorAll('.compare-actions button')];
    const target = buttons.find(button => /Compare ${count === 3 ? "three" : "two"}/i.test(button.textContent || ''));
    if (!target) return { found: false, disabled: null };
    const disabled = target.disabled;
    if (!disabled) target.click();
    return { found: true, disabled };
  })()`);
  if (!clickResult?.found) throw new Error(`Compare ${count} action was not found.`);
  if (clickResult.disabled) throw new Error(`Compare ${count} action stayed disabled after valid selections.`);

  await waitForPath(send, "/compare/selection");
  const state = await evaluate(send, `(() => ({
    path: location.pathname,
    search: location.search,
    summary: Boolean(document.querySelector('.selected-compare-summary')),
    detailed: Boolean(document.querySelector('.detailed-compare')),
    highlights: Boolean(document.querySelector('.comparison-highlights')),
    cards: document.querySelectorAll('.compare-product-card').length,
    trayVisible: Boolean(document.querySelector('.compare-tray')),
    title: document.querySelector('.selected-compare-head h1')?.textContent?.trim() || ''
  }))()`);

  if (state.path !== "/compare/selection") throw new Error(`Compare ${count} opened ${state.path} instead of /compare/selection.`);
  if (!state.search.includes("bikes=") || !state.summary || !state.detailed || !state.highlights) throw new Error(`Compare ${count} result workspace did not render completely: ${JSON.stringify(state)}`);
  if (state.cards !== count) throw new Error(`Compare ${count} rendered ${state.cards} motorcycle cards instead of ${count}.`);
  if (state.trayVisible) throw new Error(`Compare tray remained visible on the ${count}-bike result page.`);
  return { selected, state };
}

const chrome = findChrome();
const port = 9333;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-compare-qa-"));
const proc = spawn(chrome, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  "--disable-dev-shm-usage",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

try {
  await waitForDebugPort(port);
  const tab = await createTab(port);
  const cdp = connectCdp(tab.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  const two = await openComparison(cdp.send, 2);
  const three = await openComparison(cdp.send, 3);
  console.log(`Compare selection QA passed: 2-bike ${two.selected.join(", ")} and 3-bike ${three.selected.join(", ")} both rendered the custom comparison workspace.`);
  await cdp.send("Browser.close").catch(() => {});
} finally {
  proc.kill("SIGKILL");
  await new Promise(resolve => setTimeout(resolve, 200));
  try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch {}
}
