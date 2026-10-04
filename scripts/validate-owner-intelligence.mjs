import fs from "node:fs";

const required=[
  "lib/ownerIntelligence.ts",
  "tests/ownerIntelligence.test.ts",
  "prisma/migrations/20261004223000_add_owner_intelligence_v2/migration.sql"
];
const failures=[];
for(const path of required)if(!fs.existsSync(path))failures.push("missing "+path);

const intelligence=fs.readFileSync("lib/ownerIntelligence.ts","utf8");
if(!intelligence.includes("OWNER_INTELLIGENCE_MIN_SAMPLE = 5"))failures.push("Owner Intelligence public threshold must stay at five contributors");
for(const rawField of ["serviceProvider","serviceLocation","invoiceReference","plate","notes"]){
  if(intelligence.includes(`eventCounts[record.${rawField}`)||intelligence.includes(`return record.${rawField}`))failures.push("raw Garage field copied into intelligence: "+rawField);
}

const schema=fs.readFileSync("prisma/schema.prisma","utf8");
for(const token of ["intelligenceConsentedAt","intelligenceMonthlyRunningCostPhp","intelligenceEventCounts"]){
  if(!schema.includes(token))failures.push("schema missing "+token);
}
const route=fs.readFileSync("app/api/owner-reviews/route.ts","utf8");
for(const token of ["intelligenceConsent","deriveOwnerIntelligenceSnapshot","Prisma.JsonNull"]){
  if(!route.includes(token))failures.push("owner review route missing "+token);
}
const publicRoute=fs.readFileSync("app/api/owner-reviews/public/route.ts","utf8");
if(!publicRoute.includes("summarizeOwnerIntelligence"))failures.push("public API is not aggregating owner intelligence");
const form=fs.readFileSync("components/GarageOwnerReviewsPanel.tsx","utf8");
if(!form.includes("Anonymous owner intelligence")||!form.includes("optional"))failures.push("explicit optional intelligence consent UI missing");
const panel=fs.readFileSync("components/OwnerReviewsPanel.tsx","utf8");
if(!panel.includes("Owner Intelligence")||!panel.includes("owner samples"))failures.push("public intelligence sample labeling missing");

if(failures.length){
  console.error("Owner Intelligence v2 validation failed:");
  failures.forEach(failure=>console.error("- "+failure));
  process.exit(1);
}
console.log("Owner Intelligence v2 validation passed.");
