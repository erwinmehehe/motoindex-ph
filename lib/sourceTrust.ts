import { isCompetitorSource } from "@/lib/competitors";

export type SourceTrustKind = "official" | "government" | "dealer" | "comparison" | "historical" | "recheck" | "published";

const OFFICIAL_HOSTS = [
  "hondaph.com",
  "yamaha-motor.com.ph",
  "mc.suzuki.com.ph",
  "kawasaki.ph",
  "ktm.com",
  "cfmotoph.com",
  "bmwmotorrad.com.ph",
  "triumphmotorcycles.ph",
  "vespa.com",
  "aprilia.com",
  "benelli.com",
  "royalenfield.com",
  "ducati.com",
  "husqvarna-motorcycles.com",
  "kymco.com",
  "sym-global.com",
  "zontes.com",
  "qjmotor.com",
  "bristol-motorcycles.com"
];

function hostFor(url?: string) {
  if (!url) return "";
  try { return new URL(url).hostname.toLowerCase().replace(/^www\./, ""); }
  catch { return ""; }
}

function hostMatches(host: string, candidates: string[]) {
  return candidates.some(candidate => host === candidate || host.endsWith(`.${candidate}`));
}

export function sourceTrustKind({
  label,
  url,
  needsRecheck = false,
  historical = false,
}: {
  label?: string;
  url?: string;
  needsRecheck?: boolean;
  historical?: boolean;
}): SourceTrustKind {
  if (needsRecheck) return "recheck";
  if (historical || /historical|launch price|launch srp|previous model/i.test(label || "")) return "historical";
  if (isCompetitorSource(url)) return "comparison";
  const host = hostFor(url);
  if (host.endsWith(".gov.ph") || host === "gov.ph" || /government|lto|dti|doe/i.test(label || "")) return "government";
  if (hostMatches(host, OFFICIAL_HOSTS) || /official manufacturer|manufacturer philippines|motorcycles philippines|motor philippines/i.test(label || "")) return "official";
  if (/authorized dealer|dealer price|dealer listing|dealership|retailer/i.test(label || "")) return "dealer";
  return "published";
}

export const sourceTrustLabels: Record<SourceTrustKind, string> = {
  official: "Official manufacturer",
  government: "Government reference",
  dealer: "Dealer / retailer",
  comparison: "Comparison source",
  historical: "Historical reference",
  recheck: "Needs reconfirmation",
  published: "Published source",
};
