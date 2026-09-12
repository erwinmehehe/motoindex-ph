import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { URL } from "node:url";
import sharp from "sharp";

const root = process.cwd();
const catalogSource = fs.readFileSync(path.join(root, "lib/catalog.ts"), "utf8");
const mediaSource = fs.readFileSync(path.join(root, "lib/media.ts"), "utf8");
const generatedPath = path.join(root, "lib/generatedProductMedia.ts");
const generatedSource = fs.readFileSync(generatedPath, "utf8");
const today = new Date().toISOString().slice(0, 10);
const userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36";

function extractArray(source, declaration) {
  const start = source.indexOf(declaration);
  if (start < 0) return "";
  const equals = source.indexOf("=", start);
  const open = source.indexOf("[", equals);
  if (equals < 0 || open < 0) return "";
  let inString = false, escaped = false, quote = "", depth = 0;
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
  let inString = false, escaped = false, quote = "", depth = 0, start = -1;
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
function field(block, name) {
  return block.match(new RegExp(`["']?${name}["']?\\s*:\\s*["']([^"']+)["']`))?.[1];
}
function helmets() {
  return topLevelObjects(extractArray(catalogSource, "export const helmetProducts")).map((block) => ({
    id: field(block, "id"), brand: field(block, "brand"), model: field(block, "model"), status: field(block, "status"), sourceUrl: field(block, "sourceUrl")
  })).filter((item) => item.id && item.status === "verified" && item.brand === "LS2" && item.sourceUrl);
}
function curatedMediaKeys() {
  return new Set(topLevelObjects(extractArray(mediaSource, "export const entityMedia")).map((block) => ({
    entityType: field(block, "entityType"), entityId: field(block, "entityId"), rightsStatus: field(block, "rightsStatus")
  })).filter((item) => item.entityType === "helmet" && item.entityId && item.rightsStatus !== "pending").map((item) => item.entityId));
}
function generatedRecords() {
  const text = extractArray(generatedSource, "export const generatedProductMedia").trim();
  if (!text) return [];
  try { return JSON.parse(`[${text}]`); } catch { return []; }
}
function attrs(tag) {
  const out = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) out[match[1].toLowerCase()] = match[3].replace(/&amp;/g, "&");
  return out;
}
function absolute(value, base) {
  try { return new URL(value, base).href; } catch { return null; }
}
function normalizedTerms(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter((term) => term.length > 1);
}
function badUrl(url) {
  return /(?:logo|favicon|icon|sprite|pinlock|visor|liner|vent|intercom|size[-_ ]?chart|manual|youtube|play|flag|social|banner)/i.test(url);
}
function candidateImages(html, pageUrl, product) {
  const candidates = [];
  const terms = normalizedTerms(product.model).filter((term) => term !== "ls2");
  const push = (raw, score, reason, label = "") => {
    const url = raw && absolute(raw, pageUrl);
    if (!url || !/^https?:/.test(url) || badUrl(url)) return;
    const haystack = `${url} ${label}`.toLowerCase();
    const matches = terms.filter((term) => haystack.includes(term)).length;
    candidates.push({ url, score: score + matches * 8, reason, matches });
  };

  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const a = attrs(tag); const key = (a.property || a.name || "").toLowerCase();
    if (key === "og:image" || key === "og:image:url" || key === "og:image:secure_url") push(a.content, 120, key);
    if (key === "twitter:image" || key === "twitter:image:src") push(a.content, 110, key);
  }
  for (const script of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(script[1]);
      const visit = (node) => {
        if (!node) return;
        if (Array.isArray(node)) return node.forEach(visit);
        if (typeof node !== "object") return;
        if (typeof node.image === "string") push(node.image, 100, "jsonld");
        else if (Array.isArray(node.image)) node.image.forEach((value) => typeof value === "string" && push(value, 100, "jsonld"));
        else if (node.image?.url) push(node.image.url, 100, "jsonld");
        for (const value of Object.values(node)) if (value && typeof value === "object") visit(value);
      };
      visit(data);
    } catch {}
  }
  let imageIndex = 0;
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const a = attrs(tag); const raw = a.src || a["data-src"] || a["data-lazy-src"] || a.srcset?.split(/\s+/)[0];
    const label = `${a.alt || ""} ${a.title || ""}`;
    const baseScore = imageIndex < 12 ? 80 - imageIndex : 20;
    push(raw, baseScore, "page image", label);
    imageIndex += 1;
  }
  const seen = new Set();
  return candidates.sort((a, b) => b.score - a.score).filter((item) => !seen.has(item.url) && seen.add(item.url));
}

