import { SITE_NAME, SITE_URL, RELEASE_DATE, absoluteUrl } from "@/lib/site";
import { authorPersonSchema } from "@/lib/author";

// Shared Article schema builder for the editorial page types.
//
// Model pages are deliberately excluded because they carry Product markup,
// which is the correct type for an entity with a price.
//
// Publication dates are only emitted when a caller supplies a real date. This
// avoids making every article look as though it was published on the site-wide
// release date. dateModified uses the newest real source-check date when one is
// available and never uses a build timestamp.

type Args = {
  headline: string;
  description: string;
  path: string;
  /** Primary topic, usually the page's target query. */
  about?: string;
  /** Extra keyword phrases; the headline is always included. */
  keywords?: (string | undefined)[];
  /** Real publication date for the specific article. */
  datePublished?: string;
  /** Real source-check dates (verifiedAt / lastChecked) from the page's records. */
  checkedDates?: (string | undefined)[];
  /** Representative editorial image. Relative paths are resolved against SITE_URL. */
  image?: string;
};

const isDate = (value?: string): value is string => Boolean(value) && /^\d{4}-\d{2}-\d{2}$/.test(value as string);

export function articleSchema({ headline, description, path, about, keywords = [], datePublished, checkedDates = [], image }: Args) {
  const published = isDate(datePublished) ? datePublished : undefined;
  const dateModified = checkedDates
    .filter(isDate)
    .sort()
    .at(-1) || published || RELEASE_DATE;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    ...(about ? { about } : {}),
    keywords: [headline, about, ...keywords].filter(Boolean).join(", "),
    inLanguage: "en-PH",
    isAccessibleForFree: true,
    ...(published ? { datePublished: published } : {}),
    dateModified,
    ...(image ? { image: { "@type": "ImageObject", url: absoluteUrl(image) } } : {}),
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
