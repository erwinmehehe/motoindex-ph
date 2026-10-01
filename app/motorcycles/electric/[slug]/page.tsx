import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ElectricMotorcycleDetail } from "@/components/ElectricMotorcycleDetail";
import { electricMotorcycles, getElectricMotorcycle } from "@/lib/electricMotorcycles";
import { pageMetadata } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams(){return electricMotorcycles.map(model=>({slug:model.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const model=getElectricMotorcycle(slug); if(!model)return {};
  return pageMetadata({
    title:`${model.make} ${model.model} Price, Range & Specs Philippines`,
    description:`${model.make} ${model.model} electric motorcycle price, battery capacity, claimed range, charging time, maximum speed and LTO classification in the Philippines.`,
    path:`/motorcycles/electric/${model.slug}`,
    image:model.imageUrl
  });
}

export default async function ElectricModelPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const model=getElectricMotorcycle(slug);
  if(!model)return notFound();
  return <ElectricMotorcycleDetail model={model}/>;
}
