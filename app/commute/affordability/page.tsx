import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { AffordabilityCalculator } from "@/components/AffordabilityCalculator";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata:Metadata=pageMetadata({title:"Motorcycle Affordability Calculator Philippines",description:"Set your own monthly motorcycle budget, running-cost reserve, down payment, APR and loan term to estimate a purchase-price ceiling.",path:"/commute/affordability",index:true});
export default function Page(){return <section className="page shell"><Breadcrumbs items={[{label:"Commuting",href:"/commute"},{label:"Affordability"}]}/><div className="page-head"><h1>How much motorcycle fits your monthly budget?</h1><p>Instead of guessing from sticker price, reserve part of your chosen monthly cap for fuel and running costs before calculating a financing ceiling.</p></div><AffordabilityCalculator models={publicMotorcycles}/></section>}
