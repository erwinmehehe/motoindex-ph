import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const data = read("lib", "data.ts");
const variants = read("lib", "variants.ts");
const growth = read("lib", "priorityModelGrowth.ts");
const entity = read("components", "MotorcycleEntityPage.tsx");
const colorProfiles = read("lib", "modelColorLandingPages.ts");
const colorRoute = read("app", "motorcycles", "[make]", "[slug]", "colors", "page.tsx");

for (const token of [
  'id: "honda-click-125i"',
  'frontTire: "90/80-14"',
  'rearTire: "100/80-14"',
  'groundClearanceMm: 131',
  'marketPriceHighPhp: 90000',
  'Matte Cyber Grape Metallic',
  'marketPriceCheckedAt: "2026-10-03"'
]) {
  if (!data.includes(token)) errors.push(`Click125 current-data guard missing: ${token}`);
}

for (const token of [
  'id: "honda-click-125-standard"',
  'srpPhp: 83000',
  'id: "honda-click-125-smart-edition"',
  'srpPhp: 87700',
  'id: "honda-click-125-street"',
  'srpPhp: 90000',
  'Naked handlebar design'
]) {
  if (!variants.includes(token)) errors.push(`Click125 variant guard missing: ${token}`);
}

for (const token of [
  'Yamaha Aerox V3 Price Philippines 2026 | Colors & SP',
  'Yamaha NMAX V3 Price Philippines 2026 | Colors & Tech Max',
  'Honda Click 125i Price Philippines 2026 | Colors & Street'
]) {
  if (!growth.includes(token)) errors.push(`High-demand SEO title guard missing: ${token}`);
}

for (const token of [
  'colorIntentLandingProfile',
  'const colorLanding = colorIntentLandingProfile(model.id);',
  'href: "#colors", label: "Colors"',
  '/motorcycles/${model.makeSlug}/${model.slug}/colors',
  'Dedicated color guide',
  '!colorLanding && allColors.length > 0'
]) {
  if (!entity.includes(token)) errors.push(`High-demand color handoff guard missing: ${token}`);
}

for (const token of [
  'modelId: "yamaha-aerox-v3"',
  'keywordVolume: 2000',
  'modelId: "honda-click-125i"',
  'keywordVolume: 6600',
  'modelId: "yamaha-nmax-v3"',
  'keywordVolume: 2700'
]) {
  if (!colorProfiles.includes(token)) errors.push(`High-demand color profile guard missing: ${token}`);
}

for (const token of [
  'colorIntentLandingProfiles',
  'variantColorRows',
  'MotoIndex does not invent color swatches',
  'FAQPage'
]) {
  if (!colorRoute.includes(token)) errors.push(`High-demand color route guard missing: ${token}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("High-demand color/variant intent validation passed with focused color-page handoff.");
