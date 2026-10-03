import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const data = read("lib", "data.ts");
const recommendationPage = read("app", "recommendations", "[slug]", "page.tsx");
const electricPage = read("app", "motorcycles", "electric", "page.tsx");
const electricData = read("lib", "electricMotorcycles.ts");
const guideAlias = read("app", "guides", "electric-scooters-philippines", "page.tsx");
const recommendationAlias = read("app", "recommendations", "electric-scooters-philippines", "page.tsx");

const categoryMetadata = [
  {
    slug: "cruiser-motorcycles-philippines",
    title: "Cruiser Motorcycles Philippines 2026 | Prices, Specs & Fit",
    description: "Compare cruiser motorcycles in the Philippines by current price, engine, power, weight, seat height, ABS, fuel tank, rider fit and ownership trade-offs."
  },
  {
    slug: "motorcycles-1000cc-plus-philippines",
    title: "1000cc Motorcycles Philippines 2026 | Prices, Specs & Fit",
    description: "Compare 1000cc and liter-class motorcycles in the Philippines by price, power, weight, seat height, ABS, fuel tank, ownership costs and road-use context."
  }
];

for (const row of categoryMetadata) {
  if (!data.includes(`slug: "${row.slug}"`)) errors.push(`Category authority guide missing: ${row.slug}`);
  if (!data.includes(`seoTitle: "${row.title}"`)) errors.push(`Category authority title missing: ${row.slug}`);
  if (!data.includes(`description: "${row.description}"`)) errors.push(`Category authority description missing: ${row.slug}`);
  if (row.title.length < 55 || row.title.length > 60) errors.push(`Category authority title length invalid: ${row.slug} (${row.title.length})`);
  if (row.description.length < 150 || row.description.length > 160) errors.push(`Category authority description length invalid: ${row.slug} (${row.description.length})`);
}

for (const token of [
  'case "cruiser-motorcycles-philippines": return byPrice.filter(m => m.category === "Cruiser");',
  'case "motorcycles-1000cc-plus-philippines": return byPrice.filter(m => m.engineCc >= 1000);',
  'guide.slug==="cruiser-motorcycles-philippines"',
  'guide.slug==="motorcycles-1000cc-plus-philippines"'
]) {
  const source = token.startsWith("case ") ? data : recommendationPage;
  if (!source.includes(token)) errors.push(`Category authority wiring missing: ${token}`);
}

for (const token of [
  'title: "Electric Scooters Philippines 2026 | Prices, Range & LTO"',
  'description: "Compare electric scooters and motorcycles in the Philippines by price, battery options, claimed range, charging time, LTO classification and ownership costs."',
  'electric scooter price Philippines',
  'const itemListSchema=',
  '"@type":"ItemList"',
  'id="ownership"',
  'What to compare before buying an electric scooter in the Philippines',
  'href="/recommendations/best-scooters-philippines"',
  'href="/recommendations/motorcycles-under-100k"',
  'href="/guides/electric-motorcycle-registration-philippines"',
  '<JsonLd data={itemListSchema}/>'
]) {
  if (!electricPage.includes(token)) errors.push(`Electric authority guard missing: ${token}`);
}

const electricTitle = "Electric Scooters Philippines 2026 | Prices, Range & LTO";
const electricDescription = "Compare electric scooters and motorcycles in the Philippines by price, battery options, claimed range, charging time, LTO classification and ownership costs.";
if (electricTitle.length < 55 || electricTitle.length > 60) errors.push(`Electric title length invalid: ${electricTitle.length}`);
if (electricDescription.length < 150 || electricDescription.length > 160) errors.push(`Electric description length invalid: ${electricDescription.length}`);

const electricSlugs = [...electricData.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
if (electricSlugs.length < 3) errors.push(`Electric authority page requires at least 3 verified model records; found ${electricSlugs.length}`);

for (const [name, alias] of [["guide", guideAlias], ["recommendation", recommendationAlias]]) {
  if (!alias.includes('permanentRedirect("/motorcycles/electric')) errors.push(`Electric ${name} alias must consolidate to /motorcycles/electric`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Category authority wave validation passed.");
