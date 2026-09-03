import type { TopBoxFitment } from "./types";

// Manufacturer fitment records checked 2026-08-25. These edges are deliberately
// product + motorcycle specific; capacity heuristics are not treated as fitment.
export const topBoxFitments: TopBoxFitment[] = [
  {
    id: "sh39-aerox-155",
    topBoxId: "shad-sh39",
    topBoxLabel: "SHAD SH39",
    productHref: "/accessories/top-box/sh39",
    modelId: "yamaha-aerox-v3",
    rackCode: "Y0AE14IST",
    rackLabel: "SHAD Top Master Yamaha Aerox",
    plateRequirement: "Use the plate included with the SH39 on the bike-specific Top Master fitting.",
    modelYears: "Aerox 155: 2021-2026; Aerox Alpha: 2024-2026",
    status: "verified",
    sourceLabel: "SHAD official Yamaha Aerox fitment page",
    sourceUrl: "https://www.shad.es/tl/fitting-kits-for-cases-bags-and-moto-backrests/yamaha/top-master-yamaha-aerox/",
    lastChecked: "2026-08-25"
  },
  {
    id: "sh39-adv160",
    topBoxId: "shad-sh39",
    topBoxLabel: "SHAD SH39",
    productHref: "/accessories/top-box/sh39",
    modelId: "honda-adv-160",
    rackCode: "H0XD12IST",
    rackLabel: "SHAD Top Master Honda ADV 160",
    plateRequirement: "Use the plate included with the SH39 on the bike-specific Top Master fitting.",
    modelYears: "2022-2026",
    status: "verified",
    sourceLabel: "SHAD official Honda ADV 160 fitment page",
    sourceUrl: "https://www.shad.es/tl/fitting-kits-for-cases-bags-and-moto-backrests/honda/top-master-honda-adv-160/",
    lastChecked: "2026-08-25"
  },
  {
    id: "sh39-click160",
    topBoxId: "shad-sh39",
    topBoxLabel: "SHAD SH39",
    productHref: "/accessories/top-box/sh39",
    modelId: "honda-click-160",
    rackCode: "H0VR15IST",
    rackLabel: "SHAD top-case fitting kit Honda Click 125/150/160",
    plateRequirement: "Use the plate included with the SH39 on the bike-specific fitting kit.",
    modelYears: "Click/Vario 160: 2022-2026",
    marketNote: "SHAD catalogs the same platform as Click/Vario 160 by market; confirm the local model-year before ordering.",
    status: "verified",
    sourceLabel: "SHAD official Honda fitment catalog",
    sourceUrl: "https://www.shad.es/tl/for-your-motorbike/HONDA/",
    lastChecked: "2026-08-25"
  },
  {
    id: "sh39-pcx160",
    topBoxId: "shad-sh39",
    topBoxLabel: "SHAD SH39",
    productHref: "/accessories/top-box/sh39",
    modelId: "honda-pcx-160",
    rackCode: "H0IPC11ST",
    rackLabel: "SHAD Top Master Honda PCX",
    plateRequirement: "Use the plate included with the SH39 on the bike-specific Top Master fitting.",
    modelYears: "PCX: 2010-2026",
    marketNote: "SHAD lists the PCX family rather than a Philippines-specific PCX 160 trim; verify the exact year before ordering.",
    status: "verified",
    sourceLabel: "SHAD official Honda PCX fitment page",
    sourceUrl: "https://www.shad.es/en-id/fitting-kits-for-cases-bags-and-moto-backrests/honda-fitting-kits-for-cases-bags-and-moto-backrests/top-master-honda-pcx/",
    lastChecked: "2026-08-25"
  },
  {
    id: "sh39-nmax-v3",
    topBoxId: "shad-sh39",
    topBoxLabel: "SHAD SH39",
    productHref: "/accessories/top-box/sh39",
    modelId: "yamaha-nmax-v3",
    rackCode: "Y0NM14IST",
    rackLabel: "SHAD Top Master Yamaha NMAX Turbo / Neo",
    plateRequirement: "Use the plate included with the SH39 on the bike-specific Top Master fitting.",
    modelYears: "2025-2026",
    marketNote: "The 2025-2026 SHAD catalog names NMAX Turbo / Neo. Confirm that the rack code matches the exact Philippine NMAX variant before purchase.",
    status: "research",
    sourceLabel: "SHAD official Yamaha top-case fitment catalog",
    sourceUrl: "https://www.shad.es/tl/for-your-motorbike/types/Maleta-superior-%28ST%29/YAMAHA/",
    lastChecked: "2026-08-25"
  }
];

export function getTopBoxFitmentsForProduct(topBoxId: string) {
  return topBoxFitments.filter((fitment) => fitment.topBoxId === topBoxId);
}

export function getTopBoxFitmentsForModel(modelId: string) {
  return topBoxFitments.filter((fitment) => fitment.modelId === modelId);
}
