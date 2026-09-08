import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { getTireFamilyHub, getTireFamilyModels, tireFamilyHubs, getTireSizeSeoHub, getMotorcyclesUsingTireSize, tireSizeSeoHubs, isIndexableTireSizeSeoHub } from "@/lib/tireSeo";
import { maintenanceForModel } from "@/lib/maintenance";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { TireFamilyGuide } from "@/components/TireFamilyGuide";

const chartSlug = "motorcycle-tire-size-chart";

export function generateStaticParams() {
  return [...tireFamilyHubs.map((hub) => ({ slug: hub.slug })), ...tireSizeSeoHubs.map((hub) => ({ slug: hub.slug })), { slug: chartSlug }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === chartSlug) return pageMetadata({
    title: "Motorcycle Tire Size Chart Philippines — How to Read Sizes",
    description: "Learn how motorcycle tire-size markings work, see common stock sizes from Philippine-market motorcycles and open model-specific front and rear size guides.",
    path: `/tires/${chartSlug}`,
    index: true
  });
  const hub = getTireFamilyHub(slug);
  if (hub) return pageMetadata({ title: hub.title, description: hub.description, path: `/tires/${hub.slug}`, index: true });
  const sizeHub=getTireSizeSeoHub(slug);
  return sizeHub ? pageMetadata({ title: sizeHub.title, description: sizeHub.description, path: `/tires/${sizeHub.slug}`, index: isIndexableTireSizeSeoHub(slug) }) : {};
}

