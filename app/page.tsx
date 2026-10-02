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
  return <HomePageRedesign heading={<h1 id="mi-home-title">Compare <span>motorcycle prices</span><br />and specs in the Philippines.</h1>} />;
}
