import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const pkg = JSON.parse(read("package.json"));
expect(/^2\./.test(pkg.version), `package version must remain in the v2.x line, found ${pkg.version}`);
expect(pkg.scripts?.["validate:v20"] === "node scripts/validate-v20.mjs", "package scripts missing validate:v20");
expect(pkg.scripts?.["validate:all"]?.includes("validate:v20"), "validate:all must include validate:v20");

const types = read("lib/types.ts");
for (const token of ["MotorcycleVariant", "ModelPriceSnapshot", 'sourceType: "manufacturer"']) expect(types.includes(token), `types missing ${token}`);

const variants = read("lib/variants.ts");
const expectedVariants = [
  ["yamaha-aerox-v3-standard", "125900"], ["yamaha-aerox-v3-sp", "163900"],
  ["yamaha-nmax-v3-standard", "155900"], ["yamaha-nmax-v3-tech-max", "175900"],
  ["honda-pcx-160-standard", "133400"], ["honda-pcx-160-roadsync", "154900"],
  ["honda-adv-160-abs", "167400"], ["honda-adv-160-roadsync", "174900"],
];
for (const [id, price] of expectedVariants) {
  expect(variants.includes(`id: "${id}"`), `variant dataset missing ${id}`);
  expect(variants.includes(`srpPhp: ${price}`), `variant dataset missing expected SRP ${price}`);
}
for (const token of ["getVerifiedVariantsForModel", "variantPriceOptions", 'status: "verified"']) expect(variants.includes(token), `variant layer missing ${token}`);

const priceIntel = read("lib/priceIntelligence.ts");
for (const token of ["historicalSnapshots", "currentSnapshotsForModel", "priceSnapshotsForModel", "modelPriceIntelligence", "honda-pcx-160", "honda-adv-160"]) expect(priceIntel.includes(token), `price intelligence missing ${token}`);
expect(priceIntel.includes("source-dated MotoIndex market checks"), "price intelligence must preserve source-dated market semantics");

const calculator = read("components/InstallmentCalculator.tsx");
for (const token of ["priceOptions", "Trim SRP", "Use displayed market basis"]) expect(calculator.includes(token), `installment calculator missing ${token}`);

const variantMatrix = read("components/VariantMatrix.tsx");
for (const token of ["getVerifiedVariantsForModel", "Current Philippine trims", "SRP and dealer asking price are different"]) expect(variantMatrix.includes(token), `variant UI missing ${token}`);

const priceComponent = read("components/PriceIntelligence.tsx");
for (const token of ["modelPriceIntelligence", "Dated price records", "does not prove the whole market moved"]) expect(priceComponent.includes(token), `price intelligence UI missing ${token}`);

const modelRoute = read("app/motorcycles/[make]/[slug]/page.tsx");
const entityPage = fs.existsSync("components/MotorcycleEntityPage.tsx") ? read("components/MotorcycleEntityPage.tsx") : "";
const modelPage = modelRoute + (modelRoute.includes("MotorcycleEntityPage") ? entityPage : "");
for (const token of ["VariantMatrix", "variantPriceOptions", "priceOptions={variantPriceOptions(model.id)}"]) expect(modelPage.includes(token), `canonical model page missing ${token}`);
const priceRoute = read("app/motorcycles/[make]/[slug]/price/page.tsx");
const pricePage = priceRoute.includes("permanentRedirect") ? entityPage : priceRoute;
for (const token of ["VariantMatrix", "PriceIntelligence", "variantPriceOptions", "MarketPriceChecks"]) expect(pricePage.includes(token), `canonical price section missing ${token}`);

const dataHealth = read("lib/dataHealth.ts");
for (const token of ["variantMappingNeeded", "priceSnapshotCount", "priorityScore", "nextAction", "attentionQueue", "priceHistoryReady"]) expect(dataHealth.includes(token), `admin health layer missing ${token}`);
const admin = read("app/admin/data-health/page.tsx");
for (const token of ["Next research queue", "Variant-mapped models", "Price tracking", "variantMappingPending"]) expect(admin.includes(token), `admin dashboard missing ${token}`);

const api = read("app/api/models/route.ts");
expect(api.includes("getVerifiedVariantsForModel"), "public models API must expose verified variants");

const prisma = read("prisma/schema.prisma");
for (const token of ["slug           String", "status         FreshnessStatus", "sourceId       String?", "featureSummary String?", "@@unique([generationId, slug])", "variants      Variant[]"]) expect(prisma.includes(token), `Prisma variant contract missing ${token}`);

const marketChecks = read("lib/marketChecks.ts");
expect(marketChecks.includes('sourceType:"manufacturer"'), "market checks should distinguish manufacturer price sources");
expect(marketChecks.includes("Generic comparison-site figure is below the current 2026 Honda"), "ADV source disagreement must remain explicit");

if (failures.length) {
  console.error("v2.0 validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("v2.0 validation passed: verified variants, price snapshots, trim-aware finance, research queue, API and Prisma contracts are wired.");
