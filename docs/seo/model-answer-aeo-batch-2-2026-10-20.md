# MotoIndex AEO Batch 2 — four next high-impression motorcycle entities

**Prepared:** October 20, 2026. **Status:** GitHub implementation for review; not a claim of production deployment, indexing or AI citations.

## Why these canonical pages

The already-completed source-dated answer sprint covered Aerox V3, NMAX V3, ADV160 and Click160 (PR #495). The remaining highest-impression current-model pages in the same **historical** first-party GSC page-only baseline (Philippines Web search, 28 settled days ending **October 5, 2026**) were:

| Canonical page | Impressions | Clicks | Historical CTR | AEO job |
| --- | ---: | ---: | ---: | --- |
| `/motorcycles/rusi/classic-250i` | 2,642 | 11 | 0.42% | Distinguish third-party price evidence from dealer quote; do not assume ABS |
| `/motorcycles/yamaha/fazzio` | 1,327 | 1 | 0.08% | Distinguish the current Fazzio model from cheaper older inventory |
| `/motorcycles/yamaha/mio-gear` | 467 | 0 | 0.00% | Explain price/finance reference scope, actual dealer terms and unlisted ABS |
| `/motorcycles/yamaha/sniper-155` | 440 | 0 | 0.00% | Distinguish Sniper/R variant pricing, ABS and manual shifting |

These are **page aggregates**, not query-plus-page records. Do not describe the values as current October 20 traffic, a search-volume estimate or predicted ranking uplift.

## Changes in this batch

- Add an exact purchase-intent question and answer directly after the displayed current-model price on each existing canonical page through the shared `highIntentModelAnswer` map, with a specific canonical cross-shop link.
- Keep money values dynamic from `observedMarketPriceLabel(model)` and the date dynamic from `latestPriceReference(model)`. **No new price, equipment or verification date is invented.**
- Show a direct link to the existing model/specification reference with its actual `verifiedAt` date in the first-screen answer panel. The source is **not automatically the price source**. Full dated price/source details remain available in the existing price section.
- Add precise visible Q&A for Rusi Classic 250i, Fazzio and Sniper 155 where the automatic FAQs did not cover variant or evidence caveats. Mio Gear already has a model-specific ABS question, so do not add a duplicate.
- Reuse the established visible FAQ/FAQPage JSON-LD array rather than adding new, competing FAQ schemas.
- Extend production smoke checks for all four URLs (HTTP 200, title, description, exact canonical, JSON-LD, no unexpected noindex and visible answer/source handoff).

## Editorial source boundaries

Rusi Classic 250i has a **third-party** source and no separately dated dealer price; do not call it a direct Rusi SRP or claim ABS is absent. Fazzio uses a Yamaha/model reference plus dealer pricing with older-stock caveat. Mio Gear price observations are not financed quotes, and its current record does not list ABS. Sniper 155 ABS varies by trim and price; manual shifting should be compared with automatic alternatives as a separate consideration.

The model's specification check date and the latest independent price-check date are different evidence types. Do **not** reset timestamps, override price records, backfill availability or imply stock from the model's `marketStatus`.

## Validation and next measurement

Run existing unit/SEO/public-trust validators, lint, typecheck, Next.js build, Visual QA, Cloudflare runtime and `scripts/smoke-public-core.mjs` after an approved deployment. The live domain and source `/deployment-info.json` must be checked against the actual deployed SHA.

Next follow-up requires **combined query + page GSC API rows** by search intent and device for snippet experiments; do not change titles or meta descriptions from page CTR alone. Continue AEO Sprint 2 with the already-canonical comparisons `/compare/aerox-v3-vs-nmax-v3` and `/compare/adv-160-vs-pcx-160` and audit product/helmet/tire/accessory route families before claiming sitewide AEO completion.
