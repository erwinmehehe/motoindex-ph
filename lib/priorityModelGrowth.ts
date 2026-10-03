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
  "yamaha-mio-sporty": {
    seoTitle: "Yamaha Mio Sporty Price Philippines | Dealer Stock & Specs",
    seoDescription: "Yamaha Mio Sporty price Philippines reference with ₱73,900 dealer listings, 114cc specs, 745mm seat and availability-to-verify guidance for PH buyers.",
    intentIntro: "Mio Sporty still carries strong Philippine search demand and remains visible in current dealer inventory, even though MotoIndex has not confirmed it in Yamaha Philippines' current national model catalog. Keep the ₱73,900 dealer reference, 114cc specifications and inventory caveat together on one canonical page.",
    moneyQuestion: "Is the ₱73,900 Mio Sporty listing still available at the branch you plan to buy from, and what model year, warranty and registration package are included?",
    ownershipQuestion: "Compare CVT service, 14-inch tires, fuel use, parts support and the 745 mm seat with Mio i 125, Mio Gear and Fazzio before choosing dealer inventory on price alone.",
    alternativeIds: ["yamaha-mio-i-125", "yamaha-mio-gear", "yamaha-fazzio"],
    relatedIds: ["yamaha-mio-i-125", "yamaha-mio-gravis"],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters",
    legacyContext: { heading: "Dealer inventory, not confirmed national catalog", body: "Motortrade and Wheeltek still list Mio Sporty inventory, but MotoIndex has not independently confirmed current Yamaha Philippines national-catalog status. Verify the exact unit before treating the dealer listing as a nationwide current model." }
  },
  "suzuki-gsx-r150": {
    seoTitle: "Suzuki GSX-R150 Price Philippines | Dealer Stock & Specs",
    seoDescription: "Suzuki GSX-R150 price Philippines reference with ₱156,224 dealer listing, 147cc specs, 785mm seat, six-speed gearbox and current stock verification guidance.",
    intentIntro: "GSX-R150 search demand remains meaningful and Motortrade still exposes a Philippine dealer listing. MotoIndex preserves the current dealer price reference and Suzuki-sourced specification context while labeling national-catalog availability as something buyers should verify.",
    moneyQuestion: "Is the listed GSX-R150 unit actually in stock at the branch, and what is the exact cash price, model year, registration package and warranty coverage?",
    ownershipQuestion: "Compare 17-inch sport tires, chain and sprocket service, fairing exposure and insurance with R15M, CBR150R and other lightweight sport bikes.",
    alternativeIds: ["yamaha-yzf-r15m", "honda-cbr150r", "suzuki-raider-r150"],
    relatedIds: ["suzuki-gsx-s150"],
    recommendationHref: "/recommendations/motorcycles-under-400cc-philippines",
    recommendationLabel: "Compare under-400cc motorcycles",
    legacyContext: { heading: "Current dealer visibility, national status to verify", body: "Motortrade currently lists the GSX-R150, but MotoIndex has not confirmed a current Suzuki Philippines national-catalog page for the exact unit. Keep dealer-stock evidence separate from national lineup status." }
  },
  "yamaha-xtz-125": {
    seoTitle: "Yamaha XTZ 125 Price Philippines | Dealer Stock & Trail Use",
    seoDescription: "Yamaha XTZ 125 price Philippines reference with ₱89,900 dealer listing, 124cc specs, 840mm seat, 21/18 wheels, 260mm clearance and stock-check guidance.",
    intentIntro: "XTZ 125 has substantial Philippine search demand and remains visible through Wheeltek, while Yamaha Philippines after-sales material still references the model. MotoIndex keeps the dealer price and trail-fit data indexable without claiming current national-catalog availability.",
    moneyQuestion: "Does your Yamaha dealer actually have a current XTZ 125 unit, and what model year, invoice price, warranty and registration documents come with it?",
    ownershipQuestion: "Compare the 840 mm seat, 118 kg curb weight, 260 mm clearance, 21/18-inch tires, chain service and parts access with CRF150L and KLX150.",
    alternativeIds: ["honda-crf150l", "kawasaki-klx150", "yamaha-wr155r"],
    relatedIds: ["yamaha-wr155r"],
    recommendationHref: "/recommendations/dual-sport-motorcycles-philippines",
    recommendationLabel: "Compare dual-sport and trail motorcycles",
    legacyContext: { heading: "Dealer-listed XTZ 125 availability needs verification", body: "Wheeltek lists the XTZ 125 and Yamaha after-sales material still names it, but MotoIndex has not confirmed a current Yamaha Philippines product-page listing. Verify the exact branch stock and model year." }
  },
  "suzuki-gsx-s150": {
    seoTitle: "Suzuki GSX-S150 Price Philippines | Dealer Stock & Specs",
    seoDescription: "Suzuki GSX-S150 price Philippines reference with ₱112,800–₱124,800 dealer figures, 147cc specs, 785mm seat and exact branch-quote verification guidance.",
    intentIntro: "GSX-S150 remains a high-search-demand naked-bike reference with current Motortrade visibility. Because the dealer page exposes two different price figures, MotoIndex preserves the range and directs buyers to verify the exact branch quote and model code.",
    moneyQuestion: "Which GSX-S150 price applies to the exact unit at your branch, and what model year, registration, warranty and dealer charges are included?",
    ownershipQuestion: "Compare 17-inch tires, chain and sprocket service, insurance and parts availability with XSR155, MT-15 and other lightweight naked motorcycles.",
    alternativeIds: ["yamaha-xsr155", "yamaha-mt-15", "honda-cb150r"],
    relatedIds: ["suzuki-gsx-r150"],
    recommendationHref: "/recommendations/naked-motorcycles-philippines",
    recommendationLabel: "Compare naked motorcycles",
    legacyContext: { heading: "Dealer price range needs branch confirmation", body: "Motortrade currently exposes both ₱112,800 and ₱124,800 figures for the GSX-S150. MotoIndex preserves the discrepancy instead of selecting one price without evidence." }
  },
  "tvs-ntorq-125": {
    seoTitle: "TVS NTORQ 125 Price Philippines | Dealer Stock & Specs PH",
    seoDescription: "TVS NTORQ 125 price Philippines reference with ₱71,900 retailer listing, 125cc specs, 770mm seat, 12-inch wheels and current availability verification guidance.",
    intentIntro: "TVS officially launched the NTORQ 125 in the Philippines and local retailer inventory still creates search demand, but current nationwide availability is not clear. MotoIndex keeps the ₱71,900 retailer reference and model specifications indexable with that caveat.",
    moneyQuestion: "Is a new NTORQ 125 actually available now, and what exact retailer price, model year, warranty and registration package apply to the unit?",
    ownershipQuestion: "Compare 12-inch tire availability, CVT service, SBT braking, parts supply and local TVS support with Mio Gear, Click 125i and Fazzio.",
    alternativeIds: ["yamaha-mio-gear", "honda-click-125i", "yamaha-fazzio"],
    relatedIds: ["yamaha-mio-gear"],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters",
    legacyContext: { heading: "Philippine launch history with availability to verify", body: "TVS launched the NTORQ 125 locally, while the checked Philippine retailer listing currently shows the unit sold out. Verify actual new-unit availability before purchase." }
  },
  "benelli-motobi-200-evo": {
    seoTitle: "Benelli Motobi 200 Price Philippines | Specs & Availability",
    seoDescription: "Benelli Motobi 200 Evo Philippines reference with ₱125,000 secondary pricing, 197cc specs, 715mm seat and current new-bike availability verification guidance.",
    intentIntro: "Motobi 200 Evo has enough Philippine search demand to keep a useful research page live. Benelli's Philippine technical page remains accessible, but it does not publish a current peso price, so the ₱125,000 figure stays explicitly secondary and availability-to-verify.",
    moneyQuestion: "Can a Philippine Benelli dealer confirm a new Motobi 200 Evo unit, and what is the current cash price, model year, warranty and registration package?",
    ownershipQuestion: "Compare the 715 mm seat, 156 kg curb weight, 15-inch rear tire, chain service and parts support with Hunter 350 and other low-seat retro/cruiser alternatives.",
    alternativeIds: ["royal-enfield-hunter-350", "motorstar-cafe-400", "triumph-speed-400"],
    relatedIds: ["motorstar-cafe-400"],
    recommendationHref: "/recommendations/cruiser-motorcycles-philippines",
    recommendationLabel: "Compare cruiser motorcycles",
    legacyContext: { heading: "Technical page remains, current price does not", body: "Benelli's Philippine technical page is still accessible, but a current official peso price was not located. Treat ₱125,000 as a secondary market reference until a current dealer quote is verified." }
  },
  "honda-cbr500r": {
    seoTitle: "Honda CBR500R Price Philippines | Dealer Stock & 471cc Specs",
    seoDescription: "Honda CBR500R Philippines reference with ₱364,000 launch price, current dealer evidence, 471cc specs, 789mm seat and national-catalog availability caveat.",
    intentIntro: "CBR500R continues to attract Philippine search demand and current dealer evidence exists, but MotoIndex has not confirmed this generation in Honda Philippines' current national catalog. The page therefore keeps Honda launch specifications, dealer evidence and availability caveats together.",
    moneyQuestion: "Is the CBR500R dealer unit still available, what model year is it, and how does the branch quote compare with Honda's ₱364,000 launch reference?",
    ownershipQuestion: "Compare 17-inch tires, chain and sprocket service, insurance, fairing costs and Honda big-bike support with Ninja 500, 450SR and CBR650R.",
    alternativeIds: ["kawasaki-ninja-500", "cfmoto-450sr", "honda-cbr650r"],
    relatedIds: ["honda-cbr650r"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles",
    legacyContext: { heading: "Dealer evidence does not equal current national catalog", body: "Honda Philippines' launch reference and a current dealer listing support continued research, but buyers should verify whether the exact CBR500R unit is current stock, old stock or a prior model year." }
  },
  "yamaha-sr400": {
    seoTitle: "Yamaha SR400 Price Philippines | 2019 Specs & Availability",
    seoDescription: "Yamaha SR400 Philippines reference with ₱329,000 secondary pricing, 399cc specs, 785mm seat and 2019-generation context; verify any current new-unit stock.",
    intentIntro: "SR400 still receives Philippine search demand, but the stored market evidence points to a 2019 Philippine generation rather than a confirmed current Yamaha lineup model. MotoIndex keeps the page indexable for price/spec research while clearly separating historical generation context from current availability.",
    moneyQuestion: "If a dealer advertises a new SR400, what model year is the unit and does the current invoice price differ from the stored ₱329,000 secondary-market reference?",
    ownershipQuestion: "Compare 18-inch tire availability, chain and sprocket service, parts supply, insurance and age-related old-stock checks with XSR155, Hunter 350 and Cafe 400.",
    alternativeIds: ["yamaha-xsr155", "royal-enfield-hunter-350", "motorstar-cafe-400"],
    relatedIds: ["yamaha-xsr155"],
    recommendationHref: "/recommendations/cafe-racer-motorcycles-philippines",
    recommendationLabel: "Compare classic and cafe-style motorcycles",
    legacyContext: { heading: "2019-generation Philippine context", body: "The stored Philippine comparison reference identifies the latest local SR400 as a 2019 model year. Any claimed new-unit availability should be verified directly with the seller before treating it as current stock." }
  },

  "suzuki-burgman-street": {
    seoTitle: "Suzuki Burgman Street Price Philippines 2026 | Specs & Colors",
    seoDescription: "Suzuki Burgman Street price in the Philippines, 124cc specs, colors, seat height, fuel economy, tires, ownership costs and scooter alternatives.",
    intentIntro: "The Burgman Street brings maxi-scooter styling to the 125cc commuter class. Compare its current price, 780 mm seat, fuel economy, wheel sizes and ownership needs with the Street EX, Click 125i and other practical scooters.",
    moneyQuestion: "What does the Burgman Street cost after the current dealer quote, registration, insurance and other purchase charges are included?",
    ownershipQuestion: "Compare CVT service, tire sizes, fuel use, storage and Suzuki support with Burgman Street EX and other 125cc scooters.",
    alternativeIds: ["suzuki-burgman-street-ex", "honda-click-125i", "yamaha-mio-gear"],
    relatedIds: ["suzuki-burgman-street-ex", "suzuki-burgman-400"],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters"
  },
  "suzuki-burgman-400": {
    seoTitle: "Suzuki Burgman 400 Price Philippines 2026 | Specs & ABS",
    seoDescription: "Suzuki Burgman 400 price in the Philippines, 400cc specs, ABS, 755mm seat, weight, tires, ownership costs and maxi-scooter alternatives.",
    intentIntro: "The Burgman 400 is the large-displacement member of Suzuki's Burgman family. Compare its current Philippine price, 400cc engine, 755 mm seat, 218 kg curb weight and ABS with XMAX, ADV350 and other maxi scooters.",
    moneyQuestion: "What does the Burgman 400 cost after the current dealer quote, registration, insurance and other purchase charges are included?",
    ownershipQuestion: "Compare CVT service, 15/13-inch tires, insurance, fuel range and Suzuki big-bike support with XMAX, ADV350 and other maxi scooters.",
    alternativeIds: ["yamaha-xmax", "honda-adv-350", "zontes-400g"],
    relatedIds: ["suzuki-burgman-street", "suzuki-burgman-street-ex"],
    recommendationHref: "/recommendations/maxi-scooters-philippines",
    recommendationLabel: "Compare maxi scooters"
  },
  "yamaha-aerox-v2": {
    seoTitle: "Yamaha Aerox V2 Philippines | Price, Specs & Aerox V3",
    seoDescription: "Yamaha Aerox V2 Philippines reference with historical price, 155cc specs, tire sizes, seat height and the current Aerox V3 successor.",
    intentIntro: "Aerox V2 still carries major Philippine search demand, but it is a previous generation. Use this canonical page for historical launch pricing and V2 specifications, then compare the current Aerox V3 before treating older pricing as today's new-bike offer.",
    moneyQuestion: "How does the historical Aerox V2 price compare with current Aerox V3 pricing and used V2 listings?",
    ownershipQuestion: "Compare CVT service, 14-inch tires, fuel capacity, braking equipment and parts support while accounting for the V2's previous-generation status.",
    alternativeIds: ["yamaha-aerox-v3", "yamaha-nmax-v3", "honda-click-160"],
    relatedIds: ["yamaha-aerox-v3"],
    recommendationHref: "/recommendations/150cc-scooters-philippines",
    recommendationLabel: "Compare 150cc and 155cc scooters",
    legacyContext: { heading: "Aerox V2 vs the current Aerox V3", body: "Aerox V2 is retained for historical Philippine price and specification research. Use the Aerox V3 page for current-generation new-bike research and pricing." }
  },
  "yamaha-nmax-v2": {
    seoTitle: "Yamaha NMAX V2 Philippines | Price, Specs & NMAX V3",
    seoDescription: "Yamaha NMAX V2 Philippines reference with historical price, 155cc specs, tire sizes, seat height and the current NMAX V3 successor.",
    intentIntro: "NMAX V2 remains a high-demand Philippine search, but it is a previous generation. This canonical page keeps its historical price and specifications useful while directing current new-bike research to NMAX V3.",
    moneyQuestion: "How does the historical NMAX V2 price compare with current NMAX V3 pricing and used V2 listings?",
    ownershipQuestion: "Compare CVT service, 13-inch tires, fuel capacity, variant-dependent ABS and parts support while accounting for the V2's previous-generation status.",
    alternativeIds: ["yamaha-nmax-v3", "honda-pcx-160", "honda-adv-160"],
    relatedIds: ["yamaha-nmax-v3"],
    recommendationHref: "/recommendations/150cc-scooters-philippines",
    recommendationLabel: "Compare 150cc and 155cc scooters",
    legacyContext: { heading: "NMAX V2 vs the current NMAX V3", body: "NMAX V2 is retained for historical Philippine price and specification research. Use the NMAX V3 page for current-generation new-bike research and pricing." }
  },
  "honda-click-150i": {
    seoTitle: "Honda Click 150i Philippines | Price, Specs & Click 160",
    seoDescription: "Honda Click 150i Philippines reference with historical price, 150cc specs, fuel economy, tire sizes and the current Click 160 successor.",
    intentIntro: "The Click 150i remains useful for Philippine historical and used-bike research, but it is a previous generation. Keep its 2018 launch price, 150cc specifications and ownership context on this canonical page, then use the Click 160 page for current new-bike research.",
    moneyQuestion: "How does the historical Click 150i launch price compare with current Click 160 pricing and used Click 150i listings?",
    ownershipQuestion: "Compare CVT service, 14-inch tires, fuel economy, CBS braking and parts support while accounting for the Click 150i's previous-generation status.",
    alternativeIds: ["honda-click-160", "yamaha-aerox-v3", "yamaha-nmax-v3"],
    relatedIds: ["honda-click-160", "honda-click-125i"],
    recommendationHref: "/recommendations/150cc-scooters-philippines",
    recommendationLabel: "Compare 150cc and 155cc scooters",
    legacyContext: { heading: "Click 150i vs the current Click 160", body: "Click 150i is retained for historical Philippine price and specification research. Honda introduced the Click 160 as its successor, so use the Click 160 page for current new-bike pricing and research." }
  },
  "honda-crf300-rally": {
    seoTitle: "Honda CRF300 Rally Price Philippines 2026 | CRF250 Successor",
    seoDescription: "Honda CRF300 Rally price Philippines 2026 with ₱309,900 Honda reference, 286cc specs, 885mm seat, 21/18 wheels and CRF250 Rally successor context for buyers.",
    intentIntro: "Honda Philippines identifies the CRF300 Rally as the enhanced successor to the CRF250 Rally. Keep current price, 286cc specifications, 885 mm seat, 277 mm ground clearance, 21/18-inch wheels and CRF250 predecessor intent consolidated on this one current canonical page.",
    moneyQuestion: "What does the current CRF300 Rally cost after the ₱309,900 Honda reference, registration, insurance, accessories and dealer-specific charges are included?",
    ownershipQuestion: "Compare the 885 mm seat, 153 kg curb weight, 277 mm ground clearance, 21/18-inch tires, chain and sprocket service, protection parts and Honda support with CRF150L, KLX230 and other road-and-trail motorcycles.",
    alternativeIds: ["honda-crf150l", "kawasaki-klx230", "cfmoto-450mt"],
    relatedIds: ["honda-crf150l"],
    recommendationHref: "/recommendations/dual-sport-motorcycles-philippines",
    recommendationLabel: "Compare dual-sport and trail motorcycles",
    legacyContext: {
      heading: "Looking for the Honda CRF250 Rally?",
      body: "Honda Philippines describes the CRF300 Rally as the enhanced successor to the CRF250 Rally. MotoIndex permanently redirects CRF250 Rally research here so historical search intent resolves to the current successor-generation page rather than a stale current-model listing."
    }
  },
  "yamaha-mt-15": {
    seoTitle: "Yamaha MT-15 Philippines | Availability & Specs Reference",
    seoDescription: "Yamaha MT-15 Philippines reference with 155cc specs and ₱180,000 secondary-market pricing; current Yamaha PH model-level availability remains unverified.",
    intentIntro: "MT-15 demand exists in the Philippines, but MotoIndex has not verified a current model-level Yamaha Philippines product listing. Treat the stored ₱180,000 figure and specifications as secondary-market research only until Yamaha PH or an authorized dealer publishes a current model-level reference.",
    moneyQuestion: "Is a brand-new Yamaha MT-15 currently available through an authorized Yamaha Philippines dealer, and what is the exact branch quote for the verified unit?",
    ownershipQuestion: "If verified local stock exists, compare 17-inch tires, chain and sprocket service, insurance, parts support and the 810 mm seat with XSR155, R15M and other current Yamaha 155cc manual motorcycles.",
    alternativeIds: ["yamaha-xsr155", "yamaha-yzf-r15m", "honda-cb150r"],
    relatedIds: ["yamaha-xsr155"],
    recommendationHref: "/recommendations/naked-motorcycles-philippines",
    recommendationLabel: "Compare verified naked motorcycles",
    legacyContext: {
      heading: "Current Philippine availability is not verified",
      body: "MotoIndex keeps this route indexed as an availability-to-verify research reference because the model has stored search demand and dated evidence. It must not be presented as confirmed current Yamaha Philippines inventory until model-level availability is verified."
    }
  },

  "honda-crf150l": {
    seoTitle: "Honda CRF150L Price Philippines | SRP & Availability",
    seoDescription: "Honda CRF150L price Philippines reference with last official ₱147,900 SRP, 149cc specs, 863mm seat, 285mm clearance and 2026 availability caveat.",
    intentIntro: "The CRF150L remains a high-interest Philippine dual-sport, but the newest official Honda SRP MotoIndex could verify is ₱147,900 from June 2023. Use this canonical page for Honda-sourced chassis, engine and trail-fit specifications, while treating 2026 stock and dealer pricing as an availability check rather than a confirmed current listing.",
    moneyQuestion: "Is a CRF150L still available new from an authorized Honda dealer, and how does the dealer quote compare with Honda Philippines' last located ₱147,900 official SRP reference?",
    ownershipQuestion: "Compare the tall 863 mm seat, 285 mm ground clearance, 21/18-inch trail tires, chain and sprocket service, dual disc brakes and local Honda support with other lightweight dual-sports. Honda sources publish conflicting fuel-consumption figures, so confirm real-world fuel use instead of relying on one headline number.",
    alternativeIds: ["kawasaki-klx150", "yamaha-wr155r", "honda-crf300-rally"],
    relatedIds: ["honda-crf300-rally"],
    recommendationHref: "/recommendations/dual-sport-motorcycles-philippines",
    recommendationLabel: "Compare dual-sport motorcycles"
  },

  "kawasaki-ninja-400": {
    seoTitle: "Kawasaki Ninja 400 Price Philippines | Used & Ninja 500",
    seoDescription: "Kawasaki Ninja 400 price Philippines reference with historical ₱340,900 context, 399cc specs, used-bike guidance and current Ninja 500 comparison.",
    intentIntro: "The Ninja 400 still has substantial search demand, but MotoIndex keeps it clearly labeled as a previous Philippine generation. Use this page for its historical price and 399cc specifications, then compare the current Ninja 500 successor before treating old Ninja 400 listings as today's new-bike lineup.",
    moneyQuestion: "How does the historical Ninja 400 price reference compare with the current Ninja 500 and used Ninja 400 listings in the Philippines?",
    ownershipQuestion: "Compare 17-inch tires, chain and sprocket service, insurance, rider fit and parts support while accounting for the Ninja 400's previous-generation status.",
    alternativeIds: ["kawasaki-ninja-500", "yamaha-yzf-r3", "cfmoto-450sr"],
    relatedIds: ["kawasaki-ninja-500"],
    recommendationHref: "/recommendations/motorcycles-under-400cc-philippines",
    recommendationLabel: "Compare under-400cc motorcycles",
    legacyContext: {
      heading: "Ninja 400 vs the current Ninja 500",
      body: "Kawasaki Philippines now lists the 451cc Ninja 500 as the current successor. Keep the Ninja 400's historical price and specifications in context, and use the Ninja 500 page for current new-bike research."
    }
  },
  "yamaha-mt-07": {
    seoTitle: "Yamaha MT-07 Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Yamaha MT-07 price in the Philippines, 689cc specs, horsepower, seat height, weight, tire sizes, ownership costs and direct comparisons.",
    intentIntro: "The MT-07 attracts both Philippine price searches and global specification research. Compare its 689cc CP2 engine, horsepower, curb weight, seat height, ownership needs and direct middleweight alternatives on one canonical model page.",
    moneyQuestion: "What does the MT-07 cost after the current dealer quote, registration, insurance and other purchase charges are included?",
    ownershipQuestion: "Compare tires, chain service, fuel use, insurance and rider fit with the CB650R and Z650 before choosing on engine character alone.",
    alternativeIds: ["honda-cb650r", "kawasaki-z650"],
    relatedIds: ["yamaha-xsr700", "yamaha-yzf-r3"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "yamaha-xsr700": {
    seoTitle: "Yamaha XSR700 Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Yamaha XSR700 price in the Philippines, 689cc specs, horsepower, weight, seat height, tires, ownership costs and CB650R comparison research.",
    intentIntro: "The XSR700 combines retro styling with Yamaha's 689cc CP2 platform. Keep price, horsepower, weight, seat height, tire size, ownership and comparison intent on this canonical model page.",
    moneyQuestion: "What does the XSR700 cost after the current dealer quote, registration, insurance and other purchase charges are included?",
    ownershipQuestion: "Compare 17-inch tires, chain service, fuel use, insurance and rider fit with the CB650R and other middleweight road bikes.",
    alternativeIds: ["honda-cb650r", "yamaha-mt-07"],
    relatedIds: ["yamaha-mt-07"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },


  "yamaha-xmax": {
    seoTitle: "Yamaha XMAX Price Philippines 2026 | SRP & Monthly",
    seoDescription: "Yamaha XMAX price Philippines 2026 with current ₱311,000 dealer reference, 292cc specs, ABS, 13L tank, ownership costs and maxi-scooter alternatives.",
    intentIntro: "The XMAX is a high-demand maxi-scooter search, so keep price, 292cc specifications, rider fit, touring practicality and ownership research on this canonical model page rather than splitting the intent across thin price or specs URLs.",
    moneyQuestion: "What does the Yamaha XMAX cost once the current dealer quote, insurance, registration and other purchase charges are included?",
    ownershipQuestion: "Compare CVT service, 15/14-inch tires, 13 L fuel capacity, insurance and Yamaha service access with ADV350, Burgman 400 and other maxi scooters.",
    alternativeIds: ["honda-adv-350", "suzuki-burgman-400", "zontes-400g"],
    relatedIds: ["yamaha-nmax-v3"],
    recommendationHref: "/recommendations/maxi-scooters-philippines",
    recommendationLabel: "Compare maxi scooters"
  },
  "yamaha-xsr155": {
    seoTitle: "Yamaha XSR155 Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Yamaha XSR155 price in the Philippines, 155cc specs, 808mm seat, weight, tires, fuel tank, ownership costs and roadster alternatives.",
    intentIntro: "The XSR155 combines retro-roadster styling with a 155cc manual platform. Keep price, specifications, rider fit, ownership and alternative research on this canonical model page rather than creating separate thin price or specs pages.",
    moneyQuestion: "What does the XSR155 cost after the current dealer quote, registration, insurance and other purchase charges are included?",
    ownershipQuestion: "Compare 17-inch tires, chain and sprocket service, fuel use, insurance and Yamaha support with other lightweight manual roadsters.",
    alternativeIds: ["yamaha-mt-15", "honda-cb150r", "husqvarna-svartpilen-200"],
    relatedIds: ["yamaha-mt-07", "yamaha-xsr700"],
    recommendationHref: "/recommendations/naked-motorcycles-philippines",
    recommendationLabel: "Compare naked and roadster motorcycles"
  },

  "yamaha-aerox-v3": {
    seoTitle: "Yamaha Aerox V3 Price Philippines 2026 | Colors & SP",
    seoDescription: "Yamaha Aerox V3 price Philippines 2026 with Black, Race Blu and Glaze Blue colors, Standard vs SP pricing, 155cc specs, YECVT, ABS/TCS and financing.",
    intentIntro: "The Aerox V3 has a wide price and equipment spread, so compare the exact trim rather than treating every Aerox listing as the same scooter. Yamaha currently shows the base Aerox at ₱125,900, while current dealer data lists Aerox SP at ₱163,900; Yamaha positions the SP as the YECVT-equipped version with Sport/Touring modes and shift-down control.",
    moneyQuestion: "Does the exact Aerox Standard or SP still fit the budget after the real branch quote, down payment, monthly payment, insurance, registration and dealer charges are included?",
    ownershipQuestion: "Compare CVT/YECVT service requirements by trim, wide 14-inch tire replacement, insurance, passenger use, storage and Yamaha service access with NMAX V3, Click160 and ADV160.",
    alternativeIds: ["yamaha-nmax-v3", "honda-click-160", "honda-adv-160"],
    relatedIds: ["yamaha-nmax-v3", "yamaha-fazzio"],
    recommendationHref: "/recommendations/150cc-scooters-philippines",
    recommendationLabel: "Compare 150cc and 155cc scooters"
  },
  "yamaha-nmax-v3": {
    seoTitle: "Yamaha NMAX V3 Price Philippines 2026 | Colors & Tech Max",
    seoDescription: "Yamaha NMAX V3 price Philippines 2026 with Black, Light Grey, Black Gold and Dark Magma colors, NMAX vs Tech Max pricing, YECVT and ownership costs.",
    intentIntro: "NMAX V3 buyers need to separate the regular NMAX from the higher-spec Tech Max rather than compare one blended price. The stored regular-line reference is ₱155,900, while current dealer data lists Tech Max at ₱178,400; Yamaha identifies Tech Max as the YECVT-equipped version.",
    moneyQuestion: "How much does the exact NMAX or NMAX Tech Max cost after the branch quote, down payment, monthly payment, registration, insurance and dealer charges are included?",
    ownershipQuestion: "Compare CVT/YECVT service by trim, 13-inch tire replacement, the 7.1 L tank, insurance, passenger use and Yamaha service access with Aerox V3, PCX160 and ADV160.",
    alternativeIds: ["yamaha-aerox-v3", "honda-pcx-160", "honda-adv-160"],
    relatedIds: ["yamaha-aerox-v3", "yamaha-xmax"],
    recommendationHref: "/recommendations/150cc-scooters-philippines",
    recommendationLabel: "Compare 150cc and 155cc scooters"
  },
  "honda-adv-160": {
    seoTitle: "Honda ADV160 Price Philippines 2026 | ABS & RoadSync",
    seoDescription: "Honda ADV160 price in the Philippines: ₱167,400 ABS vs ₱174,900 RoadSync, 157cc specs, 780mm seat, 45 km/L, HSTC, monthly estimate and ownership.",
    intentIntro: "The 2026 ADV160 is a two-variant decision, not one blended price. Honda's ABS type is ₱167,400 and the RoadSync type is ₱174,900; both use the 157cc eSP+ platform, while RoadSync adds the connectivity-focused equipment Honda reserves for that trim.",
    moneyQuestion: "Is the ₱7,500 RoadSync premium worth paying after comparing the exact dealer quote, down payment, monthly payment, insurance, registration and whether you will actually use the connectivity features?",
    ownershipQuestion: "Compare the 780 mm seat, 133 kg curb weight, 8.1 L tank, 45.0 km/L WMTC figure, mixed 14/13-inch tires, CVT service, bodywork and accessory costs with NMAX V3, PCX160 and Click160.",
    alternativeIds: ["yamaha-nmax-v3", "honda-pcx-160", "honda-click-160"],
    relatedIds: ["honda-pcx-160", "honda-click-160"],
    recommendationHref: "/recommendations/160cc-scooters-philippines",
    recommendationLabel: "Compare 160cc scooters"
  },
  "honda-adv-350": {
    seoTitle: "Honda ADV350 Price Philippines 2026 | Specs & Ownership",
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
    alternativeIds: ["triumph-trident-660", "kawasaki-z500", "honda-cbr650r"],
    relatedIds: ["honda-cbr650r"],
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
      body: "RS150R is an older Philippine sport-underbone generation. MotoIndex now keeps its historical price and specifications on a dedicated RS150R page while this Winner X page stays focused on the current model."
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
    seoTitle: "Yamaha Mio i 125 Price Philippines 2026 | SRP & Monthly",
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
      body: "Mio Sporty has distinct 114cc specifications and remains visible in Philippine dealer inventory. MotoIndex now keeps its price and status on a dedicated Mio Sporty page while this page stays focused on the Mio i 125."
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

  "honda-giorno-plus": {
    seoTitle: "Honda Giorno Price Philippines 2026 | Giorno+ Specs",
    seoDescription: "Honda Giorno / Giorno+ price Philippines 2026 with current dealer references, 125cc specs, 780mm seat, 47 km/L WMTC, colors and ownership costs.",
    intentIntro: "Honda Giorno searches in the Philippines currently resolve to the Giorno+ canonical. Current dealer references show ₱101,900 for the All-New Giorno+ and a separate newer ACF125CBT listing at ₱106,000, so verify the exact model code and branch quote before treating one price as universal.",
    moneyQuestion: "What does the Honda Giorno+ cost after the current dealer quote, registration, insurance and other purchase charges are included?",
    ownershipQuestion: "Compare fuel use, 12-inch tire replacement, CVT service, storage and Honda support with Fazzio and other 125cc scooters.",
    alternativeIds: ["yamaha-fazzio", "honda-click-125i", "yamaha-mio-gear"],
    relatedIds: ["honda-click-125i"],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters"
  },
  "honda-beat": {
    seoTitle: "Honda BeAT Price Philippines 2026 | Playful vs Premium",
    seoDescription: "Honda BeAT price Philippines 2026: ₱72,500 Playful vs ₱74,700 Premium, 58.2 km/L WMTC, 742mm seat, CBS, specs and ownership costs.",
    intentIntro: "The Honda BeAT is a current 110cc Philippine commuter scooter with a ₱72,500 Playful starting price, ₱74,700 Premium price, 742 mm seat, 90 kg curb weight and Honda-published 58.2 km/L WMTC fuel-economy figure. Its value case is light, efficient city transport rather than premium-scooter equipment.",
    moneyQuestion: "What does the BeAT Playful or Premium cost after registration, insurance, dealer fees and any temporary promotion are separated from the regular SRP?",
    ownershipQuestion: "Compare 14-inch tire replacement, CVT service, fuel use, 12 L storage, CBS braking, insurance and Honda service access with Navi, Mio Gear and Click125.",
    alternativeIds: ["honda-navi", "yamaha-mio-gear", "honda-click-125i"],
    relatedIds: ["honda-navi", "honda-click-125i"],
    recommendationHref: "/recommendations/best-motorcycles-for-daily-commute-philippines",
    recommendationLabel: "Compare daily commuter motorcycles"
  },

  "yamaha-mio-gear": {
    seoTitle: "Yamaha Mio Gear Price Philippines 2026 | Monthly & Specs",
    seoDescription: "Yamaha Mio Gear price Philippines 2026 with current ₱79,400 dealer reference, ₱4,000 down/monthly snapshot, 125cc specs, 750mm seat and ownership.",
    intentIntro: "The Mio Gear is a light 125cc commuter with a 750 mm seat and 96 kg curb weight. Motortrade currently lists ₱79,400 SRP with an indicative ₱4,000 downpayment and ₱4,000 monthly snapshot, so use those figures as a dealer observation rather than a transferable loan quote.",
    moneyQuestion: "What does the Yamaha Mio Gear cost after the current dealer quote, registration, insurance and other purchase charges are included?",
    ownershipQuestion: "Compare CVT service, 14-inch tires, fuel use and Yamaha support with BeAT, Click 125i and Fazzio.",
    alternativeIds: ["honda-beat", "honda-click-125i", "yamaha-fazzio"],
    relatedIds: ["yamaha-fazzio", "yamaha-mio-i-125"],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters"
  },

  "honda-click-125i": {
    seoTitle: "Honda Click 125i Price Philippines 2026 | Colors & Street",
    seoDescription: "Honda Click 125i price Philippines 2026: ₱83,000 Standard, ₱87,700 Smart, ₱90,000 Street, current colors, 125cc specs, CBS and fuel economy.",
    intentIntro: "The 2026 Click125 is now a three-variant decision. Honda currently lists Standard at ₱83,000, Smart Edition at ₱87,700 and Street at ₱90,000, so compare exact trim, color, Smart Key/ISS equipment, financing and branch stock before reserving.",
    moneyQuestion: "What does the exact Click125 variant cost after the branch quote, down payment, monthly payment, insurance, registration and dealer charges are included?",
    ownershipQuestion: "Compare the 769 mm seat, 111 kg curb weight, 5.5 L tank, 50.3 km/L figure, 14-inch tires, CBS and CVT service with Fazzio, Mio Gear and Click160.",
    alternativeIds: ["yamaha-mio-gear", "yamaha-fazzio", "suzuki-burgman-street-ex"],
    relatedIds: ["honda-click-160", "honda-beat"],
    recommendationHref: "/recommendations/125cc-scooters-philippines",
    recommendationLabel: "Compare 125cc scooters"
  },
  "honda-click-160": {
    seoTitle: "Honda Click 160 Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Honda Click 160 Philippines guide with latest official ₱116,900 price reference, 157cc specs, 778mm seat, 46.7 km/L, CBS, monthly estimate and ownership.",
    intentIntro: "Honda's 2026 catalog still lists Click160, while the latest explicit Honda SRP MotoIndex located is ₱116,900 from September 2024. Use that as an official price reference, not a guaranteed 2026 dealer quote, then compare the 157cc eSP+ engine, 116 kg curb weight and CBS commuter package with current alternatives.",
    moneyQuestion: "What is the current dealer quote for Click160, and how does it compare with Honda's latest located ₱116,900 official SRP reference after down payment, monthly payment, insurance, registration and dealer charges?",
    ownershipQuestion: "Compare the 778 mm seat, 116 kg curb weight, 5.5 L tank, 46.7 km/L WMTC figure, 14-inch tires, CBS braking and CVT service with Click125, PCX160 and Aerox V3.",
    alternativeIds: ["honda-click-125i", "honda-pcx-160", "yamaha-aerox-v3"],
    relatedIds: ["honda-click-125i", "honda-adv-160"],
    recommendationHref: "/recommendations/160cc-scooters-philippines",
    recommendationLabel: "Compare 160cc scooters"
  },
  "honda-pcx-160": {
    seoTitle: "Honda PCX160 Price Philippines 2026 | Standard vs RoadSync",
    seoDescription: "Honda PCX160 Philippines: ₱133,500 Standard vs ₱155,000 RoadSync, 157cc specs, 764mm seat, 46 km/L, ABS/HSTC differences, monthly cost and ownership.",
    intentIntro: "PCX160 is a two-trim premium-scooter decision. Honda's 2026 reference puts Standard at ₱133,500 and RoadSync at ₱155,000, so compare what the ₱21,500 premium changes in braking, HSTC and connectivity before financing either version.",
    moneyQuestion: "Is the ₱21,500 RoadSync premium worth it after the exact dealer quote, down payment, monthly payment, insurance, registration and the trim-specific safety/connectivity equipment are compared?",
    ownershipQuestion: "Compare the 764 mm seat, 131 kg curb weight, 8.1 L tank, 46.0 km/L figure, 14/13-inch tires, CVT service and bodywork costs with NMAX V3 and ADV160.",
    alternativeIds: ["yamaha-nmax-v3", "honda-adv-160", "yamaha-aerox-v3"],
    relatedIds: ["honda-adv-160", "honda-click-160"],
    recommendationHref: "/recommendations/160cc-scooters-philippines",
    recommendationLabel: "Compare 160cc scooters"
  },
  "yamaha-fazzio": {
    seoTitle: "Yamaha Fazzio Price Philippines 2026 | Specs & Monthly",
    seoDescription: "Yamaha Fazzio Philippines guide: ₱93,900 current reference, 125cc specs, 750mm seat, 95kg weight, 12-inch tires, monthly estimate and ownership.",
    intentIntro: "Fazzio is a style-led 125cc commuter, but the practical buying case is its ₱93,900 current reference, low 750 mm seat and 95 kg curb weight. Compare the exact new-model unit with older dealer inventory before treating a lower advertised Fazzio price as the same motorcycle.",
    moneyQuestion: "Does the current Fazzio still fit the budget after the exact branch quote, down payment, monthly payment, insurance and accessories, and is an older lower-priced dealer unit actually the same current model?",
    ownershipQuestion: "Compare the 750 mm seat, 95 kg curb weight, 5.1 L tank, 12-inch tires, CVT service and no-ABS braking package with Click125, Mio Gear and Burgman Street EX.",
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
    seoTitle: "Suzuki Raider R150 Price Philippines 2026 | SRP & Monthly",
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
  },
  "honda-adv-150": {
    seoTitle: "Honda ADV150 Philippines | Historical Price, Specs & ADV160",
    seoDescription: "Honda ADV150 Philippines reference with historical ₱149,000 launch price, 150cc specs, ABS, 795mm seat, fuel economy and current ADV160 successor.",
    intentIntro: "The ADV150 remains a major Philippine search even though it is a previous generation. Keep its historical ₱149,000 launch price and 150cc specifications on this canonical page, then use the ADV160 page for current new-bike pricing.",
    moneyQuestion: "How does a used ADV150 asking price compare with a current ADV160 after transfer costs, insurance and near-term service are included?",
    ownershipQuestion: "Check CVT service history, 14/13-inch tires, single-channel ABS, fuel use, body-panel condition and documented maintenance before buying a used ADV150.",
    alternativeIds: ["honda-adv-160", "honda-pcx-160", "yamaha-nmax-v3"],
    relatedIds: ["honda-adv-160"],
    recommendationHref: "/recommendations/150cc-scooters-philippines",
    recommendationLabel: "Compare 150cc and 155cc scooters",
    legacyContext: { heading: "ADV150 vs the current ADV160", body: "ADV150 is retained for historical Philippine price, specification and used-bike research. Honda's current adventure-scooter research should continue on the ADV160 page." }
  },
  "kawasaki-ninja-zx-4rr": {
    seoTitle: "Ninja ZX-4RR Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Kawasaki Ninja ZX-4RR price in the Philippines, 401cc inline-four specs, 76.43hp, ABS, 800mm seat, ownership costs and sport-bike alternatives.",
    intentIntro: "The Ninja ZX-4RR is a current 401cc inline-four supersport at ₱499,000. Compare its 76.43 hp output, 188 kg curb weight, ABS and 15 L tank with the total cost of other current sport bikes.",
    moneyQuestion: "What does the ZX-4RR cost after insurance, registration, financing, 17-inch sport tires and first-year service are included?",
    ownershipQuestion: "Budget chain and sprocket wear, high-performance tires, insurance, premium consumables, fairing exposure and Kawasaki service access before choosing on engine character alone.",
    alternativeIds: ["kawasaki-ninja-500", "kawasaki-ninja-zx-25r", "yamaha-yzf-r7"],
    relatedIds: ["kawasaki-ninja-zx-25r", "kawasaki-ninja-500"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "honda-x-adv": {
    seoTitle: "Honda X-ADV Price Philippines 2026 | 745cc DCT Specs",
    seoDescription: "Honda X-ADV price in the Philippines, 745cc DCT specs, ABS, 820mm seat, 237kg weight, fuel economy, ownership costs and alternatives.",
    intentIntro: "The X-ADV is a ₱1.17M 745cc DCT adventure scooter with 2-channel ABS, a 13.2 L tank and 237 kg curb weight. Compare it as a premium touring purchase, not simply as a larger scooter.",
    moneyQuestion: "What does the X-ADV cost after insurance, registration, financing and premium touring consumables are added?",
    ownershipQuestion: "Test low-speed handling at 237 kg, then price 17/15-inch tires, DCT service, insurance, bodywork, touring accessories and Honda big-bike support.",
    alternativeIds: ["honda-adv-350", "suzuki-burgman-400", "zontes-400g"],
    relatedIds: ["honda-adv-350", "honda-crf1100l-africa-twin"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "cfmoto-300sr": {
    seoTitle: "CFMOTO 300SR Price Philippines 2026 | Specs, ABS & Costs",
    seoDescription: "CFMOTO 300SR price in the Philippines, 292.4cc specs, 29hp, 780mm seat, dual-channel ABS, ownership costs and sport-bike alternatives.",
    intentIntro: "The 300SR is a ₱165,000 current sport bike with a 292.4cc single, 29 hp, a 780 mm seat and Continental dual-channel ABS. Compare its lower entry price with dealer support, insurance and full-fairing ownership costs.",
    moneyQuestion: "Does the 300SR remain the lower-cost sport-bike choice after financing, insurance, tires and scheduled service are included?",
    ownershipQuestion: "Confirm current stock and model year, then compare CFMOTO service access, 17-inch tires, chain and sprocket wear and fairing-repair exposure with R3, RC 390 and 450SR.",
    alternativeIds: ["yamaha-yzf-r3", "ktm-rc-390", "cfmoto-450sr"],
    relatedIds: ["cfmoto-450sr"],
    recommendationHref: "/recommendations/motorcycles-under-400cc-philippines",
    recommendationLabel: "Compare under-400cc motorcycles"
  },
  "cfmoto-400nk": {
    seoTitle: "CFMOTO 400NK Price Philippines 2026 | Specs, ABS & Costs",
    seoDescription: "CFMOTO 400NK price in the Philippines, 400cc twin specs, 40.9hp, ABS, 815mm seat, 17L tank, ownership costs and naked-bike alternatives.",
    intentIntro: "The 400NK is a 400cc parallel-twin naked bike with a ₱219,000 recorded Philippine price, 40.9 hp, ABS and a 17 L tank. Compare its value with weight, dealer support and total ownership rather than displacement alone.",
    moneyQuestion: "What does the 400NK cost after the current dealer quote, insurance, financing, registration and first-year service are included?",
    ownershipQuestion: "At 206 kg, test low-speed handling and price 17-inch tires, chain and sprockets, insurance, service access and parts availability before choosing on purchase price alone.",
    alternativeIds: ["ktm-390-duke", "kawasaki-z500", "yamaha-mt-07"],
    relatedIds: ["cfmoto-450nk"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "yamaha-yzf-r15m": {
    seoTitle: "Yamaha YZF-R15M Price Philippines 2026 | Specs & Costs",
    seoDescription: "Yamaha YZF-R15M price in the Philippines, 155cc specs, ABS, traction control, 815mm seat, ownership costs, financing context and sport-bike alternatives.",
    intentIntro: "The YZF-R15M is a current 155cc manual sport bike with ABS, traction control, an 815 mm seat and 140 kg curb weight. Compare its ₱204,000 recorded Philippine price with the total cost of larger entry sport bikes, not engine size alone.",
    moneyQuestion: "Does the R15M still fit the budget after financing, insurance, 17-inch tires, chain service and registration are included?",
    ownershipQuestion: "Compare insurance, 17-inch tire replacement, chain and sprocket service, riding position and Yamaha support with R3, RC 390 and 300SR before buying on styling alone.",
    alternativeIds: ["yamaha-yzf-r3", "ktm-rc-390", "cfmoto-300sr"],
    relatedIds: ["yamaha-yzf-r3"],
    recommendationHref: "/recommendations/sport-motorcycles-philippines",
    recommendationLabel: "Compare sport motorcycles"
  },
  "honda-cbr650r": {
    seoTitle: "Honda CBR650R Price Philippines 2026 | Specs & Costs",
    seoDescription: "Honda CBR650R price in the Philippines, 649cc inline-four specs, ABS, 810mm seat, fuel economy, ownership costs, variants and sport-bike alternatives.",
    intentIntro: "The CBR650R is a current 649cc inline-four sport bike with 2-channel ABS, an 810 mm seat, 15.4 L tank and Standard/E-Clutch pricing context. Compare the exact variant before treating every listing as the same motorcycle.",
    moneyQuestion: "What does the CBR650R cost after the exact variant, financing, insurance, registration and 17-inch sport-bike consumables are included?",
    ownershipQuestion: "Budget large sport tires, chain and sprockets, insurance, bodywork exposure and Honda Big Wing service access, then compare the result with CB650R, R7 and other middleweight alternatives.",
    alternativeIds: ["honda-cb650r", "yamaha-yzf-r7", "kawasaki-ninja-500"],
    relatedIds: ["honda-cb650r"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "yamaha-yzf-r7": {
    seoTitle: "Yamaha YZF-R7 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Yamaha YZF-R7 price in the Philippines, 689cc twin specs, ABS, 855mm seat, 188kg weight, ownership costs, financing context and sport-bike alternatives.",
    intentIntro: "The YZF-R7 is a current 689cc twin-cylinder sport bike with a tall 855 mm seat, 188 kg curb weight and a ₱598,000 recorded Philippine price. Compare fit and ownership costs before choosing it on engine size or styling alone.",
    moneyQuestion: "What does the R7 cost after financing, insurance, registration, sport tires and first-year scheduled service are included?",
    ownershipQuestion: "Test the 855 mm seat and sport riding position, then budget 17-inch tires, chain and sprockets, insurance and Yamaha service access before comparing it with CBR650R, Ninja 500 and 450SR.",
    alternativeIds: ["honda-cbr650r", "kawasaki-ninja-500", "cfmoto-450sr"],
    relatedIds: ["yamaha-yzf-r1m", "yamaha-yzf-r3"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "kawasaki-ninja-zx-25r": {
    seoTitle: "Kawasaki ZX-25R Price Philippines 2026 | Specs & Costs",
    seoDescription: "Kawasaki Ninja ZX-25R price in the Philippines, 250cc inline-four specs, ABS, 785mm seat, variant pricing, financing context and ownership costs in 2026.",
    intentIntro: "The Ninja ZX-25R is a current 250cc inline-four supersport with ABS, a 785 mm seat and Standard/SE price range. Its purchase decision is about engine character, equipment and ownership cost, not displacement alone.",
    moneyQuestion: "How does the ZX-25R total purchase cost compare with larger sport bikes after financing, insurance, registration and tires are included?",
    ownershipQuestion: "Budget high-performance 17-inch tires, chain and sprockets, insurance, fairing exposure and Kawasaki service access, then compare the full ownership picture with ZX-4RR, R3 and 450SR.",
    alternativeIds: ["kawasaki-ninja-zx-4rr", "yamaha-yzf-r3", "cfmoto-450sr"],
    relatedIds: ["kawasaki-ninja-zx-4rr"],
    recommendationHref: "/recommendations/sport-motorcycles-philippines",
    recommendationLabel: "Compare sport motorcycles"
  },
  "bajaj-dominar-400": {
    seoTitle: "Bajaj Dominar 400 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Bajaj Dominar 400 price in the Philippines, 373.3cc specs, twin-channel ABS, 800mm seat, 13L tank, financing context, ownership costs and alternatives.",
    intentIntro: "The Dominar 400 is a current 373.3cc sport-touring motorcycle with twin-channel ABS, a 13 L tank and 192 kg curb weight. Compare the full purchase and ownership cost rather than treating the 400 name as proof of legal expressway access.",
    moneyQuestion: "What does the Dominar 400 cost after the current dealer quote, financing, insurance, registration and first-year maintenance are included?",
    ownershipQuestion: "Price 17-inch tires, chain and sprockets, insurance, touring consumables and TriMotors service access, and confirm registration details before planning any tollway use.",
    alternativeIds: ["ktm-390-duke", "triumph-speed-400", "kawasaki-z500"],
    relatedIds: [],
    recommendationHref: "/recommendations/motorcycles-under-400cc-philippines",
    recommendationLabel: "Compare under-400cc motorcycles"
  },
  "kawasaki-ninja-h2": {
    seoTitle: "Kawasaki Ninja H2 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Kawasaki Ninja H2 Carbon price in the Philippines, 998cc supercharged specs, 231 hp, seat height, weight, ownership costs, financing and alternatives.",
    intentIntro: "The Ninja H2 Carbon is a current Philippine hypersport with a supercharged 998cc inline-four, 231 hp and a ₱1.855M recorded MSRP. Compare the complete ownership picture, not only the headline power figure: insurance, 200-section rear tires, servicing, rider aids and low-speed weight all materially affect the decision.",
    moneyQuestion: "What does the Ninja H2 Carbon cost after financing, insurance, registration and high-performance consumables are included?",
    ownershipQuestion: "Budget premium sport tires, chain and sprockets, insurance, supercharged-engine service, bodywork exposure and Kawasaki Leisure Bikes support before comparing it with other flagship performance motorcycles.",
    alternativeIds: ["yamaha-yzf-r1m", "kawasaki-z-h2"],
    relatedIds: ["kawasaki-z-h2", "kawasaki-ninja-zx-4rr"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "honda-rebel-1100": {
    seoTitle: "Honda Rebel 1100 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Honda Rebel 1100 price in the Philippines, 1084cc twin specs, DCT, 709mm seat, weight, ownership costs, financing, tires, service and alternatives.",
    intentIntro: "The Rebel 1100 combines a low 709 mm seat with an 1084cc parallel twin, DCT and a 237 kg curb weight. Compare its low-seat accessibility with the real purchase, insurance, tire and service costs rather than treating seat height as the whole ownership decision.",
    moneyQuestion: "How does the Rebel 1100 total purchase cost compare with the Rebel 500 and other large road bikes after financing, insurance and registration?",
    ownershipQuestion: "Plan for 18/16-inch tires, insurance, DCT service, battery care, low-speed handling at 237 kg and Honda big-bike service access before choosing it from engine size alone.",
    alternativeIds: ["honda-rebel-500", "triumph-speed-twin-900", "royal-enfield-super-meteor-650"],
    relatedIds: ["honda-rebel-500", "honda-gold-wing"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },
  "cfmoto-450sr": {
    seoTitle: "CFMOTO 450SR Price Philippines 2026 | Specs & Monthly",
    seoDescription: "CFMOTO 450SR price in the Philippines, 449.5cc specs, 51hp, 795mm seat, down payment, monthly estimate, ownership costs and alternatives.",
    intentIntro: "The CFMOTO 450SR is a value-focused middleweight sport bike with a current Philippine SRP of ₱299,900, a 449.5cc parallel twin, 51 hp, 168 kg curb weight and a 795 mm seat. Compare the real dealer quote, financing and ownership costs against the Ninja 500 and other faired sport bikes before buying on horsepower per peso alone.",
    moneyQuestion: "What does the 450SR cost after the actual dealer quote, down payment, monthly payment, registration, insurance and any branch charges are included?",
    ownershipQuestion: "Budget for 17-inch sport tires, chain and sprocket service, insurance, fairing damage risk and CFMOTO parts lead times alongside routine servicing.",
    alternativeIds: ["kawasaki-ninja-500", "cfmoto-300sr", "cfmoto-675sr-r"],
    relatedIds: ["cfmoto-300sr", "cfmoto-675sr-r"],
    recommendationHref: "/recommendations/cfmoto-sr-motorcycles-philippines",
    recommendationLabel: "Compare CFMOTO SR sport bikes"
  },

  "bristol-maxie-400": {
    seoTitle: "Bristol Maxie 400 Price Philippines 2026 | Specs & Costs",
    seoDescription: "Bristol Maxie 400 price in the Philippines, 377cc specs, 730mm seat, ABS, 17.4L tank, ownership costs and direct maxi-scooter alternatives.",
    intentIntro: "The Maxie 400 is a large maxi scooter with a notably low published 730 mm seat and a 17.4 L tank. Compare the complete ownership picture with XMAX, ADV350 and Burgman 400 rather than choosing from seat height or displacement alone.",
    moneyQuestion: "What does the Maxie 400 cost after the current dealer quote, registration, insurance and financing charges are included?",
    ownershipQuestion: "Compare CVT service, tire replacement, insurance, local Bristol support, 208 kg curb weight and touring use with XMAX, ADV350 and Burgman 400.",
    alternativeIds: ["yamaha-xmax", "honda-adv-350", "suzuki-burgman-400"],
    relatedIds: ["bristol-adx-160"],
    recommendationHref: "/recommendations/maxi-scooters-philippines",
    recommendationLabel: "Compare maxi scooters"
  },
  "bajaj-pulsar-rs200": {
    seoTitle: "Bajaj Pulsar RS200 Price Philippines 2026 | Specs & ABS",
    seoDescription: "Bajaj Pulsar RS200 price in the Philippines, 199.4cc specs, dual-channel ABS, 810mm seat, ownership costs and direct sport-bike alternatives.",
    intentIntro: "The Pulsar RS200 is a current fully faired 199.4cc sport bike. Compare its actual Philippine quote, ABS package, rider fit and ownership costs with R15M, CBR150R and 300SR on one canonical page.",
    moneyQuestion: "What does the Pulsar RS200 cost after the current dealer quote, registration, insurance and financing charges are included?",
    ownershipQuestion: "Budget 17-inch tires, chain and sprocket service, insurance, fairing exposure and local Bajaj support before comparing it with smaller and larger sport-bike alternatives.",
    alternativeIds: ["yamaha-yzf-r15m", "honda-cbr150r", "cfmoto-300sr"],
    relatedIds: ["bajaj-pulsar-n160"],
    recommendationHref: "/recommendations/sport-motorcycles-philippines",
    recommendationLabel: "Compare sport motorcycles"
  },
  "honda-cbr150r": {
    seoTitle: "Honda CBR150R Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Honda CBR150R price in the Philippines, 149cc specs, 787mm seat, fuel economy, current color, ownership costs and direct sport-bike alternatives.",
    intentIntro: "The CBR150R is a lightweight fully faired sport motorcycle where current price, rider fit and ownership costs matter as much as styling. Compare it directly with R15M, GSX-R150 and 300SR.",
    moneyQuestion: "What does the CBR150R cost after the current dealer quote, registration, insurance and financing charges are included?",
    ownershipQuestion: "Compare 17-inch tires, chain and sprocket service, insurance, fairing exposure, fuel use and Honda service access with other lightweight sport bikes.",
    alternativeIds: ["yamaha-yzf-r15m", "suzuki-gsx-r150", "cfmoto-300sr"],
    relatedIds: ["honda-cbr650r"],
    recommendationHref: "/recommendations/sport-motorcycles-philippines",
    recommendationLabel: "Compare sport motorcycles"
  },
  "royal-enfield-shotgun-650": {
    seoTitle: "Royal Enfield Shotgun 650 Price Philippines 2026 | Specs",
    seoDescription: "Royal Enfield Shotgun 650 price in the Philippines, 648cc twin specs, 795mm seat, dual-channel ABS, colors, ownership costs and road-bike alternatives.",
    intentIntro: "The Shotgun 650 combines Royal Enfield's 648cc twin with a heavier, style-led road-bike package. Compare price, 240 kg curb weight, rider fit and running costs rather than choosing from styling alone.",
    moneyQuestion: "What does the Shotgun 650 cost after the exact variant quote, registration, insurance and financing charges are included?",
    ownershipQuestion: "Budget 18/17-inch tires, chain and sprocket service, insurance, passenger setup and Royal Enfield service access before comparing the Shotgun with other retro and cruiser-style road bikes.",
    alternativeIds: ["honda-rebel-500", "triumph-speed-400", "royal-enfield-hunter-350"],
    relatedIds: ["royal-enfield-hunter-350"],
    recommendationHref: "/recommendations/motorcycles-400cc-plus-philippines",
    recommendationLabel: "Compare 400cc+ motorcycles"
  },

  "honda-tmx-supremo": {
    seoTitle: "Honda TMX Supremo Price Philippines 2026 | Specs & Costs",
    seoDescription: "Honda TMX Supremo price Philippines 2026 with 149cc specs, 782mm seat, 127kg weight, 10.3L tank, ownership costs, financing context and work-bike use.",
    intentIntro: "TMX Supremo demand is tied to work-bike value, not price alone. Compare its 149cc engine, 10.3 L tank, 18-inch tires, dealer quote and recurring maintenance against the other business motorcycles riders cross-shop.",
    moneyQuestion: "What does the TMX Supremo cost after the exact dealer quote, registration, insurance, financing charges and any business-use accessories are included?",
    ownershipQuestion: "Compare chain service, drum brakes, 18-inch tires, fuel use and parts availability with TMX125 Alpha, YTX 125 and Barako II.",
    alternativeIds: ["honda-tmx125-alpha", "yamaha-ytx-125", "kawasaki-barako-ii"],
    relatedIds: ["honda-tmx125-alpha"],
    recommendationHref: "/recommendations/business-motorcycles-philippines",
    recommendationLabel: "Compare business motorcycles"
  },
  "yamaha-ytx-125": {
    seoTitle: "Yamaha YTX 125 Price Philippines 2026 | Specs & Ownership",
    seoDescription: "Yamaha YTX 125 price Philippines 2026 with 125cc specs, 800mm seat, 114kg weight, 7.6L tank, drum brakes, ownership costs and daily commuter-work use.",
    intentIntro: "YTX 125 research is closely tied to low-cost transport and utility use. Compare the 125cc engine, 7.6 L tank, 800 mm seat, drum brakes and dealer quote with other work-oriented motorcycles.",
    moneyQuestion: "What is the YTX 125 total take-home cost after the current cash price, registration, insurance, financing and branch-specific charges are included?",
    ownershipQuestion: "Compare chain service, drum brakes, 17-inch tires, fuel use and Yamaha parts support with TMX125 Alpha, TMX Supremo and Barako II.",
    alternativeIds: ["honda-tmx125-alpha", "honda-tmx-supremo", "kawasaki-barako-ii"],
    relatedIds: ["honda-tmx125-alpha"],
    recommendationHref: "/recommendations/business-motorcycles-philippines",
    recommendationLabel: "Compare business motorcycles"
  },
  "kawasaki-klx150": {
    seoTitle: "Kawasaki KLX150 Price Philippines 2026 | Specs & Trail Fit",
    seoDescription: "Kawasaki KLX150 price Philippines 2026 with 144cc specs, 866mm seat, 119kg weight, 21/18-inch wheels, ownership costs and dual-sport trail-fit context.",
    intentIntro: "KLX150 demand combines price with dual-sport fit. Its 866 mm seat, 119 kg curb weight and 21/18-inch wheels are central to the decision, especially when comparing daily road use with trail capability.",
    moneyQuestion: "What does the KLX150 cost after the dealer quote, registration, insurance, financing and any protection or trail accessories are added?",
    ownershipQuestion: "Compare chain and sprocket service, 21/18-inch tires, tall-seat fit and Kawasaki support with WR155R, KLX230 and CRF300 Rally.",
    alternativeIds: ["yamaha-wr155r", "kawasaki-klx230", "honda-crf300-rally"],
    relatedIds: ["kawasaki-klx230"],
    recommendationHref: "/recommendations/dual-sport-motorcycles-philippines",
    recommendationLabel: "Compare dual-sport and trail motorcycles"
  },
  "honda-tmx125-alpha": {
    seoTitle: "Honda TMX125 Alpha Price Philippines 2026 | Specs & Costs",
    seoDescription: "Honda TMX125 Alpha price Philippines 2026 with 125cc specs, 759mm seat, 113kg weight, 8.6L tank, fuel economy, ownership costs and practical business-bike use.",
    intentIntro: "TMX125 Alpha demand is about low purchase and running cost. Compare its 759 mm seat, 8.6 L tank, simple drum-brake layout and Honda-published fuel-economy context with other business motorcycles.",
    moneyQuestion: "What is the TMX125 Alpha total cost after the current dealer quote, registration, insurance, financing and work-use accessories are included?",
    ownershipQuestion: "Compare chain service, drum brakes, 18-inch tires, fuel use and Honda support with YTX 125, TMX Supremo and Barako II.",
    alternativeIds: ["yamaha-ytx-125", "honda-tmx-supremo", "kawasaki-barako-ii"],
    relatedIds: ["honda-tmx-supremo"],
    recommendationHref: "/recommendations/business-motorcycles-philippines",
    recommendationLabel: "Compare business motorcycles"
  },
  "kawasaki-barako-ii": {
    seoTitle: "Kawasaki Barako II Price Philippines 2026 | Specs & Costs",
    seoDescription: "Kawasaki Barako II price Philippines 2026 with 177cc specs, 805mm seat, 142kg weight, 12L tank, ownership costs, financing context and utility-bike use.",
    intentIntro: "Barako II search intent is tied to utility and business use. Compare the 177cc engine, 12 L tank, long-seat layout, dealer quote and recurring maintenance rather than choosing on displacement alone.",
    moneyQuestion: "What does the Barako II cost after the current dealer quote, registration, insurance, financing and any cargo or work accessories are included?",
    ownershipQuestion: "Compare chain service, drum-brake maintenance, tire availability, fuel use and parts support with TMX Supremo, TMX125 Alpha and YTX 125.",
    alternativeIds: ["honda-tmx-supremo", "honda-tmx125-alpha", "yamaha-ytx-125"],
    relatedIds: ["honda-tmx-supremo"],
    recommendationHref: "/recommendations/business-motorcycles-philippines",
    recommendationLabel: "Compare business motorcycles"
  },

  "honda-navi": {
    seoTitle: "Honda Navi Price Philippines 2026 | Specs & Fuel Economy",
    seoDescription: "Honda Navi price in the Philippines, 109cc specs, 48.4 km/L fuel economy, 762mm seat, CBS, tire sizes, ownership costs and commuter alternatives.",
    intentIntro: "The Honda Navi is a current Philippine 109cc automatic mini-motorcycle with a ₱59,000 catalog price, 762 mm seat, 104 kg curb weight and Honda-published 48.4 km/L WMTC fuel-consumption figure. Compare it as a compact city machine, not simply as another scooter.",
    moneyQuestion: "What does the Navi cost after registration, insurance, dealer fees and any accessories are added to the current catalog price?",
    ownershipQuestion: "Compare fuel use, 12/10-inch tire availability, drum-brake/CBS maintenance, storage, insurance and Honda service access with lightweight automatic commuters.",
    alternativeIds: ["honda-beat", "yamaha-mio-gear", "honda-click-125i"],
    relatedIds: ["honda-beat", "honda-click-125i"],
    recommendationHref: "/recommendations/best-motorcycles-for-daily-commute-philippines",
    recommendationLabel: "Compare daily commuter motorcycles"
  }
};

export function priorityModelGrowthProfile(modelId: string) {
  return profiles[modelId];
}

export function isPriorityGrowthModel(modelId: string) {
  return Boolean(profiles[modelId]);
}
