"use client";
import { useState } from "react";
import type { ManilaCodingStatus } from "@/lib/transportWave2/numberCodingSchedule";
import styles from "./TransportWave2.module.css";

const weekdays = [
  ["Monday", "1, 2"], ["Tuesday", "3, 4"], ["Wednesday", "5, 6"],
  ["Thursday", "7, 8"], ["Friday", "9, 0"]
];

export function NumberCodingToday({ status }: { status: ManilaCodingStatus }) {
  const [digit, setDigit] = useState("");
  const selected = digit === "" ? null : Number(digit);
  const scheduled = selected !== null && status.digits.includes(selected);
  const todayText = status.suspended ? "Announced MMDA suspension for this date"
    : !status.isWeekday ? "No regular MMDA weekday coding scheduled"
    : "Regular MMDA coding scheduled — verify current advisories";
  return <section className={styles.codingCard} aria-labelledby="coding-checker-heading" data-number-coding-checker>
    <div className={styles.codingHeader}>
      <div><span className="section-kicker">Philippine time · Regular schedule only</span>
        <h2 id="coding-checker-heading">Number coding today</h2>
        <p><time dateTime={status.date}>{status.dateLabel}</time></p></div>
      <strong className={styles.todayBadge}>{status.suspended ? "Suspended" : status.isWeekday ? status.digits.join(" & ") : "Weekend"}</strong>
    </div>
    <p className={styles.scheduleNotice}><strong>{todayText}.</strong> {status.suspensionNotice || "Temporary MMDA or city suspensions are not automatically synchronized. Check an official advisory before driving."}</p>
    <div className={styles.checkGrid}>
      <div><label htmlFor="coding-last-digit">Your plate's last number</label>
        <select id="coding-last-digit" value={digit} onChange={e => setDigit(e.target.value)}>
          <option value="">Choose a digit</option>{Array.from({length:10},(_,n)=><option key={n} value={n}>{n}</option>)}
        </select></div>
      <div className={styles.checkResult} aria-live="polite">
        <span>Regular weekday result</span>
        <strong>{selected === null ? "Choose a plate ending" : status.suspended ? "Official suspension for this date" : !status.isWeekday ? "No regular weekend coding" : scheduled ? "Scheduled on this weekday" : "Not scheduled on this weekday"}</strong>
        <small>{selected === null ? "Check one plate's normal day." : `Plate ending ${selected}: normal coding day is ${weekdays.find(x=>x[1].split(", ").includes(String(selected)))?.[0] || "unknown"}.`}</small>
      </div>
    </div>
    <div className={styles.weekdays} aria-label="Regular weekday coding schedule">{weekdays.map(([day,plates])=><div key={day}><span>{day}</span><strong>{plates}</strong></div>)}</div>
    <p className={styles.codingDisclaimer}><strong>General MMDA hours:</strong> 7:00–10:00 AM and 5:00–8:00 PM on covered weekdays. Municipal rules and exemptions may differ. <a href="https://mmda.gov.ph/" target="_blank" rel="noopener noreferrer">Check MMDA advisories</a>.</p>
  </section>;
}
