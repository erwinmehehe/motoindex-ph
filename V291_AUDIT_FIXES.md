# v2.9.1 audit — fixes applied

Audited by installing, building, running `next start`, and crawling every sitemap URL.

## Fixed: Involve Asia links would have been rejected (`invl.me`)

Involve Asia's `/deeplink/generate` returns short links on **`invl.me`** — the API docs'
own sample response is `"tracking_link": "https://invl.me/cl8a2bX9q"`. That host was
missing from two allowlists:

1. `lib/affiliate.ts` — `allowedInvolveAsiaHost()` accepted only `invol.co` and
   `involve.asia`, so a real link 404'd at `/go/affiliate/{id}` and **no CTA rendered**.
2. `scripts/generate-involve-affiliates.mjs:11` — `TRACKING_HOSTS` had the same omission,
   so line 332 would **throw** `"API response did not contain a valid Involve Asia
   tracking_link"` on every real API response.

Both now accept `invol.co`, `involve.asia` and `invl.me`.

Verified after the fix:

```
invl.me link      -> 302 https://invl.me/cl8a2bX9q
invol.co link     -> 302 https://invol.co/aff_m?offer_id=1&aff_id=2
non-allowed host  -> 404 (still fails closed)
```

This was not a launch blocker (affiliates are off at launch) but it would have blocked the
entire Involve Asia pipeline the moment you switched it on — silently, because a rejected
link looks identical to correct fail-closed behaviour.

## Fixed: `validate-post-audit` failing on a documentation gap

`AFFILIATE_SETUP.md` had no "build-time" wording, so the project's own post-audit gate
failed. Added a section covering the build-time/redeploy requirement and the accepted
tracking hosts. `validate-post-audit` now passes.

## Verified

- `check:launch` passes with production env values.
- Typecheck clean; build clean; no SWC version warning.
- Lockfile: strict SRI present, Next/@next/env/SWC all 15.5.24.
- 47/48 validators pass (`validate-v141` asserts no `node_modules`/`.next`, so it only
  passes against the packaged zip).
- **All 252 sitemap URLs return 200**; zero server errors; 367 pages prerendered.
- Images: all sampled images 200, **zero external image hosts** (fully self-hosted).
- Guardrails: `/deals`, `/sellers`, `/get-quote` → 404; `/admin/*` → 401.
- Route-conflict guard present; no sibling dynamic-segment conflicts.
- Path-separator normalization present in 23 scripts.

## Open items (not blockers)

1. **Sitemap coverage dropped 485 → 252** versus the R7 build. 367 pages are prerendered
   but only 252 are advertised. Some of that gap is intentional (noindexed admin/search
   surfaces), but the drop is large enough to confirm deliberately rather than assume.
2. **`used-value` and `new-vs-used` are still blocked** in `middleware.ts` and not built —
   roughly 100 pages of high-commercial-intent content still switched off.
