import type { Metadata } from "next";
import { HelmetSeoCollectionPage } from "@/components/HelmetSeoCollectionPage";
import { getHelmetSeoCollection } from "@/lib/helmetSeoCollections";
import { pageMetadata } from "@/lib/site";

const collection=getHelmetSeoCollection("under-3000")!;
export const metadata:Metadata=pageMetadata({title:collection.seoTitle,description:collection.description,path:"/gear/helmets/under-3000",index:true});
export default function Page(){return <HelmetSeoCollectionPage slug="under-3000"/>;}
