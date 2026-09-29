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
import { AuthorBox } from "@/components/AuthorBox";
import { authorPersonSchema } from "@/lib/author";

export function ModelFamilyView({ family }: { family: ModelFamily }) {
  const models = getFamilyModels(family);
  const current = models.find((m) => m?.id === family.currentModelId);
  const previous = models.find((m) => m && m.id !== family.currentModelId);
  const generationDelta = current && previous ? {
    engine: current.engineCc - previous.engineCc,
    power: Number((current.powerHp - previous.powerHp).toFixed(1)),
    seat: current.seatHeightMm - previous.seatHeightMm,
    weight: current.curbWeightKg - previous.curbWeightKg,
  } : undefined;
  const comparisonAnswer = current && previous
    ? `${current.make} ${current.model} uses a ${current.engineCc} cc engine versus ${previous.engineCc} cc on the ${previous.model}. It records ${current.powerHp} hp versus ${previous.powerHp} hp, a ${current.seatHeightMm} mm seat versus ${previous.seatHeightMm} mm, and ${current.curbWeightKg} kg curb weight versus ${previous.curbWeightKg} kg. Use those measurable changes with price, braking, tires and the exact model year rather than relying on the generation nickname alone.`
    : family.intro;
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
      question: family.comparisonHeading,
      answer: comparisonAnswer
    },
    {
      question: `Are older and current ${family.name} prices directly comparable?`,
      answer: "Not as current new-bike quotes. A previous generation may now trade mainly on the used market, while the current generation uses current SRP or market observations. Compare the generation context and source dates before using the numbers."
    },
    {
      question: `Should I buy the current or previous ${family.name} generation?`,
      answer: `The current ${current.model} is the relevant starting point for a new-bike purchase. A previous generation can make sense as a used-bike comparison when the condition, paperwork, maintenance history and total price are stronger. Compare the exact units rather than assuming the newer or older generation is automatically the better purchase.`
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
      url: absoluteUrl(`/motorcycles/${m.makeSlug}/${m.slug}`)
    })).filter(Boolean)
  };

  const familyArticle = articleSchema({
    headline: `${family.make} ${family.name} price and specs in the Philippines`,
    description: family.intro,
    path: `/motorcycles/${family.makeSlug}/${family.slug}`,
    about: `${family.name} price philippines`,
    keywords: [`${family.make} ${family.name} price`, `${family.name} specs Philippines`, ...family.secondaryKeywords],
    checkedDates: models.map(m => m?.marketPriceCheckedAt || m?.verifiedAt)
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl(`/motorcycles/${family.makeSlug}/${family.slug}#faq`),
    author: { "@id": `${absoluteUrl("/authors/erwin-valles")}#person` },
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };
  const authorSchema = { "@context": "https://schema.org", ...authorPersonSchema() };

  return <article className="model-family-page">
    <section className="model-family-hero">
      <div className="shell">
        <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:family.make,href:`/motorcycles/${family.makeSlug}`},{label:family.name}]} />
        <div className="model-family-hero-grid">
          <div className="model-family-hero-copy">
            <span className="entity-kicker">Model family · Philippines</span>
            <h1>{family.make} {family.name} prices and generations</h1>
            <p>{family.intro} Use this page to identify the exact generation first, then open that model for its price sources, specs, financing and ownership details.</p>
            {current && <div className="model-family-direct-answer">
              <span>Current generation</span>
              <strong>{current.make} {current.model} · {observedMarketPriceLabel(current)}</strong>
              <small>{models.length} generations compared on this page</small>
            </div>}
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
              forceFill
              sizes="(max-width: 620px) 132px, (max-width: 900px) 240px, 380px"
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
        <div className="section-head compact"><div><span className="section-kicker">Choose the exact model</span><h2>Which {family.name} are you looking for?</h2><p>Open a generation below to see its price, current-market status and model-specific details.</p></div></div>
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
              forceFill
              sizes="(max-width: 620px) calc(100vw - 32px), (max-width: 900px) 45vw, 360px"
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
        <div className="section-head compact"><div><span className="section-kicker">Generation comparison</span><h2>{family.comparisonHeading}</h2><p>Use this compact view for the first pass. Open the generation card above before using any price as a purchase reference.</p></div></div>
        {current && previous && generationDelta && <div className="model-family-change-grid" aria-label={family.comparisonHeading}>
          <div><span>Engine</span><strong>{current.engineCc} cc</strong><small>{generationDelta.engine === 0 ? "Same displacement" : `${generationDelta.engine > 0 ? "+" : ""}${generationDelta.engine} cc vs ${previous.model}`}</small></div>
          <div><span>Power</span><strong>{current.powerHp} hp</strong><small>{generationDelta.power === 0 ? "Same recorded output" : `${generationDelta.power > 0 ? "+" : ""}${generationDelta.power} hp vs ${previous.model}`}</small></div>
          <div><span>Seat height</span><strong>{current.seatHeightMm} mm</strong><small>{generationDelta.seat === 0 ? "Same published seat" : `${generationDelta.seat > 0 ? "+" : ""}${generationDelta.seat} mm vs ${previous.model}`}</small></div>
          <div><span>Curb weight</span><strong>{current.curbWeightKg} kg</strong><small>{generationDelta.weight === 0 ? "Same recorded weight" : `${generationDelta.weight > 0 ? "+" : ""}${generationDelta.weight} kg vs ${previous.model}`}</small></div>
        </div>}
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

      {faqs.length > 0 && <section id="faq" className="model-family-section model-family-faq-section"><FaqSection title={`${family.make} ${family.name} price and generation FAQs`} items={faqs}/></section>}
      <AuthorBox />
    </div>
    <JsonLd data={[itemList, familyArticle, faqSchema, authorSchema]}/>
  </article>;
}
