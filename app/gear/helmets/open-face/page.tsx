import type { Metadata } from "next";
import { HelmetCategoryView } from "@/components/HelmetCategoryView";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title:"Open-Face Helmets Philippines 2026: Jet Helmet Prices",
  description:"Compare open-face and jet motorcycle helmets in the Philippines by price, visor coverage, sun visor, sizing, shell and certification evidence.",
  path:"/gear/helmets/open-face",
  index:true
});

export default function OpenFaceHelmetPage(){return <HelmetCategoryView slug="open-face"/>;}
