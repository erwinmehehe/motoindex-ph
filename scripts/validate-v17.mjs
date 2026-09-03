import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.cwd());
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const data = read("lib/data.ts");
const media = read("lib/media.ts");
const market = read("lib/marketChecks.ts");
const nextConfig = read("next.config.mjs");
const pkg = JSON.parse(read("package.json"));

const added = [
  "honda-giorno-plus", "honda-xrm125", "honda-tmx-supremo",
  "yamaha-pg-1", "yamaha-wr155r", "yamaha-xmax",
  "suzuki-avenis", "suzuki-smash-fi", "suzuki-raider-j-crossover", "suzuki-raider-pro",
  "suzuki-gixxer-155", "suzuki-gixxer-sf-155", "suzuki-gixxer-250", "suzuki-gixxer-sf250",
  "suzuki-v-strom-250-sx", "suzuki-v-strom-160", "suzuki-dr160", "suzuki-access",
  "suzuki-skydrive-sport", "suzuki-burgman-street",
  "kawasaki-klx150", "kawasaki-klx230", "kawasaki-ninja-500", "kawasaki-z500"
];

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const blockForId = (source, id) => {
  const start = source.indexOf(`id: "${id}"`);
  if (start < 0) return "";
  const next = source.indexOf("\n  {", start + 1);
  return source.slice(start, next < 0 ? source.length : next);
};

const [pkgMajor17,pkgMinor17]=String(pkg.version||"0.0.0").split(".").map(Number);
assert(pkgMajor17>1||(pkgMajor17===1&&pkgMinor17>=7), `package version should be v1.7 or later, found ${pkg.version}`);
assert(pkg.scripts?.["validate:v17"] === "node scripts/validate-v17.mjs", "validate:v17 script missing");
assert(pkg.scripts?.["validate:all"]?.includes("validate:v17"), "validate:all does not include v1.7");
assert(added.length === 24, "v1.7 should add exactly 24 model-level motorcycles");

for (const id of added) {
  const block = blockForId(data, id);
  assert(Boolean(block), `missing motorcycle ${id}`);
  assert(block.includes('freshness: "verified"'), `${id} is not verified`);
  assert(block.includes('verifiedAt: "2026-08-25"'), `${id} missing current verification date`);
  assert(/sourceUrl: "https:\/\//.test(block), `${id} missing HTTPS source`);
  assert(block.includes('marketStatus: "current"'), `${id} missing current market status`);

  const mediaMatch = media.match(new RegExp(`entityId: "${id.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}"[\\s\\S]{0,700}?rightsStatus: "external-reference"`));
  assert(Boolean(mediaMatch), `${id} missing external-reference imagery`);
  const mediaBlock = blockForId(media.replaceAll("entityId:", "id:"), id);
  assert(Boolean(mediaBlock), `${id} media block not found`);
}

assert(!data.includes("/variants/"), "variant page path leaked into data architecture");
assert(data.includes("MotoIndex keeps one model-level page rather than separate trim pages"), "model-level/no-trim policy not documented in model data");
assert(data.includes('/\\bABS\\b/i'), "ABS recommendation matcher is not using a word-boundary regex");

const sourceNames = [...market.matchAll(/sourceName:"([^"]+)"/g)].map((m) => m[1]);
for (const source of ["Zigwheels Philippines", "Motortrade", "Wheeltek"]) {
  assert(sourceNames.includes(source), `market source missing: ${source}`);
}
const wheeltekRows = sourceNames.filter((s) => s === "Wheeltek").length;
assert(wheeltekRows >= 10, `expected at least 10 Wheeltek price observations, found ${wheeltekRows}`);
assert(market.includes('modelId:"yamaha-pg-1"') && market.includes("82900") && market.includes("96400"), "PG-1 live price disagreement is not preserved");

for (const host of ["wheeltek.com.ph", "motortrade.com.ph", "mc.suzuki.com.ph", "kawasakileisurebikes.ph", "www.kawasakileisurebikes.ph"]) {
  assert(nextConfig.includes(`hostname: "${host}"`), `Next image allowlist missing ${host}`);
}

for (const id of added) {
  const entityIndex = media.indexOf(`entityId: "${id}"`);
  const nextEntity = media.indexOf('entityId: "', entityIndex + 1);
  const block = media.slice(entityIndex, nextEntity < 0 ? media.length : nextEntity);
  assert(!block.includes('rightsStatus: "licensed"'), `${id} falsely claims licensed imagery`);
  assert(/Manufacturer-hosted image reference|Authorized-dealer image reference/.test(block), `${id} imagery does not disclose source class`);
  assert(/sourceUrl: "https:\/\//.test(block), `${id} imagery lacks source URL`);
}

if (failures.length) {
  console.error(`v1.7 validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`v1.7 validation passed: ${added.length} new current models, ${wheeltekRows} Wheeltek live-price rows, sourced image references, no variant-page expansion.`);
