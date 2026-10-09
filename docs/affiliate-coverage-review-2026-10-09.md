# MotoIndex affiliate product coverage — 9 October 2026

This inventory covers all **246 verified gear products** in the MotoIndex source catalog: **232 helmets, 3 tires and 11 top boxes**.

| Source-level status | Records | What a user can safely open |
|---|---:|---|
| Exact Shopee item URL in dated research | 18 | Direct Shopee item; editorial, **not affiliate-tracked** |
| Exact retailer item page in dated research | 85 | Direct product page at the recorded retailer; editorial, **not affiliate-tracked** |
| No reviewed exact retailer/item URL | 143 | Do not show a generic shopping redirect; source research is needed |

**Source-level direct product references: 103/246.** The repository's generated affiliate map is empty; live database records and environment overrides were **not** queried, so the number of truly active commissioned affiliate links cannot be established from this inventory.

See [the complete 246-row CSV](./affiliate-product-coverage-2026-10-09.csv) for each product ID, published source, date, and next action. Source identity is not proof of current availability, product variants, affiliate approval or commission attribution.

## Release rules

- Never reuse one tracking shortlink across multiple unrelated product IDs.
- Never substitute a Shopee/Lazada store page, search page or category page for an item-specific destination.
- An opaque Involve Asia link must have an independently recorded exact item URL, then be browser-tested to confirm the tracking link opens that item.
- Existing sourced direct retailer links must be visibly labeled as **non-affiliate editorial sources**.
- Product pages without an approved item-specific mapping must not invent a checkout URL.
- Generate and approve product-specific tracked URLs through an authorized affiliate account before claiming affiliate commissions.
- Apply the additive Prisma migration for `AffiliateProductLink.destinationUrl` before using the updated runtime admin manager.

This inventory is a code/source audit, not an assertion that every third-party listing is currently in stock. Recheck links and sizes/colorways before activation.
