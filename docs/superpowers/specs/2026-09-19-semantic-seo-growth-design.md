# MotoIndex Semantic SEO Growth Design

Date: 2026-09-19
Status: Design approved, written spec awaiting user review
Owner: MotoIndex PH

## 1. Objective

Grow non-brand organic traffic by making MotoIndex the most useful Philippine motorcycle research graph, not the site with the most URLs.

MotoDeal and Zigwheels are used only as keyword-gap and SERP-demand inputs. Their URL structures are not templates to copy.

Success means:
- one canonical destination per search intent;
- stronger coverage of high-demand motorcycle entities;
- fewer crawl/indexation leaks and overlapping URLs;
- clearer brand, model, generation, category, comparison, ownership, fitment, financing, and research relationships;
- more first-party and primary-source information;
- expansion only where distinct intent and useful information justify a page.

## 2. Core architecture

Primary entity graph:

Motorcycle
→ Brand
→ Family / Generation
→ Category / Displacement / Budget / Use Case
→ Comparison
→ Financing
→ Ownership
→ Tire / Fitment
→ Gear
→ Dealer
→ Research

Model pages remain the central entity nodes.

A model-level query should stay on the canonical model URL unless the intent is genuinely distinct.

Examples that stay on the model page:
- [model] price
- [model] specs
- [model] colors
- [model] installment
- [model] downpayment
- [model] tire size
- [model] top speed
- [model] fuel consumption
- [model] maintenance
- [model] ownership cost

Examples that can justify a separate page:
- [model] V2 vs V3
- [model] vs [model]
- a true family/generation entity with distinct search demand and unique data
- a national category, budget, legal, financing, or research intent with its own SERP

## 3. Canonical keyword-cluster map

| Search cluster | Canonical MotoIndex target | Decision |
|---|---|---|
| [brand] motorcycles Philippines | /motorcycles/[brand] | Improve existing |
| [brand] price list Philippines | /motorcycles/[brand] | Same URL, expand |
| [brand] scooters Philippines | Existing /recommendations/[brand]-scooters-philippines only where a quality-gated guide already exists; otherwise the brand hub | Consolidate, do not auto-create per brand |
| scooters Philippines | /motorcycles/scooters | New national authority hub |
| 125cc motorcycles Philippines | Existing displacement/recommendation cluster | Expand first, validate before new URL |
| 125cc scooters Philippines | Existing recommendation | Strengthen |
| 150cc scooters Philippines | Existing recommendation | Strengthen |
| 155cc scooters Philippines | No page initially | Create only if distinct SERP intent is validated |
| 160cc scooters Philippines | Existing/expanded recommendation | Strengthen |
| 250cc motorcycles Philippines | Curated recommendation collection | New page when inventory/intent quality gates pass |
| 300cc motorcycles Philippines | Curated recommendation collection | New page when inventory/intent quality gates pass |
| 400cc motorcycles Philippines | Existing 400cc cluster | Improve intent match, no duplicate |
| expressway legal motorcycles Philippines | Dedicated authoritative guide + qualifying models | Major opportunity |
| motorcycles under 80k | Budget recommendation cluster | Strengthen |
| motorcycles under 100k | Dedicated strong recommendation URL | Build/strengthen |
| motorcycles under 150k | Dedicated strong recommendation URL | Build/strengthen |
| cheap motorcycles Philippines | Under-100k page | No thin duplicate |
| latest motorcycles Philippines | /motorcycles/new | New evergreen launch hub |
| new motorcycles 2026 Philippines | /motorcycles/new | Same URL, year-aware copy/data |
| automatic motorcycles Philippines | Existing recommendation/category cluster | Improve |
| fuel efficient motorcycles Philippines | Existing original-data recommendation | Strengthen |
| lowest seat motorcycle Philippines | Seat-height research + recommendation relationship | Own topic |
| motorcycle installment Philippines | /financing + existing loan calculator + model installment sections | New hub |
| [model] installment | Canonical model URL | Expand model page |
| [model] tire size | Canonical model URL | Keep on model page |
| [model] top speed | Canonical model URL | Strengthen evidence |
| [model] fuel consumption | Canonical model URL | Strengthen source quality |
| [model] vs [model] | /compare/[pair] | Expand curated comparisons |
| [model] V1/V2/V3/V4 | Family/generation architecture | High-priority selective expansion |
| motorcycle loan calculator | Existing calculator | Strengthen links/internal authority |
| motorcycle ownership cost | Existing ownership/cost assets | Own topic |
| motorcycle seat height Philippines | Existing research dataset | Own topic |
| repo motorcycles Philippines | Existing repo section | Improve freshness carefully |

## 4. P0 technical foundation

P0 must be completed before large-scale page creation.

