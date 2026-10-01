# Helmet Product Page Redesign

## Goal

Redesign the shared verified-helmet product page as a premium motorcycle-gear shopping and research experience. The page should prioritize the helmet, its fit and safety information, and current buying actions. It must not reuse the fleet-analytics visual language intended for motorcycle performance data.

The redesign applies to every verified helmet rendered by the shared product template. Marketplace actions appear only for products with configured affiliate destinations. The Gille 883 Falcon currently has both Shopee and Lazada destinations.

## Design principles

- Product first: the helmet image, model, price, and purchase options are visible immediately.
- Useful density: generous spacing without large empty regions or disconnected fragments.
- Decision oriented: fit, certification, visor compatibility, and trade-offs are easier to find than generic prose.
- Consistent: verified helmet pages share one layout and component system.
- Trustworthy commerce: dated prices, merchant context, and affiliate disclosure remain explicit.
- Responsive: important actions remain readable and touch-friendly on narrow screens.
- Sleek and modern: prefer flat white surfaces, thin dividers, restrained shadows, tighter corner radii, strong editorial typography, and color used selectively for verification and merchant actions. Avoid a soft, card-heavy or dashboard-like appearance.

## Page structure

### 1. Product hero

Use a balanced two-column desktop hero and a single-column mobile hero.

The media side contains the helmet image on a seamless pure-white product canvas with a subtle border and shadow. Do not place a white-background helmet image inside a contrasting gray or gradient stage. The information side contains:

- helmet type and verification status;
- product name and short description;
- observed starting price and date context;
- primary marketplace actions when configured;
- a secondary link to the detailed price section;
- compact product badges for helmet type, available sizes, weight or shell, visor, and certification when recorded;
- the existing trust and source row.

Shopee and Lazada buttons use distinct, accessible merchant colors. When only one destination exists, show one button. When no affiliate destination exists, omit the marketplace action group without leaving an empty container. The detailed marketplace disclosure stays in the price section.

### 2. Sticky section navigation

Keep the existing in-page navigation, but make it visually compact and horizontally scrollable on mobile. The order is Price, Specs, Fit, Visor, Verdict, Alternatives, Compare, and FAQ.

### 3. Price and availability

Consolidate the observed price, exact-product reminder, variants, stock, checked date, and merchant rows into a coherent commerce panel. Avoid text collisions by using structured cards and responsive rows. Preserve the detailed Shopee/Lazada affiliate card and disclosure as a second buying opportunity below the merchant evidence.

### 4. Specifications and safety

Present core specifications in a clean two-column definition layout on desktop and a stacked layout on mobile. Give certification its own visually prominent row because it is a purchase-critical helmet attribute. Missing fields are omitted rather than filled with invented data.

### 5. Fit and sizing

Use a dedicated fit section with available-size chips or a verified size chart, plus a short measurement card. Keep the link to the full sizing guide. The section must clearly state that size labels are model-specific.

### 6. Visor and replacement parts

Group visor type, Pinlock or anti-fog support, and replacement visor information in one parts card. Keep the exact-model compatibility warning visible.

### 7. Buying verdict

Keep Best for, Strengths, and Trade-offs as three clearly separated cards. Use concise lists and equal visual weight; do not imply an editorial recommendation where the data only supports a factual description.

### 8. Editorial content, alternatives, comparisons, and FAQ

Retain the existing useful editorial copy, visor and parts guidance, generated alternatives, comparison tables, and full FAQ content. Improve card spacing and mobile overflow behavior without shortening the page into a thin product listing or changing the underlying selection logic or SEO structure.

### 9. Trust footer

Retain the Philippine helmet check, author information, methodology, and related links. Reduce visual competition with the buying sections while keeping these trust signals discoverable.

## Component changes

- Extend `AffiliateOffer` with a hero presentation that reuses the existing affiliate-status API and merchant-specific redirect routes.
- Render the hero affiliate presentation from the shared verified helmet page.
- Keep the full affiliate card inside `CommercePriceComparison`.
- Add helmet-specific page classes and styles rather than changing unrelated motorcycle, tire, or top-box pages that share the product primitives.
- Preserve existing metadata, structured data, comparison selection, and editorial data functions.

## Data and behavior

The browser requests `/api/affiliate-links/[productId]`. If active offers are returned, the hero renders one button per merchant. Buttons continue to use `/go/affiliate/[productId]/[merchant]`, so click logging and destination validation remain server-side. Failed or inactive affiliate lookups render no hero actions and do not block the rest of the product page.

Database-disabled products remain suppressed even when generated fallback links exist. Legacy Shopee routes remain Shopee-only.

## Accessibility

- Marketplace links have explicit merchant names.
- Button text and backgrounds meet readable contrast requirements.
- Mobile actions stack at narrow breakpoints and retain comfortable touch targets.
- Product facts remain semantic text rather than decorative graphics.
- Section headings preserve a logical document hierarchy.
- Horizontal comparison overflow remains keyboard and touch accessible.

## Testing and verification

- Add a focused validation for conditional hero affiliate rendering and merchant routes.
- Run the affiliate validation, typecheck, lint, design lint, and production build.
- Verify the Gille 883 Falcon page at desktop and approximately 390 px mobile width.
- Verify a helmet without affiliate links has no empty hero action container.
- Verify both Gille marketplace redirects resolve to the configured Involve Asia URLs without navigating through them during visual testing.
- Check representative verified helmet pages from at least two other brands to confirm the shared template remains consistent.

## Out of scope

- Changing helmet catalog data, prices, certifications, or editorial conclusions.
- Adding affiliate destinations to helmets other than those explicitly configured.
- Redesigning helmet listing, finder, or comparison pages.
- Applying motorcycle analytics or Northvale fleet styling to helmet pages.
