import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const baseUrl = process.env.MOTOINDEX_BASE_URL || "http://127.0.0.1:3000";
const chrome = [
  process.env.CHROME_BIN,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((candidate) => candidate && fs.existsSync(candidate));
if (!chrome) throw new Error("Chrome was not found for motorcycle hero validation.");

const port = 9467;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-hero-"));
const browser = spawn(chrome, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function debugJson(endpoint, options) {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}${endpoint}`, options);
      if (response.ok) return response.json();
    } catch {}
    await wait(100);
  }
  throw new Error("Chrome debugging endpoint did not become ready.");
}

try {
  await debugJson("/json/version");
  const tab = await debugJson("/json/new?about:blank", { method: "PUT" });
  const socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(String(data));
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1024, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: `${baseUrl}/motorcycles/yamaha/aerox-v3` });
  for (let attempt = 0; attempt < 80; attempt++) {
    const state = await send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
    if (state.result?.value === "complete") break;
    await wait(100);
  }

  const response = await send("Runtime.evaluate", {
    expression: `(() => {
      const root=document.documentElement;
      const grid=document.querySelector('.motorcycle-hero-grid');
      const title=document.querySelector('.motorcycle-hero-copy h1');
      const separator=document.querySelector('[data-price-separator]');
      const priceParts=[...document.querySelectorAll('[data-price-boundary], [data-price-separator]')];
      return {
        overflow:root.scrollWidth-root.clientWidth,
        gridColumns:grid?getComputedStyle(grid).gridTemplateColumns:'',
        titleSize:title?parseFloat(getComputedStyle(title).fontSize):0,
        separatorVisible:Boolean(separator&&separator.getBoundingClientRect().width>0),
        separatorAccessible:Boolean(separator&&!separator.hasAttribute('aria-hidden')&&separator.textContent.trim()),
        priceRangeInline:priceParts.length===3&&Math.max(...priceParts.map(part=>part.getBoundingClientRect().top))-Math.min(...priceParts.map(part=>part.getBoundingClientRect().top))<2
      };
    })()`,
    returnByValue: true,
  });
  const result = response.result?.value;
  const failures = [];
  if ((result?.overflow || 0) > 1) failures.push(`page overflows horizontally by ${result.overflow}px`);
  if (!result?.gridColumns) failures.push("hero grid is missing at 1024px");
  if ((result?.titleSize || 0) > 52) failures.push(`hero title is still oversized at 1024px (${result?.titleSize}px)`);
  if (!result?.separatorVisible) failures.push("price range lacks a visible structured separator");
  if (!result?.separatorAccessible) failures.push("price range separator is hidden from assistive technology");
  if (!result?.priceRangeInline) failures.push("price range endpoints and separator do not stay on one line");
  if (failures.length) throw new Error(`Motorcycle hero validation failed:\n- ${failures.join("\n- ")}`);

  await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 800, deviceScaleFactor: 1, mobile: true });
  const mobileResponse = await send("Runtime.evaluate", {
    expression: `(() => {
      const grid=document.querySelector('.motorcycle-analytics-grid');
      const values=[...document.querySelectorAll('.motorcycle-analytics-metric>strong')];
      return {
        columns:grid?getComputedStyle(grid).gridTemplateColumns.trim().split(/\\s+/).length:0,
        clipped:values.some(value=>value.scrollWidth>value.clientWidth+1)
      };
    })()`,
    returnByValue: true,
  });
  const mobile = mobileResponse.result?.value;
  if (mobile?.columns !== 1 || mobile?.clipped) throw new Error(`Motorcycle analytics mobile validation failed: columns=${mobile?.columns}, clipped=${mobile?.clipped}`);
  console.log("Motorcycle hero validation passed at the 1024px regression viewport.");
  socket.close();
} finally {
  browser.kill("SIGTERM");
  await wait(250);
  fs.rmSync(profile, { recursive: true, force: true });
}
