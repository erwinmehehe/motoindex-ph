import type { Metadata } from "next";
import { databaseConfigured, prisma } from "@/lib/db";
import { usedListings } from "@/lib/usedMarket";
import { php } from "@/lib/utils";

export const metadata:Metadata={title:"Used Listing Review",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";

export default async function UsedListingsAdmin(){
  const persistent=databaseConfigured()?await prisma.usedListing.findMany({orderBy:[{verifiedAt:"desc"},{postedAt:"desc"}],take:150}):[];

  return <section className="page shell">
    <div className="page-head"><h1>Used listing review</h1><p>{databaseConfigured()?"Showing the persistent used-listing records that feed the verified public marketplace. Only rows with status verified can appear publicly.":"Production database is not connected; legacy demo fixtures remain visible here for development review only."}</p></div>

    {persistent.length>0 ? <>
      <div className="health-summary"><div><span>Total rows</span><strong>{persistent.length}</strong></div><div><span>Verified</span><strong>{persistent.filter(row=>row.status==="verified").length}</strong></div><div><span>Research</span><strong>{persistent.filter(row=>row.status==="research").length}</strong></div><div><span>Expired</span><strong>{persistent.filter(row=>row.status==="expired").length}</strong></div></div>
      <div className="admin-table"><div className="admin-row used-admin-head"><span>Listing</span><span>Price</span><span>Mileage</span><span>Review</span></div>{persistent.map(row=><div className="admin-row" key={row.id}><span><b>{row.title}</b><small>{row.modelExternalId} · {row.location} · {row.modelYear}</small></span><span>{php(row.askingPricePhp.toNumber())}</span><span>{row.mileageKm.toLocaleString("en-PH")} km</span><span><em className={`listing-status ${row.status}`}>{row.status}</em><small>{row.verifiedAt?`Verified ${row.verifiedAt.toISOString().slice(0,10)}`:"Not verified"}</small></span></div>)}</div>
    </> :
      <><div className="note-box"><h2>No persistent used listings yet</h2><p>Use the protected ingestion workflow to stage and verify real listing records. Demo fixtures below are never returned by the public used-listing API.</p></div><div className="admin-table"><div className="admin-row used-admin-head"><span>Legacy fixture</span><span>Price</span><span>Mileage</span><span>Status</span></div>{usedListings.map(row=><div className="admin-row" key={row.id}><span><b>{row.title}</b><small>{row.modelId} · {row.location}</small></span><span>{php(row.askingPricePhp)}</span><span>{row.mileageKm.toLocaleString("en-PH")} km</span><span><em className={`listing-status ${row.status}`}>{row.status}</em></span></div>)}</div></>}

    <div className="note-box"><h2>Publication rule</h2><p>Exact model/generation match, asking price, model year, mileage, condition, location, posted date and source evidence must be present. Public routes query the database with status=verified only.</p></div>
  </section>;
}
