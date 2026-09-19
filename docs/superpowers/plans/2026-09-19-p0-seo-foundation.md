# MotoIndex P0 SEO Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the approved P0 SEO foundation by eliminating filtered-catalog indexation leakage, fixing sitemap completeness/freshness, upgrading priority-model source provenance, and making the anti-cannibalization rules permanent in CI.

**Architecture:** Rebuild the valid changes from stale PRs #120 and #122 on a fresh branch from current `main`, using existing MotoIndex validators as executable regression tests. Keep model-level intent consolidated on canonical motorcycle pages, keep redirect aliases out of sitemaps/internal links, and derive freshness from real source/model dates.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5.8, Node 22+, existing Node-based validation scripts, GitHub Actions/Cloudflare-compatible build.

**Spec:** `docs/superpowers/specs/2026-09-19-semantic-seo-growth-design.md`

## Global Constraints

- MotoDeal and Zigwheels are keyword-gap/SERP-demand inputs only, not URL-architecture templates.
- One canonical destination per search intent.
- Raw `/motorcycles` filter states must not become competing indexable pages.
- Model price/specs/colors/installment/tire-size/fuel/ownership intent stays on the canonical model URL.
- Redirect aliases must stay out of sitemaps and internal links.
- Sitemap `lastModified` must come from meaningful content/model/source dates, not a global release date when better dates exist.
- Priority source hierarchy: Philippine manufacturer → official brochure/manual → authorized Philippine dealer → government/regulatory source → MotoIndex first-party data → secondary comparison site only as a cross-check.
- Do not create thin city/model, model-subroute, cc-permutation, budget-permutation, or machine-generated comparison pages.
- Preserve Cloudflare compatibility and the existing `npm run verify` release gate.

## Review Focus

- Filtered URLs with one or multiple parameters must emit `noindex, follow` while clean `/motorcycles` remains indexable; Task 1 pins this.
- Empty/unknown query parameters must not accidentally noindex the clean hub; Task 1 pins non-empty supported filters only.
- Indexable accessory guides must appear in a sitemap and redirect-only aliases must not; Task 2 pins sitemap coverage and the existing SEO-hardening/public-trust validators pin redirect exclusions.
- Recommendation sitemap freshness must follow the newest included model verification date even when one model lacks a date; Task 2 pins fallback behavior.
- Priority model records must retain manufacturer/dealer provenance without making uncertain/previous models look current; Task 3 pins source domains and Ninja 400 review status.

---

### Task 1: Lock Filtered Catalog Indexation

**Files:**
- Modify: `scripts/validate-post-audit.mjs`
- Modify: `app/motorcycles/page.tsx`

**Interfaces:**
- Consumes: existing `pageMetadata({ title, description, path, index })`.
- Produces: `hasCatalogFilters(params: Record<string, string | string[] | undefined>): boolean` and async `generateMetadata({ searchParams }): Promise<Metadata>`.

- [ ] **Step 1: Add the failing regression checks**

Add to `scripts/validate-post-audit.mjs` near the existing recommendation/sitemap checks:

```js
const motorcyclesIndex = read("app/motorcycles/page.tsx");

need(
  motorcyclesIndex.includes("generateMetadata") &&
  motorcyclesIndex.includes("searchParams") &&
  motorcyclesIndex.includes("!hasActiveFilters"),
  "Filtered motorcycle catalog states must be noindex while the clean /motorcycles hub remains indexable"
);

need(
  motorcyclesIndex.includes('const CATALOG_FILTER_PARAMS = ["q", "make", "type", "budget", "sort", "max"] as const'),
  "Motorcycle catalog must define the supported filter params that trigger noindex"
);

need(
  !motorcyclesIndex.includes('query:{ budget:"100to150" }'),
  "Motorcycle hub must not internally promote a crawlable filtered budget URL when a canonical recommendation destination exists"
);
```

- [ ] **Step 2: Run the regression check and confirm RED**

Run:

```bash
npm run validate:post-audit
```

Expected: FAIL with the filtered catalog/noindex message and/or filtered budget-link message.

