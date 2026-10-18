/**
 * High-impression, source-scoped model answers.
 * Dates and price figures are deliberately supplied from model evidence,
 * rather than hardcoded into these editorial distinctions.
 */
export type HighIntentModelAnswer = {
  question: string;
  answer: string;
  compareHref: string;
  compareLabel: string;
};

const answers: Record<string, HighIntentModelAnswer> = {
  "yamaha-aerox-v3": {
    question: "Does this Aerox V3 price cover Standard and SP?",
    answer: "The published range includes the lower-priced Standard and higher-spec SP. Yamaha associates the SP with YECVT; ABS and traction-control claims also need checking against the exact local trim. The configurations do not necessarily share identical equipment.",
    compareHref: "/motorcycles/yamaha/nmax-v3",
    compareLabel: "Compare with NMAX V3",
  },
  "yamaha-nmax-v3": {
    question: "What changes between NMAX V3 and Tech Max?",
    answer: "The published range covers the regular NMAX and the higher-priced Tech Max. Yamaha identifies Tech Max as the YECVT-equipped configuration. Check the exact trim, equipment and branch cash quote before comparing the price difference.",
    compareHref: "/motorcycles/yamaha/aerox-v3",
    compareLabel: "Compare with Aerox V3",
  },
  "honda-adv-160": {
    question: "Which ADV160 variant does this price cover?",
    answer: "ABS and RoadSync configurations have different published prices and equipment. Confirm the exact model year, braking and connectivity features on the dealer unit instead of applying one trim's specification to every ADV160.",
    compareHref: "/motorcycles/honda/pcx-160",
    compareLabel: "Compare with PCX160",
  },
  "honda-click-160": {
    question: "What should I confirm before buying the Click160?",
    answer: "Start with the 157cc Click160's published Philippine price and the exact dealer unit. Check braking equipment, the final cash price, registration and financing; do not transfer Click 125 equipment or pricing to this model.",
    compareHref: "/motorcycles/honda/adv-160",
    compareLabel: "Compare with ADV160",
  },
};

export function highIntentModelAnswer(modelId: string): HighIntentModelAnswer | undefined {
  return answers[modelId];
}
