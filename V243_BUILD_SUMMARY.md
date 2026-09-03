# MotoIndex PH v2.4.3 Build Summary

## Release goal

v2.4.3 starts the used-motorcycle trust layer without turning synthetic test listings into public marketplace data. It adds a current seller-published repo price board, a Philippines used-bike buying checklist, and refreshes ownership-transfer/deed guidance to the 2025 LTO motorcycle ownership rules.

## What changed

### Repo motorcycle price board

New indexable route:

- `/used-motorcycles/repo`

The page contains **15 advertised repo-unit price observations** from SB Finance Repo Central, checked on 2026-08-26. The data includes ADV 160, BeAT, Click 125, NMAX, Raider R150, Fazzio, Burgman, Avenis, PCX160 and Click 160 price cards.

Important boundaries:

- The values are labeled as seller-published advertised repo prices, not MotoIndex valuations.
- MotoIndex does not claim inventory ownership, unit inspection, stock guarantees or fair-market-value status.
- Exact generation/model-year mapping is deliberately avoided where the seller card does not state it.
- Synthetic private-seller listing fixtures remain excluded from public marketplace rendering.

### Used motorcycle buying checklist

New indexable route:

- `/used-motorcycles/buying-checklist`

The checklist covers:

- seller/registration identity matching,
- OR/CR and transaction-document checks,
- notarized deed/conveyance requirements,
- HPG clearance,
- independent condition inspection,
- mileage/service-history cross-checks,
- whole-transaction cost,
- traceable payment records,
- completion of LTO ownership transfer.

It references the 2025 LTO IRR of RA 12209, the 2025 LTO Citizen's Charter and seller-specific repo terms from SB Finance.

### Transfer-of-ownership guidance refreshed

`/ownership/transfer-of-ownership` now uses the newer 2025 motorcycle ownership rules instead of centering the older suspended 2024 deadline discussion.

The guide now reflects that the general transfer requirements include:

- a duly notarized deed of conveyance/agreement such as a deed of sale,
- OR/CR,
- valid HPG clearance,
- valid government-issued ID,
- secretary certificate when the motorcycle is corporation-owned.

It also notes the current rule's treatment of unregistered-for-the-year motorcycles, online submission/authenticity requirements and repo/dealer resale reporting.

### Motorcycle deed-of-sale guide

New ownership guide:

- `/ownership/deed-of-sale-motorcycle-philippines`

The page explains how a notarized deed fits the LTO transfer process without publishing an unreviewed legal template. It emphasizes matching the parties and motorcycle details and completing the formal transfer rather than treating an incomplete/open deed as the end state.

### Discovery and stale-copy fixes

- Homepage now links to the repo price board.
- Repo price board and buying checklist are in the core sitemap.
- The existing `/used-motorcycles` planning-estimate page now directs users to the repo board and buying checklist while remaining noindex because its valuation figures are model-based estimates rather than live market observations.
- Removed stale admin wording that said “v0.7 does not persist uploads”; the ingestion screen now describes the actual current source-build boundary.
- New pages do not reintroduce page-heading eyebrows/kickers.

## Validation

Passed:

- `npm run validate:all`
- `npm run validate:v243`
- `npm run validate:lockfile`
- `npm run check:links`
- Internal-link audit: 78 route patterns / 138 source files, no broken literal/template routes or static indexable orphans
- Production-shaped `npm run launch:status`: **SOURCE PREFLIGHT CLEAR**

## Deployment verification still required

The source bundle does not include `node_modules`. An offline `npm ci` attempt still stops at the uncached `prisma@6.5.0` package, so a full TypeScript + Next production build cannot be proven in this environment.

Run in a networked clean environment:

```bash
npm run refresh:security-lock
npm ci
npm run verify:launch
```

The launch-status warnings that remain are configuration/deployment items:

1. refresh npm-published SRI metadata for the newly published Next.js 15.5.24 package records,
2. install dependencies and prove the real framework build,
3. configure affiliate mappings if commerce CTAs should earn revenue,
4. connect the production database only when persistent ingestion is activated.

## Next build

The next meaningful product milestone is **persistent price ingestion**, not more synthetic listings:

1. Postgres-backed repo/dealer price observations,
2. source URL + checked-at + expiry fields,
3. staged import/review/publish workflow,
4. model/family matching with manual-review flags,
5. historical asking-price snapshots,
6. source freshness monitoring,
7. only then activate broader used-market listings and price alerts.
