import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "scripts/data/helmet-image-closeout-20261008.json"), "utf8"));
const generatedPath = path.join(root, "lib/generatedProductMedia.ts");
const backlogPath = path.join(root, "scripts/audit-helmet-media-coverage.mjs");
const catalog = fs.readFileSync(path.join(root, "lib/catalog.ts"), "utf8");
const helmetBlock = catalog.split("export const helmetProducts")[1]?.split("export const tireProducts")[0] || "";
const ids = new Set([...helmetBlock.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]));
const existingSource = fs.readFileSync(generatedPath, "utf8");
const start = existingSource.indexOf("export const generatedProductMedia");
const assignment = existingSource.indexOf("=", start);
const arrayStart = existingSource.indexOf("[", assignment);
const arrayEnd = existingSource.lastIndexOf("]");
if (start < 0 || assignment < 0 || arrayStart < 0 || arrayEnd < arrayStart) throw new Error("Generated media array not found");
const records = JSON.parse(existingSource.slice(arrayStart, arrayEnd + 1));
const byId = new Map(records.filter((x) => x.entityType === "helmet").map((x) => [x.entityId, x]));
const report = { checkedAt: manifest.checkedAt, accepted: manifest.accepted.length, added: [], existing: [], rejected: [], needsReview: manifest.review.map((x) => x.entityId) };
const white = { r: 255, g: 255, b: 255, alpha: 1 };
const userAgent = "MotoIndexHelmetSourceCloseout/1.0 (+https://motoindexph.com/methodology)";

