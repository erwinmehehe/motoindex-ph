# MotoIndex PH v2.4.4 — Persistent Price Ingestion

## What shipped

- Added `@prisma/client@6.5.0` as an exact runtime dependency and added Prisma generate/migrate/seed scripts.
- Added a fresh-database baseline migration covering the complete current Prisma schema.
- Added row-level `OfferImportRow` persistence linked to `OfferImportBatch`, sellers and the published offer that came from each row.
- `/admin/ingestion` now validates and stages CSV rows into Postgres, then shows the persistent review queue.
- Staging matches `sellerSlug` against the Seller table and `entityType/entityId` against the MotoIndex motorcycle/helmet/tire/top-box catalogs.
- Duplicate rows within a batch and already-published same seller/entity/date/price observations are flagged for review.
- Review actions are explicit: rows are approved or rejected; rows with matching/validation issues cannot be approved.
- Publishing approved rows creates or updates `SellerOffer` and appends an immutable `OfferPriceObservation` when a price exists.
- Added stale-offer expiry with a default 14-day age threshold.
- Added a database-backed `/api/price-history` endpoint and changed `/api/offers` to expose verified database offers only when persistence is configured. It stays HTTP 410 when no database is connected.
- Admin offer review now reads verified database offers when available instead of always showing demo fixtures.
- Added an initial verified seller seed for SB Finance Repo Central.
- Fixed production middleware: `/used-motorcycles/repo` and `/used-motorcycles/buying-checklist` are public, while the synthetic used-market root/detail routes remain blocked.

## Activation

In a clean networked environment:

```bash
npm run refresh:security-lock
npm ci
export DATABASE_URL='postgresql://...'
npm run db:migrate
npm run db:seed
npm run verify:launch
```

The static public research site still launches without Postgres. Without `DATABASE_URL`, persistent staging/review/publishing/history/expiry are unavailable and `/api/offers` remains fail-closed.

## Validation

- `npm run validate:all` — pass
- `npm run validate:lockfile` — pass
- internal-link audit — pass
- v2.4.4 persistence-specific source gate — pass
- Prisma CLI schema/migration execution cannot be proven in this sandbox because npm package retrieval is unavailable; run `npm ci`, `npm run db:migrate`, and `npm run verify:launch` in the networked deployment environment.
