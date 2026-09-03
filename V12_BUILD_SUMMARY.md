# MotoIndex PH v1.2 — CRF150L + Helmet Category Expansion

## Built
- Honda CRF150L model hub (9.1K PH search-volume priority) with Honda-source price/spec context, fuel economy and ground clearance.
- `/gear/helmets/half-face/`
- `/gear/helmets/modular/`
- `/gear/helmets/full-face/`
- `/gear/helmets/brands/` brand comparison
- Rook V152 source-backed brand depth without generating duplicate graphic pages.
- HJC C10, i71 and i31 source-backed model depth with Philippine TenPlus price/ICC observations.
- AGV K1 S, K3, K6 S, Eteres and Streetmodular source-backed depth with Motoworld PH prices and official/retailer specs.
- Arai Rapide Neo and Tour Cross V source-backed depth from Motoman PH listings.

## Indexing rules
- Helmet product pages index only when `status === verified`.
- Helmet brand pages normally require 2 verified models; Rook is allowed with its single materially distinct V152 family rather than manufacturing duplicate product URLs for graphics.
- Category pages aggregate verified products only.
- No keyword-variant pages such as `/hjc-helmet-price-philippines/` or `/best-full-face-helmet-philippines/` were added.

## Design consistency
- New routes inherit the same root Header/Footer.
- Category/brand tables use the existing paper/ink/orange tokens, radii, typography and responsive breakpoints.

## Data caution
- CRF150L ₱147,900 is the last official Honda Philippines SRP located in the source set (June 2023), explicitly labeled as a historical/current-reference price that should be confirmed with a dealer.
- Helmet prices are observations from the linked Philippine seller pages checked 2026-08-24 and can change by size, graphic, availability or promotion.
