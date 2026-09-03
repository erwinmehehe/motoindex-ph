# MotoIndex PH v2.4.7 build summary

## Release scope

v2.4.7 hardens the public MotoIndex experience and adopts a single-entity pSEO architecture for gear. A verified product gets one canonical page that satisfies price, specification, sizing/fit, variants, pros/cons, alternatives, comparison, FAQ and purchase-intent searches. Keyword modifiers do not create separate thin URLs.

## pSEO entity architecture

- Helmet canonical route remains `/gear/helmets/{brand}/{product}` to preserve existing URLs.
- Tire product pages use the canonical tire product route and no longer collide on sibling dynamic-segment names.
- Top-box products use one canonical product page per stable model/family.
- Graphics, colors and configuration packages stay variants unless they become genuinely distinct products.
- Research-only families stay on a brand/category hub and do not generate thin product pages.
- Entity pages expose structured sections for price/reference price, specifications, fit/sizing evidence, variants, pros/cons, best-for guidance, alternatives, comparisons, FAQs, source/update context and Shopee commerce actions when an approved affiliate link is configured.

## Helmet expansion

Brand-level lineup coverage was added for LS2, NHK, SMK and Alpinestars. These lineups can satisfy brand/model discovery without pretending every name has a fully verified MotoIndex product record.

Eleven new source-backed canonical helmet entities were added:

- LS2 Thunder GP Pro
- LS2 Dragon
- LS2 Advant II
- NHK GP R Tech Race
- NHK Terminator TT
- SMK Stellar
- SMK Cygnus
- Alpinestars Supertech R10
- Alpinestars Supertech M10
- Alpinestars Supertech M8
- Alpinestars SM5

Helmet product types now support off-road and adventure classifications rather than forcing those products into a road full-face type.

## Top-box expansion

Five Coocase products are canonical verified entities:

- Coocase S28 Vivo
- Coocase V28 Fusion
- Coocase V36 Wizard
- Coocase S48 Astra
- Coocase V50 Reflex

Basic / BS / LL configurations are stored as variants under the canonical model instead of separate URLs.

The following remain research-only and do not generate product pages yet:

- Duhan: 3X/V8/Triple X and capacity-based alloy families
- Motowolf: aluminum 35L/45L/50L families
- Surfy: Alloy Top Box family

This is intentional: stable manufacturer model/SKU taxonomy is required before creating canonical entities.

## Media policy

No new third-party hotlinks were added for this tranche. Products without a checked/reusable image use the deliberate runtime image-unavailable state. The two previously known-dead remote records for KYT TT-Revo and SHAD SH39 were removed from the media registry.

Current verified public gear inventory: **59 products**.

- 41 have checked media records.
- 18 are explicitly documented as fallback-only until a safe checked image is available.

The media validator reads that explicit policy rather than silently allowing arbitrary missing images.

## Public-site hardening included in v2.4.7

- Smaller, balanced H1/H2 scale and tighter section spacing.
- Motorcycle catalog imagery uses a neutral `contain` canvas rather than destructive cropping.
- Homepage information hierarchy brings motorcycles/prices forward.
- Mobile Quick Finder and full Finder are shorter and progressive.
- Search has an intentional empty state rather than rendering forty default matches.
- Search uses public/current motorcycles only, preventing discontinued generations from leaking into current results.
- Compare selection stops at three with visible feedback instead of silently dropping a motorcycle.
- Mobile compare tray is compact/expandable.
- Mobile navigation is grouped, height-limited and scrollable.
- Shared MotoIndex brand lockup is used by the global shell.
- Contact page added for corrections, partnerships and general feedback.
- Weak accessory pages are noindex/follow until they have sufficient catalog depth.
- Model accessory URLs consolidate toward the fitment surface rather than competing as duplicate thin pages.
- Gear entity pages include rider-facing product description, best-for, pros, cons and purchase CTA behavior.
- Affiliate configuration is explicitly checked for the static-build lifecycle so missing build-time configuration is not mistaken for working commerce.

## Validation

`npm run validate:all` passes on the final source tree.

The latest v2.4.7 gate scans **78 page routes and 218 TS/TSX files**. The internal-link audit checks **80 route patterns across 144 source files**, with no broken literal/template routes and no static indexable orphans.

A prior negative regression probe confirmed the internal-link checker fails on an intentionally inserted bad route and returns clean after restoration.

## Lockfile handling for the UI-hardening overlay

The follow-up UI/tooling overlay does not contain or regenerate `package-lock.json`. Apply it over the separately verified launch-ready v2.4.7 source and preserve that registry-generated lockfile unchanged. This prevents an offline sandbox from reverting npm SRI or `@next/swc-*` 15.5.24 records.

After applying the overlay, run the normal launch gates with the preserved lockfile and production environment.
