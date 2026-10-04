import fs from "node:fs";

const required=[
  "lib/dealerAuth.ts",
  "app/dealer-portal/page.tsx",
  "app/api/dealer-portal/auth/request/route.ts",
  "app/api/dealer-portal/auth/verify/[token]/route.ts",
  "app/api/dealer-portal/inventory/route.ts",
  "prisma/migrations/20261004153000_add_dealer_platform_v1/migration.sql"
];
const failures=[];
for(const file of required) if(!fs.existsSync(file)) failures.push(`missing ${file}`);
const schema=fs.readFileSync("prisma/schema.prisma","utf8");
for(const token of ["model DealerAccount","model DealerMembership","model DealerMagicLink","model DealerSession","publicationSource","dealerPublishedAt","expiresAt"]) {
  if(!schema.includes(token)) failures.push(`schema missing ${token}`);
}
const auth=fs.readFileSync("lib/dealerAuth.ts","utf8");
if(!auth.includes("tokenHash")) failures.push("dealer sessions must use token hashes");
if(!auth.includes("httpOnly: true")) failures.push("dealer session cookie must be HTTP-only");
const inventory=fs.readFileSync("app/api/dealer-portal/inventory/route.ts","utf8");
for(const token of ['publicationSource:"dealer_portal"','status:"dealer_published"',"45*24*60*60*1000"]) if(!inventory.includes(token)) failures.push(`inventory safety gate missing ${token}`);
const middleware=fs.readFileSync("middleware.ts","utf8");
if(!middleware.includes('pathname === "/dealer-portal"')) failures.push("dealer portal no-store middleware missing");
if(!middleware.includes('"X-Robots-Tag", "noindex, follow"')) failures.push("server-side faceted noindex missing");
const alerts=fs.readFileSync("lib/priceAlerts.ts","utf8");
if(!alerts.includes("claimed.count!==1")) failures.push("atomic price-alert claim missing");
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("Dealer Platform v1 validation passed.");
