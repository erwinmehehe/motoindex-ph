import { loadTypeScript } from "./load-typescript.mjs";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root=process.cwd();
const errors=[];
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const require=createRequire(import.meta.url);
const pkg=JSON.parse(read("package.json"));
const [maj,min,patch]=pkg.version.split(".").map(Number); if(!(maj===2&&(min>2||(min===2&&patch>=3))))errors.push(`package version must be v2.2.3 or newer within major v2, found ${pkg.version}`);

const catalog=read("lib/catalog.ts");
const media=read("lib/media.ts");
const verified=[...catalog.matchAll(/\{ id:"([^"]+)"[^\n]+status:"verified"/g)].map(m=>m[1]);
if(verified.length<33)errors.push(`expected at least 33 verified public gear products, found ${verified.length}`);
const mediaIds=[...media.matchAll(/entityType: "(?:helmet|tire|topbox)", entityId: "([^"]+)"/g)].map(m=>m[1]);
const uniqueMedia=new Set(mediaIds);
const fallbackBlock=media.match(/export const fallbackOnlyProductMedia = \[(.*?)\] as const;/s)?.[1]||"";
const intentionallyFallbackOnly=new Set([...fallbackBlock.matchAll(/entityId:\"([^\"]+)\"/g)].map(m=>m[1]));
if(!intentionallyFallbackOnly.size)errors.push("fallback-only product media policy is empty or unreadable");
const missingMedia=verified.filter(id=>!uniqueMedia.has(id));
for(const id of missingMedia){if(!intentionallyFallbackOnly.has(id))errors.push(`verified product missing real media: ${id}`);}
for(const id of intentionallyFallbackOnly){if(uniqueMedia.has(id))errors.push(`known-dead remote media must not be restored without a checked replacement: ${id}`);}
const safeImage=read("components/SafeEntityImage.tsx");
if(!safeImage.includes("onError")||!safeImage.includes("Image unavailable"))errors.push("verified products without a checked image require the runtime image-unavailable fallback");
if(new Set(verified).size!==verified.length)errors.push("duplicate verified product IDs detected");
if(!media.includes("hasRenderableProductMedia"))errors.push("product-media availability helper missing");

const card=read("components/ProductCard.tsx");
for(const token of ["hasRenderableProductMedia","hasAffiliateLink","product-card-media","product-art"]){if(!card.includes(token))errors.push(`ProductCard media/fallback behavior missing ${token}`);}
if(card.includes("hasMedia&&hasAffiliateLink"))errors.push("affiliate CTA must not disappear merely because product media fails");
const offer=read("components/AffiliateOffer.tsx");
for(const token of ["getAffiliateLink","Check current price on Shopee","AffiliateLink"]){if(!offer.includes(token))errors.push(`AffiliateOffer purchase behavior missing ${token}`);}
if(offer.includes("hasRenderableProductMedia"))errors.push("AffiliateOffer must be controlled by approved affiliate config, not image availability");
const link=read("components/AffiliateLink.tsx");
if(!link.includes("Check price on Shopee"))errors.push("affiliate CTA must say Check price on Shopee");

for(const banned of ["Research first. Shop second.","PRODUCT PHOTO"]){
  for(const file of ["components/ProductCard.tsx","components/AffiliateOffer.tsx","components/AffiliateLink.tsx","app/gear/helmets/page.tsx"]){if(read(file).includes(banned))errors.push(`${file} contains banned preview/copy text: ${banned}`);}
}

for(const token of ['filter(p => p.status === "verified").map','p.status === "verified" && p.knownSizes','return [];']){if(!catalog.includes(token))errors.push(`public catalog research-only suppression missing ${token}`);}

const next=read("next.config.mjs");
for(const host of ["gbrands.ph","kranosgears.com","down-ph.img.susercontent.com","evohelmet.com","secmotosupply.com","teamgraphitee.com","www.tenplus.ph","dainese-cdn.thron.com","www.motoworld.com.ph","shopmotoman.com","www.shoei-europe.com"]){if(!next.includes(host))errors.push(`remote image allowlist missing ${host}`);}
const css=read("app/research-ux.css");
if(!/\.product-card-media img\{[^}]*object-fit:contain/.test(css))errors.push("product-card images are not object-fit:contain");
if(!css.includes(".product-hero>.entity-media img{object-fit:contain"))errors.push("product detail image containment missing");

const lock=JSON.parse(read("package-lock.json"));
if(lock.version!==pkg.version||lock.packages?.[""]?.version!==pkg.version)errors.push("package-lock root version does not match package.json");

const ts=loadTypeScript();
if(ts){
  for(const file of ["lib/media.ts","lib/catalog.ts","components/ProductCard.tsx","components/AffiliateOffer.tsx","components/AffiliateLink.tsx","app/gear/helmets/page.tsx"]){
    const out=ts.transpileModule(read(file),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},reportDiagnostics:true,fileName:file});
    const ds=(out.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
    if(ds.length)errors.push(`${file}: ${ds.map(d=>ts.flattenDiagnosticMessageText(d.messageText," ")).join(" | ")}`);
  }
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log(`v2.2.3 compatibility validation passed: ${verified.length-missingMedia.length}/${verified.length} verified products have checked media records; ${missingMedia.length} explicitly documented fallback-only products are covered by the runtime image fallback; Shopee CTAs depend only on approved affiliate config.`);
