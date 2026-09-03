# MotoIndex PH v1.6 — Technical + On-Page SEO Audit

Audit date: 2026-08-25 (Asia/Manila)

Scope: source-code audit of the v1.5 Next.js App Router build, top indexable templates, segmented sitemaps, robots/indexing gates, structured data, internal links, image delivery, the supplied 394-keyword PH motorcycle research workbook, and current competitor patterns on Zigwheels Philippines and Motortrade.

## Executive summary

The site already has a strong technical foundation: server-rendered Next.js routes, per-page metadata, canonicals, robots controls, segmented sitemaps, source-aware index gates, structured data primitives, and a coherent internal-link architecture. The highest-risk SEO problems were not missing meta tags; they were **index-quality leaks** and **crawl multiplication**.

v1.6 fixes the important source-level issues found in this audit. The remaining production SEO risks are operational: no reproducible npm lockfile/build in this sandbox, the scheduled Next.js security patch due 2026-08-26, no deployed Search Console/Core Web Vitals data yet, and reliance on externally hosted competitor-reference motorcycle images.

## Technical SEO findings

| Severity | Finding | Audit result | v1.6 action |
| --- | --- | --- | --- |
| High | Arbitrary `/compare/a-vs-b` URLs could become indexable, including reverse-order/thin pair permutations | Confirmed | **Fixed.** The builder can still render custom pairs, but only the curated comparison registry can be indexable. Curated set expanded to 11 useful matchups. |
| High | Indexed tire/accessory discovery surfaces exposed review-state motorcycle records | Confirmed | **Fixed.** Public discovery now uses `publicMotorcycles`, the same quality gate as model indexation. |
| High | Indexed gear/accessory hubs could surface research-status product entities | Confirmed | **Fixed.** Helmet, tire and top-box discovery surfaces now publish verified entities only. |
| High | Tire-product size matches could list review-state motorcycles on an otherwise indexable product page | Confirmed | **Fixed.** Size-match discovery now uses public/source-checked motorcycles only. |
| High | Motorcycle Product schema used one internal `Offer`/SRP even when the visible page showed broader market or variant ranges | Confirmed | **Fixed.** Broad ranges stay visible but are not mislabeled as structured offers. An exact seller-specific `Offer` is emitted only when one exact dealer observation exists. |
| Medium | Several high-intent subpages used visual breadcrumbs but not the reusable `BreadcrumbList` schema component | Confirmed | **Fixed** on price, tire-size, ownership-cost, fitment, recommendation and accessory-category templates. |
| Medium | Buying-guide selection started from all current motorcycles, then noindexed the guide if any review record appeared | Confirmed | **Fixed.** Rankings are generated from public/source-checked motorcycles first. |
| Medium | Guide cards fell back to one internal SRP instead of the market price range displayed elsewhere | Confirmed | **Fixed.** Guide cards use `observedMarketPriceLabel`. |
| Medium | Model hero image was never priority-loaded, even though it is a likely LCP element | Confirmed | **Fixed.** `EntityMedia` supports priority/sizes and model hero media uses it. |
| Medium | Default social image was SVG | Confirmed | **Fixed.** Added a 1200×630 PNG and made it the default Open Graph/Twitter image. |
| Medium | A noindex research catalog was promoted in primary/sitewide navigation | Confirmed | **Improved.** Removed `/catalog` from primary/footer discovery and replaced high-level CTAs with public gear/fitment routes. |
| Low | Search volume was still described in two docs as part of the index gate even though code no longer used it | Confirmed | **Fixed.** Launch/SEO checklists now match the actual gate. |
| Operational | No `package-lock.json`; complete clean `npm ci -> prisma -> tsc -> next build` cannot be proven | Confirmed | **Open.** Must be completed in a registry-connected build environment. |
| Operational | Next.js 15.5.21 is awaiting the scheduled 2026-08-26 security release | Confirmed from Next.js | **Open.** Keep the launch guard; upgrade to the patched 15.5 release before production traffic. |
| Content/rights | Motorcycle imagery is externally referenced from Zigwheels CDN | Confirmed | **Open.** Attribution/fallback is implemented, but permanent production media should be licensed/first-party. |
| Measurement | No deployed Search Console, URL Inspection, Lighthouse field data or CrUX data exists yet | Not possible pre-deploy | **Open.** Validate after deployment. |

