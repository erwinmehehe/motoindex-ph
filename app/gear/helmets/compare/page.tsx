import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { helmetProducts } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HelmetCompareClient } from "@/components/HelmetCompareClient";
import { forClient } from "@/lib/competitors";

export const metadata:Metadata=pageMetadata({title:"Compare Motorcycle Helmets Philippines: Side by Side",description:"Compare motorcycle helmet prices, sizing, shell construction, visor equipment, certification and intercom provision side by side.",path:"/gear/helmets/compare",index:true});

export default function HelmetComparePage(){
  const products=helmetProducts.filter(p=>p.status==="verified");
  return <section className="page shell"><Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:"Compare"}]}/><div className="page-head"><h1>Compare checked helmets side by side</h1><p>Choose two or three verified products. The comparison keeps the selected helmet images visible and groups the checked price, fit, construction, visor and certification data for faster scanning.</p></div><HelmetCompareClient products={forClient(products)}/></section>;
}
