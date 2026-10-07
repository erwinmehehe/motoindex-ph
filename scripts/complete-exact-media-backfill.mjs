import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const scripts = {
  helmet: "scripts/audit-helmet-media-coverage.mjs",
  motorcycle: "scripts/audit-motorcycle-media-coverage.mjs"
};
const motorcycleFiles = [
  "lib/data.ts", "lib/phTier23ModelsBase.ts", "lib/phTier23ModelsExpansion2026.ts",
  "lib/phBrandExpansion2026.ts", "lib/phCoverageExpansion2026.ts",
  "lib/globalDemandExpansion2026.ts", "lib/kawasakiBigBikeExpansion2026.ts",
  "lib/motortradeGapExpansion2026.ts", "lib/zigwheelsGapExpansion2026.ts",
  ...[2, 3, 4, 5, 6, 7].map((n) => "lib/zigwheelsGapWave" + n + "_2026.ts"),
  "lib/heroExpansion2026.ts", "lib/currentModelGapCloseout2026.ts", "lib/historicalGapCloseout2026.ts"
];
const files = new Map([...["lib/catalog.ts", ...motorcycleFiles],].map((p) => [p, fs.readFileSync(path.join(root, p), "utf8")]));
const generatedPath = path.join(root, "lib/generatedProductMedia.ts");
const generatedText = fs.readFileSync(generatedPath, "utf8");
const start = generatedText.indexOf("export const generatedProductMedia");
const generated = JSON.parse("[" + generatedText.slice(generatedText.indexOf("[", start) + 1, generatedText.lastIndexOf("]")).trim() + "]");
const media = fs.readFileSync(path.join(root, "lib/media.ts"), "utf8");
const errors = [];
const results = [];
const brandFor = (id) => id.split("-")[0];
const words = (str) => String(str).toLowerCase().replace(/[^a-z0-9]/g, "");
const today = new Date().toISOString().slice(0, 10);
const userAgent = "Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)";
const badImage = /(logo|favicon|sprite|icon|payment|placeholder|spinner|loading|badge|avatar|tracking|pixel|banner|social|pinlock|visor-only|detail|retention|cheek-pad|parts|mechanism|size-chart|dimensions|specification|feature|ventilation)/i;
const badPage = /(shopee\.ph|\/search\/|\?q=)/i;
const sources = new Set(generated.map((x) => x.sourceImageUrl).filter(Boolean));
for (const m of media.matchAll(/sourceImageUrl\s*:\s*"([^"]+)"/g)) sources.add(m[1]);

