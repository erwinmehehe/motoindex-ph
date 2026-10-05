import type { Metadata } from "next";
import { HelmetCategoryView } from "@/components/HelmetCategoryView";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title:"Full-Face Helmets Philippines 2026: Prices & Models",
  description:"Compare full-face motorcycle helmets in the Philippines by price, shell, visor, anti-fog setup, sizing and certification evidence.",
  path:"/gear/helmets/full-face",
  index:true
});

export default function FullFaceHelmetPage(){return <HelmetCategoryView slug="full-face"/>;}
