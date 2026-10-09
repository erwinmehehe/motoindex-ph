import { databaseConfigured, prisma } from "@/lib/db";
import { getAffiliateLinks, type AffiliateLinkConfig, type AffiliateMerchant, type AffiliateNetwork } from "@/lib/affiliate";
import { allCatalogProducts } from "@/lib/catalog";
import { isExactMerchantProductUrl, isExactShopeeProductUrl, isKnownGenericAffiliateDestination } from "@/lib/affiliateDestinations";

const catalogIds = new Set(allCatalogProducts().map(product=>product.id));

function allowedShopeeHost(hostname:string){
  const host=hostname.toLowerCase();
  return host==="shopee.ph"||host.endsWith(".shopee.ph")||host==="shope.ee"||host.endsWith(".shope.ee");
}
function allowedInvolveAsiaHost(hostname:string){
  const host=hostname.toLowerCase();
  return host==="invol.co"||host.endsWith(".invol.co")||host==="involve.asia"||host.endsWith(".involve.asia")||host==="invl.me"||host.endsWith(".invl.me");
}

export function validateRuntimeAffiliateUrl(
  productId:string, rawUrl:string, rawDestinationUrl?:string, merchant:AffiliateMerchant="shopee"
){
  if(!catalogIds.has(productId))return {ok:false as const,error:"Unknown catalog product ID."};
  const value=rawUrl.trim();
  if(!value)return {ok:false as const,error:"Affiliate URL is required."};
  try{
    const url=new URL(value);
    if(url.protocol!=="https:"||url.username||url.password||url.port)
      return {ok:false as const,error:"Affiliate URL must be HTTPS without credentials or custom ports."};
    if(isKnownGenericAffiliateDestination(url.toString()))
      return {ok:false as const,error:"This is a generic marketplace/store link. Use an exact product listing instead."};
    let network:AffiliateNetwork|undefined;
    if(allowedShopeeHost(url.hostname))network="shopee_direct";
    else if(allowedInvolveAsiaHost(url.hostname))network="involve_asia";
    if(!network)return {ok:false as const,error:"Use an approved Shopee or Involve Asia tracking URL."};
    if(network==="shopee_direct"&&merchant!=="shopee")
      return {ok:false as const,error:"A Shopee direct link cannot be activated as a Lazada offer."};

    const exactDirect=network==="shopee_direct"&&isExactShopeeProductUrl(url.toString());
    const destination=rawDestinationUrl?.trim();
    const exactDestination=destination&&isExactMerchantProductUrl(merchant,destination)
      ? new URL(destination).toString():undefined;
    if(!exactDirect&&!exactDestination)
      return {ok:false as const,error:"Add the exact product URL in Verified destination before activating an opaque network tracking link."};
    if(exactDirect&&exactDestination&&exactDestination!==url.toString())
      return {ok:false as const,error:"A direct Shopee link and its verified item URL must match."};
    return {ok:true as const,network,url:url.toString(),destinationUrl:exactDestination||url.toString()};
  }catch{
    return {ok:false as const,error:"Affiliate URL is not valid."};
  }
}

export async function getRuntimeAffiliateLinks(productId:string):Promise<AffiliateLinkConfig[]>{
  const fallback=getAffiliateLinks(productId);
  if(databaseConfigured()){
    try{
      const row=await prisma.affiliateProductLink.findUnique({where:{productId}});
      if(row){
        if(row.status!=="active")return [];
        const merchant:AffiliateMerchant=row.merchant==="lazada"?"lazada":"shopee";
        const checked=validateRuntimeAffiliateUrl(productId,row.url,row.destinationUrl||undefined,merchant);
        // Old unverified shortlinks cannot override a safe, product-specific fallback.
        if(!checked.ok)return fallback;
        const databaseLink={productId,merchant,network:checked.network,url:checked.url,destinationUrl:checked.destinationUrl};
        return [databaseLink,...fallback.filter(link=>link.merchant!==merchant)];
      }
    }catch{
      // Keep commerce fail-closed if the runtime affiliate migration is not available yet.
      return fallback;
    }
  }
  return fallback;
}

export async function getRuntimeAffiliateLink(productId:string):Promise<AffiliateLinkConfig|undefined>{
  const links=await getRuntimeAffiliateLinks(productId);
  return links.find(link=>link.merchant==="shopee")||links[0];
}

export async function getRuntimeShopeeAffiliateLink(productId:string):Promise<AffiliateLinkConfig|undefined>{
  return (await getRuntimeAffiliateLinks(productId)).find(link=>link.merchant==="shopee");
}

export async function runtimeAffiliateSummary(){
  const catalog=allCatalogProducts();
  if(!databaseConfigured()){
    const configured=catalog.flatMap(product=>getAffiliateLinks(product.id));
    return {
      databaseConfigured:false,
      active:configured.length,
      disabled:0,
      catalogProducts:catalog.length,
      byNetwork:{
        shopeeDirect:configured.filter(link=>link.network==="shopee_direct").length,
        involveAsia:configured.filter(link=>link.network==="involve_asia").length
      }
    };
  }
  let rows;
  try{
    rows=await prisma.affiliateProductLink.findMany({orderBy:{updatedAt:"desc"}});
  }catch{
    const configured=catalog.flatMap(product=>getAffiliateLinks(product.id));
    return {
      databaseConfigured:false,
      active:configured.length,
      disabled:0,
      catalogProducts:catalog.length,
      byNetwork:{
        shopeeDirect:configured.filter(link=>link.network==="shopee_direct").length,
        involveAsia:configured.filter(link=>link.network==="involve_asia").length
      }
    };
  }
  const activeRows=rows.filter(row=>row.status==="active");
  return {
    databaseConfigured:true,
    active:activeRows.length,
    disabled:rows.filter(row=>row.status!=="active").length,
    catalogProducts:catalog.length,
    byNetwork:{
      shopeeDirect:activeRows.filter(row=>row.network==="shopee_direct").length,
      involveAsia:activeRows.filter(row=>row.network==="involve_asia").length
    }
  };
}
