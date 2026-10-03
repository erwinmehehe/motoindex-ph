import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const data = read("lib", "data.ts");
const electric = read("app", "motorcycles", "electric", "page.tsx");
const hub = read("app", "motorcycles", "page.tsx");
const marketValidator = read("scripts", "validate-market-hubs.mjs");
const nextConfig = read("next.config.mjs");

const requireText = (source, token, message) => {
  if (!source.includes(token)) errors.push(message);
};

for (const token of [
  'slug: "motorcycles-1000cc-plus-philippines"',
  'seoTitle: "1000cc Motorcycles Philippines 2026 | Prices, Specs & Fit"',
  'primaryKeyword: "1000cc motorcycles Philippines"',
  '"big bike 1000cc"',
  '"liter bike Philippines"',
  'case "motorcycles-1000cc-plus-philippines": return byPrice.filter(m => m.engineCc >= 1000)',
  'relatedGuideSlugs: ["motorcycles-1000cc-plus-philippines"'
]) {
  requireText(data, token, `1000cc authority guide missing token: ${token}`);
}

requireText(
  hub,
  'href="/recommendations/motorcycles-1000cc-plus-philippines"',
  "Motorcycle market hub must expose the 1000cc+ authority guide."
);

for (const token of [
  'slug: "cruiser-motorcycles-philippines"',
  'seoTitle: "Cruiser Motorcycles Philippines 2026 | Prices, Specs & Fit"',
  'primaryKeyword: "cruiser motorcycle Philippines"',
  '"best cruiser motorcycle Philippines"',
  'case "cruiser-motorcycles-philippines": return byPrice.filter(m => m.category === "Cruiser")'
]) {
  requireText(data, token, `Cruiser authority guide missing token: ${token}`);
}

for (const token of [
  'guide.slug==="cruiser-motorcycles-philippines"',
  'guide.slug==="motorcycles-1000cc-plus-philippines"'
]) {
  requireText(read("app", "recommendations", "[slug]", "page.tsx"), token, `Category-specific recommendation rationale missing: ${token}`);
}

for (const token of [
  'seoTitle: "Cheapest Motorcycles Philippines 2026 | Prices Under ₱100K"',
  '"cheapest motorcycles Philippines"',
  '"What is the cheapest motorcycle in the Philippines under ₱100,000?"'
]) {
  requireText(data, token, `Cheapest-motorcycle intent missing from under-100K canonical: ${token}`);
}

for (const token of [
  'title: "Electric Scooters Philippines 2026 | Prices, Range & LTO"',
  'Electric motorcycles and scooters in the Philippines',
  'Electric motorcycle and electric scooter prices in the Philippines',
  'What electric scooters are available in the Philippines?',
  'const itemListSchema=',
  '"@type":"ItemList"',
  'id="ownership"',
  'What to compare before buying an electric scooter in the Philippines',
  'href="/motorcycles/scooters"',
  'href="/motorcycles"',
  '<JsonLd data={itemListSchema}/>'
]) {
  requireText(electric, token, `Electric authority canonical missing token: ${token}`);
}

if (
  data.includes('slug: "motorcycles-below-40000-philippines"') ||
  data.includes('slug: "motorcycles-under-40000-philippines"')
) {
  errors.push("Do not create a below-₱40K recommendation page without enough current verified inventory.");
}

for (const route of [
  "/motorcycles/honda-big-bike",
  "/motorcycles/honda-big-bikes",
  "/motorcycles/yamaha-big-bike",
  "/motorcycles/yamaha-big-bikes"
]) {
  if (nextConfig.includes(route)) errors.push(`Do not recreate thin brand big-bike routes: ${route}`);
}

for (const token of [
  '"Honda big bikes in the Philippines"',
  '"Yamaha big bikes in the Philippines"'
]) {
  requireText(marketValidator, token, `Existing brand big-bike consolidation guard missing: ${token}`);
}

const metadata = [...data.matchAll(/slug: "motorcycles-1000cc-plus-philippines"[\s\S]{0,500}?seoTitle: "([^"]+)"[\s\S]{0,500}?description: "([^"]+)"/g)];
if (metadata.length !== 1) {
  errors.push("Expected exactly one 1000cc+ guide metadata record.");
} else {
  const [, title, description] = metadata[0];
  if (title.length < 55 || title.length > 60) errors.push(`1000cc title length must be 55-60 chars; found ${title.length}.`);
  if (description.length < 150 || description.length > 160) errors.push(`1000cc description length must be 150-160 chars; found ${description.length}.`);
}

const cruiserMetadata = [...data.matchAll(/slug: "cruiser-motorcycles-philippines"[\s\S]{0,500}?seoTitle: "([^"]+)"[\s\S]{0,500}?description: "([^"]+)"/g)];
if (cruiserMetadata.length !== 1) {
  errors.push("Expected exactly one cruiser guide metadata record.");
} else {
  const [, title, description] = cruiserMetadata[0];
  if (title.length < 55 || title.length > 60) errors.push(`Cruiser title length must be 55-60 chars; found ${title.length}.`);
  if (description.length < 150 || description.length > 160) errors.push(`Cruiser description length must be 150-160 chars; found ${description.length}.`);
}

const electricTitle = "Electric Scooters Philippines 2026 | Prices, Range & LTO";
const electricDescription = "Compare electric scooters and motorcycles in the Philippines by price, battery options, claimed range, charging time, LTO classification and ownership costs.";
if (electricTitle.length < 55 || electricTitle.length > 60) errors.push(`Electric title length must be 55-60 chars; found ${electricTitle.length}.`);
if (electricDescription.length < 150 || electricDescription.length > 160) errors.push(`Electric description length must be 150-160 chars; found ${electricDescription.length}.`);

const cheapMetadata = [...data.matchAll(/slug: "motorcycles-under-100k"[\s\S]{0,500}?seoTitle: "([^"]+)"[\s\S]{0,500}?description: "([^"]+)"/g)];
if (cheapMetadata.length !== 1) {
  errors.push("Expected exactly one under-100K metadata record.");
} else {
  const [, title, description] = cheapMetadata[0];
  if (title.length < 55 || title.length > 60) errors.push(`Cheapest-motorcycle title length must be 55-60 chars; found ${title.length}.`);
  if (description.length < 150 || description.length > 160) errors.push(`Cheapest-motorcycle description length must be 150-160 chars; found ${description.length}.`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Category authority wave 4 validation passed.");
