# MotoIndex PH v2.6.0 — Canonical Entity Pages

## What changed

MotoIndex now treats each motorcycle as one canonical research entity instead of splitting price, installment, fitment, fuel, maintenance, safety and ownership intent across thin model subpages.

The canonical motorcycle page now contains:

- a stronger product hero with image, current/historical price context and decision facts;
- sticky in-page navigation for price, installment, specs, rider fit, tires/fitment, fuel, ownership, maintenance, safety, used value, alternatives and FAQ;
- dated price intelligence, variants and market checks;
- model-prefilled installment, rider-fit, fuel/range and ownership calculators;
- stock tire sizes, fitment evidence, compatible tire/top-box candidates and pressure data where official manual evidence exists;
- exact maintenance schedules where parsed, with official fallback sources elsewhere;
- official recall/service-campaign resources;
- used-market samples, depreciation planning and alternatives;
- entity-specific FAQ and Product JSON-LD;
- programmatic metadata targeting high-intent Philippine queries without creating separate thin pages.

## Canonicalization

Legacy motorcycle URLs such as `/price`, `/installment`, `/tire-size`, `/rider-fit`, `/fuel-economy`, `/maintenance`, `/safety`, `/ownership-cost`, `/used-value`, `/new-vs-used` and model-specific `/fitment/...` routes now permanently redirect to the matching section on the canonical motorcycle URL.

Motorcycle sitemaps now emit the canonical model URL only. Internal links were updated to point directly to canonical section anchors rather than through legacy redirects.

## Helmets, tires and top boxes

Existing product entity pages were kept as one strong URL per product and upgraded with stronger search titles/H1s, long-tail keyword metadata, anchored decision sections, FAQs, alternatives/comparisons and the same denser entity-page visual system.

## UI / UX

`app/v260.css` adds the new entity-page design layer after prior styles: stronger two-column heroes, contained product imagery, price lockups, carded decision content, dense responsive sections, sticky intent navigation and consistent product-entity cards across motorcycles and gear.

## Validation

`npm run validate:v260` checks the new canonical architecture, redirects, sitemap behavior, entity sections and gear-page requirements. Dependency-based typecheck/build still require a working npm registry connection in the environment.
