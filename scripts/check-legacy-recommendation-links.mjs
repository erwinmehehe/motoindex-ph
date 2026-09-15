import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scanRoots = ["app", "components"];
const failures = [];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

for (const base of scanRoots) {
  const dir = path.join(root, base);
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir)) {
    const rel = path.relative(root, file).replaceAll(path.sep, "/");
    // The restored editorial guide route and its hub archive intentionally link
    // to canonical /recommendations/[slug] pages. Electric aliases remain
    // separately consolidated and are excluded from this legacy-link audit.
    if (rel === "app/recommendations/[slug]/page.tsx") continue;
    if (rel === "app/recommendations/RecommendationGuideArchive.tsx") continue;
    if (rel.startsWith("app/recommendations/electric-")) continue;
    const src = fs.readFileSync(file, "utf8");
    for (const match of src.matchAll(/["'`](\/recommendations\/[^"'`?#\s]+)["'`]/g)) {
      failures.push(`${rel}: review recommendation link ${match[1]}; direct standalone-guide links are only expected from the recommendation archive/editorial route`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Recommendation-link audit passed.");
