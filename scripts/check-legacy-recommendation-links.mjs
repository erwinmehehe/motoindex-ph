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
    if (rel === "app/recommendations/[slug]/page.tsx") continue;
    if (rel.startsWith("app/recommendations/electric-")) continue;
    const src = fs.readFileSync(file, "utf8");
    for (const match of src.matchAll(/["'`](\/recommendations\/[^"'`?#\s]+)["'`]/g)) {
      failures.push(`${rel}: replace legacy recommendation link ${match[1]} with the canonical /recommendations#section href`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Legacy recommendation-link audit passed.");
