import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];

const wave=read("lib","modelIntentDepthWave4_2026.ts");
const router=read("lib","modelIntentDepth2026.ts");
const component=read("components","CanonicalIntentDepth.tsx");
const growth=read("lib","priorityModelGrowth.ts");
const allLib=fs.readdirSync(path.join(root,"lib"))
  .filter((name)=>name.endsWith(".ts"))
  .map((name)=>read("lib",name))
  .join("\n");

const expected=[
  ["yamaha-pg-1",14000],
  ["yamaha-lexi-155",9600],
  ["yamaha-yzf-r1m",5300],
  ["suzuki-burgman-street-ex",2500],
  ["yamaha-mio-gravis",2000],
  ["suzuki-avenis",1400],
  ["kawasaki-z500",900],
  ["yamaha-wr155r",1000]
];

for(const [id,observedGapVolume] of expected){
  if(!wave.includes(`"${id}": {`))errors.push(`Wave 4 canonical intent profile missing: ${id}`);
  if(!allLib.includes(`id: "${id}"`))errors.push(`Wave 4 model entity missing: ${id}`);
  if(observedGapVolume<=0)errors.push(`Wave 4 demand evidence must be positive: ${id}`);
}

const metadataRows=[...wave.matchAll(/"([^"]+)":\s*\{\s*seoTitle:\s*"([^"]+)",\s*seoDescription:\s*"([^"]+)"/gms)]
  .map((match)=>({modelId:match[1],title:match[2],description:match[3]}));

if(metadataRows.length!==expected.length){
  errors.push(`Wave 4 metadata parser expected ${expected.length} profiles, found ${metadataRows.length}.`);
}

for(const row of metadataRows){
  if(row.title.length<55||row.title.length>60)errors.push(`Wave 4 title must be 55-60 chars: ${row.modelId} (${row.title.length}).`);
  if(row.description.length<150||row.description.length>160)errors.push(`Wave 4 description must be 150-160 chars: ${row.modelId} (${row.description.length}).`);
  if(!/Philippines/i.test(row.title)||!/Philippines/i.test(row.description))errors.push(`Wave 4 metadata must keep Philippine intent explicit: ${row.modelId}.`);
}

for(const token of [
  'import { wave4ModelIntentDepthProfile } from "./modelIntentDepthWave4_2026";',
  'profiles[modelId] || wave3ModelIntentDepthProfile(modelId) || wave4ModelIntentDepthProfile(modelId)',
  'hasSpecsIntentLandingPage',
  'intent === "specs" && hasSpecsIntentLandingPage(model.id)'
]){
  if(!router.includes(token))errors.push(`Wave 4 router/spec handoff guard missing: ${token}`);
}

for(const token of [
  'hasSpecsIntentLandingPage',
  'intent === "specs" && hasSpecsIntentLandingPage(model.id)'
]){
  if(!component.includes(token))errors.push(`Canonical intent focused-spec handoff missing: ${token}`);
}

for(const id of ["yamaha-pg-1","suzuki-avenis","yamaha-wr155r"]){
  const start=growth.indexOf(`"${id}": {`);
  if(start<0){
    errors.push(`Wave 4 buyer-path growth profile missing: ${id}`);
    continue;
  }
  const next=growth.indexOf('\n  "',start+id.length+6);
  const end=next>start?next:growth.indexOf("\n};",start);
  const block=growth.slice(start,end);
  for(const token of ["moneyQuestion:","ownershipQuestion:","alternativeIds:","recommendationHref:","recommendationLabel:"]){
    if(!block.includes(token))errors.push(`Wave 4 buyer-path field missing for ${id}: ${token}`);
  }
}

for(const id of ["yamaha-lexi-155","yamaha-mio-gravis"]){
  if(!allLib.includes(`modelId: "${id}"`))errors.push(`Wave 4 focused specs profile missing for handoff model: ${id}`);
}

const thinPriceRoute=path.join(root,"app","motorcycles","[make]","[slug]","price","page.tsx");
if(fs.existsSync(thinPriceRoute))errors.push("Do not create a generic /price descendant; canonical model pages own broad model-price intent.");

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Canonical intent-depth wave 4 validation passed: ${expected.length} demand-backed model pages, with focused specs handoff preserved.`);
