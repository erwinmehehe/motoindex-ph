import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogSource = fs.readFileSync(path.join(root, "lib/catalog.ts"), "utf8");
const mediaSource = fs.readFileSync(path.join(root, "lib/media.ts"), "utf8");
const generatedMediaPath = path.join(root, "lib/generatedProductMedia.ts");
const generatedMediaSource = fs.existsSync(generatedMediaPath) ? fs.readFileSync(generatedMediaPath, "utf8") : "";

function extractArray(source, declaration) {
  const start = source.indexOf(declaration);
  if (start < 0) return "";
  const equals = source.indexOf("=", start);
  if (equals < 0) throw new Error(`Could not find assignment for ${declaration}`);
  const open = source.indexOf("[", equals);
  if (open < 0) throw new Error(`Could not find array start for ${declaration}`);

  let inString = false;
  let quote = "";
  let escaped = false;
  let bracketDepth = 0;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === "[") bracketDepth += 1;
    else if (ch === "]") {
      bracketDepth -= 1;
      if (bracketDepth === 0) return source.slice(open + 1, i);
    }
  }
  throw new Error(`Unclosed array for ${declaration}`);
}

function topLevelObjects(arrayText) {
  if (!arrayText) return [];
  const objects = [];
  let inString = false;
  let quote = "";
  let escaped = false;
  let braceDepth = 0;
  let objectStart = -1;
  for (let i = 0; i < arrayText.length; i += 1) {
    const ch = arrayText[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === "{") {
      if (braceDepth === 0) objectStart = i;
      braceDepth += 1;
    } else if (ch === "}") {
      braceDepth -= 1;
      if (braceDepth === 0 && objectStart >= 0) {
        objects.push(arrayText.slice(objectStart, i + 1));
        objectStart = -1;
      }
    }
  }
  return objects;
}

function stringField(block, name) {
  return block.match(new RegExp(`["']?${name}["']?\\s*:\\s*["']([^"']+)["']`))?.[1];
}

function catalogRecords(declaration, entityType) {
  return topLevelObjects(extractArray(catalogSource, declaration))
    .map((block) => ({
      id: stringField(block, "id"),
      brand: stringField(block, "brand"),
      model: stringField(block, "model"),
      status: stringField(block, "status"),
      sourceUrl: stringField(block, "sourceUrl"),
      entityType
    }))
    .filter((item) => item.id && item.status === "verified");
}

function mediaRecords(source, declaration) {
  return topLevelObjects(extractArray(source, declaration))
    .map((block) => ({
      entityId: stringField(block, "entityId"),
      entityType: stringField(block, "entityType"),
      rightsStatus: stringField(block, "rightsStatus")
    }))
    .filter((item) => item.entityId && item.entityType && item.rightsStatus !== "pending");
}

const products = [
  ...catalogRecords("export const helmetProducts", "helmet"),
  ...catalogRecords("export const tireProducts", "tire"),
  ...catalogRecords("export const topBoxProducts", "topbox")
];

const media = [
  ...mediaRecords(mediaSource, "export const entityMedia"),
  ...mediaRecords(generatedMediaSource, "export const generatedProductMedia")
];

const mediaKeys = new Set(media.map((item) => `${item.entityType}:${item.entityId}`));
const missing = products.filter((item) => !mediaKeys.has(`${item.entityType}:${item.id}`));
const byType = new Map();
for (const product of products) byType.set(product.entityType, (byType.get(product.entityType) || 0) + 1);
const missingByType = new Map();
for (const product of missing) missingByType.set(product.entityType, (missingByType.get(product.entityType) || 0) + 1);

console.log(`Verified catalog products: ${products.length}`);
for (const type of ["helmet", "tire", "topbox"]) {
  const total = byType.get(type) || 0;
  const absent = missingByType.get(type) || 0;
  console.log(`${type}: ${total - absent}/${total} with media (${absent} missing)`);
}
console.log(`Overall: ${products.length - missing.length}/${products.length} with media (${missing.length} missing)`);

if (missing.length) {
  console.log("\nMissing verified product media:");
  for (const item of missing) {
    console.log(`- ${item.entityType}:${item.id} | ${item.brand || ""} ${item.model || ""} | ${item.sourceUrl || "no source URL"}`);
  }
  if (process.env.MEDIA_COVERAGE_STRICT === "1") process.exit(1);
}
