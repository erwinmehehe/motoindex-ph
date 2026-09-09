import type { EntityMedia } from "./types";

// Entity images use a local-first media policy. The canonical `src` is a self-hosted,
// standardized derivative under /public/media. `sourceImageUrl` preserves the checked
// upstream image for provenance and a temporary runtime fallback while local assets are synced.
export const entityMedia: EntityMedia[] = [
  {
    id: "site-mark",
    entityType: "site",
    entityId: "motoindex", role: "primary",
    src: "/brand/motoindex-mark.svg",
    alt: "MotoIndex PH mark",
    width: 512,
    height: 512,
    rightsStatus: "first-party",
    rightsHolder: "MotoIndex PH",
    lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-aerox-v3-wheeltek", entityType: "motorcycle", entityId: "yamaha-aerox-v3", role: "primary",
    src: "/media/motorcycles/yamaha-aerox-v3.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2026/06/mio-aerox-v3-race-blu.jpg", alt: "Yamaha Mio Aerox V3 motorcycle in Race Blu", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Mio Aerox V3", sourceUrl: "https://wheeltek.com.ph/motorcycles/mio-aerox-v3/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-nmax-v3-wheeltek", entityType: "motorcycle", entityId: "yamaha-nmax-v3", role: "primary",
    src: "/media/motorcycles/yamaha-nmax-v3.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2026/06/nmax-turbo-black-glossy.jpg", alt: "Current-generation Yamaha NMAX motorcycle in black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek All-New NMAX Tech Max", sourceUrl: "https://wheeltek.com.ph/motorcycles/all-new-nmax-techmax/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-aerox-v2-wheeltek", entityType: "motorcycle", entityId: "yamaha-aerox-v2", role: "primary",
    src: "/media/motorcycles/yamaha-aerox-v2.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/MIO-AEROX-cyan-storm.jpg", alt: "Previous-generation Yamaha Mio Aerox V2 motorcycle in Cyan Storm", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer historical image reference · Wheeltek Mio Aerox", sourceUrl: "https://wheeltek.com.ph/vehicles/mio-aerox/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-nmax-v2-wheeltek", entityType: "motorcycle", entityId: "yamaha-nmax-v2", role: "primary",
    src: "/media/motorcycles/yamaha-nmax-v2.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/NMAX-dark-petrol.jpg", alt: "Previous-generation Yamaha NMAX V2 motorcycle in Dark Petrol", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer historical image reference · Wheeltek NMAX", sourceUrl: "https://wheeltek.com.ph/vehicles/nmax/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-adv-160-wheeltek", entityType: "motorcycle", entityId: "honda-adv-160", role: "primary",
    src: "/media/motorcycles/honda-adv-160.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/ADV160-white.jpg", alt: "Honda ADV160 motorcycle in white", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek ADV160", sourceUrl: "https://wheeltek.com.ph/motorcycles/adv160/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-click-160-wheeltek", entityType: "motorcycle", entityId: "honda-click-160", role: "primary",
    src: "/media/motorcycles/honda-click-160.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/click160-new-model-white.jpg", alt: "Honda Click160 motorcycle in white", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Click160", sourceUrl: "https://wheeltek.com.ph/motorcycles/click160-new-model/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-click-150i-archive", entityType: "motorcycle", entityId: "honda-click-150i", role: "primary",
    src: "/media/motorcycles/honda-click-150i.webp", sourceImageUrl: "https://cdn.aripitstop.com/2019/01/HONDA-CLICK-150I-FILIPINA-1.png", alt: "Honda Click 150i Philippine-market scooter in Pearl Fadeless White", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Aripitstop.com", sourceLabel: "Historical model image reference · Honda Click 150i Filipina", sourceUrl: "https://www.aripitstop.com/2019/01/07/honda-click-150i-kejepret-diatas-truk-ekspedisi-ekspor-atau-lokal/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-pcx-160-wheeltek", entityType: "motorcycle", entityId: "honda-pcx-160", role: "primary",
    src: "/media/motorcycles/honda-pcx-160.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2026/06/PCX160-Standard-vortex-red-metallic.jpg", alt: "Honda PCX160 Standard motorcycle in Vortex Red Metallic", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek PCX160 Standard", sourceUrl: "https://wheeltek.com.ph/motorcycles/pcx160-standard/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-fazzio-wheeltek", entityType: "motorcycle", entityId: "yamaha-fazzio", role: "primary",
    src: "/media/motorcycles/yamaha-fazzio.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/MIO-FAZZIO-pastel-blue.jpg", alt: "Yamaha Mio Fazzio motorcycle in Pastel Blue", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Mio Fazzio", sourceUrl: "https://wheeltek.com.ph/motorcycles/mio-fazzio/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-crf150l-wheeltek", entityType: "motorcycle", entityId: "honda-crf150l", role: "primary",
    src: "/media/motorcycles/honda-crf150l.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/CRF150L-black-300x300.jpg", alt: "Honda CRF150L dual-sport motorcycle in black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek CRF150L", sourceUrl: "https://wheeltek.com.ph/products/regular-bikes/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-adv-350-manufacturer", entityType: "motorcycle", entityId: "honda-adv-350", role: "primary",
    src: "/media/motorcycles/honda-adv-350.webp", sourceImageUrl: "https://images.ctfassets.net/p4ab844it03t/7eCf5yAxFZKTvAJpDrn6JA/c219e1cb41af94a741f6a34abaf9298e/67f7133fabb39.png?fm=webp&q=80", alt: "Honda ADV350 motorcycle in Matte Gunpowder Black Metallic", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda Philippines", sourceLabel: "Manufacturer-hosted image reference · Honda Philippines ADV350", sourceUrl: "https://www.hondaph.com/big-bike/news/honda-philippines-makes-a-grand-statement-at-makina-moto-expo-2025-with-four-exciting-new-models", lastChecked: "2026-08-25"
  },
  {
    id: "kawasaki-ninja-400-manufacturer", entityType: "motorcycle", entityId: "kawasaki-ninja-400", role: "primary",
    src: "/media/motorcycles/kawasaki-ninja-400.webp", sourceImageUrl: "https://kawasakileisurebikes.ph/assets/img-news-events/Ninja-400-announcement2.JPG", alt: "Kawasaki Ninja 400 motorcycle in Metallic Magnetic Gray with Metallic Spark Black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors Philippines", sourceLabel: "Manufacturer-hosted historical image reference · Kawasaki Philippines Ninja 400", sourceUrl: "https://kawasakileisurebikes.ph/news-events/the-ninja-400/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-navi-wheeltek", entityType: "motorcycle", entityId: "honda-navi", role: "primary",
    src: "/media/motorcycles/honda-navi.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2026/06/honda-navi-ranger-green-300x300.jpg", alt: "Honda NAVi motorcycle in Ranger Green", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Honda NAVi", sourceUrl: "https://wheeltek.com.ph/products/regular-bikes/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-beat-wheeltek", entityType: "motorcycle", entityId: "honda-beat", role: "primary",
    src: "/media/motorcycles/honda-beat.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/02/honda-beat-premium-white-300x280.jpg", alt: "Honda BeAT Premium motorcycle in white", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Honda BeAT", sourceUrl: "https://wheeltek.com.ph/motorcycles/beat-limited-edition/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-click-125i-wheeltek", entityType: "motorcycle", entityId: "honda-click-125i", role: "primary",
    src: "/media/motorcycles/honda-click-125i.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/click-125-white.jpg", alt: "Honda Click125 motorcycle in white", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Click125", sourceUrl: "https://wheeltek.com.ph/motorcycles/click125/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-mio-gear-wheeltek", entityType: "motorcycle", entityId: "yamaha-mio-gear", role: "primary",
    src: "/media/motorcycles/yamaha-mio-gear.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/MIO-GEAR-brown.jpg", alt: "Yamaha Mio Gear motorcycle in brown", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Mio Gear", sourceUrl: "https://wheeltek.com.ph/motorcycles/mio-gear/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-burgman-street-ex-manufacturer", entityType: "motorcycle", entityId: "suzuki-burgman-street-ex", role: "primary",
    src: "/media/motorcycles/suzuki-burgman-street-ex.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2024/02/burgman_125_ex.png", alt: "Suzuki Burgman Street 125 EX motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines Burgman Street 125 EX", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/burgman-street-125-ex/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-sniper-155-wheeltek", entityType: "motorcycle", entityId: "yamaha-sniper-155", role: "primary",
    src: "/media/motorcycles/yamaha-sniper-155.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/SNIPER-155-matte-gray-300x300.jpg", alt: "Yamaha Sniper 155 motorcycle in matte gray", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Sniper 155", sourceUrl: "https://wheeltek.com.ph/products/regular-bikes/page/5/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-raider-r150-wheeltek", entityType: "motorcycle", entityId: "suzuki-raider-r150", role: "primary",
    src: "/media/motorcycles/suzuki-raider-r150.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/Raider-R150-FI-pearl-bright-ivory.jpg", alt: "Suzuki Raider R150 FI motorcycle in Pearl Bright Ivory", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Raider R150 FI", sourceUrl: "https://wheeltek.com.ph/motorcycles/raider-r150-fi/", lastChecked: "2026-08-25"
  },
  {
    id: "kawasaki-barako-ii-wheeltek", entityType: "motorcycle", entityId: "kawasaki-barako-ii", role: "primary",
    src: "/media/motorcycles/kawasaki-barako-ii.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/barako-175-FI-kick-start-red.jpg", alt: "Kawasaki Barako II / Barako 175 FI Kick Start motorcycle in red and black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Barako 175 FI Kick Start (Barako II)", sourceUrl: "https://wheeltek.com.ph/vehicles/barako-175-fi-kick-start/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-winner-x-wheeltek", entityType: "motorcycle", entityId: "honda-winner-x", role: "primary",
    src: "/media/motorcycles/honda-winner-x.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/Winner-X-Standard-ABS-Racing-Type-300x300.jpg", alt: "Honda Winner X ABS Racing Type motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Winner X", sourceUrl: "https://wheeltek.com.ph/products/regular-bikes/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-wave-rsx-wheeltek", entityType: "motorcycle", entityId: "honda-wave-rsx", role: "primary",
    src: "/media/motorcycles/honda-wave-rsx.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/Wave-RSX-Drum-red.jpg", alt: "Honda Wave RSX Drum motorcycle in red", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Wave RSX Drum", sourceUrl: "https://wheeltek.com.ph/motorcycles/wave-rsx-drum/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-tmx125-alpha-wheeltek", entityType: "motorcycle", entityId: "honda-tmx125-alpha", role: "primary",
    src: "/media/motorcycles/honda-tmx125-alpha.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/TMX125-Alpha-grey.jpg", alt: "Honda TMX125 Alpha motorcycle in gray", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek TMX125 Alpha", sourceUrl: "https://wheeltek.com.ph/motorcycles/tmx125-alpha/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-ytx-125-wheeltek", entityType: "motorcycle", entityId: "yamaha-ytx-125", role: "primary",
    src: "/media/motorcycles/yamaha-ytx-125.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/YTX-125-red-300x300.jpg", alt: "Yamaha YTX 125 motorcycle in red", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek YTX 125", sourceUrl: "https://wheeltek.com.ph/products/regular-bikes/page/5/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-cb150x-wheeltek", entityType: "motorcycle", entityId: "honda-cb150x", role: "primary",
    src: "/media/motorcycles/honda-cb150x.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/CB150X-black-300x300.jpg", alt: "Honda CB150X motorcycle in black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek CB150X", sourceUrl: "https://wheeltek.com.ph/products/regular-bikes/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-xsr155-wheeltek", entityType: "motorcycle", entityId: "yamaha-xsr155", role: "primary",
    src: "/media/motorcycles/yamaha-xsr155.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/XSR-155-metallic-black-elegance.jpg", alt: "Yamaha XSR155 motorcycle in Metallic Black Elegance", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek XSR155", sourceUrl: "https://wheeltek.com.ph/motorcycles/xsr-155/", lastChecked: "2026-08-25"
  },

  {
    id: "honda-giorno-plus-wheeltek", entityType: "motorcycle", entityId: "honda-giorno-plus", role: "primary",
    src: "/media/motorcycles/honda-giorno-plus.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/giorno-white.jpg", alt: "Honda Giorno+ motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Giorno+", sourceUrl: "https://wheeltek.com.ph/motorcycles/giorno/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-xrm125-wheeltek", entityType: "motorcycle", entityId: "honda-xrm125", role: "primary",
    src: "/media/motorcycles/honda-xrm125.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/XRM125-DS-yellow-black.jpg", alt: "Honda XRM125 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek XRM125 DS", sourceUrl: "https://wheeltek.com.ph/products/regular-bikes/", lastChecked: "2026-08-25"
  },
  {
    id: "honda-tmx-supremo-wheeltek", entityType: "motorcycle", entityId: "honda-tmx-supremo", role: "primary",
    src: "/media/motorcycles/honda-tmx-supremo.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/TMX-SUPREMO-red.jpg", alt: "Honda TMX Supremo motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek TMX Supremo", sourceUrl: "https://wheeltek.com.ph/motorcycles/tmx-supremo/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-pg-1-motortrade", entityType: "motorcycle", entityId: "yamaha-pg-1", role: "primary",
    src: "/media/motorcycles/yamaha-pg-1.webp", sourceImageUrl: "https://motortrade.com.ph/wp-content/uploads/2024/05/PG-1-BNR1-BN.jpg", alt: "Yamaha PG-1 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Philippine dealer network", sourceLabel: "Authorized-dealer image reference · Authorized PH dealer Yamaha PG-1", sourceUrl: "https://motortrade.com.ph/motorcycles/yamaha-pg-1/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-wr155r-wheeltek", entityType: "motorcycle", entityId: "yamaha-wr155r", role: "primary",
    src: "/media/motorcycles/yamaha-wr155r.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/WR-155R.jpg", alt: "Yamaha WR155R motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek WR155R", sourceUrl: "https://wheeltek.com.ph/motorcycles/wr-155r/", lastChecked: "2026-08-25"
  },
  {
    id: "yamaha-xmax-wheeltek", entityType: "motorcycle", entityId: "yamaha-xmax", role: "primary",
    src: "/media/motorcycles/yamaha-xmax.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/XMAX-powerd-gray.jpg", alt: "Yamaha XMAX motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek XMAX", sourceUrl: "https://wheeltek.com.ph/motorcycles/xmax/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-avenis-manufacturer", entityType: "motorcycle", entityId: "suzuki-avenis", role: "primary",
    src: "/media/motorcycles/suzuki-avenis.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2023/11/Avenis-gallery-2-360x203.webp", alt: "Suzuki Avenis motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines Avenis", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/avenis/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-smash-fi-manufacturer", entityType: "motorcycle", entityId: "suzuki-smash-fi", role: "primary",
    src: "/media/motorcycles/suzuki-smash-fi.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2024/05/image-3-Smash_Fi_Gallery-360x258.png", alt: "Suzuki Smash FI motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines Smash FI", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/underbone/smash-fi/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-raider-j-crossover-motortrade", entityType: "motorcycle", entityId: "suzuki-raider-j-crossover", role: "primary",
    src: "/media/motorcycles/suzuki-raider-j-crossover.webp", sourceImageUrl: "https://motortrade.com.ph/wp-content/uploads/2020/10/3-1.jpg", alt: "Suzuki Raider J Crossover motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Philippine dealer network", sourceLabel: "Authorized-dealer image reference · Authorized PH dealer Raider J Crossover", sourceUrl: "https://motortrade.com.ph/motorcycles/suzuki-raider-j-crossover-fj110lb2/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-raider-pro-manufacturer", entityType: "motorcycle", entityId: "suzuki-raider-pro", role: "primary",
    src: "/media/motorcycles/suzuki-raider-pro.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2025/11/DSC7574-360x240.jpg", alt: "Suzuki Raider PRO motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines Raider PRO", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/underbone/raider-pro/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-gixxer-155-manufacturer", entityType: "motorcycle", entityId: "suzuki-gixxer-155", role: "primary",
    src: "/media/motorcycles/suzuki-gixxer-155.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2024/10/Mask-group-2-360x147.png", alt: "Suzuki Gixxer 155 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines Gixxer 155", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-155/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-gixxer-sf-155-manufacturer", entityType: "motorcycle", entityId: "suzuki-gixxer-sf-155", role: "primary",
    src: "/media/motorcycles/suzuki-gixxer-sf-155.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2024/10/6144-ACTION-SHOT-TUNNEL-1-360x147.png", alt: "Suzuki Gixxer SF 155 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines Gixxer SF 155", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-sf-155/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-gixxer-250-manufacturer", entityType: "motorcycle", entityId: "suzuki-gixxer-250", role: "primary",
    src: "/media/motorcycles/suzuki-gixxer-250.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2023/11/Gixxer250-Gallery-1-360x240.webp", alt: "Suzuki Gixxer 250 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines Gixxer 250", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-250/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-gixxer-sf250-motortrade", entityType: "motorcycle", entityId: "suzuki-gixxer-sf250", role: "primary",
    src: "/media/motorcycles/suzuki-gixxer-sf250.webp", sourceImageUrl: "https://motortrade.com.ph/wp-content/uploads/2020/10/1-1.jpg", alt: "Suzuki Gixxer SF250 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Philippine dealer network", sourceLabel: "Authorized-dealer image reference · Authorized PH dealer Gixxer SF250", sourceUrl: "https://motortrade.com.ph/motorcycles/suzuki-sf-gixxer-250/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-v-strom-250-sx-manufacturer", entityType: "motorcycle", entityId: "suzuki-v-strom-250-sx", role: "primary",
    src: "/media/motorcycles/suzuki-v-strom-250-sx.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2023/10/V-Strom-250-SX-gallery-1-360x240.webp", alt: "Suzuki V-Strom 250 SX motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines V-Strom 250 SX", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/v-strom-250-sx/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-v-strom-160-manufacturer", entityType: "motorcycle", entityId: "suzuki-v-strom-160", role: "primary",
    src: "/media/motorcycles/suzuki-v-strom-160.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2026/04/TEASER-EDITED-DAY3-142A9244-360x240.jpg", alt: "Suzuki V-Strom 160 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines V-Strom 160", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/v-strom-160/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-dr160-manufacturer", entityType: "motorcycle", entityId: "suzuki-dr160", role: "primary",
    src: "/media/motorcycles/suzuki-dr160.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2026/04/TEASER-EDITED-DAY3-J3L04214-360x203.jpg", alt: "Suzuki DR160 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines DR160", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/dr160/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-access-manufacturer", entityType: "motorcycle", entityId: "suzuki-access", role: "primary",
    src: "/media/motorcycles/suzuki-access.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2025/10/Access-Image-1-1-360x191.png", alt: "Suzuki Access motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines Access", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/access/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-skydrive-sport-manufacturer", entityType: "motorcycle", entityId: "suzuki-skydrive-sport", role: "primary",
    src: "/media/motorcycles/suzuki-skydrive-sport.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2023/11/Skydrive-Sport-gallery-4-360x240.webp", alt: "Suzuki Skydrive Sport motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines Skydrive Sport", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/skydrive-sport/", lastChecked: "2026-08-25"
  },
  {
    id: "suzuki-burgman-street-manufacturer", entityType: "motorcycle", entityId: "suzuki-burgman-street", role: "primary",
    src: "/media/motorcycles/suzuki-burgman-street.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2023/11/burgman-street-highlight-1-360x240.webp", alt: "Suzuki Burgman Street motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted image reference · Suzuki Philippines Burgman Street", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/burgman-street/", lastChecked: "2026-08-25"
  },
  {
    id: "kawasaki-klx150-manufacturer", entityType: "motorcycle", entityId: "kawasaki-klx150", role: "primary",
    src: "/media/motorcycles/kawasaki-klx150.webp", sourceImageUrl: "https://kawasakileisurebikes.ph/assets/img-motorcycles/selected/images/25KLX150K-370GY1DLS3CG-A.jpg", alt: "Kawasaki KLX150 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Philippines", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Philippines KLX150", sourceUrl: "https://kawasakileisurebikes.ph/motorcycles/dual-purpose/klx150/", lastChecked: "2026-08-25"
  },
  {
    id: "kawasaki-klx230-manufacturer", entityType: "motorcycle", entityId: "kawasaki-klx230", role: "primary",
    src: "/media/motorcycles/kawasaki-klx230.webp", sourceImageUrl: "https://kawasakileisurebikes.ph/assets/img-motorcycles/selected/images/22LX230B-370BK1DLS3CG-A.jpg", alt: "Kawasaki KLX 230 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Philippines", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Philippines KLX 230", sourceUrl: "https://kawasakileisurebikes.ph/motorcycles/dual-purpose/klx-230/", lastChecked: "2026-08-25"
  },
  {
    id: "kawasaki-ninja-500-manufacturer", entityType: "motorcycle", entityId: "kawasaki-ninja-500", role: "primary",
    src: "/media/motorcycles/kawasaki-ninja-500.webp", sourceImageUrl: "https://kawasakileisurebikes.ph/assets/img-motorcycles/selected/images/24EX500G-242GY1DLS3CG-A.jpg", alt: "Kawasaki Ninja 500 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Philippines", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Philippines Ninja 500", sourceUrl: "https://kawasakileisurebikes.ph/motorcycles/sports/ninja-500/", lastChecked: "2026-08-25"
  },
  {
    id: "kawasaki-z500-manufacturer", entityType: "motorcycle", entityId: "kawasaki-z500", role: "primary",
    src: "/media/motorcycles/kawasaki-z500.webp", sourceImageUrl: "https://www.kawasakileisurebikes.ph/assets/img-motorcycles/selected/images/24ER500E-44SBK1DLS3CG-A.jpg", alt: "Kawasaki Z500 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Philippines", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Philippines Z500", sourceUrl: "https://www.kawasakileisurebikes.ph/motorcycles/sports/z500/", lastChecked: "2026-08-25"
  },

  // v2.2 gear imagery: model-specific external references for the verified products shown in primary discovery surfaces.
  {
    id: "kyt-tt-course-retailer", entityType: "helmet", entityId: "kyt-tt-course", role: "primary",
    src: "/media/helmets/kyt-tt-course.webp", sourceImageUrl: "https://data.outletmoto.eu/imgprodotto/casque-de-moto-int%C3%A9gral-kyt-tt-course-gear-blk-rouge_207247.jpg", alt: "KYT TT-Course full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "OutletMoto", sourceLabel: "Retailer-hosted product image reference · KYT TT-Course", sourceUrl: "https://www.outletmoto.eu/", lastChecked: "2026-08-25"
  },
  {
    id: "kyt-r2r-retailer", entityType: "helmet", entityId: "kyt-r2r", role: "primary",
    src: "/media/helmets/kyt-r2r.webp", sourceImageUrl: "https://cdn11.bigcommerce.com/s-0m9ut/images/stencil/original/products/525340/613221/c082318fc8f8dd6a97ff50351a17790ccc0561e3-large__86909.1757911204.jpg?c=2", alt: "KYT R2R full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Retail product image host", sourceLabel: "Retailer-hosted product image reference · KYT R2R", sourceUrl: "https://www.speedaddicts.com/motorcycle/kyt-r2r-white-gloss-helmet", lastChecked: "2026-08-25"
  },
  {
    id: "gille-135-source", entityType: "helmet", entityId: "gille-135", role: "primary",
    src: "/media/helmets/gille-135.webp", sourceImageUrl: "https://kranosgears.com/cdn/shop/files/da05c09b-a56a-47cb-a47a-ae00932098e5_1024x1024@2x.jpg?v=1729128386", alt: "Gille 135 Two Tone full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kranos Gears", sourceLabel: "Retailer-hosted product image reference · Gille 135 Two Tone", sourceUrl: "https://kranosgears.com/products/gille-135-two-tone-black-white-dual-visor", lastChecked: "2026-09-07"
  },
  {
    id: "gille-843-circuit-source", entityType: "helmet", entityId: "gille-843-circuit", role: "primary",
    src: "/media/helmets/gille-843-circuit.webp", sourceImageUrl: "https://kranosgears.com/cdn/shop/files/2f44cf3b-2258-44b1-b23b-cad72a5675a1_1024x1024@2x.jpg?v=1774333294", alt: "Gille 843 Circuit full-face motorcycle helmet in matte gray", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kranos Gears", sourceLabel: "Retailer-hosted product image reference · Gille 843 Circuit", sourceUrl: "https://kranosgears.com/products/gille-843-circuit-matte-gray-dual-visor", lastChecked: "2026-09-07"
  },
  {
    id: "gille-863-medusa-source", entityType: "helmet", entityId: "gille-863-medusa", role: "primary",
    src: "/media/helmets/gille-863-medusa.webp", sourceImageUrl: "https://kranosgears.com/cdn/shop/files/6066bb34-6b79-44b2-94d8-533665b31e74_1024x1024@2x.jpg?v=1729045788", alt: "Gille 863 Medusa Forged full-face motorcycle helmet with spoiler", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kranos Gears", sourceLabel: "Retailer-hosted product image reference · Gille 863 Medusa Forged", sourceUrl: "https://kranosgears.com/products/gille-863-medusa-forged-free-clear-lens-with-spoiler-dual-visor", lastChecked: "2026-09-07"
  },
  {
    id: "gille-873-celeste-source", entityType: "helmet", entityId: "gille-873-celeste", role: "primary",
    src: "/media/helmets/gille-873-celeste.webp", sourceImageUrl: "https://kranosgears.com/cdn/shop/files/7e58a6af-117a-4ab1-9f2e-a0385d5fb46d_1024x1024@2x.jpg?v=1729046805", alt: "Gille 873 Celeste Forged full-face motorcycle helmet with spoiler", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kranos Gears", sourceLabel: "Retailer-hosted product image reference · Gille 873 Celeste Forged", sourceUrl: "https://kranosgears.com/products/gille-873-celeste-forged-free-clear-lens-with-spoiler-dual-visor-copy", lastChecked: "2026-09-07"
  },
  {
    id: "gille-a118-2-adira-source", entityType: "helmet", entityId: "gille-a118-2-adira", role: "primary",
    src: "/media/helmets/gille-a118-2-adira.webp", sourceImageUrl: "https://kranosgears.com/cdn/shop/files/e1238cc0-d811-4843-b8a3-f14d979d5b84_1024x1024@2x.jpg?v=1753926972", alt: "Gille A118-2 Adira full-face motorcycle helmet in matte black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kranos Gears", sourceLabel: "Retailer-hosted product image reference · Gille A118-2 Adira", sourceUrl: "https://kranosgears.com/products/gille-a118-2-adira-matte-black-revo-red-lens-dual-visor-with-free-clear-lens", lastChecked: "2026-09-07"
  },
  {
    id: "gille-a5009-phoenix-source", entityType: "helmet", entityId: "gille-a5009-phoenix", role: "primary",
    src: "/media/helmets/gille-a5009-phoenix.webp", sourceImageUrl: "https://kranosgears.com/cdn/shop/files/60a4fc57-b765-49a2-982b-7b9ec6032f2a_1024x1024@2x.jpg?v=1741402561", alt: "Gille A5009 Phoenix full-face motorcycle helmet in gray", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kranos Gears", sourceLabel: "Retailer-hosted product image reference · Gille A5009 Phoenix", sourceUrl: "https://kranosgears.com/products/gille-a5009-phoenix-gray-revo-gold-lens-dual-visor", lastChecked: "2026-09-07"
  },
  {
    id: "gille-adira-eclipse-source", entityType: "helmet", entityId: "gille-adira-eclipse", role: "primary",
    src: "/media/helmets/gille-adira-eclipse.webp", sourceImageUrl: "https://kranosgears.com/cdn/shop/files/ad773ad1-d48e-4832-8481-6859b4884152_1024x1024@2x.jpg?v=1772777854", alt: "Gille Adira Eclipse full-face motorcycle helmet in matte black and red", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kranos Gears", sourceLabel: "Retailer-hosted product image reference · Gille Adira Eclipse", sourceUrl: "https://kranosgears.com/products/gille-adira-eclipse-matte-black-red-with-free-clear-lens-dual-visor", lastChecked: "2026-09-07"
  },
  {
    id: "sec-carbon-mamba-source", entityType: "helmet", entityId: "sec-carbon-mamba", role: "primary",
    src: "/media/helmets/sec-carbon-mamba.webp", sourceImageUrl: "https://secmotosupply.com/cdn/shop/products/FSEC-05143_2_28bdd3fb-ad86-4aac-a359-a52abeccc672_1024x1024.png?v=1681282945", alt: "SEC Carbon Mamba full-face motorcycle helmet in glossy carbon fibre", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "SEC Motosupply", sourceLabel: "Manufacturer/brand-hosted product image · SEC Carbon Mamba", sourceUrl: "https://secmotosupply.com/collections/helmets/products/i010207", lastChecked: "2026-09-07"
  },
  {
    id: "sec-carbon-chronos-source", entityType: "helmet", entityId: "sec-carbon-chronos", role: "primary",
    src: "/media/helmets/sec-carbon-chronos.webp", sourceImageUrl: "https://secmotosupply.com/cdn/shop/products/FSEC-05141_4_54dee8e4-4a9a-4f1c-b73e-4e987021f663_1024x1024.png?v=1665625157", alt: "SEC Carbon Chronos full-face motorcycle helmet in matte carbon fibre", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "SEC Motosupply", sourceLabel: "Manufacturer/brand-hosted product image · SEC Carbon Chronos", sourceUrl: "https://secmotosupply.com/collections/helmets/products/i010201", lastChecked: "2026-09-07"
  },
  {
    id: "sec-nomad-source", entityType: "helmet", entityId: "sec-nomad", role: "primary",
    src: "/media/helmets/sec-nomad.webp", sourceImageUrl: "https://secmotosupply.com/cdn/shop/products/ESEC-05157_2_1024x1024.png?v=1667546471", alt: "SEC Nomad full-face motorcycle helmet in solid carbon", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "SEC Motosupply", sourceLabel: "Manufacturer/brand-hosted product image · SEC Nomad", sourceUrl: "https://secmotosupply.com/collections/helmets/products/sec-nomad-solid-carbon", lastChecked: "2026-09-07"
  },
  {
    id: "sec-atmos-source", entityType: "helmet", entityId: "sec-atmos", role: "primary",
    src: "/media/helmets/sec-atmos.webp", sourceImageUrl: "https://secmotosupply.com/cdn/shop/files/DSEC-06410_ATMOS_SCORPIO_BLKGREYWHT_4d2d7918-b338-46b9-b9e1-9b0aff373f9c_1024x1024.jpg?v=1750927915", alt: "SEC ATMOS Scorpio modular motorcycle helmet in black, grey and white", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "SEC Motosupply", sourceLabel: "Manufacturer/brand-hosted product image · SEC ATMOS Scorpio", sourceUrl: "https://secmotosupply.com/collections/helmets/products/i014974", lastChecked: "2026-09-07"
  },
  {
    id: "sec-saga-source", entityType: "helmet", entityId: "sec-saga", role: "primary",
    src: "/media/helmets/sec-saga.webp", sourceImageUrl: "https://secmotosupply.com/cdn/shop/files/DSEC-05927_SAGA-BRAND_WHITE_PINK_ebcf1045-d5c8-4a1e-aa2d-fc3778657ba5_1024x1024.jpg?v=1750927892", alt: "SEC SAGA modular motorcycle helmet in white and pink", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "SEC Motosupply", sourceLabel: "Manufacturer/brand-hosted product image · SEC SAGA", sourceUrl: "https://secmotosupply.com/collections/helmets/products/i012918", lastChecked: "2026-09-07"
  },
  {
    id: "spyder-fury-official", entityType: "helmet", entityId: "spyder-fury-rapid-s8", role: "primary",
    src: "/media/helmets/spyder-fury-rapid-s8.webp", sourceImageUrl: "https://www.teamspyder.com/cdn/shop/files/A6504346800_1080x.png?v=1695957836", alt: "Spyder Fury Rapid S8 full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Team Spyder", sourceLabel: "Manufacturer/brand-hosted product image · Spyder Fury Rapid S8", sourceUrl: "https://www.teamspyder.com/products/spyder-fury-rapid-s8", lastChecked: "2026-08-25"
  },
  {
    id: "spyder-neo-ace-official", entityType: "helmet", entityId: "spyder-neo-ace", role: "primary",
    src: "/media/helmets/spyder-neo-ace.webp", sourceImageUrl: "https://www.teamspyder.com/cdn/shop/files/A6509674800_1080x.png?v=1712976331", alt: "Spyder Neo Ace motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Team Spyder", sourceLabel: "Manufacturer/brand-hosted product image · Spyder Neo Ace", sourceUrl: "https://www.teamspyder.com/products/neo-ace-plain-s0", lastChecked: "2026-08-25"
  },
  {
    id: "spyder-recon-official", entityType: "helmet", entityId: "spyder-recon-2", role: "primary",
    src: "/media/helmets/spyder-recon-2.webp", sourceImageUrl: "https://www.teamspyder.com/cdn/shop/products/IMG_8896800x800_6eb13817-3800-4a20-995f-59d0c8769c66_1080x.png?v=1647409363", alt: "Spyder Recon 2.0 full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Team Spyder", sourceLabel: "Manufacturer/brand-hosted product image · Spyder Recon 2.0", sourceUrl: "https://www.teamspyder.com/products/spyder-recon2-plain-a", lastChecked: "2026-08-25"
  },
  {
    id: "pirelli-angel-scooter-retailer", entityType: "tire", entityId: "pirelli-angel-scooter", role: "primary",
    src: "/media/tires/pirelli-angel-scooter.webp", sourceImageUrl: "https://cdn.awsli.com.br/437/437289/produto/367776089/pirelli_angel_scooter_03-8vb9neypda.jpg", alt: "Pirelli Angel Scooter motorcycle tire", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Retail product image host", sourceLabel: "Retailer-hosted product image reference · Pirelli Angel Scooter", sourceUrl: "https://www.pirelli.com/tyres/en-ww/motorcycle/catalogue/product/angel-scooter", lastChecked: "2026-08-25"
  },
  {
    id: "hnj-a119-kranos", entityType: "helmet", entityId: "hnj-a119", role: "primary",
    src: "/media/helmets/hnj-a119.webp", sourceImageUrl: "https://kranosgears.com/cdn/shop/files/d841f6d1-0788-4f93-8ce6-29e84718539f_1024x1024%402x.jpg?v=1737511807", alt: "HNJ A119 modular dual-visor motorcycle helmet in matte gray", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kranos Gears", sourceLabel: "Philippine retailer product image · HNJ A119", sourceUrl: "https://kranosgears.com/products/hnj-a119-matte-honda-gray-modular-dual-visor", lastChecked: "2026-08-26"
  },
  {
    id: "hnj-983-shopee", entityType: "helmet", entityId: "hnj-983", role: "primary",
    src: "/media/helmets/hnj-983.webp", sourceImageUrl: "https://down-ph.img.susercontent.com/file/ph-11134207-7rasf-mawi2airbrda2b", alt: "HNJ 983 full-face dual-visor motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Shopee Philippines seller listing", sourceLabel: "Current Philippine marketplace product image · HNJ 983", sourceUrl: "https://shopee.ph/HNJ-983-Motorcycle-Full-Face-Helmet-dual-visor-For-men-and-women-Black-Inner-Visor-i.556691608.29107359226", lastChecked: "2026-08-26"
  },
  {
    id: "shark-skwal-i3-rhad-reference", entityType: "helmet", entityId: "shark-skwal-i3-rhad", role: "primary",
    src: "/media/helmets/shark-skwal-i3-rhad.webp", sourceImageUrl: "https://platincdn.com/4004/pictures/HBEQP144653_shark-skwal-i3-rhad-kirmizi-beyaz-mavi.jpg", alt: "Shark SKWAL i3 Rhad full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Retail product image host", sourceLabel: "Product image reference · Shark SKWAL i3 Rhad", sourceUrl: "https://www.shark-helmets.com/en/products/skwal-i3-rhad-he0820ekua", lastChecked: "2026-08-26"
  },
  {
    id: "shark-spartan-gt-pro-carbon-dokhta-reference", entityType: "helmet", entityId: "shark-spartan-gt-pro-carbon-dokhta", role: "primary",
    src: "/media/helmets/shark-spartan-gt-pro-carbon-dokhta.webp", sourceImageUrl: "https://cdn.idealo.com/folder/Product/203309/6/203309651/s1_produktbild_max/shark-spartan-gt-pro-carbon-dokhta-black-white-orange.jpg", alt: "Shark Spartan GT Pro Carbon Dokhta full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Retail product image host", sourceLabel: "Product image reference · Shark Spartan GT Pro Carbon Dokhta", sourceUrl: "https://ridemanila.com/products/shark-spartan-gt-pro-carbon-dokhta", lastChecked: "2026-08-26"
  },
  {
    id: "mt-thunder-4-sv-shopee", entityType: "helmet", entityId: "mt-thunder-4-sv-pd-solid", role: "primary",
    src: "/media/helmets/mt-thunder-4-sv-pd-solid.webp", sourceImageUrl: "https://down-ph.img.susercontent.com/file/ph-11134207-7qul9-liqreelidufwee", alt: "MT Thunder 4 SV PD Solid full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Spyder Philippines Official on Shopee", sourceLabel: "Official Philippine marketplace product image · MT Thunder 4 SV", sourceUrl: "https://shopee.ph/MT-THUNDER-4-SV-PD-SOLID-Full-Face-Dual-Visor-Motorcycle-Helmet-ECE-CERTIFIED-Free-Clear-Visor-i.145958898.20881431496", lastChecked: "2026-08-26"
  },
  {
    id: "mt-atom-2-sv-shopee", entityType: "helmet", entityId: "mt-atom-2-sv-pd-pure", role: "primary",
    src: "/media/helmets/mt-atom-2-sv-pd-pure.webp", sourceImageUrl: "https://down-ph.img.susercontent.com/file/ph-11134207-820l5-mr9vbhels3yffc", alt: "MT Atom 2 SV PD Pure modular motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Spyder Philippines Official on Shopee", sourceLabel: "Official Philippine marketplace product image · MT Atom 2 SV", sourceUrl: "https://shopee.ph/NEW-RELEASE-MT-ATOM-2-SV-PD-PURE-Modular-Dual-Visor-Motorcycle-Helmet-ECE-CERTIFIED-i.145958898.46563835067", lastChecked: "2026-08-26"
  },
  {
    id: "bell-qualifier-dlx-mips-official", entityType: "helmet", entityId: "bell-qualifier-dlx-mips", role: "primary",
    src: "/media/helmets/bell-qualifier-dlx-mips.webp", sourceImageUrl: "https://vault.widen.net/content/8yj6ps773j?h=1500&w=1500", alt: "Bell Qualifier DLX MIPS full-face motorcycle helmet in matte black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bell Helmets", sourceLabel: "Brand-hosted product image · Bell Qualifier DLX MIPS", sourceUrl: "https://www.bellhelmets.com/product/ps-qualifier-dlx-mips-mat-blk-xs/BL-7081135.html", lastChecked: "2026-08-26"
  },
  {
    id: "bell-custom-500-shopee", entityType: "helmet", entityId: "bell-custom-500", role: "primary",
    src: "/media/helmets/bell-custom-500.webp", sourceImageUrl: "https://down-ph.img.susercontent.com/file/ph-11134207-7qul0-lh5mr1m97n3437", alt: "Bell Custom 500 open-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Philippine marketplace seller listing", sourceLabel: "Current Philippine marketplace product image · Bell Custom 500", sourceUrl: "https://shopee.ph/BELL-CUSTOM-500-For-Classic-Motorcycles-i.443450764.22143265549", lastChecked: "2026-08-26"
  },
  {
    id: "michelin-city-grip-2-reference", entityType: "tire", entityId: "michelin-city-grip-2", role: "primary",
    src: "/media/tires/michelin-city-grip-2.webp", sourceImageUrl: "https://easyr.com.au/cdn/shop/files/imgi_248_mo-105_3528704346608_tire_michelin_city-grip-2_150-slash-70-13-64s_a_main_4-90_nopad_90081228-e960-4a07-ab0c-38292cfe12b8.png?v=1782256513&width=1214", alt: "Michelin City Grip 2 scooter tire", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Retail product image host", sourceLabel: "Product image reference · Michelin City Grip 2", sourceUrl: "https://africa.michelin.com/en/motorbike/tyres/michelin-city-grip-2", lastChecked: "2026-08-26"
  },
  {
    id: "dunlop-scootsmart-reference", entityType: "tire", entityId: "dunlop-scootsmart", role: "primary",
    src: "/media/tires/dunlop-scootsmart.webp", sourceImageUrl: "https://tripleclampmoto.ca/cdn/shop/products/317380ScootsmartFrnt_1024x.jpg?v=1658595157", alt: "Dunlop ScootSmart scooter tire", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Retail product image host", sourceLabel: "Product image reference · Dunlop ScootSmart", sourceUrl: "https://www.dunlop.eu/nl_be/motorcycle/tires/scootsmart--scsmart.html", lastChecked: "2026-08-26"
  },
  {
    id: "givi-v58-maxia-5-retailer", entityType: "topbox", entityId: "givi-v58-maxia-5", role: "primary",
    src: "/media/top-boxes/givi-v58-maxia-5.webp", sourceImageUrl: "https://www.motoworld.com.ph/cdn/shop/files/GIVI_V58NNB_BLK_1.jpg", alt: "GIVI V58 Maxia 5 58-litre motorcycle top case in black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motoworld Philippines", sourceLabel: "Motoworld Philippines GIVI V58 Maxia 5 product image", sourceUrl: "https://www.motoworld.com.ph/collections/givi-top-boxes/products/givi-v58-maxia-5-topcase-mk-58l", lastChecked: "2026-09-04"
  },
  {
    id: "givi-trekker-dolomiti-30-retailer", entityType: "topbox", entityId: "givi-trekker-dolomiti-30", role: "primary",
    src: "/media/top-boxes/givi-trekker-dolomiti-30.webp", sourceImageUrl: "https://shop.motoworld.com.ph/cdn/shop/products/DLM30BTREKKERDOLOMITIMKTOPCASES-Black_2.jpg", alt: "GIVI Trekker Dolomiti 30-litre MONOKEY motorcycle top case", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motoworld Philippines", sourceLabel: "Motoworld Philippines GIVI Trekker Dolomiti product image", sourceUrl: "https://shop.motoworld.com.ph/collections/bags-amp-luggages-top-cases/products/givi-trekker-dolomiti-mk-top-cases-30ltr", lastChecked: "2026-09-04"
  },
  {
    id: "kyt-r1r-brand", entityType: "helmet", entityId: "kyt-r1r", role: "primary",
    src: "/media/helmets/kyt-r1r.webp", sourceImageUrl: "https://kytasia.com/wp-content/uploads/2025/11/R1R-CARBON_GLOSS.webp", alt: "KYT R1R full-face motorcycle helmet in carbon gloss", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "KYT Asia", sourceLabel: "KYT Asia official R1R product image", sourceUrl: "https://kytasia.com/r1r/", lastChecked: "2026-09-04"
  },
  {
    id: "kyt-nz-race-brand", entityType: "helmet", entityId: "kyt-nz-race", role: "primary",
    src: "/media/helmets/kyt-nz-race.webp", sourceImageUrl: "https://kytasia.com/wp-content/uploads/2023/01/NZ0016-nzrace.png", alt: "KYT NZ Race full-face racing motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "KYT Asia", sourceLabel: "KYT Asia official NZ Race product image", sourceUrl: "https://kytasia.com/nz-race/", lastChecked: "2026-09-04"
  },
  {
    id: "kyt-d-city-brand", entityType: "helmet", entityId: "kyt-d-city", role: "primary",
    src: "/media/helmets/kyt-d-city.webp", sourceImageUrl: "https://kytasia.com/wp-content/uploads/2024/09/Y6DC00W4-KYT-D-CITY-PLAIN-BLUE-METAL.webp", alt: "KYT D-City urban full-face motorcycle helmet in blue metal", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "KYT Asia", sourceLabel: "KYT Asia official D-City product image", sourceUrl: "https://kytasia.com/d-city/", lastChecked: "2026-09-04"
  },
  {
    id: "kyt-kx-1-race-gp-brand", entityType: "helmet", entityId: "kyt-kx-1-race-gp", role: "primary",
    src: "/media/helmets/kyt-kx-1-race-gp.webp", sourceImageUrl: "https://kytasia.com/wp-content/uploads/2025/08/enea2024-01.png", alt: "KYT KX-1 Race GP full-face racing motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "KYT Asia", sourceLabel: "KYT Asia official KX-1 Race GP product image", sourceUrl: "https://kytasia.com/kx-1-race-gp/", lastChecked: "2026-09-04"
  },
  {
    id: "kyt-ballistic-brand", entityType: "helmet", entityId: "kyt-ballistic", role: "primary",
    src: "/media/helmets/kyt-ballistic.webp", sourceImageUrl: "https://kytasia.com/wp-content/uploads/2024/06/ballistic-face-left.png", alt: "KYT Ballistic convertible city motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "KYT Asia", sourceLabel: "KYT Asia official Ballistic product image", sourceUrl: "https://kytasia.com/ballistic/", lastChecked: "2026-09-04"
  },
  {
    id: "kyt-ttr-jet-brand", entityType: "helmet", entityId: "kyt-ttr-jet", role: "primary",
    src: "/media/helmets/kyt-ttr-jet.webp", sourceImageUrl: "https://kytasia.com/wp-content/uploads/2023/11/ttr-jet1.webp", alt: "KYT TTR-Jet open-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "KYT Asia", sourceLabel: "KYT Asia official TTR-Jet product image", sourceUrl: "https://kytasia.com/ttr-jet/", lastChecked: "2026-09-04"
  },
  {
    id: "evo-m2-brand", entityType: "helmet", entityId: "evo-m2", role: "primary",
    src: "/media/helmets/evo-m2.webp", sourceImageUrl: "https://evohelmet.com/wp-content/uploads/2026/02/M2-GLOSSY-PEARL-WHITE-3-768x768.jpg", alt: "EVO M2 full-face motorcycle helmet in glossy pearl white", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "EVO Helmets", sourceLabel: "EVO Helmets official M2 product image", sourceUrl: "https://evohelmet.com/product/m2-mono-colors/", lastChecked: "2026-09-04"
  },
  {
    id: "evo-vxr-8000-brand", entityType: "helmet", entityId: "evo-vxr-8000", role: "primary",
    src: "/media/helmets/evo-vxr-8000.webp", sourceImageUrl: "https://evohelmet.com/wp-content/uploads/2026/01/VXR-8000-FRACTION-G-BLACK-BLUE-2-768x768.jpg", alt: "EVO VXR-8000 modular motorcycle helmet in black and blue", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "EVO Helmets", sourceLabel: "EVO Helmets official VXR-8000 product image", sourceUrl: "https://evohelmet.com/product/vxr-8000-fraction/", lastChecked: "2026-09-04"
  },
  {
    id: "evo-sr-09-brand", entityType: "helmet", entityId: "evo-sr-09", role: "primary",
    src: "/media/helmets/evo-sr-09.webp", sourceImageUrl: "https://evohelmet.com/wp-content/uploads/2025/10/SR-09-TATAKAI-BLACK-RED-1-768x768.jpg", alt: "EVO SR-09 full-face motorcycle helmet in black and red", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "EVO Helmets", sourceLabel: "EVO Helmets official SR-09 product image", sourceUrl: "https://evohelmet.com/product/sr-09-tatakai/", lastChecked: "2026-09-04"
  },
  {
    id: "evo-tr-x-brand", entityType: "helmet", entityId: "evo-tr-x", role: "primary",
    src: "/media/helmets/evo-tr-x.webp", sourceImageUrl: "https://evohelmet.com/wp-content/uploads/2025/09/TR-X-RAVINE-WHITE-TSC-3-768x768.jpg", alt: "EVO TR-X open-face motorcycle helmet in white", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "EVO Helmets", sourceLabel: "EVO Helmets official TR-X product image", sourceUrl: "https://evohelmet.com/product/tr-x-ravine/", lastChecked: "2026-09-04"
  },
  {
    id: "spyder-neo-icon-retailer", entityType: "helmet", entityId: "spyder-neo-icon", role: "primary",
    src: "/media/helmets/spyder-neo-icon.webp", sourceImageUrl: "https://www.teamspyder.com/cdn/shop/files/A6505795800_1200x.png", alt: "Spyder Neo Icon modular motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Team Spyder", sourceLabel: "Team Spyder official Neo Icon product image", sourceUrl: "https://www.teamspyder.com/products/neo-icon-plain", lastChecked: "2026-09-04"
  },
  {
    id: "spyder-neo-blade-retailer", entityType: "helmet", entityId: "spyder-neo-blade", role: "primary",
    src: "/media/helmets/spyder-neo-blade.webp", sourceImageUrl: "https://www.teamspyder.com/cdn/shop/files/A6505786800_1200x.png", alt: "Spyder Neo Blade open-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Team Spyder", sourceLabel: "Team Spyder official Neo Blade product image", sourceUrl: "https://www.teamspyder.com/products/neo-blade-plain", lastChecked: "2026-09-04"
  },
  {
    id: "spyder-reboot-2-retailer", entityType: "helmet", entityId: "spyder-reboot-2", role: "primary",
    src: "/media/helmets/spyder-reboot-2.webp", sourceImageUrl: "https://www.teamspyder.com/cdn/shop/files/A6500805800_1200x.png", alt: "Spyder Reboot 2.0 semi-jet motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Team Spyder", sourceLabel: "Team Spyder official Reboot 2.0 product image", sourceUrl: "https://www.teamspyder.com/products/spyder-reboot2-0-p-s0-v2", lastChecked: "2026-09-04"
  },
  {
    id: "givi-b32n-retailer", entityType: "topbox", entityId: "givi-b32n", role: "primary",
    src: "/media/top-boxes/givi-b32n.webp", sourceImageUrl: "https://data.outletmoto.eu/imgprodotto/givi-b32n-top-case-monolock-noir-32-litres_333784.jpg", alt: "GIVI B32N 32-liter motorcycle top box", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "OutletMoto", sourceLabel: "Retailer-hosted product image reference · GIVI B32N", sourceUrl: "https://www.outletmoto.eu/", lastChecked: "2026-08-25"
  },

  // v2.2.3 commerce imagery: every verified public gear product gets a real, model-specific product photo.
  {
    id: "zebra-atlas-2026-shopee", entityType: "helmet", entityId: "zebra-atlas-2026", role: "primary",
    src: "/media/helmets/zebra-atlas-2026.webp", sourceImageUrl: "https://down-ph.img.susercontent.com/file/ph-11134207-81zte-mgdmbmk5w6xa10", alt: "Zebra Atlas 2026 full-face motorcycle helmet in purple", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Zebra helmet seller listing on Shopee Philippines", sourceLabel: "Current Philippine marketplace product image · Zebra Atlas 2026", sourceUrl: "https://shopee.ph/ZEBRA-2026-ATLAS-Full-Face-Revo-Lens-Dual-Visor-Motorcycle-Helmet-i.503666958.29888594125", lastChecked: "2026-08-26"
  },
  {
    id: "zebra-a113-ritzy-kranos", entityType: "helmet", entityId: "zebra-a113-ritzy", role: "primary",
    src: "/media/helmets/zebra-a113-ritzy.webp", sourceImageUrl: "https://kranosgears.com/cdn/shop/files/f4805307-64d8-4440-b8e9-072f70cfdfd5_1024x1024%402x.jpg?v=1737013791", alt: "Zebra A113 Ritzy modular motorcycle helmet in matte black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kranos Gears", sourceLabel: "Philippine retailer product image · Zebra A113 Ritzy", sourceUrl: "https://kranosgears.com/products/zebra-a113-ritzy-matte-black-dual-visor-with-free-clear-lens", lastChecked: "2026-08-26"
  },
  {
    id: "zebra-alistair-2024-shopee", entityType: "helmet", entityId: "zebra-alistair-2024", role: "primary",
    src: "/media/helmets/zebra-alistair-2024.webp", sourceImageUrl: "https://down-ph.img.susercontent.com/file/ph-11134207-7rasc-m9tx53bcjnybcc", alt: "Zebra Alistair 2024 full-face motorcycle helmet in white", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Zebra helmet seller listing on Shopee Philippines", sourceLabel: "Current Philippine marketplace product image · Zebra Alistair 2024", sourceUrl: "https://shopee.ph/ZEBRA-2024-ALISTAIR-helmet-full-face-motorcycle-helmet-dual-visor-for-men-and-women-revo-visor-i.527108141.41200996769", lastChecked: "2026-08-26"
  },
  {
    id: "gille-883-falcon-gbrands", entityType: "helmet", entityId: "gille-883-falcon", role: "primary",
    src: "/media/helmets/gille-883-falcon.webp", sourceImageUrl: "https://gbrands.ph/wp-content/uploads/2023/08/Gille-883-Falcon-Superman-600x600.png", alt: "Gille 883 Falcon full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "GBrands Philippines", sourceLabel: "Philippine retailer product image · Gille 883 Falcon", sourceUrl: "https://gbrands.ph/shop/gille-883-falcon-superman/", lastChecked: "2026-08-25"
  },
  {
    id: "gille-astral-gbrands", entityType: "helmet", entityId: "gille-astral", role: "primary",
    src: "/media/helmets/gille-astral.webp", sourceImageUrl: "https://gbrands.ph/wp-content/uploads/2024/10/gille-astral-matte-light-grey-600x600.jpg", alt: "Gille Astral full-face motorcycle helmet in matte light gray", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "GBrands Philippines", sourceLabel: "Philippine retailer product image · Gille Astral", sourceUrl: "https://gbrands.ph/shop/gille-helmet-astral-matte-light-gray/", lastChecked: "2026-08-25"
  },
  {
    id: "gille-vertix-z501-kranos", entityType: "helmet", entityId: "gille-vertix-z501", role: "primary",
    src: "/media/helmets/gille-vertix-z501.webp", sourceImageUrl: "https://kranosgears.com/cdn/shop/files/fdf8e13a-5d16-4725-8fff-2d58735efd3c_1000x.jpg?v=1774334713", alt: "Gille ILM-Z501 Vertix modular motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kranos Gears", sourceLabel: "Philippine retailer product image · Gille ILM-Z501 Vertix", sourceUrl: "https://kranosgears.com/products/gille-ilm-z501-vertix-plain-gray-dual-visor", lastChecked: "2026-08-25"
  },
  {
    id: "evo-gt-pro-rr-official", entityType: "helmet", entityId: "evo-gt-pro-rr", role: "primary",
    src: "/media/helmets/evo-gt-pro-rr.webp", sourceImageUrl: "https://evohelmet.com/wp-content/uploads/2022/08/GT-PRO-RR.jpg", alt: "EVO GT-Pro RR full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "EVO Helmets", sourceLabel: "Brand-hosted product image · EVO GT-Pro RR", sourceUrl: "https://evohelmet.com/product/gt-pro-rr/", lastChecked: "2026-08-25"
  },
  {
    id: "evo-sr-x-mono-official", entityType: "helmet", entityId: "evo-sr-x-mono", role: "primary",
    src: "/media/helmets/evo-sr-x-mono.webp", sourceImageUrl: "https://evohelmet.com/wp-content/uploads/2024/10/Glip_XR-X_.jpg", alt: "EVO SR-X Mono Colors full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "EVO Helmets", sourceLabel: "Brand-hosted product image · EVO SR-X Mono Colors", sourceUrl: "https://evohelmet.com/product/s/", lastChecked: "2026-08-25"
  },
  {
    id: "evo-tourer-official", entityType: "helmet", entityId: "evo-tourer", role: "primary",
    src: "/media/helmets/evo-tourer.webp", sourceImageUrl: "https://evohelmet.com/wp-content/uploads/2026/01/TOURER_LINESHEET_1.jpg", alt: "EVO Tourer 180-degree flip modular motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "EVO Helmets", sourceLabel: "Brand-hosted product image · EVO Tourer", sourceUrl: "https://evohelmet.com/product/tourer-mono-color/", lastChecked: "2026-08-25"
  },
  {
    id: "sec-odyssey-official", entityType: "helmet", entityId: "sec-odyssey", role: "primary",
    src: "/media/helmets/sec-odyssey.webp", sourceImageUrl: "https://secmotosupply.com/cdn/shop/files/DSEC-06341_SEC_ODYSSEY_-_GLOSS_WHITE_2_9cffebdc-9d97-4df1-8532-0edce37facfe.jpg?v=1750927942", alt: "SEC Odyssey modular motorcycle helmet in gloss white", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "SEC Motosupply", sourceLabel: "Brand-store product image · SEC Odyssey", sourceUrl: "https://secmotosupply.com/products/i014787", lastChecked: "2026-08-25"
  },
  {
    id: "sec-breach-official", entityType: "helmet", entityId: "sec-breach", role: "primary",
    src: "/media/helmets/sec-breach.webp", sourceImageUrl: "https://secmotosupply.com/cdn/shop/products/DSEC-04927_1.png?v=1665650210", alt: "SEC Breach full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "SEC Motosupply", sourceLabel: "Brand-store product image · SEC Breach", sourceUrl: "https://secmotosupply.com/products/i009686", lastChecked: "2026-08-25"
  },
  {
    id: "sec-pilot-2025-official", entityType: "helmet", entityId: "sec-pilot-2025", role: "primary",
    src: "/media/helmets/sec-pilot-2025.webp", sourceImageUrl: "https://secmotosupply.com/cdn/shop/files/DSEC-06641_SEC_PILOT_2025_WHITE_BLACK_GLOSS_2_4ffcb751-0f62-441f-8c0d-883cbfe880c1.jpg?v=1750927998", alt: "SEC Pilot 2025 modular motorcycle helmet in white and black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "SEC Motosupply", sourceLabel: "Brand-store product image · SEC Pilot 2025", sourceUrl: "https://secmotosupply.com/products/i015669", lastChecked: "2026-08-25"
  },
  {
    id: "rook-v152-mono-teamgraphitee", entityType: "helmet", entityId: "rook-v152-mono", role: "primary",
    src: "/media/helmets/rook-v152-mono.webp", sourceImageUrl: "https://teamgraphitee.com/wp-content/uploads/2024/01/sg-11134201-23010-xdiwqrqzadmvd7.jpeg", alt: "Rook V152 Mono full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Team Graphitee", sourceLabel: "Philippine retailer product image · Rook V152 Mono", sourceUrl: "https://teamgraphitee.com/shop/rook-v152-mono-colors/", lastChecked: "2026-08-25"
  },
  {
    id: "hjc-c10-tenplus", entityType: "helmet", entityId: "hjc-c10", role: "primary",
    src: "/media/helmets/hjc-c10.webp", sourceImageUrl: "https://www.tenplus.ph/cdn/shop/files/C10_Semi_Flat_Black.png?v=1782720770&width=1000", alt: "HJC C10 full-face motorcycle helmet in semi-flat black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "TenPlus Philippines", sourceLabel: "Philippine retailer product image · HJC C10", sourceUrl: "https://www.tenplus.ph/products/hjc-helmets-c10-flatblack", lastChecked: "2026-08-25"
  },
  {
    id: "hjc-i71-tenplus", entityType: "helmet", entityId: "hjc-i71", role: "primary",
    src: "/media/helmets/hjc-i71.webp", sourceImageUrl: "https://www.tenplus.ph/cdn/shop/files/i71_Flat_Black.jpg?v=1785064169&width=1000", alt: "HJC i71 full-face motorcycle helmet in flat black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "TenPlus Philippines", sourceLabel: "Philippine retailer product image · HJC i71", sourceUrl: "https://www.tenplus.ph/products/hjc-helmets-i71-flat-black", lastChecked: "2026-08-25"
  },
  {
    id: "hjc-i31-tenplus", entityType: "helmet", entityId: "hjc-i31", role: "primary",
    src: "/media/helmets/hjc-i31.webp", sourceImageUrl: "https://www.tenplus.ph/cdn/shop/files/APEXLAZADABOX2-2026-06-29T151353.339.png?v=1782717241&width=1000", alt: "HJC i31 open-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "TenPlus Philippines", sourceLabel: "Philippine retailer product image · HJC i31", sourceUrl: "https://www.tenplus.ph/products/hjc-helmets-i31-semiflatblack", lastChecked: "2026-08-25"
  },
  {
    id: "agv-k1-s-official", entityType: "helmet", entityId: "agv-k1-s", role: "primary",
    src: "/media/helmets/agv-k1-s.webp", sourceImageUrl: "https://dainese-cdn.thron.com/api/v1/content-delivery/shares/lxnwxt/contents/109ffa08-12a3-4892-a55e-b5b6a5c1c2c9/image/image?format=webp&h=450&q_auto=high&w=450", alt: "AGV K1 S full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "AGV", sourceLabel: "Official AGV product image · K1 S", sourceUrl: "https://www.agv.com/us/en/k1-s.html", lastChecked: "2026-08-25"
  },
  {
    id: "agv-k3-motoworld", entityType: "helmet", entityId: "agv-k3", role: "primary",
    src: "/media/helmets/agv-k3.webp", sourceImageUrl: "https://www.motoworld.com.ph/cdn/shop/files/AGV_K3_Striga.jpg?v=1756284976&width=640", alt: "AGV K3 full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motoworld Philippines", sourceLabel: "Philippine retailer product image · AGV K3", sourceUrl: "https://www.motoworld.com.ph/products/agv-k3-mono-helmet", lastChecked: "2026-08-25"
  },
  {
    id: "agv-k6-s-official", entityType: "helmet", entityId: "agv-k6-s", role: "primary",
    src: "/media/helmets/agv-k6-s.webp", sourceImageUrl: "https://dainese-cdn.thron.com/api/v1/content-delivery/shares/lxnwxt/contents/fc1dedcb-9410-43e6-a813-87e79c3859af/image/image?format=webp&h=450&q_auto=high&w=450", alt: "AGV K6 S full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "AGV", sourceLabel: "Official AGV product image · K6 S", sourceUrl: "https://www.agv.com/ee/en/k6-s.html", lastChecked: "2026-08-25"
  },
  {
    id: "agv-eteres-motoworld", entityType: "helmet", entityId: "agv-eteres", role: "primary",
    src: "/media/helmets/agv-eteres.webp", sourceImageUrl: "https://www.motoworld.com.ph/cdn/shop/files/AGV_ETERES_WHT_3.jpg?v=1752658003&width=640", alt: "AGV Eteres open-face motorcycle helmet in white", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motoworld Philippines", sourceLabel: "Philippine retailer product image · AGV Eteres", sourceUrl: "https://www.motoworld.com.ph/products/agv-eteres-mono-motorcycle-open-face-helmet", lastChecked: "2026-08-25"
  },
  {
    id: "agv-streetmodular-motoworld", entityType: "helmet", entityId: "agv-streetmodular", role: "primary",
    src: "/media/helmets/agv-streetmodular.webp", sourceImageUrl: "https://www.motoworld.com.ph/cdn/shop/files/AGV_Streetmodular_Resia_Matte_black_Gray.jpg?v=1755508384&width=640", alt: "AGV Streetmodular motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motoworld Philippines", sourceLabel: "Philippine retailer product image · AGV Streetmodular", sourceUrl: "https://www.motoworld.com.ph/products/agv-streetmodular-full-face-helmet", lastChecked: "2026-08-25"
  },
  {
    id: "arai-rapide-neo-motoman", entityType: "helmet", entityId: "arai-rapide-neo", role: "primary",
    src: "/media/helmets/arai-rapide-neo.webp", sourceImageUrl: "https://shopmotoman.com/cdn/shop/files/IMG-5131.jpg?v=1787537177&width=416", alt: "Arai Rapide Neo full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motoman Philippines", sourceLabel: "Philippine retailer product image · Arai Rapide Neo", sourceUrl: "https://shopmotoman.com/products/arai-rapide-neo", lastChecked: "2026-08-25"
  },
  {
    id: "arai-tour-cross-v-motoman", entityType: "helmet", entityId: "arai-tour-cross-v", role: "primary",
    src: "/media/helmets/arai-tour-cross-v.webp", sourceImageUrl: "https://shopmotoman.com/cdn/shop/files/71RulW2iCjL._AC_SL1500.jpg?v=1706329043&width=1946", alt: "Arai Tour Cross V adventure motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motoman Philippines", sourceLabel: "Philippine retailer product image · Arai Tour Cross V", sourceUrl: "https://shopmotoman.com/products/arai-tour-cross-v-alumina-silver", lastChecked: "2026-08-25"
  },
  {
    id: "shoei-nxr2-official", entityType: "helmet", entityId: "shoei-nxr2", role: "primary",
    src: "/media/helmets/shoei-nxr2.webp", sourceImageUrl: "https://www.shoei-europe.com/wp-content/uploads/2021/04/shoei_nxr2_product_3er_side_700x800-700x800.png", alt: "Shoei NXR2 full-face motorcycle helmet", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Shoei Europe", sourceLabel: "Official Shoei product image · NXR2", sourceUrl: "https://www.shoei-europe.com/products/nxr2/", lastChecked: "2026-08-25"
  },
  // Motorcycle brand-hub media expansion — checked 2026-09-08.
  {
    id:"aprilia-sr-gt-200-editorial", entityType:"motorcycle", entityId:"aprilia-sr-gt-200", role:"primary",
    src:"https://www.motofichas.com/images/phocagallery/Aprilia/sr-gt/01-aprilia-sr-gt-2022-estudio-azul-01.jpg", alt:"Aprilia SR GT 200 scooter in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Motofichas", sourceLabel:"Editorial product image · Aprilia SR GT 200", sourceUrl:"https://foromotos.net/threads/ficha-t%C3%A9cnica-aprilia-sr-gt-200-2022-2024.11827/", lastChecked:"2026-09-08"
  },
  {
    id:"aprilia-rs-457-editorial", entityType:"motorcycle", entityId:"aprilia-rs-457", role:"primary",
    src:"https://www.ginzinger.at/images/djmediatools/843-aprilia-rs-457-studio/01_1.jpeg", alt:"Aprilia RS 457 sport motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Ginzinger", sourceLabel:"Dealer/editorial product image · Aprilia RS 457", sourceUrl:"https://www.ginzinger.at/blog/aprilia/rs-457.html", lastChecked:"2026-09-08"
  },
  {
    id:"benelli-180s-editorial", entityType:"motorcycle", entityId:"benelli-180s", role:"primary",
    src:"https://globalgo-catalogo.s3.amazonaws.com/BEN180S-GALERIA-1.webp", alt:"Benelli 180S naked motorcycle product view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"GlobalGo", sourceLabel:"Dealer product image · Benelli 180S", sourceUrl:"https://www.globalgo.com.pe/motos/BEN-180S/", lastChecked:"2026-09-08"
  },
  {
    id:"benelli-trk-502x-editorial", entityType:"motorcycle", entityId:"benelli-trk-502x", role:"primary",
    src:"https://d1uzk9o9cg136f.cloudfront.net/f/16782548/rc/2024/12/13/e7b4a0a0bd97eb40025afa4e32c7b896fb3151c1_xlarge.jpg", alt:"Benelli TRK 502X adventure motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"web AutoBy", sourceLabel:"Editorial product image · Benelli TRK 502X", sourceUrl:"https://www.autoby.jp/_ct/17738653/album/16827695", lastChecked:"2026-09-08"
  },
  {
    id:"bmw-g-310-gs-editorial", entityType:"motorcycle", entityId:"bmw-g-310-gs", role:"primary",
    src:"https://next-moto.com/products/682/images/bmw-g310gs-2023-682-1718898487.webp", alt:"BMW G 310 GS motorcycle product photo", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Next Moto", sourceLabel:"Motorcycle listing image · BMW G 310 GS", sourceUrl:"https://next-moto.com/bmw", lastChecked:"2026-09-08"
  },
  {
    id:"bmw-c-400-gt-editorial", entityType:"motorcycle", entityId:"bmw-c-400-gt", role:"primary",
    src:"https://www.bmwpap.gr/image/cache/data/product/BMW/2024/C%20400%20GT/P90512322_lowRes_bmw-c-400-gt-my-2024-1-1-2-1400x1200.jpg", alt:"BMW C 400 GT maxi scooter in studio view", width:1400, height:1200,
    rightsStatus:"external-reference", rightsHolder:"BMW Papadopoulos", sourceLabel:"BMW dealer product image · C 400 GT", sourceUrl:"https://www.bmwpap.gr/", lastChecked:"2026-09-08"
  },
  {
    id:"bristol-adx-160-official", entityType:"motorcycle", entityId:"bristol-adx-160", role:"primary",
    src:"https://static.wixstatic.com/media/fc6fc6_3b3250017dc649ce9b52af2c2b95c556~mv2.png/v1/fill/w_570%2Ch_398%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/white.png", alt:"Bristol ADX 160 scooter product image", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Bristol Motorcycles Philippines", sourceLabel:"Manufacturer product image · Bristol ADX 160", sourceUrl:"https://www.bristol-motorcycles.com/adx160", lastChecked:"2026-09-08"
  },
  {
    id:"bristol-maxie-400-editorial", entityType:"motorcycle", entityId:"bristol-maxie-400", role:"primary",
    src:"https://imgcdn.zigwheels.ph/large/gallery/color/128/3117/bristol-maxie-400-color-293352.jpg", alt:"Bristol Maxie 400 maxi scooter product image", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Zigwheels Philippines", sourceLabel:"Philippine catalog image · Bristol Maxie 400", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/bristol/maxie-400/colors", lastChecked:"2026-09-08"
  },
  {
    id:"cfmoto-450mt-editorial", entityType:"motorcycle", entityId:"cfmoto-450mt", role:"primary",
    src:"https://www.philharmonicmoto.com/wp-content/uploads/2024/04/cfmoto-450mt_tundra-grey_left-45-copy-1024x763.jpg", alt:"CFMOTO 450MT adventure motorcycle in Tundra Grey", width:1024, height:763,
    rightsStatus:"external-reference", rightsHolder:"PhilharmonicMoto", sourceLabel:"Editorial product image · CFMOTO 450MT", sourceUrl:"https://www.philharmonicmoto.com/product/cfmoto-450mt-2024/", lastChecked:"2026-09-08"
  },
  {
    id:"cfmoto-450sr-editorial", entityType:"motorcycle", entityId:"cfmoto-450sr", role:"primary",
    src:"https://www.motorrad-bilder.at/slideshows/291/021705/CFMOTO_450SR_StudioRight45_ZirconBlack.jpg", alt:"CFMOTO 450SR sport motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Motorrad Bilder", sourceLabel:"Editorial product image · CFMOTO 450SR", sourceUrl:"https://www.1000ps.at/motorrad-bilder-detail-cfmoto-motorrad-modelle-und-neuheiten-2023-21705", lastChecked:"2026-09-08"
  },
  {
    id:"ducati-monster-937-plus-editorial", entityType:"motorcycle", entityId:"ducati-monster-937-plus", role:"primary",
    src:"https://img2.stcrm.it/images/23721531/HOR_STD/1000x/my21-ducati-monster-plus-1-uc214632-mid.jpg", alt:"Ducati Monster 937 Plus naked motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Moto.it", sourceLabel:"Editorial product image · Ducati Monster Plus", sourceUrl:"https://www.moto.it/listino/ducati/monster-937/monster-937-plus-2021/dQ0yxQ", lastChecked:"2026-09-08"
  },
  {
    id:"ducati-scrambler-nightshift-editorial", entityType:"motorcycle", entityId:"ducati-scrambler-nightshift", role:"primary",
    src:"https://bxrepsol.s3.eu-west-1.amazonaws.com/static/2023/08/01042843/Foto-8-Ducati-Scrambler-Nighshift-1024x819.jpg", alt:"Ducati Scrambler Nightshift motorcycle in studio view", width:1024, height:819,
    rightsStatus:"external-reference", rightsHolder:"Box Repsol", sourceLabel:"Editorial product image · Ducati Scrambler Nightshift", sourceUrl:"https://www.boxrepsol.com/es/vive-tu-moto/motos-scrambler-cuales-son-y-sus-caracteristicas-principales/", lastChecked:"2026-09-08"
  },
  {
    id:"husqvarna-svartpilen-401-editorial", entityType:"motorcycle", entityId:"husqvarna-svartpilen-401", role:"primary",
    src:"https://next-moto.com/products/873/images/husqvarna-svartpilen-401-2023-873-1746647954.webp", alt:"Husqvarna Svartpilen 401 motorcycle product photo", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Next Moto", sourceLabel:"Motorcycle listing image · Husqvarna Svartpilen 401", sourceUrl:"https://next-moto.com/comprar-moto-ocasion", lastChecked:"2026-09-08"
  },
  {
    id:"husqvarna-vitpilen-401-editorial", entityType:"motorcycle", entityId:"husqvarna-vitpilen-401", role:"primary",
    src:"https://images5.1000ps.net/images_bikekat/2023/42-Husqvarna/8781-Vitpilen_401/004-638098127752526346-husqvarna-vitpilen-401.jpg?bgcolor=rgba_39_42_44_0&format=webp&height=834&mode=pad&quality=80&scale=both&trim.percentpadding=1&trim.threshold=80&width=1182", alt:"Husqvarna Vitpilen 401 2023 motorcycle in studio view", width:1182, height:834,
    rightsStatus:"external-reference", rightsHolder:"1000PS", sourceLabel:"Editorial product image · Husqvarna Vitpilen 401", sourceUrl:"https://www.1000ps.com/en-gb/comparison/491398/bmw-f-450-gs-2026-vs-husqvarna-vitpilen-401-2023", lastChecked:"2026-09-08"
  },
  {
    id:"ktm-390-duke-official", entityType:"motorcycle", entityId:"ktm-390-duke", role:"primary",
    src:"https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_PERS_REVO_MY23-KTM-390-DUKE--45-degree-front-right---INDIA-CTG--LIQUID-METAL-India-CTG_%23SALL_%23AEPI_%23V1.png", alt:"KTM 390 Duke 2023 motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"KTM", sourceLabel:"Manufacturer product image · KTM 390 Duke", sourceUrl:"https://www.ktm.com/en-my/models/naked-bike/2023-ktm-390-duke.html", lastChecked:"2026-09-08"
  },
  {
    id:"ktm-390-adventure-editorial", entityType:"motorcycle", entityId:"ktm-390-adventure", role:"primary",
    src:"https://images5.1000ps.net/images_bikekat/2023/1-KTM/9529-390_Adventure/009-638108438206018074-ktm-390-adventure.jpg", alt:"KTM 390 Adventure 2023 motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"1000PS", sourceLabel:"Editorial product image · KTM 390 Adventure", sourceUrl:"https://www.1000ps.de/motorradvergleich-ktm-390-adventure-2023-vs-ktm-690-enduro-r-2020-448389", lastChecked:"2026-09-08"
  },
  {
    id:"kymco-like-150i-editorial", entityType:"motorcycle", entityId:"kymco-like-150i-abs", role:"primary",
    src:"https://cdn.accentuate.io/9517636616493/1732219160890/slide-7-%281%29.jpg?v=1732219160890", alt:"Kymco Like 150i ABS scooter product image", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"The Scooter King", sourceLabel:"Dealer product image · Kymco Like 150i ABS", sourceUrl:"https://thescooterking.com/products/2025-kymco-like-150i-abs", lastChecked:"2026-09-08"
  },
  {
    id:"kymco-krv-180i-editorial", entityType:"motorcycle", entityId:"kymco-krv-180i-tcs", role:"primary",
    src:"https://imgcdn.zigwheels.ph/large/gallery/exterior/76/2913/kymco-krv-180i-tcs-slant-rear-view-full-image-709623.jpg", alt:"Kymco KRV 180i TCS scooter product image", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Zigwheels Philippines", sourceLabel:"Philippine catalog image · Kymco KRV 180i TCS", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/kymco/krv-180i-tcs/colors", lastChecked:"2026-09-08"
  },
  {
    id:"motorstar-cafe-400-editorial", entityType:"motorcycle", entityId:"motorstar-cafe-400", role:"primary",
    src:"https://imgcdn.zigwheels.ph/large/gallery/exterior/78/1899/motorstar-cafe-400-marketing-image-145459.jpg", alt:"MotorStar Cafe 400 motorcycle product image", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Zigwheels Philippines", sourceLabel:"Philippine catalog image · MotorStar Cafe 400", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/motorstar/cafe-400", lastChecked:"2026-09-08"
  },
  {
    id:"motorstar-xplorer-250r-editorial", entityType:"motorcycle", entityId:"motorstar-xplorer-250r", role:"primary",
    src:"https://imgcdn.zigwheels.ph/large/gallery/exterior/78/1034/motorstar-xplorer-250r-left-side-view-full-image-723608.jpg", alt:"MotorStar Xplorer 250R adventure motorcycle product image", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Zigwheels Philippines", sourceLabel:"Philippine catalog image · MotorStar Xplorer 250R", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/motorstar/xplorer-250r/images", lastChecked:"2026-09-08"
  },
  {
    id:"royal-enfield-hunter-350-editorial", entityType:"motorcycle", entityId:"royal-enfield-hunter-350", role:"primary",
    src:"https://img.autocarindia.com/Galleries/20250812032243_1%20_31_.jpg", alt:"Royal Enfield Hunter 350 motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Autocar India", sourceLabel:"Editorial product image · Royal Enfield Hunter 350", sourceUrl:"https://www.autocarindia.com/auto-images/royal-enfield-hunter-350-colours-image-gallery-436617", lastChecked:"2026-09-08"
  },
  {
    id:"royal-enfield-himalayan-450-editorial", entityType:"motorcycle", entityId:"royal-enfield-himalayan-450", role:"primary",
    src:"https://www.motociclismo.es/uploads/s1/12/66/35/31/royal-enfield-himalayan-450-2024-estudio-1.jpeg", alt:"Royal Enfield Himalayan 450 adventure motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Motociclismo", sourceLabel:"Editorial product image · Royal Enfield Himalayan 450", sourceUrl:"https://www.motociclismo.es/fotos-royal-enfield-himalayan-450_70411_113.html", lastChecked:"2026-09-08"
  },
  {
    id:"rusi-rfi-175-editorial", entityType:"motorcycle", entityId:"rusi-rfi-175", role:"primary",
    src:"https://www.kamote.ph/cdn-cgi/image/lossless%3Dtrue%2Cw%3D800%2Ch%3D800%2Cf%3Dwebp%2Cfit%3Dcontain/https%3A/www.kamote.ph/Gallery/Rusi/RFI_175.webp", alt:"Rusi RFI 175 scooter product image", width:800, height:800,
    rightsStatus:"external-reference", rightsHolder:"Kamote.ph", sourceLabel:"Philippine catalog image · Rusi RFI 175", sourceUrl:"https://www.kamote.ph/motorcycle/rusi-rfi-175", lastChecked:"2026-09-08"
  },
  {
    id:"rusi-classic-250i-editorial", entityType:"motorcycle", entityId:"rusi-classic-250i", role:"primary",
    src:"https://www.kamote.ph/cdn-cgi/image/lossless%3Dtrue%2Cw%3D800%2Ch%3D800%2Cf%3Dwebp%2Cfit%3Dcontain/https%3A/www.kamote.ph/Gallery/Rusi/Classic_250i.webp", alt:"Rusi Classic 250i motorcycle product image", width:800, height:800,
    rightsStatus:"external-reference", rightsHolder:"Kamote.ph", sourceLabel:"Philippine catalog image · Rusi Classic 250i", sourceUrl:"https://www.kamote.ph/motorcycle/rusi-classic-250i", lastChecked:"2026-09-08"
  },
  {
    id:"sym-jet-x150-editorial", entityType:"motorcycle", entityId:"sym-jet-x150", role:"primary",
    src:"https://static.wixstatic.com/media/97f6bd_7fc1c2558c4d4bb29444f1404b58db9f~mv2.jpg/v1/fill/w_1400%2Ch_1235%2Cal_c/97f6bd_7fc1c2558c4d4bb29444f1404b58db9f~mv2.jpg", alt:"SYM Jet X150 scooter product image", width:1400, height:1235,
    rightsStatus:"external-reference", rightsHolder:"AA Perfectionist", sourceLabel:"Editorial product image · SYM Jet X", sourceUrl:"https://www.aapefi.com/post/sym-issues-voluntary-recall-for-2024-2025-fnx-and-jet-models-over-fuel-pump-concerns", lastChecked:"2026-09-08"
  },
  {
    id:"sym-cruisym-150-editorial", entityType:"motorcycle", entityId:"sym-cruisym-150", role:"primary",
    src:"https://www.xsmt.com/upload/202302/06/202302061424135456.png", alt:"SYM Cruisym 150 scooter product image", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"XSMT", sourceLabel:"Motorcycle catalog image · SYM Cruisym 150", sourceUrl:"https://www.xsmt.com/product/show-4288.html", lastChecked:"2026-09-08"
  },
  {
    id:"triumph-speed-400-editorial", entityType:"motorcycle", entityId:"triumph-speed-400", role:"primary",
    src:"https://carroemotos.com.br/wp-content/uploads/2023/06/Speed-400_MY24_Phantom-Black_AngleRHS.jpg", alt:"Triumph Speed 400 motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Carro e Motos", sourceLabel:"Editorial product image · Triumph Speed 400", sourceUrl:"https://carroemotos.com.br/triumph-launches-two-new-400cc-motorcycles-see-photos-video-and-technical-sheet/", lastChecked:"2026-09-08"
  },
  {
    id:"triumph-scrambler-400-x-editorial", entityType:"motorcycle", entityId:"triumph-scrambler-400-x", role:"primary",
    src:"https://www.motociclismo.es/uploads/s1/12/16/83/24/triumph-speed400andscrambler400x-studio-06_7_1200x690.jpeg", alt:"Triumph Scrambler 400 X motorcycle in studio view", width:1200, height:690,
    rightsStatus:"external-reference", rightsHolder:"Motociclismo", sourceLabel:"Editorial product image · Triumph Scrambler 400 X", sourceUrl:"https://www.motociclismo.es/novedades/triumph-speed-scrambler-400-x-nueva-categoria_278903_102.html", lastChecked:"2026-09-08"
  },
  {
    id:"vespa-primavera-150-editorial", entityType:"motorcycle", entityId:"vespa-primavera-150", role:"primary",
    src:"https://cdn.dealerspike.com/imglib/v1/800x600/imglib/Assets/Inventory/63/C4/63C4AFF1-3775-4831-A49C-B8C5C5FBB69F.jpg", alt:"Vespa Primavera 150 scooter product image", width:800, height:600,
    rightsStatus:"external-reference", rightsHolder:"Rahal Piaggio", sourceLabel:"Dealer product image · Vespa Primavera 150", sourceUrl:"https://www.rahalpiaggio.com/New-Inventory-2025-Vespa-Motorcycle-Scooter-Primavera-150-Rahal-Piaggio-17164839", lastChecked:"2026-09-08"
  },
  {
    id:"vespa-sprint-150-editorial", entityType:"motorcycle", entityId:"vespa-sprint-150", role:"primary",
    src:"https://img.autofun.co.th/file/1e92114c8163401598ae43327f996ac2.jpg", alt:"Vespa Sprint 150 scooter product image", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"AutoFun", sourceLabel:"Editorial product image · Vespa Sprint 150", sourceUrl:"https://www.autofun.co.th/motorcycles/vespa/sprint-150-i-get", lastChecked:"2026-09-08"
  },

  // Images for the additional models added in this expansion.
  {
    id:"bmw-g-310-r-editorial", entityType:"motorcycle", entityId:"bmw-g-310-r", role:"primary",
    src:"https://images.motoren-toerisme.be/2022-12/2023_bmw_g310r_01.jpg?auto=format%2Ccompres&fill=solid&fit=fill&h=880&ixlib=php-1.1.0&q=75&s=91ebbd52059cc95d08c4ba0881001f90&w=1320", alt:"BMW G 310 R 2023 motorcycle in studio view", width:1320, height:880,
    rightsStatus:"external-reference", rightsHolder:"Motoren & Toerisme", sourceLabel:"Editorial product image · BMW G 310 R", sourceUrl:"https://www.motoren-toerisme.be/motoren/bmw-g-310-r-2023", lastChecked:"2026-09-08"
  },
  {
    id:"bmw-r-1300-gs-editorial", entityType:"motorcycle", entityId:"bmw-r-1300-gs", role:"primary",
    src:"https://www.carolenash.com/images/librariesprovider6/blog-posts/bmw_r1300g_studio.jpg?sfvrsn=bca8efd6_1", alt:"BMW R 1300 GS adventure motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Carole Nash", sourceLabel:"Editorial product image · BMW R 1300 GS", sourceUrl:"https://www.carolenash.com/news/classic-car-events/detail/reviewed--bmw-r-1300-gs", lastChecked:"2026-09-08"
  },
  {
    id:"cfmoto-450nk-editorial", entityType:"motorcycle", entityId:"cfmoto-450nk", role:"primary",
    src:"https://motowind.net/wp-content/uploads/450NK-Studio1.jpg", alt:"CFMOTO 450NK naked motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"MotoWind", sourceLabel:"Editorial product image · CFMOTO 450NK", sourceUrl:"https://motowind.net/450nk-studio1/", lastChecked:"2026-09-08"
  },
  {
    id:"cfmoto-675sr-r-editorial", entityType:"motorcycle", entityId:"cfmoto-675sr-r", role:"primary",
    src:"https://editorial.pxcrush.net/bikesales/general/editorial/450549396_780089797612891_7871008111732329732_n.jpg?height=682&width=1024", alt:"CFMOTO 675SR-R sport motorcycle product image", width:1024, height:682,
    rightsStatus:"external-reference", rightsHolder:"Bikesales", sourceLabel:"Editorial product image · CFMOTO 675SR-R", sourceUrl:"https://www.bikesales.com.au/editorial/details/cfmoto-675sr-r-triple-is-coming-soon-146944/", lastChecked:"2026-09-08"
  },
  {
    id:"triumph-trident-660-editorial", entityType:"motorcycle", entityId:"triumph-trident-660", role:"primary",
    src:"https://www.motociclismo.es/uploads/s1/13/69/71/62/triumph-trident-660-2025-estudio-2.jpeg", alt:"Triumph Trident 660 2025 motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Motociclismo", sourceLabel:"Editorial product image · Triumph Trident 660", sourceUrl:"https://www.motociclismo.es/fotos-triumph-trident-660-2025_71379_113.html", lastChecked:"2026-09-08"
  },
  {
    id:"triumph-street-triple-765-rs-editorial", entityType:"motorcycle", entityId:"triumph-street-triple-765-rs", role:"primary",
    src:"https://images5.1000ps.net/g-000343-g_W3430656-triumph-street-triple-765-rs-639017335950495280.jpg", alt:"Triumph Street Triple 765 RS motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"1000PS dealer network", sourceLabel:"Dealer product image · Triumph Street Triple 765 RS", sourceUrl:"https://kawasaki.moto-shop-gera.de/de/neufahrzeug-triumph-street-triple-765-rs-3430656", lastChecked:"2026-09-08"
  },
  {
    id:"royal-enfield-guerrilla-450-editorial", entityType:"motorcycle", entityId:"royal-enfield-guerrilla-450", role:"primary",
    src:"https://images5.1000ps.net/images_bikekat/2025/15-Royal_Enfield/12583-Guerrilla_450/006-638783978103498301-royal-enfield-guerrilla-450.jpg?format=webp&height=566&mode=crop&width=920", alt:"Royal Enfield Guerrilla 450 motorcycle in studio view", width:920, height:566,
    rightsStatus:"external-reference", rightsHolder:"1000PS dealer network", sourceLabel:"Dealer product image · Royal Enfield Guerrilla 450", sourceUrl:"https://www.royal-enfield-sachsen.com/de/motorrad-modell-royal-enfield-guerrilla-450-12583-2025", lastChecked:"2026-09-08"
  },
  {
    id:"royal-enfield-classic-350-editorial", entityType:"motorcycle", entityId:"royal-enfield-classic-350", role:"primary",
    src:"https://images.caradisiac.com/images/1/7/4/4/191744/S0-royal-enfield-classic-350-la-renaissance-d-un-mythe-688471.jpg", alt:"Royal Enfield Classic 350 motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Caradisiac", sourceLabel:"Editorial product image · Royal Enfield Classic 350", sourceUrl:"https://www.caradisiac.com/royal-enfield-classic-350-la-renaissance-d-un-mythe-191744.htm", lastChecked:"2026-09-08"
  },
  {
    id:"vespa-gts-supersport-300-editorial", entityType:"motorcycle", entityId:"vespa-gts-supersport-300", role:"primary",
    src:"https://www.goobike.com/newbike/material/img/model/836_Vespa_GTS_Supersport300_2025_blue.jpg", alt:"Vespa GTS SuperSport 300 2025 scooter in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Goobike", sourceLabel:"Motorcycle catalog image · Vespa GTS SuperSport 300", sourceUrl:"https://www.goobike.com/maker-vespa/car-vespa_gts300ie_supersport/index.html", lastChecked:"2026-09-08"
  },
  {
    id:"vespa-gtv-300-editorial", entityType:"motorcycle", entityId:"vespa-gtv-300", role:"primary",
    src:"https://m.atcdn.co.uk/a/media/77e29bc00fbd4404bac9108e2f8d409f.jpg", alt:"Vespa GTV 300 scooter product image", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"Auto Trader UK", sourceLabel:"Motorcycle listing image · Vespa GTV 300", sourceUrl:"https://www.autotrader.co.uk/bikes/motorcycles/piaggio/vespa-gtv-300", lastChecked:"2026-09-08"
  },
  {
    id:"aprilia-rs-660-editorial", entityType:"motorcycle", entityId:"aprilia-rs-660", role:"primary",
    src:"https://images5.1000ps.net/images_bikekat/2021/9-Aprilia/9956-RS_660/044-637381148908493951-aprilia-rs-660.jpg", alt:"Aprilia RS 660 sport motorcycle in studio view", width:1200, height:900,
    rightsStatus:"external-reference", rightsHolder:"1000PS", sourceLabel:"Editorial product image · Aprilia RS 660", sourceUrl:"https://www.1000ps.de/motorradvergleich-aprilia-rs-660-2021-vs-yamaha-mt-09-2025-426609", lastChecked:"2026-09-08"
  },


  {
    id: "ktm-rc-390-editorial", entityType: "motorcycle", entityId: "ktm-rc-390", role: "primary",
    src: "https://www.todocircuito.com/ckfinder/userfiles/images/KTM-RC390-2022-4.jpg", alt: "KTM RC 390 sport motorcycle in blue and orange", width: 1200, height: 800,
    rightsStatus: "external-reference", rightsHolder: "TodoCircuito", sourceLabel: "Editorial product image · KTM RC 390", sourceUrl: "https://www.todocircuito.com/noticias/27805-nueva-ktm-rc-390-2022%3A-presentacion-oficial-y-fotos-de-la-renovada-supersport-austriaca.html", lastChecked: "2026-09-09"
  },
  {
    id: "honda-gold-wing-hondanews", entityType: "motorcycle", entityId: "honda-gold-wing", role: "primary",
    src: "https://hondanews.eu/image/motorcycles/low/453308/1_18/5?v=2", alt: "Honda Gold Wing Tour luxury touring motorcycle", width: 1200, height: 800,
    rightsStatus: "external-reference", rightsHolder: "Honda Motor Europe", sourceLabel: "Official Honda media image · Gold Wing Tour", sourceUrl: "https://hondanews.eu/pl/pl/motorcycles/media/pressreleases/453353/honda-gold-wing-tour-na-rok-modelowy-2024", lastChecked: "2026-09-09"
  },
  {
    id: "honda-rebel-1100-official", entityType: "motorcycle", entityId: "honda-rebel-1100", role: "primary",
    src: "https://powersports.honda.com/-/media/products/family/rebel-1100/trims/trim-main/rebel-1100/2025/2025-rebel-1100-matte_black_metallic-1505x923.png?imwidth=640", alt: "Honda Rebel 1100 cruiser in Matte Black Metallic", width: 1505, height: 923,
    rightsStatus: "external-reference", rightsHolder: "American Honda Motor Co.", sourceLabel: "Official Honda product image · Rebel 1100", sourceUrl: "https://powersports.honda.com/motorcycle/cruiser/rebel-1100/2025/rebel-1100", lastChecked: "2026-09-09"
  },
  {
    id: "honda-rebel-500-manila", entityType: "motorcycle", entityId: "honda-rebel-500", role: "primary",
    src: "https://cdn.riderly.com/storage/media/img/bikes/honda__rebel%20500.png", alt: "Honda Rebel 500 cruiser in silver", width: 1200, height: 800,
    rightsStatus: "external-reference", rightsHolder: "Riderly / Motorent Manila", sourceLabel: "Philippine rental product image · Honda Rebel 500", sourceUrl: "https://www.motorentmanila.com/motorcycles/honda-rebel-500", lastChecked: "2026-09-09"
  },

];

