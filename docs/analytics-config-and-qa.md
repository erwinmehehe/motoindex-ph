# MotoIndex public-only analytics — operational approval required

## Privacy-first behavior
- The hardcoded Google Analytics measurement-ID fallback has been removed.
- GA4, Plausible and custom application events are **OFF by default**. No third-party scripts are emitted unless `NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE=true` is explicitly supplied **at build time**, and the corresponding vetted GA4 ID / per-site Plausible script is configured. Keep the switch false in ordinary builds.
- A verified GA4 ID must match `G-...`. Plausible must use the dedicated `https://plausible.io/js/pa-....js` per-site script; the legacy automatic script is refused.
- The app constructs pageviews using `origin + pathname` only, excluding query strings and URL fragments. Analytics now uses an **explicit public-page-family allowlist**: new or ambiguous/encoded routes, private accounts, admin/API, garage, dealer-lead, quote-status, magic links, confirmation/unsubscription, protected flows, and merchant redirects fail closed.
- `trackEvent` uses the same deployment opt-in and public-path guard. Its event keys/values are allowlisted to catalogue identifiers, categorical slugs, bounded counts and flags. Unknown fields and unsafe strings (including names, email addresses, phone numbers, form locations, search phrases and bearer tokens) are dropped. Never pass personal data through event names either.
- Raw user search terms are **never sent** to analytics, even if the legacy `NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS` value is set; only aggregate query length/result counts are eligible.
- GA4 `gtag('config', ..., {send_page_view:false})` requests no automatic pageviews and the app issues at most one manual pageview per public pathname. Plausible initialization uses `autoCapturePageviews:false`.
- A client-side router can retain third-party scripts after leaving a public page. **Code-level filtering alone does not prove privacy.** Do not enable tracking yet.

## Mandatory owner acceptance before enabling the switch
1. In the **correct MotoIndex GA4 property** (not an unrelated account), verify web-stream ownership and turn OFF `Enhanced Measurement > Page views > Page changes based on browser history events`. Also inspect any other automatically collected events and configured history-triggered tags. This setting may send private SPA pageviews even when the app asks `send_page_view:false`.
2. In the **correct MotoIndex Plausible** site, get its actual per-site script URL and validate manual mode against Plausible's current guidance. The `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` alone does not enable it.
3. Confirm applicable consent handling, privacy notices, cookie configuration and account data-retention settings. The code does not substitute for this.
4. In an authorized **non-production** browser, inspect network requests and GA4 DebugView on public → `/quote-status/<token>` → `/dealer-lead/<token>` → `/garage` → public navigation. Ensure no token, personal fields, query string or hidden route is sent to either analytics provider or loaded third-party script. Test a direct private-route landing and public-to-private SPA navigation separately.
5. After recording evidence, a separately reviewed release change can deliberately map `NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE=true` into the approved production build, using verified GA4 and Plausible values. The current manual production workflow intentionally does **not** supply this opt-in; analytics stays disabled. Do not silently enable it to recover an old metric.
6. Use consented, non-personal event parameters and compare with first-party aggregate data; verify duplicate events and tracking behavior after SPA navigation.

## Related limits
This PR does not configure GA4, Plausible, the AdSense account, external consent managers, or actual analytics cookies. It does not claim account-level leak prevention or historical data deletion. AdSense retains its own distinct review/approval gate in issue #466. Cross-check these settings before any production deployment.

## Issue #466 owner checklist and synthetic browser probe

See [issue #466 release acceptance](./issue-466-release-acceptance.md) for the GA4 Enhanced Measurement change, real Plausible install, verified AdSense publisher/slot, consent decisions, nonce-based AdSense CSP, synthetic browser probe, production release gating and independent signoff. The source-level tests do not prove account controls or browser network privacy after public-to-private SPA navigation.
