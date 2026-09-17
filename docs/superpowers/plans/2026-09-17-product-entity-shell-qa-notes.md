# Product Entity Shell QA Notes

The product-detail redesign is guarded by `scripts/product-entity-layout-qa.mjs` in the existing Visual QA workflow.

Coverage includes:
- 390px mobile and 1440px desktop viewports
- a representative verified helmet page
- the Gille Kerena FF007 missing-image regression route
- a representative top-box page
- representative helmet and top-box brand routes discovered from `lib/catalog.ts`
- shared `ProductHero`, media stage, summary, 2x2 fact grid, trust row, and section navigation presence
- horizontal overflow detection
- product image `object-fit: contain`
- image and placeholder bounds staying inside the media stage
- desktop two-column non-overlap and mobile stacked non-overlap
- content section width, heading hierarchy, specification readability, and comparison-grid checks
- full-page screenshot capture for each tested product route

The existing CI, Cloudflare Runtime Compatibility, and Visual QA workflows remain the release gates. The redesign must stay within the existing CSS performance budget; the budget must not be raised for this change.
