import { publicSellersByType } from "@/lib/sellers";
import { snapshotDealers, snapshotSeller } from "@/lib/publicSnapshot";
import type { SellerProfile } from "@/lib/types";

export async function persistentVerifiedDealers(){
  return snapshotDealers();
}

export async function allVerifiedDealers(){
  const staticRows=publicSellersByType("dealer");
  const snapshotRows=snapshotDealers();
  const merged=new Map<string,SellerProfile>();
  for(const row of [...staticRows,...snapshotRows])merged.set(row.slug,row);
  return [...merged.values()].sort((a,b)=>a.city.localeCompare(b.city)||a.name.localeCompare(b.name));
}

export async function getVerifiedSellerProfile(slug:string){
  const staticRow=publicSellersByType("dealer").find(row=>row.slug===slug);
  return staticRow||snapshotSeller(slug);
}

export function sellerSlug(value:string){
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
}

export type QuoteEligibleDealer = SellerProfile & { leadEmail:string };

/* Quote matching stays in the separated backend. Private lead emails are not
 * included in the public build-time snapshot. */
export async function quoteEligibleDealers(){
  return [] as QuoteEligibleDealer[];
}

export async function matchQuoteEligibleDealers(_make:string,_location:string,_limit=3){
  return [] as QuoteEligibleDealer[];
}

export async function hasQuoteEligibleDealerForBrand(_make:string){
  return false;
}
