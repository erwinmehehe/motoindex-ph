# Global model-first Price Philippines metadata and H1 alignment

Implemented October 29, 2026, in the MotoIndex motorcycle detail route.

## Rule

All **236 standard motorcycle detail URLs** use the exact same title and H1, with no brand prefix, year or marketing suffix:

```
<meta title> = <h1> = `${model.model} Price Philippines`
```

Examples: `Sniper 155 Price Philippines`, `NMAX V2 Price Philippines`, `BeAT Price Philippines`, `Classic 250i Price Philippines`.

There are **236 distinct model strings**, with no duplicates or missing model labels, so the model-only formula produces unique HTML titles. The original manufacturer identity still appears in body copy, links, structured data, and displayed breadcrumbs.

The previously reviewed eight model pages retain their tailored meta descriptions and hero intros, but their HTML titles lose the old `| Specs...` suffixes. For other models, the existing detailed SEO description is reused, with its primary keyword adjusted or introduced at the beginning. Both current and historical heroes use the same H1 helper, and the hero lede starts with the price keyword. Historical and availability-uncertain model status labels and existing price data remain intact.

Three VinFast electric model detail pages follow the same pattern: `Evo Price Philippines`, `Feliz II Price Philippines`, `Viper Price Philippines`. Their current price/battery/range content stays intact.

The four **generation-family hubs** (Aerox, NMAX, Click, ADV) are *not* single-model detail pages. They retain their separate generation-comparison metadata and H1s. Redirect-only paths are also excluded.

## Regression coverage

- Enforce 236 catalog models and unique exact-model titles without suffixes.
- Require route HTML title to use the same H1 helper as both current and historical hero templates.
- Require the exact keyword in snippets and in hero introduction text.
- Keep previous-generation price disclaimers, the original cited price references and the licensed R15 V3 hero photo.
- Ensure the three electric detail pages use the same model-first title/H1 rule.

No code in this change triggers production deployment. Merge after required GitHub Actions and Cloudflare preview checks pass; publish production only via the existing manually approved workflow.

## Complete keyword audit

All 236 catalog motorcycle records are in scope, with 198 current, 12 previous-generation, 16 discontinued and 10 availability-uncertain records. Three separate electric single-model pages are also in scope. Their primary keyword is the **exact visible H1** and the **exact document title** (no suffix or additional year).

The same keyword is required in the beginning of:
- the model's SEO meta description, including after the shared 158-character truncation;
- the model's visible hero introduction; and
- the primary model image alt (including Open Graph image alt metadata where applicable).

Hero photo alt text retains the actual visual description. Where no photo exists, the exact keyword is attached to an explicitly labeled **image placeholder**, not to a fictitious motorcycle photograph. Historical fallback images use keyword-aware `alt` text instead of an empty image alt. Decorative logo images and thumbnails that have an accessible labeled button are not keyword-stuffed.

Custom social metadata for Aerox V3 retains its Standard/SP context while adding the same keyword to its description and Open Graph image alt. The rest of the models inherit the canonical title and description.

### Photo availability follow-up

The existing motorcycle-media source audit tracks **20 local photo gaps**, listed below. The Yamaha YZF-R15 V3 has a separate appropriately attributed licensed Wikimedia photo shown on its historical detail page, leaving **19 standard model hero placeholders** needing rights-cleared exact-model photographs.

```text
yamaha-sr400
honda-pcx150
benelli-motobi-200-evo
honda-genio
honda-rs125
honda-rs150r
honda-scoopy
kawasaki-klx-140
kawasaki-ninja-zx-10r
kawasaki-ninja-zx-6r
kawasaki-z900-se
suzuki-smash-carb
tvs-ntorq-125
vespa-s-125
yamaha-aerox-v1
yamaha-nmax-v1
yamaha-sniper-150
yamaha-sz
yamaha-tricity
yamaha-yzf-r15-v3  (licensed externally; no local WebP)
```

Do not source or host third-party photographs without the required commercial-use, derivative and distribution rights. Accurate placeholder alt copy satisfies keyword alignment but **does not count as a real model image**.

### Automated coverage

`tests/allMotorcycleKeywordAlignment.test.ts` checks every model against its **actual selected source-description precedence** and confirms the exact keyword survives metadata trimming, appears in hero copy, appears in the photo/placeholder alt and retains the known historical/uncertain-price status caveat. The tests also verify static wiring into both current and historical hero components, the visible image stage, licensed R15 V3 image and 3 electric model pages. `tests/motorcycleHeroSeo.test.ts` covers the placeholder edge case across the whole catalog.

The four Aerox, NMAX, Click and ADV **model-family comparison hubs** are not single-model detail pages and retain separate generation-comparison SEO; they should be audited under their own family-intent rules.

This report describes the proposed PR implementation. Automated build and browser QA results are independently tracked on PR #523; a successful merge and separate production deployment are still required before treating the changes as live.
