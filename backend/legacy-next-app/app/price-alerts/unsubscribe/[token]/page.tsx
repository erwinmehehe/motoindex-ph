import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { databaseConfigured, prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";
import { PriceAlertAction } from "@/components/PriceAlertAction";

export const metadata:Metadata={title:"Unsubscribe Price Alert",robots:{index:false,follow:false,noarchive:true}};
export const dynamic="force-dynamic";

export default async function UnsubscribePriceAlertPage({params}:{params:Promise<{token:string}>}){
  if(!databaseConfigured())return notFound();
  const {token}=await params;
  const subscription=await prisma.priceAlertSubscription.findUnique({where:{unsubscribeToken:token}});
  if(!subscription)return notFound();
  const model=getModelById(subscription.entityId);

  return <section className="page shell">
    <div className="page-head"><span className="entity-kicker">Price alert</span><h1>Stop {model?`${model.make} ${model.model}`:"this"} price alert</h1><p>This action stops future threshold notifications for this subscription.</p></div>
    {subscription.status==="unsubscribed"
      ? <div className="note-box"><h2>Already unsubscribed</h2><p>No more notifications will be sent for this alert.</p></div>
      : <PriceAlertAction endpoint={`/api/price-alerts/unsubscribe/${token}`} actionLabel="Unsubscribe" successMessage="You have been unsubscribed from this price alert."/>}
  </section>;
}
