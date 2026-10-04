import { NextResponse } from "next/server";
import { prisma, databaseConfigured } from "@/lib/db";
import { getOwnerSession, ownerRequestOriginAllowed } from "@/lib/ownerAuth";
import { parseGarageState } from "@/lib/garage";
import { getModelById } from "@/lib/data";
import { boundedInteger, boundedNumber, cleanReviewText, optionalRating, ownershipMonthsFromDate, requiredRating } from "@/lib/ownerReviewPolicy";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"};

function enabled(){return process.env.OWNER_REVIEWS_ENABLED==="true"&&databaseConfigured();}

async function auth(){
  if(!enabled())return {error:NextResponse.json({ok:false,available:false,error:"Owner reviews are not enabled."},{status:503,headers})};
  const session=await getOwnerSession();
  if(!session)return {error:NextResponse.json({ok:false,available:true,error:"Sign in to My Garage to manage owner reviews."},{status:401,headers})};
  return {session};
}

function publicBike(bike:{id:string;catalogModelId?:string;make:string;model:string;variant?:string;year?:number;purchaseDate?:string;odometerKm:number}){
  return {
    garageMotorcycleLocalId:bike.id,
    modelExternalId:bike.catalogModelId||"",
    label:`${bike.make} ${bike.model}`,
    variantLabel:bike.variant||null,
    modelYear:bike.year||null,
    purchaseDate:bike.purchaseDate||null,
    odometerKm:Math.max(0,Math.round(Number(bike.odometerKm)||0)),
  };
}

export async function GET(){
  const resolved=await auth();
  if("error" in resolved)return resolved.error;
  const ownerId=resolved.session.ownerId;
  const [snapshot,reviews]=await Promise.all([
    prisma.garageSnapshot.findUnique({where:{ownerId}}),
    prisma.ownerReview.findMany({where:{ownerId},orderBy:{updatedAt:"desc"}})
  ]);
  const garage=snapshot?parseGarageState(JSON.stringify(snapshot.payload)):null;
  const bikes=(garage?.motorcycles||[])
    .filter(bike=>Boolean(bike.catalogModelId&&getModelById(bike.catalogModelId)))
    .map(publicBike);
  return NextResponse.json({
    ok:true,available:true,
    bikes,
    reviews:reviews.map(review=>({
      id:review.id,
      garageMotorcycleLocalId:review.garageMotorcycleLocalId,
      modelExternalId:review.modelExternalId,
      status:review.status,
      moderatorNote:review.moderatorNote,
      submittedAt:review.submittedAt.toISOString(),
      reviewedAt:review.reviewedAt?.toISOString()||null,
      summary:review.summary,
      likes:review.likes,
      dislikes:review.dislikes,
      ownershipMonths:review.ownershipMonths,
      odometerKm:review.odometerKm,
      comfortRating:review.comfortRating,
      cityTrafficRating:review.cityTrafficRating,
      maintenanceRating:review.maintenanceRating,
      passengerRating:review.passengerRating,
      highwayRating:review.highwayRating,
      fuelEconomyKmpl:review.fuelEconomyKmpl,
      annualMaintenancePhp:review.annualMaintenancePhp?Number(review.annualMaintenancePhp):null,
      unscheduledRepairsCount:review.unscheduledRepairsCount
    }))
  },{headers});
}

