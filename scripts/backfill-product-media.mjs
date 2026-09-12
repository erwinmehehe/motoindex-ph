import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { URL } from "node:url";
import sharp from "sharp";

const root = process.cwd();
const catalogSource = fs.readFileSync(path.join(root, "lib/catalog.ts"), "utf8");
const mediaSource = fs.readFileSync(path.join(root, "lib/media.ts"), "utf8");
const generatedPath = path.join(root, "lib/generatedProductMedia.ts");
const generatedSource = fs.existsSync(generatedPath) ? fs.readFileSync(generatedPath, "utf8") : "";
const today = new Date().toISOString().slice(0, 10);
const userAgent = "Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)";

function extractArray(source, declaration) {
  const start = source.indexOf(declaration);
  if (start < 0) return "";
  const equals = source.indexOf("=", start);
  const open = source.indexOf("[", equals);
  if (equals < 0 || open < 0) return "";
  let quote = "", inString = false, escaped = false, depth = 0;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inString = true; quote = ch; continue; }
    if (ch === "[") depth += 1;
    else if (ch === "]" && --depth === 0) return source.slice(open + 1, i);
  }
  return "";
}

function topLevelObjects(text) {
  const blocks = [];
  let quote = "", inString = false, escaped = false, depth = 0, start = -1;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inString = true; quote = ch; continue; }
    if (ch === "{") { if (depth === 0) start = i; depth += 1; }
    else if (ch === "}" && --depth === 0 && start >= 0) { blocks.push(text.slice(start, i + 1)); start = -1; }
  }
  return blocks;
}

function stringField(block, name) {
  return block.match(new RegExp(`\\b${name}:\\s*["']([^"']+)["']`))?.[1];
}

function catalogRecords(declaration, entityType) {
  return topLevelObjects(extractArray(catalogSource, declaration)).map((block) => ({
    id: stringField(block, "id"), brand: stringField(block, "brand"), model: stringField(block, "model"),
    status: stringField(block, "status"), sourceUrl: stringField(block, "sourceUrl"), entityType
  })).filter((item) => item.id && item.status === "verified" && item.sourceUrl);
}

function mediaKeys(source, declaration) {
  return topLevelObjects(extractArray(source, declaration)).map((block) => ({
    entityType: stringField(block, "entityType"), entityId: stringField(block, "entityId"), rightsStatus: stringField(block, "rightsStatus")
  })).filter((item) => item.entityType && item.entityId && item.rightsStatus !== "pending").map((item) => `${item.entityType}:${item.entityId}`);
}

function existingGeneratedRecords() {
  const text = extractArray(generatedSource, "export const generatedProductMedia").trim();
  if (!text) return [];
  try { return JSON.parse(`[${text}]`); } catch { return []; }
}

function decodeHtml(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function absolute(candidate, pageUrl) {
  try { return new URL(decodeHtml(candidate), pageUrl).href; } catch { return null; }
}
function attrs(tag) {
  const out = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) out[match[1].toLowerCase()] = decodeHtml(match[3]);
  return out;
}
function words(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter((word) => word.length > 2);
}
function isBadImageUrl(url) {
  return /(?:logo|favicon|sprite|icon|payment|placeholder|spinner|loading|badge|avatar|tracking|pixel|banner|\bsocial\b|pinlock)/i.test(url);
}
function isWeakSourcePage(url) {
  try {
    const parsed = new URL(url);
    return /(?:^|\/)search(?:\/|$)/i.test(parsed.pathname) || parsed.searchParams.has("q") && /search/i.test(parsed.pathname);
  } catch { return false; }
}
function imageCandidates(html, pageUrl, product) {
  const candidates = [];
  const push = (raw, score, reason) => {
    const url = raw && absolute(raw, pageUrl);
    if (!url || !/^https?:/.test(url) || isBadImageUrl(url)) return;
    candidates.push({ url, score, reason });
  };
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const a = attrs(tag); const key = (a.property || a.name || "").toLowerCase(); const value = a.content;
    if (key === "og:image" || key === "og:image:url" || key === "og:image:secure_url") push(value, 100, key);
    if (key === "twitter:image" || key === "twitter:image:src") push(value, 90, key);
  }
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    const a = attrs(tag); if ((a.rel || "").toLowerCase() === "image_src") push(a.href, 85, "image_src");
  }
  for (const script of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(script[1].trim());
      const visit = (node) => {
        if (!node) return;
        if (Array.isArray(node)) return node.forEach(visit);
        if (typeof node !== "object") return;
        if (typeof node.image === "string") push(node.image, 88, "jsonld");
        else if (Array.isArray(node.image)) node.image.forEach((value) => typeof value === "string" && push(value, 88, "jsonld"));
        else if (node.image && typeof node.image.url === "string") push(node.image.url, 88, "jsonld");
        for (const value of Object.values(node)) if (value && typeof value === "object") visit(value);
      };
      visit(data);
    } catch {}
  }
  const productTerms = [...new Set([...words(product.brand || ""), ...words(product.model || "")])];
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const a = attrs(tag); const label = `${a.alt || ""} ${a.title || ""}`.toLowerCase();
    const matches = productTerms.filter((term) => label.includes(term)).length;
    if (matches >= Math.min(2, productTerms.length)) push(a.src || a["data-src"] || a["data-lazy-src"] || a.srcset?.split(/\s+/)[0], 55 + matches * 3, "matching img alt");
  }
  const seen = new Set();
  return candidates.sort((a, b) => b.score - a.score).filter((item) => !seen.has(item.url) && seen.add(item.url));
}

