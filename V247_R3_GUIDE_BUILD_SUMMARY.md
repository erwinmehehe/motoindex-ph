# MotoIndex PH v2.4.7 UI/tooling hardening R3 — guide architecture

This R3 overlay keeps the existing routes and the package version at 2.4.7. It is intended to be applied over the launch-ready v2.4.7 source while preserving that source's registry-generated `package-lock.json` unchanged.

## Recommendation-guide upgrade

All 10 recommendation guides now use one explicit editorial/data contract:

- H1 plus a direct 2–3 sentence answer and a dynamic count of currently qualifying motorcycles.
- Objective quick picks only (price, weight, seat height, published fuel economy, tank, engine, power or theoretical range as appropriate). No unsupported “Best Overall” labels.
- A full horizontally scrollable comparison table with order position, model, observed price, engine, transmission, weight, seat height, ABS wording, guide-specific metrics and a “Why it’s here” explanation.
- A visible selection methodology covering inclusion rules, primary ordering rule, tie-breakers, data-source policy and separate price/specification freshness dates.
- Rich per-model analysis showing why the model appears where it does, who should consider it, the main competing measurable priority, its model-page link and a relevant curated comparison when one exists.
- A “Which one should you choose?” section driven by rider priorities rather than repeating the same specification list.
- Explicit caveats for variant pricing, availability, published-vs-real-world figures, fit and comfort limits where relevant.
- Four to seven query-intent FAQs per guide.
- Editorial sections, related-guide internal links, and an expandable list of model pages with source/freshness context.

## Per-guide specialization

- Under ₱100K: exposes entry-variant qualification and utility/business vs scooter/underbone context.
- Automatic under ₱100K: emphasizes price, weight, seat height, tank, ABS and published economy without equating automatic with universally easy.
- ₱100K–₱150K: labels ordering as price order rather than an overall rank.
- Scooters: retains a neutral H1, uses objective mini-awards, and does not create a universal best-scooter score.
- ABS: shows exact recorded ABS wording instead of a generic yes/no badge and avoids safety rankings.
- Fuel economy: orders by published km/L, calculates clearly labeled theoretical range, and explains test-method limits.
- Underbones: exposes power and torque alongside price, weight, brakes and economy.
- Lower-seat guide: keeps seat-height-first ordering, adds ground clearance and an in-person physical-fit checklist.
- Longer rides: remains a tank/touring-layout shortlist, not a comfort ranking, and clearly states what specifications cannot determine.
- Lightweight: keeps curb-weight-first ordering and treats power-to-weight only as an optional future derived metric, not the ranking basis.

## Data structure

`RecommendationGuide` is expanded with controlled editorial/data fields including primary/secondary keywords, direct answer, inclusion rules, ordering rule, tie-breakers, source policy, caveats, table columns, quick-pick metrics, editorial sections, FAQ questions and related-guide slugs.

## Lockfile handling

No dependency or lockfile changes are included. `package-lock.json` is deliberately excluded from the overlay and must remain the registry-generated launch-ready copy.

## Validation

- `npm run validate:all` — PASS
- `npm run check:links` — PASS
- `node scripts/validate-post-audit.mjs` — PASS
- `node scripts/test-route-conflict-guard.mjs` — PASS

A dependency-backed Next.js build is not claimed from the offline source sandbox.