## Crawl and indexation

### Good

- Canonicals are emitted through `pageMetadata()` and `metadataBase`.
- Research/review motorcycle pages fail closed through `isIndexableModel()`.
- Prototype marketplace routes are blocked in production middleware rather than merely relying on robots directives.
- Admin and ingestion surfaces are authenticated and return noindex/no-store headers.
- Segmented motorcycle/gear/commerce sitemaps use the same source-quality gates as page metadata.
- `/robots.txt` disallows admin/API areas and advertises segmented sitemaps.
- Dynamic custom comparisons remain useful to users without creating a combinatorial index footprint in v1.6.

### Still to verify after deployment

1. Fetch rendered `/robots.txt` and all sitemap XML files from the production origin.
2. Run URL Inspection on homepage, motorcycle hub, one model, one price page, one comparison, one buying guide, one helmet product and one tire product.
3. Confirm canonical URLs resolve directly with one 200 response and no host/protocol redirect chain.
4. Monitor “Crawled — currently not indexed” and duplicate/canonical reports in Search Console.
5. Validate Product and Breadcrumb markup in Google Rich Results Test after the final build.

## Structured data

MotoIndex is an aggregator/research site rather than the merchant of record. Google supports Product snippets for pages where users cannot directly purchase from the site, but it also explicitly warns not to use `AggregateOffer` merely to describe product variants. v1.6 therefore removed the old internal-SRP offer and does **not** convert broad NMAX/PCX-style variant ranges into `AggregateOffer`. An exact dealer observation can emit a seller-specific `Offer` with the dealer URL; broad variant/multi-source ranges remain visible user-facing evidence until variants and independent seller offers are modeled separately.

High-intent subpages also use `BreadcrumbList` through the shared breadcrumb component. Google notes that breadcrumbs help classify a page within the site hierarchy and recommends validating the markup after deployment.

References:
- https://developers.google.com/search/docs/appearance/structured-data/product
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb

## On-page audit by top template

### Homepage `/`

**Before:** Good structure and commercial intent, but the H1 (“Compare motorcycles before you spend”) was brand-led rather than query-led.

**v1.6:** H1 is now **“Compare motorcycle prices and specs in the Philippines.”** The title/description already cover motorcycle prices, specs and gear. The page links directly into verified models, curated guides, comparison, finder, fitment and ownership tools.

**Next after launch:** Use Search Console query/CTR data before changing the title again. Do not stuff every category into the H1.

### Motorcycle hub `/motorcycles`

Strong intent match: “Source-checked motorcycle prices in the Philippines.” It contains make/family discovery and a filterable verified model directory. Review-state records do not appear.

**Opportunity:** As the catalog grows, add server-rendered category/budget landing links above the explorer. v1.6 partly addresses this through indexable recommendation guides.

### Model detail `/motorcycles/{make}/{slug}`

Strong H1/entity clarity, price snapshot, source status, spec grid, tire links, fitment, ownership and related links. v1.6 shortens the title to `{Make} {Model} Price & Specs Philippines`, prioritizes hero media for LCP, and limits price structured data to exact seller-specific dealer observations rather than broad variant ranges.

**Open content opportunity:** Variant tables (Standard/ABS/Techmax/etc.) are a competitor strength and should become structured data rather than prose when the source layer is expanded.

### Price page `/motorcycles/{make}/{slug}/price`

Very strong commercial-intent page: exact H1, current price range, dated sources, source disagreement visibility, installment calculator and buying caveat. v1.6 adds BreadcrumbList markup.

**Open opportunity:** Add explicit variant-level price rows when the same source identifies trim names reliably. Do not generate city-price pages until there is real local price evidence.

### Compare `/compare` and `/compare/{slug}`

The builder is useful, but indexing every possible pair would create a large thin/duplicate surface. v1.6 keeps arbitrary pairs for users while indexing only 11 curated pairs. Curated comparison pages gain mechanical “edge” cards for lower starting price, power, weight, seat height, tank and ABS listing.

