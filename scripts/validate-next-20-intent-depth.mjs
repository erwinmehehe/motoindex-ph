import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const profile = read("lib", "modelIntentDepth2026.ts");
const component = read("components", "CanonicalIntentDepth.tsx");
const page = read("app", "motorcycles", "[make]", "[slug]", "page.tsx");
const entity = read("components", "MotorcycleEntityPage.tsx");
const growth = read("lib", "priorityModelGrowth.ts");

const modelIds = [
  "honda-pcx-160",
  "honda-click-160",
  "honda-navi",
  "yamaha-sniper-155",
  "honda-adv-350",
  "yamaha-fazzio",
  "suzuki-raider-r150",
  "honda-adv-160",
  "honda-giorno-plus",
  "honda-beat",
  "yamaha-xmax",
  "honda-x-adv",
  "yamaha-mio-i-125",
  "yamaha-xsr155",
  "honda-winner-x",
  "suzuki-burgman-street",
  "yamaha-yzf-r3",
  "yamaha-yzf-r15m",
  "suzuki-burgman-400",
  "kawasaki-ninja-400"
];

const libText = fs.readdirSync(path.join(root, "lib"))
  .filter((name) => name.endsWith(".ts"))
  .map((name) => read("lib", name))
  .join("\n");

for (const modelId of modelIds) {
  if (!profile.includes(`"${modelId}": {`)) errors.push(`Next-20 intent profile missing: ${modelId}`);
  if (!libText.includes(`id: "${modelId}"`)) errors.push(`Next-20 model entity missing from lib data: ${modelId}`);

  const growthStart = growth.indexOf(`"${modelId}": {`);
  if (growthStart < 0) {
    errors.push(`Next-20 growth profile missing: ${modelId}`);
    continue;
  }
  const growthNext = growth.indexOf('\n  "', growthStart + modelId.length + 6);
  const growthEnd = growthNext > growthStart ? growthNext : growth.indexOf("\n};", growthStart);
  const growthBlock = growth.slice(growthStart, growthEnd);

  for (const token of ["moneyQuestion:", "ownershipQuestion:", "alternativeIds:", "recommendationHref:", "recommendationLabel:"]) {
    if (!growthBlock.includes(token)) errors.push(`Next-20 buyer-path field missing for ${modelId}: ${token}`);
  }

  const alternativeMatch = growthBlock.match(/alternativeIds:\s*\[([^\]]*)\]/s);
  const alternativeIds = alternativeMatch ? (alternativeMatch[1].match(/"([^"]+)"/g) || []).map((value) => value.slice(1, -1)) : [];
  if (alternativeIds.length < 2) errors.push(`Next-20 model needs at least two direct alternatives: ${modelId}`);

  const relatedMatch = growthBlock.match(/relatedIds:\s*\[([^\]]*)\]/s);
  const relatedIds = relatedMatch ? (relatedMatch[1].match(/"([^"]+)"/g) || []).map((value) => value.slice(1, -1)) : [];
  for (const linkedId of [...alternativeIds, ...relatedIds]) {
    if (linkedId === modelId) errors.push(`Next-20 model cannot link to itself: ${modelId}`);
    if (!libText.includes(`id: "${linkedId}"`)) errors.push(`Next-20 linked model entity missing: ${modelId} -> ${linkedId}`);
  }

  const recommendationMatch = growthBlock.match(/recommendationHref:\s*"([^"]+)"/);
  if (!recommendationMatch || !recommendationMatch[1].startsWith("/recommendations")) {
    errors.push(`Next-20 recommendation link must stay inside recommendation hubs: ${modelId}`);
  }
}

if ((profile.match(/seoTitle: "/g) || []).length !== 20) {
  errors.push("Next-20 profile must contain exactly 20 SEO titles.");
}

const metadataRows = [...profile.matchAll(/"([^"]+)":\s*\{\s*seoTitle:\s*"([^"]+)",\s*seoDescription:\s*"([^"]+)"/gms)]
  .map((match) => ({ modelId: match[1], title: match[2], description: match[3] }));

if (metadataRows.length !== 20) {
  errors.push(`Next-20 metadata parser expected 20 profiles, found ${metadataRows.length}.`);
}

const seenTitles = new Set();
const seenDescriptions = new Set();
for (const row of metadataRows) {
  if (row.title.length < 55 || row.title.length > 60) {
    errors.push(`Next-20 title length should be 55-60 chars: ${row.modelId} (${row.title.length}).`);
  }
  if (row.description.length < 150 || row.description.length > 160) {
    errors.push(`Next-20 description length should be 150-160 chars: ${row.modelId} (${row.description.length}).`);
  }
  if (!/Philippines/i.test(row.title) || !/Philippines/i.test(row.description)) {
    errors.push(`Next-20 metadata must keep Philippine intent explicit: ${row.modelId}.`);
  }
  if (seenTitles.has(row.title)) errors.push(`Duplicate next-20 SEO title: ${row.title}`);
  if (seenDescriptions.has(row.description)) errors.push(`Duplicate next-20 SEO description: ${row.modelId}`);
  seenTitles.add(row.title);
  seenDescriptions.add(row.description);
}

for (const token of [
  'export function modelIntentDepthProfile',
  'export function canonicalIntentAnswer',
  'export function canonicalIntentFaqs'
]) {
  if (!profile.includes(token)) errors.push(`Intent profile helper missing: ${token}`);
}

for (const token of [
  'id="buyer-answers"',
  'canonicalIntentQuestion(model, intent)',
  'canonicalIntentAnswer(model, intent)',
  'priorityModelGrowthProfile(model.id)',
  'growth.moneyQuestion',
  'growth.ownershipQuestion',
  'growth.recommendationHref',
  'growth.recommendationLabel',
  'alternativeIds',
  'href="/compare"'
]) {
  if (!component.includes(token)) errors.push(`Canonical intent renderer guard missing: ${token}`);
}

for (const token of [
  'modelIntentDepthProfile(model.id)',
  'intentDepth?.seoTitle || growth?.seoTitle || seo.title',
  'intentDepth?.seoDescription || growth?.seoDescription || seo.description'
]) {
  if (!page.includes(token)) errors.push(`Model metadata intent-depth guard missing: ${token}`);
}

for (const token of [
  '<CanonicalIntentDepth model={model} />',
  '...canonicalIntentFaqs(model)',
  'href: "#buyer-answers", label: "Buyer answers"'
]) {
  if (!entity.includes(token)) errors.push(`Model page intent-depth guard missing: ${token}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Next 20 canonical intent-depth validation passed.");
