import type { Metadata } from "next";
import { HelmetSeoCollectionPage } from "@/components/HelmetSeoCollectionPage";
import { getHelmetSeoCollection } from "@/lib/helmetSeoCollections";
import { pageMetadata } from "@/lib/site";

const collection=getHelmetSeoCollection("intercom-ready")!;
export const metadata:Metadata=pageMetadata({title:collection.seoTitle,description:collection.description,path:"/gear/helmets/intercom-ready",index:true});
export default function Page(){return <HelmetSeoCollectionPage slug="intercom-ready"/>;}
