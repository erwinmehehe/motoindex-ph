import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const exists = (...parts) => fs.existsSync(path.join(root, ...parts));
const errors = [];

const pagePath = ["app","motorcycles","expressway-legal","page.tsx"];
if (!exists(...pagePath)) {
  errors.push("Missing /motorcycles/expressway-legal authority page");
} else {
  const page = read(...pagePath);
  for (const token of [
    'path: "/motorcycles/expressway-legal"',
    "Expressway-legal motorcycles in the Philippines",
    "engineCc >= 400",
    "engineCc < 400",
    "DOTC Department Order No. 2007-38",
    "https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/10/45210",
    "verify the exact registered motorcycle",
    "DataTable",
    "ItemList"
  ]) {
    if (!page.includes(token)) errors.push(`Expressway hub missing required evidence/structure: ${token}`);
  }
  if (!page.includes("currentPublicMotorcycles.filter((model) => model.engineCc >= 400)")) {
    errors.push("Expressway qualifying list must use a strict >=400cc filter");
  }
  if (!page.includes("model.engineCc >= 350 && model.engineCc < 400")) {
    errors.push("Expressway hub must separate borderline sub-400cc records from qualifying records");
  }
}

const sitemaps = read("lib","sitemaps.ts");
if (!sitemaps.includes("/motorcycles/expressway-legal")) {
  errors.push("Expressway authority page must be in the motorcycle sitemap");
}

const motorcycles = read("app","motorcycles","page.tsx");
if (!motorcycles.includes('href="/motorcycles/expressway-legal"')) {
  errors.push("Motorcycle hub must link to the expressway-legal authority page");
}

const recommendation = read("app","recommendations","[slug]","page.tsx");
if (!recommendation.includes('guide.slug === "motorcycles-400cc-plus-philippines"') || !recommendation.includes('href="/motorcycles/expressway-legal"')) {
  errors.push("400cc+ guide must link to the distinct expressway-legal authority page");
}

if (errors.length) {
  console.error("Expressway authority validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("Expressway authority validation passed.");
