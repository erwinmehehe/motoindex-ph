# Current priority — launch-ready commerce maintenance (v2.9.1)

The persistent ingestion engine is built but intentionally paused as a product priority. The next releases should improve what visitors can use and what search engines can understand before adding more backend automation.

**Accessory Commerce v1 is completed and production-hardened in v2.9.1.** The next monetization milestone is `Dealer Lead Foundation v1`, but it remains gated until a real partner, consent, source, routing and operational workflow exists. Until that gate clears, deepen verified accessory offer coverage and freshness rather than re-enabling prototype dealer/finance/used-market flows.

1. Ship and monitor the maintenance/parts hub and refreshed registration/helmet-brand pages.
2. Parse exact owner-manual maintenance schedules for the highest-traffic scooters (NMAX, Aerox, ADV and Fazzio) before indexing model maintenance pages.
3. Deepen gloves, jacket and rain-gear commerce only with real checked products and sizing/fitment evidence.
4. After launch, use Search Console impressions, CTR and query/page overlap to update titles, internal links and roadmap priorities before creating more pages.
5. Build local shop/dealer discovery only after enough real businesses can be verified; do not template thin city/category pages.
6. Keep automated ingestion, seller onboarding and price alerts on hold until public traffic and partner demand justify the operational complexity.

The current keyword workbook is `research/ph_motorcycle_seo_300plus_keywords_current_roadmap_v245.xlsx`.

---

# MotoIndex PH Production Roadmap

## v0.4 — Recommendation + compatibility engine

Built in this iteration:
- 16 seeded motorcycle records (all seed/review data until verified)
- Data-driven recommendation pages by budget, rider fit, category and use case
- Model-first fitment finder
- Structured accessory research profiles with confidence/caution states
- Model accessory pages powered by the same fitment engine
- Homepage buyer-guide discovery
- Sitemap coverage for recommendation and fitment routes

# Production roadmap

## Milestone 1 — Data-backed MVP
- PostgreSQL + Prisma repository
- 30–50 verified PH motorcycles
- current SRP records with source history
- tire fitment for every model
- 20 comparisons
- 10–15 helmet brand hubs
- auth-protected data-health dashboard

## Milestone 2 — Commercial layer
- dealer directory + city coverage
- dealer quote lead form
- finance-offer ingestion and expiry
- affiliate product records for helmets/tires/top boxes
- event tracking: dealer_quote_start, finance_calculator_use, affiliate_product_click

## Milestone 3 — Fitment moat
- normalized tire product catalog
- compatibility engine by width/aspect/rim + manual review flags
- top-box/accessory compatibility graph
- alternative-fitment caveats and reviewer approval

## Milestone 4 — Editorial + ownership
- LTO registration / renewal / transfer guides sourced from official pages
- insurance comparison layer
- maintenance data by model where official service info is available
- editorial review workflow and author attribution

## SEO launch gate
Do not index a generated page unless it has:
1. unique intent and useful structured data,
2. current source provenance,
3. at least one meaningful internal-link parent,
4. no unresolved conflicting core facts,
5. content beyond keyword substitution.

## Product layer completed in v0.3
- Homepage quick finder with search + budget filtering
- Budget discovery entry points
- Filterable motorcycle directory
- Accessories hub and category routes
- Model-specific accessory guide routes
- Helmet brand hub routes
- Dealer / financing request flow and prototype leads API
- Updated sitemap/internal linking for new indexable routes
- Standalone homepage preview in `preview/homepage.html`

## Next product milestone
1. Expand verified motorcycle inventory from 8 seed records to the first 30-50 priority models.
2. Add real helmet model/product records under each brand.
3. Build tire product + fitment records, not only stock sizes.
4. Add accessory SKU + bracket compatibility records.
5. Add editorial buying guides generated from real database relationships (best under budget, best for commuting, model-vs-model).
6. Add dealer directory and city landing pages once partner/source data is available.

## v0.5 — product catalog layer (built)
- Unified helmet/tire/top-box catalog.
- Individual product routes with transparent research/verified status.
- Tire stock-size matching engine with fitment caveats.
- Top-box capacity/use-case candidate logic.
- Product catalog API and expanded sitemap.

## v0.6 recommended
- Admin/source verification queue.
- Retailer offer table (seller, URL, price, observed_at, affiliate flag).
- Exact accessory mounting-part graph.
- Price history and deal freshness UI.


## v0.6 — Price tracker + offer engine (built)

- Stable product/model entities are separated from volatile seller offers.
- Seller offers support cash price, down payment, monthly payment, term, stock state, observed/verified timestamps and affiliate/dealer destinations.
- Demo and expired offers are blocked from outbound seller redirects.
- Public `/deals` and per-entity offer tables are implemented.
- Price-history observations are implemented for the UI/data model.
- Internal `/admin/offers-review` queue is implemented.
- `/api/offers` provides a read endpoint for future search/admin clients.
- Prisma now includes Seller, SellerOffer, OfferPriceObservation and OutboundClickEvent models for later Postgres/Supabase activation.

