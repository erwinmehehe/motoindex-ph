import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const failures=[];
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const exists=(p)=>fs.existsSync(path.join(root,p));
const assert=(c,m)=>{if(!c)failures.push(m)};
const pkg=JSON.parse(read("package.json"));

const [pkgMajor,pkgMinor]=String(pkg.version||"0.0.0").split(".").map(Number);
assert(pkgMajor>1||(pkgMajor===1&&pkgMinor>=8),`package version should be v1.8 or newer, found ${pkg.version}`);
assert(pkg.scripts?.["validate:v18"]==="node scripts/validate-v18.mjs","validate:v18 script missing");
assert(pkg.scripts?.["validate:all"]?.includes("validate:v18"),"validate:all does not include v1.8");

const required=[
  "components/OwnershipCostCalculator.tsx","components/RiderFitCalculator.tsx","components/FuelRangeCalculator.tsx",
  "components/SaveToShortlistButton.tsx","components/ShortlistClient.tsx","components/ShortlistNav.tsx",
  "components/ThreeWayCompareTable.tsx","components/ThreeWayHighlights.tsx","components/SimilarMotorcycles.tsx",
  "components/LifecycleCard.tsx","components/ModelUpdateLog.tsx","components/Analytics.tsx",
  "lib/maintenance.ts","lib/safety.ts","lib/efficiency.ts","lib/lifecycle.ts","lib/similar.ts","lib/modelUpdates.ts","lib/dataHealth.ts","lib/searchQuery.ts","lib/track.ts",
  "app/shortlist/page.tsx","app/compare/three/page.tsx","app/ownership/maintenance/page.tsx","app/ownership/safety-campaigns/page.tsx",
  "app/motorcycles/[make]/[slug]/maintenance/page.tsx","app/motorcycles/[make]/[slug]/fuel-economy/page.tsx","app/motorcycles/[make]/[slug]/rider-fit/page.tsx","app/motorcycles/[make]/[slug]/safety/page.tsx",
  "FEATURE_SOURCES_V18.md","V18_BUILD_SUMMARY.md"
];
for(const f of required) assert(exists(f),`missing ${f}`);

// User explicitly excluded price history.
const appFiles=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name).split(path.sep).join("/");if(e.isDirectory())walk(p);else if(/\.(ts|tsx)$/.test(e.name))appFiles.push(p)}}
walk(path.join(root,"app"));walk(path.join(root,"components"));walk(path.join(root,"lib"));
const joined=appFiles.map(f=>fs.readFileSync(f,"utf8")).join("\n");
assert(!/\/price-history\b|PriceHistoryChart|historical price chart/i.test(joined),"price-history feature was added even though v1.8 explicitly excludes it");

