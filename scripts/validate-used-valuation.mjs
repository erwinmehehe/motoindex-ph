import fs from "node:fs";

const failures=[];
const required=[
  "lib/usedValuation.ts",
  "app/api/used-valuation/route.ts",
  "components/UsedValuationPanel.tsx",
  "components/UsedValuationTool.tsx",
  "app/tools/used-motorcycle-valuation/page.tsx",
  "tests/usedValuation.test.ts"
];
for(const path of required)if(!fs.existsSync(path))failures.push("missing "+path);

const engine=fs.readFileSync("lib/usedValuation.ts","utf8");
for(const token of ["verified active asking prices","sameRegionComparableCount","dealerTrade","confidence","comparableIds"]){
  if(!engine.includes(token))failures.push("valuation engine missing "+token);
}
if(!engine.includes("regionListings.length>=2"))failures.push("region adjustment must require at least two same-region comparables");
if(!engine.includes("askingPricePhp>=rawMedian*.55")||!engine.includes("askingPricePhp<=rawMedian*1.65"))failures.push("valuation engine must guard extreme listing outliers");

const api=fs.readFileSync("app/api/used-valuation/route.ts","utf8");
if(!api.includes("getVerifiedUsedListings"))failures.push("valuation API must use verified used listings");
if(!api.includes("excludeListingId"))failures.push("valuation API must allow excluding the subject listing");

const resale=fs.readFileSync("components/GarageResalePack.tsx","utf8");
if(!resale.includes("UsedValuationPanel")||!resale.includes("excludeListingId={currentListing?.id}"))failures.push("Garage Resale Pack must use valuation without circular self-comps");

const tools=fs.readFileSync("app/tools/page.tsx","utf8");
if(!tools.includes("/tools/used-motorcycle-valuation"))failures.push("tools hub must link the valuation tool");

if(failures.length){
  console.error("Used motorcycle valuation validation failed:\n- "+failures.join("\n- "));
  process.exit(1);
}
console.log("Used motorcycle valuation v1 validation passed.");
