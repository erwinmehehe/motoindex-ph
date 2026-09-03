# MotoIndex PH v0.4 Build Summary

## What changed

- Expanded the seed motorcycle catalog from 8 to 16 records.
- Added data-driven buyer-guide routes:
  - motorcycles under P100K
  - motorcycles P100K-P150K
  - best scooters
  - shorter-rider shortlist
  - long-ride shortlist
  - lightweight motorcycles
- Added a model-first fitment finder and one fitment page per seeded motorcycle.
- Added structured accessory research profiles for:
  - top boxes
  - phone holders
  - intercoms
  - rain gear
- Added confidence states so research guidance is not confused with verified compatibility.
- Rebuilt model accessory pages to consume the shared fitment engine.
- Added buyer-guide discovery to the homepage.
- Added recommendation and fitment URLs to the sitemap.
- Suppressed Product Offer schema on non-verified seed price records.
- Changed zero-volume seed models to display "SEO data pending" rather than "0 searches/mo".

## Current route surface

Approximate sitemap surface with current seed data:
- 9 static/hub URLs
- 64 model/model-subpage URLs (16 models x 4)
- 16 model fitment URLs
- 6 recommendation URLs
- 3 comparison URLs
- 8 helmet-brand URLs
- 4 accessory-category URLs

Total: about 110 indexable URLs before future product-level pages.

## Important data rule

The newly added motorcycle records are catalog seeds and remain `freshness: review`.
They are useful for building and testing the product architecture, but prices/specs should be source-verified before public launch.

Accessory "fitment" currently means a research profile unless confidence is explicitly upgraded after source evidence is stored.
