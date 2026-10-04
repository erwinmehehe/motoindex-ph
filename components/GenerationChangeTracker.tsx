import Link from "next/link";
import type { ModelFamily } from "@/lib/families";
import {
  generationTransitionsForIds,
  type GenerationChangeCategory,
  type GenerationTransition,
} from "@/lib/generationChanges";

const categoryLabel: Record<GenerationChangeCategory,string> = {
  engine:"Engine",
  electronics:"Electronics",
  dimensions:"Dimensions",
  storage:"Storage",
  suspension:"Suspension",
  features:"Features",
  price:"Price context",
};

function SourceLink({ url, label }: { url:string; label:string }) {
  if (url.startsWith("/")) return <Link href={url}>{label}</Link>;
  return <a href={url} target="_blank" rel="noreferrer">{label} ↗</a>;
}

function TransitionCard({ transition, featured=false }: { transition:GenerationTransition; featured?:boolean }) {
  return <article className={`generation-change-card${featured?" is-featured":""}`} id={transition.id}>
    <header className="generation-change-head">
      <div>
        <span className="section-kicker">{featured?"Latest generation change":"Generation step"}</span>
        <h2>{transition.from.make} {transition.from.model} → {transition.to.model}</h2>
        <p>{transition.summary}</p>
      </div>
      <div className="generation-verdict">
        <span>Upgrade verdict</span>
        <strong>{transition.upgrade.verdict}</strong>
        <small>{transition.curated?"Sourced change notes + stored spec deltas":"Stored spec deltas; qualitative changes not yet curated"}</small>
      </div>
    </header>

    <section className="generation-delta-section" aria-label={`${transition.from.model} to ${transition.to.model} measurable changes`}>
      <div className="section-head compact"><div><span className="section-kicker">Measurable changes</span><h3>What changed in the stored specs?</h3><p>Price rows keep each generation&apos;s own time context. Historical launch SRP is not treated as a current used value.</p></div></div>
      <div className="generation-delta-grid">
        {transition.measurable.map(item=><div className={`generation-delta-item tone-${item.tone}`} key={item.key}>
          <span>{item.label}</span>
          <strong>{item.from} → {item.to}</strong>
          <small>{item.delta}</small>
        </div>)}
      </div>
    </section>

    {transition.notes.length>0 ? <section className="generation-notes">
      <div className="section-head compact"><div><span className="section-kicker">Sourced change log</span><h3>What changed beyond the headline specs?</h3><p>These notes are limited to differences MotoIndex can tie to the stored or cited Philippine-market sources.</p></div></div>
      <div className="generation-note-list">
        {transition.notes.map((note,index)=><article className="info-card" key={`${note.category}-${note.title}`}>
          <div className="generation-note-top"><span>{categoryLabel[note.category]}</span><b>Change {index+1}</b></div>
          <h4>{note.title}</h4>
          {(note.from||note.to)&&<div className="generation-before-after">
            <div><small>{transition.from.model}</small><p>{note.from||"No sourced baseline recorded."}</p></div>
            <div><small>{transition.to.model}</small><p>{note.to||"No sourced successor figure recorded."}</p></div>
          </div>}
          <p><strong>Why it matters:</strong> {note.impact}</p>
          <small><SourceLink url={note.sourceUrl} label={note.sourceLabel}/></small>
        </article>)}
      </div>
    </section> : <div className="note-box">
      <strong>Qualitative change log not published yet</strong>
      <p>MotoIndex has enough data to compare the stored specs above, but it does not publish an electronics, storage, suspension or feature change unless a checked source supports it.</p>
    </div>}

    <section className="generation-upgrade-box">
      <div>
        <span className="section-kicker">Should you upgrade?</span>
        <h3>{transition.upgrade.verdict}</h3>
        <p>{transition.upgrade.bottomLine}</p>
      </div>
      <div className="generation-upgrade-columns">
        <article>
          <strong>Upgrade makes more sense when</strong>
          <ul>{transition.upgrade.bestReasons.map(item=><li key={item}>{item}</li>)}</ul>
        </article>
        <article>
          <strong>Keeping {transition.from.model} can make more sense when</strong>
          <ul>{transition.upgrade.keepPreviousIf.map(item=><li key={item}>{item}</li>)}</ul>
        </article>
      </div>
      <div className="hero-actions">
        <Link className="button small" href={`/motorcycles/${transition.to.makeSlug}/${transition.to.slug}`}>Research {transition.to.model}</Link>
        <Link className="button small secondary" href={`/motorcycles/${transition.from.makeSlug}/${transition.from.slug}`}>Research {transition.from.model}</Link>
        <Link className="button small secondary" href="/tools/used-motorcycle-valuation">Value the older bike</Link>
      </div>
    </section>
  </article>;
}

export function GenerationChangeTracker({ family, compact=false }: { family:ModelFamily; compact?:boolean }) {
  const transitions=generationTransitionsForIds(family.generationIds);
  if(!transitions.length)return null;
  const latest=transitions[transitions.length-1];

  if(compact){
    return <section className="generation-change-preview">
      <div>
        <span className="section-kicker">Generation change tracker</span>
        <h2>{latest.from.model} → {latest.to.model}: what actually changed?</h2>
        <p>{latest.summary}</p>
      </div>
      <div className="generation-preview-facts">
        {latest.measurable.slice(0,4).map(item=><span key={item.key}><small>{item.label}</small><strong>{item.delta}</strong></span>)}
      </div>
      <div className="hero-actions">
        <Link className="button small" href={`/motorcycles/${family.makeSlug}/${family.slug}/changes`}>Open full change tracker</Link>
        <a className="button small secondary" href={`#${latest.id}`}>{latest.upgrade.verdict}</a>
      </div>
    </section>;
  }

  return <div className="generation-change-tracker">
    {transitions.map((transition,index)=><TransitionCard
      transition={transition}
      featured={index===transitions.length-1}
      key={transition.id}
    />)}
  </div>;
}
