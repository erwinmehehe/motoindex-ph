# Product Entity Shell Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild verified helmet and top-box detail pages around a shared MotoIndex product-detail shell inspired by the approved mockup, preserving all existing routes, SEO, data, affiliate logic, fitment logic, schema, and Cloudflare compatibility.

**Architecture:** Add a small shared presentation layer for product detail pages. Keep each route responsible for its own data retrieval and domain-specific sections, while shared components own the hero, key facts, trust row, and section framing. Replace the current CSS-heavy hero positioning with explicit markup and scoped product-detail styles.

**Tech Stack:** Next.js 15, React 19, TypeScript, existing MotoIndex CSS, Prisma-backed/catalog data, OpenNext + Cloudflare Workers.

**Spec:** `docs/superpowers/specs/2026-09-17-product-entity-shell-design.md`

## Global Constraints

- Preserve `/gear/helmets/[brand]/[product]` and `/accessories/top-box/[product]` URLs.
- Preserve helmet catalog fallback behavior.
- Preserve metadata, canonical URLs, Product JSON-LD, affiliate pricing, product data, top-box fitment, author/internal linking, and existing comparison logic.
- Keep helmet/top-box media contained. Do not regress the bounded placeholder fix.
- Keep the current MotoIndex indigo/white palette rather than the uploaded redesign's orange/cream palette.
- Do not increase the existing CSS performance budget.
- Do not change Prisma, package versions, Cloudflare/OpenNext configuration, or motorcycle page templates.

---

### Task 1: Build shared product-detail presentation components

**Files:**
- Create: `components/ProductEntityShell.tsx`
- Create: `components/ProductHero.tsx`
- Create: `components/ProductFactsGrid.tsx`
- Create: `components/ProductTrustRow.tsx`

**Interfaces:**
- `ProductEntityShell({ children, className? })` wraps the product page body while retaining `page shell product-entity-page` semantics.
- `ProductHero({ media, eyebrow, title, description, price, priceNote?, facts, trust })` renders the approved two-column hero with media left on desktop and product identity right.
- `ProductFactsGrid({ facts })` accepts `{ label: string; value: ReactNode }[]` and renders compact 2x2 facts.
- `ProductTrustRow({ status, sourceLabel, source, secondarySource?, lastChecked? })` renders a lightweight provenance row without a card treatment.

- [ ] **Step 1: Create the four shared components with semantic, class-based markup only.**

Use existing components such as `SourceRef` rather than duplicating source-link logic. Keep all new components server-compatible and dependency-free.

- [ ] **Step 2: Confirm the component markup contains no product-specific data access and no route logic.**

Expected: the shared components receive all content through props.

- [ ] **Step 3: Commit the shared presentation layer.**

Commit message: `feat: add shared product entity shell`

### Task 2: Migrate verified helmet product pages to the new shell

**Files:**
- Modify: `app/gear/helmets/[brand]/[product]/page.tsx`

**Interfaces:**
- Consume the shared components from Task 1.
- Keep `HelmetCatalogModelPage` unchanged for non-verified catalog-only fallback entries.

- [ ] **Step 1: Replace the current verified-product hero markup with `ProductEntityShell` + `ProductHero`.**

Hero facts should use current data in this order where available: helmet type, sizes, shell/weight, visor/Pinlock.

- [ ] **Step 2: Keep current metadata, Product JSON-LD, affiliate pricing, size table, visor section, comparisons, alternatives, FAQ, author box, and internal links unchanged in behavior.**

- [ ] **Step 3: Refine below-fold section markup only where necessary to support the approved visual hierarchy: Price, Specs, Sizing, Visor, Pros & Cons, Alternatives, Compare, FAQ.**

- [ ] **Step 4: Confirm the Gille fallback still flows through `EntityMedia` and remains contained.**

- [ ] **Step 5: Commit helmet migration.**

Commit message: `feat: redesign helmet product detail page`

### Task 3: Migrate top-box product pages to the new shell

**Files:**
- Modify: `app/accessories/top-box/[product]/page.tsx`

**Interfaces:**
- Consume the same shared shell and hero components.
- Keep top-box fitment and domain-specific mounting content in the route page.

- [ ] **Step 1: Replace the current top-box hero markup with the shared product hero.**

Hero facts should prioritize capacity, helmet capacity, mounting system, and maximum load or shell.

- [ ] **Step 2: Preserve price comparison, mounting, compatible accessories, fitment rows, alternatives, comparison table, FAQ, related links, and Product JSON-LD.**

- [ ] **Step 3: Commit top-box migration.**

Commit message: `feat: redesign top box product detail page`

### Task 4: Replace legacy product-detail layout CSS with the approved visual system

**Files:**
- Modify: `app/styles/product-entity-layout-fix.css`

**Interfaces:**
- Style the class structure from Tasks 1-3.
- Continue honoring `.entity-media`, `.entity-media-contained`, `.product-hero-card`, `ProductEntityNav`, CommercePriceComparison, spec tables, editorial cards, alternatives, and comparison tables.

- [ ] **Step 1: Remove the `display: contents` hero layout and rebuild the hero around explicit grid/flex wrappers.**

Desktop: media left, identity right. Mobile: media first, then identity/facts/trust. Keep images `object-fit: contain` through existing media components.

- [ ] **Step 2: Implement MotoIndex indigo/white styling matching the approved preview.**

Use restrained white/slate surfaces, indigo accents, subtle borders/shadows, compact 2x2 facts, lightweight trust row, clean spec rows, and three-column Best for / Strengths / Trade-offs at desktop.

- [ ] **Step 3: Keep sticky product navigation usable and horizontally scrollable on narrow screens without causing document overflow.**

- [ ] **Step 4: Ensure responsive layouts at <=900px and <=600px keep media bounded and all tables/cards readable.**

- [ ] **Step 5: Keep compiled CSS within the current budget.**

- [ ] **Step 6: Commit CSS redesign.**

Commit message: `style: rebuild product detail visual system`

### Task 5: Extend regression coverage and verify

**Files:**
- Modify: `scripts/visual-qa.mjs` only if current checks do not cover the new shell classes/geometry.

**Interfaces:**
- Existing product media placeholder bounds check remains mandatory.
- Add checks only where they catch the new layout regression modes.

- [ ] **Step 1: Ensure Visual QA covers one verified helmet, the Gille no-image/placeholder route, and one top-box detail page at mobile and desktop widths.**

Checks: no horizontal overflow; media stage height is bounded; product title/price/facts are visible; navigation exists; key section headings render.

- [ ] **Step 2: Run TypeScript validation.**

Run: `npm run typecheck`
Expected: exit 0.

- [ ] **Step 3: Run product/route validation and full build.**

Run: `npm run validate:all`
Expected: exit 0.

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 4: Run visual QA.**

Run: `npm run visual:qa`
Expected: exit 0 with the redesigned helmet and top-box representative routes passing.

- [ ] **Step 5: Run Cloudflare compatibility build.**

Run: `npm run cf:build`
Expected: exit 0.

- [ ] **Step 6: Review changed files to ensure no route/data/config drift.**

Expected changed production files are limited to the two product routes, shared product-detail components, product-detail CSS, and visual QA if required.

- [ ] **Step 7: Open a pull request to `main` with screenshots/QA notes when CI is green.**
