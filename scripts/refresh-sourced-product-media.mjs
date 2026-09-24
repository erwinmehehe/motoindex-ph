import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = process.cwd();
const mediaSource = fs.readFileSync(path.join(root, "lib/media.ts"), "utf8");
const generatedSource = fs.readFileSync(path.join(root, "lib/generatedProductMedia.ts"), "utf8");
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const args = process.argv.slice(2);
const typeArg = args.find((arg) => arg.startsWith("--types="));
const targetTypes = new Set((typeArg ? typeArg.split("=", 2)[1] : "helmet").split(",").filter(Boolean));
const onlyArg = args.find((arg) => arg.startsWith("--only="));
const onlyIds = onlyArg ? new Set(onlyArg.split("=", 2)[1].split(",").filter(Boolean)) : null;
const userAgent = "MotoIndexMediaRefresh/1.0 (+https://motoindexph.com)";

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
    targetTypes.has(item.entityType) &&
    item.entityId &&
    item.src.startsWith("/media/") &&
    item.sourceImageUrl &&
    item.rightsStatus !== "pending" &&
    (!onlyIds || onlyIds.has(item.entityId))
  );
}

const preferred = new Map();
for (const item of records(mediaSource, "export const entityMedia", "curated")) {
  preferred.set(`${item.entityType}:${item.entityId}`, item);
}
for (const item of records(generatedSource, "export const generatedProductMedia", "generated")) {
  const key = `${item.entityType}:${item.entityId}`;
  if (!preferred.has(key)) preferred.set(key, item);
}
const items = [...preferred.values()];

async function fetchImage(item) {
  const response = await fetch(item.sourceImageUrl, {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    headers: {
      "user-agent": userAgent,
      accept: "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8",
      ...(item.sourceUrl ? { referer: item.sourceUrl } : {}),
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const type = (response.headers.get("content-type") || "").toLowerCase();
  if (!type.startsWith("image/")) throw new Error(`unexpected content-type ${type || "unknown"}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error(`image too small (${bytes.length} bytes)`);
  return bytes;
}

function borderWhiteRatio(data, info) {
  const { width, height, channels } = info;
  const band = Math.max(4, Math.floor(Math.min(width, height) / 100));
  let white = 0, total = 0;
  const check = (x, y) => {
    const p = (y * width + x) * channels;
    total += 1;
    if (data[p] >= 238 && data[p + 1] >= 238 && data[p + 2] >= 238) white += 1;
  };
  for (let y = 0; y < band; y += 1) for (let x = 0; x < width; x += 1) check(x, y);
  for (let y = Math.max(0, height - band); y < height; y += 1) for (let x = 0; x < width; x += 1) check(x, y);
  for (let x = 0; x < band; x += 1) for (let y = 0; y < height; y += 1) check(x, y);
  for (let x = Math.max(0, width - band); x < width; x += 1) for (let y = 0; y < height; y += 1) check(x, y);
  return total ? white / total : 0;
}

async function normalize(item, bytes) {
  const rotated = await sharp(bytes, { failOn: "warning" }).rotate().png().toBuffer();
  const flattened = await sharp(rotated).flatten({ background: WHITE }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const whiteRatio = borderWhiteRatio(flattened.data, flattened.info);

  let subject = sharp(rotated).flatten({ background: WHITE });
  let method = "preserve-full-frame";
  if (whiteRatio >= 0.92) {
    subject = subject.trim({ background: "#ffffff", threshold: 10 });
    method = "white-border-trim";
  }

  const box = item.entityType === "helmet" ? { width: 900, height: 900 } : { width: 1000, height: 880 };
  const fitted = await subject
    .resize({ ...box, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();

  const dest = path.join(root, "public", item.src.replace(/^\//, ""));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp({ create: { width: 1200, height: 1200, channels: 4, background: WHITE } })
    .composite([{ input: fitted, gravity: "centre" }])
    .flatten({ background: WHITE })
    .webp({ quality: 90, effort: 5, smartSubsample: true })
    .toFile(dest);
  return { method, whiteRatio: Number(whiteRatio.toFixed(4)) };
}

const results = [];
for (let i = 0; i < items.length; i += 5) {
  const batch = items.slice(i, i + 5);
  const done = await Promise.all(batch.map(async (item) => {
    try {
      const bytes = await fetchImage(item);
      const info = await normalize(item, bytes);
      console.log(`refresh ${item.entityType}:${item.entityId} [${item.origin}] ${info.method}`);
      return { ...item, status: "updated", ...info };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`skip ${item.entityType}:${item.entityId}: ${message}`);
      return { ...item, status: "failed", error: message };
    }
  }));
  results.push(...done);
}

const updated = results.filter((r) => r.status === "updated");
const failed = results.filter((r) => r.status === "failed");
const report = {
  types: [...targetTypes],
  requested: items.length,
  updated: updated.length,
  failed: failed.length,
  results,
};
fs.mkdirSync(path.join(root, "artifacts"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts", "source-media-refresh.json"), JSON.stringify(report, null, 2));
console.log(`Source media refresh: ${updated.length}/${items.length} updated, ${failed.length} failed.`);
if (failed.length) {
  console.log("Unrefreshed records:");
  for (const item of failed) console.log(`- ${item.entityType}:${item.entityId}: ${item.error}`);
}
if (process.env.MEDIA_REFRESH_STRICT === "1" && failed.length) process.exit(1);
