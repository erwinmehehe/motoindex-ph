# MotoIndex AEO Sprint 3 — comparisons and gear hub answer upgrades

**Prepared:** 2026-10-20. **Release status:** GitHub implementation for review only. Neither a merge nor a successful CI job proves deployment, Google indexation, AI citation, or revenue.

## Scope — five already canonical URLs

- **/compare/aerox-v3-vs-nmax-v3** — Put an immediate answer to rider-fit, weight and tank tradeoffs above the large comparison interface. Show the exact Standard/SP and Standard/Tech Max verified variant price references and explain YECVT / ABS scope.
- **/compare/adv-160-vs-pcx-160** — Put a real seat-height comparison first and *explicitly* state that MotoIndex has no normalized PCX160 ground-clearance field. Explain the PCX Standard CBS / RoadSync ABS-HSTC difference and the ADV ABS / RoadSync distinction using exact local variants.
- **/gear/helmets** — Answer the Philippine fit/PS-or-ICC question before the catalog explorer; link to the existing sizing and certification guides. Add FAQPage schema from the already-visible buyer FAQ array.
- **/tires** — Answer how to find the right stock front and rear tire sizes near the hero. Add clear buyer questions on tire position and the already sourced 90/90-14 M/C 46P TL example. Reuse exactly those rendered answers for FAQPage JSON-LD.
- **/accessories** — Answer which accessory category helps with what, link to actual motorcycle fitment and top-box guidance, and add three real fitment questions with matching visible FAQ/JSON-LD.

## Verification and editorial safeguards

Comparison answers are computed at render from the existing model and verified variant records, not from manually typed prices or unverified inventory. Each page links to both canonical model sources and their complete price evidence, displaying model specification-check dates separately from actual price-source dates. Variant names and safety equipment remain exact-model claims. The PCX clearance comparison expressly avoids any unsupported mm difference.

This pass changes **no** existing canonical path, product pricing, seller offer, GTM tag, AdSense flag, title or meta description. The existing detailed comparison, buying matrix, FAQs, schema Article and SEO content remain in place. Only targeted comparisons receive extra FAQPage markup; it matches the visible new Q&A exactly. FAQ rich-result presentation and AI citations are **not guaranteed**.

Helmet conformity guidance avoids interpreting price or an overseas certification label as Philippine approval. Tire-size strings cannot establish physical fitment without ratings, construction and mounting checks. Accessory capacity does not prove compatibility.

## QA / next measurements

- CI: validators, unit and browser tests, lint, typecheck, full Next.js build.
- Visual QA on desktop and ~390px mobile: check semantic heading order, details/summary focus, evidence legibility, safe breakpoints, and no interference with existing compare interactions.
- Cloudflare Runtime Compatibility and privacy gate regression; no deployment triggered by this PR.
- After approved manual release, match /deployment-info.json to the **deployed** SHA; run scripts/smoke-public-core.mjs and verify HTTP 200, canonical, metadata, JSON-LD, visible quick answer and no unintended noindex for all five.
- Use combined GSC query+page data and a dated fixed AI answer/citation prompt set for subsequent impact assessment. No traffic gains, ranking lift or citation frequency should be inferred from code changes alone.

**Dependency:** Model AEO Batch 2 remains independent in PR #504; this sprint may be reviewed separately.
