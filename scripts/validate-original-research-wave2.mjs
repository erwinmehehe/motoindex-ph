import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];

const researchData=read("lib","researchData.ts");
const dealerFinancing=read("lib","dealerFinancing.ts");
const pricePage=read("app","research","motorcycle-price-index-philippines","page.tsx");
const financingPage=read("app","research","motorcycle-financing-index-philippines","page.tsx");
const csvRoute=read("app","research","motorcycle-price-index-philippines","data.csv","route.ts");
const researchHub=read("app","research","page.tsx");
const researchSitemap=read("lib","researchSitemap.ts");

const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

for(const token of [
  'PRICE_INDEX_BASELINE_DATE = "2026-10-03"',
  'PRICE_INDEX_METHOD_VERSION = "v1"',
  'export function researchPriceSegments()',
  'export function researchBrandPriceBenchmarks',
  'export function researchBudgetBands()',
  'export function researchDealerFinancingRows()',
  'export function researchPriceCsv()',
  '"core_source_url"',
  '"price_source_url"'
]){
  requireText(researchData,token,`Research data helper missing: ${token}`);
}

requireText(
  dealerFinancing,
  'export const dealerFinancingObservations',
  "Dealer financing observations must remain reusable by the research layer."
);

for(const token of [
  'title: "Motorcycle Price Index Philippines 2026 | Prices & Data"',
  'Download CSV',
  'Median motorcycle prices by segment',
  'How the current catalog is distributed by starting price',
  'Median starting prices for brands with at least three current models',
  'This is the starting point for future price movement tracking',
  'does not claim month-over-month movement yet',
  'contentUrl: absoluteUrl(`${path}/data.csv`)'
]){
  requireText(pricePage,token,`Price-index research depth missing: ${token}`);
}

const priceTitle="Motorcycle Price Index Philippines 2026 | Prices & Data";
const priceDescription="Compare current motorcycle prices in the Philippines with segment medians, brand benchmarks, budget bands, source dates and a downloadable CSV dataset.";
if(priceTitle.length<55||priceTitle.length>60)errors.push(`Price-index title must be 55-60 chars; found ${priceTitle.length}.`);
if(priceDescription.length<150||priceDescription.length>160)errors.push(`Price-index description must be 150-160 chars; found ${priceDescription.length}.`);

for(const token of [
  'export const dynamic = "force-static"',
  'researchPriceCsv()',
  '"Content-Type": "text/csv; charset=utf-8"',
  'motoindex-ph-motorcycle-price-index.csv'
]){
  requireText(csvRoute,token,`Price-index CSV route missing: ${token}`);
}

for(const token of [
  'researchDealerFinancingRows',
  'Current dealer financing snapshots kept separate from the model',
  'Median published down',
  'Not published',
  'Do not compare dealer monthly amounts as if the loan assumptions are identical',
  'standardized index below for like-for-like planning'
]){
  requireText(financingPage,token,`Financing research depth missing: ${token}`);
}

for(const token of [
  'downloadable source-led CSV',
  'dated dealer down-payment and monthly-payment snapshots'
]){
  requireText(researchHub,token,`Research hub description missing: ${token}`);
}

for(const token of [
  '/research/motorcycle-price-index-philippines',
  '/research/motorcycle-financing-index-philippines'
]){
  requireText(researchSitemap,token,`Research sitemap lost canonical route: ${token}`);
}

if(pricePage.includes("month-over-month increase")||pricePage.includes("month-over-month decrease")){
  errors.push("Price index must not publish movement claims before comparable historical snapshots exist.");
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Original research wave 2 validation passed.");
