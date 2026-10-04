import fs from "node:fs";

const failures=[];
const required=[
  "app/service-centers/page.tsx",
  "components/ServiceCenterFinder.tsx",
  "lib/serviceCenterPolicy.ts",
  "lib/serviceCenters.ts",
  "tests/serviceCenterPolicy.test.ts"
];
for(const path of required)if(!fs.existsSync(path))failures.push("missing "+path);

const policy=fs.readFileSync("lib/serviceCenterPolicy.ts","utf8");
for(const token of ["authorized-dealer","general-service","tires","batteries","suspension","detailing","accessories"]){
  if(!policy.includes(token))failures.push("service capability missing "+token);
}
if(policy.includes("profile.name,")||policy.includes("...profile.brands"))failures.push("service capabilities must not be inferred from business name or represented brands");

const client=fs.readFileSync("components/ServiceCenterFinder.tsx","utf8");
if(client.includes("@/lib/serviceCenters"))failures.push("client finder must not import server-side service data");
if(!client.includes("@/lib/serviceCenterPolicy"))failures.push("client finder must use browser-safe service policy");

const server=fs.readFileSync("lib/serviceCenters.ts","utf8");
if(!server.includes("allVerifiedServiceCandidates"))failures.push("server service directory must reuse verified seller candidates");

const persistent=fs.readFileSync("lib/persistentSellers.ts","utf8");
if(!persistent.includes('"service"')||!persistent.includes("persistentVerifiedServiceCandidates"))failures.push("persistent seller layer must support verified service businesses");

const types=fs.readFileSync("lib/types.ts","utf8");
if(!types.includes('"service"'))failures.push("SellerType must support service businesses");

const sitemap=fs.readFileSync("lib/sitemaps.ts","utf8");
if(!sitemap.includes('{path:"/service-centers"'))failures.push("Service Center finder missing from sitemap");

const dealers=fs.readFileSync("app/dealers/page.tsx","utf8");
if(!dealers.includes('href="/service-centers"'))failures.push("Service Center finder needs a literal inbound link");

if(failures.length){
  console.error("Service Center v1 validation failed:\n- "+failures.join("\n- "));
  process.exit(1);
}
console.log("Service Center / Shop Finder v1 validation passed.");
