import type { HelmetProduct } from "./types";

export type HelmetCertificationEvidence = {
  certification: string;
  sourceLabel: string;
  sourceUrl: string;
  checkedAt: string;
  note: string;
};

const checkedAt = "2026-10-05";

const evidenceByProductId: Record<string, HelmetCertificationEvidence> = {
  "nolan-x-804rs-ultra-carbon": {
    certification: "UNECE R 22-06",
    sourceLabel: "Nolan official X-804 RS Ultra Carbon approval",
    sourceUrl: "https://nolan-helmets.com/en/products/x-804-rs-ultra-carbon-pure-black",
    checkedAt,
    note: "Nolan explicitly lists UNECE R 22-06 approval for the X-804 RS Ultra Carbon on its current official product page.",
  },
  "nolan-x-552-ultra-carbon": {
    certification: "ECE 22.06 / P homologation",
    sourceLabel: "Motoblouz exact X-552 Ultra Carbon certification listing",
    sourceUrl: "https://www.motoblouz.es/casco-integral-nolan-x-552-ultra-carbon-triplonero-265920-v.html",
    checkedAt,
    note: "The current exact-model specialist retailer listing states ECE 22.06 homologation for the Nolan X-552 Ultra Carbon; Nolan continues to publish current technical sheets for this model.",
  },
  "evo-gt-sport": {
    certification: "ECE certified / ICC certified",
    sourceLabel: "EVO Helmets official GT-Sport certification",
    sourceUrl: "https://evohelmet.com/product/gt-sport-mono-colors/",
    checkedAt,
    note: "EVO Helmets explicitly lists ECE and ICC certification for the GT-Sport mono-color product family.",
  },
  "evo-gx-1": {
    certification: "ECE certified / ICC certified",
    sourceLabel: "EVO Helmets official GX-1 certification",
    sourceUrl: "https://evohelmet.com/product/gx-1-mono-colors/",
    checkedAt,
    note: "EVO Helmets explicitly lists ECE certification and ICC certification for the GX-1 mono-color product family.",
  },
  "nolan-n120-1": {
    certification: "UNECE R 22-06 / P/J homologation",
    sourceLabel: "Nolan official N120-1 certification",
    sourceUrl: "https://nolan-helmets.com/en/products/n120-1-classic-black-glossy",
    checkedAt,
    note: "Nolan lists UNECE R 22-06 approval and P/J homologation for the N120-1 on its current official product page.",
  },
  "scorpion-exo-r1-air-carbon": {
    certification: "DOT FMVSS No. 218 certified / ECE 22.06 approved",
    sourceLabel: "ScorpionEXO official EXO-R1 Air Carbon certification",
    sourceUrl: "https://scorpionexo.com/na/product/exo-r1-air-carbon/",
    checkedAt,
    note: "ScorpionEXO explicitly lists DOT FMVSS No. 218 certification and ECE 22.06 approval for the EXO-R1 Air Carbon.",
  },
  "scorpion-exo-adf-9000-air": {
    certification: "ECE R22.06 certified",
    sourceLabel: "ScorpionEXO official ADF-9000 Air safety specification",
    sourceUrl: "https://scorpionexo.com/eu/product/adf-9000-air-solid/",
    checkedAt,
    note: "ScorpionEXO explicitly lists ECE R22.06 certification for the ADF-9000 Air family.",
  },
  "scorpion-exo-covert-fx": {
    certification: "DOT FMVSS No. 218 certified / ECE 22.06 approved",
    sourceLabel: "ScorpionEXO official Covert FX certification",
    sourceUrl: "https://scorpionexo.com/na/product/covert-fx-solid/",
    checkedAt,
    note: "ScorpionEXO explicitly lists DOT FMVSS No. 218 certification and ECE 22.06 approval for the Covert FX.",
  },
  "scorpion-covert-2": {
    certification: "DOT FMVSS No. 218 certified",
    sourceLabel: "ScorpionEXO official Covert 2 certification",
    sourceUrl: "https://scorpionexo.com/na/product/covert-2-solid/",
    checkedAt,
    note: "ScorpionEXO explicitly lists DOT FMVSS No. 218 certification for the Covert 2.",
  },
  "ryo-rf-4sv": {
    certification: "DOT certified / ECE 22.06 / ICC sticker",
    sourceLabel: "Motoworld Philippines RYO RF-4SV certification listing",
    sourceUrl: "https://www.motoworld.com.ph/products/ryo-rf-4sv-motorcycle-full-face-helmet",
    checkedAt,
    note: "The current Philippine retailer listing explicitly states DOT, ECE 22.06 and ICC sticker for the RF-4SV.",
  },
};

export function getVerifiedHelmetCertification(product: HelmetProduct): HelmetCertificationEvidence | undefined {
  if (product.certification?.trim()) return undefined;
  return evidenceByProductId[product.id];
}

export function effectiveHelmetCertification(product: HelmetProduct) {
  return product.certification || getVerifiedHelmetCertification(product)?.certification;
}
