# MotoIndex PH v2.1 build summary

## Shipped in this build

- Added `/tools/motorcycle-loan-calculator` as the canonical standalone financing calculator.
- Added current-model `/{make}/{model}/installment` pages that reuse the verified price basis and the existing finance logic.
- Added `/tools/lto-registration-fee-calculator` with editable inspection, CTPL and other-fee inputs; the fixed MVUC basis is separated from variable charges.
- Added `/tools/motorcycle-insurance-calculator` with editable motorcycle value, own-damage/theft rate and CTPL input, plus an explicit deductible estimate.
- Linked the new tools from model pages, price pages, the site header/footer and XML sitemaps.
- Removed the Zigwheels image-CDN dependency from the motorcycle media layer. In the v2.1.1 hardening pass, every temporary motorcycle SVG fallback was then replaced with a distinct real model-specific external image reference; see `V211_BUILD_SUMMARY.md`.
- Added the discontinued Honda Click 150i as a distinct historical Philippine model, with its 2018 launch price kept explicitly historical and a successor link to the Click160.
- Added permanent alias redirects for `/motorcycles/yamaha/aerox-v4`, `/motorcycles/yamaha/aerox-2025` and `/motorcycles/yamaha/nmax-turbo` to the existing Philippine Aerox V3/NMAX V3 pages instead of creating thin duplicate entities.
- Added a date-driven refresh queue to `/admin/data-health`, covering model facts, market prices, LTO/insurance guides, verified gear and compatibility records.
- Added `npm run validate:v21` and folded it into `validate:all` so the new route/media/refresh contracts are regression-checked.

## Intentionally not added

- No keyword-stuffed alias routes such as `/motorcycles/aerox-v3-price-philippines/`. Existing clean model URLs remain canonical to avoid doorway pages and self-cannibalization.
- No speculative duplicate model records were created for model-year/marketing aliases without source-backed generation data; those aliases use redirects to the clean canonical model URLs.
- Existing helmet product depth was preserved; the supplied audit understated the current verified helmet catalog in this ZIP.

## Framework note

This source ZIP already pins Next.js 15.5.23, the current 15.x maintenance backport. A Next 16 major-version lockfile migration needs an online npm install/build pass; the execution sandbox could not reach the npm registry reliably, so this deliverable keeps the internally consistent 15.5.23 lock instead of shipping an unverified or hand-edited dependency graph.
