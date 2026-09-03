# MotoIndex PH v0.6 — Price Tracker + Offer Engine

## Built

- Seller offer data model separated from stable motorcycle/product records.
- Offer fields for seller, price, down payment, monthly payment, term, stock state, observation date, verification date and outbound target.
- Demo / verified / expired lifecycle.
- Public offer tables on motorcycle price pages, helmet pages, tire pages and top-box pages.
- Price-history component with observation visualization.
- `/deals` cross-category offer discovery page.
- `/api/offers` read endpoint with type/entity/status filters.
- `/go/[offerId]` safety-gated outbound route: demo and expired offers cannot redirect externally.
- `/admin/offers-review` internal review queue.
- Prisma models: Seller, SellerOffer, OfferPriceObservation, OutboundClickEvent.
- Header and sitemap include the Deals surface.

## Safety/data-quality rule

All v0.6 bundled seller prices are demo fixtures. They must not be treated as current Philippine market prices. Only offers explicitly moved to `verified`, with a current source and outbound target, can activate a seller link.

## QA

- `node scripts/validate-v06.mjs`: passed.
- TypeScript transpile/syntax parse: 57 TS/TSX source files, 0 syntax diagnostics.
- Full framework typecheck/build could not run because project dependencies are not installed in this environment.

## Next

1. Ingest real retailer/dealer sources.
2. Add per-SKU variants (especially tire sizes and helmet colorways/sizes).
3. Add expiry SLA automation.
4. Persist outbound click events and affiliate attribution.
5. Add seller/dealer landing pages and price alerts.
