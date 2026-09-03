import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { publicMotorcycles } from "@/lib/data";
import { tireProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { tireFamilyHubs } from "@/lib/tireSeo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Tire Size Chart & Finder Philippines",
  description: "Find stock motorcycle tire sizes by model, compare popular Aerox, NMAX and Honda Click generations, and learn how to read motorcycle tire-size markings.",
  path: "/tires",
  index: true
});

export default function TiresPage(){
  return <section className="page shell">
    <div className="page-head"><h1>Motorcycle tire size finder and chart</h1><p>Start with your motorcycle&apos;s stock front and rear tire sizes, then check manufacturer-listed replacement sizes plus load, speed, rim and clearance requirements. A printed size match is <b>not</b> automatically a complete fitment approval.</p></div>

    <div className="section-head inline-head"><div><h2>Tire-size guides by model family</h2><p>Generic model names often span more than one generation. These guides keep the stock sizes separated before you open the exact motorcycle.</p></div><Link href="/tires/motorcycle-tire-size-chart">How to read tire sizes →</Link></div>
    <div className="topic-grid">{tireFamilyHubs.map(hub=><article key={hub.slug}><h2>{hub.shortName}</h2><p>{hub.description}</p><div className="topic-action"><Link href={`/tires/${hub.slug}`}>Compare generations →</Link></div></article>)}</div>

    <div className="section-head inline-head"><div><h2>Stock front and rear tire sizes</h2></div><Link href="/fitment">Open fitment finder →</Link></div>
    <div className="fitment-list">{publicMotorcycles.map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><span><strong>{m.make} {m.model}</strong><small>{m.category}</small></span><span className="tire-pair"><b>{m.frontTire}</b><b>{m.rearTire}</b></span></Link>)}</div>

    <div className="section-head inline-head"><div><h2>Verified tire families</h2><p>Product cards only appear publicly when the tire family has a checked manufacturer size source.</p></div></div>
    <div className="product-grid">{tireProducts.filter(p=>p.status==="verified").map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:`${p.useCase} · ${p.knownSizes.length} listed sizes`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>

    <div className="fitment-crosslinks"><Link href="/tires/motorcycle-tire-size-chart"><strong>Motorcycle tire size chart</strong><small>Width, aspect ratio, rim diameter and fitment checks →</small></Link><Link href="/fitment"><strong>Fitment finder</strong><small>Tires + motorcycle-specific accessories →</small></Link><Link href="/methodology"><strong>How MotoIndex verifies fitment</strong><small>Evidence and publishing rules →</small></Link></div>
  </section>;
}
