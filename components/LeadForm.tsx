"use client";

import { useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";

type Result = { ok: boolean; message?: string; error?: string; matchedDealers?: number; statusPath?: string };

export function LeadForm({ model }: { model: Motorcycle }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [statusPath, setStatusPath] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState("sending");
    setMessage("");

    const payload = {
      modelId: model.id,
      variant: String(data.get("variant") || ""),
      cityProvince: String(data.get("cityProvince") || ""),
      purchaseType: String(data.get("purchaseType") || ""),
      downPaymentBudget: String(data.get("downPaymentBudget") || ""),
      fullName: String(data.get("fullName") || ""),
      mobile: String(data.get("mobile") || ""),
      email: String(data.get("email") || ""),
      consent: data.get("consent") === "on",
      website: String(data.get("website") || ""),
      sourcePath: window.location.pathname,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as Result;
      if (!response.ok || !result.ok) {
        setState("error");
        setMessage(result.error || "We could not save your request.");
        return;
      }
      setState("success");
      setMessage(result.message || "Your dealer request has been saved.");
      setStatusPath(result.statusPath || "");
      form.reset();
    } catch {
      setState("error");
      setMessage("We could not save your request. Please try again.");
    }
  }

  if (state === "success") {
    return <div className="lead-form lead-form-success" aria-live="polite">
      <div className="lead-form-head"><span>Request received</span><h2>We saved your dealer request.</h2><p>{message}</p></div>
      <div className="hero-actions">
        {statusPath&&<Link className="button" href={statusPath}>View quote status</Link>}
        <Link className={statusPath?"button ghost":"button"} href={`/motorcycles/${model.makeSlug}/${model.slug}`}>Back to {model.model}</Link>
        <Link className="button ghost" href="/dealers">Browse verified dealers</Link>
      </div>
      {statusPath&&<small>Save the private quote-status link if you want to return later. It expires after 30 days and should not be shared publicly.</small>}
      {!statusPath&&<small>MotoIndex only shares contact details with verified dealer partners when a match exists.</small>}
    </div>;
  }

  return <form className="lead-form" onSubmit={submit} aria-live="polite">
    <div className="lead-form-head">
      <span>Dealer quote request</span>
      <h2>Get the latest {model.make} {model.model} dealer price</h2>
      <p>Tell us what you want to buy and where you are. Your request is matched only with verified dealer records.</p>
    </div>

    <input className="form-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

    <div className="lead-form-grid">
      <label><span>Variant <small>optional</small></span><input name="variant" placeholder="e.g. Standard, ABS, RoadSync" /></label>
      <label><span>City or province</span><input name="cityProvince" required placeholder="e.g. San Fernando, Pampanga" autoComplete="address-level2" /></label>
      <label><span>Buying method</span><select name="purchaseType" required defaultValue="cash"><option value="cash">Cash</option><option value="installment">Installment</option></select></label>
      <label><span>Down payment budget <small>optional</small></span><input name="downPaymentBudget" type="number" min="0" step="1000" inputMode="numeric" placeholder="₱20,000" /></label>
      <label><span>Name</span><input name="fullName" required autoComplete="name" /></label>
      <label><span>Mobile number</span><input name="mobile" required inputMode="tel" autoComplete="tel" placeholder="09XXXXXXXXX" /></label>
      <label className="lead-form-wide"><span>Email <small>optional</small></span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
    </div>

    <label className="lead-consent"><input type="checkbox" name="consent" required /> <span>I agree that MotoIndex may store these details and share them with a verified dealer only when there is a relevant match for this motorcycle and location.</span></label>

    {state === "error" && <p className="form-error" role="alert">{message}</p>}
    <button className="button" type="submit" disabled={state === "sending"}>{state === "sending" ? "Saving request…" : "Get dealer prices"}</button>
    <small>No request is represented as sent to a dealer unless a verified dealer match exists.</small>
  </form>;
}
