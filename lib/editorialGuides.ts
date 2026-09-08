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
  }
];

export function getEditorialGuide(slug: string) {
  return editorialGuides.find((guide) => guide.slug === slug);
}
