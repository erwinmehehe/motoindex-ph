import type { Metadata } from "next";
import { AccessoryGuidePage } from "@/components/AccessoryGuidePage";
import { getAccessorySeoGuide } from "@/lib/accessorySeo";
import { pageMetadata } from "@/lib/site";

const guide = getAccessorySeoGuide("phone-holders")!;

export const metadata: Metadata = pageMetadata({
  title: guide.seoTitle,
  description: guide.description,
  path: "/accessories/phone-holders",
  index: true
});

export default function PhoneHoldersPage() {
  return <AccessoryGuidePage guide={guide} />;
}
