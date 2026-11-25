// Rule-based scheduling conflict engine + alternative-slot recommender.
// Deterministic and explainable: every conflict and suggestion carries a plain-language reason.

import type { Conflict, Person, Settings, SportEvent, Team, Venue } from "./types";
import { addDays, addMinutes, combine, dateKey, durationMin, fmtDay, fmtRange, fmtTime, minutesOf, minutesOfDay, overlaps, startOfDay } from "./dates";

export interface EngineData {
  events: SportEvent[];
  teams: Team[];
  people: Person[];
  venues: Venue[];
  settings: Settings;
}

const isActive = (e: SportEvent) => e.status === "scheduled";
const competitive = (e: SportEvent) => e.type === "game" || e.type === "tournament";

function names(ids: string[], list: { id: string; name: string }[]) {
  return ids.map((i) => list.find((x) => x.id === i)?.name ?? i);
}

/** Facility-level checks that only depend on the event and its venue. */
export function facilityIssues(ev: SportEvent, venue: Venue | undefined): Omit<Conflict, "id">[] {
  const out: Omit<Conflict, "id">[] = [];
  if (!venue) return out;
  const day = dateKey(ev.start);
  const closure = venue.closures.find((c) => c.date === day);
  if (closure) {
    out.push({
      kind: "facility_closed", severity: "error", eventIds: [ev.id],
      title: `${venue.site} is closed`,
      message: `${ev.title} is booked at ${venue.site} · ${venue.name} on ${fmtDay(ev.start)}, but the facility is closed (${closure.reason}).`,
      fix: "Move the event to another date or venue.",
    });
  }
  const sMin = minutesOfDay(ev.start);
  const eMin = sMin + durationMin(ev.start, ev.end);
  if (sMin < minutesOf(venue.open) || eMin > minutesOf(venue.close)) {
    out.push({
      kind: "outside_hours", severity: "error", eventIds: [ev.id],
      title: "Outside operating hours",
      message: `${ev.title} runs ${fmtRange(ev.start, ev.end)}, but ${venue.site} · ${venue.name} is open ${venue.open}–${venue.close}.`,
      fix: `Shift the event so it ends by ${venue.close}, or choose a venue with later hours.`,
    });
  }
  for (const m of venue.maintenance) {
    if (overlaps(ev.start, ev.end, m.start, m.end)) {
      out.push({
        kind: "maintenance", severity: "error", eventIds: [ev.id],
        title: "Scheduled maintenance",
        message: `${venue.name} at ${venue.site} has maintenance (${m.reason}) ${fmtRange(m.start, m.end)} on ${fmtDay(m.start)}, overlapping ${ev.title}.`,
        fix: "Pick a time after maintenance ends or a different venue.",
      });
    }
  }
  if (ev.expectedAttendance && ev.expectedAttendance > venue.capacity) {
    out.push({
      kind: "capacity", severity: "warning", eventIds: [ev.id],
      title: "Over venue capacity",
      message: `${ev.title} expects ${ev.expectedAttendance} people; ${venue.name} holds ${venue.capacity}.`,
      fix: "Move to a larger venue or limit spectators.",
    });
  }
  return out;
}

/** People-level checks for one event. */
export function availabilityIssues(ev: SportEvent, data: Pick<EngineData, "teams" | "people" | "settings">): Omit<Conflict, "id">[] {
  const out: Omit<Conflict, "id">[] = [];
  const teams = data.teams.filter((t) => ev.teamIds.includes(t.id));
  for (const team of teams) {
    const coach = data.people.find((p) => p.id === team.coachId);
    const block = coach?.unavailable.find((u) => overlaps(ev.start, ev.end, u.start, u.end));
    if (coach && block) {
      out.push({
        kind: "coach_unavailable", severity: "error", eventIds: [ev.id],
        title: "Coach unavailable",
        message: `${coach.name} (coach, ${team.name}) is unavailable ${fmtRange(block.start, block.end)} on ${fmtDay(block.start)}: ${block.reason}.`,
        fix: "Reschedule, or assign an assistant coach for this event.",
      });
    }
    const out_players = team.playerIds
      .map((pid) => data.people.find((p) => p.id === pid)!)
      .filter((p) => p && p.unavailable.some((u) => overlaps(ev.start, ev.end, u.start, u.end)));
    if (out_players.length) {
      const share = out_players.length / team.playerIds.length;
      out.push({
        kind: "player_unavailable", severity: share >= data.settings.playerUnavailableThreshold ? "error" : "warning", eventIds: [ev.id],
        title: `${out_players.length} of ${team.playerIds.length} players unavailable`,
        message: `${team.name}: ${out_players.map((p) => p.name).join(", ")} marked unavailable for ${ev.title}.`,
        fix: share >= data.settings.playerUnavailableThreshold ? "Too few players: consider rescheduling." : "Confirm the team still has enough players.",
      });
    }
  }
  return out;
}

