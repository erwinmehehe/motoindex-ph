import { permanentRedirect } from "next/navigation";
import { maintenanceSeoTopics } from "@/lib/maintenanceSeo";

export function generateStaticParams(){return maintenanceSeoTopics.map(topic=>({slug:topic.slug}));}

export default async function ConsolidatedMaintenanceRoute({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  permanentRedirect(`/maintenance#${slug}`);
}