### 4.1 Indexation and canonical hygiene
- Raw catalog filter states such as ?make=, ?budget=, ?type=, ?sort= and equivalent combinations must not become competing indexable pages.
- Clean canonical hubs remain indexable.
- Redirect aliases must not appear in sitemaps or internal links.
- Superseded URLs must redirect permanently to the single intended destination.
- No page may combine contradictory noindex/canonical behavior.

### 4.2 Sitemap integrity
- Every indexable canonical route must be represented in the correct sitemap unless intentionally excluded by a documented quality gate.
- Accessory guides such as intercoms, phone holders, and rain gear must be included when indexable.
- Sitemap lastModified values must come from meaningful model/content/source verification dates, not a global release date.
- Recommendation lastModified values must reflect the newest relevant included data.

### 4.3 Source provenance
Priority model records should use this hierarchy:
1. Philippine manufacturer
2. official brochure/manual
3. authorized Philippine dealer
4. government/regulatory source
5. MotoIndex first-party data
6. secondary comparison site only as a cross-check

Top-priority canonical model records must not use MotoDeal or Zigwheels as the primary source when a better source exists.

### 4.4 SEO regression checks
CI should guard:
- filtered catalog states are noindex;
- clean hubs remain indexable;
- known indexable routes are present in sitemaps;
- redirected aliases are absent from sitemaps;
- recommendation freshness is data-derived;
- internal links do not promote filtered duplicate URLs;
- priority model records meet source-provenance rules;
- future canonical cluster definitions do not create duplicate-intent routes.

## 5. Model-authority expansion

The first model batch should focus on:
- Yamaha Aerox V3
- Yamaha NMAX
- Honda Click 125i
- Honda Click 160
- Honda PCX160
- Honda ADV160
- Suzuki Raider R150
- Yamaha Sniper 155
- Yamaha Fazzio
- Suzuki Burgman Street
- Yamaha XMAX
- Honda Winner X
- Yamaha XSR155
- Yamaha R15
- Kawasaki Ninja 500
- Kawasaki Z500
- KTM 390 Duke
- KTM RC 390
- Honda Rebel 500
- Honda CB650R

Each priority model page should cover, where evidence exists:
- current SRP and variants;
- installment/downpayment examples;
- dimensions, curb weight, seat height, tank capacity;
- engine/performance;
- brakes and ABS;
- tire sizes;
- colors;
- fuel economy/range;
- maintenance/ownership links;
- generation context;
- alternatives and comparisons;
- dealer/source evidence;
- update/verification dates.

No separate thin price/spec/colors/installment routes should be created.

## 6. Hub expansion

### 6.1 /motorcycles
Reposition as the definitive Philippine motorcycle price-list and market-discovery hub.

Should surface:
- number of current models;
- number of brands;
- price range;
- median/summary statistics where defensible;
- cheapest/current premium models;
- budget bands;
- major categories;
- automatic/scooter/underbone/big-bike paths;
- current launches;
- major brands;
- popular comparisons;
- original market observations.

### 6.2 /motorcycles/scooters
First new category authority hub.

Must contain more than a product grid:
- current scooter count;
- price distribution;
- cheapest/median/high-end;
- brand breakdown;
- 125cc/150cc/155cc/160cc/maxi relationships;
- seat-height and weight comparisons;
- fuel-economy context;
- ABS availability;
- commute/use-case context;
- related recommendation and comparison links.

### 6.3 /motorcycles/new
Evergreen launch/new-motorcycle hub.

Targets:
- latest motorcycles Philippines
- new motorcycles Philippines
- new motorcycles 2026 Philippines

Year references belong in content/data, not the permanent URL.

### 6.4 /financing
Create a single financing authority hub at /financing that connects:
- motorcycle installment Philippines;
- loan calculator;
- downpayment examples;
- financing methodology;
- model-level installment sections.

## 7. Recommendation architecture

Recommendation pages must distinguish editorial selection from full database qualification.

Preferred structure:
1. 5–10 editorial picks with clear reasons and tradeoffs;
2. qualification methodology;
3. full matching database below.

Pages with 100+ qualifying motorcycles must not imply that all are equally editorially recommended.

Existing strong clusters should be improved before creating near-duplicates:
- 125cc scooters
- 150cc scooters
- 160cc scooters
- automatic motorcycles
- fuel-efficient motorcycles
- beginner motorcycles
- low-seat/short-rider motorcycles
- 400cc+
- under-400cc
- Honda scooters
- Yamaha scooters
- maxi scooters

## 8. Generation architecture

Generation pages are selective, not automatic.

Create or retain a generation/family page only when:
- there is real search demand;
- specifications/market position differ meaningfully;
- the page can contain unique information;
- it helps users understand current vs previous generations.

Initial focus:
- Aerox V1/V2/V3
- NMAX generations
- Click generations
- PCX generations
- Sniper generations
- Raider generations