### Next production milestone

Replace demo offers with source-backed retailer/dealer feeds or manual verification, then add scheduled expiry checks and persistent outbound analytics.


## v0.7 — seller network and ingestion
- Verify real seller/business records before indexation.
- Connect price alerts with double opt-in email delivery.
- Stage partner/dealer CSV/API feeds before manual/source verification.
- Require seller identity + recent source-backed offers before public seller pages.


## v0.8 completed
- Unified header/nav/footer system across every route.
- Ownership-cost calculator, model-specific cost pages, used-value hub and depreciation tools.
- Per-model used-value pages remain noindex pending real listing comps.

## v0.9 completed — used market + copy quality
- Rewrote public copy across the homepage, directories, product pages, seller pages and buyer tools to remove internal/templated product language.
- Added a public-copy validation gate and `COPY_STYLE.md`.
- Removed SEO metrics from rider-facing cards and hubs.
- Added normalized used-listing records with year, mileage, condition, asking price, location and seller type.
- Added market-range summaries and price-outlier filtering.
- Added used-listing browsing and per-model new-vs-used comparisons.
- Added `/api/used-listings` and `/admin/used-listings`.
- Used-market routes remain noindex until verified listing feeds are connected.

## Next production milestone — official ownership data
1. Build source-backed LTO registration, renewal and transfer-of-ownership guides.
2. Store effective dates and source URLs for fees and requirements instead of hard-coding them into articles.
3. Add motorcycle insurance provider/product records with clear CTPL vs comprehensive differences.
4. Add model maintenance schedules only where official manuals/service information can be sourced.
5. Connect the first verified real seller and used-listing feeds; then selectively open those pages to indexing.

## v1.0 — Search-volume-priority model expansion
Completed:
- Aerox V2 and NMAX V2 as distinct previous-generation entities.
- Aerox and NMAX family hubs for generic model-price intent.
- Brand motorcycle price-list hubs.
- Historical-price safeguards and successor routing.
- Sitemap/noindex quality gates to keep unresolved seed models out of the index.

### Next priority
Build depth for the five highest-demand helmet brands already in the keyword map: KYT, Spyder, Gille, EVO and SEC. Do not create separate pages for `brand`, `brand price`, and synonym variants; strengthen one brand hub with real models, certifications, sizes, price observations and sources.

## v1.1 completed — helmet brand depth

The five largest helmet-brand demand clusters now have source-backed brand/product depth: KYT, Spyder, Gille, EVO and SEC. Brand indexing is gated by verified product depth. Research-only helmet products are noindex and excluded from the sitemap.

### Next search-volume priorities

1. Build a verified half-face helmet dataset before creating a half-face category hub.
2. Replace research-only top-box records with real products, rack/plate requirements and current sources; then strengthen the top-box hub.
3. Build a modular helmet comparison from the verified catalog.
4. Deepen model tire-fitment data for ADV 160, Aerox, NMAX and Honda Click rather than generating generic tire keyword pages.


## v1.2 completed — high-volume gaps
- CRF150L model hub
- Half-face/open-face helmet category
- Modular helmet category
- Full-face helmet category
- Helmet brands comparison
- Rook, HJC, AGV and Arai source-backed depth

### v1.2 follow-up
Completed in v1.4: top-box bracket compatibility and source-backed tire-size coverage for the highest-demand scooters.

## Completed — v1.3 technical SEO / internal-linking / trust foundation

- Shared canonical + Open Graph metadata helper across all public page files.
- Organization/WebSite JSON-LD and working search action.
- Segmented motorcycle, gear and commerce sitemaps with source-based lastmod dates.
- Research-only product sitemap/indexing gates.
- Contextual internal-link blocks across core entity pages.
- BreadcrumbList schema on primary entity/detail pages.
- About, methodology, data-sources, editorial-policy and correction/contact pages.
- Shared MotoIndex SVG brand mark/favicon/OG asset.
- Cross-entity site search.
- v1.3 technical SEO validator.

## Completed — v1.4 source-backed fitment / ownership layer

- Added explicit top-box product → motorcycle → rack/plate fitment edges; verified SHAD edges are used by model and accessory routes instead of capacity heuristics.
- Added a verified Pirelli Angel Scooter manufacturer size catalog covering the stock sizes used by the five priority scooter records; research tire families remain gated.
- Added a rights-aware `next/image` media pipeline and persistent `MediaAsset` contract. Real photography remains gated by first-party/licensed asset availability.
- Added current-source LTO registration renewal and ownership-transfer guides plus an Insurance Commission-backed CTPL/comprehensive guide.
- Added the persistent maintenance-record contract. Exact model maintenance intervals remain unpublished until owner/service-manual evidence is available for the exact model/market.
- Fixed sitemap/indexing inconsistencies and made validators portable.

