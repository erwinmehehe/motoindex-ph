import type { EntityMedia } from "./types";

// Entity images use a local-first media policy. The canonical `src` is a self-hosted,
// standardized derivative under /public/media. `sourceImageUrl` preserves the checked
// upstream image for provenance and a temporary runtime fallback while local assets are synced.
// Local motorcycle WebP derivatives are art-directed to a 1200x1200 white catalog canvas; source provenance remains below.
export const entityMedia: EntityMedia[] = [
  {
    id: "yamaha-mio-gravis-wheeltek", entityType: "motorcycle", entityId: "yamaha-mio-gravis", role: "primary",
    src: "/media/motorcycles/yamaha-mio-gravis.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/MIO-GRAVIS-matte-brown.jpg", alt: "Yamaha Mio Gravis motorcycle in Matte Brown", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Mio Gravis", sourceUrl: "https://wheeltek.com.ph/vehicles/mio-gravis/", lastChecked: "2026-09-21"
  },
  {
    id: "yamaha-mio-i-125-wheeltek", entityType: "motorcycle", entityId: "yamaha-mio-i-125", role: "primary",
    src: "/media/motorcycles/yamaha-mio-i-125.webp", sourceImageUrl: "https://wheeltek.com.ph/wp-content/uploads/2025/03/MIO-i125-cyan.jpg", alt: "Yamaha Mio i 125 motorcycle in Cyan", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Wheeltek", sourceLabel: "Authorized-dealer image reference · Wheeltek Mio i125", sourceUrl: "https://wheeltek.com.ph/vehicles/mio-i125/", lastChecked: "2026-09-21"
  },
  {
    id: "yamaha-tmax-motortrade", entityType: "motorcycle", entityId: "yamaha-tmax", role: "primary",
    src: "/media/motorcycles/yamaha-tmax.webp", sourceImageUrl: "https://motortrade.com.ph/wp-content/uploads/2021/09/1-20.jpg", alt: "Yamaha TMAX Tech Max motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motortrade Philippines", sourceLabel: "Philippine dealer image reference · Motortrade TMAX Tech Max", sourceUrl: "https://motortrade.com.ph/motorcycles/yamaha-tmax-tech-max/", lastChecked: "2026-09-21"
  },
  {
    id: "honda-crf300-rally-manufacturer", entityType: "motorcycle", entityId: "honda-crf300-rally", role: "primary",
    src: "/media/motorcycles/honda-crf300-rally.webp", sourceImageUrl: "https://powersports.honda.com/motorcycle/dual-sport/crf300l-rally/2026/-/media/products/family/crf300l-rally/trims/trim-main/crf300l-rally/2026/2026-crf300l-rally-red-1505x923.png?imwidth=1600", alt: "Honda CRF300 Rally adventure motorcycle product image", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda", sourceLabel: "Manufacturer product image · Honda CRF300L Rally", sourceUrl: "https://powersports.honda.com/motorcycle/dual-sport/crf300l-rally/2026/crf300l-rally", lastChecked: "2026-09-24"
  },
  {
    id: "yamaha-mt-07-global-reference", entityType: "motorcycle", entityId: "yamaha-mt-07", role: "primary",
    src: "/media/motorcycles/yamaha-mt-07.webp", sourceImageUrl: "https://www.yamahaba.sk/_Data/produkty/5849_1024_768.jpg", alt: "Yamaha MT-07 motorcycle in Icon Blue", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Yamaha dealer network", sourceLabel: "Yamaha dealer image reference · 2025 MT-07", sourceUrl: "https://www.yamahaba.sk/mt07iconblue2025", lastChecked: "2026-09-20"
  },
  {
    id: "yamaha-xsr700-yamaha-eu", entityType: "motorcycle", entityId: "yamaha-xsr700", role: "primary",
    src: "/media/motorcycles/yamaha-xsr700.webp", sourceImageUrl: "https://cdn2.yamaha-motor.eu/prod/product-assets/2022/XS700/2022-Yamaha-XS700-EU-Historic_White-Studio-001-03.jpg", alt: "Yamaha XSR700 motorcycle in Historic White", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Yamaha Motor Europe N.V.", sourceLabel: "Manufacturer-hosted studio image reference · Yamaha XSR700", sourceUrl: "https://www.yamaha-motor.eu/is/en/motorcycles/sport-heritage/pdp/xsr700/", lastChecked: "2026-09-24"
  },
  {
    id: "honda-cb650r-honda-global", entityType: "motorcycle", entityId: "honda-cb650r", role: "primary",
    src: "/media/motorcycles/honda-cb650r.webp", sourceImageUrl: "https://global.honda/content/dam/site/global-jp/news-new/cq_img/2024/04/dl/2240411-cb650r_005H.jpg", alt: "Honda CB650R motorcycle in Matte Ballistic Black Metallic", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda Motor Co., Ltd.", sourceLabel: "Manufacturer-hosted image reference · Honda CB650R", sourceUrl: "https://global.honda/jp/news/2024/2240411-cb650r/image_download.html", lastChecked: "2026-09-24"
  },
  {
    id: "honda-nx500-e-clutch-bsh-2026", entityType: "motorcycle", entityId: "honda-nx500-e-clutch", role: "primary",
    src: "/media/motorcycles/honda-nx500-e-clutch.webp", sourceImageUrl: "https://hondabigbike.com.my/wp-content/uploads/2026/09/2026-NX500_studio_A002_E-Clutch_NH-B61P_PearlHorizonWhite_RhSide_M-Photoroom-1-e1786456362968.png", alt: "2026 Honda NX500 E-Clutch motorcycle in Pearl Horizon White", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Boon Siew Honda / Honda BigBike Malaysia", sourceLabel: "Manufacturer-hosted image reference · 2026 Honda NX500 E-Clutch", sourceUrl: "https://hondabigbike.com.my/model/nx500/", lastChecked: "2026-09-24"
  },
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
    id: "honda-beat-honda-ph", entityType: "motorcycle", entityId: "honda-beat", role: "primary",
    src: "/media/motorcycles/honda-beat.webp", sourceImageUrl: "https://images.ctfassets.net/p4ab844it03t/73zDTyHHl8VZiWLSoDjZo4/349c2c309b4aa57320b48ac64448f9b7/6510e11420665.png?fm=webp&q=90", alt: "Honda BeAT Premium motorcycle in Pearl Arctic White", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda Philippines, Inc.", sourceLabel: "Manufacturer-hosted image reference · Honda BeAT Premium", sourceUrl: "https://www.hondaph.com/motorcycle/news/honda-philippines-launches-the-all-new-beat-and-the-50th-anniversary-limited-edition-designed-especially-for-the-all-new-beat-and-click125", lastChecked: "2026-09-24"
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
    src: "/media/motorcycles/suzuki-avenis.webp", sourceImageUrl: "https://motortrade.com.ph/wp-content/uploads/2022/08/1.jpg", alt: "Suzuki Avenis motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motortrade / Suzuki", sourceLabel: "Dealer product image · Suzuki Avenis", sourceUrl: "https://motortrade.com.ph/motorcycles/suzuki-avenis/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-smash-fi-manufacturer", entityType: "motorcycle", entityId: "suzuki-smash-fi", role: "primary",
    src: "/media/motorcycles/suzuki-smash-fi.webp", sourceImageUrl: "https://motortrade.com.ph/wp-content/uploads/2025/09/Untitled-design-300x251.png", alt: "Suzuki Smash FI motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motortrade / Suzuki", sourceLabel: "Dealer product image · Suzuki Smash FI", sourceUrl: "https://motortrade.com.ph/motorcycles/suzuki-smash-fi/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-raider-j-crossover-motortrade", entityType: "motorcycle", entityId: "suzuki-raider-j-crossover", role: "primary",
    src: "/media/motorcycles/suzuki-raider-j-crossover.webp", sourceImageUrl: "https://motortrade.com.ph/wp-content/uploads/2020/10/3-1.jpg", alt: "Suzuki Raider J Crossover motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Philippine dealer network", sourceLabel: "Authorized-dealer image reference · Authorized PH dealer Raider J Crossover", sourceUrl: "https://motortrade.com.ph/motorcycles/suzuki-raider-j-crossover-fj110lb2/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-raider-pro-suzuki-ph-final", entityType: "motorcycle", entityId: "suzuki-raider-pro", role: "primary",
    src: "/media/motorcycles/suzuki-raider-pro.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2025/11/RPTYNov11-1.png", alt: "Suzuki Raider PRO motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer-hosted Philippine image reference · Suzuki Raider PRO", sourceUrl: "https://mc.suzuki.com.ph/the-progressive-edge-suzuki-launches-the-5th-generation-raider-r150-series-in-the-philippines/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-gixxer-155-manufacturer", entityType: "motorcycle", entityId: "suzuki-gixxer-155", role: "primary",
    src: "/media/motorcycles/suzuki-gixxer-155.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2024/10/GIXXER155PrevFeb6.png", alt: "Suzuki Gixxer 155 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer product image · Suzuki Gixxer 155", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-155/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-gixxer-sf-155-manufacturer", entityType: "motorcycle", entityId: "suzuki-gixxer-sf-155", role: "primary",
    src: "/media/motorcycles/suzuki-gixxer-sf-155.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2024/10/PMRGSF155Feb6-2.png", alt: "Suzuki Gixxer SF 155 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer product image · Suzuki Gixxer SF 155", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-sf155/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-gixxer-250-manufacturer", entityType: "motorcycle", entityId: "suzuki-gixxer-250", role: "primary",
    src: "/media/motorcycles/suzuki-gixxer-250.webp", sourceImageUrl: "https://motortrade.com.ph/wp-content/uploads/2022/05/GIXXER-GSX250RL-1.jpg", alt: "Suzuki Gixxer 250 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motortrade / Suzuki", sourceLabel: "Dealer product image · Suzuki Gixxer 250", sourceUrl: "https://motortrade.com.ph/motorcycles/suzuki-gixxer-250-2/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-gixxer-sf250-motortrade", entityType: "motorcycle", entityId: "suzuki-gixxer-sf250", role: "primary",
    src: "/media/motorcycles/suzuki-gixxer-sf250.webp", sourceImageUrl: "https://motortrade.com.ph/wp-content/uploads/2020/10/1-1.jpg", alt: "Suzuki Gixxer SF250 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Philippine dealer network", sourceLabel: "Authorized-dealer image reference · Authorized PH dealer Gixxer SF250", sourceUrl: "https://motortrade.com.ph/motorcycles/suzuki-sf-gixxer-250/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-v-strom-250-sx-manufacturer", entityType: "motorcycle", entityId: "suzuki-v-strom-250-sx", role: "primary",
    src: "/media/motorcycles/suzuki-v-strom-250-sx.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2023/10/V-Strom-250-SX-Champion-Yellow-1.png", alt: "Suzuki V-Strom 250 SX motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer product image · Suzuki V-Strom 250 SX", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/v-strom-250-sx/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-v-strom-160-manufacturer", entityType: "motorcycle", entityId: "suzuki-v-strom-160", role: "primary",
    src: "/media/motorcycles/suzuki-v-strom-160.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2026/04/Solid-Cool-Yellow-VS160SCYApr15_5.png", alt: "Suzuki V-Strom 160 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer product image · Suzuki V-Strom 160", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/v-strom-160/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-dr160-manufacturer", entityType: "motorcycle", entityId: "suzuki-dr160", role: "primary",
    src: "/media/motorcycles/suzuki-dr160.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2026/04/DR160SWApr15-5.png", alt: "Suzuki DR160 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer product image · Suzuki DR160", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/dr-160/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-access-manufacturer", entityType: "motorcycle", entityId: "suzuki-access", role: "primary",
    src: "/media/motorcycles/suzuki-access.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2025/10/Access-Standard.png", alt: "Suzuki Access motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer product image · Suzuki Access", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/access/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-skydrive-sport-manufacturer", entityType: "motorcycle", entityId: "suzuki-skydrive-sport", role: "primary",
    src: "/media/motorcycles/suzuki-skydrive-sport.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2024/05/Skydrive_Black_1-1.png", alt: "Suzuki Skydrive Sport motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer product image · Suzuki Skydrive Sport", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/skydrive-sport/", lastChecked: "2026-09-24"
  },
  {
    id: "suzuki-burgman-street-manufacturer", entityType: "motorcycle", entityId: "suzuki-burgman-street", role: "primary",
    src: "/media/motorcycles/suzuki-burgman-street.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2023/11/Burgman-Street-Standard-Candy-Red.png", alt: "Suzuki Burgman Street motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer product image · Suzuki Burgman Street", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/burgman-street/", lastChecked: "2026-09-24"
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
    src: "/media/helmets/evo-gt-pro-rr.webp", sourceImageUrl: "https://evohelmet.com/wp-content/uploads/2022/08/GREEN-1.jpg", alt: "EVO GT-Pro RR full-face motorcycle helmet in green", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "EVO Helmets", sourceLabel: "Official EVO product image · GT-Pro RR", sourceUrl: "https://evohelmet.com/product/gt-pro-rr/", lastChecked: "2026-09-24"
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
    src:"/media/motorcycles/aprilia-sr-gt-200.webp", sourceImageUrl:"https://www.motofichas.com/images/phocagallery/Aprilia/sr-gt/01-aprilia-sr-gt-2022-estudio-azul-01.jpg", alt:"Aprilia SR GT 200 scooter in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Motofichas", sourceLabel:"Editorial product image · Aprilia SR GT 200", sourceUrl:"https://foromotos.net/threads/ficha-t%C3%A9cnica-aprilia-sr-gt-200-2022-2024.11827/", lastChecked:"2026-09-08"
  },
  {
    id:"aprilia-rs-457-editorial", entityType:"motorcycle", entityId:"aprilia-rs-457", role:"primary",
    src:"/media/motorcycles/aprilia-rs-457.webp", sourceImageUrl:"https://www.ginzinger.at/images/djmediatools/843-aprilia-rs-457-studio/01_1.jpeg", alt:"Aprilia RS 457 sport motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Ginzinger", sourceLabel:"Dealer/editorial product image · Aprilia RS 457", sourceUrl:"https://www.ginzinger.at/blog/aprilia/rs-457.html", lastChecked:"2026-09-08"
  },
  {
    id:"benelli-180s-benelli-official", entityType:"motorcycle", entityId:"benelli-180s", role:"primary",
    src:"/media/motorcycles/benelli-180s.webp", sourceImageUrl: "https://cdn.keeway.com/benelli-3-0/media/8842/conversions/180S-White-md.png", alt:"Benelli 180S naked motorcycle product view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "Benelli", sourceLabel: "Manufacturer product image · Benelli 180S", sourceUrl: "https://www.benelli.com/np-en/products/180s", lastChecked: "2026-09-24"
  },
  {
    id:"benelli-trk-502x-editorial", entityType:"motorcycle", entityId:"benelli-trk-502x", role:"primary",
    src:"/media/motorcycles/benelli-trk-502x.webp", sourceImageUrl: "https://cdn.keeway.com/benelli-3-0/media/481/conversions/TRK-502X-%5B2020%5D-45-Blue-md.png", alt:"Benelli TRK 502X adventure motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "Benelli", sourceLabel: "Manufacturer product image · Benelli TRK 502X", sourceUrl: "https://www.benelli.com/my-en/products/trk-502x", lastChecked: "2026-09-24"
  },
  {
    id:"bmw-g-310-gs-editorial", entityType:"motorcycle", entityId:"bmw-g-310-gs", role:"primary",
    src:"/media/motorcycles/bmw-g-310-gs.webp", sourceImageUrl: "https://mediapool.bmwgroup.com/download/edown/pressclub/publicq?actEvent=image&attachment=1&dokNo=P90402134", alt:"BMW G 310 GS motorcycle product photo", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "BMW Group", sourceLabel: "Official BMW Motorrad studio image · G 310 GS", sourceUrl: "https://www.press.bmwgroup.com/global/photo/detail/P90402134/BMW-G-310-GS-plain-polar-white-10-2020", lastChecked: "2026-09-24"
  },
  {
    id:"bmw-c-400-gt-editorial", entityType:"motorcycle", entityId:"bmw-c-400-gt", role:"primary",
    src:"/media/motorcycles/bmw-c-400-gt.webp", sourceImageUrl:"https://www.bmwpap.gr/image/cache/data/product/BMW/2024/C%20400%20GT/P90512322_lowRes_bmw-c-400-gt-my-2024-1-1-2-1400x1200.jpg", alt:"BMW C 400 GT maxi scooter in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"BMW Papadopoulos", sourceLabel:"BMW dealer product image · C 400 GT", sourceUrl:"https://www.bmwpap.gr/", lastChecked:"2026-09-08"
  },
  {
    id:"bristol-adx-160-official", entityType:"motorcycle", entityId:"bristol-adx-160", role:"primary",
    src:"/media/motorcycles/bristol-adx-160.webp", sourceImageUrl: "https://static.wixstatic.com/media/fc6fc6_fe7a98c0324d4b33aaa16db8539bff20~mv2.png", alt:"Bristol ADX 160 scooter product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "Bristol Motorcycles Philippines", sourceLabel: "Manufacturer product image · Bristol ADX 160", sourceUrl: "https://www.bristol-motorcycles.com/adx160", lastChecked: "2026-09-24"
  },
  {
    id:"bristol-maxie-400-editorial", entityType:"motorcycle", entityId:"bristol-maxie-400", role:"primary",
    src:"/media/motorcycles/bristol-maxie-400.webp", sourceImageUrl:"https://imgcdn.zigwheels.ph/large/gallery/color/128/3117/bristol-maxie-400-color-293352.jpg", alt:"Bristol Maxie 400 maxi scooter product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Zigwheels Philippines", sourceLabel:"Philippine catalog image · Bristol Maxie 400", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/bristol/maxie-400/colors", lastChecked:"2026-09-08"
  },
  {
    id:"cfmoto-450mt-editorial", entityType:"motorcycle", entityId:"cfmoto-450mt", role:"primary",
    src:"/media/motorcycles/cfmoto-450mt.webp", sourceImageUrl: "https://static.wixstatic.com/media/0a0f90_33a69b54405f4f13914f06ee5db819e0~mv2.png", alt:"CFMOTO 450MT adventure motorcycle in Tundra Grey", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "CFMOTO Philippines", sourceLabel: "Manufacturer product image · CFMOTO 450MT", sourceUrl: "https://www.cfmotoph.com/motorcycle/450mt", lastChecked: "2026-09-24"
  },
  {
    id:"cfmoto-450sr-editorial", entityType:"motorcycle", entityId:"cfmoto-450sr", role:"primary",
    src:"/media/motorcycles/cfmoto-450sr.webp", sourceImageUrl: "https://static.wixstatic.com/media/0a0f90_1b3274884ee545a781231cbefcb0d7d9~mv2.png", alt:"CFMOTO 450SR sport motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "CFMOTO Philippines", sourceLabel: "Manufacturer product image · CFMOTO 450SR", sourceUrl: "https://www.cfmotoph.com/motorcycle/450sr", lastChecked: "2026-09-24"
  },
  {
    id:"ducati-monster-937-plus-editorial", entityType:"motorcycle", entityId:"ducati-monster-937-plus", role:"primary",
    src:"/media/motorcycles/ducati-monster-937-plus.webp", sourceImageUrl: "https://images.ctfassets.net/x7j9qwvpvr5s/6pN73T6u1I1qaq8cizP7qV/b71f8207bba199bff55afb8198559993/Monster-937-Rd-MY22-Model-Preview-1050x650-v06.png", alt:"Ducati Monster 937 Plus naked motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "Ducati", sourceLabel: "Manufacturer-hosted product image · Ducati Monster 937", sourceUrl: "https://www.ducati.com/br/pt/motos/monster/monster-937", lastChecked: "2026-09-24"
  },
  {
    id:"ducati-scrambler-nightshift-editorial", entityType:"motorcycle", entityId:"ducati-scrambler-nightshift", role:"primary",
    src:"/media/motorcycles/ducati-scrambler-nightshift.webp", sourceImageUrl: "https://www.ducatiomaha.com/cdn/shop/files/Scrambler-Ducati_Nightshift-Emerald.png?v=1759436541", alt:"Ducati Scrambler Nightshift motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "Ducati", sourceLabel: "Exact product image · Ducati Omaha dealer listing · Scrambler Nightshift", sourceUrl: "https://www.ducatiomaha.com/products/2026-ducati-scrambler-nightshift-emerald-green", lastChecked: "2026-09-24"
  },
  {
    id:"husqvarna-svartpilen-401-editorial", entityType:"motorcycle", entityId:"husqvarna-svartpilen-401", role:"primary",
    src:"/media/motorcycles/husqvarna-svartpilen-401.webp", sourceImageUrl:"https://next-moto.com/products/873/images/husqvarna-svartpilen-401-2023-873-1746647954.webp", alt:"Husqvarna Svartpilen 401 motorcycle product photo", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Next Moto", sourceLabel:"Motorcycle listing image · Husqvarna Svartpilen 401", sourceUrl:"https://next-moto.com/comprar-moto-ocasion", lastChecked:"2026-09-08"
  },
  {
    id:"husqvarna-vitpilen-401-editorial", entityType:"motorcycle", entityId:"husqvarna-vitpilen-401", role:"primary",
    src:"/media/motorcycles/husqvarna-vitpilen-401.webp", sourceImageUrl: "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_PERS_REVO_HQV-22-Vitpilen-401-hd_%23SALL_%23AEPI_%23V1.png", alt:"Husqvarna Vitpilen 401 2023 motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "Husqvarna Motorcycles", sourceLabel: "Manufacturer product image · Husqvarna Vitpilen 401", sourceUrl: "https://www.husqvarna-motorcycles.com/en-ph/models/naked/vitpilen/vitpilen-401-2023.html", lastChecked: "2026-09-24"
  },
  {
    id:"ktm-390-duke-official", entityType:"motorcycle", entityId:"ktm-390-duke", role:"primary",
    src:"/media/motorcycles/ktm-390-duke.webp", sourceImageUrl: "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_PERS_REVO_MY23-KTM-390-DUKE--45-degree-front-right---INDIA-CTG--LIQUID-METAL-India-CTG_%23SALL_%23AEPI_%23V1.png", alt:"KTM 390 Duke 2023 motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "KTM", sourceLabel: "Manufacturer product image · KTM 390 Duke", sourceUrl: "https://www.ktm.com/en-my/models/naked-bike/2023-ktm-390-duke.html", lastChecked: "2026-09-24"
  },
  {
    id:"ktm-390-adventure-editorial", entityType:"motorcycle", entityId:"ktm-390-adventure", role:"primary",
    src:"/media/motorcycles/ktm-390-adventure.webp", sourceImageUrl:"https://images5.1000ps.net/images_bikekat/2023/1-KTM/9529-390_Adventure/009-638108438206018074-ktm-390-adventure.jpg", alt:"KTM 390 Adventure 2023 motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"1000PS", sourceLabel:"Editorial product image · KTM 390 Adventure", sourceUrl:"https://www.1000ps.de/motorradvergleich-ktm-390-adventure-2023-vs-ktm-690-enduro-r-2020-448389", lastChecked:"2026-09-08"
  },
  {
    id:"kymco-like-150i-kymco-ph", entityType:"motorcycle", entityId:"kymco-like-150i-abs", role:"primary",
    src:"/media/motorcycles/kymco-like-150i-abs.webp", sourceImageUrl:"https://kymco.com.ph/wp-content/uploads/2024/03/LIKE125_1.png.webp", alt:"Kymco Like 150i ABS scooter product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Kymco Philippines", sourceLabel:"Manufacturer-hosted Philippine image reference · Kymco Like 150i ABS", sourceUrl:"https://kymco.com.ph/product/like-150i-abs/", lastChecked:"2026-09-24"
  },
  {
    id:"kymco-krv-180i-kymco-ph", entityType:"motorcycle", entityId:"kymco-krv-180i-tcs", role:"primary",
    src:"/media/motorcycles/kymco-krv-180i-tcs.webp", sourceImageUrl:"https://kymco.com.ph/wp-content/uploads/2024/02/KRV-Belt_1.png", alt:"Kymco KRV 180 Belt scooter in blue", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"KYMCO Philippines", sourceLabel:"Manufacturer-hosted product image · Kymco KRV 180 Belt", sourceUrl:"https://kymco.com.ph/product/krv-180-belt/", lastChecked:"2026-09-24"
  },
  {
    id:"motorstar-cafe-400-editorial", entityType:"motorcycle", entityId:"motorstar-cafe-400", role:"primary",
    src:"/media/motorcycles/motorstar-cafe-400.webp", sourceImageUrl: "https://imgcdn.zigwheels.ph/large/gallery/exterior/78/1899/motorstar-cafe-400-right-side-viewfull-image-779807.jpg", alt:"MotorStar Cafe 400 motorcycle product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "Zigwheels Philippines", sourceLabel: "Catalog product image · MotorStar Cafe 400", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/motorstar/cafe-400", lastChecked: "2026-09-24"
  },
  {
    id:"motorstar-xplorer-250r-editorial", entityType:"motorcycle", entityId:"motorstar-xplorer-250r", role:"primary",
    src:"/media/motorcycles/motorstar-xplorer-250r.webp", sourceImageUrl: "https://imgcdn.zigwheels.ph/large/gallery/color/78/1034/motorstar-xplorer-250r-color-270316.jpg", alt:"MotorStar Xplorer 250R adventure motorcycle product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "Zigwheels Philippines", sourceLabel: "Philippine catalog color image · MotorStar Xplorer 250R", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/motorstar/xplorer-250r/images", lastChecked: "2026-09-24"
  },
  {
    id:"royal-enfield-hunter-350-editorial", entityType:"motorcycle", entityId:"royal-enfield-hunter-350", role:"primary",
    src:"/media/motorcycles/royal-enfield-hunter-350.webp", sourceImageUrl: "https://static-cdn.cars24.com/prod/new-bike-cms/Royal-Enfield/Hunter-350/2025/01/01/b9127f64-b4f2-425b-aa82-01bce35d485d-Royal-Enfield_Hunter-350_Dapper-White_-cce0fd.png?dpr=3&format=auto&optimize=low&quality=80&w=1000", alt:"Royal Enfield Hunter 350 motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "Bikes24 / Royal Enfield", sourceLabel: "Catalog product image · Royal Enfield Hunter 350", sourceUrl: "https://www.bikes24.com/royal-enfield/hunter-350/", lastChecked: "2026-09-24"
  },
  {
    id:"royal-enfield-himalayan-450-editorial", entityType:"motorcycle", entityId:"royal-enfield-himalayan-450", role:"primary",
    src:"/media/motorcycles/royal-enfield-himalayan-450.webp", sourceImageUrl: "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/himalayan/colors/new-studio-shots/mana-black/mana-black-000.webp", alt:"Royal Enfield Himalayan 450 adventure motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "Royal Enfield", sourceLabel: "Manufacturer studio image · Royal Enfield Himalayan 450", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/new-himalayan/", lastChecked: "2026-09-24"
  },
  {
    id:"rusi-rfi-175-editorial", entityType:"motorcycle", entityId:"rusi-rfi-175", role:"primary",
    src:"/media/motorcycles/rusi-rfi-175.webp", sourceImageUrl:"https://www.kamote.ph/cdn-cgi/image/lossless%3Dtrue%2Cw%3D800%2Ch%3D800%2Cf%3Dwebp%2Cfit%3Dcontain/https%3A/www.kamote.ph/Gallery/Rusi/RFI_175.webp", alt:"Rusi RFI 175 scooter product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Kamote.ph", sourceLabel:"Philippine catalog image · Rusi RFI 175", sourceUrl:"https://www.kamote.ph/motorcycle/rusi-rfi-175", lastChecked:"2026-09-08"
  },
  {
    id:"rusi-classic-250i-editorial", entityType:"motorcycle", entityId:"rusi-classic-250i", role:"primary",
    src:"/media/motorcycles/rusi-classic-250i.webp", sourceImageUrl:"https://www.kamote.ph/cdn-cgi/image/lossless%3Dtrue%2Cw%3D800%2Ch%3D800%2Cf%3Dwebp%2Cfit%3Dcontain/https%3A/www.kamote.ph/Gallery/Rusi/Classic_250i.webp", alt:"Rusi Classic 250i motorcycle product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Kamote.ph", sourceLabel:"Philippine catalog image · Rusi Classic 250i", sourceUrl:"https://www.kamote.ph/motorcycle/rusi-classic-250i", lastChecked:"2026-09-08"
  },
  {
    id:"sym-jet-x150-editorial", entityType:"motorcycle", entityId:"sym-jet-x150", role:"primary",
    src:"/media/motorcycles/sym-jet-x150.webp", sourceImageUrl:"https://static.wixstatic.com/media/97f6bd_7fc1c2558c4d4bb29444f1404b58db9f~mv2.jpg/v1/fill/w_1400%2Ch_1235%2Cal_c/97f6bd_7fc1c2558c4d4bb29444f1404b58db9f~mv2.jpg", alt:"SYM Jet X150 scooter product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"AA Perfectionist", sourceLabel:"Editorial product image · SYM Jet X", sourceUrl:"https://www.aapefi.com/post/sym-issues-voluntary-recall-for-2024-2025-fnx-and-jet-models-over-fuel-pump-concerns", lastChecked:"2026-09-08"
  },
  {
    id:"sym-cruisym-150-editorial", entityType:"motorcycle", entityId:"sym-cruisym-150", role:"primary",
    src:"/media/motorcycles/sym-cruisym-150.webp", sourceImageUrl:"https://www.xsmt.com/upload/202302/06/202302061424135456.png", alt:"SYM Cruisym 150 scooter product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"XSMT", sourceLabel:"Motorcycle catalog image · SYM Cruisym 150", sourceUrl:"https://www.xsmt.com/product/show-4288.html", lastChecked: "2026-09-24"
  },
  {
    id:"triumph-speed-400-editorial", entityType:"motorcycle", entityId:"triumph-speed-400", role:"primary",
    src:"/media/motorcycles/triumph-speed-400.webp", sourceImageUrl:"https://carroemotos.com.br/wp-content/uploads/2023/06/Speed-400_MY24_Phantom-Black_AngleRHS.jpg", alt:"Triumph Speed 400 motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Carro e Motos", sourceLabel:"Editorial product image · Triumph Speed 400", sourceUrl:"https://carroemotos.com.br/triumph-launches-two-new-400cc-motorcycles-see-photos-video-and-technical-sheet/", lastChecked:"2026-09-08"
  },
  {
    id:"triumph-scrambler-400-x-editorial", entityType:"motorcycle", entityId:"triumph-scrambler-400-x", role:"primary",
    src:"/media/motorcycles/triumph-scrambler-400-x.webp", sourceImageUrl:"https://www.motociclismo.es/uploads/s1/12/16/83/24/triumph-speed400andscrambler400x-studio-06_7_1200x690.jpeg", alt:"Triumph Scrambler 400 X motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Motociclismo", sourceLabel:"Editorial product image · Triumph Scrambler 400 X", sourceUrl:"https://www.motociclismo.es/novedades/triumph-speed-scrambler-400-x-nueva-categoria_278903_102.html", lastChecked:"2026-09-08"
  },
  {
    id: "vespa-primavera-150-vespa-store", entityType: "motorcycle", entityId: "vespa-primavera-150", role: "primary",
    src: "/media/motorcycles/vespa-primavera-150.webp", sourceImageUrl: "https://storeusa.vespa.com/img/models/PRIMAVERA%20150/415/mainimg_primavera-150-metallic-orange.png", alt: "Vespa Primavera 150 scooter", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Vespa", sourceLabel: "Manufacturer product image · Vespa Primavera 150", sourceUrl: "https://storeusa.vespa.com/primavera/primavera-150.aspx", lastChecked: "2026-09-24"
  },
  {
    id:"vespa-sprint-150-editorial", entityType:"motorcycle", entityId:"vespa-sprint-150", role:"primary",
    src:"/media/motorcycles/vespa-sprint-150.webp", sourceImageUrl:"https://img.autofun.co.th/file/1e92114c8163401598ae43327f996ac2.jpg", alt:"Vespa Sprint 150 scooter product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"AutoFun", sourceLabel:"Editorial product image · Vespa Sprint 150", sourceUrl:"https://www.autofun.co.th/motorcycles/vespa/sprint-150-i-get", lastChecked:"2026-09-08"
  },

  // Images for the additional models added in this expansion.
  {
    id:"bmw-g-310-r-editorial", entityType:"motorcycle", entityId:"bmw-g-310-r", role:"primary",
    src:"/media/motorcycles/bmw-g-310-r.webp", sourceImageUrl: "https://mediapool.bmwgroup.com/download/edown/pressclub/publicq?actEvent=image&attachment=1&dokNo=P90407659", alt:"BMW G 310 R motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "BMW Group", sourceLabel: "Official BMW Motorrad studio image · G 310 R", sourceUrl: "https://www.press.bmwgroup.com/global/photo/detail/P90407659/The-new-BMW-G-310-R-base-colour-Polar-White-11-2020", lastChecked: "2026-09-24"
  },
  {
    id:"bmw-r-1300-gs-editorial", entityType:"motorcycle", entityId:"bmw-r-1300-gs", role:"primary", sourceImageUrl: "https://mediapool.bmwgroup.com/download/edown/pressclub/publicq?actEvent=image&attachment=1&dokNo=P90524533",
    src:"/media/motorcycles/bmw-r-1300-gs.webp", alt:"BMW R 1300 GS adventure motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "BMW Group", sourceLabel: "Official BMW Motorrad studio image · R 1300 GS", sourceUrl: "https://www.press.bmwgroup.com/global/photo/detail/P90524533/die-neue-bmw-r-1300-gs-trophy-09/2023", lastChecked: "2026-09-24"
  },
  {
    id:"cfmoto-450nk-editorial", entityType:"motorcycle", entityId:"cfmoto-450nk", role:"primary",
    src:"/media/motorcycles/cfmoto-450nk.webp", sourceImageUrl:"https://motowind.net/wp-content/uploads/450NK-Studio1.jpg", alt:"CFMOTO 450NK naked motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"MotoWind", sourceLabel:"Editorial product image · CFMOTO 450NK", sourceUrl:"https://motowind.net/450nk-studio1/", lastChecked:"2026-09-08"
  },
  {
    id:"cfmoto-675sr-r-editorial", entityType:"motorcycle", entityId:"cfmoto-675sr-r", role:"primary",
    src:"/media/motorcycles/cfmoto-675sr-r.webp", sourceImageUrl: "https://static.wixstatic.com/media/0a0f90_bcd5406be72d403295a51deca80f557b~mv2.png", alt:"CFMOTO 675SR-R sport motorcycle product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder: "CFMOTO Philippines", sourceLabel: "Manufacturer product image · CFMOTO 675SR-R", sourceUrl: "https://www.cfmotoph.com/motorcycle/675sr", lastChecked: "2026-09-24"
  },
  {
    id:"triumph-trident-660-editorial", entityType:"motorcycle", entityId:"triumph-trident-660", role:"primary",
    src:"/media/motorcycles/triumph-trident-660.webp", sourceImageUrl:"https://www.motociclismo.es/uploads/s1/13/69/71/62/triumph-trident-660-2025-estudio-2.jpeg", alt:"Triumph Trident 660 2025 motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Motociclismo", sourceLabel:"Editorial product image · Triumph Trident 660", sourceUrl:"https://www.motociclismo.es/fotos-triumph-trident-660-2025_71379_113.html", lastChecked:"2026-09-08"
  },
  {
    id:"triumph-street-triple-765-rs-editorial", entityType:"motorcycle", entityId:"triumph-street-triple-765-rs", role:"primary",
    src:"/media/motorcycles/triumph-street-triple-765-rs.webp", sourceImageUrl:"https://images5.1000ps.net/g-000343-g_W3430656-triumph-street-triple-765-rs-639017335950495280.jpg", alt:"Triumph Street Triple 765 RS motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"1000PS dealer network", sourceLabel:"Dealer product image · Triumph Street Triple 765 RS", sourceUrl:"https://kawasaki.moto-shop-gera.de/de/neufahrzeug-triumph-street-triple-765-rs-3430656", lastChecked:"2026-09-08"
  },
  {
    id:"royal-enfield-guerrilla-450-editorial", entityType:"motorcycle", entityId:"royal-enfield-guerrilla-450", role:"primary",
    src:"/media/motorcycles/royal-enfield-guerrilla-450.webp", sourceImageUrl:"https://images5.1000ps.net/images_bikekat/2025/15-Royal_Enfield/12583-Guerrilla_450/006-638783978103498301-royal-enfield-guerrilla-450.jpg?format=webp&height=566&mode=crop&width=920", alt:"Royal Enfield Guerrilla 450 motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"1000PS dealer network", sourceLabel:"Dealer product image · Royal Enfield Guerrilla 450", sourceUrl:"https://www.royal-enfield-sachsen.com/de/motorrad-modell-royal-enfield-guerrilla-450-12583-2025", lastChecked:"2026-09-08"
  },
  {
    id:"royal-enfield-classic-350-editorial", entityType:"motorcycle", entityId:"royal-enfield-classic-350", role:"primary",
    src:"/media/motorcycles/royal-enfield-classic-350.webp", sourceImageUrl:"https://images.caradisiac.com/images/1/7/4/4/191744/S0-royal-enfield-classic-350-la-renaissance-d-un-mythe-688471.jpg", alt:"Royal Enfield Classic 350 motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Caradisiac", sourceLabel:"Editorial product image · Royal Enfield Classic 350", sourceUrl:"https://www.caradisiac.com/royal-enfield-classic-350-la-renaissance-d-un-mythe-191744.htm", lastChecked:"2026-09-08"
  },
  {
    id:"vespa-gts-supersport-300-editorial", entityType:"motorcycle", entityId:"vespa-gts-supersport-300", role:"primary",
    src:"/media/motorcycles/vespa-gts-supersport-300.webp", sourceImageUrl:"https://www.goobike.com/newbike/material/img/model/836_Vespa_GTS_Supersport300_2025_blue.jpg", alt:"Vespa GTS SuperSport 300 2025 scooter in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Goobike", sourceLabel:"Motorcycle catalog image · Vespa GTS SuperSport 300", sourceUrl:"https://www.goobike.com/maker-vespa/car-vespa_gts300ie_supersport/index.html", lastChecked:"2026-09-08"
  },
  {
    id:"vespa-gtv-300-editorial", entityType:"motorcycle", entityId:"vespa-gtv-300", role:"primary", sourceImageUrl:"https://media.lulop.com/media/getimage/l/253279/1/640,480",
    src:"/media/motorcycles/vespa-gtv-300.webp", alt:"Vespa GTV 300 scooter product image", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"Piaggio Group", sourceLabel:"Official Piaggio Group press image · Vespa GTV", sourceUrl:"https://press.piaggiogroup.com/en_EN/post/show/253279/new-vespa-gtv.html", lastChecked:"2026-09-08"
  },
  {
    id:"aprilia-rs-660-editorial", entityType:"motorcycle", entityId:"aprilia-rs-660", role:"primary",
    src:"/media/motorcycles/aprilia-rs-660.webp", sourceImageUrl:"https://images5.1000ps.net/images_bikekat/2021/9-Aprilia/9956-RS_660/044-637381148908493951-aprilia-rs-660.jpg", alt:"Aprilia RS 660 sport motorcycle in studio view", width:1200, height:1200,
    rightsStatus:"external-reference", rightsHolder:"1000PS", sourceLabel:"Editorial product image · Aprilia RS 660", sourceUrl:"https://www.1000ps.de/motorradvergleich-aprilia-rs-660-2021-vs-yamaha-mt-09-2025-426609", lastChecked:"2026-09-08"
  },


  {
    id: "ktm-rc-390-editorial", entityType: "motorcycle", entityId: "ktm-rc-390", role: "primary",
    src:"/media/motorcycles/ktm-rc-390.webp", sourceImageUrl:"https://www.todocircuito.com/ckfinder/userfiles/images/KTM-RC390-2022-4.jpg", alt: "KTM RC 390 sport motorcycle in blue and orange", width:1200, height:1200,
    rightsStatus: "external-reference", rightsHolder: "TodoCircuito", sourceLabel: "Editorial product image · KTM RC 390", sourceUrl: "https://www.todocircuito.com/noticias/27805-nueva-ktm-rc-390-2022%3A-presentacion-oficial-y-fotos-de-la-renovada-supersport-austriaca.html", lastChecked: "2026-09-09"
  },
  {
    id: "honda-gold-wing-hondanews", entityType: "motorcycle", entityId: "honda-gold-wing", role: "primary",
    src:"/media/motorcycles/honda-gold-wing.webp", sourceImageUrl:"https://hondanews.eu/image/motorcycles/low/453308/1_18/5?v=2", alt: "Honda Gold Wing Tour luxury touring motorcycle", width:1200, height:1200,
    rightsStatus: "external-reference", rightsHolder: "Honda Motor Europe", sourceLabel: "Official Honda media image · Gold Wing Tour", sourceUrl: "https://hondanews.eu/pl/pl/motorcycles/media/pressreleases/453353/honda-gold-wing-tour-na-rok-modelowy-2024", lastChecked: "2026-09-09"
  },
  {
    id: "honda-rebel-1100-official", entityType: "motorcycle", entityId: "honda-rebel-1100", role: "primary", sourceImageUrl:"https://hondamotodavanopoulos.gr/wp-content/uploads/2024/12/25YM_CMX1100-Rebel_Studio_MT_PEARL-HAWKSEYE-BLUE_RHS.jpg",
    src:"/media/motorcycles/honda-rebel-1100.webp", alt: "Honda Rebel 1100 cruiser motorcycle product image", width:1200, height:1200,
    rightsStatus: "external-reference", rightsHolder:"Honda Davanopoulos / Honda", sourceLabel:"Honda dealer studio image · 2025 CMX1100 Rebel", sourceUrl:"https://hondamotodavanopoulos.gr/product/cmx-1100-rebel/", lastChecked: "2026-09-24"
  },
  {
    id: "honda-rebel-500-manila", entityType: "motorcycle", entityId: "honda-rebel-500", role: "primary",
    src:"/media/motorcycles/honda-rebel-500.webp", sourceImageUrl:"https://cdn.riderly.com/storage/media/img/bikes/honda__rebel%20500.png", alt: "Honda Rebel 500 cruiser in silver", width:1200, height:1200,
    rightsStatus: "external-reference", rightsHolder: "Riderly / Motorent Manila", sourceLabel: "Philippine rental product image · Honda Rebel 500", sourceUrl: "https://www.motorentmanila.com/motorcycles/honda-rebel-500", lastChecked: "2026-09-09"
  },

  {
    id: "suzuki-burgman-400-manual", entityType: "motorcycle", entityId: "suzuki-burgman-400", role: "primary",
    src:"/media/motorcycles/suzuki-burgman-400.webp", sourceImageUrl: "https://mc.suzuki.com.ph/wp-content/uploads/2023/11/19-17-1024x576.webp", alt: "Suzuki Burgman 400 motorcycle", width:1200, height:1200,
    rightsStatus: "external-reference", rightsHolder: "Suzuki Philippines", sourceLabel: "Manufacturer product image · Suzuki Burgman 400", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/big-bike/burgman-400/", lastChecked: "2026-09-24"
  },
  {
    id: "yamaha-yzf-r1m-manual-2024", entityType: "motorcycle", entityId: "yamaha-yzf-r1m", role: "primary",
    src:"/media/motorcycles/yamaha-yzf-r1m.webp", sourceImageUrl:"https://news.yamaha-motor.co.jp/jp/news/assets_c/2023/11/79555_0001-thumb-4000x2987-251212.jpg", alt: "Yamaha YZF-R1M motorcycle in Carbon", width:1200, height:1200,
    rightsStatus: "external-reference", rightsHolder: "Yamaha Motor", sourceLabel: "Manufacturer image · YZF-R1M", sourceUrl:"https://global.yamaha-motor.com/jp/news/2023/1121/yzf-r1.html", lastChecked: "2026-09-21"
  },
  {
    id: "royal-enfield-meteor-350-manual", entityType: "motorcycle", entityId: "royal-enfield-meteor-350", role: "primary",
    src:"/media/motorcycles/royal-enfield-meteor-350.webp", sourceImageUrl:"https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/meteor-350/colours/new/supernova-red/super_nova_red_000.webp", alt: "Royal Enfield Meteor 350 motorcycle in Supernova Red", width:1200, height:1200,
    rightsStatus: "external-reference", rightsHolder: "Royal Enfield", sourceLabel: "Manufacturer image · Meteor 350", sourceUrl:"https://www.royalenfield.com/ph/en/motorcycles/meteor-350/", lastChecked: "2026-09-21"
  },
  {
    id: "triumph-speed-twin-900-manual", entityType: "motorcycle", entityId: "triumph-speed-twin-900", role: "primary",
    src:"/media/motorcycles/triumph-speed-twin-900.webp", sourceImageUrl:"https://media.triumphmotorcycles.co.uk/image/upload/t_/c_limit%2Cw_3840/f_auto/q_auto%3Aeco/v1726581550/ACC_SpeedTwin900_MY25_CW4I2017_GE_fvfq08?_a=BAVMn6ID0", alt: "Triumph Speed Twin 900 motorcycle", width:1200, height:1200,
    rightsStatus: "external-reference", rightsHolder: "Triumph Motorcycles", sourceLabel: "Manufacturer image · Speed Twin 900", sourceUrl:"https://www.triumphmotorcycles.ph/bikes/classic/speed/speed-twin-900", lastChecked: "2026-09-21"
  },
  {
    id: "royal-enfield-interceptor-650-manual", entityType: "motorcycle", entityId: "royal-enfield-interceptor-650", role: "primary",
    src:"/media/motorcycles/royal-enfield-interceptor-650.webp", sourceImageUrl:"https://www.royalenfield.com/content/dam/royal-enfield/mexico/motorcycles/interceptor/colours/new/studio-shots/cali-green/side-view.png", alt: "Royal Enfield Interceptor 650 motorcycle in Cali Green", width:1200, height:1200,
    rightsStatus: "external-reference", rightsHolder: "Royal Enfield", sourceLabel: "Manufacturer image · Interceptor 650", sourceUrl:"https://www.royalenfield.com/ph/en/motorcycles/interceptor/", lastChecked: "2026-09-21"
  },
  {
    id: "royal-enfield-continental-gt-650-manual", entityType: "motorcycle", entityId: "royal-enfield-continental-gt-650", role: "primary",
    src:"/media/motorcycles/royal-enfield-continental-gt-650.webp", sourceImageUrl:"https://www.royalenfield.com/content/dam/royal-enfield/mexico/motorcycles/continental-gt/colours/studio-shots/new/apex-grey/side-view.png", alt: "Royal Enfield Continental GT 650 motorcycle in Apex Grey", width:1200, height:1200,
    rightsStatus: "external-reference", rightsHolder: "Royal Enfield", sourceLabel: "Manufacturer image · Continental GT 650", sourceUrl:"https://www.royalenfield.com/ph/en/motorcycles/continental-gt/", lastChecked: "2026-09-21"
  },
  {
    id: "royal-enfield-bear-650-manual", entityType: "motorcycle", entityId: "royal-enfield-bear-650", role: "primary",
    src: "/media/motorcycles/royal-enfield-bear-650.webp", sourceImageUrl: "https://cdn.bikedekho.com/upload/userfiles/images/6721ffc56d6e7.jpg", alt: "Royal Enfield Bear 650 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Royal Enfield", sourceLabel: "Manufacturer image · Bear 650", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/bear-650/", lastChecked: "2026-09-21"
  },
  {
    id: "honda-adv-150-honda-global", entityType: "motorcycle", entityId: "honda-adv-150", role: "primary",
    src: "/media/motorcycles/honda-adv-150.webp", sourceImageUrl: "https://global.honda/content/site/global-jp/news-new/pc/2019/2191220-adv150/_jcr_content/par_news-body/newscolumn/par_news-col-1/newsimage_422072922.img.jpg/1715852708564.jpg", alt: "Honda ADV150 adventure scooter in Matte Meteorite Brown Metallic", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda Motor Co., Ltd.", sourceLabel: "Manufacturer-hosted historical image reference · Honda ADV150", sourceUrl: "https://global.honda/jp/news/2019/2191220-adv150.html", lastChecked: "2026-09-22"
  },
  {
    id: "kawasaki-ninja-zx-4rr-manufacturer", entityType: "motorcycle", entityId: "kawasaki-ninja-zx-4rr", role: "primary",
    src: "/media/motorcycles/kawasaki-ninja-zx-4rr.webp", sourceImageUrl: "https://www.kawasaki-lifestyle.com/content/dam/products/pim/studio/Resource_320398_26ZX400S_141GN1DRF3CG_A.jpg/_jcr_content/renditions/cq5dam.thumbnail.600.600.png", alt: "Kawasaki Ninja ZX-4RR motorcycle in Lime Green", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors, Ltd.", sourceLabel: "Manufacturer-hosted current image reference · Kawasaki Ninja ZX-4RR", sourceUrl: "https://www.kawasaki-lifestyle.com/en/motorcycles/ninja/ninja-zx-4rr-2026.html", lastChecked: "2026-09-22"
  },
  {
    id: "honda-x-adv-honda-global", entityType: "motorcycle", entityId: "honda-x-adv", role: "primary",
    src: "/media/motorcycles/honda-x-adv.webp", sourceImageUrl: "https://global.honda/content/dam/site/global-jp/news-new/cq_img/2026/01/2260130-x-adv/2260130-x-adv_01.jpg", alt: "Honda X-ADV 745cc DCT motorcycle in Matte Pearl Glare White", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda Motor Co., Ltd.", sourceLabel: "Manufacturer-hosted current image reference · Honda X-ADV", sourceUrl: "https://global.honda/jp/news/2026/2260130-x-adv.html", lastChecked: "2026-09-22"
  },
  {
    id: "cfmoto-300sr-cfmoto-sg", entityType: "motorcycle", entityId: "cfmoto-300sr", role: "primary",
    src: "/media/motorcycles/cfmoto-300sr.webp", sourceImageUrl: "https://static.wixstatic.com/media/496e53_d972b01b15424f42a22810fb38393614~mv2.png", alt: "CFMOTO 300SR sport motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "CFMOTO Singapore", sourceLabel: "Regional CFMOTO product image reference · 300SR", sourceUrl: "https://www.cfmoto.com.sg/sr-series", lastChecked: "2026-09-24"
  },
  {
    id: "cfmoto-400nk-regional-reference", entityType: "motorcycle", entityId: "cfmoto-400nk", role: "primary",
    src: "/media/motorcycles/cfmoto-400nk.webp", sourceImageUrl: "https://cfmotord.com/wp-content/uploads/2020/05/20200312104205.png", alt: "CFMOTO 400NK naked motorcycle in white and teal", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "CFMOTO regional distributor", sourceLabel: "Regional CFMOTO product image reference · 400NK", sourceUrl: "https://cfmotord.com/motocicletas/400nk/", lastChecked: "2026-09-24"
  },
  {
    id: "honda-airblade-160-honda-official", entityType: "motorcycle", entityId: "honda-airblade-160", role: "primary",
    src: "/media/motorcycles/honda-airblade-160.webp", sourceImageUrl: "https://cdn.honda.com.vn/motorbike-versions/Image360/November2025/1762148885/0.png", alt: "Honda AirBlade 160 scooter", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda Vietnam", sourceLabel: "Manufacturer-hosted transparent product image · Honda AirBlade 160", sourceUrl: "https://www.honda.com.vn/xe-may/san-pham/air-blade-160125?changeVersionFlag=2025", lastChecked: "2026-09-24"
  },
  {
    id: "honda-cbr150r-honda-ph", entityType: "motorcycle", entityId: "honda-cbr150r", role: "primary",
    src: "/media/motorcycles/honda-cbr150r.webp", sourceImageUrl: "https://asset.astra-honda.com/uploads/product/thumbnail/thumbnail-cbr150r-550x413px-tr-new-2-21112024-100742.png", alt: "Honda CBR150R sport motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Astra Honda Motor", sourceLabel: "Manufacturer-hosted product image · Astra Honda CBR150R", sourceUrl: "https://www.astra-honda.com/product/cbr-150-r", lastChecked: "2026-09-24"
  },
  {
    id: "honda-cbr650r-honda-global", entityType: "motorcycle", entityId: "honda-cbr650r", role: "primary",
    src: "/media/motorcycles/honda-cbr650r.webp", sourceImageUrl: "https://global.honda/content/dam/site/global-en/newsroom-new/cq_img/news/2023/11/dl/c231107a_004H.jpg", alt: "Honda CBR650R E-Clutch sport motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda Motor Co., Ltd.", sourceLabel: "Manufacturer-hosted image reference · Honda CBR650R", sourceUrl: "https://global.honda/en/newsroom/news/2023/c231107aeng/image_download.html", lastChecked: "2026-09-23"
  },
  {
    id: "honda-crf1100l-africa-twin-honda-global", entityType: "motorcycle", entityId: "honda-crf1100l-africa-twin", role: "primary",
    src: "/media/motorcycles/honda-crf1100l-africa-twin.webp", sourceImageUrl: "https://global.honda/content/dam/site/global-en/newsroom-new/cq_img/news/2026/01/2260123eng-crf1100l/web/2260123-crf1100l_001L.jpg", alt: "Honda CRF1100L Africa Twin adventure motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda Motor Co., Ltd.", sourceLabel: "Manufacturer-hosted image reference · Honda CRF1100L Africa Twin", sourceUrl: "https://global.honda/en/newsroom/news/2026/2260123eng-crf1100l.html", lastChecked: "2026-09-23"
  },
  {
    id: "honda-xl750-transalp-honda-global", entityType: "motorcycle", entityId: "honda-xl750-transalp", role: "primary",
    src: "/media/motorcycles/honda-xl750-transalp.webp", sourceImageUrl: "https://global.honda/content/dam/site/global-en/newsroom-new/cq_img/news/2026/03/2260306eng-xl750/web/2260306-xl750_001L.jpg", alt: "Honda XL750 Transalp adventure motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda Motor Co., Ltd.", sourceLabel: "Manufacturer-hosted image reference · Honda XL750 Transalp", sourceUrl: "https://global.honda/en/newsroom/news/2026/2260306eng-xl750.html", lastChecked: "2026-09-23"
  },
  {
    id: "yamaha-lexi-155-yamaha-official", entityType: "motorcycle", entityId: "yamaha-lexi-155", role: "primary",
    src: "/media/motorcycles/yamaha-lexi-155.webp", sourceImageUrl: "https://www.yamaha-motor.co.id/uploads/products/new_product_model_image/202601210136411054B75592.png", alt: "Yamaha LEXi LX 155 scooter", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Yamaha Motor", sourceLabel: "Manufacturer-hosted image reference · Yamaha LEXi LX 155", sourceUrl: "https://www.yamaha-motor.co.id/product/lexi-lx-155/", lastChecked: "2026-09-23"
  },
  {
    id: "yamaha-yzf-r3-yamaha-global", entityType: "motorcycle", entityId: "yamaha-yzf-r3", role: "primary",
    src: "/media/motorcycles/yamaha-yzf-r3.webp", sourceImageUrl: "https://global.yamaha-motor.com/jp/news/assets_c/2025/03/105849_0001-thumb-1360x1019-260019.jpg", alt: "Yamaha YZF-R3 sport motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Yamaha Motor Co., Ltd.", sourceLabel: "Manufacturer-hosted image reference · Yamaha YZF-R3", sourceUrl: "https://global.yamaha-motor.com/jp/news/2025/0318/yzf-r3.html", lastChecked: "2026-09-23"
  },
  {
    id: "yamaha-yzf-r7-yamaha-global", entityType: "motorcycle", entityId: "yamaha-yzf-r7", role: "primary",
    src: "/media/motorcycles/yamaha-yzf-r7.webp", sourceImageUrl: "https://global.yamaha-motor.com/jp/news/topics_assets/132520_0001.jpg", alt: "Yamaha YZF-R7 sport motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Yamaha Motor Co., Ltd.", sourceLabel: "Manufacturer-hosted image reference · Yamaha YZF-R7", sourceUrl: "https://global.yamaha-motor.com/jp/news/2026/0409/yzf.html", lastChecked: "2026-09-23"
  },
  {
    id: "kawasaki-z900-kawasaki-global", entityType: "motorcycle", entityId: "kawasaki-z900", role: "primary",
    src: "/media/motorcycles/kawasaki-z900.webp", sourceImageUrl: "https://global.kawasaki.com/en/corp/newsroom/news/images/news_241031-Z900%20.jpg", alt: "Kawasaki Z900 naked motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors, Ltd.", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Z900", sourceUrl: "https://global.kawasaki.com/en/corp/newsroom/news/detail/?f=20241031_1292", lastChecked: "2026-09-23"
  },
  {
    id: "yamaha-yzf-r15m-yamaha-india", entityType: "motorcycle", entityId: "yamaha-yzf-r15m", role: "primary",
    src: "/media/motorcycles/yamaha-yzf-r15m.webp", sourceImageUrl: "https://shop.yamaha-motor-india.com/cdn/shop/files/metallic_grey.webp?v=1757050338", alt: "Yamaha R15M sport motorcycle in Metallic Grey", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "India Yamaha Motor", sourceLabel: "Manufacturer e-shop image reference · Yamaha R15M", sourceUrl: "https://shop.yamaha-motor-india.com/products/buy-r15m", lastChecked: "2026-09-23"
  },
  {
    id: "bmw-f-900-gs-bmw-official", entityType: "motorcycle", entityId: "bmw-f-900-gs", role: "primary",
    src: "/media/motorcycles/bmw-f-900-gs.webp", sourceImageUrl: "https://mediapool.bmwgroup.com/cache/P9/202402/P90539201/P90539201-the-bmw-f-900-gs-on-road-stills-02-2024-2250px.jpg", alt: "BMW F 900 GS adventure motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "BMW Motorrad", sourceLabel: "Manufacturer-hosted image reference · BMW F 900 GS", sourceUrl: "https://www.press.bmwgroup.com/global/photo/detail/P90539201/The-BMW-F-900-GS-On-road-stills-02-2024", lastChecked: "2026-09-23"
  },
  {
    id: "bmw-m-1000-rr-bmw-official", entityType: "motorcycle", entityId: "bmw-m-1000-rr", role: "primary",
    src: "/media/motorcycles/bmw-m-1000-rr.webp", sourceImageUrl: "https://mediapool.bmwgroup.com/cache/P9/202410/P90572497/P90572497-the-new-bmw-m-1000-rr-10-2024-2248px.jpg", alt: "BMW M 1000 RR superbike", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "BMW Motorrad", sourceLabel: "Manufacturer-hosted image reference · BMW M 1000 RR", sourceUrl: "https://www.press.bmwgroup.com/global/photo/detail/P90572497/the-new-bmw-m-1000-rr-10/2024", lastChecked: "2026-09-23"
  },
  {
    id: "bmw-s-1000-r-bmw-official", entityType: "motorcycle", entityId: "bmw-s-1000-r", role: "primary",
    src: "/media/motorcycles/bmw-s-1000-r.webp", sourceImageUrl: "https://mediapool.bmwgroup.com/cache/P9/202410/P90572565/P90572565-the-new-bmw-s-1000-r-10-2024-2248px.jpg", alt: "BMW S 1000 R roadster motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "BMW Motorrad", sourceLabel: "Manufacturer-hosted image reference · BMW S 1000 R", sourceUrl: "https://www.press.bmwgroup.com/global/photo/detail/P90572565/The-new-BMW-S-1000-R-10-2024", lastChecked: "2026-09-23"
  },
  {
    id: "bmw-s-1000-rr-bmw-official", entityType: "motorcycle", entityId: "bmw-s-1000-rr", role: "primary",
    src: "/media/motorcycles/bmw-s-1000-rr.webp", sourceImageUrl: "https://mediapool.bmwgroup.com/cache/P9/202212/P90490356/P90490356-the-new-bmw-s-1000-rr-12-2022-2250px.jpg", alt: "BMW S 1000 RR superbike", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "BMW Motorrad", sourceLabel: "Manufacturer-hosted image reference · BMW S 1000 RR", sourceUrl: "https://www.press.bmwgroup.com/global/photo/detail/P90490356/the-new-bmw-s-1000-rr-12/2022", lastChecked: "2026-09-23"
  },
  {
    id: "ducati-panigale-v4-ducati-official", entityType: "motorcycle", entityId: "ducati-panigale-v4", role: "primary",
    src: "/media/motorcycles/ducati-panigale-v4.webp", sourceImageUrl: "https://mediahouse.ducati.com/wp-content/uploads/2026/06/dcccaccc6172a7544fc13b2c80e9a0b4-l.jpg", alt: "Ducati Panigale V4 superbike", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Ducati", sourceLabel: "Manufacturer-hosted image reference · Ducati Panigale V4", sourceUrl: "https://mediahouse.ducati.com/new-panigale-v4-my25/?lang=oci", lastChecked: "2026-09-23"
  },
  {
    id: "ducati-streetfighter-v4-ducati-official", entityType: "motorcycle", entityId: "ducati-streetfighter-v4", role: "primary",
    src: "/media/motorcycles/ducati-streetfighter-v4.webp", sourceImageUrl: "https://mediahouse.ducati.com/wp-content/uploads/2026/06/70765e11d7fa5f0f946d73c85e421c8c-l.jpg", alt: "Ducati Streetfighter V4 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Ducati", sourceLabel: "Manufacturer-hosted image reference · Ducati Streetfighter V4", sourceUrl: "https://mediahouse.ducati.com/new-streetfighter-v4-s-my25/?lang=oci", lastChecked: "2026-09-23"
  },
  {
    id: "honda-cb500-hornet-e-clutch-honda-uk", entityType: "motorcycle", entityId: "honda-cb500-hornet-e-clutch", role: "primary",
    src: "/media/motorcycles/honda-cb500-hornet-e-clutch.webp", sourceImageUrl: "https://www.honda.co.uk/content/dam/central/motorcycles/colour-picker/street/cb500_hornet/cb500_hornet_2026/nh-b01_graphite_black/K002_26YM_CB500HORNET_MT_NH-B01_GraphiteBlack_RhSide.png", alt: "Honda CB500 Hornet E-Clutch motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Honda", sourceLabel: "Manufacturer product image · Honda CB500 Hornet", sourceUrl: "https://www.honda.co.uk/motorcycles/range/street/cb500-hornet/overview.html", lastChecked: "2026-09-24"
  },
  {
    id: "kawasaki-eliminator-kawasaki-official", entityType: "motorcycle", entityId: "kawasaki-eliminator", role: "primary",
    src: "/media/motorcycles/kawasaki-eliminator.webp", sourceImageUrl: "https://www.kawasaki.eu/content/dam/products/pim/studio/Resource_320178_26EL450A_44TRD1DRF3CG_A.jpg/_jcr_content/renditions/cq5dam.thumbnail.600.600.png", alt: "Kawasaki Eliminator cruiser motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors Corp., U.S.A.", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Eliminator", sourceUrl: "https://www.kawasaki.eu/en/Motorcycles/A2_Bikes/eliminator_500_2026.html", lastChecked: "2026-09-23"
  },
  {
    id: "kawasaki-ninja-650-kawasaki-official", entityType: "motorcycle", entityId: "kawasaki-ninja-650", role: "primary",
    src: "/media/motorcycles/kawasaki-ninja-650.webp", sourceImageUrl: "https://www.kawasaki.eu/content/dam/europe/master/eicma-2025/ninja-650/26EX650P_S_242GN1ALFA2CG_A.jpg", alt: "Kawasaki Ninja 650 sport motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors Corp., U.S.A.", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Ninja 650", sourceUrl: "https://www.kawasaki.eu/en/EICMA/Ninja_650.html", lastChecked: "2026-09-23"
  },
  {
    id: "kawasaki-ninja-h2-kawasaki-official", entityType: "motorcycle", entityId: "kawasaki-ninja-h2", role: "primary",
    src: "/media/motorcycles/kawasaki-ninja-h2.webp", sourceImageUrl: "https://images5.1000ps.net/images_bikekat/2018/6-Kawasaki/8760-Ninja_H2_Carbon/004.jpg", alt: "Kawasaki Ninja H2 supercharged motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "1000PS / Kawasaki", sourceLabel: "Exact-model studio image · Kawasaki Ninja H2 Carbon", sourceUrl: "https://www.1000ps.ch/de/motorradvergleich-kawasaki-ninja-h2-carbon-2018-vs-kawasaki-ninja-zx-10r-2021-215707", lastChecked: "2026-09-24"
  },
  {
    id: "kawasaki-versys-650-kawasaki-official", entityType: "motorcycle", entityId: "kawasaki-versys-650", role: "primary",
    src: "/media/motorcycles/kawasaki-versys-650.webp", sourceImageUrl: "https://www.kawasaki.eu/content/dam/europe/master/eicma-2025/versys-650/26KLE650H_J_44TBU1AFA2CG_C.jpg", alt: "Kawasaki Versys 650 touring motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors Corp., U.S.A.", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Versys 650", sourceUrl: "https://www.kawasaki.eu/en/EICMA/Versys_650.html", lastChecked: "2026-09-23"
  },
  {
    id: "kawasaki-vulcan-s-kawasaki-official", entityType: "motorcycle", entityId: "kawasaki-vulcan-s", role: "primary",
    src: "/media/motorcycles/kawasaki-vulcan-s.webp", sourceImageUrl: "https://www.kawasaki.eu/content/dam/europe/master/eicma-2025/vulcan-s/26EN650D_M_44TGY1ARS2CG_C.jpg", alt: "Kawasaki Vulcan S cruiser motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors Corp., U.S.A.", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Vulcan S", sourceUrl: "https://www.kawasaki.eu/en/EICMA/Vulcan_S.html", lastChecked: "2026-09-23"
  },
  {
    id: "kawasaki-z-h2-kawasaki-official", entityType: "motorcycle", entityId: "kawasaki-z-h2", role: "primary",
    src: "/media/motorcycles/kawasaki-z-h2.webp", sourceImageUrl: "https://www.kawasaki.eu/content/dam/products/pim/studio/zr/Resource_333614_27_ZR1000K_P_40T_BK1_DA_RF_K.jpg/_jcr_content/renditions/cq5dam.thumbnail.600.600.png", alt: "Kawasaki Z H2 supercharged motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors Corp., U.S.A.", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Z H2", sourceUrl: "https://www.kawasaki.eu/en/Motorcycles/Supernaked/Z_H2_2027.html", lastChecked: "2026-09-23"
  },
  {
    id: "kawasaki-z650-kawasaki-official", entityType: "motorcycle", entityId: "kawasaki-z650", role: "primary",
    src: "/media/motorcycles/kawasaki-z650.webp", sourceImageUrl: "https://www.kawasaki.eu/content/dam/products/pim/studio/s/Resource_320250_26ER650N_S_44TWT1DRF3CG_A.jpg/_jcr_content/renditions/cq5dam.thumbnail.600.600.png", alt: "Kawasaki Z650 naked motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors Corp., U.S.A.", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Z650", sourceUrl: "https://www.kawasaki.eu/en/Motorcycles/A2_Bikes/Z650_2026.html", lastChecked: "2026-09-23"
  },
  {
    id: "ktm-200-duke-ktm-ph", entityType: "motorcycle", entityId: "ktm-200-duke", role: "primary",
    src: "/media/motorcycles/ktm-200-duke.webp", sourceImageUrl: "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_90_RE_DUKE-200-M23-90-degreerightt-side_%23SALL_%23AEPI_%23V1.png", alt: "KTM 200 Duke naked motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "KTM", sourceLabel: "Manufacturer-hosted Philippine image reference · KTM 200 Duke", sourceUrl: "https://www.ktm.com/en-ph/models/naked-bike/2023-ktm-200-duke.html", lastChecked: "2026-09-23"
  },
  {
    id: "ktm-790-duke-ktm-official", entityType: "motorcycle", entityId: "ktm-790-duke", role: "primary",
    src: "/media/motorcycles/ktm-790-duke.webp", sourceImageUrl: "https://s7g10.scene7.com/is/image/ktm/KTM-2025-naked-bike-790-duke-homepage-baner?$ogimage$", alt: "KTM 790 Duke naked motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "KTM", sourceLabel: "Manufacturer-hosted image reference · KTM 790 Duke", sourceUrl: "https://www.ktm.com/en-lk/ktm-world/news/the-original-scalpel-gets-a-sharpening-for-2025-.html", lastChecked: "2026-09-23"
  },
  {
    id: "triumph-daytona-660-triumph-official", entityType: "motorcycle", entityId: "triumph-daytona-660", role: "primary",
    src: "/media/motorcycles/triumph-daytona-660.webp", sourceImageUrl: "https://media.triumphmotorcycles.co.uk/image/upload/t_/c_limit,w_3840/f_auto/q_auto:eco/v1770648998/Daytona_660_MY26_4553_JP_dlstgh?_a=BAVMn6ID0", alt: "Triumph Daytona 660 sport motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Triumph Motorcycles", sourceLabel: "Manufacturer-hosted image reference · Triumph Daytona 660", sourceUrl: "https://www.triumphmotorcycles.com/motorcycles/sport/daytona/daytona-660", lastChecked: "2026-09-23"
  },
  {
    id: "triumph-tiger-sport-660-triumph-official", entityType: "motorcycle", entityId: "triumph-tiger-sport-660", role: "primary",
    src: "/media/motorcycles/triumph-tiger-sport-660.webp", sourceImageUrl: "https://media.triumphmotorcycles.co.uk/image/upload/t_triumph_square/c_limit,w_3840/f_auto/q_auto:eco/v1767708363/TigerSport660_MY26_11_MP_qwlgrp?_a=BAVMn6ID0", alt: "Triumph Tiger Sport 660 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Triumph Motorcycles", sourceLabel: "Manufacturer-hosted image reference · Triumph Tiger Sport 660", sourceUrl: "https://www.triumphmotorcycles.com/motorcycles/adventure/tiger-sport/tiger-sport-660", lastChecked: "2026-09-23"
  },
  {
    id: "royal-enfield-super-meteor-650-re-ph", entityType: "motorcycle", entityId: "royal-enfield-super-meteor-650", role: "primary",
    src: "/media/motorcycles/royal-enfield-super-meteor-650.webp", sourceImageUrl: "https://www.royalenfield.com/content/dam/royal-enfield/super-meteor-650/motorcycles/colors/studio-shots/astral-black/new/astral_black_000.webp", alt: "Royal Enfield Super Meteor 650 cruiser motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Royal Enfield", sourceLabel: "Manufacturer-hosted Philippine image reference · Super Meteor 650", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/super-meteor-650/", lastChecked: "2026-09-23"
  },
  {
    id: "royal-enfield-classic-650-re-ph", entityType: "motorcycle", entityId: "royal-enfield-classic-650", role: "primary",
    src: "/media/motorcycles/royal-enfield-classic-650.webp", sourceImageUrl: "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/classic-650/hotspot/hot-spot.png", alt: "Royal Enfield Classic 650 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Royal Enfield", sourceLabel: "Manufacturer-hosted Philippine image reference · Classic 650", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/classic-650/", lastChecked: "2026-09-23"
  },
  {
    id: "cfmoto-300nk-verified-20260923", entityType: "motorcycle", entityId: "cfmoto-300nk", role: "primary",
    src: "/media/motorcycles/cfmoto-300nk.webp", sourceImageUrl: "https://static.wixstatic.com/media/0a0f90_4fd511fbd3fb4f90801ae08e131d327e~mv2.png", alt: "CFMOTO 300NK motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "CFMOTO Philippines", sourceLabel: "Official Philippine distributor image reference · CFMOTO 300NK", sourceUrl: "https://www.cfmotoph.com/motorcycle/300nk", lastChecked: "2026-09-23"
  },
  {
    id: "keeway-cafe-racer-152-verified-20260923", entityType: "motorcycle", entityId: "keeway-cafe-racer-152", role: "primary",
    src: "/media/motorcycles/keeway-cafe-racer-152.webp", sourceImageUrl: "https://cdn.keeway.com/keeway-3-0/media/887/conversions/Cafe-Racer-152-Green-md.png", alt: "Keeway Cafe Racer 152 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Keeway", sourceLabel: "Manufacturer-hosted image reference · Keeway Cafe Racer 152", sourceUrl: "https://www.keeway.com/ph-en/products/cafe-racer-152", lastChecked: "2026-09-23"
  },
  {
    id: "bajaj-dominar-400-verified-20260923", entityType: "motorcycle", entityId: "bajaj-dominar-400", role: "primary",
    src: "/media/motorcycles/bajaj-dominar-400.webp", sourceImageUrl: "https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/dominar-400/16-axis/400-green/00.png", alt: "Bajaj Dominar 400 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bajaj Auto", sourceLabel: "Manufacturer-hosted image reference · Bajaj Dominar 400", sourceUrl: "https://www.bajajauto.com/bikes/dominar/dominar-400", lastChecked: "2026-09-23"
  },
  {
    id: "bristol-maxxie-160-verified-20260923", entityType: "motorcycle", entityId: "bristol-maxxie-160", role: "primary",
    src: "/media/motorcycles/bristol-maxxie-160.webp", sourceImageUrl: "https://static.wixstatic.com/media/fc6fc6_cc44654b325c443788aea90b315dc6ef~mv2.png", alt: "Bristol Maxxie 160 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bristol Motorcycles", sourceLabel: "Philippine distributor image reference · Bristol Maxxie 160", sourceUrl: "https://www.bristol-motorcycles.com/maxxie-160", lastChecked: "2026-09-23"
  },
  {
    id: "bajaj-pulsar-n160-verified-20260923", entityType: "motorcycle", entityId: "bajaj-pulsar-n160", role: "primary",
    src: "/media/motorcycles/bajaj-pulsar-n160.webp", sourceImageUrl: "https://www.bajajauto.com/assets/bikeImages/Old_variant/Black/0089.webp", alt: "Bajaj Pulsar N160 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bajaj Auto", sourceLabel: "Manufacturer-hosted image reference · Bajaj Pulsar N160", sourceUrl: "https://www.bajajauto.com/bikes/pulsar/pulsar-n160", lastChecked: "2026-09-23"
  },
  {
    id: "bajaj-pulsar-ns400z-verified-20260923", entityType: "motorcycle", entityId: "bajaj-pulsar-ns400z", role: "primary",
    src: "/media/motorcycles/bajaj-pulsar-ns400z.webp", sourceImageUrl: "https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/pulsar-2025-ns400z/gallery/1.webp", alt: "Bajaj Pulsar NS400Z motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bajaj Auto", sourceLabel: "Manufacturer-hosted image reference · Bajaj Pulsar NS400Z", sourceUrl: "https://www.bajajauto.com/bikes/pulsar/pulsar-ns400z", lastChecked: "2026-09-23"
  },
  {
    id: "bajaj-pulsar-rs200-verified-20260923", entityType: "motorcycle", entityId: "bajaj-pulsar-rs200", role: "primary",
    src: "/media/motorcycles/bajaj-pulsar-rs200.webp", sourceImageUrl: "https://cdn.bajajauto.com/-/media/assets/bajajauto/360degreeimages/bikes/pulsar/pulsar-rs200-2026/white/00.webp", alt: "Bajaj Pulsar RS200 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bajaj Auto", sourceLabel: "Manufacturer-hosted image reference · Bajaj Pulsar RS200", sourceUrl: "https://www.bajajauto.com/bikes/pulsar/pulsar-rs200", lastChecked: "2026-09-23"
  },
  {
    id: "benelli-302s-verified-20260923", entityType: "motorcycle", entityId: "benelli-302s", role: "primary",
    src: "/media/motorcycles/benelli-302s.webp", sourceImageUrl: "https://cdn.keeway.com/benelli-3-0/media/5347/conversions/2560x2180-md.png", alt: "Benelli 302S motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Benelli", sourceLabel: "Manufacturer-hosted image reference · Benelli 302S", sourceUrl: "https://www.benelli.com/ph-en/products/302s-2", lastChecked: "2026-09-23"
  },
  {
    id: "benelli-leoncino-250-verified-20260923", entityType: "motorcycle", entityId: "benelli-leoncino-250", role: "primary",
    src: "/media/motorcycles/benelli-leoncino-250.webp", sourceImageUrl: "https://cdn.keeway.com/benelli-3-0/media/69/conversions/2560x2180-copy-2-md.png", alt: "Benelli Leoncino 250 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Benelli", sourceLabel: "Manufacturer-hosted image reference · Benelli Leoncino 250", sourceUrl: "https://www.benelli.com/ph-en/products/leoncino-250", lastChecked: "2026-09-23"
  },
  {
    id: "benelli-tnt-135-verified-20260923", entityType: "motorcycle", entityId: "benelli-tnt-135", role: "primary",
    src: "/media/motorcycles/benelli-tnt-135.webp", sourceImageUrl: "https://cdn.keeway.com/benelli-3-0/media/1628/conversions/2560x2180-md.png", alt: "Benelli TNT 135 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Benelli", sourceLabel: "Manufacturer-hosted image reference · Benelli TNT 135", sourceUrl: "https://www.benelli.com/ph-en/products/tnt-135", lastChecked: "2026-09-23"
  },
  {
    id: "benelli-trk-502-verified-20260923", entityType: "motorcycle", entityId: "benelli-trk-502", role: "primary",
    src: "/media/motorcycles/benelli-trk-502.webp", sourceImageUrl: "https://cdn.keeway.com/benelli-3-0/media/7114/conversions/2560x2180-md.png", alt: "Benelli TRK 502 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Benelli", sourceLabel: "Manufacturer-hosted image reference · Benelli TRK 502", sourceUrl: "https://www.benelli.com/ph-en/products/trk-502-3/", lastChecked: "2026-09-23"
  },
  {
    id: "bristol-basilica-125-verified-20260923", entityType: "motorcycle", entityId: "bristol-basilica-125", role: "primary",
    src: "/media/motorcycles/bristol-basilica-125.webp", sourceImageUrl: "https://static.wixstatic.com/media/fc6fc6_5396efc22a11441299b9025ed3df6364~mv2.png", alt: "Bristol Basilica 125 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bristol Motorcycles", sourceLabel: "Philippine distributor image reference · Bristol Basilica 125", sourceUrl: "https://www.bristol-motorcycles.com/basilica", lastChecked: "2026-09-23"
  },
  {
    id: "kawasaki-ninja-zx-25r-verified-20260923", entityType: "motorcycle", entityId: "kawasaki-ninja-zx-25r", role: "primary",
    src: "/media/motorcycles/kawasaki-ninja-zx-25r.webp", sourceImageUrl: "https://www.kawasaki-lifestyle.com/content/dam/products/pim/resource/Resource_307294_24ZX250H_141BK1DRF3CG_A.jpg/_jcr_content/renditions/cq5dam.thumbnail.600.600.png", alt: "Kawasaki Ninja ZX-25R motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Ninja ZX-25R", sourceUrl: "https://www.kawasaki-lifestyle.com/en/motorcycles/ninja/ninja-zx-25r-2024.dispdir.html/ZX250HRFNN/ZX250HRFNN.html", lastChecked: "2026-09-23"
  },
  {
    id: "royal-enfield-shotgun-650-verified-20260923", entityType: "motorcycle", entityId: "royal-enfield-shotgun-650", role: "primary",
    src: "/media/motorcycles/royal-enfield-shotgun-650.webp", sourceImageUrl: "https://www.royalenfield.com/content/dam/royal-enfield/shotgun-650/colors/stencil-white/stencil-white-000.png", alt: "Royal Enfield Shotgun 650 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Royal Enfield", sourceLabel: "Manufacturer-hosted image reference · Royal Enfield Shotgun 650", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/shotgun-650/", lastChecked: "2026-09-23"
  },
  {
    id: "kymco-agility-eco-125i-verified-20260923", entityType: "motorcycle", entityId: "kymco-agility-eco-125i", role: "primary",
    src: "/media/motorcycles/kymco-agility-eco-125i.webp", sourceImageUrl: "https://kymco.com.ph/wp-content/uploads/2026/06/AGILITY_ECO_125i_s3_1-scaled.png", alt: "Kymco Agility Eco 125i motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kymco Philippines", sourceLabel: "Manufacturer-hosted image reference · Kymco Agility Eco 125i", sourceUrl: "https://kymco.com.ph/product/agility-eco-125i/", lastChecked: "2026-09-23"
  },
  {
    id: "kymco-dink-r-150-verified-20260923", entityType: "motorcycle", entityId: "kymco-dink-r-150", role: "primary",
    src: "/media/motorcycles/kymco-dink-r-150.webp", sourceImageUrl: "https://kymco.com.ph/wp-content/uploads/2024/02/PL_COL11-2-700x467.png", alt: "Kymco Dink R 150 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kymco Philippines", sourceLabel: "Manufacturer-hosted image reference · Kymco Dink R 150", sourceUrl: "https://kymco.com.ph/product/dink-r-150/", lastChecked: "2026-09-23"
  },
  {
    id: "kymco-dink-s-150-verified-20260923", entityType: "motorcycle", entityId: "kymco-dink-s-150", role: "primary",
    src: "/media/motorcycles/kymco-dink-s-150.webp", sourceImageUrl: "https://kymco.com.ph/wp-content/uploads/2026/06/DINK-S-150-WHITE_1.png", alt: "Kymco Dink S 150 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kymco Philippines", sourceLabel: "Manufacturer-hosted image reference · Kymco Dink S 150", sourceUrl: "https://kymco.com.ph/product/dink-s-150/", lastChecked: "2026-09-23"
  },
  {
    id: "kymco-dollar-150-verified-20260923", entityType: "motorcycle", entityId: "kymco-dollar-150", role: "primary",
    src: "/media/motorcycles/kymco-dollar-150.webp", sourceImageUrl: "https://kymco.com.ph/wp-content/uploads/2025/04/Dollar-150-Pearly-White.png", alt: "Kymco Dollar 150 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kymco Philippines", sourceLabel: "Manufacturer-hosted image reference · Kymco Dollar 150", sourceUrl: "https://kymco.com.ph/product/dollar-150/", lastChecked: "2026-09-23"
  },
  {
    id: "kymco-sky-town-150-verified-20260923", entityType: "motorcycle", entityId: "kymco-sky-town-150", role: "primary",
    src: "/media/motorcycles/kymco-sky-town-150.webp", sourceImageUrl: "https://kymco.com.ph/wp-content/uploads/2024/11/SKYTOWN1-600x600.png", alt: "Kymco Sky Town 150 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kymco Philippines", sourceLabel: "Manufacturer-hosted image reference · Kymco Sky Town 150", sourceUrl: "https://kymco.com.ph/product/sky-town-150/", lastChecked: "2026-09-23"
  },
  {
    id: "kymco-dtx360-300-verified-20260923", entityType: "motorcycle", entityId: "kymco-dtx360-300", role: "primary",
    src: "/media/motorcycles/kymco-dtx360-300.webp", sourceImageUrl: "https://kymco.com.ph/wp-content/uploads/2024/02/PL_COL6-700x467.png", alt: "Kymco DTX360 300 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kymco Philippines", sourceLabel: "Manufacturer-hosted image reference · Kymco DTX360 300", sourceUrl: "https://kymco.com.ph/product/dtx-360-300/", lastChecked: "2026-09-23"
  },
  {
    id: "aprilia-tuareg-660-aprilia-store", entityType: "motorcycle", entityId: "aprilia-tuareg-660", role: "primary",
    src: "/media/motorcycles/aprilia-tuareg-660.webp", sourceImageUrl: "https://megabikes.ie/media/catalog/product/0/1/01-aprilia-tuareg-hailstorm-white_1.jpg", alt: "Aprilia Tuareg 660 adventure motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Megabikes Ireland", sourceLabel: "Dealer-hosted exact-model product image · Megabikes Aprilia Tuareg 660", sourceUrl: "https://megabikes.ie/aprilia-tuareg-660-25ym", lastChecked: "2026-09-24"
  },
  {
    id: "aprilia-tuono-660-aprilia-store", entityType: "motorcycle", entityId: "aprilia-tuono-660", role: "primary",
    src: "/media/motorcycles/aprilia-tuono-660.webp", sourceImageUrl: "https://storeusa.aprilia.com/img/slides/mainimg_tuono-660-factory-dark-banshee.png", alt: "Aprilia Tuono 660 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Aprilia", sourceLabel: "Manufacturer store image reference · Aprilia Tuono 660", sourceUrl: "https://storeusa.aprilia.com/tuono660.aspx", lastChecked: "2026-09-24"
  },
  {
    id: "bajaj-pulsar-n125-bajaj-official", entityType: "motorcycle", entityId: "bajaj-pulsar-n125", role: "primary",
    src: "/media/motorcycles/bajaj-pulsar-n125.webp", sourceImageUrl: "https://cdn.bajajauto.com/-/media/assets/bajajauto/bikes/pulsar-k-2024/360-images/mid-variants/caribbean-blue-for-n125/00.png", alt: "Bajaj Pulsar N125 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bajaj Auto", sourceLabel: "Manufacturer-hosted image reference · Bajaj Pulsar N125", sourceUrl: "https://www.bajajauto.com/bikes/pulsar/pulsar-n125", lastChecked: "2026-09-24"
  },
  {
    id: "husqvarna-norden-901-husqvarna-ph", entityType: "motorcycle", entityId: "husqvarna-norden-901", role: "primary",
    src: "/media/motorcycles/husqvarna-norden-901.webp", sourceImageUrl: "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_90_RE_norden901-90-right-my2021_%23SALL_%23AEPI_%23V1.png", alt: "Husqvarna Norden 901 adventure motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Husqvarna Motorcycles", sourceLabel: "Manufacturer-hosted Philippine image reference · Husqvarna Norden 901", sourceUrl: "https://www.husqvarna-motorcycles.com/en-ph/models/travel/norden-901-2022.html", lastChecked: "2026-09-24"
  },
  {
    id: "husqvarna-svartpilen-200-husqvarna-ph", entityType: "motorcycle", entityId: "husqvarna-svartpilen-200", role: "primary",
    src: "/media/motorcycles/husqvarna-svartpilen-200.webp", sourceImageUrl: "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_90_RE_svartpilen200-my22-90-right_%23SALL_%23AEPI_%23V1.png", alt: "Husqvarna Svartpilen 200 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Husqvarna Motorcycles", sourceLabel: "Manufacturer-hosted Philippine image reference · Husqvarna Svartpilen 200", sourceUrl: "https://www.husqvarna-motorcycles.com/en-ph/models/naked/svartpilen/svartpilen-200-2023.html", lastChecked: "2026-09-24"
  },
  {
    id: "kawasaki-ninja-1000-kawasaki-jp", entityType: "motorcycle", entityId: "kawasaki-ninja-1000", role: "primary",
    src: "/media/motorcycles/kawasaki-ninja-1000.webp", sourceImageUrl: "https://content2.kawasaki.com/ContentStorage/KMJ/Products/5291/0ad33454-8f03-491b-a91b-63a420a284fe.jpg?w=510&h=340&mode=crop", alt: "Kawasaki Ninja 1000SX sport touring motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kawasaki Motors Japan", sourceLabel: "Manufacturer-hosted image reference · Kawasaki Ninja 1000SX", sourceUrl: "https://www.kawasaki-motors.com/ja-jp/motorcycle/ninja/sport/ninja-1000sx/2024-ninja-1000sx", lastChecked: "2026-09-24"
  },
  {
    id: "kawasaki-z1000-r-edition-motosport", entityType: "motorcycle", entityId: "kawasaki-z1000-r-edition", role: "primary",
    src: "/media/motorcycles/kawasaki-z1000-r-edition.webp", sourceImageUrl: "https://www.motosport.com.gr/wp-content/uploads/2016/11/c66733db6fd9c6779ab24f57f69f5201_XL.jpg", alt: "Kawasaki Z1000 R Edition motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Motosport", sourceLabel: "Exact-model editorial image reference · Kawasaki Z1000 R Edition", sourceUrl: "https://www.motosport.com.gr/nea-kawasaki-z1000-r-edition-deltio-typou/", lastChecked: "2026-09-24"
  },
  {
    id: "rusi-adventure-x-150i-v2-kamote", entityType: "motorcycle", entityId: "rusi-adventure-x-150i-v2", role: "primary",
    src: "/media/motorcycles/rusi-adventure-x-150i-v2.webp", sourceImageUrl: "https://www.kamote.ph/cdn-cgi/image/lossless=true,w=760,h=760,f=webp,fit=contain/https://www.kamote.ph/Gallery/Rusi/Adventure_X_150i_V2.webp", alt: "Rusi Adventure X 150i V2 scooter", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kamote.ph", sourceLabel: "Philippine exact-model image reference · Rusi Adventure X 150i V2", sourceUrl: "https://www.kamote.ph/motorcycle/rusi-adventure-x-150i-v2", lastChecked: "2026-09-24"
  },
  {
    id: "rusi-cyclone-400-kamote", entityType: "motorcycle", entityId: "rusi-cyclone-400", role: "primary",
    src: "/media/motorcycles/rusi-cyclone-400.webp", sourceImageUrl: "https://www.kamote.ph/Gallery/Rusi/Cyclone_400.webp", alt: "Rusi Cyclone 400 motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kamote.ph", sourceLabel: "Philippine exact-model image reference · Rusi Cyclone 400", sourceUrl: "https://www.kamote.ph/motorcycle/rusi-cyclone-400", lastChecked: "2026-09-24"
  },
  {
    id: "rusi-flash-150x-kamote", entityType: "motorcycle", entityId: "rusi-flash-150x", role: "primary",
    src: "/media/motorcycles/rusi-flash-150x.webp", sourceImageUrl: "https://www.kamote.ph/Gallery/Rusi/Flash_150X.webp", alt: "Rusi Flash 150X motorcycle", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Kamote.ph", sourceLabel: "Philippine exact-model image reference · Rusi Flash 150X", sourceUrl: "https://www.kamote.ph/motorcycle/rusi-flash-150x", lastChecked: "2026-09-24"
  },
  {
    id: "zontes-150x-bristol-ph", entityType: "motorcycle", entityId: "zontes-150x", role: "primary",
    src: "/media/motorcycles/zontes-150x.webp", sourceImageUrl: "https://static.wixstatic.com/media/fc6fc6_f0f179bd64ef429899c029d40bd8876d~mv2.png", alt: "Zontes 150X scooter in Matte Black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bristol Motorcycles / Zontes", sourceLabel: "Official Philippine distributor image reference · Zontes 150X", sourceUrl: "https://www.bristol-motorcycles.com/150x", lastChecked: "2026-09-24"
  },
  {
    id: "zontes-400g-bristol-ph-final", entityType: "motorcycle", entityId: "zontes-400g", role: "primary",
    src: "/media/motorcycles/zontes-400g.webp", sourceImageUrl: "https://static.wixstatic.com/media/fc6fc6_f0c468ac8cf34e92a213e2901363cce2~mv2.png", alt: "Zontes 400G adventure scooter in Black", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bristol Motorcycles / Zontes", sourceLabel: "Official Philippine distributor image reference · Zontes 400G", sourceUrl: "https://www.bristol-motorcycles.com/400g", lastChecked: "2026-09-24"
  },
  {
    id: "zontes-703rr-bristol-ph", entityType: "motorcycle", entityId: "zontes-703rr", role: "primary",
    src: "/media/motorcycles/zontes-703rr.webp", sourceImageUrl: "https://static.wixstatic.com/media/fc6fc6_653ba8e34ba14041a83275d0ec3a24f0~mv2.png", alt: "Zontes 703RR sport motorcycle in Podium Red", width: 1200, height: 1200,
    rightsStatus: "external-reference", rightsHolder: "Bristol Motorcycles / Zontes", sourceLabel: "Official Philippine distributor image reference · Zontes 703RR", sourceUrl: "https://www.bristol-motorcycles.com/703rr", lastChecked: "2026-09-24"
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
