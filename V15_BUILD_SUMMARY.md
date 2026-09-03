# MotoIndex PH v1.5 — market intelligence + discovery

Date: 2026-08-25

## What changed
- Added current Philippine market-price observations for 18 priority motorcycles from Zigwheels Philippines.
- Added Motortrade dealer cross-checks for 14 matching current models/trims so price disagreements are visible instead of silently overwritten.
- Added six missing priority motorcycles: Honda Winner X, Honda Wave RSX, Honda TMX125 Alpha, Yamaha YTX125, Honda CB150X and Yamaha XSR155.
- Refreshed existing priority model price records including NMAX, ADV160, PCX160, Raider R150 Fi and Barako II.
- Added an explicit `MarketPriceCheck` data layer with source, source type, checked date, low/high price and notes.
- Price pages now show each observed external source and the combined observed range.
- Model cards, comparison tables, hero price blocks and quick finder use the observed market range.
- Added attributed external motorcycle-image references for all 18 priority models. Images remain on the source CDN, are labeled `external-reference`, and are not represented as MotoIndex-owned or licensed assets.
- Added a full `/finder` experience ranking current models by budget, intended use, transmission and ABS.
- Added a compare-any-two builder. Dynamic comparison routes can now resolve any pair of current source-checked motorcycle slugs.
- Removed search-volume dependence from motorcycle index eligibility; indexability is based on current source/verification state instead.

## Price-source behavior
MotoIndex does not average conflicting prices into a synthetic number. It displays the observed low/high range and exposes the contributing source cards. Trim differences are retained in notes where known.

## Image-source behavior
The v1.5 image entries are external source references with explicit attribution and source links. No competitor photography is copied into the repository. Replace these with first-party or licensed production assets when commercial reuse rights are secured.

## Validation
Run:

```bash
npm run validate:v15
npm run validate:all
```

The source-only validation suite does not require a local Next.js install. A full production typecheck/build still requires installed dependencies.
