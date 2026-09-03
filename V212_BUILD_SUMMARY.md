# MotoIndex PH v2.1.2 build summary

## What changed

### Typography
- Added `Inter` through `next/font/google` in `app/layout.tsx`.
- The font is exposed through `--font-inter` and used by the global body stack.
- This keeps the production font self-hosted by Next.js rather than making a runtime Google Fonts request.

### Contrast
- Light-surface text accent: `#c13b19`.
- Bright brand orange retained as `--accent-bright:#f0542d` for non-text decoration and dark surfaces where it passes contrast.
- Muted text token: `#5f6972`.
- The v2.1.2 validator checks the light/dark token combinations used by the UI against the 4.5:1 AA text threshold.

### Mobile UX
- Search remains visible in the mobile header instead of being available only inside the menu.
- Common buttons, summaries, form controls and small action links use a 44px minimum touch target on mobile.
- The homepage no longer inherits the 630px hero minimum on small screens.
- Mobile hero copy is tightened and the proof row is removed on small screens.
- A real current motorcycle image/price preview is rendered above the Quick Finder so product content appears above the fold.

### Image accessibility
- Header and footer brand images now have explicit `alt="MotoIndex PH logo"` text.
- Both home links have accessible names.

### Price-page structured data
`/motorcycles/[make]/[slug]/price` now emits a `Product` object containing:
- product name, SKU/model ID and brand;
- model description and the model-specific image from the attributed media layer;
- `Offer` for a single observed price, or `AggregateOffer` for a genuine multi-source/range price;
- `priceCurrency: PHP` and a canonical MotoIndex price-page URL.

Availability is not fabricated. It is omitted until MotoIndex has trustworthy stock/inventory data.

### FAQ content + schema
Visible FAQ sections with matching `FAQPage` JSON-LD were added to:
- motorcycle loan calculator;
- LTO registration fee calculator;
- motorcycle insurance calculator;
- ownership registration, transfer and insurance guides;
- maintenance hub.

Google retired FAQ rich results in May 2026. The schema therefore should not be treated as a Google FAQ-rich-result tactic; it remains valid structured semantic markup for other consumers.

### OG asset
- `public/brand/motoindex-og.png` remains 1200×630.
- Reduced from roughly 520 KB to 88 KB using palette-optimized PNG encoding.

### Sitemap advertisement
- `robots.txt` now advertises only the root, motorcycles and gear sitemaps.
- The empty commerce sitemap route remains in the codebase but is not advertised until it contains verified URLs.

## Validation

Passed:
- `npm run validate:all`
- `npm run validate:v212`
- `npm run validate:launch-hardening`
- `npm run validate:lockfile`
- internal-link audit: 70 route patterns / 124 scanned source files, no broken literal/template routes or static indexable orphans

`npm ci` was attempted in the sandbox to run a fresh Next.js typecheck/build, but dependency installation timed out and left only a partial `node_modules`; that residue was removed before packaging. The source validators and TypeScript transpilation checks pass, but a fresh dependency-backed `next build` should still be run in the deployment environment.
