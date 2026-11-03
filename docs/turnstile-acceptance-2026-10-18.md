# MotoIndex Turnstile release acceptance — operator checklist

Status: **unverified; do not merge or deploy as a live public-form change**.
Related: draft PR #491, release-security issue #462, AdSense/private-route issue #466.

## Prerequisite account configuration (owner-operated)

- [ ] Cloudflare Turnstile widget is owned by the MotoIndex Cloudflare account and lists `motoindexph.com` and any serving `www` hostname. Confirm the widget supports the four configured action names: `buyer_quote`, `dealer_application`, `price_alert`, `used_listing_inquiry`.
- [ ] GitHub **production** Environment variable `MOTOINDEX_TURNSTILE_SITE_KEY` is set to the verified live site key. GitHub Environment secret `MOTOINDEX_TURNSTILE_SECRET_KEY` is set to its matching server verification secret. Keep values out of commits, screenshots, logs and issue comments.
- [ ] The actual deployed Cloudflare Worker has `TURNSTILE_SECRET_KEY` configured as a Worker secret; it must match the GitHub build/widget account. The GitHub job sets `REQUIRE_FORM_BOT_PROTECTION=true` explicitly. Do not use Cloudflare's public test keys in production.
- [ ] Approve a staging domain/preview that can use **dedicated non-production** Turnstile credentials. Never submit test leads to real partners.
- [ ] Configure monitored, distributed Cloudflare WAF/rate limiting for `/api/leads`, `/api/dealer-partners`, `/api/price-alerts`, used-listing inquiry endpoints, and passwordless sign-in. Verify WAF actions in Cloudflare, not just the repository.
- [ ] Confirm private lead/admin routes are covered by the protected Cloudflare Access+MFA policy, a monitored contact inbox exists, and external Git-connected Workers Builds cannot bypass the approved manual deployment gate.

## Preview runtime/browser acceptance — save redacted evidence

Test on a desktop browser and a 390px-wide mobile viewport. Record time, test hostname, redacted request ID, result and screenshot/video; do not record buyer names, phones, private links or secrets.

| Flow | Success and failure cases required |
| --- | --- |
| Buyer quote | Coverage check returns only `available: true/false` and no partner email; no approved dealer has a clear alternative path; eligible submission returns a private status URL; duplicate phone+model never rotates or reveals the earlier buyer token. |
| Dealer partner | Widget renders; configured dealer application is accepted for review; invalid/expired/wrong-action token is rejected with no application record; consent is required. |
| Price alert | Confirmation is sent to a real monitored test inbox; invalid token is rejected; resend within cooldown does not rotate the confirmation link or send duplicates. |
| Used listing inquiry | Correct seller routing is demonstrated with an approved test seller; missing/expired token and cross-origin submissions are rejected without sending email. |

For **each flow**, verify the Turnstile iframe is visible/usable when challenged, an actual Siteverify request succeeds for the expected action and hostname, the widget resets after an error, and requests fail closed when the server secret is unavailable. Test keyboard navigation and mobile input. Confirm the production CSP allows `https://challenges.cloudflare.com` in **script-src** and **frame-src**, without widening the policy to `*` or untrusted sources.

## Review gates before merging / deploying

- [ ] PR #491 is synchronized with current `main` and latest-head `CI / build`, `Visual QA / browser-qa`, `Cloudflare Runtime Compatibility / validate`, and Cloudflare Workers preview all succeed.
- [ ] PR review and real preview evidence confirm no key/hostname/WAF/consent/form regressions, including signed-in account navigation and public-to-private token safety.
- [ ] Production release-security requirements in #462 are signed off and protected manual-only deployment is confirmed (not inferred from workflow YAML).
- [ ] Operator approves the exact release commit and can roll back; only then merge and manually deploy.
- [ ] Post-release smoke checks include form, inbox, auth, rate-limit, security headers, worker health, and `/deployment-info.json` matching the authorized SHA.

**Do not publish credential values or private links as evidence.** Code CI and Cloudflare preview-build success cannot replace actual provider account/browser acceptance.
