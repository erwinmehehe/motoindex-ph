import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const mediaPath = path.join(root, "lib/media.ts");
let mediaSource = fs.readFileSync(mediaPath, "utf8");
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

function field(block, name) {
  return block.match(new RegExp(`(?:^|[,\\s])(?:["']?${name}["']?)\\s*:\\s*["']([^"']+)["']`))?.[1];
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
    const remote = item.src;
    const bytes = await fetchImage(remote, item.sourceUrl);
    const localSrc = `/media/motorcycles/${item.entityId}.webp`;
    const output = path.join(root, "public", localSrc.slice(1));
    await sharp(bytes)
      .rotate()
      .resize({ width: 1200, height: 1200, fit: "contain", withoutEnlargement: false, background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .webp({ quality: 84, effort: 4 })
      .toFile(output);

    let updated = item.block;
    const srcPattern = /\bsrc\s*:\s*["'][^"']+["']/;
    if (item.sourceImageUrl) {
      updated = updated.replace(srcPattern, `src:${JSON.stringify(localSrc)}`);
    } else {
      updated = updated.replace(srcPattern, `src:${JSON.stringify(localSrc)}, sourceImageUrl:${JSON.stringify(remote)}`);
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
