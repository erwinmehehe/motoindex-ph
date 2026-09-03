"use client";
import { useRouter } from "next/navigation";
import type { HelmetProduct } from "@/lib/types";

export function HelmetComparePicker({products,selected}:{products:HelmetProduct[];selected:string[]}){
  const router=useRouter();
  const values=[selected[0]||"",selected[1]||"",selected[2]||""];
  function setAt(index:number,value:string){const next=[...values];next[index]=value;const unique=next.filter((id,i)=>id&&next.indexOf(id)===i);const q=new URLSearchParams();unique.forEach((id,i)=>q.set(["a","b","c"][i],id));router.replace(`/gear/helmets/compare${q.toString()?`?${q}`:""}`,{scroll:false});}
  return <div className="helmet-compare-picker"><div className="helmet-compare-picks">{values.map((value,i)=><label key={i}><span>{i===0?"Helmet A":i===1?"Helmet B":"Optional helmet C"}</span><select value={value} onChange={e=>setAt(i,e.target.value)}><option value="">Choose a helmet</option>{products.map(p=><option key={p.id} value={p.id} disabled={values.some((v,j)=>j!==i&&v===p.id)}>{p.brand} {p.model}</option>)}</select></label>)}</div></div>;
}
