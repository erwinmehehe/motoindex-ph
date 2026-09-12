import { permanentRedirect } from "next/navigation";
import { recommendationGuides } from "@/lib/data";
import { recommendationCanonicalHref } from "@/lib/recommendationRoutes";

export function generateStaticParams(){return recommendationGuides.map(g=>({slug:g.slug}));}

export default async function ConsolidatedRecommendationRoute({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  permanentRedirect(recommendationCanonicalHref(slug));
}
