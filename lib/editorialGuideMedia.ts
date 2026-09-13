export type EditorialGuideMedia = {
  publishedAt: string;
  image: string;
  alt: string;
  caption: string;
};

const guideMedia: Record<string, EditorialGuideMedia> = {
  "motorcycle-helmet-size-guide": {
    publishedAt: "2026-09-08",
    image: "/media/guides/motorcycle-helmet-size-guide.svg",
    alt: "MotoIndex helmet sizing diagram showing head measurement, model-specific size charts and fit checks",
    caption: "MotoIndex original graphic: measure head circumference, match the exact helmet model chart, then verify real-world fit and head shape."
  },
  "motorcycle-helmet-certification-philippines": {
    publishedAt: "2026-09-08",
    image: "/media/guides/motorcycle-helmet-certification-philippines.svg",
    alt: "MotoIndex Philippine helmet certification diagram separating PS and ICC checks from ECE model claims",
    caption: "MotoIndex original graphic: verify the applicable Philippine PS or ICC conformity marking on the exact product and treat ECE as a separate model-level certification claim."
  }
};

export function getEditorialGuideMedia(slug: string) {
  return guideMedia[slug];
}
