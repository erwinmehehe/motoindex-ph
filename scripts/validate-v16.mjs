import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const errors=[];
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const exists=(p)=>fs.existsSync(path.join(root,p));
const expect=(condition,message)=>{if(!condition)errors.push(message)};

for(const f of [
  "components/ComparisonHighlights.tsx","SEO_AUDIT_V16.md","V16_BUILD_SUMMARY.md",
  "public/brand/motoindex-og.png","scripts/validate-v16.mjs"
]) expect(exists(f),`missing ${f}`);

const data=read("lib/data.ts");
expect(data.includes("export const publicMotorcycles = currentMotorcycles.filter(isIndexableModel)"),"public motorcycle discovery gate missing");
const compareGate=data.match(/export function isIndexableComparison\(slug: string\) \{[\s\S]*?\n\}/)?.[0]||"";
expect(compareGate.includes("comparisons.some"),"comparison index gate must require curated comparison slug");
expect(compareGate.includes("isIndexableModel"),"comparison index gate must retain model quality checks");
expect((data.match(/slug: ".*-vs-.*"/g)||[]).length>=10,"expected expanded curated comparison set");
for(const slug of ["automatic-motorcycles-under-100k","motorcycles-with-abs-philippines","fuel-efficient-motorcycles-philippines","best-underbone-motorcycles-philippines"]) expect(data.includes(`slug: "${slug}"`),`missing v1.6 guide ${slug}`);
const recFn=data.match(/export function getRecommendationModels\(slug: string\) \{[\s\S]*?\n\}/)?.[0]||"";
expect(recFn.includes("publicMotorcycles"),"recommendations must be generated from public/source-checked motorcycles");
expect(!recFn.includes("[...currentMotorcycles]"),"recommendations still select review-state motorcycles");

const tires=read("app/tires/page.tsx");
expect(tires.includes("publicMotorcycles.map"),"tire hub leaks non-public motorcycle records");
expect(tires.includes('tireProducts.filter(p=>p.status==="verified")'),"tire hub leaks research products");
const accessories=read("app/accessories/page.tsx")+read("app/accessories/[slug]/page.tsx");
expect(accessories.includes("publicMotorcycles.slice"),"accessory hub/detail leaks review motorcycle records");
expect(accessories.includes('topBoxProducts.filter(p=>p.status==="verified")'),"top-box category leaks research products");
const helmets=read("app/gear/helmets/page.tsx");
expect(helmets.includes("isIndexableHelmetBrand"),"helmet hub must filter brand discovery by source depth");
expect(helmets.includes('helmetProducts.filter(p=>p.status==="verified")'),"helmet hub leaks research products");
const catalog=read("lib/catalog.ts");
expect(catalog.includes("return publicMotorcycles.filter"),"tire product size matches still expose review-state models");

const ranked=read("components/RankedModelCard.tsx");
expect(ranked.includes("observedMarketPriceLabel"),"buying-guide cards still show stale single SRP");
const comparePage=read("app/compare/[slug]/page.tsx");
expect(comparePage.includes("<ComparisonHighlights"),"comparison highlights/verdict layer missing");
const finder=read("components/MotorcycleFinder.tsx");
for(const token of ["maxSeat","maxWeight","category"]) expect(finder.includes(token),`finder filter missing ${token}`);

const modelRoute=read("app/motorcycles/[make]/[slug]/page.tsx");
const modelPage=modelRoute.includes("MotorcycleEntityPage")&&exists("components/MotorcycleEntityPage.tsx")?modelRoute+read("components/MotorcycleEntityPage.tsx"):modelRoute;
for(const token of ["priceChecksForModel",'"@type": "Product"',"offers: offer","absoluteUrl(canonicalPath)","brand:"]) expect(modelPage.includes(token),`canonical model structured data missing ${token}`);
expect(modelPage.includes("AggregateOffer")||modelPage.includes('@type: "Offer"'),"model schema must expose a current price offer representation");
expect(modelPage.includes('priority sizes="(max-width: 900px) 100vw, 48vw"')||modelPage.includes('priority sizes="(max-width: 900px) 100vw, 42vw"'),"model hero image is not priority/LCP optimized");
const media=read("components/EntityMedia.tsx");
expect(media.includes("priority?: boolean"),"EntityMedia priority prop missing");
const site=read("lib/site.ts")+read("app/layout.tsx");
expect(site.includes("/brand/motoindex-og.png"),"default social image must use generated 1200x630 PNG");
expect(!site.includes("/brand/motoindex-og.svg"),"SVG still used as default social image");
for(const f of [
  "app/motorcycles/[make]/[slug]/price/page.tsx","app/motorcycles/[make]/[slug]/tire-size/page.tsx",
  "app/motorcycles/[make]/[slug]/ownership-cost/page.tsx","app/fitment/[make]/[slug]/page.tsx","app/recommendations/[slug]/page.tsx"
]) { const src=read(f); expect(src.includes("<Breadcrumbs")||src.includes("permanentRedirect"),`${f} missing breadcrumbs or permanent canonical redirect`); }
expect(read("app/page.tsx").includes("Compare motorcycle prices and specs in the Philippines."),"homepage H1 not aligned to primary commercial intent");
expect(!read("LAUNCH_CHECKLIST.md").includes("positive search demand"),"launch checklist still claims search volume is an index gate");
expect(!read("SEO_CHECKLIST.md").includes("positive search demand"),"SEO checklist still claims search volume is an index gate");

if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log("v1.6 validation passed: curated comparison indexation, source-safe public hubs, 4 new data-backed guides, richer finder, market-aligned product schema, breadcrumb coverage, LCP image priority and PNG social sharing asset.");
