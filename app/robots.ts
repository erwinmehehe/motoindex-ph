import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The llms.txt resources live at their well-known paths, /llms.txt and
// /llms-full.txt. robots.txt has no standard directive for them and Next's
// MetadataRoute.Robots cannot emit comment lines, so they are not referenced
// here — discovery is by convention, and validate-v13/v212 require this file
// to stay in the typed form.
//
// The commerce sitemap is deliberately omitted: it currently contains zero
// <loc> entries and both validators fail if robots advertises it.
export default function robots(): MetadataRoute.Robots {
  return {
    rules:[{userAgent:"*",allow:"/",disallow:["/admin/","/api/","/go/"]}],
    sitemap:[`${SITE_URL}/sitemap.xml`,`${SITE_URL}/sitemaps/motorcycles.xml`,`${SITE_URL}/sitemaps/gear.xml`]
  };
}
