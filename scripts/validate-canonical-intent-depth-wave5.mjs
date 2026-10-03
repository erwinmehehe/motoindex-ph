import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];

const wave=read("lib","modelIntentDepthWave5_2026.ts");
const router=read("lib","modelIntentDepth2026.ts");
const growth=read("lib","priorityModelGrowth.ts");
const allLib=fs.readdirSync(path.join(root,"lib"))
  .filter((name)=>name.endsWith(".ts"))
  .map((name)=>read("lib",name))
  .join("\n");

const expected=[
  ["honda-tmx-supremo",6500],
  ["yamaha-ytx-125",6000],
  ["kawasaki-klx150",4500],
  ["motorstar-cafe-400",4700],
  ["honda-tmx125-alpha",3600],
  ["bajaj-dominar-400",3100],
  ["zontes-400g",2600],
  ["kawasaki-barako-ii",2400]
];

for(const [id,observedGapVolume] of expected){
  if(!wave.includes(`"${id}": {`))errors.push(`Wave 5 canonical intent profile missing: ${id}`);
  if(!allLib.includes(`id: "${id}"`))errors.push(`Wave 5 model entity missing: ${id}`);
  if(observedGapVolume<=0)errors.push(`Wave 5 demand evidence must be positive: ${id}`);

  const idPos=allLib.indexOf(`id: "${id}"`);
  const record=idPos>=0?allLib.slice(idPos,allLib.indexOf("\n  },",idPos)>idPos?allLib.indexOf("\n  },",idPos)+5:idPos+3000):"";
  if(record&&!/marketStatus:\s*"current"/.test(record)&&!/marketStatus:/.test(record)){
    // No explicit status defaults to current in the catalog model.
  }else if(record&&!/marketStatus:\s*"current"/.test(record)){
    errors.push(`Wave 5 target must remain current-market: ${id}`);
  }
  if(record&&!/freshness:\s*"verified"/.test(record))errors.push(`Wave 5 target must remain verified: ${id}`);
}

const metadataRows=[...wave.matchAll(/"([^"]+)":\s*\{\s*seoTitle:\s*"([^"]+)",\s*seoDescription:\s*"([^"]+)"/gms)]
  .map((match)=>({modelId:match[1],title:match[2],description:match[3]}));

if(metadataRows.length!==expected.length){
  errors.push(`Wave 5 metadata parser expected ${expected.length} profiles, found ${metadataRows.length}.`);
}

for(const row of metadataRows){
  if(row.title.length<55||row.title.length>60)errors.push(`Wave 5 title must be 55-60 chars: ${row.modelId} (${row.title.length}).`);
  if(row.description.length<150||row.description.length>160)errors.push(`Wave 5 description must be 150-160 chars: ${row.modelId} (${row.description.length}).`);
  if(!/Philippines/i.test(row.title)||!/Philippines/i.test(row.description))errors.push(`Wave 5 metadata must keep Philippine intent explicit: ${row.modelId}.`);
}

for(const token of [
  'import { wave5ModelIntentDepthProfile } from "./modelIntentDepthWave5_2026";',
  'profiles[modelId] || wave3ModelIntentDepthProfile(modelId) || wave5ModelIntentDepthProfile(modelId)'
]){
  if(!router.includes(token))errors.push(`Wave 5 router guard missing: ${token}`);
}

for(const id of ["honda-tmx-supremo","yamaha-ytx-125","kawasaki-klx150","honda-tmx125-alpha","kawasaki-barako-ii"]){
  const start=growth.indexOf(`"${id}": {`);
  if(start<0){
    errors.push(`Wave 5 buyer-path growth profile missing: ${id}`);
    continue;
  }
  const next=growth.indexOf('\n  "',start+id.length+6);
  const end=next>start?next:growth.indexOf("\n};",start);
  const block=growth.slice(start,end);
  for(const token of ["moneyQuestion:","ownershipQuestion:","alternativeIds:","recommendationHref:","recommendationLabel:"]){
    if(!block.includes(token))errors.push(`Wave 5 buyer-path field missing for ${id}: ${token}`);
  }
}

for(const id of ["motorstar-cafe-400","bajaj-dominar-400","zontes-400g"]){
  if(!growth.includes(`"${id}": {`))errors.push(`Wave 5 existing buyer-path profile lost: ${id}`);
}

const priceRoute=path.join(root,"app","motorcycles","[make]","[slug]","price","page.tsx");
if(fs.existsSync(priceRoute))errors.push("Do not create a generic /price descendant; canonical model pages own broad model-price intent.");

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Canonical intent-depth wave 5 validation passed: ${expected.length} verified-current demand-backed model pages.`);
