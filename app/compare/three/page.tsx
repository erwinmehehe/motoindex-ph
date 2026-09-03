import type { Metadata } from "next";
import Link from "next/link";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { DetailedMotorcycleCompare } from "@/components/DetailedMotorcycleCompare";
import { ThreeWayHighlights } from "@/components/ThreeWayHighlights";

export const metadata:Metadata=pageMetadata({title:"Compare 3 Motorcycles Philippines",description:"Compare three current Philippine motorcycles side by side for checked prices, variants, engine, dimensions, fuel, tires and braking.",path:"/compare/three",index:false});
export default async function ThreeComparePage({searchParams}:{searchParams:Promise<{bikes?:string}>}){const {bikes=""}=await searchParams;const slugs=[...new Set(bikes.split(",").filter(Boolean))].slice(0,3);const models=slugs.map(slug=>publicMotorcycles.find(m=>m.slug===slug)).filter((m):m is (typeof publicMotorcycles)[number]=>Boolean(m));return <section className="page shell"><div className="page-head"><h1>{models.length===3?models.map(m=>m.model).join(" vs "):"Compare three motorcycles"}</h1><p>Keep the selected motorcycles and their images visible, then scan grouped price, engine, fit, fuel and braking differences below.</p></div>{models.length===3?<><ThreeWayHighlights models={models}/><DetailedMotorcycleCompare models={models}/></>:<div className="note-box"><h2>Choose three current motorcycles</h2><p>Use the comparison builder or your shortlist to create this page.</p><Link className="button small" href="/compare">Open comparison builder</Link></div>}</section>}
