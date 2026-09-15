import { isIndexableRecommendation, recommendationGuides } from "@/lib/data";
import { RELEASE_DATE, SITE_URL } from "@/lib/site";

export function recommendationSitemapEntries() {
  return recommendationGuides
    .filter((guide) => isIndexableRecommendation(guide.slug))
    .map((guide) => ({
      url: `${SITE_URL}/recommendations/${guide.slug}`,
      lastModified: RELEASE_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.72
    }));
}
