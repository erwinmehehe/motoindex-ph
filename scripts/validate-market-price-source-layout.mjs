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
if (!chrome) throw new Error("Chrome was not found for price-source layout validation.");

const port = 9471;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-price-sources-"));
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

  for (const width of [1180, 720]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 800 });
    await send("Page.navigate", { url: `${baseUrl}/motorcycles/yamaha/aerox-v3` });
    for (let attempt = 0; attempt < 80; attempt++) {
      const state = await send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
      if (state.result?.value === "complete") break;
      await wait(100);
    }
    const response = await send("Runtime.evaluate", {
      expression: `(() => {
        const section=document.querySelector('.market-price-sources');
        const grid=section?.querySelector('.market-price-source-grid');
        const cards=[...(section?.querySelectorAll('.market-price-source-card')||[])];
        const rangeText=section?.querySelector('.market-price-source-value')?.textContent||'';
        const cleanCards=cards.every(card=>{
          const type=card.querySelector('.market-price-source-type')?.getBoundingClientRect();
          const price=card.querySelector('.market-price-source-value')?.getBoundingClientRect();
          const note=card.querySelector('.market-price-source-note')?.getBoundingClientRect();
          const footer=card.querySelector('.market-price-source-footer')?.getBoundingClientRect();
          return type&&price&&note&&footer&&type.bottom<=price.top&&price.bottom<=note.top&&note.bottom<=footer.top;
        });
        return {
          exists:Boolean(section),
          cards:cards.length,
          columns:grid?getComputedStyle(grid).gridTemplateColumns.trim().split(/\\s+/).length:0,
          cleanCards,
          rangeReadable:rangeText.includes(' – '),
          overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
        };
      })()`,
      returnByValue: true,
    });
    const result = response.result?.value;
    const expectedColumns = width > 820 ? 2 : 1;
    const failures = [];
    if (!result?.exists) failures.push("price-source section is missing");
    if ((result?.cards || 0) < 2) failures.push(`expected at least two source cards, found ${result?.cards || 0}`);
    if (result?.columns !== expectedColumns) failures.push(`expected ${expectedColumns} column(s), found ${result?.columns || 0}`);
    if (!result?.cleanCards) failures.push("source type, price, note, and footer overlap or run together");
    if (!result?.rangeReadable) failures.push("price range separator still reads like a strike-through");
    if ((result?.overflow || 0) > 1) failures.push(`page overflows by ${result.overflow}px`);
    if (failures.length) throw new Error(`${width}px price-source validation failed:\n- ${failures.join("\n- ")}`);
  }
  console.log("Market price-source layout passed at desktop and mobile widths.");
  socket.close();
} finally {
  browser.kill("SIGTERM");
  await wait(250);
  fs.rmSync(profile, { recursive: true, force: true });
}
