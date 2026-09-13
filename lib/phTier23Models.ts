import { phTier23Motorcycles as baseMotorcycles } from "./phTier23ModelsBase";
import { phTier23Expansion2026 } from "./phTier23ModelsExpansion2026";
import { phBrandExpansion2026 } from "./phBrandExpansion2026";
import { phCoverageExpansion2026 } from "./phCoverageExpansion2026";

export const phTier23Motorcycles = [
  ...baseMotorcycles,
  ...phTier23Expansion2026,
  ...phBrandExpansion2026,
  ...phCoverageExpansion2026,
];
