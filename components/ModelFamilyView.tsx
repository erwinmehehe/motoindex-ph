import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { ModelFamily } from "@/lib/families";
import { getFamilyModels } from "@/lib/families";
import { php } from "@/lib/utils";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { absoluteUrl } from "@/lib/site";
import { ModelFamilyGuide } from "@/components/ModelFamilyGuide";

export function ModelFamilyView({ family }: { family: ModelFamily }) {
  const models = getFamilyModels(family);
  const current = models.find((m) => m?.id === family.currentModelId);
  const faqs: FaqItem[] = current ? [
    {
      question: `How much is the ${family.make} ${family.name} in the Philippines?`,
      answer: `The current ${current.model} price reference on MotoIndex is ${observedMarketPriceLabel(current)}. Open the current-generation price page for the source date, variants and market checks.`
    },
    {
      question: `Which ${family.name} generation is current?`,
      answer: `${current.model} is the current generation in the MotoIndex catalog. Older generations stay on separate pages so historical launch prices are not confused with current new-bike pricing.`
    },
    {
      question: `Are ${family.name} V2 and V3 prices directly comparable?`,
      answer: "Not as current new-bike quotes. A previous generation may now trade mainly on the used market, while the current generation uses current SRP or market observations. Compare the generation context and source dates before using the numbers."
    }
  ] : [];
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${family.make} ${family.name} generations`,
    itemListElement: models.map((m, index) => m && ({
      "@type": "ListItem",
      position: index + 1,
      name: `${m.make} ${m.model}`,
      url: absoluteUrl(`/motorcycles/${m.makeSlug}/${m.slug}#price`)
    })).filter(Boolean)
  };

  const familyArticle = articleSchema({
    headline: `${family.make} ${family.name} price and specs in the Philippines`,
    description: family.intro,
    path: `/motorcycles/${family.makeSlug}/${family.slug}`,
    about: `${family.name} price philippines`,
    keywords: [`${family.make} ${family.name} price`, `${family.name} specs Philippines`],
    checkedDates: models.map(m => m?.marketPriceCheckedAt || m?.verifiedAt)
  });
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:family.make,href:`/motorcycles/${family.makeSlug}`},{label:family.name}]} />
    <div className="page-head"><h1>{family.make} {family.name} price in the Philippines and generations</h1><p>{family.intro} Use this family page for generic {family.name} price research, then open the exact generation before comparing prices or financing.</p></div>
    {current && <div className="price-panel"><div><span>Current {family.name} price reference</span><strong>{observedMarketPriceLabel(current)}</strong><small>{current.make} {current.model} · checked {current.marketPriceCheckedAt || current.verifiedAt}</small></div><Link className="button" href={`/motorcycles/${current.makeSlug}/${current.slug}#price`}>See {current.model} price</Link></div>}
    <div className="section-head compact"><div><h2>Which {family.name} are you looking for?</h2><p>Each generation has its own canonical price page, source date and lifecycle status.</p></div></div>
    <div className="comparison-wrap"><table className="comparison-table"><thead><tr><th>Generation</th><th>Price reference</th><th>Engine</th><th>Seat</th><th>Front tire</th><th>Rear tire</th></tr></thead><tbody>{models.map((m) => m && <tr key={m.id}><td><Link href={`/motorcycles/${m.makeSlug}/${m.slug}#price`}><strong>{m.model}</strong></Link><small>{m.marketStatus === "previous" ? "Previous generation · historical price context" : "Current model · current price page"}</small></td><td><Link className="text-link" href={`/motorcycles/${m.makeSlug}/${m.slug}#price`}>{m.marketStatus === "previous" ? php(m.srp) : observedMarketPriceLabel(m)} →</Link><small>{m.priceContext || (m.marketStatus === "previous" ? "Historical launch reference" : "Dated current reference")}</small></td><td>{m.engineCc} cc</td><td>{m.seatHeightMm} mm</td><td>{m.frontTire}</td><td>{m.rearTire}</td></tr>)}</tbody></table></div>
    <div className="tool-crosslinks">{models.map(m => m && <Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#price`}><b>{m.model} price</b><small>{m.marketStatus === "previous" ? "Historical generation price context." : "Current variants, market checks and installment estimate."}</small></Link>)}</div>
    {family.nicknames && <div className="family-nicknames">
      <div className="section-head inline-head"><div><h2>{family.nicknames.heading}</h2></div></div>
      <div className="split section">
        <div>{family.nicknames.body.map((para) => <p key={para.slice(0, 40)}>{para}</p>)}</div>
        <div className="info-card">
          <h3>Identify yours in 30 seconds</h3>
          <ul className="checklist">
            <li>Read the displacement off the OR/CR — 125, 150 or 160</li>
            <li>Check the model year on the same document, not the ad</li>
            <li>Match the frame and engine numbers to the papers</li>
            <li>Ask any seller quoting a &ldquo;V&rdquo; number which year they mean</li>
          </ul>
          <Link href="/used-motorcycles/buying-checklist">Full used-buying checklist →</Link>
        </div>
      </div>
    </div>}
    <ModelFamilyGuide family={family} models={models.filter((m): m is NonNullable<typeof m> => Boolean(m))} />
    <div className="note-box"><h2>Why generations have separate prices</h2><p>An older generation can still be common on the used market, but its launch SRP is not a current new-bike price. MotoIndex keeps each generation&apos;s price and specifications separate to reduce search-result cannibalization and avoid misleading comparisons.</p></div>
    {faqs.length > 0 && <FaqSection title={`${family.make} ${family.name} price questions`} items={faqs}/>} 
    <JsonLd data={itemList}/>
    <JsonLd data={familyArticle}/>
  </section>;
}
