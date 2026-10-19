# MotoIndex — serve AdSense on public guides and motorcycles without a database

## Purpose
MotoIndex's public motorcycle/helmet guides and research pages use the existing TypeScript catalog. A PostgreSQL database is **not needed to render Google AdSense**. The database, Turnstile and Zero Trust bindings are for optional Garage, dealer, owner, lead, alert and administrative capabilities that are not being used.

## Owner-facing release steps
1. Wait for this change to merge into protected `main` and for **all three** new main push checks — CI, Visual QA and Cloudflare Runtime Compatibility — to pass. Never bypass these checks.
2. In GitHub → Settings → Environments → `production` → Variables, confirm **both already configured** owner approvals remain `true`: `MOTOINDEX_ADSENSE_ENABLED` and `MOTOINDEX_ADSENSE_RELEASE_GATES_APPROVED`. The second flag must only remain true if the owner has completed applicable consent/privacy and AdSense account approval checks.
3. In GitHub → Actions → **Deploy MotoIndex Production to Cloudflare** → Run workflow, select `main` and the new **`ads-only`** deployment option (the default). This path needs the **existing** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` GitHub Actions credentials, but **not** PostgreSQL, Cloudflare Access or Turnstile secrets.
4. The deployment still checks current protected-main CI and the AdSense release flags, builds the OpenNext Worker, publishes the public static routes **excluding nonce-protected ad guides and motorcycle documents**, deploys, checks the exact Git SHA and smoke-tests the real public guide script, private route denials and rejected form API.
5. Visit `https://motoindexph.com/guides/motorcycle-helmet-size-guide` in an adblock-free browser. The manual unit (slot `6431580274`) appears after the second guide article section. The same responsive slot is also used on `/motorcycles`, verified brand price lists, and indexable motorcycle model and family pages. There is no AdSense unit on the homepage. Confirm the script, actual ad rendering, Google AdSense property/site approval and impression count. Presence of the script is not proof that Google returned a paid advertisement.

## Built-in safety
- `NEXT_PUBLIC_MOTOINDEX_ADS_ONLY_MODE=true` is **build-time**, set automatically by the workflow. No Cloudflare dashboard runtime variable is required.
- All writes and private account, quote, garage, dealer, alert, admin and database-backed API endpoints fail closed with HTTP 503, `Cache-Control: no-store`, noindex, `Referrer-Policy: no-referrer` and provider-blocking CSP. Private account navigation is hidden. Public guides/search/model research remain available.
- The static edge HTML publisher does not copy AdSense-supported guides, motorcycle documents, or private/customer routes, so Cloudflare cannot bypass the Worker's CSP nonce through `run_worker_first: false`.
- The existing full backend deployment remains available by explicitly choosing `full`; **that** mode still requires all five Worker bindings and full admin/production preflight validation.
- Do not enter fake database URLs. Do not paste Cloudflare API tokens, customer links, Google keys, or credentials in GitHub comments or this chat.

## If ads do not display
- A green deployment proves the code is live, **not** that AdSense has approved `motoindexph.com` or filled its ad unit. Check Google AdSense → Sites for approved/Ready, publisher `pub-1900865456140693`, ad unit `6431580274`, and root `/ads.txt` seller entry.
- Check ad blocker, consent/CMP, browser Console for CSP errors, and Network for the Google loader and ad requests using **public** guide and motorcycle pages only.
- Check the Cloudflare Worker deployment version and the GitHub Actions logs. On failed smoke tests, investigate rather than saying revenue is live.
- On any private-URL or consent leak, turn both GitHub production advertising Environment variables back to `false`, then rerun the reviewed deployment workflow to build an ads-disabled Worker.

This deployment mode intentionally does not activate unused business products. It does not turn on GA4 or Plausible. Leave issue #466 open until the AdSense account and live-browser privacy acceptance are independently verified.

## Motorcycle-page extension

After PR #501 merges, rerun the manual `ads-only` production workflow on the latest protected `main` commit **after all push checks pass**. It requires no database. Smoke QA confirms one anonymous current model, brand and directory HTML response has an AdSense nonce CSP, Google loader, approved slot and no-store header. This shows the integration is deployed, but live filled ads and impressions still depend on the independently approved AdSense account and consent.
