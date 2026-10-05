import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];

const data=read("lib","data.ts");
const wave7=read("lib","zigwheelsGapWave7_2026.ts");
const currentCloseout=read("lib","currentModelGapCloseout2026.ts");
const growth=read("lib","priorityModelGrowth.ts");
const growthBrief=read("components","GrowthModelBrief.tsx");
const page=read("app","motorcycles","[make]","[slug]","page.tsx");
const sitemap=read("lib","sitemaps.ts");

const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

requireText(data,'export function isDemandBackedAvailabilityModel(model: Motorcycle)',"Demand-backed availability helper must exist.");
requireText(data,'&& model.searchVolume > 0',"Demand-backed availability pages require stored search demand.");
requireText(data,'const demandBackedAvailability = isDemandBackedAvailabilityModel(model);',"Indexability must use the demand-backed availability helper.");
requireText(data,'export const currentMotorcycles = motorcycles.filter((m) => m.marketStatus !== "previous" && m.marketStatus !== "uncertain" && m.marketStatus !== "discontinued");',"Uncertain-market models must stay out of current discovery.");
requireText(sitemap,'const indexableModels = motorcycles.filter(isIndexableModel);',"Motorcycle sitemap must use the shared indexability gate.");

for(const token of [
  'id: "yamaha-mt-15"',
  'slug: "mt-15"',
  'marketStatus: "current"',
  'srp: 180000',
  'sourceUrl: "https://www.guanzongroup.com.ph/product/mt-15/"'
]){
  requireText(currentCloseout,token,`MT-15 current dealer truth guard missing: ${token}`);
}

for(const token of [
  'seoTitle: "Honda CRF300 Rally Price Philippines 2026 | CRF250 Successor"',
  'seoDescription: "Honda CRF300 Rally price Philippines 2026 with ₱309,900 Honda reference, 286cc specs, 885mm seat, 21/18 wheels and CRF250 Rally successor context for buyers."',
  'heading: "Looking for the Honda CRF250 Rally?"',
  'permanently redirects CRF250 Rally research here',
  'seoTitle: "Yamaha MT-15 Price Philippines 2026 | Specs & Dealer Price"',
  '₱180,000 as a current dealer reference',
  'heading: "Current dealer listing, verify branch stock"'
]){
  requireText(growth,token,`Coverage truth growth profile missing: ${token}`);
}

const metadata=[
  {
    id:"honda-crf300-rally",
    title:"Honda CRF300 Rally Price Philippines 2026 | CRF250 Successor",
    description:"Honda CRF300 Rally price Philippines 2026 with ₱309,900 Honda reference, 286cc specs, 885mm seat, 21/18 wheels and CRF250 Rally successor context for buyers."
  },
  {
    id:"yamaha-mt-15",
    title:"Yamaha MT-15 Price Philippines 2026 | Specs & Dealer Price",
    description:"Yamaha MT-15 price Philippines 2026 with ₱180,000 Guanzon dealer reference, 155cc specs, 810mm seat, 6-speed gearbox and current branch-stock guidance."
  }
];
for(const row of metadata){
  if(row.title.length<55||row.title.length>60)errors.push(`${row.id} title must be 55-60 chars; found ${row.title.length}.`);
  if(row.description.length<150||row.description.length>160)errors.push(`${row.id} description must be 150-160 chars; found ${row.description.length}.`);
}

for(const token of [
  '"honda-crf300-rally": {',
  '"yamaha-mt-15": {',
  'Use the current CRF300 Rally page for CRF250 Rally successor research',
  'Guanzon currently lists ₱180,000, but its pricing notice says figures can vary by branch and change without notice.'
]){
  requireText(growthBrief,token,`Coverage truth buyer brief missing: ${token}`);
}

for(const token of [
  'if (make === "honda" && slug === "crf250-rally")',
  'path: "/motorcycles/honda/crf300-rally"',
  'index: false',
  'if (make === "honda" && slug === "crf250-rally") permanentRedirect("/motorcycles/honda/crf300-rally");',
  'index: isIndexableModel(model)'
]){
  requireText(page,token,`Coverage truth route/metadata guard missing: ${token}`);
}

const allLib=fs.readdirSync(path.join(root,"lib"))
  .filter((name)=>name.endsWith(".ts"))
  .map((name)=>read("lib",name))
  .join("\n");
for(const linkedId of ["honda-crf150l","kawasaki-klx230","cfmoto-450mt","yamaha-xsr155","yamaha-yzf-r15m","honda-cb150r"]){
  if(!allLib.includes(`id: "${linkedId}"`))errors.push(`Coverage truth linked model missing: ${linkedId}`);
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Model coverage truth wave validation passed.");
