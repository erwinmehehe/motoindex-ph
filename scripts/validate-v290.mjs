import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const read = (file) => fs.readFileSync(path.join(process.cwd(), file), "utf8");
const errors = [];
const warnings = [];
const expect = (condition, message) => { if (!condition) errors.push(message); };
const containsAll = (file, needles) => {
  const text = read(file);
  for (const needle of needles) expect(text.includes(needle), `${file} missing ${needle}`);
  return text;
};

const pkg = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));
const [major, minor, patch] = String(pkg.version).split(".").map(Number);
expect(major === 2 && (minor > 9 || (minor === 9 && patch >= 1)), `package version must be v2.9.1+, found ${pkg.version}`);
expect(lock.version === pkg.version && lock.packages?.[""]?.version === pkg.version, "package-lock root version must match package.json");

const policy = containsAll("lib/commercePolicy.ts", [
  "commerceFreshDays = 30",
  "parseStrictIsoDate",
  "age >= 0 && age <= maxAgeDays",
  'protocol === "https:"',
  "isProductSpecificCommerceUrl",
  "collections?",
]);

// Exercise the actual TypeScript commerce policy under the project's required Node 22 runtime.
try {
  const code = String.raw`
    import * as p from './lib/commercePolicy.ts';
    const now = new Date('2026-08-28T15:00:00Z');
    const checks = [
      p.parseStrictIsoDate('2026-02-30') === null,
      p.isFreshCommerceDate('2026-08-29', 30, now) === false,
      p.isFreshCommerceDate('2026-07-29', 30, now) === true,
      p.isFreshCommerceDate('2026-07-28', 30, now) === false,
      p.isHttpsUrl('http://example.com/p') === false,
      p.isHttpsUrl('https://example.com/p') === true,
      p.isProductSpecificCommerceUrl('https://shop.example.com/collections/helmets') === false,
      p.isProductSpecificCommerceUrl('https://shop.example.com/products/helmet-123') === true,
    ];
    if (checks.some((x) => !x)) process.exit(9);
  `;
  execFileSync(process.execPath, ["--experimental-strip-types", "--input-type=module", "-e", code], {
    cwd: process.cwd(),
    stdio: "pipe",
    env: { ...process.env, NODE_NO_WARNINGS: "1" },
  });
} catch {
  errors.push("commercePolicy behavioral checks failed (strict dates, future dates, 30-day boundary, HTTPS, or product-specific URL gate)");
}

const commerce = containsAll("lib/commerceOffers.ts", [
  "sourceBackedCommerceOffers",
  "isProductSpecificCommerceUrl(product.priceSourceUrl)",
  "isFreshCommerceOffer",
  "commerceOfferDestination",
  "compareCommerceOffers",
  "merchantOfferKey",
  'sellerType !== "marketplace"',
  '"evohelmet.com": { name: "EVO Helmets", slug: "evo-helmets", type: "official" }',
]);
expect(!commerce.includes('status: "demo"'), "Commerce source layer must not publish demo offers");

const catalog = read("lib/catalog.ts");
const priceUrls = [...catalog.matchAll(/priceSourceUrl:\s*"([^"]+)"/g)].map((match) => match[1]);
const priceHosts = [...new Set(priceUrls.map((value) => {
  try { return new URL(value).hostname.toLowerCase(); } catch { return ""; }
}).filter(Boolean))];
for (const host of priceHosts) expect(commerce.includes(`"${host}"`), `merchant host ${host} is not explicitly classified in commerceOffers`);
const weakCollectionSources = priceUrls.filter((value) => /\/collections?(?:\/|$)/i.test(new URL(value).pathname));
if (weakCollectionSources.length) warnings.push(`${weakCollectionSources.length} catalog collection URL(s) remain as research price references but are excluded from verified commerce rows`);

const ingestion = containsAll("lib/ingestion.ts", [
  "parseStrictIsoDate",
  "observedAt cannot be in the future",
  "older than the ${commerceFreshDays}-day live-offer window",
  "sourceUrl required for a verified offer",
  "sourceUrl must be an https URL",
  "affiliateUrl must be an https URL",
]);
expect(!ingestion.includes("http(s) URL"), "ingestion must not permit plain HTTP commerce destinations");

