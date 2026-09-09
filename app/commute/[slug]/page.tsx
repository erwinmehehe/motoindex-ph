import { permanentRedirect } from "next/navigation";
import { commuteGuides } from "@/lib/commute";

export function generateStaticParams(){return commuteGuides.map(g=>({slug:g.slug}));}

export default async function ConsolidatedCommuteRoute({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  permanentRedirect(`/commute#${slug}`);
}
