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
    seoDescription: "Kawasaki Philippines motorcycle price list with Brusky 125 scooter, KLX, Ninja, Z and 400cc+ big-bike models, prices, specs and buyer research.",
    heroTitle: "Kawasaki Motorcycle Philippines Price List 2026",
    heroDescription: "Compare current Kawasaki motorcycles in the Philippines, from the Brusky 125 scooter and commuter models to KLX, Ninja, Z and larger big bikes, with published prices and specs.",
    intentNote: "Start here for Kawasaki motorcycles, scooters and big bikes in the Philippines. Compare current prices and key specifications on this page, then open the Brusky, Ninja, Z, KLX or other model for detailed financing, fitment and ownership research.",
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
  bristol: {
    seoTitle: "Bristol Motorcycle Philippines 2026 | Price List & Models",
    seoDescription: "Bristol motorcycle Philippines price list with current tracked models, including ADX, Maxxie and Maxie scooters, with prices, engines and buyer research.",
    heroTitle: "Bristol Motorcycle Philippines Price List 2026",
    heroDescription: "Compare current Bristol motorcycles and scooters tracked in the Philippines by published price, engine size, seat height, transmission and category.",
    intentNote: "This hub owns broad Bristol motorcycle, Bristol scooter and Philippine price-list intent. Open the exact model page for specifications, financing, fitment and ownership details.",
    categorySpotlight: { title: "Bristol scooters in the Philippines", description: "Compare current Bristol scooter records, including adventure, maxi and maxi-style options, on one brand hub instead of a duplicate brand+scooter page.", pattern: "scooter", recommendationHref: "/recommendations/maxi-scooters-philippines", recommendationLabel: "Compare maxi scooters across brands" }
  },
  kymco: {
    seoTitle: "KYMCO Scooter Philippines 2026 | Motorcycle Price List",
    seoDescription: "KYMCO scooter and motorcycle Philippines price list with current tracked models, prices, engine sizes, seat heights and buyer research.",
    heroTitle: "KYMCO Scooter & Motorcycle Price List Philippines 2026",
    heroDescription: "Compare current KYMCO scooters and motorcycles tracked in the Philippines by price, engine size, seat height, transmission and category.",
    intentNote: "This hub owns broad KYMCO scooter, KYMCO motorcycle and Philippine price-list intent while keeping exact model research on canonical model URLs.",
    categorySpotlight: { title: "KYMCO scooters in the Philippines", description: "Compare current KYMCO commuter, sport, retro, adventure and maxi-style scooter records without creating separate thin moped or scooter URLs.", pattern: "scooter", recommendationHref: "/recommendations/best-scooters-philippines", recommendationLabel: "Compare scooters across brands" }
  },
  benelli: {
    seoTitle: "Benelli Motorcycle Philippines 2026 | Price List & Models",
    seoDescription: "Benelli motorcycle Philippines price list with current tracked models, published prices, engine sizes, seat heights and buyer research.",
    heroTitle: "Benelli Motorcycle Philippines Price List 2026",
    heroDescription: "Compare current Benelli motorcycles tracked in the Philippines by price, engine size, seat height, transmission and category.",
    intentNote: "Use this page for broad Benelli Philippines and price-list research, then open the exact model for specifications, financing and ownership context."
  },
  cfmoto: {
    seoTitle: "CFMOTO Philippines 2026 | Motorcycle Price List & Models",
    seoDescription: "CFMOTO Philippines motorcycle price list with current tracked models, prices, engine sizes, seat heights, categories and buyer research.",
    heroTitle: "CFMOTO Philippines Motorcycle Price List 2026",
    heroDescription: "Compare current CFMOTO motorcycles tracked in the Philippines by published price, engine size, seat height and category.",
    intentNote: "This hub owns broad CFMOTO Philippines and motorcycle price-list intent. Model-specific specs, financing and ownership questions stay on the exact canonical model page."
  },
  "royal-enfield": {
    seoTitle: "Royal Enfield Philippines 2026 | Motorcycle Price List",
    seoDescription: "Royal Enfield Philippines price list with current tracked motorcycles, prices, engine sizes, weights, seat heights and buyer research.",
    heroTitle: "Royal Enfield Philippines Motorcycle Price List 2026",
    heroDescription: "Compare current Royal Enfield motorcycles tracked in the Philippines by price, engine, curb weight, seat height and category.",
    intentNote: "This hub owns broad Royal Enfield Philippines and price-list intent while model pages retain exact specifications, weight, financing and ownership detail."
  },
  ducati: {
    seoTitle: "Ducati Price Philippines 2026 | Motorcycle Price List",
    seoDescription: "Ducati price Philippines guide with current tracked big bikes, including Monster, Scrambler, Streetfighter and Panigale models, prices and specs.",
    heroTitle: "Ducati Motorcycle Price List Philippines 2026",
    heroDescription: "Compare current Ducati motorcycles and big bikes tracked in the Philippines by price, engine size, power, seat height and category.",
    intentNote: "This hub owns broad Ducati price Philippines, Ducati big-bike and motorcycle price-list intent. Confirm the exact dealer quote and model year before purchase.",
    bigBikeMinCc: 400,
    bigBikeTitle: "Ducati big bikes in the Philippines",
    bigBikeDescription: "Compare current Ducati motorcycles at 400cc and above by published price, engine size, power, seat height and category."
  },
  bajaj: {
    seoTitle: "Bajaj Price Philippines 2026 | Motorcycle Price List & Models",
    seoDescription: "Bajaj price Philippines guide with current tracked motorcycles, published prices, engine sizes, seat heights and buyer research.",
    heroTitle: "Bajaj Motorcycle Price List Philippines 2026",
    heroDescription: "Compare current Bajaj motorcycles tracked in the Philippines by price, engine size, seat height, transmission and category.",
    intentNote: "This hub owns broad Bajaj price Philippines intent and keeps model-specific specifications and financing on the canonical model page."
  },
  keeway: {
    seoTitle: "Keeway Motorcycle Philippines 2026 | Price List & Models",
    seoDescription: "Keeway motorcycle Philippines price list with current tracked models, published prices, engine sizes, seat heights and buyer research.",
    heroTitle: "Keeway Motorcycle Philippines Price List 2026",
    heroDescription: "Compare current Keeway motorcycles tracked in the Philippines by price, engine size, seat height and category.",
    intentNote: "Use this hub for broad Keeway motorcycle Philippines and price-list research, then open the exact model for specifications and ownership context."
  },
  ktm: {
    seoTitle: "KTM Philippines 2026 | Motorcycle Price List & Models",
    seoDescription: "KTM Philippines motorcycle price list with current tracked models, prices, engine sizes, seat heights, categories and buyer research.",
    heroTitle: "KTM Philippines Motorcycle Price List 2026",
    heroDescription: "Compare current KTM motorcycles tracked in the Philippines by published price, engine size, seat height and category.",
    intentNote: "This hub owns broad KTM Philippines and motorcycle price-list intent while exact Duke, RC and Adventure research stays on canonical model pages."
  },
  "bmw-motorrad": {
    seoTitle: "BMW Motorcycle Philippines 2026 | Price List & Adventure Bikes",
    seoDescription: "BMW motorcycle Philippines price list with current G 310, GS, S and M models, including adventure bikes, superbikes, prices and rider-fit data.",
    heroTitle: "BMW Motorrad Philippines Motorcycle Price List 2026",
    heroDescription: "Compare current BMW motorcycles tracked in the Philippines by published price, engine size, seat height and category, including GS adventure bikes and S/M performance models.",
    intentNote: "This hub owns broad BMW motorcycle Philippines and BMW adventure-bike intent while keeping exact model research on canonical model pages.",
    categorySpotlight: { title: "BMW adventure bikes in the Philippines", description: "Compare current BMW GS adventure-touring records, from the G 310 GS through larger F and R-series machines, without creating a duplicate brand-category URL.", pattern: "Adventure touring", recommendationHref: "/recommendations/adventure-touring-motorcycles-philippines", recommendationLabel: "Compare adventure motorcycles across brands" }
  },
  triumph: {
    seoTitle: "Triumph Motorcycles Philippines 2026 | Price List & Models",
    seoDescription: "Triumph motorcycles Philippines price list with current Speed, Scrambler, Trident, Street Triple, Tiger and Daytona models plus prices and specs.",
    heroTitle: "Triumph Motorcycles Philippines Price List 2026",
    heroDescription: "Compare current Triumph motorcycles tracked in the Philippines by price, engine size, seat height and category, from modern classics to sport and touring machines.",
    intentNote: "This hub owns broad Triumph motorcycles Philippines and price-list intent while exact model specifications, financing and ownership stay on canonical model pages."
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
