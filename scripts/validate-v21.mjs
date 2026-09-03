import fs from "node:fs";
import path from "node:path";

const read = (file) => fs.readFileSync(path.join(process.cwd(), file), "utf8");
const exists = (file) => fs.existsSync(path.join(process.cwd(), file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const pkg = JSON.parse(read("package.json"));
expect(/^2\.(?:[1-9]|[1-9][0-9]+)\./.test(pkg.version), `package version must be v2.1.0 or newer within major v2, found ${pkg.version}`);
expect(pkg.scripts?.["validate:v21"] === "node scripts/validate-v21.mjs", "package scripts missing validate:v21");
expect(pkg.scripts?.["validate:all"]?.includes("validate:v21"), "validate:all must include validate:v21");

for (const file of [
  "app/tools/page.tsx",
  "app/tools/motorcycle-loan-calculator/page.tsx",
  "app/tools/lto-registration-fee-calculator/page.tsx",
  "app/tools/motorcycle-insurance-calculator/page.tsx",
  "app/motorcycles/[make]/[slug]/installment/page.tsx",
  "components/LoanCalculator.tsx",
  "components/LtoRegistrationCalculator.tsx",
  "components/MotorcycleInsuranceCalculator.tsx",
  "lib/refreshQueue.ts",
]) expect(exists(file), `missing v2.1 file ${file}`);

const loanComponent = read("components/LoanCalculator.tsx");
expect(loanComponent.includes('import { monthlyPayment } from "@/lib/utils"'), "loan calculator should reuse the same monthlyPayment engine as the finance API");
expect(loanComponent.includes('monthlyPayment(safePrice, safeDown, safeMonths, safeRate)'), "loan calculator must call the shared finance engine");

const loanPage = read("app/tools/motorcycle-loan-calculator/page.tsx");
for (const token of ["LoanCalculator", "/tools/motorcycle-loan-calculator", "searchParams", "initialPrice"]) {
  expect(loanPage.includes(token), `loan calculator page missing ${token}`);
}
const installment = read("app/motorcycles/[make]/[slug]/installment/page.tsx");
const entityPage = exists("components/MotorcycleEntityPage.tsx") ? read("components/MotorcycleEntityPage.tsx") : "";
expect(installment.includes("permanentRedirect") && installment.includes("#installment"), "legacy model installment route must permanently redirect to the canonical installment section");
for (const token of ["InstallmentCalculator", "observedMarketRange"]) expect(entityPage.includes(token), `canonical installment section missing ${token}`);

const lto = read("components/LtoRegistrationCalculator.tsx");
expect(lto.includes("240"), "LTO calculator must include the motorcycle-without-sidecar MVUC basis");
expect(lto.includes("300"), "LTO calculator must include the motorcycle-with-sidecar MVUC basis");
expect(lto.includes("ctpl"), "LTO calculator must keep CTPL as an explicit input instead of inventing one universal total");
const insurance = read("components/MotorcycleInsuranceCalculator.tsx");
for (const token of ["1.4", "Math.max(500", "ctpl"]) expect(insurance.includes(token), `insurance calculator missing ${token}`);

const modelRoute = read("app/motorcycles/[make]/[slug]/page.tsx");
const modelPage = modelRoute + (modelRoute.includes("MotorcycleEntityPage") ? entityPage : "");
for (const token of ["loanToolHref", "insuranceToolHref", "registrationToolHref", "#installment"]) {
  expect(modelPage.includes(token), `canonical model page missing finance/ownership cross-link token ${token}`);
}
const priceRoute = read("app/motorcycles/[make]/[slug]/price/page.tsx");
const pricePage = priceRoute.includes("permanentRedirect") ? entityPage : priceRoute;
for (const token of ["motorcycle-loan-calculator", "motorcycle-insurance-calculator", "#installment"]) {
  expect(pricePage.includes(token), `canonical price/installment experience missing calculator cross-link ${token}`);
}

const media = read("lib/media.ts");
const config = read("next.config.mjs");
const data = read("lib/data.ts");
expect(!media.includes("imgcdn.zigwheels.ph"), "motorcycle media must not hotlink Zigwheels CDN images");
expect(!config.includes("imgcdn.zigwheels.ph"), "next image config must not whitelist the removed Zigwheels CDN");
expect(!media.includes('/motorcycles/motoindex-bike.svg'), "generic motorcycle SVG fallback must be removed from media records");
expect(!media.includes("illustration placeholder"), "motorcycle media must not contain illustration placeholders");
expect(!media.includes("-zigwheels\""), "motorcycle media IDs must not retain Zigwheels naming");
expect(media.includes('rightsStatus: "external-reference"'), "motorcycle images should carry attributed external-reference rights metadata");

const motorcycleBlock = data.slice(data.indexOf("export const motorcycles"), data.indexOf("export const currentMotorcycles"));
const motorcycleIds = [...motorcycleBlock.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);
const mediaMotorcycleIds = [...media.matchAll(/entityType:\s*"motorcycle",\s*entityId:\s*"([^"]+)"/g)].map((match) => match[1]);
const mediaCounts = new Map();
for (const id of mediaMotorcycleIds) mediaCounts.set(id, (mediaCounts.get(id) || 0) + 1);
expect(motorcycleIds.length === 50, `expected 50 motorcycle records, found ${motorcycleIds.length}`);
for (const id of motorcycleIds) expect(mediaCounts.get(id) === 1, `motorcycle ${id} must have exactly one real image record`);
for (const id of mediaCounts.keys()) expect(motorcycleIds.includes(id), `orphan motorcycle media record ${id}`);
expect(!media.includes("zigwheels"), "lib/media.ts must contain no Zigwheels image/source URLs");

const motorcycleMediaBlocks = [...media.matchAll(/\{\s*id:\s*"[^"]+",\s*entityType:\s*"motorcycle",[\s\S]*?\n\s*\},/g)].map((match) => match[0]);
const motorcycleImageSrcs = motorcycleMediaBlocks.map((block) => block.match(/src:\s*"([^"]+)"/)?.[1]).filter(Boolean);
const motorcycleSourceImageUrls = motorcycleMediaBlocks.map((block) => block.match(/sourceImageUrl:\s*"([^"]+)"/)?.[1]).filter(Boolean);
expect(motorcycleMediaBlocks.length === 50, `expected 50 motorcycle media blocks, found ${motorcycleMediaBlocks.length}`);
expect(new Set(motorcycleImageSrcs).size === 50, "each motorcycle must use a distinct model-specific local image path");
expect(new Set(motorcycleSourceImageUrls).size === 50, "each motorcycle must retain a distinct checked upstream image URL for provenance/fallback");
const allowedImageHosts = new Set([...config.matchAll(/hostname:\s*"([^"]+)"/g)].map((match) => match[1]));
for (let i = 0; i < motorcycleMediaBlocks.length; i += 1) {
  const src = motorcycleImageSrcs[i];
  const upstream = motorcycleSourceImageUrls[i];
  expect(src?.startsWith("/media/motorcycles/") && src.endsWith(".webp"), `motorcycle image must use the standardized local WebP path: ${src}`);
  expect(!/\.svg(?:\?|$)/i.test(src || ""), `motorcycle image must be a real raster/photo asset, not SVG: ${src}`);
  expect(upstream?.startsWith("https://"), `motorcycle image must retain an HTTPS upstream source: ${upstream}`);
  try {
    const host = new URL(upstream).hostname;
    expect(allowedImageHosts.has(host), `Next image config is missing migration-fallback host ${host}`);
  } catch {
    expect(false, `invalid motorcycle upstream image URL ${upstream}`);
  }
}

const entityMedia = read("components/EntityMedia.tsx");
expect(entityMedia.includes('unoptimized={asset.src.endsWith(".svg")}'), "EntityMedia should render local SVG assets without image optimization");

for (const token of [
  'id: "honda-click-150i"',
  'marketStatus: "previous"',
  'successorId: "honda-click-160"',
  'priceContext: "Historical introductory Philippine launch SRP from Honda Philippines (2018)"',
]) expect(data.includes(token), `historical Click 150i record missing ${token}`);
expect(media.includes('entityId: "honda-click-150i"'), "Click 150i should have a real attributed image reference");
for (const token of [
  'source: "/motorcycles/yamaha/aerox-v4"',
  'source: "/motorcycles/yamaha/aerox-2025"',
  'source: "/motorcycles/yamaha/nmax-turbo"',
  'destination: "/motorcycles/yamaha/aerox-v3"',
  'destination: "/motorcycles/yamaha/nmax-v3"',
]) expect(config.includes(token), `model alias redirect missing ${token}`);

const refresh = read("lib/refreshQueue.ts");
for (const token of ["MODEL_SOURCE_MAX_AGE_DAYS", "MARKET_PRICE_MAX_AGE_DAYS", "dueAt", "daysUntilDue", "due-soon", "refreshQueueSummary"]) {
  expect(refresh.includes(token), `refresh queue missing ${token}`);
}
const admin = read("app/admin/data-health/page.tsx");
for (const token of ["Scheduled refresh queue", "refreshQueueSummary", "refreshQueueRows", "Dates, not just flags"]) {
  expect(admin.includes(token), `data-health refresh UI missing ${token}`);
}

const sitemap = read("lib/sitemaps.ts");
for (const token of [
  "/tools/motorcycle-loan-calculator",
  "/tools/lto-registration-fee-calculator",
  "/tools/motorcycle-insurance-calculator",
]) expect(sitemap.includes(token), `sitemap missing ${token}`);
expect(!sitemap.includes("${base}/installment"), "legacy model installment URLs must not be emitted in the sitemap after canonical consolidation");

const header = read("components/Header.tsx");
const footer = read("components/Footer.tsx");
for (const route of ["/tools/motorcycle-loan-calculator", "/tools/lto-registration-fee-calculator", "/tools/motorcycle-insurance-calculator"]) expect(header.includes(route), `header More menu missing ${route}`);
for (const route of ["/tools/motorcycle-loan-calculator", "/tools/lto-registration-fee-calculator", "/tools/motorcycle-insurance-calculator"]) expect(footer.includes(route), `footer missing ${route}`);

if (failures.length) {
  console.error("v2.1 validation failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("v2.1 validation passed: finance, LTO/insurance tools, model installment routes, 50/50 local-first attributed motorcycle image records with checked upstream provenance and no Zigwheels media or generic placeholders, source-backed model gap handling, cross-links, sitemaps and scheduled refresh operations are wired.");
