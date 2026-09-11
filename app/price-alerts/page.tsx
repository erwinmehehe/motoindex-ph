import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { observedMarketRange } from "@/lib/marketChecks";
import { publicApiConfigured } from "@/lib/apiBase";
import { PriceAlertForm } from "@/components/PriceAlertForm";

export const metadata:Metadata=pageMetadata({
  title:"Motorcycle Price Alerts Philippines",
  description:"Create a confirmed email alert for a motorcycle when MotoIndex's published starting-price reference reaches your target price.",
  path:"/price-alerts",
  index:false
});

export default function AlertsPage(){
  const models=publicMotorcycles
    .filter(item=>item.marketStatus!=="previous"&&item.marketStatus!=="discontinued"&&item.marketStatus!=="uncertain")
    .map(item=>({id:item.id,label:`${item.make} ${item.model}`,currentPricePhp:observedMarketRange(item).from}))
    .filter(item=>item.currentPricePhp>0)
    .sort((a,b)=>a.label.localeCompare(b.label));

  return <section className="page shell price-alerts-page">
    <div className="page-head">
      <span className="entity-kicker">Motorcycle price alerts</span>
      <h1>Get an email when a motorcycle reaches your price target.</h1>
      <p>MotoIndex checks the current published starting-price reference. Alerts do not guarantee dealer stock, a final cash quote, financing approval or a promotion.</p>
    </div>

    {publicApiConfigured&&models.length
      ? <div className="quote-grid">
          <div className="quote-summary">
            <h2>How it works</h2>
            <ul className="checklist">
              <li>Choose a current motorcycle and target price</li>
              <li>Confirm your email before the alert becomes active</li>
              <li>MotoIndex checks published price references on the scheduled alert run</li>
              <li>A notification sends only when the reference reaches or drops below your target</li>
              <li>Every alert email includes an unsubscribe link</li>
            </ul>
            <div className="note-box compact-note"><h3>Dealer prices can still differ</h3><p>Registration, insurance, dealer fees, stock, financing and promotions can change the actual amount you pay.</p></div>
          </div>
          <PriceAlertForm models={models}/>
        </div>
      : <div className="note-box"><h2>Price alerts are not active on this deployment yet</h2><p>MotoIndex will not collect an alert email until the separated backend URL, production database, email sender and scheduled price checker are configured.</p><div className="hero-actions"><Link className="button small" href="/motorcycles">Browse motorcycle prices</Link><Link className="button ghost small" href="/deals">Current seller offers</Link></div></div>}

    <div className="note-box"><h2>What price the alert uses</h2><p>The threshold is compared with the same published starting-price reference used by MotoIndex model research. It is a research signal, not a promise that every dealer will sell the motorcycle at that amount.</p></div>
  </section>;
}
