// @ts-nocheck
import { databaseConfigured, prisma } from "@/lib/db";
import { getAffiliateLink, type AffiliateLinkConfig, type AffiliateNetwork } from "@/lib/affiliate";
import { allCatalogProducts } from "@/lib/catalog";

const catalogIds = new Set(allCatalogProducts().map(product=>product.id));

function allowedShopeeHost(hostname:string){
  const host=hostname.toLowerCase();
  return host==="shopee.ph"||host.endsWith(".shopee.ph")||host==="shope.ee"||host.endsWith(".shope.ee");
}
function allowedInvolveAsiaHost(hostname:string){
  const host=hostname.toLowerCase();
  return host==="invol.co"||host.endsWith(".invol.co")||host==="involve.asia"||host.endsWith(".involve.asia")||host==="invl.me"||host.endsWith(".invl.me");
}

export function validateRuntimeAffiliateUrl(productId:string, rawUrl:string){
  if(!catalogIds.has(productId)) return {ok:false as const,error:"Unknown catalog product ID."};
  const value=rawUrl.trim();
  if(!value) return {ok:false as const,error:"Affiliate URL is required."};
  try{
    const url=new URL(value);
    if(url.protocol!=="https:") return {ok:false as const,error:"Affiliate URL must use HTTPS."};
    let network:AffiliateNetwork|undefined;
    if(allowedShopeeHost(url.hostname))network="shopee_direct";
    else if(allowedInvolveAsiaHost(url.hostname))network="involve_asia";
    if(!network)return {ok:false as const,error:"Use an approved Shopee or Involve Asia tracking URL."};
    return {ok:true as const,network,url:url.toString()};
  }catch{
    return {ok:false as const,error:"Affiliate URL is not valid."};
  }
}

export async function getRuntimeAffiliateLink(productId:string):Promise<AffiliateLinkConfig|undefined>{
  if(databaseConfigured()){
    try{
      const row=await prisma.affiliateProductLink.findUnique({where:{productId}});
      if(row){
        if(row.status!=="active")return undefined;
        const checked=validateRuntimeAffiliateUrl(productId,row.url);
        if(!checked.ok)return undefined;
        return {productId,merchant:"shopee",network:checked.network,url:checked.url};
      }
    }catch{
      // Keep commerce fail-closed if the runtime affiliate migration is not available yet.
      return getAffiliateLink(productId);
    }
  }
  return getAffiliateLink(productId);
}

export async function runtimeAffiliateSummary(){
  const fallback=getAffiliateLink;
  const catalog=allCatalogProducts();
  if(!databaseConfigured()){
    const configured=catalog.map(product=>fallback(product.id)).filter(Boolean) as AffiliateLinkConfig[];
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
    const configured=catalog.map(product=>fallback(product.id)).filter(Boolean) as AffiliateLinkConfig[];
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
