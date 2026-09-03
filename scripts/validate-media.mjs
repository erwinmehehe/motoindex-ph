import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const source = fs.readFileSync(path.join(ROOT, "lib", "media.ts"), "utf8");
const blocks = source.match(/  \{[\s\S]*?\n  \},/g) || [];
const strict = process.env.MEDIA_STRICT_LOCAL === "1";
const folder = { motorcycle: "motorcycles", helmet: "helmets", tire: "tires", topbox: "top-boxes" };
const errors = [];
const missing = [];
const keys = new Set();

function field(block, name) {
  const match = block.match(new RegExp(`${name}:\\s*"([^"]+)"`));
  return match?.[1];
}
function numberField(block, name) {
  const match = block.match(new RegExp(`${name}:\\s*(\\d+)`));
  return match ? Number(match[1]) : undefined;
}

for (const block of blocks) {
  const type = field(block, "entityType");
  const id = field(block, "entityId");
  const role = field(block, "role");
  const src = field(block, "src");
  const upstream = field(block, "sourceImageUrl");
  const alt = field(block, "alt");
  const width = numberField(block, "width");
  const height = numberField(block, "height");
  if (!type || !id || !src) { errors.push("A media record is missing entityType/entityId/src."); continue; }

  const key = `${type}:${id}`;
  if (keys.has(key)) errors.push(`${key} has more than one primary media record.`);
  keys.add(key);
  if (role !== "primary") errors.push(`${key} must declare role: \"primary\".`);
  if (!alt || alt.length < 12 || /^(image|photo|motorcycle|helmet)$/i.test(alt.trim())) errors.push(`${key} needs useful descriptive alt text.`);

  if (type === "site") continue;
  const expectedPrefix = `/media/${folder[type]}/`;
  if (!src.startsWith(expectedPrefix) || !src.endsWith(".webp")) errors.push(`${key} must use a local WebP path under ${expectedPrefix}.`);
  if (width !== 1200 || height !== 1200) errors.push(`${key} must declare the standardized 1200x1200 primary canvas.`);
  if (upstream && !upstream.startsWith("https://")) errors.push(`${key} upstream source must be HTTPS.`);
  if (!/^[a-z0-9][a-z0-9-]*\.webp$/.test(path.basename(src))) errors.push(`${key} filename must be lowercase kebab-case WebP.`);

  const local = path.join(ROOT, "public", src.replace(/^\//, ""));
  if (!fs.existsSync(local)) missing.push({ key, src });
}

if (errors.length) {
  console.error("Media validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

if (strict && missing.length) {
  console.error(`Media validation failed: ${missing.length} standardized local images are missing.`);
  for (const item of missing.slice(0, 20)) console.error(`- ${item.key}: ${item.src}`);
  if (missing.length > 20) console.error(`- ...and ${missing.length - 20} more`);
  process.exit(1);
}

if (missing.length) {
  console.log(`Media schema passed. ${missing.length} local derivatives are pending sync; remote source fallback remains available during migration.`);
  console.log("Run `npm run media:sync` in a networked project environment, then `MEDIA_STRICT_LOCAL=1 npm run validate:media` before removing remote fallbacks.");
} else {
  console.log(`Media validation passed: ${keys.size} entities have one standardized primary image record and all local derivatives exist.`);
}