/** Checks between a candidate event and the other events. */
export function pairIssues(ev: SportEvent, others: SportEvent[], data: Pick<EngineData, "teams" | "venues" | "settings">): Omit<Conflict, "id">[] {
  const out: Omit<Conflict, "id">[] = [];
  const venue = data.venues.find((v) => v.id === ev.venueId);
  for (const o of others) {
    if (o.id === ev.id || !isActive(o)) continue;
    if (o.venueId === ev.venueId && overlaps(ev.start, ev.end, o.start, o.end)) {
      out.push({
        kind: "venue_double_booked", severity: "error", eventIds: [ev.id, o.id],
        title: `${venue?.name ?? "Venue"} double-booked`,
        message: `${ev.title} (${fmtRange(ev.start, ev.end)}) and ${o.title} (${fmtRange(o.start, o.end)}) both use ${venue?.site} · ${venue?.name} on ${fmtDay(ev.start)}.`,
        fix: "Move one event to another time or court.",
      });
    }
    const shared = ev.teamIds.filter((t) => o.teamIds.includes(t));
    if (!shared.length) continue;
    const teamNames = names(shared, data.teams).join(", ");
    if (overlaps(ev.start, ev.end, o.start, o.end)) {
      out.push({
        kind: "team_overlap", severity: "error", eventIds: [ev.id, o.id],
        title: "Overlapping team schedule",
        message: `${teamNames} would be in two places at once: ${ev.title} (${fmtRange(ev.start, ev.end)}) and ${o.title} (${fmtRange(o.start, o.end)}).`,
        fix: "Move one of the events so they no longer overlap.",
      });
    } else if (competitive(ev) && competitive(o)) {
      const [first, second] = new Date(ev.start) < new Date(o.start) ? [ev, o] : [o, ev];
      const gapH = (new Date(second.start).getTime() - new Date(first.end).getTime()) / 3_600_000;
      if (gapH >= 0 && gapH < data.settings.minRestHours) {
        out.push({
          kind: "insufficient_rest", severity: "warning", eventIds: [first.id, second.id],
          title: "Insufficient rest",
          message: `${teamNames} get only ${gapH < 1 ? `${Math.round(gapH * 60)} minutes` : `${gapH.toFixed(1)} hours`} between ${first.title} (ends ${fmtTime(first.end)}) and ${second.title} (starts ${fmtTime(second.start)}). League minimum: ${data.settings.minRestHours} hours.`,
          fix: "Move the second game to another day.",
        });
      }
    }
  }
  return out;
}

/** All issues for a single (possibly draft) event. Used for live validation in forms. */
export function checkEvent(ev: SportEvent, data: EngineData): Omit<Conflict, "id">[] {
  if (!isActive(ev)) return [];
  const venue = data.venues.find((v) => v.id === ev.venueId);
  // Only events within ~2 days can overlap or break the rest rule (minRestHours <= 48).
  const lo = new Date(new Date(ev.start).getTime() - 2 * 86_400_000).toISOString();
  const hi = new Date(new Date(ev.end).getTime() + 2 * 86_400_000).toISOString();
  const near = data.events.filter((o) => o.start < hi && o.end > lo);
  return [...facilityIssues(ev, venue), ...availabilityIssues(ev, data), ...pairIssues(ev, near, data)];
}

