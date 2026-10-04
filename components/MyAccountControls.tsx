"use client";

import { useState } from "react";

export function MyAccountControls() {
  const [working, setWorking] = useState(false);
  const [status, setStatus] = useState("");

  async function signOut() {
    setWorking(true);
    await fetch("/api/garage/auth/sign-out", { method: "POST" }).catch(() => {});
    window.location.replace("/my");
  }

  async function deleteAccount() {
    if (!window.confirm("Delete your MotoIndex account and private cloud account data? Export your data first if you want a copy. This does not delete anonymous/local browser data on this device.")) return;
    const phrase = window.prompt('Type DELETE to confirm account deletion.');
    if (phrase !== "DELETE") return;
    setWorking(true);
    setStatus("");
    const response = await fetch("/api/my/account", { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setWorking(false);
      setStatus(data.error || "Account could not be deleted.");
      return;
    }
    window.location.replace("/my?deleted=1");
  }

  return <section className="info-card" id="account">
    <span className="field-label">Account & privacy</span>
    <h2>Your account controls</h2>
    <p>Download the private account data MotoIndex stores for you, sign out, or permanently delete the account record and owner-scoped cloud data.</p>
    <div className="hero-actions">
      <button className="button small" type="button" onClick={() => { window.location.assign("/api/my/export"); }} disabled={working}>Export my account data</button>
      <button className="button small ghost" type="button" onClick={signOut} disabled={working}>Sign out</button>
      <button className="button small ghost" type="button" onClick={deleteAccount} disabled={working}>Delete account</button>
    </div>
    {status && <p className="muted-note" role="alert">{status}</p>}
  </section>;
}
