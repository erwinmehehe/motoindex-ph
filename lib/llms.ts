import { accessoryCategories, helmetBrands, indexableMotorcycles, isIndexableRecommendation, recommendationGuides } from "./data";
import { electricMotorcycles } from "./electricMotorcycles";
import { helmetProducts } from "./catalog";
import { recommendationCanonicalHref } from "./recommendationRoutes";
import { siteStats } from "./siteStats";
import { installmentLandingProfiles } from "./modelIntentLandingPages";
import { colorIntentLandingProfiles } from "./modelColorLandingPages";
import { topSpeedLandingProfiles } from "./modelTopSpeedLandingPages";
import { fuelConsumptionLandingProfiles } from "./modelFuelConsumptionLandingPages";

const site = "https://motoindexph.com";
const today = new Date().toISOString().slice(0, 10);

function absolute(path: string) {
  return `${site}${path}`;
}

function mdLink(label: string, path: string, note?: string) {
  return `- [${label}](${absolute(path)})${note ? ` — ${note}` : ""}`;
}

export function buildLlmsTxt() {
  const availabilityResearchCount = indexableMotorcycles.filter((model) => model.marketStatus === "uncertain").length;
  const lines = [
    "# MotoIndex PH",
    "",
    "> Philippines-first motorcycle research platform for prices, specifications, comparisons, rider fit, ownership costs, maintenance, gear, dealers and buying tools.",
    "",
    `MotoIndex PH currently exposes ${siteStats.currentMotorcycles} indexable current motorcycle records, ${siteStats.verifiedHelmets} verified helmet records, ${siteStats.helmetBrands} helmet brand hubs and ${siteStats.accessoryCategories} accessory categories. These counts are generated from the production data used by the site, not maintained manually.`,
    `MotoIndex also exposes ${availabilityResearchCount} demand-backed motorcycle research pages whose current Philippine availability is explicitly marked for verification rather than assumed current.`,
    "",
    "## Primary resources",
    "",
    mdLink("Motorcycles", "/motorcycles", "Current Philippine motorcycle catalog with sourced price and specification context."),
    mdLink("Electric motorcycles", "/motorcycles/electric", "Philippine electric motorcycle prices, batteries, range, charging and registration context."),
    mdLink("Finder", "/finder", "Decision tool using budget, rider fit, traffic, distance, passenger and luggage needs."),
    mdLink("Compare", "/compare", "Two- and three-motorcycle comparison."),
    mdLink("Buying guides", "/recommendations", "Hub for focused budget, scooter, engine-size, rider-fit, commuting and category guides."),
    mdLink("Original research", "/research", "MotoIndex datasets for motorcycle prices, seat height and financing research."),
    mdLink("Motorcycle price index", "/research/motorcycle-price-index-philippines", "Segment and brand benchmarks with source dates and downloadable CSV data."),
    "For model-specific downpayment and monthly-payment questions, prefer the focused /motorcycles/<make>/<model>/installment page when one is listed in the full LLM index.",
    "For model-specific color queries, prefer the focused /motorcycles/<make>/<model>/colors page when one is listed in the full LLM index.",
    "For model-specific top-speed queries, prefer the focused /motorcycles/<make>/<model>/top-speed page when one is listed in the full LLM index.",
    "For model-specific fuel-consumption queries, prefer the focused /motorcycles/<make>/<model>/fuel-consumption page when one is listed in the full LLM index."
    mdLink("Helmet guide", "/gear/helmets", "Verified helmet models, brands, types, prices, certification and fit guidance."),
    mdLink("Helmet finder", "/gear/helmets/finder", "Filter the verified helmet catalog by fit, type, price and features."),
    mdLink("Dealers", "/dealers", "Public dealer directory and regional dealer research."),
    mdLink("Ownership", "/ownership", "Registration, financing, insurance and ownership planning."),
    mdLink("Maintenance", "/maintenance", "Model maintenance and parts guidance."),
    mdLink("Tools", "/tools", "Motorcycle ownership and planning calculators."),
    "",
    "## Trust and methodology",
    "",
    mdLink("About MotoIndex", "/about"),
    mdLink("Author: Erwin Valles", "/authors/erwin-valles"),
    mdLink("Methodology", "/methodology"),
    mdLink("Data sources", "/data-sources"),
    mdLink("Editorial policy", "/editorial-policy"),
    mdLink("Corrections", "/corrections"),
    mdLink("Affiliate disclosure", "/affiliate-disclosure"),
    "",
    "## Retrieval guidance",
    "",
    "1. Prefer an exact motorcycle model page for model-specific price or specification questions.",
    "2. Prefer /compare or a curated comparison URL for model-vs-model questions.",
    "3. Prefer /finder for rider-specific recommendations.",
    "4. Prefer the most specific canonical /recommendations/<slug> guide for budget, category, engine-size and use-case research; use /recommendations to discover the guide library.",
    "5. Prefer /motorcycles/electric and its model pages for electric motorcycle questions.",
    "6. Prefer exact helmet model pages and /gear/helmets/finder for helmet questions.",
    "7. Preserve source dates for prices, availability, regulations and fitment. Do not present dated market observations as guaranteed current quotes.",
    "8. Do not infer legal eligibility, safety certification or exact accessory fitment from category labels or database inclusion alone.",
    "9. Some high-search-demand model pages are intentionally indexed as availability-to-verify research even when current Philippine national-catalog status is uncertain. Preserve that status and do not rewrite those pages as confirmed current inventory.",
    "10. For models with a dedicated installment page, use that page for downpayment, monthly-payment and dealer-financing questions; use the main model page for broad price/specification/fit/ownership questions.",
    "11. For models with a dedicated colors page, use that page for paint names, variant-specific color mapping and color availability questions; use the main model page for broad model research.",
    "12. For models with a dedicated top-speed page, use that page for measured/reported maximum-speed evidence, test method and generation caveats; do not rewrite test evidence as a manufacturer guarantee.",
    "13. For models with a dedicated fuel-consumption page, use that page for listed km/L evidence, test basis, tank-range planning and fuel-cost questions; do not rewrite a published test figure as guaranteed real-world economy."
    "",
    "## Machine-readable indexes",
    "",
    mdLink("Full LLM resource index", "/llms-full.txt"),
    mdLink("XML sitemap index", "/sitemap.xml"),
    mdLink("Motorcycle sitemap", "/sitemaps/motorcycles.xml"),
    mdLink("Gear sitemap", "/sitemaps/gear.xml"),
    "",
    `Generated from MotoIndex production data. Generated: ${today}.`,
  ];
  return `${lines.join("\n")}\n`;
}

