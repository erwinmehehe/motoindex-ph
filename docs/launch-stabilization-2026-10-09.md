# MotoIndex PH — Launch Stabilization & Monetization Gate (2026-10-09)

## Decision
Do not consider a passing Cloudflare deployment workflow equivalent to a production launch sign-off. The main branch currently passes CI, Visual QA, Cloudflare Runtime Compatibility and Deployment workflows, but unresolved account-level/security checks and partner/affiliate prerequisites remain.

This is an operator execution plan. It changes no production settings, does not grant rights to third-party media, and does not activate or imply commissioned retailer links.

## Gate A — Release security (P0; issue #462, drafts #461/#467)
- [ ] Protect `main` against direct/force pushes; require review and current-head checks: `CI / build`, `Visual QA / browser-qa`, `Cloudflare Runtime Compatibility / validate`.
- [ ] Establish a reviewed `production` GitHub Environment with least-privilege Cloudflare credentials; prevent any parallel Cloudflare Workers Builds auto-deploy from bypassing it.
- [ ] Configure Cloudflare Access + MFA for `/admin*`, `/api/admin*`, `/api/ingestion*`; install exact audience/team/allowlist runtime settings; test approved, denied and anonymous identities and origin bypass.
- [ ] Configure a working monitored business inbox; send and receive a real test before publishing contact details.
- [ ] Configure site-scoped Turnstile, runtime and release secrets; verify quote, dealer application, inquiry and alert flows including failure modes. Add independent distributed WAF abuse controls.
- [ ] Validate release smoke, recovery/rollback, database migration and restore plan on staging.
- [ ] Ship combined security changes only after the actual integrated HEAD passes all checks and reviewer confirms operator evidence. Draft #467 is an integration rehearsal, not an approved deployment.
**Evidence:** redacted Cloudflare Access policy test results, release protection settings, inbox receipt, forms QA, exact workflow URLs, smoke output.

## Gate B — Analytics and privacy (P0; issue #466, draft #465)
- [ ] Owner verifies actual GA4 stream ID; set an explicit `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Do not substitute a historical hardcoded ID.
- [ ] Disable GA4 Enhanced Measurement browser-history pageview capture and verify it stayed disabled.
- [ ] Check public -> private -> public navigation and direct private URL load in browser Network: no token, buyer data or private path in third-party requests; no duplicates.
- [ ] Verify Plausible site-specific script (if used), consent mechanism and privacy notices before enabling third-party tracking.
- [ ] Verify AdSense publisher account and actual consent/enablement; preserve off-by-default when not approved. Confirm `/ads.txt` on production.
**Evidence:** redacted account config, DevTools network checks, GA4 DebugView and click/event baseline. Do not include secrets or private URLs.

## Gate C — Affiliate trust and first monetized model (P1; issues #470/#473, draft #469)
- [ ] Keep generic homepage/search/global network shortcuts disabled. Never map the same opaque tracking URL to unrelated product IDs.
- [ ] For `gille-kerena-ff007`, manually verify the exact Shopee merchant product, variant and final page on desktop/mobile. Its prior observed source is a dated editorial reference, not stock confirmation.
- [ ] In the approved network account, produce a unique product-level tracked URL and independently verify the final destination (the site cannot generate genuine monetized attribution without authorized credentials).
- [ ] Prepare controlled DB migration for PR #469's `AffiliateProductLink.destinationUrl`, check backup/rollback, then update the protected affiliate admin record with destination proof/date; do not merge schema-dependent changes before migration planning.
- [ ] Verify public CTA and `/go/affiliate/gille-kerena-ff007/shopee` browser behavior, disclosure, click telemetry and real network conversion attribution.
- [ ] Use `docs/affiliate-product-coverage-2026-10-09.csv` as the catalog tracker. Current issue #473 snapshot: 246 verified gear products; 103 dated direct retailer item references (18 Shopee, 85 other) and 143 needing direct-item research. Source links are **not** commissioned links.
- [ ] Prioritize models with actual traffic, verified sources and obtainable authorized affiliate links; hide unverifiable retailer CTAs, never invent item IDs.
**Evidence:** item identity, product URLs, checked dates, redacted network link validation and actual account conversion results.

## Gate D — Buyer conversion pilot (P1; issue #464)
- [ ] Select one geography based on live coverage; do not claim national dealer availability.
- [ ] Obtain explicit lead-delivery permission and working routing contacts from at least five Honda/Yamaha dealer branches.
- [ ] Test: researched model -> city/province availability -> consent -> private lead -> approved dealer delivery -> quote response.
- [ ] Assign lead-response owner and SLA; monitor qualified outcomes without exporting buyer PII to analytics.
- [ ] Keep buyer contact collection closed when no approved receiving dealership exists.

## Gate E — Content and technical SEO (P2; drafts #458/#459, issue #463)
- [ ] Resolve dated price-source and model H1 regression checks on merged candidate HEAD; do not represent spec dates as price verification dates.
- [ ] Do not merge the 20-image backfill without individual photo reuse rights and exact model/generation visual QA. An external source URL is not a redistribution license.
- [ ] Test public motorcycle/helmet research, comparison, calculators and sitemap canonicalization across mobile/desktop.
- [ ] Submit and verify sitemaps in actual GSC property; check canonical/indexable URLs, field Core Web Vitals, real visitor conversion paths.
- [ ] Keep research-only and prototype marketplace/lead flows blocked.

## Proposed merge and release sequence
1. **Operator setup before code release:** #462 and #466 must have real evidence; no assumption that GitHub success proves credentials/accounts are safe.
2. **Integrated release candidate:** reconcile #461 + #465 + #458 using #467 or a freshly rebased successor. Retest combined latest HEAD and review changed files. Avoid individually merging overlapping drafts out of order.
3. **Safe catalog UX:** preserve already merged exact-item fallback changes. Verify source-only retailer CTA behavior; do not turn editorial links into affiliate claims.
4. **Affiliate schema follow-up:** migrate and stage #469 separately after DB/operator approval; verify product-level mappings before tracking goes live.
5. **Images:** resolve licensing issue #463 before merging #459.
6. **Final release:** peer approve; manual guarded production deployment; production smoke + real-browser buyer/retailer checks; rollback on regression.

## Stop conditions
- Required status checks stale/missing, unprotected main, or competing auto-deploy path.
- Admin API reachable without approved access, Turnstile bypass, private token in analytics.
- No confirmed live inbox, no authorized dealer receiving a lead, or any unauthorized affiliate link.
- Product button opens storefront/category instead of the reviewed exact SKU.
- Unlicensed image proposed for production.
- Failed real-production smoke/critical mobile journey.

**Release owner sign-off:** not yet recorded. **Public launch-ready claim:** not approved by this document.
