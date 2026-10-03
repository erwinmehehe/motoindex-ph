import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const wave = read("lib", "modelIntentDepthWave3_2026.ts");
const aggregator = read("lib", "modelIntentDepth2026.ts");
const growth = read("lib", "priorityModelGrowth.ts");
const component = read("components", "CanonicalIntentDepth.tsx");
const page = read("app", "motorcycles", "[make]", "[slug]", "page.tsx");
const entity = read("components", "MotorcycleEntityPage.tsx");

const modelIds = [
  "yamaha-tmax",
  "honda-cb650r",
  "cfmoto-300sr",
  "kawasaki-ninja-zx-4rr",
  "bristol-maxie-400",
  "bajaj-pulsar-rs200",
  "honda-cbr150r",
  "royal-enfield-shotgun-650"
];

const libText = fs.readdirSync(path.join(root, "lib"))
  .filter((name) => name.endsWith(".ts"))
  .map((name) => read("lib", name))
  .join("\n");

const metadataRows = [...wave.matchAll(/"([^"]+)":\s*\{\s*seoTitle:\s*"([^"]+)",\s*seoDescription:\s*"([^"]+)"/gms)]
  .map((match) => ({ modelId: match[1], title: match[2], description: match[3] }));

if (metadataRows.length !== modelIds.length) {
  errors.push(`Wave 3 must contain exactly ${modelIds.length} metadata profiles; found ${metadataRows.length}.`);
}

const seenTitles = new Set();
const seenDescriptions = new Set();

for (const modelId of modelIds) {
  if (!wave.includes(`"${modelId}": {`)) errors.push(`Wave 3 intent profile missing: ${modelId}`);
  if (!libText.includes(`id: "${modelId}"`)) errors.push(`Wave 3 model entity missing: ${modelId}`);

  const growthStart = growth.indexOf(`"${modelId}": {`);
  if (growthStart < 0) {
    errors.push(`Wave 3 growth profile missing: ${modelId}`);
    continue;
  }
  const growthNext = growth.indexOf('\n  "', growthStart + modelId.length + 6);
  const growthEnd = growthNext > growthStart ? growthNext : growth.indexOf("\n};", growthStart);
  const growthBlock = growth.slice(growthStart, growthEnd);

  for (const token of ["moneyQuestion:", "ownershipQuestion:", "alternativeIds:", "recommendationHref:", "recommendationLabel:"]) {
    if (!growthBlock.includes(token)) errors.push(`Wave 3 buyer-path field missing for ${modelId}: ${token}`);
  }

  const alternativeMatch = growthBlock.match(/alternativeIds:\s*\[([^\]]*)\]/s);
  const alternativeIds = alternativeMatch ? (alternativeMatch[1].match(/"([^"]+)"/g) || []).map((value) => value.slice(1, -1)) : [];
  if (alternativeIds.length < 2) errors.push(`Wave 3 model needs at least two alternatives: ${modelId}`);

  const relatedMatch = growthBlock.match(/relatedIds:\s*\[([^\]]*)\]/s);
  const relatedIds = relatedMatch ? (relatedMatch[1].match(/"([^"]+)"/g) || []).map((value) => value.slice(1, -1)) : [];
  for (const linkedId of [...alternativeIds, ...relatedIds]) {
    if (linkedId === modelId) errors.push(`Wave 3 model cannot link to itself: ${modelId}`);
    if (!libText.includes(`id: "${linkedId}"`)) errors.push(`Wave 3 linked model entity missing: ${modelId} -> ${linkedId}`);
  }

  const recommendationMatch = growthBlock.match(/recommendationHref:\s*"([^"]+)"/);
  if (!recommendationMatch || !recommendationMatch[1].startsWith("/recommendations")) {
    errors.push(`Wave 3 recommendation link must use a MotoIndex recommendation hub: ${modelId}`);
  }
}

for (const row of metadataRows) {
  if (row.title.length < 55 || row.title.length > 60) {
    errors.push(`Wave 3 title length should be 55-60 chars: ${row.modelId} (${row.title.length}).`);
  }
  if (row.description.length < 150 || row.description.length > 160) {
    errors.push(`Wave 3 description length should be 150-160 chars: ${row.modelId} (${row.description.length}).`);
  }
  if (!/Philippines/i.test(row.title) || !/Philippines/i.test(row.description)) {
    errors.push(`Wave 3 metadata must keep Philippine intent explicit: ${row.modelId}.`);
  }
  if (seenTitles.has(row.title)) errors.push(`Duplicate Wave 3 SEO title: ${row.title}`);
  if (seenDescriptions.has(row.description)) errors.push(`Duplicate Wave 3 SEO description: ${row.modelId}`);
  seenTitles.add(row.title);
  seenDescriptions.add(row.description);
}

for (const token of [
  'wave3ModelIntentDepthProfile(modelId)',
  'return profiles[modelId] || wave3ModelIntentDepthProfile(modelId)'
]) {
  if (!aggregator.includes(token)) errors.push(`Wave 3 aggregator guard missing: ${token}`);
}

for (const token of [
  'id="buyer-answers"',
  'priorityModelGrowthProfile(model.id)',
  'growth.moneyQuestion',
  'growth.ownershipQuestion',
  'growth.recommendationHref',
  'href="/compare"'
]) {
  if (!component.includes(token)) errors.push(`Wave 3 renderer guard missing: ${token}`);
}

for (const token of [
  'modelIntentDepthProfile(model.id)',
  'intentDepth?.seoTitle || growth?.seoTitle || seo.title',
  'intentDepth?.seoDescription || growth?.seoDescription || seo.description'
]) {
  if (!page.includes(token)) errors.push(`Wave 3 metadata wiring missing: ${token}`);
}

for (const token of [
  '<CanonicalIntentDepth model={model} />',
  '...canonicalIntentFaqs(model)',
  'href: "#buyer-answers", label: "Buyer answers"'
]) {
  if (!entity.includes(token)) errors.push(`Wave 3 model-page wiring missing: ${token}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Canonical authority wave 3 validation passed.");