### Next production priorities
1. Acquire/store rights-cleared motorcycle, helmet, tire and top-box photography and populate `EntityMedia` / `MediaAsset` source records.
2. Confirm the exact Philippine NMAX V3 ↔ SHAD 2025–2026 Turbo/Neo rack mapping before promoting that edge from research to verified.
3. Source exact-market owner/service manuals and populate model-specific `MaintenanceRecord` intervals without borrowing schedules across generations.
4. Replace remaining seed/review motorcycle records with current verified PH manufacturer/dealer source records.
5. Connect Postgres repositories plus authenticated admin, live seller/used-listing feeds and scheduled verification/expiry jobs.


## Completed — v1.4.1 launch hardening
- Replaced demand-only motorcycle indexation with current-source verification gates.
- Promoted Click160 after primary-source validation; all incomplete motorcycle records remain review/noindex.
- Removed review-state motorcycles from indexed discovery surfaces and cross-entity tire matches.
- Disabled prototype dealer/alert/demo-offer/used-listing flows for production and removed their public launch links.
- Protected admin/ingestion surfaces with server-only authentication.
- Added privacy, exact dependency pins, launch preflight and production smoke testing.

### Immediate post-launch data priority
1. Verify ADV160 and PCX160 complete current specifications from exact-market primary sources.
2. Verify Aerox/NMAX current variants, prices and specifications from Yamaha Philippines primary sources.
3. Re-open comparisons/recommendation guides automatically as enough verified model records clear their gates.
4. Add manual-backed maintenance intervals only after exact model/year evidence is stored.
5. Build persistent seller/used-market infrastructure as a separate authenticated/consented release rather than weakening the research launch.


## Completed — v1.5 competitor market intelligence + discovery
- Added 18-model current PH competitor/comparison-site price coverage and 14 dealer cross-checks.
- Added source-visible market price ranges and disagreement handling.
- Added attributed external motorcycle-image references for the same 18 priority models.
- Added six missing priority motorcycles.
- Added a full model finder and compare-any-two builder backed by structured records.
- Removed search-volume dependence from the motorcycle index gate.

### Next measurable expansion
1. Add a third current price source where model/trim identity can be matched cleanly.
2. Replace external-reference photography with manufacturer-authorized or licensed assets for production.
3. Expand the same market-price + image + spec coverage to the next 20 highest-demand PH motorcycles.
4. Add price-change history only after repeated dated observations exist; do not fabricate historical curves from a single snapshot.

## v1.6 completed — audit-driven SEO/discovery

- Curated-only comparison indexation.
- Source-safe public discovery surfaces.
- Four additional database-backed buying guides.
- Finder seat-height, weight and category filters.
- Seller-specific Offer markup where exact dealer evidence exists + broader BreadcrumbList implementation.
- See `SEO_AUDIT_V16.md` for the next P0/P1 backlog.


## Completed — v1.7 current-model catalog + third price source

- Added 24 current Philippine model-level motorcycle records; no trim/variant route expansion.
- Expanded the current verified/public model set to 42 motorcycles.
- Added Wheeltek as a third independent live dealer-price source with 11 dated observations and preserved cross-source disagreement instead of averaging it away.
- Added source-attributed external image references for all 24 new models, preferring Suzuki/Kawasaki manufacturer hosting and using Wheeltek/Motortrade authorized-dealer references where appropriate.
- Added remote-image allowlisting for the new source hosts and retained visible image-source attribution.
- Fixed the ABS recommendation word-boundary matcher.

### Highest-impact remaining work after v1.7
1. Complete the real production toolchain gate: reproducible npm lockfile, patched Next.js 15.5.x security release, production environment values, clean build and deployed smoke test.
2. **Completed in v2.1.1:** replaced all legacy Zigwheels motorcycle image hotlinks and generic motorcycle placeholders with 50/50 distinct, attributed real model images; external references remain credited and are not represented as MotoIndex-owned/licensed.
3. Add scheduled price refresh + immutable dated snapshots, freshness badges and price-change diffs. Do not create fake history from the 2026-08-25 snapshot.
4. Expand beyond the Japanese Big Four into current PH brands with meaningful demand (for example Kymco, Vespa, CFMoto, KTM and TVS), using the same model-level/source rules.
5. Populate manual-backed maintenance schedules and consumable/service data. Suzuki already exposes useful official after-sales/manual material and is a good first maintenance-data cohort.
6. Run post-deploy Core Web Vitals/Lighthouse and Search Console crawl/index coverage against the real production origin; source-level checks cannot substitute for field data.
7. Add privacy-safe product analytics for finder/search/compare usage so the next catalog/guide expansion follows actual demand.


