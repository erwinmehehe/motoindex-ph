# MotoIndex PH v1.4 build summary

**Release focus:** convert the v1.3 “next build” list into source-aware production primitives without publishing unsupported compatibility, ownership, maintenance, or image claims.

## Built in v1.4

### 1. Motorcycle-specific top-box compatibility graph
- Added `lib/topBoxFitment.ts` with explicit product → motorcycle → rack edges.
- Stored SHAD rack codes for Aerox, ADV 160, Click/Vario 160 and PCX, with source URL, covered years, plate note and checked date.
- NMAX V3 is intentionally left `research` because the current SHAD catalog names Turbo/Neo variants and exact Philippine-market equivalence still needs confirmation.
- Model, fitment, accessory and top-box pages now use the stored graph instead of treating capacity as compatibility.
- Capacity-only fallback is allowed only for research products when no exact edge exists.

### 2. Source-backed priority scooter tire layer
- Promoted Pirelli Angel Scooter to `verified` after checking the official Pirelli size catalog.
- The size set covers the stock 13/14-inch sizes used by the five priority scooter records: Aerox V3, NMAX V3, ADV 160, Click 160 and PCX 160.
- Model tire-size pages now surface verified tire families before research records.
- A size match remains a starting point; load index, speed rating, rim compatibility and clearance are still required before purchase.

### 3. Rights-aware image pipeline
- Added `EntityMedia`, `MediaRightsStatus`, `lib/media.ts` and `components/EntityMedia.tsx`.
- Rendering is through `next/image` and is gated to first-party/licensed assets; pending assets are not rendered.
- Motorcycle, helmet, tire and top-box hero slots are wired to the media layer with existing abstract visuals as fallbacks.
- Added Prisma `MediaAsset` contract for persistent rights/source metadata.
- No manufacturer/dealer images were scraped or bundled. Real photography remains an asset/licensing task, not a code gap.

### 4. Current-source ownership guides
Added indexable, source-dated guides for:
- `/ownership/registration-renewal`
- `/ownership/transfer-of-ownership`
- `/ownership/motorcycle-insurance`

The guides cite current official LTO / Insurance Commission sources, store checked dates and avoid freezing fee/deadline claims that have changed.

### 5. Maintenance data contract without invented intervals
- Added Prisma `MaintenanceRecord` with generation, source, interval, specification, verification and freshness fields.
- No model-specific interval is published until an official owner/service manual or manufacturer service source is available for that exact model/market.
- This is intentionally an evidence gate, not missing implementation.

### 6. Technical QA fixes
- Fixed `ModelFamily` sitemap typing (`generationIds`, not the removed `modelIds`).
- Removed noindex `/corrections` from sitemap output.
- `/contact` is only indexable/in the sitemap when `NEXT_PUBLIC_CONTACT_EMAIL` is configured.
- Removed the absolute `/mnt/data/motoindex-ph-next` dependency from the product-layer validator.
- Added `validate:v14`, `validate:all`, `prisma:validate` and `verify` scripts.
- Added source-level checks for compatibility, tire verification, ownership guides, media/maintenance contracts, sitemap rules and TypeScript/TSX syntax.

## Verification run

Passed in the build environment:
- v0.5, v0.6, v0.7, v0.8, v0.9, v1.0, v1.1, v1.2, v1.3 and v1.4 validators
- content validation
- product-layer validation
- internal-link audit (50 route patterns / 77 source files)
- TypeScript/TSX syntax transpilation (114 source files)

A full `npm run verify` could not be executed in the sandbox because outbound DNS to `registry.npmjs.org` is unavailable and the uploaded archive did not include `node_modules`. After dependency installation in a networked environment, run:

```bash
npm install
cp .env.example .env
npm run verify
```

## Source set checked 2026-08-25

- SHAD official motorcycle fitment/product catalog: `https://www.shad.es/`
- Pirelli official Angel Scooter catalog: `https://www.pirelli.com/tyres/`
- GIVI official B32N product page: `https://www.givi.it/`
- Land Transportation Office: `https://lto.gov.ph/` and `https://portal.lto.gov.ph/`
- Insurance Commission: `https://www.insurance.gov.ph/`
- Honda Philippines owner/service entry points: `https://www.hondaph.com/owner-manual` and `https://www.hondaph.com/service-calculator`

## Still gated by external evidence / operations

1. Rights-cleared motorcycle/product photography.
2. Exact Philippine-market NMAX V3 SHAD rack confirmation.
3. Model-specific maintenance intervals from exact owner/service manuals.
4. Live dealer/retailer, used-listing and insurance-product feeds.
5. Postgres repository activation, auth and scheduled ingestion jobs.
