import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const knownBacklog = new Set([
  "nhk-n1-max",
  "nhk-n1-elite",
  "kyt-skyhawk",
  "kyt-tt-revo",
  "gille-kerena-ff007",
  "gille-gts-v1-135",
  "gille-circuit-ff012",
  "gille-gvr-v1-172",
  "gille-squadron-ym-926",
  "gille-orion-af-10",
  "gille-paragon-ah-16",
  "agv-pista-gp-rr",
  "nhk-s2-ultimate",
  "nhk-s2-gp",
  "nhk-r1",
  "nhk-r6",
  "nhk-c1",
  "smk-titan",
  "smk-titan-carbon",
  "smk-allterra",
  "smk-retro-jet",
  "smk-gtj",
  "smk-delta-tour",
  "smk-stellar-sport",
  "smk-nova",
  "smk-retro",
  "smk-stellar",
  "alpinestars-sm5",
  "arai-concept-xe",
  "hnj-818a",
  "hnj-a607",
  "smk-typhoon",
  "smk-gullwing"
]);

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const catalog = read("lib/catalog.ts");
const helmetStart = catalog.indexOf("export const helmetProducts");
const helmetEnd = catalog.indexOf("export const tireProducts", helmetStart);
if (helmetStart < 0 || helmetEnd < 0) throw new Error("Could not isolate helmetProducts in lib/catalog.ts.");

const helmetSource = catalog.slice(helmetStart, helmetEnd);
const catalogIds = new Set([...helmetSource.matchAll(/\bid:\s*"([^"]+)"/g)].map(match => match[1]));

const mediaSources = [read("lib/media.ts"), read("lib/generatedProductMedia.ts")];
const exactMediaIds = new Set();
for (const source of mediaSources) {
  for (const block of source.match(/\{[\s\S]*?\}/g) || []) {
    if (!/entityType["']?\s*:\s*["']helmet["']/.test(block)) continue;
    const entityId = block.match(/entityId["']?\s*:\s*["']([^"']+)["']/)?.[1];
    const src = block.match(/src["']?\s*:\s*["']([^"']+)["']/)?.[1];
    if (entityId && src && !src.includes("/placeholders/")) exactMediaIds.add(entityId);
  }
}

const missing = [...catalogIds].filter(id => !exactMediaIds.has(id)).sort();
const missingSet = new Set(missing);
const unexpectedMissing = missing.filter(id => !knownBacklog.has(id));
const staleBacklog = [...knownBacklog].filter(id => !missingSet.has(id)).sort();

console.log(`Helmet exact-image coverage: ${catalogIds.size - missing.length}/${catalogIds.size} covered; ${missing.length} tracked gaps remain.`);

if (missing.length) {
  console.log("\nTracked exact-image backlog:");
  for (const id of missing) console.log(`- ${id}`);
}

if (unexpectedMissing.length || staleBacklog.length) {
  console.error("\nHelmet media coverage manifest is out of sync.");
  if (unexpectedMissing.length) {
    console.error("Unexpected missing images:");
    for (const id of unexpectedMissing) console.error(`- ${id}`);
  }
  if (staleBacklog.length) {
    console.error("Backlog entries that now have exact media:");
    for (const id of staleBacklog) console.error(`- ${id}`);
  }
  process.exit(1);
}

console.log("Helmet media coverage manifest matches the current repository state.");
