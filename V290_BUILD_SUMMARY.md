# MotoIndex PH v2.9.0 — Accessory Commerce v1

Date: 2026-08-28

## Goal

Turn existing verified helmet, tire and top-box research into a source-backed price-comparison layer without inventing merchants, weakening editorial independence or re-enabling gated dealer/finance/used-market prototypes.

## What changed

### 1. Source-backed commerce offers

`lib/commerceOffers.ts` converts only verified catalog products that already have all three of the following into public commerce observations:

- a recorded Philippine starting price;
- an attributable `priceSourceUrl`; and
- a dated `lastChecked` value.

Merchant labels are derived from the checked source host. No synthetic second retailer is added to make a comparison block look fuller.

### 2. Freshness gate

Public source-backed offers use a 30-day freshness window. Stale observations disappear from the public comparison block and the outbound redirect refuses stale source-backed offer IDs.

### 3. Product-page price comparison

Verified helmet, tire and top-box entity pages now use `CommercePriceComparison` in the price section. It combines:

- reviewed database offers when the persistent repository is connected; and
- the catalog's current source-backed price observation as a fail-safe baseline.

The UI shows merchant, observed starting price, checked date/freshness and a measured outbound action. Empty states explicitly avoid fabricating a seller.

### 4. Outbound analytics

`OfferOutboundLink` records the privacy-safe `commerce_outbound_click` analytics event with offer ID, entity type, entity ID, merchant and affiliate state.

For persistent database offers, `/go/[offerId]` also stores an `OutboundClickEvent` server-side before redirecting. Analytics failure never blocks the shopper's redirect.

All offer redirects remain `no-store` and `noindex, nofollow, noarchive`.

### 5. Affiliate independence

Existing approved affiliate links remain a separate, clearly disclosed shopping action inside the comparison module. Affiliate presence does not alter price ordering, entity ranking, guide ranking or editorial conclusions.

### 6. Admin/source review

`/admin/offers-review` now exposes the source-backed accessory observations with merchant, price, freshness and direct source-review link alongside persistent/database offer status.

### 7. Validation

Added `validate:v290` and included it in `validate:all`. The validator asserts the verified-only source layer, freshness gate, product-page integrations, measured redirects and admin review surface.

## Deliberate limits

- This release does not fabricate multiple retailer rows when only one trustworthy source exists.
- It does not re-enable public dealer leads, financing offers, price alerts or used-market submissions.
- It does not treat a product manufacturer/specification page as a price source unless the catalog already records it as `priceSourceUrl`.
- Tire prices remain starting observations; shoppers must match the exact size/SKU.
- Marketplace source rows identify the marketplace when the stored URL does not prove a named third-party seller identity.

## Next milestone

**Dealer Lead Foundation v1 remains gated.** Build it only when there is a real dealer/partner workflow with verified partner identity, consent language, lead routing/storage, moderation/operations and measurement.

Until then, the safer next work is maintaining commerce offer freshness, adding additional independently verified retailer observations to high-demand accessory entities, and measuring outbound quality without changing editorial rankings.
