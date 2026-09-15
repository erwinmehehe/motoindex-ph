import { getIndexableRecommendationGuides } from "@/lib/data";
import { RELEASE_DATE, SITE_URL } from "@/lib/site";

export function recommendationSitemapEntries() {
  return getIndexableRecommendationGuides().map((guide) => ({
    url: `${SITE_URL}/recommendations/${guide.slug}`,
    lastModified: RELEASE_DATE,
    changeFrequency: "monthly" as const,
    priority: 0.72
  }));
}
