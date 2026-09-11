import type { Metadata } from "next";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";
import { ThreeCompareClient } from "@/components/ThreeCompareClient";

export const metadata:Metadata=pageMetadata({title:"Compare 3 Motorcycles Philippines",description:"Compare three current Philippine motorcycles side by side for checked prices, variants, engine, dimensions, fuel, tires and braking.",path:"/compare/three",index:false});

export default function ThreeComparePage(){return <section className="page shell"><div className="page-head"><h1>Compare three motorcycles</h1><p>Keep the selected motorcycles and their images visible, then scan grouped price, engine, fit, fuel and braking differences below.</p></div><ThreeCompareClient models={forClient(publicMotorcycles)}/></section>}