- [ ] **Step 3: Implement query-aware metadata**

Replace the static `metadata` export in `app/motorcycles/page.tsx` with:

```ts
const CATALOG_FILTER_PARAMS = ["q", "make", "type", "budget", "sort", "max"] as const;

function hasCatalogFilters(params: Record<string, string | string[] | undefined>) {
  return CATALOG_FILTER_PARAMS.some((key) => {
    const value = params[key];
    return Array.isArray(value) ? value.some(Boolean) : Boolean(value);
  });
}

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasActiveFilters = hasCatalogFilters(params);

  return pageMetadata({
    title: "Motorcycle Prices, Specs & Models | MotoIndex",
    description: "Compare motorcycle prices, specifications, tire sizes and ownership research across Philippine-market bikes and globally searched motorcycle models.",
    path: "/motorcycles",
    index: currentModels.length > 0 && !hasActiveFilters
  });
}
```

Replace the internal `₱100K–₱150K` filtered link with the canonical budget-research entry point:

```tsx
<Link href="/recommendations#budget">
  <span>Budget</span>
  <strong>₱100K–₱150K</strong>
  <small>Popular commuter price band →</small>
</Link>
```

- [ ] **Step 4: Run the focused validation and typecheck**

Run:

```bash
npm run validate:post-audit
npm run typecheck
```

Expected: both PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/validate-post-audit.mjs app/motorcycles/page.tsx
git commit -m "fix: noindex filtered motorcycle catalog states"
```

---

### Task 2: Fix Sitemap Coverage and Data-Derived Freshness

**Files:**
- Modify: `scripts/validate-post-audit.mjs`
- Modify: `lib/sitemaps.ts`
- Modify: `lib/recommendationSitemap.ts`

**Interfaces:**
- Consumes: `getRecommendationModels(slug)`, `isIndexableRecommendation(slug)`, model `marketPriceCheckedAt` / `verifiedAt`.
- Produces: sitemap entries for the three indexable accessory guides and model-derived recommendation `lastModified`.

- [ ] **Step 1: Add failing sitemap coverage/freshness checks**

Extend `scripts/validate-post-audit.mjs`:

```js
const p0SitemapSource = read("lib/sitemaps.ts");
const recSitemap = read("lib/recommendationSitemap.ts");

for (const route of [
  "/accessories/intercoms",
  "/accessories/phone-holders",
  "/accessories/rain-gear"
]) {
  need(
    p0SitemapSource.includes(`path:"${route}"`),
    `Core sitemap must include indexable accessory guide ${route}`
  );
}

need(
  recSitemap.includes("getRecommendationModels") &&
  recSitemap.includes("marketPriceCheckedAt || model.verifiedAt") &&
  !recSitemap.includes("lastModified: RELEASE_DATE"),
  "Recommendation sitemap lastModified must derive from the models included in each guide instead of the global release date"
);
```

- [ ] **Step 2: Run the regression check and confirm RED**

Run:

```bash
npm run validate:post-audit
```

Expected: FAIL for accessory sitemap omissions and recommendation freshness.

- [ ] **Step 3: Add indexable accessory guides to the core sitemap**

In `lib/sitemaps.ts`, add after the root accessories entry:

```ts
{path:"/accessories/intercoms",priority:.68,lastModified:latestAccessoryDate},
{path:"/accessories/phone-holders",priority:.68,lastModified:latestAccessoryDate},
{path:"/accessories/rain-gear",priority:.68,lastModified:latestAccessoryDate},
```

Keep redirect-only and consolidated aliases excluded.

- [ ] **Step 4: Derive recommendation freshness from included models**

Replace `lib/recommendationSitemap.ts` with:

```ts
import { getRecommendationModels, isIndexableRecommendation, recommendationGuides } from "@/lib/data";
import { RELEASE_DATE, SITE_URL } from "@/lib/site";

const newest = (dates: string[]) => [...dates].filter(Boolean).sort().at(-1) || RELEASE_DATE;

