# MotoIndex PH v2.7.0 — PH Motorcycle Authority Pass

Date: 2026-08-27

## Goal

Strengthen the Tier 2 + Tier 3 Philippine motorcycle expansion without creating more thin pages. The release keeps one canonical model entity per motorcycle, but makes those pages materially more useful through model-specific buyer judgment, Philippine ownership context, evidence transparency and a publication-depth standard.

## What changed

### 1. Thirty unique model authority briefs

All 30 Tier 2/3 anchor motorcycles now have a model-specific decision brief in `lib/modelAuthority.ts` with:

- a buyer verdict;
- three concrete reasons to buy;
- three reasons to skip;
- Philippine ownership/context checks;
- named direct competitors already present in the MotoIndex catalog; and
- a model-specific research angle.

These briefs feed both visible buyer-guide UI and model-specific FAQ/editorial output. They are not generic category paragraphs with the model name replaced.

### 2. Explicit authority/readiness scoring

`lib/modelQuality.ts` adds a transparent score for expansion models based on real stored evidence:

- dated HTTPS model source;
- complete core price/spec record;
- unique authority brief;
- direct cross-shopping set;
- Philippine brand/after-sales resource;
- price-source depth;
- media provenance;
- fuel evidence;
- ground clearance;
- exact maintenance evidence;
- safety/recall path; and
- verified variants where applicable.

Expansion models must still pass the legacy freshness/source checks, then pass the v2.7 authority threshold before they can be indexable. Missing evidence remains visible as a gap instead of being padded with generated copy.

### 3. Decision-first canonical model page

`components/MotorcycleEntityPage.tsx` now adds, where an authority brief exists:

- a prominent **Should you buy it?** verdict;
- **Buy it if / Skip it if / PH ownership reality** cards;
- named direct-alternative links;
- a research-angle callout;
- an evidence/readiness panel showing what is present and what is still missing;
- Philippine official brand/dealer/service links; and
- an honest, data-rich hero fallback for models whose approved/provenance-tracked photo has not been stored yet.

The fallback does not pretend to be a motorcycle photo. It shows the model name, engine, power, weight, seat height and a clear “photo pending” label.

### 4. Price pages no longer look source-empty

Tier 2/3 models with one model-level price/spec source now expose that source as a dated baseline in both `PriceIntelligence` and `MarketPriceChecks`.

A one-source page explicitly says that independent PH price checking is still open. MotoIndex does not turn a single reference into an artificial multi-source market consensus.

### 5. Philippine after-sales resources for all 15 expansion brands

`lib/phBrandSupport.ts` stores official/dealer/service/owner links where available for:

RUSI, MotorStar, KYMCO, SYM, CFMOTO, Bristol, Benelli, KTM, Royal Enfield, BMW Motorrad, Ducati, Triumph, Vespa, Aprilia and Husqvarna.

The model and brand pages use these links for practical ownership checks instead of inventing maintenance intervals or recall status.

### 6. Brand hubs are explicit about coverage

Expansion brand pages now state that the current published models are the researched MotoIndex set, **not a claim that the full Philippine lineup is already covered**.

They also add:

- authority-depth summary;
- after-sales/dealer resources;
- researched-coverage wording;
- a publication-threshold explanation;
- a FAQ that answers whether the page is the complete lineup; and
- a visible policy that missing evidence stays missing instead of becoming filler.

### 7. Motorcycle index shows depth before breadth

The `/motorcycles` expansion panel now summarizes:

- number of authority anchors;
- how many are `strong` versus `publishable` under the evidence score; and
- the depth-first publication policy.

No new motorcycle brands or model permutations were added in this pass.

## CFMOTO 450MT example

The current 450MT record now renders as a decision page rather than a long spec sheet:

- ₱338,900 dated model-level price reference;
- 449 cc / 42 hp / 42 Nm;
- 175 kg curb weight;
- 820 mm seat height;
- 17.5 L tank;
- 220 mm ground clearance;
- 90/90-21 + 140/70-18 stock tire sizes;
- unique buyer verdict;
- buy/skip guidance;
- PH touring/support considerations;
- Himalayan 450 and KTM 390 Adventure cross-shopping paths;
- official CFMOTO PH/dealer support links; and
- transparent open gaps for independent price checking, approved media, exact model-year maintenance and other evidence not yet stored.

The current authority score is intentionally allowed to remain below “strong” when evidence such as media or an independent second price check is still missing. The page can be publishable without pretending that every research dimension is complete.

## Validation

Passed after the v2.7 changes:

- `npm run validate:v270`
- `npm run validate:copy-tone`
- `npm run validate:v247`
- `npm run validate:v260`
- `npm run check:links`
- the complete validation chain through v2.2.4 on the first run;
- the remaining v2.3.0 → v2.7.0 validators, content/product validators and media validator on a second run after the first all-in-one command reached the sandbox timeout.

The second validation segment finished cleanly, including:

- v2.3.0, v2.3.1;
- v2.4.0 through v2.4.7;
- v2.6.0, v2.6.1, v2.7.0;
- internal-link audit;
- content validation;
- product-layer validation; and
- media validation.

A local full `tsc`/Next build was not run because this source handoff does not contain `node_modules/.bin/tsc` or `node_modules/.bin/next`. The repository-level syntax validators passed on the changed TS/TSX files. Run `npm ci && npm run typecheck && npm run build` in normal CI/development before deployment.

## Previews

- `preview/v270-cfmoto-450mt-authority-preview.html`
- `preview/v270-cfmoto-brand-authority-preview.html`
