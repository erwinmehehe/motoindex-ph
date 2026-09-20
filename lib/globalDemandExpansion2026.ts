import type { Motorcycle } from "./types";

// Search-demand expansion for models with meaningful international research intent.
// These records are not gated by Philippine-market availability. Where a current
// Philippine price is available, it is retained as a useful local reference.
// Search volume remains 0 until measured keyword data can be imported; never invent it.
const verifiedAt = "2026-09-16";

export const globalDemandExpansion2026: Motorcycle[] = [
  {
    id: "bmw-s-1000-rr", alsoKnownAs: ["BMW S1000RR"], make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "S 1000 RR", slug: "s-1000-rr", generation: "2025", category: "Super sport",
    srp: 1825000, engineCc: 999, powerHp: 210, torqueNm: 113, curbWeightKg: 198, seatHeightMm: 824, fuelTankL: 16.5,
    frontTire: "120/70 ZR17", rearTire: "190/55 ZR17", abs: "BMW Motorrad Race ABS with ABS Pro and Brake-Slide-Assist", colors: ["Light White/M Motorsport", "Bluestone metallic/Racing Red", "Blackstorm metallic"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad current S 1000 RR model and technical data", sourceUrl: "https://www.bmwmotorrad.com.ph/en/models/sport/s1000rr/technicaldata.html", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    priceContext: "Current BMW Motorrad Philippines 2025 starting price; pricing varies by market and configuration.", marketPriceSourceLabel: "BMW Motorrad Philippines", marketPriceSourceUrl: "https://www.bmwmotorrad.com.ph/en/models/sport/s1000rr.html", marketPriceCheckedAt: verifiedAt,
    summary: "999cc ShiftCam inline-four superbike with 210 hp, 113 Nm, Race ABS Pro, 17-inch road tires and a 16.5 L tank."
  },
  {
    id: "bmw-m-1000-rr", alsoKnownAs: ["BMW M1000RR"], make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "M 1000 RR", slug: "m-1000-rr", generation: "2025", category: "Super sport",
    srp: 3295000, engineCc: 999, powerHp: 218, torqueNm: 113, curbWeightKg: 194, seatHeightMm: 832, fuelTankL: 16.5,
    frontTire: "120/70 ZR17", rearTire: "200/55 ZR17", abs: "BMW Motorrad Race ABS with ABS Pro", colors: ["Light White/M Motorsport", "Blackstorm metallic/M Motorsport"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad current M 1000 RR model and technical data", sourceUrl: "https://www.bmwmotorrad.com.ph/en/models/M/m1000rr_2025/technicaldata.html", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    priceContext: "Current BMW Motorrad Philippines 2025 published price; pricing varies by market and configuration.", marketPriceSourceLabel: "BMW Motorrad Philippines", marketPriceSourceUrl: "https://www.bmwmotorrad.com.ph/en/models/M/m1000rr_2025.html", marketPriceCheckedAt: verifiedAt,
    summary: "999cc race-homologation superbike with 218 hp, 113 Nm, M Carbon wheels, Race ABS Pro and a 16.5 L tank."
  },
  {
    id: "bmw-s-1000-r", alsoKnownAs: ["BMW S1000R"], make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "S 1000 R", slug: "s-1000-r", generation: "2025", category: "Naked sport bike",
    srp: 1525000, engineCc: 999, powerHp: 170, torqueNm: 114, curbWeightKg: 199, seatHeightMm: 830, fuelTankL: 16.5,
    frontTire: "120/70 ZR17", rearTire: "190/55 ZR17", abs: "BMW Motorrad Integral ABS with ABS Pro", colors: ["Blackstorm metallic", "Light White/M Motorsport", "Bluefire/Mugiallo Yellow"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad current S 1000 R model and technical data", sourceUrl: "https://www.bmwmotorrad.com.ph/en/models/roadster/s1000r/technicaldata.html", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    priceContext: "Current BMW Motorrad Philippines 2025 starting price; pricing varies by market and configuration.", marketPriceSourceLabel: "BMW Motorrad Philippines", marketPriceSourceUrl: "https://www.bmwmotorrad.com.ph/en/models/roadster/s1000r.html", marketPriceCheckedAt: verifiedAt,
    summary: "999cc naked sport motorcycle with 170 hp, 114 Nm, an 830 mm standard seat, 17-inch road tires and a 16.5 L tank."
  },
  {
    id: "aprilia-rs-457", make: "Aprilia", makeSlug: "aprilia", model: "RS 457", slug: "rs-457", generation: "Current", category: "Sport bike",
    srp: 348000, engineCc: 457, powerHp: 47.6, torqueNm: 43.5, curbWeightKg: 175, seatHeightMm: 800, fuelTankL: 13,
    frontTire: "110/70 ZR17", rearTire: "150/60 ZR17", abs: "Dual-channel ABS with anti-roll-over system, traction control and three riding modes", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Aprilia official RS 457 technical specification", sourceUrl: "https://wlassets.aprilia.com/wlassets/aprilia/rs/tech_spec/2024/RS_457_technical_sheet_RS/original/RS_457_technical_sheet_RS.pdf", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    priceContext: "Current Philippine market reference retained for local users; international pricing varies by country.", marketPriceSourceLabel: "Current Philippine 2026 price reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/aprilia/rs-457/price", marketPriceCheckedAt: verifiedAt,
    summary: "457cc parallel-twin sport motorcycle with 47.6 hp, 43.5 Nm, an 800 mm seat, 175 kg wet weight and dual-channel ABS."
  },
  {
    id: "royal-enfield-interceptor-650", make: "Royal Enfield", makeSlug: "royal-enfield", model: "Interceptor 650", slug: "interceptor-650", generation: "Current", category: "Modern classic",
    srp: 399000, engineCc: 648, powerHp: 46.8, torqueNm: 52, curbWeightKg: 218, seatHeightMm: 804, fuelTankL: 13.7, groundClearanceMm: 174,
    frontTire: "100/90-18", rearTire: "130/70-18", abs: "Dual-channel ABS", colors: ["Mark 2", "Canyon Red", "Sunset Strip", "Cali Green", "Black Pearl", "Black Ray", "Barcelona Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Royal Enfield current Interceptor 650 model, price and specification references", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/interceptor/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    priceContext: "Current Royal Enfield Philippines campaign colour pricing starts at ₱399,000; pricing differs by colour, dealer and country.", marketPriceHighPhp: 410000, marketPriceSourceLabel: "Royal Enfield Philippines", marketPriceSourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/interceptor/campaign/", marketPriceCheckedAt: verifiedAt,
    summary: "648cc parallel-twin modern classic with 46.8 hp, 52 Nm, 18-inch wheels, six-speed transmission and dual-channel ABS."
  },
  {
    id: "royal-enfield-continental-gt-650", make: "Royal Enfield", makeSlug: "royal-enfield", model: "Continental GT 650", slug: "continental-gt-650", generation: "Current", category: "Cafe racer",
    srp: 410000, engineCc: 648, powerHp: 47, torqueNm: 52, curbWeightKg: 214, seatHeightMm: 820, fuelTankL: 12.5, fuelConsumptionKmL: 27, groundClearanceMm: 174,
    frontTire: "100/90-18", rearTire: "130/70-18", abs: "Dual-channel ABS", colors: ["Rocker Red", "British Racing Green", "Dux Deluxe", "Apex Grey", "Slipstream Blue", "Mr Clean"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Royal Enfield current Continental GT 650 model and global technical specification", sourceUrl: "https://www.royalenfield.com/us/en/motorcycles/continental-gt/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    priceContext: "Current Royal Enfield Philippines colour pricing starts at ₱410,000; pricing differs by colour, dealer and country.", marketPriceHighPhp: 425000, marketPriceSourceLabel: "Royal Enfield Philippines", marketPriceSourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/continental-gt/", marketPriceCheckedAt: verifiedAt,
    summary: "648cc parallel-twin cafe racer with 47 hp, dual-channel ABS, 18-inch wheels and a 12.5 L fuel tank."
  },
  {
    id: "royal-enfield-bear-650", make: "Royal Enfield", makeSlug: "royal-enfield", model: "Bear 650", slug: "bear-650", generation: "Current", category: "Scrambler",
    srp: 445000, engineCc: 648, powerHp: 47.4, torqueNm: 56.5, curbWeightKg: 214, seatHeightMm: 830, fuelTankL: 13.7, fuelConsumptionKmL: 22, groundClearanceMm: 184,
    frontTire: "100/90-19", rearTire: "140/80 R17", abs: "Dual-channel ABS with switchable rear ABS", colors: ["Boardwalk White", "Wild Honey", "Petrol Green", "Golden Shadow", "Two Four Nine"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Royal Enfield current Bear 650 model and technical specification", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/bear-650/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    priceContext: "Current Royal Enfield Philippines starting price; pricing varies by variant, dealer and country.", marketPriceHighPhp: 459000, marketPriceSourceLabel: "Royal Enfield Philippines", marketPriceSourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/bear-650/campaign/", marketPriceCheckedAt: verifiedAt,
    summary: "648cc scrambler-style parallel twin with 47.4 hp, 56.5 Nm, 19/17-inch tires, an 830 mm seat and switchable rear ABS."
  },
  {
    id: "triumph-daytona-660", make: "Triumph", makeSlug: "triumph", model: "Daytona 660", slug: "daytona-660", generation: "2025", category: "Sport bike",
    srp: 549000, engineCc: 660, powerHp: 93.7, torqueNm: 69, curbWeightKg: 201, seatHeightMm: 810, fuelTankL: 14, fuelConsumptionKmL: 20.4,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "ABS with twin 310 mm front discs", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Triumph Motorcycles current Daytona 660 technical specification", sourceUrl: "https://www.triumphmotorcycles.ph/bikes/sport/daytona-660/specification", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    priceContext: "Current Triumph Motorcycles Philippines starting price; pricing varies by market and configuration.", marketPriceSourceLabel: "Triumph Motorcycles Philippines", marketPriceSourceUrl: "https://www.triumphmotorcycles.ph/bikes/sport/daytona-660", marketPriceCheckedAt: verifiedAt,
    summary: "660cc inline-three sport motorcycle with 95 PS, 69 Nm, an 810 mm seat, 201 kg wet weight and a 14 L tank."
  }
];

const existingGlobalDemandModelIds = [
  "yamaha-mt-07",
  "yamaha-xsr700",
  "yamaha-yzf-r3",
  "kawasaki-ninja-500",
  "kawasaki-z650",
  "kawasaki-versys-650",
  "honda-cb650r",
  "honda-nx500-e-clutch",
] as const;

export const globalDemandModelIds = new Set([
  ...globalDemandExpansion2026.map((model) => model.id),
  ...existingGlobalDemandModelIds,
]);

export function isGlobalDemandModel(model: Pick<Motorcycle, "id">) {
  return globalDemandModelIds.has(model.id);
}
