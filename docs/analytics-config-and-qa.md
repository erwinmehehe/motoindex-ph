# MotoIndex analytics configuration and QA

Analytics is off by default in source code. To enable GA4, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the **verified** MotoIndex measurement ID in the production build environment; a staging deployment should use its own property if one is needed. The previous hardcoded default ID was removed to prevent silent tracking when no environment variable exists. Do not use the old fallback as proof of ownership; verify the GA4 web stream in the account.

Plausible remains optional via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Updating the privacy/consent setup and confirming applicable analytics consent handling remain operational tasks before enabling new pixels.

On a controlled preview, verify the data layer once per page and inspect GA4 DebugView for buyer interactions added in PR #461: `dealer_coverage_checked` (where instrumented), `dealer_quote_request`, `dealer_quote_duplicate`, and `dealer_quote_error`. Never send name, email, phone, token, buyer location, or other personal data as event parameters. Use only aggregated conversion funnels and confirmed dealer responses for business decisions.

## Google AdSense explicit opt-in

The prior `adsenseEnabled()` check allowed the hardcoded AdSense client to load when `NEXT_PUBLIC_ADSENSE_ENABLED` was unset. It now loads only with the explicit value `NEXT_PUBLIC_ADSENSE_ENABLED=true`, consistent with `.env.example`. Verify the intended advertising configuration, account ownership, consent handling and actual ad delivery before enabling. The publisher and ads.txt records are not changed by this PR; they are not proof of permission to monetize or proof that regional consent obligations are fulfilled.

**Release coordination:** If advertising is already active, a deployment without the new explicit enabled variable will stop loading AdSense. Configure and verify this setting before approving the PR.

## Protecting account and private-token routes

Browser pageviews and custom application events are now limited to public paths. Account and bearer-token URLs including `/quote-status/*`, `/dealer-lead/*`, `/garage/*`, `/my`, and price-alert confirmation/unsubscribe URLs are excluded. All manually generated pageviews use the origin and pathname only: never query parameters or fragments. Private token responses also set `Referrer-Policy: no-referrer`.

GA4 loads with `send_page_view:false` and the app sends a manual pageview on eligible routes. **Required GA4 administrator setting:** Turn OFF `Enhanced Measurement > Page views > Page changes based on browser history events`. Google warns this setting can still emit automatic SPA pageviews even if `send_page_view:false` is configured. Validate public → private → public transitions in the browser network panel and GA4 DebugView.

Plausible now requires `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC` to contain the site's unique script URL from Plausible Site Installation (format `https://plausible.io/js/pa-XXXXX.js`). Existing `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` alone does not activate it. The integration initializes with `autoCapturePageviews:false` before fetching the per-site script and then sends only sanitized manual public pageviews. Confirm the domain/script, 2026 tracking snippet, and goals before shipping.

AdSense does not bootstrap when the first page loaded is a private account or token page. **Caveat:** scripts previously loaded on a public route can remain resident after Next.js client-side navigation. Verify no provider-managed network request exposes private paths or tokens and update account-side settings as needed. Third-party consent requirements are separate. PR #465 must remain draft until the GA4/Plausible/AdSense operator setup is tested.
