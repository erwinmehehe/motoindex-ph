# MotoIndex GSC opportunity workflow — 2026-09-30

## Purpose

Use first-party Google Search Console query + page performance to decide which existing MotoIndex pages deserve the next SEO change. Do not treat competitor traffic estimates, third-party keyword volume or anecdotal SERP checks as MotoIndex clicks, impressions, CTR or average position.

## Required input

Run the report with one CSV containing these dimensions and metrics together:

- query
- page
- clicks
- impressions
- ctr
- position

A normal Search Console UI export often separates Queries and Pages. Those separate files are useful individually, but they cannot prove which query belongs to which page and therefore cannot support a reliable cannibalization check. Use a combined query + page export from the Search Console API or another first-party GSC extraction.

Do not commit private raw GSC exports to this repository.

## Command

```bash
npm run seo:gsc-opportunities -- /path/to/query-page.csv --output /tmp/motoindex-gsc-opportunities.md
```

Optional controls:

```bash
npm run seo:gsc-opportunities -- /path/to/query-page.csv \
  --min-impressions 20 \
  --striking-min 4 \
  --striking-max 20 \
  --ctr-max-position 10 \
  --low-ctr 0.02 \
  --output /tmp/motoindex-gsc-opportunities.md
```

## What the report prioritizes

1. Canonical pages with earned impressions in positions 4–20.
2. High-impression rows with zero clicks.
3. Top-10 rows with weak CTR under the configured threshold.
4. Query families already reaching MotoIndex: price, financing, specifications, colors, tire size, fuel, rider fit, comparison, generation/variant and dealer intent.
5. Queries appearing across more than one normalized canonical path, for manual cannibalization review.
6. Existing MotoIndex SEO-program pages that actually appear in the supplied GSC export.

The opportunity score is only an internal sorting heuristic. It is not a Google ranking metric and must not be reported as one.

## Current provisional watchlist

Until first-party GSC query + page data is available, these are a research watchlist rather than a claim about MotoIndex performance:

- /motorcycles/honda/pcx-160
- /motorcycles/suzuki/raider-r150
- /motorcycles/yamaha/sniper-155
- /motorcycles/yamaha/fazzio
- /motorcycles/yamaha/mio-gear
- /motorcycles/honda/adv-160
- /tires/adv-160-tire-size
- /tires/fazzio-tire-size
- /tires/mio-gear-tire-size
- /tires/sniper-155-tire-size
- /tires/aerox-tire-size
- /tires/nmax-tire-size
- /tires/honda-click-tire-size

The model-page watchlist comes from the existing MotoIndex competitor-gap research, where PCX 160, Raider R150, Sniper 155, ADV 160, Fazzio and Mio Gear already map to meaningful competitor demand. The tire watchlist comes from the existing tire SEO dataset, which records explicit tire-size demand estimates for ADV 160, Fazzio, Mio Gear and Sniper 155 and already links model pages into dedicated tire guides.

Neither source is first-party GSC performance. Do not describe the numbers as MotoIndex impressions, clicks, CTR or rankings.

## Changes allowed before GSC arrives

Safe improvements can strengthen the canonical page without inventing a performance diagnosis:

- make key-specification headings model-specific;
- make downpayment/monthly-installment headings model-specific;
- make colors/variants labels model-specific;
- keep price, specs, colors and financing on the canonical motorcycle URL;
- keep dedicated tire-size intent on the existing tire guide and link it from the model page;
- preserve current family hubs for generation comparisons.

Avoid speculative title rewrites, new thin derivative URLs, or page consolidation until the actual query + page export shows a reason.

## Decision rules once GSC is available

- Position 4–20 + meaningful impressions: deepen the matching section and internal links first.
- Position 1–10 + weak CTR: review title/meta against the exact query before changing body content.
- Same query on multiple pages: determine whether intents are actually different before consolidating.
- Tire-size query landing on a model page while a dedicated tire guide exists: review internal linking, title/H1 alignment and query ownership between those two URLs.
- Price/spec/color/installment query landing on a thin or noncanonical route: repair routing/canonicalization instead of creating another URL.
- New page with no impressions shortly after launch: do not call it a failure; allow recrawl/reprocessing time and verify indexing first.

## Measurement

Use equivalent pre/post date ranges and retain the original export. Compare:

- clicks
- impressions
- CTR
- weighted average position
- query-to-page ownership
- number of meaningful queries shared by competing canonical paths

Do not judge same-day ranking movement after a deploy.
