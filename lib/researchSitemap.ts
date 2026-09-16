import { SITE_URL } from "./site";
import { latestResearchCheck } from "./researchData";

export function researchSitemapEntries() {
  const lastModified = latestResearchCheck();
  return [
    { url: `${SITE_URL}/research`, lastModified, changeFrequency: "monthly" as const, priority: .8 },
    { url: `${SITE_URL}/research/motorcycle-price-index-philippines`, lastModified, changeFrequency: "monthly" as const, priority: .84 },
    { url: `${SITE_URL}/research/motorcycle-seat-height-database`, lastModified, changeFrequency: "monthly" as const, priority: .82 },
    { url: `${SITE_URL}/research/motorcycle-financing-index-philippines`, lastModified, changeFrequency: "monthly" as const, priority: .84 },
  ];
}