/** Detect every conflict among upcoming events, deduplicated, with recurring conflicts grouped. */
export function detectConflicts(data: EngineData, now = new Date()): Conflict[] {
  const upcoming = data.events.filter((e) => isActive(e) && new Date(e.end) > now).sort((a, b) => a.start.localeCompare(b.start));
  const raw: Omit<Conflict, "id">[] = [];
  const seenPairs = new Set<string>();
  // index by day for speed
  const byDay = new Map<string, SportEvent[]>();
  for (const e of upcoming) {
    const key = dateKey(e.start);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(e);
  }
  for (const ev of upcoming) {
    const venue = data.venues.find((v) => v.id === ev.venueId);
    raw.push(...facilityIssues(ev, venue), ...availabilityIssues(ev, data));
    const day = startOfDay(new Date(ev.start));
    const neighbours = [-1, 0, 1].flatMap((o) => byDay.get(dateKey(addDays(day, o))) ?? []);
    for (const issue of pairIssues(ev, neighbours, data)) {
      const key = issue.kind + ":" + [...issue.eventIds].sort().join("|");
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);
      raw.push(issue);
    }
  }

  // Group pairwise conflicts between two recurring series into one "recurring conflict".
  const evById = new Map(data.events.map((e) => [e.id, e]));
  const groups = new Map<string, Omit<Conflict, "id">[]>();
  const rest: Omit<Conflict, "id">[] = [];
  for (const c of raw) {
    if ((c.kind === "venue_double_booked" || c.kind === "team_overlap") && c.eventIds.length === 2) {
      const [a, b] = c.eventIds.map((i) => evById.get(i)!);
      if (a.seriesId && b.seriesId && a.seriesId !== b.seriesId) {
        const key = [a.seriesId, b.seriesId].sort().join("|") + c.kind;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(c);
        continue;
      }
    }
    rest.push(c);
  }
  for (const list of groups.values()) {
    if (list.length < 2) { rest.push(...list); continue; }
    const first = list[0];
    const [a, b] = first.eventIds.map((i) => evById.get(i)!);
    const venue = data.venues.find((v) => v.id === a.venueId);
    rest.push({
      kind: "recurring_conflict", severity: "error", eventIds: list.flatMap((c) => c.eventIds),
      title: "Conflicting recurring events",
      message: `The weekly series "${a.title}" and "${b.title}" overlap at ${venue?.site} · ${venue?.name} on ${list.length} upcoming dates (${list.slice(0, 3).map((c) => fmtDay(evById.get(c.eventIds[0])!.start)).join(", ")}${list.length > 3 ? ", …" : ""}).`,
      fix: "Edit one series (all future occurrences) to a different time or field.",
    });
  }
  const order = { error: 0, warning: 1 } as const;
  return rest
    .map((c) => ({ ...c, id: `${c.kind}:${[...c.eventIds].sort().join("|")}` }))
    .sort((x, y) => order[x.severity] - order[y.severity] || (evById.get(x.eventIds[0])?.start ?? "").localeCompare(evById.get(y.eventIds[0])?.start ?? ""));
}

export interface Alternative {
  id: string;
  event: SportEvent;
  score: number;
  reasons: string[];
  tradeoffs: string[];
  warnings: string[];
}

/**
 * Suggest conflict-free alternative slots for an event.
 * Searches the next `days` days across suitable venues in 30-minute steps and ranks by disruption.
 */
