import type { EditorialGuide } from "./editorialGuides";
import { calaxGuide } from "./transportWave3/calax";
import { autosweepBalanceGuide } from "./transportWave3/autosweepBalance";
import { connectorGuide } from "./transportWave3/connector";
import { tplexGuide } from "./transportWave3/tplex";
import { sctexGuide } from "./transportWave3/sctex";
import { lostLicenseGuide } from "./transportWave3/lostLicense";

/** Third keyword-gap wave. Each source, fee and operational status is date labeled. */
export const transportGuidesWave3: EditorialGuide[] = [
  calaxGuide, autosweepBalanceGuide, connectorGuide,
  tplexGuide, sctexGuide, lostLicenseGuide
];
