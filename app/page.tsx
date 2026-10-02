import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { HomePageRedesign } from "@/components/HomePageRedesign";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Prices, Specs & Gear Philippines",
  description: "Compare motorcycle prices, specifications, helmets, tires and ownership costs in the Philippines.",
  path: "/",
});

export default function HomePage() {
  return <HomePageRedesign />;
}
