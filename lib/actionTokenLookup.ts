import { prisma } from "@/lib/db";
import { hashActionToken, verifySignedUnsubscribeToken } from "@/lib/actionTokens";

export async function findBuyerLeadByToken(token:string){
  if(!token||token.length>256)return null;
  const tokenHash=hashActionToken(token);
  const hashed=await prisma.dealerLead.findUnique({where:{buyerAccessTokenHash:tokenHash},include:{deliveries:{orderBy:{createdAt:"asc"},include:{quoteResponse:true}}}});
  if(hashed)return hashed;
  const legacy=await prisma.dealerLead.findUnique({where:{buyerAccessToken:token},include:{deliveries:{orderBy:{createdAt:"asc"},include:{quoteResponse:true}}}});
  if(!legacy)return null;
  await prisma.dealerLead.update({where:{id:legacy.id},data:{buyerAccessTokenHash:tokenHash,buyerAccessToken:null}}).catch(()=>{});
  return legacy;
}

export async function findDealerDeliveryByToken(token:string){
  if(!token||token.length>256)return null;
  const tokenHash=hashActionToken(token);
  const hashed=await prisma.dealerLeadDelivery.findUnique({where:{deliveryTokenHash:tokenHash},include:{lead:true,quoteResponse:true}});
  if(hashed)return hashed;
  const legacy=await prisma.dealerLeadDelivery.findUnique({where:{deliveryToken:token},include:{lead:true,quoteResponse:true}});
  if(!legacy)return null;
  await prisma.dealerLeadDelivery.update({where:{id:legacy.id},data:{deliveryTokenHash:tokenHash,deliveryToken:null}}).catch(()=>{});
  return legacy;
}

export async function findPriceAlertByConfirmToken(token:string){
  if(!token||token.length>256)return null;
  const tokenHash=hashActionToken(token);
  const hashed=await prisma.priceAlertSubscription.findUnique({where:{confirmTokenHash:tokenHash}});
  if(hashed)return hashed;
  const legacy=await prisma.priceAlertSubscription.findUnique({where:{confirmToken:token}});
  if(!legacy)return null;
  await prisma.priceAlertSubscription.update({where:{id:legacy.id},data:{confirmTokenHash:tokenHash,confirmToken:null}}).catch(()=>{});
  return legacy;
}

export async function findPriceAlertByUnsubscribeToken(token:string){
  if(!token||token.length>256)return null;
  const signedId=verifySignedUnsubscribeToken(token);
  if(signedId)return prisma.priceAlertSubscription.findUnique({where:{id:signedId}});
  const tokenHash=hashActionToken(token);
  const hashed=await prisma.priceAlertSubscription.findUnique({where:{unsubscribeTokenHash:tokenHash}});
  if(hashed)return hashed;
  const legacy=await prisma.priceAlertSubscription.findUnique({where:{unsubscribeToken:token}});
  if(!legacy)return null;
  await prisma.priceAlertSubscription.update({where:{id:legacy.id},data:{unsubscribeTokenHash:tokenHash,unsubscribeToken:null}}).catch(()=>{});
  return legacy;
}
