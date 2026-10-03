import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];

const wave=read("lib","modelIntentDepthWave8_2026.ts");
const router=read("lib","modelIntentDepth2026.ts");
const growth=read("lib","priorityModelGrowth.ts");
const allLib=fs.readdirSync(path.join(root,"lib"))
  .filter((name)=>name.endsWith(".ts"))
  .map((name)=>read("lib",name))
  .join("\n");

const expected=[
  ["ducati-panigale-v4",5100],
  ["yamaha-mio-gear",4800],
  ["honda-wave-rsx",2500],
  ["bristol-adx-160",2400],
  ["ktm-390-duke",2600],
  ["honda-gold-wing",2200],
  ["motorstar-xplorer-250r",2300],
  ["keeway-cafe-racer-152",1900]
];

for(const [id,observedGapVolume] of expected){
  if(!wave.includes(`"${id}": {`))errors.push(`Wave 8 canonical intent profile missing: ${id}`);
  if(!allLib.includes(`id: "${id}"`))errors.push(`Wave 8 model entity missing: ${id}`);
  if(observedGapVolume<=0)errors.push(`Wave 8 demand evidence must be positive: ${id}`);

  const idPos=allLib.indexOf(`id: "${id}"`);
  const end=idPos>=0?allLib.indexOf("\n  },",idPos):-1;
  const record=idPos>=0?allLib.slice(idPos,end>idPos?end+5:idPos+4000):"";
  if(record&&!/marketStatus:\s*"current"/.test(record))errors.push(`Wave 8 target must remain current-market: ${id}`);
  if(record&&!/freshness:\s*"verified"/.test(record))errors.push(`Wave 8 target must remain verified: ${id}`);
}

const metadataRows=[...wave.matchAll(/"([^"]+)":\s*\{\s*seoTitle:\s*"([^"]+)",\s*seoDescription:\s*"([^"]+)"/gms)]
  .map((match)=>({modelId:match[1],title:match[2],description:match[3]}));

if(metadataRows.length!==expected.length){
  errors.push(`Wave 8 metadata parser expected ${expected.length} profiles, found ${metadataRows.length}.`);
}

for(const row of metadataRows){
  if(row.title.length<55||row.title.length>60)errors.push(`Wave 8 title must be 55-60 chars: ${row.modelId} (${row.title.length}).`);
  if(row.description.length<150||row.description.length>160)errors.push(`Wave 8 description must be 150-160 chars: ${row.modelId} (${row.description.length}).`);
  if(!/Philippines/i.test(row.title)||!/Philippines/i.test(row.description))errors.push(`Wave 8 metadata must keep Philippine intent explicit: ${row.modelId}.`);
}

for(const token of [
  'import { wave8ModelIntentDepthProfile } from "./modelIntentDepthWave8_2026";',
  'wave8ModelIntentDepthProfile(modelId)'
]){
  if(!router.includes(token))errors.push(`Wave 8 router guard missing: ${token}`);
}

for(const id of ["ducati-panigale-v4","honda-wave-rsx","bristol-adx-160","ktm-390-duke","motorstar-xplorer-250r","keeway-cafe-racer-152"]){
  const start=growth.indexOf(`"${id}": {`);
  if(start<0){
    errors.push(`Wave 8 buyer-path growth profile missing: ${id}`);
    continue;
  }
  const next=growth.indexOf('\n  "',start+id.length+6);
  const end=next>start?next:growth.indexOf("\n};",start);
  const block=growth.slice(start,end);
  for(const token of ["moneyQuestion:","ownershipQuestion:","alternativeIds:","recommendationHref:","recommendationLabel:"]){
    if(!block.includes(token))errors.push(`Wave 8 buyer-path field missing for ${id}: ${token}`);
  }
}

for(const id of ["yamaha-mio-gear","honda-gold-wing"]){
  if(!growth.includes(`"${id}": {`))errors.push(`Wave 8 existing buyer-path profile lost: ${id}`);
}

for(const target of [
  "/recommendations/sport-motorcycles-philippines",
  "/recommendations/best-underbone-motorcycles-philippines",
  "/recommendations/160cc-scooters-philippines",
  "/recommendations/naked-motorcycles-philippines",
  "/recommendations/motorcycles-under-400cc-philippines",
  "/recommendations/cafe-racer-motorcycles-philippines"
]){
  if(!growth.includes(`recommendationHref: "${target}"`))errors.push(`Wave 8 expected cluster target missing: ${target}`);
}

const priceRoute=path.join(root,"app","motorcycles","[make]","[slug]","price","page.tsx");
if(fs.existsSync(priceRoute))errors.push("Do not create a generic /price descendant; canonical model pages own broad model-price intent.");

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Canonical intent-depth wave 8 validation passed: ${expected.length} verified-current demand-backed model pages.`);
