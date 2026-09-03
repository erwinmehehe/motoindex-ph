# v2.4.7 R6 — Local media standardization

This release hardens MotoIndex entity imagery around a local-first primary-image contract without touching `package-lock.json`.

## Standard

- one primary image record per entity
- 1:1 aspect ratio
- 1200 × 1200 canonical canvas
- solid white background
- contain fit (no wheel/product cropping)
- WebP canonical derivative
- stable descriptive kebab-case filenames
- useful entity-specific alt text
- original checked image URL/source/rights metadata retained for provenance

## Implementation

- `lib/media.ts` now points canonical entity `src` values at `/public/media/...` paths and retains checked upstream images in `sourceImageUrl`.
- `SafeEntityImage` tries the local derivative first, then the checked upstream source only as a migration fallback.
- `EntityMedia` keeps the existing source credit and labels these records as local-first media.
- all entity/product media canvases are forced to white and use contain-fit behavior.
- `scripts/sync-entity-media.mjs` downloads source-backed images and generates 1200 × 1200 white-canvas WebP files using Sharp.
- `scripts/validate-media.mjs` enforces one-primary-per-entity, local path/format/naming, alt text and dimensions. `MEDIA_STRICT_LOCAL=1` additionally requires every local derivative to exist.
- `MEDIA_STANDARD.md` documents the contract.
- `PRODUCTION_ROADMAP.md` now tells future ChatGPT sessions to preserve this local-first standard.

## Migration state

The current execution environment cannot resolve the upstream image hosts and has no installed project dependencies, so the binary derivative sync cannot be completed here. The schema is switched to local-first and retains upstream fallback URLs so the site does not lose imagery during migration.

Run in the networked launch-ready checkout:

```bash
npm run media:sync
MEDIA_STRICT_LOCAL=1 npm run validate:media
```

After strict validation reaches zero missing derivatives, remote image fallback/allowlists can be removed in a later hardening pass.

## Validation

`npm run validate:all` passes with the migration-aware media validator. The authoritative registry-generated security lockfile remains intentionally untouched and is excluded from the overlay.
