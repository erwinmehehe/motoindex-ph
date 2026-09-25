import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];
const requireText = (file, text, message) => {
  if (!file.includes(text)) errors.push(message);
};
const forbidText = (file, text, message) => {
  if (file.includes(text)) errors.push(message);
};

const home = read("app", "page.tsx");
const motorcycles = read("app", "motorcycles", "page.tsx");
const faq = read("components", "FaqSection.tsx");
const jsonLd = read("components", "JsonLd.tsx");
const media = read("components", "EntityMedia.tsx");
const modelRoute = read("app", "motorcycles", "[make]", "[slug]", "page.tsx");
const modelSeo = read("lib", "motorcycleEntitySeo.ts");
const sitemaps = read("lib", "sitemaps.ts");
const mediaValidator = read("scripts", "validate-media.mjs");
const articleSchema = read("lib", "articleSchema.ts");
const guidePage = read("app", "guides", "[slug]", "page.tsx");
const guideMedia = read("lib", "editorialGuideMedia.ts");
const ownershipCalculator = read("app", "ownership", "cost-calculator", "page.tsx");
const commuteCalculator = read("app", "commute", "cost-calculator", "page.tsx");
const priorityBrief = read("components", "PriorityModelBrief.tsx");
const authorProfile = read("app", "authors", "erwin-valles", "page.tsx");
const maintenanceData = read("lib", "maintenance.ts");
const modelEntity = read("components", "MotorcycleEntityPage.tsx");
const maintenanceHub = read("app", "maintenance", "page.tsx");
const nextConfig = read("next.config.mjs");
const catalogData = read("lib", "catalog.ts");
const topBoxFitmentData = read("lib", "topBoxFitment.ts");

requireText(home, "Compare <span>motorcycle prices</span><br />and specs in the Philippines.", "Homepage must keep a query-led motorcycle prices/specs H1.");
forbidText(home, "Your next <span>motorcycle</span><br />starts here.", "Homepage must not regress to the old brand-led H1.");
forbidText(home, "/motorcycles?budget=under100", "Homepage should link the under-100K intent to the consolidated recommendation section, not a crawlable filter URL.");
requireText(motorcycles, "<h1>Motorcycle prices", "Motorcycle hub must keep a query-led H1 that starts with Motorcycle prices.");
requireText(motorcycles, "href=\"/recommendations/motorcycles-under-100k\"", "Motorcycle hub should route under-100K intent to the canonical budget guide.");
requireText(motorcycles, 'const CATALOG_FILTER_PARAMS = ["q", "make", "type", "budget", "sort", "max"] as const;', "Motorcycle catalog must retain the canonical set of faceted filter params.");
requireText(motorcycles, "index: currentModels.length > 0 && !hasActiveFilters", "Filtered motorcycle catalog states must remain noindex while the clean catalog stays indexable.");
forbidText(faq, "FAQPage", "Visible FAQs should not emit deprecated FAQPage rich-result markup.");
forbidText(faq, "JsonLd", "FaqSection should remain visible HTML without JSON-LD.");
requireText(jsonLd, 'value["@type"] === "FAQPage"', "JsonLd must suppress any legacy/manual FAQPage objects.");
requireText(jsonLd, 'offer["@type"] !== "AggregateOffer"', "Motorcycle Product JSON-LD must suppress ambiguous variant-range AggregateOffer markup.");
requireText(jsonLd, 'value.category.startsWith("Motorcycle")', "AggregateOffer cleanup must stay scoped to motorcycle Product markup.");
requireText(media, 'entityType === "motorcycle" && priority', "Priority motorcycle media should expose image provenance by default.");
requireText(mediaValidator, "rightsStatus", "Media validation must enforce explicit rights status.");
requireText(mediaValidator, "rightsHolder", "Media validation must enforce a rights holder.");
requireText(mediaValidator, "sourceLabel and sourceUrl provenance", "External/licensed media must keep visible source provenance metadata.");
requireText(modelRoute, 'getRenderableMedia("motorcycle", model.id)[0]?.src', "Model metadata should use model-specific social imagery when available.");
requireText(modelSeo, "firstTitleThatFits", "Model SEO titles should use length-aware title selection.");
requireText(modelSeo, "limit = 60", "Model SEO title selection should target a 60-character ceiling.");
requireText(sitemaps, "latestModelDate", "Sitemaps should derive hub freshness from model source checks.");
requireText(sitemaps, "latestHelmetDate", "Sitemaps should derive helmet hub freshness from verified product checks.");
requireText(sitemaps, "latestSellerDate", "Sitemaps should derive dealer hub freshness from public seller checks.");
requireText(sitemaps, "latestAccessoryDate", "Accessory sitemap freshness must derive from verified product checks.");
requireText(sitemaps, "/accessories/top-box/${p.slug}", "Verified top-box product URLs must remain in the segmented gear sitemap.");
requireText(sitemaps, "lastModified:iso(p.lastChecked)", "Product sitemap entries must retain content-driven lastModified values.");
forbidText(sitemaps, "`/motorcycles/${make}/scooters`", "Redirect-only brand scooter aliases must stay out of sitemaps.");
forbidText(sitemaps, "`/motorcycles/${m.makeSlug}/${m.slug}/price`", "Consolidated model price aliases must stay out of sitemaps.");
requireText(nextConfig, '{ source: "/motorcycles/:make/:slug/price", destination: "/motorcycles/:make/:slug#price", permanent: true }', "Legacy motorcycle price routes must keep a permanent canonical redirect.");
requireText(nextConfig, '{ source: "/motorcycles/:make/:slug/specifications", destination: "/motorcycles/:make/:slug#specs", permanent: true }', "Legacy motorcycle specification routes must keep a permanent canonical redirect.");
requireText(nextConfig, '{ source: "/motorcycles/:make/:slug/maintenance", destination: "/motorcycles/:make/:slug#maintenance", permanent: true }', "Legacy motorcycle maintenance routes must keep a permanent canonical redirect.");

