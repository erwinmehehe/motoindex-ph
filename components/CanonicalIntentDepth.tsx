import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { getModelById, isIndexableModel } from "@/lib/data";
import { priorityModelGrowthProfile } from "@/lib/priorityModelGrowth";
import {
  canonicalIntentAnswer,
  canonicalIntentQuestion,
  modelIntentDepthProfile,
  type CanonicalIntentKey,
} from "@/lib/modelIntentDepth2026";
import { SectionHeader } from "@/components/ui";
import { hasColorIntentLandingPage } from "@/lib/modelColorLandingPages";
import { hasTopSpeedLandingPage } from "@/lib/modelTopSpeedLandingPages";
import { hasSpecsIntentLandingPage } from "@/lib/modelSpecsLandingPages";

const labels: Record<CanonicalIntentKey, string> = {
  price: "Price",
  specs: "Specifications",
  colors: "Colors",
  variants: "Variants",
  performance: "Performance",
  ownership: "Ownership",
};

export function CanonicalIntentDepth({ model }: { model: Motorcycle }) {
  const profile = modelIntentDepthProfile(model.id);
  if (!profile) return null;

  const growth = priorityModelGrowthProfile(model.id);
  const visibleIntents = profile.intents.filter((intent) => !(intent === "colors" && hasColorIntentLandingPage(model.id)) && !(intent === "performance" && hasTopSpeedLandingPage(model.id)) && !(intent === "specs" && hasSpecsIntentLandingPage(model.id)));
  const alternatives = (growth?.alternativeIds || [])
    .map(getModelById)
    .filter((item): item is Motorcycle => Boolean(item && isIndexableModel(item)));
  const alternativeIds = new Set(alternatives.map((item) => item.id));
  const related = (growth?.relatedIds || [])
    .map(getModelById)
    .filter((item): item is Motorcycle => Boolean(item && isIndexableModel(item) && !alternativeIds.has(item.id)));

  return <section id="buyer-answers" className="motorcycle-entity-section canonical-intent-depth">
    <SectionHeader
      kicker="Buyer answers"
      title={`${model.make} ${model.model}: price, specs and key buying questions`}
      description={profile.intro}
    />
    <div className="motorcycle-editorial-grid canonical-intent-grid" role="list">
      {visibleIntents.map((intent) => <article key={intent} role="listitem">
        <span>{labels[intent]}</span>
        <h3>{canonicalIntentQuestion(model, intent)}</h3>
        <p>{canonicalIntentAnswer(model, intent)}</p>
      </article>)}
    </div>

    {growth && <div className="motorcycle-editorial-grid canonical-intent-grid" role="list" aria-label={`Questions to answer before buying the ${model.make} ${model.model}`}>
      <article role="listitem">
        <span>Budget question</span>
        <h3>{growth.moneyQuestion}</h3>
        <p>Use the price and financing sections below with the actual dealer quote so the decision includes registration, insurance and branch-specific charges.</p>
      </article>
      <article role="listitem">
        <span>Ownership question</span>
        <h3>{growth.ownershipQuestion}</h3>
        <p>Use the ownership, tire, maintenance and rider-fit sections below to compare the recurring costs and practical trade-offs that matter after purchase.</p>
      </article>
    </div>}

    {growth && <div className="entity-tool-grid canonical-intent-links">
      {alternatives.slice(0, 3).map((alt) => <Link key={alt.id} href={`/motorcycles/${alt.makeSlug}/${alt.slug}`}>
        <span>Direct alternative</span>
        <strong>Compare with {alt.make} {alt.model}</strong>
        <small>Compare price, specifications, rider fit and ownership before deciding.</small>
      </Link>)}
      {related.slice(0, 2).map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>
        <span>Related model</span>
        <strong>{item.make} {item.model}</strong>
        <small>Continue into the closest related model or generation in the MotoIndex catalog.</small>
      </Link>)}
      <Link href={growth.recommendationHref}>
        <span>Buying guide</span>
        <strong>{growth.recommendationLabel}</strong>
        <small>Compare this model inside the broader Philippine buying shortlist.</small>
      </Link>
      <Link href={`/motorcycles/${model.makeSlug}`}>
        <span>Brand research</span>
        <strong>All {model.make} motorcycles</strong>
        <small>Compare the rest of the current and historical {model.make} catalog.</small>
      </Link>
      <Link href="/compare">
        <span>Comparison tool</span>
        <strong>Compare motorcycles side by side</strong>
        <small>Put shortlisted models into one specification and price comparison.</small>
      </Link>
    </div>}

    <p className="entity-section-note">Use these quick answers to confirm the exact model and trim, then continue into detailed pricing, rider fit, ownership costs and alternatives below.</p>
  </section>;
}
