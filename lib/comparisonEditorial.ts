export type ComparisonEditorialBrief = {
  slug: string;
  primaryKeyword: string;
  demand?: string;
  intent: string;
  h1: string;
  opening: string;
  sections: string[];
  faqs: string[];
  related?: { href: string; label: string }[];
  note?: string;
};

export const comparisonEditorialBriefs: ComparisonEditorialBrief[] = [
  {
    slug: "aerox-vs-nmax",
    primaryKeyword: "Aerox vs NMAX",
    demand: "~850/mo represented across both query directions",
    intent: "Buyer choosing between Yamaha's two most cross-shopped automatic scooter families.",
    h1: "Yamaha Aerox vs NMAX: Price, Specs and Key Differences",
    opening: "The current Yamaha Aerox and NMAX sit in a similar engine class, but the checked records differ in price, curb weight, seat height, fuel capacity, tires and variant equipment. This page starts with those measurable differences rather than declaring an overall winner.",
    sections: ["Aerox vs NMAX price", "Engine, horsepower and torque", "Weight and dimensions", "Seat height and rider fit", "Fuel tank and fuel economy", "Brakes, ABS and traction control", "Storage and everyday practicality", "Which is easier for city use?", "Which makes more sense for longer rides?"],
    faqs: ["Which is cheaper, Aerox or NMAX?", "Which is faster on paper?", "Which is lighter?", "Which has the lower seat?", "Which has more storage?", "Which has better published fuel economy?", "Which has ABS?"],
    related: [{ href: "/compare/aerox-v3-vs-nmax-v3", label: "Compare Aerox V3 vs NMAX V3 →" }],
    note: "This family comparison uses the current Philippine-market generation records. Use the V3 page when you specifically want version-specific variant and equipment context."
  },
  {
    slug: "aerox-v3-vs-nmax-v3",
    primaryKeyword: "Aerox V3 vs NMAX V3",
    demand: "~300/mo represented",
    intent: "Version-specific buyer comparison that must not merge V3 data with older V2 specifications.",
    h1: "Yamaha Aerox V3 vs NMAX V3: Price and Specs Compared",
    opening: "This comparison is limited to the current V3 records and their verified variants. Older Aerox V2 and NMAX V2 specifications are kept separate so prices and equipment are not blended across generations.",
    sections: ["Current V3 prices and variants", "Engine comparison", "Which is lighter?", "Seat height and dimensions", "Fuel capacity and economy", "ABS and braking differences", "Technology and features", "Storage", "Best fit for commuting", "Best fit for longer trips"],
    faqs: ["Which V3 is cheaper?", "Which V3 is lighter?", "Which has the lower seat?", "Which has the larger fuel tank?", "How do the V3 ABS packages differ?", "What verified V3 variants are currently tracked?"],
    related: [{ href: "/compare/aerox-vs-nmax", label: "Open the broader Aerox vs NMAX comparison →" }]
  },
  {
    slug: "adv-160-vs-pcx-160",
    primaryKeyword: "ADV160 vs PCX160",
    demand: "~800/mo represented across the broader ADV/PCX family",
    intent: "Buyer choosing between Honda's 160cc-class premium scooters.",
    h1: "Honda ADV160 vs PCX160: Price, Specs and Differences",
    opening: "Honda's ADV160 and PCX160 share a similar engine class but the checked records separate them clearly on price, seat height, ground clearance, curb weight, fuel capacity, tires and variant equipment. Ground clearance is especially useful because it describes a real chassis difference without relying on styling language.",
    sections: ["Price and variants", "Engine and performance specifications", "Seat height and ground clearance", "Weight and overall size", "Suspension and wheel setup", "Fuel tank and consumption", "Storage and commuting practicality", "ABS and other equipment", "ADV160 vs PCX160 for shorter riders", "ADV160 vs PCX160 for longer rides"],
    faqs: ["Which is cheaper, ADV160 or PCX160?", "Which is taller?", "Which has more storage?", "Which has higher ground clearance?", "Which is lighter?", "Which has the larger fuel tank?"]
  },
  {
    slug: "click-160-vs-aerox-v3",
    primaryKeyword: "Click 160 vs Aerox 155",
    demand: "~250/mo represented with related Aerox vs Click searches",
    intent: "Buyer comparing similarly sized engines with noticeably different price, weight and positioning.",
    h1: "Honda Click 160 vs Yamaha Aerox 155: Price and Specs Compared",
    opening: "The Honda Click 160 and current Yamaha Aerox use similar-displacement automatic engines, but the checked records differ substantially in starting price, curb weight, seat height, output and equipment. The useful comparison is therefore the measurable trade-off rather than a generic sport-versus-commuter label.",
    sections: ["Price comparison", "Engine displacement", "Horsepower and torque", "Weight difference", "Seat height", "Dimensions", "Fuel tank", "Fuel economy", "ABS and brakes", "Storage and everyday practicality", "Which is easier to manage in traffic?", "Which provides stronger specifications for the money?"],
    faqs: ["Which is cheaper?", "Which makes more power on paper?", "Which is lighter?", "Which has the lower seat?", "Which has the larger fuel tank?", "How do the braking systems differ?"]
  },
  {
    slug: "raider-r150-vs-sniper-155",
    primaryKeyword: "Raider R150 FI vs Sniper 155",
    intent: "Performance-oriented underbone buyer.",
    h1: "Suzuki Raider R150 FI vs Yamaha Sniper 155: Specs Compared",
    opening: "The Raider R150 FI and Sniper 155 are both performance-oriented underbones, so output should be read together with curb weight, transmission, tires and braking equipment. MotoIndex also calculates horsepower per 100 kg as a comparison aid, not as proof of acceleration or top speed.",
    sections: ["Price", "Engine displacement", "Power and torque", "Power-to-weight ratio", "Transmission", "Curb weight", "Seat height", "Brakes", "Fuel tank and economy", "Dimensions", "Which has stronger performance specifications?", "Which is lighter?", "Which is more affordable?"],
    faqs: ["Which is cheaper?", "Which makes more horsepower?", "Which has more torque?", "Which is lighter?", "Which has the lower seat?", "Which lists ABS?"]
  },
  {
    slug: "click-125i-vs-mio-gear",
    primaryKeyword: "Click 125 vs Mio Gear",
    intent: "Affordable automatic commuter buyer prioritizing cost and everyday practicality.",
    h1: "Honda Click 125 vs Yamaha Mio Gear: Price, Specs and Everyday Use",
    opening: "The Honda Click 125i and Yamaha Mio Gear are both affordable automatic commuters. This comparison focuses on observed price, engine output, curb weight, seat height, tank size, tires and braking rather than using sport-oriented language that does not match the buying intent.",
    sections: ["Price", "Engine size", "Weight and maneuverability", "Seat height", "Fuel economy", "Fuel tank", "Storage", "Brakes", "Dimensions", "Which is better suited to a tight budget?", "Which is lighter?", "Which has the lower seat?"],
    faqs: ["Which is cheaper?", "Which is lighter?", "Which has the lower seat?", "Which has the larger fuel tank?", "Which has better published fuel economy?", "Do either of these records list ABS?"]
  },
  {
    slug: "click-125i-vs-burgman-street",
    primaryKeyword: "Click 125 vs Burgman Street",
    intent: "Compact commuter scooter versus a more practicality-oriented maxi-style scooter format.",
    h1: "Honda Click 125 vs Suzuki Burgman Street: Price, Size and Specs",
    opening: "The Click 125i and Burgman Street target everyday automatic use but differ in price, curb weight, seat height, wheel sizes, fuel capacity and published fuel figures. MotoIndex keeps comfort claims out of the conclusion because seat design and riding position are not yet normalized in the structured dataset.",
    sections: ["Price", "Engine", "Overall dimensions", "Weight", "Seat height", "Fuel consumption", "Storage", "Fuel-tank size", "Braking", "Which suits tighter urban spaces?", "Which offers more practical storage?"],
    faqs: ["Which is cheaper?", "Which is lighter?", "Which has the lower seat?", "Which has the larger fuel tank?", "Which has better published fuel economy?", "How do the wheel sizes differ?"]
  },
  {
    slug: "adv-160-vs-nmax-v3",
    primaryKeyword: "ADV160 vs NMAX",
    intent: "Cross-brand premium scooter buyer.",
    h1: "Honda ADV160 vs Yamaha NMAX: Price, Specs and Practicality",
    opening: "The ADV160 and current NMAX compete at similar premium-scooter prices but their checked records show different chassis priorities. Ground clearance, curb weight, seat height, fuel tank, tires and safety-equipment wording are more useful here than vague adventure-versus-road labels.",
    sections: ["Price", "Engines", "Weight", "Seat height", "Ground clearance", "Suspension", "Tank and fuel economy", "Storage", "ABS and traction features", "City use", "Longer-distance use"],
    faqs: ["Which is cheaper?", "Which is lighter?", "Which has the lower seat?", "Which has more ground clearance?", "Which has the larger fuel tank?", "How do the ABS and traction-control listings differ?"]
  },
  {
    slug: "adv-160-vs-aerox-v3",
    primaryKeyword: "ADV160 vs Aerox",
    intent: "Buyer cross-shopping an adventure-style scooter and a sport-oriented scooter.",
    h1: "Honda ADV160 vs Yamaha Aerox: Price, Specs and Differences",
    opening: "The ADV160 and current Aerox differ in more than styling. Their current records show measurable differences in price, power, torque, weight, seat height, ground clearance, wheel sizes, fuel capacity and braking equipment.",
    sections: ["Price", "Power and torque", "Weight", "Seat height", "Ground clearance", "Wheel and tire sizes", "Suspension", "Fuel tank", "Fuel economy", "Storage", "Brakes and ABS", "Which is lighter?", "Which has more clearance?", "Which is cheaper?"],
    faqs: ["Which is cheaper?", "Which is lighter?", "Which has more ground clearance?", "Which makes more power?", "Which has the larger tank?", "Which has the lower seat?"]
  },
  {
    slug: "fazzio-vs-giorno-plus",
    primaryKeyword: "Fazzio vs Giorno+",
    intent: "Retro/classic-styled automatic scooter shopper.",
    h1: "Yamaha Fazzio vs Honda Giorno+: Price and Specs Compared",
    opening: "The Fazzio and Giorno+ both appeal to retro-style scooter shoppers, but styling is subjective. MotoIndex therefore compares the checked price, engine, curb weight, seat height, fuel capacity, tires, braking and available equipment data first.",
    sections: ["Price", "Engine", "Weight", "Seat height", "Dimensions", "Fuel economy", "Fuel capacity", "Storage", "Features", "Which is more affordable?", "Which is lighter?", "Which is easier for a lower-seat shopper?"],
    faqs: ["Which is cheaper?", "Which is lighter?", "Which has the lower seat?", "Which has the larger fuel tank?", "Which has better published fuel economy?", "How do their braking records differ?"]
  },
  {
    slug: "tmx125-alpha-vs-ytx-125",
    primaryKeyword: "TMX125 Alpha vs YTX 125",
    intent: "Utility/business/manual motorcycle buyer.",
    h1: "Honda TMX125 Alpha vs Yamaha YTX 125: Price and Specs Compared",
    opening: "The TMX125 Alpha and YTX 125 are utility-focused manual motorcycles, so the useful comparison is price, engine output, curb weight, seat height, fuel capacity, ground clearance, transmission, tires and braking. MotoIndex does not infer reliability, durability or maintenance-cost winners without ownership data.",
    sections: ["Price", "Engine and transmission", "Weight", "Seat height", "Fuel tank", "Dimensions", "Brakes", "Utility-focused specifications", "Which costs less?", "Which has the larger tank?", "Which is lighter?"],
    faqs: ["Which costs less?", "Which has the larger fuel tank?", "Which is lighter?", "Which has the lower seat?", "Which has more ground clearance?", "How do their engine outputs compare?"]
  }
];

