import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/site";
import { repoObservations, repoPriceRange, REPO_MARKET_CHECKED_AT, SB_FINANCE_REPO_CENTRAL_URL, SB_FINANCE_REPO_WAREHOUSE_URL } from "@/lib/repoMarket";
import { php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title:"Repo Motorcycle Prices Philippines — Current Listings",
  description:"Compare current seller-published repo motorcycle prices in the Philippines, then check unit condition, documents, ownership transfer and payment terms.",
  path:"/used-motorcycles/repo",
  index:true
});

const faqs=[
  {question:"Are these MotoIndex marketplace listings?",answer:"No. These are advertised repo-unit prices observed on current SB Finance pages observed on SB Finance pages. MotoIndex does not take the payment, guarantee stock, inspect the unit, or represent the seller."},
  {question:"Are repo motorcycle prices fixed?",answer:"Do not assume so. SB Finance states that prices may vary by unit and can change without prior notice. Verify the exact SKU, condition, mileage, cash or financing terms, and current price with the seller before paying."},
  {question:"Do repossessed motorcycles still have the manufacturer warranty?",answer:"SB Finance states in its repo FAQ that repossessed units no longer have the manufacturer warranty and are released under an as-is, where-is clause. Confirm the exact contract and unit condition before purchase."},
  {question:"What documents should I check before buying a used or repo motorcycle?",answer:"For ownership transfer, current LTO rules list a duly notarized deed of conveyance or sale, OR/CR, valid HPG clearance and valid identification among the general requirements. Check the exact current LTO transaction requirements for your case."}
];

export default function RepoMotorcyclesPage(){
  const range=repoPriceRange();
  const itemList={"@context":"https://schema.org","@type":"ItemList",name:"Repo motorcycle price observations in the Philippines",dateModified:REPO_MARKET_CHECKED_AT,itemListElement:repoObservations.map((x,i)=>({"@type":"ListItem",position:i+1,name:x.label,url:x.sourceUrl}))};
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Used motorcycles"},{label:"Repo motorcycles"}]}/>
    <div className="page-head"><h1>Repo motorcycle prices in the Philippines</h1><p>This is a price board based on current seller-published pages, not a MotoIndex marketplace. The current snapshot includes {range.count} advertised repo-unit price cards from {php(range.low)} to {php(range.high)}. Price, stock, mileage and condition can change by unit, so verify the exact seller record before paying.</p><small className="source-date">Source snapshot checked {REPO_MARKET_CHECKED_AT}</small></div>

    <div className="note-box"><h2>What this page can and cannot tell you</h2><p>The table helps you compare advertised repo prices and jump into MotoIndex model research. It does <strong>not</strong> establish fair market value: repo condition, mileage, model year, variant, documents, financing terms and repair needs can materially change what a unit is worth.</p></div>

    <div className="comparison-wrap"><table className="comparison-table"><thead><tr><th>Repo unit</th><th>Advertised price</th><th>Source</th><th>Research</th></tr></thead><tbody>{repoObservations.map(x=><tr key={x.id}><td><strong>{x.label}</strong>{x.note&&<small style={{display:"block",marginTop:4}}>{x.note}</small>}</td><td><strong>{php(x.advertisedPricePhp)}</strong></td><td><a href={x.sourceUrl} target="_blank" rel="noreferrer">{x.sourceName} ↗</a><small style={{display:"block",marginTop:4}}>Checked {x.checkedAt}</small></td><td>{x.researchHref?<Link href={x.researchHref}>Model research →</Link>:<span>Verify exact variant</span>}</td></tr>)}</tbody></table></div>

    <div className="section-head compact"><div><h2>Before you treat a repo unit as a bargain</h2><p>Price is only one part of the transaction. Check the unit and the transfer path before you commit.</p></div></div>
    <div className="topic-grid"><Link href="/used-motorcycles/buying-checklist"><h2>Used motorcycle buying checklist</h2><p>Documents, identity, HPG clearance, inspection, mileage and payment checks.</p><b>Open checklist →</b></Link><Link href="/ownership/transfer-of-ownership"><h2>Transfer of ownership</h2><p>Current-source LTO requirements and the newer motorcycle ownership-transfer rule.</p><b>Check requirements →</b></Link><Link href="/ownership/deed-of-sale-motorcycle-philippines"><h2>Motorcycle deed of sale</h2><p>How the notarized deed fits the current LTO transfer process.</p><b>Read guide →</b></Link></div>

    <div className="source-ladder"><article><span>Primary price source</span><h2>SB Finance Repo Central</h2><p>Current repo price cards used for the table above.</p><div><a className="text-link" href={SB_FINANCE_REPO_CENTRAL_URL} target="_blank" rel="noreferrer">Open source ↗</a><small>Checked {REPO_MARKET_CHECKED_AT}</small></div></article><article><span>Seller guidance</span><h2>SB Finance repo warehouse</h2><p>Seller page covering repo financing, sample price ranges, warehouse information and unit caveats.</p><div><a className="text-link" href={SB_FINANCE_REPO_WAREHOUSE_URL} target="_blank" rel="noreferrer">Open source ↗</a><small>Checked {REPO_MARKET_CHECKED_AT}</small></div></article></div>
    <FaqSection title="Repo motorcycle questions" items={faqs}/>
    <JsonLd data={itemList}/>
  </section>;
}