export function suggestAlternatives(ev: SportEvent, data: EngineData, opts: { days?: number; limit?: number; now?: Date; from?: Date } = {}): Alternative[] {
  const days = opts.days ?? 14;
  const limit = opts.limit ?? 3;
  const now = opts.now ?? new Date();
  const dur = durationMin(ev.start, ev.end);
  const origVenue = data.venues.find((v) => v.id === ev.venueId);
  const sport = data.teams.find((t) => ev.teamIds.includes(t.id))?.sport ?? origVenue?.sports[0];
  const venues = data.venues.filter((v) => !sport || v.sports.includes(sport));
  const origMin = minutesOfDay(ev.start);
  const origDay = startOfDay(new Date(ev.start));
  const base = opts.from ? startOfDay(opts.from) : startOfDay(new Date(Math.max(origDay.getTime(), now.getTime())));
  const others = data.events.filter((e) => e.id !== ev.id);
  const scratch: EngineData = { ...data, events: others };
  const found: Alternative[] = [];

  for (let d = 0; d <= days; d++) {
    const day = addDays(base, d);
    for (const v of venues) {
      for (let m = minutesOf(v.open); m + dur <= minutesOf(v.close); m += 30) {
        const start = addMinutes(day, m);
        if (start <= now) continue;
        const cand: SportEvent = { ...ev, venueId: v.id, start: start.toISOString(), end: addMinutes(start, dur).toISOString(), status: "scheduled" };
        if (cand.start === ev.start && cand.venueId === ev.venueId) continue;
        const issues = checkEvent(cand, scratch);
        if (issues.some((i) => i.severity === "error")) continue;
        const dayShift = Math.round((startOfDay(start).getTime() - origDay.getTime()) / 86_400_000);
        const timeShift = Math.abs(m - origMin);
        const sameWeekday = start.getDay() === origDay.getDay();
        const weekend = start.getDay() === 0 || start.getDay() === 6;
        const origWeekend = origDay.getDay() === 0 || origDay.getDay() === 6;
        let score = 100;
        score -= Math.abs(dayShift) * 4;
        score -= timeShift / 15;
        if (v.id !== ev.venueId) score -= v.site === origVenue?.site ? 4 : 10;
        if (sameWeekday) score += 6;
        if (weekend !== origWeekend) score -= 8;
        if (ev.type === "practice" && (m < 16 * 60 || m > 19 * 60) && !weekend) score -= 12; // school hours / late nights
        score -= issues.length * 6;
        const reasons: string[] = [];
        const tradeoffs: string[] = [];
        if (dayShift === 0) reasons.push("Same day as originally planned");
        else if (sameWeekday) reasons.push(`Same weekday, ${Math.abs(dayShift) / 7} week${Math.abs(dayShift) === 7 ? "" : "s"} ${dayShift > 0 ? "later" : "earlier"}`);
        else tradeoffs.push(`Moves ${Math.abs(dayShift)} day${Math.abs(dayShift) === 1 ? "" : "s"} ${dayShift > 0 ? "later" : "earlier"}`);
        if (v.id === ev.venueId) reasons.push("Keeps the same venue");
        else if (v.site === origVenue?.site) reasons.push(`Same site (${v.site}), different court/field`);
        else tradeoffs.push(`New venue: ${v.site} · ${v.name}`);
        if (timeShift === 0) reasons.push("Same start time");
        else if (timeShift <= 60) reasons.push("Start time within an hour of the original");
        else tradeoffs.push(`Start time changes to ${fmtTime(cand.start)}`);
        reasons.push("No venue, team, coach or facility conflicts");
        found.push({ id: `${v.id}@${cand.start}`, event: cand, score, reasons, tradeoffs, warnings: issues.map((i) => i.message) });
      }
    }
  }
  found.sort((a, b) => b.score - a.score);
  // diversify: avoid three options on the same day/venue
  const picked: Alternative[] = [];
  for (const alt of found) {
    if (picked.length >= limit) break;
    if (picked.some((p) => dateKey(p.event.start) === dateKey(alt.event.start) && p.event.venueId === alt.event.venueId)) continue;
    picked.push(alt);
  }
  return picked;
}

export const CONFLICT_LABEL: Record<Conflict["kind"], string> = {
  venue_double_booked: "Double-booked venue",
  team_overlap: "Overlapping team schedule",
  coach_unavailable: "Coach unavailable",
  player_unavailable: "Players unavailable",
  insufficient_rest: "Insufficient rest",
  facility_closed: "Facility closed",
  outside_hours: "Outside opening hours",
  maintenance: "Maintenance window",
  capacity: "Over capacity",
  recurring_conflict: "Recurring conflict",
};

export function newEventDraft(dateStr: string, start = "17:00", end = "18:30"): SportEvent {
  return { id: "", title: "", type: "practice", teamIds: [], venueId: "", start: combine(dateStr, start), end: combine(dateStr, end), status: "scheduled", source: "manual" };
}
