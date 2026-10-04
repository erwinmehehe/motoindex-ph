import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { motorcycles, getModel, getModelById, isIndexableModel } from "@/lib/data";
import { getModelFamily, modelFamilies } from "@/lib/families";
import { ModelFamilyView } from "@/components/ModelFamilyView";
import { MotorcycleEntityPage } from "@/components/MotorcycleEntityPage";
import { PriorityModelBrief } from "@/components/PriorityModelBrief";
import { GrowthModelBrief } from "@/components/GrowthModelBrief";
import { DecisionPath } from "@/components/DecisionPath";
import { RecentlyViewedTracker } from "@/components/RecentlyViewed";
import { pageMetadata } from "@/lib/site";
import { motorcycleEntitySeo } from "@/lib/motorcycleEntitySeo";
import { priorityModelGrowthProfile } from "@/lib/priorityModelGrowth";
import { modelIntentDepthProfile } from "@/lib/modelIntentDepth2026";
import { getRenderableMedia } from "@/lib/renderableMedia";
import { ElectricMotorcycleDetail } from "@/components/ElectricMotorcycleDetail";
import { DealerInventoryPanel } from "@/components/DealerInventoryPanel";
import { electricMotorcycles, getElectricMotorcycle } from "@/lib/electricMotorcycles";

const LEGACY_MODEL_REDIRECTS: Record<string, { make: string; slug: string; title: string; description: string }> = {
  "kawasaki/z400": {
    make: "kawasaki",
    slug: "z500",
    title: "Kawasaki Z400 Price Philippines | Z500 Current Model",
    description: "Kawasaki Z400 research now continues on the current Kawasaki Z500 page, with Z400 legacy context and current Philippine Z500 pricing."
  }
};

function legacyTarget(make: string, slug: string) {
  return LEGACY_MODEL_REDIRECTS[`${make}/${slug}`];
}

export function generateStaticParams() {
  return [
    ...motorcycles.map((m) => ({ make: m.makeSlug, slug: m.slug })),
    ...modelFamilies.map((f) => ({ make: f.makeSlug, slug: f.slug })),
    ...electricMotorcycles.map((m) => ({ make: "electric", slug: m.slug })),
    { make: "honda", slug: "crf250-rally" },
    ...Object.keys(LEGACY_MODEL_REDIRECTS).map((key) => {
      const [make, slug] = key.split("/");
      return { make, slug };
    })
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  if (make === "electric") {
    const electricModel = getElectricMotorcycle(slug);
    if (!electricModel) return {};
    return pageMetadata({
      title: `${electricModel.make} ${electricModel.model} Price, Range & Specs Philippines`,
      description: `${electricModel.make} ${electricModel.model} electric motorcycle price, battery capacity, claimed range, charging time, maximum speed and LTO classification in the Philippines.`,
      path: `/motorcycles/electric/${electricModel.slug}`,
      image: electricModel.imageUrl
    });
  }
  if (make === "honda" && slug === "crf250-rally") {
    return pageMetadata({
      title: "Honda CRF250 Rally Successor: CRF300 Rally Philippines",
      description: "Honda Philippines identifies the CRF300 Rally as the successor-generation model for CRF250 Rally research.",
      path: "/motorcycles/honda/crf300-rally",
      index: false
    });
  }
  const legacy = legacyTarget(make, slug);
  if (legacy) {
    return pageMetadata({
      title: legacy.title,
      description: legacy.description,
      path: `/motorcycles/${legacy.make}/${legacy.slug}`,
      index: false
    });
  }
  const family = getModelFamily(make, slug);
  if (family) {
    const familyModels = family.generationIds.map(getModelById);
    const index = familyModels.some((m) => Boolean(m && isIndexableModel(m)));
    const current = getModelById(family.currentModelId);
    const media = current ? getRenderableMedia("motorcycle", current.id)[0] : undefined;
    const base = pageMetadata({
      title: family.seoTitle,
      description: family.seoDescription,
      path: `/motorcycles/${family.makeSlug}/${family.slug}`,
      index,
      image: media?.src,
      imageAlt: media?.alt || `${family.make} ${family.name} current generation`,
      imageWidth: media?.width,
      imageHeight: media?.height
    });
    return { ...base, keywords: [`${family.make} ${family.name} price Philippines`, ...family.secondaryKeywords] };
  }
  const model = getModel(make, slug);
  if (!model) return {};
  const seo = motorcycleEntitySeo(model);
  const growth = priorityModelGrowthProfile(model.id);
  const intentDepth = modelIntentDepthProfile(model.id);
  const media = getRenderableMedia("motorcycle", model.id)[0];
  const image = getRenderableMedia("motorcycle", model.id)[0]?.src;
  const base = pageMetadata({
    title: intentDepth?.seoTitle || growth?.seoTitle || seo.title,
    description: intentDepth?.seoDescription || growth?.seoDescription || seo.description,
    path: `/motorcycles/${model.makeSlug}/${model.slug}`,
    index: isIndexableModel(model),
    image,
    imageAlt: media?.alt || `${model.make} ${model.model} motorcycle`,
    imageWidth: media?.width,
    imageHeight: media?.height
  });
  return { ...base, keywords: seo.keywords };
}

export default async function ModelPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  if (make === "electric") {
    const electricModel = getElectricMotorcycle(slug);
    if (!electricModel) return notFound();
    return <ElectricMotorcycleDetail model={electricModel}/>;
  }
  if (make === "honda" && slug === "crf250-rally") permanentRedirect("/motorcycles/honda/crf300-rally");
  const legacy = legacyTarget(make, slug);
  if (legacy) permanentRedirect(`/motorcycles/${legacy.make}/${legacy.slug}`);
  const family = getModelFamily(make, slug);
  if (family) return <ModelFamilyView family={family}/>;
  const model = getModel(make, slug);
  if (!model) return notFound();
  return <>
    <RecentlyViewedTracker model={{ id: model.id, make: model.make, model: model.model, makeSlug: model.makeSlug, slug: model.slug }} />
    <MotorcycleEntityPage model={model} />
    {(!model.marketStatus||model.marketStatus==="current")&&<div className="shell"><DealerInventoryPanel modelId={model.id} makeSlug={model.makeSlug} modelSlug={model.slug}/></div>}
    <PriorityModelBrief model={model} />
    <GrowthModelBrief model={model} />
    {!model.marketStatus || model.marketStatus === "current" ? <div className="shell model-decision-path-wrap"><DecisionPath stage="model" modelName={`${model.make} ${model.model}`} make={model.make} makeSlug={model.makeSlug} modelSlug={model.slug} /></div> : null}
  </>;
}
