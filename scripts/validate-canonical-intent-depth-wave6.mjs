import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];

const wave=read("lib","modelIntentDepthWave6_2026.ts");
const router=read("lib","modelIntentDepth2026.ts");
const growth=read("lib","priorityModelGrowth.ts");
const allLib=fs.readdirSync(path.join(root,"lib"))
  .filter((name)=>name.endsWith(".ts"))
  .map((name)=>read("lib",name))
  .join("\n");

const expected=[
  ["suzuki-smash-carb",5100],
  ["suzuki-smash-fi",2000],
  ["suzuki-gixxer-sf-155",1900],
  ["suzuki-hayabusa",4000],
  ["kymco-krv-180",3900],
  ["kymco-xciting-vs-400",2800],
  ["kawasaki-ninja-zx-10r",3100],
  ["kawasaki-z900-se",1800]
];

for(const [id,observedGapVolume] of expected){
  if(!wave.includes(`"${id}": {`))errors.push(`Wave 6 canonical intent profile missing: ${id}`);
  if(!allLib.includes(`id: "${id}"`))errors.push(`Wave 6 model entity missing: ${id}`);
  if(observedGapVolume<=0)errors.push(`Wave 6 demand evidence must be positive: ${id}`);

  const idPos=allLib.indexOf(`id: "${id}"`);
  const end=idPos>=0?allLib.indexOf("\n  },",idPos):-1;
  const record=idPos>=0?allLib.slice(idPos,end>idPos?end+5:idPos+3500):"";
  if(record&&!/marketStatus:\s*"current"/.test(record))errors.push(`Wave 6 target must remain current-market: ${id}`);
  if(record&&!/freshness:\s*"verified"/.test(record))errors.push(`Wave 6 target must remain verified: ${id}`);
}

const metadataRows=[...wave.matchAll(/"([^"]+)":\s*\{\s*seoTitle:\s*"([^"]+)",\s*seoDescription:\s*"([^"]+)"/gms)]
  .map((match)=>({modelId:match[1],title:match[2],description:match[3]}));

if(metadataRows.length!==expected.length){
  errors.push(`Wave 6 metadata parser expected ${expected.length} profiles, found ${metadataRows.length}.`);
}

for(const row of metadataRows){
  if(row.title.length<55||row.title.length>60)errors.push(`Wave 6 title must be 55-60 chars: ${row.modelId} (${row.title.length}).`);
  if(row.description.length<150||row.description.length>160)errors.push(`Wave 6 description must be 150-160 chars: ${row.modelId} (${row.description.length}).`);
  if(!/Philippines/i.test(row.title)||!/Philippines/i.test(row.description))errors.push(`Wave 6 metadata must keep Philippine intent explicit: ${row.modelId}.`);
}

for(const token of [
  'import { wave6ModelIntentDepthProfile } from "./modelIntentDepthWave6_2026";',
  'wave6ModelIntentDepthProfile(modelId)'
]){
  if(!router.includes(token))errors.push(`Wave 6 router guard missing: ${token}`);
}

for(const [id] of expected){
  const start=growth.indexOf(`"${id}": {`);
  if(start<0){
    errors.push(`Wave 6 buyer-path growth profile missing: ${id}`);
    continue;
  }
  const next=growth.indexOf('\n  "',start+id.length+6);
  const end=next>start?next:growth.indexOf("\n};",start);
  const block=growth.slice(start,end);
  for(const token of ["moneyQuestion:","ownershipQuestion:","alternativeIds:","recommendationHref:","recommendationLabel:"]){
    if(!block.includes(token))errors.push(`Wave 6 buyer-path field missing for ${id}: ${token}`);
  }
}

for(const target of [
  "/recommendations/best-underbone-motorcycles-philippines",
  "/recommendations/sport-motorcycles-philippines",
  "/recommendations/motorcycles-1000cc-plus-philippines",
  "/recommendations/best-scooters-philippines",
  "/recommendations/maxi-scooters-philippines",
  "/recommendations/naked-motorcycles-philippines"
]){
  if(!growth.includes(`recommendationHref: "${target}"`))errors.push(`Wave 6 cluster target missing: ${target}`);
}

const priceRoute=path.join(root,"app","motorcycles","[make]","[slug]","price","page.tsx");
if(fs.existsSync(priceRoute))errors.push("Do not create a generic /price descendant; canonical model pages own broad model-price intent.");

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Canonical intent-depth wave 6 validation passed: ${expected.length} verified-current Suzuki, scooter and big-bike model pages.`);
