import { loadTypeScript } from "./load-typescript.mjs";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
const ts=loadTypeScript();
const root=process.cwd(); const errors=[]; const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const posix=(value)=>value.split(path.sep).join("/");
const exists=p=>fs.existsSync(path.join(root,p));

for(const f of ["lib/site.ts","lib/internalLinks.ts","lib/search.ts","lib/sitemaps.ts","components/Breadcrumbs.tsx","components/RelatedLinks.tsx","components/JsonLd.tsx","public/brand/motoindex-mark.svg","public/brand/motoindex-og.svg","SEO_CHECKLIST.md"]){if(!exists(f))errors.push(`missing ${f}`)}
for(const f of ["app/about/page.tsx","app/methodology/page.tsx","app/data-sources/page.tsx","app/editorial-policy/page.tsx","app/corrections/page.tsx","app/contact/page.tsx"]){if(!exists(f))errors.push(`missing trust page ${f}`)}

const layout=read("app/layout.tsx");
if((layout.match(/<Header/g)||[]).length!==1||(layout.match(/<Footer/g)||[]).length!==1)errors.push("root layout must own exactly one Header and Footer");
for(const token of ["Organization","WebSite","SearchAction"])if(!layout.includes(token))errors.push(`layout missing ${token}`);
if(!/motoindex-og\.(svg|png)/.test(layout))errors.push("layout missing branded social image");

const robots=read("app/robots.ts");
if(robots.includes('"/search"'))errors.push("robots must not block /search because search uses meta noindex");
for(const sm of ["/sitemap.xml","/sitemaps/motorcycles.xml","/sitemaps/gear.xml"])if(!robots.includes(sm))errors.push(`robots missing sitemap ${sm}`);
if(robots.includes("/sitemaps/commerce.xml"))errors.push("robots must not advertise the empty commerce sitemap");

const sitemaps=read("lib/sitemaps.ts");
if(/tireProducts\.map/.test(sitemaps)||/topBoxProducts\.map/.test(sitemaps))errors.push("gear sitemap must filter product verification status before mapping");
if(!sitemaps.includes('tireProducts.filter(p=>p.status==="verified")'))errors.push("verified tire sitemap gate missing");
if(!sitemaps.includes('topBoxProducts.filter(p=>p.status==="verified")'))errors.push("verified top-box sitemap gate missing");
if(sitemaps.includes("new Date()"))errors.push("sitemap lastmod must not reset to request time");

const publicPages=[];
function walk(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const rel=path.join(dir,e.name).split(path.sep).join("/");if(e.isDirectory())walk(rel);else if(e.name==="page.tsx"&&!posix(rel).startsWith("app/admin/"))publicPages.push(rel)}}
walk("app");
for(const f of publicPages){const src=read(f);if(!src.includes("pageMetadata")&&!src.includes("permanentRedirect"))errors.push(`${f} does not use canonical metadata helper or a permanent canonical redirect`)}

const primaryPages=["app/motorcycles/[make]/[slug]/page.tsx","app/gear/helmets/[brand]/[product]/page.tsx","app/gear/helmets/[brand]/page.tsx","components/HelmetCategoryView.tsx","app/compare/[slug]/page.tsx","app/tires/[slug]/[product]/page.tsx","app/accessories/top-box/[product]/page.tsx"];
for(const f of primaryPages){let src=read(f);if(f==="app/motorcycles/[make]/[slug]/page.tsx"&&src.includes("MotorcycleEntityPage"))src+=read("components/MotorcycleEntityPage.tsx");if(!src.includes("RelatedLinks"))errors.push(`${f} missing contextual internal links`)}
for(const f of ["app/motorcycles/[make]/[slug]/page.tsx","app/gear/helmets/[brand]/[product]/page.tsx","components/HelmetCategoryView.tsx","app/compare/[slug]/page.tsx"]){let src=read(f);if(f==="app/motorcycles/[make]/[slug]/page.tsx"&&src.includes("MotorcycleEntityPage"))src+=read("components/MotorcycleEntityPage.tsx");if(!src.includes("Breadcrumbs"))errors.push(`${f} missing breadcrumb component`)}

const titles=[];
for(const f of publicPages){const src=read(f);for(const m of src.matchAll(/pageMetadata\(\{\s*title:\s*["']([^"']+)["']/g))titles.push([m[1],f]);}
const seen=new Map(); for(const [t,f] of titles){if(seen.has(t))errors.push(`duplicate static metadata title: ${t} in ${seen.get(t)} and ${f}`);else seen.set(t,f)}

const header=read("components/Header.tsx"),footer=read("components/Footer.tsx"),logo=read("components/MotoIndexLogo.tsx");
if(!header.includes("MotoIndexLogo")||!footer.includes("MotoIndexLogo")||!logo.includes("/brand/motoindex-mark.svg"))errors.push("shared MotoIndexLogo component not wired into header/footer");
for(const href of ["/about","/methodology","/data-sources","/editorial-policy","/corrections","/contact"])if(!footer.includes(`href=\"${href}\"`))errors.push(`footer missing ${href}`);

const files=[]; for(const base of ["app","components","lib"]){const recur=d=>{for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const rel=path.join(d,e.name).split(path.sep).join("/");if(e.isDirectory())recur(rel);else if(/\.(tsx|ts)$/.test(e.name))files.push(rel)}};recur(base)}
for(const rel of files){const out=ts.transpileModule(read(rel),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},fileName:rel,reportDiagnostics:true});for(const d of out.diagnostics||[])if(d.category===ts.DiagnosticCategory.Error)errors.push(`${rel}: ${ts.flattenDiagnosticMessageText(d.messageText," ")}`)}
if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log(`v1.3 validation passed: canonical metadata on ${publicPages.length} public page files, split sitemap gates, trust pages, internal-linking, shared brand assets, ${files.length} TS/TSX files syntax clean.`);
