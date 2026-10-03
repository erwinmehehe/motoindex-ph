import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];
const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

const profiles=read("lib","modelSeatHeightLandingPages.ts");
const route=read("app","motorcycles","[make]","[slug]","seat-height","page.tsx");
const modelPage=read("components","MotorcycleEntityPage.tsx");
const sitemap=read("lib","sitemaps.ts");
const llms=read("lib","llms.ts");
const allLib=fs.readdirSync(path.join(root,"lib"))
  .filter((name)=>name.endsWith(".ts"))
  .map((name)=>read("lib",name))
  .join("\n");

const expected=[
  ["honda-click-160","honda click seat height",700,"Honda Click 160 Seat Height Philippines 2026 | 778 mm Guide","Honda Click 160 seat height Philippines guide with 778 mm seat, 116 kg curb weight, rider-reach caveats, scooter comparison data and low-speed fit context.",778],
  ["yamaha-nmax-v3","nmax seat height",600,"Yamaha NMAX V3 Seat Height Philippines 2026 | 770 mm Guide","Yamaha NMAX V3 seat height Philippines guide with 770 mm seat, 131 kg curb weight, rider-reach caveats, scooter comparisons and low-speed fit context.",770],
  ["honda-beat","honda beat seat height",500,"Honda BeAT Seat Height Philippines 2026 | 742 mm Rider Guide","Honda BeAT seat height Philippines guide with 742 mm seat, 90 kg curb weight, rider-reach caveats, commuter-scooter comparisons and low-speed fit context.",742],
  ["kawasaki-ninja-400","how tall is ninja",500,"Kawasaki Ninja 400 Seat Height Philippines | 785 mm Guide","Kawasaki Ninja 400 seat height Philippines guide with 785 mm seat, 168 kg curb weight, sport-bike comparisons, rider-reach caveats and low-speed fit context.",785],
  ["honda-adv-350","adv seat height",200,"Honda ADV350 Seat Height Philippines 2026 | 795 mm Guide","Honda ADV350 seat height Philippines guide with 795 mm seat, 186 kg curb weight, maxi-scooter comparisons, rider-reach caveats and low-speed fit context.",795],
  ["yamaha-xmax","xmax seat height",150,"Yamaha XMAX Seat Height Philippines 2026 | 795 mm Guide","Yamaha XMAX seat height Philippines guide with 795 mm seat, 181 kg curb weight, maxi-scooter comparisons, rider-reach caveats and low-speed fit context.",795]
];

for(const [id,keyword,volume,title,description,seatHeight] of expected){
  requireText(profiles,`modelId: "${id}"`,`Seat-height profile missing: ${id}`);
  requireText(profiles,`keyword: "${keyword}"`,`Seat-height keyword missing: ${id}`);
  requireText(profiles,`keywordVolume: ${volume}`,`Seat-height keyword volume missing: ${id}`);
  requireText(profiles,`title: "${title}"`,`Seat-height title missing: ${id}`);
  requireText(profiles,`description: "${description}"`,`Seat-height description missing: ${id}`);
  if(volume<=0)errors.push(`${id} seat-height page requires positive stored search volume.`);
  if(title.length<55||title.length>60)errors.push(`${id} seat-height title must be 55-60 chars; found ${title.length}.`);
  if(description.length<150||description.length>160)errors.push(`${id} seat-height description must be 150-160 chars; found ${description.length}.`);

  const start=allLib.indexOf(`id: "${id}"`);
  const end=start>=0?allLib.indexOf("\n  {",start+10):-1;
  const block=start>=0?allLib.slice(start,end>start?end:undefined):"";
  if(!block)errors.push(`Seat-height page model record missing: ${id}`);
  if(!block.includes(`seatHeightMm: ${seatHeight}`))errors.push(`${id} stored seat height must remain ${seatHeight} mm.`);
  if(!/sourceUrl:\s*"https:\/\//.test(block))errors.push(`${id} seat-height page needs a model source URL.`);
}

for(const token of [
  "generateStaticParams()",
  "seatHeightIntentLandingProfiles",
  "isIndexableModel(model)",
  "Seat height is not the same as minimum rider height or inseam",
  "categoryMedianSeat",
  "curb weight",
  "Can a shorter rider flat-foot",
  "Does suspension sag reduce the effective seat height?",
  "FAQPage",
  '/motorcycles/${model.makeSlug}/${model.slug}/seat-height'
]){
  requireText(route,token,`Seat-height route depth missing: ${token}`);
}

for(const token of [
  'import { seatHeightIntentLandingProfile } from "@/lib/modelSeatHeightLandingPages";',
  "const seatHeightLanding = seatHeightIntentLandingProfile(model.id);",
  '/motorcycles/${model.makeSlug}/${model.slug}/seat-height',
  "Dedicated rider-fit context"
]){
  requireText(modelPage,token,`Main model seat-height handoff missing: ${token}`);
}

requireText(sitemap,'seatHeightIntentLandingProfiles.flatMap',"Motorcycle sitemap must enumerate seat-height pages.");
requireText(sitemap,'/seat-height',"Motorcycle sitemap must expose seat-height URLs.");
requireText(sitemap,'profile.keywordVolume>=500?.87:.83',"Seat-height sitemap priority must use stored search demand.");

requireText(llms,'Focused model seat-height guides',"LLM full index must expose focused seat-height pages.");
requireText(llms,'For model-specific seat-height queries',"LLM retrieval guidance must route seat-height queries to focused pages.");
requireText(llms,'For models with a dedicated seat-height page',"LLM retrieval rules must preserve rider-reach caveats.");
requireText(llms,'Whitelisted /motorcycles/<make>/<model>/seat-height pages are also canonical resources',"LLM canonical policy must name seat-height pages.");
requireText(llms,'do not infer that a rider can flat-foot from published seat height alone',"LLM fit guidance must preserve the flat-foot caveat.");

for(const slug of ["price","variants"]){
  const candidate=path.join(root,"app","motorcycles","[make]","[slug]",slug,"page.tsx");
  if(fs.existsSync(candidate))errors.push(`Do not mass-split unsupported model intent pages yet: /${slug}`);
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Model seat-height intent validation passed: ${expected.length} search-volume-backed rider-fit pages.`);
