# MotoIndex PH — Top-model CTR and AEO growth sprint

**Baseline:** GSC Philippines, Web search, 28 settled days through 2026-10-05 (issue #457).
**Status:** Source-code change, not a verified live release or ranking result.

## Historical first-party page-level Search Console performance

| Canonical path | Impressions | Clicks | CTR | Avg. position |
| --- | ---: | ---: | ---: | ---: |
| /motorcycles/yamaha/aerox-v3 | 60,178 | 99 | 0.16% | 9.1 |
| /motorcycles/yamaha/nmax-v3 | 15,104 | 29 | 0.19% | 9.8 |
| /motorcycles/honda/adv-160 | 4,092 | 8 | 0.20% | 10.1 |
| /motorcycles/honda/click-160 | 2,583 | 7 | 0.27% | 10.5 |

These are historical **page aggregates**, not combined query-page observations. Low CTR alone does not prove poor titles; position mix, queries, device and SERP presentation need investigation.

## Implemented, code only

- Place source-scoped answer-first trim/buying information high on the four priority canonical model pages. Preserve existing titles, canonical paths and model H1s until query-page evidence supports a snippet experiment.
- Use the actual observed price from the current model record and its last independently dated price observation. Answer text never invents prices, current inventory, or identical trim equipment.
- Crosslink real related model pages and the existing detailed pricing/source section. Do not add thin keyword-alias URLs.
- Add all five merged keyword-gap pages to the **manual post-deployment smoke test**, including HTTP 200, HTML title, meta description, exact canonical, JSON-LD and noindex inspection. Check the NMAX, ADV160, Click160 model URLs alongside Aerox.
- Add regression tests for the four summaries and five route assertions.

## Production and Google indexation gates

1. Release operator completes #462 Cloudflare runtime/access/security and manually approves a deployment from the **current protected main**. #491 public-form Turnstile and #485 affiliate schema remain separate draft acceptance decisions.
2. On the real public domain, verify /deployment-info.json names the exact approved SHA. A green PR preview or a GitHub merge does not show which code is live.
3. Run scripts/smoke-public-core.mjs with the approved EXPECTED_COMMIT_SHA; review 390px mobile and desktop for the four buying answers and five new editorial pages.
4. Check /sitemap.xml and related segmented sitemaps. With GSC property access, verify each new URL's inspection state, Google-selected canonical and indexability. Neither HTTP 200 nor sitemap inclusion proves indexing.
5. Record redacted screenshots and deployment evidence to #457 and #462. Do not paste private buyer URLs or secrets.

## Next four weeks: measurable SEO

- Export **query + page dimensions together** with clicks, impressions, CTR and position using the first-party GSC API. Separate Queries and Pages UI exports cannot establish query ownership.
- Run: node scripts/gsc-opportunity-report.mjs /secure/path/query-page.csv --output /tmp/motoindex-opportunities.md
- Segment high-impression queries into price/variants, specs, installments, colors, tires and comparison; inspect the live SERP before recommending title/meta changes. Do not make speculative SEO claims based solely on model-level page CTR.
- Compare matched 28-day settled periods, 3-month trends and device/query/position mixes. Track real on-site interactions only when privacy-safe analytics has been authorized.
- The GSC baseline is fixed to the period ending 2026-10-05; do not label it as fresh 2026-10-17 traffic.

## AEO Sprint 2 scope (unverified until manually audited)

- **Model pages:** first-screen answer specificity, exact variant scope, dated citations, and visible FAQ alignment with JSON-LD.
- **Comparisons:** source-backed Aerox V3 vs NMAX V3 and ADV160 vs PCX160 research with links to each canonical model page; avoid competing reverse-order thin pages.
- **Helmets, tires and accessories:** review fitment/standard evidence, indexed parent topic ownership and image rights.
- **Three research datasets:** make methodology, sample size, source freshness and limitations unambiguous; a model-spec refresh is not proof of fresh price checks.
- **AI visibility:** test a fixed prompt matrix about variants, motorcycle loans, BeAT tire sizes, scooter comparisons, helmet certification and ownership. Record date, AI interface/model, response, mentions, citations and source URLs. Do not claim measurable AI citations until evidence exists.

## Freshness and blockers

Issue #482 lists 16 overdue price-check dates. Independently verify each specific model/trim at its maker/dealer source before updating the value/date. Do not bulk-reset timestamps.

Semrush current API data, combined GSC query-page records, Search Console URL inspections, actual Cloudflare production commit, and verified AI search citations are not proven by this PR. Keep those distinct from source-code completion.
