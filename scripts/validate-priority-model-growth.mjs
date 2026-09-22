import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const growth = read("lib", "priorityModelGrowth.ts");
const modelPage = read("app", "motorcycles", "[make]", "[slug]", "page.tsx");
const recommendationPage = read("app", "recommendations", "[slug]", "page.tsx");
const commercial = read("components", "PriorityCommercialIntent.tsx");
const buyerBrief = read("components", "PriorityModelBrief.tsx");
const data = read("lib", "data.ts");
const route = read("app", "motorcycles", "[make]", "[slug]", "page.tsx");
const tier23 = read("lib", "phTier23ModelsBase.ts");
const brandGrowth = read("lib", "brandSeoGrowth.ts");
const brandPage = read("app", "motorcycles", "[make]", "page.tsx");

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
  "kawasaki-z500",
  "honda-winner-x",
  "yamaha-mio-gravis",
  "yamaha-mio-i-125",
  "yamaha-tmax",
  "yamaha-yzf-r1m",
  "motorstar-cafe-400",
  "kawasaki-z1000-r-edition",
  "vespa-gts-supersport-300",
  "vespa-gtv-300",
  "vespa-primavera-150",
  "vespa-sprint-150",
  "honda-crf300-rally",
  "honda-adv-150",
  "kawasaki-ninja-zx-4rr",
  "honda-x-adv",
  "cfmoto-300sr",
  "cfmoto-400nk",
  "yamaha-yzf-r15m",
  "honda-cbr650r",
  "yamaha-yzf-r7",
  "kawasaki-ninja-zx-25r",
  "bajaj-dominar-400"
];

for (const id of priorityModels) {
  if (!growth.includes(`"${id}": {`)) {
    errors.push(`priorityModelGrowth: missing high-demand profile for ${id}`);
  }
}

for (const id of ["honda-adv-150", "kawasaki-ninja-zx-4rr", "honda-x-adv", "cfmoto-300sr", "cfmoto-400nk"]) {
  if (!buyerBrief.includes(`"${id}": {`)) {
    errors.push(`PriorityModelBrief: missing top-10 ranking-depth buyer brief for ${id}`);
  }
}

for (const token of [
  'heading: "ADV150 vs the current ADV160"',
  'seoTitle: "Ninja ZX-4RR Price Philippines 2026 | Specs & Ownership"',
  'seoTitle: "Honda X-ADV Price Philippines 2026 | 745cc DCT Specs"',
  'seoTitle: "CFMOTO 300SR Price Philippines 2026 | Specs, ABS & Costs"',
  'seoTitle: "CFMOTO 400NK Price Philippines 2026 | Specs, ABS & Costs"'
]) {
  if (!growth.includes(token)) errors.push(`priorityModelGrowth: ranking-depth wave lost token ${token}`);
}

for (const id of ["yamaha-yzf-r15m", "honda-cbr650r", "yamaha-yzf-r7", "kawasaki-ninja-zx-25r", "bajaj-dominar-400"]) {
  if (!buyerBrief.includes(`"${id}": {`)) {
    errors.push(`PriorityModelBrief: missing ranking-depth wave-two buyer brief for ${id}`);
  }
}

for (const token of [
  'seoTitle: "Yamaha YZF-R15M Price Philippines 2026 | Specs & Costs"',
  'seoTitle: "Honda CBR650R Price Philippines 2026 | Specs & Costs"',
  'seoTitle: "Yamaha YZF-R7 Price Philippines 2026 | Specs & Costs"',
  'seoTitle: "Kawasaki ZX-25R Price Philippines 2026 | Specs & Costs"',
  'seoTitle: "Bajaj Dominar 400 Price Philippines 2026 | Specs & Costs"'
]) {
  if (!growth.includes(token)) errors.push(`priorityModelGrowth: ranking-depth wave two lost token ${token}`);
}

