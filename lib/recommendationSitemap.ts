import { getRecommendationModels, isIndexableRecommendation, recommendationGuides } from "@/lib/data";
import { RELEASE_DATE, SITE_URL } from "@/lib/site";

const newest = (dates: string[]) => [...dates].filter(Boolean).sort().at(-1) || RELEASE_DATE;

export function recommendationSitemapEntries() {
  return recommendationGuides
    .filter((guide) => isIndexableRecommendation(guide.slug))
    .map((guide) => {
      const models = getRecommendationModels(guide.slug);
      const lastModified = newest(models.map((model) => model.marketPriceCheckedAt || model.verifiedAt));
      return {
        url: `${SITE_URL}/recommendations/${guide.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.72
      };
    });
}
