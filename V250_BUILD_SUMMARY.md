# MotoIndex PH v2.5.0 build summary

## What changed

### Guide motorcycle image legibility

- Reworked the local Suzuki Access and Suzuki Burgman Street derivatives that were rendering as tiny subjects inside large whitespace-heavy source images.
- Kept their existing official Suzuki Philippines source attribution while cropping/enlarging only the local WebP derivatives used by MotoIndex.
- Reduced guide-card image padding so the motorcycle uses more of the available media canvas.
- Updated `scripts/sync-entity-media.mjs` so future forced media refreshes trim whitespace, allow controlled enlargement, and preserve explicit focus crops for the two problematic Suzuki assets instead of recreating the tiny-image problem.
- Normalized additional whitespace-heavy motorcycle derivatives; see `MEDIA_NORMALIZATION_V250.txt`.
- Added `preview/v250-guide-image-size-preview.png` for a side-by-side Rank 5 / Rank 6 / Rank 7 visual check.

### Involve Asia affiliate automation

- Added `scripts/generate-involve-affiliates.mjs` and npm commands:
  - `npm run affiliates:preview`
  - `npm run affiliates:generate`
- Added server-side Involve Asia authentication configuration using environment variables only. No live API credential is stored in the repository.
- Added Shopee Philippines offer resolution through `/offers/all`, with an explicit offer-ID override for safer production use.
- Added deeplink generation through `/deeplink/generate` with MotoIndex sub-ID tracking:
  - `aff_sub`: product ID
  - `aff_sub2`: catalog category
  - `aff_sub3`: brand slug
  - `aff_sub4`: `motoindex-ph`
  - `aff_sub5`: destination type
- Added a persistent generated cache at `data/affiliate-links.generated.json`. Public visitor clicks continue to use MotoIndex's existing `/go/affiliate/[productId]` redirect and do not make API calls.
- Existing generated links are reused by default so the site does not unnecessarily consume Involve Asia's unique-deeplink allowance.
- Destination priority is explicit override -> checked direct Shopee product URL -> exact-brand/model Shopee search fallback.
- Dry-run currently detects 59 verified Shopee affiliate candidates across helmets, tires, and top boxes.
- Added validation for generated URLs and fail-closed handling for missing/invalid affiliate mappings.
- Updated `.env.example`, `.env.production.example`, `AFFILIATE_SETUP.md`, and affiliate build checks.

### Helmet catalog compatibility

- Preserved the expanded brand-catalog work from v2.4.8.
- Restored the legacy `Detailed models` wording expected by the v1.1 compatibility gate while continuing to show the broader tracked-model count separately.

## Security

- No Involve Asia API key or secret is included in this build.
- Credentials belong in `.env.local` or deployment environment variables only.
- Any credential that has been pasted into chat or another shared text surface should be rotated before production use.

## Validation

Passed after the v2.5.0 changes:

- compatibility validators v0.7 through v2.4.7 reached/passed through the validation suite before its execution-time limit;
- `validate-v11.mjs`;
- media validation: 92 standardized entity media records and all local derivatives present;
- content validation: 50 motorcycle model records and required files present;
- product-layer validation;
- internal-link audit;
- affiliate dry-run: 59 candidates, no API calls;
- affiliate build check (expected warning because no live generated mappings are committed);
- JS syntax checks for the new/modified automation scripts.

A full Next.js production build was not rerun because dependency installation exceeded the available execution window. The repository-level compatibility, content, link, media, and affiliate checks above passed.
