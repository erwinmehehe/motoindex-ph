import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const mediaPath = path.join(root, "lib/media.ts");
const coveragePath = path.join(root, "scripts/audit-motorcycle-media-coverage.mjs");
const outDir = path.join(root, "public/media/motorcycles");
fs.mkdirSync(outDir, { recursive: true });

const UA = "Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)";
const checkedAt = "2026-09-23";

const targets = [
  {
    entityId: "honda-airblade-160",
    id: "honda-airblade-160-honda-official",
    imageUrl: "https://cdn.honda.com.vn/motorbike-versions/Image360/November2025/1762148885/0.png",
    pageUrl: "https://www.honda.com.vn/xe-may/san-pham/air-blade-160125",
    terms: ["air blade", "airblade", "160"],
    alt: "Honda AirBlade 160 scooter",
    rightsHolder: "Honda Vietnam",
    sourceLabel: "Manufacturer-hosted image reference · Honda AirBlade 160"
  },
  {
    entityId: "honda-cbr150r",
    id: "honda-cbr150r-honda-ph",
    imageUrl: "https://images.ctfassets.net/p4ab844it03t/7udRlrxfC4Nqu6blG2EKTY/c7f40fb788d9fe295445bfebfd1b7e48/67e0b720bcd80.png?fm=webp&q=80",
    pageUrl: "https://www.hondaph.com/motorcycle/news/honda-philippines-unleashes-power-and-innovation-at-the-action-packed-inside-racing-bikefest-2025",
    terms: ["cbr150r", "cbr 150r"],
    alt: "Honda CBR150R sport motorcycle",
    rightsHolder: "Honda Philippines",
    sourceLabel: "Manufacturer-hosted image reference · Honda Philippines CBR150R"
  },
  {
    entityId: "honda-cbr650r",
    id: "honda-cbr650r-honda-global",
    imageUrl: "https://global.honda/content/dam/site/global-en/newsroom-new/cq_img/news/2023/11/dl/c231107a_004H.jpg",
    pageUrl: "https://global.honda/en/newsroom/news/2023/c231107aeng/image_download.html",
    terms: ["cbr650r", "cbr 650r"],
    alt: "Honda CBR650R E-Clutch sport motorcycle",
    rightsHolder: "Honda Motor Co., Ltd.",
    sourceLabel: "Manufacturer-hosted image reference · Honda CBR650R"
  },
  {
    entityId: "honda-crf1100l-africa-twin",
    id: "honda-crf1100l-africa-twin-honda-global",
    imageUrl: "https://global.honda/content/dam/site/global-en/newsroom-new/cq_img/news/2026/01/2260123eng-crf1100l/web/2260123-crf1100l_001L.jpg",
    pageUrl: "https://global.honda/en/newsroom/news/2026/2260123eng-crf1100l.html",
    terms: ["crf1100l", "africa twin"],
    alt: "Honda CRF1100L Africa Twin adventure motorcycle",
    rightsHolder: "Honda Motor Co., Ltd.",
    sourceLabel: "Manufacturer-hosted image reference · Honda CRF1100L Africa Twin"
  },
  {
    entityId: "honda-xl750-transalp",
    id: "honda-xl750-transalp-honda-global",
    imageUrl: "https://global.honda/content/dam/site/global-en/newsroom-new/cq_img/news/2026/03/2260306eng-xl750/web/2260306-xl750_001L.jpg",
    pageUrl: "https://global.honda/en/newsroom/news/2026/2260306eng-xl750.html",
    terms: ["xl750", "transalp"],
    alt: "Honda XL750 Transalp adventure motorcycle",
    rightsHolder: "Honda Motor Co., Ltd.",
    sourceLabel: "Manufacturer-hosted image reference · Honda XL750 Transalp"
  },
  {
    entityId: "yamaha-lexi-155",
    id: "yamaha-lexi-155-yamaha-official",
    imageUrl: "https://www.yamaha-motor.co.id/uploads/products/new_product_model_image/202601210136411054B75592.png",
    pageUrl: "https://www.yamaha-motor.co.id/product/lexi-lx-155/",
    terms: ["lexi", "155"],
    alt: "Yamaha LEXi LX 155 scooter",
    rightsHolder: "Yamaha Motor",
    sourceLabel: "Manufacturer-hosted image reference · Yamaha LEXi LX 155"
  },
  {
    entityId: "yamaha-yzf-r3",
    id: "yamaha-yzf-r3-yamaha-global",
    imageUrl: "https://news.yamaha-motor.co.jp/jp/news/assets_c/2025/03/105849_0001-thumb-1360x1019-260019.jpg",
    pageUrl: "https://global.yamaha-motor.com/jp/news/2025/0318/yzf-r3.html",
    terms: ["yzf-r3", "yzf r3", "r3"],
    alt: "Yamaha YZF-R3 sport motorcycle",
    rightsHolder: "Yamaha Motor Co., Ltd.",
    sourceLabel: "Manufacturer-hosted image reference · Yamaha YZF-R3"
  },
  {
    entityId: "yamaha-yzf-r7",
    id: "yamaha-yzf-r7-yamaha-global",
    imageUrl: "https://global.yamaha-motor.com/jp/news/topics_assets/132520_0001.jpg",
    pageUrl: "https://global.yamaha-motor.com/jp/news/2026/0409/yzf.html",
    terms: ["yzf-r7", "yzf r7", "r7"],
    alt: "Yamaha YZF-R7 sport motorcycle",
    rightsHolder: "Yamaha Motor Co., Ltd.",
    sourceLabel: "Manufacturer-hosted image reference · Yamaha YZF-R7"
  },
  {
    entityId: "kawasaki-z900",
    id: "kawasaki-z900-kawasaki-global",
    imageUrl: "https://global.kawasaki.com/en/corp/newsroom/news/images/news_241031-Z900%20.jpg",
    pageUrl: "https://global.kawasaki.com/en/corp/newsroom/news/detail/?f=20241031_1292",
    terms: ["z900", "z 900"],
    alt: "Kawasaki Z900 naked motorcycle",
    rightsHolder: "Kawasaki Motors, Ltd.",
    sourceLabel: "Manufacturer-hosted image reference · Kawasaki Z900"
  },
  {
    entityId: "yamaha-yzf-r15m",
    id: "yamaha-yzf-r15m-yamaha-india",
    imageUrl: "https://shop.yamaha-motor-india.com/cdn/shop/files/metallic_grey.webp?v=1757050338",
    pageUrl: "https://shop.yamaha-motor-india.com/products/buy-r15m",
    terms: ["r15m", "r15 m"],
    alt: "Yamaha R15M sport motorcycle in Metallic Grey",
    rightsHolder: "India Yamaha Motor",
    sourceLabel: "Manufacturer e-shop image reference · Yamaha R15M"
  }
];

