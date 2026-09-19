import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const growth = read("lib", "priorityModelGrowth.ts");
const modelPage = read("app", "motorcycles", "[make]", "[slug]", "page.tsx");
const commercial = read("components", "PriorityCommercialIntent.tsx");

const priorityModels = [
  "yamaha-aerox-v3",
  "yamaha-nmax-v3",
  "honda-adv-160",
  "honda-click-125i",
  "honda-click-160",
  "honda-pcx-160",
  "yamaha-fazzio",
  "suzuki-burgman-street-ex",
  "suzuki-raider-r150",
  "yamaha-sniper-155"
];

for (const id of priorityModels) {
  if (!growth.includes(`"${id}": {`)) {
    errors.push(`priorityModelGrowth: missing high-demand profile for ${id}`);
  }
}

for (const href of [
  "/recommendations/125cc-scooters-philippines",
  "/recommendations/150cc-scooters-philippines",
  "/recommendations/160cc-scooters-philippines",
  "/recommendations/best-motorcycles-for-daily-commute-philippines"
]) {
  if (!growth.includes(`recommendationHref: "${href}"`)) {
    errors.push(`priorityModelGrowth: expected canonical cluster link ${href}`);
  }
}

if (/recommendationHref:\s*"\/recommendations#/.test(growth)) {
  errors.push("priorityModelGrowth: high-demand commercial profiles must not use fragment-only recommendation targets");
}

for (const keyword of [
  "price philippines 2026",
  "specs & monthly",
  "down payment",
  "ownership"
]) {
  if (!growth.toLowerCase().includes(keyword)) {
    errors.push(`priorityModelGrowth: missing commercial-intent language: ${keyword}`);
  }
}

if (!modelPage.includes("<PriorityCommercialIntent model={model} />")) {
  errors.push("model route must render PriorityCommercialIntent on canonical model pages");
}

for (const token of [
  "price, monthly payment and alternatives",
  'href="#price"',
  'href="#installment"',
  "Open loan calculator",
  "Get dealer price"
]) {
  if (!commercial.includes(token)) {
    errors.push(`PriorityCommercialIntent lost required canonical commercial path: ${token}`);
  }
}

if (errors.length) {
  console.error("Priority model growth validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Priority model growth validation passed: high-demand canonical model pages retain commercial-intent coverage and canonical cluster links.");
