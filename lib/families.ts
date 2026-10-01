import { getModelById } from "./data";

export type ModelFamily = {
  make: string;
  makeSlug: string;
  name: string;
  slug: string;
  searchVolume: number;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  secondaryKeywords: string[];
  comparisonHeading: string;
  currentModelId: string;
  generationIds: string[];
  /**
   * Set where riders use unofficial generation nicknames for the family. The
   * Click is the case that matters: "Click V3" is a rider name, not a Honda
   * designation, and sellers apply the V-numbers to different model years. The
   * page says so rather than picking a mapping no source supports.
   */
  nicknames?: { heading: string; body: string[] };
};

export const modelFamilies: ModelFamily[] = [
  {
    make: "Yamaha",
    makeSlug: "yamaha",
    name: "Aerox",
    slug: "aerox",
    searchVolume: 14000,
    intro: "Compare Yamaha Aerox V1, V2 and the current V3 generation, keeping historical launch prices separate from current new-bike pricing while showing the core specification changes.",
    seoTitle: "Yamaha Aerox Price Philippines 2026 | V1, V2 & V3",
    seoDescription: "Compare Yamaha Aerox V1, V2 and V3 prices, specs, seat height, weight and tire sizes in the Philippines with separate historical and current price context.",
    secondaryKeywords: ["Yamaha Aerox price Philippines", "Aerox price Philippines", "Aerox 155 price Philippines", "Aerox SP price Philippines", "Aerox V1", "Aerox V1 price", "Aerox V1 vs V2 vs V3", "Aerox V3 price Philippines", "Aerox V2 price Philippines", "Aerox generations Philippines"],
    comparisonHeading: "Yamaha Aerox V1 vs V2 vs V3: what changed?",
    currentModelId: "yamaha-aerox-v3",
    generationIds: ["yamaha-aerox-v3", "yamaha-aerox-v2", "yamaha-aerox-v1"]
  },
  {
    make: "Yamaha",
    makeSlug: "yamaha",
    name: "NMAX",
    slug: "nmax",
    searchVolume: 23000,
    intro: "Compare Yamaha NMAX V1, V2 and the current V3 generation without mixing the older generations' historical prices with the current model.",
    seoTitle: "Yamaha NMAX Price Philippines 2026 | V1, V2 & V3",
    seoDescription: "Compare Yamaha NMAX V1, V2 and V3 prices, specs, seat height, weight and generation differences in the Philippines with historical price context kept separate.",
    secondaryKeywords: ["Yamaha NMAX price Philippines", "NMAX price Philippines", "NMAX 155 price Philippines", "NMAX V3 price Philippines", "NMAX V2 price Philippines", "NMAX V1", "NMAX V1 price", "NMAX V1 vs V2 vs V3", "NMAX generations Philippines"],
    comparisonHeading: "Yamaha NMAX V1 vs V2 vs V3: what changed?",
    currentModelId: "yamaha-nmax-v3",
    generationIds: ["yamaha-nmax-v3", "yamaha-nmax-v2", "yamaha-nmax-v1"]
  },
  {
    make: "Honda",
    makeSlug: "honda",
    name: "Click",
    slug: "click",
    searchVolume: 33000,
    intro: "Compare the Honda Click 160, Click 150i and Click 125i in one place, including what the unofficial V1, V2, V3 and V4 names riders use actually refer to.",
    seoTitle: "Honda Click Price Philippines 2026 | 125i vs 150i vs 160",
    seoDescription: "Compare Honda Click 125i, 150i and Click 160 prices and specs in the Philippines, plus unofficial V1, V2, V3 and V4 naming and generation differences.",
    secondaryKeywords: ["Honda Click price Philippines", "Honda Click price", "Honda Click 125i price Philippines", "Honda Click 160 price Philippines", "Click 125i vs 150i vs 160", "Honda Click V1 V2 V3 V4", "Honda Click generations"],
    comparisonHeading: "Honda Click 125i vs 150i vs 160: what changed?",
    currentModelId: "honda-click-160",
    generationIds: ["honda-click-160", "honda-click-150i", "honda-click-125i"],
    nicknames: {
      heading: "What Click V1, V2, V3 and V4 actually mean",
      body: [
        "Honda has never sold a motorcycle called a Click V1, V2, V3 or V4. Those are names Filipino riders and resellers invented for successive restyles, and Honda's own Philippine site lists the lineup by displacement instead: Click 125i, Click 150i and Click 160.",
        "That matters because the V-numbers are not used consistently. One seller's “Click V3” is another seller's “V2”, and some listings count the Click 160 as “V4” while others reserve the V-numbering for the 125i alone. There is no authority to appeal to, because there is no official scheme to be right or wrong about.",
        "So do not buy, sell or price a Click on a V-number. Read the displacement and the model year off the OR/CR and the engine number, then use the page for that exact model below. If a seller quotes you a price for a “V3”, ask which displacement and which year they mean before comparing it to anything."
      ]
    }
  },

  {
    make: "Honda",
    makeSlug: "honda",
    name: "ADV",
    slug: "adv",
    searchVolume: 0,
    intro: "Compare the current Honda ADV160 with the previous ADV150 generation, keeping current new-bike pricing separate from the discontinued model's historical Philippine launch price.",
    seoTitle: "Honda ADV Price Philippines 2026 | ADV150 vs ADV160 Specs",
    seoDescription: "Compare Honda ADV150 vs ADV160 prices, specs, seat height, weight and generation differences in the Philippines, with current and historical price context.",
    secondaryKeywords: ["Honda ADV price Philippines", "ADV150 vs ADV160", "Honda ADV160 price", "Honda ADV150 price", "Honda ADV generations Philippines"],
    comparisonHeading: "Honda ADV150 vs ADV160: what changed?",
    currentModelId: "honda-adv-160",
    generationIds: ["honda-adv-160", "honda-adv-150"]
  },

];

export function getModelFamily(makeSlug: string, slug: string) {
  return modelFamilies.find((family) => family.makeSlug === makeSlug && family.slug === slug);
}

export function getFamilyModels(family: ModelFamily) {
  return family.generationIds.map(getModelById).filter(Boolean);
}

export function getModelFamilyForModel(modelId: string) {
  return modelFamilies.find((family) => family.generationIds.includes(modelId));
}