function backlog(type) {
  const text = fs.readFileSync(path.join(root, scripts[type]), "utf8");
  const part = text.split("const knownBacklog = new Set([")[1]?.split("]);")[0] || "";
  return [...part.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}
function item(type, id) {
  const fileList = type === "helmet" ? ["lib/catalog.ts"] : motorcycleFiles;
  for (const filename of fileList) {
    const text = files.get(filename);
    const index = text.indexOf('id: "' + id + '"');
    if (index === -1) continue;
    const portion = text.slice(index, index + 2200);
    const get = (name) => portion.match(new RegExp("\\b" + name + "\\s*:\\s*\"([^\"]+)\""))?.[1] || "";
    const sourceUrl = get("sourceUrl");
    if (!sourceUrl) continue;
    return { type, id, model: get("model"), brand: get("brand") || brandFor(id), sourceUrl };
  }
  return null;
}
function decode(str) {
  return String(str).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function attrs(tag) {
  const a = {};
  for (const m of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) a[m[1].toLowerCase()] = decode(m[3]);
  return a;
}
function normUrl(raw, base) {
  try {
    const result = new URL(raw, base);
    return /^https?:$/.test(result.protocol) ? result.href : null;
  } catch { return null; }
}
function exactIn(haystack, model, id) {
  const compact = words(haystack);
  const expected = words(model);
  if (expected.length >= 3 && compact.includes(expected)) return true;
  const sku = words(id.slice(brandFor(id).length + 1));
  return sku.length >= 4 && compact.includes(sku);
}
function candidates(html, pageUrl, product) {
  const found = [];
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    const alt = a.alt || a.title || "";
    const raw = a["data-src"] || a["data-lazy-src"] || a.src || a.srcset?.split(/[ ,]+/)[0];
    const url = raw && normUrl(raw, pageUrl);
    if (!url || badImage.test(url) || badImage.test(alt)) continue;
    const matchAlt = exactIn(alt, product.model, product.id);
    const matchUrl = exactIn(new URL(url).pathname, product.model, product.id);
    if (!matchAlt && !matchUrl) continue;
    let score = (matchAlt ? 120 : 0) + (matchUrl ? 70 : 0);
    if (/front|3.4|three.quarter|side|left|right|slant|studio|product|solid/i.test(url + " " + alt)) score += 10;
    if (/gallery|zoom|woocommerce|product/i.test(tag)) score += 12;
    if (/back|rear|inner|open|close.up/i.test(url + " " + alt)) score -= 40;
    found.push({ url, score, alt });
  }
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    if (!/^(og:image|og:image:secure_url)$/i.test(a.property || a.name || "")) continue;
    const url = a.content && normUrl(a.content, pageUrl);
    if (!url || badImage.test(url)) continue;
    if (exactIn(new URL(url).pathname, product.model, product.id)) found.push({ url, score: 75, alt: "exact model Open Graph media" });
  }
  return [...new Map(found.sort((a, b) => b.score - a.score).map((c) => [c.url, c])).values()];
}
async function getImage(url, sourceUrl) {
  const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(17000),
    headers: { "user-agent": userAgent, accept: "image/webp,image/png,image/jpeg,image/*;q=0.8", referer: sourceUrl } });
  if (!response.ok) throw new Error("image HTTP " + response.status);
  if (!/^image\/(?:jpeg|png|webp|avif)/.test(response.headers.get("content-type") || "")) throw new Error("nonraster");
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 8000 || buffer.length > 12_000_000) throw new Error("image size " + buffer.length);
  const info = await sharp(buffer).metadata();
  if ((info.width || 0) < 350 || (info.height || 0) < 350) throw new Error("too small");
  if (Math.max(info.width, info.height) / Math.min(info.width, info.height) > 2.1) throw new Error("nonproduct aspect ratio");
  return buffer;
}
const work = [
  ...backlog("helmet").map((id) => item("helmet", id)),
  ...backlog("motorcycle").map((id) => item("motorcycle", id))
].filter(Boolean);
const distinctHashes = new Set();
const success = [];
async function run(p) {
  try {
    if (badPage.test(p.sourceUrl)) throw new Error("source page needs manual verification");
    const response = await fetch(p.sourceUrl, {
      redirect: "follow", signal: AbortSignal.timeout(17000),
      headers: { "user-agent": userAgent, accept: "text/html,application/xhtml+xml" }
    });
    if (!response.ok) throw new Error("source HTTP " + response.status);
    const url = response.url || p.sourceUrl;
    const html = await response.text();
    if (!exactIn(html.slice(0, 35000), p.model, p.id)) throw new Error("model text not confirmed on source page");
    const choices = candidates(html, url, p).slice(0, 12);
    if (!choices.length) throw new Error("no exact-model labeled image");
    for (const choice of choices) {
      if (sources.has(choice.url)) continue;
      try {
        const buffer = await getImage(choice.url, url);
        const hash = crypto.createHash("sha256").update(buffer).digest("hex");
        if (distinctHashes.has(hash)) throw new Error("duplicate product image");
        const local = "/media/" + (p.type === "helmet" ? "helmets" : "motorcycles") + "/" + p.id + ".webp";
        const output = path.join(root, "public", local.slice(1));
        fs.mkdirSync(path.dirname(output), { recursive: true });
        await sharp(buffer).rotate().resize(1200, 1200, {
          fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 }
        }).webp({ quality: 88, effort: 4 }).toFile(output);
        sources.add(choice.url);
        distinctHashes.add(hash);
        success.push({
          id: p.id + "-exact-product-20261007", entityType: p.type, entityId: p.id,
          role: "primary", src: local, sourceImageUrl: choice.url,
          alt: p.brand + " " + p.model + " exact product photo", width: 1200, height: 1200,
          rightsStatus: "external-reference", rightsHolder: p.brand,
          sourceLabel: "Exact-model labeled image from verified source page",
          sourceUrl: url, lastChecked: today
        });
        console.log("OK " + p.type + ":" + p.id + " [" + choice.score + "] " + choice.url);
        return;
      } catch (err) { errors.push(p.id + " image " + choice.url + ": " + err.message); }
    }
    throw new Error("no downloadable exact-model candidate");
  } catch (err) {
    results.push({ entityType: p.type, entityId: p.id, sourceUrl: p.sourceUrl, result: err.message });
    console.log("SKIP " + p.type + ":" + p.id + " " + err.message);
  }
}
for (let index = 0; index < work.length; index += 5) await Promise.all(work.slice(index, index + 5).map(run));
if (success.length) {
  const original = new Set(generated.map((p) => p.entityType + ":" + p.entityId));
  const additions = success.filter((p) => !original.has(p.entityType + ":" + p.entityId));
  const header = 'import type { EntityMedia } from "./types";\n\n// Generated from checked product source pages by scripts/backfill-product-media.mjs.\n// Local WebP derivatives are used at runtime; sourceImageUrl and sourceUrl preserve provenance.\n';
  fs.writeFileSync(generatedPath, header + "export const generatedProductMedia: EntityMedia[] = " + JSON.stringify([...generated, ...additions], null, 2) + ";\n");
}
fs.mkdirSync(path.join(root, "artifacts"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts", "exact-media-completion.json"), JSON.stringify({ date: today, targeted: work.length, added: success.map((x) => ({ entityId: x.entityId, entityType: x.entityType, sourceImageUrl: x.sourceImageUrl })), unresolved: results, failedCandidateUrls: errors }, null, 2));
console.log("Exact model source scan: " + success.length + "/" + work.length + " new local WebPs, " + results.length + " unmatched.");
