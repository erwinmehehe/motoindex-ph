import type { Metadata } from "next";
import { HelmetCategoryView } from "@/components/HelmetCategoryView";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title:"Adventure & Dual-Sport Helmets Philippines 2026",
  description:"Compare adventure and dual-sport motorcycle helmets in the Philippines by price, visor and peak setup, shell, goggle compatibility and certification.",
  path:"/gear/helmets/adventure",
  index:true
});

export default function AdventureHelmetPage(){return <HelmetCategoryView slug="adventure"/>;}
