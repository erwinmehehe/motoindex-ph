import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { databaseConfigured, prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";
import { php } from "@/lib/utils";

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

  await prisma.priceAlertSubscription.update({
    where:{id:subscription.id},
    data:{status:"active",confirmedAt:new Date(),confirmToken:null,thresholdWasMet:false}
  });

  return <section className="page shell price-alert-confirmed">
    <div className="page-head"><span className="entity-kicker">Price alert confirmed</span><h1>{model.make} {model.model}</h1><p>Your alert is active. MotoIndex will notify this email if the published starting-price reference reaches {php(Number(subscription.targetPricePhp))} or lower.</p></div>
    <div className="note-box"><h2>What this alert watches</h2><p>The alert uses MotoIndex&apos;s current published starting-price reference, not a guaranteed dealer cash price. Always open the model page and confirm the final dealer quote before buying.</p></div>
    <div className="hero-actions"><Link className="button" href={`/motorcycles/${model.makeSlug}/${model.slug}`}>Open {model.model}</Link><Link className="button ghost" href="/price-alerts">Price alerts</Link></div>
  </section>;
}
