import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];
const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

const data=read("lib","data.ts");
const sitemap=read("lib","sitemaps.ts");
const llms=read("lib","llms.ts");
const growth=read("lib","priorityModelGrowth.ts");
const brief=read("components","GrowthModelBrief.tsx");
const route=read("app","motorcycles","[make]","[slug]","page.tsx");
const robots=read("app","robots.ts");
const wave1=read("lib","zigwheelsGapExpansion2026.ts");
const wave2=read("lib","zigwheelsGapWave2_2026.ts");
const wave3=read("lib","zigwheelsGapWave3_2026.ts");
const wave6=read("lib","zigwheelsGapWave6_2026.ts");
const wave7=read("lib","zigwheelsGapWave7_2026.ts");

const expected=[
  {id:"yamaha-mio-sporty",source:wave1,volume:17000},
  {id:"suzuki-gsx-r150",source:wave2,volume:10440},
  {id:"yamaha-xtz-125",source:wave2,volume:9580},
  {id:"honda-crf150l",source:data,volume:9100},
  {id:"suzuki-gsx-s150",source:wave2,volume:8640},
  {id:"tvs-ntorq-125",source:wave6,volume:7120},
  {id:"benelli-motobi-200-evo",source:wave3,volume:6790},
  {id:"yamaha-mt-15",source:wave7,volume:1800},
  {id:"honda-cbr500r",source:wave1,volume:1300},
  {id:"yamaha-sr400",source:wave7,volume:900},
];

for(const row of expected){
  requireText(row.source,`id: "${row.id}"`,`Demand-backed source record missing: ${row.id}`);
  requireText(row.source,`searchVolume: ${row.volume}`,`Stored search volume changed/missing for ${row.id}`);
  requireText(row.source,'marketStatus: "uncertain"',`Demand-backed model must preserve uncertain availability status: ${row.id}`);
  requireText(growth,`"${row.id}": {`,`Demand-backed growth profile missing: ${row.id}`);
  requireText(brief,`"${row.id}": {`,`Demand-backed buyer brief missing: ${row.id}`);
}

for(const token of [
  'export function isDemandBackedAvailabilityModel(model: Motorcycle)',
  'model.marketStatus === "uncertain"',
  '&& model.searchVolume > 0',
  'model.freshness === "verified"',
  'export const indexableMotorcycles = motorcycles.filter(isIndexableModel);',
  'export const publicMotorcycles = currentMotorcycles.filter(isIndexableModel);'
]){
  requireText(data,token,`Demand-backed indexation architecture missing: ${token}`);
}
requireText(data,'model.marketStatus !== "uncertain"',"Current public catalog must continue excluding uncertain models.");

for(const token of [
  'motorcycles.filter(isIndexableModel)',
  'isDemandBackedAvailabilityModel',
  'm.searchVolume>=5000?.84:.8',
  'changeFrequency:m.marketStatus==="previous"||m.marketStatus==="uncertain"?"monthly"'
]){
  requireText(sitemap,token,`Motorcycle sitemap demand-backed logic missing: ${token}`);
}
requireText(robots,'/sitemaps/motorcycles.xml',"robots.txt must advertise the motorcycle sitemap.");

for(const token of [
  'indexableMotorcycles',
  'Availability-to-verify motorcycle research pages',
  'availability-to-verify research even when current Philippine national-catalog status is uncertain',
  'Original research',
  'Motorcycle price index',
  'Price index CSV',
  'An indexed MotoIndex model page is not automatically a claim that the motorcycle is in the current Philippine national catalog.'
]){
  requireText(llms,token,`LLM discovery coverage missing: ${token}`);
}

for(const token of [
  'indexed for demand-backed research, not presented as confirmed current inventory',
  'indexed as an availability-to-verify research reference because the model has stored search demand and dated evidence'
]){
  requireText(wave7+growth,token,`MT-15 demand-backed truth copy missing: ${token}`);
}

const metadata=[
  ["yamaha-mio-sporty","Yamaha Mio Sporty Price Philippines | Dealer Stock & Specs","Yamaha Mio Sporty price Philippines reference with ₱73,900 dealer listings, 114cc specs, 745mm seat and availability-to-verify guidance for PH buyers."],
  ["suzuki-gsx-r150","Suzuki GSX-R150 Price Philippines | Dealer Stock & Specs","Suzuki GSX-R150 price Philippines reference with ₱156,224 dealer listing, 147cc specs, 785mm seat, six-speed gearbox and current stock verification guidance."],
  ["yamaha-xtz-125","Yamaha XTZ 125 Price Philippines | Dealer Stock & Trail Use","Yamaha XTZ 125 price Philippines reference with ₱89,900 dealer listing, 124cc specs, 840mm seat, 21/18 wheels, 260mm clearance and stock-check guidance."],
  ["suzuki-gsx-s150","Suzuki GSX-S150 Price Philippines | Dealer Stock & Specs","Suzuki GSX-S150 price Philippines reference with ₱112,800–₱124,800 dealer figures, 147cc specs, 785mm seat and exact branch-quote verification guidance."],
  ["tvs-ntorq-125","TVS NTORQ 125 Price Philippines | Dealer Stock & Specs PH","TVS NTORQ 125 price Philippines reference with ₱71,900 retailer listing, 125cc specs, 770mm seat, 12-inch wheels and current availability verification guidance."],
  ["benelli-motobi-200-evo","Benelli Motobi 200 Price Philippines | Specs & Availability","Benelli Motobi 200 Evo Philippines reference with ₱125,000 secondary pricing, 197cc specs, 715mm seat and current new-bike availability verification guidance."],
  ["honda-cbr500r","Honda CBR500R Price Philippines | Dealer Stock & 471cc Specs","Honda CBR500R Philippines reference with ₱364,000 launch price, current dealer evidence, 471cc specs, 789mm seat and national-catalog availability caveat."],
  ["yamaha-sr400","Yamaha SR400 Price Philippines | 2019 Specs & Availability","Yamaha SR400 Philippines reference with ₱329,000 secondary pricing, 399cc specs, 785mm seat and 2019-generation context; verify any current new-unit stock."],
];
for(const [id,title,description] of metadata){
  requireText(growth,`seoTitle: "${title}"`,`Demand-backed title missing: ${id}`);
  requireText(growth,`seoDescription: "${description}"`,`Demand-backed description missing: ${id}`);
  if(title.length<55||title.length>60)errors.push(`${id} title must be 55-60 chars; found ${title.length}.`);
  if(description.length<150||description.length>160)errors.push(`${id} description must be 150-160 chars; found ${description.length}.`);
}

const airBladeStart=data.indexOf('id: "honda-airblade-160"');
const airBladeEnd=data.indexOf("\n  {",airBladeStart+10);
const airBladeBlock=airBladeStart>=0?data.slice(airBladeStart,airBladeEnd>airBladeStart?airBladeEnd:undefined):"";
if(!airBladeBlock.includes('marketStatus: "uncertain"')||!airBladeBlock.includes("searchVolume: 0")){
  errors.push("AirBlade160 zero-demand uncertain control record changed; demand gate needs a non-indexable zero-volume control.");
}

requireText(route,'index: isIndexableModel(model)',"Model metadata must use shared indexability policy.");

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Demand-backed availability validation passed: ${expected.length} uncertain model pages are search-demand eligible with sitemap and LLM discovery guards.`);
