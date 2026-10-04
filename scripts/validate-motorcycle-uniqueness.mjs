import fs from "node:fs";

const modelFiles = [
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
  "lib/kawasakiScooterExpansion2026.ts",
  "lib/currentModelGapCloseout2026.ts",
  "lib/historicalGapCloseout2026.ts"
];

const records = [];

for (const file of modelFiles) {
  const source = fs.readFileSync(file, "utf8");
  const matcher = /\bid:\s*"([^"]+)"[\s\S]{0,700}?\bmakeSlug:\s*"([^"]+)"[\s\S]{0,700}?\bslug:\s*"([^"]+)"/g;
  for (const match of source.matchAll(matcher)) {
    records.push({ id: match[1], makeSlug: match[2], slug: match[3], file });
  }
}

function duplicatesBy(keyFor) {
  const seen = new Map();
  const duplicates = [];
  for (const record of records) {
    const key = keyFor(record);
    const previous = seen.get(key);
    if (previous) duplicates.push({ key, first: previous.file, duplicate: record.file });
    else seen.set(key, record);
  }
  return duplicates;
}

const duplicateIds = duplicatesBy((record) => record.id);
const duplicateRoutes = duplicatesBy((record) => `${record.makeSlug}/${record.slug}`);

if (duplicateIds.length || duplicateRoutes.length) {
  console.error("Motorcycle catalog uniqueness validation failed:");
  for (const row of duplicateIds) console.error(`- duplicate id ${row.key}: ${row.first} and ${row.duplicate}`);
  for (const row of duplicateRoutes) console.error(`- duplicate route ${row.key}: ${row.first} and ${row.duplicate}`);
  process.exit(1);
}

console.log(`Motorcycle entity uniqueness OK: ${records.length} IDs/routes across ${modelFiles.length} catalog sources.`);
