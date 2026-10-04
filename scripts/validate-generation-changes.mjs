import fs from "node:fs";

const failures=[];
const required=[
  "lib/generationChanges.ts",
  "components/GenerationChangeTracker.tsx",
  "app/motorcycles/[make]/[slug]/changes/page.tsx",
  "tests/generationChanges.test.ts"
];
for(const path of required)if(!fs.existsSync(path))failures.push("missing "+path);

const changes=fs.readFileSync("lib/generationChanges.ts","utf8");
const pairs=[
  ["yamaha-nmax-v2","yamaha-nmax-v3"],
  ["yamaha-aerox-v2","yamaha-aerox-v3"],
  ["honda-click-150i","honda-click-160"],
  ["honda-adv-150","honda-adv-160"]
];
for(const pair of pairs){
  if(!changes.includes('fromModelId: "'+pair[0]+'"')||!changes.includes('toModelId: "'+pair[1]+'"'))failures.push("missing curated transition "+pair.join(" -> "));
}
for(const token of ["sourceLabel","sourceUrl","upgrade","keepPreviousIf","historical","modelYearUpdates","2022","2026"]){
  if(!changes.includes(token))failures.push("generation change model missing "+token);
}
if(changes.includes("Click V3")||changes.includes("Click V4"))failures.push("tracker must not invent an official Click V-number mapping");
if(!changes.includes("honda-adv-160-2022-2026")||!changes.includes("honda-click-160-2022-2024"))failures.push("within-generation model-year updates missing");

const route=fs.readFileSync("app/motorcycles/[make]/[slug]/changes/page.tsx","utf8");
if(!route.includes("getModelFamily")||!route.includes("GenerationChangeTracker"))failures.push("generation tracker route is not family-driven");
if(!route.includes("Generation & model-year change tracker"))failures.push("route must identify both generation and model-year tracking");
if(!route.includes("Historical launch prices remain historical"))failures.push("generation tracker route must preserve historical-price warning");

const family=fs.readFileSync("components/ModelFamilyView.tsx","utf8");
if(!family.includes('id="change-tracker"')||!family.includes("GenerationChangeTracker"))failures.push("model family pages must surface the change tracker");

const modelPage=fs.readFileSync("app/motorcycles/[make]/[slug]/page.tsx","utf8");
if(!modelPage.includes("getModelFamilyForModel")||!modelPage.includes("change tracker"))failures.push("individual model pages must link into generation history");

const sitemap=fs.readFileSync("lib/sitemaps.ts","utf8");
if(!sitemap.includes("/changes"))failures.push("generation change routes missing from motorcycle sitemap");

if(failures.length){
  console.error("Generation Change Tracker v1 validation failed:\n- "+failures.join("\n- "));
  process.exit(1);
}
console.log("Generation Change Tracker v1 validation passed.");
