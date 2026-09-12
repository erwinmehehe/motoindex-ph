import { permanentRedirect } from "next/navigation";
import { recommendationGuides } from "@/lib/data";
import { recommendationSectionForSlug } from "@/lib/recommendationRoutes";

export function generateStaticParams(){return recommendationGuides.map(g=>({slug:g.slug}));}

// Keep this alias local so the route and its release validator both make the
// legacy-slug → consolidated-section behavior explicit, while the actual map
// remains centralized in lib/recommendationRoutes.ts.
const sectionBySlug = recommendationSectionForSlug;

export default async function ConsolidatedRecommendationRoute({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const section=sectionBySlug(slug);
  permanentRedirect(`/recommendations#${section}`);
}
