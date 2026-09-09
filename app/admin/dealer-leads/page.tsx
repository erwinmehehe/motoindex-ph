import type { Metadata } from "next";
import { databaseConfigured, prisma } from "@/lib/db";
import { DealerLeadStatus } from "@/components/DealerLeadStatus";
import { php } from "@/lib/utils";

export const metadata:Metadata={title:"Dealer Leads",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";

export default async function DealerLeadsAdmin(){
  const leads=databaseConfigured()?await prisma.dealerLead.findMany({orderBy:{createdAt:"desc"},take:100}):[];
  return <section className="page shell">
    <div className="page-head"><h1>Dealer lead review</h1><p>Buyer requests from the model quote funnel. This route is protected by MotoIndex admin Basic Auth and excluded from indexing.</p></div>
    <div className="health-summary"><div><span>Recent leads</span><strong>{leads.length}</strong></div><div><span>Matched</span><strong>{leads.filter(l=>l.matchedSellerSlugs.length>0).length}</strong></div><div><span>New / matched</span><strong>{leads.filter(l=>["new","matched"].includes(l.status)).length}</strong></div><div><span>Contacted</span><strong>{leads.filter(l=>l.status==="contacted").length}</strong></div></div>
    {!databaseConfigured()?<div className="note-box"><h2>Production database is not configured</h2><p>Set DATABASE_URL and run the Prisma migrations before enabling dealer lead collection.</p></div>:
    leads.length===0?<div className="note-box"><h2>No dealer leads yet</h2><p>Requests will appear here after the production database is configured and buyers submit the model quote form.</p></div>:
    <div className="admin-table dealer-lead-admin">
      <div className="admin-row dealer-lead-head"><span>Buyer / motorcycle</span><span>Contact</span><span>Buying plan</span><span>Dealer match</span><span>Status</span></div>
      {leads.map(lead=><div className="admin-row" key={lead.id}>
        <span><b>{lead.fullName}</b><small>{lead.make} {lead.model}{lead.variant?` · ${lead.variant}`:""} · {lead.cityProvince}</small><small>{lead.createdAt.toISOString().slice(0,16).replace("T"," ")}</small></span>
        <span><b>{lead.mobile}</b><small>{lead.email||"No email"}</small></span>
        <span><b>{lead.purchaseType}</b><small>{lead.downPaymentBudget?php(lead.downPaymentBudget):"No down-payment budget"}</small></span>
        <span><b>{lead.matchedSellerSlugs.length}</b><small>{lead.matchedSellerSlugs.join(", ")||"Not shared with a dealer"}</small></span>
        <span><DealerLeadStatus id={lead.id} current={lead.status}/></span>
      </div>)}
    </div>}
  </section>;
}
