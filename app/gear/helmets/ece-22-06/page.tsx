import type { Metadata } from "next";
import { HelmetSeoCollectionPage } from "@/components/HelmetSeoCollectionPage";
import { getHelmetSeoCollection } from "@/lib/helmetSeoCollections";
import { pageMetadata } from "@/lib/site";

const collection=getHelmetSeoCollection("ece-22-06")!;
export const metadata:Metadata=pageMetadata({title:collection.seoTitle,description:collection.description,path:"/gear/helmets/ece-22-06",index:true});
export default function Page(){return <HelmetSeoCollectionPage slug="ece-22-06"/>;}
