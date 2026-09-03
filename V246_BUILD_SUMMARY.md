# MotoIndex PH v2.4.6 — Launch Workflow Hardening

v2.4.6 does not add another public product surface. It removes launch friction and fixes the deployed smoke-test contract so the current public site can be shipped safely.

## Fixed

- Corrected the production smoke test so the intentionally public `/used-motorcycles/repo` and `/used-motorcycles/buying-checklist` pages are expected to return 200 and are allowed in sitemaps.
- Prototype/private used-market routes remain expected to return 404/noindex in production.
- Sitemap smoke validation now parses actual `<loc>` URLs instead of using a blanket substring check that could misclassify allowed descendants.
- Production smoke checks now verify core security headers on the homepage, including HSTS on HTTPS deployments.
- Added maintenance and ownership pages to the production smoke set.

## Launch preparation

Added:

```bash
npm run launch:prepare -- --site https://your-domain.com --email hello@your-domain.com
```

This command:

- validates the real HTTPS production origin;
- validates a real monitored contact mailbox;
- generates strong admin credentials locally when they are not already supplied;
- writes `.env.production.local` with mode 0600;
- keeps analytics search-term capture off by default;
- keeps database and affiliate features optional/off until deliberately configured;
- refuses to overwrite an existing local production env unless `--force` is provided.

`.env.production.local` is git-ignored and must not be committed. A safe `.env.production.example` is included for hosting-provider setup.

## Required external inputs before public traffic

The repository cannot invent these values:

1. real production HTTPS domain;
2. real monitored public contact mailbox;
3. deployment environment capable of `npm ci`, TypeScript checking and `next build`;
4. deployed URL for `npm run smoke:production`.

## Launch sequence

```bash
npm run launch:prepare -- --site https://your-domain.com --email hello@your-domain.com
# load/copy .env.production.local values into the deployment environment
npm run refresh:security-lock
npm ci
npm run verify:launch
# deploy
BASE_URL=https://your-domain.com npm run smoke:production
```

Database and affiliate configuration remain optional for the current public research/SEO launch.

## Verification performed in this build environment

- `npm run validate:all` — PASS
- `npm run validate:lockfile` — PASS
- `launch:prepare` generated a mode-0600 test env file and the test file was deleted afterward — PASS
- `npm run launch:status` with production-shaped temporary values — SOURCE PREFLIGHT CLEAR
- `npm ci --offline --ignore-scripts` — could not complete because this sandbox does not have every npm tarball cached (`undici-types@6.20.0` was missing). This is an environment limitation; run the networked install before deployment.
