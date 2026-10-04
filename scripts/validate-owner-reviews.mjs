import fs from "node:fs";

const failures=[];
const need=(ok,message)=>{if(!ok)failures.push(message);};
const read=(path)=>fs.readFileSync(path,"utf8");

const required=[
  "lib/ownerReviewPolicy.ts",
  "app/api/owner-reviews/route.ts",
  "app/api/owner-reviews/public/route.ts",
  "app/admin/owner-reviews/page.tsx",
  "app/api/admin/owner-reviews/[id]/route.ts",
  "components/GarageOwnerReviewsPanel.tsx",
  "components/OwnerReviewsPanel.tsx",
  "prisma/migrations/20261004190000_add_owner_reviews/migration.sql"
];
for(const path of required)need(fs.existsSync(path),"Missing owner review file: "+path);

const schema=read("prisma/schema.prisma");
need(schema.includes("model OwnerReview"),"Prisma schema must define OwnerReview");
need(schema.includes("@@unique([ownerId, garageMotorcycleLocalId])"),"One owner review must be unique per Garage motorcycle");
need(schema.includes("garageVerifiedAt"),"Owner reviews must store Garage verification time");

const ownerRoute=read("app/api/owner-reviews/route.ts");
need(ownerRoute.includes('process.env.OWNER_REVIEWS_ENABLED==="true"'),"Owner review submissions must be feature-gated");
need(ownerRoute.includes("prisma.garageSnapshot.findUnique"),"Owner review submissions must verify the private cloud Garage");
need(ownerRoute.includes('status:"pending"'),"Owner review submissions must enter moderation");
need(ownerRoute.includes("publishedAt:null"),"Owner review edits must unpublish until re-moderated");

const publicRoute=read("app/api/owner-reviews/public/route.ts");
need(publicRoute.includes('status:"published"'),"Public API must return published reviews only");
need(!publicRoute.includes("owner:{")&&!publicRoute.includes("email:"),"Public owner review API must not expose account identity");

const policy=read("lib/ownerReviewPolicy.ts");
need(policy.includes("OWNER_REVIEW_MIN_RATING_SAMPLE = 3"),"Rating aggregates must require at least three published reviews");
need(policy.includes("OWNER_REVIEW_MIN_METRIC_SAMPLE = 5"),"Fuel and maintenance aggregates must require at least five reports");

const moderation=read("app/api/admin/owner-reviews/[id]/route.ts");
need(moderation.includes('action==="publish"')&&moderation.includes('status:"published"'),"Admin moderation must explicitly publish reviews");
need(moderation.includes('status:"rejected"'),"Admin moderation must support rejection");

const modelPage=read("app/motorcycles/[make]/[slug]/page.tsx");
need(modelPage.includes("OwnerReviewsPanel"),"Motorcycle model pages must render the owner review panel");
const env=read(".env.example");
need(env.includes("OWNER_REVIEWS_ENABLED=false"),"Owner reviews must default off in environment templates");

if(failures.length){
  console.error("Owner review validation failed:\n- "+failures.join("\n- "));
  process.exit(1);
}
console.log("Owner review validation passed: Garage linkage, moderation, privacy thresholds and fail-closed deployment gates are present.");
