import type { Metadata } from "next";
import { publicMotorcycles } from "@/lib/data";
import { ShortlistClient } from "@/components/ShortlistClient";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";

export const dynamic="force-static";
export const metadata:Metadata=pageMetadata({
  title:"Saved Motorcycle Shortlist",
  description:"Compare your saved Philippine motorcycles by observed price, monthly ownership estimate, rider fit and essential specifications.",
  path:"/shortlist",
  index:false
});

export default function ShortlistPage(){
  return <section className="apple-shortlist-page shell">
    <div className="apple-page-heading">
      <span>Your shortlist</span>
      <h1>The motorcycles you are considering.</h1>
      <p>Saved privately in this browser. No account required.</p>
    </div>
    <ShortlistClient models={forClient(publicMotorcycles)}/>
  </section>;
}
