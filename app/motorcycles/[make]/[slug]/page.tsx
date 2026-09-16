import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { motorcycles, getModel, getModelById, isIndexableModel } from "@/lib/data";
import { getModelFamily, modelFamilies } from "@/lib/families";
import { ModelFamilyView } from "@/components/ModelFamilyView";
import { MotorcycleEntityPage } from "@/components/MotorcycleEntityPage";
import { GlobalMotorcycleEntityPage } from "@/components/GlobalMotorcycleEntityPage";
import { PriorityModelBrief } from "@/components/PriorityModelBrief";
import { GrowthModelBrief } from "@/components/GrowthModelBrief";
import { PriorityCommercialIntent } from "@/components/PriorityCommercialIntent";
import { DecisionPath } from "@/components/DecisionPath";
import { RecentlyViewedTracker } from "@/components/RecentlyViewed";
import { ShareModelButton } from "@/components/ShareModelButton";
import { pageMetadata } from "@/lib/site";
import { motorcycleEntitySeo } from "@/lib/motorcycleEntitySeo";
import { priorityModelGrowthProfile } from "@/lib/priorityModelGrowth";
import { getRenderableMedia } from "@/lib/renderableMedia";
import { isGlobalOnlyModel } from "@/lib/marketScope";
import styles from "./ModelPage.module.css";

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
  const image = getRenderableMedia("motorcycle", model.id)[0]?.src;
  if (isGlobalOnlyModel(model)) {
    const name = `${model.make} ${model.model}`;
    const displacement = model.engineCc ? `${model.engineCc}cc` : "electric";
    const base = pageMetadata({
      title: `${name} Specs, Weight & Seat Height`,
      description: `${name} global ${displacement} specs, power, weight, seat height, tires and market status. Kept separate from Philippine pricing, financing and dealer tools.`,
      path: `/motorcycles/${model.makeSlug}/${model.slug}`,
      index: isIndexableModel(model),
      image
    });
    return {
      ...base,
      keywords: [
        `${name.toLowerCase()} specs`,
        `${name.toLowerCase()} weight`,
        `${name.toLowerCase()} seat height`,
        `${name.toLowerCase()} horsepower`,
        `${name.toLowerCase()} tire size`
      ]
    };
  }
  const seo = motorcycleEntitySeo(model);
  const growth = priorityModelGrowthProfile(model.id);
  const base = pageMetadata({
    title: growth?.seoTitle || seo.title,
    description: growth?.seoDescription || seo.description,
    path: `/motorcycles/${model.makeSlug}/${model.slug}`,
    index: isIndexableModel(model),
    image
  });
  return { ...base, keywords: seo.keywords };
}

export default async function ModelPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const family = getModelFamily(make, slug);
  if (family) return <ModelFamilyView family={family}/>;
  const model = getModel(make, slug);
  if (!model) return notFound();
  if (isGlobalOnlyModel(model)) {
    return <div className={styles.refined}>
      <RecentlyViewedTracker model={{ id: model.id, make: model.make, model: model.model, makeSlug: model.makeSlug, slug: model.slug }} />
      <div className="model-floating-share"><ShareModelButton label="Share model" /></div>
      <GlobalMotorcycleEntityPage model={model} />
    </div>;
  }
  return <div className={styles.refined}>
    <RecentlyViewedTracker model={{ id: model.id, make: model.make, model: model.model, makeSlug: model.makeSlug, slug: model.slug }} />
    <div className="model-floating-share"><ShareModelButton label="Share model" /></div>
    <MotorcycleEntityPage model={model} />
    <PriorityModelBrief model={model} />
    <GrowthModelBrief model={model} />
    <PriorityCommercialIntent model={model} />
    {!model.marketStatus || model.marketStatus === "current" ? <div className="shell model-decision-path-wrap"><DecisionPath stage="model" modelName={`${model.make} ${model.model}`} make={model.make} makeSlug={model.makeSlug} modelSlug={model.slug} /></div> : null}
  </div>;
}
