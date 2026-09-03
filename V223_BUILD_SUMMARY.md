# MotoIndex PH v2.2.3 — image-complete product commerce

Date: 2026-08-25

## Why this release exists

The v2.2.2 affiliate preview exposed two legitimate UX problems: the phrase “Research first. Shop second.” was weak conversion copy, and the real public gear catalog still had incomplete product-image coverage. The preview also used fake gray `PRODUCT PHOTO` boxes instead of the real images that already existed for some products.

## Fixed

- Every verified public gear product now has a real, model-specific image reference: **30/30 total**.
  - 27 verified helmet products
  - 1 verified tire family
  - 2 verified top boxes
- Added missing product media for Gille, EVO, SEC, Rook, HJC, AGV, Arai and Shoei.
- Retained existing real media for KYT, Spyder, Pirelli, GIVI and SHAD.
- Product imagery is shown with `object-fit: contain` so the whole helmet/tire/top box is visible instead of being cropped.
- Affiliate CTAs now require **both** a verified product image and a valid configured affiliate destination.
- CTA changed to **View on Shopee**. Product-detail commerce copy is now **Shop this product** / **See today's Shopee listing**.
- Involve Asia remains an attribution/routing network behind the Shopee destination instead of being exposed as shopper-facing copy.
- Public catalog and model-fitment product suggestions no longer promote research-only records as shop-ready products. Those seeds remain in the data layer until exact product identity, fitment and media are verified.
- Updated exact source pages for the Gille ILM-Z501 Vertix, SEC Breach and SEC Pilot 2025 records.
- Added a v2.2.3 validator that fails on any verified public product without media, missing image host, missing affiliate media gate, bad CTA copy, or package/lockfile drift.

## Image-source policy

Product photos remain attributed external references hosted by the brand or retailer. MotoIndex does not claim ownership of those images. The media record stores the source/rights holder and source page so a reference can be replaced during the normal refresh cycle.

## Validation target

Run:

```bash
npm run validate:v223
npm run validate:all
npm run validate:lockfile
npm run check:links
```

A dependency-backed `next build` still requires a normal environment with installed npm dependencies.
