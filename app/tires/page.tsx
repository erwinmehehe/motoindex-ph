import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { tireProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { tireFamilyHubs, getTireFamilyModels } from "@/lib/tireSeo";
import { CTAGroup, InfoPanel, PageHero, ProductGrid, SectionHeader, StatRow } from "@/components/ui";
import styles from "../styles/hub-index.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Tire Size Chart Philippines: Finder & Fitment Guide",
  description: "One motorcycle tire guide with stock front and rear sizes, Aerox, NMAX and Click generation comparisons, tire-size markings and verified tire products.",
  path: "/tires",
  index: true
});

function normalize(value:string){
  return value.toUpperCase().replace(/\s+/g,"").replace(/R(?=\d)/g,"-").replace(/M\/C/g,"").replace(/--+/g,"-");
}

export default function TiresPage(){
  const verifiedProducts=tireProducts.filter(p=>p.status==="verified");
  const stockPreview=publicMotorcycles.slice(0,16);
  const sizeMap=new Map<string,{label:string;models:typeof publicMotorcycles}>();

  for(const model of publicMotorcycles){
    for(const size of [model.frontTire,model.rearTire]){
      const key=normalize(size);
      const row=sizeMap.get(key)||{label:size,models:[] as typeof publicMotorcycles};
      if(!row.models.some(item=>item.id===model.id))row.models.push(model);
      sizeMap.set(key,row);
    }
  }

  const commonSizes=[...sizeMap.values()]
    .sort((a,b)=>b.models.length-a.models.length||a.label.localeCompare(b.label))
    .slice(0,10);

  const schema=articleSchema({
    headline:"Motorcycle tire size and fitment guide for the Philippines",
    description:"One guide to motorcycle tire-size markings, stock front and rear sizes, model generations and verified replacement tire families.",
    path:"/tires",
    about:"motorcycle tire size Philippines",
    keywords:["motorcycle tire size chart","motorcycle tire size Philippines","Aerox tire size","NMAX tire size","Honda Click tire size"],
    checkedDates:publicMotorcycles.map(m=>m.verifiedAt)
  });

  return <section className="page shell tire-master-page">
    <PageHero
      kicker="Motorcycle tire fitment guide"
      title="Motorcycle tire size chart and finder"
      description={<>Start with the exact motorcycle&apos;s stock front and rear size. Then check load index, speed rating, construction, tube or tubeless requirement, rim width and physical clearance.</>}
      actions={<CTAGroup><Link className="button" href="/fitment">Open fitment finder</Link><a className="button secondary" href="#products">Browse verified tires</a></CTAGroup>}
    />

    <nav className="product-entity-nav tire-master-nav" aria-label="Tire guide sections">
      <a href="#products">Tire products</a>
      <a href="#common-sizes">Common sizes</a>
      <a href="#families">Aerox, NMAX & Click</a>
      <a href="#stock-sizes">Stock-size preview</a>
      <a href="#size-chart">Read tire sizes</a>
    </nav>

    <section id="products" className={`${styles.section} ${styles.products}`} data-tire-product-section>
      <SectionHeader
        kicker="Replacement tires"
        title="Verified motorcycle tire products"
        description="Start with real tire families, then confirm that the exact listed size and specification match your motorcycle before ordering."
        aside={<Link href="/fitment">Check motorcycle fitment →</Link>}
      />
      <ProductGrid density="compact">{verifiedProducts.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:`${p.useCase} · ${p.knownSizes.length} listed sizes`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</ProductGrid>
    </section>

    <section id="common-sizes" className={styles.section}>
      <SectionHeader
        kicker="Size index"
        title="Common stock motorcycle tire sizes"
        description="A compact discovery index from motorcycles in the current catalog. Open the exact motorcycle before ordering."
      />
      <div className={styles.twoColList} data-tire-size-index>
        {commonSizes.map(row=><article className={`${styles.twoColRow} ${styles.sizeRow}`} key={row.label}>
          <div className={styles.sizeValue}>
            <strong>{row.label}</strong>
            <span>{row.models.length} motorcycle{row.models.length===1?"":"s"}</span>
          </div>
          <p className={styles.modelLinks}>
            {row.models.slice(0,4).map((m,index)=><span key={m.id}>{index>0?" · ":""}<Link href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}>{m.make} {m.model}</Link></span>)}
            {row.models.length>4&&<span> · +{row.models.length-4} more</span>}
          </p>
        </article>)}
      </div>
    </section>

    <section id="families" className={styles.section}>
      <SectionHeader
        kicker="Do not mix generations"
        title="Aerox, NMAX and Honda Click tire sizes"
        description="Popular model names span multiple generations, and stock front or rear sizes can change."
      />
      <div className={styles.familyGrid}>
        {tireFamilyHubs.map(hub=>{
          const models=getTireFamilyModels(hub);
          return <article className={styles.family} key={hub.slug}>
            <h3>{hub.shortName}</h3>
            <p>{hub.description}</p>
            <div className={styles.familyLinks}>
              {models.map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}>
                <span><strong>{m.model}</strong><small>{m.generation}</small></span>
                <span className={styles.tirePair}><b>{m.frontTire}</b><b>{m.rearTire}</b></span>
              </Link>)}
            </div>
          </article>;
        })}
      </div>
    </section>

    <section id="stock-sizes" className={styles.section}>
      <SectionHeader
        kicker="Exact motorcycles"
        title="Stock front and rear tire sizes"
        description="A short preview of current motorcycles. Use Fitment Finder for the complete catalog and open the exact model before ordering."
        aside={<Link href="/fitment">Search all fitment →</Link>}
      />
      <div className={styles.twoColList}>
        {stockPreview.map(m=><Link className={`${styles.twoColRow} ${styles.modelLink}`} key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}>
          <span><strong>{m.make} {m.model}</strong><small>{m.category}</small></span>
          <span className={styles.tirePair}><b>{m.frontTire}</b><b>{m.rearTire}</b></span>
        </Link>)}
      </div>
      <CTAGroup className={styles.actions}><Link className="button secondary small" href="/fitment">Search all {publicMotorcycles.length} motorcycles</Link></CTAGroup>
    </section>

    <section id="size-chart" className={styles.section}>
      <SectionHeader
        kicker="How to read the number"
        title="How motorcycle tire sizes work"
        description="A marking such as 110/80-14 combines width, aspect ratio and rim diameter. Those three numbers are only the starting point."
      />
      <StatRow items={[
        {label:"Width",value:"110 mm",note:"Nominal section width"},
        {label:"Aspect ratio",value:"80%",note:"Approximate sidewall ratio"},
        {label:"Rim diameter",value:"14 in",note:"Must match the wheel"}
      ]}/>
      <InfoPanel subtle>
        <h3>Also confirm the full fitment specification</h3>
        <p>Check front or rear application, load index, speed rating, construction, tube or tubeless requirement, approved rim width and physical clearance. A wider tire is not automatically an upgrade.</p>
      </InfoPanel>
    </section>

    <div className="fitment-crosslinks">
      <Link href="/fitment"><strong>Fitment finder</strong><small>Tires + motorcycle-specific accessories →</small></Link>
      <Link href="/motorcycles"><strong>Motorcycle catalog</strong><small>Open exact model tire sections →</small></Link>
      <Link href="/methodology"><strong>How fitment is checked</strong><small>Evidence and publishing rules →</small></Link>
    </div>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}
