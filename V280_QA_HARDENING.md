# v2.8 QA Hardening

Applied after design/product QA on 2026-08-27.

## Fixed

- Launch-status lockfile comparison is now order-insensitive, removing the false out-of-sync blocker.
- Finder financing uses a planning purchase price instead of blindly using the cheapest observed market price.
- Finder monthly ownership estimate now includes commute costs plus monthly reserves for insurance, registration, and tires.
- Finder purchase-budget filtering uses the same planning-price basis as affordability calculations.
- Finder URL parameters are allowlisted/normalized before hydrating UI state.
- Finder analytics now cover view, filter changes, generated results, result clicks, top-match clicks, top-two compare, score-breakdown opens, reset, sharing, and zero-results.
- Generic `/go/[offerId]` redirects now return no-store and noindex/nofollow/noarchive headers.
- Global security headers now include a Content-Security-Policy compatible with the optional GA/Plausible integrations.
- Admin/ingestion Basic Auth now has best-effort per-client throttling after repeated failed attempts.
- v2.8 and launch-hardening validators now assert the new QA safeguards.

## Verification

`npm run validate:all` passes end-to-end, including internal-link and media audits.

A clean `npm ci`, TypeScript check, and Next.js production build still need to run in the networked deployment environment because dependencies are not bundled in this source archive.

Production launch also still requires real values for `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`.
