# MotoIndex AdSense release contract — strict opt-in without breaking publisher identity

## What this code changes

The repository's `validate:adsense` contract explicitly pins the MotoIndex publisher `pub-1900865456140693`, its matching `ca-pub` client ID, a root `/ads.txt` declaration, the Google certification authority ID, and the `beforeInteractive` document-head bootstrap. This PR **preserves those existing public identifiers and their validated integration** rather than assuming they belong to somebody else. An operator must still confirm the actual account ownership and active revenue before a production release.

The advertising script now loads **only when `NEXT_PUBLIC_ADSENSE_ENABLED=true` is explicitly configured at build time**. The missing/unset flag is OFF, not implicitly enabled. An invalid override is rejected rather than silently falling back; the existing pinned IDs are retained when an override is empty. The root `ads.txt` seller record stays available for ownership discovery even when script activation is disabled.

## Additional hard stop for issue #466

A second independent build-time gate, `NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED=true`, is now required **in addition to** `NEXT_PUBLIC_ADSENSE_ENABLED=true`. Both flags default to false and the manual GitHub production deployment workflow deliberately does **not** map the new release approval flag. Setting only `MOTOINDEX_ADSENSE_ENABLED=true` in the GitHub production Environment will **not** start ad delivery.

This is a protective release lock, **not evidence** that the Google account, privacy consent, CSP, or SPA-private-route architecture have been approved. A separately reviewed change must explicitly wire approval into the production build after all independent acceptance tests pass.

For direct visits to token/account pages, middleware now sends a no-referrer, no-store, noindex response with provider-blocking CSP (no AdSense, GA4, Plausible, or third-party frame/connect source). The current static Next.js document still uses inline hydration scripts. **This is not a nonce-based AdSense CSP and does not fix public-to-private Next.js client-side transitions:** loaded third-party scripts and the public document CSP may persist when routing without a full document navigation. Do not activate ads based on direct-route tests alone.

## Release prerequisites

1. Verify the actual MotoIndex AdSense account access, publisher ownership, property authorization and observed baseline revenue. Do not treat a source-code identifier as independent provider-side authorization.
2. Confirm consent and privacy disclosures for applicable visitors before activating third-party scripts. **Private routes** (including buyer status links and sign-in tokens) still inherit scripts inserted into the root document head when advertising is enabled. This change intentionally does **not** claim to solve public-to-private SPA tracking.
3. Perform network and cookie QA with a clean browser on public → /quote-status/{redacted-token} → public navigation and direct private-route loads. Ensure no private token, email, phone or query parameters are sent to third parties. Record redacted proof on issue #466.
4. Leave `NEXT_PUBLIC_ADSENSE_ENABLED=false` and `NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED=false` when operator checks have not been completed. Turning it on requires a separately reviewed and approved deployment configuration; never turn it on as a workaround for missed advertising events.
5. Confirm the intended AdSense revenue effect of the explicit opt-in: if the current production build relied on implicit activation and the flag is not configured, ads intentionally pause on the next release. To preserve advertising after approval, configure the flag `true` using the verified current IDs.
6. Plan a separate privacy-safe advertising architecture if ad scripts must not load at all on private account/token routes. Global document-head scripts cannot guarantee that privacy by checking the route only once.

## What this does not do

No AdSense/Cloudflare account settings, secret values, domain controls, WAF or production deployment are changed. Green CI proves code correctness, **not** operator authorization, private-route network safety or publisher revenue stability. Keep #466 open until provider-side and browser evidence is attached.
