"use client";

import { useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { PublicFormChallenge } from "@/components/PublicFormChallenge";
import { trackEvent } from "@/lib/track";

type Result = { ok: boolean; message?: string; error?: string; matchedDealers?: number; statusPath?: string };

export function LeadForm({ model }: { model: Motorcycle }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [statusPath, setStatusPath] = useState("");
  const [challengeToken, setChallengeToken] = useState("");
  const [challengeResetKey, setChallengeResetKey] = useState(0);
  const [noCoverage, setNoCoverage] = useState(false);
  const [cityProvince, setCityProvince] = useState("");
  const [coverage, setCoverage] = useState<"unchecked" | "checking" | "available" | "unavailable" | "error">("unchecked");

  async function checkCoverage() {
    if (cityProvince.trim().length < 3) { setCoverage("error"); return; }
    setCoverage("checking");
    try {
      const params = new URLSearchParams({ make: model.make, cityProvince: cityProvince.trim() });
      const response = await fetch(`/api/dealer-coverage?${params.toString()}`, { cache: "no-store" });
      const result = await response.json() as { ok: boolean; available?: boolean };
      if (!response.ok || !result.ok) { setCoverage("error"); return; }
      setCoverage(result.available ? "available" : "unavailable");
    } catch { setCoverage("error"); }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState("sending");
    setMessage("");
    setNoCoverage(false);

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
      turnstileToken: challengeToken,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as Result;
      if (!response.ok || !result.ok) {
        setNoCoverage(response.status === 422);
        trackEvent("dealer_quote_error", { model_id: model.id, http_status: response.status });
        setState("error");
        setMessage(result.error || "We could not save your request.");
        return;
      }
      trackEvent("dealer_quote_request", { model_id: model.id, matched_dealers: result.matchedDealers || 0 });
      setState("success");
      setMessage(result.message || "Your dealer request has been received.");
      setStatusPath(result.statusPath || "");
      form.reset();
    } catch {
      setState("error");
      setMessage("We could not save your request. Please try again.");
    } finally {
      setChallengeToken("");
      setChallengeResetKey(value => value + 1);
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
      <p>Tell us what you want to buy and where you are. Your request is matched only with verified dealer partners that are approved to receive buyer requests.</p>
    </div>

    <input className="form-honeypot" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

    <div className="lead-form-grid">
      <label><span>Variant <small>optional</small></span><input name="variant" placeholder="e.g. Standard, ABS, RoadSync" /></label>
      <label><span>City or province</span><input name="cityProvince" required value={cityProvince} onChange={event => { setCityProvince(event.target.value); setCoverage("unchecked"); setNoCoverage(false); }} placeholder="e.g. San Fernando, Pampanga" autoComplete="address-level2" /></label>
      <div className="lead-form-wide"><button className="button ghost small" type="button" onClick={checkCoverage} disabled={coverage === "checking"}>{coverage === "checking" ? "Checking dealers…" : "Check local dealer coverage"}</button>
        {coverage === "available" && <p role="status">A checked quote partner covers this location. Final stock and price still need dealer confirmation.</p>}
        {coverage === "unavailable" && <p role="status">No approved quote partner currently covers this location. <Link href={{ pathname: "/dealers", query: { brand: model.make } }}>Browse checked {model.make} dealers →</Link></p>}
        {coverage === "error" && <p role="status">Coverage could not be checked. You can browse the dealer directory or try again.</p>}
      </div>
      <label><span>Buying method</span><select name="purchaseType" required defaultValue="cash"><option value="cash">Cash</option><option value="installment">Installment</option></select></label>
      <label><span>Down payment budget <small>optional</small></span><input name="downPaymentBudget" type="number" min="0" step="1000" inputMode="numeric" placeholder="₱20,000" /></label>
      <label><span>Name</span><input name="fullName" required autoComplete="name" /></label>
      <label><span>Mobile number</span><input name="mobile" required inputMode="tel" autoComplete="tel" placeholder="09XXXXXXXXX" /></label>
      <label className="lead-form-wide"><span>Email <small>optional</small></span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
    </div>

    <label className="lead-consent"><input type="checkbox" name="consent" required /> <span>I agree that MotoIndex may store these details and share them with up to three relevant verified dealer partners when there is a match for this motorcycle and location.</span></label>

    <PublicFormChallenge action="buyer_quote" onToken={setChallengeToken} resetKey={challengeResetKey} />
    {state === "error" && <div className="form-error" role="alert"><p>{message}</p>{noCoverage && <Link href={{ pathname: "/dealers", query: { brand: model.make } }}>Find checked {model.make} dealers →</Link>}</div>}
    <button className="button" type="submit" disabled={state === "sending"}>{state === "sending" ? "Saving request…" : "Get dealer prices"}</button>
    <small>Your details are not shared with a public directory listing unless that dealer is also an approved MotoIndex quote partner.</small>
  </form>;
}
