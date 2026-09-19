import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { topBoxProducts } from "@/lib/catalog";
import { accessorySeoGuides } from "@/lib/accessorySeo";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { CTAGroup, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "./AccessoriesPage.module.css";

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
  {href:"/accessories/top-box",kicker:"Storage + fitment",title:"Motorcycle top boxes",description:"Compare capacity, mounting plates, bike-specific brackets, product records and verified fitment.",meta:"Verified products + fitment"},
  {href:"/accessories/phone-holders",kicker:"Mounting + navigation",title:phoneGuide.title,description:phoneGuide.description,meta:"Mounting + vibration"},
  {href:"/accessories/intercoms",kicker:"Helmet communications",title:intercomGuide.title,description:intercomGuide.description,meta:"Helmet compatibility"},
  {href:"/accessories/rain-gear",kicker:"Wet-weather riding",title:rainGuide.title,description:rainGuide.description,meta:"Coverage + daily use"}
];

export default function AccessoriesPage(){
  const verifiedTopBoxes=topBoxProducts.filter(product=>product.status==="verified").length;
  const fitmentPreview=publicMotorcycles.slice(0,8);

  const schema=articleSchema({
    headline:"Motorcycle accessories guide for the Philippines",
    description:"Browse focused buying guides for motorcycle top boxes, phone holders, helmet intercoms and rain gear.",
    path:"/accessories",
    about:"motorcycle accessories Philippines",
    keywords:["motorcycle accessories Philippines","motorcycle top box","motorcycle phone holder","motorcycle intercom","motorcycle rain gear"],
    checkedDates:accessorySeoGuides.map(g=>g.checkedAt)
  });

  return <section className="page shell accessories-master-page">
    <PageHero
      kicker="Motorcycle accessories"
      title="Motorcycle accessories in the Philippines"
      description="Choose the accessory decision first, then open the focused guide for fitment, mounting, helmet compatibility or wet-weather use."
      actions={<CTAGroup><Link className="button" href="/accessories/top-box">Browse top boxes</Link><Link className="button secondary" href="/fitment">Check model fitment</Link></CTAGroup>}
    />

    <StatRow items={[
      {label:"Focused categories",value:"4",note:"One clear buying intent each"},
      {label:"Verified top boxes",value:String(verifiedTopBoxes),note:"Structured product records"},
      {label:"Motorcycles",value:String(publicMotorcycles.length),note:"Exact-model fitment entry points"}
    ]}/>

    <nav className="product-entity-nav" aria-label="Motorcycle accessory categories">
      <Link href="/accessories/top-box">Top boxes</Link>
      <Link href="/accessories/phone-holders">Phone holders</Link>
      <Link href="/accessories/intercoms">Intercoms</Link>
      <Link href="/accessories/rain-gear">Rain gear</Link>
      <a href="#model-fitment">Model fitment</a>
    </nav>

    <section className={styles.section}>
      <SectionHeader
        kicker="Choose a category"
        title="Start with the accessory decision"
        description="Each category has a different fitment question, so the hub now works as a fast research index instead of a wall of identical cards."
      />
      <div className={styles.categoryList} data-accessory-category-list>
        {categoryHubs.map(hub=><Link className={styles.categoryRow} key={hub.href} href={hub.href}>
          <span className={styles.categoryKicker}>{hub.kicker}</span>
          <span className={styles.categoryCopy}><h3>{hub.title}</h3><p>{hub.description}</p></span>
          <span className={styles.categoryMeta}>{hub.meta}</span>
          <span className={styles.categoryArrow} aria-hidden="true">→</span>
        </Link>)}
      </div>
    </section>

    <section id="model-fitment" className={styles.section}>
      <SectionHeader
        kicker="Fitment"
        title="Check accessories on the exact motorcycle"
        description="Mounting space, tire sizes, top-box racks and model-specific fitment belong on the motorcycle entity rather than generic accessory pages."
        aside={<Link href="/motorcycles">Browse all motorcycles →</Link>}
      />
      <div className={styles.fitmentList}>
        {fitmentPreview.map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}>
          <span><strong>{m.make} {m.model}</strong><small>Tires, mounting and accessory fitment</small></span>
          <b>Open model →</b>
        </Link>)}
      </div>
      <CTAGroup className={styles.actions}><Link className="button small" href="/motorcycles">Browse all motorcycles</Link><Link className="button secondary small" href="/fitment">Open fitment finder</Link></CTAGroup>
    </section>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}
