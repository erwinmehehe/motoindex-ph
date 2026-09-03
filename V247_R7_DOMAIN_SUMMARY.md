# MotoIndex v2.4.7 R7 — motoindexph.com domain cutover

## Canonical-domain changes

- Default `SITE_URL` changed from `https://motoindex.ph` to `https://motoindexph.com`.
- Entity-media sync user-agent provenance URL changed to `https://motoindexph.com`.
- `.env.production.example` now defaults `NEXT_PUBLIC_SITE_URL` to `https://motoindexph.com`.
- Active overlay scan contains no `motoindex.ph` references.
- `package-lock.json` is intentionally absent and must remain the registry-verified file from the launch-ready checkout.

## Validation run

- `node scripts/validate-v247.mjs` — passed.
- `node scripts/check-internal-links.mjs` — passed.
- `node scripts/validate-media.mjs` — schema passed; 91 local image derivatives remain pending networked sync, as expected.

## Production host policy

Canonical: `https://motoindexph.com`

Recommended redirect: `https://www.motoindexph.com/*` → `https://motoindexph.com/*`.
