# MotoIndex PH v0.7 — Seller Discovery, Price Alerts & Ingestion Staging

## Added
- Unified `/sellers` directory and seller profile pages.
- Prototype local dealer landing pages under `/dealers/[city]`.
- Seller links from offer tables.
- Price-alert component embedded on motorcycle price, helmet, tire and top-box pages.
- `/api/price-alerts` validation endpoint that intentionally does not persist PII in v0.7.
- `/admin/ingestion` CSV preview/validation tool.
- `/api/ingestion/validate` staging validator.
- Seller, price-alert and import-batch production schema extensions.
- Indexing gates: demo seller/city pages are noindex and excluded from sitemap.

## Product rule
Seller identity, product identity and offer identity are separate entities. A seller page must not become indexable until it has verified business/location data and enough useful current offer coverage.

## Ingestion rule
Partner data follows: import -> validate -> stage -> source review -> dedupe/SKU match -> verify -> publish -> expire/refresh. No feed writes directly to public offers.

## Privacy rule
The v0.7 price-alert UX validates the interaction but does not persist email addresses. Production activation should use double opt-in and explicit consent metadata.

## QA
- 69 TS/TSX source files parsed with zero syntax diagnostics.
- v0.5, v0.6 and v0.7 validators pass.
- 9 demo seller records are isolated from indexable seller URLs.
- Existing content validator still passes with 16 motorcycle records.
