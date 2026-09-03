import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { similarMotorcycles } from "@/lib/similar";
import { observedMarketPriceLabel } from "@/lib/marketChecks";

function Group({title,models}:{title:string;models:Motorcycle[]}){if(!models.length)return null;return <div className="similar-group"><h3>{title}</h3>{models.map(m=><Link href={`/motorcycles/${m.makeSlug}/${m.slug}`} key={m.id}><span><b>{m.make} {m.model}</b><small>{observedMarketPriceLabel(m)} · {m.engineCc} cc · {m.seatHeightMm} mm seat</small></span><strong>→</strong></Link>)}</div>}
export function SimilarMotorcycles({model}:{model:Motorcycle}){const groups=similarMotorcycles(model);return <section className="similar-models"><div className="section-head compact"><div><h2>Motorcycles with similar specs or price</h2><p>Grouped by current price, engine size, category, transmission and seat height.</p></div></div><div className="similar-grid"><Group title="Closest overall" models={groups.similar}/><Group title="Lower-price options" models={groups.cheaper}/><Group title="Lower-seat options" models={groups.lowerSeat}/></div></section>}
