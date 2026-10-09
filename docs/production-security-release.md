# MotoIndex production security and release setup

The code in draft PR #461 adds release checks and Cloudflare Turnstile. It does **not** configure your Cloudflare account, GitHub rulesets or email mailbox.

## Release workflow

- There must be exactly one deployment workflow: `.github/workflows/cloudflare-production-deploy.yml` (manual dispatch only).
- Disable or protect any external Cloudflare Workers Builds Git integration that would auto-deploy on a push; it could bypass GitHub release gates.
- The release gate verifies the **current main SHA** and successful main-branch **CI**, **Visual QA**, and **Cloudflare Runtime Compatibility** push runs. A missing, failed or pending check blocks deployment.
- The workflow preserves static HTML publishing via `scripts/publish-prerender-assets.mjs` and runs public-route/contact smoke tests after deployment.
- In GitHub, protect `main`: require pull requests, a human review, and the `CI / build`, `Visual QA / browser-qa`, and `Cloudflare Runtime Compatibility / validate` status checks. Prevent direct pushes and force pushes.
- Configure the GitHub `production` environment with required reviewers and least-privilege Cloudflare credentials. The workflow only **names** the environment; reviewers must be enabled in GitHub settings.

## Contact

Set GitHub **production environment variable** `MOTOINDEX_CONTACT_EMAIL` to a genuine monitored mailbox. Confirm you can receive messages there. The build fails its launch preflight when the variable is blank, and the post-deployment smoke checks for a working contact link. These checks do **not** prove inbox delivery; send a test message.

## Deployed Worker secret bindings

The canonical release workflow now fails before deployment unless Cloudflare reports runtime secrets for `DATABASE_URL`, `TURNSTILE_SECRET_KEY`, `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`, and `ADMIN_ACCESS_EMAILS`. It uses `wrangler secret list --format json` to check names only and does not print secret values. Configure these as encrypted *Worker runtime secrets* as well as any corresponding GitHub release environment values; having them in GitHub alone does not satisfy the deployed Worker check. The release workflow also fails if `main` is not protected.

## Cloudflare Access / MFA

Set Cloudflare Access to protect `/admin*`, `/api/admin*`, and `/api/ingestion*`. Require MFA, an explicit identity allowlist and a policy for privileged sessions. In the GitHub production environment, set `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD` and `ADMIN_ACCESS_EMAILS`. Configure the equivalent settings for the **deployed Worker runtime**, not only for the build job. Production middleware rejects Basic Auth.

Verify with a browser: anonymous visits are denied; approved MFA identities work; non-approved identities cannot reach any admin/ingestion endpoint.

## Turnstile and abuse protection

Create a Turnstile widget allowing `motoindexph.com` and `www.motoindexph.com`. Add the public site key as GitHub production variable `MOTOINDEX_TURNSTILE_SITE_KEY` and the secret as GitHub production secret `MOTOINDEX_TURNSTILE_SECRET_KEY`. Provision the **server-only** `TURNSTILE_SECRET_KEY` in the Cloudflare Worker runtime as a secret. Ensure the public site key is available at build time.

The production lead, dealer application, price alert and used-listing inquiry endpoints fail closed if verification keys are absent. The application checks each challenge token on the server, including action and hostname; the token is short-lived and single-use. Verify all four form flows on a preview before releasing.

Turnstile is **not** a replacement for rate limiting. In Cloudflare WAF, configure and test distributed per-IP rules for these endpoints, and the sign-in request endpoints, plus alerting on elevated 403/429/503 responses. Set thresholds from legitimate traffic; do not block customers behind shared carrier NATs without monitoring. Require approval for rules and use a staging preview before enabling.

## Explicit tracking build configuration

The canonical manual deployment workflow now passes **GitHub production environment variables**, rather than silently relying on a hardcoded GA4 fallback or enabling advertising implicitly:

- `MOTOINDEX_GA_MEASUREMENT_ID` → `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `MOTOINDEX_PLAUSIBLE_SCRIPT_SRC` → `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC`
- `MOTOINDEX_PLAUSIBLE_DOMAIN` → legacy compatible `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `MOTOINDEX_ADSENSE_ENABLED` → `NEXT_PUBLIC_ADSENSE_ENABLED` (default `false`)
- `MOTOINDEX_ADSENSE_CLIENT_ID` → `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- `MOTOINDEX_ADSENSE_PUBLISHER_ID` → `ADSENSE_PUBLISHER_ID`

Do not enable advertising until CSP, consent and actual AdSense account access are verified. GA4 requires disabling Enhanced Measurement history-based automatic pageviews to avoid private SPA URL collection after privacy PR #465. Setting GitHub variables alone does not prove the provider settings are safe. Track account setup in issue #466, and coordinate the merge order with #465.

## Operational gates still outstanding

- Test real database migrations, backups and restoration.
- Review third-party motorcycle image reuse rights before merging image completion PR #459.
- Recruit and authorize real dealer quote receivers; do not publish or route to unapproved dealers.
- Validate email delivery, quote handoff and end-user status links on the production configuration.
- Review live GA4/GSC query + page data for SEO work rather than inventing performance improvements.

Do not merge or deploy draft PR #461 until required CI and manual production configuration are complete.
