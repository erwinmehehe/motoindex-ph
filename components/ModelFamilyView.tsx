import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EntityMedia } from "@/components/EntityMedia";
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
      answer: `The current ${current.make} ${current.model} is priced at ${observedMarketPriceLabel(current)} in the Philippines. Open the current-generation page for variant prices and the latest source date.`
    },
    {
      question: `Which ${family.name} generation is current?`,
      answer: `${current.make} ${current.model} is the current generation. Older generations are kept separate so historical launch prices are not confused with current new-bike prices.`
    },
    {
      question: `Are older and current ${family.name} prices directly comparable?`,
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

  return <article className="model-family-page">
    <section className="model-family-hero">
      <div className="shell">
        <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:family.make,href:`/motorcycles/${family.makeSlug}`},{label:family.name}]} />
        <div className="model-family-hero-grid">
          <div className="model-family-hero-copy">
            <span className="entity-kicker">Model family · Philippines</span>
            <h1>{family.make} {family.name} prices and generations</h1>
            <p>{family.intro} Use this page to identify the exact generation first, then open that model for its price sources, specs, financing and ownership details.</p>
            <div className="model-family-actions">
              <a className="button" href="#generations">Compare generations</a>
              <Link className="button secondary" href={{pathname:"/compare",query:{make:family.makeSlug}}}>Open comparison tool</Link>
            </div>
          </div>
          {current && <aside className="model-family-current-card">
            <EntityMedia
              entityType="motorcycle"
              entityId={current.id}
              className="model-family-current-media"
              linkHref={`/motorcycles/${current.makeSlug}/${current.slug}`}
              showCredit={false}
              fallback={<Link className="model-family-media-fallback" href={`/motorcycles/${current.makeSlug}/${current.slug}`}><span>Current generation</span><strong>{current.make}<b>{current.model}</b></strong></Link>}
            />
            <div className="model-family-current-copy">
              <span>Current generation</span>
              <h2>{current.make} {current.model}</h2>
              <strong>{observedMarketPriceLabel(current)}</strong>
              <small>Price basis checked {current.marketPriceCheckedAt || current.verifiedAt}</small>
              <Link href={`/motorcycles/${current.makeSlug}/${current.slug}`}>Open full model guide →</Link>
            </div>
          </aside>}
        </div>
      </div>
    </section>

    <div className="shell model-family-body">
      <nav className="model-family-nav" aria-label={`${family.make} ${family.name} page sections`}>
        <a href="#generations">Generations</a>
        <a href="#quick-compare">Quick compare</a>
        {family.nicknames && <a href="#names">Naming guide</a>}
        <a href="#buying-guide">Buying guide</a>
        <a href="#faq">FAQ</a>
      </nav>

      <section id="generations" className="model-family-section">
        <div className="section-head compact"><div><span className="section-kicker">Choose the exact model</span><h2>Which {family.name} are you looking for?</h2><p>Every generation below has its own canonical model page, lifecycle context and price source date.</p></div></div>
        <div className="model-family-generation-grid">{models.map((m) => {
          if (!m) return null;
          const previous = m.marketStatus === "previous";
          return <article className={`model-family-generation-card${m.id === family.currentModelId ? " is-current" : ""}`} key={m.id}>
            <EntityMedia
              entityType="motorcycle"
              entityId={m.id}
              className="model-family-generation-media"
              linkHref={`/motorcycles/${m.makeSlug}/${m.slug}`}
              showCredit={false}
              fallback={<Link className="model-family-generation-fallback" href={`/motorcycles/${m.makeSlug}/${m.slug}`}><span>{previous ? "Previous generation" : "Current generation"}</span><strong>{m.model}</strong></Link>}
            />
            <div className="model-family-generation-copy">
              <div className="model-family-generation-topline"><span>{previous ? "Previous generation" : "Current model"}</span>{m.id === family.currentModelId && <b>Current</b>}</div>
              <h3>{m.make} {m.model}</h3>
              <strong className="model-family-generation-price">{previous ? php(m.srp) : observedMarketPriceLabel(m)}</strong>
              <small>{previous ? "Historical launch price context" : `Price checked ${m.marketPriceCheckedAt || m.verifiedAt}`}</small>
              <div className="model-family-generation-facts">
                <span><small>Engine</small><b>{m.engineCc} cc</b></span>
                <span><small>Seat</small><b>{m.seatHeightMm} mm</b></span>
                <span><small>Weight</small><b>{m.curbWeightKg} kg</b></span>
                <span><small>Tires</small><b>{m.frontTire} / {m.rearTire}</b></span>
              </div>
              <Link className="button small" href={`/motorcycles/${m.makeSlug}/${m.slug}`}>View {m.model}</Link>
            </div>
          </article>;
        })}</div>
      </section>

      <section id="quick-compare" className="model-family-section model-family-compare-section">
        <div className="section-head compact"><div><span className="section-kicker">Quick comparison</span><h2>What changes from one {family.name} to another?</h2><p>Use this compact view for the first pass. Open the generation card above before using any price as a purchase reference.</p></div></div>
        <div className="model-family-compare-list">
          {models.map((m) => m && <Link href={`/motorcycles/${m.makeSlug}/${m.slug}`} key={m.id}>
            <span className="model-family-compare-name"><small>{m.marketStatus === "previous" ? "Previous" : "Current"}</small><strong>{m.model}</strong></span>
            <span><small>Price</small><b>{m.marketStatus === "previous" ? php(m.srp) : observedMarketPriceLabel(m)}</b></span>
            <span><small>Engine</small><b>{m.engineCc} cc</b></span>
            <span><small>Seat</small><b>{m.seatHeightMm} mm</b></span>
            <span><small>Weight</small><b>{m.curbWeightKg} kg</b></span>
            <strong aria-hidden="true">→</strong>
          </Link>)}
        </div>
      </section>

      {family.nicknames && <section id="names" className="model-family-section model-family-nickname-section">
        <div className="model-family-nickname-copy">
          <span className="section-kicker">Naming guide</span>
          <h2>{family.nicknames.heading}</h2>
          {family.nicknames.body.map((para) => <p key={para.slice(0, 40)}>{para}</p>)}
        </div>
        <aside className="model-family-identify-card">
          <span>Identify yours correctly</span>
          <h3>Use the papers, not the nickname.</h3>
          <ul className="checklist">
            <li>Read the displacement from the OR/CR</li>
            <li>Check the model year on the same document</li>
            <li>Match the frame and engine numbers to the papers</li>
            <li>Ask any seller using a “V” number which exact year and displacement they mean</li>
          </ul>
          <Link href="/used-motorcycles/buying-checklist">Open used-buying checklist →</Link>
        </aside>
      </section>}

      <section id="buying-guide" className="model-family-section model-family-guide-section">
        <ModelFamilyGuide family={family} models={models.filter((m): m is NonNullable<typeof m> => Boolean(m))} />
      </section>

      <section className="model-family-note">
        <span>Why separate generations?</span>
        <h2>Historical launch prices are not current new-bike prices.</h2>
        <p>An older generation can still be common on the used market, but its launch SRP should not be presented as today's dealer price. Generation pages stay separate so each price remains tied to the correct motorcycle and market context.</p>
      </section>

      {faqs.length > 0 && <section id="faq" className="model-family-section model-family-faq-section"><FaqSection title={`${family.make} ${family.name} price questions`} items={faqs}/></section>}
    </div>
    <JsonLd data={itemList}/>
    <JsonLd data={familyArticle}/>
  </article>;
}
