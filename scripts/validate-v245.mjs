import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const errors=[];
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const need=(file,parts)=>{const s=read(file);for(const part of parts)if(!s.includes(part))errors.push(`${file} missing ${part}`);};
const pkg=JSON.parse(read("package.json"));
const [maj,min,patch]=String(pkg.version).split(".").map(Number);
if(!(maj===2&&(min>4||(min===4&&patch>=5))))errors.push(`package version must be v2.4.5 or newer within major v2, found ${pkg.version}`);

for(const file of ["app/maintenance/page.tsx","app/maintenance/[slug]/page.tsx","lib/maintenanceSeo.ts"])if(!fs.existsSync(path.join(root,file)))errors.push(`${file} missing`);
need("lib/maintenanceSeo.ts",["parts-of-motorcycle","motorcycle-battery","coolant-for-motorcycle","sprocket-motorcycle","change-oil-motorcycle","cvt-motorcycle","motorcycle-oil","Honda Philippines Maintenance Planner","Yamaha Philippines After Sales","Suzuki Philippines After Sales"]);
need("lib/sitemaps.ts",['["/maintenance",.78]','maintenanceSeoTopics.map']);
need("lib/search.ts",['category:"Maintenance guide"','maintenanceSeoTopics']);
need("components/Header.tsx",['"/maintenance"']);
need("components/Footer.tsx",['href="/maintenance">Maintenance']);
need("app/gear/helmets/brands/page.tsx",['How to compare helmet brands without guessing','There is no single “best helmet brand”','Helmet brand questions','JsonLd']);
need("lib/ownershipGuides.ts",['Motorcycle registration renewal Philippines: requirements, fees and LTMS','Registration fees and late charges depend on the actual transaction']);
need("app/ownership/[slug]/page.tsx",['What are the basic motorcycle registration renewal requirements?','How much is motorcycle registration renewal?','Can I check or renew motorcycle registration through the LTO portal?']);

const topicRows=(read("lib/maintenanceSeo.ts").match(/slug: "/g)||[]).length;
if(topicRows<7)errors.push(`expected at least 7 maintenance SEO topics, found ${topicRows}`);
const lock=JSON.parse(read("package-lock.json"));
if(lock.version!==pkg.version||lock.packages?.[""]?.version!==pkg.version)errors.push("package-lock root version does not match package.json");

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log(`v2.4.5 validation passed: ${topicRows} maintenance SEO topics, helmet-brand intent expansion and registration SEO refresh are wired.`);