function FamilyHub({ slug }: { slug: string }) {
  const hub = getTireFamilyHub(slug);
  if (!hub) return notFound();
  const models = getTireFamilyModels(hub);
  const faqs: FaqItem[] = [
    {
      question: `What is the stock tire size of the ${hub.shortName}?`,
      answer: `It depends on the generation. MotoIndex keeps the exact front and rear size beside each generation below so older and current versions are not mixed together.`
    },
    {
      question: `Can I install a wider tire on the ${hub.shortName}?`,
      answer: "A wider printed size is not automatically safe or compatible. Check rim width, load index, speed rating, suspension and body clearance, and the exact motorcycle manufacturer guidance before changing from stock size."
    },
    {
      question: "Does matching the printed tire size guarantee fitment?",
      answer: "No. Matching width, aspect ratio and rim diameter is only the starting point. Load index, speed rating, construction, tube/tubeless requirements, rim width and physical clearance also matter."
    }
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: hub.title,
    itemListElement: models.map((m, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${m.make} ${m.model}: ${m.frontTire} front, ${m.rearTire} rear`,
      url: absoluteUrl(`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`)
    }))
  };

  const tireArticle = articleSchema({
    headline: hub.title,
    description: hub.description,
    path: `/tires/${hub.slug}`,
    about: hub.aliases?.[0],
    keywords: hub.aliases,
    checkedDates: models.map(m => m.verifiedAt)
  });
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Tires", href: "/tires" }, { label: `${hub.shortName} tire size` }]} />
    <div className="page-head"><h1>{hub.title}</h1><p>{hub.description}</p></div>
    <div className="fitment-list">
      {models.map((m) => {
        const maintenance = maintenanceForModel(m.id);
        return <Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}>
          <span><strong>{m.make} {m.model}</strong><small>{m.generation} · exact model guide</small></span>
          <span className="tire-pair"><b>{m.frontTire}</b><b>{m.rearTire}</b>{maintenance?.tirePressure && <small>{maintenance.tirePressure.soloFrontPsi}/{maintenance.tirePressure.soloRearPsi} psi solo</small>}</span>
        </Link>;
      })}
    </div>
    <div className="note-box"><h2>Do not combine tire data across generations</h2><p>Search results often use one model name for several generations. MotoIndex keeps each generation on its own model page so a current tire-size recommendation does not overwrite an older scooter&apos;s stock specification.</p></div>
    <div className="fitment-crosslinks"><Link href="/tires/motorcycle-tire-size-chart"><strong>How to read tire sizes</strong><small>Width, aspect ratio and rim diameter →</small></Link><Link href="/tires"><strong>All motorcycle tire sizes</strong><small>Browse the model finder →</small></Link><Link href="/fitment"><strong>Fitment finder</strong><small>Tires + accessories →</small></Link></div>
    <TireFamilyGuide models={models} shortName={hub.shortName} />
    <FaqSection title={`${hub.shortName} tire-size questions`} items={faqs} />
    <JsonLd data={tireArticle} />
    <JsonLd data={schema} />
  </section>;
}

function TireSizeHubPage({ slug }: { slug: string }) {
  const hub=getTireSizeSeoHub(slug);
  if (!hub) return notFound();
  const matches=getMotorcyclesUsingTireSize(hub.size);
  const faqs: FaqItem[] = [
    { question: `Which motorcycles use ${hub.size} tires?`, answer: `MotoIndex currently lists ${matches.length} public Philippine-market motorcycle records that use ${hub.size} as a stock front and/or rear tire size. Open the exact model before ordering because axle position and the rest of the fitment still matter.` },
    { question: `Does ${hub.size} fit every motorcycle listed here?`, answer: "No. This page only groups motorcycles that record the same printed stock size. Load index, speed rating, construction, rim width, tube or tubeless requirements and physical clearance still need to match the exact motorcycle." },
    { question: "Can I use a different tire size if the rim diameter is the same?", answer: "Not automatically. Changing width or aspect ratio can affect handling, clearance and overall diameter. Use the motorcycle manufacturer guidance or a qualified tire specialist before changing from the recorded stock size." }
  ];
  const itemList={
    "@context":"https://schema.org",
    "@type":"ItemList",
    name:hub.title,
    numberOfItems:matches.length,
    itemListElement:matches.map(({model,front,rear},index)=>({
      "@type":"ListItem",
      position:index+1,
      name:`${model.make} ${model.model} — ${front&&rear?"front and rear":front?"front":"rear"} ${hub.size}`,
      url:absoluteUrl(`/motorcycles/${model.makeSlug}/${model.slug}#tires-fitment`)
    }))
  };
  const article=articleSchema({
    headline:hub.title,
    description:hub.description,
    path:`/tires/${hub.slug}`,
    about:`${hub.size} motorcycle tire size`,
    keywords:[`${hub.size} motorcycle tire`,`${hub.size} tire size Philippines`,`motorcycles using ${hub.size}`],
    checkedDates:matches.map(({model})=>model.verifiedAt)
  });
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Tires",href:"/tires"},{label:hub.size}]} />
    <div className="page-head"><span className="section-kicker">Stock tire-size index</span><h1>{hub.title}</h1><p>{hub.description}</p></div>
    <div className="brand-facts"><div><span>Motorcycles matched</span><strong>{matches.length}</strong></div><div><span>Printed size</span><strong>{hub.size}</strong></div><div><span>Basis</span><strong>Stock record</strong></div></div>
    <div className="note-box"><h2>Same printed size does not equal universal fitment</h2><p>This index means the motorcycle record uses {hub.size} at the front, rear or both. It does not mean every tire carrying that size is approved for every motorcycle below.</p></div>
    <div className="fitment-list">{matches.map(({model,front,rear})=><Link key={model.id} href={`/motorcycles/${model.makeSlug}/${model.slug}#tires-fitment`}><span><strong>{model.make} {model.model}</strong><small>{model.generation} · exact model tire section</small></span><span className="tire-pair"><b>{front&&rear?"Front + rear":front?"Front":"Rear"}</b><b>{hub.size}</b><small>Other axle: {front&&!rear?model.rearTire:rear&&!front?model.frontTire:"same size"}</small></span></Link>)}</div>
    <div className="fitment-crosslinks"><Link href="/tires/motorcycle-tire-size-chart"><strong>How to read tire sizes</strong><small>Width, aspect ratio and rim diameter →</small></Link><Link href="/tires"><strong>Motorcycle tire finder</strong><small>Browse tire families and model matches →</small></Link><Link href="/fitment"><strong>Fitment finder</strong><small>Tires and accessories →</small></Link></div>
    <FaqSection title={`${hub.size} tire-size questions`} items={faqs} />
    <JsonLd data={[article,itemList]} />
  </section>;
}