requireText(articleSchema, "datePublished?: string;", "Article schema must accept a real page-level publication date.");
requireText(articleSchema, "image?: string;", "Article schema must accept a representative image.");
requireText(articleSchema, "...(published ? { datePublished: published } : {})", "Article schema should emit datePublished only when a real publication date exists.");
requireText(articleSchema, 'image: { "@type": "ImageObject", url: absoluteUrl(image) }', "Article schema should expose an ImageObject when an editorial image is supplied.");
forbidText(articleSchema, "datePublished: RELEASE_DATE", "Article schema must not make every article look published on the global release date.");
requireText(guideMedia, '"motorcycle-helmet-size-guide": {', "Helmet sizing guide must retain dedicated publication/media metadata.");
requireText(guideMedia, '"motorcycle-helmet-certification-philippines": {', "Helmet certification guide must retain dedicated publication/media metadata.");
if ((guideMedia.match(/publishedAt: "2026-09-08"/g) || []).length < 2) errors.push("Both launch editorial guides must retain their 2026-09-08 publication date.");
requireText(guidePage, "<time dateTime={guideMedia.publishedAt}>", "Editorial guides should expose a machine-readable visible publication date.");
requireText(guidePage, "Put this guide to work", "Editorial guides should link readers into model-level research and methodology.");
requireText(guidePage, "image: schemaImage", "Editorial guide Article schema should keep representative imagery.");
requireText(ownershipCalculator, "item.id === bike", "Ownership calculator should support model-specific deep links.");
requireText(ownershipCalculator, "How the ownership estimate works", "Ownership calculator must retain explanatory methodology content.");
requireText(ownershipCalculator, "Use total cost to compare motorcycles", "Ownership calculator should remain a buyer-decision resource, not a bare utility.");
requireText(commuteCalculator, "What the commute estimate includes", "Commute calculator must retain explanatory methodology content.");
requireText(commuteCalculator, "Turn the commute number into a buying decision", "Commute calculator should connect operating cost to the wider buyer journey.");
requireText(priorityBrief, '/ownership/cost-calculator?bike=${model.id}', "Priority model pages should deep-link into ownership cost with the current model selected.");
requireText(priorityBrief, '/commute/cost-calculator?bike=${model.id}', "Priority model pages should deep-link into commute cost with the current model selected.");
requireText(priorityBrief, 'href="/dealers"', "Priority model pages should keep a dealer research next step.");
requireText(priorityBrief, '"cfmoto-450mt"', "CFMOTO 450MT should retain a focused buyer brief.");
requireText(priorityBrief, '"cfmoto-450sr"', "CFMOTO 450SR should retain a focused buyer brief.");
requireText(authorProfile, 'href="/data-sources"', "Author profile should expose the data-source policy.");
requireText(authorProfile, 'href="/corrections"', "Author profile should expose the correction path.");
requireText(authorProfile, "Selected buyer research", "Author profile should connect the author entity to representative research.");

