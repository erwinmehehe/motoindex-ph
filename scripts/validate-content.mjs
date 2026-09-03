import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const data = fs.readFileSync(path.join(root, "lib/data.ts"), "utf8");
const ids = [...data.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);
const slugs = [...data.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
const duplicates = (arr) => arr.filter((v, i) => arr.indexOf(v) !== i);
const files = [
  "app/page.tsx",
  "app/motorcycles/page.tsx",
  "app/motorcycles/[make]/[slug]/page.tsx",
  "app/motorcycles/[make]/[slug]/price/page.tsx",
  "app/motorcycles/[make]/[slug]/tire-size/page.tsx",
  "app/compare/page.tsx",
  "app/compare/[slug]/page.tsx",
  "app/gear/helmets/page.tsx",
  "app/tires/page.tsx",
  "app/ownership/page.tsx",
  "app/sitemap.ts",
  "app/robots.ts",
  "prisma/schema.prisma"
];
const missing = files.filter(f => !fs.existsSync(path.join(root, f)));
if (duplicates(ids).length) throw new Error(`Duplicate model ids: ${duplicates(ids).join(", ")}`);
if (missing.length) throw new Error(`Missing required files: ${missing.join(", ")}`);
console.log(`OK: ${ids.length} model records; ${slugs.length} total slug declarations; ${files.length} required files present.`);
