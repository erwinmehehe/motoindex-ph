const baseRaw = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
if (!baseRaw) { console.error("Set BASE_URL or NEXT_PUBLIC_SITE_URL to the deployed origin."); process.exit(1); }
const base = new URL(baseRaw);
if (base.protocol !== "https:" && !["localhost","127.0.0.1"].includes(base.hostname)) { console.error("Production smoke tests require HTTPS."); process.exit(1); }
const failures=[];
async function get(path, expected=200){try{const r=await fetch(new URL(path,base),{redirect:"manual"});if(r.status!==expected)failures.push(`${path}: expected ${expected}, got ${r.status}`);return r}catch(e){failures.push(`${path}: ${e instanceof Error?e.message:String(e)}`);return null}}

const publicPaths = [
  "/", "/motorcycles", "/dealers", "/dealers/manila", "/dealers/san-fernando", "/dealers/angeles-city", "/dealers/cebu-city", "/dealers/davao-city", "/robots.txt", "/sitemap.xml", "/sitemaps/motorcycles.xml", "/sitemaps/gear.xml", "/privacy",
  "/used-motorcycles/repo", "/used-motorcycles/buying-checklist",
  "/maintenance", "/maintenance/motorcycle-battery", "/maintenance/change-oil-motorcycle",
  "/ownership/motorcycle-registration-renewal"
];
for(const path of publicPaths) await get(path);

const home = await get("/");
if(home){
  for(const [header,expected] of [["x-content-type-options","nosniff"],["x-frame-options","SAMEORIGIN"],["referrer-policy","strict-origin-when-cross-origin"]]) {
    if(home.headers.get(header)!==expected) failures.push(`/: missing or unexpected ${header} header`);
  }
  if(base.protocol === "https:" && !home.headers.get("strict-transport-security")) failures.push("/: missing Strict-Transport-Security on HTTPS production response");
}

let robotsBody="";
const robots=await get("/robots.txt");
if(robots){robotsBody=await robots.text();for(const marker of ["Disallow: /admin/","Disallow: /api/","Sitemap:"])if(!robotsBody.includes(marker))failures.push(`/robots.txt missing ${marker}`);}

function isForbiddenIndexedPath(pathname){
  if (["/price-alerts","/deals","/sellers","/used-motorcycles"].includes(pathname)) return true;
  for(const prefix of ["/admin/","/api/","/get-quote/"]) if(pathname.startsWith(prefix)) return true;
  if(pathname.startsWith("/used-motorcycles/") && !["/used-motorcycles/repo","/used-motorcycles/buying-checklist"].includes(pathname)) return true;
  if(/^\/motorcycles\/[^/]+\/[^/]+\/(used-value|new-vs-used)\/?$/.test(pathname)) return true;
  return false;
}

for(const path of ["/sitemap.xml","/sitemaps/motorcycles.xml","/sitemaps/gear.xml","/sitemaps/commerce.xml"]){
  const r=await get(path);if(!r)continue;const body=await r.text();
  if(body.includes("localhost")) failures.push(`${path} contains localhost URL`);
  const urls=[...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  if(path==="/sitemaps/commerce.xml"){
    const advertised=robotsBody.includes("/sitemaps/commerce.xml");
    if(urls.length>0&&!advertised) failures.push("/robots.txt does not advertise populated commerce sitemap");
    if(urls.length===0&&advertised) failures.push("/robots.txt advertises empty commerce sitemap");
  }
  for(const raw of urls){
    try{
      const u=new URL(raw);
      if(isForbiddenIndexedPath(u.pathname)) failures.push(`${path} leaks noindex/prototype route ${u.pathname}`);
      if(path==="/sitemaps/commerce.xml") await get(u.pathname);
    }catch{failures.push(`${path} contains invalid URL ${raw}`)}
  }
}

const admin=await get("/admin/data-health",401);if(admin&&!admin.headers.get("x-robots-tag")?.includes("noindex"))failures.push("Unauthenticated admin response missing X-Robots-Tag noindex.");
for(const path of ["/price-alerts","/deals","/sellers","/used-motorcycles","/get-quote/honda/click-160","/motorcycles/honda/click-160/used-value"]){const r=await get(path,404);if(r&&!r.headers.get("x-robots-tag")?.includes("noindex"))failures.push(`${path}: prototype 404 missing X-Robots-Tag noindex`);}
for(const path of ["/sellers/demo-yamaha-dealer-a","/dealers/quezon-city"]) await get(path,404);
for(const path of ["/sellers/desmark-honda-san-fernando-pampanga","/sellers/suzuki-motorcyclecity-san-fernando","/sellers/premiumbikes-san-fernando-pampanga"]) await get(path);
for(const path of ["/sellers/yamaha-kservico-angeles","/sellers/yamaha-motor-ace-cebu-city","/sellers/yamaha-premio-davao-city"]) await get(path);
for(const path of ["/api/leads","/api/price-alerts"]){try{const r=await fetch(new URL(path,base),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"do-not-store@example.invalid",contact:"do-not-store"})});if(r.status!==410)failures.push(`${path}: expected disabled status 410, got ${r.status}`)}catch(e){failures.push(`${path}: ${e instanceof Error?e.message:String(e)}`)}}
for(const path of ["/api/offers","/api/used-listings"]){await get(path,410)}
const models=await get("/api/models");if(models){try{const body=await models.json();if(!Array.isArray(body.data)||body.data.length<1)failures.push("/api/models returned no verified launch records");for(const item of body.data||[]){if(item.freshness!=="verified")failures.push(`/api/models leaked non-verified model ${item.id||"unknown"}`);if(/pending|recheck|research only|needs verification/i.test(item.sourceLabel||""))failures.push(`/api/models leaked review-labeled model ${item.id||"unknown"}`);}}catch{failures.push("/api/models did not return valid JSON")}}
const financeOk=await get("/api/finance?price=100000&down=20&months=36&rate=12");if(financeOk){try{const body=await financeOk.json();if(!(body.estimatedMonthly>0))failures.push("/api/finance valid request returned no positive monthly estimate");}catch{failures.push("/api/finance valid request did not return valid JSON")}}
for(const path of ["/api/finance?price=100000&down=200&months=36&rate=12","/api/finance?price=100000&down=20&months=0&rate=12","/api/finance?price=100000&down=20&months=36.5&rate=12","/api/finance?price=100000&down=20&months=36&rate=-1"]){await get(path,400)}
if(failures.length){console.error("Production smoke test failed:\n- "+failures.join("\n- "));process.exit(1)}
console.log(`Production smoke test passed for ${base.origin}`);
