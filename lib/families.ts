import { getModelById } from "./data";

export type ModelFamily = {
  make: string;
  makeSlug: string;
  name: string;
  slug: string;
  searchVolume: number;
  intro: string;
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
    intro: "Compare the current Yamaha Aerox with the previous V2 generation, including price context, core specifications and stock tire sizes.",
    currentModelId: "yamaha-aerox-v3",
    generationIds: ["yamaha-aerox-v3", "yamaha-aerox-v2"]
  },
  {
    make: "Yamaha",
    makeSlug: "yamaha",
    name: "NMAX",
    slug: "nmax",
    searchVolume: 23000,
    intro: "Compare current and previous Yamaha NMAX generations without mixing historical launch prices with the current model.",
    currentModelId: "yamaha-nmax-v3",
    generationIds: ["yamaha-nmax-v3", "yamaha-nmax-v2"]
  },
  {
    make: "Honda",
    makeSlug: "honda",
    name: "Click",
    slug: "click",
    searchVolume: 33000,
    intro: "Compare the Honda Click 160, Click 150i and Click 125i in one place, including what the unofficial V1, V2, V3 and V4 names riders use actually refer to.",
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
  }
];

export function getModelFamily(makeSlug: string, slug: string) {
  return modelFamilies.find((family) => family.makeSlug === makeSlug && family.slug === slug);
}

export function getFamilyModels(family: ModelFamily) {
  return family.generationIds.map(getModelById).filter(Boolean);
}
