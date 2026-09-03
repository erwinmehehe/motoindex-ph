# MotoIndex PH v2.2.1 build summary

## Shopee affiliate layer

MotoIndex now has a production-oriented Shopee affiliate layer for purchase-intent gear and accessory surfaces without hard-coding tracking links into the repository.

### Configuration

Set `SHOPEE_AFFILIATE_LINKS_JSON` as a server-side JSON object keyed by MotoIndex catalog product ID. Example structure (with deliberately omitted URLs):

```json
{
  "kyt-tt-course": "<approved Shopee affiliate link>",
  "pirelli-angel-scooter": "<approved Shopee affiliate link>",
  "givi-b32n": "<approved Shopee affiliate link>"
}
```

Only HTTPS Shopee Philippines / Shopee short-link hosts are accepted. Unknown catalog IDs, invalid URLs and non-Shopee hosts are ignored and surfaced in the internal data-health dashboard.

### Public behavior

- Helmet, tire and top-box detail pages show a `Check price on Shopee` block only when that product has a configured approved link.
- Product catalog cards show a compact Shopee action only for configured products.
- When no link is configured, no fake/placeholder affiliate CTA is rendered.
- MotoIndex never labels the affiliate destination as a live price or guaranteed stock state.
- Affiliate copy tells visitors to confirm seller, exact variant, fitment/certification, shipping and final price on Shopee.

### Redirect and SEO controls

Affiliate buttons point to `/go/shopee/{productId}` rather than embedding tracking URLs throughout the UI. The redirect:

- is dynamic and not cached;
- returns 404 when no real link is configured;
- sets `X-Robots-Tag: noindex, nofollow`;
- is excluded through `/go/` in `robots.ts`;
- redirects only to an allowlisted Shopee host.

Affiliate links use `rel="sponsored nofollow noopener noreferrer"` and open in a new tab.

### Disclosure and independence

`/affiliate-disclosure` states that MotoIndex may earn a commission from qualifying purchases at no extra cost to the user, and that affiliate economics do not determine rankings, fitment conclusions, safety claims or editorial recommendations.

### Analytics

Configured affiliate clicks emit `affiliate_click` through the existing analytics abstraction with:

- merchant (`shopee`)
- product ID
- product name
- placement (`catalog_card` or `product_detail`)

### Operations

`/admin/data-health` now shows the number of configured Shopee links and any configuration problems, making expired or malformed link maintenance visible to the same operations workflow as data freshness.

### Validation

`npm run validate:v221` checks that the affiliate layer remains configuration-driven, fail-closed, sponsored/nofollow, noindex on redirects, disclosed, tracked and integrated only into product-intent surfaces.
