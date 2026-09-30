# Helmet Product Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign every verified helmet product page as a sleek, modern, product-first buying guide with conditional Shopee/Lazada actions in the hero and the full editorial, comparison, FAQ, author, and trust content retained.

**Architecture:** Extend the existing client-side `AffiliateOffer` component with a hero presentation while preserving compact and detailed presentations. Render that presentation only inside the shared verified-helmet template, then add helmet-scoped route styles using the existing four-layer stylesheet architecture so motorcycle, tire, and top-box entities do not change.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, CSS, Node validation scripts

**Spec:** `docs/superpowers/specs/2026-09-30-helmet-product-page-redesign.md`

## Global Constraints

- Apply the layout to verified helmet product pages that use `app/gear/helmets/[brand]/[product]/page.tsx`.
- Do not apply motorcycle analytics or Northvale fleet styling to helmets.
- Use a seamless pure-white helmet media canvas; do not use a gray or gradient image stage.
- Show marketplace hero actions only when configured affiliate offers exist; never render an empty placeholder.
- Keep the detailed marketplace card and disclosure in the price section.
- Retain useful editorial copy, visor/parts guidance, alternatives, comparisons, FAQ, author, methodology, and related links.
- Do not change catalog facts, pricing, certifications, SEO selection logic, or affiliate destinations.
- Use existing design tokens; add merchant-color tokens centrally rather than introducing raw route colors.

## Review Focus

- A helmet with no affiliate links renders no empty hero-commerce wrapper while its normal “Compare prices” navigation remains usable.
- A product with one merchant renders one full-width hero action; two merchants render two actions without overflow.
- A disabled or failed affiliate lookup hides hero commerce without blocking the server-rendered page.
- Long certification, visor, and shell values wrap without clipping at 390 px.
- Shared product primitives remain visually unchanged on representative motorcycle, tire, and top-box pages.

---

### Task 1: Add a hero affiliate presentation

**Files:**
- Modify: `components/AffiliateOffer.tsx`
- Modify: `components/AffiliateLink.tsx`
- Modify: `app/styles/tokens.css`
- Modify: `app/styles/components.css`
- Modify: `scripts/validate-helmet-marketplace-affiliates.mjs`

**Interfaces:**
- Consumes: `/api/affiliate-links/[productId]` returning `{ active, offers }` and `AffiliateLink` merchant redirects.
- Produces: `AffiliateOffer({ productId, productName, variant?: "full" | "compact" | "hero" })`, defaulting to `"full"` for backward compatibility.

- [ ] **Step 1: Extend the affiliate validation with failing hero-mode assertions**

Assert that `AffiliateOffer.tsx` defines the exact variant union, renders `affiliate-hero-actions` only after active offers exist, maps every returned merchant, and keeps the detailed disclosure outside hero mode. Assert that `tokens.css` contains central Shopee and Lazada color tokens.

- [ ] **Step 2: Run the affiliate validation and confirm failure**

Run: `node scripts/validate-helmet-marketplace-affiliates.mjs`

Expected: FAIL because the hero variant and merchant tokens do not exist.

- [ ] **Step 3: Implement the hero mode**

Add `variant?: "full" | "compact" | "hero"` to `AffiliateOffer`. Reuse the existing fetch state, render nothing for inactive, empty, failed, or loading results, and render one `AffiliateLink` per active offer inside `.affiliate-hero-actions` for hero mode. Keep full-mode disclosure and compact catalog behavior unchanged.

- [ ] **Step 4: Centralize merchant styling**

Add `--mi-color-shopee` and `--mi-color-lazada` to `app/styles/tokens.css`. Move shared affiliate layout and merchant button rules from the component’s inline style string into `app/styles/components.css`, including one-column behavior below 700 px.

- [ ] **Step 5: Run focused checks**

Run: `node scripts/validate-helmet-marketplace-affiliates.mjs && npm run typecheck`

Expected: validation passes and TypeScript exits 0.

- [ ] **Step 6: Commit**

```bash
git add components/AffiliateOffer.tsx components/AffiliateLink.tsx app/styles/tokens.css app/styles/components.css scripts/validate-helmet-marketplace-affiliates.mjs
git commit -m "Add hero marketplace actions"
```

### Task 2: Apply the shared sleek helmet product layout

**Files:**
- Modify: `app/gear/helmets/[brand]/[product]/page.tsx`
- Modify: `app/styles/routes.css`
- Create: `scripts/validate-helmet-product-redesign.mjs`

