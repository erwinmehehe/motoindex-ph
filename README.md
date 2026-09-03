# MotoIndex PH

## v2.9.1 Accessory Commerce hardening

**Current release: v2.9.1.** MotoIndex keeps the v2.8 decision engine and v2.9 accessory-commerce layer, then hardens commerce for production: strict 30-day/future-date freshness checks across source and database offers, HTTPS-only merchant destinations, product-specific source gating, hourly ISR on monetized product pages, freshness-first offer ordering, merchant de-duplication, database fail-open fallback, privacy-minimized click measurement for both persistent and source-backed offers, and a stronger commerce validator. No retailer is invented to fill tire/top-box coverage gaps. See `V291_QA_HARDENING.md`, `V290_BUILD_SUMMARY.md`, and `V280_BUILD_SUMMARY.md`.

## v2.4.7 pSEO entity architecture + launch hardening

**Historical v2.4.7 release.** MotoIndex now uses one canonical entity page per verified helmet, tire or top-box product instead of spawning thin price/review/spec/size keyword variants. Product pages combine price/reference price, specifications, fit or sizing evidence, variants, pros/cons, best-for guidance, alternatives, comparisons, FAQs, commerce CTAs when configured, and source/update context. The release also includes the visual/UX hardening work: smaller headings, tighter spacing, contained motorcycle imagery, cleaner mobile Finder/Search/Compare behavior, simplified navigation, shared brand lockup, a Contact page, current-only motorcycle search, safer media fallback, and stricter validators.

The latest catalog tranche adds full brand-lineup references for **LS2, NHK, SMK and Alpinestars**, with 11 source-backed canonical helmet entities, plus 5 canonical **Coocase** top-box entities. **Duhan, Motowolf and Surfy** remain research-only on the top-box hub until stable model/SKU evidence is available; no thin product pages are generated for them. See `V247_BUILD_SUMMARY.md`.

**Launch note:** this UI/tooling hardening overlay intentionally does not replace `package-lock.json`. Keep the npm-regenerated lockfile from the launch-ready v2.4.7 candidate unchanged, then run `npm ci` and `npm run verify:launch` against that preserved lockfile. Do not regenerate or hand-edit the security lock in an offline sandbox.

## v2.4.5 public SEO + maintenance depth

v2.4.5 pauses further ingestion/backend expansion and improves the current public product instead. It adds a new `/maintenance` hub with seven source-dated evergreen guides (parts, battery, coolant, sprockets, oil changes, CVT and motorcycle oil), strengthens `/gear/helmets/brands` for generic/best-brand comparison intent without inventing a safety ranking, and expands the existing LTO registration-renewal guide around requirements, LTMS/online renewal and fee questions. The SEO workbook is refreshed with a new `SEO Roadmap v2.4.5` sheet and the original top-20 roadmap now marks already-shipped work. See `V245_BUILD_SUMMARY.md`.

**At v2.4.5:** public SEO/content quality is the active priority. Persistent ingestion remains in the codebase but is intentionally not the next product focus.**

## v2.4.4 persistent price ingestion

v2.4.4 activates the Postgres/Prisma offer pipeline: CSV rows can be validated and staged, seller/catalog matched, explicitly approved or rejected, published into verified seller offers, preserved as immutable price observations, and expired when stale. The public offers API reads verified database rows only when Postgres is configured; otherwise it remains fail-closed. This release also fixes production routing so `/used-motorcycles/repo` and `/used-motorcycles/buying-checklist` remain public while synthetic used-market routes stay blocked. See `V244_BUILD_SUMMARY.md`.

**At v2.4.4:** persistent ingestion engine built; public research remains safe without a database; Next.js 15.5.24 and site-wide eyebrow removal remain intact.**

## v2.4.3 repo price intelligence + used-bike trust

v2.4.3 starts the used-motorcycle trust layer without publishing synthetic marketplace rows. It adds a current seller-published repo price board with 15 SB Finance price observations, a used-bike buying checklist, a dedicated motorcycle deed-of-sale guide, and refreshes ownership-transfer guidance to the 2025 LTO motorcycle ownership rules. The homepage and sitemap now expose the repo/buyer-trust routes, while the old planning-estimate used-value hub remains noindex. See `V243_BUILD_SUMMARY.md`.