function decodeHtml(s) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) out[m[1].toLowerCase()] = decodeHtml(m[3]);
  return out;
}

function absolute(raw, base) {
  try { return new URL(decodeHtml(raw), base).href; } catch { return null; }
}

function badImage(url) {
  return /(?:logo|favicon|sprite|icon|payment|placeholder|spinner|loading|badge|avatar|tracking|pixel|qr|newsletter|flag|footer|header)/i.test(url);
}

async function fetchBytes(url, referer) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
    headers: {
      "user-agent": UA,
      accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",
      ...(referer ? { referer } : {})
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const type = (response.headers.get("content-type") || "").toLowerCase();
  if (!type.startsWith("image/")) throw new Error(`not an image (${type || "unknown"}) for ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const meta = await sharp(bytes).metadata();
  if ((meta.width || 0) < 250 || (meta.height || 0) < 250) throw new Error(`image too small ${meta.width || 0}x${meta.height || 0}`);
  return { bytes, finalUrl: response.url || url };
}

async function discover(target) {
  const response = await fetch(target.pageUrl, {
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
    headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" }
  });
  if (!response.ok) throw new Error(`page HTTP ${response.status}`);
  const html = await response.text();
  const pageUrl = response.url || target.pageUrl;
  const candidates = [];
  const add = (raw, baseScore, label = "") => {
    const url = raw && absolute(raw, pageUrl);
    if (!url || !/^https?:/i.test(url) || badImage(url)) return;
    const hay = `${url} ${label}`.toLowerCase();
    const matches = target.terms.filter(t => hay.includes(t.toLowerCase())).length;
    candidates.push({ url, score: baseScore + matches * 35 });
  };

  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    const label = `${a.alt || ""} ${a.title || ""}`;
    const srcset = a.srcset?.split(",").map(x => x.trim().split(/\s+/)[0]).filter(Boolean) || [];
    for (const raw of [a.src, a["data-src"], a["data-lazy-src"], a["data-original"], ...srcset]) if (raw) add(raw, 90, label);
  }
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    const key = (a.property || a.name || "").toLowerCase();
    if (["og:image","og:image:url","og:image:secure_url"].includes(key)) add(a.content, 130, key);
    if (["twitter:image","twitter:image:src"].includes(key)) add(a.content, 120, key);
  }
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1].trim());
      const visit = node => {
        if (!node) return;
        if (Array.isArray(node)) return node.forEach(visit);
        if (typeof node !== "object") return;
        const label = typeof node.name === "string" ? node.name : "";
        const imgs = Array.isArray(node.image) ? node.image : [node.image];
        for (const img of imgs) {
          if (typeof img === "string") add(img, 140, label);
          else if (img && typeof img.url === "string") add(img.url, 140, label);
        }
        for (const v of Object.values(node)) if (v && typeof v === "object") visit(v);
      };
      visit(data);
    } catch {}
  }

  const unique = [...new Map(candidates.sort((a,b)=>b.score-a.score).map(c => [c.url, c])).values()];
  let last;
  for (const c of unique.slice(0, 25)) {
    try {
      const hit = await fetchBytes(c.url, pageUrl);
      return { ...hit, pageUrl };
    } catch (e) { last = e; }
  }
  throw last || new Error("no usable image candidate");
}

async function sourceFor(target) {
  if (target.imageUrl) {
    try {
      const hit = await fetchBytes(target.imageUrl, target.pageUrl);
      return { ...hit, pageUrl: target.pageUrl };
    } catch (e) {
      console.log(`Direct image failed for ${target.entityId}: ${e.message}; trying source page.`);
    }
  }
  return discover(target);
}

function findArrayClose(source, declaration) {
  const start = source.indexOf(declaration);
  if (start < 0) throw new Error(`Missing ${declaration}`);
  const open = source.indexOf("[", source.indexOf("=", start));
  let depth = 0, quote = "", inString = false, escaped = false;
  for (let i = open; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inString = true; quote = ch; continue; }
    if (ch === "[") depth++;
    else if (ch === "]" && --depth === 0) return i;
  }
  throw new Error("Could not find entityMedia array close");
}

function renderRecord(t, sourceImageUrl) {
  return `  {
    id: ${JSON.stringify(t.id)}, entityType: "motorcycle", entityId: ${JSON.stringify(t.entityId)}, role: "primary",
    src: ${JSON.stringify(`/media/motorcycles/${t.entityId}.webp`)}, sourceImageUrl: ${JSON.stringify(sourceImageUrl)}, alt: ${JSON.stringify(t.alt)}, width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: ${JSON.stringify(t.rightsHolder)}, sourceLabel: ${JSON.stringify(t.sourceLabel)}, sourceUrl: ${JSON.stringify(t.pageUrl)}, lastChecked: ${JSON.stringify(checkedAt)}
  },`;
}

let media = fs.readFileSync(mediaPath, "utf8");
let coverage = fs.readFileSync(coveragePath, "utf8");
const completed = [];

for (const target of targets) {
  console.log(`Processing ${target.entityId}...`);
  const source = await sourceFor(target);
  const output = path.join(outDir, `${target.entityId}.webp`);
  await sharp(source.bytes)
    .rotate()
    .resize({ width: 1200, height: 1200, fit: "contain", withoutEnlargement: false, background: { r:255, g:255, b:255, alpha:1 } })
    .webp({ quality: 86, effort: 4 })
    .toFile(output);

  const hasRecord = new RegExp(`entityId\\s*:\\s*["']${target.entityId.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}["']`).test(media);
  if (!hasRecord) {
    const close = findArrayClose(media, "export const entityMedia");
    media = media.slice(0, close) + renderRecord(target, source.finalUrl) + "\n" + media.slice(close);
  }
  coverage = coverage.replace(new RegExp(`\\n\\s*"${target.entityId.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}",?`), "");
  completed.push({ entityId: target.entityId, sourceImageUrl: source.finalUrl });
  console.log(`✓ ${target.entityId} <- ${source.finalUrl}`);
}

fs.writeFileSync(mediaPath, media);
fs.writeFileSync(coveragePath, coverage);
fs.writeFileSync(path.join(root, "artifacts/motorcycle-image-wave8.json"), JSON.stringify({ checkedAt, completed }, null, 2));
console.log(`Completed ${completed.length}/${targets.length} exact-model image backfills.`);
