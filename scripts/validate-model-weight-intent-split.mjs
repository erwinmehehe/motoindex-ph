import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];
const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

const profiles=read("lib","modelWeightLandingPages.ts");
const route=read("app","motorcycles","[make]","[slug]","weight","page.tsx");
const modelPage=read("components","MotorcycleEntityPage.tsx");
const sitemap=read("lib","sitemaps.ts");
const llms=read("lib","llms.ts");
const allLib=fs.readdirSync(path.join(root,"lib"))
  .filter((name)=>name.endsWith(".ts"))
  .map((name)=>read("lib",name))
  .join("\n");

const expected=[
  ["royal-enfield-shotgun-650","shotgun 650 weight",7700,"Royal Enfield Shotgun 650 Weight Philippines | 240 kg Guide","Royal Enfield Shotgun 650 weight Philippines guide with 240 kg curb weight, seat-height context, power-to-weight math, category comparison and source caveats.",240],
  ["royal-enfield-continental-gt-650","weight of gt 650",3900,"Royal Enfield Continental GT 650 Weight Philippines | 214 kg","Royal Enfield Continental GT 650 weight Philippines guide with 214 kg curb weight, seat-height context, power-to-weight math, category comparison and caveats.",214]
];

for(const [id,keyword,volume,title,description,weight] of expected){
  requireText(profiles,`modelId: "${id}"`,`Weight profile missing: ${id}`);
  requireText(profiles,`keyword: "${keyword}"`,`Weight keyword missing: ${id}`);
  requireText(profiles,`keywordVolume: ${volume}`,`Weight keyword volume missing: ${id}`);
  requireText(profiles,`title: "${title}"`,`Weight title missing: ${id}`);
  requireText(profiles,`description: "${description}"`,`Weight description missing: ${id}`);
  if(volume<=0)errors.push(`${id} weight page requires positive stored search volume.`);
  if(title.length<55||title.length>60)errors.push(`${id} weight title must be 55-60 chars; found ${title.length}.`);
  if(description.length<150||description.length>160)errors.push(`${id} weight description must be 150-160 chars; found ${description.length}.`);

  const start=allLib.indexOf(`id: "${id}"`);
  const end=start>=0?allLib.indexOf("\n  {",start+10):-1;
  const block=start>=0?allLib.slice(start,end>start?end:undefined):"";
  if(!block)errors.push(`Weight page model record missing: ${id}`);
  if(!block.includes(`curbWeightKg: ${weight}`))errors.push(`${id} stored curb weight must remain ${weight} kg.`);
  if(!/sourceUrl:\s*"https:\/\//.test(block))errors.push(`${id} weight page needs a model source URL.`);
}

for(const token of [
  "generateStaticParams()",
  "weightIntentLandingProfiles",
  "isIndexableModel(model)",
  "powerToWeight",
  "peerMedianWeight",
  "600–700cc",
  "Curb weight is more useful",
  "Do not infer payload capacity",
  "FAQPage",
  '/motorcycles/${model.makeSlug}/${model.slug}/weight'
]){
  requireText(route,token,`Weight route depth missing: ${token}`);
}

for(const token of [
  'import { weightIntentLandingProfile } from "@/lib/modelWeightLandingPages";',
  "const weightLanding = weightIntentLandingProfile(model.id);",
  '/motorcycles/${model.makeSlug}/${model.slug}/weight',
  "Dedicated weight context"
]){
  requireText(modelPage,token,`Main model weight handoff missing: ${token}`);
}

requireText(sitemap,'weightIntentLandingProfiles.flatMap',"Motorcycle sitemap must enumerate weight pages.");
requireText(sitemap,'/weight',"Motorcycle sitemap must expose weight URLs.");
requireText(sitemap,'profile.keywordVolume>=5000?.9:.88',"Weight sitemap priority must use stored search demand.");

requireText(llms,'Focused model weight guides',"LLM full index must expose focused weight pages.");
requireText(llms,'For models with a dedicated weight page',"LLM retrieval guidance must route weight queries to focused pages.");
requireText(llms,'/specs and /weight pages are canonical resources',"LLM canonical policy must name weight pages.");
requireText(llms,'Curb weight is not payload capacity',"LLM weight guidance must preserve the payload caveat.");

for(const slug of ["price","variants"]){
  const candidate=path.join(root,"app","motorcycles","[make]","[slug]",slug,"page.tsx");
  if(fs.existsSync(candidate))errors.push(`Do not mass-split unsupported model intent pages yet: /${slug}`);
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Model weight intent validation passed: ${expected.length} high-volume weight pages with curb-weight and context guards.`);
