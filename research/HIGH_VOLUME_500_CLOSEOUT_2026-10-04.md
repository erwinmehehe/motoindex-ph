# MotoIndex PH: >500 Search-Volume Closeout

**Dataset:** ZigWheels Philippines organic-keyword export supplied 2026-10-02  
**Reviewed:** 2026-10-04  
**Rule:** monthly search volume > 500  
**Raw high-volume set:** 1,650 rows / 1,504 unique keywords

## Method

The export is not treated as a one-keyword-one-page backlog. Close variants, city-price variants, spelling variants and generation aliases are mapped to one canonical intent where possible.

Examples:
- `adv 160 price`, `honda adv 160 price philippines` and city price variants -> canonical ADV 160/model-price architecture.
- `classic motorcycle` -> strengthened Cafe Racer & Classic guide instead of a duplicate thin page.
- unofficial generation searches such as Click V4 stay on the Click family architecture with naming caveats instead of inventing an official Honda generation.

## High-volume gaps closed in this wave

### Category / style intent
- Cafe racer + classic motorcycle: strengthened existing canonical guide.
- Scrambler motorcycle: added dedicated recommendation guide.
- Moped Philippines: added classification-first guide.
- Existing sport, cruiser, underbone, scooter, dual-sport, adventure, 400cc+ and big-bike recommendation architecture retained.

### Brand / market authority pages
- Harley-Davidson: first-class brand/model coverage.
- Hero: current Philippine model coverage.
- Skygo: official-site current price list.
- VOGE: official Philippine current price list.
- NWOW: evidence-labeled market-reference page.
- Hatasu: evidence-labeled retailer price page.
- Lambretta: Philippine availability/model page with price-on-request caveats.

### Model gaps
- CFMOTO 450CL-C
- CFMOTO 250SR
- CFMOTO 125 ST Papio
- Zontes 400M
- BMW Motorrad R 18
- Honda CB500X (historical; routes current research to NX500)
- Honda CRF250L (historical)
- Honda CRF300L (current successor)

## Existing high-volume coverage confirmed rather than duplicated

- Honda Big Bikes already has a dedicated guide and Honda brand big-bike section.
- Cafe Racer already had a deep multi-model guide; it was expanded for classic-motorcycle intent.
- Honda Click, ADV, Yamaha Aerox and NMAX use family/generation architecture.
- Dedicated price/spec/top-speed/seat-height/weight/fuel-consumption routes already exist for supported model-intent combinations.
- Motorcycle loan calculator, electric motorcycle/scooter guides, brand hubs and major category guides already exist.

## No-build / hold rules

Do not create a page solely because a competitor URL ranks for a >500 keyword.

Hold or ignore when:
- the competitor URL is visibly mismatched to the keyword (example: an unrelated model ranking for another model query);
- the phrase is an ambiguous product code with weak motorcycle intent;
- current Philippine manufacturer/dealer evidence is too weak to make a responsible availability or price claim;
- the intent is already satisfied by a stronger canonical family/category page;
- a city-price clone would add no unique value.

Brands/models with weak or ambiguous current PH evidence should remain research holds until source quality improves instead of being published as fake-current inventory.

## Technical integration

- New model records feed the existing dynamic brand/model routes.
- New static authority pages are added to the motorcycle sitemap.
- New high-demand pages are linked from the motorcycle hub.
- Recommendation routing keeps style/category guides in the correct group.
- Current vs previous vs uncertain market status remains explicit.
- Manufacturer SRP, dealer price, market-reference price and historical launch price are not silently mixed.

## Release rule

This closeout ships through draft PR review. Do not merge or deploy until CI, Cloudflare compatibility and responsive Visual QA are green.
