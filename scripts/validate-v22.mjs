import { loadTypeScript } from "./load-typescript.mjs";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root=process.cwd();
const errors=[];
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const exists=(p)=>fs.existsSync(path.join(root,p));
const require=createRequire(import.meta.url);

const pkg=JSON.parse(read("package.json"));
const v22=pkg.version.split(".").map(Number); if(v22[0]!==2 || v22[1]<2)errors.push(`package version must be v2.2.0 or newer within major v2, found ${pkg.version}`);

const home=read("app/page.tsx");
for(const href of ["?budget=under100","?budget=100to150","?budget=150to200","?budget=over200"]){
  if(!home.includes(href))errors.push(`homepage budget discovery missing ${href}`);
}

const explorer=read("components/ModelExplorer.tsx");
for(const token of ["initialFilters","window.history.replaceState","aria-live=\"polite\"","budget"]){
  if(!explorer.includes(token))errors.push(`ModelExplorer URL/filter behavior missing ${token}`);
}
const motorcycles=read("app/motorcycles/page.tsx");
if(!motorcycles.includes("searchParams")||!motorcycles.includes("initialFilters"))errors.push("motorcycle directory does not hydrate filters from URL search params");

const finder=read("components/MotorcycleFinder.tsx");
for(const token of ["FinderInitialFilters","window.history.replaceState","Copy finder link","aria-live=\"polite\"","CompareButton","Make"]){
  if(!finder.includes(token))errors.push(`Finder research-state behavior missing ${token}`);
}
const finderPage=read("app/finder/page.tsx");
if(!finderPage.includes("searchParams")||!finderPage.includes("initialFilters"))errors.push("finder page does not hydrate URL-backed filters");

for(const file of ["components/CompareButton.tsx","components/CompareTray.tsx"])if(!exists(file))errors.push(`${file} missing`);
const layout=read("app/layout.tsx");
if(!layout.includes('import "./research-ux.css"'))errors.push("v2.2 research UX stylesheet is not imported by the root layout");
for(const token of ["CompareTray","skip-link","main-content"]){if(!layout.includes(token))errors.push(`layout missing ${token}`);}
const modelCard=read("components/ModelCard.tsx");
for(const token of ["CompareButton","linkHref=","showCredit={false}"]){if(!modelCard.includes(token))errors.push(`model cards missing ${token}`);}

const modelRoute=read("app/motorcycles/[make]/[slug]/page.tsx");
const modelPage=modelRoute+(modelRoute.includes("MotorcycleEntityPage")&&exists("components/MotorcycleEntityPage.tsx")?read("components/MotorcycleEntityPage.tsx"):"");
for(const token of ["ProductEntityNav","CompareButton","id=\"specs\"","id=\"tires-fitment\"","id=\"ownership\"","loanToolHref"]){if(!modelPage.includes(token))errors.push(`model research flow missing ${token}`);}

const pairPage=read("app/compare/[slug]/page.tsx");
const pairTableToken=pairPage.includes("<DetailedMotorcycleCompare")?"<DetailedMotorcycleCompare":"<CompareTable";
const pairTableIndex=pairPage.indexOf(pairTableToken);
const pairEditorialPreIndex=pairPage.indexOf('phase="pre"');
const pairHighlightsIndex=pairPage.indexOf("<ComparisonHighlights");
const hasPairIntroBeforeTable=(pairEditorialPreIndex>=0&&pairEditorialPreIndex<pairTableIndex)||(pairHighlightsIndex>=0&&pairHighlightsIndex<pairTableIndex);
if(!hasPairIntroBeforeTable)errors.push("pair comparison highlights/editorial summary should appear before the wide table");
const threePage=read("app/compare/three/page.tsx");
const threeTableToken=threePage.includes("<DetailedMotorcycleCompare")?"<DetailedMotorcycleCompare":"<ThreeWayCompareTable";
if(threePage.indexOf("<ThreeWayHighlights")>threePage.indexOf(threeTableToken))errors.push("three-way highlights should appear before the wide table");
for(const file of ["components/CompareTable.tsx","components/ThreeWayCompareTable.tsx"]){
  const src=read(file);if(!src.includes('scope="row"')||!src.includes('scope="col"')||!src.includes("tabIndex={0}"))errors.push(`${file} missing table semantics/keyboard scroll target`);
}

