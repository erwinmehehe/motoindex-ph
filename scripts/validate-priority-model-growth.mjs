import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const growth = read("lib", "priorityModelGrowth.ts");
const modelPage = read("app", "motorcycles", "[make]", "[slug]", "page.tsx");
const commercial = read("components", "PriorityCommercialIntent.tsx");
const data = read("lib", "data.ts");
const route = read("app", "motorcycles", "[make]", "[slug]", "page.tsx");

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
  "yamaha-sniper-155",
  "honda-adv-350",
  "honda-cb650r",
  "kawasaki-ninja-500",
  "yamaha-mio-gravis",
  "yamaha-mio-i-125",
  "yamaha-tmax",
  "yamaha-yzf-r1m",
  "honda-crf300-rally"
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
  "/recommendations/best-motorcycles-for-daily-commute-philippines",
  "/recommendations/dual-sport-motorcycles-philippines",
  "/recommendations/motorcycles-400cc-plus-philippines"
]) {
  if (!growth.includes(`recommendationHref: "${href}"`)) {
    errors.push(`priorityModelGrowth: expected canonical cluster link ${href}`);
  }
}

for (const token of [
  'id: "honda-cb650r"',
  'marketPriceHighPhp: 565000',
  'marketPriceSourceUrl: "https://www.hondaph.com/big-bike/news/honda-philippines-launches-three-new-models-elevates-innovation-at-makina-moto-expo-2026"',
  'id: "honda-adv-350"',
  'srp: 310000',
  'marketPriceSourceUrl: "https://www.hondaph.com/motorcycle/promotions/beyond-expectations-adv350-promo"',
  'id: "kawasaki-ninja-400"',
  'marketStatus: "previous"',
  'successorId: "kawasaki-ninja-500"',
  'id: "yamaha-mio-gravis"',
  'srp: 84900',
  'sourceUrl: "https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/mio-gravis"',
  'id: "yamaha-mio-i-125"',
  'marketPriceSourceUrl: "https://motortrade.com.ph/motorcycles/yamaha-mio-i-125/"',
  'id: "yamaha-tmax"',
  'model: "TMAX Tech Max"',
  'srp: 859000',
  'sourceUrl: "https://www.yamaha-motor.com.ph/motorcycles/sport-machines/sport-scooter/tmax"',
  'id: "yamaha-yzf-r1m"',
  'srp: 1689000',
  'marketPriceHighPhp: 1799000',
  'engineCc: 998',
  'sourceUrl: "https://www.yamaha-motor.com.ph/motorcycles/sport-machines/supersport/yzf-r1m"',
  'marketPriceSourceUrl: "https://motortrade.com.ph/motorcycles/yamaha-yzf-r1/"',
  'id: "honda-crf300-rally"',
  'srp: 309900',
  'engineCc: 286',
  'marketPriceSourceUrl: "https://www.hondaph.com/motorcycle/news/honda-philippines-unleashes-power-and-innovation-at-the-action-packed-inside-racing-bikefest-2025"'
]) {
  if (!data.includes(token)) {
    errors.push(`priorityModelGrowth: competitor-gap data evidence missing: ${token}`);
  }
}

if (!growth.includes('"yamaha-yzf-r1m": {') || !growth.includes("Searchers often shorten the name to Yamaha R1 or simply R1")) {
  errors.push("priorityModelGrowth: YZF-R1M must consolidate broad Yamaha R1 search intent on one canonical page");
}
if (data.includes('id: "yamaha-yzf-r1"') || data.includes('id: "yamaha-r1"')) {
  errors.push("priorityModelGrowth: do not create a duplicate Yamaha R1 entity beside the YZF-R1M canonical");
}

if (!growth.includes('heading: "Looking for the Honda CRF250 Rally?"') || !growth.includes("enhanced successor to the CRF250 Rally")) {
  errors.push("priorityModelGrowth: CRF300 Rally must explicitly consolidate CRF250 Rally predecessor search intent");
}
if (data.includes('id: "honda-crf250-rally"')) {
  errors.push("priorityModelGrowth: do not recreate CRF250 Rally as a current standalone model entity");
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

if (!commercial.includes("profile.legacyContext") || !commercial.includes("legacyContext.heading")) {
  errors.push("PriorityCommercialIntent must render optional predecessor/legacy context on canonical model pages");
}
if (!route.includes('slug === "crf250-rally"') || !route.includes('permanentRedirect("/motorcycles/honda/crf300-rally")')) {
  errors.push("CRF250 Rally legacy route must permanently consolidate into the CRF300 Rally canonical");
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
