# Product Entity Shell Redesign

## Goal

Rebuild the helmet and top-box product detail experience around a shared MotoIndex product-detail shell inspired by the uploaded redesign, while preserving the existing MotoIndex indigo/white visual system, route structure, product data, SEO, affiliate logic, fitment logic, schema, and Cloudflare deployment setup.

## Scope

This redesign applies to:

- `app/gear/helmets/[brand]/[product]/page.tsx`
- `app/accessories/top-box/[product]/page.tsx`
- shared product-detail presentation components created for the redesign
- `app/styles/product-entity-layout-fix.css`
- `components/ProductEntityNav.tsx` or `components/ProductCard.tsx` only if a small compatibility adjustment is needed
- Visual QA coverage for the redesigned product detail shell

This redesign does not change:

- route URLs
- helmet or top-box catalog data
- Prisma
- affiliate destination data
- product pricing logic
- top-box fitment logic
- metadata/canonical generation
- schema payloads
- Cloudflare/OpenNext configuration
- package versions
- motorcycle product templates
- catalog-only helmet fallback routing behavior

## Architecture

Create a small shared presentation layer used by both verified helmet and top-box detail routes. The route pages continue to own product-specific data retrieval, editorial content, comparisons, schema, fitment, and SEO. Shared components own only visual hierarchy and layout.

The intended shared units are:

- `ProductEntityShell`: page-level product layout wrapper and product section flow
- `ProductHero`: two-column product identity region
- `ProductFactsGrid`: compact key-fact cards
- `ProductTrustRow`: low-visual-weight source and freshness information
- existing `ProductEntityNav`: sticky section navigation, retained unless a small styling adjustment is necessary

Avoid a giant generic component that understands helmet and top-box business logic. The shared layer should accept React children and simple presentation props so route-specific sections remain readable and independently maintainable.

## Visual Direction

Use the uploaded redesign's page structure and information hierarchy, but retain the existing MotoIndex indigo/white design language.

Design characteristics:

- white and soft slate surfaces
- MotoIndex indigo as the primary action/accent color
- subtle borders rather than heavy cards
- generous whitespace
- restrained shadows
- approximately 18-24px radii on major product surfaces
- compact facts and trust metadata
- minimal badge use
- no dashboard-like density
- no warm orange/cream palette from the uploaded redesign

The page must look like a focused shopping/research experience rather than a collection of unrelated cards.

## Product Hero

### Desktop

Use a true two-column JSX layout rather than the current `display: contents` CSS arrangement.

Left column:

- large product media stage
- contained product image
- white/slate background
- subtle border
- rounded corners
- existing `EntityMedia` handling remains in place

Right column:

- product category/status treatment
- H1
- concise description
- prominent product price/reference price where available
- 2x2 key-fact grid
- compact source/trust row

Helmet facts should prioritize the strongest available combination of:

- helmet type
- sizes
- weight or shell
- visor/Pinlock information

Top-box facts should prioritize:

- capacity
- helmet capacity
- mounting system
- max load when available, otherwise another meaningful verified fact

### Mobile

Order should be:

1. product media
2. product identity and description
3. price/reference price
4. fact grid
5. trust row
6. section navigation

No horizontal overflow is allowed. Long names and spec values must wrap naturally.

## Media Safety

Keep `components/EntityMedia.tsx` and its current contained helmet/top-box behavior.

Requirements:

- real product images use contained rendering and must not crop
- missing-image fallback stays inside the same bounded media stage
- the Gille placeholder regression must remain covered
- product media must never overlap the title, facts, trust row, or following sections

Do not import the uploaded redesign's `object-cover` product-image behavior.

## Product Trust Row

Replace the visually heavy product-details/source card with a compact source row.

The row should display the applicable combination of:

- verified/needs-checking state
- source label
- manufacturer/product source link
- price source link if distinct
- last-updated date

The trust row should read as provenance metadata, not as a primary card.

## Section Flow

Preserve all existing product content and functionality, but reorganize visual rhythm into:

1. Hero
2. Sticky section navigation
3. Price and availability
4. Specifications
5. Product-specific buying information
6. Best for / Strengths / Trade-offs
7. Alternatives
8. Compare
9. FAQ
10. existing author/internal-link/schema content

