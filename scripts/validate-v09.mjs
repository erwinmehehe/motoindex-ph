import { loadTypeScript } from "./load-typescript.mjs";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const ts=loadTypeScript();
const root=process.cwd(); const errors=[];
const posix=(value)=>value.split(path.sep).join("/");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");

const required=[
  "lib/usedMarket.ts","components/UsedMarketExplorer.tsx","components/UsedMarketSummary.tsx","components/UsedListingTable.tsx",
  "app/used-motorcycles/page.tsx","app/motorcycles/[make]/[slug]/used-value/page.tsx","app/motorcycles/[make]/[slug]/new-vs-used/page.tsx",
  "app/api/used-listings/route.ts","app/admin/used-listings/page.tsx"
];
for(const f of required) if(!fs.existsSync(path.join(root,f))) errors.push(`missing ${f}`);

const used=read("lib/usedMarket.ts");
const ids=[...used.matchAll(/id:\"(u-[^\"]+)\"/g)].map(x=>x[1]);
if(ids.length<20) errors.push(`expected at least 20 used listing samples, found ${ids.length}`);
if(new Set(ids).size!==ids.length) errors.push("duplicate used listing ids");
const modelIds=[...used.matchAll(/modelId:\"([^\"]+)\"/g)].map(x=>x[1]);
if(new Set(modelIds).size<5) errors.push("used-market demo should cover at least 5 motorcycle models");
if(!used.includes("isPriceOutlier")||!used.includes("marketSummary")) errors.push("used-market normalization/outlier summary functions missing");

const usedHub=read("app/used-motorcycles/page.tsx");
const usedDetail=read("app/motorcycles/[make]/[slug]/used-value/page.tsx");
const newVsUsed=read("app/motorcycles/[make]/[slug]/new-vs-used/page.tsx");
if(!usedHub.includes("index:false")) errors.push("used hub must remain noindex until verified listing feeds exist");
for(const [name,s] of [["used detail",usedDetail],["new vs used",newVsUsed]]) if(!s.includes("index:false")&&!s.includes("permanentRedirect")) errors.push(`${name} must remain noindex or permanently redirect into the canonical entity page`);
const sitemap=read("app/sitemap.ts");
if(sitemap.includes('"/used-motorcycles"')) errors.push("noindex used hub must not be in sitemap");
if(sitemap.includes("new-vs-used")) errors.push("noindex new-vs-used pages must not be in sitemap");

const banned=["one design system","buying intelligence","buyer-guide engine","compatibility engine","commercial layer","programmatic","moat","high-intent","prototype","seeded motorcycles","seed record","seo roadmap","seo data","seo demand","research-first","product intelligence"];
const publicFiles=[];
function walk(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const rel=path.join(dir,e.name).split(path.sep).join("/");if(e.isDirectory()){if(posix(rel).startsWith("app/admin")||posix(rel).startsWith("app/api"))continue;walk(rel)}else if(/\.(tsx|ts)$/.test(e.name))publicFiles.push(rel)}}
walk("app");
for(const e of fs.readdirSync(path.join(root,"components"))){if(/\.tsx$/.test(e)&&e!=="OfferImportPreview.tsx")publicFiles.push(path.join("components",e));}
for(const rel of ["lib/data.ts","lib/catalog.ts","lib/sellers.ts"]) publicFiles.push(rel);
for(const rel of publicFiles){const low=read(rel).toLowerCase();for(const phrase of banned)if(low.includes(phrase))errors.push(`public copy contains banned internal/template phrase "${phrase}" in ${rel}`);}

for(const base of ["app","components","lib"]){const files=[];const w=d=>{for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const rel=path.join(d,e.name).split(path.sep).join("/");if(e.isDirectory())w(rel);else if(/\.(tsx|ts)$/.test(e.name))files.push(rel)}};w(base);for(const rel of files){const src=read(rel);const out=ts.transpileModule(src,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},fileName:rel,reportDiagnostics:true});for(const d of out.diagnostics||[])if(d.category===ts.DiagnosticCategory.Error)errors.push(`${rel}: ${ts.flattenDiagnosticMessageText(d.messageText," ")}`)}}

if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log(`v0.9 validation passed: ${ids.length} used listing samples, ${new Set(modelIds).size} covered models, copy audit clean, TS/TSX syntax clean.`);
