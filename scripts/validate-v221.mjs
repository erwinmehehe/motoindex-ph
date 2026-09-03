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
const versionParts=pkg.version.split(".").map(Number);
if(versionParts[0]!==2 || versionParts[1]<2 || (versionParts[1]===2 && versionParts[2]<1))errors.push(`package version must be v2.2.1 or newer, found ${pkg.version}`);

for(const file of ["lib/affiliate.ts","components/AffiliateOffer.tsx","components/ShopeeAffiliateLink.tsx","app/go/shopee/[productId]/route.ts","app/affiliate-disclosure/page.tsx",".env.example"]){if(!exists(file))errors.push(`${file} missing`);}

const affiliate=read("lib/affiliate.ts");
for(const token of ["SHOPEE_AFFILIATE_LINKS_JSON","allowedShopeeHost","https:","unknown catalog product","getAffiliateConfigSummary"]){if(!affiliate.includes(token))errors.push(`affiliate config missing ${token}`);}
if(/affiliateUrl\s*:\s*["'`]https?:\/\//.test(affiliate))errors.push("affiliate helper hard-codes a live tracking URL");

const genericButton=exists("components/AffiliateLink.tsx")?read("components/AffiliateLink.tsx"):read("components/ShopeeAffiliateLink.tsx");
for(const token of ['rel="sponsored nofollow noopener noreferrer"','trackEvent("affiliate_click"','target="_blank"']){if(!genericButton.includes(token))errors.push(`affiliate link missing ${token}`);}
if(!genericButton.includes('/go/affiliate/')&&!genericButton.includes('/go/shopee/'))errors.push("affiliate link missing internal redirect route");

const offer=read("components/AffiliateOffer.tsx");
for(const token of ["return null","Affiliate disclosure","qualifying purchases"]){if(!offer.includes(token))errors.push(`affiliate offer missing ${token}`);}
if(!offer.includes("hasShopeeAffiliateUrl")&&!offer.includes("getAffiliateLink"))errors.push("affiliate offer is not config-gated");

const middleware=read("middleware.ts");
const prototypeMatch=middleware.match(/const prototypePrefixes\s*=\s*\[([^\]]*)\]/s);
if(!prototypeMatch)errors.push("middleware prototypePrefixes could not be parsed");
else { const prototypePaths=[...prototypeMatch[1].matchAll(/["\']([^"\']+)["\']/g)].map(m=>m[1]); if(prototypePaths.includes("/go"))errors.push("CRITICAL: /go is in prototypePrefixes and would 404 affiliate redirects in production"); }
if(!middleware.includes('"/go/:path*"'))errors.push("middleware matcher no longer covers /go redirects");

const redirect=read("app/go/shopee/[productId]/route.ts");
for(const token of ['dynamic = "force-dynamic"','status: 404','Cache-Control','X-Robots-Tag','NextResponse.redirect']){if(!redirect.includes(token))errors.push(`affiliate redirect missing ${token}`);}

const robots=read("app/robots.ts");
if(!robots.includes('"/go/"'))errors.push("robots does not disallow affiliate redirect routes");
const footer=read("components/Footer.tsx");
if(!footer.includes('/affiliate-disclosure'))errors.push("footer does not link affiliate disclosure");

for(const file of ["app/gear/helmets/[brand]/[product]/page.tsx","app/tires/[slug]/[product]/page.tsx","app/accessories/top-box/[product]/page.tsx"]){const src=read(file);if(!src.includes("AffiliateOffer"))errors.push(`${file} missing affiliate offer placement`);}
const productCard=read("components/ProductCard.tsx");
for(const token of ["AffiliateOffer","product-card-shell"]){if(!productCard.includes(token))errors.push(`catalog card affiliate integration missing ${token}`);}
if(!productCard.includes("hasShopeeAffiliateUrl")&&!productCard.includes("hasAffiliateLink"))errors.push("catalog card affiliate integration is not config-gated");

const admin=read("app/admin/data-health/page.tsx");
for(const token of ["getAffiliateConfigSummary","affiliate_click"]){if(!admin.includes(token))errors.push(`data-health affiliate status missing ${token}`);}

const env=read(".env.example");
if(!env.includes("SHOPEE_AFFILIATE_LINKS_JSON={}"))errors.push(".env.example does not retain empty legacy Shopee affiliate config");
if(/SHOPEE_AFFILIATE_LINKS_JSON=\{[^}]+https?:/.test(env))errors.push(".env.example contains a fake/example live affiliate URL");

const css=read("app/research-ux.css");
for(const token of [".affiliate-offer",".affiliate-button","min-height:46px",".product-card-shell"]){if(!css.includes(token))errors.push(`affiliate CSS missing ${token}`);}

const ts=loadTypeScript();
if(ts){
  const files=["lib/affiliate.ts","components/AffiliateOffer.tsx","components/ProductCard.tsx","app/go/shopee/[productId]/route.ts","app/affiliate-disclosure/page.tsx","app/admin/data-health/page.tsx","app/gear/helmets/[brand]/[product]/page.tsx","app/tires/[slug]/[product]/page.tsx","app/accessories/top-box/[product]/page.tsx"];
  for(const file of files){const out=ts.transpileModule(read(file),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},reportDiagnostics:true,fileName:file});const ds=(out.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);if(ds.length)errors.push(`${file} has TypeScript syntax errors: ${ds.map(d=>ts.flattenDiagnosticMessageText(d.messageText," ")).join(" | ")}`);}
}

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("v2.2.1 compatibility validation passed: affiliate links remain config-driven, fail-closed, sponsored/nofollow, noindex on redirect, tracked, disclosed, and integrated into purchase-intent product surfaces.");