**Interfaces:**
- Consumes: `AffiliateOffer` hero variant from Task 1 and the existing `ProductHero`, `ProductEntityNav`, `CommercePriceComparison`, editorial, alternatives, comparison, FAQ, author, and related-link components.
- Produces: helmet-scoped hero commerce, section structure, and `.helmet-product-page` route styling.

- [ ] **Step 1: Write the failing helmet-layout validator**

Create `scripts/validate-helmet-product-redesign.mjs`. Assert that the verified helmet page renders `<AffiliateOffer ... variant="hero" />` inside the `ProductHero` actions; retains `CommercePriceComparison`, `FaqSection`, `AuthorBox`, `RelatedLinks`, visor content, alternatives, and comparisons; and uses Price, Specifications, Fit & sizing, Visor & parts, Verdict, Alternatives, Compare, and FAQ navigation labels. Assert that route CSS contains helmet-scoped white media, flat fact strip, responsive hero actions, wrapping spec values, and mobile comparison overflow rules.

- [ ] **Step 2: Run the validator and confirm failure**

Run: `node scripts/validate-helmet-product-redesign.mjs`

Expected: FAIL because hero commerce and the new helmet-scoped selectors are absent.

- [ ] **Step 3: Add hero marketplace actions without removing the price anchor**

Import `AffiliateOffer` in the verified helmet page. Replace the single hero action with a `.helmet-hero-commerce` group containing hero marketplace actions and a secondary `#price` link. Do not render affiliate actions for catalog fallback pages.

- [ ] **Step 4: Refine section labels and preserve content**

Use the approved navigation labels and keep every existing content section. Add only semantic wrapper classes needed by the route stylesheet; do not alter catalog data, editorial generation, alternative selection, comparison rows, FAQ generation, author content, structured data, or metadata.

- [ ] **Step 5: Implement helmet-scoped sleek styling**

In `app/styles/routes.css`, style `.helmet-product-page` with a white image canvas, subtle border, no gradient, flat fact strips, restrained radii and shadows, thin section dividers, editorial typography, a compact horizontally scrollable nav, responsive commerce rows, wrapping long values, and mobile-safe comparison overflow. Scope every override below `.helmet-product-page`.

- [ ] **Step 6: Run focused validation**

Run: `node scripts/validate-helmet-product-redesign.mjs && node scripts/validate-helmet-marketplace-affiliates.mjs && npm run typecheck`

Expected: both validators pass and TypeScript exits 0.

- [ ] **Step 7: Commit**

```bash
git add app/gear/helmets/[brand]/[product]/page.tsx app/styles/routes.css scripts/validate-helmet-product-redesign.mjs
git commit -m "Redesign shared helmet product pages"
```

### Task 3: Verify responsive behavior and shared-template isolation

**Files:**
- Modify if verification reveals defects: files from Tasks 1–2 only

**Interfaces:**
- Consumes: completed hero affiliate mode and helmet-scoped page redesign.
- Produces: verified desktop/mobile behavior with no regressions to other product entities.

- [ ] **Step 1: Run static and production checks**

Run: `node scripts/validate-helmet-product-redesign.mjs && node scripts/validate-helmet-marketplace-affiliates.mjs && npm run validate:design && npm run lint && npm run typecheck && npm run build`

Expected: validators, design lint, typecheck, and build exit 0; lint has 0 errors (existing warnings may remain).

- [ ] **Step 2: Verify affiliate runtime contracts locally**

Start the production build and assert that `/api/affiliate-links/gille-883-falcon` returns Shopee and Lazada offers, both merchant redirect routes return 302 to their configured Involve Asia URLs, and an unconfigured helmet returns `{ active:false }`.

- [ ] **Step 3: Verify desktop pages visually**

At desktop width inspect Gille 883 Falcon, one other verified Gille helmet without configured affiliate links, and a verified helmet from another brand. Confirm the white media canvas, hero hierarchy, conditional actions, retained content/FAQ, and no empty commerce gap.

- [ ] **Step 4: Verify mobile pages visually**

At approximately 390×844 inspect Gille 883 Falcon and one unconfigured helmet. Confirm actions stack, long facts wrap, navigation scrolls horizontally, sections remain readable, and comparison content does not clip.

- [ ] **Step 5: Verify isolation**

Inspect one motorcycle, one tire, and one top-box product page. Confirm the helmet route styles do not change their hero, facts, or section layouts.

- [ ] **Step 6: Run final diff and status checks**

Run: `git diff --check && git status --short`

Expected: no whitespace errors; generated directories and unrelated artifacts remain unstaged.

- [ ] **Step 7: Commit verification fixes if needed**

```bash
git add <only files changed to fix verified defects>
git commit -m "Polish responsive helmet product layout"
```
