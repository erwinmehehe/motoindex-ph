# MotoIndex PH v2.1.1 build summary

## Real motorcycle image hardening

- Removed every remaining generic motorcycle illustration from the motorcycle media layer.
- Filled the seven motorcycle records that previously had no dedicated media record.
- Replaced all former Zigwheels-linked/placeholder slots with distinct, model-specific real image references.
- Final coverage is **50 motorcycle records / 50 motorcycle media records**, with **0 missing**, **0 duplicate image URLs**, **0 Zigwheels media URLs**, and **0 generic motorcycle SVG placeholders**.
- Source priority is manufacturer-hosted Philippine media first, then authorized Philippine dealers. The discontinued Honda Click 150i uses an attributed isolated historical image because Honda's current first-party launch page exposes a combined Click125i/Click150i shot.
- Added the Click 150i archive host to the Next.js image allowlist.
- Deleted `public/motorcycles/motoindex-bike.svg`; there is no generic motorcycle artwork fallback in the media dataset anymore.
- Strengthened `scripts/validate-v21.mjs` so regressions fail if a motorcycle loses its unique image, uses SVG instead of real image media, uses a non-HTTPS URL, or references a remote host missing from the Next.js allowlist.
- Updated stale README/roadmap/source notes that still described the temporary SVG phase.

## Verification

Run:

```bash
npm run validate:v21
npm run validate:all
npm run validate:lockfile
```

The source-level validation suite is the release gate available in this sandbox. A production `next build` still requires installed npm dependencies; this source archive intentionally does not ship `node_modules`.

See `MOTORCYCLE_IMAGE_COVERAGE_V211.md` for the full 50-model image-source inventory.
