export type BrandSeoGrowthProfile = {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  intentNote: string;
  bigBikeMinCc?: number;
  bigBikeTitle?: string;
  bigBikeDescription?: string;
  categorySpotlight?: { title: string; description: string; pattern: string; recommendationHref?: string; recommendationLabel?: string };
};

const profiles: Record<string, BrandSeoGrowthProfile> = {
  hero: {
    seoTitle: "Hero Motorcycle Philippines 2026 | Prices & Models",
    seoDescription: "Hero motorcycle Philippines price list for XPulse 200 4V, Hunk 160R 4V, Xoom 110 and Xoom 125R with official prices and specs.",
    heroTitle: "Hero Motorcycle Philippines Price List 2026",
    heroDescription: "Compare current Hero motorcycles and scooters in the Philippines using Hero MotoCorp Philippines prices and specifications.",
    intentNote: "This Hero brand hub owns broad Hero motorcycle Philippines intent and routes XPulse, Hunk and Xoom searches to their canonical model pages. Prices and specifications use current Hero MotoCorp Philippines sources.",
    categorySpotlight: { title: "Hero scooters in the Philippines", description: "Compare the current Hero Xoom scooter records tracked by MotoIndex.", pattern: "scooter" }
  },
  honda: {
    seoTitle: "Honda Big Bikes Philippines 2026 | Motorcycle Price List",
    seoDescription: "Honda Philippines price list with current motorcycles and tracked big bikes including CB650R, CBR650R, Rebel, X-ADV and Gold Wing, plus specs and buyer tools.",
    heroTitle: "Honda Motorcycle Philippines Price List 2026",
    heroDescription: "Compare current Honda motorcycles tracked in the Philippines by price, engine size, seat height and category, from everyday scooters and commuters to 400cc+ big bikes.",
    intentNote: "Start here for Honda motorcycles and big bikes in the Philippines. Compare current MotoIndex price and specification coverage on this page, then open any Honda model for its canonical specs, financing, fitment and ownership research.",
    bigBikeMinCc: 400,
    bigBikeTitle: "Honda big bikes in the Philippines",
    bigBikeDescription: "Compare current Honda motorcycles at 400cc and above tracked by MotoIndex, including CB650R, CBR650R, Rebel, X-ADV and Gold Wing models, by published price, engine size, power and seat height.",
    categorySpotlight: { title: "Honda off-road and dual-sport motorcycles", description: "Compare current Honda off-road and dual-sport records on the existing Honda authority hub, keeping CRF-related category intent consolidated with the brand price list.", pattern: "Dual-sport|Off-road|Trail", recommendationHref: "/recommendations/dual-sport-motorcycles-philippines", recommendationLabel: "Compare dual-sport and trail motorcycles" }
  },
  yamaha: {
    seoTitle: "Yamaha Big Bikes Philippines 2026 | Motorcycle Price List",
    seoDescription: "Yamaha Philippines price list with current scooters, sport bikes and tracked big bikes including TMAX, YZF-R7 and YZF-R1M, with specs and buyer tools.",
    heroTitle: "Yamaha Motorcycle Philippines Price List 2026",
    heroDescription: "Compare current Yamaha motorcycles tracked in the Philippines by price, engine size, seat height and category, from Mio, NMAX and Aerox scooters to 400cc+ sport machines.",
    intentNote: "Start here for Yamaha motorcycles and big bikes in the Philippines. Compare current MotoIndex price and specification coverage on this page, then open any Yamaha model for its canonical specs, financing, fitment and ownership research.",
    bigBikeMinCc: 400,
    bigBikeTitle: "Yamaha big bikes in the Philippines",
    bigBikeDescription: "Compare current Yamaha motorcycles at 400cc and above tracked by MotoIndex, including TMAX Tech Max, YZF-R7 and YZF-R1M, by published price, engine size, power and seat height.",
    categorySpotlight: { title: "Yamaha street motorcycles in the Philippines", description: "Compare current Yamaha road and street-focused motorcycles tracked by MotoIndex without splitting them into a thin duplicate URL.", pattern: "Naked street bike|Roadster|Modern classic" }
  },
  kawasaki: {
    seoTitle: "Kawasaki Big Bikes Philippines 2026 | Motorcycle Price List",
    seoDescription: "Kawasaki Philippines motorcycle price list with current Ninja, Z and big-bike models, 400cc+ prices, engine sizes, seat heights and buyer research.",
    heroTitle: "Kawasaki Motorcycle Philippines Price List 2026",
    heroDescription: "Compare current Kawasaki motorcycles in the Philippines, from commuter and dual-sport models to Ninja and Z big bikes, with published prices, engine sizes, seat heights and ownership research.",
    intentNote: "Start here for Kawasaki motorcycles and big bikes in the Philippines. Compare current prices and key specifications on this page, then open any Ninja, Z, KLX or other model for detailed financing, fitment and ownership research.",
    bigBikeMinCc: 400,
    bigBikeTitle: "Kawasaki big bikes in the Philippines",
    bigBikeDescription: "Compare current Kawasaki motorcycles at 400cc and above by published price, engine size, power, seat height and category. Open any model for its canonical specs, financing and ownership research.",
    categorySpotlight: { title: "Kawasaki off-road and KLX motorcycles", description: "Compare current Kawasaki off-road and dual-sport models, including KLX-family records, on the main Kawasaki authority hub rather than creating a duplicate brand-category page.", pattern: "Dual-sport|Off-road|Trail", recommendationHref: "/recommendations/dual-sport-motorcycles-philippines", recommendationLabel: "Compare dual-sport and trail motorcycles" }
  },
  suzuki: {
    seoTitle: "Suzuki Motorcycles Philippines 2026 | Price List & Models",
    seoDescription: "Suzuki motorcycles Philippines 2026 price list with current scooters, underbones, sport and big-bike models, plus engine sizes, seat heights and buyer research.",
    heroTitle: "Suzuki Motorcycle Philippines Price List 2026",
    heroDescription: "Compare current Suzuki motorcycles tracked in the Philippines by published price, engine size, seat height and category, including scooters, underbones, sport bikes and larger-displacement models.",
    intentNote: "This Suzuki brand hub owns broad Suzuki motorcycle Philippines and price-list intent. Use its current model table and category sections first, then open the canonical model page for detailed specs, financing, fitment and ownership research."
  },
  "harley-davidson": {
    seoTitle: "Harley-Davidson Philippines 2026 | Prices & Models",
    seoDescription: "Harley-Davidson Philippines motorcycle prices and 2026 specs for Nightster, Sportster S and Pan America 1250 Special, with current market references.",
    heroTitle: "Harley-Davidson Philippines Motorcycles 2026",
    heroDescription: "Compare MotoIndex's current Harley-Davidson Philippines coverage using official 2026 APAC specifications and dated Philippine market-price references.",
    intentNote: "This Harley-Davidson brand hub owns broad Harley-Davidson motorcycle, Philippines price and Sportster research intent. Philippine prices are dated market references, while core 2026 specifications come from Harley-Davidson APAC; confirm the final authorized-dealer quote before purchase.",
    bigBikeMinCc: 400,
    bigBikeTitle: "Harley-Davidson big bikes in the Philippines",
    bigBikeDescription: "Compare the current Nightster, Sportster S and Pan America 1250 Special records by published Philippine market price, engine, power, weight and seat height."
  },
  vespa: {
    seoTitle: "Vespa Philippines Price List 2026 | GTS, GTV, Sprint & Primavera",
    seoDescription: "Vespa Philippines price list for GTS SuperSport 300, GTV 300, Primavera 150 and Sprint 150 with specs, seat height, ABS and ownership links.",
    heroTitle: "Vespa Philippines Price List 2026",
    heroDescription: "Compare Vespa scooters tracked for the Philippines, including GTS SuperSport 300, GTV 300, Primavera 150 and Sprint 150, with dated prices, engine sizes, seat heights, ABS details and ownership research.",
    intentNote: "This brand hub owns broad Vespa motorcycle, Vespa scooter and Vespa price Philippines intent. Model-specific price, specs, colors and financing stay on each canonical model URL instead of being split into city-price or installment pages."
  }
};

export function brandSeoGrowthProfile(makeSlug: string) {
  return profiles[makeSlug];
}