export const pendingComparisonEditorialBriefs: ComparisonEditorialBrief[] = [
  {
    slug: "ninja-500-vs-cfmoto-450sr",
    primaryKeyword: "Ninja 500 vs CFMoto 450SR",
    intent: "Entry/mid-size sport-bike purchase decision.",
    h1: "Kawasaki Ninja 500 vs CFMoto 450SR: Price, Power and Specs",
    opening: "Publish only when both current Philippine-market records have source-backed price, engine, output, weight, chassis, brakes and electronics data.",
    sections: ["Price", "Engine architecture", "Horsepower", "Torque", "Power-to-weight", "Weight", "Seat height", "Dimensions", "Suspension", "Brakes and ABS", "Electronics and features", "Fuel capacity"],
    faqs: ["Which costs less?", "Which makes more power on paper?", "Which is lighter?"],
    note: "Pending: the current MotoIndex dataset does not contain a source-backed Philippine-market CFMoto 450SR record."
  },
  {
    slug: "xmax-vs-forza-350",
    primaryKeyword: "XMAX vs Forza 350",
    intent: "Maxi-scooter buyer comparing larger automatic touring-oriented models.",
    h1: "Yamaha XMAX vs Honda Forza 350: Maxi-Scooter Comparison",
    opening: "Publish only when both current Philippine-market records have source-backed price, engine, output, weight, storage, windscreen, braking and equipment data.",
    sections: ["Price", "Engines", "Weight and dimensions", "Seat height", "Storage capacity", "Fuel tank", "Fuel economy", "Windscreen and weather protection", "ABS and traction control", "Features", "Longer-ride specifications"],
    faqs: ["Which costs less?", "Which is lighter?", "Which has the larger fuel tank?"],
    note: "Pending: the current MotoIndex dataset does not contain a source-backed Philippine-market Honda Forza 350 record."
  }
];

export function getComparisonEditorialBrief(slug: string) {
  return comparisonEditorialBriefs.find((brief) => brief.slug === slug);
}
