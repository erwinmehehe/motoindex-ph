import type { Metadata } from "next";
import { HelmetCategoryView } from "@/components/HelmetCategoryView";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title:"Motocross & Off-Road Helmets Philippines 2026",
  description:"Compare motocross and off-road motorcycle helmets in the Philippines by price, shell weight, goggle opening, peak, ventilation and certification.",
  path:"/gear/helmets/off-road",
  index:true
});

export default function OffRoadHelmetPage(){return <HelmetCategoryView slug="off-road"/>;}
