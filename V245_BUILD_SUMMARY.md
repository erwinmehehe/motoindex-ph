# MotoIndex PH v2.4.5 — Public SEO + Maintenance Depth

## Why this release

The earlier volume-first roadmap was becoming stale because its largest price, helmet and tire targets were already shipped. v2.4.5 pauses additional ingestion/backend expansion and moves effort back to the current public site.

## Public SEO improvements

- Added `/maintenance` as an indexable maintenance/parts hub.
- Added seven source-dated evergreen guides:
  - `/maintenance/parts-of-motorcycle`
  - `/maintenance/motorcycle-battery`
  - `/maintenance/coolant-for-motorcycle`
  - `/maintenance/sprocket-motorcycle`
  - `/maintenance/change-oil-motorcycle`
  - `/maintenance/cvt-motorcycle`
  - `/maintenance/motorcycle-oil`
- The guides use current official Honda Philippines, Yamaha Motor Philippines and Suzuki Philippines service/after-sales resources and explicitly defer exact fluids, fitment, intervals, capacities and torque to the exact model manual.
- Added the maintenance hub/topics to search, sitemaps, navigation, footer and homepage discovery.
- Kept exact model maintenance pages indexable only when MotoIndex has parsed an exact source.

## Helmet-brand intent

- Strengthened `/gear/helmets/brands` for the `helmet brands`, `helmet brands philippines`, `best helmet brands` and related cluster.
- Added an exact-model comparison framework (fit, PH marking/certification evidence, helmet type and observed price).
- Added FAQs and ItemList structured data.
- Explicitly avoids declaring a single “best” safety brand based on reputation.

## Registration intent

- Refreshed the existing canonical `/ownership/registration-renewal` page title/copy around requirements, fees, LTMS/online renewal and timing.
- Expanded FAQs for basic requirements, current fee assessment and LTO portal eligibility.
- Preserved current LTO-source freshness and the planning calculator.

## SEO roadmap workbook

`research/ph_motorcycle_seo_300plus_keywords_current_roadmap_v245.xlsx` now includes a new `SEO Roadmap v2.4.5` tab.

The new roadmap:
- marks the old top-20 price/helmet/tire targets as shipped or monitor/deepen;
- makes registration, maintenance/parts and exact maintenance schedules the current public priority;
- separates build-now opportunities from data-blocked local-directory work;
- keeps local shop pages gated on real verified business data;
- keeps unrestricted marketplace/backend automation lower priority for now.

Fresh Ahrefs PH checks on 2026-08-26 confirmed notable remaining demand including `helmet brands` (2,300/mo, KD 0), `parts of motorcycle` (2,400/mo, KD 7), `motorcycle battery` (1,200/mo, KD 0), `coolant for motorcycle` (900/mo, KD 0), `sprocket motorcycle` (800/mo, KD 1), `motorcycle registration renewal` (700/mo, KD 0), `change oil motorcycle` (700/mo, KD 2), `motorcycle insurance` (700/mo, KD 0), `cvt motorcycle` (500/mo, KD 0) and `motorcycle oil` (450/mo, KD 0). Grouped roadmap volumes overlap and are not unique visitors.

## Validation

- `npm run validate:v245` — PASS
- `npm run validate:all` — PASS
- `npm run check:links` — PASS (80 route patterns / 141 source files)
- `npm run validate:lockfile` — PASS
- No page-heading eyebrow/kicker pattern was reintroduced.
- Next.js remains pinned to 15.5.24.

## Next public-site tranche

1. Exact owner-manual schedules for NMAX, Aerox, ADV and Fazzio.
2. Real product depth for gloves, jackets and rain gear.
3. Search Console-driven CTR/internal-link improvements after the site is live.
4. Verified local shop/dealer pages only after sufficient business data exists.

Persistent ingestion and seller automation remain available in the codebase but are not the active roadmap priority.
