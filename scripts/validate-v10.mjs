import { loadTypeScript } from "./load-typescript.mjs";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const ts=loadTypeScript();
const root=process.cwd(); const errors=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const required=["lib/families.ts","components/ModelFamilyView.tsx","app/motorcycles/[make]/page.tsx"];
for(const f of required) if(!fs.existsSync(path.join(root,f))) errors.push(`missing ${f}`);
const data=read("lib/data.ts");
for(const [id,volume] of [["yamaha-aerox-v2",20000],["yamaha-nmax-v2",13000]]){
  if(!data.includes(`id: "${id}"`)) errors.push(`missing ${id}`);
  const start=data.indexOf(`id: "${id}"`); const chunk=data.slice(start,start+1800);
  if(!chunk.includes(`searchVolume: ${volume}`)) errors.push(`${id} search volume should be ${volume}`);
  if(!chunk.includes('marketStatus: "previous"')) errors.push(`${id} must be previous-generation`);
  if(!chunk.includes("priceContext:")) errors.push(`${id} must explain historical price context`);
}
const families=read("lib/families.ts");
for(const slug of ['slug: "aerox"','slug: "nmax"']) if(!families.includes(slug)) errors.push(`missing family ${slug}`);
const modelPage=read("app/motorcycles/[make]/[slug]/page.tsx");
const entityPage=fs.existsSync(path.join(root,"components/MotorcycleEntityPage.tsx"))?read("components/MotorcycleEntityPage.tsx"):modelPage;
if(!modelPage.includes("getModelFamily")) errors.push("model route must resolve family hubs");
if(!entityPage.includes("Historical launch SRP")) errors.push("historical price label missing on canonical model entity page");
const pricePage=read("app/motorcycles/[make]/[slug]/price/page.tsx");
if(!(pricePage.includes("permanentRedirect")&&pricePage.includes("#price"))&&!entityPage.includes("Do not use the launch SRP as today&apos;s used-bike value")) errors.push("historical price warning or canonical redirect missing");
const quote=read("app/get-quote/[make]/[slug]/page.tsx");
if(!(quote.includes("currentMotorcycles") || /marketStatus\s*===\s*["']previous["']/.test(quote))) errors.push("quote routes must exclude previous generations");
const sitemap=read("app/sitemap.ts");
if(!sitemap.includes("brandUrls")||!sitemap.includes("familyUrls")) errors.push("brand/family hubs missing from sitemap");
const brandPage=read("app/motorcycles/[make]/page.tsx").toLowerCase();
for(const phrase of ["monthly ph searches","keyword difficulty","seo data","search volume"]) if(brandPage.includes(phrase)) errors.push(`public brand page leaks SEO metric phrase: ${phrase}`);
const pageFiles=[];
for(const base of ["app","components","lib"]){const walk=d=>{for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const rel=path.join(d,e.name).split(path.sep).join("/");if(e.isDirectory())walk(rel);else if(/\.(tsx|ts)$/.test(e.name))pageFiles.push(rel)}};walk(base)}
for(const rel of pageFiles){const src=read(rel);const out=ts.transpileModule(src,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},fileName:rel,reportDiagnostics:true});for(const d of out.diagnostics||[])if(d.category===ts.DiagnosticCategory.Error)errors.push(`${rel}: ${ts.flattenDiagnosticMessageText(d.messageText," ")}`)}
if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log("v1.0 validation passed: high-volume generation expansion, brand/family hubs, historical-price safeguards, TS/TSX syntax clean.");
