import type { Metadata } from "next";
import Link from "next/link";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

const models=publicMotorcycles;
export const metadata: Metadata = pageMetadata({ title: 'Motorcycle Accessory Fitment Finder Philippines', description: 'Start with a motorcycle model, check its stock tire sizes and review model-specific accessory mounting records where available.', path: '/fitment', index: models.length>0 });
export default function FitmentPage(){return <section className="page shell"><div className="page-head"><h1>Check what fits your motorcycle</h1><p>Start with the exact motorcycle and stock tire sizes. For accessories, look for a model-specific bracket or mounting record rather than assuming a size or capacity match is enough.</p></div>{models.length?<div className="fitment-model-grid">{models.map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><h2>{m.model}</h2><p><b>Front:</b> {m.frontTire} · <b>Rear:</b> {m.rearTire}</p><strong>Check fitment →</strong></Link>)}</div>:<div className="note-box"><h2>Fitment records are being updated</h2><p>Motorcycle specifications still need checking before the fitment directory is published.</p></div>}</section>}
