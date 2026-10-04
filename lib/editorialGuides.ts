export type EditorialGuide = {
  slug: string;
  kicker: string;
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  lastChecked: string;
  sections: { heading: string; body: string[]; bullets?: string[] }[];
  faqs: { question: string; answer: string }[];
  related: { href: string; title: string; description: string }[];
  sources: { label: string; url: string }[];
};

export const editorialGuides: EditorialGuide[] = [
  {
    slug: "motorcycle-helmet-size-guide",
    kicker: "Helmet fit guide",
    title: "Motorcycle helmet size guide for Philippine riders",
    seoTitle: "Motorcycle Helmet Size Guide Philippines: How to Measure",
    description: "Learn how to measure your head for a motorcycle helmet, use a model-specific size chart, check fit and avoid choosing by brand size alone.",
    intro: "Helmet size starts with head circumference, but the number is only a starting point. Different helmet models can fit different head shapes, so measure first, use the exact model's chart and then check how the helmet sits on your head.",
    lastChecked: "2026-09-09",
    sections: [
      {
        heading: "How to measure your head for a motorcycle helmet",
        body: [
          "Use a soft measuring tape and keep it level around the widest part of your head. SHOEI's fitting instructions place the tape about 2 cm above the eyebrows, above the ears and around the most prominent point at the back of the head.",
          "Record the measurement in centimeters and compare it with the size chart for the exact helmet model you want. Do not assume that a Medium from one brand or product family will fit exactly like a Medium from another."
        ],
        bullets: ["Measure more than once and use a consistent result", "Keep hair in the way you normally wear it while riding", "Use the exact model's size chart", "If you fall between sizes, try both when possible"]
      },
      {
        heading: "What a correctly fitted helmet should feel like",
        body: [
          "A new helmet should feel snug around the crown and cheeks without creating a sharp pressure point. When you move the helmet, your skin should move with it rather than the shell sliding freely around your head.",
          "Wear the helmet for several minutes before deciding. A size that feels loose in the shop is unlikely to become tighter with use because comfort padding normally settles rather than expands."
        ],
        bullets: ["Cheek pads should contact the cheeks", "The crown should feel evenly supported", "The helmet should not rotate easily around your head", "The retention strap should fasten securely without uncomfortable pressure"]
      },
      {
        heading: "Head shape matters as much as the size label",
        body: [
          "Two riders with the same circumference can need different helmet models because internal head shape varies. A pressure point at the forehead or sides can be a shape mismatch rather than a reason to simply buy a larger helmet.",
          "This is why MotoIndex keeps model-specific size charts where a reliable source exists instead of publishing one universal brand chart."
        ]
      },
      {
        heading: "Recheck fit when buying online",
        body: [
          "An online size chart can narrow the choice, but it cannot confirm your head shape or cheek-pad fit. Confirm the seller's return or exchange policy before removing tags or protective film, and inspect the exact helmet when it arrives.",
          "For a helmet sold in the Philippines, also check the applicable PS or ICC conformity marking on the unit rather than relying only on the online listing."
        ]
      }
    ],
    faqs: [
      { question: "How do I know my motorcycle helmet size?", answer: "Measure your head circumference around the widest area, compare it with the exact model's size chart and then try the helmet on when possible. The size label alone does not confirm fit." },
      { question: "Should a new motorcycle helmet feel tight?", answer: "It should feel snug and stable without a sharp or painful pressure point. If the helmet moves easily while your head stays still, it may be too large." },
      { question: "Are helmet sizes the same across brands?", answer: "No. Size charts and internal shapes can vary by brand and model, so use the chart for the exact helmet rather than assuming a familiar letter size will fit." },
      { question: "What if I am between two helmet sizes?", answer: "Use the manufacturer's model-specific guidance and try both sizes when possible. Fit and head shape should decide rather than automatically choosing the larger size." }
    ],
    related: [
      { href: "/gear/helmets/finder", title: "Helmet Finder", description: "Filter checked helmets by size, type and price." },
      { href: "/gear/helmets/for-commuting", title: "Helmets for commuting", description: "Compare road-helmet formats for daily riding." },
      { href: "/guides/motorcycle-helmet-certification-philippines", title: "Helmet certification guide", description: "Understand PS, ICC and certification references." }
    ],
    sources: [
      { label: "SHOEI: How to choose a helmet and wear it correctly", url: "https://www.shoei-europe.com/wp-content/uploads/2020/11/How-to.pdf" },
      { label: "SHOEI 2026 helmet size chart", url: "https://www.shoei-europe.com/shop/media/pdf/df/a5/24/Shoei_Katalog_2026.pdf" },
      { label: "DTI-BPS PS and ICC marks", url: "https://bps.dti.gov.ph/product-certification/ps-and-icc-marks" }
    ]
  },
  {
    slug: "motorcycle-helmet-certification-philippines",
    kicker: "Philippine helmet buying guide",
    title: "Motorcycle helmet certification in the Philippines",
    seoTitle: "Motorcycle Helmet Certification Philippines: PS, ICC & ECE",
    description: "Understand PS and ICC marks for motorcycle helmets in the Philippines, how ECE references fit in, and what to verify on the exact helmet before buying.",
    intro: "For a Philippine helmet purchase, separate the local conformity check from overseas certification claims. DTI-BPS lists motorcycle helmets and visors under mandatory product certification and says covered products distributed in the Philippine market must bear the applicable PS mark or ICC sticker.",
    lastChecked: "2026-09-09",
    sections: [
      {
        heading: "PS mark and ICC sticker: what buyers should look for",
        body: [
          "The Bureau of Philippine Standards operates the Philippine Standard certification mark scheme and the Import Commodity Clearance certification scheme. Its consumer guidance says products covered by mandatory certification must carry the applicable PS mark or ICC sticker before distribution in the Philippine market.",
          "For riders, the practical step is simple: inspect the actual helmet being sold, not only a marketplace photo or a seller's text description. DTI-BPS also provides ways to verify ICC stickers and PS certification."
        ],
        bullets: ["Check the mark or sticker on the exact product or applicable packaging", "Do not treat a seller badge as certification evidence", "Use DTI-BPS verification resources if a marking looks questionable", "Keep the model and batch details if you need to verify a product"]
      },
      {
        heading: "Where ECE certification fits",
        body: [
          "ECE is a separate helmet homologation system used internationally. MotoIndex records ECE claims at the model level when a source explicitly states them, but an ECE label is not used as a substitute for the Philippine PS or ICC check.",
          "The current DTI-BPS helmet product-coverage page references PNS/UN ECE 22:2007 in its mandatory-certification framework. Because model certifications and local compliance can differ by market and batch, verify both the model information and the local conformity marking."
        ]
      },
      {
        heading: "Why certification must stay model-specific",
        body: [
          "A brand can sell many helmet families with different shells, markets and homologations. One certified model does not prove that every helmet carrying the same brand name has the same certification.",
          "MotoIndex therefore filters its ECE 22.06 collection from explicit model-level certification text instead of assigning a certification to an entire brand."
        ]
      },
      {
        heading: "A quick pre-purchase certification check",
        body: [
          "First confirm the exact brand and model. Then inspect the PS or ICC marking, read the certification label on the helmet, compare it with the seller's listing and check DTI-BPS resources if anything is unclear.",
          "Certification does not replace fit. A compliant helmet still needs the correct size, a secure retention system and a condition free from prior impact damage."
        ]
      }
    ],
    faqs: [
      { question: "What helmet certification is required in the Philippines?", answer: "DTI-BPS places motorcycle helmets and visors under mandatory product certification. Buyers should look for the applicable PS mark or ICC sticker on products distributed in the Philippine market." },
      { question: "What is the difference between PS and ICC?", answer: "They are different BPS conformity routes. The PS mark is associated with the Philippine Standard certification mark licensing scheme, while ICC is the Import Commodity Clearance certification scheme for imported products." },
      { question: "Is an ECE helmet automatically legal in the Philippines?", answer: "Do not rely on the ECE label by itself. For a Philippine purchase, also verify the applicable local PS or ICC conformity marking on the exact helmet." },
      { question: "Can I verify an ICC sticker?", answer: "DTI-BPS says ICC stickers can be checked through its ICC verification resources. Use the current BPS guidance if you are uncertain about a sticker." }
    ],
    related: [
      { href: "/gear/helmets/ece-22-06", title: "ECE 22.06 helmet models", description: "See checked models with explicit ECE 22.06 references." },
      { href: "/guides/motorcycle-helmet-size-guide", title: "Motorcycle helmet size guide", description: "Measure and check fit after certification." },
      { href: "/gear/helmets", title: "Motorcycle helmet catalog", description: "Browse checked helmet brands and models." }
    ],
    sources: [
      { label: "DTI-BPS: Helmets and their visors", url: "https://bps.dti.gov.ph/component/content/article?Itemid=111&id=101" },
      { label: "DTI-BPS: PS and ICC marks", url: "https://bps.dti.gov.ph/product-certification/ps-and-icc-marks" },
      { label: "DTI-BPS: Product certification schemes", url: "https://bps.dti.gov.ph/product-certification" },
      { label: "DTI-BPS: Helmet certification application requirements", url: "https://bps.dti.gov.ph/product-certification/ps-and-icc-application-requirements" }
    ]
  },
  {
    slug: "kawasaki-ninja-h2r-price-philippines",
    kicker: "H2R price research",
    title: "Kawasaki Ninja H2R price in the Philippines: what the listings miss",
    seoTitle: "Kawasaki Ninja H2R Price Philippines: Track-Only Status Explained",
    description: "Researching the Kawasaki Ninja H2R price in the Philippines? See why MotoIndex does not publish a made-up Philippine SRP, plus its track-only status and H2/H2R differences.",
    intro: "Searches for a Kawasaki Ninja H2R price in the Philippines are common, but a current Philippine retail SRP is not the same thing as converting an overseas MSRP. Kawasaki describes the H2R as a closed-course-only motorcycle, and its own historical release says it cannot be operated on public roads or issued a license plate. MotoIndex therefore does not invent a Philippine peso SRP where a current local retail price has not been verified.",
    lastChecked: "2026-10-02",
    sections: [
      {
        heading: "Is there a verified Kawasaki Ninja H2R price in the Philippines?",
        body: [
          "MotoIndex did not locate a current official Kawasaki Philippines retail price for the Ninja H2R in this update. Kawasaki's current US page lists a 2026 H2R MSRP in US dollars, but currency conversion is not a Philippine SRP and would ignore taxes, import costs, allocation and dealer terms.",
          "A historical Philippine review also reported that the H2R was not commercially made available in the Philippines after an extremely limited regional allocation. That history is useful context, but it should not be turned into a current local price claim."
        ]
      },
      {
        heading: "The Ninja H2R is track-only",
        body: [
          "Kawasaki currently describes the Ninja H2R as a closed-course-only hypersport motorcycle. Kawasaki Heavy Industries has also stated that the H2R cannot be operated on public roads or with general traffic and that a license plate cannot be obtained for it.",
          "That makes H2R ownership research fundamentally different from researching a normal road motorcycle: local availability, transport to a circuit, track rules, service requirements and parts support matter alongside purchase price."
        ]
      },
      {
        heading: "Do not confuse the H2R with the road-going Ninja H2",
        body: [
          "The Ninja H2 and H2 Carbon are road-focused, street-legal hypersport models in markets where they are sold, while the H2R is the closed-course version. Search results and seller posts sometimes shorten both names to 'H2', so confirm the exact model before using any price, horsepower or registration information.",
          "MotoIndex keeps its Philippine Ninja H2 Carbon motorcycle record separate from this H2R research guide to avoid mixing a road-bike price with a track-only machine."
        ]
      },
      {
        heading: "What a Philippine buyer should verify",
        body: [
          "Before treating any peso figure as an H2R price, ask for the exact model year, chassis documentation, original market, import and customs paperwork, service history, included track equipment and a written seller quotation.",
          "Do not use an overseas MSRP converted at today's exchange rate as proof of a local transaction price. For an H2R, provenance and legal-use limitations are part of the purchase decision."
        ],
        bullets: [
          "Confirm the exact H2R model year and VIN or chassis documentation",
          "Ask whether the figure is a local seller quote, landed cost or overseas MSRP conversion",
          "Verify import/customs documents and ownership history",
          "Plan for closed-course use rather than public-road registration",
          "Check Kawasaki-capable service and parts support before purchase"
        ]
      }
    ],
    faqs: [
      { question: "How much is a Kawasaki Ninja H2R in the Philippines?", answer: "MotoIndex does not publish a current Philippine SRP because it has not verified one from an official local retail source. Overseas MSRP figures can provide international context but should not be relabeled as a Philippine price." },
      { question: "Is the Kawasaki Ninja H2R street legal in the Philippines?", answer: "Kawasaki describes the H2R as closed-course only and has stated that it cannot be operated on public roads or issued a license plate. Buyers should verify current local rules and documentation for any specific imported unit." },
      { question: "What is the difference between the Ninja H2 and H2R?", answer: "The H2 is the road-going hypersport model, while the H2R is a more extreme closed-course-only version. Their prices, equipment, power figures and legal-use status should not be mixed." },
      { question: "Can I convert the US H2R MSRP to pesos to get the Philippine price?", answer: "A currency conversion is not a Philippine SRP. It excludes allocation, shipping, taxes, import costs, dealer margin and the terms of a specific local transaction." }
    ],
    related: [
      { href: "/motorcycles/kawasaki/ninja-h2", title: "Kawasaki Ninja H2 Carbon", description: "See the separate road-going Ninja H2 record tracked by MotoIndex." },
      { href: "/motorcycles/kawasaki", title: "Kawasaki motorcycles Philippines", description: "Compare Kawasaki motorcycles and published Philippine prices." },
      { href: "/recommendations/motorcycles-400cc-plus-philippines", title: "Big bikes Philippines", description: "Compare current 400cc+ road motorcycles with published Philippine price records." }
    ],
    sources: [
      { label: "Kawasaki Heavy Industries: Ninja H2/H2R launch and road-use limitation", url: "https://global.kawasaki.com/en/corp/newsroom/news/detail/?f=20180810_1441" },
      { label: "Kawasaki: current Ninja H2R closed-course model", url: "https://www.kawasaki.com/en-us/motorcycle/ninja/hypersport/ninja-h2r" },
      { label: "TopGear Philippines: 2018 Ninja H2R review and Philippine availability context", url: "https://www.topgear.com.ph/moto-sapiens/motorcycle-review/review-2018-kawasaki-ninja-h2r-a3459-20181218" }
    ]
  },

  {
    slug: "nwow-ebike-price-philippines",
    kicker: "NWOW e-bike price guide",
    title: "NWOW e-bike prices in the Philippines",
    seoTitle: "NWOW E-Bike Price Philippines 2026: Models & Prices",
    description: "Check NWOW e-bike prices in the Philippines, including current official product references and popular TK10, ARS and WSP market prices.",
    intro: "NWOW has substantial Philippine search demand, but its lineup mixes two-wheel electric scooters, tricycles and other electric vehicles. This guide keeps those formats separate and uses current Philippine price references rather than treating every NWOW product as a conventional motorcycle.",
    lastChecked: "2026-10-04",
    sections: [
      {
        heading: "What NWOW currently sells in the Philippines",
        body: [
          "NWOW Philippines currently lists electric two-wheel and multi-wheel products on its local site. Current examples on the official homepage include ERV2 at ₱42,800, ERVS4 at ₱66,800, ERVSD at ₱96,000 and EMC-GOLF2 at ₱128,000.",
          "Model availability and pricing can vary by area. NWOW product pages explicitly warn that listed prices may apply only to selected Luzon areas, so a branch quote remains necessary before purchase."
        ],
        bullets: ["Confirm whether the unit is two-wheel, three-wheel or four-wheel", "Ask for the branch-specific cash price", "Verify battery specification and warranty", "Confirm registration and road-use requirements for the exact unit"]
      },
      {
        heading: "NWOW TK10, ARS and WSP price searches",
        body: [
          "TK10, ARS and WSP are among the most searched NWOW names in the Philippines. Current comparison-market references list TK10 around ₱38,800 and ARS around ₱34,000, while a Philippine specialist retailer lists WSP around ₱43,000.",
          "Treat third-party prices as market observations, not manufacturer-wide SRPs. Stock, battery version, branch location, financing and promotions can change the transaction price."
        ]
      },
      {
        heading: "Why MotoIndex does not mix NWOW with gasoline motorcycles",
        body: [
          "Electric scooters and tricycles have different decision variables from gasoline motorcycles: motor wattage, battery voltage and capacity, charging time, usable range, charger availability and battery replacement cost matter more than engine displacement.",
          "MotoIndex therefore connects NWOW research to its electric-mobility tools instead of forcing every unit into a cc-based motorcycle comparison."
        ]
      }
    ],
    faqs: [
      { question: "How much is an NWOW e-bike in the Philippines?", answer: "Prices vary by model and area. Current official NWOW Philippines examples range from roughly ₱42,800 for ERV2 to ₱128,000 for EMC-GOLF2, while popular models such as TK10 and ARS have separate market price references." },
      { question: "How much is the NWOW TK10?", answer: "Current Philippine comparison listings place the TK10 at about ₱38,800. Confirm the exact branch price, battery specification and financing terms before purchase." },
      { question: "How much is the NWOW ARS?", answer: "Current Philippine comparison listings place the ARS at about ₱34,000, while retailer pricing can differ. Confirm the exact unit and branch quote." },
      { question: "Are all NWOW vehicles motorcycles?", answer: "No. NWOW sells two-wheel electric scooters as well as three-wheel and four-wheel electric vehicles, so the exact model and vehicle classification matter." }
    ],
    related: [
      { href: "/motorcycles/electric", title: "Electric motorcycles Philippines", description: "Compare MotoIndex electric-mobility research and current model coverage." },
      { href: "/tools/electric-motorcycle-charging-cost", title: "Charging cost calculator", description: "Estimate electricity cost for an electric two-wheeler." },
      { href: "/tools/electric-motorcycle-range-calculator", title: "Electric range calculator", description: "Model range assumptions before choosing an EV." }
    ],
    sources: [
      { label: "NWOW Philippines official product catalog", url: "https://www.nwow.com.ph/" },
      { label: "NWOW Philippines EP product page and regional price disclaimer", url: "https://www.nwow.com.ph/Product-Details.html?product_id=595" },
      { label: "Philippine NWOW retailer model list", url: "https://www.ebikeandecarsuperstore.com/nwow-models" }
    ]
  },
  {
    slug: "skygo-motorcycle-price-philippines",
    kicker: "Skygo price guide",
    title: "Skygo motorcycle prices in the Philippines",
    seoTitle: "Skygo Motorcycle Price Philippines 2026: Models & Price List",
    description: "See current Skygo motorcycle prices in the Philippines, including Earl, Boss 150 and the official Skygo model price range.",
    intro: "Skygo's official Philippine catalog currently lists 13 motorcycles with published prices. This guide targets the broad Skygo motorcycle and price-list searches while keeping individual model claims tied to Skygo's own current product pages.",
    lastChecked: "2026-10-04",
    sections: [
      {
        heading: "Current Skygo motorcycle price range",
        body: [
          "Skygo's current official shop lists models from the Prince 125 at ₱43,000 through the Bolt 150 at ₱115,000. Other listed models include Wizard, King, Hero, Boss 150, Earl, Blink, Stallion, Lance 150 and KPV.",
          "The official list is more useful than an undated marketplace roundup because it exposes the current catalog and published price on the same source."
        ],
        bullets: ["Prince 125: ₱43,000", "Boss 150: ₱55,000", "Earl: ₱55,000", "KPV: ₱109,800", "Bolt 150: ₱115,000"]
      },
      {
        heading: "Skygo Earl 150",
        body: [
          "Skygo's official Earl page lists a 150cc single-cylinder air-cooled four-stroke engine, 106 kg dry weight, 780 mm seat height, 14 L fuel tank and ₱55,000 SRP.",
          "The model is positioned around a classic look, so buyers searching for Earl 150 should compare price, rider fit, parts availability and the exact dealer financing terms rather than relying only on styling."
        ]
      },
      {
        heading: "Skygo Boss 150",
        body: [
          "Skygo's official Boss 150 page lists ₱55,000 SRP, 129 kg dry weight, 780 mm seat height, 10.5 L fuel tank, front disc brake and tubeless tires.",
          "Skygo states that 12-, 24- and 36-month installment terms are available, but the final downpayment and monthly amount should be confirmed with the selling branch."
        ]
      }
    ],
    faqs: [
      { question: "How much is a Skygo motorcycle in the Philippines?", answer: "Skygo's current official catalog spans roughly ₱43,000 to ₱115,000 depending on model. The exact branch quote and financing can differ." },
      { question: "How much is the Skygo Earl 150?", answer: "Skygo currently lists the Earl at ₱55,000 SRP with a 150cc engine." },
      { question: "How much is the Skygo Boss 150?", answer: "Skygo currently lists the Boss 150 at ₱55,000 SRP." },
      { question: "Does Skygo offer installment?", answer: "Skygo's official Earl and Boss pages state that 12-, 24- and 36-month installment options are available. Confirm the required downpayment, fees and monthly amount with the branch." }
    ],
    related: [
      { href: "/motorcycles", title: "Motorcycle price list Philippines", description: "Compare MotoIndex's current motorcycle catalog by price and category." },
      { href: "/recommendations/motorcycles-under-100k", title: "Motorcycles under ₱100K", description: "Compare current budget motorcycles with verified model data." },
      { href: "/tools/motorcycle-loan-calculator", title: "Motorcycle loan calculator", description: "Estimate downpayment and monthly payments using your own assumptions." }
    ],
    sources: [
      { label: "Skygo official motorcycle catalog", url: "https://www.skygo.com.ph/index.php/shop/" },
      { label: "Skygo official Earl product page", url: "https://www.skygo.com.ph/index.php/product/earl/" },
      { label: "Skygo official Boss 150 product page", url: "https://www.skygo.com.ph/index.php/product/boss-150/" }
    ]
  },
  {
    slug: "harley-davidson-price-philippines",
    kicker: "Harley-Davidson price guide",
    title: "Harley-Davidson prices in the Philippines",
    seoTitle: "Harley-Davidson Price Philippines 2026: Models & Price List",
    description: "Research Harley-Davidson motorcycle prices in the Philippines for 2026, including Nightster, Sportster S, cruiser and touring price ranges.",
    intro: "Harley-Davidson searches in the Philippines are strongly price-led. Current Philippine market references place the 2026 lineup from about ₱799,000 for the Nightster to ₱4.35 million for the CVO Road Glide, with Sportster, cruiser, touring and adventure models between them.",
    lastChecked: "2026-10-04",
    sections: [
      {
        heading: "Harley-Davidson Philippines 2026 price range",
        body: [
          "Current Philippine price references list the Nightster at ₱799,000 as the lowest-priced new Harley-Davidson and the CVO Road Glide at ₱4.35 million at the top of the range.",
          "The lineup spans Sport, Cruiser, Touring, Adventure Touring and three-wheel models, so price comparisons should stay within the intended use case rather than treating the entire brand as one class."
        ],
        bullets: ["Nightster: ₱799,000", "Nightster Special: ₱835,000", "Sportster S: ₱959,000", "Street Bob: ₱1.38M", "Pan America 1250: ₱1.38M"]
      },
      {
        heading: "Harley-Davidson Sportster price in the Philippines",
        body: [
          "The Sportster S is currently listed around ₱959,000 in Philippine price references, while the Nightster and Nightster Special sit below it as the lower-priced Revolution Max entries.",
          "Before paying a reservation or financing fee, confirm the model year, color, dealer stock, insurance, registration and final on-road quotation."
        ]
      },
      {
        heading: "Why dealer verification matters on premium motorcycles",
        body: [
          "Large-displacement premium motorcycles can have meaningful differences between published list price and final transaction cost because of model year, allocation, accessories, insurance and dealer-specific offers.",
          "Use the published figure to shortlist, then request a written quote from an authorized Philippine dealer for the exact unit."
        ]
      }
    ],
    faqs: [
      { question: "How much is a Harley-Davidson in the Philippines?", answer: "Current 2026 Philippine references range from about ₱799,000 for the Nightster to ₱4.35 million for the CVO Road Glide." },
      { question: "What is the cheapest Harley-Davidson in the Philippines?", answer: "The Nightster is currently listed at about ₱799,000 and is the lowest-priced model in current Philippine 2026 price lists." },
      { question: "How much is the Harley-Davidson Sportster S?", answer: "Current Philippine 2026 references list the Sportster S at about ₱959,000." },
      { question: "Should I treat an online Harley price as the final dealer price?", answer: "No. Confirm the exact model year, stock, accessories, registration, insurance and dealer quotation before purchase." }
    ],
    related: [
      { href: "/recommendations/cruiser-motorcycles-philippines", title: "Cruiser motorcycles Philippines", description: "Compare current cruiser alternatives using MotoIndex model data." },
      { href: "/recommendations/motorcycles-1000cc-plus-philippines", title: "1000cc+ motorcycles", description: "Compare large-displacement motorcycles by price, output, weight and fit." },
      { href: "/motorcycles", title: "Motorcycle price list Philippines", description: "Browse MotoIndex's current model catalog." }
    ],
    sources: [
      { label: "YugaMoto Harley-Davidson Philippines 2026 price list", url: "https://moto.yugatech.com/motorcycle/harley-davidson-philippines-price-list-2026/" },
      { label: "ZigWheels Harley-Davidson Philippines 2026 price list", url: "https://www.zigwheels.ph/new-motorcycles/harley-davidson" },
      { label: "Harley-Davidson Philippines market overview", url: "https://www.carmudi.com.ph/new-motorcycles/harley-davidson/" }
    ]
  },
  {
    slug: "moped-vs-scooter-underbone-philippines",
    kicker: "Motorcycle terminology",
    title: "Moped vs scooter vs underbone in the Philippines",
    seoTitle: "Moped Philippines: Moped vs Scooter vs Underbone Explained",
    description: "What does moped mean in the Philippines? Compare mopeds, scooters and underbone motorcycles so you can search and shop using the correct vehicle type.",
    intro: "The word moped gets searched heavily, but Philippine listings often use scooter, underbone or e-bike for vehicles that users casually call mopeds. Knowing the distinction prevents a generic moped search from sending you to the wrong motorcycle type.",
    lastChecked: "2026-10-04",
    sections: [
      {
        heading: "What is a moped?",
        body: [
          "Traditionally, a moped is a low-powered two-wheeler associated with pedals or moped-style construction. Modern usage varies by country, and many riders use the word loosely for small automatic motorcycles or electric two-wheelers.",
          "In the Philippines, mainstream motorcycle catalogs more commonly classify small two-wheelers as scooters, underbones, business motorcycles or electric vehicles rather than using moped as a primary product category."
        ]
      },
      {
        heading: "Moped vs scooter",
        body: [
          "A scooter normally has a step-through body and automatic transmission, with the engine or electric drive integrated around the rear section. Philippine examples include common 110cc to 160cc commuter scooters.",
          "If your search goal is an easy automatic city motorcycle, the scooter category is usually more useful than searching only for moped."
        ]
      },
      {
        heading: "Moped vs underbone",
        body: [
          "An underbone uses a motorcycle-style frame with a low central step area and typically larger wheels than a scooter. Many popular Philippine commuter motorcycles fall into the underbone category.",
          "If you want models such as sport underbones or semi-automatic commuter motorcycles, use the underbone guide rather than assuming they are mopeds."
        ],
        bullets: ["Automatic city use: start with scooters", "Light manual or semi-automatic commuters: check underbones", "Electric two-wheelers: check electric vehicle classification", "Always verify LTO registration requirements for the exact vehicle"]
      }
    ],
    faqs: [
      { question: "What is a moped in the Philippines?", answer: "Moped is often used loosely, but Philippine motorcycle catalogs more commonly use categories such as scooter, underbone and electric vehicle. Check the exact vehicle design and registration classification." },
      { question: "Is a scooter the same as a moped?", answer: "Not necessarily. A scooter is a distinct vehicle layout and can have much more power than a traditional moped." },
      { question: "Is an underbone a moped?", answer: "No. Underbones are a separate motorcycle format even though casual language sometimes mixes the terms." },
      { question: "Where should I compare small motorcycles?", answer: "Use MotoIndex's scooter, underbone and below-150cc guides so the vehicles are compared within the correct format." }
    ],
    related: [
      { href: "/motorcycles/scooters", title: "Scooters Philippines", description: "Compare current scooter prices and models." },
      { href: "/recommendations/best-underbone-motorcycles-philippines", title: "Underbone motorcycles Philippines", description: "Compare current underbones by price, weight and specifications." },
      { href: "/recommendations/motorcycles-below-150cc-philippines", title: "Motorcycles below 150cc", description: "Compare small-displacement Philippine motorcycles across categories." }
    ],
    sources: [
      { label: "Honda Philippines motorcycle catalog", url: "https://www.hondaph.com/motorcycle/list" },
      { label: "MotoIndex current motorcycle taxonomy and model data", url: "https://motoindexph.com/motorcycles" }
    ]
  },


  {
    slug: "lambretta-price-philippines",
    kicker: "Lambretta Philippines guide",
    title: "Lambretta prices in the Philippines",
    seoTitle: "Lambretta Price Philippines 2026: X300, G350 & Current Models",
    description: "Research Lambretta prices in the Philippines, including current X300 and G350 availability, price-on-request status and the limited X300 Casa Lambretta price.",
    intro: "Lambretta is currently visible in the Philippine market, but the standard X300 and G350 do not have an official public Philippine price in the main comparison listings MotoIndex checked. This page keeps that uncertainty explicit instead of turning overseas or converted prices into a local SRP.",
    lastChecked: "2026-10-04",
    sections: [
      {
        heading: "What is the current Lambretta price in the Philippines?",
        body: [
          "Current Philippine comparison listings show both the Lambretta X300 and G350 as available but price-on-request rather than publishing a standard peso SRP. That means the useful next step is a dealer quote for the exact model, model year and color.",
          "A third-party 2026 price table may show peso estimates, but MotoIndex does not treat converted or unverified figures as an official Philippine retail price."
        ],
        bullets: ["X300: current Philippine listing, price on request", "G350: current Philippine listing, price on request", "Ask for model year and exact variant", "Request the written cash and financing quote separately"]
      },
      {
        heading: "Lambretta X300 Casa price in the Philippines",
        body: [
          "The limited-edition X300 Casa Lambretta was launched in the Philippines in November 2025 with a starting price of ₱409,900. Only 36 units were allocated to the Philippine market according to the launch coverage.",
          "That limited-edition price should not be reused as the standard X300 price. Collector editions, standard models and later dealer stock need separate price references."
        ]
      },
      {
        heading: "X300 vs G350",
        body: [
          "Current Philippine comparison references list the X300 as a 275cc CVT scooter and the G350 as a 330cc CVT scooter. They occupy different engine and price positions even when a public local SRP is unavailable.",
          "For a real buying comparison, confirm the dealer's current cash price, warranty, parts availability, service location, insurance cost and exact unit specifications before deciding."
        ]
      }
    ],
    faqs: [
      { question: "How much is a Lambretta in the Philippines?", answer: "Current Philippine listings for the standard X300 and G350 are price on request. MotoIndex does not publish an invented local SRP when the current public price is unavailable." },
      { question: "How much is the Lambretta X300 in the Philippines?", answer: "The standard X300 is currently listed as price on request. The limited X300 Casa Lambretta launched in the Philippines at ₱409,900 in November 2025, but that collector edition price should not be used as the standard X300 price." },
      { question: "How much is the Lambretta G350 in the Philippines?", answer: "Current Philippine comparison listings show the G350 as price on request. Ask a Lambretta dealer for the exact current cash and financing quote." },
      { question: "Is Lambretta available in the Philippines?", answer: "Yes. Current Philippine motorcycle listings include the X300 and G350, and the limited X300 Casa Lambretta received a Philippine allocation in 2025." }
    ],
    related: [
      { href: "/motorcycles/scooters", title: "Scooters in the Philippines", description: "Compare current scooters by price, engine, weight and rider fit." },
      { href: "/recommendations/maxi-scooters-philippines", title: "Maxi scooters Philippines", description: "Compare larger automatic scooters using MotoIndex model data." },
      { href: "/tools/motorcycle-loan-calculator", title: "Motorcycle loan calculator", description: "Model a dealer quote using your own downpayment, rate and term." }
    ],
    sources: [
      { label: "MotoPinas: X300 Casa Lambretta Philippine launch and ₱409,900 price", url: "https://www.motopinas.com/motorcycle-news/limited-edition-lambretta-x300-now-in-the-ph-starts-at-php-409-900.html" },
      { label: "ZigWheels Philippines: Lambretta X300 current price-on-request listing", url: "https://www.zigwheels.ph/new-motorcycles/lambretta/x300/price" },
      { label: "ZigWheels Philippines: Lambretta G350 current price-on-request listing", url: "https://www.zigwheels.ph/new-motorcycles/lambretta/g350" }
    ]
  },
  {
    slug: "yamaha-r6-price-philippines",
    kicker: "Discontinued model price guide",
    title: "Yamaha R6 price in the Philippines",
    seoTitle: "Yamaha R6 Price Philippines: Historical SRP, Specs & Used Context",
    description: "Research the Yamaha YZF-R6 price in the Philippines with its historical ₱749,000 local price, 599cc specs, discontinuation context and used-bike checks.",
    intro: "The Yamaha YZF-R6 still attracts strong Philippine price searches even though the road-going model was discontinued. The useful answer is historical price plus used-market context, not a fake 2026 new-bike SRP.",
    lastChecked: "2026-10-04",
    sections: [
      {
        heading: "What was the Yamaha R6 price in the Philippines?",
        body: [
          "Philippine coverage of the final road-going YZF-R6 generation reported a local retail price of ₱749,000 from its 2017 launch era through the model's final years.",
          "That figure is a historical new-bike reference. A used R6 today can sell above or below it depending on year, condition, mileage, service history, modifications, documentation and collector demand."
        ],
        bullets: ["Historical Philippine new-bike price: ₱749,000", "Road-going R6 discontinued after the 2020 model era", "Used price depends on exact year and condition", "Do not relabel an overseas race-model price as a Philippine road-bike SRP"]
      },
      {
        heading: "Yamaha R6 specifications buyers still search for",
        body: [
          "The 2020 YZF-R6 used a 599cc liquid-cooled inline-four engine, six-speed transmission, 850 mm seat, 190 kg curb weight, 17 L fuel tank and 120/70ZR17 front and 180/55ZR17 rear tires.",
          "Philippine 2017 launch coverage listed 61.7 Nm of maximum torque. These specifications are useful for identifying the generation, but a modified used motorcycle may no longer match stock equipment."
        ]
      },
      {
        heading: "What replaced the road-going R6?",
        body: [
          "Yamaha discontinued the road-going R6 as emissions and market priorities changed. Race-only R6 versions continued in some markets, but those should not be confused with a street-registered Philippine YZF-R6.",
          "For a current road-going Yamaha sport-bike purchase, compare current Philippine R-series models rather than assuming a new R6 is still available locally."
        ]
      },
      {
        heading: "What to check before buying a used R6",
        body: [
          "Verify the chassis and engine numbers against the OR/CR, inspect service history, check for crash or track-use evidence, confirm cooling-system condition, inspect fork seals and brakes, and identify non-stock ECU, exhaust or suspension changes.",
          "A specialist pre-purchase inspection is worth considering on a high-revving supersport, especially when service records are incomplete."
        ]
      }
    ],
    faqs: [
      { question: "How much is a Yamaha R6 in the Philippines?", answer: "The final road-going YZF-R6 had a historical Philippine new-bike price of about ₱749,000. It is discontinued, so current prices are used-market prices rather than a 2026 SRP." },
      { question: "Is the Yamaha R6 still available brand new in the Philippines?", answer: "The road-going R6 was discontinued. Any current unit should be checked carefully to determine whether it is old stock, imported, used or a race-only version." },
      { question: "What engine does the Yamaha R6 have?", answer: "The final road-going generation used a 599cc liquid-cooled inline-four engine with a six-speed transmission." },
      { question: "What should I check when buying a used R6?", answer: "Check documentation, service history, crash or track-use evidence, cooling system, suspension, brakes, tires and modifications, and consider a specialist inspection." }
    ],
    related: [
      { href: "/motorcycles/yamaha/yzf-r7", title: "Yamaha YZF-R7", description: "See a current Yamaha road-going sport-bike option tracked by MotoIndex." },
      { href: "/motorcycles/yamaha/yzf-r1m", title: "Yamaha YZF-R1M", description: "Research Yamaha's current liter-class R-series model." },
      { href: "/recommendations/sport-motorcycles-philippines", title: "Sport motorcycles Philippines", description: "Compare current sport motorcycles by price, output, weight and rider fit." }
    ],
    sources: [
      { label: "MotoPinas: Yamaha R6 discontinuation and Philippine ₱749,000 price context", url: "https://www.motopinas.com/motorcycle-news/yamaha-to-discontinue-r6.html" },
      { label: "MotoPH: 2017 Philippine YZF-R6 launch specifications", url: "https://www.motoph.com/the-all-new-yamaha-yzf-r6-specifications-availability-and-price/" },
      { label: "Yamaha 2020 YZF-R6 owner-manual specification reference", url: "https://www.carmanualsonline.info/yamaha-yzf-r6-2020-owners-manual/?srch=height" }
    ]
  },


  {
    slug: "tvs-motorcycle-philippines",
    kicker: "TVS Philippines guide",
    title: "TVS motorcycles and scooters in the Philippines",
    seoTitle: "TVS Motorcycle Philippines 2026: iQube Price & Ntorq Status",
    description: "Check the current TVS Philippines lineup, TVS iQube price and specs, plus the current Philippine availability status of the TVS Ntorq 125.",
    intro: "TVS has meaningful Philippine search demand, but global TVS model pages can be mistaken for local availability. This guide separates the current official TVS Philippines catalog from models such as the Ntorq 125 that appear on TVS pages for other countries.",
    lastChecked: "2026-10-04",
    sections: [
      {
        heading: "What TVS currently lists in the Philippines",
        body: [
          "The current official TVS Philippines product catalog lists the TVS iQube electric scooter plus the King Deluxe and Kargo three-wheelers. MotoIndex uses that local catalog as the primary availability reference rather than assuming the wider global TVS range is officially sold here.",
          "For two-wheel buyers, the iQube is the current official Philippine scooter product visible on TVS's local site."
        ],
        bullets: ["TVS iQube: current Philippine electric scooter", "King Deluxe: current Philippine three-wheeler", "Kargo: current Philippine three-wheeler", "Check the Philippine TVS catalog before treating a global TVS model as locally current"]
      },
      {
        heading: "TVS iQube price in the Philippines",
        body: [
          "TVS's Philippine iQube product page currently shows an SRP of ₱99,800. The same page lists a 3.4 kWh battery, 100 km stated range, 78 km/h top speed and 0–80% charging time of about 4.5 hours.",
          "Price and specifications can change, so confirm the exact dealer quote, warranty, charger inclusion and registration processing before paying."
        ]
      },
      {
        heading: "Is the TVS Ntorq 125 officially listed in the Philippines?",
        body: [
          "The Ntorq 125 is a real TVS scooter and appears on TVS websites for other markets, but it is not currently listed in the official TVS Philippines product catalog checked by MotoIndex on October 4, 2026.",
          "That does not prove that no private, grey-market or old-stock unit exists. It means MotoIndex should not present the Ntorq 125 as a current official Philippine model without a local TVS source."
        ]
      }
    ],
    faqs: [
      { question: "What TVS motorcycles are available in the Philippines?", answer: "The current official TVS Philippines catalog lists the iQube electric scooter plus the King Deluxe and Kargo three-wheelers." },
      { question: "How much is the TVS iQube in the Philippines?", answer: "The current official TVS Philippines iQube page lists an SRP of ₱99,800. Confirm the current dealer quote before purchase." },
      { question: "Is the TVS Ntorq 125 available in the Philippines?", answer: "The Ntorq 125 is not currently listed in the official TVS Philippines product catalog MotoIndex checked on October 4, 2026. Verify any locally offered unit's source, warranty and registration status." },
      { question: "Why does the TVS global site show more motorcycles than the Philippine site?", answer: "TVS sells different lineups by country. A model appearing on another country's TVS site is not proof of current official Philippine availability." }
    ],
    related: [
      { href: "/motorcycles/electric", title: "Electric scooters Philippines", description: "Compare current verified Philippine electric scooter research." },
      { href: "/motorcycles/scooters", title: "Scooters Philippines", description: "Compare the wider current scooter market by price and specifications." },
      { href: "/tools/motorcycle-loan-calculator", title: "Motorcycle loan calculator", description: "Estimate monthly payments from a current dealer quote." }
    ],
    sources: [
      { label: "TVS Motor Philippines current product catalog", url: "https://www.tvsmotor.com/en/ph/our-products" },
      { label: "TVS Motor Philippines iQube product page", url: "https://www.tvsmotor.com/en/ph/our-products/tvs-iqube" },
      { label: "TVS Motor Philippines homepage", url: "https://www.tvsmotor.com/en/ph" }
    ]
  },


  {
    slug: "hatasu-ebike-price-philippines",
    kicker: "Hatasu e-bike guide",
    title: "Hatasu e-bike prices in the Philippines",
    seoTitle: "Hatasu E-Bike Philippines 2026: Prices, Models & Buying Guide",
    description: "Research Hatasu e-bike prices in the Philippines, including current Kumi, Nero, Haru, Aya and other retail-market references with buyer caveats.",
    intro: "Hatasu has strong Philippine e-bike search demand, but current prices vary by retailer, location and model generation. MotoIndex keeps current Philippine retail observations separate from fixed national-SRP claims when a single official price source is not available.",
    lastChecked: "2026-10-04",
    sections: [
      {
        heading: "Current Hatasu e-bike price references",
        body: [
          "Current Philippine market references place Hatasu two-wheel e-bikes such as Kumi and Nero around the lower end of the brand's range, while larger Aya, Hero, Haru and Buggy products sit higher depending on retailer and configuration.",
          "ZigWheels currently lists Kumi at ₱19,990 and Nero at ₱24,990. EMCOR's current Hatasu catalog shows retailer-specific ranges, including Kumi 2023 around ₱23,036–₱28,469 and Nero Lite around ₱26,775–₱32,031."
        ],
        bullets: ["Kumi: compare national-market and retailer-specific price references", "Nero / Nero Lite: confirm exact model name and battery setup", "Haru, Aya, Hero and Buggy: check whether the unit is two-wheel, three-wheel or utility-focused", "Ask for warranty, charger and registration requirements before purchase"]
      },
      {
        heading: "Why Hatasu prices can differ",
        body: [
          "E-bike pricing can change by battery specification, model generation, branch location, financing partner, delivery area and promotion. A retailer price range should not automatically be treated as the brand's national SRP.",
          "Compare the exact model code and battery configuration before using a price from one seller to judge another listing."
        ]
      },
      {
        heading: "Hatasu e-bike financing and ownership",
        body: [
          "Some Philippine retailers offer installment or BNPL options on Hatasu e-bikes. Compare the total repayment, downpayment, term and fees rather than choosing only by the lowest monthly figure.",
          "Before purchase, confirm battery warranty, charger replacement cost, parts support, service location and the exact LTO or local-road classification that applies to the unit."
        ]
      }
    ],
    faqs: [
      { question: "How much is a Hatasu e-bike in the Philippines?", answer: "Prices vary by exact model, battery setup, retailer and location. Current market references place small two-wheel models such as Kumi and Nero in roughly the ₱20,000–₱32,000 range, while larger models can cost substantially more." },
      { question: "How much is the Hatasu Kumi?", answer: "ZigWheels currently lists Kumi at ₱19,990, while EMCOR's current Kumi 2023 retailer listing shows roughly ₱23,036–₱28,469 depending on location and terms." },
      { question: "How much is the Hatasu Nero?", answer: "ZigWheels currently lists Nero at ₱24,990, while EMCOR's Nero Lite retail range is roughly ₱26,775–₱32,031." },
      { question: "Should I compare Hatasu e-bikes only by price?", answer: "No. Compare the exact battery, charger, warranty, parts support, service location, range claim and applicable road-use or registration requirements." }
    ],
    related: [
      { href: "/motorcycles/electric", title: "Electric scooters Philippines", description: "Compare current verified electric motorcycle and scooter research." },
      { href: "/guides/nwow-ebike-price-philippines", title: "NWOW e-bike prices", description: "Compare another high-demand Philippine e-bike brand." },
      { href: "/tools/electric-motorcycle-charging-cost", title: "Electric charging cost calculator", description: "Estimate charging costs using your electricity rate." }
    ],
    sources: [
      { label: "ZigWheels Hatasu Philippines price list", url: "https://www.zigwheels.ph/new-motorcycles/hatasu" },
      { label: "EMCOR current Hatasu retail catalog", url: "https://emcor.com.ph/brand/hatasu/" },
      { label: "EMCOR Hatasu electric-bike catalog", url: "https://emcor.com.ph/product-category/electric-bike/hatasu-electric-bike/" }
    ]
  },

];

export function getEditorialGuide(slug: string) {
  return editorialGuides.find((guide) => guide.slug === slug);
}
