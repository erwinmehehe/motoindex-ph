import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Live Motorcycle Deals — Not Yet Available",
  description: "MotoIndex does not currently publish live dealer deals. Use verified motorcycle price pages and gear research instead.",
  path: "/deals",
  index: false
});

export default function DealsPage(){
  return <section className="page shell"><div className="page-head"><h1>Live seller deals are not active yet.</h1><p>We removed demo offer rows from the public research experience. Until live seller feeds pass the verification gate, use dated model price observations and product research instead.</p></div><div className="section-head compact"><div><h2>Use current research pages instead</h2></div></div><div className="tool-grid"><Link href="/motorcycles"><span>01</span><h3>Motorcycle prices</h3><p>Compare current model records and open each price page for dated market observations.</p></Link><Link href="/compare"><span>02</span><h3>Compare motorcycles</h3><p>Put price, power, weight, seat height and other decision specs side by side.</p></Link><Link href="/catalog"><span>03</span><h3>Gear catalog</h3><p>Research helmets, tires and accessories without presenting demo seller prices as live offers.</p></Link></div></section>;
}
