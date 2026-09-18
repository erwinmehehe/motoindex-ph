import type { Metadata } from "next";
import { AccessoryGuidePage } from "@/components/AccessoryGuidePage";
import { getAccessorySeoGuide } from "@/lib/accessorySeo";
import { pageMetadata } from "@/lib/site";

const guide = getAccessorySeoGuide("intercoms")!;

export const metadata: Metadata = pageMetadata({
  title: guide.seoTitle,
  description: guide.description,
  path: "/accessories/intercoms",
  index: true
});

export default function IntercomsPage() {
  return <AccessoryGuidePage guide={guide} />;
}
