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
const articleSchema = read("lib", "articleSchema.ts");
const guidePage = read("app", "guides", "[slug]", "page.tsx");
const ownershipCalculator = read("app", "ownership", "cost-calculator", "page.tsx");
const commuteCalculator = read("app", "commute", "cost-calculator", "page.tsx");
const priorityBrief = read("components", "PriorityModelBrief.tsx");
const authorProfile = read("app", "authors", "erwin-valles", "page.tsx");

requireText(home, "Compare <span>motorcycle prices</span><br />and specs in the Philippines.", "Homepage must keep a query-led motorcycle prices/specs H1.");
forbidText(home, "Your next <span>motorcycle</span><br />starts here.", "Homepage must not regress to the old brand-led H1.");
forbidText(home, "/motorcycles?budget=under100", "Homepage should link the under-100K intent to the consolidated recommendation section, not a crawlable filter URL.");
requireText(motorcycles, "<h1>Motorcycle prices", "Motorcycle hub must keep a query-led H1 that starts with Motorcycle prices.");
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

requireText(articleSchema, "datePublished?: string;", "Article schema must accept a real page-level publication date.");
requireText(articleSchema, "image?: string;", "Article schema must accept a representative image.");
requireText(articleSchema, "...(published ? { datePublished: published } : {})", "Article schema should emit datePublished only when a real publication date exists.");
requireText(articleSchema, 'image: { "@type": "ImageObject", url: absoluteUrl(image) }', "Article schema should expose an ImageObject when an editorial image is supplied.");
forbidText(articleSchema, "datePublished: RELEASE_DATE", "Article schema must not make every article look published on the global release date.");
requireText(guidePage, '"motorcycle-helmet-size-guide": "2026-09-08"', "Helmet sizing guide must retain its real publication date.");
requireText(guidePage, '"motorcycle-helmet-certification-philippines": "2026-09-08"', "Helmet certification guide must retain its real publication date.");
requireText(guidePage, "<time dateTime={publishedAt}>", "Editorial guides should expose a machine-readable visible publication date.");
requireText(guidePage, "Put this guide to work", "Editorial guides should link readers into model-level research and methodology.");
requireText(guidePage, "image: GUIDE_IMAGE", "Editorial guide metadata and Article schema should keep representative imagery.");
requireText(ownershipCalculator, "item.id === bike", "Ownership calculator should support model-specific deep links.");
requireText(ownershipCalculator, "How the ownership estimate works", "Ownership calculator must retain explanatory methodology content.");
requireText(ownershipCalculator, "Use total cost to compare motorcycles", "Ownership calculator should remain a buyer-decision resource, not a bare utility.");
requireText(commuteCalculator, "What the commute estimate includes", "Commute calculator must retain explanatory methodology content.");
requireText(commuteCalculator, "Turn the commute number into a buying decision", "Commute calculator should connect operating cost to the wider buyer journey.");
requireText(priorityBrief, '/ownership/cost-calculator?bike=${model.id}', "Priority model pages should deep-link into ownership cost with the current model selected.");
requireText(priorityBrief, '/commute/cost-calculator?bike=${model.id}', "Priority model pages should deep-link into commute cost with the current model selected.");
requireText(priorityBrief, 'href="/dealers"', "Priority model pages should keep a dealer research next step.");
requireText(priorityBrief, '"cfmoto-450mt"', "CFMOTO 450MT should retain a focused buyer brief.");
requireText(priorityBrief, '"cfmoto-450sr"', "CFMOTO 450SR should retain a focused buyer brief.");
requireText(authorProfile, 'href="/data-sources"', "Author profile should expose the data-source policy.");
requireText(authorProfile, 'href="/corrections"', "Author profile should expose the correction path.");
requireText(authorProfile, "Selected buyer research", "Author profile should connect the author entity to representative research.");

if (errors.length) {
  console.error("SEO hardening validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SEO hardening validation passed.");
