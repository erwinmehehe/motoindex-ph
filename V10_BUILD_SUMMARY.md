# MotoIndex PH v1.0 — Search-volume-priority expansion

## Why this release
The keyword workbook showed that the largest remaining distinct intents were not more generic articles. They were missing motorcycle generations and brand-level price-list pages.

Priority inputs used:
- aerox v2 price philippines — 20,000 PH searches/mo
- nmax v2 price philippines — 13,000
- nmax price philippines — 23,000 generic family intent
- aerox price philippines — 14,000 generic family intent
- yamaha motorcycle philippines price list — 4,800
- suzuki motorcycle philippines price list — 3,200
- kawasaki motorcycle philippines price list — 1,300

Volumes overlap and are used only for prioritization, not as a traffic forecast.

## Built
- Yamaha Aerox V2 structured previous-generation record.
- Yamaha NMAX V2 structured previous-generation record.
- `/motorcycles/yamaha/aerox/` model-family page.
- `/motorcycles/yamaha/nmax/` model-family page.
- `/motorcycles/[make]/` brand price-list hubs for every make in the catalog.
- Historical launch-price labeling for previous generations.
- Current-successor links from previous-generation pages.
- Previous generations cannot expose dealer quote/financing CTAs.
- Previous-generation sitemap coverage is intentionally limited to the model, historical price and tire-size pages.
- Models with unresolved search/dataset coverage are noindex and excluded from the sitemap.
- Homepage quick finder continues to show current models only.
- Recommendation guides use current models only.

## Anti-scaled-content rules
- Generic Aerox and NMAX terms map to one family page each instead of keyword-variant URLs.
- No separate 2024/2025/2026 pages were created.
- No separate synonym pages such as `yamaha-aerox-price`, `aerox-155-price`, etc.
- Previous generations are only created when they represent a real distinct motorcycle generation.
- Zero-research seed models are not placed in the sitemap.

## Data notes
Aerox V2 uses 2021 Philippine launch-price context from Manila Bulletin and core 2021 Aerox specifications cross-checked against Yamaha regional information.
NMAX V2 uses the 2020 Philippine launch-price context from MotoPinas and 2021 NMAX owner-manual specification references.
Historical launch prices are not treated as current seller offers.

## QA
- v0.6 offer engine validation passed.
- v0.7 seller/alert/ingestion validation passed.
- v0.8 unified-layout validation passed.
- v0.9 copy and used-market validation passed.
- v1.0 high-volume expansion validation passed.
- 86 TS/TSX source files parsed by the validation suite.
- One global Header and Footer remain in force.

## Next priority by search volume
The next major gap is helmet depth, not more motorcycle keyword variants. The highest-demand helmet brands in the workbook are KYT, Spyder, Gille, EVO and SEC. Their brand hubs already exist, but most still need enough real product/model data and source-backed local pricing to become strong indexable pages.
