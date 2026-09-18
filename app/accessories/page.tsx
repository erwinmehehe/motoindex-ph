import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { accessorySeoGuides } from "@/lib/accessorySeo";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";

export const metadata: Metadata = pageMetadata({
  title:"Motorcycle Accessories Philippines: Top Boxes & Gear",
  description:"Browse motorcycle top boxes, phone holders, helmet intercoms and rain gear with fitment-focused buying guides for Philippine riders.",
  path:"/accessories",
  index:true
});

const phoneGuide=accessorySeoGuides.find(guide=>guide.slug==="phone-holders")!;
const intercomGuide=accessorySeoGuides.find(guide=>guide.slug==="intercoms")!;
const rainGuide=accessorySeoGuides.find(guide=>guide.slug==="rain-gear")!;

const categoryHubs=[
  {href:"/accessories/top-box",kicker:"Storage + fitment",title:"Motorcycle top boxes",description:"Compare capacity, mounting plates, bike-specific brackets, product records and verified fitment."},
  {href:"/accessories/phone-holders",kicker:"Mounting + navigation",title:phoneGuide.title,description:phoneGuide.description},
  {href:"/accessories/intercoms",kicker:"Helmet communications",title:intercomGuide.title,description:intercomGuide.description},
  {href:"/accessories/rain-gear",kicker:"Wet-weather riding",title:rainGuide.title,description:rainGuide.description}
];

export default function AccessoriesPage(){
  const schema=articleSchema({
    headline:"Motorcycle accessories guide for the Philippines",
    description:"Browse focused buying guides for motorcycle top boxes, phone holders, helmet intercoms and rain gear.",
    path:"/accessories",
    about:"motorcycle accessories Philippines",
    keywords:["motorcycle accessories Philippines","motorcycle top box","motorcycle phone holder","motorcycle intercom","motorcycle rain gear"],
    checkedDates:accessorySeoGuides.map(g=>g.checkedAt)
  });

  return <section className="page shell accessories-master-page">
    <div className="page-head">
      <span className="entity-kicker">Motorcycle accessories</span>
      <h1>Motorcycle accessories in the Philippines</h1>
      <p>Choose the accessory category first, then use the dedicated guide for fitment, mounting, helmet compatibility or wet-weather use. MotoIndex keeps product-fitment decisions separate instead of treating every accessory as universal.</p>
    </div>

    <nav className="product-entity-nav" aria-label="Motorcycle accessory categories">
      {categoryHubs.map(hub=><Link key={hub.href} href={hub.href}>{hub.title.replace("Motorcycle ","").replace(" in the Philippines","")}</Link>)}
      <a href="#model-fitment">Model fitment</a>
    </nav>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Choose a category</span><h2>Four accessory decisions, four focused guides</h2><p>Each page owns a distinct search intent and avoids repeating the full guide content on this parent hub.</p></div></div>
      <div className="topic-grid">{categoryHubs.map(hub=><article key={hub.href}><span className="section-kicker">{hub.kicker}</span><h3>{hub.title}</h3><p>{hub.description}</p><Link className="text-link" href={hub.href}>Open guide →</Link></article>)}</div>
    </section>

    <section id="model-fitment" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Fitment</span><h2>Check accessories on the exact motorcycle page</h2><p>Mounting space, tire sizes, top-box racks and model-specific fitment belong on the motorcycle entity, not on hundreds of generated accessory URLs.</p></div></div>
      <div className="list-cards">{publicMotorcycles.slice(0,10).map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><span><strong>{m.make} {m.model}</strong><small>Tires, mounting and accessory fitment</small></span><b>Open model →</b></Link>)}</div>
      <div className="hero-actions"><Link className="button small" href="/motorcycles">Browse all motorcycles</Link><Link className="button ghost small" href="/fitment">Open fitment finder</Link></div>
    </section>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}
