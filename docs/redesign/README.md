# MotoIndex PH reference redesign

Implements the eight-view proposal inside the existing Next.js App Router application. Production data supplies all model names, prices, specifications, images and guides. The generated mockup is not a production asset.

| View | Existing route | Implementation |
| --- | --- | --- |
| Home | `/` | Original SEO H1/copy, entity hero photo, category shortcuts, counted brand cards and research links |
| Brand | `/motorcycles/[make]` | Original metadata/schema/editorial content plus server-authored filterable cards |
| Model | `/motorcycles/[make]/[slug]` | Existing entity page, verified gallery assets, paint names, badges, anchors and quick facts |
| Compare | Existing `/compare` and result routes | Builder/result routes, live matrix preview, removal, clear and share |
| Scooters | `/motorcycles/scooters` | Filterable product grid above original category research and tables |
| Helmets | `/gear/helmets` | Search/category/brand/budget/sort and device-local saves; original guides/FAQs retained |
| Prices | `/motorcycles#price-table` | Semantic table, search/brand filters, sorting, pagination and browser PDF export |
| Guides | `/guides`, `/guides/[slug]` | Server-authored cards with search/category filters; original research links retained |

## Integration

Shared components are in `components/wireframe/`. Reuses existing Tailwind v4 integration. Presentation stays in `app/styles/routes.css`, colors in `app/styles/tokens.css`. Selected legacy palette rules reference tokens rather than blocking the new theme with hard-coded priority declarations.

## SEO preservation

- Existing routes, redirects, robots rules, segmented sitemaps, source data, indexability gates and canonical helpers are unchanged.
- Existing page metadata and static-generation contracts are retained.
- Original Product, Article, Breadcrumb and other supplied schema nodes remain; brand hubs additionally identify their Brand.
- Brand and guide grids show the original complete sets initially. Optional display pagination follows a user action.
- The motorcycle explorer exposes remaining model links/basic facts in a native server-rendered disclosure.
- The semantic price table renders every row initially; JavaScript enhances display pagination. Printing reveals all filtered rows and repeats the table header. Select Save as PDF in the browser print dialog.
- No additional `/price-list` route is introduced: `/motorcycles` owns this search intent.
- Thumbnail galleries use only verified assets. Color chips use actual paint names and do not invent color-specific photos.
- Original source citations, author information, dated evidence, FAQs and longer buying content remain.

## Verification

Run `node scripts/validate-redesign-preservation.mjs`; optionally set `SEO_BASE_REF` to the baseline SHA. Guards existing routes, metadata/static-generation contracts and unchanged SEO/data files.

`validation-report.json` records initial-HTML comparisons for 10 representative URLs against a clean baseline: existing headings/paragraphs/list/specification text, main-content links, metadata and JSON-LD. Browser layout checks cover 8 views at 1440, 768 and 390 pixels. Brand search/category, price search/sort/pagination and comparison removal/clear were exercised without page JavaScript errors.

This is a review branch, not a production deployment. Rendered comparisons cover representative pages rather than every generated model URL. SEO/data source guards cover the repository separately. Field Core Web Vitals and Search Console need post-deployment monitoring; ranking stability is not guaranteed.

Gear saves use optional device-local storage separate from the existing motorcycle shortlist. No authentication, prices or seller integrations change.
