import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const errors=[];
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const pkg=JSON.parse(read("package.json"));
const [maj,min,patch]=String(pkg.version).split(".").map(Number);
if(!(maj===2&&(min>4||(min===4&&patch>=1))))errors.push(`package version must be v2.4.1 or newer within major v2, found ${pkg.version}`);

const tireSeo=read("lib/tireSeo.ts");
for(const slug of ["aerox-tire-size","nmax-tire-size","honda-click-tire-size"]){if(!tireSeo.includes(`slug: "${slug}"`))errors.push(`tire family hub missing ${slug}`);}
for(const id of ["honda-adv-160","yamaha-aerox-v3","yamaha-aerox-v2","yamaha-nmax-v3","yamaha-nmax-v2","honda-click-125i","honda-click-160"]){if(!tireSeo.includes(`"${id}"`))errors.push(`priority tire SEO target missing ${id}`);}

const tireHub=read("app/tires/page.tsx");
for(const token of ["Motorcycle Tire Size Chart & Finder Philippines","Tire-size guides by model family","motorcycle-tire-size-chart"]){if(!tireHub.includes(token))errors.push(`tire hub expansion missing ${token}`);}

const tireRoute=read("app/tires/[slug]/page.tsx");
for(const token of ["motorcycle-tire-size-chart","How to read 110/80-14","Do not combine tire data across generations","FaqSection"]){if(!tireRoute.includes(token))errors.push(`tire SEO route missing ${token}`);}

const modelTireRoute=read("app/motorcycles/[make]/[slug]/tire-size/page.tsx");
const modelTire=modelTireRoute.includes("permanentRedirect")&&fs.existsSync(path.join(root,"components/MotorcycleEntityPage.tsx"))?read("components/MotorcycleEntityPage.tsx")+read("lib/motorcycleEntitySeo.ts"):modelTireRoute;
if(!(modelTireRoute.includes("permanentRedirect")&&modelTireRoute.includes("#tires-fitment")))errors.push("legacy model tire-size route must redirect to the canonical tire/fitment section");
for(const token of ["Front tire","Rear tire","getTireProductsForModel","What tire size","FaqSection"]){if(!modelTire.includes(token))errors.push(`canonical model tire section missing ${token}`);}

const topBox=read("app/accessories/[slug]/page.tsx");
for(const token of ["Motorcycle Top Box Philippines: Sizes, Brackets & Fitment","32L vs 39L motorcycle top boxes","Verified mounting edges","Motorcycle top-box questions"]){if(!topBox.includes(token))errors.push(`top-box hub expansion missing ${token}`);}

const helmetBrand=read("app/gear/helmets/[brand]/page.tsx");
for(const token of ["Helmet Price Philippines 2026","helmet price list","latestChecked","FaqSection"]){if(!helmetBrand.includes(token))errors.push(`helmet brand SEO depth missing ${token}`);}
if(!helmetBrand.includes("<span>Updated</span>"))errors.push("helmet brand page must show the latest product update date when available");

const sitemaps=read("lib/sitemaps.ts");
for(const token of ["tireFamilyHubs","motorcycle-tire-size-chart"]){if(!sitemaps.includes(token))errors.push(`sitemap integration missing ${token}`);}
if(!/accessoryCategories\.filter\(a=>a\.slug===\"top-box\"\)[\s\S]*priority:\.76/.test(sitemaps))errors.push("sitemap integration must keep the verified top-box hub at priority .76 without indexing thin accessory hubs");

const lock=JSON.parse(read("package-lock.json"));
if(lock.version!==pkg.version||lock.packages?.[""]?.version!==pkg.version)errors.push("package-lock root version does not match package.json");

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("v2.4.1 validation passed: tire family SEO hubs, model tire FAQs, top-box fitment hub and helmet price-depth pages are wired.");
