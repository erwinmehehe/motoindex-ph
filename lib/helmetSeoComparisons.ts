import { helmetProducts } from "@/lib/catalog";
import type { HelmetProduct } from "@/lib/types";

export type HelmetSeoComparisonSlug = "kyt-vs-ls2" | "evo-vs-spyder" | "ls2-vs-hjc" | "agv-vs-hjc" | "nolan-vs-shoei" | "full-face-vs-modular";

export type HelmetSeoComparison = {
  slug: HelmetSeoComparisonSlug;
  title: string;
  seoTitle: string;
  description: string;
  kicker: string;
  leftLabel: string;
  rightLabel: string;
  intro: string;
  kind: "brand" | "format";
  leftBrandSlug?: string;
  rightBrandSlug?: string;
  leftType?: HelmetProduct["helmetType"];
  rightType?: HelmetProduct["helmetType"];
  sections: { heading: string; body: string[] }[];
  faqs: { question: string; answer: string }[];
};

export const helmetSeoComparisons: HelmetSeoComparison[] = [
  {
    slug:"kyt-vs-ls2",
    title:"KYT vs LS2 helmets in the Philippines",
    seoTitle:"KYT vs LS2 Helmets Philippines: Models, Prices & Features",
    description:"Compare verified KYT and LS2 helmet records in the Philippines by observed price, helmet type, shell, visor, intercom provision and certification notes.",
    kicker:"Helmet brand comparison",
    leftLabel:"KYT",
    rightLabel:"LS2",
    intro:"This comparison uses verified MotoIndex product records rather than treating either brand as universally better. Compare the exact models, because price, shell construction, visor hardware, intercom provision and certification text differ within each brand.",
    kind:"brand",
    leftBrandSlug:"kyt",
    rightBrandSlug:"ls2",
    sections:[
      {heading:"Choose the model before choosing the badge",body:["KYT and LS2 both cover more than one price and feature level, so a brand-level verdict can hide the differences that matter. Start with helmet format, fit and the exact model's checked specification record.","Use observed prices as dated shopping references, not permanent SRPs. Graphics, sizes and seller bundles can move independently even when the base helmet is the same."]},
      {heading:"Compare fit, visor and shell details model by model",body:["A useful comparison is whether the exact model has the visor setup, shell material, speaker provision and size range you need. Those are product-level details and should not be inferred from another helmet carrying the same brand name.","For a Philippine purchase, inspect the actual unit for the applicable PS or ICC conformity marking and use any international certification text as an additional model-specific reference rather than a substitute for the local check."]}
    ],
    faqs:[
      {question:"Is KYT better than LS2?",answer:"MotoIndex does not apply one overall winner to two broad helmet brands. Compare the exact KYT and LS2 models that fit your budget, head shape, helmet format and feature needs."},
      {question:"Which is cheaper, KYT or LS2?",answer:"It depends on the exact models and seller observations available at the time of checking. The comparison below shows recorded starting prices where MotoIndex has them."},
      {question:"Should I choose by certification or price first?",answer:"Start with the exact model's conformity and fit, then compare price and features. A higher price does not remove the need to verify the marking on the helmet you receive."}
    ]
  },
  {
    slug:"evo-vs-spyder",
    title:"EVO vs Spyder helmets in the Philippines",
    seoTitle:"EVO vs Spyder Helmets Philippines: Prices & Features",
    description:"Compare verified EVO and Spyder helmet models by observed price, format, visor equipment, intercom provision, shell and certification notes.",
    kicker:"Helmet brand comparison",
    leftLabel:"EVO",
    rightLabel:"Spyder",
    intro:"EVO and Spyder are common Philippine shopping choices, but the useful comparison is between exact models rather than brand reputation alone. MotoIndex keeps the checked product records side by side so you can compare price, format and equipment without inventing a winner.",
    kind:"brand",
    leftBrandSlug:"evo",
    rightBrandSlug:"spyder",
    sections:[
      {heading:"Budget overlap does not mean the helmets are equivalent",body:["Two helmets can sit in a similar observed price range while using different visor systems, shell materials, size coverage or retention hardware. Open the model pages before assuming the cheaper or more expensive option is the better fit for your use.","Graphic variants and promotions can also change the seller price without changing the base protective structure, so compare like-for-like versions when possible."]},
      {heading:"Use your riding pattern to narrow the comparison",body:["For daily commuting, fit, ventilation, visor clarity and replacement-part availability are usually more useful than a long feature list. If you plan to add an intercom, compare recorded speaker or communication provision before buying the electronics.","Certification notes remain model-specific. Check the PS or ICC mark on the exact Philippine-market unit rather than carrying one model's certification across the whole brand."]}
    ],
    faqs:[
      {question:"Is EVO or Spyder better for commuting?",answer:"There is no universal brand-level answer. Compare the exact helmet type, fit, visor setup, ventilation and intercom provision for the models within your budget."},
      {question:"Which brand has cheaper helmets?",answer:"Observed starting prices vary by model, size, graphic and seller. MotoIndex shows the current recorded price range for the verified models included in this comparison."},
      {question:"Do EVO and Spyder helmets all have the same certification?",answer:"No. Certification is model and market specific. Verify the exact model record and the PS or ICC conformity marking on the unit you are buying."}
    ]
  },
  {
    slug:"ls2-vs-hjc",
    title:"LS2 vs HJC helmets in the Philippines",
    seoTitle:"LS2 vs HJC Helmets Philippines: Prices, Models & Features",
    description:"Compare verified LS2 and HJC helmet models in the Philippines by observed price, helmet type, visor setup, shell, intercom provision and certification notes.",
    kicker:"Helmet brand comparison",
    leftLabel:"LS2",
    rightLabel:"HJC",
    intro:"LS2 and HJC both cover mainstream road helmets as well as higher-spec touring and sport choices. Compare the exact model rather than treating either badge as one quality level.",
    kind:"brand",
    leftBrandSlug:"ls2",
    rightBrandSlug:"hjc",
    sections:[
      {heading:"Compare the exact price tier and helmet format",body:["LS2 spans budget, modular, touring, adventure and premium carbon models, while HJC also covers entry road helmets through RPHA performance models. A useful comparison starts with two helmets solving the same riding job.","Check the current seller price, shell construction, visor and anti-fog provision, weight where published and replacement-part availability before deciding."]},
      {heading:"Fit and local conformity still come first",body:["Brand reputation cannot tell you which internal shape fits your head. Use the exact model size chart and try the helmet on when possible.","For Philippine use, inspect the actual unit for the applicable PS or ICC conformity marking and do not transfer one model's international certification to another model in the same brand."]}
    ],
    faqs:[
      {question:"Is LS2 better than HJC?",answer:"There is no useful brand-wide winner. Compare the exact LS2 and HJC models at the same price and helmet type, then choose by fit, certification, visor system, weight and replacement parts."},
      {question:"Which has more affordable helmet choices, LS2 or HJC?",answer:"MotoIndex records multiple LS2 price tiers and several HJC road models. The cheapest option changes with model, size, graphic and seller promotion, so use the price rows below as dated references."},
      {question:"Can I choose based only on ECE certification?",answer:"No. Compare the exact certification of the model and inspect the PS or ICC conformity marking on the Philippine unit. Fit and condition remain essential."}
    ]
  },
  {
    slug:"agv-vs-hjc",
    title:"AGV vs HJC helmets in the Philippines",
    seoTitle:"AGV vs HJC Helmets Philippines: Prices & Model Comparison",
    description:"Compare verified AGV and HJC helmet records in the Philippines by price, helmet type, shell, visor features and model-specific certification notes.",
    kicker:"Helmet brand comparison",
    leftLabel:"AGV",
    rightLabel:"HJC",
    intro:"AGV and HJC overlap in sport and road helmets but span very different price points within their own ranges. Compare the exact helmet model and riding use instead of choosing from brand image alone.",
    kind:"brand",
    leftBrandSlug:"agv",
    rightBrandSlug:"hjc",
    sections:[
      {heading:"Premium branding is not the same as the right helmet",body:["AGV's range includes premium racing and road helmets, while HJC spans accessible road models through the RPHA performance family. Match helmet type and price tier before comparing features.","Look at shell construction, visor optics, ventilation, fit and included anti-fog hardware on the exact models you are considering."]},
      {heading:"Use local-unit checks before paying",body:["A model can be sold in more than one market configuration. Verify the actual helmet's certification label and Philippine conformity marking, then confirm the size and production condition.","Price differences may also reflect graphics, carbon construction or bundled visors rather than a simple safety ranking."]}
    ],
    faqs:[
      {question:"Is AGV better than HJC?",answer:"Not as a blanket rule. AGV and HJC each sell multiple helmet tiers. Compare equivalent models by fit, certification, shell, visor system and price."},
      {question:"Why can AGV cost more than HJC?",answer:"Some AGV models use premium shell construction, racing development and higher-end finishing, but both brands have multiple tiers. Compare equivalent models rather than average brand price."},
      {question:"Which brand should I choose for daily riding?",answer:"Choose the exact model that fits correctly and has the visor, ventilation, weight and local conformity you need for your route. Brand name alone is not enough."}
    ]
  },
  {
    slug:"nolan-vs-shoei",
    title:"Nolan vs Shoei helmets in the Philippines",
    seoTitle:"Nolan vs Shoei Helmets Philippines: Modular & Touring Comparison",
    description:"Compare verified Nolan and Shoei helmet models in the Philippines by observed price, helmet type, shell, visor systems, touring features and certification notes.",
    kicker:"Helmet brand comparison",
    leftLabel:"Nolan",
    rightLabel:"Shoei",
    intro:"Nolan and Shoei both have touring-oriented helmets, but their Philippine price bands and model formats differ. Use the exact modular, open-face or full-face model as the comparison unit.",
    kind:"brand",
    leftBrandSlug:"nolan",
    rightBrandSlug:"shoei",
    sections:[
      {heading:"Touring convenience depends on the exact model",body:["Nolan's current Philippine listings include flip-back and crossover modular designs as well as open-face and adventure options. Shoei's range includes premium modular, touring full-face and open-face helmets.","Compare chin-bar mechanism, visor and sun-shield setup, intercom provision, weight and replacement parts rather than assuming every touring helmet has the same features."]},
      {heading:"Premium price still needs a fit check",body:["A premium helmet is only useful when the internal shape and size fit the rider correctly. Use each model's chart and confirm cheek-pad and forehead pressure before buying.","Inspect the actual Philippine unit for its conformity marking and certification label, especially when a model family is sold in several markets."]}
    ],
    faqs:[
      {question:"Is Nolan or Shoei better for touring?",answer:"Both brands have touring-focused models, but the answer depends on the exact helmet. Compare fit, modular mechanism where applicable, visor, sun shield, intercom provision, weight and price."},
      {question:"Which is cheaper, Nolan or Shoei?",answer:"The current Philippine Nolan listings include models below several Shoei premium models, but the ranges are not directly equivalent. Compare helmets with the same format and purpose."},
      {question:"Are Nolan and Shoei helmets legal in the Philippines?",answer:"Legality depends on the exact unit's applicable Philippine conformity marking, not the brand alone. Check the PS or ICC mark on the helmet you are buying."}
    ]
  },
  {
    slug:"full-face-vs-modular",
    title:"Full-face vs modular motorcycle helmets",
    seoTitle:"Full-Face vs Modular Helmet: Philippines Buying Guide",
    description:"Compare verified full-face and modular motorcycle helmets by coverage, weight, convenience, price, intercom provision and model-specific certification notes.",
    kicker:"Helmet format comparison",
    leftLabel:"Full-face",
    rightLabel:"Modular",
    intro:"Full-face and modular helmets solve different riding problems. A fixed full-face shell prioritizes continuous coverage around the chin area, while a modular adds a hinge and flip-up convenience. The right choice still depends on fit, exact model approval and how you ride.",
    kind:"format",
    leftType:"Full face",
    rightType:"Modular",
    sections:[
      {heading:"The hinge is the main structural difference",body:["A full-face helmet uses a fixed chin bar. A modular helmet adds a hinge and locking mechanism so the front can open. That convenience can be useful at fuel stops, checkpoints and during longer touring days, but it also adds hardware and usually weight.","Do not assume every modular helmet is approved to be ridden with the chin bar raised. Follow the exact model's homologation and manufacturer instructions."]},
      {heading:"Fit and daily comfort still decide whether the helmet works for you",body:["A helmet that matches your head shape and remains comfortable through heat and traffic is easier to wear correctly every day. Compare the exact model's size chart, weight where published, visor system and intercom provision rather than choosing only by format.","For Philippine use, verify the applicable PS or ICC conformity marking on the actual helmet. Format does not replace the local product check."]}
    ],
    faqs:[
      {question:"Is a full-face helmet safer than a modular helmet?",answer:"A fixed full-face avoids the hinge and moving chin-bar mechanism, but safety cannot be reduced to format alone. Compare the exact helmet's homologation, fit, condition and correct use."},
      {question:"Why choose a modular helmet?",answer:"The flip-up front can be convenient for touring, fuel stops, checkpoints, glasses and short conversations without removing the helmet. The tradeoff is additional mechanism and usually more weight."},
      {question:"Can I ride with a modular helmet open?",answer:"Only when the exact helmet's approval and manufacturer instructions allow it. Do not assume a flip-up mechanism automatically means the helmet is homologated for riding with the chin bar raised."}
    ]
  }
];

export function getHelmetSeoComparison(slug:string){
  return helmetSeoComparisons.find(c=>c.slug===slug);
}

export function getHelmetSeoComparisonSides(comparison:HelmetSeoComparison){
  const verified=helmetProducts.filter(p=>p.status==="verified");
  if(comparison.kind==="brand"){
    return {
      left:verified.filter(p=>p.brandSlug===comparison.leftBrandSlug),
      right:verified.filter(p=>p.brandSlug===comparison.rightBrandSlug)
    };
  }
  return {
    left:verified.filter(p=>p.helmetType===comparison.leftType),
    right:verified.filter(p=>p.helmetType===comparison.rightType)
  };
}

export function isIndexableHelmetSeoComparison(slug:string){
  const comparison=getHelmetSeoComparison(slug);
  if(!comparison) return false;
  const {left,right}=getHelmetSeoComparisonSides(comparison);
  return left.length>=2 && right.length>=2;
}
