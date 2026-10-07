import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const catalogFiles = [
  "lib/data.ts",
  "lib/phTier23ModelsBase.ts",
  "lib/phTier23ModelsExpansion2026.ts",
  "lib/phBrandExpansion2026.ts",
  "lib/phCoverageExpansion2026.ts",
  "lib/globalDemandExpansion2026.ts",
  "lib/kawasakiBigBikeExpansion2026.ts",
  "lib/motortradeGapExpansion2026.ts",
  "lib/zigwheelsGapExpansion2026.ts",
  "lib/zigwheelsGapWave2_2026.ts",
  "lib/zigwheelsGapWave3_2026.ts",
  "lib/zigwheelsGapWave4_2026.ts",
  "lib/zigwheelsGapWave5_2026.ts",
  "lib/zigwheelsGapWave6_2026.ts",
  "lib/zigwheelsGapWave7_2026.ts",
  "lib/heroExpansion2026.ts",
  "lib/currentModelGapCloseout2026.ts",
  "lib/historicalGapCloseout2026.ts"
];

const knownBacklog = new Set([
  "benelli-motobi-200-evo",
  "honda-cb150r",
  "honda-crf250-rally",
  "honda-dio",
  "honda-genio",
  "honda-pcx150",
  "honda-rs125",
  "honda-rs150r",
  "honda-scoopy",
  "honda-supra-gtr150",
  "honda-wave125-alpha",
  "honda-zoomer-x",
  "kawasaki-klx-140",
  "kawasaki-ninja-zx-10r",
  "kawasaki-ninja-zx-6r",
  "kawasaki-w175",
  "kawasaki-z900-se",
  "keeway-superlight-200",
  "suzuki-gsx-s150",
  "suzuki-smash-carb",
  "tvs-ntorq-125",
  "vespa-s-125",
  "yamaha-aerox-v1",
  "yamaha-mio-sporty",
  "yamaha-nmax-v1",
  "yamaha-sight",
  "yamaha-sniper-150",
  "yamaha-sr400",
  "yamaha-sz",
  "yamaha-tricity",
  "yamaha-vega-force-i",
  "yamaha-yzf-r15-v3"
]);

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function collectIds(source) {
  return [...source.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);
}

const dataSource = read("lib/data.ts");
const coreStart = dataSource.indexOf("export const motorcycles");
const coreEnd = dataSource.indexOf("...phTier23Motorcycles", coreStart);
if (coreStart < 0 || coreEnd < 0) throw new Error("Could not isolate the core motorcycle catalog in lib/data.ts.");

const catalogIds = new Set(collectIds(dataSource.slice(coreStart, coreEnd)));
for (const relativePath of catalogFiles.slice(1)) {
  for (const id of collectIds(read(relativePath))) catalogIds.add(id);
}

const mediaSource = read("lib/media.ts");
const generatedMediaSource = read("lib/generatedProductMedia.ts");
const renderableSource = read("lib/renderableMedia.ts");
const mediaBlocks = mediaSource.match(/  \\{[\\s\\S]*?\\n  \\},/g) || [];
const generatedArrayStart = generatedMediaSource.indexOf("= [");
if (generatedArrayStart < 0) throw new Error("Missing generated product media array.");
const generatedRecords = JSON.parse("[" + generatedMediaSource.slice(generatedArrayStart + 3, generatedMediaSource.lastIndexOf("];")).trim() + "]");
const suppressedBody = renderableSource.match(/const SUPPRESSED_MEDIA_IDS = new Set\(\[([\s\S]*?)\]\);/)?.[1] || "";
const suppressedRecordIds = new Set([...suppressedBody.matchAll(/"([^"]+)"/g)].map((match) => match[1]));

const renderableByEntity = new Map();
for (const block of mediaBlocks) {
  if (!/"?entityType"?\s*:\s*"motorcycle"/.test(block)) continue;
  const recordId = block.match(/"?id"?\s*:\s*"([^"]+)"/)?.[1];
  const entityId = block.match(/"?entityId"?\s*:\s*"([^"]+)"/)?.[1];
  const src = block.match(/"?src"?\s*:\s*"([^"]+)"/)?.[1];
  const rightsStatus = block.match(/"?rightsStatus"?\s*:\s*"([^"]+)"/)?.[1];
  if (!recordId || !entityId || !src || rightsStatus === "pending" || suppressedRecordIds.has(recordId)) continue;
  renderableByEntity.set(entityId, { recordId, src });
}

for (const record of generatedRecords) {
  if (record.entityType !== "motorcycle" || !record.entityId || !record.src ||
      record.rightsStatus === "pending" || suppressedRecordIds.has(record.id)) continue;
  renderableByEntity.set(record.entityId, { recordId: record.id, src: record.src });
}

const missing = [...catalogIds]
  .filter((entityId) => {
    const asset = renderableByEntity.get(entityId);
    if (!asset) return true;
    const localPath = path.join(root, "public", asset.src.replace(/^\//, ""));
    return !fs.existsSync(localPath);
  })
  .sort();

const missingSet = new Set(missing);
const unexpectedMissing = missing.filter((id) => !knownBacklog.has(id));
const staleBacklog = [...knownBacklog].filter((id) => !missingSet.has(id)).sort();

console.log(`Motorcycle exact-image coverage: ${catalogIds.size - missing.length}/${catalogIds.size} covered; ${missing.length} tracked gaps remain.`);

if (missing.length) {
  console.log("\nTracked exact-image backlog:");
  for (const id of missing) console.log(`- ${id}`);
}

if (unexpectedMissing.length || staleBacklog.length) {
  console.error("\nMotorcycle media coverage manifest is out of sync.");
  if (unexpectedMissing.length) {
    console.error("Unexpected missing images (new regression or new model without media):");
    for (const id of unexpectedMissing) console.error(`- ${id}`);
  }
  if (staleBacklog.length) {
    console.error("Backlog entries that now have exact renderable media; remove them from knownBacklog:");
    for (const id of staleBacklog) console.error(`- ${id}`);
  }
  process.exit(1);
}

console.log("Motorcycle media coverage manifest matches the current repository state.");