## Completed — v1.8 ownership, fit and research tools

- Added explicit lifecycle status and surfaced generation/successor context without creating variant pages.
- Upgraded ownership cost to 1-year/3-year cash + finance planning.
- Added model-specific rider-fit and fuel/range tools plus richer finder preferences.
- Added structured site search for budget, engine class, transmission, ABS, seat/weight and fuel-economy intent.
- Added local/shareable shortlists and noindex three-way comparisons.
- Added similar/cheaper/lower-seat alternatives and source-check update logs.
- Connected official Honda/Yamaha/Suzuki/Kawasaki maintenance and safety resources; exact schedules stay gated behind manual evidence.
- Added model tire-pressure/maintenance/accessory crosslinks.
- Added optional GA4/Plausible instrumentation and expanded protected data-health operations.
- Price history remains deliberately excluded.

### Highest-impact remaining work after v1.8
1. Complete the dependency-backed production build and deployment smoke test once the launch security/dependency gate is satisfied.
2. Replace remaining legacy competitor hotlinked imagery with explicitly permissioned/licensed, manufacturer-approved or first-party files.
3. Transcribe exact-model owner-manual maintenance tables for the highest-traffic models, beginning with the priority scooters.
4. Improve source-listed fuel-consumption coverage; keep estimated figures noindex/labeled until sourced.
5. Add official model-specific safety notices only when a manufacturer notice can be tied confidently to the exact catalog entity.
6. Connect analytics in production and use Search Console + zero-result/finder behavior to decide the next catalog/content expansion.
7. Expand remaining meaningful PH brands after production data quality is stable.

## Completed — v1.9 Philippines commuter + affordability layer

- Made traffic/affordability a first-class product cluster at `/commute`.
- Added daily commute operating-cost and user-controlled affordability calculators.
- Added heavy-traffic, under-₱80K, delivery/work and frequent-passenger model rankings.
- Added rainy-season preparation guidance without inventing flood/wading capability.
- Added commute-cost context to Finder and every current model page.
- Added traffic/delivery natural-language search intent and sitemap/navigation coverage.
- Tightened the launch security gate to require a Next.js 15.5 patch newer than the pre-release 15.5.23 baseline.

### Highest-impact remaining work after v1.9
1. Complete the actual production dependency/deploy gate: post-Aug-26 patched Next.js, reproducible lockfile, production environment, clean build, deployed smoke test and field Core Web Vitals.
2. Replace remaining third-party image hotlinks with explicitly reusable manufacturer media, licensed media or MotoIndex-owned photography.
3. Expand exact manual-backed maintenance schedules and source-listed fuel-economy coverage across the highest-traffic commuter models.
4. Add a commuter gear layer (helmet + rain gear + phone mount + top-box) only where product fitment and rights/source evidence are strong enough.
5. Add region/city context after launch analytics proves demand; avoid templating thin "best bike in city X" pages without unique data.
6. Add route-independent safety/roadside checklists (pre-ride, tire/brake checks, emergency documents) sourced from manufacturer/government guidance.
7. Use Search Console + privacy-safe site analytics to identify the next affordability/commute queries rather than mass-producing generic SEO pages.

## v2.4.3 — repo price intelligence / used-bike trust layer (built)

- Public repo price board uses current seller-published observations rather than synthetic private listings.
- Philippines used-bike buying checklist covers documents, HPG clearance, condition, mileage and payment checks.
- Transfer/deed guidance refreshed to the 2025 LTO motorcycle ownership rules.
- Synthetic used-listing fixtures remain non-public and used-value planning estimates remain noindex.

### Next production milestone — persistent price ingestion

1. Connect Postgres for seller/repo price observations and source history.
2. Persist staged CSV/API imports only after validation and model matching.
3. Add expiry/freshness monitoring and manual publish/reject states.
4. Store historical asking-price snapshots instead of overwriting prices.
5. Activate public seller/dealer offers only when seller identity and current source URLs are verified.
6. Add used-price alerts after the observation pipeline can detect real changes.

## v2.4.4 — persistent price ingestion (built)

- Postgres-backed import batches and row-level staging are implemented.
- Seller + catalog entity matching happens before approval.
- Duplicate same seller/entity/date/price observations are flagged.
- Human approve/reject actions gate publication.
- Publishing updates the current verified offer and appends immutable price observations.
- Stale verified offers can be expired through the protected ingestion API.
- `/api/offers` is verified-only when Postgres is active and fail-closed otherwise.
- Public repo/buying-checklist routes are now explicitly allowed through production middleware; synthetic used-market routes remain blocked.

