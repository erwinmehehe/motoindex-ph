import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const errors=[];
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const pkg=JSON.parse(read("package.json"));
const [maj240,min240]=String(pkg.version).split(".").map(Number);
if(!(maj240===2&&min240>=4))errors.push(`package version must be v2.4.0 or newer within major v2, found ${pkg.version}`);

const priceSeo=read("lib/priceSeo.ts");
for(const id of ["yamaha-aerox-v3","honda-adv-160","yamaha-aerox-v2","honda-pcx-160","honda-click-160","yamaha-nmax-v3","yamaha-fazzio","honda-adv-350"]){
  if(!priceSeo.includes(`"${id}"`))errors.push(`price SEO target missing ${id}`);
}
for(const token of ["2026: SRP","priceFaqsForModel","installment"]){if(!priceSeo.includes(token))errors.push(`price SEO helper missing ${token}`);}

const priceRoute=read("app/motorcycles/[make]/[slug]/price/page.tsx");
const pricePage=priceRoute.includes("permanentRedirect")&&fs.existsSync(path.join(root,"components/MotorcycleEntityPage.tsx"))?read("components/MotorcycleEntityPage.tsx")+read("lib/motorcycleEntitySeo.ts"):priceRoute;
for(const token of ["motorcycleEntitySeo","priceFaqsForModel","FaqSection","modelInternalLinks"]){if(!pricePage.includes(token))errors.push(`canonical price/entity integration missing ${token}`);}

const family=read("components/ModelFamilyView.tsx");
for(const token of ["price in the Philippines and generations","current-generation price page","FaqSection","ItemList"]){if(!family.includes(token))errors.push(`family SEO integration missing ${token}`);}

const guides=read("lib/ownershipGuides.ts");
for(const token of ["dl-code-b-motorcycle-philippines","DL Code B by itself does not cover motorcycles","DL Code A","2026-08-26"]){if(!guides.includes(token))errors.push(`DL Code B guide missing ${token}`);}
const guidePage=read("app/ownership/[slug]/page.tsx");
if(!guidePage.includes("Short answer: DL Code B alone is not a motorcycle code"))errors.push("DL Code B short-answer module missing");

const data=read("lib/data.ts");
const catalog=read("lib/catalog.ts");
const media=read("lib/media.ts");
if(!data.includes('{ brand: "Zebra", slug: "zebra"'))errors.push("Zebra brand record missing");
for(const id of ["zebra-atlas-2026","zebra-a113-ritzy","zebra-alistair-2024"]){
  if(!catalog.includes(`id:"${id}"`))errors.push(`Zebra product missing ${id}`);
  if(!media.includes(`entityId: "${id}"`))errors.push(`Zebra product media missing ${id}`);
}
const next=read("next.config.mjs");
if(!next.includes("down-ph.img.susercontent.com"))errors.push("Zebra marketplace image host missing from allowlist");

const helmets=read("app/gear/helmets/page.tsx");
for(const token of ["Motorcycle Helmet Prices Philippines 2026","Observed starting prices","FaqSection"]){if(!helmets.includes(token))errors.push(`helmet hub SEO expansion missing ${token}`);}

if(!fs.existsSync(path.join(root,"research/ph_motorcycle_seo_300plus_keywords_with_volume_plan.xlsx")))errors.push("volume-first roadmap workbook missing from research folder");

const lock=JSON.parse(read("package-lock.json"));
if(lock.version!==pkg.version||lock.packages?.[""]?.version!==pkg.version)errors.push("package-lock root version does not match package.json");

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("v2.4.0 validation passed: volume-first price SEO, model-family hubs, DL Code B guide, Zebra helmet expansion and roadmap workbook are wired.");
