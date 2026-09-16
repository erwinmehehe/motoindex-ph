import type { Metadata } from "next";
import { databaseConfigured, prisma } from "@/lib/db";
import { DealerApplicationReview } from "@/components/DealerApplicationReview";

export const metadata:Metadata={title:"Dealer Applications",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";

function placementInterest(notes:string|null){
  return notes?.match(/^Placement interest: (.+)\.$/m)?.[1]||"Legacy application";
}

function applicationNotes(notes:string|null){
  return (notes||"").replace(/^Placement interest: .+\.\n?/m,"").trim();
}

export default async function DealerApplicationsAdmin(){
  const applications=databaseConfigured()?await prisma.dealerApplication.findMany({orderBy:{createdAt:"desc"},take:100}):[];
  const featuredInterest=applications.filter(app=>!['Free Verified Listing','Legacy application'].includes(placementInterest(app.notes))).length;
  return <section className="page shell">
    <div className="page-head"><h1>Dealer partner applications</h1><p>Review branch identity, official source evidence, brands and contact authorization. Verification is independent from any paid placement interest.</p></div>

    <div className="health-summary">
      <div><span>Applications</span><strong>{applications.length}</strong></div>
      <div><span>New</span><strong>{applications.filter(x=>x.status==="new").length}</strong></div>
      <div><span>Featured interest</span><strong>{featuredInterest}</strong></div>
      <div><span>Approved</span><strong>{applications.filter(x=>x.status==="approved").length}</strong></div>
      <div><span>Rejected</span><strong>{applications.filter(x=>x.status==="rejected").length}</strong></div>
    </div>

    {!databaseConfigured()?<div className="note-box"><h2>Production database is not configured</h2><p>Dealer applications require DATABASE_URL and the latest Prisma migration.</p></div>:
    applications.length===0?<div className="note-box"><h2>No dealer applications yet</h2><p>New applications from /dealers/join will appear here.</p></div>:
    <div className="dealer-application-list">{applications.map(app=>{
      const interest=placementInterest(app.notes);
      const notes=applicationNotes(app.notes);
      return <article className="dealer-application-card" key={app.id}>
      <div className="dealer-application-main">
        <span>{app.status} · {app.createdAt.toISOString().slice(0,10)}</span>
        <h2>{app.businessName}{app.branchName?` - ${app.branchName}`:""}</h2>
        <p>{app.addressLabel} · {app.city}, {app.province}{app.region?` · ${app.region}`:""}</p>
        <div className="seller-tags">{app.brands.map(brand=><span key={brand}>{brand}</span>)}</div>
        <dl className="dealer-application-details">
          <div><dt>Placement interest</dt><dd>{interest}</dd></div>
          <div><dt>Branch phone</dt><dd>{app.phone}</dd></div>
          <div><dt>Website</dt><dd>{app.website?<a href={app.website} target="_blank" rel="noreferrer">{app.website}</a>:"Not supplied"}</dd></div>
          <div><dt>Official source</dt><dd>{app.officialSourceUrl?<a href={app.officialSourceUrl} target="_blank" rel="noreferrer">Open verification source ↗</a>:"Missing"}</dd></div>
          <div><dt>Contact</dt><dd>{app.contactName} · {app.contactEmail} · {app.contactMobile}</dd></div>
        </dl>
        {notes&&<p className="dealer-application-notes">{notes}</p>}
        {app.publishedSellerId&&<small>Published seller ID: {app.publishedSellerId}</small>}
      </div>
      <DealerApplicationReview id={app.id} status={app.status} initialNote={app.reviewNote||""}/>
    </article>})}</div>}
  </section>;
}
