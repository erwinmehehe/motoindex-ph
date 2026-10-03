import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),"utf8");
const errors=[];
const requireText=(source,token,message)=>{if(!source.includes(token))errors.push(message);};

const profiles=read("lib","modelIntentLandingPages.ts");
const route=read("app","motorcycles","[make]","[slug]","installment","page.tsx");
const modelPage=read("components","MotorcycleEntityPage.tsx");
const priceSeo=read("lib","priceSeo.ts");
const sitemap=read("lib","sitemaps.ts");
const llms=read("lib","llms.ts");
const dealerFinancing=read("lib","dealerFinancing.ts");

const expected=[
  ["honda-click-125i","Honda Click 125i Installment Philippines | Downpayment 2026","Honda Click 125i installment Philippines guide with current price, dealer downpayment/monthly snapshot, editable loan calculator, variants and finance caveats."],
  ["honda-click-160","Honda Click 160 Installment Philippines | Downpayment 2026","Honda Click 160 installment Philippines guide with current price, editable downpayment/monthly calculator, dealer SRP snapshot, loan scenarios and caveats."],
  ["honda-pcx-160","Honda PCX 160 Installment Philippines | Downpayment 2026","Honda PCX 160 installment Philippines guide with CBS/ABS dealer snapshots, current variant prices, editable monthly calculator and clear financing caveats."],
  ["yamaha-nmax-v3","Yamaha NMAX V3 Installment Philippines | Downpayment 2026","Yamaha NMAX V3 installment Philippines guide with Standard/Tech Max dealer snapshots, variant prices, editable downpayment/monthly calculator and loan caveats."],
  ["yamaha-mio-gear","Yamaha Mio Gear Installment Philippines | Downpayment 2026","Yamaha Mio Gear installment Philippines guide with current dealer downpayment/monthly snapshot, editable loan calculator, price range and financing caveats."],
  ["yamaha-aerox-v3","Yamaha Aerox V3 Installment Philippines | Downpayment 2026","Yamaha Aerox V3 installment Philippines guide with Standard/SP prices, dealer SRP snapshots, editable downpayment/monthly calculator and financing caveats."]
];

for(const [id,title,description] of expected){
  requireText(profiles,`modelId: "${id}"`,`Installment profile missing: ${id}`);
  requireText(profiles,`title: "${title}"`,`Installment title missing: ${id}`);
  requireText(profiles,`description: "${description}"`,`Installment description missing: ${id}`);
  requireText(dealerFinancing,`modelId: "${id}"`,`Installment split requires at least one dated dealer observation: ${id}`);
  if(title.length<55||title.length>60)errors.push(`${id} installment title must be 55-60 chars; found ${title.length}.`);
  if(description.length<150||description.length>160)errors.push(`${id} installment description must be 150-160 chars; found ${description.length}.`);
}

for(const token of [
  "generateStaticParams()",
  "installmentLandingProfiles",
  "isIndexableModel(model)",
  "<InstallmentCalculator",
  "<FinancingSnapshot",
  "<DealerFinancingSnapshot",
  "How downpayment changes the monthly estimate",
  "Dealer cards can use different downpayments",
  "FAQPage",
  '/motorcycles/${model.makeSlug}/${model.slug}/installment'
]){
  requireText(route,token,`Installment route depth missing: ${token}`);
}

for(const token of [
  'import { installmentLandingProfile } from "@/lib/modelIntentLandingPages";',
  "const installmentLanding = installmentLandingProfile(model.id);",
  '/motorcycles/${model.makeSlug}/${model.slug}/installment',
  "This financing intent now has its own focused page"
]){
  requireText(modelPage,token,`Main model intent handoff missing: ${token}`);
}

requireText(priceSeo,'hasInstallmentLandingPage(model.id)',"Main model FAQ must hand finance-query ownership to the installment page.");
requireText(sitemap,'installmentLandingProfiles.flatMap',"Motorcycle sitemap must enumerate the installment whitelist.");
requireText(sitemap,'/installment',"Motorcycle sitemap must expose installment URLs.");
requireText(llms,'Focused model installment guides',"LLM full index must expose the installment guide section.");
requireText(llms,'For models with a dedicated installment page',"LLM retrieval rules must route finance questions to the focused page.");
requireText(llms,'whitelisted /motorcycles/<make>/<model>/installment, /colors, /top-speed and /fuel-consumption pages',"LLM canonical policy must name installment pages.");

for(const slug of ["price","specs","variants"]){
  const candidate=path.join(root,"app","motorcycles","[make]","[slug]",slug,"page.tsx");
  if(fs.existsSync(candidate))errors.push(`Do not mass-split thin model intent pages without independent evidence: /${slug}`);
}

if(errors.length){
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Model intent split validation passed: ${expected.length} focused installment pages, with unsupported thin intent routes still blocked.`);