async function fetchSource(item) {
  const url = new URL(item.imageUrl);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid source protocol");
  const res = await fetch(url, {
    signal: AbortSignal.timeout(25000),
    redirect: "follow",
    headers: { "user-agent": userAgent, accept: "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8", referer: item.sourceUrl }
  });
  if (!res.ok) throw new Error(`Source HTTP ${res.status}`);
  const mime = (res.headers.get("content-type") || "").toLowerCase();
  if (!mime.startsWith("image/")) throw new Error(`Unexpected MIME ${mime || "unknown"}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length < 7000 || bytes.length > 20_000_000) throw new Error(`Invalid source size ${bytes.length}`);
  const meta = await sharp(bytes, { failOn: "warning" }).metadata();
  const width = meta.width || 0, height = meta.height || 0;
  if (width < 400 || height < 400) throw new Error(`Source too small ${width}x${height}`);
  if (Math.max(width, height) / Math.min(width, height) > 2.0) throw new Error("Source composition too wide/tall to be an exact hero");
  return bytes;
}

function normalizedRectangle(rect, width, height) {
  const left = Math.max(0, Math.floor(rect.left * width));
  const top = Math.max(0, Math.floor(rect.top * height));
  const right = Math.min(width, Math.ceil((rect.left + rect.width) * width));
  const bottom = Math.min(height, Math.ceil((rect.top + rect.height) * height));
  if (right <= left || bottom <= top) throw new Error("Invalid source crop/cleanup rectangle");
  return { left, top, width: right - left, height: bottom - top };
}

async function prepareSource(item, bytes) {
  let prepared = await sharp(bytes, { failOn: "warning" }).rotate().flatten({ background: white }).png().toBuffer();
  const meta = await sharp(prepared).metadata();
  if (item.whiteOutFrac?.length) {
    const overlays = [];
    for (const rect of item.whiteOutFrac) {
      const x = normalizedRectangle(rect, meta.width, meta.height);
      const patch = await sharp({ create: { width: x.width, height: x.height, channels: 4, background: white } }).png().toBuffer();
      overlays.push({ input: patch, left: x.left, top: x.top });
    }
    prepared = await sharp(prepared).composite(overlays).png().toBuffer();
  }
  if (item.cropFrac) {
    const crop = normalizedRectangle(item.cropFrac, meta.width, meta.height);
    prepared = await sharp(prepared).extract(crop).png().toBuffer();
  }
  if (item.removeNeutralBackdrop) {
    const { data, info } = await sharp(prepared).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;
    const seen = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let front = 0, back = 0;
    const eligible = (index) => {
      const p = index * channels;
      const r = data[p], g = data[p + 1], b = data[p + 2];
      return Math.max(r, g, b) - Math.min(r, g, b) <= 12 && Math.min(r, g, b) >= 90;
    };
    const enqueue = (index) => {
      if (seen[index] || !eligible(index)) return;
      seen[index] = 1;
      queue[back++] = index;
    };
    for (let x = 0; x < width; x++) { enqueue(x); enqueue((height - 1) * width + x); }
    for (let y = 0; y < height; y++) { enqueue(y * width); enqueue(y * width + width - 1); }
    while (front < back) {
      const index = queue[front++], x = index % width, y = Math.floor(index / width);
      const p = index * channels;
      data[p] = data[p + 1] = data[p + 2] = 255;
      if (x > 0) enqueue(index - 1);
      if (x + 1 < width) enqueue(index + 1);
      if (y > 0) enqueue(index - width);
      if (y + 1 < height) enqueue(index + width);
    }
    prepared = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
  }
  return prepared;
}

async function localize(item) {
  const target = path.join(root, "public/media/helmets", `${item.entityId}.webp`);
  const bytes = await fetchSource(item);
  const cleaned = await prepareSource(item, bytes);
  const subject = await sharp(cleaned, { failOn: "warning" })
    .resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
  const result = await sharp({ create: { width: 1200, height: 1200, channels: 4, background: white } })
    .composite([{ input: subject, gravity: "centre" }])
    .flatten({ background: white })
    .webp({ quality: 90, effort: 5, smartSubsample: true })
    .toBuffer();
  const check = await sharp(result).metadata();
  if (check.width !== 1200 || check.height !== 1200 || check.format !== "webp") throw new Error("Non-canonical output");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, result);
  return target;
}

for (const item of manifest.accepted) {
  if (!ids.has(item.entityId)) throw new Error(`Unknown helmet catalog ID: ${item.entityId}`);
  if (manifest.review.some((x) => x.entityId === item.entityId)) throw new Error(`Conflicting status: ${item.entityId}`);
  const existingFile = path.join(root, "public/media/helmets", `${item.entityId}.webp`);
  if (fs.existsSync(existingFile)) {
    report.existing.push(item.entityId);
    continue;
  }
  try {
    await localize(item);
    if (!byId.has(item.entityId)) {
      const row = {
        id: `${item.entityId}-exact-source-20261008`,
        entityType: "helmet", entityId: item.entityId, role: "primary",
        src: `/media/helmets/${item.entityId}.webp`,
        sourceImageUrl: item.imageUrl,
        alt: `${item.entityId.replaceAll("-", " ")} exact-model motorcycle helmet product photograph`,
        width: 1200, height: 1200, rightsStatus: "external-reference",
        rightsHolder: item.rightsHolder,
        sourceLabel: item.sourceLabel,
        sourceUrl: item.sourceUrl,
        lastChecked: manifest.checkedAt
      };
      records.push(row);
      byId.set(item.entityId, row);
    }
    report.added.push(item.entityId);
    console.log(`localized helmet:${item.entityId}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    report.rejected.push({ entityId: item.entityId, reason: message });
    console.warn(`UNRESOLVED helmet:${item.entityId}: ${message}`);
  }
}
const successful = new Set([...report.added, ...report.existing]);
const next = existingSource.slice(0, arrayStart) + JSON.stringify(records, null, 2) + existingSource.slice(arrayEnd + 1);
fs.writeFileSync(generatedPath, next);
let audit = fs.readFileSync(backlogPath, "utf8");
const block = audit.match(/const knownBacklog = new Set\(\[([\s\S]*?)\]\);/);
if (!block) throw new Error("Known backlog block not found");
const remaining = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]).filter((id) => !successful.has(id));
audit = audit.replace(block[0], "const knownBacklog = new Set([\n" + remaining.map((id) => `  "${id}",`).join("\n") + "\n]);");
fs.writeFileSync(backlogPath, audit);
fs.mkdirSync(path.join(root, "artifacts"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts/helmet-closeout-results.json"), JSON.stringify({ ...report, remaining }, null, 2));
console.log(`Helmet closeout: ${report.added.length} new, ${report.existing.length} already present, ${report.rejected.length} failed downloads, ${report.needsReview.length} held for source review, ${remaining.length} backlog left.`);
