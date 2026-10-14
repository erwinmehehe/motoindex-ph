# MotoIndex PH — Programmatic SEO keyword research and restore manifest

**Checked:** 2026-10-11 · **Market:** Philippines · **Repository:** `erwinmehehe/motoindex-ph`

This folder makes the next MotoIndex programmatic SEO research phase reviewable and restorable as portable CSV. It supplements, and **does not overwrite**, the existing full historical archive at [`research/ph_motorcycle_seo_300plus_keywords_current_roadmap_v245.xlsx`](../../ph_motorcycle_seo_300plus_keywords_current_roadmap_v245.xlsx).

## Research provenance

- The original archive has **393 historical Philippine keywords**, compiled with **Ahrefs** in August 2026, not refreshed Semrush data.
- The companion five-tab Excel workbook (downloaded separately from ChatGPT) maps **121 historical keyword records**, **48 candidate expansion queries** and existing canonical paths.
- Semrush's reporting API returned `API UNITS BALANCE IS ZERO`; therefore current Semrush volume and KD columns are **blank**. Do not label archive numbers as new Semrush metrics.
- Historical query-volume sums overlap between near-synonymous keywords; they are **not unique users**, traffic projections or achieved rankings.

## Files in this commit

- `keyword_expansion_queue.csv`: all **48** current candidate queries, publishing gates and canonical owners (16 P0, 19 P1, 13 P2).
- `cluster_scorecard.csv`: ten archived Ahrefs topic clusters, 393 total records, directional prioritization.
- `canonical_url_owners.csv`: explicit route ownership, draft PR dependencies and anti-cannibalization decisions.

## Work to do first

1. **Review [PR #479](https://github.com/erwinmehehe/motoindex-ph/pull/479)**: enrich Click160, PCX160, ADV160, NMAX V3 and Aerox V3 maintenance sections. Source the exact model-year manual and distinguish normal refill versus dry-fill oil. Existing model pages remain canonical.
2. **Review [PR #478](https://github.com/erwinmehehe/motoindex-ph/pull/478)**: Suzuki Raider R150 FI spark-plug information based on the correct model manual, with checks against duplicate tire-intent URLs.
3. **Improve the existing tire guides**. The chart is already within `/tires#size-chart`; `/tires/motorcycle-tire-size-chart` deliberately redirects to it. **Do not create a second indexable tire-size chart page.**
4. **Validate parts queries** (battery, air filter, CVT and accessories) against Semrush PH and official manuals or part fiches. No generic part-code-to-model compatibility assumptions.
5. **Refresh canonical ownership using combined GSC query+page data**. Check query intent, impressions, CTR and cannibalization before generating any additional route.

## Publishing gates

Every indexable new page needs: independently supported search intent, a distinct answer compared with the existing canonical, accurate primary sources for the exact generation/market, source-check dates, editorial QA, schema and internal-link checks. Never produce city duplicates, year-variant near-copies, unsupported tire upgrades, fabricated reviews or unverified seller affiliate links.

**Restore:** Copy these CSV files into `research/motoindex-pseo/2026-10-11/`. They remain readable without Excel. For the full historical 393-keyword archive, retain the repository's original XLSX linked above. The separate five-tab styled workbook is an additional export; the CSV research assets here do not reproduce its Excel formatting or formulas.

**No production code, keyword scoring claims, or live SEO pages are changed by this research PR.**
