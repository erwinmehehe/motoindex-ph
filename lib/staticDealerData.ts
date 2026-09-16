import { publicSellers, publicSellersByType, citySlug } from "@/lib/sellers";
import { ncrDealers } from "@/lib/ncrDealers";
import type { SellerProfile } from "@/lib/types";

function unique(rows:SellerProfile[]){
  const map=new Map<string,SellerProfile>();
  for(const row of rows)map.set(row.slug,row);
  return [...map.values()];
}

export function staticPublicDealers(){
  return unique([...publicSellersByType("dealer"),...ncrDealers])
    .sort((a,b)=>a.city.localeCompare(b.city)||a.name.localeCompare(b.name));
}

export function staticPublicSellers(){
  return unique([...publicSellers(),...ncrDealers]);
}

export function staticDealerCities(){
  return [...new Set(staticPublicDealers().map(row=>row.city))].sort();
}

export function staticDealersByCity(slug:string){
  return staticPublicDealers().filter(row=>citySlug(row.city)===slug);
}

export function staticSellerBySlug(slug:string){
  return staticPublicSellers().find(row=>row.slug===slug);
}
