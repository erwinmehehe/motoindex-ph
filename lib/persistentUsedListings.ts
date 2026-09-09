import { databaseConfigured, prisma } from "@/lib/db";

export type PublicUsedListing = {
  id: string;
  modelExternalId: string;
  title: string;
  modelYear: number;
  mileageKm: number;
  askingPricePhp: number;
  condition: string;
  sellerType: string;
  location: string;
  sourceLabel: string;
  sourceUrl?: string;
  postedAt: string;
  verifiedAt?: string;
};

function publicRow(row: {
  id:string; modelExternalId:string; title:string; modelYear:number; mileageKm:number;
  askingPricePhp:{toNumber():number}; condition:string; sellerType:string; location:string;
  sourceLabel:string; sourceUrl:string|null; postedAt:Date; verifiedAt:Date|null;
}): PublicUsedListing {
  return {
    id:row.id,
    modelExternalId:row.modelExternalId,
    title:row.title,
    modelYear:row.modelYear,
    mileageKm:row.mileageKm,
    askingPricePhp:row.askingPricePhp.toNumber(),
    condition:row.condition,
    sellerType:row.sellerType,
    location:row.location,
    sourceLabel:row.sourceLabel,
    sourceUrl:row.sourceUrl||undefined,
    postedAt:row.postedAt.toISOString(),
    verifiedAt:row.verifiedAt?.toISOString()
  };
}

export async function getVerifiedUsedListings(options:{modelId?:string;limit?:number}={}){
  if(!databaseConfigured())return [] as PublicUsedListing[];
  const limit=Math.min(Math.max(options.limit||50,1),100);
  const rows=await prisma.usedListing.findMany({
    where:{status:"verified",...(options.modelId?{modelExternalId:options.modelId}:{})},
    orderBy:[{verifiedAt:"desc"},{postedAt:"desc"}],
    take:limit
  });
  return rows.map(publicRow);
}

export async function verifiedUsedListingCount(modelId?:string){
  if(!databaseConfigured())return 0;
  return prisma.usedListing.count({where:{status:"verified",...(modelId?{modelExternalId:modelId}:{})}});
}
