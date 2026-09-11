import type { Metadata } from "next";
import { SearchClient } from "@/components/SearchClient";
import { getSearchItems } from "@/lib/search";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Search Motorcycles, Helmets & Gear", description: "Search MotoIndex PH motorcycles, helmet models, brands, accessories, buying guides and tools.", path: "/search", index: false });

export default function SearchPage(){return <section className="page shell"><div className="page-head"><h1>Find the bike, gear or answer you need</h1><p>Search motorcycles, helmets, accessories, comparison pages and ownership tools from one place.</p></div><SearchClient items={getSearchItems()}/></section>}
