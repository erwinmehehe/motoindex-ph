# MotoIndex PH v0.9 — Used Market + Copy Cleanup

## Public copy cleanup
- Rewrote homepage and public hubs to use plain motorcycle-shopping language.
- Removed public SEO metrics (KD/search volume) from model, helmet and accessory cards/hubs.
- Removed internal language such as “buyer-guide engine”, “commercial layer”, “programmatic path”, “high-intent flow”, “prototype”, “seed record”, and “SEO roadmap”.
- Removed placeholder catalog products that existed only to demonstrate routing.
- Added `COPY_STYLE.md` and a build validator that blocks the main internal/template phrases from public pages and public-facing data files.

## Used-market intelligence
- 25 synthetic used-listing samples across 6 motorcycle models.
- Normalized fields: model ID, year, mileage, asking price, condition, seller type, location, posted date and source status.
- Median asking-price summary, observed range, average mileage and new-vs-used discount.
- Price-outlier detection so unusual asking prices do not distort the market summary.
- Used-market filters for make, model, maximum price and maximum mileage.
- Model used-price pages now separate listing samples from depreciation estimates.
- New model route: `/motorcycles/[make]/[slug]/new-vs-used/`.
- New API: `/api/used-listings`.
- New internal review page: `/admin/used-listings`.
- Prisma `UsedListing` model added for future database activation.

## SEO safety
- Used-market hub, model used-price pages and new-vs-used pages remain `noindex` while data is synthetic.
- No used-market pages are added to the sitemap yet.
- Real used-price SEO should only be enabled after multiple current source-backed listings are ingested and normalized.

## QA
- 38 application pages.
- 8 API routes.
- 83 TS/TSX source files parsed.
- v0.5, v0.6, v0.7, v0.8 and v0.9 validation checks pass.
- Shared root header/footer validation passes.
- Public copy audit passes.
