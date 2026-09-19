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
    const src = fs.readFileSync(file, "utf8");

    // Standalone /recommendations/[slug] pages are canonical destinations.
    // What we must prevent from leaking back into entity/category pages is the
    // older hub-fragment architecture. The hub itself may still use its own
    // section anchors for in-page navigation.
    if (rel === "app/recommendations/RecommendationsHub.tsx") continue;

    for (const match of src.matchAll(/["'`](\/recommendations#[^"'`\s]+)["'`]/g)) {
      failures.push(
        `${rel}: legacy recommendation-fragment link ${match[1]} should point to the canonical standalone guide or entity hub instead`
      );
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Recommendation-link audit passed: no external legacy /recommendations#fragment links remain.");
