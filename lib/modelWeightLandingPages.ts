export type WeightIntentLandingProfile = {
  modelId: string;
  keyword: string;
  keywordVolume: number;
  title: string;
  description: string;
  heading: string;
};

export const weightIntentLandingProfiles: WeightIntentLandingProfile[] = [
  {
    modelId: "royal-enfield-shotgun-650",
    keyword: "shotgun 650 weight",
    keywordVolume: 7700,
    title: "Royal Enfield Shotgun 650 Weight Philippines | 240 kg Guide",
    description: "Royal Enfield Shotgun 650 weight Philippines guide with 240 kg curb weight, pound conversion, low-speed handling context, seat height and fit cautions.",
    heading: "Royal Enfield Shotgun 650 weight: 240 kg curb weight"
  },
  {
    modelId: "royal-enfield-continental-gt-650",
    keyword: "weight of gt 650",
    keywordVolume: 3900,
    title: "Royal Enfield Continental GT 650 Weight Philippines | 214 kg",
    description: "Royal Enfield Continental GT 650 weight Philippines guide with 214 kg curb weight, pound conversion, rider-fit context, parking considerations and source notes.",
    heading: "Royal Enfield Continental GT 650 weight: 214 kg curb weight"
  },
  {
    modelId: "honda-click-125i",
    keyword: "honda click 125i weight",
    keywordVolume: 300,
    title: "Honda Click 125i Weight Philippines | 111 kg Curb Weight",
    description: "Honda Click 125i weight Philippines guide with 111 kg curb weight, pound conversion, low-speed handling, seat height, passenger and parking considerations.",
    heading: "Honda Click 125i weight: 111 kg curb weight"
  },
  {
    modelId: "honda-beat",
    keyword: "honda beat weight",
    keywordVolume: 200,
    title: "Honda BeAT Weight Philippines | 90 kg Curb Weight Guide",
    description: "Honda BeAT weight Philippines guide with 90 kg curb weight, pound conversion, low-speed handling context, 742 mm seat height and practical rider-fit cautions.",
    heading: "Honda BeAT weight: 90 kg curb weight"
  }
];

const byId = new Map(weightIntentLandingProfiles.map((profile) => [profile.modelId, profile]));

export function weightIntentLandingProfile(modelId: string) {
  return byId.get(modelId);
}

export function hasWeightIntentLandingPage(modelId: string) {
  return byId.has(modelId);
}
