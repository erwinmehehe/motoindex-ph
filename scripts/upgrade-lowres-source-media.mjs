import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const mediaPath = path.join(root, "lib/media.ts");
const generatedPath = path.join(root, "lib/generatedProductMedia.ts");
let mediaSource = fs.readFileSync(mediaPath, "utf8");
let generatedSource = fs.readFileSync(generatedPath, "utf8");
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const UA = "MotoIndexMediaQuality/1.0 (+https://motoindexph.com)";

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
  return block.match(new RegExp(`["']?${name}["']?\\s*:\\s*["']([^"']+)["']`))?.[1] || "";
}

function records(source, declaration, origin) {
  return topLevelObjects(extractArray(source, declaration)).map((block) => ({
    origin,
    entityType: field(block, "entityType"),
    entityId: field(block, "entityId"),
    src: field(block, "src"),
    sourceImageUrl: field(block, "sourceImageUrl"),
    sourceUrl: field(block, "sourceUrl"),
    rightsStatus: field(block, "rightsStatus"),
  })).filter((item) =>
    (item.entityType === "helmet" || item.entityType === "motorcycle") &&
    item.entityId &&
    item.src.startsWith("/media/") &&
    item.sourceImageUrl &&
    item.rightsStatus !== "pending"
  );
}

function scalePair(width, height, maxTarget = 1600) {
  const max = Math.max(width || 0, height || 0);
  if (!max || max >= maxTarget) return { width, height };
  const factor = maxTarget / max;
  return {
    width: width ? Math.round(width * factor) : width,
    height: height ? Math.round(height * factor) : height,
  };
}

function candidateFor(raw) {
  try {
    const url = new URL(raw);
    let changed = false;

    // Standard WordPress generated thumbnail suffix.
    const pathname = url.pathname.replace(/-(\d{2,4})x(\d{2,4})(?=\.[a-z0-9]+$)/i, (match, w, h) => {
      if (Math.max(Number(w), Number(h)) > 800) return match;
      changed = true;
      return "";
    });
    url.pathname = pathname;

    const widthKeys = ["width", "w"];
    const heightKeys = ["height", "h"];
    let widthKey = widthKeys.find((key) => /^\d+$/.test(url.searchParams.get(key) || ""));
    let heightKey = heightKeys.find((key) => /^\d+$/.test(url.searchParams.get(key) || ""));
    let width = widthKey ? Number(url.searchParams.get(widthKey)) : 0;
    let height = heightKey ? Number(url.searchParams.get(heightKey)) : 0;
    if ((width && width < 900) || (height && height < 900)) {
      const scaled = scalePair(width, height);
      if (widthKey && scaled.width) url.searchParams.set(widthKey, String(scaled.width));
      if (heightKey && scaled.height) url.searchParams.set(heightKey, String(scaled.height));
      changed = true;
    }

    return changed && url.href !== raw ? url.href : null;
  } catch {
    return null;
  }
}

async function fetchImage(url, referer) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    headers: {
      "user-agent": UA,
      accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",
      ...(referer ? { referer } : {}),
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const type = (response.headers.get("content-type") || "").toLowerCase();
  if (!type.startsWith("image/")) throw new Error(`not image (${type || "unknown"})`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`too small (${bytes.length} bytes)`);
  const meta = await sharp(bytes).metadata();
  return { bytes, width: meta.width || 0, height: meta.height || 0 };
}

function borderWhiteRatio(data, info) {
  const { width, height, channels } = info;
  const band = Math.max(4, Math.floor(Math.min(width, height) / 100));
  let white = 0, total = 0;
  const test = (x, y) => {
    const p = (y * width + x) * channels;
    total += 1;
    if (data[p] >= 238 && data[p + 1] >= 238 && data[p + 2] >= 238) white += 1;
  };
  for (let y = 0; y < band; y++) for (let x = 0; x < width; x++) test(x, y);
  for (let y = Math.max(0, height - band); y < height; y++) for (let x = 0; x < width; x++) test(x, y);
  for (let x = 0; x < band; x++) for (let y = 0; y < height; y++) test(x, y);
  for (let x = Math.max(0, width - band); x < width; x++) for (let y = 0; y < height; y++) test(x, y);
  return total ? white / total : 0;
}

