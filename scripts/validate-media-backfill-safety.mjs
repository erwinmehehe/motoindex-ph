import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const backfillPath = path.join(root, "scripts/backfill-product-media.mjs");
const workflowPath = path.join(root, ".github/workflows/product-image-backfill.yml");
const coverageWorkflowPath = path.join(root, ".github/workflows/media-coverage-audit.yml");
const generatedPath = path.join(root, "lib/generatedProductMedia.ts");
const helmetNormalizerPath = path.join(root, "scripts/art-direct-helmet-media.py");
const motorcycleNormalizerPath = path.join(root, "scripts/art-direct-motorcycle-media.py");

const backfill = fs.readFileSync(backfillPath, "utf8");
const workflow = fs.readFileSync(workflowPath, "utf8");
const coverageWorkflow = fs.readFileSync(coverageWorkflowPath, "utf8");
const generatedSource = fs.readFileSync(generatedPath, "utf8");
const helmetNormalizer = fs.readFileSync(helmetNormalizerPath, "utf8");
const motorcycleNormalizer = fs.readFileSync(motorcycleNormalizerPath, "utf8");

const errors = [];

for (const [label, source] of [
  ["helmet normalizer", helmetNormalizer],
  ["motorcycle normalizer", motorcycleNormalizer],
]) {
  if (/cv2\.(?:grabCut|floodFill)\s*\(/.test(source)) {
    errors.push(`${label} must not use destructive foreground segmentation`);
  }
}
if (!helmetNormalizer.includes("preserve-full-frame")) {
  errors.push("helmet normalizer must preserve opaque full-frame sources");
}
if (!motorcycleNormalizer.includes("preserve-full-frame")) {
  errors.push("motorcycle normalizer must preserve opaque full-frame sources");
}

if (backfill.includes("REBUILD_GENERATED_MEDIA")) {
  errors.push("backfill script must not expose destructive REBUILD_GENERATED_MEDIA behavior");
}
if (workflow.includes("REBUILD_GENERATED_MEDIA")) {
  errors.push("workflow must not request destructive generated-media rebuilds");
}
if (workflow.includes("fix/product-image-coverage")) {
  errors.push("media backfill workflow must not hardcode the legacy fix/product-image-coverage branch");
}
if (!workflow.includes("GITHUB_REF_NAME")) {
  errors.push("media backfill workflow must operate on the explicitly selected branch");
}
if (!workflow.includes("rev-list --count HEAD..origin/main")) {
  errors.push("media backfill workflow must refuse branches that are behind main");
}
if (!workflow.includes("Run Product Image Backfill from a dedicated media/* or fix/* branch, not main.")) {
  errors.push("media backfill workflow must refuse direct mutation of main");
}
if (!coverageWorkflow.includes("lib/catalog.ts")) {
  errors.push("media coverage audit must trigger when the product catalog changes");
}
if (!coverageWorkflow.includes("scripts/validate-new-product-media.mjs")) {
  errors.push("media coverage audit must rerun when the new-product media validator changes");
}
if (!coverageWorkflow.includes("node scripts/validate-new-product-media.mjs")) {
  errors.push("media coverage audit must block newly verified catalog products without exact local media");
}
if (!coverageWorkflow.includes("MEDIA_STRICT_LOCAL=1 npm run validate:media")) {
  errors.push("media coverage audit must fail when a standardized local derivative is missing");
}
if (!backfill.includes("const generated = previousGenerated.filter(hasLocalAsset)")) {
  errors.push("backfill script must preserve existing generated records with local assets");
}
if (!backfill.includes("newRecordIds.has(asset.id)")) {
  errors.push("duplicate rejection must be scoped to newly generated records");
}

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

let generated = [];
try {
  const body = extractArray(generatedSource, "export const generatedProductMedia").trim();
  generated = body ? JSON.parse(`[${body}]`) : [];
} catch (error) {
  errors.push(`could not parse generatedProductMedia.ts: ${error instanceof Error ? error.message : String(error)}`);
}

const missingFiles = [];
for (const asset of generated) {
  if (!asset?.src?.startsWith("/media/")) continue;
  const file = path.join(root, "public", asset.src.replace(/^\//, ""));
  if (!fs.existsSync(file)) missingFiles.push(`${asset.entityType}:${asset.entityId} -> ${asset.src}`);
}
if (missingFiles.length) {
  errors.push(`generated media records with missing local files:\n${missingFiles.map((item) => `  - ${item}`).join("\n")}`);
}

const ls2 = generated.filter((asset) => asset.entityType === "helmet" && String(asset.entityId || "").startsWith("ls2-"));
if (ls2.length < 37) {
  errors.push(`LS2 preservation baseline regressed: expected at least 37 localized LS2 images, found ${ls2.length}`);
}
if (generated.length < 76) {
  errors.push(`generated media preservation baseline regressed: expected at least 76 generated records, found ${generated.length}`);
}

if (errors.length) {
  console.error("Media backfill safety validation failed:\n" + errors.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Media backfill safety OK: ${generated.length} generated records preserved, including ${ls2.length} LS2 helmets.`);
