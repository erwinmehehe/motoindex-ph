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
if (!chrome) throw new Error("Chrome was not found for installment spacing validation.");

const port = 9471;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-installment-spacing-"));
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
  await send("Emulation.setDeviceMetricsOverride", { width: 1254, height: 800, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: `${baseUrl}/motorcycles/yamaha/nmax-v3#installment` });
  for (let attempt = 0; attempt < 80; attempt++) {
    const state = await send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
    if (state.result?.value === "complete") break;
    await wait(100);
  }

  const desktopResponse = await send("Runtime.evaluate", {
    expression: `(() => {
      const controls=document.querySelector('.finance-controls');
      const result=document.querySelector('.finance-result');
      const layout=document.querySelector('.finance-planner-layout');
      const head=document.querySelector('.finance-planner-head');
      const lastControl=controls?.lastElementChild;
      const factValues=[...document.querySelectorAll('.finance-result-facts>div>strong')];
      const controlsRect=controls?.getBoundingClientRect();
      const lastControlRect=lastControl?.getBoundingClientRect();
      return {
        deadSpace:controlsRect&&lastControlRect?Math.round(controlsRect.bottom-lastControlRect.bottom):999,
        resultFactSize:factValues.length?Math.max(...factValues.map(value=>parseFloat(getComputedStyle(value).fontSize))):999,
        overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        controlsHeight:controlsRect?.height||0,
        resultHeight:result?.getBoundingClientRect().height||0,
        layoutGap:layout?parseFloat(getComputedStyle(layout).columnGap):0,
        resultRadius:result?parseFloat(getComputedStyle(result).borderRadius):0,
        resultInset:result&&layout?Math.round(result.getBoundingClientRect().right-layout.getBoundingClientRect().right):999,
        headBackground:head?getComputedStyle(head).backgroundColor:"",
        plannerBackground:layout?getComputedStyle(layout.closest('.finance-planner')).backgroundColor:""
      };
    })()`,
    returnByValue: true,
  });
  const desktop = desktopResponse.result?.value;
  const failures = [];
  if ((desktop?.deadSpace || 0) > 64) failures.push(`desktop controls retain ${desktop.deadSpace}px of dead space`);
  if ((desktop?.resultFactSize || 0) > 20) failures.push(`result facts are oversized at ${desktop.resultFactSize}px`);
  if ((desktop?.overflow || 0) > 1) failures.push(`desktop page overflows by ${desktop.overflow}px`);
  if ((desktop?.layoutGap || 0) < 20) failures.push(`desktop planner gap is only ${desktop?.layoutGap || 0}px`);
  if ((desktop?.resultRadius || 0) < 16) failures.push(`result card radius is only ${desktop?.resultRadius || 0}px`);
  if ((desktop?.resultInset || 0) > -20) failures.push(`result card is not visually inset (${desktop?.resultInset || 0}px)`);
  if (desktop?.headBackground !== desktop?.plannerBackground) failures.push("planner header uses a competing background surface");

  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const mobileResponse = await send("Runtime.evaluate", {
    expression: `(() => {
      const layout=document.querySelector('.finance-planner-layout');
      return {
        columns:layout?getComputedStyle(layout).gridTemplateColumns.trim().split(/\\s+/).length:0,
        overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
      };
    })()`,
    returnByValue: true,
  });
  const mobile = mobileResponse.result?.value;
  if (mobile?.columns !== 1) failures.push(`mobile planner has ${mobile?.columns || 0} columns instead of one`);
  if ((mobile?.overflow || 0) > 1) failures.push(`mobile page overflows by ${mobile.overflow}px`);

  if (failures.length) throw new Error(`Installment spacing validation failed:\n- ${failures.join("\n- ")}`);
  console.log("Installment spacing validation passed at desktop and mobile breakpoints.");
  socket.close();
} finally {
  browser.kill("SIGTERM");
  await wait(250);
  fs.rmSync(profile, { recursive: true, force: true });
}
