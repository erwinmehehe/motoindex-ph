import fs from "node:fs";
import path from "node:path";
import { URL } from "node:url";
import sharp from "sharp";

const root = process.cwd();
const mediaPath = path.join(root, "lib/media.ts");
let mediaSource = fs.readFileSync(mediaPath, "utf8");
const userAgent = "Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)";

const fallbackPages = {
  "bmw-r-1300-gs": {
    pageUrl: "https://www.press.bmwgroup.com/global/photo/detail/P90624522/BMW-R-1300-GS",
    rightsHolder: "BMW Group",
    sourceLabel: "Official BMW Motorrad media image · R 1300 GS",
    terms: ["bmw", "r 1300 gs", "r1300gs"]
  },
  "vespa-gtv-300": {
    pageUrl: "https://press.piaggiogroup.com/en_EN/post/show/253279/new-vespa-gtv.html",
    rightsHolder: "Piaggio Group",
    sourceLabel: "Official Piaggio Group press image · Vespa GTV",
    terms: ["vespa", "gtv", "gtv 300"]
  },
  "honda-rebel-1100": {
    pageUrl: "https://www.hondaph.com/big-bike/news/the-all-new-rebel1100-new-modern-street-bobber-style-bike",
    rightsHolder: "Honda Philippines",
    sourceLabel: "Official Honda Philippines product image · Rebel 1100",
    terms: ["honda", "rebel1100", "rebel 1100"]
  }
};

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

function field(block, name) {
  return block.match(new RegExp(`(?:^|[,\\s])(?:["']?${name}["']?)\\s*:\\s*["']([^"']+)["']`))?.[1];
}

function decodeHtml(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function attrs(tag) {
  const out = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) out[match[1].toLowerCase()] = decodeHtml(match[3]);
  return out;
}

function absolute(candidate, pageUrl) {
  try { return new URL(decodeHtml(candidate), pageUrl).href; } catch { return null; }
}

function isBadImageUrl(url) {
  return /(?:logo|favicon|sprite|icon|payment|placeholder|spinner|loading|badge|avatar|tracking|pixel|qr|newsletter)/i.test(url);
}

function setStringField(block, name, value) {
  const pattern = new RegExp(`\\b${name}\\s*:\\s*["'][^"']*["']`);
  if (pattern.test(block)) return block.replace(pattern, `${name}:${JSON.stringify(value)}`);
  return block.replace(/(\brole\s*:\s*["'][^"']+["']\s*,?)/, `$1 ${name}:${JSON.stringify(value)},`);
}

async function fetchImage(url, referer) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    headers: {
      "user-agent": userAgent,
      accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",
      ...(referer ? { referer } : {})
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const type = (response.headers.get("content-type") || "").toLowerCase();
  if (!type.startsWith("image/")) throw new Error(`not an image (${type || "unknown type"})`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`image too small (${bytes.length} bytes)`);
  const metadata = await sharp(bytes).metadata();
  if ((metadata.width || 0) < 250 || (metadata.height || 0) < 250) throw new Error(`dimensions too small (${metadata.width || 0}x${metadata.height || 0})`);
  return bytes;
}

function pageCandidates(html, pageUrl, terms) {
  const candidates = [];
  const add = (raw, score, reason, label = "") => {
    const url = raw && absolute(raw, pageUrl);
    if (!url || !/^https?:/i.test(url) || isBadImageUrl(url)) return;
    const haystack = `${url} ${label}`.toLowerCase();
    const matches = terms.filter((term) => haystack.includes(term.toLowerCase())).length;
    candidates.push({ url, score: score + matches * 18, reason });
  };

  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    const label = `${a.alt || ""} ${a.title || ""}`;
    const matchCount = terms.filter((term) => label.toLowerCase().includes(term.toLowerCase())).length;
    const raw = a.src || a["data-src"] || a["data-lazy-src"] || a["data-original"] || a.srcset?.split(/[\s,]+/)[0];
    if (matchCount) add(raw, 150 + matchCount * 15, "matching image", label);
  }

  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const a = attrs(tag);
    const key = (a.property || a.name || "").toLowerCase();
    if (key === "og:image" || key === "og:image:url" || key === "og:image:secure_url") add(a.content, 110, key);
    if (key === "twitter:image" || key === "twitter:image:src") add(a.content, 100, key);
  }

  for (const script of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(script[1].trim());
      const visit = (node) => {
        if (!node) return;
        if (Array.isArray(node)) return node.forEach(visit);
        if (typeof node !== "object") return;
        const name = typeof node.name === "string" ? node.name : "";
        if (typeof node.image === "string") add(node.image, 125, "jsonld", name);
        else if (Array.isArray(node.image)) node.image.forEach((value) => typeof value === "string" && add(value, 125, "jsonld", name));
        else if (node.image && typeof node.image.url === "string") add(node.image.url, 125, "jsonld", name);
        for (const value of Object.values(node)) if (value && typeof value === "object") visit(value);
      };
      visit(data);
    } catch {}
  }

  const seen = new Set();
  return candidates.sort((a, b) => b.score - a.score).filter((item) => !seen.has(item.url) && seen.add(item.url));
}

