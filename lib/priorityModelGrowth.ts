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
  legacyContext?: {
    heading: string;
    body: string;
  };
};

const profiles: Record<string, PriorityModelGrowthProfile> = {
  "yamaha-aerox-v3": {
    seoTitle: "Yamaha Aerox V3 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha Aerox V3 price in the Philippines, 155cc specs, colors, seat height, tire sizes, down payment, monthly estimate, fuel and ownership costs.",
    intentIntro: "The Aerox V3 is one of the highest-demand sport scooters, so the useful decision is not just SRP. Compare the exact variant, braking and traction-control equipment, monthly payment, rider fit and ownership costs against NMAX, Click 160 and ADV160.",
    moneyQuestion: "Does the Aerox V3 still fit your budget after the exact variant price, down payment, monthly payment, insurance and dealer fees are included?",
    ownershipQuestion: "Compare CVT service, 14-inch tires, fuel use, insurance, storage and nearby Yamaha support with NMAX V3, Click 160 and ADV160.",
    alternativeIds: ["yamaha-nmax-v3", "honda-click-160", "honda-adv-160"],
    relatedIds: ["yamaha-nmax-v3", "yamaha-fazzio"],
    recommendationHref: "/recommendations/150cc-scooters-philippines",
    recommendationLabel: "Compare 150cc and 155cc scooters"
  },
  "yamaha-nmax-v3": {
    seoTitle: "Yamaha NMAX V3 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha NMAX V3 price in the Philippines, 155cc specs, variants, seat height, tire sizes, down payment, monthly estimate and ownership costs.",
    intentIntro: "The NMAX V3 sits in the premium 155cc scooter tier, where trim choice and total cost matter as much as the base price. Compare Standard and Tech MAX pricing, financing, rider fit, fuel range and ownership against Aerox, PCX160 and ADV160.",
    moneyQuestion: "How much does the NMAX V3 cost once the exact variant, down payment, monthly payment, registration, insurance and dealer fees are included?",
    ownershipQuestion: "Compare CVT service, 13-inch tires, fuel range, insurance and local Yamaha support with Aerox V3, PCX160 and ADV160.",
    alternativeIds: ["yamaha-aerox-v3", "honda-pcx-160", "honda-adv-160"],
    relatedIds: ["yamaha-aerox-v3", "yamaha-xmax"],
    recommendationHref: "/recommendations/150cc-scooters-philippines",
    recommendationLabel: "Compare 150cc and 155cc scooters"
  },
  "honda-adv-160": {
    seoTitle: "Honda ADV160 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Honda ADV160 price in the Philippines, 157cc specs, seat height, tires, ABS, down payment, monthly estimate, fuel planning and ownership costs.",
    intentIntro: "The ADV160 carries an adventure-scooter premium over simpler commuters, so compare the exact variant, ABS and RoadSync equipment, financing, rider fit and ownership cost rather than treating engine size as the whole decision.",
    moneyQuestion: "Does the ADV160 premium still make sense after comparing the exact trim, down payment, monthly payment, insurance and final dealer quote?",
    ownershipQuestion: "Compare CVT service, mixed-size tires, fuel range, bodywork, insurance and Honda support with NMAX V3, PCX160 and Click 160.",
    alternativeIds: ["yamaha-nmax-v3", "honda-pcx-160", "honda-click-160"],
    relatedIds: ["honda-pcx-160", "honda-click-160"],
    recommendationHref: "/recommendations/160cc-scooters-philippines",
    recommendationLabel: "Compare 160cc scooters"
  },
  "honda-adv-350": {
    seoTitle: "Honda ADV350 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Honda ADV350 price in the Philippines, 330cc specs, colors, seat height, ABS, down payment, monthly estimate, fuel range and ownership costs.",
    intentIntro: "The ADV350 sits above 160cc scooters but below Honda's larger X-ADV on price and size. Compare the current ₱310,000 Honda SRP, financing, 795 mm seat, 186 kg curb weight and ownership costs against XMAX, X-ADV and other maxi scooters before choosing on displacement alone.",
    moneyQuestion: "What does the ADV350 cost after the down payment, monthly payment, insurance, registration and dealer fees are included?",
    ownershipQuestion: "Compare CVT service, 15/14-inch tires, fuel range, insurance and Honda Big Wing or Wing Shop access with XMAX, X-ADV and 400-class maxi scooters.",
    alternativeIds: ["yamaha-xmax", "honda-x-adv", "zontes-400g"],
    relatedIds: ["honda-adv-160", "honda-x-adv"],
    recommendationHref: "/recommendations/maxi-scooters-philippines",
    recommendationLabel: "Compare maxi scooters"
  },
  "honda-cb650r": {
    seoTitle: "Honda CB650R Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Honda CB650R price in the Philippines, 649cc inline-four specs, seat height, fuel consumption, colors, down payment, monthly estimate and ownership.",
    intentIntro: "The 2026 CB650R is sold in Standard and E-Clutch forms, so compare the ₱525,000 and ₱565,000 variants, 810 mm seat, inline-four running costs, financing and equipment before deciding from engine sound or styling alone.",
    moneyQuestion: "How much does the CB650R cost once the chosen Standard or E-Clutch variant, down payment, monthly payment, insurance and dealer fees are included?",
    ownershipQuestion: "Budget 17-inch tires, chain and sprocket service, insurance, fuel use and Honda Big Wing support, then compare those costs with other middleweight naked bikes.",
    alternativeIds: ["triumph-trident-660", "kawasaki-z500", "honda-nx500"],
    relatedIds: ["honda-nx500"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "kawasaki-z500": {
    seoTitle: "Kawasaki Z500 Price Philippines 2026 | Z400 Legacy",
    seoDescription: "Kawasaki Z500 price in the Philippines, 451cc specs, seat height, ABS, financing and Z400 legacy context for riders replacing an older Z400 search.",
    intentIntro: "If you arrived looking for Kawasaki Z400 price information, the Z400 is no longer in Kawasaki Philippines' current sports lineup. The current Z500 is the closest new-bike continuation of that lightweight naked-bike search intent, with a 451cc twin, 785 mm seat and current Philippine MSRP.",
    moneyQuestion: "Compare the current Z500 purchase price, financing, insurance and registration with used Z400 asking prices rather than treating old Z400 SRP figures as current.",
    ownershipQuestion: "Compare 17-inch tires, chain and sprocket service, ABS, insurance and Kawasaki service access with other current lightweight naked bikes.",
    alternativeIds: ["honda-cb650r", "yamaha-yzf-r3", "kawasaki-ninja-500"],
    relatedIds: ["kawasaki-ninja-500"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles",
    legacyContext: {
      heading: "Looking for the Kawasaki Z400?",
      body: "The Z400 is no longer listed in Kawasaki Philippines' current sports lineup. MotoIndex consolidates Z400 search intent here so older Z400 price/spec research stays separate from the current Z500 buying decision."
    }
  },
  "honda-winner-x": {
    seoTitle: "Honda Winner X Price Philippines 2026 | RS150R Context",
    seoDescription: "Honda Winner X price in the Philippines, 150cc specs, ABS variants, seat height, financing and RS150R legacy context for current underbone buyers.",
    intentIntro: "Honda's current sporty underbone coverage centers on the Winner X. If you arrived looking for RS150R pricing or specs, use that older model as historical context and compare the current Winner X on price, braking package, rider fit and ownership.",
    moneyQuestion: "Compare the exact Winner X variant, down payment, monthly payment, registration and insurance with used RS150R asking prices before deciding on budget.",
    ownershipQuestion: "Compare chain and sprocket service, 17-inch tires, ABS availability, insurance and Honda service access with Raider R150 and Sniper 155.",
    alternativeIds: ["suzuki-raider-r150", "yamaha-sniper-155"],
    relatedIds: ["suzuki-raider-r150", "yamaha-sniper-155"],
    recommendationHref: "/recommendations/best-motorcycles-for-daily-commute-philippines",
    recommendationLabel: "Compare daily-commute motorcycles",
    legacyContext: {
      heading: "Looking for the Honda RS150R?",
      body: "RS150R is legacy Philippine search intent. MotoIndex routes that research into the current Winner X page instead of publishing a stale RS150R as a current model."
    }
  },

  "kawasaki-ninja-500": {
    seoTitle: "Kawasaki Ninja 500 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Kawasaki Ninja 500 price in the Philippines, 451cc specs, seat height, tires, down payment, monthly estimate, Ninja 400 context and ownership costs.",
    intentIntro: "If you arrived looking for Ninja 400 price information, Kawasaki Philippines now lists the Ninja 500 as the current 451cc entry in this sport-bike tier. Compare its ₱353,800 MSRP, financing, 785 mm seat and running costs against R3, RC 390 and 450SR while keeping older Ninja 400 pricing historical.",
    moneyQuestion: "Does the current Ninja 500 fit the budget after down payment, monthly payment, insurance, registration and dealer charges are included?",
    ownershipQuestion: "Compare 17-inch tires, chain and sprocket service, fairing exposure, insurance and Kawasaki service access with R3, RC 390 and 450SR.",
    alternativeIds: ["yamaha-yzf-r3", "ktm-rc-390", "cfmoto-450sr"],
    relatedIds: ["kawasaki-z500"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },

  "yamaha-mio-gravis": {
    seoTitle: "Yamaha Mio Gravis Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha Mio Gravis price in the Philippines, 125cc specs, seat height, tire sizes, down payment, monthly estimate and ownership costs.",
    intentIntro: "The Mio Gravis sits in Yamaha's practical 125cc scooter lineup, so compare its ₱84,900 current price, 780 mm seat, 12-inch tires, financing and everyday ownership against Mio i 125, Mio Gear and Fazzio rather than choosing from styling alone.",
    moneyQuestion: "What does the Mio Gravis cost after the down payment, monthly payment, registration, insurance and dealer fees are included?",
    ownershipQuestion: "Compare CVT service, 12-inch tires, fuel use, storage and Yamaha service access with Mio i 125, Mio Gear and Fazzio.",
    alternativeIds: ["yamaha-mio-i-125", "yamaha-mio-gear", "yamaha-fazzio"],
    relatedIds: ["yamaha-mio-i-125", "yamaha-fazzio"],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters"
  },
  "yamaha-mio-i-125": {
    seoTitle: "Yamaha Mio i 125 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha Mio i 125 price in the Philippines, 125cc specs, 750mm seat height, tires, down payment, monthly estimate and ownership costs.",
    intentIntro: "The Mio i 125 remains a light, low-seat Yamaha commuter with current dealer availability. Compare its ₱75,900 dealer price, 750 mm seat, 92 kg wet weight and financing with Mio Gravis, Mio Gear and Click 125i before deciding on headline price alone.",
    moneyQuestion: "How much does the Mio i 125 cost after down payment, monthly payment, registration, insurance and dealer fees?",
    ownershipQuestion: "Compare CVT service, 14-inch tires, fuel use and Yamaha support with Mio Gravis, Mio Gear and Click 125i.",
    alternativeIds: ["yamaha-mio-gravis", "yamaha-mio-gear", "honda-click-125i"],
    relatedIds: ["yamaha-mio-gravis", "yamaha-fazzio"],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters",
    legacyContext: {
      heading: "Looking for the Yamaha Mio Sporty?",
      body: "Mio Sporty is an older 114cc carbureted Mio generation. MotoIndex consolidates that legacy search intent into the current Mio i 125 research page while keeping the older Mio Sporty price from being presented as a current new-bike quote."
    }
  },
  "yamaha-tmax": {
    seoTitle: "Yamaha TMAX Price Philippines 2026 | Tech Max Specs",
    seoDescription: "Yamaha TMAX price in the Philippines, current 562cc Tech Max specs, seat height, tires, financing, ownership costs and maxi-scooter alternatives.",
    intentIntro: "MotoIndex keeps TMAX search intent on one canonical page. Yamaha Philippines currently exposes the 560-class TMAX, while Motortrade lists the TMAX Tech Max at ₱859,000, so compare that verified configuration against XMAX, ADV350 and X-ADV on price, weight, fit and ownership.",
    moneyQuestion: "What does the current TMAX Tech Max cost after financing, insurance, registration and premium-scooter ownership expenses are included?",
    ownershipQuestion: "Compare 15-inch tires, CVT service, insurance, Yamaha big-bike support and 220 kg wet weight with XMAX, ADV350 and X-ADV.",
    alternativeIds: ["yamaha-xmax", "honda-adv-350", "honda-x-adv"],
    relatedIds: ["yamaha-xmax"],
    recommendationHref: "/recommendations/maxi-scooters-philippines",
    recommendationLabel: "Compare maxi scooters"
  },

  "yamaha-yzf-r1m": {
    seoTitle: "Yamaha YZF-R1M Price Philippines 2026 | R1 Specs",
    seoDescription: "Yamaha YZF-R1M price in the Philippines, 998cc R1 specs, seat height, weight, tires, financing, ownership costs and Yamaha R1 search context.",
    intentIntro: "Yamaha Philippines currently exposes the YZF-R1M as its Philippine R1-family supersport product. Searchers often shorten the name to Yamaha R1 or simply R1, so MotoIndex keeps that demand on this one canonical R1M page instead of creating separate thin R1 price, specs or installment URLs.",
    moneyQuestion: "What does the YZF-R1M cost after the latest dealer quote, down payment, financing, insurance, registration and premium supersport consumables are included?",
    ownershipQuestion: "Budget 17-inch hypersport tires, chain and sprocket service, insurance, premium fuel, fairing exposure and Yamaha big-bike service access before comparing only the purchase price.",
    alternativeIds: ["honda-cb650r", "kawasaki-ninja-500", "yamaha-yzf-r3"],
    relatedIds: ["yamaha-yzf-r3", "yamaha-tmax"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },

  "motorstar-cafe-400": {
    seoTitle: "MotorStar Cafe 400 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "MotorStar Cafe 400 price in the Philippines, 397.2cc specs, seat height, tire sizes, financing, ownership costs and current price-source checks.",
    intentIntro: "The Cafe 400 is already a strong value-bike search target, so MotoIndex keeps price, specs, installment and ownership intent on this one canonical page. Current Philippine market listings agree on a ₱140,000 reference price, but MotoIndex did not locate a model-level MotorStar manufacturer page in this verification pass.",
    moneyQuestion: "What does the Cafe 400 cost after down payment, monthly payment, registration, insurance, dealer fees and first-year maintenance are included?",
    ownershipQuestion: "Compare its 397.2cc single-cylinder engine, 790 mm seat, 19/18-inch tires, chain service and simpler braking package against current larger-displacement alternatives before deciding on price alone.",
    alternativeIds: ["triumph-speed-400", "kawasaki-z500", "honda-cb650r"],
    relatedIds: ["motorstar-xplorer-250r"],
    recommendationHref: "/recommendations/cafe-racer-motorcycles-philippines",
    recommendationLabel: "Compare classic and cafe-style motorcycles"
  },
  "kawasaki-z1000-r-edition": {
    seoTitle: "Kawasaki Z1000 R Edition Price Philippines | 2017 Specs",
    seoDescription: "Historical Kawasaki Z1000 R Edition Philippine price and 2017 specs, including 1043cc engine, seat height, weight, tires and current-model context.",
    intentIntro: "Kawasaki Philippines still hosts the Z1000 R Edition page, but the manufacturer copy identifies it as the 2017 model. MotoIndex therefore keeps the ₱710,000 figure as historical Philippine MSRP rather than presenting it as a current 2026 dealer price.",
    moneyQuestion: "Use the ₱710,000 figure as historical context only; current used-bike value, registration, insurance and maintenance costs depend on the specific unit and condition.",
    ownershipQuestion: "For used-bike research, verify service history, tires, chain and sprockets, brake hardware, cooling-system condition and parts support before relying on the original specification alone.",
    alternativeIds: ["kawasaki-ninja-1000", "honda-cb650r", "yamaha-yzf-r1m"],
    relatedIds: ["kawasaki-ninja-1000"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare current 400cc+ motorcycles"
  },
  "vespa-gts-supersport-300": {
    seoTitle: "Vespa GTS SuperSport 300 Price Philippines 2026 | Specs",
    seoDescription: "Vespa GTS SuperSport 300 price in the Philippines, 278cc specs, ABS, ASR, seat height, fuel use, financing and ownership costs.",
    intentIntro: "Vespa Philippines currently lists the GTS SuperSport 300 at ₱375,000. Keep price, specs, colors, financing and ownership research on this canonical model page rather than splitting those intents into city-price or installment URLs.",
    moneyQuestion: "What does the GTS SuperSport 300 cost after financing, registration, insurance, accessories and scheduled maintenance are included?",
    ownershipQuestion: "Compare Vespa authorized-service access, 12-inch tires, dual-channel ABS, ASR, fuel use and premium-scooter insurance with the GTV 300 and other premium scooters.",
    alternativeIds: ["vespa-gtv-300", "bmw-c-400-gt", "honda-adv-350"],
    relatedIds: ["vespa-gtv-300", "vespa-sprint-150"],
    recommendationHref: "/recommendations/maxi-scooters-philippines",
    recommendationLabel: "Compare premium and maxi scooters"
  },
  "vespa-gtv-300": {
    seoTitle: "Vespa GTV 300 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Vespa GTV 300 price in the Philippines, 278cc specs, ABS, ASR, seat height, financing, ownership costs and current Vespa PH pricing.",
    intentIntro: "Vespa Philippines currently lists the GTV 300 at ₱425,000 and notes that the price includes accessories. MotoIndex keeps price, specs, financing and ownership intent consolidated on this canonical model page.",
    moneyQuestion: "What does the GTV 300 cost after financing, registration, insurance and any dealer-specific fees beyond the published package?",
    ownershipQuestion: "Compare authorized-service access, 12-inch tires, dual-channel ABS, ASR and premium-scooter running costs with the GTS SuperSport 300 and other current alternatives.",
    alternativeIds: ["vespa-gts-supersport-300", "bmw-c-400-gt", "honda-adv-350"],
    relatedIds: ["vespa-gts-supersport-300"],
    recommendationHref: "/recommendations/maxi-scooters-philippines",
    recommendationLabel: "Compare premium and maxi scooters"
  },
  "vespa-primavera-150": {
    seoTitle: "Vespa Primavera 150 Price Philippines 2026 | Specs",
    seoDescription: "Vespa Primavera 150 price in the Philippines, 155cc specs, seat height, tires, ABS, financing and ownership costs.",
    intentIntro: "Current Philippine market listings place the Primavera 150 around ₱210,000 to ₱235,000, while the model specification is anchored to Vespa's official 150-class product data. Keep variant, price, specs and installment research on this one URL.",
    moneyQuestion: "What does a Primavera 150 cost after the exact trim, down payment, monthly payment, registration, insurance and accessories are confirmed?",
    ownershipQuestion: "Compare 12-inch tires, front ABS, CVT service, authorized Vespa support and premium-scooter running costs with Sprint 150 and other retro scooters.",
    alternativeIds: ["vespa-sprint-150", "kymco-like-150i-abs", "aprilia-sr-gt-200"],
    relatedIds: ["vespa-sprint-150", "vespa-gts-supersport-300"],
    recommendationHref: "/recommendations/best-scooters-philippines",
    recommendationLabel: "Compare scooters in the Philippines"
  },
  "vespa-sprint-150": {
    seoTitle: "Vespa Sprint 150 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Vespa Sprint 150 price in the Philippines, 155cc specs, seat height, tires, ABS, financing, colors and ownership costs.",
    intentIntro: "Current Philippine market listings place Sprint 150 pricing across multiple trims, while MotoIndex anchors the technical specification to Vespa's official 150-class Sprint data. Price, specs, colors and installment intent stay on this canonical URL.",
    moneyQuestion: "What does a Sprint 150 cost after the exact trim, dealer quote, down payment, monthly payment, registration and insurance are included?",
    ownershipQuestion: "Compare 12-inch tires, ABS, CVT service, Vespa support and premium-scooter running costs with Primavera 150 and other retro-scooter alternatives.",
    alternativeIds: ["vespa-primavera-150", "kymco-like-150i-abs", "aprilia-sr-gt-200"],
    relatedIds: ["vespa-primavera-150", "vespa-gts-supersport-300"],
    recommendationHref: "/recommendations/best-scooters-philippines",
    recommendationLabel: "Compare scooters in the Philippines"
  },

  "honda-crf300-rally": {
    seoTitle: "Honda CRF300 Rally Price Philippines 2026 | Specs",
    seoDescription: "Honda CRF300 Rally price in the Philippines, 286cc specs, seat height, ground clearance, ABS, CRF250 Rally successor context, financing and ownership.",
    intentIntro: "The CRF300 Rally is the current Honda entity for riders comparing a lightweight road-and-trail adventure bike. Honda Philippines listed it at ₱309,900 in 2025, with a 286cc engine, 12.8 L tank and rally-style long-distance equipment.",
    moneyQuestion: "What does the CRF300 Rally cost after down payment, monthly payment, registration, insurance, protection parts and dealer fees are included?",
    ownershipQuestion: "Compare 21/18-inch tire availability, chain and sprocket service, tall-seat fit, crash protection and Honda service access with lighter dual-sport alternatives.",
    alternativeIds: ["honda-crf150l", "yamaha-wr155r", "kawasaki-klx230"],
    relatedIds: ["honda-crf150l"],
    recommendationHref: "/recommendations/dual-sport-motorcycles-philippines",
    recommendationLabel: "Compare dual-sport motorcycles",
    legacyContext: {
      heading: "Looking for the Honda CRF250 Rally?",
      body: "Honda Philippines identifies the CRF300 Rally as the enhanced successor to the CRF250 Rally. MotoIndex keeps CRF250 Rally search and predecessor context on this CRF300 Rally page instead of publishing the older 250 as a current Philippine model."
    }
  },

  "honda-click-125i": {
    seoTitle: "Honda Click 125i Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Honda Click 125i price in the Philippines, 125cc specs, colors, seat height, tires, down payment, monthly estimate, fuel economy and ownership costs.",
    intentIntro: "The Click 125i is a high-volume commuter choice, so small differences in trim price, fuel use, braking, storage and monthly payment matter more than headline performance. Compare the full daily-use package before reserving.",
    moneyQuestion: "What does the Click 125i really cost after choosing the exact trim and adding down payment, monthly payment, fees and insurance?",
    ownershipQuestion: "Compare fuel use, CVT service, 14-inch tires, storage and nearby Honda support with Mio Gear, Fazzio and Burgman Street EX.",
    alternativeIds: ["yamaha-mio-gear", "yamaha-fazzio", "suzuki-burgman-street-ex"],
    relatedIds: ["honda-click-160"],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters"
  },
  "honda-click-160": {
    seoTitle: "Honda Click 160 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Honda Click 160 price in the Philippines, 157cc specs, seat height, tire sizes, down payment, monthly estimate, fuel economy and ownership costs.",
    intentIntro: "The Click 160 competes directly with sport and premium scooters, so compare its lower weight and commuter focus against ADV160, Aerox V3 and PCX160 on price, financing, braking, fit and ownership.",
    moneyQuestion: "Does the Click 160 remain the better-value 160-class choice after down payment, monthly payment, insurance and dealer fees are included?",
    ownershipQuestion: "Compare CVT maintenance, 14-inch tires, fuel economy, storage and Honda service convenience with ADV160, Aerox V3 and PCX160.",
    alternativeIds: ["honda-adv-160", "yamaha-aerox-v3", "honda-pcx-160"],
    relatedIds: ["honda-click-125i", "honda-adv-160"],
    recommendationHref: "/recommendations/160cc-scooters-philippines",
    recommendationLabel: "Compare 160cc scooters"
  },
  "honda-pcx-160": {
    seoTitle: "Honda PCX160 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Honda PCX160 price in the Philippines, 157cc specs, variants, seat height, tires, down payment, monthly estimate, fuel and ownership costs.",
    intentIntro: "The PCX160 is a comfort-led premium scooter, so compare Standard and RoadSync pricing, financing, low-seat fit, tank range and ownership costs against NMAX V3 and ADV160 before choosing on styling alone.",
    moneyQuestion: "How much does the PCX160 cost once the exact variant, down payment, monthly payment, insurance and dealer fees are included?",
    ownershipQuestion: "Compare CVT service, 14/13-inch tire replacement, fuel range, bodywork, insurance and Honda support with NMAX V3 and ADV160.",
    alternativeIds: ["yamaha-nmax-v3", "honda-adv-160", "yamaha-aerox-v3"],
    relatedIds: ["honda-adv-160", "honda-click-160"],
    recommendationHref: "/recommendations/160cc-scooters-philippines",
    recommendationLabel: "Compare 160cc scooters"
  },
  "yamaha-fazzio": {
    seoTitle: "Yamaha Fazzio Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha Fazzio price in the Philippines, 125cc specs, colors, seat height, tires, down payment, monthly estimate, fuel planning and ownership costs.",
    intentIntro: "The Fazzio is a style-led 125cc commuter, so compare the real dealer price, financing, rider fit, storage, fuel use and everyday ownership against Click 125i and Mio Gear rather than choosing on appearance alone.",
    moneyQuestion: "Does the Fazzio still fit the budget after the actual dealer quote, down payment, monthly payment, insurance and accessories are included?",
    ownershipQuestion: "Compare CVT service, tire replacement, fuel use, storage and local Yamaha support with Click 125i and Mio Gear.",
    alternativeIds: ["honda-click-125i", "yamaha-mio-gear", "suzuki-burgman-street-ex"],
    relatedIds: ["yamaha-mio-gear", "yamaha-aerox-v3"],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters"
  },
  "suzuki-burgman-street-ex": {
    seoTitle: "Suzuki Burgman Street EX Price 2026 | Specs & Monthly",
    seoDescription: "Suzuki Burgman Street EX price in the Philippines, 125cc specs, seat height, tires, down payment, monthly estimate, fuel planning and ownership costs.",
    intentIntro: "The Burgman Street EX is a comfort-oriented 125cc scooter, so compare its larger-feeling body, final dealer price, financing, rider fit and daily running cost with Click 125i, Fazzio and Mio Gear.",
    moneyQuestion: "Does the Burgman Street EX comfort package justify the final price once down payment, monthly payment, fees and insurance are included?",
    ownershipQuestion: "Compare CVT service, tire availability, fuel use, storage and Suzuki service access with Click 125i, Fazzio and Mio Gear.",
    alternativeIds: ["honda-click-125i", "yamaha-fazzio", "yamaha-mio-gear"],
    relatedIds: [],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters"
  },
  "suzuki-raider-r150": {
    seoTitle: "Suzuki Raider R150 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Suzuki Raider R150 price in the Philippines, 147cc specs, seat height, tires, down payment, monthly estimate, fuel planning and ownership costs.",
    intentIntro: "The Raider R150 is a performance-focused underbone, so compare the full purchase and ownership picture with Sniper 155 and Winner X: financing, insurance, tires, chain service and daily traffic use.",
    moneyQuestion: "What does the Raider R150 cost after down payment, monthly payment, insurance, registration and dealer fees are included?",
    ownershipQuestion: "Compare tires, chain and sprocket service, insurance, fuel use and Suzuki support with Sniper 155 and Winner X.",
    alternativeIds: ["yamaha-sniper-155", "honda-winner-x"],
    relatedIds: [],
    recommendationHref: "/recommendations/best-motorcycles-for-daily-commute-philippines",
    recommendationLabel: "Compare daily-commute motorcycles"
  },
  "yamaha-sniper-155": {
    seoTitle: "Yamaha Sniper 155 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha Sniper 155 price in the Philippines, 155cc specs, variants, seat height, tires, down payment, monthly estimate and ownership costs.",
    intentIntro: "The Sniper 155 should be compared as a complete sport-underbone purchase. Check the exact variant, braking package, financing, insurance and chain-driven ownership against Raider R150 and Winner X.",
    moneyQuestion: "How much does the Sniper 155 cost once the exact variant, down payment, monthly payment, insurance and dealer fees are included?",
    ownershipQuestion: "Compare chain and sprocket service, tires, insurance, fuel use and Yamaha support with Raider R150 and Winner X.",
    alternativeIds: ["suzuki-raider-r150", "honda-winner-x"],
    relatedIds: [],
    recommendationHref: "/recommendations/best-motorcycles-for-daily-commute-philippines",
    recommendationLabel: "Compare daily-commute motorcycles"
  },

  "yamaha-lexi-155": {
    seoTitle: "Yamaha Lexi 155 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha Lexi 155 price in the Philippines, 155cc specs, seat height, braking, down payment planning, monthly estimate, ownership costs and alternatives.",
    intentIntro: "The Lexi 155 sits near the ₱100K mark, so the useful comparison is not only price. Check what you gain or give up against stronger-equipped 155–160cc scooters before choosing the cheaper monthly payment.",
    moneyQuestion: "Does the lower purchase price still make sense after comparing braking equipment, fuel-tank size, financing and the final dealer quote?",
    ownershipQuestion: "Compare CVT service, 14-inch tire replacement, insurance and nearby Yamaha support with Aerox V3, NMAX V3 and Click 160.",
    alternativeIds: ["yamaha-aerox-v3", "yamaha-nmax-v3", "honda-click-160"],
    relatedIds: ["yamaha-aerox-v3", "yamaha-nmax-v3"],
    recommendationHref: "/recommendations/150cc-scooters-philippines",
    recommendationLabel: "Compare 150cc and 155cc scooters"
  },
  "yamaha-yzf-r3": {
    seoTitle: "Yamaha YZF-R3 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha YZF-R3 price in the Philippines, 321cc twin specs, seat height, down payment planning, monthly estimate, ownership costs, alternatives and fitment.",
    intentIntro: "The R3 should be compared as a complete sport-bike purchase, not only as a 321cc engine. Price the financing, insurance, 17-inch tires, chain and fairing exposure against newer 373–500cc alternatives.",
    moneyQuestion: "Is the current R3 price still competitive once the monthly payment and sport-bike ownership costs are compared with RC 390, Ninja 500 and 450SR?",
    ownershipQuestion: "Budget insurance, tires, chain and sprockets, scheduled service and possible fairing repair before deciding from the cash price alone.",
    alternativeIds: ["ktm-rc-390", "kawasaki-ninja-500", "cfmoto-450sr"],
    relatedIds: [],
    recommendationHref: "/recommendations/motorcycles-under-400cc-philippines",
    recommendationLabel: "Compare under-400cc motorcycles"
  },
  "honda-rebel-500": {
    seoTitle: "Honda Rebel 500 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Honda Rebel 500 price in the Philippines, 471cc twin specs, 690mm seat, ABS, down payment planning, monthly estimate, ownership costs and alternatives.",
    intentIntro: "The Rebel 500 combines a very low 690 mm seat with a 471cc twin, but its 191 kg curb weight still matters. Compare the full purchase and ownership cost before treating low seat height as the whole fit decision.",
    moneyQuestion: "How does the Rebel 500 payment compare with a smaller road bike or the larger Rebel 1100 once insurance, tires and financing are included?",
    ownershipQuestion: "Check low-speed handling, 16-inch tire availability, chain and sprocket service, insurance and Honda big-bike support for your area.",
    alternativeIds: ["honda-rebel-1100", "royal-enfield-hunter-350", "triumph-speed-400"],
    relatedIds: ["honda-rebel-1100"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "zontes-400g": {
    seoTitle: "Zontes 400G Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Zontes 400G price in the Philippines, 400cc CVT specs, 770mm seat, ABS and traction control, monthly estimate, ownership costs, alternatives and fitment.",
    intentIntro: "The 400G is unusual because it combines a 400cc CVT, 17.5 L tank, adventure-style chassis and a 203 kg curb weight. Compare it with established maxi scooters on support, tires and total ownership rather than equipment count alone.",
    moneyQuestion: "Does the 400G equipment package justify the purchase price once financing, insurance and local after-sales support are included?",
    ownershipQuestion: "Verify dealer and service access, 17/14-inch replacement tires, CVT consumables, body-panel availability and the real cost of touring accessories.",
    alternativeIds: ["suzuki-burgman-400", "yamaha-xmax", "bmw-c-400-gt"],
    relatedIds: [],
    recommendationHref: "/recommendations/maxi-scooters-philippines",
    recommendationLabel: "Compare maxi scooters"
  },
  "honda-gold-wing": {
    seoTitle: "Honda Gold Wing Price Philippines 2026 | Specs & DCT",
    seoDescription: "Honda Gold Wing price in the Philippines, 1833cc flat-six specs, DCT, seat height, variant pricing, ownership-cost planning, touring research and fitment.",
    intentIntro: "At this price level, the Gold Wing decision is much bigger than the monthly payment. Variant equipment, 385 kg curb weight, insurance, large touring tires, service access and long-term ownership all deserve equal attention.",
    moneyQuestion: "What does the Standard or anniversary-variant purchase cost become after insurance, registration, financing and premium touring consumables are added?",
    ownershipQuestion: "Plan for 18/16-inch touring tires, Honda big-bike service access, insurance, battery and electronics care, luggage use and low-speed handling at 385 kg.",
    alternativeIds: ["honda-rebel-1100", "triumph-tiger-sport-660", "bmw-f-900-gs"],
    relatedIds: ["honda-rebel-1100"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "ktm-rc-390": {
    seoTitle: "KTM RC 390 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "KTM RC 390 price in the Philippines, 373cc specs, cornering ABS, seat height, down payment planning, monthly estimate, ownership costs and alternatives.",
    intentIntro: "The RC 390 is a focused single-cylinder sport bike, so compare its price with the whole package: 824 mm seat, cornering ABS, sport tires, service access and the ownership cost of faired alternatives.",
    moneyQuestion: "Does the RC 390 still fit the budget after financing, insurance, sport tires and scheduled service are included?",
    ownershipQuestion: "Confirm the exact Philippine model year, KTM service access, 17-inch tire cost and fairing-repair exposure before choosing it on performance alone.",
    alternativeIds: ["yamaha-yzf-r3", "kawasaki-ninja-500", "cfmoto-450sr"],
    relatedIds: ["ktm-390-duke", "ktm-390-adventure"],
    recommendationHref: "/recommendations/motorcycles-under-400cc-philippines",
    recommendationLabel: "Compare under-400cc motorcycles"
  }
};

export function priorityModelGrowthProfile(modelId: string) {
  return profiles[modelId];
}

export function isPriorityGrowthModel(modelId: string) {
  return Boolean(profiles[modelId]);
}
