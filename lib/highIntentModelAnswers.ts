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
  "rusi-classic-250i": {
    question: "Is the Rusi Classic 250i price dealer-confirmed, and is ABS verified?",
    answer: "MotoIndex's published Classic 250i figure comes from a third-party Philippine price and specification reference, not a current quote from a Rusi selling branch. The source describes a 250cc manual classic-style bike but does not confirm ABS. Check the exact unit's braking hardware, model year, registration and parts support before paying.",
    compareHref: "/motorcycles/motorstar/cafe-400",
    compareLabel: "Compare with MotorStar Cafe 400",
  },
  "yamaha-fazzio": {
    question: "Does the Yamaha Fazzio price cover the latest model or older dealer stock?",
    answer: "The stored current-model Fazzio reference covers a 125cc automatic scooter with a 750 mm seat and 95 kg listed curb weight. Some older Mio Fazzio dealer listings may be for a different model code at a lower price. Verify the exact year, model code, braking equipment and branch cash quote rather than assuming every Fazzio listing is identical.",
    compareHref: "/motorcycles/yamaha/mio-gear",
    compareLabel: "Compare with Mio Gear",
  },
  "yamaha-mio-gear": {
    question: "What should a buyer verify in a Yamaha Mio Gear price or installment quote?",
    answer: "The Mio Gear record covers a 125cc automatic commuter with a 750 mm seat, 14-inch tires and a published Philippine price range, not a binding financing offer. Verify the exact variant, cash price, down payment, loan term, total interest and fees with the dealer. MotoIndex does not list ABS for this model.",
    compareHref: "/motorcycles/yamaha/fazzio",
    compareLabel: "Compare with Fazzio",
  },
  "yamaha-sniper-155": {
    question: "Does every Yamaha Sniper 155 price include ABS?",
    answer: "No single Sniper 155 price represents every braking package. MotoIndex keeps lower and higher Philippine variant price references, and the stored ABS equipment is variant-dependent. The 155cc Sniper is a six-speed manual underbone, not an automatic scooter. Confirm the exact Sniper 155 or R trim, braking hardware and final dealer quote.",
    compareHref: "/motorcycles/suzuki/raider-r150",
    compareLabel: "Compare with Suzuki Raider R150",
  },
};

export function highIntentModelAnswer(modelId: string): HighIntentModelAnswer | undefined {
  return answers[modelId];
}
