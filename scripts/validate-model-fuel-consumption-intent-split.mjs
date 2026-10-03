import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];
const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

const profiles=read("lib","modelFuelConsumptionLandingPages.ts");
const route=read("app","motorcycles","[make]","[slug]","fuel-consumption","page.tsx");
const modelPage=read("components","MotorcycleEntityPage.tsx");
const entitySeo=read("lib","motorcycleEntitySeo.ts");
const sitemap=read("lib","sitemaps.ts");
const llms=read("lib","llms.ts");
const data=read("lib","data.ts");
const zig=read("lib","zigwheelsGapExpansion2026.ts");

const expected=[
  ["honda-click-125i","honda click fuel consumption",800,50.3,"Honda Click 125i Fuel Consumption Philippines | 50.3 km/L","Honda Click 125i fuel consumption Philippines guide with listed 50.3 km/L, 5.5L tank range, monthly fuel-cost calculator, source date and real-world caveats."],
  ["honda-adv-160","adv 160 fuel consumption",600,45.0,"Honda ADV160 Fuel Consumption Philippines | 45 km/L Guide","Honda ADV160 fuel consumption Philippines guide with listed 45.0 km/L, 8.1L tank range, monthly fuel-cost calculator, source date and real-world caveats."],
  ["honda-tmx125-alpha","tmx 125 fuel consumption",500,62.5,"Honda TMX125 Alpha Fuel Consumption Philippines | 62.5 km/L","Honda TMX125 Alpha fuel consumption Philippines guide with listed 62.5 km/L, 8.6L tank range, monthly fuel-cost calculator, source date and riding caveats."],
  ["honda-pcx-160","pcx 160 fuel consumption",350,46.0,"Honda PCX160 Fuel Consumption Philippines | 46 km/L Guide","Honda PCX160 fuel consumption Philippines guide with listed 46.0 km/L, 8.1L tank range, monthly fuel-cost calculator, source date and real-world caveats."],
  ["honda-xr150l","xr 150 fuel consumption",90,36.7,"Honda XR150L Fuel Consumption Philippines | 36.7 km/L Guide","Honda XR150L fuel consumption Philippines guide with listed 36.7 km/L, 12L tank range, monthly fuel-cost calculator, source date and real-world riding caveats."]
];

for(const [id,keyword,volume,kmL,title,description] of expected){
  requireText(profiles,`modelId: "${id}"`,`Fuel profile missing: ${id}`);
  requireText(profiles,`keyword: "${keyword}"`,`Fuel keyword missing: ${id}`);
  requireText(profiles,`keywordVolume: ${volume}`,`Fuel search volume missing: ${id}`);
  requireText(profiles,`title: "${title}"`,`Fuel title missing: ${id}`);
  requireText(profiles,`description: "${description}"`,`Fuel description missing: ${id}`);
  if(volume<=0)errors.push(`${id} fuel page requires positive stored search volume.`);
  if(title.length<55||title.length>60)errors.push(`${id} fuel title must be 55-60 chars; found ${title.length}.`);
  if(description.length<150||description.length>160)errors.push(`${id} fuel description must be 150-160 chars; found ${description.length}.`);

  const source=data.includes(`id: "${id}"`)?data:zig;
  const start=source.indexOf(`id: "${id}"`);
  const end=start>=0?source.indexOf("\n  {",start+10):-1;
  const block=start>=0?source.slice(start,end>start?end:undefined):"";
  requireText(block,`fuelConsumptionKmL: ${kmL}`,`Listed fuel economy missing for ${id}`);
}

for(const token of [
  "generateStaticParams()",
  "fuelConsumptionLandingProfiles",
  'efficiency.status !== "listed"',
  "<FuelRangeCalculator",
  "What the ${efficiency.kmPerL} km/L figure means",
  "Fuel needed at 500, 1,000 and 1,500 km per month",
  "The price is a scenario input, not a claim about today's pump price.",
  "What can move real-world fuel consumption?",
  "FAQPage",
  '/motorcycles/${model.makeSlug}/${model.slug}/fuel-consumption'
]){
  requireText(route,token,`Fuel route depth missing: ${token}`);
}

for(const token of [
  'import { fuelConsumptionLandingProfile } from "@/lib/modelFuelConsumptionLandingPages";',
  "const fuelConsumptionLanding = fuelConsumptionLandingProfile(model.id);",
  '/motorcycles/${model.makeSlug}/${model.slug}/fuel-consumption',
  "Dedicated fuel-economy guide"
]){
  requireText(modelPage,token,`Main model fuel handoff missing: ${token}`);
}

requireText(entitySeo,'hasFuelConsumptionLandingPage(model.id)',"Main model FAQ generator must hand fuel intent to focused pages.");
requireText(sitemap,'fuelConsumptionLandingProfiles.flatMap',"Motorcycle sitemap must enumerate fuel-consumption pages.");
requireText(sitemap,'/fuel-consumption',"Motorcycle sitemap must expose fuel-consumption URLs.");
requireText(sitemap,'profile.keywordVolume>=500?.87:.83',"Fuel sitemap priority must use stored search demand.");
requireText(llms,'Focused model fuel-consumption guides',"LLM full index must expose fuel-consumption pages.");
requireText(llms,'For models with a dedicated fuel-consumption page',"LLM retrieval guidance must route fuel queries to focused pages.");
requireText(llms,'/fuel-consumption pages are canonical resources',"LLM canonical policy must name fuel-consumption pages.");

requireText(
  data,
  'sourceLabel: "Honda Philippines TMX125 Alpha 62.5 km/L fuel-efficiency and model reference"',
  "TMX125 Alpha fuel page must use the Honda Philippines efficiency source."
);

for(const slug of ["price","specs","variants"]){
  const candidate=path.join(root,"app","motorcycles","[make]","[slug]",slug,"page.tsx");
  if(fs.existsSync(candidate))errors.push(`Do not mass-split unsupported model intent pages yet: /${slug}`);
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Model fuel-consumption intent validation passed: ${expected.length} search-volume-backed pages with listed model-specific km/L evidence.`);