### Next production milestone — activate and automate the pipeline

1. Provision Postgres, apply the baseline migration and seed verified sellers.
2. Import the first recurring repo/dealer feed through `/admin/ingestion`; verify model-match quality before increasing volume.
3. Add authenticated scheduled ingestion/expiry jobs with structured failure reporting.
4. Add seller onboarding/verification so new partners cannot be published merely by knowing a slug.
5. Surface database price-history charts on model pages only after multiple real observations exist.
6. Activate price alerts only after scheduled refresh proves reliable change detection.
7. Add seller/dealer public pages only for verified businesses with current inventory and contact/source evidence.

---

# Monetization + business roadmap

## Long-term positioning

MotoIndex should become **the data and commerce layer for motorcycle ownership in the Philippines**, not merely a motorcycle content site.

The product journey should eventually connect:

**research → compare → buy → finance/insure → accessorize → maintain → sell → buy again**

SEO and recommendation content bring users into MotoIndex, but monetization should happen at high-intent decision points using source-backed product, price, dealer, fitment and ownership data.

## Monetization principles and guardrails

1. **Commercial placement must never rewrite editorial conclusions.** Paid or sponsored placements must be clearly labeled and kept separate from objective ranking, comparison and recommendation logic.
2. **Do not invent merchant inventory, dealer offers, financing rates, insurance products, stock states, used-price history or availability.** Only publish them when a current source/feed/partner record exists.
3. **Keep recommendation and comparison methodology transparent.** Do not introduce generic scores such as `8.7/10` unless the scoring formula is defined, published and reproducible.
4. **Affiliate/product commerce must remain price-comparison oriented.** Prefer "Compare prices" / "Check price" / "Where to buy" over aggressive generic "Buy now" copy.
5. **Every commercial observation needs freshness metadata.** Store seller/retailer, observed price, observed date, availability where known, source URL, affiliate status and verification state.
6. **Financing figures shown by MotoIndex are estimates, not lender offers.** Always expose the assumptions and distinguish calculator results from actual partner quotations.
7. **Lead generation requires explicit consent and privacy-safe handling.** Dealer, finance, insurance and alert flows must not be publicly activated until the partner/consent/storage workflow is production-ready.
8. **Do not manufacture historical charts.** Price history, used-market medians and depreciation insights require multiple immutable dated observations.
9. **Product images and merchant data must follow the existing rights/source policy.** Do not scrape or hotlink unapproved assets merely to make commerce cards look complete.
10. **Display ads are secondary.** Prefer commerce/lead monetization on high-intent pages; reserve display advertising mainly for lower-commercial-intent informational content when traffic justifies it.

## Priority revenue engines

### Priority 1 — Accessory affiliate commerce

This is the first monetization layer to deepen because MotoIndex already has helmet, tire, top-box, intercom/accessory and fitment-oriented page architecture.

High-intent categories include:

- helmets
- intercoms
- top boxes
- gloves
- jackets
- phone mounts
- visors
- locks
- rain gear
- motorcycle-specific accessories with verified fitment

#### Product-page target experience

Every monetizable product entity should be capable of showing:

- product name and verified/current specifications
- product image on a white media background when a rights-safe image exists
- size/fitment/compatibility information where relevant
- source-backed current retailer offers
- observed price
- availability when explicitly known
- observed/checked date
- clearly labeled merchant/marketplace destination
- affiliate disclosure
- "Compare prices" / "Check price" CTA

Target offer model:

| Store | Observed price | Availability | Checked | Action |
| --- | ---: | --- | --- | --- |
| Verified retailer | source-backed | source-backed/unknown | date | Check price |

Do not create fake retailer rows to make a comparison table look populated.

#### Affiliate implementation backlog

1. Expand `SellerOffer`/retailer-offer use from demo infrastructure into verified accessory offers.
2. Support multiple offers per product, ordered by freshness and then observed price where comparison is valid.
3. Keep direct affiliate destinations behind MotoIndex outbound routes so clicks can be measured and destinations can be revoked safely.
4. Track at minimum: `affiliate_offer_impression`, `affiliate_product_click`, product, merchant and page context.
5. Add visible affiliate disclosure near commercial CTAs.
6. Preserve the current rule that `SHOPEE_AFFILIATE_LINKS_JSON` is **build-time configuration for statically generated product pages** unless the architecture is deliberately changed. Runtime-only changes do not update SSG CTAs; changing those links currently requires rebuild + redeploy.
7. Build merchant/retailer verification and feed ingestion before opening generic "where to buy" pages at scale.

### Priority 2 — Motorcycle dealer leads

High-intent model, comparison and recommendation pages should eventually support a clearly separated CTA such as:

**Get dealer offers for this motorcycle**

Lead fields can include:

