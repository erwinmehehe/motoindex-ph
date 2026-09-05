import type { Metadata } from "next";

export const SITE_NAME = "MotoIndex PH";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://motoindexph.com").replace(/\/+$/, "");
export const SITE_DESCRIPTION = "Philippines motorcycle prices, specifications, tire sizes, comparisons, gear and ownership tools.";
export const RELEASE_DATE = "2026-08-27";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  image?: string;
};

// Google truncates meta descriptions around 160 characters. Several pages pass
// an editorial opening paragraph straight through, which produced 300+ character
// descriptions on every comparison page. Trim at a sentence or word boundary so
// the visible part still reads as a finished sentence.
function metaDescription(text: string, limit = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const window = clean.slice(0, limit + 1);
  const sentenceEnd = Math.max(window.lastIndexOf(". "), window.lastIndexOf("? "), window.lastIndexOf("! "));
  if (sentenceEnd >= 90) return clean.slice(0, sentenceEnd + 1);
  const wordEnd = window.lastIndexOf(" ");
  return clean.slice(0, wordEnd > 0 ? wordEnd : limit).replace(/[,;:—-]$/, "") + "…";
}

export function pageMetadata({ title, description, path, index = true, image = "/brand/motoindex-og.png" }: PageMetadataOptions): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const trimmed = metaDescription(description);
  return {
    title,
    description: trimmed,
    alternates: { canonical },
    robots: index ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description: trimmed,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME} — motorcycle research for the Philippines` }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: trimmed,
      images: [image]
    }
  };
}
