# MotoIndex PH v2.4.1 — Tire Fitment + Helmet/Top-Box Depth

Release date: 2026-08-26

## Why this release

v2.4.0 captured the highest-volume motorcycle-price queries. The next addressable cluster in the volume-first roadmap is tire fitment (~18K PH searches/month), followed by helmet brand-price depth and the top-box keyword set (~8.7K/month). v2.4.1 focuses on those intents without creating duplicate doorway pages.

## Shipped

### 1. Tire family SEO hubs

New indexable routes:

- `/tires/aerox-tire-size`
- `/tires/nmax-tire-size`
- `/tires/honda-click-tire-size`
- `/tires/motorcycle-tire-size-chart`

The family routes combine only genuinely related generations and link to the exact model record. They do not replace the canonical model-specific tire routes.

### 2. Exact-model tire pages strengthened

Priority tire pages now receive query-specific metadata and visible FAQ coverage for:

- Honda ADV 160
- Yamaha Aerox V3
- Yamaha Aerox V2
- Yamaha NMAX V3
- Yamaha NMAX V2
- Honda Click 125i
- Honda Click 160

Each model page keeps front/rear stock sizes separate, shows owner-manual pressure only when a model-specific record exists, and explicitly warns that a printed size match is not complete fitment approval.

### 3. Motorcycle tire-size chart

The new chart explains the three core parts of a size such as `110/80-14`, lists common observed stock sizes from the MotoIndex motorcycle catalog, and keeps load index, speed rating, construction, rim width and physical clearance in the decision flow.

### 4. Top-box buying and fitment hub

`/accessories/top-box` now targets motorcycle top-box shopping intent with:

- verified product count and capacity range
- 32L vs 39L comparison
- verified GIVI/SHAD product cards
- five stored product + motorcycle bracket/rack edges
- direct links to exact fitment pages
- LTO top-box fee note
- top-box buying/fitment FAQ

No compatibility is inferred from capacity alone.

### 5. Helmet brand-price depth

Every indexable helmet brand page now includes:

- `Brand Helmet Price Philippines 2026` metadata
- observed price range
- latest source-check date
- model/type/price/last-checked table
- price and certification FAQ
- existing verified product cards and source-backed detail pages

This deepens EVO, Spyder, KYT, Gille, SEC and the other already-indexable brand hubs without introducing unverified products.

### 6. Sitemap and release gates

- New tire family/chart routes are included in the gear sitemap.
- Top-box hub priority is increased in the segmented sitemap.
- Added `npm run validate:v241` and included it in `validate:all`.
- `validate:v240` is forward-compatible with later v2.4.x releases.

## Validation completed

- `npm run validate:v241` — PASS
- `npm run check:links` — PASS
- `npm run validate:all` — PASS
- `npm run validate:lockfile` — PASS
- production-shaped `npm run launch:status` — SOURCE PREFLIGHT CLEAR

A full Next.js build still requires `node_modules`. The global TypeScript compiler cannot resolve Next/React/Node type packages in this source-only environment, so semantic typecheck/build must still be proven with `npm ci && npm run verify:launch` in the networked deployment environment.

## Launch behavior unchanged

- Next.js remains pinned to 15.5.24.
- Affiliate CTAs remain fail-closed until a real affiliate map is configured.
- Database remains optional for the current seed-backed public runtime.
- Research-only product records remain excluded from shop-ready public cards.

## Recommended next tranche

1. Add source-backed HNJ, Shark and MT helmet catalogs in that order, then Bell.
2. Add one or two more verified scooter tire families so tire-size pages have meaningful product choice rather than a single verified family.
3. After higher-volume commerce coverage, move into used-price intelligence / repo-market trust pages.
