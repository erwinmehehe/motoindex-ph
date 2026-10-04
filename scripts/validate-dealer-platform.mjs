import fs from "node:fs";

const required=[
  "lib/dealerAuth.ts",
  "app/dealer-portal/page.tsx",
  "app/api/dealer-portal/auth/request/route.ts",
  "app/api/dealer-portal/auth/verify/[token]/route.ts",
  "app/api/dealer-portal/inventory/route.ts",
  "app/dealer-portal/leads/[deliveryId]/page.tsx",
  "components/DealerInventoryPanel.tsx",
  "lib/actionTokens.ts",
  "prisma/migrations/20261004153000_add_dealer_platform_v1/migration.sql",
  "prisma/migrations/20261004172000_hash_legacy_bearer_tokens/migration.sql"
];
const failures=[];
for(const file of required) if(!fs.existsSync(file)) failures.push(`missing ${file}`);
const schema=fs.readFileSync("prisma/schema.prisma","utf8");
for(const token of ["model DealerAccount","model DealerMembership","model DealerMagicLink","model DealerSession","publicationSource","dealerPublishedAt","expiresAt","buyerAccessTokenHash","deliveryTokenHash","confirmTokenHash","unsubscribeTokenHash"]) {
  if(!schema.includes(token)) failures.push(`schema missing ${token}`);
}
const auth=fs.readFileSync("lib/dealerAuth.ts","utf8");
if(!auth.includes("tokenHash")) failures.push("dealer sessions must use token hashes");
if(!auth.includes("httpOnly: true")) failures.push("dealer session cookie must be HTTP-only");
const inventory=fs.readFileSync("app/api/dealer-portal/inventory/route.ts","utf8");
for(const token of ['publicationSource:"dealer_portal"','status:"dealer_published"',"45*24*60*60*1000"]) if(!inventory.includes(token)) failures.push(`inventory safety gate missing ${token}`);
const leadRoute=fs.readFileSync("app/api/leads/route.ts","utf8");
if(!leadRoute.includes("buyerAccessTokenHash: hashActionToken(buyerAccessToken)")) failures.push("new buyer quote-status token must be stored hashed");
if(leadRoute.includes("deliveryToken: randomBytes")) failures.push("new dealer handoff tokens must not be persisted plaintext");
const handoff=fs.readFileSync("app/api/admin/dealer-leads/[id]/deliveries/[deliveryId]/route.ts","utf8");
if(!handoff.includes("deliveryTokenHash:hashActionToken(rawToken)")) failures.push("dealer handoff must return raw token once and persist only its hash");
const quoteStatus=fs.readFileSync("app/quote-status/[token]/page.tsx","utf8");
if(!quoteStatus.includes("buyerAccessTokenHash:hashActionToken(token)")) failures.push("buyer quote status must support hashed-token lookup");
const inventoryPanel=fs.readFileSync("components/DealerInventoryPanel.tsx","utf8");
if(!inventoryPanel.includes("Dealer-published")&&!inventoryPanel.includes("dealer-published")) failures.push("buyer inventory panel must disclose dealer-published provenance");
const modelRoute=fs.readFileSync("app/motorcycles/[make]/[slug]/page.tsx","utf8");
if(!modelRoute.includes("DealerInventoryPanel")) failures.push("motorcycle pages must surface fresh dealer inventory");
const portal=fs.readFileSync("app/dealer-portal/page.tsx","utf8");
if(portal.includes("/dealer-lead/${delivery.deliveryToken}")) failures.push("authenticated Dealer Portal must not depend on bearer links");
const middleware=fs.readFileSync("middleware.ts","utf8");
if(!middleware.includes('pathname === "/dealer-portal"')) failures.push("dealer portal no-store middleware missing");
if(!middleware.includes('"X-Robots-Tag", "noindex, follow"')) failures.push("server-side faceted noindex missing");
if(!middleware.includes('accessMode === "cloudflare"')||!middleware.includes("cf-access-jwt-assertion")) failures.push("Cloudflare Access admin mode missing");
const alerts=fs.readFileSync("lib/priceAlerts.ts","utf8");
if(!alerts.includes("claimed.count!==1")) failures.push("atomic price-alert claim missing");
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("Dealer Platform v1 validation passed.");
