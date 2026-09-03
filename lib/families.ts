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
  }
];

export function getModelFamily(makeSlug: string, slug: string) {
  return modelFamilies.find((family) => family.makeSlug === makeSlug && family.slug === slug);
}

export function getFamilyModels(family: ModelFamily) {
  return family.generationIds.map(getModelById).filter(Boolean);
}
