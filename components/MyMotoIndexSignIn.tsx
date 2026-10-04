"use client";

import { FormEvent, useState } from "react";

export function MyMotoIndexSignIn() {
  const [email, setEmail] = useState("");
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorking(true);
    setMessage("");
    const response = await fetch("/api/garage/auth/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));
    setWorking(false);
    setMessage(data.message || data.error || (response.ok ? "Check your email." : "Sign-in email could not be sent."));
  }

  return <section className="info-card my-signin-card">
    <span className="field-label">MotoIndex account</span>
    <h2>Bring your riding and buying activity together</h2>
    <p>Use the same passwordless account as My Garage. Your browser shortlist stays local until you sign in, then MotoIndex can copy it into your private account.</p>
    <form className="lead-form" onSubmit={submit}>
      <div className="lead-form-grid">
        <label className="lead-form-wide">Email<input type="email" required value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" /></label>
      </div>
      <button className="button" type="submit" disabled={working}>{working ? "Sending…" : "Email me a sign-in link"}</button>
    </form>
    {message && <p className="muted-note" role="status">{message}</p>}
  </section>;
}
