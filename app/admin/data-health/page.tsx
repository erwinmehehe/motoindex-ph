import type { Metadata } from "next";
import { attentionQueue, modelHealthRows, healthSummary } from "@/lib/dataHealth";
import { refreshQueueRows, refreshQueueSummary } from "@/lib/refreshQueue";
import { getAffiliateConfigSummary } from "@/lib/affiliate";
export const metadata: Metadata = { title: "Data Health", robots: { index: false, follow: false } };

export default function DataHealthPage(){
  const rows=modelHealthRows();
  const summary=healthSummary();
  const queue=attentionQueue(12);
  const refreshQueue=refreshQueueRows().slice(0, 30);
  const refreshSummary=refreshQueueSummary();
  const analytics=Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID||process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
  const affiliate=getAffiliateConfigSummary();
  return <section className="page shell">
    <div className="page-head"><h1>Data health & research queue</h1><p>Production data-quality dashboard for public motorcycle records. It prioritizes stale sources, thin price coverage, unresolved price ranges and missing ownership data. This route remains protected by middleware authentication and noindex headers.</p></div>
    <div className="health-summary v20">
      <div><span>Public models</span><strong>{summary.publicModels}</strong></div>
      <div><span>Source refresh due</span><strong>{summary.sourceRefreshDue}</strong></div>
      <div><span>Price refresh due</span><strong>{summary.marketRefreshDue}</strong></div>
      <div><span>&lt;2 price sources</span><strong>{summary.weakPriceCoverage}</strong></div>
      <div><span>Variant-mapped models</span><strong>{summary.variantMappedModels}</strong><small>{summary.verifiedVariants} verified trims</small></div>
      <div><span>Variant/range reviews</span><strong>{summary.variantMappingPending}</strong></div>
      <div><span>Price tracking</span><strong>{summary.priceTrackingModels}</strong><small>{summary.priceHistoryReady} with 2+ snapshots</small></div>
      <div><span>Fuel economy gaps</span><strong>{summary.missingFuelEconomy}</strong></div>
      <div><span>Missing images</span><strong>{summary.missingImages}</strong></div>
      <div><span>Manual schedules</span><strong>{summary.maintenanceCovered}</strong></div>
      <div><span>Safety coverage</span><strong>{summary.safetyCovered}</strong></div>
      <div><span>Analytics provider</span><strong>{analytics?"On":"Off"}</strong><small>{analytics?"GA or Plausible configured":"Set GA/Plausible env"}</small></div>
      <div><span>Affiliate links</span><strong>{affiliate.configured}</strong><small>{affiliate.configured?`${affiliate.configured} product links active`:`No approved links configured`}</small></div>
    </div>

    <section className="priority-queue">
      <div className="section-head compact"><div><h2>Next research queue: highest-impact records to fix</h2><p>The score is operational triage, not a quality rating of the motorcycle. Price ranges are flagged for trim review without assuming that every range represents a real variant.</p></div></div>
      <div className="queue-list">{queue.map((row,index)=><div className="queue-row" key={row.id}><b>#{index+1}</b><span><strong>{row.label}</strong><small>Priority {row.priorityScore} · {row.flags.slice(0,3).join(" · ") || "routine"}</small></span><p>{row.nextAction}</p></div>)}</div>
    </section>

    <section className="priority-queue refresh-queue">
      <div className="section-head compact"><div><h2>Scheduled refresh queue — Dates, not just flags</h2><p>This is the missing freshness calendar: market prices refresh every 30 days; published model facts every 90 days; LTO/insurance and verified compatibility records are also placed on a 90-day review cycle.</p></div></div>
      <div className="health-summary refresh-summary"><div><span>Total scheduled</span><strong>{refreshSummary.total}</strong></div><div><span>Overdue</span><strong>{refreshSummary.overdue}</strong></div><div><span>Due in 14 days</span><strong>{refreshSummary.due14}</strong></div><div><span>Due in 30 days</span><strong>{refreshSummary.due30}</strong></div><div><span>Next due</span><strong>{refreshSummary.nextDueAt || "—"}</strong></div></div>
      <div className="refresh-table"><div className="refresh-row head"><span>Area</span><span>Record</span><span>Checked</span><span>Due</span><span>Status</span></div>{refreshQueue.map((row)=><div className={`refresh-row ${row.status}`} key={row.id}><span>{row.area}</span><span><b>{row.label}</b>{row.sourceUrl&&<small><a href={row.sourceUrl} target="_blank" rel="noreferrer">Source ↗</a></small>}</span><span>{row.checkedAt}</span><span>{row.dueAt}</span><span>{row.daysUntilDue < 0 ? `${Math.abs(row.daysUntilDue)}d overdue` : row.daysUntilDue === 0 ? "Due today" : `${row.daysUntilDue}d`}</span></div>)}</div>
    </section>

    <div className="admin-table health-table"><div className="admin-row head"><span>Model</span><span>Prices</span><span>Variants</span><span>History</span><span>Image</span><span>Fuel</span><span>Flags</span></div>{rows.map(r=><div className="admin-row" key={r.id}><span><b>{r.label}</b><small>Checked {r.verifiedAt}</small></span><span>{r.priceSources}</span><span>{r.variantCount||"—"}</span><span>{r.priceSnapshotCount||"—"}</span><span>{r.imageCount?"✓":"—"}</span><span>{r.fuelEconomy?"✓":"—"}</span><span><small>{r.flags.length?r.flags.join(" · "):"Healthy"}</small></span></div>)}</div>

    <div className="note-box"><h2>Affiliate configuration</h2><p>Affiliate CTAs are fail-closed: they appear only when a catalog product ID has a valid approved direct-Shopee or Involve Asia link in <code>AFFILIATE_LINKS_JSON</code>. The legacy <code>SHOPEE_AFFILIATE_LINKS_JSON</code> mapping remains supported during migration. Public pages never fall back to a fake tracking URL.</p><div className="analytics-events"><span><b>Configured links</b><small>{affiliate.configured} of {affiliate.catalogProducts} catalog products</small></span><span><b>Network mix</b><small>{affiliate.byNetwork.shopeeDirect} direct Shopee · {affiliate.byNetwork.involveAsia} Involve Asia</small></span><span><b>Configuration issues</b><small>{affiliate.issues.length?affiliate.issues.map(issue=>`${issue.productId?`${issue.productId}: `:""}${issue.message}`).join(" · "):"None"}</small></span><span><b>Click event</b><small>affiliate_click · merchant, network, product ID, product name and placement</small></span></div></div>

    <div className="note-box"><h2>Analytics instrumentation</h2><p>MotoIndex supports Google Analytics through <code>NEXT_PUBLIC_GA_MEASUREMENT_ID</code> or Plausible through <code>NEXT_PUBLIC_PLAUSIBLE_DOMAIN</code>. Finder/model opens, shortlist saves/shares, site search and comparison builds emit events when a provider is configured.</p><div className="analytics-events"><span><b>site_search</b><small>query length, result count, zero-result flag; raw term only if explicitly enabled</small></span><span><b>finder_open_model</b><small>model + match score</small></span><span><b>finder_zero_results</b><small>active filter state</small></span><span><b>shortlist_save / remove / share</b><small>saved-model actions</small></span><span><b>compare_build</b><small>two- or three-bike comparison</small></span></div></div>
  </section>;
}