async function writeSafeAsset(item, bytes) {
  const rotated = await sharp(bytes, { failOn: "warning" }).rotate().png().toBuffer();
  const flat = await sharp(rotated).flatten({ background: WHITE }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const whiteRatio = borderWhiteRatio(flat.data, flat.info);
  let subject = sharp(rotated).flatten({ background: WHITE });
  if (whiteRatio >= 0.92) subject = subject.trim({ background: "#ffffff", threshold: 10 });
  const box = item.entityType === "helmet" ? { width: 900, height: 900 } : { width: 1000, height: 880 };
  const fitted = await subject.resize({ ...box, fit: "inside", withoutEnlargement: false }).png().toBuffer();
  const dest = path.join(root, "public", item.src.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp({ create: { width: 1200, height: 1200, channels: 4, background: WHITE } })
    .composite([{ input: fitted, gravity: "centre" }])
    .flatten({ background: WHITE })
    .webp({ quality: 90, effort: 5, smartSubsample: true })
    .toFile(dest);
}

const curated = records(mediaSource, "export const entityMedia", "media");
const generated = records(generatedSource, "export const generatedProductMedia", "generated");
const effective = new Map();
for (const item of curated) effective.set(`${item.entityType}:${item.entityId}`, item);
for (const item of generated) {
  const key = `${item.entityType}:${item.entityId}`;
  if (!effective.has(key)) effective.set(key, item);
}

const targets = [...effective.values()].map((item) => ({ ...item, candidate: candidateFor(item.sourceImageUrl) })).filter((item) => item.candidate);
const results = [];

for (let i = 0; i < targets.length; i += 4) {
  const batch = targets.slice(i, i + 4);
  const done = await Promise.all(batch.map(async (item) => {
    try {
      const [current, candidate] = await Promise.all([
        fetchImage(item.sourceImageUrl, item.sourceUrl).catch(() => null),
        fetchImage(item.candidate, item.sourceUrl),
      ]);
      const currentArea = current ? current.width * current.height : 0;
      const candidateArea = candidate.width * candidate.height;
      const materiallyBetter = Math.max(candidate.width, candidate.height) >= 900 &&
        (!current || candidateArea >= currentArea * 1.25 || Math.max(candidate.width, candidate.height) > Math.max(current.width, current.height) * 1.2);
      if (!materiallyBetter) throw new Error(`candidate not materially better (${candidate.width}x${candidate.height})`);

      await writeSafeAsset(item, candidate.bytes);
      if (item.origin === "media") mediaSource = mediaSource.replace(item.sourceImageUrl, item.candidate);
      else generatedSource = generatedSource.replace(item.sourceImageUrl, item.candidate);
      console.log(`upgrade ${item.entityType}:${item.entityId} -> ${candidate.width}x${candidate.height}`);
      return { id: item.entityId, entityType: item.entityType, status: "upgraded", from: current ? `${current.width}x${current.height}` : "unavailable", to: `${candidate.width}x${candidate.height}`, url: item.candidate };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`keep ${item.entityType}:${item.entityId}: ${message}`);
      return { id: item.entityId, entityType: item.entityType, status: "kept", error: message };
    }
  }));
  results.push(...done);
}

fs.writeFileSync(mediaPath, mediaSource);
fs.writeFileSync(generatedPath, generatedSource);
const upgraded = results.filter((r) => r.status === "upgraded");
fs.mkdirSync(path.join(root, "artifacts"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts", "lowres-media-upgrade.json"), JSON.stringify({ targets: targets.length, upgraded: upgraded.length, results }, null, 2));
console.log(`Low-resolution media upgrade: ${upgraded.length}/${targets.length} upgraded.`);
