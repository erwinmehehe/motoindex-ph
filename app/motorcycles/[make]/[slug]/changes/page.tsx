import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GenerationChangeTracker } from "@/components/GenerationChangeTracker";
import { PageHero } from "@/components/ui";
import { getModelById, isIndexableModel } from "@/lib/data";
import { getModelFamily, modelFamilies } from "@/lib/families";
import { latestGenerationTransition } from "@/lib/generationChanges";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams(){
  return modelFamilies.map(family=>({make:family.makeSlug,slug:family.slug}));
}

export async function generateMetadata({params}:{params:Promise<{make:string;slug:string}>}):Promise<Metadata>{
  const {make,slug}=await params;
  const family=getModelFamily(make,slug);
  if(!family)return {};
  const models=family.generationIds.map(getModelById).filter(Boolean);
  const latest=latestGenerationTransition(family.generationIds);
  const index=models.some(model=>Boolean(model&&isIndexableModel(model)));
  return pageMetadata({
    title:`${family.make} ${family.name} Generation Changes: What Changed?`,
    description:latest
      ?`Compare ${latest.from.model} vs ${latest.to.model} plus earlier ${family.make} ${family.name} generation changes, specs, features, price context and whether upgrading makes sense.`
      :`Compare ${family.make} ${family.name} generation and model-year changes in the Philippines.`,
    path:`/motorcycles/${family.makeSlug}/${family.slug}/changes`,
    index
  });
}

export default async function GenerationChangesPage({params}:{params:Promise<{make:string;slug:string}>}){
  const {make,slug}=await params;
  const family=getModelFamily(make,slug);
  if(!family)return notFound();
  const latest=latestGenerationTransition(family.generationIds);

  return <main className="page shell generation-changes-page">
    <Breadcrumbs items={[
      {label:"Motorcycles",href:"/motorcycles"},
      {label:family.make,href:`/motorcycles/${family.makeSlug}`},
      {label:family.name,href:`/motorcycles/${family.makeSlug}/${family.slug}`},
      {label:"Generation changes"}
    ]}/>
    <PageHero
      kicker="Generation & model-year change tracker"
      title={latest
        ?`${family.make} ${latest.from.model} → ${latest.to.model}: what changed?`
        :`${family.make} ${family.name} generation changes`}
      description="See measurable spec deltas first, then sourced changes in electronics, features, storage, suspension and price context where MotoIndex has evidence. The upgrade verdict is a decision aid, not a claim that the newer motorcycle is automatically better."
      actions={<>
        <Link className="button" href={`/motorcycles/${family.makeSlug}/${family.slug}`}>Back to {family.name} family</Link>
        <Link className="button secondary" href="/tools/used-motorcycle-valuation">Value an older bike</Link>
      </>}
    />

    <section className="note-box generation-method-note">
      <strong>How MotoIndex handles generation names</strong>
      <p>Official manufacturer model names take priority. Rider nicknames such as “V2” or “V3” are used only where they map cleanly to MotoIndex&apos;s stored Philippine-market generation records. Historical launch prices remain historical; they are never presented as current used-bike values.</p>
    </section>

    <GenerationChangeTracker family={family}/>

    <section className="info-card">
      <span className="section-kicker">Before spending on an upgrade</span>
      <h2>Compare the real cash difference, not just the generation label</h2>
      <p>Value the motorcycle you already own, confirm the exact successor trim and current dealer quote, then decide whether the changes you care about justify the net cost to switch.</p>
      <div className="hero-actions">
        <Link className="button small" href="/tools/used-motorcycle-valuation">Estimate used value</Link>
        <Link className="button small secondary" href="/dealers">Check dealers</Link>
        <Link className="button small secondary" href="/service-centers">Check service support</Link>
      </div>
    </section>
  </main>;
}
