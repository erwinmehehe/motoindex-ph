# MotoIndex analytics configuration and QA

Analytics is off by default in source code. To enable GA4, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the **verified** MotoIndex measurement ID in the production build environment; a staging deployment should use its own property if one is needed. The previous hardcoded default ID was removed to prevent silent tracking when no environment variable exists. Do not use the old fallback as proof of ownership; verify the GA4 web stream in the account.

Plausible remains optional via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Updating the privacy/consent setup and confirming applicable analytics consent handling remain operational tasks before enabling new pixels.

On a controlled preview, verify the data layer once per page and inspect GA4 DebugView for buyer interactions added in PR #461: `dealer_coverage_checked` (where instrumented), `dealer_quote_request`, `dealer_quote_duplicate`, and `dealer_quote_error`. Never send name, email, phone, token, buyer location, or other personal data as event parameters. Use only aggregated conversion funnels and confirmed dealer responses for business decisions.
