import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { HelmetCategoryView } from "@/components/HelmetCategoryView";
export const metadata: Metadata = pageMetadata({ title: 'Full-Face Helmets Philippines: Prices & Models', description: 'Compare full-face motorcycle helmets in the Philippines by price, shell, visor, certification and fit.', path: '/gear/helmets/full-face', index: true });
export default function Page(){return <HelmetCategoryView slug='full-face'/>}
