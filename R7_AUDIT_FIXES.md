# R7 audit — blockers found and fixed

Audited by installing, building, running `next start`, and crawling all 485 sitemap URLs.

## P0 — every product image on the site was broken

The R6 local-media change repointed every image `src` to a local path
(`/media/helmets/zebra-a113-ritzy.webp`), but the files were never synced.
`public/media/` contained only `README.md`.

Result: **all 84 optimized images returned 400/404** on every page — helmets, tires,
top boxes and motorcycles. The build passed and every page returned 200, so nothing
caught it.

`validate-media` reported "remote source fallback remains available during migration",
and `V247_R7_DOMAIN_SUMMARY.md` repeated that claim. **It was not true in the rendered
output** — no remote fallback was emitted; the HTML pointed only at the missing local
files.

Fixed by running the project's own remediation, `npm run media:sync`:

```
Media sync complete: 91 synced, 0 already present, 0 failed.
```

Then `MEDIA_STRICT_LOCAL=1 npm run validate:media` passes:

```
Media validation passed: 92 entities have one standardized primary image record
and all local derivatives exist.
```

After rebuild: **84/84 images OK, 0 broken.**

### Side benefit — the image migration is now genuinely complete

Zero external image hosts remain in the rendered output; every image is same-origin.
That removes the hotlinking licensing exposure, the third-party breakage risk (two of
those images had already 404'd in an earlier build), and the server-side fetch to 28
retailer CDNs. `public/` is 4.5 MB.

The 28-entry `images.remotePatterns` list in `next.config.mjs` is now unused and can be
deleted once you are confident nothing else references a remote source.

## P0 — no lockfile in the zip

The zip shipped `package.json` with **no `package-lock.json`**, so `check:launch` failed
("No npm lockfile found") and `npm ci` could not run — the Vercel build would have fallen
back to `npm install` and lost reproducibility.

`V247_R7_DOMAIN_SUMMARY.md` states this is intentional ("must remain the registry-verified
file from the launch-ready checkout"), so the file was restored from the verified build and
regenerated against the registry to normalize it to this `package.json`:

```
Lockfile validation passed: npm v3, 55 dependency records, strict SRI present,
Next/@next/env/SWC all 15.5.24.
```

**Keep this lockfile in the deliverable from now on.** Shipping without it is not a safe
default — it breaks the launch gate and reproducible installs.

## P2 — stale domain assertion in validate-v246

The R7 cutover changed `.env.production.example` to `https://motoindexph.com`, but
`validate-v246.mjs` still asserted `https://your-domain.com`, so the validator failed on
the intentional change. Expectation updated to the new canonical domain.

## P2 — Windows path-separator regression (19 scripts)

Same class as previous rounds: walkers built paths with `path.join()` then compared against
POSIX literals, so `validate-v224` failed on Windows while passing on Linux CI. Normalized.

## P2 — route-conflict guard dropped again

The `checkDynamicSiblings` guard in `check-launch.mjs` — which catches the sibling dynamic
segment bug that made every page 500 in v2.4.5/2.4.6 — was missing again. Restored.

## Verified after fixes

- `check:launch` passes with production env values.
- Typecheck clean; build clean; no SWC version warning.
- 42/43 validators pass (`validate-v141` asserts no `node_modules`/`.next`, so it only
  passes against the packaged zip, not a working tree).
- **All 485 sitemap URLs return 200**; zero server errors.
- **84/84 images render**; zero external image hosts.
- Domain cutover is clean: canonical, sitemap and robots all use `motoindexph.com`; no
  stale `motoindex.ph` references in source.
- Guardrails: `/deals`, `/sellers`, `/get-quote`, `/price-alerts` → 404; `/admin/*` → 401;
  `robots.txt` disallows `/admin/`, `/api/`, `/go/`.
