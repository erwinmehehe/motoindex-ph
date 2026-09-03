import fs from "node:fs";
const read=(p)=>fs.readFileSync(p,"utf8");
const errors=[];
const need=(p,tokens)=>{const s=read(p);for(const t of tokens)if(!s.includes(t))errors.push(`${p} missing ${t}`)};
const pkg=JSON.parse(read("package.json"));
const [maj,min,patch]=String(pkg.version).split(".").map(Number);
if(!(maj===2&&(min>4||(min===4&&patch>=6))))errors.push(`package version must be v2.4.6 or newer within major v2, found ${pkg.version}`);
need("package.json", ['"launch:prepare": "node scripts/prepare-launch.mjs"','"validate:v246": "node scripts/validate-v246.mjs"']);
need("scripts/prepare-launch.mjs", [".env.production.local","crypto.randomBytes","--site","--email","DO NOT COMMIT"]);
need(".env.production.example", ["NEXT_PUBLIC_SITE_URL=https://motoindexph.com","NEXT_PUBLIC_CONTACT_EMAIL=hello@your-domain.com","NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS=false"]);
need("scripts/smoke-production.mjs", ["/used-motorcycles/repo","/used-motorcycles/buying-checklist","isForbiddenIndexedPath","strict-transport-security","/maintenance/motorcycle-battery"]);
if(read("scripts/smoke-production.mjs").includes('forbidden of ["/admin/","/api/","/get-quote/","/price-alerts","/deals","/used-motorcycles"')) errors.push("smoke test still uses stale blanket /used-motorcycles substring blocking");
if(errors.length){console.error("v2.4.6 compatibility validation failed:\n- "+errors.join("\n- "));process.exit(1)}
console.log(`v2.4.6 compatibility validation passed on ${pkg.version}.`);
