import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const data = JSON.parse(read("data/affiliate-links.generated.json"));
const affiliate = read("lib/affiliate.ts");
const runtime = read("lib/runtimeAffiliate.ts");
const offer = read("components/AffiliateOffer.tsx");
const link = read("components/AffiliateLink.tsx");
const redirect = read("app/go/affiliate/[productId]/[merchant]/route.ts");
const shopeeRedirect = read("app/go/shopee/[productId]/route.ts");
const api = read("app/api/affiliate-links/[productId]/route.ts");
const source = read("lib/affiliateDestinations.ts");

if (Array.isArray(data.helmetDefaults) && data.helmetDefaults.length) {
  throw new Error("Helmet marketplace CTAs must not inherit a generic homepage tracking link.");
}
for (const [id, offers] of Object.entries(data.links || {})) {
  for (const item of Array.isArray(offers) ? offers : [offers]) {
    if (item.destination === "merchant_homepage") throw new Error(id + " has a generic merchant homepage configuration.");
    if (/https:\/\/invl\.me\/(clo1b14|clo1b1b)(?:[/?#]|$)/i.test(item.url || "")) {
      throw new Error(id + " still uses an old shared shortlink.");
    }
  }
}

for (const [file, text, tokens] of [
  ["lib/affiliate.ts", affiliate, ['"shopee" | "lazada"', "getAffiliateLinks", "isKnownGenericAffiliateDestination"]],
  ["lib/runtimeAffiliate.ts", runtime, ["getRuntimeAffiliateLinks", "isKnownGenericAffiliateDestination"]],
  ["components/AffiliateOffer.tsx", offer, ["sourceListing", "not an affiliate link", "offers.map"]],
  ["components/AffiliateLink.tsx", link, ["merchant", "/go/affiliate/${encodeURIComponent(productId)}/${merchant}"]],
  ["merchant redirect route", redirect, ["merchant", "sourcedShopeeProductListing", "non-affiliate-product-source"]],
  ["Shopee compatibility route", shopeeRedirect, ["getRuntimeShopeeAffiliateLink", "sourcedShopeeProductListing"]],
  ["affiliate API", api, ["active:true", "sourceListing"]],
  ["source destination helper", source, ["isExactShopeeProductUrl", "gille-kerena"]]
]) {
  for (const token of tokens) if (!text.includes(token)) throw new Error(file + " missing " + token);
}

console.log("Helmet marketplace affiliate validation passed: no shared homepage CTAs, safe exact-item source fallback.");
