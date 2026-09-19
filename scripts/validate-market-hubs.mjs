import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];
const requireFile = (...parts) => {
  const file = path.join(root, ...parts);
  if (!fs.existsSync(file)) errors.push(`Missing required file: ${parts.join("/")}`);
};
const requireText = (source, needle, message) => {
  if (!source.includes(needle)) errors.push(message);
};
const forbidText = (source, needle, message) => {
  if (source.includes(needle)) errors.push(message);
};

requireFile("app", "motorcycles", "scooters", "page.tsx");
requireFile("app", "motorcycles", "scooters", "scooters.module.css");

const motorcycles = read("app", "motorcycles", "page.tsx");
const sitemaps = read("lib", "sitemaps.ts");

requireText(
  motorcycles,
  'title: "Motorcycle Price List Philippines 2026 | MotoIndex"',
  "Motorcycle hub must target the motorcycle price-list intent in its title."
);
requireText(
  motorcycles,
  "<h1>Motorcycle prices in the Philippines</h1>",
  "Motorcycle hub must keep a direct Philippines price-intent H1."
);
requireText(
  motorcycles,
  'href="/motorcycles/scooters"',
  "Motorcycle hub must link directly to the national scooter authority page."
);
forbidText(
  motorcycles,
  'href="/recommendations#scooters"',
  "Motorcycle hub must not route national scooter intent to a generic recommendation fragment."
);
requireText(
  motorcycles,
  "marketMedianPrice",
  "Motorcycle hub must expose dataset-derived market summary statistics."
);
requireText(
  motorcycles,
  'href="/recommendations/motorcycles-under-100k"',
  "Motorcycle hub must link budget intent to the canonical under-100K guide."
);
requireText(
  motorcycles,
  'href="/recommendations/motorcycles-400cc-plus-philippines"',
  "Motorcycle hub must link 400cc+ intent to the canonical guide."
);

if (fs.existsSync(path.join(root, "app", "motorcycles", "scooters", "page.tsx"))) {
  const scooters = read("app", "motorcycles", "scooters", "page.tsx");
  requireText(scooters, 'path: "/motorcycles/scooters"', "Scooter hub metadata must self-canonicalize.");
  requireText(scooters, "Scooters in the Philippines", "Scooter hub must use the national scooter intent in visible copy.");
  requireText(scooters, "currentScooters", "Scooter hub must derive its inventory from current canonical motorcycle data.");
  requireText(scooters, "StatRow", "Scooter hub must expose dataset summary statistics.");
  requireText(scooters, "DataTable", "Scooter hub must include a compact comparable price/spec table.");
  for (const slug of [
    "125cc-scooters-philippines",
    "150cc-scooters-philippines",
    "160cc-scooters-philippines",
    "maxi-scooters-philippines",
    "honda-scooters-philippines",
    "yamaha-scooters-philippines"
  ]) {
    requireText(
      scooters,
      `/recommendations/${slug}`,
      `Scooter hub must link to child cluster ${slug}.`
    );
  }
  requireText(scooters, 'href="/methodology"', "Scooter hub must expose methodology.");
  requireText(scooters, 'href="/data-sources"', "Scooter hub must expose source policy.");
}

requireText(
  sitemaps,
  '/motorcycles/scooters',
  "National scooter authority page must be included in the motorcycle sitemap."
);

const recommendationRoute = read("app", "recommendations", "[slug]", "page.tsx");
requireText(
  recommendationRoute,
  'guide.slug === "best-scooters-philippines"',
  "Best-scooters editorial guide must declare its national scooter parent hub."
);
requireText(
  recommendationRoute,
  'href="/motorcycles/scooters"',
  "Best-scooters editorial guide must link back to the national scooter authority hub."
);

if (errors.length) {
  console.error("Market hub validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Market hub validation passed: motorcycle price-list hub and national scooter authority architecture are intact.");