for (const token of [
  'sourceLabel: "Yamaha Motor Philippines Periodic Maintenance Schedule (PMS) Guide"',
  'sourceUrl: "https://aftersales.yamaha-motor.com.ph/"',
  'pmsMilestones: "1,000 km · 4,000 km · 7,000 km · 10,000 km · 13,000 km; the Yamaha guide then continues on a 3,000 km PMS cadence."',
  '{ item: "Gear oil", interval: "Every 12,000 km"',
  '{ item: "Spark plug", interval: "Every 6,000 km"',
  '{ item: "V-belt / chain", interval: "Yamaha PMS guide lists 25,000 km"'
]) {
  requireText(maintenanceData, token, `Yamaha maintenance authority lost required source-backed token: ${token}`);
}

for (const token of [
  'sourceLabel: "Honda Philippines commuter motorcycle free-service PMS guidance"',
  'sourceUrl: "https://www.hondaph.com/motorcycle/faq"',
  'Coupon 1: 500–2,000 km or 3 months',
  'Coupon 2: 2,001–6,000 km or 7 months',
  'Coupon 3: 6,001–12,000 km or 12 months',
  'These are free-service coupon windows, not a complete model-specific maintenance table.'
]) {
  requireText(maintenanceData, token, `Honda maintenance authority lost required source-backed token: ${token}`);
}
for (const token of [
  'modelId: "honda-adv-160"',
  'sourceLabel: "Honda ADV160 Philippines Owner\'s Manual · ADV160A PH type · 32K0WA100"',
  'sourceUrl: "https://2rom-prd-data.hondamotopub.com/om/HPI/ADV160/2023/ADV160_32K0WA100_0.pdf"',
  'lastChecked: "2026-09-25"',
  '{ item: "Engine oil", interval: "First at 1,000 km; then every 6,000 km"',
  '{ item: "Drive belt", interval: "Inspect at 24,000 km; then every 24,000 km"',
  '{ item: "Valve clearance", interval: "Inspect at 24,000 km; then every 24,000 km"',
  'tirePressure: { soloFrontPsi: 29, soloRearPsi: 33, passengerFrontPsi: 29, passengerRearPsi: 33 }'
]) {
  requireText(maintenanceData, token, `ADV160 exact maintenance lost required owner-manual token: ${token}`);
}
for (const token of [
  'modelId: "yamaha-nmax-v3"',
  'sourceLabel: "Yamaha NMAX 155 current-generation Owner\'s Manual · GPD155-A · BTF-FU199-E0"',
  'sourceUrl: "https://www.yamaha-motor.co.th/docs/default-document-library/btf-fu199-e0.pdf?Status=Master&sfvrsn=d035e32e_0"',
  'lastChecked: "2026-09-25"',
  '{ item: "Engine oil", interval: "First at 1,000 km; next at 4,000 km; then every 4,000 km"',
  '{ item: "Spark plug", interval: "Replace every 8,000 km"',
  '{ item: "Air filter element", interval: "Every 16,000 km"',
  '{ item: "Final transmission oil", interval: "Every 12,000 km"',
  '{ item: "V-belt", interval: "Inspect first at 7,000 km; then every 4,000 km"',
  'mandatory replacement point at 25,000 km',
  'tirePressure: { soloFrontPsi: 22, soloRearPsi: 36, passengerFrontPsi: 22, passengerRearPsi: 36 }'
]) {
  requireText(maintenanceData, token, `NMAX V3 exact maintenance lost required owner-manual token: ${token}`);
}
for (const token of [
  'modelId: "yamaha-aerox-v3"',
  'sourceLabel: "Yamaha AEROX current-generation Owner\'s Manual · GPR155D-A · D13-F8199-E0"',
  'sourceUrl: "https://www.yamaha-motor.co.th/docs/owner-manual/commuter/en/d13-f8199-e0.pdf?Status=Master&sfvrsn=ebc82eb6_2"',
  'lastChecked: "2026-09-25"',
  '{ item: "Engine oil", interval: "First at 1,000 km; then every 4,000 km"',
  '{ item: "Spark plug", interval: "Replace every 8,000 km"',
  '{ item: "Air filter element", interval: "Every 16,000 km"',
  '{ item: "Final transmission oil", interval: "Every 12,000 km"',
  '{ item: "V-belt", interval: "Inspect first at 8,000 km; then every 4,000 km"',
  'requires replacement every 25,000 km',
  'tirePressure: { soloFrontPsi: 29, soloRearPsi: 33, passengerFrontPsi: 29, passengerRearPsi: 33 }'
]) {
  requireText(maintenanceData, token, `Aerox V3 exact maintenance lost required owner-manual token: ${token}`);
}
requireText(modelEntity, 'href={maintenance.sourceUrl}', "Exact model maintenance schedules must expose the official owner-manual source link.");
requireText(modelEntity, "Open the official owner manual →", "Exact model maintenance schedules must label the official manual link clearly.");