async function discoverFromOfficialPage(config) {
  const response = await fetch(config.pageUrl, {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    headers: { "user-agent": userAgent, accept: "text/html,application/xhtml+xml" }
  });
  if (!response.ok) throw new Error(`fallback page HTTP ${response.status}`);
  const html = await response.text();
  const pageUrl = response.url || config.pageUrl;
  const candidates = pageCandidates(html, pageUrl, config.terms);
  let lastError;
  for (const candidate of candidates.slice(0, 12)) {
    try {
      const bytes = await fetchImage(candidate.url, pageUrl);
      return { bytes, remote: candidate.url, pageUrl, reason: candidate.reason };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("no usable exact image found on official fallback page");
}

const blocks = topLevelObjects(extractArray(mediaSource, "export const entityMedia"));
const targets = blocks.map((block) => ({
  block,
  entityType: field(block, "entityType"),
  entityId: field(block, "entityId"),
  role: field(block, "role"),
  src: field(block, "src"),
  sourceImageUrl: field(block, "sourceImageUrl"),
  sourceUrl: field(block, "sourceUrl")
})).filter((item) => item.entityType === "motorcycle" && item.role === "primary" && item.entityId && /^https?:\/\//i.test(item.src || ""));

const successes = [];
const failures = [];
const outputDir = path.join(root, "public/media/motorcycles");
fs.mkdirSync(outputDir, { recursive: true });

for (const item of targets) {
  try {
    let remote = item.src;
    let sourcePage = item.sourceUrl;
    let bytes;
    let override = null;
    try {
      bytes = await fetchImage(remote, sourcePage);
    } catch (originalError) {
      override = fallbackPages[item.entityId];
      if (!override) throw originalError;
      const recovered = await discoverFromOfficialPage(override);
      bytes = recovered.bytes;
      remote = recovered.remote;
      sourcePage = recovered.pageUrl;
      console.log(`↳ motorcycle:${item.entityId} recovered via ${recovered.reason} on official fallback page`);
    }

    const localSrc = `/media/motorcycles/${item.entityId}.webp`;
    const output = path.join(root, "public", localSrc.slice(1));
    await sharp(bytes)
      .rotate()
      .resize({ width: 1200, height: 1200, fit: "contain", withoutEnlargement: false, background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .webp({ quality: 84, effort: 4 })
      .toFile(output);

    let updated = item.block;
    updated = setStringField(updated, "src", localSrc);
    updated = setStringField(updated, "sourceImageUrl", remote);
    updated = setStringField(updated, "sourceUrl", sourcePage);
    if (override) {
      updated = setStringField(updated, "rightsHolder", override.rightsHolder);
      updated = setStringField(updated, "sourceLabel", override.sourceLabel);
    }
    updated = updated.replace(/\bwidth\s*:\s*\d+\s*,\s*height\s*:\s*\d+/, "width:1200, height:1200");
    if (updated === item.block) throw new Error("could not rewrite media record");
    mediaSource = mediaSource.replace(item.block, updated);
    successes.push(item.entityId);
    console.log(`✓ motorcycle:${item.entityId} localized from ${remote}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${item.entityId}: ${message}`);
    console.log(`✗ motorcycle:${item.entityId}: ${message}`);
  }
}

fs.writeFileSync(mediaPath, mediaSource);
console.log(`\nMotorcycle media localization: ${successes.length}/${targets.length} localized, ${failures.length} unresolved.`);
if (failures.length) {
  console.log("Unresolved motorcycle media:");
  failures.forEach((failure) => console.log(`- ${failure}`));
}
