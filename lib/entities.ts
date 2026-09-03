import { motorcycles } from "./data";
import { helmetProducts, tireProducts, topBoxProducts } from "./catalog";
import type { OfferEntityType } from "./types";

export function entityLabel(type:OfferEntityType,id:string){
  if(type==="motorcycle"){const m=motorcycles.find(x=>x.id===id);return m?`${m.make} ${m.model}`:id;}
  if(type==="helmet"){const p=helmetProducts.find(x=>x.id===id);return p?`${p.brand} ${p.model}`:id;}
  if(type==="tire"){const p=tireProducts.find(x=>x.id===id);return p?`${p.brand} ${p.model}`:id;}
  const p=topBoxProducts.find(x=>x.id===id);return p?`${p.brand} ${p.model}`:id;
}
export function entityHref(type:OfferEntityType,id:string){
  if(type==="motorcycle"){const m=motorcycles.find(x=>x.id===id);return m?`/motorcycles/${m.makeSlug}/${m.slug}`:"/motorcycles";}
  if(type==="helmet"){const p=helmetProducts.find(x=>x.id===id);return p?`/gear/helmets/${p.brandSlug}/${p.slug}`:"/gear/helmets";}
  if(type==="tire"){const p=tireProducts.find(x=>x.id===id);return p?`/tires/${p.brandSlug}/${p.slug}`:"/tires";}
  const p=topBoxProducts.find(x=>x.id===id);return p?`/accessories/top-box/${p.slug}`:"/accessories/top-box";
}
