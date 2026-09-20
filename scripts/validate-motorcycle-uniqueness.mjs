import fs from "node:fs";

const modelFiles = [
  "lib/data.ts",
  "lib/phTier23ModelsBase.ts",
  "lib/phTier23ModelsExpansion2026.ts",
  "lib/phBrandExpansion2026.ts",
  "lib/phCoverageExpansion2026.ts",
  "lib/globalDemandExpansion2026.ts",
  "lib/kawasakiBigBikeExpansion2026.ts",
];

const seen = new Map();
const duplicates = [];

for (const file of modelFiles) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/\bid:\s*"([^"]+)"/g)) {
    const id = match[1];
    const previous = seen.get(id);
    if (previous) duplicates.push({ id, first: previous, duplicate: file });
    else seen.set(id, file);
  }
}

if (duplicates.length) {
  console.error("Duplicate motorcycle IDs found across composed catalog sources:");
  for (const row of duplicates) console.error(`- ${row.id}: ${row.first} and ${row.duplicate}`);
  process.exit(1);
}

console.log(`Motorcycle entity uniqueness OK: ${seen.size} IDs across ${modelFiles.length} catalog sources.`);
