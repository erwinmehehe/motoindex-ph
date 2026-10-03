import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];
const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

const profiles=read("lib","modelSpecsLandingPages.ts");
const route=read("app","motorcycles","[make]","[slug]","specs","page.tsx");
const modelPage=read("components","MotorcycleEntityPage.tsx");
const sitemap=read("lib","sitemaps.ts");
const llms=read("lib","llms.ts");
const allLib=fs.readdirSync(path.join(root,"lib"))
  .filter((name)=>name.endsWith(".ts"))
  .map((name)=>read("lib",name))
  .join("\n");

const expected=[
  ["honda-giorno-plus","honda giorno specs",1700,"Honda Giorno+ Specs Philippines 2026 | Engine, Weight & Seat","Honda Giorno+ specs Philippines 2026 with 124.9cc engine, power and torque, weight, seat height, fuel tank, tires, ABS/brakes and current source dates."],
  ["honda-adv-160","adv 160 specs",1300,"Honda ADV160 Specs Philippines 2026 | Engine, Weight & Seat","Honda ADV160 specs Philippines 2026 with 157cc engine, power and torque, curb weight, seat height, fuel tank, ground clearance, tires and ABS details."],
  ["yamaha-sniper-155","sniper 155 specs",1100,"Yamaha Sniper 155 Specs Philippines 2026 | Engine & Weight","Yamaha Sniper 155 specs Philippines 2026 with 155cc engine, power, torque, curb weight, seat height, fuel tank, tires, six-speed transmission and ABS context."],
  ["yamaha-fazzio","fazzio specs",500,"Yamaha Fazzio Specs Philippines 2026 | Engine, Weight & Seat","Yamaha Fazzio specs Philippines 2026 with 125cc engine, power and torque, curb weight, seat height, fuel tank, tire sizes, transmission and source dates."],
  ["yamaha-lexi-155","lexi 155 specs",500,"Yamaha Lexi 155 Specs Philippines 2026 | Engine & Weight","Yamaha Lexi 155 specs Philippines 2026 with 155cc engine, power, torque, curb weight, seat height, fuel tank, tires, transmission and brake/ABS details."],
  ["honda-pcx-160","pcx 160 specs",500,"Honda PCX160 Specs Philippines 2026 | Engine, Weight & Seat","Honda PCX160 specs Philippines 2026 with 157cc engine, power and torque, curb weight, seat height, fuel tank, ground clearance, tires and ABS details."],
  ["yamaha-mio-gravis","mio gravis specs",450,"Yamaha Mio Gravis Specs Philippines 2026 | Engine & Weight","Yamaha Mio Gravis specs Philippines 2026 with 125cc engine, power, torque, curb weight, seat height, fuel tank, tire sizes, transmission and source dates."],
  ["honda-click-160","click 160 specs",400,"Honda Click 160 Specs Philippines 2026 | Engine & Weight","Honda Click 160 specs Philippines 2026 with 157cc engine, power and torque, curb weight, seat height, fuel tank, tire sizes, transmission and brake details."],
  ["suzuki-raider-r150","raider 150 fi specs",400,"Suzuki Raider R150 Specs Philippines 2026 | Engine & Weight","Suzuki Raider R150 specs Philippines 2026 with 147cc engine, power, torque, curb weight, seat height, fuel tank, tire sizes, six-speed transmission and ABS."],
  ["honda-beat","honda beat specs",400,"Honda BeAT Specs Philippines 2026 | Engine, Weight & Seat","Honda BeAT specs Philippines 2026 with 110cc engine, power and torque, curb weight, seat height, fuel tank, tire sizes, transmission and brake details."]
];

for(const [id,keyword,volume,title,description] of expected){
  requireText(profiles,`modelId: "${id}"`,`Specs profile missing: ${id}`);
  requireText(profiles,`keyword: "${keyword}"`,`Specs keyword missing: ${id}`);
  requireText(profiles,`keywordVolume: ${volume}`,`Specs keyword volume missing: ${id}`);
  requireText(profiles,`title: "${title}"`,`Specs title missing: ${id}`);
  requireText(profiles,`description: "${description}"`,`Specs description missing: ${id}`);
  if(volume<=0)errors.push(`${id} specs page requires positive stored search volume.`);
  if(title.length<55||title.length>60)errors.push(`${id} specs title must be 55-60 chars; found ${title.length}.`);
  if(description.length<150||description.length>160)errors.push(`${id} specs description must be 150-160 chars; found ${description.length}.`);
  if(!allLib.includes(`id: "${id}"`))errors.push(`Specs page model record missing: ${id}`);
}

for(const token of [
  "generateStaticParams()",
  "specsIntentLandingProfiles",
  "isIndexableModel(model)",
  "technical specifications",
  "specRows",
  "Which specifications matter most in real use?",
  "Specifications stay tied to the checked model record",
  "FAQPage",
  '/motorcycles/${model.makeSlug}/${model.slug}/specs'
]){
  requireText(route,token,`Specs route depth missing: ${token}`);
}

for(const token of [
  'import { specsIntentLandingProfile } from "@/lib/modelSpecsLandingPages";',
  "const specsLanding = specsIntentLandingProfile(model.id);",
  '/motorcycles/${model.makeSlug}/${model.slug}/specs',
  "Dedicated technical reference"
]){
  requireText(modelPage,token,`Main model specs handoff missing: ${token}`);
}

requireText(sitemap,'specsIntentLandingProfiles.flatMap',"Motorcycle sitemap must enumerate specs pages.");
requireText(sitemap,'/specs',"Motorcycle sitemap must expose specs URLs.");
requireText(sitemap,'profile.keywordVolume>=1000?.88:.84',"Specs sitemap priority must use stored demand.");

requireText(llms,'Focused model specification guides',"LLM full index must expose specs pages.");
requireText(llms,'For models with a dedicated specs page',"LLM retrieval guidance must route technical queries to specs pages.");
requireText(llms,'/fuel-consumption and /specs pages are canonical resources',"LLM canonical policy must name specs pages.");

for(const slug of ["price","variants"]){
  const candidate=path.join(root,"app","motorcycles","[make]","[slug]",slug,"page.tsx");
  if(fs.existsSync(candidate))errors.push(`Do not mass-split unsupported model intent pages yet: /${slug}`);
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Model specs intent validation passed: ${expected.length} search-volume-backed technical reference pages.`);
