import { notFound, permanentRedirect } from "next/navigation";
import { tireFamilyHubs, tireSizeSeoHubs } from "@/lib/tireSeo";

const chartSlug = "motorcycle-tire-size-chart";

export function generateStaticParams() {
  return [...tireFamilyHubs.map(hub=>({slug:hub.slug})), ...tireSizeSeoHubs.map(hub=>({slug:hub.slug})), {slug:chartSlug}];
}

export default async function ConsolidatedTireGuideRoute({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  if(slug===chartSlug) permanentRedirect("/tires#size-chart");
  if(tireFamilyHubs.some(hub=>hub.slug===slug)) permanentRedirect("/tires#families");
  if(tireSizeSeoHubs.some(hub=>hub.slug===slug)) permanentRedirect("/tires#common-sizes");
  notFound();
}
