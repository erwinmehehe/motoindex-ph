# MotoIndex PH v2.6.1 — Tier 2 + Tier 3 Philippines expansion

Date: 2026-08-27

## Goal

Expand MotoIndex PH beyond the four core motorcycle brands without returning to thin page multiplication. The release adds a first substantive catalog layer for the agreed Tier 2 and Tier 3 Philippine-market brands and turns every motorcycle brand URL into a useful research hub.

## Brand coverage added

### Tier 2

- Rusi — RFI 175, Classic 250i
- MotorStar — Cafe 400, Xplorer 250R
- Kymco — Like 150i ABS, KRV 180i TCS
- SYM — Jet X150, Cruisym 150
- CFMOTO — 450MT, 450SR
- Bristol — ADX 160, Maxie 400
- Benelli — 180S, TRK 502X

### Tier 3

- KTM — 390 Duke, 390 Adventure
- Royal Enfield — Hunter 350, Himalayan 450
- BMW Motorrad — G 310 GS, C 400 GT
- Ducati — Monster 937 Plus, Scrambler Nightshift
- Triumph — Speed 400, Scrambler 400 X
- Vespa — Primavera 150, Sprint 150
- Aprilia — SR GT 200, RS 457
- Husqvarna — Svartpilen 401, Vitpilen 401

That is 15 new brands and 30 current anchor-model records. Combined with the existing Yamaha, Honda, Suzuki and Kawasaki catalog, MotoIndex now has 19 motorcycle brands represented in the runtime catalog.

## Architecture

New expansion records live in `lib/phTier23Models.ts` and are composed into the existing `motorcycles` catalog from `lib/data.ts`. This keeps the established v2.1 static data/media contracts intact while letting the current runtime catalog grow.

`lib/phBrandPriority.ts` records the Philippines rollout tier and brand rationale. It is used for merchandising and discovery rather than for artificial search-volume scoring. New model `searchVolume` and `keywordDifficulty` values remain `0` until measured data is imported.

## Strong brand hub redesign

`/motorcycles/[make]` is no longer just a heading followed by cards. Each public brand hub now includes:

- a large Philippines-specific hero
- current model count
- tracked price span
- engine range
- automatic/manual mix
- sticky section navigation
- current model cards
- model-level price/spec decision table
- category links
- finder, comparison and recommendation entry points
- methodology/evidence explanation written for buyers
- previous-generation separation where relevant
- brand-specific FAQ generated from the actual catalog
- CollectionPage + FAQ structured data

The content is derived from the actual model records, so each brand page changes meaningfully with its lineup rather than repeating a fixed keyword template.

## Motorcycle index redesign

`/motorcycles` now has a dedicated Tier 2 + Tier 3 expansion section showing all 15 new brands and their current published-model counts. Core brands and model-family links remain discoverable below it, followed by the full model explorer.

## Model page behavior

The v2.6 canonical entity architecture remains unchanged. Every newly added motorcycle automatically gets the same consolidated model page covering price, financing, specifications, rider fit, tires, fuel, ownership, maintenance, safety, used value, alternatives and FAQ where data/components permit.

No new `/price`, `/specs`, `/installment`, `/review` or similar keyword-fragment URLs were created for these brands.

## Data and source approach

The 30 new records use dated Philippines/current-market references from manufacturer sites where available and current Philippine motorcycle reference sites for the remaining models. The release intentionally does not fabricate keyword-volume metrics.

Model imagery was not hotlinked or copied merely to fill cards. New models use the existing controlled motorcycle fallback until a rights/attribution-compliant media record is added.

## Validation

Added `scripts/validate-v261.mjs` and `npm run validate:v261`.

The validator checks:

- package version 2.6.1
- 30 unique expansion models
- exactly two anchor models across each of the 15 agreed Tier 2/3 brands
- current verification date/status
- HTTPS source URL for each record
- no invented non-zero SEO metrics
- brand priority coverage
- strong brand-hub UI and structured-data elements
- motorcycle-index expansion UI
- v2.6.1 CSS load order

`npm run validate:all` passes, including the internal-link and media validators.

A full TypeScript check/build could not be completed in this sandbox because `node_modules` is absent. Running `npm run typecheck` therefore fails at dependency/type resolution (`next`, React JSX types, Prisma and Node types) before it can provide a meaningful project typecheck. Run `npm ci && npm run typecheck && npm run build` in CI or the normal development environment.
