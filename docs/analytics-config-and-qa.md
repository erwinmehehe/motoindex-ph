# MotoIndex public-only analytics — operational approval required

## Privacy-first behavior
- **Current proposed change (PR #519):** The owner explicitly requested the standard `G-20TKY10EPQ` Google tag directly in the document `<head>`. Unlike the earlier staged configuration, this makes GA4 independent of the release opt-in; **approval and private-route network QA remain outstanding**.
- **GA4 now loads from the global `<head>` when PR #519 is deployed.** Plausible and custom application events remain OFF unless `NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE=true`. The production release gate still requires its separate approval, but the head tag itself is not governed by that flag.
- A verified GA4 ID must match `G-...`. Plausible must use the dedicated `https://plausible.io/js/pa-....js` per-site script; the legacy automatic script is refused.
- The app constructs pageviews using `origin + pathname` only, excluding query strings and URL fragments. Analytics now uses an **explicit public-page-family allowlist**: new or ambiguous/encoded routes, private accounts, admin/API, garage, dealer-lead, quote-status, magic links, confirmation/unsubscription, protected flows, and merchant redirects fail closed.
- `trackEvent` uses the same deployment opt-in and public-path guard. Its event keys/values are allowlisted to catalogue identifiers, categorical slugs, bounded counts and flags. Unknown fields and unsafe strings (including names, email addresses, phone numbers, form locations, search phrases and bearer tokens) are dropped. Never pass personal data through event names either.
- Raw user search terms are **never sent** to analytics, even if the legacy `NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS` value is set; only aggregate query length/result counts are eligible.
- The standard owner-supplied `gtag('config', 'G-20TKY10EPQ')` **sends an automatic initial pageview**. The Analytics component no longer initializes a second GA4 tag or sends a duplicate hydration pageview; its manual SPA events are sanitized. Turn OFF GA4 Enhanced Measurement browser-history pageviews to prevent duplicates or token leakage. Plausible continues using `autoCapturePageviews:false`.
- A client-side router can retain third-party scripts after leaving a public page. **Code-level filtering alone does not prove privacy.** Do not enable tracking yet.

## Mandatory owner acceptance before enabling the switch
1. In the **correct MotoIndex GA4 property** (not an unrelated account), verify web-stream ownership and confirm its measurement ID is `G-20TKY10EPQ`, supplied by the owner on October 26, 2026. Then turn OFF `Enhanced Measurement > Page views > Page changes based on browser history events`. Also inspect any other automatically collected events and configured history-triggered tags. This setting may send private SPA pageviews even when the app asks `send_page_view:false`.
2. In the **correct MotoIndex Plausible** site, get its actual per-site script URL and validate manual mode against Plausible's current guidance. The `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` alone does not enable it.
3. Confirm applicable consent handling, privacy notices, cookie configuration and account data-retention settings. The code does not substitute for this.
4. In an authorized **non-production** browser, inspect network requests and GA4 DebugView on public → `/quote-status/<token>` → `/dealer-lead/<token>` → `/garage` → public navigation. Ensure no token, personal fields, query string or hidden route is sent to either analytics provider or loaded third-party script. Test a direct private-route landing and public-to-private SPA navigation separately.
5. After recording issue #466 acceptance evidence and obtaining independent release approval, set BOTH GitHub `production` Environment variables `MOTOINDEX_ANALYTICS_SAFE_ENABLE=true` and `MOTOINDEX_ANALYTICS_RELEASE_GATES_APPROVED=true`. The deployment workflow now defaults `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the owner-supplied `G-20TKY10EPQ`; an explicit `MOTOINDEX_GA_MEASUREMENT_ID` GitHub Environment variable can override it only after verifying the property is correct. The manual production workflow now maps `NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE` only when both switches are explicitly true; if either is unset/false, analytics stays OFF. A preflight rejects missing approval or an invalid ID. A fresh, manually approved build is required; changing variables alone does not affect deployed JavaScript.
   - Keep main branch protection, CI, Visual QA, Cloudflare Runtime Compatibility, protected production Environment reviewers and the manual workflow. If Plausible is not independently approved, leave `MOTOINDEX_PLAUSIBLE_SCRIPT_SRC` unset.
   - After deployment, verify public `page_view` events in GA4 Realtime / DebugView; inspect the browser Network panel for direct private landings and public → private → public navigation with synthetic paths. Check there are no private-token requests and no duplicate automatic history pageviews. Compare Cloudflare/GSC aggregates with GA4; missing historical hits cannot automatically be reconstructed.
6. Use consented, non-personal event parameters and compare with first-party aggregate data; verify duplicate events and tracking behavior after SPA navigation.

## Related limits
This PR does not configure GA4, Plausible, the AdSense account, external consent managers, or actual analytics cookies. It does not claim account-level leak prevention or historical data deletion. AdSense retains its own distinct review/approval gate in issue #466. Cross-check these settings before any production deployment.

## Issue #466 owner checklist and synthetic browser probe

See [issue #466 release acceptance](./issue-466-release-acceptance.md) for the GA4 Enhanced Measurement change, real Plausible install, verified AdSense publisher/slot, consent decisions, nonce-based AdSense CSP, synthetic browser probe, production release gating and independent signoff. The source-level tests do not prove account controls or browser network privacy after public-to-private SPA navigation.

## October 26, 2026 — owner-provided Google tag

The owner supplied the standard Google tag with Measurement ID `G-20TKY10EPQ`. It is a **public analytics identifier**, not an API key or authorization token.

MotoIndex already has one Next.js `Analytics` component mounted in the root layout. We reuse it instead of pasting an independent second `gtag.js` snippet, which could duplicate pageviews and expose private navigations.

The existing component loads `https://www.googletagmanager.com/gtag/js?id=G-20TKY10EPQ` only after build-time opt-in, initializes `gtag('config', 'G-20TKY10EPQ', {send_page_view:false})`, and emits manual, query-free pageviews only for approved public routes. Private routes and bearer-token paths are excluded. This intentionally differs from Google's default snippet.

The measurement ID is now present as a **build-time default** in `.github/workflows/cloudflare-production-deploy.yml` and in `.env.example`. Neither change activates tracking or deploys a site. Before production activation, the operator must still independently verify GA4 stream ownership, disable Enhanced Measurement browser-history pageviews in that stream, review consent/privacy and test direct-private and public-to-private browser navigation in a controlled preview under issue #466. Only after approval should both GitHub production Environment variables `MOTOINDEX_ANALYTICS_SAFE_ENABLE=true` and `MOTOINDEX_ANALYTICS_RELEASE_GATES_APPROVED=true` be set and a manually approved release performed.

## October 26 — owner-directed Google tag in `<head>`

The owner explicitly requested adding `G-20TKY10EPQ` to the document `<head>`. The root layout now has a single inline `gtag` bootstrap in `<head>`, with `send_page_view:false`. On approved public routes, the existing Analytics component appends `https://www.googletagmanager.com/gtag/js?id=G-20TKY10EPQ` to `document.head` once and sends manual, query-free pageviews. On direct private token/account routes, it does not load the external Google tag; public-to-private transitions set `ga-disable-G-20TKY10EPQ` to suppress tracking and clear the last-pageview marker.

This is an explicit owner-directed change to enable GA4 public pageviews independent of the older optional analytics release variable, which still controls Plausible and custom application events. **GA4 Enhanced Measurement automatic browser-history pageviews should be disabled** in the GA4 property to avoid duplicates or private SPA events. Real preview/browser consent and private-navigation QA remain recommended under issue #466; this source change does not authorize a production deployment.

The raw Google tag snippet was not pasted as a second independent tag because MotoIndex already had an analytics integration. The inline bootstrap is in `<head>`, and the `gtag.js` loader is placed in the DOM head only on public pages.


## October 26 — exact owner-provided head tag replaces the earlier variation

PR #519 was revised to include **both exact tags from the owner's snippet** in the root layout `<head>`: the asynchronous `gtag/js?id=G-20TKY10EPQ` loader and the inline `dataLayer`, `gtag('js', new Date())`, and `gtag('config', 'G-20TKY10EPQ')` bootstrap. The prior `send_page_view:false` option was removed to match the supplied tag. The client Analytics component no longer loads or initializes a second tag or duplicates the initial pageview.

**Important privacy difference:** the standard snippet sends initial pageview data, potentially including URL query strings and private URL paths, unless prevented by the effective CSP or the GA4 account settings. It also loads on direct private document pages when the browser permits it. An explicit owner request does not establish consent, GA4 Enhanced Measurement configuration or privacy acceptance. Test network traffic with synthetic private paths and verify only permitted URLs are collected before deploying; keep the manual production release policy.
