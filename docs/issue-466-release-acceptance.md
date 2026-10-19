# Issue #466 — analytics and AdSense owner acceptance (2026-10-19)

**Status: OPEN / production release blocked.** Source changes, passing CI, a published `ads.txt` record, or a green preview do **not** prove actual GA4/Plausible/AdSense account ownership, user consent, private-link protection, ad delivery or revenue. No flag is to be enabled and no production deploy is authorized by this document.

## Source-level protections now present

- GA4 and Plausible require `NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE=true` **at build time**. The manual production workflow intentionally does not provide this opt-in, so analytics stays disabled.
- AdSense requires `NEXT_PUBLIC_ADSENSE_ENABLED=true` **at build time**, with the pinned public client `ca-pub-1900865456140693`. Manual display slot `6431580274` exists only on long editorial guides. No other ad integration should duplicate the script.
- Analytics route tracking is **allowlisted**, not default-public. New paths and account/bearer routes fail closed. Pageview URLs are origin + pathname, never query strings or fragments. Custom events accept only reviewed catalogue IDs, short categorical slugs, counters and flags. Raw visitor search text is never sent, even if an old capture flag is set.
- Private token paths explicitly emit `Cache-Control: no-store`, `X-Robots-Tag` and `Referrer-Policy: no-referrer` through middleware. These protections do **not** remove already-loaded third-party scripts after client-side navigation.

## Mandatory acceptance evidence — attach only redacted proof on #466

| Gate | Owner/operator verification | Evidence to retain |
| --- | --- | --- |
| GA4 ownership | Find the **MotoIndex** GA4 property and Web Data Stream. Confirm the actual `G-...` ID and access permissions; do not reuse a value copied from source code or another business. | Property/stream identity without credentials. |
| GA4 history-pageview controls | In GA4 Admin → Data Streams → Web → Enhanced Measurement → Page views, disable **Page changes based on browser history events** and save. Also inspect Google Tag Manager/other automatic history tags. | Screenshot of saved setting and DebugView for public pages only. |
| Plausible (if used) | Confirm the exact MotoIndex site and its generated `https://plausible.io/js/pa-XXXXX.js` loader. Verify `autoCapturePageviews:false`, event handling, script URL and ownership. Leave unused providers disabled. | Script-install page and site ownership, redacted. |
| AdSense account | Confirm approved site, permissions, publisher `pub-1900865456140693`, actual manual guide slot `6431580274`, ad review/serving status and current revenue or zero-revenue baseline. | AdSense site and ad unit status, no sensitive account data. |
| Seller record | Directly fetch `https://motoindexph.com/ads.txt` (not an indexed cache). Confirm `google.com, pub-1900865456140693, DIRECT, f08c47fec0942fa0` with no unapproved seller. | HTTP status, exact seller line and timestamp. |
| CSP **P0 blocker** | Current `next.config.mjs` CSP does not support a live AdSense script/frame. Design a per-response nonce-based strict CSP compatible with Next.js 15, OpenNext Cloudflare and prerendered/static assets. Start with `Content-Security-Policy-Report-Only` **on a controlled preview**, inspect violations and then verify enforcement there. Do not replace the policy with permissive wildcards/unsafe relaxations on production. | Redacted preview header, CSP reports, console/network and mobile/desktop screenshots. |
| Consent/privacy | Verify region-appropriate consent UI, reject/accept choices, cookie behavior, personalized-ad rules, public disclosures and retention settings. Do not assume an informational privacy page equals a working consent mechanism. | Consent test matrix/screenshots with no visitor identifiers. |
| Direct private landing | Using **synthetic or authorized private test links only**, test fresh-browser direct loading of `/quote-status/{token}`, `/dealer-lead/{token}`, `/garage`, verification, confirmation and unsub links. There must be no AdSense/analytics script on private pages or third-party requests exposing a token or buyer detail. | Redacted HAR/network inspection, no real bearer URLs. |
| Public → private → public | Test full Next.js SPA navigation, history changes and back/forward on desktop/mobile. Already-loaded advertising/analytics scripts may persist; **must be accounted for**, not ignored. Inspect GA4 DebugView, Plausible events, pageview duplication and outgoing request/referrer data. | Redacted request hosts and pass/fail result, never full private paths. |
| Revenue, conversions and release | Compare public pageviews and lead conversions with prelaunch first-party baseline; validate ad slot renders without CLS/overlap or console errors and with actual provider impressions. Require independent review, verified production flags and **manual** protected-main deployment only. | Signed acceptance matrix, deployed SHA, rollback and observed AdSense impressions. |

## Manual privacy regression probe (supplemental, not account proof)

Run only on an authorized, configured **preview** with synthetic paths. The script intentionally refuses an all-off run as acceptance evidence:

```bash
QA_BASE_URL=https://approved-preview.example QA_EXPECT_ADS=true node scripts/issue-466-browser-qa.mjs
# Or separately verify GA4/Plausible on a preview after approved opt-in:
QA_BASE_URL=https://approved-preview.example QA_EXPECT_ANALYTICS=true node scripts/issue-466-browser-qa.mjs
```

This browser probe checks synthetic public → private history changes, direct private loads, headers, third-party destinations and whether an AdSense loader survives. It cannot prove consent, account ownership, GA4 settings, Cloudflare production bindings or real revenue. A missing event may mean CSP blocked the provider rather than a successful privacy safeguard. Run the real account/browser matrix separately with privately retained evidence.

## Release / issue closure rules

1. Keep **both analytics and AdSense OFF** in the production build until every applicable row has an independent human reviewer and attached redacted proof. Do not turn either on merely to make ads visible.
2. Resolve the AdSense **global script and private-route SPA persistence** design, and the strict CSP / Cloudflare runtime integration, in separate reviewed changes before enabling live ads.
3. Confirm GitHub release gates and Cloudflare Workers Builds cannot deploy on merge without manual production Environment approval; see #462.
4. Only after provider-level evidence, consent, CSP, privacy network/DebugView, traffic and real ad delivery acceptance are documented may #466 be marked complete. Never post actual private URLs, access tokens, account credentials or buyer information into GitHub.