export async function POST(request:Request){
  if(!ownerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403,headers});
  const resolved=await auth();
  if("error" in resolved)return resolved.error;
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400,headers});}

  const localId=cleanReviewText(body.garageMotorcycleLocalId,100);
  const snapshot=await prisma.garageSnapshot.findUnique({where:{ownerId:resolved.session.ownerId}});
  if(!snapshot)return NextResponse.json({ok:false,error:"Save your Garage to the private cloud before submitting an owner review."},{status:409,headers});
  const garage=parseGarageState(JSON.stringify(snapshot.payload));
  const bike=garage.motorcycles.find(item=>item.id===localId);
  if(!bike?.catalogModelId||!getModelById(bike.catalogModelId))return NextResponse.json({ok:false,error:"Choose a MotoIndex motorcycle from your synced Garage."},{status:400,headers});

  const comfortRating=requiredRating(body.comfortRating);
  const cityTrafficRating=requiredRating(body.cityTrafficRating);
  const maintenanceRating=requiredRating(body.maintenanceRating);
  const passengerRating=optionalRating(body.passengerRating);
  const highwayRating=optionalRating(body.highwayRating);
  if(!comfortRating||!cityTrafficRating||!maintenanceRating)return NextResponse.json({ok:false,error:"Comfort, city traffic and maintenance ratings are required."},{status:400,headers});
  if((body.passengerRating!==undefined&&body.passengerRating!==""&&passengerRating===null)||(body.highwayRating!==undefined&&body.highwayRating!==""&&highwayRating===null))return NextResponse.json({ok:false,error:"Ratings must be from 1 to 5."},{status:400,headers});

  const summary=cleanReviewText(body.summary,1200);
  const likes=cleanReviewText(body.likes,500);
  const dislikes=cleanReviewText(body.dislikes,500);
  if(summary.length<60||likes.length<10||dislikes.length<10)return NextResponse.json({ok:false,error:"Add a useful summary plus specific likes and dislikes."},{status:400,headers});

  const ownershipMonths=ownershipMonthsFromDate(bike.purchaseDate)||boundedInteger(body.ownershipMonths,1,600);
  if(!ownershipMonths)return NextResponse.json({ok:false,error:"Add the purchase date in Garage or enter how many months you have owned the motorcycle."},{status:400,headers});

  const fuelEconomyKmpl=boundedNumber(body.fuelEconomyKmpl,5,100);
  const annualMaintenancePhp=boundedNumber(body.annualMaintenancePhp,0,300000);
  const repairs=boundedInteger(body.unscheduledRepairsCount,0,50);
  if(body.fuelEconomyKmpl!==undefined&&body.fuelEconomyKmpl!==""&&fuelEconomyKmpl===null)return NextResponse.json({ok:false,error:"Fuel economy must be between 5 and 100 km/L."},{status:400,headers});
  if(body.annualMaintenancePhp!==undefined&&body.annualMaintenancePhp!==""&&annualMaintenancePhp===null)return NextResponse.json({ok:false,error:"Annual maintenance must be between ₱0 and ₱300,000."},{status:400,headers});
  if(repairs===null)return NextResponse.json({ok:false,error:"Unscheduled repairs must be between 0 and 50."},{status:400,headers});

  const now=new Date();
  const data={
    modelExternalId:bike.catalogModelId,
    variantLabel:bike.variant||null,
    modelYear:bike.year||null,
    ownershipMonths,
    odometerKm:Math.max(0,Math.min(500000,Math.round(Number(bike.odometerKm)||0))),
    comfortRating,cityTrafficRating,maintenanceRating,passengerRating,highwayRating,
    fuelEconomyKmpl,
    annualMaintenancePhp:annualMaintenancePhp===null?null:annualMaintenancePhp,
    unscheduledRepairsCount:repairs,
    summary,likes,dislikes,
    status:"pending",
    garageVerifiedAt:now,
    submittedAt:now,
    reviewedAt:null,
    publishedAt:null,
    moderatorNote:null
  };
  const review=await prisma.ownerReview.upsert({
    where:{ownerId_garageMotorcycleLocalId:{ownerId:resolved.session.ownerId,garageMotorcycleLocalId:localId}},
    update:data,
    create:{ownerId:resolved.session.ownerId,garageMotorcycleLocalId:localId,...data}
  });
  return NextResponse.json({ok:true,id:review.id,status:"pending",message:"Review submitted for moderation. Editing a published review always returns it to review."},{status:201,headers});
}

export async function DELETE(request:Request){
  if(!ownerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403,headers});
  const resolved=await auth();
  if("error" in resolved)return resolved.error;
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400,headers});}
  const localId=cleanReviewText(body.garageMotorcycleLocalId,100);
  if(!localId)return NextResponse.json({ok:false,error:"Review not found."},{status:400,headers});
  await prisma.ownerReview.deleteMany({where:{ownerId:resolved.session.ownerId,garageMotorcycleLocalId:localId}});
  return NextResponse.json({ok:true},{headers});
}