### Helmet-specific content

Preserve:

- Price
- Specs
- Sizing
- Visor / Pinlock / replacement parts
- Pros & cons
- Alternatives
- Compare
- FAQ
- CommercePriceComparison
- AuthorBox
- RelatedLinks
- JsonLd

### Top-box-specific content

Preserve:

- Price
- Specs
- Mounting
- Motorcycle fitment
- Pros & cons
- Alternatives
- Compare
- FAQ
- CommercePriceComparison
- LTO note
- RelatedLinks
- JsonLd

## Price and Availability

Make this the strongest below-the-fold section.

Requirements:

- prominent Philippine price reference
- supporting stock/variant information remains
- existing affiliate/seller offers remain functional
- seller rows should be visually lighter and easier to scan
- no changes to offer destination or affiliate logic

## Specifications

Use restrained specification tables with subtle row dividers rather than individual boxed rows.

Desktop:

- two-column label/value layout

Mobile:

- label and value stack when needed
- no clipped values
- no horizontal scrolling for ordinary product data

## Product-Specific Buying Sections

Do not force helmet sizing/visor and top-box mounting/fitment into identical structures.

They may share section-shell styling but retain route-specific markup needed to explain the product correctly.

## Editorial Block

Transform the existing editorial block into three visually calm sections:

- Best for
- Strengths
- Trade-offs

Use minimal borders and generous spacing. Avoid badge overload and dashboard-style metric tiles.

## Alternatives

Keep existing product selection logic.

Cards should emphasize:

- product image when available
- brand/model
- one or two useful supporting specs
- price reference where available
- clear product link

Do not add new recommendation logic as part of this redesign.

## Compare

Keep the existing compare data and links. Improve spacing and readability only.

The comparison table must handle long model/spec values without overflow.

## FAQ

Retain current FAQ content and SEO value. The visual treatment should be quieter than the Price, Specs, and product-specific buying sections.

## CSS Strategy

Rewrite `app/styles/product-entity-layout-fix.css` around the new JSX structure rather than layering more overrides onto the old structure.

Requirements:

- remove the product hero's dependency on `display: contents`
- reduce unnecessary `!important` usage
- reuse existing MotoIndex CSS variables where possible
- keep compiled CSS within the existing performance budget
- do not increase the CSS budget to accommodate the redesign
- responsive breakpoints must cover desktop, tablet, and narrow mobile states

## SEO and Data Preservation

The redesign must not alter:

- canonical paths
- indexed/noindex decisions
- title/description generation
- product JSON-LD values
- helmet catalog fallback redirects
- data source URLs
- product pricing values
- compare-target logic
- fitment records
- affiliate destination behavior

Markup can be reorganized for presentation, but existing semantic headings must remain coherent and there must be one H1 per product page.

## Accessibility

Requirements:

- meaningful link text remains intact
- section navigation remains keyboard accessible
- focus states must not be removed
- product facts remain readable without relying on color alone
- data tables/role-based specification structures retain appropriate semantics
- source links remain distinguishable from surrounding text

## QA and Acceptance Criteria

Before merge, verify at minimum:

- one verified helmet with a real image at desktop width
- one verified helmet with a real image at mobile width
- `/gear/helmets/gille/kerena-ff007` or an equivalent missing-image helmet route to verify bounded fallback media
- one top-box route at desktop width
- one top-box route at mobile width
- helmet CommercePriceComparison rendering
- top-box CommercePriceComparison rendering
- top-box fitment rendering
- long product names and long spec values
- sticky product navigation
- no horizontal overflow
- no product media cropping
- no placeholder escape from the media stage
- existing internal section anchors still resolve
- TypeScript passes
- Next build passes
- existing validation scripts pass
- CSS performance budget remains within current threshold
- Cloudflare Runtime Compatibility passes
- Visual QA passes

## Release Strategy

Implement on a feature branch and open a focused pull request. Do not merge solely because CI is green. Review Visual QA output for representative helmet and top-box routes, including a no-image fallback, before merge.

After merge, confirm the Cloudflare production deploy succeeds. A successful deployment workflow alone is not sufficient evidence for the prior visual regression: verify at least one affected live helmet route and one live top-box route before treating the redesign as fully released.
