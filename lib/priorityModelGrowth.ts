export type PriorityModelGrowthProfile = {
  seoTitle: string;
  seoDescription: string;
  intentIntro: string;
  moneyQuestion: string;
  ownershipQuestion: string;
  alternativeIds: string[];
  relatedIds: string[];
  recommendationHref: string;
  recommendationLabel: string;
};

const profiles: Record<string, PriorityModelGrowthProfile> = {
  "yamaha-lexi-155": {
    seoTitle: "Yamaha Lexi 155 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha Lexi 155 price in the Philippines, 155cc specs, seat height, braking, down payment planning, monthly estimate, ownership costs and alternatives.",
    intentIntro: "The Lexi 155 sits near the ₱100K mark, so the useful comparison is not only price. Check what you gain or give up against stronger-equipped 155–160cc scooters before choosing the cheaper monthly payment.",
    moneyQuestion: "Does the lower purchase price still make sense after comparing braking equipment, fuel-tank size, financing and the final dealer quote?",
    ownershipQuestion: "Compare CVT service, 14-inch tire replacement, insurance and nearby Yamaha support with Aerox V3, NMAX V3 and Click 160.",
    alternativeIds: ["yamaha-aerox-v3", "yamaha-nmax-v3", "honda-click-160"],
    relatedIds: ["yamaha-aerox-v3", "yamaha-nmax-v3"],
    recommendationHref: "/recommendations#scooters",
    recommendationLabel: "Compare scooter buying paths"
  },
  "yamaha-yzf-r3": {
    seoTitle: "Yamaha YZF-R3 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha YZF-R3 price in the Philippines, 321cc twin specs, seat height, down payment planning, monthly estimate, ownership costs and alternatives.",
    intentIntro: "The R3 should be compared as a complete sport-bike purchase, not only as a 321cc engine. Price the financing, insurance, 17-inch tires, chain and fairing exposure against newer 373–500cc alternatives.",
    moneyQuestion: "Is the current R3 price still competitive once the monthly payment and sport-bike ownership costs are compared with RC 390, Ninja 500 and 450SR?",
    ownershipQuestion: "Budget insurance, tires, chain and sprockets, scheduled service and possible fairing repair before deciding from the cash price alone.",
    alternativeIds: ["ktm-rc-390", "kawasaki-ninja-500", "cfmoto-450sr"],
    relatedIds: [],
    recommendationHref: "/recommendations#explore",
    recommendationLabel: "Explore sport-bike alternatives"
  },
  "honda-rebel-500": {
    seoTitle: "Honda Rebel 500 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Honda Rebel 500 price in the Philippines, 471cc twin specs, 690mm seat, ABS, down payment planning, monthly estimate and ownership costs.",
    intentIntro: "The Rebel 500 combines a very low 690 mm seat with a 471cc twin, but its 191 kg curb weight still matters. Compare the full purchase and ownership cost before treating low seat height as the whole fit decision.",
    moneyQuestion: "How does the Rebel 500 payment compare with a smaller road bike or the larger Rebel 1100 once insurance, tires and financing are included?",
    ownershipQuestion: "Check low-speed handling, 16-inch tire availability, chain and sprocket service, insurance and Honda big-bike support for your area.",
    alternativeIds: ["honda-rebel-1100", "royal-enfield-hunter-350", "triumph-speed-400"],
    relatedIds: ["honda-rebel-1100"],
    recommendationHref: "/recommendations#400cc",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "zontes-400g": {
    seoTitle: "Zontes 400G Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Zontes 400G price in the Philippines, 400cc CVT specs, 770mm seat, ABS and traction control, monthly estimate, ownership costs and alternatives.",
    intentIntro: "The 400G is unusual because it combines a 400cc CVT, 17.5 L tank, adventure-style chassis and a 203 kg curb weight. Compare it with established maxi scooters on support, tires and total ownership rather than equipment count alone.",
    moneyQuestion: "Does the 400G equipment package justify the purchase price once financing, insurance and local after-sales support are included?",
    ownershipQuestion: "Verify dealer and service access, 17/14-inch replacement tires, CVT consumables, body-panel availability and the real cost of touring accessories.",
    alternativeIds: ["suzuki-burgman-400", "yamaha-xmax", "bmw-c-400-gt"],
    relatedIds: [],
    recommendationHref: "/recommendations#long-rides",
    recommendationLabel: "Compare longer-ride motorcycles"
  },
  "honda-gold-wing": {
    seoTitle: "Honda Gold Wing Price Philippines 2026 | Specs & DCT",
    seoDescription: "Honda Gold Wing price in the Philippines, 1833cc flat-six specs, DCT, seat height, variant pricing, ownership-cost planning and touring research.",
    intentIntro: "At this price level, the Gold Wing decision is much bigger than the monthly payment. Variant equipment, 385 kg curb weight, insurance, large touring tires, service access and long-term ownership all deserve equal attention.",
    moneyQuestion: "What does the Standard or anniversary-variant purchase cost become after insurance, registration, financing and premium touring consumables are added?",
    ownershipQuestion: "Plan for 18/16-inch touring tires, Honda big-bike service access, insurance, battery and electronics care, luggage use and low-speed handling at 385 kg.",
    alternativeIds: ["honda-rebel-1100", "triumph-tiger-sport-660", "bmw-f-900-gs"],
    relatedIds: ["honda-rebel-1100"],
    recommendationHref: "/recommendations#long-rides",
    recommendationLabel: "Compare long-distance motorcycles"
  },
  "ktm-rc-390": {
    seoTitle: "KTM RC 390 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "KTM RC 390 price in the Philippines, 373cc specs, cornering ABS, seat height, down payment planning, monthly estimate, ownership costs and alternatives.",
    intentIntro: "The RC 390 is a focused single-cylinder sport bike, so compare its price with the whole package: 824 mm seat, cornering ABS, sport tires, service access and the ownership cost of faired alternatives.",
    moneyQuestion: "Does the RC 390 still fit the budget after financing, insurance, sport tires and scheduled service are included?",
    ownershipQuestion: "Confirm the exact Philippine model year, KTM service access, 17-inch tire cost and fairing-repair exposure before choosing it on performance alone.",
    alternativeIds: ["yamaha-yzf-r3", "kawasaki-ninja-500", "cfmoto-450sr"],
    relatedIds: ["ktm-390-duke", "ktm-390-adventure"],
    recommendationHref: "/recommendations#explore",
    recommendationLabel: "Explore sport-bike alternatives"
  }
};

export function priorityModelGrowthProfile(modelId: string) {
  return profiles[modelId];
}

export function isPriorityGrowthModel(modelId: string) {
  return Boolean(profiles[modelId]);
}
