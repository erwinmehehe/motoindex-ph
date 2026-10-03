export type SeatHeightIntentLandingProfile = {
  modelId: string;
  keyword: string;
  keywordVolume: number;
  title: string;
  description: string;
  heading: string;
};

export const seatHeightIntentLandingProfiles: SeatHeightIntentLandingProfile[] = [
  {
    modelId: "royal-enfield-shotgun-650",
    keyword: "shotgun 650 seat height",
    keywordVolume: 1200,
    title: "Royal Enfield Shotgun 650 Seat Height Philippines | 795 mm",
    description: "Royal Enfield Shotgun 650 seat height Philippines guide with 795 mm seat, inseam calculator, 240 kg curb-weight context, rider reach and fit-check guidance.",
    heading: "Royal Enfield Shotgun 650 seat height: 795 mm"
  },
  {
    modelId: "honda-click-160",
    keyword: "honda click seat height",
    keywordVolume: 700,
    title: "Honda Click 160 Seat Height Philippines | 778 mm Rider Fit",
    description: "Honda Click 160 seat height Philippines guide with 778 mm seat, inseam calculator, 116 kg curb weight, rider reach context and in-person fit-check guidance.",
    heading: "Honda Click 160 seat height: 778 mm"
  },
  {
    modelId: "yamaha-nmax-v3",
    keyword: "nmax seat height",
    keywordVolume: 600,
    title: "Yamaha NMAX V3 Seat Height Philippines | 770 mm Rider Fit",
    description: "Yamaha NMAX V3 seat height Philippines guide with 770 mm seat, inseam calculator, 131 kg curb weight, rider reach context and real-world fit-check guidance.",
    heading: "Yamaha NMAX V3 seat height: 770 mm"
  },
  {
    modelId: "honda-beat",
    keyword: "honda beat seat height",
    keywordVolume: 500,
    title: "Honda BeAT Seat Height Philippines | 742 mm Rider Fit Guide",
    description: "Honda BeAT seat height Philippines guide with 742 mm seat, inseam calculator, 90 kg curb weight, ground-reach context and practical in-person fit guidance.",
    heading: "Honda BeAT seat height: 742 mm"
  },
  {
    modelId: "honda-cb650r",
    keyword: "cb650r seat height",
    keywordVolume: 350,
    title: "Honda CB650R Seat Height Philippines | 810 mm Rider Fit",
    description: "Honda CB650R seat height Philippines guide with 810 mm seat, inseam calculator, 203 kg curb weight, rider-reach context and real-world fit-check guidance.",
    heading: "Honda CB650R seat height: 810 mm"
  },
  {
    modelId: "yamaha-yzf-r3",
    keyword: "r3 seat height",
    keywordVolume: 300,
    title: "Yamaha R3 Seat Height Philippines | 780 mm Rider Fit Guide",
    description: "Yamaha YZF-R3 seat height Philippines guide with 780 mm seat, inseam calculator, 169 kg curb weight, rider reach context and in-person fit-check guidance.",
    heading: "Yamaha YZF-R3 seat height: 780 mm"
  },
  {
    modelId: "yamaha-mio-i-125",
    keyword: "mio i 125 seat height",
    keywordVolume: 200,
    title: "Yamaha Mio i 125 Seat Height Philippines | 750 mm Rider Fit",
    description: "Yamaha Mio i 125 seat height Philippines guide with 750 mm seat, inseam calculator, 92 kg curb weight, rider reach context and practical fit-check guidance.",
    heading: "Yamaha Mio i 125 seat height: 750 mm"
  },
  {
    modelId: "yamaha-xmax",
    keyword: "xmax seat height",
    keywordVolume: 150,
    title: "Yamaha XMAX Seat Height Philippines | 795 mm Rider Fit Guide",
    description: "Yamaha XMAX seat height Philippines guide with 795 mm seat, inseam calculator, 181 kg curb weight, rider reach context and real-world fit-check guidance.",
    heading: "Yamaha XMAX seat height: 795 mm"
  },
  {
    modelId: "yamaha-mt-15",
    keyword: "mt 15 seat height",
    keywordVolume: 150,
    title: "Yamaha MT-15 Seat Height Philippines | 810 mm Rider Fit",
    description: "Yamaha MT-15 seat height Philippines guide with 810 mm seat, inseam calculator, 133 kg curb weight, availability caveat, rider reach and fit-check guidance.",
    heading: "Yamaha MT-15 seat height: 810 mm"
  },
  {
    modelId: "kawasaki-z1000-r-edition",
    keyword: "z1000 seat height",
    keywordVolume: 150,
    title: "Kawasaki Z1000 Seat Height Philippines | 815 mm Rider Fit",
    description: "Kawasaki Z1000 seat height Philippines guide with 815 mm seat, inseam calculator, 221 kg curb weight, previous-model context, rider reach and fit guidance.",
    heading: "Kawasaki Z1000 seat height: 815 mm"
  },
  {
    modelId: "kawasaki-ninja-650",
    keyword: "ninja 650 seat height",
    keywordVolume: 100,
    title: "Kawasaki Ninja 650 Seat Height Philippines | 790 mm Guide",
    description: "Kawasaki Ninja 650 seat height Philippines guide with 790 mm seat, inseam calculator, curb-weight context, rider reach, low-speed balance and fit guidance.",
    heading: "Kawasaki Ninja 650 seat height: 790 mm"
  }
];

const byId = new Map(seatHeightIntentLandingProfiles.map((profile) => [profile.modelId, profile]));

export function seatHeightIntentLandingProfile(modelId: string) {
  return byId.get(modelId);
}

export function hasSeatHeightIntentLandingPage(modelId: string) {
  return byId.has(modelId);
}
