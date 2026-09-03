# MotoIndex PH v0.8 — Ownership Economics + Unified Site Chrome

## Product additions
- Generic motorcycle monthly ownership-cost calculator.
- Model-specific ownership-cost pages for every seeded motorcycle.
- Used-motorcycle value hub with 1-, 3- and 5-year transparent planning estimates.
- Model-specific depreciation estimator and five-year condition bands.
- Model pages now link directly to ownership-cost and used-value research.
- Homepage research-tools section expanded from four to six product flows.

## Design-system consistency fix
The root layout is the sole owner of the site header and footer. v0.8 replaces the overlong desktop nav with a compact primary navigation plus an Explore menu, adds one mobile navigation pattern, and keeps all footer link groups visible on mobile instead of hiding sections. New CSS is appended as a shared-chrome override so route-specific styles cannot redefine the global site chrome.

## SEO/data safety
- `/ownership/cost-calculator` is indexable because every monetary assumption is user-adjustable and clearly labeled as a planning input.
- `/used-motorcycles` is an indexable methodology/tool hub.
- Per-model `/used-value` pages are `noindex, follow` until current used-market listings and source timestamps exist.
- Used-value estimates are explicitly called planning heuristics, never live market prices.
- No live fuel-price, insurance, registration-fee or fuel-economy claim is hard-coded as current fact.

## Next production milestone
Ingest real used listings and normalize year, mileage, condition and seller type; then add market-median/range calculations and source-backed used-price pages. In parallel, connect actual verified ownership inputs where official/partner data is available.