for(const file of ["components/LoanCalculator.tsx","components/LtoRegistrationCalculator.tsx","components/MotorcycleInsuranceCalculator.tsx"]){
  const src=read(file);
  if(!src.includes("window.history.replaceState"))errors.push(`${file} does not sync calculation state to URL`);
  if(!src.includes("Copy calculation"))errors.push(`${file} missing share/copy action`);
  if(!src.includes('aria-live="polite"'))errors.push(`${file} missing live result announcement`);
}
const loan=read("components/LoanCalculator.tsx");
for(const preset of ["[10,20,30]","[12,24,36,48]"]){if(!loan.includes(preset))errors.push(`loan calculator preset set missing ${preset}`);}

const used=read("app/used-motorcycles/page.tsx");
if(used.includes("UsedMarketExplorer")||used.includes("usedListings"))errors.push("public used-motorcycles page still renders synthetic listings");
const deals=read("app/deals/page.tsx");
if(deals.includes("sellerOffers"))errors.push("public deals page still renders seeded/sample offers");
const alerts=read("app/price-alerts/page.tsx");
if(alerts.includes('href="/deals"'))errors.push("price alerts still route users into inactive deals flow");

const productCard=read("components/ProductCard.tsx");
for(const token of ["EntityMedia","product-card-media"]){if(!productCard.includes(token))errors.push(`product-card imagery behavior missing ${token}`);}
if(!productCard.includes("Photo pending")&&!productCard.includes("hasRenderableProductMedia"))errors.push("product-card imagery behavior is missing an explicit verified-media gate");
const media=read("lib/media.ts");
for(const id of ["kyt-tt-course","kyt-r2r","spyder-fury-rapid-s8","spyder-neo-ace","spyder-recon-2","pirelli-angel-scooter","givi-b32n"]){if(!media.includes(`entityId: "${id}"`))errors.push(`priority gear image record missing: ${id}`);}
for(const dead of ["kyt-tt-revo-retailer","shad-sh39-retailer"]){if(media.includes(dead))errors.push(`known-dead media record must be removed: ${dead}`);}
const safeMedia=read("components/SafeEntityImage.tsx"); if(!safeMedia.includes("onError")||!safeMedia.includes("Image unavailable"))errors.push("runtime product-image failure fallback missing");
const nextConfig=read("next.config.mjs");
for(const host of ["data.outletmoto.eu","cdn11.bigcommerce.com","www.teamspyder.com","cdn.awsli.com.br","bikeluggage.co.uk"]){if(!nextConfig.includes(host))errors.push(`remote image allowlist missing ${host}`);}

const css=read("app/globals.css")+"\n"+read("app/research-ux.css");
for(const token of [":focus-visible","prefers-reduced-motion:reduce",".skip-link",".model-subnav",".compare-tray","position:sticky",".product-card-media"]){if(!css.includes(token))errors.push(`v2.2 CSS missing ${token}`);}
if(!/\.compare-tray-models button,.calc-presets button\{min-height:44px\}/.test(css))errors.push("compare tray/calculator preset tap targets are below the 44px baseline");
for(const token of [".finder-filter-grid label>span",".finder-rank b",".finder-reasons span"]){if(!css.includes(token))errors.push(`microcopy floor override missing ${token}`);}

// Syntax-transpile all public TS/TSX changed in this release without needing node_modules.
const ts=loadTypeScript();
if(ts){
  const files=[
    "components/ModelExplorer.tsx","app/motorcycles/page.tsx","components/MotorcycleFinder.tsx","app/finder/page.tsx",
    "components/CompareButton.tsx","components/CompareTray.tsx","components/ModelCard.tsx","components/EntityMedia.tsx",
    "components/CompareTable.tsx","components/ThreeWayCompareTable.tsx","components/LoanCalculator.tsx",
    "components/LtoRegistrationCalculator.tsx","components/MotorcycleInsuranceCalculator.tsx","components/ProductCard.tsx",
    "app/layout.tsx","app/page.tsx","app/motorcycles/[make]/[slug]/page.tsx","app/used-motorcycles/page.tsx","app/deals/page.tsx","app/price-alerts/page.tsx"
  ];
  for(const file of files){
    const out=ts.transpileModule(read(file),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},reportDiagnostics:true,fileName:file});
    const ds=(out.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
    if(ds.length)errors.push(`${file} has TypeScript syntax errors: ${ds.map(d=>ts.flattenDiagnosticMessageText(d.messageText," ")).join(" | ")}`);
  }
}

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("v2.2 validation passed: shareable filters, compare tray, model research subnav, mobile comparison/accessibility hardening, calculator sharing/presets, dead-end cleanup, and priority gear imagery are wired.");
