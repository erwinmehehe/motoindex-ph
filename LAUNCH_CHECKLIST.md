## Fast path for v2.4.6

Create a private production environment file locally (never commit it):

```bash
npm run launch:prepare -- --site https://<real-production-origin> --email <real-monitored-mailbox>
```

The command validates both values and generates strong admin credentials if they are not already present. Copy those values into the production hosting environment.

# MotoIndex PH v2.4.4 launch checklist

## Current launch posture
The public product is source-gated and intentionally conservative: review-state motorcycles stay out of indexed discovery, prototype lead/marketplace flows are disabled, affiliate redirects fail closed, admin/ingestion surfaces are protected, and the Helmet Finder only uses verified helmet records.

Run this first for a concise operator-readable report:

```bash
npm run launch:status
```

The report separates true launch blockers from optional monetization and the database-backed ingestion subsystem.

## Code gates already implemented
- Motorcycle indexation requires `freshness: "verified"`, an HTTPS source URL, a checked date, and no review/pending source label.
- Review-state motorcycles are excluded from indexed hubs, search, fitment, recommendations/comparisons and motorcycle sitemaps.
- Dealer leads and price alerts are disabled and do not read submitted bodies.
- Seller offers return HTTP 410 while the production database is absent; once Postgres is configured, `/api/offers` exposes only verified published database offers. The synthetic used-listing API remains disabled.
- Prototype marketplace routes are hidden from navigation and return HTTP 404 in production.
- `/admin/*`, `/api/admin/*` and `/api/ingestion/*` support fail-closed Cloudflare Access enforcement in production and send `no-store` plus `X-Robots-Tag: noindex`. Basic Auth remains a migration/local fallback.
- Privacy notice documents the research-launch data handling posture.
- Dependencies are exact-pinned and deployment is required to use the committed lockfile with `npm ci`.
- `npm run verify` now runs `npm run validate:lockfile` explicitly, so package/lock dependency drift cannot be missed by the release gate.
- Verified motorcycle facts automatically age out of public/indexable surfaces after 90 days without a recheck; market-price checks are flagged for refresh after 30 days.
- Finance API inputs are bounded and financing calculators start from the displayed observed-market starting price while remaining editable.
- Estimated fuel economy is explicitly labeled in commuter cost surfaces.
- Affiliate routes are fail-closed, no-store/noindex and only render public CTAs when approved configuration plus verified product media exist.

## Required operator values
Set these in the production platform, never in committed source:

```text
NEXT_PUBLIC_SITE_URL=https://<real-production-origin>
NEXT_PUBLIC_CONTACT_EMAIL=<real-monitored-mailbox>
ADMIN_ACCESS_MODE=cloudflare
ADMIN_ACCESS_EMAILS=<comma-separated approved admin email identities>
ADMIN_USERNAME=<8+ character private username; local/basic fallback only>
ADMIN_PASSWORD=<20+ character unique password; local/basic fallback only>
NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS=false
OWNER_REVIEWS_ENABLED=false
```

Keep `NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS=false` unless you deliberately choose to capture search terms under the published privacy policy. Keep `OWNER_REVIEWS_ENABLED=false` until the owner-review migration is deployed and a moderator is ready to review submissions.

`DATABASE_URL is optional` for the static public research launch, but v2.4.4 now uses `@prisma/client` for persistent offer ingestion. Without Postgres, the public research pages keep their static/source-gated fallbacks while staging, review, publishing, price history and expiry stay unavailable. To activate persistence, set `DATABASE_URL`, then run `npm run db:migrate` and `npm run db:seed`.

Affiliate maps remain optional and fail closed when empty. The site can launch without them, but shopping CTAs and affiliate revenue remain off until approved links are configured through `AFFILIATE_LINKS_JSON` or the legacy Shopee map.

Google AdSense is also optional and fail-closed. Keep `NEXT_PUBLIC_ADSENSE_ENABLED=false` until a real account is approved and the required consent controls are ready. Configure `ADSENSE_PUBLISHER_ID=pub-################` for the root `/ads.txt` seller declaration and `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-################` for the browser loader. Never commit either as a placeholder. After deployment, verify `https://motoindexph.com/ads.txt` returns HTTP 200 and the exact seller line shown by AdSense before enabling ads.

## Security gate — preserve the registry-generated lockfile
MotoIndex remains pinned to **Next.js 15.5.27**. The launch-ready v2.4.7 candidate has a registry-generated npm lockfile with matching Next/@next/SWC 15.5.27 records and npm-published SRI metadata.

