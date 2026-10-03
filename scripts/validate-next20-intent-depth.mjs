import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];

const profiles = read("lib", "highDemandIntentDepth2026.ts");
const answers = read("lib", "highDemandIntentAnswers2026.ts");
const panel = read("components", "HighDemandIntentPanel.tsx");
const entity = read("components", "MotorcycleEntityPage.tsx");
const page = read("app", "motorcycles", "[make]", "[slug]", "page.tsx");

const expectedIds = [
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
  "kawasaki-ninja-400",
];

const foundIds = [...profiles.matchAll(/modelId:\s*"([^"]+)"/g)].map((match) => match[1]);
if (foundIds.length !== 20) errors.push(`Expected exactly 20 next-wave intent profiles, found ${foundIds.length}`);

for (const id of expectedIds) {
  if (!foundIds.includes(id)) errors.push(`Missing next-wave intent target: ${id}`);
}

for (const token of [
  "mappedSearchVolume",
  "primaryKeyword",
  "secondaryKeywords",
  "highDemandIntentProfile2026",
]) {
  if (!profiles.includes(token)) errors.push(`Intent profile contract missing: ${token}`);
}

for (const token of [
  "observedMarketPriceLabel",
  "getVerifiedVariantsForModel",
  "performanceAnswerFor",
  "efficiencyEvidence",
  "highDemandIntentAnswers2026",
]) {
  if (!answers.includes(token)) errors.push(`Dynamic answer source missing: ${token}`);
}

for (const token of [
  'id="popular-searches"',
  "Popular searches",
  "price, specs and key questions",
]) {
  if (!panel.includes(token)) errors.push(`Popular-search panel guard missing: ${token}`);
}

for (const token of [
  "HighDemandIntentPanel",
  "highDemandIntentAnswers2026",
  'href: "#popular-searches"',
  "hasTopSpeedIntent",
]) {
  if (!entity.includes(token)) errors.push(`Motorcycle template intent hook missing: ${token}`);
}

for (const token of [
  "highDemandIntentProfile2026",
  "demandProfile.primaryKeyword",
  "...demandProfile.secondaryKeywords",
]) {
  if (!page.includes(token)) errors.push(`Metadata intent hook missing: ${token}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Next 20 high-demand canonical intent validation passed.");