if (!tier23.includes('sourceUrl: "https://www.hondaph.com/honda-bigbikes/files/products/65faa98599e4d.pdf"')) {
  errors.push("CBR650R must retain the Honda Philippines primary specification source");
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

for (const token of [
  'slug: "dual-sport-motorcycles-philippines"',
  'seoTitle: "Dual-Sport & Trail Motorcycles Philippines 2026"',
  '"best dual sport motorcycles Philippines"',
  '"trail bike Philippines"',
  '"street legal trail bike Philippines"',
  '"off road motorcycle Philippines"',
  '"Dual-sport vs trail bike: what the terms mean"',
  '"21/18-inch wheels and rough-road priorities"',
  '"What to check before riding on public roads"'
]) {
  if (!data.includes(token)) errors.push(`dual-sport authority: missing token ${token}`);
}
for (const token of [
  'guide.slug==="dual-sport-motorcycles-philippines"',
  'dual-sport and trail bikes the same',
  'use 21/18-inch wheels',
  'public roads in the philippines'
]) {
  if (!recommendationPage.includes(token)) errors.push(`dual-sport authority renderer: missing token ${token}`);
}

if (!growth.includes('"yamaha-yzf-r1m": {') || !growth.includes("Searchers often shorten the name to Yamaha R1 or simply R1")) {
  errors.push("priorityModelGrowth: YZF-R1M must consolidate broad Yamaha R1 search intent on one canonical page");
}
if (data.includes('id: "yamaha-yzf-r1"') || data.includes('id: "yamaha-r1"')) {
  errors.push("priorityModelGrowth: do not create a duplicate Yamaha R1 entity beside the YZF-R1M canonical");
}

for (const token of [
  'id: "motorstar-cafe-400"',
  'marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/motorstar/cafe-400/price"',
  'id: "kawasaki-z1000-r-edition"',
  'generation: "2017 Philippine R Edition"',
  'marketStatus: "previous"',
  'Historical Philippine MSRP of ₱710,000',
  'id: "vespa-gts-supersport-300"',
  'sourceUrl: "https://www.vespa.com/ph_EN/models/gts/gts-supersport-300-hpe-2025/"',
  'id: "vespa-gtv-300"',
  'sourceUrl: "https://www.vespa.com/ph_EN/models/gtv/gtv-300-hpe-2025/"',
  'id: "vespa-primavera-150"',
  'id: "vespa-sprint-150"'
]) {
  if (!tier23.includes(token)) {
    errors.push(`priorityModelGrowth: tier-2/3 competitor-gap evidence missing: ${token}`);
  }
}

if (!brandGrowth.includes('vespa: {') || !brandGrowth.includes("Vespa Philippines Price List 2026") || !brandGrowth.includes("city-price or installment pages")) {
  errors.push("brandSeoGrowth: Vespa hub must own broad price/model intent without thin city or installment URLs");
}
if (!brandPage.includes("brandSeoGrowthProfile(make)") || !brandPage.includes("brandGrowth.intentNote")) {
  errors.push("brand page must render the focused Vespa authority profile");
}
if (!growth.includes('"motorstar-cafe-400": {') || !growth.includes('"kawasaki-z1000-r-edition": {')) {
  errors.push("priorityModelGrowth: Cafe 400 and Z1000 R Edition must retain focused canonical SEO profiles");
}
if (!growth.includes('"vespa-gts-supersport-300": {') || !growth.includes('"vespa-gtv-300": {') || !growth.includes('"vespa-primavera-150": {') || !growth.includes('"vespa-sprint-150": {')) {
  errors.push("priorityModelGrowth: tracked Vespa models must retain canonical commercial-intent profiles");
}

for (const token of [
  '"kawasaki-z500": {',
  'heading: "Looking for the Kawasaki Z400?"',
  '"honda-winner-x": {',
  'heading: "Looking for the Honda RS150R?"',
  'heading: "Looking for the Yamaha Mio Sporty?"'
]) {
  if (!growth.includes(token)) {
    errors.push(`priorityModelGrowth: missing legacy-demand consolidation token: ${token}`);
  }
}

for (const token of [
  '"honda/rs150r"',
  'slug: "winner-x"',
  '"kawasaki/z400"',
  'slug: "z500"',
  '"yamaha/mio-sporty"',
  'slug: "mio-i-125"'
]) {
  if (!route.includes(token)) {
    errors.push(`model route: missing legacy redirect mapping: ${token}`);
  }
}

for (const legacyId of ["honda-rs150r", "kawasaki-z400", "yamaha-mio-sporty"]) {
  if (data.includes(`id: "${legacyId}"`)) {
    errors.push(`priorityModelGrowth: do not recreate ${legacyId} as a standalone model entity; consolidate it into the current canonical target`);
  }
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
