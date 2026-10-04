import fs from "node:fs";

const read=file=>fs.readFileSync(file,"utf8");
const errors=[];
const need=(ok,msg)=>{if(!ok)errors.push(msg)};

const pkg=JSON.parse(read("package.json"));
need(pkg.dependencies?.next==="15.5.27","Next.js must remain on patched 15.5.27");
need(pkg.devDependencies?.["eslint-config-next"]==="15.5.27","eslint-config-next must match Next.js 15.5.27");
need(pkg.devDependencies?.vitest==="5.0.3","Vitest regression dependency missing");
need(pkg.devDependencies?.["@playwright/test"]==="1.63.0","Playwright regression dependency missing");

const schema=read("prisma/schema.prisma");
for(const token of ["buyerAccessTokenHash","deliveryTokenHash","model DealerAccount","model DealerSession"]){
  need(schema.includes(token),`Prisma schema missing ${token}`);
}

const leads=read("app/api/leads/route.ts");
need(leads.includes("buyerAccessTokenHash: hashBearerToken(buyerAccessToken)"),"New buyer quote tokens must be hashed at rest");
need(leads.includes("buyerAccessToken: null"),"New buyer quote flows must not persist raw bearer tokens");
need(!leads.includes("deliveryToken: randomBytes"),"New dealer deliveries must not persist raw bearer links");

const adminDelivery=read("app/api/admin/dealer-leads/[id]/deliveries/[deliveryId]/route.ts");
need(adminDelivery.includes("deliveryTokenHash:hashBearerToken(token)"),"Dealer handoff links must be stored by hash");
need(adminDelivery.includes("deliveryToken:null"),"Dealer handoff raw token must be cleared");

const priceAlerts=read("app/api/price-alerts/route.ts");
need(priceAlerts.includes('priceAlertActionToken(subscription.id,email,"confirm")'),"Price-alert confirmation links must be signed");
need(priceAlerts.includes("confirmToken:null")&&priceAlerts.includes("unsubscribeToken:null"),"New price alerts must not store raw action tokens");

const adminPolicy=read("lib/adminAuthPolicy.ts");
const middleware=read("middleware.ts");
need(adminPolicy.includes('"cloudflare-access"'),"Cloudflare Access auth mode missing");
need(middleware.includes("cf-access")||middleware.includes("adminAccessIdentityAllowed"),"Admin middleware must enforce Access identity in Access mode");

const modelPage=read("components/MotorcycleEntityPage.tsx");
need(modelPage.includes("DealerInventoryOffers"),"Motorcycle pages must surface fresh dealer inventory");
need(modelPage.includes('entityType:"motorcycle",entityId:model.id'),"Dealer inventory must be scoped to the current motorcycle");

for(const file of ["tests/actionTokens.test.ts","tests/adminAuthPolicy.test.ts","tests/e2e/security-and-seo.spec.ts","playwright.config.ts"]){
  need(fs.existsSync(file),`Missing behavioral test file ${file}`);
}

if(errors.length){console.error("Security/product hardening validation failed:\n- "+errors.join("\n- "));process.exit(1)}
console.log("Security/product hardening validation passed.");
