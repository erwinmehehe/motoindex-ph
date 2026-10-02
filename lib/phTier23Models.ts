import { phTier23Motorcycles as baseMotorcycles } from "./phTier23ModelsBase";
import { phTier23Expansion2026 } from "./phTier23ModelsExpansion2026";
import { phBrandExpansion2026 } from "./phBrandExpansion2026";
import { phCoverageExpansion2026 } from "./phCoverageExpansion2026";
import { globalDemandExpansion2026 } from "./globalDemandExpansion2026";
import { kawasakiBigBikeExpansion2026 } from "./kawasakiBigBikeExpansion2026";
import { motortradeGapExpansion2026 } from "./motortradeGapExpansion2026";
import { zigwheelsGapExpansion2026 } from "./zigwheelsGapExpansion2026";
import { zigwheelsGapWave2_2026 } from "./zigwheelsGapWave2_2026";
import { zigwheelsGapWave3_2026 } from "./zigwheelsGapWave3_2026";
import { zigwheelsGapWave4_2026 } from "./zigwheelsGapWave4_2026";

export const phTier23Motorcycles = [
  ...baseMotorcycles,
  ...phTier23Expansion2026,
  ...phBrandExpansion2026,
  ...phCoverageExpansion2026,
  ...globalDemandExpansion2026,
  ...kawasakiBigBikeExpansion2026,
  ...motortradeGapExpansion2026,
  ...zigwheelsGapExpansion2026,
  ...zigwheelsGapWave2_2026,
  ...zigwheelsGapWave3_2026,
  ...zigwheelsGapWave4_2026,
];
