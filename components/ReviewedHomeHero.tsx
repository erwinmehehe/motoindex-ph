import Link from "next/link";
import { EntityMedia } from "./EntityMedia";
import { currentPublicMotorcycles } from "@/lib/motorcycleMarket";

export function ReviewedHomeHero() {
  const model=currentPublicMotorcycles.find(model=>model.id==="yamaha-aerox-v3")??currentPublicMotorcycles[0];
  return <section className="reviewed-home-hero shell"><div><span className="entity-kicker">The complete Philippine motorcycle guide</span><h1>Find the right<br />motorcycle for<br />your next ride.</h1><p>Compare prices, specs and features of Philippine motorcycles—from scooters to big bikes.</p><form action="/motorcycles" className="reviewed-home-search"><label className="sr-only" htmlFor="reviewed-home-query">Search motorcycles</label><input id="reviewed-home-query" name="q" placeholder="Search motorcycles (e.g. NMAX, Click, ADV 160…)" /><button className="button" type="submit">Search →</button></form></div>{model&&<Link href={`/motorcycles/${model.makeSlug}/${model.slug}`} aria-label={`Explore ${model.make} ${model.model}`}><EntityMedia entityType="motorcycle" entityId={model.id} priority showCredit={false} sizes="(max-width: 700px) 90vw, 480px" fallback={null} /></Link>}</section>;
}
