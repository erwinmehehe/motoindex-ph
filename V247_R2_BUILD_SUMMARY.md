# MotoIndex PH v2.4.7 UI/tooling hardening R2

This follow-up keeps the package version at 2.4.7 but uses an explicit **R2** artifact suffix so it cannot be confused with the earlier v2.4.7 ZIP.

## Fixed in this overlay

- Restored the sibling dynamic-route conflict guard in launch preflight and added a negative regression test for the `[slug]` / `[brand]` collision pattern.
- Restored portable path normalization in the affected public-source validator walkers.
- Preserved affiliate CTAs as fail-closed configuration, documented that static product-page affiliate maps are build-time inputs, and changed outbound affiliate redirects to HTTP 302 rather than 307.
- Added Motorcycles and Guides dropdown navigation using real brand/catalog and public guide routes.
- Removed arbitrary checked-product display caps from the helmet hub, recommendation model sets, and motorcycle product recommendations.
- Reworked motorcycle and helmet comparison pages around the products actually selected: visible product media, grouped specifications, checked market/source context and difference highlighting.
- Forced motorcycle/product media canvases to white and removed gray placeholder treatment.
- Split top-box records with sourced imagery from checked records whose product photo is not yet sourced, so missing imagery is not presented as if it were verified media.
- Added the 10-guide shared structure from the content brief: direct answer, objective quick picks, comparison table, ordering method, model summaries, measurable topic sections, caveats, FAQs, related guides and freshness/source context.
- Fixed the expanded mobile compare tray safe-area/content reserve, odd entity-spec final rows and hidden mobile Finder results.

## Lockfile handling

`package-lock.json` is deliberately excluded from the overlay ZIP. Apply this over `motoindex-ph-next-v247-pseo-launch-ready` and retain that candidate's registry-generated security lockfile unchanged.

## Validation run in the source sandbox

- `npm run validate:all` — PASS
- `node scripts/test-route-conflict-guard.mjs` — PASS
- `node scripts/validate-post-audit.mjs` — PASS
- internal link audit — PASS

A dependency-backed `next build` is not claimed from the offline source sandbox. Run the normal `npm ci` / `npm run verify:launch` gate in the environment that has the preserved launch-ready lockfile and production variables.
