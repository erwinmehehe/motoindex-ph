import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];
const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

const profiles=read("lib","modelColorLandingPages.ts");
const route=read("app","motorcycles","[make]","[slug]","colors","page.tsx");
const modelPage=read("components","MotorcycleEntityPage.tsx");
const intentDepth=read("lib","modelIntentDepth2026.ts");
const buyerAnswers=read("components","CanonicalIntentDepth.tsx");
const sitemap=read("lib","sitemaps.ts");
const llms=read("lib","llms.ts");
const data=read("lib","data.ts");
const nextConfig=read("next.config.mjs");

const expected=[
  ["honda-click-125i","honda click 125i v3 colors",6600,"Honda Click 125i Colors Philippines 2026 | All Variants","Honda Click 125i colors Philippines 2026 with Standard, Smart Edition and Street paint options, variant mapping, current names and dealer-stock verification."],
  ["yamaha-nmax-v3","nmax v3 colors",2700,"Yamaha NMAX V3 Colors Philippines 2026 | Current Options","Yamaha NMAX V3 colors Philippines 2026 with current Black, Light Grey, Black Gold and Dark Magma options, variant context and dealer-stock verification."],
  ["yamaha-aerox-v3","aerox color",2000,"Yamaha Aerox V3 Colors Philippines 2026 | Standard & SP","Yamaha Aerox V3 colors Philippines 2026 with current Black, Race Blu and Glaze Blue options, Standard/SP context, source dates and dealer-stock verification."],
  ["honda-adv-160","adv 160 colors",1200,"Honda ADV160 Colors Philippines 2026 | ABS & RoadSync Guide","Honda ADV160 colors Philippines 2026 with ABS and RoadSync paint options, current color names, variant mapping, source dates and dealer-stock verification."],
  ["honda-click-160","click 160 colors",800,"Honda Click 160 Colors Philippines 2026 | Current Options","Honda Click 160 colors Philippines 2026 with Matte Gunpowder Black, Matte Solar Red and Matte Cosmo Silver options, source dates and dealer-stock checks."],
  ["yamaha-fazzio","fazzio colors",500,"Yamaha Fazzio Colors Philippines 2026 | Current Options","Yamaha Fazzio colors Philippines 2026 with current Mint, Ivory and Black options, model context, source dates, availability notes and dealer-stock verification."],
  ["suzuki-raider-r150","raider fi colors",450,"Suzuki Raider R150 Colors Philippines 2026 | Current Paint","Suzuki Raider R150 colors Philippines 2026 with Metallic Matte Blue, Pearl Bright Ivory, Bordeaux Red and Fibroin Gray options plus stock-check guidance."],
  ["yamaha-mio-gear","mio gear 125 colors",450,"Yamaha Mio Gear Colors Philippines 2026 | Black & Gray Guide","Yamaha Mio Gear colors Philippines 2026 with current Black and Gray paint references, model-year context, source dates, availability and dealer-stock checks."],
  ["honda-beat","honda beat colors",400,"Honda BeAT Colors Philippines 2026 | Playful & Premium Guide","Honda BeAT colors Philippines 2026 with current Playful and Premium paint choices, six listed colors, variant context, source dates and dealer-stock checks."],
  ["honda-pcx-160","pcx 160 colors",250,"Honda PCX160 Colors Philippines 2026 | Standard & RoadSync","Honda PCX160 colors Philippines 2026 with Standard and RoadSync paint choices, four current colors, trim mapping, source dates and dealer-stock verification."]
];

for(const [id,keyword,volume,title,description] of expected){
  requireText(profiles,`modelId: "${id}"`,`Color profile missing: ${id}`);
  requireText(profiles,`keyword: "${keyword}"`,`Color keyword missing: ${id}`);
  requireText(profiles,`keywordVolume: ${volume}`,`Color search volume missing: ${id}`);
  requireText(profiles,`title: "${title}"`,`Color title missing: ${id}`);
  requireText(profiles,`description: "${description}"`,`Color description missing: ${id}`);
  if(volume<=0)errors.push(`${id} color page requires positive stored search volume.`);
  if(title.length<55||title.length>60)errors.push(`${id} color title must be 55-60 chars; found ${title.length}.`);
  if(description.length<150||description.length>160)errors.push(`${id} color description must be 150-160 chars; found ${description.length}.`);

  const start=data.indexOf(`id: "${id}"`);
  const end=start>=0?data.indexOf("\n  {",start+10):-1;
  const block=start>=0?data.slice(start,end>start?end:undefined):"";
  const colors=block.match(/colors:\s*\[([^\]]*)\]/)?.[1]?.trim()||"";
  if(!colors)errors.push(`${id} color page requires a verified/listed color set in model data.`);
}

for(const token of [
  "generateStaticParams()",
  "colorIntentLandingProfiles",
  "isIndexableModel(model)",
  "variantColorRows",
  "MotoIndex does not invent color swatches",
  "Which ${model.model} variant gets which colors?",
  "A listed color is not a stock guarantee",
  "FAQPage",
  '/motorcycles/${model.makeSlug}/${model.slug}/colors'
]){
  requireText(route,token,`Color route depth missing: ${token}`);
}

for(const token of [
  'import { colorIntentLandingProfile } from "@/lib/modelColorLandingPages";',
  "const colorLanding = colorIntentLandingProfile(model.id);",
  '/motorcycles/${model.makeSlug}/${model.slug}/colors',
  "Dedicated color guide"
]){
  requireText(modelPage,token,`Main model color handoff missing: ${token}`);
}

requireText(intentDepth,'hasColorIntentLandingPage(model.id)',"Main model FAQ generator must exclude split color intent.");
requireText(buyerAnswers,'hasColorIntentLandingPage(model.id)',"Buyer-answer cards must exclude split color intent.");
requireText(sitemap,'colorIntentLandingProfiles.flatMap',"Motorcycle sitemap must enumerate color intent pages.");
requireText(sitemap,'/colors',"Motorcycle sitemap must expose color URLs.");
requireText(sitemap,'profile.keywordVolume>=1000?.88:.84',"Color sitemap priority must use stored search demand.");
requireText(llms,'Focused model color guides',"LLM full index must expose focused color pages.");
requireText(llms,'For models with a dedicated colors page',"LLM retrieval guidance must route color queries to focused pages.");
requireText(llms,'/colors, /top-speed and /fuel-consumption pages are canonical resources',"LLM canonical policy must name color pages.");

if(nextConfig.includes('source: "/motorcycles/:make/:slug/colors"'))errors.push("Dedicated color pages must not be shadowed by a blanket next.config redirect.");

for(const slug of ["price","specs","variants"]){
  const candidate=path.join(root,"app","motorcycles","[make]","[slug]",slug,"page.tsx");
  if(fs.existsSync(candidate))errors.push(`Do not mass-split unsupported model intent pages yet: /${slug}`);
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Model color intent validation passed: ${expected.length} search-volume-backed color pages with verified/listed color data.`);
