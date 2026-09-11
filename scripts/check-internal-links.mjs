import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const app=path.join(root,"app");
const errors=[];

function walk(dir, out=[]){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name).split(path.sep).join("/");if(e.isDirectory())walk(p,out);else if(e.name==="page.tsx"||e.name==="route.ts")out.push(p)}return out;}
const pages=walk(app).filter(p=>!p.includes("/admin/")&&!p.includes("/api/"));
function routeFor(file){let rel=path.relative(app,path.dirname(file)).replaceAll(path.sep,"/");if(rel===".")return "/";return "/"+rel;}
function routeRegex(route){const escaped=route.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/\\\[\\\.\\\.\\\.[^\]]+\\\]/g,".+").replace(/\\\[[^\]]+\\\]/g,"[^/]+");return new RegExp(`^${escaped}/?$`);}
const routes=pages.map(file=>({file,route:routeFor(file)}));
const patterns=routes.map(r=>({ ...r, re:routeRegex(r.route) }));
const staticRoutes=new Map(routes.filter(r=>!r.route.includes("[")).map(r=>[r.route,r.file]));
const inbound=new Map([...staticRoutes.keys()].map(r=>[r,0]));

const sources=[];
for(const base of ["app","components"]){const dir=path.join(root,base);const rec=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name).split(path.sep).join("/");if(e.isDirectory()){if(p.includes("/admin/")||p.includes("/api/"))continue;rec(p)}else if(/\.tsx$/.test(e.name))sources.push(p)}};rec(dir)}

function validRoute(candidate){return patterns.some(p=>p.re.test(candidate));}
for(const file of sources){const src=fs.readFileSync(file,"utf8");
  for(const m of src.matchAll(/href=["'](\/[^"'#?]*)["']/g)){
    const href=m[1]||"/"; if(!validRoute(href))errors.push(`${path.relative(root,file).split(path.sep).join("/")} links to missing route ${href}`); if(inbound.has(href))inbound.set(href,inbound.get(href)+1);
  }
  for(const m of src.matchAll(/href=\{`(\/[^`]+)`\}/g)){
    const raw=m[1]; const candidate=raw.replace(/\$\{[^}]+\}/g,"x"); if(!validRoute(candidate))errors.push(`${path.relative(root,file).split(path.sep).join("/")} template link has no route pattern: ${raw}`);
  }
}

for(const [route,file] of staticRoutes){if(route==="/"||route.startsWith("/sitemaps/")||route.startsWith("/contact")||route.startsWith("/corrections")||route.startsWith("/search")||route.startsWith("/used-motorcycles")||route.startsWith("/price-alerts")||route.startsWith("/catalog")||route.startsWith("/deals")||route.startsWith("/sellers"))continue;const src=fs.readFileSync(file,"utf8");if(/index\s*:\s*false/.test(src))continue;if((inbound.get(route)||0)===0)errors.push(`indexable static route has no literal inbound link: ${route}`)}

// Dynamic route integrity: the electric hub exposes concrete model cards, so make
// sure every model is emitted as a build-time route rather than merely matching a
// dynamic pathname pattern. This closes the gap where a template link can pass the
// generic route check but still resolve to a 404 in production.
const electricDataFile=path.join(root,"lib/electricMotorcycles.ts");
const electricHubFile=path.join(app,"motorcycles/electric/page.tsx");
const electricDetailFile=path.join(app,"motorcycles/electric/[slug]/page.tsx");
if(fs.existsSync(electricDataFile)&&fs.existsSync(electricHubFile)&&fs.existsSync(electricDetailFile)){
  const data=fs.readFileSync(electricDataFile,"utf8");
  const hub=fs.readFileSync(electricHubFile,"utf8");
  const detail=fs.readFileSync(electricDetailFile,"utf8");
  const slugs=[...data.matchAll(/\bslug:\s*"([^"]+)"/g)].map(match=>match[1]);
  if(!hub.includes('href={`/motorcycles/electric/${model.slug}`}')) errors.push("electric motorcycle hub must link model cards to /motorcycles/electric/<slug>");
  if(!detail.includes("generateStaticParams")||!detail.includes("electricMotorcycles.map")) errors.push("electric motorcycle detail route must generate all electric model params");
  if(!detail.includes("dynamicParams = false")) errors.push("electric motorcycle detail route must reject unknown slugs and statically emit the known model set");
  if(slugs.length<3) errors.push("electric motorcycle data must retain the three published model slugs");
  for(const slug of ["vinfast-evo","vinfast-feliz-ii","vinfast-viper"]){if(!slugs.includes(slug))errors.push(`electric motorcycle data missing published route slug ${slug}`)}
}

if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log(`Internal-link audit passed: ${patterns.length} page route patterns checked; ${sources.length} source files scanned; no broken literal/template routes, generated electric-model gaps or static indexable orphans.`);
