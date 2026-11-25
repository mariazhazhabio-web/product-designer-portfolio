// Small, dependency-free date helpers. All demo times are local time.

export const DAY_MS = 86_400_000;
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function addMinutes(d: Date, n: number) {
  return new Date(d.getTime() + n * 60_000);
}

/** Monday-based week start */
export function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7;
  return addDays(x, -day);
}

export function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** YYYY-MM-DD in local time */
export function dateKey(d: Date | string) {
  const x = typeof d === "string" ? new Date(d) : d;
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
}

export function fromDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Combine YYYY-MM-DD and HH:MM into a local ISO string (no timezone suffix issues: we store full ISO) */
export function combine(dateKeyStr: string, time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = fromDateKey(dateKeyStr);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export function timeOf(iso: string) {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function minutesOf(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesOfDay(iso: string) {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

const ISO_Z = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
/** Interval overlap. Normalised UTC ISO strings compare lexicographically, which is much faster than parsing. */
export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  if (aStart.length === 24 && bEnd.length === 24 && bStart.length === 24 && aEnd.length === 24 && ISO_Z.test(aStart) && ISO_Z.test(bStart)) {
    return aStart < bEnd && bStart < aEnd;
  }
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

export function durationMin(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60_000);
}

const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const longDayFmt = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" });
const monthFmt = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

export const fmtTime = (iso: string) => timeFmt.format(new Date(iso));
export const fmtDay = (d: Date | string) => dayFmt.format(typeof d === "string" ? new Date(d) : d);
export const fmtLongDay = (d: Date | string) => longDayFmt.format(typeof d === "string" ? new Date(d) : d);
export const fmtMonth = (d: Date) => monthFmt.format(d);
export const fmtRange = (start: string, end: string) => `${fmtTime(start)} – ${fmtTime(end)}`;
export const fmtDateTime = (iso: string) => `${fmtDay(iso)}, ${fmtTime(iso)}`;

export function relativeTime(iso: string, now = new Date()) {
  const diff = (new Date(iso).getTime() - now.getTime()) / 60_000;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < 60) return rtf.format(Math.round(diff), "minute");
  if (abs < 60 * 24) return rtf.format(Math.round(diff / 60), "hour");
  return rtf.format(Math.round(diff / (60 * 24)), "day");
}

/** Next date (>= from, strictly after if strict) that falls on weekday wd */
export function nextWeekday(from: Date, wd: number, strict = true) {
  let d = startOfDay(from);
  if (strict) d = addDays(d, 1);
  while (d.getDay() !== wd) d = addDays(d, 1);
  return d;
}
