# MotoIndex guide-only AdSense release contract — #466

## Built-in monetization integration
- Publisher `pub-1900865456140693`, matching `ca-pub` client and the root `/ads.txt` seller line remain intact. Account ownership, approved site and actual ad delivery still require Google AdSense verification.
- Only actual public editorial guide documents at `/guides/[slug]` mount the Google AdSense bootstrap and one manual unit (slot `6431580274`, after section two). No AdSense script is mounted in the global root layout. The slot renders only with a request-scoped nonce.
- The guide middleware issues a new random nonce for each eligible HTML document, passes it into Next.js rendering, and sets Google's documented `strict-dynamic` nonce CSP. The old global CSP is excluded only for approved ad-guide documents. Private direct routes keep their stricter CSP, no-referrer, no-store and noindex.
- When advertising is enabled, `AdSenseNavigationSafety` forces full same-origin document loads entering/leaving an ad guide rather than carrying a previously loaded Google script and its document CSP into a private route. This is a client-side defense-in-depth measure, **not an independently verified browser guarantee**, especially for programmatic router navigation/back-forward history.

## Two independent default-OFF launch gates
`NEXT_PUBLIC_ADSENSE_ENABLED=true` **and** `NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED=true` must both be present at build time. Invalid or missing values fail closed. The manual Cloudflare production workflow maps these solely from owner-controlled GitHub production Environment variables:
- `MOTOINDEX_ADSENSE_ENABLED`
- `MOTOINDEX_ADSENSE_RELEASE_GATES_APPROVED`

Both default to `false`. They are **not automatically enabled** by merging this code. `npm run check:launch` refuses enabling the first flag without the independent approval flag.

## Required account and live acceptance
1. Confirm the actual AdSense account is authorized for `motoindexph.com`, that publisher `pub-1900865456140693` and manual ad slot `6431580274` belong to the approved property, and that root `/ads.txt` serves the correct seller line.
2. Confirm region-appropriate consent/CMP behavior and disclosures, including test cases where visitors decline optional personalized advertising.
3. On a **non-production** Cloudflare preview with **both** approved flags, verify actual guide script request, nonce propagation, rendered manual ad, AdSense account impressions, and CSP console/network behavior. Google's guidance recommends testing CSP in report-only mode first: https://support.google.com/adsense/answer/16283098
4. With synthetic or otherwise authorized tokens, exercise direct `/quote-status/{token}`, `/dealer-lead/{token}`, `/garage` landings, public model → guide → private, back/forward, and programmatic router transitions. **No private path, token, buyer name, phone or email may reach any third-party ad/analytics request.** Save redacted HAR evidence.
5. Verify first-party key conversion events, responsive ads/no layout shift, normal SEO indexing, Worker CPU consumption from dynamically rendered ad guides, and an actual AdSense impression baseline.
6. Require green protected-main GitHub checks and production Environment approval before using the **manual** Cloudflare production workflow. Monitor revenue, errors and privacy; rollback by switching both vars off and rebuilding if needed.

## What merging does NOT do
No provider account/CMP/Cloudflare secret or variable has been changed by this code. Neither a green CI nor a successful preview **proves the provider approved the site or that revenue is live**. Do not close issue #466 before independently documented consent, live-browser privacy and real ad-delivery acceptance.
