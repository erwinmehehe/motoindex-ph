import Link from "next/link";
import type { Motorcycle } from "@/lib/types";

export function LeadForm({ model }: { model: Motorcycle }) {
  return <div className="lead-form disabled-feature" aria-live="polite">
    <div className="lead-form-head"><h2>No contact details are collected here.</h2><p>MotoIndex does not currently send buyer details to dealers or lenders. Use the price page and installment calculator to compare published and observed prices instead.</p></div>
    <Link className="button" href={`/motorcycles/${model.makeSlug}/${model.slug}#price`}>Open price page</Link>
    <small>Dealer requests will remain off until partner details, consent handling and secure data storage are in place.</small>
  </div>;
}
