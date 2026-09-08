import { helmetProducts } from "@/lib/catalog";
import type { HelmetProduct } from "@/lib/types";

export type HelmetSeoComparisonSlug = "kyt-vs-ls2" | "evo-vs-spyder" | "full-face-vs-modular";

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
