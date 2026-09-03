# MotoIndex PH v2.2.2 — Affiliate network routing

## What changed

- Generalized the v2.2.1 Shopee-only affiliate layer into a provider-neutral commerce layer.
- Added direct Shopee and Involve Asia network support per catalog product.
- Added `AFFILIATE_LINKS_JSON` as the preferred server-only configuration map while preserving `SHOPEE_AFFILIATE_LINKS_JSON` for backwards compatibility.
- Added `/go/affiliate/[productId]` as the provider-neutral redirect route; the old `/go/shopee/[productId]` route remains compatible.
- Public CTAs now say `Check current price` rather than exposing the affiliate network in the interface.
- Affiliate click analytics now include `network` as well as merchant, product ID, product name and placement.
- Admin data health reports direct-Shopee vs Involve Asia link counts and configuration errors.
- Affiliate disclosure now explains direct-merchant and affiliate-network routing.
- Added `AFFILIATE_SETUP.md` with migration and deployment instructions.
- Added `validate:v222` regression coverage.

## Safety / quality behavior

- Links remain fail-closed: no valid approved link means no public affiliate CTA.
- Only HTTPS Shopee or Involve Asia tracking hosts are accepted.
- Redirects remain `noindex, nofollow` and `no-store`.
- Public outbound actions remain `rel="sponsored nofollow noopener noreferrer"`.
- MotoIndex does not claim marketplace prices or stock are live.
