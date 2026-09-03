# MotoIndex PH v2.9.1 — Accessory Commerce QA Hardening

Date: 2026-08-28

## Purpose

Harden v2.9.0 Accessory Commerce before launch without inventing retailer coverage or re-enabling gated dealer/finance/used-market flows.

## Production fixes

1. **Release identity** — package metadata and lockfile root version are now `2.9.1`; the release artifact uses a `motoindex-v291` root folder.
2. **Freshness** — source and persistent offers share a strict 30-day calendar window. Invalid dates and future dates are never considered fresh.
3. **Automatic aging** — helmet, tire and top-box product routes revalidate hourly, so a source-backed observation cannot remain indefinitely frozen as “fresh” after its date ages out.
4. **Persistent-offer safety** — database queries enforce the same lower/upper observed-date window used by source offers; the redirect lookup does the same.
5. **Database resilience** — public commerce blocks fall back to source-backed observations if the optional database is unavailable. Redirect lookup/analytics failures cannot produce a merchant-link 500.
6. **Outbound security** — commerce redirects accept HTTPS destinations only. New ingestion requires a source URL and rejects HTTP source/affiliate destinations.
7. **Source quality** — broad collection/category URLs are not promoted into verified commerce rows. They may remain catalog research references until an exact product/listing URL is verified.
8. **Merchant identity** — all current catalog price-source hosts have explicit classification. EVO's own domain is classified as an official source; known Philippine retailers/marketplaces are labeled accordingly.
9. **Ordering and de-duplication** — public comparisons sort by newest observation first, then lower observed price. Non-marketplace duplicates are collapsed by merchant host, with reviewed database rows preferred over catalog fallback rows.
10. **Privacy-minimized analytics** — persistent click events no longer retain referrer or user-agent fields. They store only persistent/source offer identity, entity reference, merchant label and event timestamp. Source-backed redirects can now be counted server-side when the database is configured.
11. **Validator depth** — `validate:v290` now checks real freshness/date/URL behavior plus database freshness, fail-open routing, ISR, privacy schema/migration, source-host classification and release metadata.

## Deliberate coverage limits

- No exact tire `priceSourceUrl` is present in the current catalog, so tire commerce correctly shows the empty state unless reviewed database offers exist.
- Current top-box catalog data does not yet include an exact price-source URL suitable for a verified commerce row.
- Two helmet price references use broad Motoworld collection pages. v2.9.1 keeps those as research references but excludes them from the verified comparison block until exact product listing URLs are supplied.
- No merchant, price or SKU was fabricated to close these gaps.

## Database migration

Apply Prisma migrations before relying on persistent source-backed click counting:

```bash
npm run db:migrate
```

The v2.9.1 migration makes `OutboundClickEvent.offerId` nullable, adds source-offer/entity/merchant fields, removes referrer/user-agent columns and adds an index for source-offer click review.

## Release gate

Run on a clean checkout with Node 22:

```bash
npm ci
npm run typecheck
npm run build
npm run validate:all
npm run verify:launch
```

A database remains optional for the public source-backed site, but if `DATABASE_URL` is configured, apply migrations before production traffic.

## QA result in the packaging environment

Passed here:

- `npm run validate:v290`
- all historical compatibility validators through v2.8 (run in bounded batches)
- copy-tone validation
- internal-link audit
- content/product-layer checks
- media validation
- lockfile integrity/security-version validation

The registry-dependent clean install could not complete in this sandbox. `npm ci` waited on registry access and the explicit offline retry confirmed the required `undici-types-6.20.0.tgz` was not cached. Because dependencies could not be installed, Prisma CLI validation, full TypeScript typechecking and `next build` are intentionally **not** claimed as passed here. Run the clean release gate above in normal networked CI or on the deployment machine.
