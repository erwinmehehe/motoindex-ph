# MotoIndex PH v2.4.0 build summary

## Release goal
v2.4.0 turns the volume-first SEO roadmap into product changes while preserving the v2.3.1 launch/security baseline. The release focuses on the highest-volume intents that can be captured with existing MotoIndex data rather than adding a broad new marketplace before the current price and helmet surfaces are fully exploited.

## Price-intent expansion
Added `lib/priceSeo.ts` and wired it into every motorcycle price page. The highest-priority models now have intent-specific titles, descriptions, H1s and intros for 2026 Philippine price searches:
- Yamaha Aerox V3
- Honda ADV 160
- Yamaha Aerox V2 historical price context
- Honda PCX 160
- Honda Click 160
- Yamaha NMAX V3
- Yamaha Fazzio
- Honda ADV 350

Every price page also receives model-aware FAQs with FAQ structured data and stronger internal links to the rest of the model research flow.

## Aerox and NMAX family hubs
The generic Aerox and NMAX family pages now act as the canonical landing surfaces for non-generation-specific price intent. They show the current price reference, direct links to each generation's canonical price page, generation/lifecycle context, FAQs and ItemList structured data. Historical generation SRPs remain separated from current new-bike pricing.

## DL Code B quick-win guide
Added `/ownership/dl-code-b-motorcycle-philippines` for the high-volume LTO query cluster. The guide gives the answer immediately: DL Code B by itself is a passenger-vehicle code; motorcycles use DL Code A. It includes an A/A1/B comparison table, transmission/clutch-code guidance, FAQs and dated official LTO sources checked 2026-08-26.

## Zebra helmet expansion
Added Zebra as the first missing helmet brand from the volume roadmap, with three current Philippine product records and media references:
- Zebra Atlas 2026
- Zebra A113 Ritzy
- Zebra Alistair 2024

The catalog records keep seller claims and physical-unit verification separate. Certification wording is deliberately cautious: buyers are told to inspect the PS/ICC marking on the exact unit.

The generic helmet hub now targets helmet-price intent directly, shows checked-model/brand counts and observed starting-price range, expands the product grid and adds FAQ structured data.

## Roadmap packaged with the release
The workbook `research/ph_motorcycle_seo_300plus_keywords_with_volume_plan.xlsx` is included in the repository so the build plan stays beside the implementation and can be refreshed later.

## Quality gate
Added `npm run validate:v240` and folded it into `validate:all`. It guards the new price-target mappings, family-hub modules, DL Code B guide, Zebra product/media coverage, image allowlist and packaged roadmap workbook.

The existing Next.js 15.5.24 security baseline remains unchanged.