export function recommendationSitemapEntries() {
  return recommendationGuides
    .filter((guide) => isIndexableRecommendation(guide.slug))
    .map((guide) => {
      const models = getRecommendationModels(guide.slug);
      const lastModified = newest(
        models.map((model) => model.marketPriceCheckedAt || model.verifiedAt)
      );

      return {
        url: `${SITE_URL}/recommendations/${guide.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.72
      };
    });
}
```

- [ ] **Step 5: Run focused validation**

Run:

```bash
npm run validate:post-audit
npm run validate:seo-hardening
npm run typecheck
```

Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/validate-post-audit.mjs lib/sitemaps.ts lib/recommendationSitemap.ts
git commit -m "fix: complete SEO sitemaps and recommendation freshness"
```

---

### Task 3: Upgrade Priority Model Source Provenance

**Files:**
- Modify: `scripts/validate-public-trust.mjs`
- Modify: `lib/data.ts`
- Modify: `lib/marketChecks.ts`

**Interfaces:**
- Consumes: motorcycle records keyed by `id`, market-price checks keyed by `modelId`.
- Produces: manufacturer-first canonical sources for the first six priority models and manufacturer/dealer price observations.

- [ ] **Step 1: Add failing provenance checks**

Add to `scripts/validate-public-trust.mjs` after the motorcycle-summary checks:

```js
function motorcycleRecord(source, id) {
  const start = source.indexOf(`id: "${id}"`);
  if (start < 0) return "";
  const next = source.indexOf("\n  {", start + 1);
  return source.slice(start, next < 0 ? source.length : next);
}

const motorcycleData = read("lib/data.ts");
const marketChecksSource = read("lib/marketChecks.ts");

const primarySourcePriorityModels = {
  "honda-click-125i": "hondaph.com",
  "yamaha-aerox-v3": "yamaha-motor.com.ph",
  "honda-pcx-160": "hondaph.com",
  "suzuki-raider-r150": "mc.suzuki.com.ph",
  "honda-click-160": "hondaph.com",
  "yamaha-nmax-v3": "yamaha-motor.com.ph"
};

for (const [id, officialDomain] of Object.entries(primarySourcePriorityModels)) {
  const record = motorcycleRecord(motorcycleData, id);

  if (!record) {
    failures.push(`lib/data.ts: priority model ${id} is missing`);
    continue;
  }

  if (!record.includes(officialDomain)) {
    failures.push(
      `lib/data.ts: ${id} canonical record must use a current manufacturer source on ${officialDomain}`
    );
  }

  if (record.includes("zigwheels.ph") || record.includes("motodeal.com.ph")) {
    failures.push(
      `lib/data.ts: ${id} canonical record must not use a competitor as its primary/source-of-truth URL`
    );
  }

  const primaryMarketCheck = new RegExp(
    `modelId:"${id}"[^\\n]+sourceType:"(?:manufacturer|dealer)"`
  ).test(marketChecksSource);

  if (!primaryMarketCheck) {
    failures.push(
      `lib/marketChecks.ts: ${id} must include a manufacturer or dealer price/source observation`
    );
  }
}

const ninja400Record = motorcycleRecord(motorcycleData, "kawasaki-ninja-400");
if (!/freshness:\\s*"review"/.test(ninja400Record) || !/pending|recheck/i.test(ninja400Record)) {
  failures.push(
    "lib/data.ts: Kawasaki Ninja 400 must remain non-indexable until current Philippine manufacturer evidence is reverified"
  );
}
```

- [ ] **Step 2: Run the trust validator and confirm RED**

Run:

```bash
npm run validate:public-trust
```

Expected: FAIL for Aerox/NMAX/Click/PCX/Raider competitor-first provenance and any missing manufacturer/dealer market observation.

- [ ] **Step 3: Update canonical motorcycle records from verified primary sources**

Apply these exact primary-source domains/URLs after re-opening each source to confirm the page still represents the intended model on execution day:

```text
yamaha-aerox-v3
source: https://www.yamaha-motor.com.ph/yecvt
dealer checks:
https://motortrade.com.ph/motorcycles/yamaha-new-aerox/
https://motortrade.com.ph/motorcycles/yamaha-aerox-sp/

yamaha-nmax-v3
source: https://www.yamaha-motor.com.ph/yecvt
dealer checks:
https://motortrade.com.ph/motorcycles/yamaha-new-nmax/
https://motortrade.com.ph/make/yamaha/page/2/?maker=yamaha

honda-click-160
source/price: https://www.hondaph.com/motorcycle/news/ready-to-take-on-the-world-step-up-your-game-with-a-sportier-and-more-stylish-the-new-click160
dealer check:
https://motortrade.com.ph/motorcycles/honda-click-160/

honda-pcx-160
source/price: https://www.hondaph.com/motorcycle/news/filipino-urban-professionals-are-now-choosing-motorcycles-heres-why

honda-click-125i
source: https://www.hondaph.com/motorcycle/news/game-changer-upgrade-honda-introduces-the-click125-2026-year-model
price: https://www.hondaph.com/motorcycle/list

suzuki-raider-r150
source/price: https://mc.suzuki.com.ph/motorcycles/underbone/raider-r150-blade/
```

Canonical records must use manufacturer URLs. Dealer observations belong in `lib/marketChecks.ts` and can remain second-source verification.

Do not change a price/spec value unless the cited current source supports the new value.

- [ ] **Step 4: Add/refresh market observations**

Ensure `lib/marketChecks.ts` has at least one `sourceType:"manufacturer"` or `sourceType:"dealer"` row for each of the six IDs.

For current rechecked observations use execution-day `checkedAt`, not the old global `checkedAt` constant.

Remove competitor-only duplicate market checks for Click 125 and Raider after manufacturer checks replace them. Competitor cross-checks for other models may remain if they are not the canonical source.

- [ ] **Step 5: Preserve uncertain Ninja 400 gating**

Confirm the `kawasaki-ninja-400` record retains:

```ts
freshness: "review"
```

and text indicating current Philippine status is pending/recheck. Do not make it indexable merely because competitor sites list it.

- [ ] **Step 6: Run trust, content, and type validations**

Run:

```bash
npm run validate:public-trust
node scripts/validate-content.mjs
npm run typecheck
```

Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/validate-public-trust.mjs lib/data.ts lib/marketChecks.ts
git commit -m "fix: upgrade priority motorcycle source provenance"
```

---

### Task 4: Audit Remaining Canonical and Internal-Link Leakage

**Files:**
- Inspect: `scripts/validate-seo-hardening.mjs`
- Inspect: `scripts/check-legacy-recommendation-links.mjs`
- Inspect: `next.config.mjs`
- Inspect: `app/motorcycles/[make]/scooters/page.tsx`
- Inspect: internal links under `app/` and `components/`
- Modify only the concrete file(s) implicated by a discovered leak.

**Interfaces:**
- Consumes: the canonical/redirect rules already enforced by existing validators plus the new Task 1 filtered-catalog regression.
- Produces: a zero-leak audit result; if a real leak is found, a new failing validator assertion is added before the production fix.

- [ ] **Step 1: Run the existing canonical-routing validators**

Run:

```bash
npm run validate:seo-hardening
npm run validate:public-trust
npm run check:legacy-links
npm run check:links
```

Expected after Tasks 1–3: PASS. Record any concrete route/link failure exactly as reported.

- [ ] **Step 2: Search for known redirect-only/internal-filter patterns**

Run:

```bash
git grep -n -E '/motorcycles/(honda|yamaha)/scooters|pathname:[[:space:]]*["'\''`]\/motorcycles["'\''`].*query|\/motorcycles\?[^"'\''` ]+' -- app components lib
```

Expected:
- no hardcoded Honda/Yamaha scooter alias links outside redirect route definitions/tests;
- no internally promoted raw catalog filter URLs that should map to canonical research destinations.

- [ ] **Step 3: If a leak is found, add a failing assertion before fixing it**

Add the narrowest assertion to the validator that owns the behavior. Example for a newly discovered hardcoded legacy path in `app/page.tsx`:

```js
forbidText(
  home,
  "/motorcycles/honda/scooters",
  "Homepage must not link the redirect-only Honda scooter alias."
);
```

Run the owning validator and confirm it fails for the discovered path before changing production code.

If Step 2 finds no leaks, do not add redundant assertions or modify production files.

- [ ] **Step 4: Fix only confirmed leaks**

Replace a confirmed redirect-only or filtered internal target with the canonical destination from the approved spec.

Do not:
- remove permanent redirects;
- add new recommendation pages;
- create model subroutes;
- broaden the change beyond the concrete leak.

- [ ] **Step 5: Re-run routing validation**

```bash
npm run validate:seo-hardening
npm run validate:public-trust
npm run check:legacy-links
npm run check:links
```

Expected: all PASS.

- [ ] **Step 6: Commit only if the audit produced changes**

If files changed:

```bash
git add <exact changed validator and route/link files>
git commit -m "fix: remove remaining SEO canonical leaks"
```

If no files changed, record the audit as clean and proceed without an empty commit.

---

### Task 5: Full P0 Verification and Replace Stale PRs

**Files:**
- No production changes expected unless verification exposes a real regression.
- PR management: replace stale #120 and #122 with one current-main P0 PR.

**Interfaces:**
- Consumes: Tasks 1–4.
- Produces: one mergeable P0 branch/PR based on current `main`.

- [ ] **Step 1: Run the focused P0 validators**

```bash
npm run validate:post-audit
npm run validate:seo-hardening
npm run validate:public-trust
npm run check:links
npm run check:legacy-links
node scripts/validate-content.mjs
npm run typecheck
```

Expected: all PASS.

- [ ] **Step 2: Run the complete repository verification gate**

```bash
npm run verify
```

Expected: exit code 0 with no validator, lint, typecheck, or build failures.

- [ ] **Step 3: Inspect the diff against current main**

Run:

```bash
git diff --check main...HEAD
git diff --stat main...HEAD
git diff main...HEAD -- app/motorcycles/page.tsx lib/sitemaps.ts lib/recommendationSitemap.ts lib/data.ts lib/marketChecks.ts scripts/validate-post-audit.mjs scripts/validate-public-trust.mjs scripts/validate-seo-hardening.mjs
```

Verify:
- no unrelated design changes;
- no new routes;
- no model subroute proliferation;
- no competitor-first canonical source on the six priority models;
- no accidental removal of currently verified models.

- [ ] **Step 4: Create the replacement PR**

Title:

```text
Complete P0 SEO indexation, sitemap and source hardening
```

Body must state:
- replaces stale/non-mergeable #120 and #122;
- filtered catalog states are noindex;
- accessory sitemap coverage is complete;
- recommendation `lastModified` is data-derived;
- six priority model records use manufacturer-first provenance;
- canonical/anti-cannibalization rules are enforced in CI;
- `npm run verify` result.

- [ ] **Step 5: Close stale PRs #120 and #122 only after the replacement PR contains their intended behavior**

Comment/closure reason:

```text
Superseded by the current-main P0 SEO replacement PR, which reapplies the intended indexation/sitemap/provenance changes with fresh regression coverage.
```

- [ ] **Step 6: Final merge gate**

Before merge, require:
- replacement PR mergeable;
- required GitHub checks green;
- no new conflict with current `main`;
- changed-file list matches P0 scope.

Commit any verification-only fix with a focused message and rerun `npm run verify` before merge.

---

## Post-P0 Follow-on Plans

After this plan merges, create separate implementation plans from the approved design for:

1. `/motorcycles` authority-hub upgrade + top priority model entity upgrades.
2. `/motorcycles/scooters` national category hub.
3. Budget/displacement clusters, including 250cc/300cc/400cc and under-80k/100k/150k.
4. Expressway-legal motorcycles authority guide with official legal/regulatory sourcing.
5. `/motorcycles/new` evergreen launch hub.
6. `/financing` authority hub.
7. Generation/family expansion.
8. Curated comparison expansion.
9. Research/authority assets and first-party data growth.
