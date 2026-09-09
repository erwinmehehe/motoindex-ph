import type { Metadata } from "next";
import { databaseConfigured, prisma } from "@/lib/db";
import { DealerApplicationReview } from "@/components/DealerApplicationReview";

export const metadata:Metadata={title:"Dealer Applications",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";

export default async function DealerApplicationsAdmin(){
  const applications=databaseConfigured()?await prisma.dealerApplication.findMany({orderBy:{createdAt:"desc"},take:100}):[];
  return <section className="page shell">
    <div className="page-head"><h1>Dealer partner applications</h1><p>Review branch identity, official source evidence, brands and contact authorization. Approval creates a verified dealer record; applications never publish automatically.</p></div>

    <div className="health-summary">
      <div><span>Applications</span><strong>{applications.length}</strong></div>
      <div><span>New</span><strong>{applications.filter(x=>x.status==="new").length}</strong></div>
      <div><span>Approved</span><strong>{applications.filter(x=>x.status==="approved").length}</strong></div>
      <div><span>Rejected</span><strong>{applications.filter(x=>x.status==="rejected").length}</strong></div>
    </div>

    {!databaseConfigured()?<div className="note-box"><h2>Production database is not configured</h2><p>Dealer applications require DATABASE_URL and the latest Prisma migration.</p></div>:
    applications.length===0?<div className="note-box"><h2>No dealer applications yet</h2><p>New applications from /dealers/join will appear here.</p></div>:
    <div className="dealer-application-list">{applications.map(app=><article className="dealer-application-card" key={app.id}>
      <div className="dealer-application-main">
        <span>{app.status} · {app.createdAt.toISOString().slice(0,10)}</span>
        <h2>{app.businessName}{app.branchName?` - ${app.branchName}`:""}</h2>
        <p>{app.addressLabel} · {app.city}, {app.province}{app.region?` · ${app.region}`:""}</p>
        <div className="seller-tags">{app.brands.map(brand=><span key={brand}>{brand}</span>)}</div>
        <dl className="dealer-application-details">
          <div><dt>Branch phone</dt><dd>{app.phone}</dd></div>
          <div><dt>Website</dt><dd>{app.website?<a href={app.website} target="_blank" rel="noreferrer">{app.website}</a>:"Not supplied"}</dd></div>
          <div><dt>Official source</dt><dd>{app.officialSourceUrl?<a href={app.officialSourceUrl} target="_blank" rel="noreferrer">Open verification source ↗</a>:"Missing"}</dd></div>
          <div><dt>Contact</dt><dd>{app.contactName} · {app.contactEmail} · {app.contactMobile}</dd></div>
        </dl>
        {app.notes&&<p className="dealer-application-notes">{app.notes}</p>}
        {app.publishedSellerId&&<small>Published seller ID: {app.publishedSellerId}</small>}
      </div>
      <DealerApplicationReview id={app.id} status={app.status} initialNote={app.reviewNote||""}/>
    </article>)}</div>}
  </section>;
}