requireText(maintenanceData, "Brand-level Yamaha Philippines PMS guidance.", "Yamaha brand-level PMS guidance must stay clearly labeled and must not masquerade as an exact model manual.");
requireText(modelEntity, "brandMaintenanceGuideForModel(model)", "Motorcycle entity pages must resolve brand-level maintenance guidance when exact model schedules are unavailable.");
requireText(modelEntity, "This is {model.make} brand-level maintenance guidance, not a substitute for the exact", "Model pages must disclose that brand-level maintenance guidance is not an exact model manual.");
requireText(maintenanceHub, 'id="brand-pms"', "Maintenance hub must expose the brand-level PMS section.");
requireText(maintenanceHub, "Brand-level periodic maintenance schedules", "Maintenance hub must explain the brand-level maintenance layer.");
requireText(maintenanceHub, "Use the exact owner manual whenever it gives a different requirement.", "Maintenance hub must preserve the exact-manual precedence warning.");
requireText(maintenanceHub, "...brandMaintenanceGuides.map(g=>g.lastChecked)", "Maintenance hub structured-data freshness must include brand maintenance guide source checks.");

for (const token of [
  'id:"shad-sh33"',
  'model:"SH33"',
  'mountingSystem:"SHAD small plate D1B29PAR + bike-specific Top Master / fitting kit"',
  'priceFromPhp:2999',
  'sourceUrl:"https://www.shad.es/tl/motorcycle-cases/top-cases/top-case-sh33-black/"'
]) {
  requireText(catalogData, token, `SHAD SH33 product data lost required verified token: ${token}`);
}

for (const token of [
  'id:"shad-sh29"',
  'model:"SH29"',
  'capacityL:29',
  'maxLoadKg:3',
  'mountingSystem:"SHAD small plate D1B29PAR + bike-specific Top Master / fitting kit"',
  'priceFromPhp:2499',
  'sourceUrl:"https://www.shad.es/tl/motorcycle-cases/top-cases/top-case-sh29-black/"'
]) {
  requireText(catalogData, token, `SHAD SH29 product data lost required verified token: ${token}`);
}

for (const token of [
  'id: "sh39-fazzio"',
  'modelId: "yamaha-fazzio"',
  'rackCode: "Y0IFZ11ST"',
  'modelYears: "2022-2026"',
  'id: "sh33-beat"',
  'modelId: "honda-beat"',
  'rackCode: "H0IBT11ST"',
  'top cases up to SH34',
  'status: "verified"'
]) {
  requireText(topBoxFitmentData, token, `Verified top-box fitment depth lost required token: ${token}`);
}
requireText(topBoxFitmentData, 'status: "research"', "NMAX V3 fitment uncertainty must remain represented instead of promoting all SHAD edges to verified.");

const fitmentWave2 = [
  ["sh39-mio-gear", "yamaha-mio-gear", "Y0MZ16ST", "Gear: 2020-2025"],
  ["sh39-mio-i125", "yamaha-mio-i-125", "Y0MZ16ST", "Mio i125: 2014-2025"],
  ["sh39-burgman-street", "suzuki-burgman-street", "S0BR14ST", "2024-2026"],
  ["sh39-avenis", "suzuki-avenis", "S0AV13IST", "2023-2026"],
  ["sh39-click125", "honda-click-125i", "H0VR15IST", "Click/Vario 125: 2015-2026"],
  ["sh39-burgman-400", "suzuki-burgman-400", "S0BR47ST", "2017-2026"],
  ["sh39-cb650r", "honda-cb650r", "H0CR64ST", "CB650R: 2024-2026"],
  ["sh39-nx500", "honda-nx500-e-clutch", "H0CX55ST", "NX500: 2023-2026"],
  ["sh39-adv350", "honda-adv-350", "H0FR15IST", "ADV350: 2025-2026"],
  ["sh39-tmax-tech-max", "yamaha-tmax", "Y0TX52ST", "TMAX 560 Tech Max: 2022-2026"],
];