containsAll("app/api/ingestion/expire/route.ts", [
  "expireStaleOffers(maxAgeDays)",
  "requested > 0 ? requested : undefined",
]);
const ingestionQueue = read("components/OfferIngestionQueue.tsx");
expect(ingestionQueue.includes("maxAgeDays:30"), "admin expiry action must use the 30-day commerce window");
expect(!ingestionQueue.includes("maxAgeDays:14"), "admin expiry action must not retain the legacy 14-day window");

const persistent = containsAll("lib/persistentOffers.ts", [
  "commerceFreshnessWindow",
  'observedAt: { gte: lower, lte: upper }',
  'orderBy: [{ observedAt: "desc" }, { pricePhp: "asc" }',
  "recordOutboundClick(offer: SellerOffer, sourceBacked: boolean)",
  "sourceOfferId: sourceBacked ? offer.id : null",
]);
expect(!persistent.includes("headers.get("), "commerce click persistence must not store request referrer/user-agent metadata");

containsAll("components/CommercePriceComparison.tsx", [
  "safeDatabaseOffers",
  "using catalog offer fallback",
  "merchantOfferKey",
  "compareCommerceOffers",
  "commerceOfferDestination",
  "Fresh checks appear first",
]);

const redirect = containsAll("app/go/[offerId]/route.ts", [
  "commerceOfferDestination",
  "isFreshCommerceOffer(sourceOffer)",
  "recordOutboundClick(sourceOffer, true)",
  "recordOutboundClick(persistent, false)",
  "Database availability must not turn a merchant redirect into a 500",
  "isHttpsUrl(legacyDestination)",
  "no-store",
  "noindex",
]);
expect(redirect.includes("try {") && redirect.includes("} catch {"), "merchant redirect must fail open around optional database analytics/lookups");

for (const file of [
  "app/gear/helmets/[brand]/[product]/page.tsx",
  "app/tires/[slug]/[product]/page.tsx",
  "app/accessories/top-box/[product]/page.tsx",
]) {
  const text = containsAll(file, ["CommercePriceComparison", "export const revalidate = 3600;"]);
  const match = text.match(/export const revalidate = (\d+);/);
  expect(Boolean(match) && Number(match[1]) <= 3600, `${file} must revalidate commerce freshness at least hourly`);
}

const privacy = containsAll("app/privacy/page.tsx", [
  "Commerce click measurement",
  "does not store the browser referrer, user-agent string or form/contact data",
  "Google Analytics or Plausible scripts load only when",
]);
expect(!privacy.includes("No advertising or analytics tracker is included by default"), "privacy copy must not contradict first-party commerce measurement");

const schema = containsAll("prisma/schema.prisma", [
  "model OutboundClickEvent",
  "offerId       String?",
  "sourceOfferId String?",
  "entityType    String?",
  "merchant      String?",
  "@@index([sourceOfferId, createdAt])",
]);
expect(!schema.includes("referrer  String?") && !schema.includes("userAgent String?"), "commerce click schema must not retain referrer/user-agent fields");
containsAll("prisma/migrations/20260828152000_commerce_click_privacy_hardening/migration.sql", [
  'ALTER COLUMN "offerId" DROP NOT NULL',
  'ADD COLUMN "sourceOfferId" TEXT',
  'DROP COLUMN "referrer"',
  'DROP COLUMN "userAgent"',
]);

containsAll("app/admin/offers-review/page.tsx", ["Source-backed accessory observations", "Open source", "freshness"]);

// Coverage is intentionally not fabricated. Report it so a green validator cannot hide empty categories.
for (const [name, label] of [["tireProducts", "tire"], ["topBoxProducts", "top-box"]]) {
  const start = catalog.indexOf(`export const ${name}`);
  const next = catalog.indexOf("export const ", start + 20);
  const block = catalog.slice(start, next < 0 ? catalog.length : next);
  const count = (block.match(/priceSourceUrl:/g) || []).length;
  if (!count) warnings.push(`no exact ${label} priceSourceUrl coverage yet; empty commerce state is expected until verified listings are added`);
}

if (warnings.length) {
  console.warn("v2.9.1 commerce coverage notes:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (errors.length) {
  console.error("v2.9.1 accessory commerce validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("v2.9.1 accessory commerce hardening validation passed.");
