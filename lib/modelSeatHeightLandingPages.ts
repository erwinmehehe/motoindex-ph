export type SeatHeightIntentLandingProfile = {
  modelId: string;
  keyword: string;
  keywordVolume: number;
  title: string;
  description: string;
  heading: string;
  intro: string;
};

export const seatHeightIntentLandingProfiles: SeatHeightIntentLandingProfile[] = [
  {
    modelId: "royal-enfield-shotgun-650",
    keyword: "shotgun 650 seat height",
    keywordVolume: 1200,
    title: "Royal Enfield Shotgun 650 Seat Height | 795 mm Rider Guide",
    description: "Royal Enfield Shotgun 650 seat height guide with 795 mm seat, 240 kg curb weight, rider-reach caveats, nearby comparisons and low-speed fit context.",
    heading: "Royal Enfield Shotgun 650 seat height and rider-fit context",
    intro: "MotoIndex stores the Royal Enfield Shotgun 650 at 795 mm seat height and 240 kg curb weight. This page puts those figures together because a relatively approachable seat height can still feel very different once motorcycle width and mass are considered."
  },
  {
    modelId: "honda-click-160",
    keyword: "honda click seat height",
    keywordVolume: 700,
    title: "Honda Click 160 Seat Height Philippines 2026 | 778 mm Guide",
    description: "Honda Click 160 seat height Philippines guide with 778 mm seat, 116 kg curb weight, rider-reach caveats, scooter comparison data and low-speed fit context.",
    heading: "Honda Click 160 seat height and rider-fit context",
    intro: "MotoIndex stores the Honda Click 160 at 778 mm seat height. This page explains that number beside curb weight, nearby scooter seat heights and the rider-reach factors that determine how manageable the scooter actually feels."
  },
  {
    modelId: "yamaha-nmax-v3",
    keyword: "nmax seat height",
    keywordVolume: 600,
    title: "Yamaha NMAX V3 Seat Height Philippines 2026 | 770 mm Guide",
    description: "Yamaha NMAX V3 seat height Philippines guide with 770 mm seat, 131 kg curb weight, rider-reach caveats, scooter comparisons and low-speed fit context.",
    heading: "Yamaha NMAX V3 seat height and rider-fit context",
    intro: "MotoIndex stores the Yamaha NMAX V3 at 770 mm seat height. Use that figure with its 131 kg curb weight, floorboard width and in-person reach rather than treating seat height alone as proof of easy footing."
  },
  {
    modelId: "honda-beat",
    keyword: "honda beat seat height",
    keywordVolume: 500,
    title: "Honda BeAT Seat Height Philippines 2026 | 742 mm Rider Guide",
    description: "Honda BeAT seat height Philippines guide with 742 mm seat, 90 kg curb weight, rider-reach caveats, commuter-scooter comparisons and low-speed fit context.",
    heading: "Honda BeAT seat height and rider-fit context",
    intro: "MotoIndex stores the Honda BeAT at 742 mm seat height and 90 kg curb weight. This guide puts those two figures together so riders can judge low-speed fit more realistically than from seat height alone."
  },
  {
    modelId: "kawasaki-ninja-400",
    keyword: "how tall is ninja",
    keywordVolume: 500,
    title: "Kawasaki Ninja 400 Seat Height Philippines | 785 mm Guide",
    description: "Kawasaki Ninja 400 seat height Philippines guide with 785 mm seat, 168 kg curb weight, sport-bike comparisons, rider-reach caveats and low-speed fit context.",
    heading: "Kawasaki Ninja 400 seat height and rider-fit context",
    intro: "MotoIndex stores the previous-generation Kawasaki Ninja 400 at 785 mm seat height. Compare that with curb weight, seat width and current sport-bike alternatives rather than treating a single dimension as a fit verdict."
  },
  {
    modelId: "honda-adv-350",
    keyword: "adv seat height",
    keywordVolume: 200,
    title: "Honda ADV350 Seat Height Philippines 2026 | 795 mm Guide",
    description: "Honda ADV350 seat height Philippines guide with 795 mm seat, 186 kg curb weight, maxi-scooter comparisons, rider-reach caveats and low-speed fit context.",
    heading: "Honda ADV350 seat height and rider-fit context",
    intro: "MotoIndex stores the Honda ADV350 at 795 mm seat height and 186 kg curb weight. This page compares those dimensions with other current maxi scooters and explains why width, weight and suspension sag still matter."
  },
  {
    modelId: "yamaha-xmax",
    keyword: "xmax seat height",
    keywordVolume: 150,
    title: "Yamaha XMAX Seat Height Philippines 2026 | 795 mm Guide",
    description: "Yamaha XMAX seat height Philippines guide with 795 mm seat, 181 kg curb weight, maxi-scooter comparisons, rider-reach caveats and low-speed fit context.",
    heading: "Yamaha XMAX seat height and rider-fit context",
    intro: "MotoIndex stores the Yamaha XMAX at 795 mm seat height and 181 kg curb weight. This guide compares those measurements with nearby maxi scooters and separates seat-height data from real rider reach."
  }
];

const byId = new Map(seatHeightIntentLandingProfiles.map((profile) => [profile.modelId, profile]));

export function seatHeightIntentLandingProfile(modelId: string) {
  return byId.get(modelId);
}

export function hasSeatHeightIntentLandingPage(modelId: string) {
  return byId.has(modelId);
}
