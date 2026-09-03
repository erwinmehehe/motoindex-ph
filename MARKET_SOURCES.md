# MotoIndex PH v1.7 market-source snapshot

Checked: 2026-08-25

MotoIndex stores price observations separately rather than collapsing every page into one artificial "correct" price. Current source classes in `lib/marketChecks.ts` are:

1. **Zigwheels Philippines** — comparison-site observation.
2. **Motortrade** — Philippine dealer observation.
3. **Wheeltek** — independent Philippine dealer observation added in v1.7.

Dealer prices are indicative and can differ by branch, financing program, stock and date. Manufacturer SRP remains part of the motorcycle source record; dealer observations are displayed as market checks rather than silently overwriting manufacturer data.

## Wheeltek live observations added in v1.7

| Motorcycle | Observed price | Source |
| --- | ---: | --- |
| Honda Giorno+ | ₱101,900 | https://wheeltek.com.ph/motorcycles/giorno/ |
| Honda XRM125 | ₱71,900–₱76,900 | https://wheeltek.com.ph/products/regular-bikes/ |
| Honda TMX Supremo | ₱78,900 | https://wheeltek.com.ph/motorcycles/tmx-supremo/ |
| Yamaha PG-1 | ₱96,400 | https://wheeltek.com.ph/vehicles/pg-1/ |
| Yamaha WR155R | ₱180,900 | https://wheeltek.com.ph/motorcycles/wr-155r/ |
| Yamaha XMAX | ₱311,000 | https://wheeltek.com.ph/motorcycles/xmax/ |
| Honda ADV160 | ₱166,900 | https://wheeltek.com.ph/motorcycles/adv160/ |
| Yamaha Mio Fazzio | ₱92,400–₱95,400 | https://wheeltek.com.ph/motorcycles/mio-fazzio/ |
| Yamaha YTX125 | ₱57,900 | https://wheeltek.com.ph/motorcycles/ytx-125/ |
| Yamaha XSR155 | ₱184,500 | https://wheeltek.com.ph/products/regular-bikes/page/5/ |
| Yamaha Sniper 155 | ₱128,400–₱148,400 | https://wheeltek.com.ph/products/regular-bikes/page/5/ |

The v1.7 PG-1 record deliberately preserves a large disagreement: Wheeltek showed **₱96,400**, while Motortrade showed **₱82,900** on the same check date. MotoIndex surfaces both source observations rather than averaging them or pretending they are the same offer.

## Model-level policy

MotoIndex is not a seller catalog. XRM125, Smash FI, Sniper 155 and similar families remain **one model page** even when current sources show several configurations. When those configurations create a meaningful price spread, the model page can show the observed range and explain what it represents. There are no trim/variant route families in v1.7.

## Image-reference policy

New v1.7 motorcycles use either:
- **manufacturer-hosted image references** from Suzuki Philippines or Kawasaki Philippines; or
- **authorized-dealer image references** from Wheeltek or Motortrade where a suitable manufacturer-hosted Philippine image was not available in the pass.

Every new asset is stored as `rightsStatus: "external-reference"`, keeps a source URL/credit, and is **not described as MotoIndex-owned or licensed**. No third-party image is copied into the repository. A real license or explicit permission is required before changing a record to `licensed`.

As of v2.1.1, the legacy Zigwheels-hosted motorcycle image references are fully removed. All 50 motorcycle records have one distinct attributed real-image reference. The media layer contains no Zigwheels URL and no generic motorcycle SVG placeholder. Zigwheels remains only where it is explicitly cited as a market-price/specification research source.
