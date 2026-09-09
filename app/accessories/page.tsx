import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { accessorySeoGuides } from "@/lib/accessorySeo";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { FaqSection, type FaqItem } from "@/components/FaqSection";

export const metadata: Metadata = pageMetadata({
  title:"Motorcycle Accessories Philippines: One Buying Guide",
  description:"One motorcycle accessory guide for top boxes, phone holders, helmet intercoms, rain gear and model-specific fitment in the Philippines.",
  path:"/accessories",
  index:true
});

export default function AccessoriesPage(){
  const faqs:FaqItem[]=accessorySeoGuides.flatMap(guide=>guide.faqs);
  const schema=articleSchema({
    headline:"Motorcycle accessories guide for the Philippines",
    description:"One buyer guide covering motorcycle top boxes, phone holders, intercoms, rain gear and model-specific fitment.",
    path:"/accessories",
    about:"motorcycle accessories Philippines",
    keywords:["motorcycle accessories Philippines","motorcycle top box","motorcycle phone holder","motorcycle intercom","motorcycle rain gear"],
    checkedDates:accessorySeoGuides.map(g=>g.checkedAt)
  });

  return <section className="page shell accessories-master-page">
    <div className="page-head">
      <span className="entity-kicker">Motorcycle accessories</span>
      <h1>Motorcycle accessories in the Philippines: storage, mounts, intercoms and rain gear</h1>
      <p>Use one guide for the main accessory decisions. Check model-specific mounting before buying anything that attaches to the motorcycle, and check the exact helmet before buying communication hardware.</p>
    </div>

    <nav className="product-entity-nav" aria-label="Motorcycle accessory guide sections">
      <a href="#top-box">Top boxes</a>
      <a href="#phone-holders">Phone holders</a>
      <a href="#intercoms">Intercoms</a>
      <a href="#rain-gear">Rain gear</a>
      <a href="#model-fitment">Model fitment</a>
    </nav>

    <section id="top-box" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Storage</span><h2>Motorcycle top boxes and brackets</h2><p>Top boxes stay as a separate product hub because capacity, mounting plate and bike-specific rack evidence are real product-fitment data, not just editorial advice.</p></div></div>
      <div className="topic-grid">
        <article><h3>Capacity is not fitment</h3><p>A 32L, 39L or larger box still needs the correct carrier, plate interface, fasteners and load limit for the motorcycle.</p></article>
        <article><h3>Check the rack first</h3><p>Open the exact motorcycle page and confirm whether a manufacturer-listed or otherwise verified rack/bracket record exists.</p></article>
        <article><h3>Keep load limits in mind</h3><p>The box rating does not override the motorcycle rack, subframe or carrier load limit.</p></article>
      </div>
      <Link className="button small" href="/accessories/top-box">Compare top boxes and fitment →</Link>
    </section>

    {accessorySeoGuides.map(guide=><section id={guide.slug} className="motorcycle-entity-section" key={guide.slug}>
      <div className="section-head compact"><div><span className="section-kicker">{guide.slug.replaceAll("-"," ")}</span><h2>{guide.title}</h2><p>{guide.intro}</p></div></div>
      <div className="method-steps ownership-guide-sections">
        {guide.sections.map((section,index)=><article key={section.heading}>
          <b>{String(index+1).padStart(2,"0")}</b>
          <h3>{section.heading}</h3>
          {section.body.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
          {section.bullets&&<ul className="checklist">{section.bullets.map(item=><li key={item}>{item}</li>)}</ul>}
        </article>)}
      </div>
    </section>)}

    <section id="model-fitment" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Fitment</span><h2>Check accessories on the exact motorcycle page</h2><p>Mounting space, tire sizes, top-box racks and model-specific fitment belong on the motorcycle entity, not on hundreds of generated accessory URLs.</p></div></div>
      <div className="list-cards">{publicMotorcycles.slice(0,10).map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><span><strong>{m.make} {m.model}</strong><small>Tires, mounting and accessory fitment</small></span><b>Open model →</b></Link>)}</div>
      <div className="hero-actions"><Link className="button small" href="/motorcycles">Browse all motorcycles</Link><Link className="button ghost small" href="/fitment">Open fitment finder</Link></div>
    </section>

    <JsonLd data={schema}/>
    <FaqSection title="Motorcycle accessory questions" items={faqs}/>
    <AuthorBox/>
  </section>;
}
