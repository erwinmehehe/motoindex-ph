# MotoIndex PH v1.6 Build Summary

Built: 2026-08-25

## Theme

Audit-driven SEO and discovery release. v1.6 fixes index-quality leaks found during a technical/on-page audit, makes comparisons safer to scale, publishes additional source-backed buying guides, improves finder usefulness, and aligns structured data with the visible competitor-price layer.

## Product changes

- Expanded curated comparison registry from 3 to 11 useful pairs.
- Arbitrary user-built comparisons remain available but are noindex unless curated.
- Added quick comparison edge cards: starting price, power, weight, seat, tank and ABS listing.
- Expanded motorcycle finder with maximum seat height, maximum curb weight and category filters.
- Added four data-backed public guides:
  - automatic motorcycles under ₱100K
  - motorcycles with ABS
  - fuel-efficient motorcycles
  - best underbone motorcycles
- Buying guides now start from the public/source-checked motorcycle set.
- Buying-guide prices now use the observed market price label.

## SEO changes

- Added `publicMotorcycles` as the shared discovery gate.
- Removed review-state motorcycle leakage from indexed tire/accessory/product-match surfaces.
- Removed research-status products/brands from indexed gear discovery surfaces.
- Changed comparison indexation to curated-only.
- Replaced misleading internal-SRP offer markup with seller-specific `Offer` markup only for exact dealer observations; broad variant/multi-source ranges remain visible but are not mislabeled as `AggregateOffer`.
- Added BreadcrumbList-capable breadcrumbs to price, tire-size, ownership-cost, fitment, recommendation and accessory-category templates.
- Shortened model title targeting to `{Make} {Model} Price & Specs Philippines`.
- Updated homepage H1 to `Compare motorcycle prices and specs in the Philippines.`
- Added 1200×630 PNG Open Graph/Twitter asset and made it the default.
- Added priority-loading support for likely model-page LCP hero imagery.
- Reduced sitewide links to the noindex research catalog.
- Corrected launch/SEO documentation so search volume is not described as an index requirement.

## Audit artifact

See `SEO_AUDIT_V16.md` for the technical/on-page audit, competitor benchmark, keyword-map alignment and remaining P0/P1 backlog.

## Validation

Run:

```bash
npm run validate:v16
npm run validate:all
```

Full dependency-backed `npm ci` / TypeScript / Prisma / Next production build still requires a registry-connected environment. Production launch remains intentionally gated on the scheduled Next.js 15.5 security patch announced for 2026-08-26.
