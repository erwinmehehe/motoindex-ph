import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

function requireText(source, needle, message) {
  if (!source.includes(needle)) throw new Error(message);
}

function requireRegex(source, regex, message) {
  if (!regex.test(source)) throw new Error(message);
}

function requireFile(...parts) {
  const file = path.join(root, ...parts);
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${parts.join("/")}`);
}

const guidePage = read("app", "guides", "[slug]", "page.tsx");
const guideMedia = read("lib", "editorialGuideMedia.ts");
const guideFeaturedArt = read("components", "GuideFeaturedArt.tsx");
const priorityBrief = read("components", "PriorityModelBrief.tsx");
const media = read("lib", "media.ts");
const loan = read("app", "tools", "motorcycle-loan-calculator", "page.tsx");
const insurance = read("app", "tools", "motorcycle-insurance-calculator", "page.tsx");
const registration = read("app", "tools", "lto-registration-fee-calculator", "page.tsx");
const charging = read("app", "tools", "electric-motorcycle-charging-cost", "page.tsx");
const range = read("app", "tools", "electric-motorcycle-range-calculator", "page.tsx");

requireFile("public", "media", "guides", "motorcycle-helmet-size-guide.svg");
requireFile("public", "media", "guides", "motorcycle-helmet-certification-philippines.svg");
requireText(guideMedia, '"motorcycle-helmet-size-guide"', "Helmet size guide must keep a first-party media record.");
requireText(guideMedia, '"motorcycle-helmet-certification-philippines"', "Helmet certification guide must keep a first-party media record.");
requireText(guideMedia, 'publishedAt: "2026-09-08"', "Editorial guide publication dates must remain explicit and real.");
requireText(guidePage, "getEditorialGuideMedia", "Editorial guides must resolve their own media record.");
requireText(guidePage, "<GuideFeaturedArt", "Editorial guide featured art must remain visible in the article.");
requireText(guideFeaturedArt, 'viewBox="0 0 1200 630"', "Editorial featured art must keep the 1200x630 social/editorial aspect ratio.");
requireText(guidePage, "datePublished: guideMedia?.publishedAt", "Article schema must use the guide publication date.");
requireText(guidePage, "image: schemaImage", "Article schema must retain the guide hero image.");
requireText(guidePage, "Last source check", "Editorial guides must keep visible source-check dates.");

const priorityModels = [
  "yamaha-aerox-v3",
  "yamaha-nmax-v3",
  "honda-adv-160",
  "honda-click-125i",
  "honda-click-160",
  "honda-pcx-160",
  "suzuki-raider-r150",
  "yamaha-sniper-155",
  "kawasaki-ninja-500",
  "kawasaki-ninja-400",
  "cfmoto-450mt",
  "cfmoto-450sr",
  "ktm-rc-390"
];

for (const id of priorityModels) {
  requireText(priorityBrief, `"${id}"`, `Priority buyer brief missing for ${id}.`);
  requireRegex(media, new RegExp(`entityId\\s*:\\s*["']${id}["']`), `Priority model media missing for ${id}.`);
}

requireText(priorityBrief, "Buying guide →", "Priority model pages must link into the consolidated buying guide.");
requireText(priorityBrief, "/ownership/cost-calculator?bike=${model.id}", "Priority model pages must deep-link to ownership cost with the current model.");
requireText(priorityBrief, "/commute/cost-calculator?bike=${model.id}", "Priority model pages must deep-link to commute cost with the current model.");
requireText(priorityBrief, 'href="/dealers"', "Priority model pages must keep a dealer research step.");

for (const [name, source] of [
  ["loan", loan],
  ["insurance", insurance],
  ["registration", registration],
  ["EV charging", charging],
  ["EV range", range]
]) {
  requireText(source, "Worked example", `${name} calculator must keep a worked example.`);
  requireText(source, "Assumptions and limitations", `${name} calculator must keep assumptions and limitations.`);
  requireRegex(source, /Related (motorcycles|electric motorcycles|motorcycles and ownership research)/, `${name} calculator must link back to relevant motorcycle research.`);
}

console.log(`Authority growth validation passed: ${priorityModels.length} priority models, premium guide art, 2 original source graphics, 5 deepened calculator pages.`);
