import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { accessoryCategories, publicMotorcycles } from "@/lib/data";

export const metadata: Metadata = pageMetadata({ title: 'Motorcycle Accessories Philippines', description: 'Browse motorcycle top boxes, intercoms, phone holders, rain gear and model-specific accessory fitment.', path: '/accessories', index: true });

export default function AccessoriesPage(){
  return <section className="page shell"><div className="page-head"><h1>Motorcycle accessories in the Philippines</h1><p>Browse top boxes, intercoms, phone holders and rain gear, then check model-specific mounting and fitment notes before buying.</p></div><div className="topic-grid">{accessoryCategories.map(a=><article key={a.slug}><h2>{a.name}</h2><p>{a.description}</p><div className="topic-action"><Link href={`/accessories/${a.slug}`}>Explore category →</Link></div></article>)}</div><div className="section-head inline-head"><div><h2>Accessory guides by motorcycle</h2></div></div><div className="list-cards">{publicMotorcycles.slice(0,6).map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}/accessories`}><span><strong>{m.make} {m.model} accessories</strong><small>Top box, bracket, phone mount, rain/touring setup</small></span><b>Open guide →</b></Link>)}</div></section>;
}
