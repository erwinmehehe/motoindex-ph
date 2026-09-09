import { permanentRedirect } from "next/navigation";
import { helmetSeoComparisons } from "@/lib/helmetSeoComparisons";

export function generateStaticParams(){return helmetSeoComparisons.map(comparison=>({slug:comparison.slug}));}

export default async function ConsolidatedHelmetComparisonRoute({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  if(slug==="full-face-vs-modular") permanentRedirect("/gear/helmets#full-face");
  permanentRedirect("/gear/helmets/compare");
}