**At v2.4.3:** used/repo trust layer added; 43 verified public gear products retained; page-heading eyebrows remain removed; Next.js 15.5.24 launch hardening remains intact.**


## v2.4.2 helmet catalog + verified tire depth + eyebrow cleanup

The next traffic/commerce tranche adds indexable HNJ, Shark, MT and Bell helmet brand coverage with two current source-backed products per brand, promotes Michelin City Grip 2 and Dunlop ScootSmart into the verified tire layer using manufacturer size data, and removes the small page-heading kicker/eyebrow treatment across the site. Meaningful legacy labels required for context were moved into normal headings rather than restoring the removed visual eyebrow pattern. See `V242_BUILD_SUMMARY.md`.

**At v2.4.2:** 38 verified helmet products, 3 verified tire families, 2 verified top boxes, and no page kicker/eyebrow classes. v2.4.1 tire/top-box SEO and v2.3.1 Next.js 15.5.24 launch hardening remain intact.**

## v2.4.1 tire fitment + helmet/top-box depth

The next volume-first tranche expands the 18K/mo tire-fitment cluster with generation-safe Aerox, NMAX and Honda Click tire-size hubs, a motorcycle tire-size chart, and stronger exact-model tire FAQs/metadata. The top-box category is now a real buying/fitment hub with checked 32L/39L products, five stored bike-specific bracket edges and the LTO top-box fee note. Existing helmet brand pages now target brand + price intent with model price tables, source freshness and buyer FAQs. See `V241_BUILD_SUMMARY.md`.

## v2.4.0 volume-first SEO build

The highest-volume roadmap is now implemented as a focused traffic-capture release: priority motorcycle price pages receive query-specific SEO/FAQ/internal-link treatment, Aerox and NMAX family pages are strengthened as generic-price hubs, a new official-source DL Code B motorcycle guide targets the 5.75K/mo quick-win cluster, and Zebra becomes the first newly added helmet brand with three current Philippine product records and media. The volume-first workbook is included under `research/`. See `V240_BUILD_SUMMARY.md`.

**v2.4.0 release:** volume-first price/helmet SEO expansion, with the v2.3.1 Next.js 15.5.24 launch/security hardening retained.

MotoIndex PH is a data-driven Philippines motorcycle research and fitment site built with the Next.js App Router. The UI still reads seeded TypeScript records so it can run before the production database is connected; the Prisma schema is the persistent data contract.



## v2.3.0 — affiliate production fix + Helmet Finder

- Fixes the production affiliate blocker: `/go` is no longer part of `middleware.ts` prototype deny prefixes. `/go/affiliate/{productId}` and legacy `/go/shopee/{productId}` requests now reach their route handlers, which still fail closed with 404 when no approved link is configured and 307 redirect when one is configured.
- Adds middleware regression coverage directly to the affiliate validator so adding `/go` back to the production deny-list fails validation.
- Replaces machine-specific TypeScript validator imports with `scripts/load-typescript.mjs` / `.cjs`: local TypeScript first, then discoverable global TypeScript, otherwise a clear validation error. No validator may silently skip TypeScript parsing.
- Normalizes validator walker paths before comparing them with POSIX source paths, avoiding Windows-only rogue-header/footer false positives.
- Restores production provisioning keys in `.env.example`: site URL, public contact email, admin credentials, database URL and the privacy-defaulting search-term analytics flag.
- Adds the canonical `/gear/helmets/finder` tool with URL-shareable budget, helmet type, riding-use, brand, listed size, intercom, visor-feature and certification-evidence filters over verified helmet records only.
- Adds selection of 2–3 helmets from Finder and a dedicated `/gear/helmets/compare` workspace with real product images, observed prices, type, listed sizes, weight where published, shell, visor, intercom provision, certification evidence, last-checked dates and configured Shopee/Involve Asia purchase actions.
- Helmet comparison is intentionally `noindex` and omitted from sitemaps so query permutations do not become thin indexable pages; the Finder itself is canonical and included in the gear sitemap.
- Adds `npm run validate:v230` and runs it in `validate:all`. The complete validator chain passes on a clean tree with no local `node_modules`.
- See `V230_BUILD_SUMMARY.md`.

