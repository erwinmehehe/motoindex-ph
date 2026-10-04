"use client";

import { useState } from "react";

export type MyNotificationSettings = {
  notificationPriceDropEmail: boolean;
  notificationQuoteEmail: boolean;
  notificationRegistrationEmail: boolean;
  notificationInsuranceEmail: boolean;
  notificationMaintenanceEmail: boolean;
  notificationDealerPromoEmail: boolean;
};

const options: Array<{ key: keyof MyNotificationSettings; title: string; copy: string }> = [
  { key: "notificationPriceDropEmail", title: "Price drops", copy: "Email when an account-linked alert reaches its target." },
  { key: "notificationQuoteEmail", title: "Dealer quotes", copy: "Email when a dealer submits a quote or an active quote is close to expiring." },
  { key: "notificationRegistrationEmail", title: "Registration due", copy: "LTO renewal reminders from your latest cloud Garage." },
  { key: "notificationInsuranceEmail", title: "Insurance due", copy: "Insurance renewal reminders from your latest cloud Garage." },
  { key: "notificationMaintenanceEmail", title: "Maintenance due", copy: "PMS and user-entered service reminders from your latest cloud Garage." },
  { key: "notificationDealerPromoEmail", title: "Dealer promo changes", copy: "Optional account emails when fresh dealer promotions are available for motorcycles you saved." },
];

export function MyNotificationPreferences({ initial }: { initial: MyNotificationSettings }) {
  const [settings, setSettings] = useState(initial);
  const [status, setStatus] = useState("");

  async function toggle(key: keyof MyNotificationSettings) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    setStatus("Saving…");
    const response = await fetch("/api/my/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: next[key] }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setSettings(settings);
      setStatus(data.error || "Preference could not be saved.");
      return;
    }
    setSettings(data.preferences || next);
    setStatus("Saved");
  }

  return <section className="info-card" id="notifications">
    <div className="section-head compact"><div><span className="field-label">Notifications</span><h2>Choose what MotoIndex emails you</h2><p>Transactional sign-in and confirmation emails are separate from these optional ongoing notifications.</p></div></div>
    <div className="spec-grid">
      {options.map(option => <label className="info-card" key={option.key}>
        <span><strong>{option.title}</strong><small>{option.copy}</small></span>
        <input type="checkbox" checked={settings[option.key]} onChange={() => void toggle(option.key)} />
      </label>)}
    </div>
    <p className="muted-note" role="status">{status}</p>
  </section>;
}
