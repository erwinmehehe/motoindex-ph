import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const required=["lib/offers.ts","components/OfferTable.tsx","components/PriceHistory.tsx","app/deals/page.tsx","app/api/offers/route.ts","app/admin/offers-review/page.tsx","app/go/[offerId]/route.ts"];
for(const f of required){if(!fs.existsSync(path.join(root,f)))throw new Error(`Missing ${f}`)}
const offers=fs.readFileSync(path.join(root,"lib/offers.ts"),"utf8");
if(!offers.includes('status:"demo"'))throw new Error("Demo offer safety status missing");
if(!offers.includes('status:"expired"'))throw new Error("Expired-offer test row missing");
const redirect=fs.readFileSync(path.join(root,"app/go/[offerId]/route.ts"),"utf8");
if(!redirect.includes('offer.status!=="verified"'))throw new Error("Outbound safety gate missing");
const schema=fs.readFileSync(path.join(root,"prisma/schema.prisma"),"utf8");
for(const model of ["model Seller ","model SellerOffer ","model OfferPriceObservation ","model OutboundClickEvent "]){if(!schema.includes(model))throw new Error(`Missing schema ${model}`)}
console.log("v0.6 offer-engine validation passed");