This UI/tooling overlay intentionally does **not** replace or regenerate `package-lock.json`. Apply it over the launch-ready source tree, keep that lockfile byte-for-byte, and use `npm ci` for deployment. Do not run `refresh:security-lock` in an offline or sandboxed environment.

Run the normal gate against the preserved launch-ready lockfile:

```bash
npm run validate:lockfile
npm ci
npm run verify:launch
```

## Required release gates
A source tree is eligible for deployment only when all of the following pass:

```bash
npm run launch:status
npm run validate:lockfile
npm run verify:launch
```

`verify:launch` runs the launch preflight, the full source validator chain, strict lockfile validation, Prisma schema validation, TypeScript checking and the production Next.js build.

## Deployment checks
After deployment, run:

```bash
BASE_URL=https://<real-production-origin> npm run smoke:production

The production smoke suite explicitly expects `/used-motorcycles/repo` and `/used-motorcycles/buying-checklist` to be public, while the synthetic `/used-motorcycles` marketplace root/details remain blocked/noindex.
```

Then manually verify:
- TLS certificate and HTTPS redirect.
- Home, motorcycle hub/model, commuter hub/calculators, comparison/finder, Helmet Finder/comparison, tire, accessory and ownership pages on desktop and mobile.
- `/robots.txt`, `/ads.txt` (when AdSense is configured), `/sitemap.xml`, `/sitemaps/motorcycles.xml`, `/sitemaps/gear.xml`, `/sitemaps/commerce.xml`.
- No prototype/demo URLs appear in sitemaps.
- Unauthenticated `/admin/data-health` is denied (403 under Cloudflare Access mode, 401 under Basic Auth fallback); prototype marketplace routes return 404.
- `/api/leads`, `/api/price-alerts` and `/api/used-listings` reject requests as expected. `/api/offers` returns 410 without Postgres and verified-only data when persistence is configured.
- A configured affiliate destination redirects through `/go/affiliate/<productId>`; an unconfigured product fails closed rather than producing a fake shopping link.
- Google Search Console property, sitemap submission and initial URL inspection after DNS is stable.
- Field Core Web Vitals after real traffic begins; source-level checks cannot substitute for production RUM.

## Launch decision
Launch only when the project remains on Next.js 15.5.27 or newer in the supported 15.5 line, the registry-generated launch-ready lockfile is preserved, `npm run verify:launch` passes with the real production environment, and the deployed `npm run smoke:production` passes.


## Cloudflare Access production gate
Before setting `ADMIN_ACCESS_MODE=cloudflare`:
1. Create a Cloudflare Access application covering `/admin/*`, `/api/admin/*`, and `/api/ingestion/*`.
2. Require your identity provider and MFA in the Access policy.
3. Set `ADMIN_ACCESS_EMAILS` to the exact approved administrator identities.
4. Verify Cloudflare injects both the authenticated-user email header and Access JWT assertion.
5. Confirm direct-origin access cannot bypass Cloudflare.
6. Test an approved identity, a denied identity, and an unauthenticated request before production enablement.


## Garage-verified owner review production gate
Before setting `OWNER_REVIEWS_ENABLED=true`:
1. Configure `DATABASE_URL`, Garage cloud sync and owner email authentication.
2. Apply all Prisma migrations, including `20261004190000_add_owner_reviews`.
3. Confirm `/admin/owner-reviews` is protected by the production admin perimeter.
4. Assign a moderator and review the published privacy notice.
5. Submit a test review from a synced Garage motorcycle and confirm it remains `pending` until an administrator explicitly publishes it.
6. Confirm the public model page exposes no email, plate, documents or other private Garage fields.
7. Confirm one owner account cannot create multiple reviews for the same MotoIndex model.
8. Confirm rating aggregates stay hidden below 3 published owners and fuel/maintenance aggregates stay hidden below 5 reports.
9. Apply `20261004223000_add_owner_intelligence_v2` before enabling Owner Intelligence contribution.
10. Confirm the Owner Intelligence checkbox is optional and that leaving it unchecked stores no derived intelligence snapshot.
11. Confirm unchecking Owner Intelligence on an edited review clears the previously stored derived snapshot.
12. Confirm no public intelligence metric or common maintenance category appears below 5 consented contributors.
13. Confirm account export includes the owner's intelligence consent and derived snapshot, while public model APIs expose aggregates only.
