import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const data = read("lib", "data.ts");
const electric = read("app", "motorcycles", "electric", "page.tsx");

for (const token of [
  'slug: "honda-big-bikes-philippines"',
  'seoTitle: "Honda Big Bikes Philippines 2026 | Prices, Specs & Models"',
  'primaryKeyword: "Honda big bike price Philippines"',
  'case "honda-big-bikes-philippines": return byPrice.filter(m => m.makeSlug === "honda" && m.engineCc >= 400);',
  'slug: "yamaha-big-bikes-philippines"',
  'seoTitle: "Yamaha Big Bikes Philippines 2026 | Prices, Specs & Models"',
  'primaryKeyword: "Yamaha big bikes"',
  'case "yamaha-big-bikes-philippines": return byPrice.filter(m => m.makeSlug === "yamaha" && m.engineCc >= 400);'
]) {
  if (!data.includes(token)) errors.push(`Category authority guard missing: ${token}`);
}

for (const token of [
  'slug: "motorcycles-under-80k"',
  'seoTitle: "Cheapest Motorcycles Philippines 2026 | Under ₱80K Prices"',
  'primaryKeyword: "cheapest motorcycle Philippines"',
  '"motorcycle under 50k Philippines"',
  'only one verified-current motorcycle below ₱50,000'
]) {
  if (!data.includes(token)) errors.push(`Cheapest-motorcycle consolidation guard missing: ${token}`);
}

if (data.includes('slug: "motorcycles-under-50k-philippines"') || data.includes('slug: "motorcycles-below-40000-philippines"')) {
  errors.push("Do not create a thin under-₱50K/₱40K guide while verified-current inventory is below the quality gate.");
}

for (const token of [
  'title: "Electric Scooters Philippines 2026 | Prices, Range & LTO"',
  '"best electric scooters Philippines"',
  'Compare current verified Philippine electric scooters by price'
]) {
  if (!electric.includes(token)) errors.push(`Electric authority hub guard missing: ${token}`);
}

for (const token of [
  'slug: "cruiser-motorcycles-philippines"',
  'slug: "motorcycles-1000cc-plus-philippines"'
]) {
  if (!data.includes(token)) errors.push(`Existing category authority page lost: ${token}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Category authority wave 1 validation passed.");