async function fetchBuffer(url, referer) {
  const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": userAgent, accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8", ...(referer ? { referer } : {}) } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const type = response.headers.get("content-type") || "";
  if (!type.toLowerCase().startsWith("image/")) throw new Error(`not an image (${type || "unknown type"})`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`image too small (${bytes.length} bytes)`);
  return bytes;
}

async function discoverImage(product) {
  if (/\.pdf(?:$|[?#])/i.test(product.sourceUrl)) throw new Error("PDF source requires manual image selection");
  if (isWeakSourcePage(product.sourceUrl)) throw new Error("search/listing source requires manual image selection");
  const response = await fetch(product.sourceUrl, { redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": userAgent, accept: "text/html,application/xhtml+xml" } });
  if (!response.ok) throw new Error(`source HTTP ${response.status}`);
  const type = response.headers.get("content-type") || "";
  if (type.toLowerCase().startsWith("image/")) return { url: response.url, bytes: Buffer.from(await response.arrayBuffer()), reason: "direct image" };
  const html = await response.text();
  const candidates = imageCandidates(html, response.url || product.sourceUrl, product);
  if (!candidates.length) throw new Error("no trustworthy product image candidate found");
  let lastError;
  for (const candidate of candidates.slice(0, 8)) {
    try { return { url: candidate.url, bytes: await fetchBuffer(candidate.url, response.url || product.sourceUrl), reason: candidate.reason }; }
    catch (error) { lastError = error; }
  }
  throw lastError || new Error("image candidates failed");
}

function hasLocalAsset(asset) {
  if (!asset?.src?.startsWith("/media/")) return false;
  return fs.existsSync(path.join(root, "public", asset.src.replace(/^\//, "")));
}

const products = [
  ...catalogRecords("export const helmetProducts", "helmet"),
  ...catalogRecords("export const tireProducts", "tire"),
  ...catalogRecords("export const topBoxProducts", "topbox")
];
const previousGenerated = existingGeneratedRecords();
const generated = previousGenerated.filter(hasLocalAsset);
const missingLocalRecords = previousGenerated.filter((asset) => !hasLocalAsset(asset));
for (const asset of missingLocalRecords) {
  console.warn(`! ignoring generated record with missing local file: ${asset.entityType}:${asset.entityId} -> ${asset.src}`);
}
const existing = new Set([
  ...mediaKeys(mediaSource, "export const entityMedia"),
  ...generated.map((item) => `${item.entityType}:${item.entityId}`)
]);
const missing = products.filter((item) => !existing.has(`${item.entityType}:${item.id}`));
let outputRecords = [...generated];
const failures = [];
const successes = [];
const newRecordIds = new Set();
const folders = { helmet: "helmets", tire: "tires", topbox: "topboxes" };

async function processProduct(product) {
  try {
    const discovered = await discoverImage(product);
    const folder = folders[product.entityType];
    const relativeSrc = `/media/${folder}/${product.id}.webp`;
    const output = path.join(root, "public", relativeSrc.replace(/^\//, ""));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    const metadata = await sharp(discovered.bytes).metadata();
    if ((metadata.width || 0) < 200 || (metadata.height || 0) < 200) throw new Error(`source image dimensions too small (${metadata.width || 0}x${metadata.height || 0})`);
    await sharp(discovered.bytes).rotate().resize({ width: 1200, height: 1200, fit: "contain", withoutEnlargement: false, background: { r: 255, g: 255, b: 255, alpha: 1 } }).webp({ quality: 84, effort: 4 }).toFile(output);
    const record = {
      id: `${product.id}-generated-product`, entityType: product.entityType, entityId: product.id, role: "primary",
      src: relativeSrc, sourceImageUrl: discovered.url,
      alt: `${product.brand} ${product.model} product image`, width: 1200, height: 1200,
      rightsStatus: "external-reference", sourceLabel: `Checked product-page image · ${product.brand} ${product.model}`,
      sourceUrl: product.sourceUrl, lastChecked: today
    };
    outputRecords.push(record);
    newRecordIds.add(record.id);
    successes.push(`${product.entityType}:${product.id} (${discovered.reason})`);
    console.log(`✓ ${product.entityType}:${product.id} <- ${discovered.url}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${product.entityType}:${product.id} | ${message} | ${product.sourceUrl}`);
    console.log(`✗ ${product.entityType}:${product.id}: ${message}`);
  }
}

for (let i = 0; i < missing.length; i += 5) await Promise.all(missing.slice(i, i + 5).map(processProduct));

function normalizedSource(url) {
  try { const parsed = new URL(url); return `${parsed.hostname}${parsed.pathname}`.toLowerCase(); } catch { return url || ""; }
}
function localHash(asset) {
  try {
    const file = path.join(root, "public", asset.src.replace(/^\//, ""));
    return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  } catch { return ""; }
}
function removeGeneratedAsset(asset, reason) {
  if (!newRecordIds.has(asset.id)) return;
  if (asset.src?.startsWith("/media/")) {
    const file = path.join(root, "public", asset.src.replace(/^\//, ""));
    if (fs.existsSync(file)) fs.rmSync(file);
  }
  failures.push(`${asset.entityType}:${asset.entityId} | rejected generated image: ${reason} | ${asset.sourceUrl || ""}`);
  console.log(`! rejected ${asset.entityType}:${asset.entityId}: ${reason}`);
}

const sourceGroups = new Map();
const hashGroups = new Map();
for (const asset of outputRecords) {
  const sourceKey = normalizedSource(asset.sourceImageUrl);
  if (sourceKey) sourceGroups.set(sourceKey, [...(sourceGroups.get(sourceKey) || []), asset]);
  const hash = localHash(asset);
  if (hash) hashGroups.set(hash, [...(hashGroups.get(hash) || []), asset]);
}
const rejectedIds = new Map();
for (const [key, assets] of sourceGroups) {
  if (assets.length <= 1) continue;
  for (const asset of assets) if (newRecordIds.has(asset.id)) rejectedIds.set(asset.id, `same upstream image reused by ${assets.length} products (${key})`);
}
for (const [hash, assets] of hashGroups) {
  if (assets.length <= 1) continue;
  for (const asset of assets) if (newRecordIds.has(asset.id)) rejectedIds.set(asset.id, `same image bytes reused by ${assets.length} products (${hash.slice(0, 10)})`);
}
for (const asset of outputRecords) {
  if (!newRecordIds.has(asset.id)) continue;
  if (isBadImageUrl(asset.sourceImageUrl || "")) rejectedIds.set(asset.id, "generic/social/accessory image URL");
  if (isWeakSourcePage(asset.sourceUrl || "")) rejectedIds.set(asset.id, "source is a search/listing page rather than an exact product page");
}
if (rejectedIds.size) {
  for (const asset of outputRecords) if (rejectedIds.has(asset.id)) removeGeneratedAsset(asset, rejectedIds.get(asset.id));
  outputRecords = outputRecords.filter((asset) => !rejectedIds.has(asset.id));
}

const header = 'import type { EntityMedia } from "./types";\n\n// Generated from checked product source pages by scripts/backfill-product-media.mjs.\n// Local WebP derivatives are used at runtime; sourceImageUrl and sourceUrl preserve provenance.\n';
fs.writeFileSync(generatedPath, `${header}export const generatedProductMedia: EntityMedia[] = ${JSON.stringify(outputRecords, null, 2)};\n`);

const retainedNew = [...newRecordIds].filter((id) => outputRecords.some((asset) => asset.id === id)).length;
console.log(`\nBackfill complete: ${retainedNew} new images retained, ${generated.length} existing images preserved, ${failures.length} unresolved/rejected, ${missing.length} attempted.`);
if (failures.length) {
  console.log("\nUnresolved or rejected product images:");
  failures.forEach((item) => console.log(`- ${item}`));
}
