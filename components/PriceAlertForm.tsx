import Link from "next/link";
import type { OfferEntityType } from "@/lib/types";

export function PriceAlertForm({entityType,entityId,label}:{entityType:OfferEntityType;entityId:string;label:string;currentPricePhp?:number}){
  void entityType; void entityId;
  return <div className="alert-card disabled-feature"><div><h2>We are not collecting email addresses.</h2><p>Notifications for {label} are currently unavailable. Email collection will stay off until consent, secure storage and delivery are in place.</p></div><Link className="button" href="/catalog">Browse products</Link></div>;
}
