import type { Metadata } from "next";
import { HelmetCategoryView } from "@/components/HelmetCategoryView";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title:"Modular Helmets Philippines 2026: Flip-Up Prices & Models",
  description:"Compare modular and flip-up motorcycle helmets in the Philippines by price, chin-bar design, visor setup, sizing, intercom provision and certification.",
  path:"/gear/helmets/modular",
  index:true
});

export default function ModularHelmetPage(){return <HelmetCategoryView slug="modular"/>;}
