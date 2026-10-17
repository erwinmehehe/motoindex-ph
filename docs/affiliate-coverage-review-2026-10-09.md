# MotoIndex affiliate product coverage — 9 October 2026

This inventory covers all **246 verified gear products** in the MotoIndex source catalog: **232 helmets, 3 tires and 11 top boxes**.

### Current research branch: candidate links still require QA

| Evidence / review status | Records | Publication status |
|---|---:|---|
| Earlier exact Shopee references | 18 | Previously researched editorial sources; **not affiliate-tracked** |
| Earlier exact retailer references | 85 | Previously researched editorial sources; **not affiliate-tracked** |
| **New product-specific retailer or Shopee candidates** | **24** | **Must complete live desktop/mobile item and variant review before approval** |
| Still missing a specific retailer item reference | 119 | Keep shopping destination hidden until researched and checked |

There are **127 dated item references in the inventory**, including 24 *unapproved research candidates*. This does **not** mean that 127 live purchase buttons or 127 affiliate links are ready. The repository-generated affiliate map is empty; production database/environment overrides and affiliate account attribution were not audited.

The reviewed earlier baseline was 103 source references and 143 gaps. The research branch records 24 more candidates (including 14 newly sourced in this increment). All candidates are stored in `data/affiliate-research-candidates.json` as `needs_live_browser_review`.

The protected `/admin/affiliate-links` manager now shows the candidate URL, source date, review note, and filters for pending or still-unmatched gear. `/admin/affiliate-links/research.csv` exports the entire **143-product research queue** (24 pending candidates plus 119 without any exact item reference). The export is a research aid, **not** an affiliate activation import.

See [the complete 246-row CSV](./affiliate-product-coverage-2026-10-09.csv) for each product ID, reference, date and next action. Source identity does not prove current availability, the correct product variant, affiliate approval or commission attribution.

## Release rules

- Never reuse one tracking shortlink across multiple unrelated product IDs.
- Never substitute a Shopee/Lazada store page, search page or category page for an item-specific destination.
- An opaque Involve Asia link must have an independently recorded exact item URL, then be browser-tested to confirm the tracking link opens that item.
- Existing sourced direct retailer links must be visibly labeled as **non-affiliate editorial sources**.
- Product pages without an approved item-specific mapping must not invent a checkout URL.
- Generate and approve product-specific tracked URLs through an authorized affiliate account before claiming affiliate commissions.
- Apply the additive Prisma migration for `AffiliateProductLink.destinationUrl` before using the updated runtime admin manager.

This inventory is a code/source audit, not an assertion that every third-party listing is currently in stock. Recheck links and sizes/colorways before activation.
