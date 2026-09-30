import type { Metadata } from "next";
import RecommendationsHub from "./RecommendationsHub";
import { RecommendationGuideArchive } from "./RecommendationGuideArchive";
import { RecommendationsHubStyle } from "./RecommendationsHubStyle";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Buying Guides Philippines 2026 | MotoIndex PH",
  description: "Browse focused Philippine motorcycle buying guides by budget, scooter class, engine size, rider fit, commuting, ABS, fuel economy and brand.",
  path: "/recommendations",
  index: true
});

export default function RecommendationsPage() {
  return <>
    <RecommendationsHubStyle />
    <RecommendationsHub />
    <RecommendationGuideArchive />
  </>;
}
