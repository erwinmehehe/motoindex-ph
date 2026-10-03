export type InstallmentLandingProfile = {
  modelId: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
};

export const installmentLandingProfiles: InstallmentLandingProfile[] = [
  {
    modelId: "honda-click-125i",
    title: "Honda Click 125i Installment Philippines | Downpayment 2026",
    description: "Honda Click 125i installment Philippines guide with current price, dealer downpayment/monthly snapshot, editable loan calculator, variants and finance caveats.",
    heading: "Honda Click 125i installment and downpayment Philippines",
    intro: "Use the current Click 125i price and verified variants as the starting point, then compare published dealer financing with an editable MotoIndex estimate. Dealer downpayment, term, fees and approval rules can differ by branch and lender."
  },
  {
    modelId: "honda-click-160",
    title: "Honda Click 160 Installment Philippines | Downpayment 2026",
    description: "Honda Click 160 installment Philippines guide with current price, editable downpayment/monthly calculator, dealer SRP snapshot, loan scenarios and caveats.",
    heading: "Honda Click 160 installment and downpayment Philippines",
    intro: "Model the Click 160 using the current price reference, then replace MotoIndex assumptions with the dealer's actual cash price, downpayment, term, rate method and fees. The checked dealer page currently exposes SRP but not a complete financing card."
  },
  {
    modelId: "honda-pcx-160",
    title: "Honda PCX 160 Installment Philippines | Downpayment 2026",
    description: "Honda PCX 160 installment Philippines guide with CBS/ABS dealer snapshots, current variant prices, editable monthly calculator and clear financing caveats.",
    heading: "Honda PCX 160 installment and downpayment Philippines",
    intro: "Compare the current PCX 160 variant prices with dated CBS/ABS dealer financing observations, then test your own downpayment, term and annual rate. Dealer trim naming and financing assumptions must be confirmed before purchase."
  },
  {
    modelId: "yamaha-nmax-v3",
    title: "Yamaha NMAX V3 Installment Philippines | Downpayment 2026",
    description: "Yamaha NMAX V3 installment Philippines guide with Standard/Tech Max dealer snapshots, variant prices, editable downpayment/monthly calculator and loan caveats.",
    heading: "Yamaha NMAX V3 installment and downpayment Philippines",
    intro: "Compare Standard and Tech Max pricing with the dated Motortrade financing cards, then use the calculator for your own downpayment and term. Published monthly amounts are dealer observations, not transferable loan offers."
  },
  {
    modelId: "yamaha-mio-gear",
    title: "Yamaha Mio Gear Installment Philippines | Downpayment 2026",
    description: "Yamaha Mio Gear installment Philippines guide with current dealer downpayment/monthly snapshot, editable loan calculator, price range and financing caveats.",
    heading: "Yamaha Mio Gear installment and downpayment Philippines",
    intro: "Start with the current Mio Gear price range and checked dealer financing card, then adjust the calculator to the exact branch cash price, downpayment, term and rate. MotoIndex keeps dealer observations separate from planning estimates."
  },
  {
    modelId: "yamaha-aerox-v3",
    title: "Yamaha Aerox V3 Installment Philippines | Downpayment 2026",
    description: "Yamaha Aerox V3 installment Philippines guide with Standard/SP prices, dealer SRP snapshots, editable downpayment/monthly calculator and financing caveats.",
    heading: "Yamaha Aerox V3 installment and downpayment Philippines",
    intro: "Compare the current Aerox Standard and SP prices, then model the downpayment and monthly payment for the exact variant. Current dealer pages expose SRP but no complete financing card, so MotoIndex does not invent a dealer monthly amount."
  }
];

const byId = new Map(installmentLandingProfiles.map((profile) => [profile.modelId, profile]));

export function installmentLandingProfile(modelId: string) {
  return byId.get(modelId);
}

export function hasInstallmentLandingPage(modelId: string) {
  return byId.has(modelId);
}