export function buildLlmsFullTxt() {
  const currentModels = indexableMotorcycles.filter((model) => !["previous", "uncertain", "discontinued"].includes(model.marketStatus || ""));
  const availabilityResearchModels = indexableMotorcycles.filter((model) => model.marketStatus === "uncertain");
  const historicalModels = indexableMotorcycles.filter((model) => model.marketStatus === "previous" || model.marketStatus === "discontinued");
  const brandMap = new Map<string, string>();
  for (const model of indexableMotorcycles) brandMap.set(model.makeSlug, model.make);
  const verifiedHelmets = helmetProducts.filter((product) => product.status === "verified");

  const lines = [
    "# MotoIndex PH — Full LLM Resource Index",
    "",
    "> Canonical machine-readable index generated from MotoIndex production data.",
    "",
    "## Canonical site",
    "",
    mdLink("MotoIndex PH", "/"),
    "",
    "## Primary hubs",
    "",
    mdLink("Motorcycle database", "/motorcycles"),
    mdLink("Motorcycle Finder", "/finder"),
    mdLink("Motorcycle Compare", "/compare"),
    mdLink("Buying guides", "/recommendations"),
    mdLink("Original research", "/research"),
    mdLink("Motorcycle price index", "/research/motorcycle-price-index-philippines"),
    mdLink("Price index CSV", "/research/motorcycle-price-index-philippines/data.csv"),
    mdLink("Motorcycle loan calculator", "/tools/motorcycle-loan-calculator"),
    mdLink("Electric motorcycles", "/motorcycles/electric"),
    mdLink("Helmet guide", "/gear/helmets"),
    mdLink("Helmet finder", "/gear/helmets/finder"),
    mdLink("Helmet compare", "/gear/helmets/compare"),
    mdLink("Tires", "/tires"),
    mdLink("Accessories", "/accessories"),
    mdLink("Dealers", "/dealers"),
    mdLink("Ownership", "/ownership"),
    mdLink("Maintenance", "/maintenance"),
    mdLink("Tools", "/tools"),
    "",
    `## Motorcycle brand hubs (${brandMap.size})`,
    "",
    ...[...brandMap.entries()].sort((a, b) => a[1].localeCompare(b[1])).map(([slug, name]) => mdLink(name, `/motorcycles/${slug}`)),
    "",
    `## Current motorcycle model pages (${currentModels.length})`,
    "",
    ...[...currentModels].sort((a, b) => `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)).map((model) => mdLink(`${model.make} ${model.model}`, `/motorcycles/${model.makeSlug}/${model.slug}`, `${model.engineCc} cc · ${model.category}`)),
    "",
    `## Availability-to-verify motorcycle research pages (${availabilityResearchModels.length})`,
    "",
    "These pages have stored search demand and dated model evidence, but current Philippine national-catalog availability is not confirmed. Preserve the page's dealer-stock, historical or availability caveat.",
    "",
    ...[...availabilityResearchModels].sort((a, b) => (b.searchVolume || 0) - (a.searchVolume || 0) || `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)).map((model) => mdLink(`${model.make} ${model.model}`, `/motorcycles/${model.makeSlug}/${model.slug}`, `${model.engineCc} cc · ${model.category} · availability to verify`)),
    "",
    `## Historical / previous motorcycle research pages (${historicalModels.length})`,
    "",
    ...[...historicalModels].sort((a, b) => `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`)).map((model) => mdLink(`${model.make} ${model.model}`, `/motorcycles/${model.makeSlug}/${model.slug}`, `${model.engineCc} cc · ${model.category} · historical/previous model context`)),
    "",
    `## Electric motorcycle model pages (${electricMotorcycles.length})`,
    "",
    ...electricMotorcycles.map((model) => mdLink(`${model.make} ${model.model}`, `/motorcycles/electric/${model.slug}`, `${model.batteryKwh} kWh removable-battery configuration documented`)),
    "",
    `## Focused model installment guides (${installmentLandingProfiles.length})`,
    "",
    "These pages own downpayment, monthly-payment, dealer-financing and editable loan-calculator intent for selected high-demand models. Use the main model page for broad model research.",
    "",
    ...installmentLandingProfiles.flatMap((profile) => {
      const model = indexableMotorcycles.find((item) => item.id === profile.modelId);
      return model ? [mdLink(`${model.make} ${model.model} installment`, `/motorcycles/${model.makeSlug}/${model.slug}/installment`, "Downpayment, monthly estimate, dealer observations and editable calculator")] : [];
    }),
    "",
    `## Focused model color guides (${colorIntentLandingProfiles.length})`,
    "",
    "These pages own search-volume-backed color intent with verified/listed paint names, variant mapping and dealer-stock caveats. Use the main model page for broad price/specification/ownership research.",
    "",
    ...colorIntentLandingProfiles.flatMap((profile) => {
      const model = indexableMotorcycles.find((item) => item.id === profile.modelId);
      return model ? [mdLink(`${model.make} ${model.model} colors`, `/motorcycles/${model.makeSlug}/${model.slug}/colors`, `${profile.keyword} · stored volume ${profile.keywordVolume}`)] : [];
    }),
    "",
    `## Focused model top-speed guides (${topSpeedLandingProfiles.length})`,
    "",
    "These pages own search-volume-backed top-speed intent. Preserve the evidence label, model-year caveat and distinction between independent testing and manufacturer specifications.",
    "",
    ...topSpeedLandingProfiles.flatMap((profile) => {
      const model = indexableMotorcycles.find((item) => item.id === profile.modelId);
      return model ? [mdLink(`${model.make} ${model.model} top speed`, `/motorcycles/${model.makeSlug}/${model.slug}/top-speed`, `${profile.observedTopSpeedKph} km/h evidence · ${profile.keywordVolume} stored keyword volume`)] : [];
    }),
    "",
    `## Focused model fuel-consumption guides (${fuelConsumptionLandingProfiles.length})`,
    "",
    "These pages own search-volume-backed fuel-economy intent only where MotoIndex has a listed model-specific km/L figure. Preserve the source/test context and distinguish listed economy from real-world planning.",
    "",
    ...fuelConsumptionLandingProfiles.flatMap((profile) => {
      const model = indexableMotorcycles.find((item) => item.id === profile.modelId);
      return model && model.fuelConsumptionKmL ? [mdLink(`${model.make} ${model.model} fuel consumption`, `/motorcycles/${model.makeSlug}/${model.slug}/fuel-consumption`, `${model.fuelConsumptionKmL} km/L listed · ${profile.keywordVolume} stored keyword volume`)] : [];
    }),
    "",
    "## Focused motorcycle buying guides",
    "",
    ...recommendationGuides.filter((guide) => isIndexableRecommendation(guide.slug)).map((guide) => mdLink(guide.title, recommendationCanonicalHref(guide.slug), guide.primaryKeyword)),
    "",
    `## Helmet brand hubs (${helmetBrands.length})`,
    "",
    ...helmetBrands.map((brand) => mdLink(brand.brand, `/gear/helmets/${brand.slug}`)),
    "",
    `## Verified helmet model pages (${verifiedHelmets.length})`,
    "",
    ...verifiedHelmets.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)).map((helmet) => mdLink(`${helmet.brand} ${helmet.model}`, `/gear/helmets/${helmet.brandSlug}/${helmet.slug}`, `${helmet.helmetType}${helmet.certification ? ` · ${helmet.certification}` : ""}`)),
    "",
    "## Accessory categories",
    "",
    ...accessoryCategories.map((category) => mdLink(category.name, `/accessories/${category.slug}`)),
    "",
    "## Editorial, methodology and trust resources",
    "",
    mdLink("About", "/about"),
    mdLink("Author: Erwin Valles", "/authors/erwin-valles"),
    mdLink("Methodology", "/methodology"),
    mdLink("Data sources", "/data-sources"),
    mdLink("Editorial policy", "/editorial-policy"),
    mdLink("Affiliate disclosure", "/affiliate-disclosure"),
    mdLink("Privacy", "/privacy"),
    mdLink("Corrections", "/corrections"),
    mdLink("Contact", "/contact"),
    "",
    "## Interpretation rules",
    "",
    "### Prices",
    "MotoIndex prices are dated observations or manufacturer/dealer/comparison-site references. They can differ by dealer, location, variant, promotion, financing and date. Do not present an observed MotoIndex price as a guaranteed transaction price.",
    "",
    "### Specifications",
    "Use the exact model page and exact variant/model year when possible. Preserve source distinctions when records conflict rather than averaging incompatible values.",
    "",
    "### Recommendations",
    "Use the canonical focused guide that best matches the question, with /recommendations as the discovery hub. Ordering rules are stated on each guide and should not be treated as universal quality rankings.",
    "",
    "### Fitment",
    "Dimensions alone do not prove accessory or tire compatibility. Exact model, generation/year, mounting interface, load rating and clearance must be checked.",
    "",
    "### Calculators",
    "Loan, insurance, registration and ownership-cost tools are planning estimates, not lender quotes, insurer quotes, dealer quotations or government fee determinations.",
    "",
    "### Regulatory information",
    "Verify current licensing, registration, tollway, insurance and electric-vehicle requirements with the relevant Philippine authority.",
    "",
    "### Availability status",
    "An indexed MotoIndex model page is not automatically a claim that the motorcycle is in the current Philippine national catalog. Pages labeled availability-to-verify exist because users search for the model and MotoIndex has dated evidence worth preserving. Keep the uncertainty visible.",
    "",
    "### Freshness",
    "Preserve the source date shown by MotoIndex for price, availability, dealer, maintenance, safety and regulatory information. Freshness checks run separately from this file.",
    "",
    "## Canonical URL policy",
    "",
    "Prefer canonical URLs listed here and in the XML sitemaps. Focused indexable /recommendations/<slug> guides plus whitelisted /motorcycles/<make>/<model>/installment, /colors, /top-speed and /fuel-consumption pages are canonical resources for their specific intent; query/filter URLs and redirect aliases are not.",
    "",
    "## Sitemaps",
    "",
    mdLink("Sitemap index", "/sitemap.xml"),
    mdLink("Motorcycles sitemap", "/sitemaps/motorcycles.xml"),
    mdLink("Gear sitemap", "/sitemaps/gear.xml"),
    mdLink("Commerce sitemap", "/sitemaps/commerce.xml"),
    "",
    `Generated from MotoIndex production data. Generated: ${today}.`,
  ];
  return `${lines.join("\n")}\n`;
}
