import fs from "node:fs";
import sharp from "sharp";
import { execFileSync } from "node:child_process";

const media = fs.readFileSync("lib/media.ts", "utf8");
const targets = [
  "honda-adv-160",
  "bajaj-pulsar-ns400z",
  "honda-cbr650r",
  "bmw-m-1000-rr",
  "bmw-s-1000-rr",
  "ktm-790-duke",
  "ducati-panigale-v4",
  "honda-gold-wing",
  "ducati-streetfighter-v4",
  "honda-adv-150",
  "bmw-s-1000-r",
  "royal-enfield-bear-650",
  "bmw-f-900-gs",
  "honda-x-adv",
  "honda-rebel-1100",
  "kawasaki-vulcan-s",
  "kawasaki-ninja-650",
  "kawasaki-versys-650",
  "kawasaki-ninja-1000",
  "kawasaki-ninja-h2",
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


const knownBadLocalBlobs = {
  "honda-cb650r": "f77fe03df4f7ab737f794797d006102e2661aef2",
  "honda-xl750-transalp": "47d85bb05396f1ced4080423f051add309059c32",
  "honda-crf1100l-africa-twin": "b6271d1699cace0c1d67cbeeaea4b8779cc53d43",
  "motorstar-cafe-400": "07757e7c65c528f577ab44f10f80849eb7f72b69",
  "honda-x-adv": "181e4250e60e0e7310226c9d03300d7b395e19f8",
  "bmw-f-900-gs": "68c5fade653ba133a68e3193da9a8e35ac672904",
  "royal-enfield-bear-650": "7ae880f2dd400d35bfe5fd0b790fc43f456968e4",
  "bmw-s-1000-r": "41aea72fea46579dc288350f396c8ed2bbea61eb",
  "honda-adv-150": "ef58209a8fd79d6645f598fe628ead98cdec73ce",
  "ducati-streetfighter-v4": "2878fe20c68d3c8ec3b81ba98ce49a47136c1d0c",
  "honda-gold-wing": "95da7ebd62f27a82846f61288d34fb0952379047",
  "ducati-panigale-v4": "04b45148206e683ac896dae2f092df42143e33b1",
  "ktm-790-duke": "59da0617f82e82fd839d058d3101541c54d87156",
  "bmw-s-1000-rr": "04b9f153d013dbc36e8a43f1aa6aa9acc20d2eff",
  "bmw-m-1000-rr": "7cf1c622d5703696fb305bfe42dbec21f8a7ae66",
  "honda-cbr650r": "3f29ddc15dcfacfa8ad84f4ffdc8fee59b98556c",
  "bajaj-pulsar-ns400z": "608c78679c8452d965cf1760f9d1b8a5c4cae2e2",
  "honda-adv-160": "e00dc1fecb1f5f6efeb3fe4c076a4164db5e29c8",
  "honda-rebel-1100": "c55a2b4e17ef7f0e9742177ffc39f171437404a4",
  "kawasaki-vulcan-s": "b2d8567184a4745a3b08b5a03452940cdec3293d",
  "kawasaki-ninja-650": "fe52f5a3df45faa9f0912312ebf3a38463b85199",
  "kawasaki-versys-650": "28b0bd7054c5c258eaec13a323e279176250b0e4",
  "kawasaki-ninja-1000": "63a5651c466d42ddf5c913f36cf583f27098c856",
  "kawasaki-ninja-h2": "bdfef07bc78c0f11f4c24b454050ef6a2a698cbb",
};

for (const [id, badSha] of Object.entries(knownBadLocalBlobs)) {
  const path = `public/media/motorcycles/${id}.webp`;
  if (!fs.existsSync(path)) {
    failures.push(`${id}: expected localized asset is missing`);
    continue;
  }
  const blobSha = execFileSync("git", ["hash-object", path], { encoding: "utf8" }).trim();
  if (blobSha === badSha) failures.push(`${id}: known-bad stale local image is still present`);
}


const whiteCanvasTargets = [
  "honda-x-adv",
  "bmw-f-900-gs",
  "royal-enfield-bear-650",
  "bmw-s-1000-r",
  "honda-adv-150",
  "ducati-streetfighter-v4",
  "kawasaki-ninja-h2",
  "honda-gold-wing",
  "ducati-panigale-v4",
  "ktm-790-duke",
  "bmw-s-1000-rr",
  "bmw-m-1000-rr",
  "honda-cbr650r",
  "kawasaki-ninja-1000",
  "bajaj-pulsar-ns400z",
  "honda-adv-160",
];

for (const id of whiteCanvasTargets) {
  const assetPath = `public/media/motorcycles/${id}.webp`;
  const image = sharp(assetPath);
  const metadata = await image.metadata();
  if (metadata.width !== 1200 || metadata.height !== 1200) {
    failures.push(`${id}: expected 1200x1200 catalog canvas, got ${metadata.width}x${metadata.height}`);
    continue;
  }

  const sampled = await image
    .resize(240, 240, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { data, info } = sampled;
  const border = 14;
  let borderPixels = 0;
  let whiteBorderPixels = 0;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (x >= border && x < info.width - border && y >= border && y < info.height - border) continue;
      const i = (y * info.width + x) * info.channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      borderPixels += 1;
      if (r >= 244 && g >= 244 && b >= 244 && Math.max(r, g, b) - Math.min(r, g, b) <= 10) {
        whiteBorderPixels += 1;
      }
    }
  }
  const whiteRatio = whiteBorderPixels / Math.max(1, borderPixels);
  if (whiteRatio < 0.985) {
    failures.push(`${id}: catalog canvas edge is not consistently white (${(whiteRatio * 100).toFixed(1)}% white)`);
  }
}

if (media.includes("GrabCut") || media.includes("grabCut")) {
  // This is intentionally scoped to lib/media.ts here; the permanent normalizer
  // is separately checked below.
}

const normalizer = fs.readFileSync("scripts/art-direct-motorcycle-media.py", "utf8");
if (/cv2\.(?:grabCut|floodFill)\s*\(/.test(normalizer)) {
  failures.push("art-direct-motorcycle-media.py still calls destructive foreground segmentation");
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