## v2.2.3 — image-complete product commerce

- Gives every **verified public gear product** a real, model-specific image reference: 27 helmets, 1 tire family and 2 top boxes (30/30 total).
- Adds images for Gille, EVO, SEC, Rook, HJC, AGV, Arai and Shoei products using brand or Philippine retailer product pages; existing KYT, Spyder, Pirelli, GIVI and SHAD imagery remains intact.
- Affiliate CTAs now fail closed on **both** conditions: a valid configured Shopee/Involve Asia link **and** a verified product image must exist.
- Changes the shopper CTA to `View on Shopee` and the detail module to `Shop this product` / `See today's Shopee listing`. Involve Asia stays a backend attribution network, not front-end marketing copy.
- Product imagery uses `object-fit: contain` on a clean background so helmets, tires and top boxes are shown whole instead of being cropped like editorial photos.
- Public catalog/search and motorcycle fitment suggestions no longer surface vague research-only product records as shop-ready cards. Research seeds remain in the data layer until verified.
- Adds `npm run validate:v223`, which requires 30/30 verified product-media coverage, approved remote hosts, no affiliate CTA without media, and the purchase-intent copy.
- See `V223_BUILD_SUMMARY.md`.

## v2.2.2 — direct Shopee + Involve Asia affiliate routing

- Affiliate CTAs are configuration-driven and **fail closed**: no button is rendered until a real approved direct Shopee or Involve Asia deeplink is configured for that MotoIndex product ID.
- Configure links server-side with `AFFILIATE_LINKS_JSON`; the legacy `SHOPEE_AFFILIATE_LINKS_JSON` map remains supported during migration. No tracking URLs are committed to the repository or exposed as public environment variables.
- Product-detail pages for helmets, tires and top boxes can show a purchase-intent `View on Shopee` action when the product has both a configured link and verified product media.
- Outbound clicks use `/go/affiliate/{productId}` redirects, `rel="sponsored nofollow noopener noreferrer"`, `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`, and a `/go/` robots exclusion.
- `affiliate_click` analytics events record merchant, product ID/name and placement without placing tracking credentials in client JavaScript.
- `/affiliate-disclosure` explains commissions, editorial independence, changing marketplace prices/stock and how affiliate links are labeled.
- `/admin/data-health` reports configured affiliate links and configuration issues.
- Deployment/configuration instructions are in `AFFILIATE_SETUP.md`.
- MotoIndex does **not** claim a live marketplace price or availability; visitors are told to verify the exact seller, variant, size, certification, fitment, shipping and final checkout price.

## v2.2.0 — research UX and decision-flow release

- Makes homepage budget discovery real: each budget card opens `/motorcycles` with its corresponding budget filter already applied.
- Syncs motorcycle-directory and Finder state to URL search parameters so refresh, return navigation and sharing preserve the same research state.
- Adds a persistent local compare tray with explicit `+ Compare` actions on motorcycle cards and Finder results, supporting two- and three-bike comparisons.
- Moves comparison highlights ahead of wide spec tables and gives comparison tables sticky row/column headers plus keyboard-scroll semantics for narrow screens.
- Reduces model-hero action overload and adds a sticky model research subnav for Overview, Price, Specs, Fitment and Ownership.
- Makes motorcycle card photos the primary model link and moves media attribution out of tiny photo overlays on detail surfaces.
- Adds shareable calculator state, common presets, reset controls and live result announcements to loan, LTO and insurance calculators.
- Adds a skip link, sitewide `:focus-visible` treatment, reduced-motion support, live result announcements and a 44px baseline for the new interactive controls.
- Raises key Finder/catalog microcopy out of the 9px range.
- Removes synthetic used listings and seeded seller deals from public rendering, and turns inactive alert/deal routes into honest research guidance rather than nonfunctional conversion flows.
- Replaced the original generic H/T/B artwork with sourced product thumbnails; v2.2.3 completes real-image coverage for every verified public gear product and keeps unverified research seeds out of shop-ready cards.
- Splits the release-specific research UX styles into `app/research-ux.css` rather than extending the historical `globals.css` override chain.
- Adds `npm run validate:v22` and folds it into `validate:all`.
- See `V22_BUILD_SUMMARY.md`.