export function getRenderableMedia(entityType: EntityMedia["entityType"], entityId: string) {
  return entityMedia.filter((asset) => asset.entityType === entityType && asset.entityId === entityId && asset.rightsStatus !== "pending");
}

export function hasRenderableProductMedia(entityId: string) {
  return entityMedia.some((asset) =>
    (asset.entityType === "helmet" || asset.entityType === "tire" || asset.entityType === "topbox") &&
    asset.entityId === entityId &&
    asset.rightsStatus !== "pending"
  );
}


export const fallbackOnlyProductMedia = [
  { entityId:"kyt-tt-revo", reason:"Known remote image URL failed; keep the runtime fallback until a checked replacement is available." },
  { entityId:"shad-sh39", reason:"Known remote image URL failed; keep the runtime fallback until a checked replacement is available." },
  { entityId:"ls2-thunder-gp-pro", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"ls2-dragon", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"ls2-advant-ii", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"nhk-gp-r-tech-race", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"nhk-terminator-tt", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"smk-stellar", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"smk-cygnus", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"alpinestars-supertech-r10", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"alpinestars-supertech-m10", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"alpinestars-supertech-m8", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"alpinestars-sm5", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"coocase-s28-vivo", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"coocase-v28-fusion", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"coocase-v36-wizard", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"coocase-s48-astra", reason:"New catalog entity intentionally ships without another third-party image hotlink." },
  { entityId:"coocase-v50-reflex", reason:"New catalog entity intentionally ships without another third-party image hotlink." }
] as const;

export function isFallbackOnlyProductMedia(entityId: string) {
  return fallbackOnlyProductMedia.some((item) => item.entityId === entityId);
}