- buyer name
- city/location
- preferred motorcycle/model/variant
- cash vs financing interest
- preferred contact channel
- phone/email only with explicit consent

Possible business models to test after real dealer partners exist:

- qualified lead fee
- dealer subscription + included leads
- inventory/profile subscription
- promoted inventory, clearly labeled as sponsored

Do **not** hard-code a lead value such as ₱500 as a business assumption. Any example fee is only a hypothesis to test with dealers.

#### Dealer lead activation requirements

Before enabling public lead submission:

1. verified dealer identity and destination/contact workflow
2. consent language + privacy retention policy
3. spam/abuse controls
4. lead delivery and status tracking
5. duplicate handling
6. analytics from CTA → submitted → accepted/qualified where partner feedback is available
7. clear separation between organic model/recommendation ordering and paid dealer placement

The previous production decision to disable prototype public dealer flows remains valid until these requirements are met.

### Priority 3 — Financing lead layer

Model, comparison and recommendation pages should eventually offer a transparent monthly-payment planning tool.

Inputs may include:

- observed/current motorcycle price
- down payment
- term (for example 12/24/36 months)
- user-supplied or clearly labeled illustrative interest/rate assumption

Outputs must be labeled **estimates**, not guaranteed financing offers.

Future CTA:

**See financing options**

Partner destinations may include verified dealers, banks or financing companies once agreements and consent handling exist.

#### Finance backlog

1. separate calculator estimates from real partner products/offers
2. store rate/product effective dates when real offers are introduced
3. show disclosure/assumptions next to estimates
4. capture finance lead intent only with explicit consent
5. measure calculator use and partner handoff without exposing sensitive data to analytics

### Priority 4 — Insurance lead/comparison layer

Ownership and model pages can eventually surface:

- CTPL vs comprehensive explanation
- verified insurance provider/product information
- effective dates/source references
- motorcycle/model context where providers support it
- renewal reminders with consent

Future CTA:

**Compare motorcycle insurance**

Do not rank an insurer as "best" without a published methodology and current product-level evidence.

### Priority 5 — Used motorcycle marketplace

MotoIndex should move from current repo/used-price intelligence into a real marketplace only after persistent listing ingestion, identity verification and moderation are ready.

Potential model:

#### Individual seller

- one/basic listing free or low-friction
- limited photos
- identity/contact verification
- expiry/freshness requirements

#### Paid featured listing

Possible tested features:

- boosted placement
- highlighted listing
- additional photos
- featured badge
- price-history/comparable context

Any eventual ₱199/₱299/₱499 price point is a test hypothesis, not a committed price.

#### Dealer subscription

Potential capabilities:

- bulk inventory
- dealer profile
- lead routing
- analytics
- promoted inventory
- CSV/API feed
- inventory freshness tools

Subscription pricing should be validated with partners rather than copied from conceptual examples.

### Priority 6 — Used-price intelligence

This can become a major MotoIndex differentiator and B2B asset.

Target outputs, only after enough real observations exist:

- median asking price by model/year
- asking-price distribution
- current listing count
- price-vs-comparable context
- immutable asking-price history
- source/freshness coverage

Example user-facing interpretation:

**Asking price: ₱X**  
**Comparable median asking price: ₱Y**  
**Difference: ₱Z below/above current comparable asking prices**

Always say **asking prices** unless transaction/sale-price evidence exists.

Potential future monetization:

- dealer pricing intelligence
- inventory valuation
- market reports
- paid analytics dashboard
- data/API access

### Priority 7 — Price alerts and retained audience

Price alerts should be activated only after scheduled price refresh/change detection is reliable.

Possible alerts:

- motorcycle price change
- verified dealer offer
- accessory deal
- compatible product price change
- used listing matching a model/budget/location
- insurance/registration renewal where the user explicitly opts in

Monetization can later include affiliate offers, dealer leads and clearly labeled sponsored alerts, subject to user consent/preferences.

### Priority 8 — Ownership commerce ecosystem

Each motorcycle model should eventually function as an ownership hub after purchase.

Potential modules:

- compatible tires
- engine oil/service consumables where exact requirements are verified
- battery
- top box + exact mounting hardware
- helmet/intercom/phone mount discovery
- insurance renewal
- registration renewal
- maintenance schedule
- price/used-value monitoring
- sell-this-motorcycle flow

This extends lifetime value beyond the initial research session.

### Priority 9 — Sponsored inventory and placements

Potential sponsored products:

- featured motorcycle inventory
- brand/category campaign placements
- sponsored accessory placement
- retailer campaigns
- newsletter/alert sponsorship
- verified merchant enhancement

Rules:

- label every paid placement clearly
- never let payment alter organic comparison/recommendation calculations
- keep organic and sponsored blocks visually distinguishable
- disclose material affiliate relationships

