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

const officialFallbacks = {
  "smk-bionic-youth": "/helmet/full-face-helmets/bionic-youth/bionic-youth-solid/",
  "smk-agnar": "/helmet/full-face-helmets/agnar/agnar-solid/",
  "smk-titan": "/helmet/full-face-helmets/titan/titan-solid/",
  "smk-titan-carbon": "/helmet/full-face-helmets/titan-carbon/titan-carbon-solid/",
  "smk-allterra": "/helmet/off-road-helmets/allterra/allterra-solid/",
  "smk-ares": "/helmet/dual-sport/ares/ares-solid/",
  "smk-laminar": "/helmet/open-face-helmets/laminar/laminar-solid/",
  "smk-retro-jet": "/helmet/open-face-helmets/retro-jet/retro-jet-solid/",
  "smk-delta-tour": "/helmet/demi-jet-helmets/delta-tour/delta-tour-solid/",
  "smk-nova": "/helmet/full-face-helmets/nova/nova-solid/",
  "smk-retro": "/helmet/full-face-helmets/retro/retro-solid/",
  "smk-stellar": "/helmet/full-face-helmets/stellar/stellar-solid/",
  "smk-cygnus": "/helmet/flip-back-helmets/cygnus/cygnus-solid/",
  "smk-typhoon": "/helmet/full-face-helmets/typhoon/typhoon-solid/",
  "smk-gullwing": "/helmet/modular-helmets/gullwing/gullwing-solid/"
};

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
  })).filter((item) => item.id && item.status === "verified" && item.brand === "SMK" && item.sourceUrl);
}

function generatedRecords() {
  const body = extractArray(generatedSource, "export const generatedProductMedia").trim();
  if (!body) return [];
  try { return JSON.parse(`[${body}]`); } catch { return []; }
}

function curatedKeys() {
  return new Set(topLevelObjects(extractArray(mediaSource, "export const entityMedia")).map((block) => ({
    entityType: field(block, "entityType"), entityId: field(block, "entityId"), rightsStatus: field(block, "rightsStatus")
  })).filter((item) => item.entityType === "helmet" && item.entityId && item.rightsStatus !== "pending").map((item) => item.entityId));
}

function decodeHtml(value) {
  return String(value || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function attrs(tag) {
  const out = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) out[match[1].toLowerCase()] = decodeHtml(match[3]);
  return out;
}

function terms(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter((term) => term.length > 2 && !["smk", "helmet", "helmets"].includes(term));
}

function badImage(url, label) {
  return /(?:logo|favicon|icon|sprite|pinlock|visor|liner|vent|intercom|size[-_ ]?chart|manual|youtube|video|play|flag|social|banner|part|accessor)/i.test(`${url} ${label}`);
}

function pageUrls(product) {
  const urls = [];
  const add = (value) => { if (value && !urls.includes(value)) urls.push(value); };
  const fallback = officialFallbacks[product.id];
  if (fallback) {
    add(`https://www.smkhelmets.com${fallback}`);
    add(`https://smkhelmets.com${fallback}`);
  }
  try {
    const source = new URL(product.sourceUrl);
    add(`https://www.smkhelmets.com${source.pathname}${source.search}`);
    add(`https://smkhelmets.com${source.pathname}${source.search}`);
    add(product.sourceUrl);
  } catch {
    add(product.sourceUrl);
  }
  return urls;
}

async function fetchFollowingRedirects(url) {
  let current = url;
  const visited = new Set();
  for (let hop = 0; hop < 6; hop += 1) {
    if (visited.has(current)) throw new Error("redirect loop");
    visited.add(current);
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(18000),
      headers: { "user-agent": userAgent, accept: "text/html,application/xhtml+xml", "accept-language": "en-US,en;q=0.9" }
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`HTTP ${response.status} without location`);
      current = new URL(location, current).href;
      continue;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { html: await response.text(), pageUrl: response.url || current };
  }
  throw new Error("too many redirects");
}

async function loadPage(product) {
  const failures = [];
  for (const url of pageUrls(product)) {
    try { return await fetchFollowingRedirects(url); }
    catch (error) { failures.push(`${url}: ${error instanceof Error ? error.message : String(error)}`); }
  }
  throw new Error(failures.join(" | "));
}

