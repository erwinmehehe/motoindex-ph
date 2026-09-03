import { motorcycleSitemapEntries, sitemapXml } from "@/lib/sitemaps";
export function GET(){return new Response(sitemapXml(motorcycleSitemapEntries()),{headers:{"Content-Type":"application/xml; charset=utf-8","Cache-Control":"public, max-age=3600, s-maxage=3600"}});}
