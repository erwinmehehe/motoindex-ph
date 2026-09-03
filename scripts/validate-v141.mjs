import { loadTypeScript } from "./load-typescript.mjs";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const ts=loadTypeScript();
const root=process.cwd();const errors=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));

for(const f of ["middleware.ts","app/privacy/page.tsx","scripts/check-launch.mjs","scripts/smoke-production.mjs",".env.example",".npmrc"]){if(!exists(f))errors.push(`missing ${f}`)}
const data=read("lib/data.ts");
for(const token of ['model.freshness === "verified"','/^https:\\/\\//.test(model.sourceUrl)','Boolean(model.verifiedAt)','sourceNeedsReview'])if(!data.includes(token))errors.push(`strict motorcycle index gate missing ${token}`);
const clickStart=data.indexOf('id: "honda-click-160"');const click=data.slice(clickStart,clickStart+1700);
for(const token of ['srp: 116900','frontTire: "100/80-14"','rearTire: "120/70-14"','abs: "Combined Braking System (CBS)"','freshness: "verified"'])if(!click.includes(token))errors.push(`Click160 verified record missing ${token}`);

const home=read("app/page.tsx");
for(const token of ["currentMotorcycles.filter(isIndexableModel)",'filter(p=>p.status==="verified")'])if(!home.includes(token))errors.push(`homepage verified-data gate missing ${token}`);
const motorHub=read("app/motorcycles/page.tsx");if(!motorHub.includes("motorcycles.filter(isIndexableModel)"))errors.push("motorcycle hub must render verified models only");
const brand=read("app/motorcycles/[make]/page.tsx");if(!brand.includes("models.filter(isIndexableModel)"))errors.push("brand page must render verified models only");
const fitment=read("app/fitment/page.tsx");if(!(fitment.includes("motorcycles.filter(isIndexableModel)")||fitment.includes("publicMotorcycles")))errors.push("fitment hub must render verified models only");
const search=read("lib/search.ts");if(!search.includes("publicMotorcycles")||search.includes("const verifiedModels = motorcycles.filter(isIndexableModel)"))errors.push("site search must use publicMotorcycles so previous/discontinued generations cannot leak into current results");
const tire=read("app/tires/[slug]/[product]/page.tsx");if(!(tire.includes("getTireSizeMatches") && /filter\(\s*\(?row\)?\s*=>\s*isIndexableModel\(row\.motorcycle\)\s*\)/.test(tire)))errors.push("indexed tire page must filter motorcycle size matches through isIndexableModel");

const header=read("components/Header.tsx"),footer=read("components/Footer.tsx"),ownership=read("app/ownership/page.tsx"),model=read("app/motorcycles/[make]/[slug]/page.tsx");
for(const [name,src] of [["Header",header],["Footer",footer],["Ownership",ownership],["Model",model]])for(const route of ["/get-quote","/price-alerts","/deals","/sellers","/used-motorcycles"]){if(src.includes(route))errors.push(`${name} still links prototype route ${route}`)}

const middleware=read("middleware.ts");
for(const token of ['"/admin"','"/api/ingestion"','ADMIN_USERNAME','ADMIN_PASSWORD','X-Robots-Tag','isPrototypePath','process.env.NODE_ENV === "production"'])if(!middleware.includes(token))errors.push(`middleware hardening missing ${token}`);
const leads=read("app/api/leads/route.ts"),alerts=read("app/api/price-alerts/route.ts"),offers=read("app/api/offers/route.ts"),used=read("app/api/used-listings/route.ts"),models=read("app/api/models/route.ts");
for(const [name,src] of [["leads",leads],["alerts",alerts],["offers",offers],["used",used]])if(!src.includes("410"))errors.push(`${name} API should be disabled with 410`);
if(!models.includes("filter(isIndexableModel)"))errors.push("models API must expose verified records only");

const sitemap=read("lib/sitemaps.ts");
for(const token of ['["/privacy",.4]','motorcycles.some(isIndexableModel)','isIndexableComparison','isIndexableRecommendation'])if(!sitemap.includes(token))errors.push(`sitemap launch gate missing ${token}`);
for(const bad of ["/get-quote","/price-alerts","/deals","/used-motorcycles"]){if(sitemap.includes(`\"${bad}\"`))errors.push(`sitemap includes prototype route ${bad}`)}

const pkg=JSON.parse(read("package.json"));
for(const [name,version] of Object.entries({...pkg.dependencies,...pkg.devDependencies}))if(!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version))errors.push(`${name} is not exact-pinned: ${version}`);
for(const script of ["validate:v141","check:launch","smoke:production","verify:launch"])if(!pkg.scripts?.[script])errors.push(`missing package script ${script}`);
if(exists("node_modules"))errors.push("deliverable must not include node_modules");
if(exists(".next"))errors.push("deliverable must not include .next build output");

const sourceFiles=[];for(const base of ["app","components","lib"]){const walk=d=>{for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const rel=path.join(d,e.name).split(path.sep).join("/");if(e.isDirectory())walk(rel);else if(/\.(ts|tsx)$/.test(e.name))sourceFiles.push(rel)}};walk(base)}
sourceFiles.push("middleware.ts");
for(const rel of sourceFiles){const src=read(rel);const out=ts.transpileModule(src,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},fileName:rel,reportDiagnostics:true});for(const d of out.diagnostics||[])if(d.category===ts.DiagnosticCategory.Error)errors.push(`${rel}: ${ts.flattenDiagnosticMessageText(d.messageText," ")}`)}

if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log(`v1.4.1 validation passed: launch data gates, prototype shutdown, admin protection, privacy/preflight contracts, and ${sourceFiles.length} TS/TSX files syntax-clean.`);
