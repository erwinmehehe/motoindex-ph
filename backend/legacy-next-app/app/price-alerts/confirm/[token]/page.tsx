import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { databaseConfigured, prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";
import { php } from "@/lib/utils";
import { PriceAlertAction } from "@/components/PriceAlertAction";

export const metadata:Metadata={title:"Confirm Price Alert",robots:{index:false,follow:false,noarchive:true}};
export const dynamic="force-dynamic";

export default async function ConfirmPriceAlertPage({params}:{params:Promise<{token:string}>}){
  if(!databaseConfigured())return notFound();
  const {token}=await params;
  const subscription=await prisma.priceAlertSubscription.findUnique({where:{confirmToken:token}});
  if(!subscription||subscription.status!=="pending")return notFound();
  if(Date.now()-subscription.updatedAt.getTime()>24*60*60*1000)return notFound();

  const model=getModelById(subscription.entityId);
  if(!model)return notFound();

  return <section className="page shell price-alert-confirmed">
    <div className="page-head"><span className="entity-kicker">Confirm price alert</span><h1>{model.make} {model.model}</h1><p>Confirm the alert for {php(Number(subscription.targetPricePhp))} or lower. This confirmation link expires 24 hours after the latest alert request.</p></div>
    <div className="note-box"><h2>What this watches</h2><p>MotoIndex checks the current published starting-price reference for this motorcycle. It does not guarantee a dealer cash price, promotion, stock or financing approval.</p></div>
    <PriceAlertAction endpoint={`/api/price-alerts/confirm/${token}`} actionLabel="Confirm price alert" successMessage="Your price alert is active."/>
  </section>;
}
