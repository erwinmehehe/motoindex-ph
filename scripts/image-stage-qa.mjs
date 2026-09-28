import fs from "node:fs";
import os from "node:os";
import { spawn, spawnSync } from "node:child_process";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const checks = [
  { name: "catalog", path: "/motorcycles", selector: ".model-card-media", maxHeight: { 390: 180, 1440: 190 }, requireContain: true, maxImageWidthRatio: 0.9, maxImageHeightRatio: 0.84 },
  { name: "comparison media", path: "/compare/selection?bikes=aerox-v3,nmax-v3", selector: ".compare-product-media", maxHeight: { 390: 125, 1440: 160 }, maxImageWidthRatio: 0.9, maxImageHeightRatio: 0.84 },
  { name: "comparison card", path: "/compare/selection?bikes=aerox-v3,nmax-v3", selector: ".compare-product-card", requireWhite: true, maxHeight: { 390: 220, 1440: 230 } },
  { name: "motorcycle hero", path: "/motorcycles/yamaha/aerox-v3", selector: ".motorcycle-hero-media", maxHeight: { 390: 270, 1440: 430 } },
];
const widths = [390, 768, 1440];
const allCardPages = [
  { name: "motorcycle catalog", path: "/motorcycles", selector: ".motorcycle-catalog-grid .model-card-media" },
  { name: "Honda brand", path: "/motorcycles/honda", selector: ".ph-brand-model-grid .model-card-media" },
  { name: "Yamaha brand", path: "/motorcycles/yamaha", selector: ".ph-brand-model-grid .model-card-media" },
  { name: "Kawasaki brand", path: "/motorcycles/kawasaki", selector: ".ph-brand-model-grid .model-card-media" },
  { name: "Vespa brand", path: "/motorcycles/vespa", selector: ".ph-brand-model-grid .model-card-media" },
];

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
  return { ready, send };
}

async function evaluate(send, expression) {
  const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return response.result?.value;
}

async function waitForComplete(send) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (await evaluate(send, "document.readyState").catch(() => "") === "complete") return;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error("Page did not finish loading.");
}

async function warmAllCardMedia(send, stageSelector) {
  const imageSelector = `${stageSelector} img`;
  await evaluate(send, `(() => {
    for (const image of document.querySelectorAll(${JSON.stringify(imageSelector)})) {
      image.loading = "eager";
      image.setAttribute("fetchpriority", "high");
    }
    return true;
  })()`);

  const positions = await evaluate(send, `(() => {
    const height=Math.max(document.documentElement.scrollHeight,document.body?.scrollHeight||0);
    const viewport=Math.max(innerHeight,1);
    const max=Math.max(0,height-viewport);
    const step=Math.max(420,Math.round(viewport*.7));
    const values=[];
    for(let y=0;y<=max;y+=step) values.push(y);
    if(values.at(-1)!==max) values.push(max);
    return values.slice(0,40);
  })()`) || [0];

  for (const y of positions) {
    await evaluate(send, `window.scrollTo({top:${y},behavior:"instant"}); true`);
    await new Promise(resolve => setTimeout(resolve, 120));
  }

  await evaluate(send, `new Promise(resolve => {
    const images=[...document.querySelectorAll(${JSON.stringify(imageSelector)})];
    const pending=images.filter(image=>!image.complete);
    if(!pending.length){resolve(true);return;}
    let remaining=pending.length;
    const done=()=>{remaining-=1;if(remaining<=0){clearTimeout(timer);resolve(true);}};
    const timer=setTimeout(()=>resolve(false),8000);
    for(const image of pending){
      image.addEventListener("load",done,{once:true});
      image.addEventListener("error",done,{once:true});
    }
  })`);

  await evaluate(send, 'window.scrollTo({top:0,behavior:"instant"}); true');
  await new Promise(resolve => setTimeout(resolve, 250));
}

const chrome = findChrome();
const port = 9555;
const profile = fs.mkdtempSync(`${os.tmpdir()}/motoindex-image-stage-`);
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
const results = [];