if (fitmentWave2.length !== 10) errors.push("Top-box fitment wave 2 must retain exactly ten reviewed additions.");
for (const [id, modelId, rackCode, modelYears] of fitmentWave2) {
  const start = topBoxFitmentData.indexOf(`id: "${id}"`);
  if (start < 0) {
    errors.push(`Top-box fitment wave 2 lost ${id}.`);
    continue;
  }
  const end = topBoxFitmentData.indexOf("\n  },", start);
  const block = topBoxFitmentData.slice(start, end > start ? end : start + 1800);
  requireText(block, `modelId: "${modelId}"`, `${id} must remain attached to ${modelId}.`);
  requireText(block, `rackCode: "${rackCode}"`, `${id} lost manufacturer rack code ${rackCode}.`);
  requireText(block, `modelYears: "${modelYears}"`, `${id} lost reviewed model-year coverage.`);
  requireText(block, 'status: "verified"', `${id} must remain a reviewed manufacturer-backed fitment edge.`);
  requireText(block, 'lastChecked: "2026-09-23"', `${id} must retain the September 23 source check.`);
}
requireText(topBoxFitmentData, "not compatible with the big or aluminium mounting plates", "Restricted scooter fittings must retain the SHAD plate warning.");
requireText(topBoxFitmentData, "Reconfirm the rack before ordering for a later Philippine model year.", "Yamaha 2025-only fitment coverage must retain the later-model-year caution.");

const fitmentWave3 = [
  ["sh39-mio-gravis", "yamaha-mio-gravis", "Y0FG13IST", "2023-2025"],
  ["sh39-sniper-155", "yamaha-sniper-155", "Y0IMX18ST", "2015-2026"],
  ["sh39-xsr155", "yamaha-xsr155", "Y0IXS19ST", "XSR155: 2019-2025"],
  ["sh39-mt07", "yamaha-mt-07", "Y0MT75ST", "2025-2026"],
  ["sh39-cb150x", "honda-cb150x", "H0ICB16ST", "2021-2025"],
  ["sh39-transalp-750", "honda-xl750-transalp", "H0TR73ST", "2023-2026"],
  ["sh39-africa-twin-1100", "honda-crf1100l-africa-twin", "H0DV10ST", "CRF1100L Africa Twin: 2022-2026"],
  ["sh39-z500", "kawasaki-z500", "K0Z554ST", "2024-2025"],
  ["sh39-vstrom-250-sx", "suzuki-v-strom-250-sx", "S0VS23IST", "2023-2026"],
  ["sh33-burgman-street-ex", "suzuki-burgman-street-ex", "S0BR13IST", "2023-2025"],
];

if (fitmentWave3.length !== 10) errors.push("Top-box fitment wave 3 must retain exactly ten reviewed additions.");
for (const [id, modelId, rackCode, modelYears] of fitmentWave3) {
  const start = topBoxFitmentData.indexOf(`id: "${id}"`);
  if (start < 0) {
    errors.push(`Top-box fitment wave 3 lost ${id}.`);
    continue;
  }
  const end = topBoxFitmentData.indexOf("\n  },", start);
  const fitmentBlock = topBoxFitmentData.slice(start, end > start ? end : start + 2200);
  requireText(fitmentBlock, `modelId: "${modelId}"`, `${id} must remain attached to ${modelId}.`);
  requireText(fitmentBlock, `rackCode: "${rackCode}"`, `${id} lost manufacturer rack code ${rackCode}.`);
  requireText(fitmentBlock, `modelYears: "${modelYears}"`, `${id} lost reviewed model-year coverage.`);
  requireText(fitmentBlock, 'status: "verified"', `${id} must remain a reviewed manufacturer-backed fitment edge.`);
  requireText(fitmentBlock, 'lastChecked: "2026-09-23"', `${id} must retain the September 23 source check.`);
}
requireText(topBoxFitmentData, "compatibility table uses the regional MX King 150 name", "Sniper 155 fitment must retain the regional MX King naming caution.");
requireText(topBoxFitmentData, "not compatible with the small D1B29PAR plate", "Africa Twin fitment must retain the SHAD small-plate restriction.");
requireText(topBoxFitmentData, 'id: "sh33-burgman-street-ex"', "Burgman Street EX fitment must remain in wave 3.");
requireText(topBoxFitmentData, 'topBoxId: "shad-sh33"', "Wave 3 must preserve the SH33-specific Burgman Street EX compatibility.");
requireText(topBoxFitmentData, "exact fitting detail table currently stops at 2025", "2025-limited fitments must retain the explicit later-year recheck boundary.");

