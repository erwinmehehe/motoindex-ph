import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const page = read("app/gear/helmets/[brand]/[product]/page.tsx");
const offer = read("components/AffiliateOffer.tsx");
const link = read("components/AffiliateLink.tsx");
const tokens = read("app/styles/tokens.css");
const components = read("app/styles/components.css");
const route = read("app/helmet-product.css");
const routes = read("app/styles/routes.css");

const requireText = (source, token, label) => {
  if (!source.includes(token)) throw new Error(`${label}: missing ${token}`);
};

for (const token of [
  'variant?: AffiliateOfferVariant',
  'type AffiliateOfferVariant = "full" | "compact" | "hero"',
  'if(presentation==="hero")',
  'className="affiliate-hero-actions"',
  'offers.map'
]) requireText(offer, token, "AffiliateOffer hero mode");

for (const token of [
  'hero?: boolean',
  'placement: hero ? "product_hero"'
]) requireText(link, token, "AffiliateLink hero tracking");

for (const token of [
  "--mi-color-shopee:",
  "--mi-color-lazada:"
]) requireText(tokens, token, "Marketplace tokens");

for (const token of [
  ".affiliate-hero-actions",
  ".affiliate-button.shopee",
  ".affiliate-button.lazada"
]) requireText(components, token, "Marketplace component styles");

for (const token of [
  'import { AffiliateOffer } from "@/components/AffiliateOffer"',
  'variant="hero"',
  'className="helmet-hero-commerce"',
  '<CommercePriceComparison',
  '<FaqSection',
  '<AuthorBox',
  '<RelatedLinks',
  'label: "Price"',
  'label: "Specifications"',
  'label: "Fit & sizing"',
  'label: "Visor & parts"',
  'label: "Verdict"',
  'label: "Alternatives"',
  'label: "Compare"',
  'label: "FAQ"'
]) requireText(page, token, "Verified helmet template");

for (const token of [
  ".helmet-product-page .product-detail-media>.entity-media",
  "background:#fff!important",
  ".helmet-product-page .product-facts-grid",
  ".helmet-product-page .helmet-hero-commerce",
  ".helmet-product-page .helmet-spec-grid strong",
  "overflow-wrap:anywhere!important",
  ".helmet-product-page .mini-compare-table",
  "@media(max-width:620px)",
  "min-width:560px"
]) requireText(route, token, "Helmet route styling");

requireText(routes, '@import "../helmet-product.css";', "Helmet route import");

console.log("Helmet product redesign validation passed.");