Generation-vs-generation comparisons may be separate comparison pages when intent is distinct.

## 9. Comparison strategy

Build approximately 30–50 high-demand curated comparisons instead of generating every pair.

Comparison pages should go beyond a spec table:
- price delta;
- installment delta;
- engine/performance;
- seat height and weight;
- tank/range;
- brakes/ABS;
- tire fitment;
- ownership-cost context;
- strengths/tradeoffs;
- who each model best suits;
- generation/variant caveats.

Initial comparison queue includes:
- Aerox V3 vs NMAX
- Aerox V3 vs Click 160
- ADV160 vs PCX160
- ADV160 vs NMAX
- NMAX vs PCX160
- Click 125 vs Click 160
- Click 125 vs Mio Gear
- Click 125 vs Burgman Street
- Fazzio vs Giorno+
- Raider R150 vs Sniper 155
- XMAX vs ADV350
- Ninja 500 vs R3
- Z500 vs 390 Duke
- Rebel 500 vs Eliminator
- CB650R vs MT-07

## 10. Research and authority moat

MotoIndex should expand original research instead of relying only on editorial articles.

Priority assets:
- Philippine Motorcycle Price Index
- Financing Index
- Seat Height Database
- Ownership Cost benchmarks
- fuel/maintenance/fitment datasets where methodology is defensible

These assets should:
- use transparent methodology;
- be updated on a reliable cadence;
- link back to relevant model/category entities;
- become natural citation/link targets.

## 11. Internal-linking rules

Every indexable page must have a semantic reason for its links.

For a model page:
- upward: brand, family, category;
- sideways: alternatives, relevant comparisons;
- attributes: tire fitment, seat-height research, fuel/ownership information;
- decisions: financing, dealers;
- downstream: compatible gear/accessories where verified.

Avoid generic “related articles” blocks without entity relevance.

## 12. Quality gates for new pages

A new indexable page must pass all of these:
- distinct search intent;
- clear canonical target;
- sufficient verified inventory/data;
- meaningful unique analysis or information gain;
- internal-link destination and inbound-link plan;
- appropriate schema/metadata;
- sitemap inclusion;
- no conflict with existing page;
- no thin templated copy.

If any gate fails, expand an existing entity instead of creating a new URL.

## 13. Explicit non-goals

Do not:
- create thousands of city + model price pages;
- create separate model price/spec/colors/installment pages;
- create every possible cc or budget permutation;
- generate every possible model comparison;
- create near-duplicate yearly URLs;
- build pages only because competitor exports contain the keyword;
- use generic AI copy as the primary information layer;
- treat competitor sites as authoritative primary sources when better evidence exists.

## 14. Implementation sequence

### Phase A: P0
1. Finish and merge indexation/sitemap hardening work.
2. Finish and merge priority source-provenance work.
3. Add/extend SEO regression checks.
4. Audit remaining canonical/redirect/internal-link inconsistencies.

### Phase B: Existing authority
5. Upgrade /motorcycles.
6. Upgrade priority model pages.
7. Improve major brand hubs.
8. Refactor oversized recommendation pages into editorial picks + complete qualifying lists.

### Phase C: Missing clusters
9. Build /motorcycles/scooters.
10. Improve validated budget/displacement clusters.
11. Build expressway-legal authority content with official legal/regulatory sourcing.
12. Build /motorcycles/new.
13. Build /financing authority hub.

### Phase D: Entity depth
14. Expand high-demand model-generation families.
15. Expand 30–50 curated comparisons.
16. Strengthen seat-height, ownership, loan, and repo research clusters.

### Phase E: Authority and monetization
17. Publish recurring original research updates.
18. Add genuine first-party/dealer/owner observations where available.
19. Expand fitment, tires, helmets, and accessories only where they support the motorcycle research journey.

## 15. Measurement

Primary KPIs:
- non-brand Google clicks;
- top-3 and top-10 non-brand query counts;
- number of model entities receiving organic clicks;
- clicks per priority model;
- clicks to brand/category hubs;
- comparison/recommendation/research traffic;
- indexed vs submitted canonical URLs;
- crawl waste from filter parameters;
- percentage of priority models backed by primary/dealer sources;
- internal orphan count;
- referring domains to original research assets;
- visibility in Search features and AI surfaces where measurable.

Indexed-page count is not a success metric by itself.

## 16. Existing P0 PR dependencies

At design time:
- PR #120 covers filtered catalog noindex behavior, accessory sitemap omissions, recommendation lastModified logic, and removal of an internally promoted filtered budget URL.
- PR #122 covers primary-source provenance for several priority motorcycles and protects uncertain Ninja 400 status.

Implementation must reconcile these PRs with current main before creating overlapping changes.
