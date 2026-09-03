import { loadTypeScript } from "./load-typescript.mjs";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const ts=loadTypeScript();
const root=process.cwd(); const errors=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const catalog=read("lib/catalog.ts");
const priority={kyt:3,spyder:3,gille:3,evo:3,sec:3};
for(const [brand,count] of Object.entries(priority)){
  const hits=(catalog.match(new RegExp(`brandSlug:\\"${brand}\\"`,"g"))||[]).length;
  if(hits<count) errors.push(`${brand} should have at least ${count} helmet products, found ${hits}`);
  const verified=(catalog.match(new RegExp(`brandSlug:\\"${brand}\\"[^}]{0,900}status:\\"verified\\"`,"g"))||[]).length;
  if(verified<count) errors.push(`${brand} should have ${count} source-backed products, found ${verified}`);
}
for(const field of ["certification?: string","shell?: string","priceSourceUrl?: string"]) if(!read("lib/types.ts").includes(field)) errors.push(`HelmetProduct missing ${field}`);
const brandPage=read("app/gear/helmets/[brand]/page.tsx");
for(const phrase of ["Detailed models","Listed prices","Before buying a helmet"]) if(!brandPage.includes(phrase)) errors.push(`brand page missing ${phrase}`);
const productPage=read("app/gear/helmets/[brand]/[product]/page.tsx");
if(!productPage.includes('index: p.status === "verified"')) errors.push("research helmet products must be noindex");
if(!productPage.includes("Philippine helmet check")) errors.push("product page missing PH compliance reminder");
const sitemap=read("app/sitemap.ts");
if(!sitemap.includes("isIndexableHelmetBrand")) errors.push("helmet brand sitemap gate missing");
if(!sitemap.includes('helmetProducts.filter(p=>p.status==="verified")')) errors.push("research helmet products must stay out of sitemap");
const publicFiles=[];
for(const base of ["app","components","lib"]){const walk=d=>{for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const rel=path.join(d,e.name).split(path.sep).join("/");if(e.isDirectory())walk(rel);else if(/\.(tsx|ts)$/.test(e.name))publicFiles.push(rel)}};walk(base)}
for(const rel of publicFiles){const src=read(rel);const out=ts.transpileModule(src,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},fileName:rel,reportDiagnostics:true});for(const d of out.diagnostics||[])if(d.category===ts.DiagnosticCategory.Error)errors.push(`${rel}: ${ts.flattenDiagnosticMessageText(d.messageText," ")}`)}
if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log("v1.1 validation passed: five priority helmet brands source-backed, research pages gated, sitemap quality gate active, TS/TSX syntax clean.");
