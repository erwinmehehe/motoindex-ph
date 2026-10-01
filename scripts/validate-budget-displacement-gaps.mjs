import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const data = read("lib", "data.ts");
const motorcycles = read("app", "motorcycles", "page.tsx");
const scooterHub = read("app", "motorcycles", "scooters", "page.tsx");
const recommendationPage = read("app", "recommendations", "[slug]", "page.tsx");

for (const slug of [
  "motorcycles-under-150k",
  "motorcycles-below-150cc-philippines",
  "250cc-motorcycles-philippines",
  "300cc-motorcycles-philippines"
]) {
  if (!data.includes(`slug: "${slug}"`)) {
    errors.push(`recommendation guide missing: ${slug}`);
  }
  if (!data.includes(`case "${slug}"`)) {
    errors.push(`recommendation selector missing: ${slug}`);
  }
  if (!motorcycles.includes(`href="/recommendations/${slug}"`)) {
    errors.push(`motorcycle authority hub must link directly to ${slug}`);
  }
}

for (const slug of [
  "125cc-scooters-philippines",
  "150cc-scooters-philippines",
  "155cc-scooters-philippines",
  "160cc-scooters-philippines"
]) {
  if (!data.includes(`slug: "${slug}"`)) errors.push(`scooter displacement guide missing: ${slug}`);
  if (!data.includes(`case "${slug}"`)) errors.push(`scooter displacement selector missing: ${slug}`);
  if (!scooterHub.includes(`href="/recommendations/${slug}"`)) errors.push(`scooter market hub must link directly to ${slug}`);
}

for (const token of [
  'case "150cc-scooters-philippines": return byPrice.filter(m => /scooter/i.test(m.category) && m.engineCc >= 140 && m.engineCc <= 155);',
  'case "155cc-scooters-philippines": return byPrice.filter(m => /scooter/i.test(m.category) && m.engineCc === 155);',
  'case "160cc-scooters-philippines": return byPrice.filter(m => /scooter/i.test(m.category) && m.engineCc >= 156 && m.engineCc <= 165);'
]) {
  if (!data.includes(token)) errors.push(`scooter displacement intent selector changed unexpectedly: ${token}`);
}

if (!data.includes('primaryKeyword: "155cc scooters Philippines"')) {
  errors.push("Exact 155cc guide must own the 155cc scooter search intent.");
}
if (!data.includes('primaryKeyword: "150cc scooters Philippines"')) {
  errors.push("Broad 150cc-class guide must own the 150cc scooter search intent.");
}
if (!recommendationPage.includes('Exact 155cc models only')) {
  errors.push("Scooter recommendation UI must explain the exact-155cc class distinction.");
}

for (const token of [
  'primaryKeyword: "400cc motorcycles Philippines"',
  'seoTitle: "400cc & Big Bike Prices Philippines 2026 | Specs"'
]) {
  if (!data.includes(token)) errors.push(`400cc+ guide must own the 400cc search intent: ${token}`);
}

if (data.includes('slug: "400cc-motorcycles-philippines"')) {
  errors.push("Do not create a duplicate 400cc URL; strengthen the existing 400cc+ guide instead.");
}

if (!data.includes('relatedGuideSlugs: ["motorcycles-under-80k","motorcycles-under-100k","motorcycles-100k-to-150k"')) {
  errors.push("Under-150K parent guide must link its narrower budget children.");
}

for (const band of [
  'm.engineCc < 150',
  'm.engineCc >= 225 && m.engineCc <= 275',
  'm.engineCc >= 280 && m.engineCc <= 325'
]) {
  if (!data.includes(band)) errors.push(`displacement class selector missing: ${band}`);
}

if (!data.includes('id: "cfmoto-300nk"')) {
  errors.push("300cc class must include the current source-backed CFMOTO 300NK so the collection clears the minimum indexability threshold.");
}
if (!data.includes('sourceUrl: "https://www.cfmotoph.com/motorcycle/300nk"')) {
  errors.push("CFMOTO 300NK must use the current official Philippine product page as its canonical source.");
}

if (errors.length) {
  console.error("Budget/displacement gap validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Budget/displacement gap validation passed: canonical budget and engine-class architecture is intact.");
