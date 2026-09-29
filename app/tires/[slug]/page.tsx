import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { TireSeoLanding } from "@/components/TireSeoLanding";
import { articleSchema } from "@/lib/articleSchema";
import { getModelById } from "@/lib/data";
import { getRenderableMedia } from "@/lib/renderableMedia";
import { pageMetadata } from "@/lib/site";
import {
  getTireFamilyHub,
  getTireFamilyModels,
  getTireModelSeoHub,
  tireFamilyHubs,
  tireModelSeoHubs,
  tireSizeSeoHubs
} from "@/lib/tireSeo";

const chartSlug = "motorcycle-tire-size-chart";

export function generateStaticParams() {
  return [
    ...tireFamilyHubs.map(hub=>({slug:hub.slug})),
    ...tireModelSeoHubs.map(hub=>({slug:hub.slug})),
    ...tireSizeSeoHubs.map(hub=>({slug:hub.slug})),
    {slug:chartSlug}
  ];
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const family=getTireFamilyHub(slug);
  const modelHub=getTireModelSeoHub(slug);

  if(family){
    const model=getTireFamilyModels(family)[0];
    const media=model?getRenderableMedia("motorcycle",model.id)[0]:undefined;
    const base=pageMetadata({
      title:family.title,
      description:family.description,
      path:`/tires/${family.slug}`,
      index:true,
      image:media?.src,
      imageAlt:media?.alt||`${family.shortName} motorcycle tire size guide`,
      imageWidth:media?.width,
      imageHeight:media?.height
    });
    return {...base,keywords:family.aliases};
  }

  if(modelHub){
    const model=getModelById(modelHub.modelId);
    const media=model?getRenderableMedia("motorcycle",model.id)[0]:undefined;
    const base=pageMetadata({
      title:modelHub.title,
      description:modelHub.description,
      path:`/tires/${modelHub.slug}`,
      index:Boolean(model),
      image:media?.src,
      imageAlt:media?.alt||modelHub.keywordLabel,
      imageWidth:media?.width,
      imageHeight:media?.height
    });
    return {...base,keywords:modelHub.aliases};
  }

  return {};
}

export default async function TireGuideRoute({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;

  if(slug===chartSlug) permanentRedirect("/tires#size-chart");
  if(tireSizeSeoHubs.some(hub=>hub.slug===slug)) permanentRedirect("/tires#common-sizes");

  const family=getTireFamilyHub(slug);
  if(family){
    const models=getTireFamilyModels(family);
    if(!models.length)return notFound();
    const schema=articleSchema({
      headline:family.title,
      description:family.description,
      path:`/tires/${family.slug}`,
      about:family.aliases[0],
      keywords:family.aliases,
      checkedDates:models.map(model=>model.verifiedAt)
    });
    return <><TireSeoLanding family={family}/><JsonLd data={schema}/></>;
  }

  const modelHub=getTireModelSeoHub(slug);
  if(modelHub){
    const model=getModelById(modelHub.modelId);
    if(!model)return notFound();
    const schema=articleSchema({
      headline:modelHub.title,
      description:modelHub.description,
      path:`/tires/${modelHub.slug}`,
      about:modelHub.keywordLabel,
      keywords:modelHub.aliases,
      checkedDates:[model.verifiedAt]
    });
    return <><TireSeoLanding modelHub={modelHub}/><JsonLd data={schema}/></>;
  }

  notFound();
}
