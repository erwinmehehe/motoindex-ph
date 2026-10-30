import type { EditorialGuide } from "./editorialGuides";
import { skywayGuide } from "./transportWave2/skyway";
import { slexGuide } from "./transportWave2/slex";
import { nlexGuide } from "./transportWave2/nlex";
import { lrt1Guide } from "./transportWave2/lrt1";
import { edsaGuide } from "./transportWave2/edsa";
import { codingGuide } from "./transportWave2/coding";

/** Source-checked October 2026 guides, with historic fares labeled by effective date. */
export const transportGuidesWave2: EditorialGuide[] = [
  skywayGuide, slexGuide, nlexGuide, lrt1Guide, edsaGuide, codingGuide
];
