import fs from "node:fs";

const read=(path)=>fs.readFileSync(path,"utf8");
const failures=[];
const need=(ok,message)=>{if(!ok)failures.push(message);};

for(const path of [
  "lib/privacyRetention.ts",
  "app/api/cron/privacy-retention/route.ts",
  "app/api/garage/account/data/route.ts",
  "prisma/migrations/20261004170000_add_state_contracts/migration.sql"
]) need(fs.existsSync(path),`missing ${path}`);

const migration=read("prisma/migrations/20261004170000_add_state_contracts/migration.sql");
for(const token of ["SellerOffer_status_check","PriceAlertSubscription_status_check","DealerLead_purchaseType_check","DealerLeadDelivery_status_check","NOT VALID"]){
  need(migration.includes(token),`state contract migration missing ${token}`);
}

const retention=read("lib/privacyRetention.ts");
for(const token of ["dealerLead.deleteMany","dealerApplication.deleteMany","usedListingInquiry.deleteMany","priceAlertSubscription.deleteMany","ownerSession.deleteMany","dealerSession.deleteMany","outboundClickEvent.deleteMany"]){
  need(retention.includes(token),`retention engine missing ${token}`);
}

const cron=read("app/api/cron/privacy-retention/route.ts");
need(cron.includes("timingSafeEqual"),"privacy cron secret comparison must be timing safe");
need(cron.includes("PRIVACY_RETENTION_CRON_SECRET"),"privacy cron must require its dedicated secret");

const account=read("app/api/garage/account/data/route.ts");
need(account.includes("export async function GET"),"Garage account export endpoint missing");
need(account.includes("export async function DELETE"),"Garage account deletion endpoint missing");
need(account.includes('"DELETE MY ACCOUNT"'),"Garage deletion must require explicit confirmation");
need(account.includes("usedListing.deleteMany")&&account.includes("ownerAccount.delete"),"Garage deletion must remove owner listings and account data");

const panel=read("components/GarageAccountPanel.tsx");
need(panel.includes("Download account data")&&panel.includes("Delete cloud account"),"Garage UI must expose export and deletion controls");

const launch=read("scripts/check-launch.mjs");
need(launch.includes("PRIVACY_RETENTION_ENABLED")&&launch.includes("PRIVACY_RETENTION_CRON_CONFIGURED"),"launch gate must enforce privacy retention for database deployments");


const middleware=read("middleware.ts");
need(middleware.includes("function privatePageResponse"),"private nonce CSP helper missing");
need(middleware.includes("script-src 'self' 'nonce-")&&middleware.includes("'strict-dynamic'"),"private script CSP must use a nonce and strict-dynamic");
const privateCspBlock=middleware.slice(middleware.indexOf("function privatePageResponse"),middleware.indexOf("function privateApiResponse"));
need(!privateCspBlock.includes("'unsafe-inline'")||privateCspBlock.indexOf("'unsafe-inline'")>privateCspBlock.indexOf("style-src"),"private script-src must not allow unsafe-inline");
for(const layout of ["app/admin/layout.tsx","app/garage/layout.tsx","app/dealer-portal/layout.tsx"]){
  need(fs.existsSync(layout)&&read(layout).includes('dynamic="force-dynamic"'),`${layout} must stay dynamic for nonce CSP`);
}

const privacy=read("app/privacy/page.tsx");
need(privacy.includes("Retention and automated cleanup")&&privacy.includes("Export and account deletion"),"privacy policy must disclose retention and self-service controls");

if(failures.length){
  console.error("Privacy hardening validation failed:\n- "+failures.join("\n- "));
  process.exit(1);
}
console.log("Privacy hardening validation passed.");
