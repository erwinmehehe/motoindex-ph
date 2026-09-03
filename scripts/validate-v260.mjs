import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (p) => fs.existsSync(path.join(root, p));
const need = (p, tokens) => {
  if (!exists(p)) { errors.push(`${p} missing`); return; }
  const src = read(p);
  for (const token of tokens) if (!src.includes(token)) errors.push(`${p} missing ${token}`);
};

const pkg = JSON.parse(read("package.json"));
const [major, minor] = String(pkg.version).split(".").map(Number);
if (!(major === 2 && minor >= 6)) errors.push(`package version must be v2.6.0+, found ${pkg.version}`);
need("package.json", ['"validate:v260": "node scripts/validate-v260.mjs"']);

need("app/layout.tsx", ['./v247.css', './v260.css']);
const layout = read("app/layout.tsx");
if (!(layout.indexOf('./v260.css') > layout.indexOf('./v247.css'))) errors.push("v260.css must load after v247.css");
need("app/v260.css", [
  ".motorcycle-entity-hero", ".motorcycle-hero-grid", ".motorcycle-entity-section",
  ".motorcycle-editorial-grid", ".entity-tool-grid", ".entity-maintenance-table",
  ".product-entity-page>.product-hero", ".product-entity-page>.product-entity-section"
]);

need("app/motorcycles/[make]/[slug]/page.tsx", ["MotorcycleEntityPage", "motorcycleEntitySeo", "keywords: seo.keywords"]);
need("lib/motorcycleEntitySeo.ts", [
  "price philippines", "installment", "tire size", "seat height", "fuel consumption",
  "maintenance schedule", "ownership cost", "motorcycleEntityFaqs", "motorcycleEntityEditorial"
]);
need("components/MotorcycleEntityPage.tsx", [
  'id="price"', 'id="installment"', 'id="specs"', 'id="rider-fit"', 'id="tires-fitment"',
  'id="fuel"', 'id="ownership"', 'id="maintenance"', 'id="safety"', 'id="used"',
  'id="alternatives"', 'id="faq"', "InstallmentCalculator", "RiderFitCalculator",
  "FuelRangeCalculator", "OwnershipCostCalculator", "UsedValueCalculator", "FaqSection",
  "JsonLd", "ProductEntityNav", "EntityMedia"
]);

const redirectMap = new Map([
  ["app/motorcycles/[make]/[slug]/price/page.tsx", "#price"],
  ["app/motorcycles/[make]/[slug]/installment/page.tsx", "#installment"],
  ["app/motorcycles/[make]/[slug]/rider-fit/page.tsx", "#rider-fit"],
  ["app/motorcycles/[make]/[slug]/tire-size/page.tsx", "#tires-fitment"],
  ["app/motorcycles/[make]/[slug]/accessories/page.tsx", "#tires-fitment"],
  ["app/motorcycles/[make]/[slug]/fuel-economy/page.tsx", "#fuel"],
  ["app/motorcycles/[make]/[slug]/ownership-cost/page.tsx", "#ownership"],
  ["app/motorcycles/[make]/[slug]/maintenance/page.tsx", "#maintenance"],
  ["app/motorcycles/[make]/[slug]/safety/page.tsx", "#safety"],
  ["app/motorcycles/[make]/[slug]/used-value/page.tsx", "#used"],
  ["app/motorcycles/[make]/[slug]/new-vs-used/page.tsx", "#used"],
  ["app/fitment/[make]/[slug]/page.tsx", "#tires-fitment"],
]);
for (const [file, anchor] of redirectMap) need(file, ["permanentRedirect", anchor]);

const sitemap = read("lib/sitemaps.ts");
for (const oldPath of ["/price`", "/installment`", "/tire-size`", "/fuel-economy`", "/ownership-cost`", "/used-value`", "/new-vs-used`"]) {
  if (sitemap.includes(oldPath)) errors.push(`motorcycle sitemap still emits legacy entity subroute token ${oldPath}`);
}
need("lib/sitemaps.ts", ["one canonical entity URL", "priority:m.marketStatus"]);

for (const file of [
  "app/gear/helmets/[brand]/[product]/page.tsx",
  "app/tires/[slug]/[product]/page.tsx",
  "app/accessories/top-box/[product]/page.tsx",
]) {
  need(file, ["ProductEntityNav", "FaqSection", "keywords:", "product-entity-section", "JsonLd"]);
}
need("app/gear/helmets/[brand]/[product]/page.tsx", ["Price Philippines: Specs & Size Guide", "price, specs and fit guide"]);
need("app/tires/[slug]/[product]/page.tsx", ["Tire Price Philippines: Sizes & Fitment", "tire sizes, fitment and price"]);
need("app/accessories/top-box/[product]/page.tsx", ["Top Box Price Philippines: Fitment & Specs", "price, capacity and fitment"]);

// UI code should point directly at anchored canonical motorcycle URLs instead of walking users through redirects.
const scanRoots = ["app", "components", "lib"];
const legacyUiPatterns = [
  /href=\{`\/motorcycles\/[^`]*\/(price|installment|tire-size|rider-fit|fuel-economy|maintenance|safety|ownership-cost|used-value|new-vs-used)`\}/,
  /href=\{`\/fitment\/\$\{/,
];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next"].includes(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) { walk(full); continue; }
    if (!/\.(ts|tsx)$/.test(ent.name)) continue;
    const rel = path.relative(root, full).split(path.sep).join("/");
    if (redirectMap.has(rel)) continue;
    const src = fs.readFileSync(full, "utf8");
    for (const pattern of legacyUiPatterns) if (pattern.test(src)) errors.push(`${rel} still links to a legacy motorcycle subroute`);
  }
}
for (const base of scanRoots) walk(path.join(root, base));

if (errors.length) {
  console.error(`v2.6.0 validation failed (${errors.length}):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log("v2.6.0 validation passed: canonical motorcycle entity pages, anchored legacy redirects, strong product entities, rich SEO sections and unified entity UI are present.");
