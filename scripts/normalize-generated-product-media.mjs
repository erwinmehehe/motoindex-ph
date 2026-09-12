import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogSource = fs.readFileSync(path.join(root, "lib/catalog.ts"), "utf8");
const generatedPath = path.join(root, "lib/generatedProductMedia.ts");
const generatedSource = fs.readFileSync(generatedPath, "utf8");

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
  return block.match(new RegExp(`\\b${name}:\\s*["']([^"']+)["']`))?.[1];
}

const brandByKey = new Map();
for (const [declaration, entityType] of [
  ["export const helmetProducts", "helmet"],
  ["export const tireProducts", "tire"],
  ["export const topBoxProducts", "topbox"]
]) {
  for (const block of topLevelObjects(extractArray(catalogSource, declaration))) {
    const id = field(block, "id");
    const brand = field(block, "brand");
    if (id && brand) brandByKey.set(`${entityType}:${id}`, brand);
  }
}

const raw = extractArray(generatedSource, "export const generatedProductMedia").trim();
const records = raw ? JSON.parse(`[${raw}]`) : [];
let added = 0;
for (const record of records) {
  if (record.rightsHolder) continue;
  const rightsHolder = brandByKey.get(`${record.entityType}:${record.entityId}`);
  if (!rightsHolder) throw new Error(`Missing rights holder mapping for ${record.entityType}:${record.entityId}`);
  record.rightsHolder = rightsHolder;
  added += 1;
}

const header = 'import type { EntityMedia } from "./types";\n\n// Generated from checked product source pages by scripts/backfill-product-media.mjs.\n// Local WebP derivatives are used at runtime; sourceImageUrl and sourceUrl preserve provenance.\n';
fs.writeFileSync(generatedPath, `${header}export const generatedProductMedia: EntityMedia[] = ${JSON.stringify(records, null, 2)};\n`);
console.log(`Generated product media normalized: ${records.length} records, ${added} rights-holder fields added.`);
