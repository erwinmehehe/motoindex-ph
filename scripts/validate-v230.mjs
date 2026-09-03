import fs from "node:fs";
import path from "node:path";
import { loadTypeScript } from "./load-typescript.mjs";

const root=process.cwd();
const errors=[];
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const assert=(ok,msg)=>{if(!ok)errors.push(msg)};
const pkg=JSON.parse(read("package.json"));
const [maj,min]=String(pkg.version).split(".").map(Number);
assert(maj===2&&min>=3,`package version must be v2.3.0 or newer within major v2, found ${pkg.version}`);

const middleware=read("middleware.ts");
const protoMatch=middleware.match(/const prototypePrefixes\s*=\s*\[([^\]]*)\]/s);
assert(Boolean(protoMatch),"middleware prototypePrefixes could not be parsed");
if(protoMatch){
  const prototypes=[...protoMatch[1].matchAll(/["']([^"']+)["']/g)].map(m=>m[1]);
  assert(!prototypes.includes("/go"),"CRITICAL: /go must never be in the production prototype deny-list; affiliate redirects would 404");
}
assert(middleware.includes('"/go/:path*"'),"middleware matcher must continue to cover /go routes without denying them");
for(const file of ["app/go/affiliate/[productId]/route.ts","app/go/shopee/[productId]/route.ts"]){
  const src=read(file);assert(src.includes("NextResponse.redirect"),`${file} must own its redirect behavior`);assert(src.includes("status: 404"),`${file} must remain fail-closed when config is absent`);
}

const scripts=fs.readdirSync(path.join(root,"scripts")).filter(f=>/\.(mjs|cjs)$/.test(f));
const machineTsPath=["","opt","nvm","versions","node","v22.16.0","lib","node_modules","typescript","lib","typescript.js"].join("/");
for(const file of scripts){if(file==="validate-v230.mjs")continue;const src=read(`scripts/${file}`);assert(!src.includes(machineTsPath),`${file} hard-codes a machine-specific TypeScript path`);}
const loader=read("scripts/load-typescript.mjs");
for(const token of ['tryRequire("typescript")','execFileSync(npm, ["root", "-g"]','NODE_PATH','TypeScript is required for validation'])assert(loader.includes(token),`TypeScript loader missing ${token}`);
const v08=read("scripts/validate-v08.mjs");assert(v08.includes('rel.split(path.sep).join("/")'),"v08 path walker must normalize relative paths before POSIX literal comparisons");

const env=read(".env.example");
for(const name of ["NEXT_PUBLIC_SITE_URL","NEXT_PUBLIC_CONTACT_EMAIL","ADMIN_USERNAME","ADMIN_PASSWORD","DATABASE_URL","NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS"]){assert(new RegExp(`^${name}=`,"m").test(env),`.env.example missing ${name}`);}
assert(env.includes("NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS=false"),"search-term analytics must remain privacy-off by default");

for(const file of ["app/gear/helmets/finder/page.tsx","app/gear/helmets/compare/page.tsx","components/HelmetFinder.tsx","components/HelmetComparePicker.tsx"]){assert(exists(file),`${file} missing`);}
const finder=read("components/HelmetFinder.tsx");
for(const token of ["Copy finder link","Compare selected","budget","certification","intercom","useScore","EntityMedia"]){assert(finder.includes(token),`Helmet Finder missing ${token}`);}
const finderPage=read("app/gear/helmets/finder/page.tsx");assert(finderPage.includes("index:true"),"Helmet Finder should be canonical/indexable");assert(finderPage.includes("status===\"verified\""),"Helmet Finder must use verified products only");
const compare=read("app/gear/helmets/compare/page.tsx");for(const token of ["index:false","HelmetComparePicker","helmet-spec-table","AffiliateOffer","scope=\"row\"","scope=\"col\""])assert(compare.includes(token),`Helmet comparison missing ${token}`);
assert(read("lib/sitemaps.ts").includes('"/gear/helmets/finder"'),"Helmet Finder missing from gear sitemap");
assert(!read("lib/sitemaps.ts").includes('"/gear/helmets/compare"'),"Helmet comparison workspace must stay out of sitemaps");
const hub=read("app/gear/helmets/page.tsx");for(const token of ['/gear/helmets/finder','/gear/helmets/compare'])assert(hub.includes(token),`Helmet hub missing ${token}`);
const css=read("app/research-ux.css");for(const token of [".helmet-finder-grid",".helmet-finder-results",".helmet-compare-picker",".helmet-spec-table"]){assert(css.includes(token),`Helmet UX CSS missing ${token}`);}

const ts=loadTypeScript();
for(const file of ["middleware.ts","components/HelmetFinder.tsx","components/HelmetComparePicker.tsx","app/gear/helmets/finder/page.tsx","app/gear/helmets/compare/page.tsx","app/gear/helmets/[brand]/[product]/page.tsx","lib/internalLinks.ts","lib/sitemaps.ts"]){
  const out=ts.transpileModule(read(file),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},reportDiagnostics:true,fileName:file});
  const ds=(out.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
  if(ds.length)errors.push(`${file}: ${ds.map(d=>ts.flattenDiagnosticMessageText(d.messageText," ")).join(" | ")}`);
}

if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log("v2.3.0 validation passed: affiliate /go middleware is production-safe, TypeScript validation is portable/fail-loud, deployment env coverage is restored, and Helmet Finder + noindex comparison are wired.");
