import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();

function extractArray(source, declaration) {
  const start = source.indexOf(declaration);
  if (start < 0) return "";
  const equals = source.indexOf("=", start);
  const open = source.indexOf("[", equals);
  if (equals < 0 || open < 0) return "";
  let inString = false;
  let escaped = false;
  let quote = "";
  let depth = 0;
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
    if (ch === "[") depth += 1;
    else if (ch === "]" && --depth === 0) return source.slice(open + 1, i);
  }
  return "";
}

function topLevelObjects(arrayText) {
  const objects = [];
  let inString = false;
  let escaped = false;
  let quote = "";
  let depth = 0;
  let start = -1;
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
      if (depth === 0) start = i;
      depth += 1;
    } else if (ch === "}" && --depth === 0 && start >= 0) {
      objects.push(arrayText.slice(start, i + 1));
      start = -1;
    }
  }
  return objects;
}

function stringField(block, name) {
  return block.match(new RegExp(`["']?${name}["']?\\s*:\\s*["']([^"']+)["']`))?.[1];
}

function verifiedProducts(source) {
  const records = [];
  for (const [declaration, entityType] of [
    ["export const helmetProducts", "helmet"],
    ["export const tireProducts", "tire"],
    ["export const topBoxProducts", "topbox"],
  ]) {
    for (const block of topLevelObjects(extractArray(source, declaration))) {
      const id = stringField(block, "id");
      if (id && stringField(block, "status") === "verified") records.push({ entityType, id });
    }
  }
  return records;
}

function mediaRecords(source, declaration) {
  return topLevelObjects(extractArray(source, declaration))
    .map((block) => ({
      entityType: stringField(block, "entityType"),
      entityId: stringField(block, "entityId"),
      rightsStatus: stringField(block, "rightsStatus"),
      src: stringField(block, "src"),
    }))
    .filter((item) => item.entityType && item.entityId && item.rightsStatus !== "pending");
}

function readBaseCatalog() {
  const baseBranch = process.env.GITHUB_BASE_REF?.trim();
  if (baseBranch) {
    execFileSync("git", ["fetch", "origin", baseBranch], { stdio: "ignore" });
    return execFileSync("git", ["show", `origin/${baseBranch}:lib/catalog.ts`], { encoding: "utf8" });
  }
  try {
    return execFileSync("git", ["show", "HEAD^:lib/catalog.ts"], { encoding: "utf8" });
  } catch {
    return fs.readFileSync(path.join(root, "lib", "catalog.ts"), "utf8");
  }
}

const baseCatalog = readBaseCatalog();
const headCatalog = fs.readFileSync(path.join(root, "lib", "catalog.ts"), "utf8");
const baseKeys = new Set(verifiedProducts(baseCatalog).map((item) => `${item.entityType}:${item.id}`));
const added = verifiedProducts(headCatalog).filter((item) => !baseKeys.has(`${item.entityType}:${item.id}`));

if (!added.length) {
  console.log("New-product media validation passed: no newly verified gear products in this change.");
  process.exit(0);
}

const entityMediaSource = fs.readFileSync(path.join(root, "lib", "media.ts"), "utf8");
const generatedPath = path.join(root, "lib", "generatedProductMedia.ts");
const generatedSource = fs.existsSync(generatedPath) ? fs.readFileSync(generatedPath, "utf8") : "";
const records = [
  ...mediaRecords(entityMediaSource, "export const entityMedia"),
  ...mediaRecords(generatedSource, "export const generatedProductMedia"),
];
const media = new Map(records.map((item) => [`${item.entityType}:${item.entityId}`, item]));

const failures = [];
for (const product of added) {
  const key = `${product.entityType}:${product.id}`;
  const record = media.get(key);
  if (!record) {
    failures.push(`${key}: newly verified product has no exact media record`);
    continue;
  }
  if (!record.src?.startsWith("/media/") || !record.src.endsWith(".webp")) {
    failures.push(`${key}: media record does not use a standardized local WebP path`);
    continue;
  }
  const local = path.join(root, "public", record.src.replace(/^\//, ""));
  if (!fs.existsSync(local)) failures.push(`${key}: local derivative is missing at ${record.src}`);
}

if (failures.length) {
  console.error("New-product media validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`New-product media validation passed: ${added.length} newly verified product(s) have exact local media.`);
