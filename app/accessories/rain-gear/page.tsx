import type { Metadata } from "next";
import { AccessoryGuidePage } from "@/components/AccessoryGuidePage";
import { getAccessorySeoGuide } from "@/lib/accessorySeo";
import { pageMetadata } from "@/lib/site";

const guide = getAccessorySeoGuide("rain-gear")!;

export const metadata: Metadata = pageMetadata({
  title: guide.seoTitle,
  description: guide.description,
  path: "/accessories/rain-gear",
  index: true
});

export default function RainGearPage() {
  return <AccessoryGuidePage guide={guide} />;
}
