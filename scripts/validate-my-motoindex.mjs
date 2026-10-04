import fs from "node:fs";

const required = [
  "app/my/page.tsx",
  "app/api/my/shortlist/route.ts",
  "app/api/my/preferences/route.ts",
  "app/api/my/export/route.ts",
  "app/api/my/account/route.ts",
  "components/MyNotificationPreferences.tsx",
  "components/MyAccountControls.tsx",
  "lib/ownerNotifications.ts",
  "prisma/migrations/20261004203000_add_my_motoindex_v1/migration.sql",
];

const failures = [];
for (const path of required) if (!fs.existsSync(path)) failures.push(`missing ${path}`);

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
for (const token of ["model OwnerShortlistItem", "notificationPriceDropEmail", "notificationQuoteEmail", "ownerId             String?"]) {
  if (!schema.includes(token)) failures.push(`schema missing ${token}`);
}

const dashboard = fs.readFileSync("app/my/page.tsx", "utf8");
const accountExport = fs.readFileSync("app/api/my/export/route.ts", "utf8");
for (const token of ["Next actions", "Recent ownership activity", "Dealer requests", "MyNotificationPreferences", "MyAccountControls"]) {
  if (!dashboard.includes(token)) failures.push(`dashboard missing ${token}`);
}

if (fs.existsSync("lib/ownerReviewPolicy.ts") && !accountExport.includes("ownerReviews")) failures.push("account export must include owner review data when owner reviews are present");

const shortlist = fs.readFileSync("components/SaveToShortlistButton.tsx", "utf8");
if (!shortlist.includes("/api/my/shortlist")) failures.push("shortlist saves are not account-synced");

const middleware = fs.readFileSync("middleware.ts", "utf8");
if (!middleware.includes('pathname === "/my"') || !middleware.includes('"/api/my/:path*"')) failures.push("My MotoIndex routes are not private/no-store");

if (failures.length) {
  console.error("My MotoIndex validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("My MotoIndex v1 validation passed.");
