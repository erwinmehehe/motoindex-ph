# MotoIndex PH v2.2.0 build summary

## Goal
Turn the current site from a collection of strong pages/tools into a smoother mobile motorcycle research flow: discovery -> shortlist/compare -> model research -> financing/ownership planning.

## Research/discovery UX
- Homepage budget cards now deep-link to real budget-filtered directory states.
- `/motorcycles` reads and writes `q`, `make`, `type` and `budget` in the URL.
- `/finder` reads and writes budget, make, transmission, use case, ABS, seat height, weight, category, inseam, passenger, highway, luggage, traffic and daily-km state in the URL.
- Finder includes reset and copy-link actions, and result counts are announced to assistive technology.

## Compare flow
- Added `CompareButton` and a persistent local `CompareTray` (maximum three motorcycles).
- Compare actions are available directly from motorcycle cards and Finder results.
- The tray creates two-bike `/compare/{a}-vs-{b}` URLs or three-bike `/compare/three?bikes=...` URLs.
- Pair and three-way comparison pages show compact difference highlights before the full table.
- Tables use row/column header semantics, keyboard-scroll containers, sticky headers and a sticky first specification column on narrow screens.

## Model-page UX
- Hero actions are reduced to price/financing, model installment, compare and save.
- Added a sticky research subnav: Overview, Price, Specs, Fitment and Ownership.
- Less-primary tools remain lower on the page instead of competing above the fold.
- Motorcycle-card photos now open the model page directly.
- Image-source attribution is moved outside the photo on detail surfaces and is no longer a tiny overlay competing with the image.

## Calculator UX
- Loan, LTO registration and insurance calculators persist editable state in the URL.
- Added reset and copy-calculation actions.
- Loan calculator adds 10/20/30% down-payment and 12/24/36/48-month term presets.
- Insurance adds common rate presets; LTO adds inspection-cost presets.
- Key outputs use polite live regions for assistive technology.

## Accessibility/mobile hardening
- Added a keyboard skip link and root `main` target.
- Added a consistent `:focus-visible` treatment.
- Added `prefers-reduced-motion` handling.
- New compare/preset controls meet the 44px touch baseline.
- Raised key Finder/catalog microcopy that was still sitting at 9px.

## Public dead-end cleanup
- `/used-motorcycles` no longer renders synthetic test listings publicly; it points users toward model-specific ownership/depreciation planning instead.
- `/deals` no longer renders seeded/demo offers as if it were a live offer browser.
- `/price-alerts` clearly states notifications are not active and routes users to working research tools rather than a dead conversion flow.
- Internal fixtures/data contracts remain available for future production integrations.

## Gear-card imagery
- Replaced generic H/T/B category artwork in `ProductCard` with the rights-aware `EntityMedia` pipeline.
- Added product-specific image references for the priority discovery set: KYT TT-Course, KYT R2R, KYT TT-Revo, Spyder Fury Rapid S8, Spyder Neo Ace, Spyder Recon 2.0, Pirelli Angel Scooter, GIVI B32N and SHAD SH39.
- Products without an approved image now show an explicit `Photo pending` state rather than fake illustrative artwork.
- Added the required remote hosts to the Next.js image allowlist.

## CSS maintainability
- v2.2 research-flow/accessibility styles live in `app/research-ux.css`, imported after `globals.css` from the root layout.
- This prevents the release from adding another large historical override block to `globals.css` and keeps the new mobile breakpoint/style rules together.

## Validation
- Added `npm run validate:v22` for URL-backed discovery, comparison flow, model research nav, calculator sharing/presets, dead-end cleanup, priority gear imagery, accessibility CSS and syntax transpilation of the changed TS/TSX surface.
- `validate:v22` is included in `validate:all`.
- A full dependency-backed `next build` still requires `npm ci` in an environment with npm registry access; `node_modules` is intentionally not bundled.