async function loadPage(sourceUrl) {
  const original = new URL(sourceUrl);
  const paths = [original.pathname + original.search];
  if (!original.pathname.startsWith("/en/")) paths.push(`/en${original.pathname}${original.search}`);
  const bases = ["https://ftp.ls2helmets.com", "https://ls2helmets.com"];
  let lastError = "no source attempted";
  for (const base of bases) for (const suffix of paths) {
    const url = `${base}${suffix}`;
    try {
      const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(18000), headers: { "user-agent": userAgent, accept: "text/html,application/xhtml+xml", "accept-language": "en-US,en;q=0.9" } });
      if (!response.ok) { lastError = `${url} HTTP ${response.status}`; continue; }
      return { html: await response.text(), pageUrl: response.url || url };
    } catch (error) { lastError = `${url} ${error instanceof Error ? error.message : String(error)}`; }
  }
  throw new Error(lastError);
}
async function fetchImage(candidate, referer) {
  const response = await fetch(candidate.url, { redirect: "follow", signal: AbortSignal.timeout(18000), headers: { "user-agent": userAgent, accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8", referer } });
  if (!response.ok) throw new Error(`image HTTP ${response.status}`);
  const type = response.headers.get("content-type") || "";
  if (!type.toLowerCase().startsWith("image/")) throw new Error(`not image: ${type}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(bytes).metadata();
  if ((metadata.width || 0) < 300 || (metadata.height || 0) < 300) throw new Error(`too small ${metadata.width || 0}x${metadata.height || 0}`);
  return bytes;
}

const generated = generatedRecords();
const existing = curatedMediaKeys();
for (const asset of generated) if (asset.entityType === "helmet") existing.add(asset.entityId);
const pending = helmets().filter((product) => !existing.has(product.id));
const additions = [];
const failures = [];

for (const product of pending) {
  try {
    const { html, pageUrl } = await loadPage(product.sourceUrl);
    const candidates = candidateImages(html, pageUrl, product);
    let chosen = null, bytes = null;
    for (const candidate of candidates.slice(0, 18)) {
      try { bytes = await fetchImage(candidate, pageUrl); chosen = candidate; break; } catch {}
    }
    if (!chosen || !bytes) throw new Error("no usable product image on official LS2 page");
    const src = `/media/helmets/${product.id}.webp`;
    const output = path.join(root, "public", src.replace(/^\//, ""));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    await sharp(bytes).rotate().resize({ width: 1200, height: 1200, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } }).webp({ quality: 84, effort: 4 }).toFile(output);
    const hash = crypto.createHash("sha256").update(fs.readFileSync(output)).digest("hex");
    additions.push({ record: {
      id: `${product.id}-generated-product`, entityType: "helmet", entityId: product.id, role: "primary", src,
      sourceImageUrl: chosen.url, alt: `${product.brand} ${product.model} product image`, width: 1200, height: 1200,
      rightsStatus: "external-reference", sourceLabel: `Checked official LS2 product image · ${product.model}`,
      sourceUrl: product.sourceUrl, lastChecked: today
    }, hash });
    console.log(`✓ LS2 ${product.id} <- ${chosen.url} (${chosen.reason}, score ${chosen.score})`);
  } catch (error) {
    failures.push(`${product.id}: ${error instanceof Error ? error.message : String(error)}`);
    console.log(`✗ LS2 ${product.id}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const hashGroups = new Map();
for (const item of additions) hashGroups.set(item.hash, [...(hashGroups.get(item.hash) || []), item]);
const rejected = new Set();
for (const items of hashGroups.values()) if (items.length > 1) for (const item of items) rejected.add(item.record.id);
for (const item of additions) {
  if (!rejected.has(item.record.id)) continue;
  const file = path.join(root, "public", item.record.src.replace(/^\//, ""));
  if (fs.existsSync(file)) fs.rmSync(file);
  failures.push(`${item.record.entityId}: duplicate image bytes matched another LS2 product`);
}

const retained = additions.filter((item) => !rejected.has(item.record.id)).map((item) => item.record);
const all = [...generated, ...retained];
const header = 'import type { EntityMedia } from "./types";\n\n// Generated from checked product source pages by scripts/backfill-product-media.mjs.\n// Local WebP derivatives are used at runtime; sourceImageUrl and sourceUrl preserve provenance.\n';
fs.writeFileSync(generatedPath, `${header}export const generatedProductMedia: EntityMedia[] = ${JSON.stringify(all, null, 2)};\n`);
console.log(`LS2 backfill: ${retained.length} added, ${failures.length} unresolved/rejected.`);
if (failures.length) failures.forEach((failure) => console.log(`- ${failure}`));
