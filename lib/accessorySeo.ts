export type AccessorySeoGuide = {
  slug: "intercoms" | "phone-holders" | "rain-gear";
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  checkedAt: string;
  sections: { heading: string; body: string[]; bullets?: string[] }[];
  faqs: { question: string; answer: string }[];
  related: { href: string; title: string; description: string }[];
};

export const accessorySeoGuides: AccessorySeoGuide[] = [
  {
    slug: "phone-holders",
    title: "Motorcycle phone holders in the Philippines",
    seoTitle: "Motorcycle Phone Holders Philippines: Mounting Guide 2026",
    description: "Choose a motorcycle phone holder by mount location, retention, vibration isolation, control clearance, weather exposure and phone fit.",
    intro: "A phone holder should be chosen around the motorcycle, the phone and the route. Handlebar space, mirror stems, controls, windscreen clearance and vibration differ by bike, so MotoIndex treats mounting as a fitment question instead of claiming one holder fits everything.",
    checkedAt: "2026-09-09",
    sections: [
      {
        heading: "Choose the mounting point before the holder",
        body: [
          "Start by checking where the mount can sit without blocking the throttle, brake lever, switches, mirrors, key area or instrument display. A product can fit the handlebar diameter and still be a poor installation if it interferes with controls.",
          "Scooters often have less exposed handlebar space than naked or adventure motorcycles, which is why mirror-stem or model-specific mounting solutions can be worth considering."
        ],
        bullets: ["Full steering lock in both directions", "Brake and throttle clearance", "Instrument and mirror visibility", "Cable and charging-port routing"]
      },
      {
        heading: "Retention and vibration both matter",
        body: [
          "The phone needs positive retention over bumps and repeated stops. Check how the cradle locks around the device, whether a secondary tether is available and whether the case changes the effective phone size.",
          "Motorcycle vibration varies by engine, mounting point and road surface. If your phone manufacturer warns about prolonged vibration exposure, follow that guidance and consider a mount designed to reduce vibration rather than assuming every handlebar clamp provides the same isolation."
        ]
      },
      {
        heading: "Plan for rain, heat and charging",
        body: [
          "A water-resistant phone does not make every charging cable, adapter or open port weatherproof. Route charging cables away from steering pinch points and confirm the connection stays clear when the bars move.",
          "Direct sun can also make a phone harder to read or cause thermal limits during navigation. Mount position and screen angle can matter as much as the clamp itself."
        ]
      }
    ],
    faqs: [
      { question: "What is the best motorcycle phone holder?", answer: "There is no universal best mount. Choose one that fits your motorcycle's mounting point, your exact phone and case, keeps the controls clear and provides secure retention for your roads." },
      { question: "Where should I mount my phone on a motorcycle?", answer: "Use a position that remains visible without blocking instruments or controls and still clears the tank, windscreen and bodywork through full steering movement." },
      { question: "Do motorcycle phone mounts need vibration damping?", answer: "It depends on the motorcycle, mounting point and phone. Follow your phone manufacturer's guidance about vibration exposure and use an appropriate isolation solution where needed." },
      { question: "Can I use the same phone holder on a scooter and a big bike?", answer: "Possibly, but do not assume it. The available bar or mirror mounting points, clamp diameter, clearance and vibration can be different." }
    ],
    related: [
      { href: "/accessories/intercoms", title: "Motorcycle intercoms", description: "Compare communication-system buying factors." },
      { href: "/accessories/rain-gear", title: "Motorcycle rain gear", description: "Build a more practical wet-weather commute setup." },
      { href: "/motorcycles", title: "Choose your motorcycle", description: "Open a model page before planning mounting and fitment." }
    ]
  },
  {
    slug: "intercoms",
    title: "Motorcycle helmet intercoms in the Philippines",
    seoTitle: "Motorcycle Helmet Intercoms Philippines: Buying Guide 2026",
    description: "Choose a motorcycle helmet intercom by speaker fit, microphone type, rider count, claimed range, controls, battery and weather exposure.",
    intro: "An intercom is only useful if the hardware fits your helmet comfortably and the controls suit how you ride. Compare the communication features after checking speaker pockets, microphone placement and the mounting method on your exact helmet.",
    checkedAt: "2026-09-09",
    sections: [
      {
        heading: "Start with helmet compatibility",
        body: [
          "Check whether the helmet has speaker recesses and whether their position lines up with your ears. Even a small speaker can create pressure if it sits on top of the ear instead of inside a designed pocket.",
          "Full-face helmets usually use a wired microphone, while many modular and open-face setups use a boom microphone. The exact interior and chin-bar movement should decide the installation."
        ],
        bullets: ["Speaker-pocket position and depth", "Wired or boom microphone clearance", "Clamp or adhesive mounting surface", "Cable routing without modifying protective material"]
      },
      {
        heading: "Treat range figures as a comparison point",
        body: [
          "Manufacturer range figures are useful for comparing products, but real riding range can change with buildings, terrain, traffic, rider spacing and how the units connect. Do not plan a group ride around a single headline distance.",
          "For two riders, a simple rider-to-rider system may be enough. Larger groups should compare how many active riders the system supports, how reconnection works and whether everyone needs the same ecosystem."
        ]
      },
      {
        heading: "Controls and battery matter on daily rides",
        body: [
          "Buttons that are easy to press on a desk can be difficult with gloves. Check whether the control layout is distinct enough to use without staring at the unit.",
          "Battery life should be considered against your longest normal ride, not only a short commute. Also check the charging connector and whether the unit can be topped up conveniently between rides."
        ]
      }
    ],
    faqs: [
      { question: "Can an intercom fit any motorcycle helmet?", answer: "No. Speaker recesses, microphone type, clamp space and liner design vary. Check the exact helmet and intercom installation requirements before buying." },
      { question: "How much intercom range do I need?", answer: "For rider and passenger use, extreme range is usually less important than reliable pairing and clear audio. Group riders should compare real connection behavior as well as the manufacturer's claimed maximum range." },
      { question: "Is an intercom-ready helmet required?", answer: "Not always, but dedicated speaker and microphone provisions can make installation more comfortable and reduce the temptation to force hardware into the liner." },
      { question: "Should all riders use the same intercom brand?", answer: "Not necessarily, but group features and cross-brand compatibility can vary. Check the exact models and connection modes before assuming every unit will work together." }
    ],
    related: [
      { href: "/gear/helmets/intercom-ready", title: "Intercom-ready helmets", description: "Compare verified helmets with recorded communication-system provision." },
      { href: "/gear/helmets/for-commuting", title: "Helmets for commuting", description: "Compare helmet formats for daily riding." },
      { href: "/accessories/phone-holders", title: "Motorcycle phone holders", description: "Plan navigation mounting without blocking controls." }
    ]
  },
  {
    slug: "rain-gear",
    title: "Motorcycle rain gear in the Philippines",
    seoTitle: "Motorcycle Rain Gear Philippines: Commuter Buying Guide",
    description: "Choose motorcycle rain gear for Philippine commuting by coverage, over-gear fit, closures, visibility, pack size, drying and boot or glove overlap.",
    intro: "Rain gear for a motorcycle commute has to work while seated, moving and exposed to wind. Compare how the jacket and pants overlap your normal riding gear, how openings are sealed and whether the kit remains visible and practical after repeated wet rides.",
    checkedAt: "2026-09-09",
    sections: [
      {
        heading: "Fit rain gear over what you actually ride in",
        body: [
          "Try to size rain layers over your normal jacket, pants and protective gear rather than over a T-shirt. A shell that feels generous while standing can pull tight across the shoulders, knees or waist once you are in riding position.",
          "Longer cuffs, adjustable openings and enough overlap between jacket and pants help reduce gaps that appear when you reach for the handlebars."
        ],
        bullets: ["Room over normal riding gear", "Jacket-to-pants overlap while seated", "Cuff and ankle adjustment", "Freedom of movement at shoulders and knees"]
      },
      {
        heading: "Water usually finds openings first",
        body: [
          "Fabric waterproofing is only part of the system. Front closures, pockets, neck openings, cuffs and seams are common places for water to enter, so compare how those areas are protected.",
          "Boot and glove overlap matters in sustained rain. Make sure runoff is directed over the outside of boots and gloves rather than into an opening."
        ]
      },
      {
        heading: "Visibility and packing are everyday features",
        body: [
          "Wet weather reduces contrast and makes road spray more distracting. Reflective or high-visibility details can help other road users notice you, but they do not replace lights, signals and defensive riding.",
          "For commuters, a rain suit that packs small enough to stay on the motorcycle is more useful than one that is always left at home. After use, dry it fully before long-term storage to reduce odor and material deterioration."
        ]
      }
    ],
    faqs: [
      { question: "What should I look for in motorcycle rain gear?", answer: "Check coverage while seated, closure and seam protection, room over riding gear, cuff and ankle adjustment, visibility, pack size and how easily the gear dries after use." },
      { question: "Should motorcycle rain gear be one size bigger?", answer: "Use the manufacturer's sizing with your normal riding layers in mind. The correct answer depends on the cut, so check the actual measurements rather than automatically adding one size." },
      { question: "Is a motorcycle raincoat enough?", answer: "A jacket can protect the upper body, but sustained motorcycle rain also reaches the legs, gloves and boots. Choose coverage for the length and conditions of your normal ride." },
      { question: "What is best for daily rainy-season commuting?", answer: "A practical setup is one you can keep with the motorcycle, put on quickly over normal gear, move in comfortably and dry between rides." }
    ],
    related: [
      { href: "/gear/helmets/for-commuting", title: "Helmets for commuting", description: "Compare visor, coverage and daily-use helmet tradeoffs." },
      { href: "/accessories/phone-holders", title: "Motorcycle phone holders", description: "Plan navigation and charging for wet-weather use." },
      { href: "/commute/rainy-season", title: "Rainy-season motorcycle commuting", description: "Open MotoIndex rainy-season ownership guidance." }
    ]
  }
];

export function getAccessorySeoGuide(slug: string) {
  return accessorySeoGuides.find((guide) => guide.slug === slug);
}
