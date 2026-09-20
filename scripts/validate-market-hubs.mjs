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
const requireRegex = (source, pattern, message) => {
  if (!pattern.test(source)) errors.push(message);
};

requireFile("app", "motorcycles", "scooters", "page.tsx");
requireFile("lib", "kawasakiBigBikeExpansion2026.ts");

const motorcycles = read("app", "motorcycles", "page.tsx");
const sitemaps = read("lib", "sitemaps.ts");
const brandPage = read("app", "motorcycles", "[make]", "page.tsx");
const brandGrowth = read("lib", "brandSeoGrowth.ts");
const tier23Models = read("lib", "phTier23ModelsBase.ts");
const tier23Index = read("lib", "phTier23Models.ts");
const kawasakiExpansion = read("lib", "kawasakiBigBikeExpansion2026.ts");
const compareBuilder = read("components", "CompareBuilder.tsx");

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

for (const [slug, label, title, modelToken] of [
  ["honda", "Honda", "Honda big bikes in the Philippines", "CB650R, CBR650R, Rebel, X-ADV and Gold Wing"],
  ["yamaha", "Yamaha", "Yamaha big bikes in the Philippines", "TMAX Tech Max, YZF-R7 and YZF-R1M"]
]) {
  requireText(brandGrowth, `${slug}: {`, `${label} must have a brand SEO growth profile for big-bike intent.`);
  const profileStart = brandGrowth.indexOf(`${slug}: {`);
  const profileEnd = brandGrowth.indexOf("\n  },", profileStart);
  const profile = profileStart >= 0 && profileEnd > profileStart ? brandGrowth.slice(profileStart, profileEnd) : "";
  for (const token of ["bigBikeMinCc: 400", title, modelToken]) {
    requireText(profile, token, `${label} brand growth profile missing big-bike token: ${token}`);
  }
}

requireText(
  brandGrowth,
  'kawasaki: {',
  "Kawasaki must have a brand SEO growth profile for big-bike intent."
);
for (const token of [
  'bigBikeMinCc: 400',
  'Kawasaki Big Bikes Philippines',
  'Kawasaki big bikes in the Philippines'
]) {
  requireText(brandGrowth, token, `Kawasaki brand growth profile missing big-bike token: ${token}`);
}
for (const token of [
  "const bigBikeMinCc = brandGrowth?.bigBikeMinCc",
  'id="big-bikes"',
  "bigBikeTitle",
  "bigBikeDescription"
]) {
  requireText(brandPage, token, `Brand page missing dataset-driven big-bike behavior: ${token}`);
}
requireRegex(
  tier23Models,
  /id: "kawasaki-ninja-zx-4rr"[\s\S]{0,800}?srp: 499000[\s\S]{0,1400}?sourceUrl: "https:\/\/kawasakileisurebikes\.ph\/motorcycles\/supersports\/ninja-zx-4rr\//,
  "Kawasaki ZX-4RR must use the current Kawasaki Philippines MSRP/source."
);
requireRegex(
  tier23Models,
  /id: "kawasaki-ninja-h2"[\s\S]{0,500}?model: "Ninja H2 Carbon"[\s\S]{0,800}?srp: 1855000[\s\S]{0,1400}?sourceUrl: "https:\/\/www\.kawasakileisurebikes\.ph\/motorcycles\/supersports\/ninja-h2-carbon\//,
  "Kawasaki Ninja H2 canonical must display the current Philippine Ninja H2 Carbon name and source."
);
requireText(
  tier23Index,
  'kawasakiBigBikeExpansion2026',
  "Kawasaki big-bike expansion must be included in the public motorcycle dataset."
);
for (const id of [
  "kawasaki-ninja-650",
  "kawasaki-z650",
  "kawasaki-z900",
  "kawasaki-z-h2",
  "kawasaki-versys-650",
  "kawasaki-vulcan-s",
  "kawasaki-eliminator"
]) {
  requireText(kawasakiExpansion, `id: "${id}"`, `Kawasaki expansion missing verified current model: ${id}`);
}
for (const sourcePath of [
  "/motorcycles/sports/ninja-650/",
  "/motorcycles/sports/z650/",
  "/motorcycles/sports/z900-standard/",
  "/motorcycles/supersports/z-h2/",
  "/motorcycles/versys/versys-650/",
  "/motorcycles/cruisers/vulcan-s/",
  "/motorcycles/cruisers/eliminator/"
]) {
  requireText(kawasakiExpansion, sourcePath, `Kawasaki expansion missing current Philippine manufacturer source: ${sourcePath}`);
}
for (const token of [
  'useSearchParams',
  'searchParams.get("make")',
  'model.makeSlug===makeFilter',
  'Compare ${activeMake} motorcycles'
]) {
  requireText(compareBuilder, token, `Compare builder must honor brand-filtered entry points: ${token}`);
}
for (const [slug, label] of [["honda", "Honda"], ["yamaha", "Yamaha"], ["kawasaki", "Kawasaki"]]) {
  for (const route of [
    ["app", "motorcycles", `${slug}-big-bike`],
    ["app", "motorcycles", slug, "big-bike"],
    ["app", "motorcycles", slug, "big-bikes"]
  ]) {
    if (fs.existsSync(path.join(root, ...route))) {
      errors.push(`Thin ${label} big-bike route must not exist: ${route.join("/")}`);
    }
  }
}


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
