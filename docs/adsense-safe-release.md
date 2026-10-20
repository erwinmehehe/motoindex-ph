# MotoIndex public guide and motorcycle AdSense release contract — #466

## Built-in monetization integration
- Publisher `pub-1900865456140693`, matching `ca-pub` client and the root `/ads.txt` seller line remain intact. Account ownership, approved site and actual ad delivery still require Google AdSense verification.
- Only eligible public editorial guides at `/guides/[slug]`, canonical motorcycle model/family pages at `/motorcycles/[make]/[slug]`, verified brand pages at `/motorcycles/[make]`, and the `/motorcycles` directory mount the approved AdSense bootstrap. The responsive manual ad slot `6431580274` is reused with one or two clearly labelled in-content placements, never injected into the global root layout. The slot renders only with a request-scoped nonce.
- The guide middleware issues a new random nonce for each eligible HTML document, passes it into Next.js rendering, and sets Google's documented `strict-dynamic` nonce CSP. The old global CSP is excluded only for approved ad-guide documents. Private direct routes keep their stricter CSP, no-referrer, no-store and noindex.
- When advertising is enabled, `AdSenseNavigationSafety` forces full same-origin document loads entering/leaving any ad-bearing guide or motorcycle page rather than carrying a previously loaded Google script and its document CSP into a private route. This is a client-side defense-in-depth measure, **not an independently verified browser guarantee**, especially for programmatic router navigation/back-forward history.

## Two independent default-OFF launch gates
`NEXT_PUBLIC_ADSENSE_ENABLED=true` **and** `NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED=true` must both be present at build time. Invalid or missing values fail closed. The manual Cloudflare production workflow maps these solely from owner-controlled GitHub production Environment variables:
- `MOTOINDEX_ADSENSE_ENABLED`
- `MOTOINDEX_ADSENSE_RELEASE_GATES_APPROVED`

Both default to `false`. They are **not automatically enabled** by merging this code. `npm run check:launch` refuses enabling the first flag without the independent approval flag.

## Private routes and response headers
Private routes including `/garage`, `/my`, `/dealer-portal`, `/quote-status/{token}`, `/dealer-lead/{token}`, and price-alert confirmation/unsubscribe paths must return `Referrer-Policy: no-referrer`, `Cache-Control: no-store`, and a provider-blocking CSP. Both middleware and final Cloudflare Worker HTTP responses must preserve these protections. Tests use synthetic private links and never collect real customer tokens.

## Required account and live acceptance
1. Confirm the actual AdSense account is authorized for `motoindexph.com`, that publisher `pub-1900865456140693` and manual ad slot `6431580274` belong to the approved property, and that root `/ads.txt` serves the correct seller line.
2. Confirm region-appropriate consent/CMP behavior and disclosures, including test cases where visitors decline optional personalized advertising.
3. On a **non-production** Cloudflare preview with **both** approved flags, verify actual guide, motorcycle model, brand and directory script requests, distinct document nonces, rendered responsive units, AdSense account impressions, and CSP console/network behavior. Google's guidance recommends testing CSP in report-only mode first: https://support.google.com/adsense/answer/16283098
4. With synthetic or otherwise authorized tokens, exercise direct `/quote-status/{token}`, `/dealer-lead/{token}`, `/garage` landings, public model → guide → private, back/forward, and programmatic router transitions. **No private path, token, buyer name, phone or email may reach any third-party ad/analytics request.** Save redacted HAR evidence.
5. Verify first-party key conversion events, responsive ads/no layout shift, normal SEO indexing, Worker CPU consumption from dynamically rendered guides and motorcycle pages, and an actual AdSense impression baseline.
6. Require green protected-main GitHub checks and production Environment approval before using the **manual** Cloudflare production workflow. Monitor revenue, errors and privacy; rollback by switching both vars off and rebuilding if needed.

## What merging does NOT do
No provider account/CMP/Cloudflare secret or variable has been changed by this code. Neither a green CI nor a successful preview **proves the provider approved the site or that revenue is live**. Do not close issue #466 before independently documented consent, live-browser privacy and real ad-delivery acceptance.

## Public motorcycle rollout — PR #501

- Eligible models, electric model details, model-family pages, verified current brand price lists and the main motorcycle directory show manual responsive AdSense placements after meaningful editorial sections. Pages with no verified current brand models do not carry an ad.
- Dynamic document nonce and `Cache-Control: private, no-store` apply only to approved ad-bearing GET HTML. Query-filtered pages and motorcycle utility subroutes keep a restrictive non-ad CSP; private customer, dealer and admin routes remain ad-free and fail closed in ads-only mode.
- `wrangler.jsonc` routes `/motorcycles` and `/motorcycles/*` through the Worker before static assets. The publisher excludes motorcycle HTML from static-edge copies when the two approval flags are true, preventing nonce bypass.
- Production smoke QA asserts actual AdSense loader, slot and CSP on an anonymous directory, brand and model URL, alongside the existing guide and private-route checks. Passing QA cannot prove an AdSense paid fill; Google account approval, actual user consent where required, external network requests and impressions remain separately verified.
- No PostgreSQL database, Turnstile or Zero Trust secrets are required for the ads-only release. Do not load ads on personal customer pages or assume a paid ad will display on every visit.

## Top-five traffic AdSense extension (2026-10-20)

- The homepage carries one labeled manual unit below discovery content, the Finder one after its interactive wizard/results, and the longer loan calculator two units after the calculator and educational content. Existing motorcycle directory and Yamaha Aerox model slots are unchanged.
- These three routes get a new document nonce and CSP from middleware, Worker-first Cloudflare HTML, and a page-scoped loader. This is manual AdSense placement, not unrestricted Auto ads.
- Query URLs on Finder and the loan calculator never load ads. They get non-ad CSP plus no-referrer. While ads are enabled, editing Finder/calculator answers does not rewrite the current ad-document URL. The Copy/Share buttons still produce stateful URLs, which load as non-ad query documents.
- The two production AdSense flags remain OFF by default. Do not activate until #466 account, consent/CMP, real-browser private-route/network, Cloudflare runtime and paid impression checks have independent sign-off. Source changes alone do not deploy or earn revenue.