const types=read("lib/types.ts");
for(const status of ["current","previous","discontinued","uncertain"]) assert(types.includes(`\"${status}\"`),`lifecycle status missing: ${status}`);
const data=read("lib/data.ts");
const blocks=data.split(/\n  \{/).slice(1).filter(b=>/id: \"/.test(b));
const verified=blocks.filter(b=>b.includes('freshness: "verified"'));
for(const block of verified){const id=block.match(/id: "([^"]+)"/)?.[1]||"unknown";assert(/marketStatus: "(?:current|previous|discontinued|uncertain)"/.test(block),`${id} lacks explicit lifecycle status`);}

const ownership=read("components/OwnershipCostCalculator.tsx");
for(const token of ["1-year + 3-year","monthlyPayment","APR assumption","3-year resale estimate","threeYearNet","observedMarketRange"]) assert(ownership.includes(token),`ownership planner missing ${token}`);
const fit=read("components/RiderFitCalculator.tsx")+read("components/MotorcycleFinder.tsx");
for(const token of ["inseam","passenger","traffic","highway","luggage"]) assert(fit.includes(token),`rider-fit feature missing ${token}`);
const fuel=read("components/FuelRangeCalculator.tsx")+read("lib/efficiency.ts");
for(const token of ["theoreticalRangeKm","planningRangeKm","fuelCostForDistance","planning-estimate"]) assert(fuel.includes(token),`fuel/range feature missing ${token}`);

const shortlist=read("components/ShortlistClient.tsx")+read("components/SaveToShortlistButton.tsx")+read("app/shortlist/page.tsx");
for(const token of ["localStorage","motoindex-shortlist-v1","Copy share link","/shortlist?bikes=","/compare/three?bikes="]) assert(shortlist.includes(token),`shortlist feature missing ${token}`);
const compare=read("components/CompareBuilder.tsx")+read("app/compare/three/page.tsx")+read("components/ThreeWayCompareTable.tsx");
for(const token of ["Motorcycle C (optional)","Compare three","compare/three?bikes","ThreeWayCompareTable"]) assert(compare.includes(token),`three-way comparison missing ${token}`);

const search=read("lib/searchQuery.ts")+read("components/SearchClient.tsx");
for(const token of ["under","cc","Automatic","lowSeat","fuelEfficient","zero_results"]) assert(search.includes(token),`structured search missing ${token}`);
const similar=read("lib/similar.ts")+read("components/SimilarMotorcycles.tsx");
for(const token of ["similar","cheaper","lowerSeat","observedMarketRange"]) assert(similar.includes(token),`similar-motorcycle layer missing ${token}`);
const updates=read("lib/modelUpdates.ts")+read("components/ModelUpdateLog.tsx");
for(const token of ["Specifications","Market price checked","Image","Safety campaign"]) assert(updates.includes(token),`update log missing ${token}`);

const maintenance=read("lib/maintenance.ts");
for(const token of ["Honda Philippines Maintenance Planner","Yamaha Philippines After Sales","Suzuki Philippines After Sales","Kawasaki Philippines Service Network","honda-pcx-160","Every 2 years","Every 3 years"]) assert(maintenance.includes(token),`maintenance layer missing ${token}`);
const maintenanceRoute=read("app/motorcycles/[make]/[slug]/maintenance/page.tsx");
const canonicalEntity=exists("components/MotorcycleEntityPage.tsx")?read("components/MotorcycleEntityPage.tsx"):"";
assert(maintenanceRoute.includes("permanentRedirect")&&maintenanceRoute.includes("#maintenance"),"legacy model maintenance route must permanently redirect to the canonical maintenance section");
assert(/generic (?:oil|service|maintenance)[\s\S]{0,160}(?:wrong|could be wrong|misleading)|(?:wrong|misleading)[\s\S]{0,160}generic/i.test(canonicalEntity),"canonical maintenance fallback does not clearly refuse generic intervals");
const safety=read("lib/safety.ts")+canonicalEntity;
for(const token of ["Honda Philippines Product Update Checker","Suzuki Philippines Service Campaign Checker","Yamaha Philippines After Sales / Service Campaign","Kawasaki Philippines Customer / Service Network"]) assert(safety.includes(token),`safety layer missing ${token}`);
assert(/does not prove that no recall|never treated as proof that no campaign applies/i.test(safety),"canonical safety section must not treat an empty notice list as proof of no recall");

const modelRoute=read("app/motorcycles/[make]/[slug]/page.tsx");
const modelPage=modelRoute+(modelRoute.includes("MotorcycleEntityPage")?canonicalEntity:"");
for(const token of ["SaveToShortlistButton","SimilarMotorcycles","ModelUpdateLog","maintenanceForModel","safetyResourceForModel",'id="rider-fit"','id="fuel"']) assert(modelPage.includes(token),`canonical model page missing ${token}`);
const tireRoute=read("app/motorcycles/[make]/[slug]/tire-size/page.tsx");
const tire=tireRoute.includes("permanentRedirect")?canonicalEntity:tireRoute;
for(const token of ["tirePressure","maintenanceForModel","topBoxFitments","FitmentSummary"]) assert(tire.includes(token),`canonical tire/accessory integration missing ${token}`);

const analytics=read("components/Analytics.tsx")+read("lib/track.ts")+read("components/MotorcycleFinder.tsx")+read("components/SearchClient.tsx")+read("app/admin/data-health/page.tsx");
for(const token of ["NEXT_PUBLIC_GA_MEASUREMENT_ID","NEXT_PUBLIC_PLAUSIBLE_DOMAIN","finder_zero_results","site_search","shortlist_save","compare_build"]) assert(analytics.includes(token),`analytics instrumentation missing ${token}`);
const health=read("lib/dataHealth.ts")+read("app/admin/data-health/page.tsx");
for(const token of ["missingImages","weakPriceCoverage","missingFuelEconomy","maintenanceCovered","safetyCovered"]) assert(health.includes(token),`data-health dashboard missing ${token}`);

const sitemaps=read("lib/sitemaps.ts");
for(const token of ["/ownership/maintenance","/ownership/safety-campaigns","one canonical entity URL"]) assert(sitemaps.includes(token),`sitemap coverage/canonical strategy missing ${token}`);
for(const oldRoute of ["/fuel-economy`","/rider-fit`","/maintenance`","/safety`"]) assert(!sitemaps.includes(oldRoute),`legacy motorcycle subroute must not be emitted in sitemap: ${oldRoute}`);
assert(!sitemaps.includes("/shortlist"),"shortlist should not be in sitemap");
assert(!sitemaps.includes("/compare/three"),"arbitrary three-way comparison should not be in sitemap");

const css=read("app/globals.css");
for(const cls of [".shortlist-button",".lifecycle-card",".fuel-tool",".rider-fit-tool",".maintenance-table",".similar-grid",".update-list",".analytics-events"]) assert(css.includes(cls),`v1.8 styling missing ${cls}`);

if(failures.length){console.error(`v1.8 validation failed (${failures.length}):`);for(const f of failures)console.error(`- ${f}`);process.exit(1)}
console.log(`v1.8 validation passed: ownership, rider-fit, fuel/range, lifecycle, search, shortlist, three-way comparison, maintenance/safety, alternatives, updates, fitment integration and analytics/data-health are present; legacy demo/marketplace price history remains excluded.`);
