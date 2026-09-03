# MotoIndex PH v2.8.0 — PH Decision Engine

Date: 2026-08-27

## Goal

Turn the motorcycle research layer from a catalog/filter experience into a Philippines-first decision engine without creating thin URL permutations. v2.8 keeps the v2.7 authority model pages and adds personalized ranking, transparent affordability planning, scenario-based comparisons and three new decision-led guide hubs.

## What changed

### 1. Shared motorcycle decision engine

`lib/decisionEngine.ts` adds one reusable scoring layer for motorcycle shortlisting. It evaluates:

- rider-fit starting point from published seat height and selected inseam;
- main use case: city, lower/easier bike, work/utility, performance or longer rides;
- traffic context;
- passenger and luggage needs;
- open-road/highway context;
- optional 400cc+ expressway-planning class filter;
- purchase price;
- loan-planning assumptions; and
- modeled monthly commute/running cost.

Every result returns a score, factor-by-factor breakdown, reasons, cautions and monthly planning figures. Missing real-world attributes are not converted into fake certainty.

### 2. Finder rebuilt as a decision workspace

`/finder` now supports shareable URL state for:

- purchase budget;
- main use;
- inseam;
- traffic;
- daily round trip;
- passenger;
- luggage;
- faster provincial/national road use;
- 400cc+ planning class;
- make/category/transmission/ABS/seat/weight constraints;
- monthly ownership ceiling;
- down payment;
- finance term; and
- APR planning assumption.

The top result is shown as a decision summary with observed price, loan planning, modeled running cost and total monthly planning outlay. Each result card exposes “Why it fits”, “Watch-outs”, a factor score breakdown, monthly cost strip, model research, compare and shortlist actions.

A 400cc+ control is explicitly labeled as an engine-displacement research filter, not a legal-access guarantee.

### 3. Comparison pages now answer “which one for whom?”

`lib/comparisonDecision.ts` and `components/ComparisonDecisionMatrix.tsx` add five reproducible profiles to every motorcycle comparison:

- heavy city traffic;
- lower/easier-bike fit;
- performance;
- longer rides; and
- passenger + luggage.

The page shows each motorcycle’s score under the same scenario and treats a difference under three points as a close call. It does not declare a universal winner.

### 4. Three new high-intent PH guide hubs

v2.8 adds:

- `/recommendations/best-motorcycles-for-daily-commute-philippines`
- `/recommendations/beginner-friendly-motorcycles-philippines`
- `/recommendations/motorcycles-400cc-plus-philippines`

Each guide has an explicit inclusion rule, ordering method, tie-breaker, source policy, caveats, comparison table, quick picks, model analysis, FAQ and related-guide links.

The daily-commute guide uses a fixed decision-engine profile so its ordering is reproducible. The beginner guide is deliberately framed as a measurable starting shortlist rather than a safety guarantee. The 400cc+ guide is a displacement-based research set and explicitly refuses to infer expressway legality from displacement alone.

All three remain behind the existing `isIndexableRecommendation` quality gate and are included in sitemaps only when enough indexable models qualify.

### 5. Homepage decision flow

The homepage now surfaces a dedicated Decision Engine block:

1. set constraints;
2. see why each bike ranks; and
3. check the monthly planning reality.

The new decision-led guides are prioritized in the homepage guide strip so the site starts from actual buyer intent rather than generic catalog browsing.

### 6. UI layer

`app/v280.css` adds a denser decision-workspace visual system with:

- dark profile panel;
- prominent top-match card;
- ranked result cards;
- reasons/watch-outs panels;
- expandable factor scoring;
- monthly planning strip;
- responsive comparison decision matrix; and
- homepage decision-engine module.

The layout remains responsive down to narrow mobile widths.

## SEO / thin-content policy

v2.8 does **not** create model/price/spec/installment keyword permutations.

The scalable entry points are distinct user intents:

- canonical motorcycle entities;
- brand hubs;
- curated comparisons;
- data-backed budget/category/use-case guides; and
- interactive finder/tool pages.

Custom comparison permutations remain noindex unless they are editorially curated. New recommendation hubs remain gated by `isIndexableRecommendation`.

## Validation

The complete `npm run validate:all` chain passes after the v2.8 changes, including:

- historical release validators;
- v2.7 authority validator;
- new `validate:v280`;
- internal-link audit;
- content validation;
- product-layer validation; and
- media validation.

The handoff does not include `node_modules`, so a full `npm run typecheck` / `next build` was not run in this sandbox. The repository’s syntax validators parse the TS/TSX source successfully. Run `npm ci && npm run typecheck && npm run build` in normal CI/development before deployment.

## Preview

- `preview/v280-decision-engine-preview.html`