try {
  await waitForDebugPort(port);
  const tab = await createTab(port);
  const cdp = connectCdp(tab.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  for (const width of widths) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width <= 430 ? 844 : 900,
      deviceScaleFactor: 1,
      mobile: width <= 768,
    });

    for (const check of checks) {
      await cdp.send("Page.navigate", { url: new URL(check.path, base).toString() });
      await waitForComplete(cdp.send);
      await new Promise(resolve => setTimeout(resolve, 350));
      const result = await evaluate(cdp.send, `(() => {
        const stage=document.querySelector(${JSON.stringify(check.selector)});
        const image=stage?.querySelector('img');
        const placeholder=stage?.matches('.model-media-placeholder,.media-unavailable') ? stage : stage?.querySelector('.model-media-placeholder,.media-unavailable');
        const root=document.documentElement;
        const rect=stage?.getBoundingClientRect();
        const section=document.querySelector('.motorcycle-entity-section');
        const sectionStyle=section ? getComputedStyle(section) : null;
        const heading=document.querySelector('.section-head h2');
        return {
          found:Boolean(stage),
          background:stage ? getComputedStyle(stage).backgroundColor : '',
          imageBackground:image ? getComputedStyle(image).backgroundColor : '',
          overflow:root.scrollWidth-root.clientWidth,
          right:rect?.right||0,
          height:rect?.height||0,
          viewport:innerWidth,
          placeholderBackground:placeholder ? getComputedStyle(placeholder).backgroundColor : '',
          sectionPaddingTop:sectionStyle ? parseFloat(sectionStyle.paddingTop)||0 : 0,
          sectionPaddingBottom:sectionStyle ? parseFloat(sectionStyle.paddingBottom)||0 : 0,
          headingSize:heading ? parseFloat(getComputedStyle(heading).fontSize)||0 : 0,
          imageObjectFit:image ? getComputedStyle(image).objectFit : "",
          imageTransform:image ? getComputedStyle(image).transform : "",
          imageRect:image ? (()=>{const r=image.getBoundingClientRect(); return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};})() : null,
          stageRect:rect ? {left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:rect.width,height:rect.height} : null
        };
      })()`);
      results.push({ width, ...check, ...result });
      if (!result?.found) failures.push(`${width}px ${check.name}: shared product surface is missing`);
      const expectsWhite = check.requireWhite !== false;
      if (expectsWhite && result?.background !== "rgb(255, 255, 255)") failures.push(`${width}px ${check.name}: background is ${result?.background || "missing"}, expected white`);
      if (result?.imageBackground && result.imageBackground !== "rgb(255, 255, 255)") failures.push(`${width}px ${check.name}: image background is ${result.imageBackground}, expected white`);
      if ((result?.overflow||0) > 5) failures.push(`${width}px ${check.name}: page overflows horizontally by ${result.overflow}px`);
      if ((result?.right||0) > (result?.viewport||width) + 5) failures.push(`${width}px ${check.name}: surface leaves the viewport`);
      const maxHeight = check.maxHeight?.[width];
      if (maxHeight && (result?.height||0) > maxHeight + 1) failures.push(`${width}px ${check.name}: ${Math.round(result.height)}px tall, expected no more than ${maxHeight}px`);
      if (check.requireContain && result?.imageObjectFit !== "contain") failures.push(`${width}px ${check.name}: image object-fit is ${result?.imageObjectFit || "missing"}, expected contain`);
      if (check.requireContain && result?.imageTransform && result.imageTransform !== "none") failures.push(`${width}px ${check.name}: image transform is ${result.imageTransform}, expected none`);
      if (check.maxImageWidthRatio && result?.imageRect && result?.stageRect && result.imageRect.width > result.stageRect.width * check.maxImageWidthRatio + 1) {
        failures.push(`${width}px ${check.name}: image width ratio ${(result.imageRect.width / result.stageRect.width).toFixed(2)} exceeds ${check.maxImageWidthRatio}`);
      }
      if (check.maxImageHeightRatio && result?.imageRect && result?.stageRect && result.imageRect.height > result.stageRect.height * check.maxImageHeightRatio + 1) {
        failures.push(`${width}px ${check.name}: image height ratio ${(result.imageRect.height / result.stageRect.height).toFixed(2)} exceeds ${check.maxImageHeightRatio}`);
      }
      if (check.requireContain && result?.imageRect && result?.stageRect) {
        const tolerance = 1;
        if (result.imageRect.left < result.stageRect.left - tolerance || result.imageRect.right > result.stageRect.right + tolerance || result.imageRect.top < result.stageRect.top - tolerance || result.imageRect.bottom > result.stageRect.bottom + tolerance) {
          failures.push(`${width}px ${check.name}: image box escapes the media stage; image=${JSON.stringify(result.imageRect)} stage=${JSON.stringify(result.stageRect)}`);
        }
      }
      if (result?.placeholderBackground && result.placeholderBackground !== "rgb(255, 255, 255)") failures.push(`${width}px ${check.name}: missing-photo placeholder is not white`);
      if (check.name === "motorcycle hero") {
        if ((result?.sectionPaddingTop||0) > 50 || (result?.sectionPaddingBottom||0) > 50) failures.push(`${width}px detail page: section spacing is oversized (${result.sectionPaddingTop}/${result.sectionPaddingBottom}px)`);
        if ((result?.headingSize||0) > 41) failures.push(`${width}px detail page: section heading is ${result.headingSize}px, expected compact product hierarchy`);
      }
    }
  }


  // all-card-image-audit: inspect every rendered motorcycle card, not only the first one.
  for (const width of widths) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width <= 430 ? 844 : width <= 768 ? 1024 : 900,
      deviceScaleFactor: 1,
      mobile: width <= 768,
    });

    for (const page of allCardPages) {
      await cdp.send("Page.navigate", { url: new URL(page.path, base).toString() });
      await waitForComplete(cdp.send);
      await warmAllCardMedia(cdp.send, page.selector);

      const audit = await evaluate(cdp.send, `(() => {
        const root=document.documentElement;
        const stages=[...document.querySelectorAll(${JSON.stringify(page.selector)})];
        return {
          overflow:root.scrollWidth-root.clientWidth,
          viewport:innerWidth,
          cards:stages.map((stage,index)=>{
            const stageRect=stage.getBoundingClientRect();
            const image=stage.querySelector("img");
            const placeholder=stage.matches(".model-media-placeholder,.media-unavailable")
              ? stage
              : stage.querySelector(".model-media-placeholder,.media-unavailable");
            const imageRect=image?.getBoundingClientRect();
            return {
              index,
              background:getComputedStyle(stage).backgroundColor,
              right:stageRect.right,
              left:stageRect.left,
              top:stageRect.top,
              bottom:stageRect.bottom,
              width:stageRect.width,
              height:stageRect.height,
              imageBackground:image ? getComputedStyle(image).backgroundColor : "",
              imageObjectFit:image ? getComputedStyle(image).objectFit : "",
              imageTransform:image ? getComputedStyle(image).transform : "",
              imageComplete:image ? image.complete : false,
              naturalWidth:image ? image.naturalWidth : 0,
              naturalHeight:image ? image.naturalHeight : 0,
              imageRect:imageRect ? {
                left:imageRect.left,top:imageRect.top,right:imageRect.right,bottom:imageRect.bottom,
                width:imageRect.width,height:imageRect.height
              } : null,
              placeholder:Boolean(placeholder),
              placeholderBackground:placeholder ? getComputedStyle(placeholder).backgroundColor : ""
            };
          })
        };
      })()`);

      results.push({ width, name: `${page.name} all cards`, path: page.path, ...audit });
      if (!audit?.cards?.length) failures.push(`${width}px ${page.name}: no scoped motorcycle card media were rendered`);
      if ((audit?.overflow || 0) > 5) failures.push(`${width}px ${page.name}: page overflows horizontally by ${audit.overflow}px`);

      for (const card of audit?.cards || []) {
        const label=`${width}px ${page.name} card ${card.index + 1}`;
        if (card.background !== "rgb(255, 255, 255)") failures.push(`${label}: stage background is ${card.background || "missing"}, expected white`);
        if (card.left < -2 || card.right > (audit.viewport || width) + 2) failures.push(`${label}: image stage leaves the viewport`);
        if (!card.imageRect && !card.placeholder) failures.push(`${label}: has neither a loaded image nor a placeholder`);
        if (card.imageRect) {
          if (!card.imageComplete || card.naturalWidth < 2 || card.naturalHeight < 2) failures.push(`${label}: image failed to load`);
          if (card.imageObjectFit !== "contain") failures.push(`${label}: image object-fit is ${card.imageObjectFit || "missing"}, expected contain`);
          if (card.imageTransform && card.imageTransform !== "none") failures.push(`${label}: image transform is ${card.imageTransform}, expected none`);
          if (card.imageBackground && card.imageBackground !== "rgb(255, 255, 255)") failures.push(`${label}: image background is ${card.imageBackground}, expected white`);
          const tolerance=1;
          if (
            card.imageRect.left < card.left - tolerance ||
            card.imageRect.right > card.right + tolerance ||
            card.imageRect.top < card.top - tolerance ||
            card.imageRect.bottom > card.bottom + tolerance ||
            card.imageRect.width > card.width * 0.9 + tolerance ||
            card.imageRect.height > card.height * 0.84 + tolerance
          ) failures.push(`${label}: image is not safely contained in the white stage`);
        }
        if (card.placeholderBackground && card.placeholderBackground !== "rgb(255, 255, 255)") failures.push(`${label}: placeholder background is not white`);
      }
    }
  }

  if (failures.length) {
    console.error(`Shared product visual QA failed:\n${failures.map(item=>`- ${item}`).join("\n")}`);
    process.exitCode = 1;
  } else {
    console.log(`Shared product visual QA passed: ${results.length} catalog, comparison and detail checks use compact white product surfaces.`);
  }
} finally {
  proc.kill("SIGTERM");
  await new Promise(resolve => setTimeout(resolve, 250));
  try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch {}
}
