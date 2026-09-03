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

export function pageMetadata({ title, description, path, index = true, image = "/brand/motoindex-og.png" }: PageMetadataOptions): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  return {
    title,
    description,
    alternates: { canonical },
    robots: index ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${SITE_NAME} — motorcycle research for the Philippines` }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}