const fitmentWave4 = [
  ["sh39-nmax-v2", "yamaha-nmax-v2", "Y0INM19ST", "MotoIndex NMAX V2: 2020-2021; SHAD NMAX 155 rack coverage: 2020-2024"],
  ["sh33-nmax-v2", "yamaha-nmax-v2", "Y0INM19ST", "MotoIndex NMAX V2: 2020-2021; SHAD NMAX 155 rack coverage: 2020-2024"],
  ["sh39-aerox-v2", "yamaha-aerox-v2", "Y0AE14IST", "MotoIndex Aerox V2: 2021 generation; SHAD Aerox rack coverage: 2021-2026"],
  ["sh33-aerox-v2", "yamaha-aerox-v2", "Y0AE14IST", "MotoIndex Aerox V2: 2021 generation; SHAD Aerox rack coverage: 2021-2026"],
  ["sh39-click150i", "honda-click-150i", "H0VR15IST", "Click150i MotoIndex generation: 2018-2022; SHAD Vario 150 coverage: 2015-2022"],
  ["sh39-xmax", "yamaha-xmax", "Y0XM33ST", "XMAX 300: 2023-2025"],
  ["sh39-gixxer-sf250", "suzuki-gixxer-sf250", "S0GX22IST", "2021-2025"],
  ["sh39-lexi155", "yamaha-lexi-155", "Y0LX14IST", "2024-2026"],
  ["sh39-klx150", "kawasaki-klx150", "K0IKL18ST", "2015-2026"],
  ["sh39-cb500-hornet", "honda-cb500-hornet-e-clutch", "H0CB59ST", "CB500 Hornet family: 2023-2026"],
];

if (fitmentWave4.length !== 10) errors.push("Top-box fitment wave 4 must retain exactly ten reviewed relationships.");
for (const [id, modelId, rackCode, modelYears] of fitmentWave4) {
  const start = topBoxFitmentData.indexOf(`id: "${id}"`);
  if (start < 0) {
    errors.push(`Top-box fitment wave 4 lost ${id}.`);
    continue;
  }
  const end = topBoxFitmentData.indexOf("\n  },", start);
  const fitmentBlock = topBoxFitmentData.slice(start, end > start ? end : start + 2600);
  requireText(fitmentBlock, `modelId: "${modelId}"`, `${id} must remain attached to ${modelId}.`);
  requireText(fitmentBlock, `rackCode: "${rackCode}"`, `${id} lost manufacturer rack code ${rackCode}.`);
  requireText(fitmentBlock, `modelYears: "${modelYears}"`, `${id} lost reviewed year/generation coverage.`);
  requireText(fitmentBlock, 'status: "verified"', `${id} must remain manufacturer-backed.`);
  requireText(fitmentBlock, 'lastChecked: "2026-09-23"', `${id} must retain the September 23 source check.`);
}
requireText(topBoxFitmentData, 'id: "sh33-nmax-v2"', "Wave 4 must preserve the explicit SH33 alternative for NMAX V2.");
requireText(topBoxFitmentData, 'id: "sh33-aerox-v2"', "Wave 4 must preserve the explicit SH33 alternative for Aerox V2.");
requireText(topBoxFitmentData, "SHAD Vario 150 coverage: 2015-2022", "Click150i must retain the verified Vario 150 cross-market year boundary.");
requireText(topBoxFitmentData, "2026 units require a rack recheck before ordering", "XMAX must retain the 2026 recheck warning.");
requireText(topBoxFitmentData, "Reconfirm fitment for a 2026 Philippine unit", "Gixxer SF250 must retain the 2026 fitment warning.");
requireText(topBoxFitmentData, "SHAD catalogs the CB500 Hornet family rather than the Philippine E-Clutch trim separately", "CB500 Hornet E-Clutch must retain the trim-level caution.");

const fitmentWave5 = [
  ["sh33-fazzio", "yamaha-fazzio", "Y0IFZ11ST", "2022-2026"],
  ["sh33-mio-gear", "yamaha-mio-gear", "Y0MZ16ST", "Gear: 2020-2025"],
  ["sh33-burgman-street", "suzuki-burgman-street", "S0BR14ST", "2024-2026"],
  ["sh33-avenis", "suzuki-avenis", "S0AV13IST", "2023-2026"],
  ["sh33-click125", "honda-click-125i", "H0VR15IST", "Click/Vario 125: 2015-2026"],
  ["sh33-click150i", "honda-click-150i", "H0VR15IST", "Click150i MotoIndex generation: 2018-2022; SHAD Vario 150 coverage: 2015-2022"],
  ["sh33-cb650r", "honda-cb650r", "H0CR64ST", "CB650R: 2024-2026"],
  ["sh33-tmax-tech-max", "yamaha-tmax", "Y0TX52ST", "TMAX 560 Tech Max: 2022-2026"],
  ["sh33-lexi155", "yamaha-lexi-155", "Y0LX14IST", "2024-2026"],
  ["sh33-klx150", "kawasaki-klx150", "K0IKL18ST", "2015-2026"],
];

