/** Return a valid public GA4 measurement ID, or no analytics at all. */
export function googleAnalyticsMeasurementId(configured: string | undefined | null) {
  const id = (configured || "").trim().toUpperCase();
  return /^G-[A-Z0-9]{5,20}$/.test(id) ? id : "";
}
