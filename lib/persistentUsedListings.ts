import { snapshotUsedListings } from "@/lib/publicSnapshot";

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

export async function getVerifiedUsedListings(options:{modelId?:string;limit?:number}={}){
  return snapshotUsedListings(options);
}

export async function verifiedUsedListingCount(modelId?:string){
  return snapshotUsedListings({modelId,limit:100}).length;
}