function imageCandidates(html, pageUrl, product) {
  const modelTerms = terms(product.model);
  const candidates = [];
  let index = 0;
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    const raw = a.src || a["data-src"] || a["data-lazy-src"] || a["data-original"] || a.srcset?.split(/[\s,]+/)[0];
    if (!raw) { index += 1; continue; }
    let url;
    try { url = new URL(raw, pageUrl).href; } catch { index += 1; continue; }
    const label = `${a.alt || ""} ${a.title || ""}`;
    if (badImage(url, label)) { index += 1; continue; }
    const haystack = `${url} ${label}`.toLowerCase();
    const matches = modelTerms.filter((term) => haystack.includes(term)).length;
    const required = modelTerms.length <= 1 ? 1 : Math.min(2, modelTerms.length);
    if (matches < required) { index += 1; continue; }
    candidates.push({ url, score: matches * 30 + Math.max(0, 20 - index), label });
    index += 1;
  }
  const seen = new Set();
  return candidates.sort((a, b) => b.score - a.score).filter((item) => !seen.has(item.url) && seen.add(item.url));
}

async function fetchImage(url, referer) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(18000),
    headers: { "user-agent": userAgent, accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8", referer }
  });
  if (!response.ok) throw new Error(`image HTTP ${response.status}`);
  const type = (response.headers.get("content-type") || "").toLowerCase();
  if (!type.startsWith("image/")) throw new Error(`not image: ${type || "unknown"}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(bytes).metadata();
  if ((metadata.width || 0) < 300 || (metadata.height || 0) < 300) throw new Error(`too small ${metadata.width || 0}x${metadata.height || 0}`);
  return bytes;
}

function hashFile(src) {
  try {
    return crypto.createHash("sha256").update(fs.readFileSync(path.join(root, "public", src.replace(/^\//, "")))).digest("hex");
  } catch { return ""; }
}

const generated = generatedRecords();
const existing = curatedKeys();
for (const asset of generated) if (asset.entityType === "helmet") existing.add(asset.entityId);
const pending = helmets().filter((product) => !existing.has(product.id) && product.id !== "smk-delta-city");
const existingHashes = new Set(generated.map((asset) => hashFile(asset.src)).filter(Boolean));
const additions = [];
const failures = [];

for (const product of pending) {
  try {
    const { html, pageUrl } = await loadPage(product);
    const candidates = imageCandidates(html, pageUrl, product);
    let chosen = null;
    let bytes = null;
    for (const candidate of candidates.slice(0, 12)) {
      try {
        bytes = await fetchImage(candidate.url, pageUrl);
        const candidateHash = crypto.createHash("sha256").update(bytes).digest("hex");
        if (existingHashes.has(candidateHash) || additions.some((item) => item.hash === candidateHash)) continue;
        chosen = candidate;
        break;
      } catch {}
    }
    if (!chosen || !bytes) throw new Error("no unique exact SMK product image candidate found");

    const src = `/media/helmets/${product.id}.webp`;
    const output = path.join(root, "public", src.replace(/^\//, ""));
    fs.mkdirSync(path.dirname(output), { recursive: true });
    await sharp(bytes).rotate().resize({ width: 1200, height: 1200, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } }).webp({ quality: 84, effort: 4 }).toFile(output);
    const hash = hashFile(src);
    additions.push({
      hash,
      record: {
        id: `${product.id}-generated-product`, entityType: "helmet", entityId: product.id, role: "primary", src,
        sourceImageUrl: chosen.url, alt: `${product.brand} ${product.model} product image`, width: 1200, height: 1200,
        rightsStatus: "external-reference", rightsHolder: "SMK Helmets",
        sourceLabel: `Checked official SMK product image · ${product.model}`,
        sourceUrl: pageUrl, lastChecked: today
      }
    });
    existingHashes.add(hash);
    console.log(`✓ SMK ${product.id} <- ${chosen.url}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${product.id}: ${message}`);
    console.log(`✗ SMK ${product.id}: ${message}`);
  }
}

const all = [...generated, ...additions.map((item) => item.record)];
const header = 'import type { EntityMedia } from "./types";\n\n// Generated from checked product source pages by scripts/backfill-product-media.mjs.\n// Local WebP derivatives are used at runtime; sourceImageUrl and sourceUrl preserve provenance.\n';
fs.writeFileSync(generatedPath, `${header}export const generatedProductMedia: EntityMedia[] = ${JSON.stringify(all, null, 2)};\n`);
console.log(`SMK backfill: ${additions.length} added, ${failures.length} unresolved.`);
if (failures.length) failures.forEach((failure) => console.log(`- ${failure}`));
