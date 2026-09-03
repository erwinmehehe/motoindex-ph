import { NextResponse } from "next/server";
import { motorcycles, isIndexableModel } from "@/lib/data";
import { getVerifiedVariantsForModel } from "@/lib/variants";

export function GET(){
  const data=motorcycles.filter(isIndexableModel).map((model)=>({
    ...model,
    variants:getVerifiedVariantsForModel(model.id),
  }));
  return NextResponse.json({data,count:data.length,generatedAt:new Date().toISOString()},{headers:{"Cache-Control":"public, max-age=300, stale-while-revalidate=3600"}});
}
