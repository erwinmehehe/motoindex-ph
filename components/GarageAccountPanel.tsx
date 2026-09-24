"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  GARAGE_STORAGE_KEY,
  GarageState,
  emptyGarageState,
  parseGarageState,
} from "@/lib/garage";

type AccountState = {
  available: boolean;
  authenticated: boolean;
  email?: string;
  reminderEmailsEnabled?: boolean;
  remindersAvailable?: boolean;
  sessionExpiresAt?: string;
  cloud?: { revision: number; updatedAt: string } | null;
};

type CloudState = {
  revision: number;
  updatedAt?: string;
  payload: GarageState | null;
};

export function GarageAccountPanel({
  garageState,
  onRestore,
}: {
  garageState: GarageState;
  onRestore: (state: GarageState) => void;
}) {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [cloud, setCloud] = useState<CloudState>({ revision: 0, payload: null });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [working, setWorking] = useState(false);

  async function refreshCloud() {
    const response = await fetch("/api/garage/sync", { cache: "no-store" });
    if (!response.ok) {
      setCloud({ revision: 0, payload: null });
      return;
    }
    const data = await response.json();
    const snapshot = data.snapshot;
    if (!snapshot) {
      setCloud({ revision: 0, payload: null });
      return;
    }
    const restored = parseGarageState(JSON.stringify(snapshot.payload));
    setCloud({
      revision: Number(snapshot.revision) || 0,
      updatedAt: snapshot.updatedAt,
      payload: restored,
    });
  }

  async function loadAccount() {
    const response = await fetch("/api/garage/account", { cache: "no-store" });
    const data = await response.json().catch(() => ({ available: false, authenticated: false }));
    setAccount(data);
    if (data.authenticated) await refreshCloud();
  }

  useEffect(() => {
    void loadAccount();
  }, []);

  async function requestSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWorking(true);
    setStatus("");
    const response = await fetch("/api/garage/auth/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));
    setWorking(false);
    setStatus(data.message || data.error || (response.ok ? "Check your email." : "Sign-in email could not be sent."));
  }

  async function saveCloud() {
    setWorking(true);
    setStatus("");
    const response = await fetch("/api/garage/sync", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: garageState, revision: cloud.revision }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 409) {
      await refreshCloud();
      setWorking(false);
      setStatus("The cloud copy changed on another device. Review or restore that version before saving again.");
      return;
    }
    if (!response.ok) {
      setWorking(false);
      setStatus(data.error || "Cloud save failed.");
      return;
    }
    setCloud({ revision: Number(data.revision) || cloud.revision + 1, updatedAt: data.updatedAt, payload: garageState });
    setWorking(false);
    if (account?.reminderEmailsEnabled && data.reminderCount === null) {
      setStatus("Your Garage was saved, but the reminder schedule could not refresh. Save again later before relying on email reminders.");
    } else {
      const reminderNote = account?.reminderEmailsEnabled && Number.isFinite(data.reminderCount) ? ` ${data.reminderCount} reminder${data.reminderCount === 1 ? "" : "s"} refreshed.` : "";
      setStatus(`This device is saved to your private MotoIndex cloud Garage.${reminderNote}`);
    }
  }

  function restoreCloud() {
    if (!cloud.payload) return;
    if (!window.confirm("Replace this browser's current Garage with the cloud copy? Export a local backup first if you need both versions.")) return;
    window.localStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify(cloud.payload));
    onRestore(cloud.payload);
    setStatus("Cloud Garage restored to this browser.");
  }

  async function toggleReminders() {
    if (!account?.authenticated) return;
    setWorking(true);
    setStatus("");
    const enabled = !account.reminderEmailsEnabled;
    const response = await fetch("/api/garage/reminders/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    const data = await response.json().catch(() => ({}));
    setWorking(false);
    if (!response.ok) {
      setStatus(data.error || "Reminder preference could not be updated.");
      return;
    }
    setAccount((current) => current ? { ...current, reminderEmailsEnabled: enabled } : current);
    setStatus(enabled
      ? "Email reminders are on. They use the most recent Garage copy you save to the cloud."
      : "Email reminders are off.");
  }

  async function signOut() {
    setWorking(true);
    await fetch("/api/garage/auth/sign-out", { method: "POST" }).catch(() => {});
    setWorking(false);
    setCloud({ revision: 0, payload: null });
    setAccount((current) => ({ available: current?.available ?? true, authenticated: false }));
    setStatus("Signed out. Your local Garage remains on this browser.");
  }

  if (!account || !account.available) return null;

  if (!account.authenticated) {
    return <section className="info-card">
      <span className="field-label">MotoIndex account</span>
      <h2>Keep a private cloud copy</h2>
      <p>Your Garage already works without an account. Sign in by email only if you want a private copy you can restore on another device.</p>
      <form className="lead-form" onSubmit={requestSignIn}>
        <div className="lead-form-grid">
          <label className="lead-form-wide">Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" /></label>
        </div>
        <button className="button small" type="submit" disabled={working}>{working ? "Sending…" : "Email me a sign-in link"}</button>
      </form>
      {status && <p className="muted-note" role="status">{status}</p>}
    </section>;
  }

  return <section className="info-card">
    <div className="section-head">
      <div>
        <span className="field-label">Private cloud Garage</span>
        <h2>{account.email}</h2>
        <p>Sync is explicit in this release so another device cannot silently replace a newer Garage.</p>
      </div>
      <button className="button small ghost" type="button" onClick={signOut} disabled={working}>Sign out</button>
    </div>

    <div className="spec-grid">
      <div><span>Cloud copy</span><strong>{cloud.payload ? `Revision ${cloud.revision}` : "Not saved yet"}</strong><small>{cloud.updatedAt ? `Updated ${new Date(cloud.updatedAt).toLocaleString("en-PH")}` : "Save this device when you are ready"}</small></div>
      <div><span>This device</span><strong>{garageState.motorcycles.length} motorcycle{garageState.motorcycles.length === 1 ? "" : "s"}</strong><small>{garageState.records.length} ownership record{garageState.records.length === 1 ? "" : "s"} · {garageState.documents.length} document record{garageState.documents.length === 1 ? "" : "s"}</small></div>
    </div>

    <div className="hero-actions">
      <button className="button small" type="button" onClick={saveCloud} disabled={working}>{working ? "Working…" : "Save this device to cloud"}</button>
      <button className="button small ghost" type="button" onClick={restoreCloud} disabled={working || !cloud.payload}>Restore cloud to this device</button>
      <button className="button small ghost" type="button" onClick={toggleReminders} disabled={working || !account.remindersAvailable}>{account.remindersAvailable ? (account.reminderEmailsEnabled ? "Turn off email reminders" : "Turn on email reminders") : "Email reminders unavailable"}</button>
      <button className="button small ghost" type="button" onClick={() => { setCloud({ revision: 0, payload: emptyGarageState() }); void refreshCloud(); }} disabled={working}>Refresh cloud status</button>
    </div>
    <p className="muted-note">{account.remindersAvailable ? "Renewal and PMS emails are opt-in and use only your latest cloud-synced Garage. Save again after changing mileage or due dates so reminders stay current." : "Cloud backup is available, but email reminders stay off until the scheduled notification job is configured."}</p>
    {status && <p className="muted-note" role="status">{status}</p>}
  </section>;
}
