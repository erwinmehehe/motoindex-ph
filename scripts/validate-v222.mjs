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
const vp=pkg.version.split(".").map(Number);
if(vp[0]!==2 || vp[1]<2 || (vp[1]===2 && vp[2]<2))errors.push(`package version must be v2.2.2 or newer within major v2, found ${pkg.version}`);
for(const f of ["components/AffiliateLink.tsx","app/go/affiliate/[productId]/route.ts","AFFILIATE_SETUP.md"]){if(!exists(f))errors.push(`${f} missing`);}
const affiliate=read("lib/affiliate.ts");
for(const token of ["AFFILIATE_LINKS_JSON","involve_asia","shopee_direct","allowedInvolveAsiaHost","invol.co","getAffiliateLink","byNetwork"]){if(!affiliate.includes(token))errors.push(`provider-neutral affiliate config missing ${token}`);}
const link=read("components/AffiliateLink.tsx");
for(const token of ["Check price on Shopee",'/go/affiliate/','network,','merchant: "shopee"','rel="sponsored nofollow noopener noreferrer"']){if(!link.includes(token))errors.push(`generic affiliate link missing ${token}`);}
const offer=read("components/AffiliateOffer.tsx");
for(const token of ["Check current price on Shopee","Involve Asia","getAffiliateLink","AffiliateLink"]){if(!offer.includes(token))errors.push(`affiliate offer missing ${token}`);}
const redirect=read("app/go/affiliate/[productId]/route.ts");
for(const token of ["getAffiliateLink","NextResponse.redirect","Cache-Control","X-Robots-Tag","no-store","noindex, nofollow"]){if(!redirect.includes(token))errors.push(`generic affiliate redirect missing ${token}`);}
const disclosure=read("app/affiliate-disclosure/page.tsx");
for(const token of ["Involve Asia","direct merchant affiliate link","provider-neutral"]){if(!disclosure.includes(token))errors.push(`affiliate disclosure missing ${token}`);}
const admin=read("app/admin/data-health/page.tsx");
for(const token of ["Network mix","involveAsia","shopeeDirect","AFFILIATE_LINKS_JSON"]){if(!admin.includes(token))errors.push(`admin affiliate diagnostics missing ${token}`);}
const env=read(".env.example");
if(!env.includes("AFFILIATE_LINKS_JSON={}"))errors.push(".env.example does not fail-close unified affiliate config");
if(/AFFILIATE_LINKS_JSON=\{[^}]+https?:/.test(env))errors.push(".env.example contains a fake/example affiliate URL");
if(!read("app/robots.ts").includes('"/go/"'))errors.push("robots must block generic affiliate redirect paths");
const setup=read("AFFILIATE_SETUP.md");
for(const token of ["Involve Asia","SHOPEE_AFFILIATE_LINKS_JSON","AFFILIATE_LINKS_JSON","Check price on Shopee"]){if(!setup.includes(token))errors.push(`affiliate setup guide missing ${token}`);}
const ts=loadTypeScript();
if(ts){for(const f of ["lib/affiliate.ts","components/AffiliateLink.tsx","components/AffiliateOffer.tsx","components/ProductCard.tsx","app/go/affiliate/[productId]/route.ts","app/go/shopee/[productId]/route.ts","app/affiliate-disclosure/page.tsx","app/admin/data-health/page.tsx"]){const out=ts.transpileModule(read(f),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},reportDiagnostics:true,fileName:f});const ds=(out.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);if(ds.length)errors.push(`${f}: ${ds.map(d=>ts.flattenDiagnosticMessageText(d.messageText," ")).join(" | ")}`);}}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("v2.2.2 compatibility validation passed: affiliate routing supports direct Shopee and Involve Asia with purchase-intent CTAs, fail-closed config, network analytics, disclosure, and noindex redirects.");
