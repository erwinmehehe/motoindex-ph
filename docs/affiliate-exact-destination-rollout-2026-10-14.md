# Exact affiliate destination rollout (hold until approved)

PR #485 adds a **nullable** `AffiliateProductLink.destinationUrl` column. The migration is additive, but new runtime Prisma code must **not** be deployed against an unmigrated database. The external affiliate account, merchant redirects and database availability are not verifiable from a code-only PR.

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
- Release from the approved manual workflow only after staging, account-level affiliate and Access evidence pass. The release job now performs a **read-only** `npx prisma migrate status --schema prisma/schema.prisma` before building or deploying, and stops if any schema migrations are still pending, failed or divergent (or database access fails). It **never** applies the migration automatically. Avoid turning on Git-triggered automatic deploys to work around this gate.
- Monitor admin errors, unexpected fallbacks and conversion links. On failure, **roll back the application deployment first**; retain the harmless nullable column rather than dropping schema changes without a documented data restoration plan.

**Current status:** No MotoIndex staging or production migration has been performed by PR #485. No tracking URL is deemed verified merely because it passes syntactic URL validation. Keep **#485** draft until the operator provides real staging, merchant and access-review evidence.

## Recorded evidence — 14 October 2026

- Integrated PR #485 at `0534d49` passed CI, Cloudflare Runtime Compatibility, and Visual QA before this evidence/test fixture update. Fresh-HEAD checks must be re-run for any later commit.
- Read-only connector discovery found no **confirmed MotoIndex staging database**. Connected Neon branches are labelled PayrollPH; the connected active Supabase project's public tables belong to a recruiting platform. Neither was modified. **Do not assume these are MotoIndex resources.**
- The Shopee product page `https://shopee.ph/GILLE-FF007-Kerena-Mono-Color-Revo-Lens-Full-Face-Single-Visor-Motorcycle-Helmet-i.505955057.25840894725` independently displays a Gille FF007 Kerena item under **Gille Helmets Mall** and matches shop ID `505955057`, item ID `25840894725`. Search-indexed/public-page evidence only: current stock, price, variants, actual checkout, and any opaque Involve Asia redirect still require authenticated mobile/desktop review. This is **editorial**, not an approved commission link.
- `scripts/sql/affiliate-destination-pre-migration.sql` and `scripts/sql/affiliate-destination-post-migration.sql` verify legacy-row preservation and new nullable exact-destination storage. They were initially static fixtures; the later GitHub Actions CI now executes these assertions against its own disposable local PostgreSQL instance. **This is not a MotoIndex staging or production migration.**

### Isolated PostgreSQL rehearsal procedure

Run this only in a disposable PostgreSQL test database expressly created for MotoIndex QA. Do not use a production URL or any other company's staging database. Confirm `DATABASE_URL` points to that isolated database *before* starting and never print credentials into a CI log.

1. Install repository dependencies with `npm ci` and check `npx prisma migrate status` against the selected disposable database.
2. Temporarily move `prisma/migrations/20261009120000_add_affiliate_exact_destination` out of the migrations directory **in the disposable checkout only**; run `npx prisma migrate deploy` to create the historical schema, then restore that migration directory.
3. Run `npx prisma db execute --file scripts/sql/affiliate-destination-pre-migration.sql --schema prisma/schema.prisma` to assert the old column is absent and seed a test legacy affiliate record.
4. Run `npx prisma migrate deploy` to apply the new additive destination column.
5. Run `npx prisma db execute --file scripts/sql/affiliate-destination-post-migration.sql --schema prisma/schema.prisma` and verify that a legacy record is preserved, the new column is nullable, and new exact-item destinations can be stored.
6. Run `npx prisma migrate status` and repeat `npx prisma migrate deploy` to verify there is no pending migration. Preserve the evidence as an isolated PostgreSQL run, **not** as a completed real MotoIndex staging rehearsal.

**Outstanding:** Verify the actual MotoIndex database provider and staging database identity. Do not run the migration against live data; keep PR #485 in draft until the verified application staging migration, rollback practice, protected-route authentication, and genuine merchant tracking-link approvals are documented. Cloudflare's live deployment remains unchanged.

## Latest verified source-only CI evidence — 18 October 2026

On integration commit `40e95b789be879f29ce07a022922e5c2de530af0`, GitHub CI run [39132716202](https://github.com/erwinmehehe/motoindex-ph/actions/runs/39132716202) passed **309 tests in 63 test files**. The log specifically records `tests/affiliateDestinationPostgresRehearsal.test.ts` **1 passed**, approximately 9.9 seconds, against a randomly named **runner-local disposable PostgreSQL** database. The test creates and drops its own local database/role, confirms legacy preservation, applies the nullable migration, and checks idempotence. CI, Visual QA, Cloudflare Runtime Compatibility, and Workers Builds checks all passed for that commit.

These results **do not constitute live merchant approval, actual MotoIndex staging/production migration, backup/restore evidence, an operational MFA review, or a production deployment**. Any later edits to this PR require fresh checks for the new HEAD.

### Verified staging account and merchant blockers

- A read-only discovery of the connected database services identified **no project explicitly verified as MotoIndex staging**. Do not use any merely generic, unrelated or unnamed database as a migration target.
- The owner must identify a MotoIndex-owned staging database, approve its use and demonstrate a backup/restore rehearsal before applying `prisma migrate deploy` there.
- The first Gille Kerena FF007 editorial source (Shopee shop `505955057`, item `25840894725`) is **not** an approved commission-tracked destination. Generate a unique exact-item tracking link in the merchant's approved account, verify the resolved shop/item on desktop and mobile, and attach redacted results (never credentials).
- Release-protection issue [#462](https://github.com/erwinmehehe/motoindex-ph/issues/462) and the separate draft [#491](https://github.com/erwinmehehe/motoindex-ph/pull/491) may both touch the manual release workflow. Reconcile their gates before either branch is allowed into production.
