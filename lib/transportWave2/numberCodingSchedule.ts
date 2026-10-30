/** A regular MMDA planning schedule, not a live enforcement or LGU advisory feed. */
export const codingDaysByWeekday: Record<string, number[]> = {
  Sunday: [], Monday: [1, 2], Tuesday: [3, 4], Wednesday: [5, 6],
  Thursday: [7, 8], Friday: [9, 0], Saturday: []
};

export type ManilaCodingStatus = {
  date: string;
  dateLabel: string;
  weekday: string;
  digits: number[];
  suspended: boolean;
  suspensionNotice?: string;
  isWeekday: boolean;
};

const publishedSuspensions: Record<string, string> = {
  "2026-11-02": "MMDA announced suspension of expanded number coding for All Souls' Day (PIA report, October 30, 2026)."
};

export function getManilaCodingStatus(now: Date): ManilaCodingStatus {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila", year: "numeric", month: "2-digit",
    day: "2-digit", weekday: "long"
  }).formatToParts(now);
  const part = (key: string) => p.find(x => x.type === key)?.value || "";
  const date = `${part("year")}-${part("month")}-${part("day")}`;
  const weekday = part("weekday");
  const digits = codingDaysByWeekday[weekday] ?? [];
  const suspensionNotice = publishedSuspensions[date];
  return {
    date,
    dateLabel: new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila", month: "long", day: "numeric", year: "numeric", weekday: "long"
    }).format(now),
    weekday,
    digits: [...digits],
    suspended: Boolean(suspensionNotice),
    ...(suspensionNotice ? { suspensionNotice } : {}),
    isWeekday: digits.length > 0
  };
}
