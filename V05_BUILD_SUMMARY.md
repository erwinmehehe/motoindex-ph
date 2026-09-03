# MotoIndex PH v0.5 — Product Catalog Layer

## What shipped
- Unified `/catalog` search/filter experience.
- Helmet product records under `/gear/helmets/[brand]/[product]/`.
- Tire product records under `/tires/[brand]/[product]/`.
- Top-box product records under `/accessories/top-box/[product]/`.
- Product cards on homepage, helmet hub, tire hub, top-box category and motorcycle model pages.
- Motorcycle-first size matching for tire research.
- Capacity/use-case recommendations for top boxes with explicit bracket/load cautions.
- Research vs verified catalog status.
- Product JSON-LD without fabricated live Offer pricing.
- `/api/catalog` filtering endpoint.
- Sitemap coverage for catalog/product routes.

## Current seed catalog
- 10 helmet records
- 5 tire-family records
- 4 top-box records
- 19 total product records

Only the Shoei NXR2 record is currently marked source-backed/verified in the seed data. Other records are research architecture seeds and must be verified before live product claims or affiliate CTAs are enabled.

## Safety / quality rules encoded
- Matching a tire size string is not treated as complete fitment approval.
- Top-box capacity recommendations do not imply bracket/rack compatibility.
- Research records do not publish live product Offer schema.
- Unknown prices remain pending rather than fabricated.

## Next highest-value build
1. Product source ingestion queue and admin verification UI.
2. Real PH retailer / affiliate offer records with last-checked timestamps.
3. Exact bracket-to-bike compatibility graph for top boxes.
4. Helmet certification and size-chart ingestion.
5. Model-vs-product recommendation scoring and “best for” pages.
