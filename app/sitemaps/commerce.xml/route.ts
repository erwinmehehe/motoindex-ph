import { sitemapXml } from "@/lib/sitemaps";
import { allVerifiedDealers } from "@/lib/persistentSellers";
import { MIN_PUBLIC_DEALERS_PER_CITY, citySlug } from "@/lib/sellers";
import { RELEASE_DATE, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export async function GET(){
  const dealers=await allVerifiedDealers();
  const cityCounts=new Map<string,number>();
  for(const dealer of dealers)cityCounts.set(dealer.city,(cityCounts.get(dealer.city)||0)+1);
  const sellerEntries=dealers.map(dealer=>({
    url:`${SITE_URL}/sellers/${dealer.slug}`,
    lastModified:dealer.lastChecked||RELEASE_DATE,
    changeFrequency:"weekly" as const,
    priority:.62
  }));
  const cityEntries=[...cityCounts.entries()].filter(([,count])=>count>=MIN_PUBLIC_DEALERS_PER_CITY).map(([city])=>({
    url:`${SITE_URL}/dealers/${citySlug(city)}`,
    lastModified:RELEASE_DATE,
    changeFrequency:"weekly" as const,
    priority:.62
  }));
  return new Response(sitemapXml([...sellerEntries,...cityEntries]),{headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=3600, s-maxage=3600"}});
}
