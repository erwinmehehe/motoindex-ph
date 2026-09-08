import type { Metadata } from "next";
import { HelmetSeoCollectionPage } from "@/components/HelmetSeoCollectionPage";
import { getHelmetSeoCollection, isIndexableHelmetSeoCollection, type HelmetSeoCollectionSlug } from "@/lib/helmetSeoCollections";
import { pageMetadata } from "@/lib/site";

const slug: HelmetSeoCollectionSlug = "for-commuting";
const collection = getHelmetSeoCollection(slug)!;

export const metadata: Metadata = pageMetadata({
  title: collection.seoTitle,
  description: collection.description,
  path: `/gear/helmets/${slug}`,
  index: isIndexableHelmetSeoCollection(slug)
});

export default function Page() {
  return <HelmetSeoCollectionPage slug={slug} />;
}
