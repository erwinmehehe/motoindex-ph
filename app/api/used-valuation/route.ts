import { NextResponse } from "next/server";
import { getModelById } from "@/lib/data";
import { getVerifiedUsedListings } from "@/lib/persistentUsedListings";
import { estimateUsedMotorcycleValue, type ValuationCondition } from "@/lib/usedValuation";

export const runtime="nodejs";
export const dynamic="force-dynamic";

const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"};
const conditions=new Set<ValuationCondition>(["fair","good","excellent"]);

function text(value:unknown,max=120){return typeof value==="string"?value.trim().slice(0,max):"";}

export async function POST(request:Request){
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid valuation request."},{status:400,headers});}

  const modelId=text(body.modelId,100);
  const model=getModelById(modelId);
  if(!model)return NextResponse.json({ok:false,error:"Choose a MotoIndex motorcycle."},{status:400,headers});

  const modelYear=Number(body.modelYear);
  const mileageKm=Number(body.mileageKm);
  const condition=text(body.condition,20) as ValuationCondition;
  const location=text(body.location,120);
  const excludeListingId=text(body.excludeListingId,120);
  const currentYear=new Date().getFullYear();

  if(!Number.isInteger(modelYear)||modelYear<1980||modelYear>currentYear+1){
    return NextResponse.json({ok:false,error:"Enter a valid motorcycle model year."},{status:400,headers});
  }
  if(!Number.isFinite(mileageKm)||mileageKm<0||mileageKm>500_000){
    return NextResponse.json({ok:false,error:"Mileage must be between 0 and 500,000 km."},{status:400,headers});
  }
  if(!conditions.has(condition)){
    return NextResponse.json({ok:false,error:"Choose fair, good or excellent condition."},{status:400,headers});
  }

  const listings=(await getVerifiedUsedListings({modelId,limit:100}))
    .filter(item=>!excludeListingId||item.id!==excludeListingId);
  const valuation=estimateUsedMotorcycleValue(listings,{
    modelId,
    modelYear,
    mileageKm:Math.round(mileageKm),
    condition,
    location,
    currentSrpPhp:model.srp,
    currentYear
  });

  return NextResponse.json({
    ok:true,
    valuation,
    comparables:listings
      .filter(item=>valuation.comparableIds.includes(item.id))
      .map(item=>({
        id:item.id,
        title:item.title,
        modelYear:item.modelYear,
        mileageKm:item.mileageKm,
        askingPricePhp:item.askingPricePhp,
        condition:item.condition,
        location:item.location,
        sellerType:item.sellerType,
        postedAt:item.postedAt,
        sourceUrl:item.sourceUrl||null
      }))
  },{headers});
}