## v2.1.2 — UI/UX + price-page SEO hardening

- Loads Inter with `next/font/google`, using Next.js self-hosting at build output so production pages do not make a runtime Google Fonts request.
- Splits the brand orange into an AA-safe light-surface text token (`#c13b19`) and the original bright orange for dark-surface/non-text use; muted text was darkened to `#5f6972`.
- Raises primary controls and common mobile navigation/action links to a 44px touch baseline.
- Keeps Search visible in the mobile header and removes the 630px mobile hero minimum. A compact real motorcycle preview now appears above the finder on small screens.
- Gives the two shared logo images explicit alt text and accessible home-link labels.
- Adds `Product` JSON-LD to every model `/price` page, with model image and either `Offer` or `AggregateOffer` pricing in PHP. Stock availability is intentionally omitted unless actual inventory data exists.
- Adds visible FAQ sections plus matching `FAQPage` JSON-LD to financing, LTO, insurance and maintenance/ownership content. Note: Google retired FAQ rich results in May 2026, so this markup is retained for semantic/other-consumer value rather than promised Google FAQ SERP treatment.
- Compresses `public/brand/motoindex-og.png` from about 520 KB to 88 KB at the same 1200×630 dimensions.
- Stops advertising the currently empty `/sitemaps/commerce.xml` in `robots.txt`; the route remains available for future verified commerce URLs.
- Adds `npm run validate:v212` and folds it into `validate:all`.
- See `V212_BUILD_SUMMARY.md`.

## v2.1.1 — real motorcycle image hardening

- Replaced every remaining generic motorcycle illustration and missing image slot with a distinct real, model-specific external image reference.
- Motorcycle image coverage is now 50/50: one attributed image record per motorcycle, with no duplicate image URLs and no generic SVG motorcycle placeholders.
- Removed all Zigwheels URLs from the motorcycle media layer and from the Next.js remote-image allowlist. Zigwheels may still appear as a cited market/specification source; it is not used to render motorcycle imagery.
- Sources favor Philippine manufacturers and authorized dealers: Honda Philippines, Suzuki Philippines, Kawasaki Philippines, Wheeltek and Motortrade. The discontinued Click 150i uses an attributed historical model image because Honda's current launch-page image combines the 125i and 150i.
- `validate:v21` now enforces exact 50/50 media coverage, unique image URLs, HTTPS raster media and matching Next.js remote-host allowlisting.
- See `V211_BUILD_SUMMARY.md` and `MOTORCYCLE_IMAGE_COVERAGE_V211.md`.

## v2.1.0 — finance + registration + freshness operations

- Added the canonical standalone motorcycle loan calculator at `/tools/motorcycle-loan-calculator`.
- Added current-model `/installment` pages and model-prefilled calculator links without creating keyword-alias doorway URLs.
- Added LTO registration-fee and motorcycle-insurance calculators with variable charges kept explicit.
- Removed the Zigwheels image-CDN dependency from motorcycle media. The v2.1.1 hardening pass subsequently replaced all temporary motorcycle placeholders with real model-specific image references.
- Added Honda Click 150i as a distinct historical model and permanent canonical redirects for Aerox V4/Aerox 2025/NMAX Turbo aliases instead of publishing duplicate doorway pages.
- Added a date-driven refresh schedule to `/admin/data-health` for price, model, ownership, gear and compatibility records.
- Added `npm run validate:v21` and folded it into the full source validator suite.
- See `V21_BUILD_SUMMARY.md`.

## v2.0.1 — public copy cleanup

- Removed public SEO/data-pipeline jargon and repetitive trust labels.
- Removed Finder percentage matches, rider-fit `/100` scores and numeric commute rankings.
- Rewrote motorcycle summaries around concrete specifications instead of generic adjectives.
- Recommendation and commute lists now expose their ordering criteria without pretending the first item is universally best.
- Helmet-brand browsing is alphabetical instead of search-volume ordered.
- `npm run validate:copy-tone` prevents the most obvious AI/SEO/internal phrases from returning.
- See `V201_COPY_CLEANUP.md` and `COPY_STYLE.md`.

