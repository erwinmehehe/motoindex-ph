import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { motorcycles, getModel, getModelById, isIndexableModel } from "@/lib/data";
import { getModelFamily, modelFamilies } from "@/lib/families";
import { ModelFamilyView } from "@/components/ModelFamilyView";
import { MotorcycleEntityPage } from "@/components/MotorcycleEntityPage";
import { PriorityModelBrief } from "@/components/PriorityModelBrief";
import { DecisionPath } from "@/components/DecisionPath";
import { RecentlyViewedTracker } from "@/components/RecentlyViewed";
import { pageMetadata } from "@/lib/site";
import { motorcycleEntitySeo } from "@/lib/motorcycleEntitySeo";

export function generateStaticParams() {
  return [
    ...motorcycles.map((m) => ({ make: m.makeSlug, slug: m.slug })),
    ...modelFamilies.map((f) => ({ make: f.makeSlug, slug: f.slug }))
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  const family = getModelFamily(make, slug);
  if (family) {
    const familyModels = family.generationIds.map(getModelById);
    const index = familyModels.some((m) => Boolean(m && isIndexableModel(m)));
    return pageMetadata({
      title: `${family.make} ${family.name} Price & Specs Philippines`,
      description: `${family.make} ${family.name} price and specs in the Philippines, with current-generation details, generation context and linked price sources.`,
      path: `/motorcycles/${family.makeSlug}/${family.slug}`,
      index
    });
  }
  const model = getModel(make, slug);
  if (!model) return {};
  const seo = motorcycleEntitySeo(model);
  const base = pageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/motorcycles/${model.makeSlug}/${model.slug}`,
    index: isIndexableModel(model)
  });
  return { ...base, keywords: seo.keywords };
}

export default async function ModelPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const family = getModelFamily(make, slug);
  if (family) return <ModelFamilyView family={family}/>;
  const model = getModel(make, slug);
  if (!model) return notFound();
  return <>
    <RecentlyViewedTracker model={{ id: model.id, make: model.make, model: model.model, makeSlug: model.makeSlug, slug: model.slug }} />
    <MotorcycleEntityPage model={model} />
    <PriorityModelBrief model={model} />
    {!model.marketStatus || model.marketStatus === "current" ? <div className="shell model-decision-path-wrap"><DecisionPath stage="model" modelName={`${model.make} ${model.model}`} make={model.make} makeSlug={model.makeSlug} modelSlug={model.slug} /></div> : null}
  </>;
}
