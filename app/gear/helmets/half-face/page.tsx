import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { HelmetCategoryView } from "@/components/HelmetCategoryView";
export const metadata: Metadata = pageMetadata({ title: 'Half-Face Helmets Philippines: Prices & Models', description: 'Compare half-face and open-face motorcycle helmets in the Philippines by price, visor, certification and fit.', path: '/gear/helmets/half-face', index: true });
export default function Page(){return <HelmetCategoryView slug='half-face'/>}
