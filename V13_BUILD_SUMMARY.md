# MotoIndex PH v1.3 — Technical SEO + Internal Linking + Brand/Trust

## What changed

### Technical SEO
- Added one shared `pageMetadata()` helper for canonical URLs, Open Graph, Twitter cards and noindex handling.
- All 45 public page files now use the shared metadata helper.
- Added Organization and WebSite JSON-LD at the root layout.
- Added a working SearchAction target backed by `/search?q=`.
- Added a branded SVG favicon, mark, wordmark and 1200×630 Open Graph asset.
- Added `manifest.ts` and security headers.
- Added a custom 404 page.

### Crawl and sitemap controls
- Split crawl surfaces into:
  - `/sitemap.xml` — core pages, comparisons and recommendation guides.
  - `/sitemaps/motorcycles.xml` — brand, family, model and model-intent URLs.
  - `/sitemaps/gear.xml` — helmet categories/brands/source-backed products and verified gear products.
  - `/sitemaps/commerce.xml` — route retained for future verified sellers/dealers, but not advertised in robots while empty.
- `lastmod` now uses stored verification/check dates instead of resetting to the current request time.
- Research-only tire and top-box products are noindex and excluded from sitemaps.
- `/search` is noindex but no longer blocked in robots.txt, so crawlers can read the directive.

### Internal linking
- Added reusable contextual related-link blocks.
- Model pages link to brand, price, tire size, fitment, comparisons and relevant alternatives.
- Helmet products link to brand/category/brand-comparison and nearby models.
- Helmet brand/category pages cross-link to useful related brand and category hubs.
- Tire products link back to model tire-size pages when a stock size matches.
- Top-box pages link to motorcycle fitment profiles rather than claiming exact compatibility.
- Comparison pages link back to the two source model pages and their tire-size pages.

### Breadcrumbs
- Added a reusable breadcrumb component with BreadcrumbList JSON-LD.
- Wired into primary model, helmet, comparison, tire and top-box entity pages.

### Trust pages
- `/about`
- `/methodology`
- `/data-sources`
- `/editorial-policy`
- `/corrections` (noindex)
- `/contact` (noindex until a real contact address is configured)

### Search
- Search now covers motorcycles, verified helmets, helmet brands, recommendation guides, accessories and tools.
- Query URLs use `/search?q=...`.
- Search remains noindex.

### Brand assets
- `/public/brand/motoindex-mark.svg`
- `/public/brand/motoindex-wordmark.svg`
- `/public/brand/motoindex-og.svg`
- `/public/favicon.svg`

The mark is intentionally simple and functional for the site shell. It is not a substitute for a later professional brand-identity exploration.

## QA
All current regression validators pass together:
- v1.3 technical SEO / internal linking / trust
- v1.2 CRF + helmet categories
- v1.1 helmet source-depth
- v1.0 high-volume model expansion
- v0.9 used-market/copy
- v0.8 unified chrome
- v0.7 seller/alerts/ingestion
- v0.6 offer engine
- v0.5 catalog
- product-layer validator
- base content validator

Current v1.3 validation reports:
- 45 public page files using shared canonical metadata
- 109 TS/TSX source files syntax-clean
- one global Header and Footer

## Still intentionally not done
- Real licensed motorcycle/product photography.
- Full `next build` in this environment because project dependencies are not installed locally.
- Search Console account connection or deployment-specific verification token.
- A public contact email; set `NEXT_PUBLIC_CONTACT_EMAIL` before launch.
- Verified tire/top-box product depth; research-only products remain noindex.

### Internal-link QA
`npm run check:links` scans literal and template links against the actual Next.js page/route patterns and checks static indexable routes for orphaning. Current result: 49 route patterns and 75 source files checked with no broken internal route references or static indexable orphans.
