"use client";

import { FormEvent, useState } from "react";

export function UsedListingInquiryForm({ listingId, listingTitle }: { listingId: string; listingTitle: string }) {
  const [working, setWorking] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("consent") !== "on") {
      setStatus("Confirm that MotoIndex may send your inquiry to the seller.");
      return;
    }

    setWorking(true);
    setStatus("");
    const response = await fetch(`/api/used-listings/${encodeURIComponent(listingId)}/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        mobile: data.get("mobile"),
        message: data.get("message"),
        company: data.get("company"),
        consent: true,
      }),
    });
    const body = await response.json().catch(() => ({}));
    setWorking(false);

    if (!response.ok) {
      setStatus(body.error || "Your inquiry could not be sent.");
      return;
    }

    form.reset();
    setStatus("Inquiry sent to the seller. They can reply directly to your email.");
  }

  return <form className="lead-form" onSubmit={submit}>
    <div className="section-head">
      <div>
        <span className="field-label">Contact seller</span>
        <h2>Ask about {listingTitle}</h2>
        <p>Your email and optional mobile number are sent to the seller only after you submit this form. The seller&apos;s email stays private.</p>
      </div>
    </div>
    <div className="lead-form-grid">
      <label>Name<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
      <label>Email<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
      <label>Mobile, optional<input name="mobile" maxLength={30} autoComplete="tel" placeholder="09xx xxx xxxx" /></label>
      <label className="lead-form-wide">Message<textarea name="message" required minLength={10} maxLength={1000} rows={5} placeholder="Ask about availability, documents, service history or when you can inspect the motorcycle." /></label>
      <label className="garage-honeypot" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      <label className="lead-form-wide"><input name="consent" type="checkbox" required /> I agree that MotoIndex may send these contact details and this message to the seller for this inquiry.</label>
    </div>
    <button className="button" type="submit" disabled={working}>{working ? "Sending…" : "Send inquiry"}</button>
    {status && <p className="muted-note" role="status">{status}</p>}
  </form>;
}
