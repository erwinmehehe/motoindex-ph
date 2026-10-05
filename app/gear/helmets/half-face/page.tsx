import type { Metadata } from "next";
import { HelmetCategoryView } from "@/components/HelmetCategoryView";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title:"Half-Face Helmets Philippines 2026: Prices & Models",
  description:"Compare half-face motorcycle helmets in the Philippines by price, visor setup, fit, shell details and model-specific certification evidence.",
  path:"/gear/helmets/half-face",
  index:true
});

export default function HalfFaceHelmetPage(){return <HelmetCategoryView slug="half-face"/>;}
