import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const data = read("lib", "data.ts");
const motorcycles = read("app", "motorcycles", "page.tsx");

for (const slug of [
  "motorcycles-under-150k",
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

for (const token of [
  'primaryKeyword: "400cc motorcycles Philippines"',
  'seoTitle: "400cc Motorcycles Philippines 2026: Prices & Specs"'
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
  'm.engineCc >= 225 && m.engineCc <= 275',
  'm.engineCc >= 280 && m.engineCc <= 325'
]) {
  if (!data.includes(band)) errors.push(`displacement class selector missing: ${band}`);
}

if (errors.length) {
  console.error("Budget/displacement gap validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Budget/displacement gap validation passed: canonical budget and engine-class architecture is intact.");
