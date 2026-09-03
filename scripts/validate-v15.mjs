import { loadTypeScript } from "./load-typescript.mjs";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const ts=loadTypeScript();
const root=process.cwd();
const errors=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));

for(const f of [
  "lib/marketChecks.ts","components/MarketPriceChecks.tsx","components/CompareBuilder.tsx",
  "components/MotorcycleFinder.tsx","app/finder/page.tsx","app/compare/page.tsx",
  "scripts/validate-v15.mjs","V15_BUILD_SUMMARY.md","MARKET_SOURCES.md"
]) if(!exists(f)) errors.push(`missing ${f}`);

const data=read("lib/data.ts");
for(const id of [
  "yamaha-aerox-v3","yamaha-nmax-v3","honda-adv-160","honda-click-160","honda-pcx-160","yamaha-fazzio",
  "honda-click-125i","yamaha-mio-gear","suzuki-burgman-street-ex","yamaha-sniper-155","suzuki-raider-r150","kawasaki-barako-ii",
  "honda-winner-x","honda-wave-rsx","honda-tmx125-alpha","yamaha-ytx-125","honda-cb150x","yamaha-xsr155"
]) if(!data.includes(`id: "${id}"`)) errors.push(`missing priority motorcycle ${id}`);
for(const token of [
  'id: "honda-winner-x"','id: "honda-wave-rsx"','id: "honda-tmx125-alpha"','id: "yamaha-ytx-125"','id: "honda-cb150x"','id: "yamaha-xsr155"',
  'transmission: "Automatic"','transmission: "Manual"','freshness === "verified"'
]) if(!data.includes(token)) errors.push(`v1.5 motorcycle layer missing ${token}`);
const indexGate=data.match(/export function isIndexableModel\(model: Motorcycle\) \{[\s\S]*?\n\}/)?.[0] || "";
if(indexGate.includes("searchVolume")) errors.push("isIndexableModel must not require search volume");
if(!data.includes("currentMotorcycles.find((model) => slug.startsWith")) errors.push("dynamic compare resolver missing");
if(/return \{ slug, a: a\.id, b: b\.id/.test(data)) errors.push("generated comparison still contains duplicate a/b object keys");

const market=read("lib/marketChecks.ts");
if((market.match(/sourceName:"Zigwheels Philippines"/g)||[]).length<18) errors.push("expected Zigwheels price checks for all 18 priority models");
if((market.match(/sourceName:"Motortrade"/g)||[]).length<12) errors.push("expected at least 12 Motortrade cross-checks");
for(const token of [
  'modelId:"yamaha-nmax-v3"','priceFromPhp:155900, priceToPhp:175900',
  'modelId:"honda-adv-160"','priceFromPhp:166900',
  'modelId:"honda-pcx-160"','priceFromPhp:133400, priceToPhp:154900',
  'modelId:"suzuki-raider-r150"','priceFromPhp:121900',
  'modelId:"kawasaki-barako-ii"','priceFromPhp:91500',
  'observedMarketPriceLabel'
]) if(!market.includes(token)) errors.push(`market intelligence layer missing ${token}`);

const media=read("lib/media.ts");
if((media.match(/entityType: "motorcycle"/g)||[]).length<18) errors.push("expected motorcycle image references for all 18 priority models");
if((media.match(/rightsStatus: "external-reference"/g)||[]).length<18) errors.push("priority motorcycle media must use attributed real-image references");
if(media.includes("imgcdn.zigwheels.ph")) errors.push("Zigwheels CDN hotlinks must not return to motorcycle media");
if(media.includes("/motorcycles/motoindex-bike.svg") || media.includes("illustration placeholder")) errors.push("generic motorcycle illustration placeholders must not return");
const nextConfig=read("next.config.mjs");
if(nextConfig.includes("imgcdn.zigwheels.ph")) errors.push("removed Zigwheels image CDN must not be re-whitelisted");
const mediaComponent=read("components/EntityMedia.tsx");
for(const token of ["sourceLabel","sourceUrl",'target="_blank"']) if(!mediaComponent.includes(token)) errors.push(`media source credit UI missing ${token}`);

const modelCard=read("components/ModelCard.tsx");
for(const token of ["<EntityMedia","observedMarketPriceLabel"]) if(!modelCard.includes(token)) errors.push(`model cards missing ${token}`);
const priceRoute=read("app/motorcycles/[make]/[slug]/price/page.tsx");
const pricePage=priceRoute.includes("permanentRedirect")&&fs.existsSync(path.join(root,"components/MotorcycleEntityPage.tsx"))?read("components/MotorcycleEntityPage.tsx"):priceRoute;
for(const token of ["observedMarketPriceLabel","<MarketPriceChecks"]) if(!pricePage.includes(token)) errors.push(`canonical price section missing ${token}`);
const compare=read("app/compare/page.tsx");
if(!compare.includes("<CompareBuilder")) errors.push("compare-any-two builder missing");
const finder=read("app/finder/page.tsx");
if(!finder.includes("<MotorcycleFinder")) errors.push("full motorcycle finder missing");
const header=read("components/Header.tsx");
if(!header.includes('href="/finder"')) errors.push("finder missing from primary navigation");
const sitemap=read("lib/sitemaps.ts");
if(!sitemap.includes('["/finder"')) errors.push("finder missing from sitemap");

const sourceFiles=[];
for(const base of ["app","components","lib"]){
  const walk=d=>{for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const rel=path.join(d,e.name).split(path.sep).join("/");if(e.isDirectory())walk(rel);else if(/\.(ts|tsx)$/.test(e.name))sourceFiles.push(rel)}};
  walk(base);
}
sourceFiles.push("middleware.ts");
for(const rel of sourceFiles){
  const src=read(rel);
  const out=ts.transpileModule(src,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},fileName:rel,reportDiagnostics:true});
  for(const d of out.diagnostics||[]) if(d.category===ts.DiagnosticCategory.Error) errors.push(`${rel}: ${ts.flattenDiagnosticMessageText(d.messageText," ")}`);
}

if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log(`v1.5 validation passed: 18-model competitor market layer, attributed motorcycle media, market-source price UI, arbitrary comparisons, finder, and ${sourceFiles.length} TS/TSX files syntax-clean.`);
