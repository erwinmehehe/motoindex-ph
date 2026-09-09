import { SITE_NAME, SITE_URL, RELEASE_DATE, absoluteUrl } from "@/lib/site";
import { authorPersonSchema } from "@/lib/author";

// Shared Article schema builder for the editorial page types.
//
// Model pages are deliberately excluded — they carry Product/AggregateOffer,
// which is the correct type for an entity with a price, and stacking Article on
// top of that would misrepresent them.
//
// dateModified takes the newest real source-check date passed in by the caller,
// falling back to the site release date. It is never a build timestamp: an
// article that claims to change every deploy is worse than one with an honest
// older date.

type Args = {
  headline: string;
  description: string;
  path: string;
  /** Primary topic — usually the page's target query. */
  about?: string;
  /** Extra keyword phrases; the headline is always included. */
  keywords?: (string | undefined)[];
  /** Real source-check dates (verifiedAt / lastChecked) from the page's records. */
  checkedDates?: (string | undefined)[];
};

export function articleSchema({ headline, description, path, about, keywords = [], checkedDates = [] }: Args) {
  const dateModified = checkedDates
    .filter((d): d is string => Boolean(d) && /^\d{4}-\d{2}-\d{2}$/.test(d as string))
    .sort()
    .at(-1) || RELEASE_DATE;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    ...(about ? { about } : {}),
    keywords: [headline, about, ...keywords].filter(Boolean).join(", "),
    inLanguage: "en-PH",
    isAccessibleForFree: true,
    datePublished: RELEASE_DATE,
    dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    author: authorPersonSchema(),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon-512.png") }
    }
  };
}
