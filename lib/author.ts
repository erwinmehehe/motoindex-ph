import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export const AUTHOR_NAME = "Erwin Valles";
export const AUTHOR_PATH = "/authors/erwin-valles";
export const AUTHOR_ROLE = "Author and Editor";
export const AUTHOR_BIO = "Erwin Valles is the author and editor behind MotoIndex Philippines. He reviews motorcycle prices, specifications, riding gear and buyer guides using traceable manufacturer, government and Philippine market sources.";

export function authorPersonSchema() {
  return {
    "@type": "Person",
    name: AUTHOR_NAME,
    url: absoluteUrl(AUTHOR_PATH),
    jobTitle: AUTHOR_ROLE,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
