import type { Motorcycle } from "./types";

// Search-demand expansion for globally researched motorcycles.
// These records intentionally use srp: 0 and marketStatus: "uncertain" as a
// legacy guard so Philippine-only price, financing, dealer and recommendation
// flows cannot treat them as current PH inventory. Global pages never render
// this placeholder as a price. Search-volume fields stay zero until measured
// Search Console / keyword data is connected.
const verifiedAt = "2026-09-16";
const globalPriceContext = "Global research record. Availability and pricing vary by country; this is not a current Philippine dealer price.";

export const globalModelExpansion2026: Motorcycle[] = [
  {
    id: "bmw-r-1300-gs-adventure", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "R 1300 GS Adventure", slug: "r-1300-gs-adventure", generation: "Current global model", category: "Adventure touring",
    srp: 0, engineCc: 1300, powerHp: 145, torqueNm: 149, curbWeightKg: 269, seatHeightMm: 879, fuelTankL: 29.9,
    frontTire: "120/70 R19", rearTire: "170/60 R17", abs: "BMW Motorrad Full Integral ABS Pro", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad global R 1300 GS Adventure technical data", sourceUrl: "https://www.bmwmotorcycles.com/en/models/adventure/r1300gs-adventure/technicaldata.html", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 1300cc boxer adventure motorcycle with 145 hp, 149 Nm, a 29.9 L tank, 19/17-inch wheels and Full Integral ABS Pro."
  },
  {
    id: "bmw-m-1000-r", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "M 1000 R", slug: "m-1000-r", generation: "Current global model", category: "Naked street bike",
    srp: 0, engineCc: 999, powerHp: 205, torqueNm: 112.5, curbWeightKg: 199, seatHeightMm: 828, fuelTankL: 16.3,
    frontTire: "120/70 ZR17", rearTire: "200/55 ZR17", abs: "BMW Motorrad ABS Pro", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad global M 1000 R technical data", sourceUrl: "https://www.bmwmotorcycles.com/en/models/m/m1000r/technicaldata.html", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 999cc M roadster with 205 hp, BMW ShiftCam, forged wheels and BMW Motorrad ABS Pro."
  },
  {
    id: "bmw-m-1000-xr", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "M 1000 XR", slug: "m-1000-xr", generation: "Current global model", category: "Sport touring",
    srp: 0, engineCc: 999, powerHp: 201, torqueNm: 112.5, curbWeightKg: 223, seatHeightMm: 848, fuelTankL: 20.1,
    frontTire: "120/70 ZR17", rearTire: "200/55 ZR17", abs: "BMW Motorrad Integral ABS Pro", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad global M 1000 XR technical data", sourceUrl: "https://www.bmwmotorcycles.com/en/models/m/m1000xr/technicaldata.html", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 999cc M crossover with 201 hp, a road-ready weight around 223 kg, forged wheels and Integral ABS Pro."
  },
  {
    id: "bmw-r-12-ninet", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "R 12 nineT", slug: "r-12-ninet", generation: "Current global model", category: "Modern classic",
    srp: 0, engineCc: 1170, powerHp: 109, torqueNm: 115, curbWeightKg: 220, seatHeightMm: 795, fuelTankL: 15.9,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "BMW Motorrad Integral ABS Pro", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad global R 12 nineT technical data", sourceUrl: "https://www.bmwmotorcycles.com/en/models/heritage/r12-ninet/technicaldata.html", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 1170cc boxer roadster with 109 hp, shaft drive, a 795 mm seat and Integral ABS Pro."
  },
  {
    id: "bmw-ce-04", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "CE 04", slug: "ce-04", generation: "Current global model", category: "Electric scooter",
    srp: 0, engineCc: 0, powerHp: 42, torqueNm: 62, curbWeightKg: 235, seatHeightMm: 780, fuelTankL: 0,
    frontTire: "120/70 R15", rearTire: "160/60 R15", abs: "BMW Motorrad ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad global CE 04 product and range data", sourceUrl: "https://www.bmwmotorcycles.com/en/models/urban_mobility/ce04.html", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Automatic", priceContext: globalPriceContext,
    summary: "Global-market electric maxi-scooter with 42 hp maximum output, an approximately 80-mile cited range and 15-inch wheels."
  },
  {
    id: "ducati-multistrada-v4", make: "Ducati", makeSlug: "ducati", model: "Multistrada V4", slug: "multistrada-v4", generation: "Current global model", category: "Adventure touring",
    srp: 0, engineCc: 1158, powerHp: 170, torqueNm: 124, curbWeightKg: 229, seatHeightMm: 840, fuelTankL: 22,
    frontTire: "120/70 ZR19", rearTire: "170/60 ZR17", abs: "Cornering ABS with Ducati rider aids", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Ducati global Multistrada V4 technical specification", sourceUrl: "https://www.ducati.com/ww/en/bikes/multistrada/multistrada-v4", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 1158cc V4 Granturismo adventure-tourer with 170 hp, 124 Nm, a 22 L tank and a 19-inch front wheel."
  },
  {
    id: "ducati-diavel-v4", make: "Ducati", makeSlug: "ducati", model: "Diavel V4", slug: "diavel-v4", generation: "Current global model", category: "Power cruiser",
    srp: 0, engineCc: 1158, powerHp: 168, torqueNm: 126, curbWeightKg: 223, seatHeightMm: 790, fuelTankL: 20,
    frontTire: "120/70 ZR17", rearTire: "240/45 ZR17", abs: "Cornering ABS with Ducati rider aids", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Ducati global Diavel V4 technical specification", sourceUrl: "https://www.ducati.com/ww/en/bikes/diavel/diavel-v4", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 1158cc V4 power cruiser with 168 hp, 126 Nm, a low 790 mm seat and 240-section rear tire."
  },
  {
    id: "ducati-desertx", make: "Ducati", makeSlug: "ducati", model: "DesertX", slug: "desertx", generation: "Current global model", category: "Adventure touring",
    srp: 0, engineCc: 937, powerHp: 110, torqueNm: 92, curbWeightKg: 210, seatHeightMm: 875, fuelTankL: 21, groundClearanceMm: 250,
    frontTire: "90/90-21", rearTire: "150/70 R18", abs: "Bosch Cornering ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Ducati global DesertX technical specification", sourceUrl: "https://www.ducati.com/ww/en/bikes/desertx/desertx-937/tech-specs", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 937cc adventure motorcycle with 21/18-inch wheels, 250 mm ground clearance, 110 hp and switchable off-road-focused electronics."
  },
  {
    id: "ducati-panigale-v2-global", make: "Ducati", makeSlug: "ducati", model: "Panigale V2", slug: "panigale-v2", generation: "Current global model", category: "Sport bike",
    srp: 0, engineCc: 890, powerHp: 120, torqueNm: 93.3, curbWeightKg: 179, seatHeightMm: 837, fuelTankL: 15,
    frontTire: "120/70 ZR17", rearTire: "190/55 ZR17", abs: "Bosch Cornering ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Ducati global Panigale V2 technical specification", sourceUrl: "https://www.ducati.com/ww/en/bikes/panigale/panigale-v2", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Current global Panigale V2 with Ducati's 890cc V-twin, 120 hp, 93.3 Nm, an 837 mm seat and cornering ABS."
  },
  {
    id: "ducati-hypermotard-698-mono", make: "Ducati", makeSlug: "ducati", model: "Hypermotard 698 Mono", slug: "hypermotard-698-mono", generation: "Current global model", category: "Supermoto",
    srp: 0, engineCc: 659, powerHp: 77.5, torqueNm: 63, curbWeightKg: 151, seatHeightMm: 904, fuelTankL: 12,
    frontTire: "120/70 ZR17", rearTire: "160/60 ZR17", abs: "Cornering ABS with Ducati rider aids", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Ducati global Hypermotard 698 Mono technical specification", sourceUrl: "https://www.ducati.com/ww/en/bikes/hypermotard/hypermotard-698-mono", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 659cc single-cylinder supermoto with 77.5 hp, 63 Nm and a tall 904 mm standard seat."
  },
  {
    id: "ducati-xdiavel-v4", make: "Ducati", makeSlug: "ducati", model: "XDiavel V4", slug: "xdiavel-v4", generation: "Current global model", category: "Power cruiser",
    srp: 0, engineCc: 1158, powerHp: 168, torqueNm: 126, curbWeightKg: 229, seatHeightMm: 770, fuelTankL: 20,
    frontTire: "120/70 ZR17", rearTire: "240/45 ZR17", abs: "Cornering ABS with Ducati rider aids", colors: ["Burning Red", "Black Lava"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Ducati global XDiavel V4 technical specification", sourceUrl: "https://www.ducati.com/ww/en/bikes/xdiavel/xdiavel-v4", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 1158cc V4 cruiser with 168 hp, 126 Nm, a 770 mm seat and 240-section rear tire."
  },
  {
    id: "aprilia-rsv4-1100-global", make: "Aprilia", makeSlug: "aprilia", model: "RSV4 1100", slug: "rsv4-1100", generation: "Current global model", category: "Super sport",
    srp: 0, engineCc: 1099, powerHp: 220, torqueNm: 127, curbWeightKg: 204, seatHeightMm: 845, fuelTankL: 18,
    frontTire: "120/70 ZR17", rearTire: "200/55 ZR17", abs: "Cornering ABS with Aprilia Performance Ride Control", colors: ["Stingray Blue", "Poison Yellow"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Aprilia global RSV4 1100 technical specification", sourceUrl: "https://www.aprilia.com/en_EN/models/rsv4/rsv4-1100-4s4v-2025/", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Current global 1099cc V4 superbike with 220 hp, 127 Nm and Aprilia's APRC electronic rider-aid suite."
  },
  {
    id: "aprilia-tuono-v4-1100-global", make: "Aprilia", makeSlug: "aprilia", model: "Tuono V4 1100", slug: "tuono-v4-1100", generation: "Current global model", category: "Naked street bike",
    srp: 0, engineCc: 1099, powerHp: 180, torqueNm: 121, curbWeightKg: 211, seatHeightMm: 836, fuelTankL: 18,
    frontTire: "120/70 ZR17", rearTire: "200/55 ZR17", abs: "Cornering ABS with Aprilia Performance Ride Control", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Aprilia global Tuono V4 1100 technical specification", sourceUrl: "https://www.aprilia.com/en_EN/models/tuono-v4/tuono-v4-1100-2025/", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Current global 1099cc V4 naked bike with 180 hp, 121 Nm, an 18 L tank and APRC electronics."
  },
  {
    id: "triumph-tiger-900-gt-pro-global", make: "Triumph", makeSlug: "triumph", model: "Tiger 900 GT Pro", slug: "tiger-900-gt-pro", generation: "Current global model", category: "Adventure touring",
    srp: 0, engineCc: 888, powerHp: 106.5, torqueNm: 90, curbWeightKg: 228, seatHeightMm: 820, fuelTankL: 20,
    frontTire: "100/90-19", rearTire: "150/70 R17", abs: "Optimised Cornering ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Triumph global Tiger 900 GT Pro specification", sourceUrl: "https://www.triumphmotorcycles.com/motorcycles/adventure/tiger-900/specification", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 888cc inline-three adventure-tourer with 106.5 hp, 90 Nm, road-focused 19/17-inch wheels and cornering ABS."
  },
  {
    id: "triumph-rocket-3-storm-r-global", make: "Triumph", makeSlug: "triumph", model: "Rocket 3 Storm R", slug: "rocket-3-storm-r", generation: "Current global model", category: "Power cruiser",
    srp: 0, engineCc: 2458, powerHp: 180, torqueNm: 225, curbWeightKg: 317, seatHeightMm: 773, fuelTankL: 18,
    frontTire: "150/80 R17", rearTire: "240/50 R16", abs: "Optimised Cornering ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Triumph global Rocket 3 Storm R specification", sourceUrl: "https://www.triumphmotorcycles.com/motorcycles/rocket-3/rocket-3-storm/specification", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 2458cc inline-three power cruiser with 180 hp, 225 Nm, shaft drive and a 773 mm seat."
  },
  {
    id: "triumph-speed-twin-1200-rs-global", make: "Triumph", makeSlug: "triumph", model: "Speed Twin 1200 RS", slug: "speed-twin-1200-rs", generation: "Current global model", category: "Modern classic",
    srp: 0, engineCc: 1200, powerHp: 103.5, torqueNm: 112, curbWeightKg: 216, seatHeightMm: 805, fuelTankL: 14.5,
    frontTire: "120/70 R17", rearTire: "160/60 R17", abs: "Optimised Cornering ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Triumph global Speed Twin 1200 RS specification", sourceUrl: "https://www.triumphmotorcycles.com/motorcycles/classic/bonneville-speed-twin-1200/specification", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "Global-market 1200cc modern classic with 103.5 hp, 112 Nm, an 805 mm seat and sport-focused RS chassis equipment."
  },
  {
    id: "ktm-890-duke-r-global", make: "KTM", makeSlug: "ktm", model: "890 Duke R", slug: "890-duke-r", generation: "Previous global generation", category: "Naked street bike",
    srp: 0, engineCc: 889, powerHp: 121, torqueNm: 99, curbWeightKg: 166, seatHeightMm: 840, fuelTankL: 14,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "Cornering ABS with Supermoto mode", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "KTM official 890 Duke R archived model specification", sourceUrl: "https://www.ktm.com/en-ph/models/naked-bike/ktm-890-duke-r-2022.html", verifiedAt, freshness: "verified", marketStatus: "previous", transmission: "Manual", priceContext: "Previous global generation retained for search and comparison research. Not a current Philippine dealer price.",
    summary: "Previous-generation 889cc performance naked bike with 121 hp, 99 Nm, a 14 L tank and track-oriented chassis equipment."
  },
  {
    id: "ktm-890-adventure-r-global", make: "KTM", makeSlug: "ktm", model: "890 Adventure R", slug: "890-adventure-r", generation: "2026 global model", category: "Adventure touring",
    srp: 0, engineCc: 889, powerHp: 103.6, torqueNm: 100, curbWeightKg: 215, seatHeightMm: 880, fuelTankL: 20, groundClearanceMm: 263,
    frontTire: "90/90-21", rearTire: "150/70 R18", abs: "Cornering ABS with off-road settings", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "KTM 2026 global 890 Adventure R technical specification", sourceUrl: "https://www.ktm.com/en-nz/models/adventure/2026-ktm-890-adventurer/technical-specifications.html", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "2026 global 889cc adventure bike with 100 Nm, 21/18-inch wheels, 263 mm ground clearance and 240 mm suspension travel."
  },
  {
    id: "ktm-990-duke-global", make: "KTM", makeSlug: "ktm", model: "990 Duke", slug: "990-duke", generation: "2026 global model", category: "Naked street bike",
    srp: 0, engineCc: 947, powerHp: 121.3, torqueNm: 103, curbWeightKg: 179, seatHeightMm: 825, fuelTankL: 14.8, groundClearanceMm: 195,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "Cornering ABS with Supermoto mode", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "KTM 2026 global 990 Duke technical specification", sourceUrl: "https://www.ktm.com/en-se/models/naked-bike/2026-ktm-990-duke/technical-specifications.html", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "2026 global 947cc parallel-twin naked bike with 123 PS, 103 Nm, an 825 mm seat and WP APEX suspension."
  },
  {
    id: "ktm-1390-super-duke-r-evo-global", make: "KTM", makeSlug: "ktm", model: "1390 Super Duke R EVO", slug: "1390-super-duke-r-evo", generation: "2026 global model", category: "Naked street bike",
    srp: 0, engineCc: 1350, powerHp: 187.4, torqueNm: 145, curbWeightKg: 212, seatHeightMm: 834, fuelTankL: 17.5, groundClearanceMm: 149,
    frontTire: "120/70 ZR17", rearTire: "200/55 ZR17", abs: "Cornering ABS with Supermoto mode", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "KTM 2026 global 1390 Super Duke R EVO technical specification", sourceUrl: "https://www.ktm.com/en-us/models/naked-bike/2026-ktm-1390-superdukerevo/technical-specifications.html", verifiedAt, freshness: "verified", marketStatus: "uncertain", transmission: "Manual", priceContext: globalPriceContext,
    summary: "2026 global 1350cc V-twin hyper-naked with 190 PS, 145 Nm, semi-active WP suspension and an 834 mm seat."
  }
];

export const globalExpansionModelIds = new Set(globalModelExpansion2026.map((model) => model.id));