## v2.0 — variants + price intelligence

- Verified variant cards for Aerox V3, NMAX V3, PCX160 and ADV160: 8 sourced trims total.
- Trim SRPs can be loaded directly into the editable installment calculator.
- Price pages now expose dated price snapshots, current source count and source spread without pretending a multi-source range is one live quote.
- `/admin/data-health` now includes a ranked research queue, variant/range review flags and price-history coverage.
- Variant URLs remain intentionally unshipped until trim-level content is deep enough to avoid thin pages.
- See `VARIANT_PRICE_SOURCES_V20.md` and `V20_BUILD_SUMMARY.md`.


## Included
- responsive design system with reusable components
- dynamic model pages with static params and metadata
- dedicated price + tire-size intent pages
- dynamic comparison pages
- helmet, tire, ownership and search hubs
- interactive installment calculator
- source-gated `/api/models`, verified catalog API and `/api/finance` endpoint
- structured Product JSON-LD on model pages
- dynamic sitemap and robots rules
- authenticated `/admin/*` research/verification dashboards
- PostgreSQL Prisma schema for source-aware price, fitment, finance and accessory data

## Run locally
```bash
npm ci
cp .env.example .env
npm run dev
```

The public research UI still works from source-gated TypeScript records before a database is connected. v2.4.4 additionally uses Prisma/Postgres for persistent seller-offer ingestion and price history when `DATABASE_URL` is configured.

## Important before launch
Only records that pass `isIndexableModel()` may enter indexed motorcycle surfaces. Review-state records stay reachable for development/research but are excluded from public discovery and sitemaps. Run `npm run verify:launch`; see `LAUNCH_CHECKLIST.md`.

## Migration path
1. Create a fresh Postgres database and set `DATABASE_URL`.
2. Run `npm run db:migrate` to apply the v2.4.4 baseline schema, then `npm run db:seed` to add the initial verified ingestion seller.
3. Use `/admin/ingestion` to validate, stage, match, review and publish offers.
4. Schedule `/api/ingestion/expire` through an authenticated operator/cron path to expire stale verified offers.
5. Continue migrating public catalog reads from TypeScript to Prisma only where live data creates user value; do not force the stable research catalog into the database prematurely.
6. Add affiliate/dealer/insurance events only after partner agreements are available.

### v0.3 product-discovery layer
The app now includes a homepage quick finder, budget discovery, filterable motorcycle directory, accessories category pages, model-specific accessory pages, helmet brand hubs, and a prototype dealer/financing lead flow. See `preview/homepage.html` for a standalone visual preview that does not require Next.js to run.


## Recommendation + compatibility layer (v0.4)

New routes:
- `/recommendations/` and `/recommendations/[slug]/`
- `/fitment/` and `/fitment/[make]/[slug]/`
- Model accessory pages now consume structured research profiles rather than generic copy.

All compatibility outputs are intentionally labeled research/medium until product-level source evidence exists.

## v0.5 product catalog
The app now includes `/catalog` plus individual helmet, tire and top-box product routes. Catalog records explicitly distinguish research seeds from source-backed records. Tire matching is based on stock size equality and is intentionally labeled as a research match, not a final fitment approval.

## v0.6 commerce routes

- `/deals` — legacy commerce route shell; v2.2 no longer renders seeded offers publicly
- `/api/offers` — offer feed/filter endpoint
- `/admin/offers-review` — internal verification queue (protect before production)
- `/go/[offerId]` — outbound safety gate; only verified offers with a target may redirect externally

The bundled offers remain internal UI/data-model fixtures, not current PH prices. v2.2 keeps them out of the public deals experience until live, source-backed offers exist.


## v0.7
Seller discovery, local dealer-page architecture, price-alert UX and CSV offer-ingestion staging were added. Demo seller pages remain noindex and alert submissions are not persisted until production email/consent infrastructure is connected.


## v0.8
The app now includes a unified site chrome plus ownership-economics tools: `/ownership/cost-calculator`, `/used-motorcycles`, model-specific `/ownership-cost`, and noindex model-specific `/used-value` estimators. Run `npm run validate:v08` for chrome and syntax checks.

