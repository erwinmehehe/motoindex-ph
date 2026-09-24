import fs from "node:fs";

const media = fs.readFileSync("lib/media.ts", "utf8");
const targets = [
  "honda-crf300-rally",
  "honda-cb500-hornet-e-clutch",
  "suzuki-avenis",
  "suzuki-smash-fi",
  "suzuki-raider-j-crossover",
  "suzuki-gixxer-155",
  "suzuki-gixxer-sf-155",
  "suzuki-gixxer-250",
  "suzuki-gixxer-sf250",
  "suzuki-v-strom-250-sx",
  "suzuki-v-strom-160",
  "suzuki-dr160",
  "suzuki-access",
  "suzuki-skydrive-sport",
  "suzuki-burgman-street",
  "suzuki-burgman-400",
  "motorstar-cafe-400",
  "motorstar-xplorer-250r",
  "sym-cruisym-150",
  "cfmoto-450mt",
  "cfmoto-450sr",
  "cfmoto-675sr-r",
  "bristol-adx-160",
  "benelli-180s",
  "benelli-trk-502x",
  "ktm-390-duke",
  "royal-enfield-hunter-350",
  "royal-enfield-himalayan-450",
  "bmw-g-310-gs",
  "bmw-g-310-r",
  "bmw-r-1300-gs",
  "vespa-primavera-150",
  "husqvarna-vitpilen-401",
];

const bannedSourceTokens = [
  "teaser",
  "action",
  "marketing-image",
  "promotional",
  "feature-shot",
];

const noGallerySources = new Set([
  "honda-crf300-rally",
  "honda-cb500-hornet-e-clutch",
  "suzuki-avenis",
  "suzuki-smash-fi",
  "suzuki-gixxer-155",
  "suzuki-gixxer-sf-155",
  "suzuki-gixxer-250",
  "suzuki-v-strom-250-sx",
  "suzuki-v-strom-160",
  "suzuki-dr160",
  "suzuki-access",
  "suzuki-skydrive-sport",
  "suzuki-burgman-street",
  "suzuki-burgman-400",
]);

function blockFor(id) {
  const markers = [`entityId:"${id}"`, `entityId: "${id}"`];
  let index = -1;
  for (const marker of markers) {
    index = media.indexOf(marker);
    if (index >= 0) break;
  }
  if (index < 0) throw new Error(`Missing media entry for ${id}`);
  const start = media.lastIndexOf("{", index);
  const end = media.indexOf("\n  },", index);
  if (start < 0 || end < 0) throw new Error(`Could not parse media entry for ${id}`);
  return media.slice(start, end + 5);
}

function field(block, name) {
  return block.match(new RegExp(`\\b${name}\\s*:\\s*"([^"]*)"`))?.[1] || "";
}

const failures = [];
for (const id of targets) {
  const block = blockFor(id);
  const src = field(block, "src");
  const sourceImageUrl = field(block, "sourceImageUrl");
  if (src !== `/media/motorcycles/${id}.webp`) {
    failures.push(`${id}: unexpected local src ${src || "(missing)"}`);
  }
  if (!sourceImageUrl) failures.push(`${id}: missing sourceImageUrl`);
  const lower = sourceImageUrl.toLowerCase();
  const banned = bannedSourceTokens.find((token) => lower.includes(token));
  if (banned) failures.push(`${id}: sourceImageUrl still looks editorial/lifestyle (${banned}) -> ${sourceImageUrl}`);
  if (noGallerySources.has(id) && lower.includes("gallery")) {
    failures.push(`${id}: sourceImageUrl is still a gallery/editorial source -> ${sourceImageUrl}`);
  }
}

if (media.includes("GrabCut") || media.includes("grabCut")) {
  // This is intentionally scoped to lib/media.ts here; the permanent normalizer
  // is separately checked below.
}

const normalizer = fs.readFileSync("scripts/art-direct-motorcycle-media.py", "utf8");
if (/grabCut|grabcut|floodFill|flood_fill/i.test(normalizer)) {
  failures.push("art-direct-motorcycle-media.py still contains destructive foreground segmentation");
}
if (!normalizer.includes("preserve-full-frame") || !normalizer.includes("white-border-bounds")) {
  failures.push("art-direct-motorcycle-media.py is missing the non-destructive normalization policy");
}

if (failures.length) {
  console.error("Priority motorcycle media QA failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}
console.log(`Priority motorcycle media QA passed for ${targets.length} screenshot-flagged motorcycles.`);