function TireSizeChart() {
  const sizeCounts = new Map<string, number>();
  for (const model of publicMotorcycles) {
    for (const size of [model.frontTire, model.rearTire]) sizeCounts.set(size, (sizeCounts.get(size) || 0) + 1);
  }
  const common = [...sizeCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12);
  const faqs: FaqItem[] = [
    { question: "What does 110/80-14 mean on a motorcycle tire?", answer: "110 is the nominal section width in millimeters, 80 is the aspect ratio as a percentage of width, and 14 is the rim diameter in inches. The full sidewall marking may also include construction, load index and speed rating." },
    { question: "Can two motorcycles with the same tire size use the same tire?", answer: "Not automatically. The printed size can match while load index, speed rating, construction, intended axle, rim width, tube/tubeless requirements or clearance differ." },
    { question: "Where should I find my motorcycle's correct tire pressure?", answer: "Use the motorcycle owner's manual or manufacturer label for the exact model and load condition. MotoIndex only shows pressure values when a model-specific source has been recorded." },
    { question: "Is a larger motorcycle tire always better?", answer: "No. Changing size can affect steering, clearance, speedometer behavior and load on the chassis. Stay with manufacturer-approved fitment unless a qualified tire or motorcycle specialist confirms the change." }
  ];
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Tires", href: "/tires" }, { label: "Tire size chart" }]} />
    <div className="page-head"><h1>Motorcycle tire size chart for Philippine riders</h1><p>Use tire markings to identify width, aspect ratio and rim diameter, then confirm the full load, speed, construction and clearance requirements for your exact motorcycle.</p></div>
    <div className="split section"><div><h2>How to read 110/80-14</h2><div className="brand-facts"><div><span>110</span><strong>Width</strong><small>Nominal millimeters</small></div><div><span>80</span><strong>Aspect ratio</strong><small>% of section width</small></div><div><span>14</span><strong>Rim diameter</strong><small>Inches</small></div></div></div><div className="info-card"><h3>The size code is not the whole fitment</h3><ul className="checklist"><li>Load index and speed rating</li><li>Front/rear or reversible designation</li><li>Tube or tubeless construction</li><li>Approved rim-width range</li><li>Fender, swingarm and suspension clearance</li></ul></div></div>
    <div className="section-head"><div><h2>Common tire sizes in the MotoIndex catalog</h2><p>These are counts across current public motorcycle records, not a recommendation that a size fits every motorcycle.</p></div></div>
    <div className="helmet-brand-table"><div className="helmet-brand-row head"><span>Printed size</span><span>Catalog appearances</span><span>Use</span><span>Next step</span></div>{common.map(([size, count]) => <div className="helmet-brand-row" key={size}><strong>{size}</strong><span>{count}</span><span>Front and/or rear stock record</span><span><Link href="/tires">Match a motorcycle →</Link></span></div>)}</div>
    <div className="section-head inline-head"><div><h2>Open a tire-size guide</h2></div></div><div className="topic-grid">{tireFamilyHubs.map(hub => <article key={hub.slug}><h2>{hub.shortName}</h2><p>{hub.description}</p><div className="topic-action"><Link href={`/tires/${hub.slug}`}>View tire sizes →</Link></div></article>)}</div>
    <FaqSection title="Motorcycle tire-size questions" items={faqs} />
  </section>;
}

export default async function TireSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === chartSlug) return <TireSizeChart />;
  if (getTireFamilyHub(slug)) return <FamilyHub slug={slug} />;
  if (getTireSizeSeoHub(slug)) return <TireSizeHubPage slug={slug} />;
  return notFound();
}
