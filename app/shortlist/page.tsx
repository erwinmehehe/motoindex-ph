import type { Metadata } from "next";
import { publicMotorcycles } from "@/lib/data";
import { ShortlistClient } from "@/components/ShortlistClient";
import { pageMetadata } from "@/lib/site";
export const metadata:Metadata=pageMetadata({title:"Saved Motorcycle Shortlist",description:"Save Philippine motorcycles in your browser, share a shortlist URL and compare up to three current models.",path:"/shortlist",index:false});
export default async function ShortlistPage({searchParams}:{searchParams:Promise<{bikes?:string}>}){const {bikes=""}=await searchParams;const initial=bikes.split(",").filter(Boolean).slice(0,8);return <section className="page shell"><div className="page-head"><h1>Save motorcycles without creating an account</h1><p>Your shortlist is stored in this browser. Shared URLs contain only motorcycle slugs—no account or personal profile is required.</p></div><ShortlistClient models={publicMotorcycles} initialSlugs={initial}/></section>}
