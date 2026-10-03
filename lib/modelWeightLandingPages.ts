export type WeightIntentLandingProfile = {
  modelId: string;
  keyword: string;
  keywordVolume: number;
  title: string;
  description: string;
  heading: string;
  intro: string;
};

export const weightIntentLandingProfiles: WeightIntentLandingProfile[] = [
  {
    modelId: "royal-enfield-shotgun-650",
    keyword: "shotgun 650 weight",
    keywordVolume: 7700,
    title: "Royal Enfield Shotgun 650 Weight Philippines | 240 kg Guide",
    description: "Royal Enfield Shotgun 650 weight Philippines guide with 240 kg curb weight, seat-height context, power-to-weight math, category comparison and source caveats.",
    heading: "Royal Enfield Shotgun 650 weight and low-speed context",
    intro: "The MotoIndex record stores the Shotgun 650 at 240 kg curb weight. This page explains what that figure means, how it compares with other current 600–700cc motorcycles, and why seat height, balance and rider technique matter as much as the headline number."
  },
  {
    modelId: "royal-enfield-continental-gt-650",
    keyword: "weight of gt 650",
    keywordVolume: 3900,
    title: "Royal Enfield Continental GT 650 Weight Philippines | 214 kg",
    description: "Royal Enfield Continental GT 650 weight Philippines guide with 214 kg curb weight, seat-height context, power-to-weight math, category comparison and caveats.",
    heading: "Royal Enfield Continental GT 650 weight and handling context",
    intro: "The MotoIndex record stores the Continental GT 650 at 214 kg curb weight. Use the number together with the 820 mm seat, 47 hp output and 650-class comparison rather than treating weight alone as a handling verdict."
  }
];

const byId = new Map(weightIntentLandingProfiles.map((profile) => [profile.modelId, profile]));

export function weightIntentLandingProfile(modelId: string) {
  return byId.get(modelId);
}

export function hasWeightIntentLandingPage(modelId: string) {
  return byId.has(modelId);
}