if (fitmentWave5.length !== 10) errors.push("Top-box fitment wave 5 must retain exactly ten reviewed SH33 relationships.");
for (const [id, modelId, rackCode, modelYears] of fitmentWave5) {
  const start = topBoxFitmentData.indexOf(`id: "${id}"`);
  if (start < 0) {
    errors.push(`Top-box fitment wave 5 lost ${id}.`);
    continue;
  }
  const end = topBoxFitmentData.indexOf("\n  },", start);
  const fitmentBlock = topBoxFitmentData.slice(start, end > start ? end : start + 2600);
  requireText(fitmentBlock, 'topBoxId: "shad-sh33"', `${id} must stay attached to SHAD SH33.`);
  requireText(fitmentBlock, `modelId: "${modelId}"`, `${id} must remain attached to ${modelId}.`);
  requireText(fitmentBlock, `rackCode: "${rackCode}"`, `${id} lost manufacturer rack code ${rackCode}.`);
  requireText(fitmentBlock, `modelYears: "${modelYears}"`, `${id} lost reviewed year/generation coverage.`);
  requireText(fitmentBlock, 'status: "verified"', `${id} must remain manufacturer-backed.`);
  requireText(fitmentBlock, 'lastChecked: "2026-09-23"', `${id} must retain the September 23 source check.`);
}
requireText(topBoxFitmentData, "explicitly lists SH33", "Wave 5 must retain manufacturer-explicit SH33 compatibility language.");
requireText(topBoxFitmentData, "SHAD currently lists Gear fitment through 2025", "Mio Gear SH33 must retain the later-model-year recheck boundary.");
requireText(topBoxFitmentData, "SHAD catalogs this family as Vario 150 in Indonesia", "Click150i SH33 must retain the cross-market naming boundary.");
requireText(topBoxFitmentData, "SHAD names the regional model Lexi LX 155", "Lexi 155 SH33 must retain the regional naming note.");

const fitmentWave6 = [
  ["sh33-aerox-v3", "yamaha-aerox-v3", "Y0AE14IST", "Aerox 155: 2021-2026; Aerox Alpha: 2024-2026"],
  ["sh33-adv160", "honda-adv-160", "H0XD12IST", "2022-2026"],
  ["sh33-click160", "honda-click-160", "H0VR15IST", "Click/Vario 160: 2022-2026"],
  ["sh33-pcx160", "honda-pcx-160", "H0IPC11ST", "PCX: 2010-2026"],
  ["sh33-sniper-155", "yamaha-sniper-155", "Y0IMX18ST", "2015-2026"],
  ["sh33-cb150x", "honda-cb150x", "H0ICB16ST", "2021-2025"],
  ["sh33-z500", "kawasaki-z500", "K0Z554ST", "2024-2025"],
  ["sh33-vstrom-250-sx", "suzuki-v-strom-250-sx", "S0VS23IST", "2023-2026"],
  ["sh33-burgman-400", "suzuki-burgman-400", "S0BR47ST", "2017-2026"],
  ["sh33-xmax", "yamaha-xmax", "Y0XM33ST", "XMAX 300: 2023-2025"],
];

if (fitmentWave6.length !== 10) errors.push("Top-box fitment wave 6 must retain exactly ten reviewed SH33 relationships.");
for (const [id, modelId, rackCode, modelYears] of fitmentWave6) {
  const start = topBoxFitmentData.indexOf(`id: "${id}"`);
  if (start < 0) {
    errors.push(`Top-box fitment wave 6 lost ${id}.`);
    continue;
  }
  const end = topBoxFitmentData.indexOf("\n  },", start);
  const fitmentBlock = topBoxFitmentData.slice(start, end > start ? end : start + 2800);
  requireText(fitmentBlock, 'topBoxId: "shad-sh33"', `${id} must stay attached to SHAD SH33.`);
  requireText(fitmentBlock, `modelId: "${modelId}"`, `${id} must remain attached to ${modelId}.`);
  requireText(fitmentBlock, `rackCode: "${rackCode}"`, `${id} lost manufacturer rack code ${rackCode}.`);
  requireText(fitmentBlock, `modelYears: "${modelYears}"`, `${id} lost reviewed year/generation coverage.`);
  requireText(fitmentBlock, 'status: "verified"', `${id} must remain manufacturer-backed.`);
  requireText(fitmentBlock, 'lastChecked: "2026-09-23"', `${id} must retain the September 23 source check.`);
}
requireText(topBoxFitmentData, "Aerox 155 / Aerox Alpha family coverage", "Aerox V3 SH33 must retain the family-generation caution.");
requireText(topBoxFitmentData, "Philippine Click160 naming and year boundary", "Click160 SH33 must retain the Click/Vario market-name boundary.");
requireText(topBoxFitmentData, "Philippines-specific PCX 160 trim", "PCX160 SH33 must retain the family-vs-trim caution.");
requireText(topBoxFitmentData, "compatibility table uses the regional MX King 150 name", "Sniper 155 SH33 must retain the regional naming caution.");
requireText(topBoxFitmentData, "exact SHAD CB150X fitting page currently stops at 2025", "CB150X SH33 must retain the later-model-year recheck boundary.");
requireText(topBoxFitmentData, "exact fitting detail table currently stops at 2025", "Z500 SH33 must retain the 2025 exact-page boundary.");
requireText(topBoxFitmentData, "exact non-Tech XMAX 300 Y0XM33ST table currently stops at 2025", "XMAX SH33 must retain the non-Tech 2026 recheck boundary.");