## v0.9 additions

The project now includes a used-market data layer in `lib/usedMarket.ts`, client-side used-listing filters, per-model used-price summaries, new-vs-used pages, an API endpoint and an internal used-listing review page.

All used listings in v0.9 are synthetic test data. Used-market pages intentionally remain `noindex` and are excluded from the sitemap until real source-backed listings are connected.

Public copy is governed by `COPY_STYLE.md`. Run `npm run validate:v09` to check the used-market layer, syntax, noindex/sitemap gates and banned internal/template wording.

## v1.0 additions
- Search-volume-priority expansion focused on distinct high-demand entities instead of keyword clones.
- Added Yamaha Aerox V2 and NMAX V2 historical-generation records.
- Added Yamaha Aerox and NMAX family pages.
- Added `/motorcycles/[make]/` brand price-list hubs.
- Added indexing gates for unresolved seed records.
- Previous-generation prices are labeled historical and cannot trigger current dealer/financing flows.
- See `V10_BUILD_SUMMARY.md` for the prioritization rationale.


## v1.1 helmet depth

KYT, Spyder, Gille, EVO and SEC now have multiple source-backed helmet products. Research-only helmet pages stay out of the sitemap and are marked noindex until the data threshold is met. See `V11_BUILD_SUMMARY.md`.


## v1.2 additions
CRF150L hub, half-face/modular/full-face helmet category pages, helmet brand comparison, and source-backed Rook/HJC/AGV/Arai catalog depth. See `V12_BUILD_SUMMARY.md`.

## v1.3 technical SEO + trust release

The current build adds shared canonical/OG metadata, split sitemaps, stable lastmod dates, contextual internal linking, breadcrumb schema, trust/methodology pages, richer cross-entity search, brand SVG assets and build-time technical SEO validation.

Run:

```bash
npm run validate:v13
```

