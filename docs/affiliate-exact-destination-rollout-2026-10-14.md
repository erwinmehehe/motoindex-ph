# Exact affiliate destination rollout (hold until approved)

PR #469 adds a **nullable** `AffiliateProductLink.destinationUrl` column. The migration is additive, but new runtime Prisma code must **not** be deployed against an unmigrated database. The external affiliate account, merchant redirects and database availability are not verifiable from a code-only PR.

## Pre-deployment prerequisites

- The site owner approves a controlled staging environment and a rollback plan; production Git-triggered builds stay disabled.
- Database operator confirms an up-to-date encrypted backup/snapshot with a tested restore path, current database URL scope, and no pending unexpected migrations.
- Run `npx prisma migrate status` against **staging**, preserving logs but never printing `DATABASE_URL` or authentication secrets.
- Apply `npx prisma migrate deploy` in staging. Verify `AffiliateProductLink.destinationUrl` exists and permits NULL (legacy rows remain unchanged).
- Execute `npm run test:unit`, `npm run typecheck`, `npm run build` and CI / Visual QA / Cloudflare Runtime Compatibility on the merged target commit.

## Acceptance checks after staging migration

1. Previously active opaque tracked URLs **without** a verified destination must no longer be presented as proven exact-item offers. Direct exact Shopee links remain eligible.
2. For `gille-kerena-ff007`, confirm the editorial Shopee item ID on a real mobile and desktop browser; this editorial link is **not** proof of a tracked commission.
3. Generate an actual item-level tracking link in the user's own approved Shopee/Involve Asia account; save the independently verified item URL alongside it and confirm the final redirect points to the same model/variant/seller.
4. Confirm the admin PUT, DELETE and bulk endpoints reject anonymous / unauthorized identities **before querying or modifying the database**.
5. Check duplicate tracked links and duplicate item destinations across product IDs are rejected and a disabled legacy record cannot reactivate by fallback.
6. Confirm /admin, /api/admin and /api/ingestion are protected by the required Cloudflare Access/MFA release controls (#462). Do not bypass this to publish affiliate links.
7. Test staging smoke and negative-access cases, then decide whether to promote a manually approved production release.

## Controlled production change (requires separate approval)

- Take/verify a fresh production backup and capture migration-status evidence.
- Apply `prisma migrate deploy` against production before deploying code that references `destinationUrl`.
- Release from the approved manual workflow only after staging, account-level affiliate and Access evidence pass. Avoid turning on Git-triggered automatic deploys to work around this gate.
- Monitor admin errors, unexpected fallbacks and conversion links. On failure, **roll back the application deployment first**; retain the harmless nullable column rather than dropping schema changes without a documented data restoration plan.

**Current status:** No staging or production migration has been performed by this PR. No tracking URL is deemed verified merely because it passes syntactic URL validation. Keep #469 draft until operators provide evidence.
