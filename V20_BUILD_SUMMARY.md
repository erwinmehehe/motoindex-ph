# MotoIndex PH v2.0 build summary

## Release theme

v2.0 turns MotoIndex's model-level catalog into a deeper price-research product without creating thin trim pages or a marketplace.

## Shipped

### Verified variant layer
- Added a source-dated `MotorcycleVariant` contract and verified trim records for four high-demand multi-variant families: Yamaha Aerox V3, Yamaha NMAX V3, Honda PCX160 and Honda ADV160.
- Eight verified variants are exposed inside canonical model/price pages and the public models API.
- Installment estimates can load a verified trim SRP while keeping purchase price editable for a real dealer quote.
- Unresolved model-level price ranges are flagged for research instead of guessed into variants.

### Price intelligence
- Added a `ModelPriceSnapshot` contract and price-intelligence helpers.
- Current market checks are grouped by check date into stored range snapshots.
- PCX160 and ADV160 include explicit launch-reference seeds where dated source evidence is available.
- Price pages show source count, current spread, tracking start date and a dated snapshot trail.
- Snapshot differences are carefully labeled as reference changes, not market-wide price movements.

### Operations dashboard
- `/admin/data-health` now calculates a research priority score and next action per public motorcycle.
- Added variant coverage, range-review and price-history coverage metrics.
- Added a ranked research queue so stale sources, weak price coverage and unresolved ranges rise to the top.

### Data/API/schema work
- `MarketPriceCheck` distinguishes manufacturer, dealer and comparison-site sources.
- Corrected/updated current variant context for Aerox V3, NMAX V3, PCX160 and 2026 ADV160.
- The public models API exposes only verified variants.
- Prisma `Variant` now has a slug, freshness status, optional source, checked date and feature summary, plus a generation/slug uniqueness constraint.

## Intentionally not shipped
- No separate variant URLs yet. They would be thin until trim-level specs, imagery and ownership evidence are deep enough.
- No dealer leads, marketplace, financing applications, accounts or user-generated price publishing.
- No fake historical series. A model with one dated market snapshot is shown as a baseline, not a trend.

## Validation

Run:

```bash
npm run validate:v20
npm run validate:all
```

Production launch remains independently gated by `npm run check:launch`, including the scheduled August 26, 2026 Next.js critical-security patch and a committed npm lockfile.
