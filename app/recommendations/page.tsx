import type { Metadata } from "next";
import RecommendationsHub from "./RecommendationsHub";
import { RecommendationGuideArchive } from "./RecommendationGuideArchive";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Best Motorcycles Philippines 2026: Buying Guide",
  description: "Choose a motorcycle in the Philippines by budget, riding use, rider fit, ABS, fuel economy and long-distance needs using verified model data.",
  path: "/recommendations",
  index: true
});

export default function RecommendationsPage() {
  return <>
    <RecommendationsHub />
    <RecommendationGuideArchive />
  </>;
}
