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
const tokens = read("app/styles/tokens.css");
const components = read("app/styles/components.css");

const falcon = data.links?.["gille-883-falcon"];
if (!Array.isArray(falcon)) throw new Error("Falcon affiliate configuration must support multiple merchant links.");

const byMerchant = new Map(falcon.map((entry) => [entry.merchant, entry]));
if (byMerchant.get("shopee")?.url !== "https://invl.me/clo1b14") throw new Error("Falcon Shopee deep link is missing or incorrect.");
if (byMerchant.get("lazada")?.url !== "https://invl.me/clo1b1b") throw new Error("Falcon Lazada deep link is missing or incorrect.");

for (const [file, source, tokens] of [
  ["lib/affiliate.ts", affiliate, ['"shopee" | "lazada"', "getAffiliateLinks"]],
  ["lib/runtimeAffiliate.ts", runtime, ["getRuntimeAffiliateLinks", "getRuntimeShopeeAffiliateLink", 'if(row.status!=="active")return []', 'if(!checked.ok)return []']],
  ["components/AffiliateOffer.tsx", offer, ["Compare marketplace prices", "offers.map", 'type AffiliateOfferVariant = "full" | "compact" | "hero"', 'className="affiliate-hero-actions"']],
  ["components/AffiliateLink.tsx", link, ["merchant", "/go/affiliate/${encodeURIComponent(productId)}/${merchant}"]],
  ["merchant redirect route", redirect, ["merchant", "getRuntimeAffiliateLinks"]],
  ["Shopee compatibility route", shopeeRedirect, ["getRuntimeShopeeAffiliateLink"]],
  ["affiliate API", api, ["merchant:primary.merchant", "network:primary.network", "offers:"]],
  ["marketplace tokens", tokens, ["--mi-color-shopee:", "--mi-color-lazada:"]],
  ["marketplace component styles", components, [".affiliate-hero-actions", ".affiliate-button.shopee", ".affiliate-button.lazada"]],
]) {
  for (const token of tokens) if (!source.includes(token)) throw new Error(`${file} is missing ${token}`);
}

console.log("Helmet marketplace affiliate validation passed for Shopee and Lazada.");
