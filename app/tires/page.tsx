import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { getModelById, publicMotorcycles } from "@/lib/data";
import { tireProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { AuthorBox } from "@/components/AuthorBox";
import { QuickAnswer } from "@/components/QuickAnswer";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { faqPageSchema } from "@/lib/structuredData";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { tireFamilyHubs, tireModelSeoHubs, getTireFamilyModels } from "@/lib/tireSeo";
import { CTAGroup, DataTable, InfoPanel, PageHero, ProductGrid, SectionHeader, StatRow } from "@/components/ui";
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

  // Reading a size code is not the same as confirming compatibility.
  // Bridgestone lists 90/90-14 M/C 46P TL as an actual motorcycle tire marking.
  const sidewallParts=[
    {part:"90 — first number",meaning:"Nominal tire section width in millimetres, not the inflated tire's guaranteed measured width."},
    {part:"90 — after slash",meaning:"Aspect ratio: the nominal sidewall height is 90% of section width."},
    {part:"- (or R)",meaning:"Construction marking: a hyphen denotes bias-ply; R denotes radial on tires using this format."},
    {part:"14",meaning:"Rim or bead-seat diameter in inches. It must match the wheel."},
    {part:"M/C",meaning:"Designation for motorcycle use."},
    {part:"46",meaning:"Load-index code, not 46 kilograms. Confirm its rating in the tire maker's load chart."},
    {part:"P",meaning:"Speed-rating code, not the tire's size. Confirm suitability for the motorcycle."},
    {part:"TL",meaning:"Tubeless marking. Check the rim, valve and manufacturer tire/tube requirements."}
  ];

  const tireFaqs: FaqItem[] = [
    {question:"Where do I find the correct motorcycle front and rear tire sizes?",answer:"Start with the exact make, model, generation and market variant on MotoIndex, then confirm both original tire positions against the motorcycle owner's manual or placard. Also match the tire manufacturer's approved construction, load and speed ratings, rim width and tube or tubeless requirements."},
    {question:"Can I use a tire with the same size numbers on the front and rear?",answer:"Not automatically. Front and rear tires may differ in construction, orientation, load and application even when some numbers match. Follow the motorcycle and tire manufacturers' position, load, pressure and compatibility guidance before fitting a replacement."},
    {question:"What does 90/90-14 M/C 46P TL mean on a motorcycle tire?",answer:"In that published example, 90 is nominal width in millimetres, the second 90 is the aspect ratio, 14 is rim diameter in inches, M/C designates motorcycle use, 46 is a load-index code, P a speed-rating code and TL means tubeless. The code explains the marking; it does not establish fitment for a particular motorcycle."}
  ];

  return <section className="page shell tire-master-page">
    <PageHero
      kicker="Motorcycle tire fitment guide"
      title="Motorcycle tire size chart and finder"
      description={<>Start with the exact motorcycle&apos;s stock front and rear size. Then check load index, speed rating, construction, tube or tubeless requirement, rim width and physical clearance.</>}
      actions={<CTAGroup><Link className="button" href="/fitment">Open fitment finder</Link><a className="button secondary" href="#products">Browse verified tires</a></CTAGroup>}
    />

    <QuickAnswer
      question="How can I find the right motorcycle tire size in the Philippines?"
      answer="Use the stock front and rear size for the exact motorcycle and generation as a starting point, then check the owner's manual and tire manufacturer's approved fitment. A matching size alone is not enough: load index, speed rating, construction, wheel width and tube or tubeless requirements must also be suitable."
    >
      <p><Link href="/fitment">Search exact motorcycle fitment →</Link>{" · "}<a href="#size-chart">Learn to read the sidewall marking →</a></p>
    </QuickAnswer>

    <nav className="product-entity-nav tire-master-nav" aria-label="Tire guide sections">
      <a href="#products">Tire products</a>
      <a href="#common-sizes">Common sizes</a>
      <a href="#families">Aerox, NMAX & Click</a>
      <a href="#stock-sizes">Stock-size preview</a>
      <a href="#size-chart">Read tire sizes</a>
    </nav>

    <section className={styles.section} aria-labelledby="popular-tire-size-guides">
      <SectionHeader
        kicker="Popular tire-size searches"
        title="Model-specific motorcycle tire size guides"
        titleId="popular-tire-size-guides"
        description="Open a dedicated guide when the model name itself is the fitment question. These pages keep the stock size, pressure evidence, replacement options and safety checks together without duplicating the motorcycle price/spec page."
      />
      <div className={styles.categoryList}>
        {tireModelSeoHubs.map(hub=>{
          const model=getModelById(hub.modelId);
          if(!model)return null;
          return <Link className={styles.categoryRow} href={`/tires/${hub.slug}`} key={hub.slug}>
            <span className={styles.categoryKicker}>{model.make}</span>
            <div className={styles.categoryCopy}><h3>{model.model} tire size</h3><p>{model.frontTire} front · {model.rearTire} rear · pressure and replacement-fitment guidance</p></div>
            <span className={styles.categoryMeta}>Front & rear stock sizes</span>
            <span className={styles.categoryArrow}>→</span>
          </Link>;
        })}
      </div>
    </section>

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
            <h3><Link href={`/tires/${hub.slug}`}>{hub.shortName}</Link></h3>
            <p>{hub.description}</p>
            <Link className={styles.familyGuideLink} href={`/tires/${hub.slug}`}>Open tire-size guide →</Link>
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

    <section id="size-chart" className={styles.section} aria-labelledby="tire-marking-heading">
      <SectionHeader
        kicker="Motorcycle tire size chart"
        title="How to read motorcycle tire sizes and sidewall markings"
        titleId="tire-marking-heading"
        description="Motorcycle tire sizes combine nominal width, aspect ratio, construction, rim diameter and separate load/speed markings. Knowing the numbers helps you read a label; the owner's manual determines what fits."
      />
      <h3>Example: 90/90-14 M/C 46P TL</h3>
      <p>Bridgestone publishes this motorcycle-tire marking. It is an example for learning the code, not a recommended fitment for your motorcycle.</p>
      <StatRow items={[
        {label:"Nominal width",value:"90 mm",note:"First 90: tire section width"},
        {label:"Aspect ratio",value:"90%",note:"Second 90: sidewall proportion"},
        {label:"Rim diameter",value:"14 in",note:"Wheel bead-seat diameter"}
      ]}/>
      <DataTable label="Meaning of each motorcycle tire size marking">
        <div role="row" className="head" style={{gridTemplateColumns:"minmax(150px, .7fr) minmax(290px, 2fr)"}}>
          <span role="columnheader">Sidewall code</span>
          <span role="columnheader">What it means</span>
        </div>
        {sidewallParts.map(item=><div role="row" style={{gridTemplateColumns:"minmax(150px, .7fr) minmax(290px, 2fr)"}} key={item.part}>
          <strong role="cell">{item.part}</strong>
          <span role="cell">{item.meaning}</span>
        </div>)}
      </DataTable>
      <InfoPanel subtle>
        <h3>Stock size versus replacement compatibility</h3>
        <p>Do not decide on a replacement using width and wheel diameter alone. Find your exact make, model, generation and market in the motorcycle's manual, then check these details with the tire manufacturer or a qualified installer.</p>
        <ul>
          <li><strong>Front and rear:</strong> use the correct position and orientation; a matching size string does not establish interchangeability.</li>
          <li><strong>Construction:</strong> follow the approved radial/bias specification. Do not assume they can be mixed.</li>
          <li><strong>Load and speed:</strong> both index codes must meet the motorcycle's requirements.</li>
          <li><strong>Rim and fitment:</strong> verify supported rim width, clearance, tire/tube requirements and cold inflation pressure for the intended load.</li>
        </ul>
        <p>For stock sizes by generation, see the <Link href="/tires/aerox-tire-size">Aerox</Link>, <Link href="/tires/nmax-tire-size">NMAX</Link> and <Link href="/tires/honda-click-tire-size">Honda Click</Link> family guides. You can also <Link href="/fitment">check the motorcycle fitment finder</Link>.</p>
      </InfoPanel>
      <p><strong>Manufacturer references:</strong> <a href="https://www.michelin.com.ph/motorbike/advice-motorbike/tire-basics/motorcycle-tire-size" target="_blank" rel="noopener noreferrer">Michelin Philippines tire-size guide</a> · <a href="https://www.pirelli.com/tyres/en-ww/motorcycle/tyre-reading" target="_blank" rel="noopener noreferrer">Pirelli sidewall marking guide</a> · <a href="https://www.bridgestone.com/products/motorcycle_tires/products/size/result.html?oblateness=90&amp;rim_width=18&amp;tire_width=110" target="_blank" rel="noopener noreferrer">Bridgestone tire-size example</a> · <a href="https://tires.bridgestone.com/en-us/learn/motorcycle/tire-maintenance/motorcycle-tire-safety-and-maintenance-manual" target="_blank" rel="noopener noreferrer">Bridgestone motorcycle tire safety manual</a></p>
    </section>

    <FaqSection title="Motorcycle tire fitment questions" items={tireFaqs}/>

    <div className="fitment-crosslinks">
      <Link href="/fitment"><strong>Fitment finder</strong><small>Tires + motorcycle-specific accessories →</small></Link>
      <Link href="/motorcycles"><strong>Motorcycle catalog</strong><small>Open exact model tire sections →</small></Link>
      <Link href="/methodology"><strong>How fitment is checked</strong><small>Evidence and publishing rules →</small></Link>
    </div>

    <JsonLd data={[schema,faqPageSchema(tireFaqs)]}/>
    <AuthorBox/>
  </section>;
}
