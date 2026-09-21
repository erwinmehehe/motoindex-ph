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
  "lib/kawasakiBigBikeExpansion2026.ts"
];

const knownBacklog = new Set([
  "aprilia-tuareg-660",
  "aprilia-tuono-660",
  "bajaj-dominar-400",
  "bajaj-pulsar-n125",
  "bajaj-pulsar-n160",
  "bajaj-pulsar-ns400z",
  "bajaj-pulsar-rs200",
  "benelli-302s",
  "benelli-leoncino-250",
  "benelli-tnt-135",
  "benelli-trk-502",
  "bmw-f-900-gs",
  "bmw-m-1000-rr",
  "bmw-s-1000-r",
  "bmw-s-1000-rr",
  "bristol-basilica-125",
  "bristol-maxxie-160",
  "cfmoto-300nk",
  "ducati-panigale-v4",
  "ducati-streetfighter-v4",
  "honda-airblade-160",
  "honda-cb500-hornet-e-clutch",
  "honda-cbr150r",
  "honda-cbr650r",
  "honda-crf1100l-africa-twin",
  "honda-xl750-transalp",
  "husqvarna-norden-901",
  "husqvarna-svartpilen-200",
  "kawasaki-eliminator",
  "kawasaki-ninja-1000",
  "kawasaki-ninja-zx-25r",
  "kawasaki-z1000-r-edition",
  "kawasaki-z900",
  "keeway-cafe-racer-152",
  "ktm-200-duke",
  "ktm-790-duke",
  "kymco-agility-eco-125i",
  "kymco-dink-r-150",
  "kymco-dink-s-150",
  "kymco-dollar-150",
  "kymco-dtx360-300",
  "kymco-sky-town-150",
  "royal-enfield-classic-650",
  "royal-enfield-shotgun-650",
  "royal-enfield-super-meteor-650",
  "rusi-adventure-x-150i-v2",
  "rusi-cyclone-400",
  "rusi-flash-150x",
  "suzuki-raider-pro",
  "triumph-daytona-660",
  "triumph-tiger-sport-660",
  "vespa-primavera-150",
  "yamaha-lexi-155",
  "yamaha-yzf-r15m",
  "yamaha-yzf-r3",
  "yamaha-yzf-r7",
  "zontes-150x",
  "zontes-400g",
  "zontes-703rr"
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
const renderableSource = read("lib/renderableMedia.ts");
const mediaBlocks = mediaSource.match(/  \{[\s\S]*?\n  \},/g) || [];
const suppressedBody = renderableSource.match(/const SUPPRESSED_MEDIA_IDS = new Set\(\[([\s\S]*?)\]\);/)?.[1] || "";
const suppressedRecordIds = new Set([...suppressedBody.matchAll(/"([^"]+)"/g)].map((match) => match[1]));

const renderableByEntity = new Map();
for (const block of mediaBlocks) {
  if (!/entityType:\s*"motorcycle"/.test(block)) continue;
  const recordId = block.match(/\bid:\s*"([^"]+)"/)?.[1];
  const entityId = block.match(/entityId:\s*"([^"]+)"/)?.[1];
  const src = block.match(/src:\s*"([^"]+)"/)?.[1];
  const rightsStatus = block.match(/rightsStatus:\s*"([^"]+)"/)?.[1];
  if (!recordId || !entityId || !src || rightsStatus === "pending" || suppressedRecordIds.has(recordId)) continue;
  renderableByEntity.set(entityId, { recordId, src });
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
