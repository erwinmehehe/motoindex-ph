# MotoIndex PH v2.0.1 — public copy cleanup

This patch removes buyer-facing language that sounded like an SEO pipeline, generated recommendation engine or unfinished internal build.

## Behavior changes
- Finder no longer shows percentage match scores or numeric rank positions. Its internal ordering remains deterministic, but the UI shows plain-language fit labels and the concrete reasons behind them.
- Rider fit no longer shows a `/100` score. It shows the seat-height/inseam gap plus the factors that can change real foot reach.
- Commute guide cards no longer display numeric rank positions. The ordering criteria remain visible above the list.
- Helmet brand browsing no longer uses search volume as its consumer-facing order; brands are alphabetical.

## Copy changes
- Removed public references to canonical pages, indexing, source gates, review states, research candidates, launch builds, compatibility graphs and similar implementation language.
- Rewrote model summaries to start with specifications rather than templated marketing adjectives.
- Reduced repeated “verified”, “source-backed” and “source-checked” trust claims. Dates and sources carry the trust signal instead.
- Reframed recommendation pages around explicit criteria rather than universal “best” claims.
- Simplified finance, fitment, safety, maintenance and fuel-economy caveats without removing necessary warnings.
- Cleaned privacy, contact, seller, offer, used-bike and disabled-feature copy so it does not narrate deployment internals.

## Regression guard
`npm run validate:copy-tone` fails when buyer-facing source files reintroduce known AI/SEO/pipeline phrases or fake recommendation precision. It is included in `npm run validate:all`.
