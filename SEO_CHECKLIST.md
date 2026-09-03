# MotoIndex PH technical SEO release checklist

## Before each deploy
- Run `npm run validate:all`.
- Run `npm run check:launch` with production environment values.
- Run `npm run typecheck` and `npm run build` when dependencies are installed.
- Confirm `NEXT_PUBLIC_SITE_URL` is the production origin.
- Confirm every newly indexable motorcycle passes `isIndexableModel()`: verified status, HTTPS source, checked date, no review/pending source label.
- Do not add a URL to a sitemap just because a keyword exists.

## Indexing rules
- Review-state motorcycle records: noindex and excluded from motorcycle hubs/search/fitment discovery/sitemaps.
- Research-only tire/top-box/product records: noindex and excluded from sitemaps.
- Demo sellers, demo deals, price alerts, used-market samples, quote forms and search: noindex.
- Admin and API routes: blocked in robots.txt; admin/ingestion additionally require authentication.
- Prototype seller/dealer/deal/used/quote/alert routes: 404 in production and excluded from sitemaps.
- Search remains crawlable so its `noindex` directive can be read.

## Page requirements for indexable routes
- Unique title and description.
- Self-referencing canonical generated through `pageMetadata()`.
- One clear H1.
- At least one parent/hub link.
- Contextual related links where the data supports them.
- Source status/date on changing facts.
- Breadcrumb markup on primary entity/detail pages.

## Sitemaps
- `/sitemap.xml` — core pages, comparisons and recommendation guides.
- `/sitemaps/motorcycles.xml` — brand, family, model and model-intent pages.
- `/sitemaps/gear.xml` — helmet categories/brands/products plus verified product pages.
- `/sitemaps/commerce.xml` — route retained for future verified sellers/dealers, but not advertised in robots while empty.
- `lastmod` comes from source verification/check dates instead of the request time.

## Images
- Use licensed manufacturer/retailer media or original photography only.
- Prefer AVIF/WebP through Next Image for raster media.
- Store intrinsic width/height to avoid layout shift.
- Use descriptive alt text for useful product/model images; decorative graphics get empty alt text.
- Keep image filenames descriptive and stable.

## v1.8 ownership / discovery index rules

- `/shortlist` is noindex and excluded from sitemaps because it is user-state/share functionality, not a canonical landing page.
- `/compare/three` is noindex; arbitrary 3-bike combinations must not create combinatorial crawl/index duplication.
- Model `/fuel-economy` pages index only when the motorcycle record contains a source-listed fuel-consumption value. Planning-estimate pages remain useful but noindex.
- Model `/maintenance` pages index only after an exact model/market owner/service-manual schedule is parsed and stored.
- Model `/safety` pages can index only for a source-checked public motorcycle with an official manufacturer safety/campaign resource.
- Rider-fit pages may index for verified motorcycles but must retain the explicit physical-fit/safe-control disclaimer.
- Ownership maintenance and safety hubs use BreadcrumbList-capable shared breadcrumbs and are included in the core sitemap.
- Lifecycle/generation labels must not mix current and previous-generation price/spec records.
- Analytics search-term capture is off by default; enabling raw query capture requires an explicit environment flag and matching privacy/consent treatment.
