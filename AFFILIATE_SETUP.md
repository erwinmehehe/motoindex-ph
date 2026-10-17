# MotoIndex product-specific Shopee and Lazada links

## What went wrong with the Gille Kerena FF007

The generated affiliate cache previously applied the **same Shopee `invl.me/clo1b14` and Lazada `invl.me/clo1b1b` links to every verified helmet**. Those are general marketplace shortcuts, **not** deep links to the model-specific product pages. The `/go/affiliate/:productId/:merchant` route correctly redirected to that configured URL, but the target did not know which helmet the visitor was researching.

The cache now has **no generic fallback**. The merchant CTA is shown as an affiliate offer **only** when a mapping for that exact catalog product is configured. Known shared shortlinks and homepage/search URLs are refused.

### What happens until a specific affiliate link is ready?

For models with an exact Shopee price-source listing in the checked catalog, MotoIndex can show **View referenced product on Shopee**. This link goes straight to the source listing and is explicitly labelled **editorial/non-affiliate**. Previous `/go/affiliate/:productId/shopee` bookmarks also redirect to the exact source listing when no active product-level affiliate link is available. This fallback **does not attach affiliate tracking or claim commissions**.

For the Gille Kerena FF007, the catalog's September 9, 2026 source is:

`https://shopee.ph/Gille-FF007-Kerena-Full-Face-Motorcycle-Helmet-with-Revo-Lens-and-Single-Visor-i.505955057.25840894725`

**Open this listing manually to confirm it is still live, matches the exact model/variant, and is sold by the seller you intend to reference.** Source provenance is not proof of current inventory or stock.

## Create a real product-level affiliate link

1. Open the **exact item listing** in Shopee—not Shopee's homepage, store directory, campaign page, or search results.
2. In your own approved Shopee Affiliate account, use its current **Custom Link** tool and the exact product URL, then generate/copy the product's affiliate link. Alternatively, use your approved Involve Asia offer and generate a tracking deeplink for the same exact product URL.
3. **Test the resulting link in a private browser/mobile session** and confirm the final page's Shop ID and Item ID match the intended product. Shopee may open its app depending on platform and login state.
4. Open MotoIndex's protected **`/admin/affiliate-links`** page and search for product ID `gille-kerena-ff007`. Paste the **new, exact-item tracking link**, add a meaningful dated review note, and select **Save & activate**.
5. Reopen `/go/affiliate/gille-kerena-ff007/shopee`. It should now redirect through the new verified affiliate URL rather than to the direct editorial source.
6. Verify the mobile button, desktop button, app handoff, and affiliate network conversion events. Do not mark conversions as verified from clicks alone.

The runtime admin page writes to the `AffiliateProductLink` database table, so a successfully saved *new runtime mapping* does not require rebuilding static product content. **Build-time affiliate configuration:** changes made to environment JSON or `data/affiliate-links.generated.json` **require a rebuild and redeploy** to take effect. Do not expect a runtime-only environment change to update statically generated content. Database migrations and admin authentication must already be working.

Do not invent or reuse tracking IDs, and **do not post affiliate account credentials in source, public issues, or chat**. A direct Shopee listing is not automatically commission-tracked just because it links to Shopee.

## Bulk upload

The admin bulk editor accepts three tab-separated columns:

```text
productId    exact-item-affiliate-url    reviewNote
```

Each product ID must match a verified MotoIndex catalog record. Known generic `clo1b14`/`clo1b1b` shortlinks, general Shopee homepages, and Shopee search URLs are rejected. The admin must confirm that any opaque `invl.me` or `shope.ee` redirect lands on the correct product (the shortened URL itself does not expose the destination).

## Generate Involve Asia links in bulk

The optional generator uses approved server-side Involve Asia credentials from `.env.local`:

```env
INVOLVE_ASIA_API_KEY=
INVOLVE_ASIA_API_SECRET=
INVOLVE_ASIA_API_BASE_URL=https://api.involve.asia/api
INVOLVE_ASIA_SHOPEE_PH_OFFER_ID=
INVOLVE_ASIA_SHOPEE_SEARCH_FALLBACK=false
```

No credentials should use the `NEXT_PUBLIC_` prefix. You can select exact listing overrides:

```env
AFFILIATE_DESTINATIONS_JSON={"gille-kerena-ff007":"https://shopee.ph/Gille-FF007-Kerena-Full-Face-Motorcycle-Helmet-with-Revo-Lens-and-Single-Visor-i.505955057.25840894725"}
```

Commands:

```bash
npm run affiliates:preview
node scripts/generate-involve-affiliates.mjs --dry-run --product=gille-kerena-ff007
node scripts/generate-involve-affiliates.mjs --product=gille-kerena-ff007
npm run check:affiliate-build
```

**Search-result fallback generation is now disabled even if a legacy environment variable enables it.** The generator uses only known exact Shopee item URLs or explicit exact-product overrides. It writes validated shortlinks into `data/affiliate-links.generated.json`; commit/review that generated result and redeploy before using it. Keep a dated source/verification record, because the network's returned shortlink is opaque and may later point to a removed or altered product.

The public click route logs a product-level outbound event only for valid active affiliate links. A direct editorial source fallback is explicitly identified as non-affiliate and is not logged as a commissioned affiliate click.

## Common failure checks

- **Goes to Shopee homepage or a store:** A shared/generic tracking link was configured. Replace it with a product-specific tracking link.
- **Goes to search results:** The link was generated from a keyword search, not the product URL; regenerate using the Shop ID and Item ID page.
- **Item removed or wrong variant:** Recheck the exact Shopee listing and update your product mapping; do not silently send users to an unrelated helmet.
- **404 from MotoIndex:** Neither an approved affiliate link nor a checked exact Shopee source listing exists.
- **Involve Asia reports an error:** Confirm the account's active merchant offer and approved target URL; do not assume Shopee acceptance. Never put API keys in the browser.
- **Your redirect still uses an old URL:** Check whether the runtime database record overrides the generated/environment mapping, and whether the last configuration edit was deployed.
- **Link opens Shopee but no commission appears:** A direct editorial source isn't an affiliate tracking link. For real affiliate links, consult the Shopee/Involve Asia attribution reporting and program terms.

## Editorial and safety rule

MotoIndex should never describe a generic marketplace page as the exact item's purchase offer. For Shopee product sources, a URL must point to a specific listing such as `-i.<shopId>.<itemId>` or `/product/<shopId>/<itemId>`. Seller, price, variations and availability can change. Disclosure and retailer-quality review remain necessary.