### Priority 10 — Retailer subscriptions / "where to buy"

Retailers may eventually pay for:

- verified merchant status
- product/inventory feeds
- enhanced store profile
- offer freshness tools
- analytics
- sponsored placement (clearly labeled)

Organic offer tables should continue to show source-backed merchant information independent of subscription status where inclusion criteria are met.

### Priority 11 — Display advertising

Consider display ads after meaningful traffic exists.

Best candidates are lower-commercial-intent pages such as:

- LTO/registration guides
- maintenance explainers
- ownership education
- general helmet/safety guides

Avoid degrading model, compare, recommendation, fitment and product purchase flows with excessive ads where a higher-value commerce/lead action is more useful to the rider.

### Priority 12 — B2B data / MotoIndex API

Longer-term subscription product built on the structured PH motorcycle dataset.

Potential customers:

- dealers/dealer groups
- insurers
- financing companies
- ecommerce/parts retailers
- marketplaces
- publishers
- fleet operators

Potential API/data products:

- current motorcycle models and variants
- observed price + source/freshness
- specifications
- price observations/history
- verified accessory compatibility
- retailer/dealer offers
- used asking-price intelligence
- maintenance/ownership data where officially sourced

Do not expose internal/admin-only research records as production API facts.

## Page-to-monetization map

| User intent | MotoIndex surface | Primary future monetization |
| --- | --- | --- |
| Motorcycle model price | Model page | Dealer / finance lead |
| Model A vs Model B | Comparison | Dealer / finance lead |
| Recommendation guide | Recommendations | Dealer / finance lead |
| Helmet brand/model | Gear/product | Affiliate / retailer offer |
| Intercom/top box/accessory | Product/fitment | Affiliate / retailer offer |
| Model-specific accessory search | Fitment | Affiliate |
| Insurance query | Ownership | Insurance lead |
| Installment/payment query | Model/finance tool | Financing lead |
| Used motorcycle query | Used market | Listing / dealer lead |
| Used model price | Price intelligence | Marketplace / B2B |
| Ownership/maintenance | Ownership hub | Accessory affiliate + retention |

## Recommended build order from current MotoIndex state

### Commerce Phase A — affiliate price comparison

Build first:

1. verified multi-retailer accessory offer records
2. price-comparison UI on monetizable product pages
3. affiliate disclosures
4. outbound click analytics
5. offer freshness/expiry handling
6. product → compatible motorcycle crosslinks and motorcycle → compatible product crosslinks

**Release requirement:** never show a merchant price/stock state without a stored source and observed date.

### Commerce Phase B — dealer lead foundation

After real dealer partners exist:

1. verified dealer records
2. model-aware lead CTA
3. consented lead form
4. lead routing/status/admin workflow
5. anti-spam/duplicate controls
6. conversion analytics

Keep public prototype flows disabled until this phase passes privacy/operational review.

### Commerce Phase C — finance + insurance

1. transparent finance calculator
2. partner finance offer schema/effective dates
3. finance lead handoff
4. insurance provider/product records
5. insurance comparison/lead flow

### Commerce Phase D — used marketplace + price intelligence

1. persistent verified used listings
2. moderation/identity/freshness
3. comparable asking-price engine
4. price-history observations
5. seller/dealer monetization
6. price alerts

### Commerce Phase E — retention + B2B

1. ownership hub
2. recurring alerts/renewals with consent
3. dealer/retailer analytics
4. market reports
5. production MotoIndex API/subscriptions

## Metrics to instrument before optimizing monetization

Track privacy-safe events such as:

- product offer impressions
- affiliate outbound clicks
- compare → model click
- recommendation → model click
- dealer CTA impressions/starts/submits
- finance calculator starts/completions
- insurance CTA starts
- used-listing views/contact actions
- price-alert opt-ins
- zero-result searches and fitment failures

Do not optimize solely for CTR. Also monitor stale-offer rate, invalid merchant destinations, lead quality, user complaints/corrections and source freshness.

## Media delivery standard — local-first entity images

MotoIndex entity imagery should now follow one shared standard across motorcycle, helmet, tire and top-box surfaces:

- one primary image per entity
- canonical 1:1 canvas at 1200 × 1200 px
- solid white background; no gray product-image canvas
- full product contained in frame rather than cropped
- canonical WebP derivative with browser optimization handled by Next.js
- stable lowercase kebab-case filenames such as `honda-adv-160.webp` or `yamaha-aerox-v3.webp`; only include a year/version when it genuinely identifies that entity/generation
- useful entity-specific alt text
- self-hosted path under `/public/media/...` with the original checked image URL/source/rights metadata retained for provenance
- exactly one `role: "primary"` record per entity

