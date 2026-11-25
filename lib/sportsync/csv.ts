// CSV import/export with row-level validation.

import type { EventType, SportEvent, Team, Venue } from "./types";
import { combine, dateKey, timeOf } from "./dates";

export const CSV_HEADERS = ["title", "type", "date", "start", "end", "venue", "teams", "notes"] as const;

export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  return rows;
}

const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

export function toCSV(events: SportEvent[], ctx: { venues: Venue[]; teams: Team[] }) {
  const lines = [CSV_HEADERS.join(",")];
  for (const e of events) {
    const v = ctx.venues.find((x) => x.id === e.venueId);
    lines.push([
      e.title, e.type, dateKey(e.start), timeOf(e.start), timeOf(e.end),
      v ? `${v.site} - ${v.name}` : "",
      e.teamIds.map((t) => ctx.teams.find((x) => x.id === t)?.name ?? t).join("; "),
      e.notes ?? "",
    ].map((s) => esc(String(s))).join(","));
  }
  return lines.join("\n") + "\n";
}

export interface ImportRow {
  line: number;
  raw: Record<string, string>;
  event?: SportEvent;
  errors: string[];
}

const TYPES: EventType[] = ["game", "practice", "tournament", "meeting"];

function findVenue(name: string, venues: Venue[]) {
  const n = name.trim().toLowerCase();
  return venues.find((v) => `${v.site} - ${v.name}`.toLowerCase() === n || v.name.toLowerCase() === n || `${v.site} ${v.name}`.toLowerCase() === n || v.id === n);
}

export function validateImport(text: string, ctx: { venues: Venue[]; teams: Team[] }): { rows: ImportRow[]; headerError?: string } {
  const table = parseCSV(text.trim());
  if (!table.length) return { rows: [], headerError: "The file is empty." };
  const header = table[0].map((h) => h.trim().toLowerCase());
  const missing = ["title", "type", "date", "start", "end", "venue"].filter((h) => !header.includes(h));
  if (missing.length) return { rows: [], headerError: `Missing required column(s): ${missing.join(", ")}. Expected: ${CSV_HEADERS.join(", ")}.` };
  const rows: ImportRow[] = [];
  table.slice(1).forEach((cells, idx) => {
    const raw: Record<string, string> = {};
    header.forEach((h, i) => (raw[h] = (cells[i] ?? "").trim()));
    const errors: string[] = [];
    if (!raw.title) errors.push("Title is required");
    const type = raw.type?.toLowerCase() as EventType;
    if (!TYPES.includes(type)) errors.push(`Type "${raw.type}" must be one of ${TYPES.join(", ")}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.date) || isNaN(new Date(raw.date + "T00:00:00").getTime())) errors.push(`Date "${raw.date}" must be YYYY-MM-DD`);
    const timeOk = (t: string) => /^([01]?\d|2[0-3]):[0-5]\d$/.test(t);
    if (!timeOk(raw.start)) errors.push(`Start "${raw.start}" must be HH:MM (24h)`);
    if (!timeOk(raw.end)) errors.push(`End "${raw.end}" must be HH:MM (24h)`);
    if (timeOk(raw.start) && timeOk(raw.end) && raw.end.padStart(5, "0") <= raw.start.padStart(5, "0")) errors.push("End time must be after start time");
    const venue = raw.venue ? findVenue(raw.venue, ctx.venues) : undefined;
    if (!venue) errors.push(`Venue "${raw.venue}" not found. Use e.g. "${ctx.venues[0].site} - ${ctx.venues[0].name}"`);
    const teamNames = (raw.teams ?? "").split(/[;|]/).map((s) => s.trim()).filter(Boolean);
    const teamIds: string[] = [];
    for (const tn of teamNames) {
      const t = ctx.teams.find((x) => x.name.toLowerCase() === tn.toLowerCase());
      if (t) teamIds.push(t.id);
      else errors.push(`Team "${tn}" not found`);
    }
    let event: SportEvent | undefined;
    if (!errors.length && venue) {
      event = {
        id: `imp-${Date.now().toString(36)}-${idx}`, title: raw.title, type, teamIds, venueId: venue.id,
        start: combine(raw.date, raw.start.padStart(5, "0")), end: combine(raw.date, raw.end.padStart(5, "0")),
        status: "scheduled", notes: raw.notes || undefined, source: "import",
      };
    }
    rows.push({ line: idx + 2, raw, event, errors });
  });
  return { rows };
}

export function sampleCSV(ctx: { venues: Venue[]; teams: Team[] }, baseDate: string) {
  const d = new Date(baseDate + "T00:00:00");
  const day = (n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return dateKey(x); };
  const [ca, , ng, sd] = ctx.venues;
  const t = (i: number) => ctx.teams[i].name;
  return [
    CSV_HEADERS.join(","),
    `Spring Jamboree Game 1,game,${day(21)},09:00,10:15,${ca.site} - ${ca.name},${t(0)}; ${t(3)},Bring white and dark jerseys`,
    `Spring Jamboree Game 2,game,${day(21)},10:30,11:45,${ca.site} - ${ca.name},${t(1)}; ${t(2)},`,
    `Parent information night,meeting,${day(18)},19:00,20:00,${sd.site} - ${sd.name},,"Volunteers, snacks and carpools"`,
    `Shooting clinic,practice,${day(19)},18:00,19:30,${ng.site} - ${ng.name},${t(4)},`,
    `Bad row example,scrimmage,${day(20)}/x,25:00,10:00,Moon Stadium,Imaginary Team,This row shows validation errors`,
  ].join("\n");
}
