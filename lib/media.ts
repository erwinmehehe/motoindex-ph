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
    rightsStatus: "external-reference", rightsHolder: "Motortrade", sourceLabel: "Authorized-dealer image reference · Motortrade Yamaha PG-1", sourceUrl: "https://motortrade.com.ph/motorcycles/yamaha-pg-1/", lastChecked: "2026-08-25"
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
    rightsStatus: "external-reference", rightsHolder: "Motortrade", sourceLabel: "Authorized-dealer image reference · Motortrade Raider J Crossover", sourceUrl: "https://motortrade.com.ph/motorcycles/suzuki-raider-j-crossover-fj110lb2/", lastChecked: "2026-08-25"
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
    rightsStatus: "external-reference", rightsHolder: "Motortrade", sourceLabel: "Authorized-dealer image reference · Motortrade Gixxer SF250", sourceUrl: "https://motortrade.com.ph/motorcycles/suzuki-sf-gixxer-250/", lastChecked: "2026-08-25"
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