const fitmentWave7 = [
  ["sh33-mio-i125", "yamaha-mio-i-125", "Y0MZ16ST", "Mio i125: 2014-2025"],
  ["sh33-nx500", "honda-nx500-e-clutch", "H0CX55ST", "NX500: 2023-2026"],
  ["sh33-adv350", "honda-adv-350", "H0FR15IST", "ADV350: 2025-2026"],
  ["sh33-mio-gravis", "yamaha-mio-gravis", "Y0FG13IST", "2023-2025"],
  ["sh33-xsr155", "yamaha-xsr155", "Y0IXS19ST", "XSR155: 2019-2025"],
  ["sh33-mt07", "yamaha-mt-07", "Y0MT75ST", "2025-2026"],
  ["sh33-transalp-750", "honda-xl750-transalp", "H0TR73ST", "2023-2026"],
  ["sh33-gixxer-sf250", "suzuki-gixxer-sf250", "S0GX22IST", "2021-2025"],
  ["sh29-fazzio", "yamaha-fazzio", "Y0IFZ11ST", "2022-2026"],
  ["sh29-aerox-v3", "yamaha-aerox-v3", "Y0AE14IST", "Aerox 155: 2021-2026; Aerox Alpha: 2024-2026"],
];

if (fitmentWave7.length !== 10) errors.push("Top-box fitment wave 7 must retain exactly ten reviewed relationships.");
for (const [id, modelId, rackCode, modelYears] of fitmentWave7) {
  const start = topBoxFitmentData.indexOf(`id: "${id}"`);
  if (start < 0) {
    errors.push(`Top-box fitment wave 7 lost ${id}.`);
    continue;
  }
  const end = topBoxFitmentData.indexOf("\n  },", start);
  const fitmentBlock = topBoxFitmentData.slice(start, end > start ? end : start + 3000);
  requireText(fitmentBlock, `modelId: "${modelId}"`, `${id} must remain attached to ${modelId}.`);
  requireText(fitmentBlock, `rackCode: "${rackCode}"`, `${id} lost manufacturer rack code ${rackCode}.`);
  requireText(fitmentBlock, `modelYears: "${modelYears}"`, `${id} lost reviewed year/generation coverage.`);
  requireText(fitmentBlock, 'status: "verified"', `${id} must remain manufacturer-backed.`);
  requireText(fitmentBlock, 'lastChecked: "2026-09-23"', `${id} must retain the September 23 source check.`);
}
requireText(topBoxFitmentData, "SHAD currently lists Mio i125 fitment through 2025", "Mio i125 SH33 must retain the later-model-year warning.");
requireText(topBoxFitmentData, "Philippine E-Clutch trim separately", "NX500 SH33 must retain the family-vs-trim caution.");
requireText(topBoxFitmentData, "exact SHAD XSR155 fitting table currently stops at 2025", "XSR155 SH33 must retain the 2025 boundary.");
requireText(topBoxFitmentData, "exact SHAD Gixxer SF 250 rack coverage currently stops at 2025", "Gixxer SF250 SH33 must retain the 2025 boundary.");
requireText(topBoxFitmentData, 'topBoxId: "shad-sh29"', "Wave 7 must retain verified SH29 relationships.");
requireText(topBoxFitmentData, 'id: "sh29-fazzio"', "Wave 7 must retain the verified Fazzio SH29 relationship.");
requireText(topBoxFitmentData, 'id: "sh29-aerox-v3"', "Wave 7 must retain the verified Aerox V3 SH29 relationship.");
forbidText(topBoxFitmentData, 'modelId: "suzuki-access"', "Suzuki Access must not inherit Suzuki Address 125 fitment without direct model evidence.");
forbidText(topBoxFitmentData, 'rackCode: "S0DR16ST"', "Address 125 rack S0DR16ST must not be reused for Suzuki Access.");


if (errors.length) {
  console.error("SEO hardening validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SEO hardening validation passed.");
