import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { HelmetCategoryView } from "@/components/HelmetCategoryView";
export const metadata: Metadata = pageMetadata({ title: 'Modular Helmets Philippines: Prices & Models', description: 'Compare modular motorcycle helmets in the Philippines by price, visor, certification, shell and fit.', path: '/gear/helmets/modular', index: true });
export default function Page(){return <HelmetCategoryView slug='modular'/>}
