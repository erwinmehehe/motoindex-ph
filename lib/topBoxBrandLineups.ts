export type TopBoxBrandLineup = {
  brand: string;
  slug: string;
  status: "verified-catalog" | "research";
  sourceLabel: string;
  sourceUrl?: string;
  checkedAt: string;
  families: string[];
  note: string;
};

// A research family here does NOT create a product entity page. Canonical product
// pages are only created after the model/SKU and enough product details are stable.
export const topBoxBrandLineups: TopBoxBrandLineup[] = [
  { brand:"Coocase", slug:"coocase", status:"verified-catalog", sourceLabel:"COOCASE current catalogue + European model/configuration reference", sourceUrl:"https://www.coocase.com/wp-content/uploads/2026/03/19c89da2d43ee1c6491_compressed.pdf", checkedAt:"2026-08-26", families:["S28 Vivo","S29 Focus","S48 Astra","V28 Fusion","V36 Wizard","V50 Reflex"], note:"Basic / BS / LL are configurations under the same canonical model, not separate product pages." },
  { brand:"Duhan", slug:"duhan", status:"research", sourceLabel:"MotoIndex taxonomy research queue", checkedAt:"2026-08-26", families:["3X 45L ABS","V8 45L ABS","Triple X 45L Alloy","V8 45L Alloy","Alloy 22L","Alloy 35L","Alloy 45L","Alloy 55L","Alloy 65L"], note:"Marketplace naming is inconsistent. MotoIndex will not publish canonical Duhan model pages until the manufacturer/model/SKU identity and mounting bundle are stable." },
  { brand:"Motowolf", slug:"motowolf", status:"research", sourceLabel:"MotoIndex taxonomy research queue", checkedAt:"2026-08-26", families:["Aluminum 35L","Aluminum 45L","Aluminum 50L"], note:"Use capacity-based entities only after a stable manufacturer SKU or model identity is verified; do not invent model numbers from seller titles." },
  { brand:"Surfy", slug:"surfy", status:"research", sourceLabel:"MotoIndex Philippine-market research queue", checkedAt:"2026-08-26", families:["Alloy Top Box"], note:"Keep Surfy as research/noindex until a stable model/SKU taxonomy and source-backed product specifications are available." }
];