Before public launch, set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL`, then run a full `npm run typecheck && npm run build` after dependencies are installed.

Internal-link QA:

```bash
npm run check:links
```

## v1.4 source-backed fitment + ownership release

- Explicit SHAD top-box rack/plate compatibility edges for priority scooters, with market-year/source evidence and research gating.
- Verified Pirelli Angel Scooter size catalog coverage for the five priority scooter stock-size sets.
- Model tire-size pages now surface verified product-size matches; model/accessory/fitment pages surface exact rack codes.
- Current-source LTO registration renewal and transfer guides plus an Insurance Commission-backed CTPL/comprehensive explainer.
- Rights-aware `next/image` media pipeline and Prisma `MediaAsset` contract; no scraped imagery is bundled.
- Prisma maintenance-record contract with publication gated until exact owner/service-manual evidence exists.
- Sitemap/indexing fixes and portable validators.

See `V14_BUILD_SUMMARY.md`. After dependencies are installed, run:

```bash
npm run verify
```


## v1.5 market intelligence + discovery

- 18 priority motorcycles now have current Zigwheels Philippines market-price checks; 14 also have Motortrade dealer cross-checks.
- Six missing priority models were added: Winner X, Wave RSX, TMX125 Alpha, YTX125, CB150X and XSR155.
- Price pages expose each market source and observed range rather than hiding disagreements.
- Motorcycle cards/details use attributed external image references; these are not bundled or represented as licensed assets.
- `/finder` ranks current models by budget, use, transmission and ABS.
- `/compare` can build a side-by-side page for any two current source-checked models.
- Search volume no longer decides whether a motorcycle can be indexed.

See `V15_BUILD_SUMMARY.md`.

## v1.4.1 launch hardening

- Strict motorcycle source/indexing gate; Honda Click160 is the first current model promoted to verified.
- Indexed hubs/search/tire matches now exclude review-state motorcycle facts.
- Dealer leads, price alerts, demo offers and synthetic used-listing feeds are disabled for launch.
- Prototype marketplace routes return 404 in production.
- `/admin/*` and `/api/ingestion/*` require server-only credentials.
- Added privacy notice, exact dependency pins, launch environment checks and deployment smoke tests.
- `npm run check:launch` intentionally blocks release until the announced August 26, 2026 Next.js critical-security patch is installed.

See `V141_BUILD_SUMMARY.md` and `LAUNCH_CHECKLIST.md`.

## v1.6 audit-driven discovery release

- Technical + on-page audit: `SEO_AUDIT_V16.md`
- New guide/discovery layer: curated comparisons, richer finder filters, additional source-backed buying guides.
- Public indexed hubs now share the same source-quality gate as motorcycle pages.


## v1.7 additions — broader current PH catalog

- Added **24 current model-level motorcycles**, taking the source catalog to 49 records and the current verified/public set to **42 models**.
- Added Honda Giorno+, XRM125 and TMX Supremo; Yamaha PG-1, WR155R and XMAX; 14 current Suzuki models; and Kawasaki KLX150, KLX 230, Ninja 500 and Z500.
- Kept MotoIndex model-level: no trim/variant URL expansion. Configuration-specific price differences are represented as model-level ranges/notes.
- Added **Wheeltek** as a third independent live price source with 11 dated dealer observations, alongside Zigwheels Philippines and Motortrade.
- Added a sourced image reference for every new v1.7 model. Suzuki/Kawasaki assets are manufacturer-hosted where available; Honda/Yamaha assets use current authorized-dealer references in this pass. All remain `external-reference` unless explicit reuse rights are obtained.
- Fixed the ABS recommendation matcher so ABS-backed guides/finder logic use a real word-boundary test.
- See `MARKET_SOURCES.md` and `V17_BUILD_SUMMARY.md`.


## v1.8 additions — ownership, fit and research tools

- 1-year + 3-year total ownership planner with editable financing/running-cost assumptions.
- Rider-fit tools using inseam, traffic, passenger, faster-road and luggage preferences.
- Fuel economy/range pages that distinguish source-listed figures from planning estimates.
- Explicit lifecycle/generation status on verified motorcycles.
- Structured natural-language search, browser-local shareable shortlists and three-bike comparisons.
- Similar/cheaper/lower-seat alternatives and transparent model source/update logs.
- Official Honda/Yamaha/Suzuki/Kawasaki maintenance and safety-campaign handoffs; exact PCX160 manual schedule stored.
- Tire-pressure/fitment crosslinks and optional GA4/Plausible event instrumentation with raw search-term capture off by default.
- Expanded protected data-health dashboard.
- **Price history is not part of v1.8.**
- See `FEATURE_SOURCES_V18.md` and `V18_BUILD_SUMMARY.md`.

## v1.9 additions — commuting + affordability

- New Philippines-first `/commute` hub for traffic, affordability and daily-use research.
- Commute cost calculator: daily distance, workdays, fuel, parking and maintenance reserve.
- Affordability ceiling calculator using user-selected take-home-pay share, running-cost reserve, down payment, APR and loan term.
- Data-backed heavy-traffic, under-₱80K, delivery/work and passenger-commute rankings.
- Rainy-season checklist with no fake flood/wading-depth score.
- Finder/search/model-page integration for commute cost and traffic intent.
- Launch preflight now requires a post-15.5.23 Next.js security patch after the announced August 26, 2026 release.
- At v1.8, price history remained excluded; v2.0 now adds conservative source-dated price snapshots without reviving demo marketplace history.

See `COMMUTE_SOURCES_V19.md` and `V19_BUILD_SUMMARY.md`.

## v2.4.6 launch workflow hardening

The current public site is feature-complete enough to launch. v2.4.6 focuses on the last-mile deployment contract rather than adding another feature.

Prepare a private local production env with:

```bash
npm run launch:prepare -- --site https://your-domain.com --email hello@your-domain.com
```

This validates the origin/contact channel and generates strong local admin credentials without committing secrets. Then run `npm run refresh:security-lock`, `npm ci`, and `npm run verify:launch`. After deployment, run `BASE_URL=https://your-domain.com npm run smoke:production`. The smoke suite now correctly treats `/used-motorcycles/repo` and `/used-motorcycles/buying-checklist` as public while keeping synthetic marketplace routes blocked. See `V246_BUILD_SUMMARY.md`.
