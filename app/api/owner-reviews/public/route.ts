import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";
import { type PublicOwnerReview, summarizeOwnerReviews } from "@/lib/ownerReviewPolicy";
import { summarizeOwnerIntelligence } from "@/lib/ownerIntelligence";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:Request){
  const headers={"Cache-Control":"public, max-age=0, s-maxage=300, stale-while-revalidate=600"};
  if(process.env.OWNER_REVIEWS_ENABLED!=="true"||!databaseConfigured())return NextResponse.json({ok:true,available:false,reviews:[],summary:null},{headers});
  const modelId=new URL(request.url).searchParams.get("modelId")?.trim()||"";
  if(!modelId||!getModelById(modelId))return NextResponse.json({ok:false,error:"Unknown motorcycle."},{status:400,headers});
  let rows;
  try{
    rows=await prisma.ownerReview.findMany({
      where:{modelExternalId:modelId,status:"published",publishedAt:{not:null}},
      orderBy:{publishedAt:"desc"},
      take:500
    });
  }catch{
    return NextResponse.json({ok:true,available:false,reviews:[],summary:null},{headers});
  }
  const reviews:PublicOwnerReview[]=rows.map(row=>({
    id:row.id,modelExternalId:row.modelExternalId,variantLabel:row.variantLabel,modelYear:row.modelYear,
    ownershipMonths:row.ownershipMonths,odometerKm:row.odometerKm,comfortRating:row.comfortRating,
    cityTrafficRating:row.cityTrafficRating,maintenanceRating:row.maintenanceRating,passengerRating:row.passengerRating,
    highwayRating:row.highwayRating,fuelEconomyKmpl:row.fuelEconomyKmpl,
    annualMaintenancePhp:row.annualMaintenancePhp?Number(row.annualMaintenancePhp):null,
    unscheduledRepairsCount:row.unscheduledRepairsCount,summary:row.summary,likes:row.likes,dislikes:row.dislikes,
    publishedAt:row.publishedAt!.toISOString()
  }));
  return NextResponse.json({
    ok:true,
    available:true,
    reviews:reviews.slice(0,20),
    summary:summarizeOwnerReviews(reviews),
    intelligence:summarizeOwnerIntelligence(rows)
  },{headers});
}
