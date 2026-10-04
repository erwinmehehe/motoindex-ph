import { NextResponse } from "next/server";
import { clearOwnerSessionCookie, getOwnerSession, ownerAuthConfigured, ownerRequestOriginAllowed } from "@/lib/ownerAuth";
import { prisma } from "@/lib/db";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"};

async function ownerSession(){
  if(!ownerAuthConfigured())return null;
  return getOwnerSession();
}

export async function GET(){
  const session=await ownerSession();
  if(!session)return NextResponse.json({ok:false,error:"Sign in to export your account data."},{status:401,headers});
  const [snapshot,reminders,listings]=await Promise.all([
    prisma.garageSnapshot.findUnique({where:{ownerId:session.ownerId}}),
    prisma.garageReminder.findMany({where:{ownerId:session.ownerId},orderBy:{createdAt:"asc"}}),
    prisma.usedListing.findMany({
      where:{ownerId:session.ownerId},
      orderBy:{createdAt:"asc"},
      select:{
        id:true,modelExternalId:true,title:true,modelYear:true,mileageKm:true,askingPricePhp:true,condition:true,
        sellerType:true,location:true,sourceLabel:true,sourceUrl:true,status:true,postedAt:true,verifiedAt:true,
        garageMotorcycleLocalId:true,createdAt:true,updatedAt:true
      }
    })
  ]);
  return NextResponse.json({
    ok:true,
    exportedAt:new Date().toISOString(),
    account:{email:session.owner.email,verifiedAt:session.owner.verifiedAt,reminderEmailsEnabled:session.owner.reminderEmailsEnabled,createdAt:session.owner.createdAt,updatedAt:session.owner.updatedAt},
    garage:snapshot?{revision:snapshot.revision,payload:snapshot.payload,createdAt:snapshot.createdAt,updatedAt:snapshot.updatedAt}:null,
    reminders,
    usedListings:listings.map(item=>({...item,askingPricePhp:Number(item.askingPricePhp)}))
  },{headers});
}

export async function DELETE(request:Request){
  if(!ownerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403,headers});
  const session=await ownerSession();
  if(!session)return NextResponse.json({ok:false,error:"Sign in to delete your account."},{status:401,headers});
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400,headers});}
  if(body.confirm!=="DELETE MY ACCOUNT")return NextResponse.json({ok:false,error:"Account deletion confirmation did not match."},{status:400,headers});

  await prisma.$transaction(async tx=>{
    await tx.usedListing.deleteMany({where:{ownerId:session.ownerId}});
    await tx.ownerAccount.delete({where:{id:session.ownerId}});
  });

  const response=NextResponse.json({ok:true,deleted:true},{headers});
  clearOwnerSessionCookie(response);
  return response;
}