**Open opportunity:** Add editorial use-case conclusions only where supported by explicit logic/data; avoid generic AI paragraphs.

### Finder `/finder`

v1.5 already had budget, use case, transmission and ABS. v1.6 adds maximum seat height, maximum curb weight and category filters. This is a strong product differentiator because it exposes structured motorcycle data in a way competitor list pages generally do not.

**Open opportunity:** Add rider height only after defining a defensible mapping between rider inseam/height and motorcycle ergonomics. Seat height alone is not enough to promise fit.

### Recommendations `/recommendations/{slug}`

This was the largest on-page opportunity found in the supplied keyword map. v1.6 fixes the source-selection bug and adds four source-backed landing pages:

- `/recommendations/automatic-motorcycles-under-100k`
- `/recommendations/motorcycles-with-abs-philippines`
- `/recommendations/fuel-efficient-motorcycles-philippines`
- `/recommendations/best-underbone-motorcycles-philippines`

Existing budget, scooter, short-rider, long-ride and lightweight guides remain. Cards show market price labels rather than one stale SRP.

## Keyword-map alignment

The supplied workbook contains 394 master keywords. Its strongest model-price terms include:

- `aerox v3 price philippines` — 41,000 PH searches/month in the supplied dataset
- `nmax price philippines` — 23,000
- `aerox v2 price philippines` — 20,000
- `adv 160 price philippines` — 13,000
- `honda click 160 price philippines` — 11,000
- `pcx price philippines` — 8,300
- `fazzio price philippines` — 7,600
- `yamaha motorcycle philippines price list` — 4,800

The workbook’s Build Plan recommends the same core wedge the site is now using: model database + price/spec pages + comparisons + tire fitment + helmet brands, then buying guides/ownership depth.

## Competitor benchmark

### Zigwheels Philippines

Current NMAX pages demonstrate the breadth benchmark: 2 variants, ₱155,900–₱175,900 pricing, installment calculations, images/colors, specs, user reviews, FAQs, city pricing and alternative comparisons. This is excellent coverage but also creates many template variants. MotoIndex should not copy the city-page strategy until it has genuine city-specific price evidence.

Reference: https://www.zigwheels.ph/new-motorcycles/yamaha/nmax

### Motortrade

Motortrade is transaction-oriented: current product pages expose SRP, downpayment/monthly examples, specifications, inquiry and loan actions. For example, the current NMAX listing shows ₱155,900 with financing context and the Click 160 shows ₱116,900.

References:
- https://motortrade.com.ph/motorcycles/yamaha-new-nmax/
- https://motortrade.com.ph/motorcycles/honda-click-160/

### MotoIndex differentiation to keep

- Multi-source price transparency instead of one retailer truth.
- Source/date shown beside changing facts.
- Exact motorcycle tire sizes and fitment research.
- Curated comparisons plus a user-controlled comparison builder.
- Finder by weight/seat/transmission/ABS/use case.
- Ownership cost and LTO guidance.
- A smaller indexable footprint with stronger evidence rather than mass-generated city/keyword permutations.

## Priority backlog after v1.6

### P0 — before production launch

1. Upgrade to the patched Next.js 15.5 security release after it publishes on 2026-08-26.
2. Generate/commit a real npm lockfile in a registry-connected environment.
3. Run `npm ci`, `npm run verify:launch`, and a clean production `next build`.
4. Deploy with the real site URL/contact/admin secrets.
5. Run the production smoke test, Rich Results Test and Search Console URL Inspection.

### P1 — first post-launch growth build

1. Expand from 18 source-checked market-price motorcycles to 35–50.
2. Add structured variant/trim prices for the biggest scooter families.
3. Replace external-reference motorcycle imagery with licensed manufacturer/dealer assets where rights permit.
4. Add a third durable Philippine price source where useful.
5. Start storing dated price snapshots so actual price history can be shown.

### P2 — measurement-led

After two to four weeks of Search Console data, prioritize pages ranking positions 5–20, queries with high impressions/low CTR, and models users search for that are missing from MotoIndex. Do not expand programmatic pages only because a keyword variation exists.
