# MotoIndex competitor-gap audit — ZigWheels, MotoDeal, Motortrade

Checked: 2026-09-30

## Competitor surfaces reviewed

### ZigWheels Philippines
- https://www.zigwheels.ph/new-motorcycles/below-150cc
- https://www.zigwheels.ph/new-motorcycles/scooter%2Bbelow-150cc
- https://www.zigwheels.ph/new-motorcycles/best-street
- https://www.zigwheels.ph/new-motorcycles/honda
- https://www.zigwheels.ph/compare-motorcycles

Observed strengths:
- broad displacement landing pages
- category + displacement combinations
- large brand price lists
- model price/installment sub-intent
- dense model comparisons
- city/dealer and popularity/review surfaces

### MotoDeal Philippines
- https://www.motodeal.com.ph/motorcycles
- https://www.motodeal.com.ph/motorcycles/honda

Observed strengths:
- brand and body-type discovery
- price-range filtering
- variants/specifications
- dealer connections
- promos and editorial/review content

### Motortrade
- https://motortrade.com.ph/
- https://motortrade.com.ph/motorcycle-category/pang-negosyo/
- https://motortrade.com.ph/motorcycle-category/underbone/
- https://motortrade.com.ph/motorcycle-category/pang-sports/
- https://motortrade.com.ph/make/honda/?maker=honda

Observed strengths:
- buyer-language use cases such as Pang Negosyo
- visible SRP, downpayment and monthly examples
- brand/category inventory
- loan application/calculator journey
- dealer-led commercial intent

## Gaps selected for MotoIndex

### 1. Motorcycles below 150cc
Competitor pattern: ZigWheels owns a broad below-150cc landing page plus category combinations.

MotoIndex action:
- /recommendations/motorcycles-below-150cc-philippines
- source-driven price/spec comparison across every current sub-150cc category
- links into 125cc motorcycles, 125cc scooters, 150/155cc scooters, underbones and business motorcycles
- no duplicate model price/spec URLs

### 2. Business motorcycles / Pang Negosyo
Competitor pattern: Motortrade exposes a dedicated Pang Negosyo category with work-oriented motorcycles.

MotoIndex action:
- /recommendations/business-motorcycles-philippines
- focuses on models explicitly classified as Business motorcycle
- compares price, engine, fuel tank, curb weight, seat height, ground clearance and fuel data
- includes sidecar/commercial-use cautions instead of assuming every work bike supports the same conversion

### 3. Street motorcycles
Competitor pattern: ZigWheels has a broad Street Motorcycles price-list page; MotoDeal exposes body-type discovery.

MotoIndex action:
- /recommendations/street-motorcycles-philippines
- broad road-use research layer for naked street bikes, retro roadsters, business motorcycles and utility-style road bikes
- narrower naked/classic/business guides remain canonical for their specific intent

## Gaps intentionally not cloned yet

### City-by-city model price pages
Do not create without unique, verified local price data. Repeating the same SRP under many city URLs would be thin.

### Popularity rankings
Do not claim "most popular" without a defensible first-party signal such as search behavior, saved shortlists or verified review volume.

### User reviews
Do not manufacture review content. Build only when MotoIndex has a real moderation and UGC system.

### Motorcycle promos
Competitors have promo inventory, but this should wait for a reliable current promo feed with expiry dates and source verification.

### Separate model price/spec/installment URLs
Keep model intent consolidated on canonical motorcycle pages. MotoIndex already has financing calculators, variant-aware examples, price intelligence and comparison data without creating thin derivative URLs.

## Internal-link architecture

/motorcycles
→ below-150cc guide
→ 125cc motorcycles
→ 125cc scooters
→ 150/155cc scooters
→ 160cc scooters

/motorcycles
→ business motorcycles
→ daily commute / fuel economy / budget guides

/motorcycles
→ street motorcycles
→ naked / cafe racer / business / ABS guides

All guide pages continue to link directly to canonical motorcycle model pages.
