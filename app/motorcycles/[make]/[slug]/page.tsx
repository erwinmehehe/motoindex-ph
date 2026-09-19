import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { motorcycles, getModel, getModelById, isIndexableModel } from "@/lib/data";
import { getModelFamily, modelFamilies } from "@/lib/families";
import { ModelFamilyView } from "@/components/ModelFamilyView";
import { MotorcycleEntityPage } from "@/components/MotorcycleEntityPage";
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
import styles from "./ModelPage.module.css";

const LEGACY_MODEL_REDIRECTS: Record<string, { make: string; slug: string; title: string; description: string }> = {
  "honda/rs150r": {
    make: "honda",
    slug: "winner-x",
    title: "Honda RS150R Price Philippines | Winner X Current Model",
    description: "Honda RS150R research now continues on the current Honda Winner X page, with legacy RS150R context, current pricing and specifications."
  },
  "kawasaki/z400": {
    make: "kawasaki",
    slug: "z500",
    title: "Kawasaki Z400 Price Philippines | Z500 Current Model",
    description: "Kawasaki Z400 research now continues on the current Kawasaki Z500 page, with Z400 legacy context and current Philippine Z500 pricing."
  },
  "yamaha/mio-sporty": {
    make: "yamaha",
    slug: "mio-i-125",
    title: "Yamaha Mio Sporty Price Philippines | Current Mio Guide",
    description: "Yamaha Mio Sporty research now continues on the current Mio i 125 page, with Mio Sporty legacy context and current Yamaha commuter alternatives."
  }
};

function legacyTarget(make: string, slug: string) {
  return LEGACY_MODEL_REDIRECTS[`${make}/${slug}`];
}

export function generateStaticParams() {
  return [
    ...motorcycles.map((m) => ({ make: m.makeSlug, slug: m.slug })),
    ...modelFamilies.map((f) => ({ make: f.makeSlug, slug: f.slug })),
    { make: "honda", slug: "crf250-rally" },
    ...Object.keys(LEGACY_MODEL_REDIRECTS).map((key) => {
      const [make, slug] = key.split("/");
      return { make, slug };
    })
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
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
  const growth = priorityModelGrowthProfile(model.id);
  const image = getRenderableMedia("motorcycle", model.id)[0]?.src;
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
  if (make === "honda" && slug === "crf250-rally") permanentRedirect("/motorcycles/honda/crf300-rally");
  const legacy = legacyTarget(make, slug);
  if (legacy) permanentRedirect(`/motorcycles/${legacy.make}/${legacy.slug}`);
  const family = getModelFamily(make, slug);
  if (family) return <ModelFamilyView family={family}/>;
  const model = getModel(make, slug);
  if (!model) return notFound();
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