The project includes `npm run media:sync` to create standardized local derivatives from the checked upstream media records and `npm run validate:media` to enforce the schema. During migration, a checked upstream URL remains only as a runtime fallback when the local derivative has not yet been synced. Before removing remote image allowlists/fallbacks, run `MEDIA_STRICT_LOCAL=1 npm run validate:media` and require zero missing local assets.

Do not replace missing images with arbitrary marketplace imagery or generated lookalikes. Keep provenance and entity accuracy ahead of visual completeness. AVIF remains deferred while the existing image-security gate intentionally keeps it disabled.

## Future ChatGPT handoff — what to do next

**When this roadmap is attached in a future ChatGPT build session, read this section before proposing new work.**

Unless the user gives a different priority, the next monetization work should follow this order:

1. **Deepen accessory affiliate commerce first.** Turn verified helmet/intercom/top-box/gear entities into source-backed multi-offer price-comparison pages with freshness, affiliate disclosure and outbound analytics.
2. **Do not re-enable prototype public dealer/finance/price-alert/used-market flows just because route/code scaffolding exists.** First verify partner identity, consent, storage, moderation and operational workflows described above.
3. **Use existing model/comparison/recommendation traffic as the future dealer-lead funnel.** Add lead CTAs only when the real dealer pipeline is ready.
4. **Build financing estimates separately from financing offers.** Never present calculator output as a lender quotation.
5. **Build used-price intelligence before a large open marketplace.** Accumulate immutable real asking-price observations, then expose medians/comparables and only later paid listings/dealer subscriptions.
6. **Preserve editorial independence.** Sponsored placement and affiliate relationships must never determine "best," comparison winners, rankings or factual conclusions.
7. **Prefer structured reusable commerce data over hard-coded page copy.** SellerOffer, merchant, product, fitment, observed price, source, freshness and event data should power multiple surfaces.
8. **Do not mass-produce monetization pages.** Every indexable commerce page still needs unique intent, real data, current provenance and meaningful internal links under the existing SEO launch gate.
9. **Keep `package-lock.json` from the registry-verified launch-ready build unchanged unless the user explicitly supplies/requests a dependency update in an environment with registry access.** Do not hand-edit integrity/SWC records in an offline sandbox.
10. After each commerce release, update this roadmap with what was actually built, what remains gated and the next measurable milestone so a later ChatGPT session can resume without guessing.
11. **Preserve the local-first image standard.** New entities must get one standardized 1200 × 1200 white-canvas WebP primary image with provenance. Run the media sync/validator instead of adding new hotlinks directly.

### Completed — v2.9.0 Accessory Commerce v1

- Added verified, source-backed accessory price observations derived only from catalog entities with a current price, attributable `priceSourceUrl` and checked date.
- Added reusable multi-offer comparison blocks across helmet, tire and top-box entity pages.
- Added a 30-day public freshness gate and stale redirect suppression.
- Added privacy-safe outbound analytics plus persistent `OutboundClickEvent` recording for database-backed offers.
- Added affiliate disclosure inside commerce surfaces without allowing commission to affect ordering or editorial rankings.
- Expanded admin offer review with source-backed observation, freshness and source-review fields.
- Preserved the rule against fabricating additional merchants when only one trustworthy observation exists.

### Completed — v2.9.1 Accessory Commerce hardening

- Unified source and database commerce around a strict 30-day calendar freshness window; future/invalid dates are rejected.
- Added hourly ISR to helmet, tire and top-box product routes so stale commerce observations age out without requiring a full redeploy.
- Enforced HTTPS-only outbound commerce and exact product/listing source eligibility; broad collection pages remain research references but do not become verified merchant rows.
- Made database commerce fail open to source-backed content instead of taking down public product pages.
- Changed public offer ordering to freshness first, then observed price, and de-duplicated non-marketplace merchants by destination host.
- Expanded host classification for all currently recorded price-source hosts, including official EVO classification.
- Minimized persistent click analytics to offer/source-offer identity, entity, merchant and timestamp; referrer/user-agent fields were removed.
- Added source-backed server-side click events when the database is configured, while analytics failures remain non-blocking.
- Strengthened `validate:v290` with behavior checks for date boundaries, HTTPS/product-source policy, database freshness, route resilience, ISR, privacy schema and migration coverage.
- Preserved honest coverage gaps: tires and top boxes remain empty in commerce until exact, independently verified price listings are added.

### Immediate suggested next build

**Dealer Lead Foundation v1 — gated**

Do not start public lead collection until a real dealer/partner workflow is supplied or verified. The required gate is: partner identity, consent copy, lead destination/storage, access control, retention policy, moderation/operations and success/failure measurement.

If that partner workflow is not yet available, continue adding independently verified retailer observations to high-demand accessory products and rechecking stale offers instead of creating a new monetization surface.
