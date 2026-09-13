import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const errors = [];
const requireText = (file, text, message) => {
  if (!file.includes(text)) errors.push(message);
};
const forbidText = (file, text, message) => {
  if (file.includes(text)) errors.push(message);
};

const home = read("app", "page.tsx");
const motorcycles = read("app", "motorcycles", "page.tsx");
const faq = read("components", "FaqSection.tsx");
const jsonLd = read("components", "JsonLd.tsx");
const media = read("components", "EntityMedia.tsx");
const modelRoute = read("app", "motorcycles", "[make]", "[slug]", "page.tsx");
const modelSeo = read("lib", "motorcycleEntitySeo.ts");
const sitemaps = read("lib", "sitemaps.ts");
const mediaValidator = read("scripts", "validate-media.mjs");

requireText(home, "Compare <span>motorcycle prices</span><br />and specs in the Philippines.", "Homepage must keep a query-led motorcycle prices/specs H1.");
forbidText(home, "Your next <span>motorcycle</span><br />starts here.", "Homepage must not regress to the old brand-led H1.");
forbidText(home, "/motorcycles?budget=under100", "Homepage should link the under-100K intent to the consolidated recommendation section, not a crawlable filter URL.");
requireText(motorcycles, "<h1>Motorcycle prices in the Philippines</h1>", "Motorcycle hub must keep its query-led H1.");
requireText(motorcycles, "href=\"/recommendations#budget\"", "Motorcycle hub should route under-100K intent to the consolidated guide.");
forbidText(faq, "FAQPage", "Visible FAQs should not emit deprecated FAQPage rich-result markup.");
forbidText(faq, "JsonLd", "FaqSection should remain visible HTML without JSON-LD.");
requireText(jsonLd, 'value["@type"] === "FAQPage"', "JsonLd must suppress any legacy/manual FAQPage objects.");
requireText(jsonLd, 'offer["@type"] !== "AggregateOffer"', "Motorcycle Product JSON-LD must suppress ambiguous variant-range AggregateOffer markup.");
requireText(jsonLd, 'value.category.startsWith("Motorcycle")', "AggregateOffer cleanup must stay scoped to motorcycle Product markup.");
requireText(media, 'entityType === "motorcycle" && priority', "Priority motorcycle media should expose image provenance by default.");
requireText(mediaValidator, "rightsStatus", "Media validation must enforce explicit rights status.");
requireText(mediaValidator, "rightsHolder", "Media validation must enforce a rights holder.");
requireText(mediaValidator, "sourceLabel and sourceUrl provenance", "External/licensed media must keep visible source provenance metadata.");
requireText(modelRoute, 'getRenderableMedia("motorcycle", model.id)[0]?.src', "Model metadata should use model-specific social imagery when available.");
requireText(modelSeo, "firstTitleThatFits", "Model SEO titles should use length-aware title selection.");
requireText(modelSeo, "limit = 60", "Model SEO title selection should target a 60-character ceiling.");
requireText(sitemaps, "latestModelDate", "Sitemaps should derive hub freshness from model source checks.");
requireText(sitemaps, "latestHelmetDate", "Sitemaps should derive helmet hub freshness from verified product checks.");
requireText(sitemaps, "latestSellerDate", "Sitemaps should derive dealer hub freshness from public seller checks.");
forbidText(sitemaps, "`/motorcycles/${make}/scooters`", "Redirect-only brand scooter aliases must stay out of sitemaps.");
forbidText(sitemaps, "`/motorcycles/${m.makeSlug}/${m.slug}/price`", "Consolidated model price aliases must stay out of sitemaps.");

if (errors.length) {
  console.error("SEO hardening validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SEO hardening validation passed.");
