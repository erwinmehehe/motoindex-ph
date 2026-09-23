"use client";

import { useState } from "react";

export function GarageMagicLinkConfirm({ token }: { token: string }) {
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [message, setMessage] = useState("");

  async function confirm() {
    setStatus("working");
    setMessage("");
    const response = await fetch(`/api/garage/auth/verify/${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error || "This sign-in link could not be used.");
      return;
    }
    window.location.replace("/garage?account=connected");
  }

  return <section className="note-box">
    <h2>Continue to My Garage</h2>
    <p>The email link has been opened. Continue below to create your secure MotoIndex session.</p>
    <button className="button" type="button" onClick={confirm} disabled={status === "working"}>
      {status === "working" ? "Signing in…" : "Continue to My Garage"}
    </button>
    {message && <p className="muted-note" role="alert">{message}</p>}
  </section>;
}
