import type { Metadata } from "next";
import { databaseConfigured, prisma } from "@/lib/db";
import { usedListings } from "@/lib/usedMarket";
import { php } from "@/lib/utils";

export const metadata:Metadata={title:"Used Listing Review",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";

export default async function UsedListingsAdmin(){
  const persistent=databaseConfigured()?await prisma.usedListing.findMany({
    orderBy:[{updatedAt:"desc"},{postedAt:"desc"}],
    take:150,
    include:{owner:{select:{email:true}}}
  }):[];

  const count=(status:string)=>persistent.filter(row=>row.status===status).length;

  return <section className="page shell">
    <div className="page-head">
      <h1>Used listing review</h1>
      <p>{databaseConfigured()?"Review owner submissions and sourced listings before they enter the verified public marketplace. Owner contact details stay on this protected admin surface.":"Production database is not connected; legacy demo fixtures remain visible here for development review only."}</p>
    </div>

    {persistent.length>0 ? <>
      <div className="health-summary">
        <div><span>Total rows</span><strong>{persistent.length}</strong></div>
        <div><span>Submitted</span><strong>{count("submitted")}</strong></div>
        <div><span>Verified</span><strong>{count("verified")}</strong></div>
        <div><span>Rejected / expired</span><strong>{count("rejected")+count("expired")}</strong></div>
      </div>

      <div className="admin-table">
        <div className="admin-row used-admin-head"><span>Listing</span><span>Price</span><span>Mileage</span><span>Review</span></div>
        {persistent.map(row=><div className="admin-row" key={row.id}>
          <span>
            <b>{row.title}</b>
            <small>{row.modelExternalId} · {row.location} · {row.modelYear}</small>
            <small>{row.owner?`Owner: ${row.owner.email}`:`Source: ${row.sourceLabel}`}</small>
          </span>
          <span>{php(row.askingPricePhp.toNumber())}</span>
          <span>{row.mileageKm.toLocaleString("en-PH")} km</span>
          <span>
            <em className={`listing-status ${row.status}`}>{row.status}</em>
            <small>{row.verifiedAt?`Verified ${row.verifiedAt.toISOString().slice(0,10)}`:"Not public"}</small>
            {row.sourceUrl&&<small><a href={row.sourceUrl} target={row.sourceUrl.startsWith("/")?undefined:"_blank"} rel={row.sourceUrl.startsWith("/")?undefined:"noreferrer"}>Open source ↗</a></small>}
            <form className="hero-actions" action={`/api/admin/used-listings/${row.id}`} method="post">
              {row.status!=="verified"&&<button className="button small" type="submit" name="action" value="verify">Verify</button>}
              {row.status!=="rejected"&&<button className="button small ghost" type="submit" name="action" value="reject">Reject</button>}
              {row.status!=="expired"&&<button className="button small ghost" type="submit" name="action" value="expire">Expire</button>}
            </form>
          </span>
        </div>)}
      </div>
    </> :
      <><div className="note-box"><h2>No persistent used listings yet</h2><p>Owner submissions will appear here after authenticated Garage users submit a motorcycle. Demo fixtures below are never returned by the public used-listing API.</p></div><div className="admin-table"><div className="admin-row used-admin-head"><span>Legacy fixture</span><span>Price</span><span>Mileage</span><span>Status</span></div>{usedListings.map(row=><div className="admin-row" key={row.id}><span><b>{row.title}</b><small>{row.modelId} · {row.location}</small></span><span>{php(row.askingPricePhp)}</span><span>{row.mileageKm.toLocaleString("en-PH")} km</span><span><em className={`listing-status ${row.status}`}>{row.status}</em></span></div>)}</div></>}

    <div className="note-box">
      <h2>Publication rule</h2>
      <p>Verify only after the motorcycle matches the MotoIndex model, the year, mileage, asking price, condition and location are plausible, and the submission is suitable for publication. Verification publishes the listing fields only. It does not certify ownership, identity, mechanical condition, mileage or Garage documents.</p>
    </div>
  </section>;
}
