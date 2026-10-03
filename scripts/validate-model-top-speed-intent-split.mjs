import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];
const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

const profiles=read("lib","modelTopSpeedLandingPages.ts");
const route=read("app","motorcycles","[make]","[slug]","top-speed","page.tsx");
const modelPage=read("components","MotorcycleEntityPage.tsx");
const buyerAnswers=read("components","CanonicalIntentDepth.tsx");
const sitemap=read("lib","sitemaps.ts");
const llms=read("lib","llms.ts");

const expected=[
  ["kawasaki-ninja-650","ninja 650 top speed",8800,"Kawasaki Ninja 650 Top Speed Philippines | Test Evidence","Kawasaki Ninja 650 top speed guide with independent test evidence, mph/km/h conversion, model-year caveats, gearing context and why real-world speed varies."],
  ["suzuki-hayabusa","hayabusa top speed",4000,"Suzuki Hayabusa Top Speed Philippines | 299 km/h Evidence","Suzuki Hayabusa top speed guide with the 299 km/h electronic limit, independent test evidence, generation context and why real-world maximum speed varies."],
  ["kawasaki-ninja-zx-10r","kawasaki ninja zx-10r top speed",3100,"Kawasaki ZX-10R Top Speed Philippines | Test Evidence Guide","Kawasaki Ninja ZX-10R top speed guide with independent test results, 299 km/h context, generation caveats, gearing, limiter notes and test-condition warnings."],
  ["yamaha-yzf-r3","r3 top speed",1800,"Yamaha R3 Top Speed Philippines | 181 km/h Test Evidence","Yamaha YZF-R3 top speed guide with independent testing around 181 km/h, mph conversion, rider/condition caveats, gearing context and stock-bike evidence."],
  ["honda-cbr500r","cbr500r top speed",1800,"Honda CBR500R Top Speed Philippines | 180 km/h Evidence","Honda CBR500R top speed guide with independent testing around 180 km/h, mph conversion, model-year context, stock-bike caveats and performance evidence."],
  ["royal-enfield-shotgun-650","shotgun 650 top speed",1700,"Royal Enfield Shotgun 650 Top Speed Philippines | Evidence","Royal Enfield Shotgun 650 top speed guide with an indicated 160 km/h road-test result, official-spec context, rider-condition caveats and evidence notes."],
  ["kawasaki-z1000-r-edition","z1000 top speed",900,"Kawasaki Z1000 Top Speed Philippines | 237 km/h Evidence","Kawasaki Z1000 top speed guide with a 237 km/h Cycle World test result, mph conversion, model-generation context, gearing notes and stock-bike caveats."],
  ["ktm-790-duke","duke 790 top speed",900,"KTM 790 Duke Top Speed Philippines | 225 km/h Test Evidence","KTM 790 Duke top speed guide with an independent test around 225 km/h, mph conversion, model-generation context, gearing notes and test-condition caveats."],
  ["aprilia-rs-660","rs660 top speed",700,"Aprilia RS 660 Top Speed Philippines | 240 km/h Evidence","Aprilia RS 660 top speed guide with independent evidence around 240 km/h, mph conversion, model-year context, limiter caveats and real-world test notes."],
  ["yamaha-yzf-r7","yamaha r7 top speed",700,"Yamaha R7 Top Speed Philippines | 224 km/h Test Evidence","Yamaha YZF-R7 top speed guide with independent testing around 224 km/h, mph conversion, rider/tuck caveats, gearing context and real-world performance notes."]
];

for(const [id,keyword,volume,title,description] of expected){
  requireText(profiles,`modelId: "${id}"`,`Top-speed profile missing: ${id}`);
  requireText(profiles,`keyword: "${keyword}"`,`Top-speed keyword missing: ${id}`);
  requireText(profiles,`keywordVolume: ${volume}`,`Top-speed search volume missing: ${id}`);
  requireText(profiles,`title: "${title}"`,`Top-speed title missing: ${id}`);
  requireText(profiles,`description: "${description}"`,`Top-speed description missing: ${id}`);
  if(volume<=0)errors.push(`${id} top-speed page requires positive stored search volume.`);
  if(title.length<55||title.length>60)errors.push(`${id} top-speed title must be 55-60 chars; found ${title.length}.`);
  if(description.length<150||description.length>160)errors.push(`${id} top-speed description must be 150-160 chars; found ${description.length}.`);
}

for(const token of [
  "generateStaticParams()",
  "topSpeedLandingProfiles",
  "isIndexableModel(model)",
  "observedTopSpeedKph",
  "What changes a motorcycle top-speed result?",
  "GPS vs speedometer",
  "Match a top-speed claim to the exact model year",
  "Should top speed be tested on public roads?",
  "FAQPage",
  '/motorcycles/${model.makeSlug}/${model.slug}/top-speed'
]){
  requireText(route,token,`Top-speed route depth missing: ${token}`);
}

for(const token of [
  'import { topSpeedLandingProfile } from "@/lib/modelTopSpeedLandingPages";',
  "const topSpeedLanding = topSpeedLandingProfile(model.id);",
  '/motorcycles/${model.makeSlug}/${model.slug}/top-speed',
  "Dedicated performance evidence",
  "!topSpeedLanding && performance"
]){
  requireText(modelPage,token,`Main model top-speed handoff missing: ${token}`);
}

requireText(buyerAnswers,'hasTopSpeedLandingPage(model.id)',"Buyer-answer cards must exclude split top-speed intent.");
requireText(sitemap,'topSpeedLandingProfiles.flatMap',"Motorcycle sitemap must enumerate top-speed intent pages.");
requireText(sitemap,'/top-speed',"Motorcycle sitemap must expose top-speed URLs.");
requireText(sitemap,'profile.keywordVolume>=1000?.89:.85',"Top-speed sitemap priority must use stored search demand.");
requireText(llms,'Focused model top-speed guides',"LLM full index must expose focused top-speed pages.");
requireText(llms,'For models with a dedicated top-speed page',"LLM retrieval guidance must route top-speed queries to focused pages.");
requireText(llms,'/colors and /top-speed pages are canonical resources',"LLM canonical policy must name top-speed pages.");

for(const slug of ["price","specs","variants"]){
  const candidate=path.join(root,"app","motorcycles","[make]","[slug]",slug,"page.tsx");
  if(fs.existsSync(candidate))errors.push(`Do not mass-split unsupported model intent pages yet: /${slug}`);
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Model top-speed intent validation passed: ${expected.length} search-volume-backed pages with evidence and generation caveats.`);
