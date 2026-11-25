// SIMULATED AI scheduling assistant.
// There is no language model here: a transparent rule-based parser turns the instruction into
// constraints, and a deterministic constraint-satisfaction scheduler builds the proposal.
// A live LLM could replace parseInstruction() later; the scheduler and explanations stay the same.

import type { Proposal, Sport, SportEvent, Team } from "./types";
import { addDays, addMinutes, combine, dateKey, fmtDay, fmtTime, minutesOf, nextWeekday, WEEKDAYS } from "./dates";
import { checkEvent, detectConflicts, suggestAlternatives, type EngineData } from "./conflicts";

export type Intent = "tournament" | "practices" | "resolve";

export interface ParsedInstruction {
  intent: Intent;
  sport: Sport;
  teamCount: number | null;
  ageGroup: string | null;
  weekends: number;
  weekdays: number[];
  startDate: string; // YYYY-MM-DD
  earliest: string;
  latest: string;
  gameMinutes: number;
  oncePerDay: boolean;
  avoidOverlap: boolean;
  minRestHours: number | null;
  venueIds: string[];
  perWeek: number;
  understood: string[];
}

const NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, sixteen: 16, once: 1, twice: 2 };
const toNum = (s: string) => (/^\d+$/.test(s) ? Number(s) : NUM[s.toLowerCase()] ?? NaN);

function parseClock(raw: string): string | null {
  const m = raw.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  if (m[3] === "pm" && h < 12) h += 12;
  if (m[3] === "am" && h === 12) h = 0;
  if (!m[3] && h < 7) h += 12; // "until 6" in a sports context means 6 pm
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function parseInstruction(text: string, data: EngineData, now = new Date()): ParsedInstruction {
  const t = text.toLowerCase();
  const understood: string[] = [];
  const intent: Intent = /conflict|fix|resolve|clash/.test(t) && !/tournament/.test(t) ? "resolve" : /practice|training/.test(t) && !/tournament/.test(t) ? "practices" : "tournament";
  const sport: Sport = /soccer|football|futsal/.test(t) ? "soccer" : "basketball";
  const teamM = t.match(/\b(\d+|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|sixteen)\s+teams?\b/);
  const teamCount = teamM ? toNum(teamM[1]) : null;
  const ageM = t.match(/\bu-?(\d{1,2})\b/);
  const ageGroup = ageM ? `U${ageM[1]}` : null;
  const wkM = t.match(/\b(\d+|one|two|three|four|five|six)\s+weekends?\b/);
  const weekends = wkM ? toNum(wkM[1]) : /weekend/.test(t) ? 1 : 2;

  const weekdays: number[] = [];
  WEEKDAYS.forEach((d, i) => { if (new RegExp(`\\b${d.toLowerCase()}s?\\b`).test(t)) weekdays.push(i); });
  if (!weekdays.length && /weekday evening|weeknight|weekdays/.test(t)) weekdays.push(1, 2, 3, 4);
  if (/sundays? only|only on sundays?/.test(t)) weekdays.splice(0, weekdays.length, 0);
  if (/saturdays? only|only on saturdays?/.test(t)) weekdays.splice(0, weekdays.length, 6);

  let earliest = intent === "practices" ? "16:30" : "09:00";
  let latest = intent === "practices" ? "20:00" : "18:00";
  const between = t.match(/between\s+([\d:]+\s*(?:am|pm)?)\s+and\s+([\d:]+\s*(?:am|pm)?)/);
  if (between) {
    earliest = parseClock(between[1]) ?? earliest;
    latest = parseClock(between[2]) ?? latest;
  }
  const before = t.match(/no (?:games|events|practices) before\s+([\d:]+\s*(?:am|pm)?)/) ?? t.match(/(?:start|starting) after\s+([\d:]+\s*(?:am|pm)?)/);
  if (before) earliest = parseClock(before[1]) ?? earliest;
  const after = t.match(/(?:finish|end|done) by\s+([\d:]+\s*(?:am|pm)?)/) ?? t.match(/no (?:games|events|practices) after\s+([\d:]+\s*(?:am|pm)?)/);
  if (after) latest = parseClock(after[1]) ?? latest;

  const durM = t.match(/(\d{2,3})[- ]?(?:minute|min)\b/);
  const gameMinutes = durM ? Number(durM[1]) : intent === "practices" ? 90 : sport === "basketball" ? 60 : 60;
  const oncePerDay = /once (?:per|a) day|one game (?:per|a) day|only once per day|once each day/.test(t) || intent === "tournament";
  const avoidOverlap = true;
  const restM = t.match(/(\d+)\s*(?:hours?|hrs?) (?:of )?rest|rest (?:of )?(\d+)\s*(?:hours?|hrs?)/);
  const minRestHours = restM ? Number(restM[1] ?? restM[2]) : null;
  const perWeekM = t.match(/\b(once|twice|\d+ times?)\s+(?:a|per)\s+week/);
  const perWeek = perWeekM ? (perWeekM[1].startsWith("once") ? 1 : perWeekM[1].startsWith("twice") ? 2 : parseInt(perWeekM[1])) : 2;

  const venueIds = data.venues.filter((v) => t.includes(v.site.toLowerCase()) || t.includes(v.site.split(" ")[0].toLowerCase() + " ")).map((v) => v.id);

  // Start date: explicit weekday after "starting", else the first weekend with no league games.
  let start: Date;
  const startM = t.match(/start(?:ing)?\s+(?:on\s+)?(?:next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
  if (startM) start = nextWeekday(now, WEEKDAYS.findIndex((d) => d.toLowerCase() === startM[1]), true);
  else if (intent === "tournament") {
    start = nextWeekday(now, 6, true);
    for (let i = 0; i < 8; i++) {
      const sat = addDays(start, i * 7);
      const busy = data.events.some((e) => e.status === "scheduled" && e.type === "game" && dateKey(e.start) === dateKey(sat) && data.teams.some((tm) => tm.sport === sport && e.teamIds.includes(tm.id)));
      if (!busy) { start = sat; break; }
    }
  } else start = addDays(now, 1);

  understood.push(intent === "tournament" ? "Tournament schedule" : intent === "practices" ? "Recurring practice plan" : "Resolve existing conflicts");
  understood.push(`Sport: ${sport}`);
  if (teamCount) understood.push(`${teamCount} teams`);
  if (ageGroup) understood.push(`Age group ${ageGroup}`);
  if (intent === "tournament") understood.push(`${weekends} weekend${weekends > 1 ? "s" : ""} from ${fmtDay(start)}`);
  if (weekdays.length) understood.push(`Days: ${weekdays.map((d) => WEEKDAYS[d].slice(0, 3)).join(", ")}`);
  if (intent === "practices") understood.push(`${perWeek}× per week`);
  understood.push(`Window ${earliest}–${latest}`);
  understood.push(`${gameMinutes}-minute ${intent === "practices" ? "sessions" : "games"}`);
  if (oncePerDay && intent === "tournament") understood.push("Max one game per team per day");
  understood.push("No overlapping bookings");
  if (minRestHours) understood.push(`Min rest ${minRestHours}h`);
  if (venueIds.length) understood.push(`Venues: ${venueIds.map((v) => data.venues.find((x) => x.id === v)!.site).join(", ")}`);

  return { intent, sport, teamCount, ageGroup, weekends, weekdays, startDate: dateKey(start), earliest, latest, gameMinutes, oncePerDay, avoidOverlap, minRestHours, venueIds, perWeek, understood };
}

/** Circle-method round robin. Returns rounds of [home, away] index pairs. */
export function roundRobin(n: number): [number, number][][] {
  const ids = Array.from({ length: n % 2 ? n + 1 : n }, (_, i) => i);
  const m = ids.length;
  const rounds: [number, number][][] = [];
  for (let r = 0; r < m - 1; r++) {
    const round: [number, number][] = [];
    for (let i = 0; i < m / 2; i++) {
      const a = ids[i], b = ids[m - 1 - i];
      if (a < n && b < n) round.push(r % 2 ? [b, a] : [a, b]);
    }
    rounds.push(round);
    ids.splice(1, 0, ids.pop()!);
  }
  return rounds;
}

interface Match { a?: string; b?: string; label: string; stage: string }

let proposalCounter = 0;

export function generateProposal(prompt: string, data: EngineData, version: number, now = new Date()): Proposal {
  const p = parseInstruction(prompt, data, now);
  const base: Omit<Proposal, "events" | "explanation" | "warnings" | "stats"> = {
    id: `pr-${Date.now()}-${++proposalCounter}`, version, prompt, understood: p.understood, status: "pending", createdAt: new Date().toISOString(),
  };
  if (p.intent === "practices") return { ...base, ...practicePlan(p, data, now) };
  if (p.intent === "resolve") return { ...base, ...resolvePlan(data, now) };
  return { ...base, ...tournamentPlan(p, data) };
}

function pickTeams(p: ParsedInstruction, data: EngineData) {
  let teams = data.teams.filter((t) => t.sport === p.sport && (!p.ageGroup || t.ageGroup === p.ageGroup));
  const warnings: string[] = [];
  const want = p.teamCount ?? teams.length;
  if (teams.length < want) {
    warnings.push(`Only ${teams.length} ${p.sport} teams exist in this league; ${want - teams.length} placeholder team(s) were added. Replace them before publishing.`);
    const extra: Team[] = Array.from({ length: want - teams.length }, (_, i) => ({ id: `tbd-${i + 1}`, name: `Guest Team ${i + 1}`, sport: p.sport, ageGroup: p.ageGroup ?? "Open", coachId: "", color: "#64748b", playerIds: [] }));
    teams = [...teams, ...extra];
  }
  return { teams: teams.slice(0, want), warnings };
}

function tournamentPlan(p: ParsedInstruction, data: EngineData) {
  const explanation: string[] = [];
  const { teams, warnings } = pickTeams(p, data);
  const n = teams.length;
  const start = new Date(p.startDate + "T00:00:00");
  const dayList: string[] = [];
  const allowed = p.weekdays.length ? p.weekdays : [6, 0];
  for (let w = 0; w < p.weekends; w++) {
    for (let d = 0; d < 7; d++) {
      const day = addDays(start, w * 7 + d);
      if (allowed.includes(day.getDay())) dayList.push(dateKey(day));
    }
  }
  const fullRounds = roundRobin(n);
  let rounds: Match[][] = [];
  if (!p.oncePerDay || dayList.length >= fullRounds.length) {
    rounds = fullRounds.map((r, i) => r.map(([a, b]) => ({ a: teams[a].id, b: teams[b].id, label: `${teams[a].name} vs ${teams[b].name}`, stage: `Round ${i + 1}` })));
    explanation.push(`Format: full round robin. ${n} teams need ${fullRounds.length} rounds and you have ${dayList.length} match days, so every team plays every other team once (${n * (n - 1) / 2} games).`);
    if (!p.oncePerDay && dayList.length < fullRounds.length) explanation.push("More than one round per day is allowed because \"once per day\" was not requested.");
  } else {
    const half = Math.ceil(n / 2);
    const A = teams.slice(0, half), B = teams.slice(half);
    const rA = roundRobin(A.length), rB = roundRobin(B.length);
    const poolRounds = Math.max(rA.length, rB.length);
    for (let i = 0; i < poolRounds; i++) {
      rounds.push([
        ...(rA[i] ?? []).map(([a, b]) => ({ a: A[a].id, b: A[b].id, label: `${A[a].name} vs ${A[b].name}`, stage: `Pool A · R${i + 1}` })),
        ...(rB[i] ?? []).map(([a, b]) => ({ a: B[a].id, b: B[b].id, label: `${B[a].name} vs ${B[b].name}`, stage: `Pool B · R${i + 1}` })),
      ]);
    }
    const remaining = dayList.length - poolRounds;
    const crossDays = Math.max(0, remaining - 2);
    for (let c = 0; c < crossDays && B.length; c++) {
      rounds.push(A.map((ta, i) => { const tb = B[(i + c) % B.length]; return { a: ta.id, b: tb.id, label: `${ta.name} vs ${tb.name}`, stage: `Crossover ${c + 1}` }; }).filter((m) => m.b));
    }
    if (remaining >= 2) {
      rounds.push([
        { label: "Semifinal 1: Pool A #1 vs Pool B #2", stage: "Semifinals" },
        { label: "Semifinal 2: Pool B #1 vs Pool A #2", stage: "Semifinals" },
        { label: "Placement: Pool A #3 vs Pool B #4", stage: "Placement" },
        { label: "Placement: Pool B #3 vs Pool A #4", stage: "Placement" },
      ].slice(0, Math.floor(n / 2)));
      rounds.push([
        { label: "Final: winners of SF1 and SF2", stage: "Finals" },
        { label: "3rd place: losers of SF1 and SF2", stage: "Finals" },
        { label: "5th place match", stage: "Finals" },
        { label: "7th place match", stage: "Finals" },
      ].slice(0, Math.floor(n / 2)));
    }
    explanation.push(`Format: pool play + playoffs. A full round robin for ${n} teams needs ${fullRounds.length} match days with one game per team per day, but ${p.weekends} weekend(s) give ${dayList.length}. So teams are split into two pools of ${half} (${poolRounds} pool rounds)${crossDays ? `, ${crossDays} crossover round(s)` : ""}${remaining >= 2 ? ", then semifinals and placement finals" : ""}.`);
    if (remaining < 0) warnings.push(`Not enough days even for pool play: ${-remaining} round(s) could not be scheduled. Add a weekend or allow two games per day.`);
  }

  // Slots
  const venues = data.venues.filter((v) => v.sports.includes(p.sport) && (!p.venueIds.length || p.venueIds.includes(v.id)));
  const placed: SportEvent[] = [];
  const skipped = new Map<string, string>();
  const earlyCount = new Map<string, number>();
  let unplaced = 0;
  const scratch: EngineData = { ...data, events: [...data.events], settings: { ...data.settings, minRestHours: p.minRestHours ?? 0 } };
  const step = p.gameMinutes + 15; // 15-minute changeover

  rounds.forEach((round, ri) => {
    const day = dayList[ri];
    if (!day) { unplaced += round.length; return; }
    const slots: { venueId: string; start: string }[] = [];
    for (let m = minutesOf(p.earliest); m + p.gameMinutes <= minutesOf(p.latest); m += step) {
      for (const v of venues) {
        if (m < minutesOf(v.open) || m + p.gameMinutes > minutesOf(v.close)) continue;
        slots.push({ venueId: v.id, start: combine(day, `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`) });
      }
    }
    // Fairness: teams that already had many early slots get later ones.
    const ordered = [...round].sort((x, y) => ((earlyCount.get(x.a ?? "") ?? 0) + (earlyCount.get(x.b ?? "") ?? 0)) - ((earlyCount.get(y.a ?? "") ?? 0) + (earlyCount.get(y.b ?? "") ?? 0)));
    let firstSlotTime: string | null = null;
    for (const match of ordered) {
      let ok = false;
      for (const s of slots) {
        const ev: SportEvent = {
          id: `ai-${ri}-${placed.length}-${Math.random().toString(36).slice(2, 7)}`,
          title: match.label, label: match.stage,
          type: "tournament", teamIds: ([match.a, match.b].filter(Boolean) as string[]).filter((x) => !x.startsWith("tbd-")),
          venueId: s.venueId, start: s.start, end: addMinutes(new Date(s.start), p.gameMinutes).toISOString(), status: "scheduled", source: "assistant",
        };
        const issues = checkEvent(ev, scratch).filter((i) => i.severity === "error" || i.kind === "insufficient_rest");
        // once-per-day: also block if team already has a game that day in the proposal
        const twice = p.oncePerDay && placed.some((e) => dateKey(e.start) === day && e.teamIds.some((tid) => ev.teamIds.includes(tid)));
        if (issues.length || twice) {
          const v = data.venues.find((x) => x.id === s.venueId)!;
          const why = issues.find((i) => i.kind === "facility_closed" || i.kind === "maintenance" || i.kind === "venue_double_booked");
          if (why) skipped.set(`${v.id}-${day}-${why.kind}`, `${v.site} · ${v.name} on ${fmtDay(day + "T12:00:00")}: ${why.kind === "facility_closed" ? "facility closed" : why.kind === "maintenance" ? "maintenance window" : "slot already booked"}`);
          continue;
        }
        placed.push(ev);
        scratch.events.push(ev);
        slots.splice(slots.indexOf(s), 1);
        if (!firstSlotTime) firstSlotTime = s.start;
        if (s.start === firstSlotTime) for (const tid of ev.teamIds) earlyCount.set(tid, (earlyCount.get(tid) ?? 0) + 1);
        ok = true;
        break;
      }
      if (!ok) unplaced++;
    }
  });

  if (unplaced) warnings.push(`${unplaced} game(s) could not be placed within ${p.earliest}–${p.latest}. Widen the time window or add a venue.`);
  explanation.push(`Each day's games run in parallel on ${venues.length} ${p.sport === "basketball" ? "courts" : "fields"} with a 15-minute changeover, which keeps the day compact and avoids idle gaps.`);
  if (p.oncePerDay) explanation.push("No team plays more than once per day, so every team rests overnight between games.");
  explanation.push("Every slot was checked against existing bookings, venue opening hours, closures, maintenance, and coach and player availability.");
  if (skipped.size) explanation.push(`Skipped unavailable slots: ${[...skipped.values()].slice(0, 4).join("; ")}${skipped.size > 4 ? "; …" : ""}.`);
  const early = [...earlyCount.values()];
  explanation.push(`Fair distribution: first-slot games are rotated so no team always plays earliest (first-slot count per team: min ${early.length ? Math.min(...early) : 0}, max ${early.length ? Math.max(...early) : 0}).`);

  const gamesPerTeam = teams.map((t) => placed.filter((e) => e.teamIds.includes(t.id)).length).filter((x) => x > 0);
  const days = new Set(placed.map((e) => dateKey(e.start))).size;
  const playoffDays = new Set(placed.filter((e) => e.teamIds.length === 0).map((e) => dateKey(e.start))).size;
  const remaining = detectConflicts(scratch).filter((c) => c.eventIds.some((id) => placed.some((e) => e.id === id)));
  return {
    events: placed,
    explanation,
    warnings: [...warnings, ...remaining.filter((c) => c.severity === "warning").map((c) => c.message)],
    stats: [
      { label: "Games", value: String(placed.length) },
      { label: "Match days", value: String(days) },
      { label: "Games per team", value: gamesPerTeam.length ? `${Math.min(...gamesPerTeam)}${Math.min(...gamesPerTeam) !== Math.max(...gamesPerTeam) ? `–${Math.max(...gamesPerTeam)}` : ""}${playoffDays ? ` + ${playoffDays} playoff` : ""}` : "–" },
      { label: "Conflicts", value: String(remaining.filter((c) => c.severity === "error").length) },
    ],
  };
}

function practicePlan(p: ParsedInstruction, data: EngineData, now: Date) {
  const { teams, warnings } = pickTeams(p, data);
  const explanation: string[] = [];
  const days = p.weekdays.length ? p.weekdays : [1, 2, 3, 4];
  const venues = data.venues.filter((v) => v.sports.includes(p.sport) && (!p.venueIds.length || p.venueIds.includes(v.id)));
  const scratch: EngineData = { ...data, events: [...data.events] };
  const placed: SportEvent[] = [];
  const weeks = 4;
  // Plan the next training block, starting the Monday after the teams' current practice series ends.
  const teamIdSet = new Set(teams.map((t) => t.id));
  const lastPractice = data.events.filter((e) => e.type === "practice" && e.teamIds.some((t) => teamIdSet.has(t))).reduce((mx, e) => Math.max(mx, new Date(e.end).getTime()), now.getTime());
  const monday = nextWeekday(new Date(lastPractice), 1, true);
  for (const team of teams) {
    let chosen = 0;
    for (const wd of days) {
      if (chosen >= p.perWeek) break;
      let done = false;
      for (let m = minutesOf(p.earliest); !done && m + p.gameMinutes <= minutesOf(p.latest); m += 30) {
        for (const v of venues) {
          const hhmm = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
          const occ: SportEvent[] = [];
          for (let w = 0; w < weeks; w++) {
            const day = addDays(monday, w * 7 + ((wd + 6) % 7));
            const ev: SportEvent = { id: `ai-pr-${team.id}-${wd}-${w}-${Math.random().toString(36).slice(2, 6)}`, title: `${team.name} practice`, label: `Weekly · ${WEEKDAYS[wd]}`, type: "practice", teamIds: team.id.startsWith("tbd-") ? [] : [team.id], venueId: v.id, start: combine(dateKey(day), hhmm), end: addMinutes(new Date(combine(dateKey(day), hhmm)), p.gameMinutes).toISOString(), status: "scheduled", source: "assistant" };
            occ.push(ev);
          }
          const clash = occ.some((ev) => checkEvent(ev, scratch).some((i) => i.severity === "error") || scratch.events.some((o) => o.teamIds.some((t) => ev.teamIds.includes(t)) && o.status === "scheduled" && dateKey(o.start) === dateKey(ev.start)));
          if (clash) continue;
          placed.push(...occ);
          scratch.events.push(...occ);
          chosen++;
          done = true;
          break;
        }
      }
    }
    if (chosen < p.perWeek) warnings.push(`${team.name}: only ${chosen} of ${p.perWeek} weekly practice slots fit the constraints.`);
  }
  explanation.push(`Plans the next training block, starting ${fmtDay(monday)} (the week after the current practice series ends).`);
  explanation.push(`Each team gets ${p.perWeek} weekly practice slot(s) on ${days.map((d) => WEEKDAYS[d]).join(", ")}, between ${p.earliest} and ${p.latest}, for the next ${weeks} weeks.`);
  explanation.push("A slot is used only if all four weekly occurrences are free: no venue double-booking, no closures or maintenance, and the coach is available.");
  explanation.push("Teams never get a practice on a day they already have another event, which reduces back-to-back days for families.");
  explanation.push("Earlier slots are preferred so younger players finish before dinner.");
  return {
    events: placed, explanation, warnings,
    stats: [
      { label: "Practices", value: String(placed.length) },
      { label: "Teams", value: String(teams.length) },
      { label: "Weeks", value: String(weeks) },
      { label: "Conflicts", value: "0" },
    ],
  };
}

function resolvePlan(data: EngineData, now: Date) {
  const conflicts = detectConflicts(data, now).filter((c) => c.severity === "error");
  const explanation: string[] = [];
  const warnings: string[] = [];
  const moved: SportEvent[] = [];
  const scratch: EngineData = { ...data, events: [...data.events] };
  const handled = new Set<string>();
  for (const c of conflicts) {
    // Move the event that was most recently added / least constrained: the last id in the pair
    const targetId = [...c.eventIds].reverse().find((id) => !handled.has(id));
    if (!targetId) continue;
    const ev = scratch.events.find((e) => e.id === targetId);
    if (!ev) continue;
    const alt = suggestAlternatives(ev, scratch, { limit: 1, now })[0];
    if (!alt) { warnings.push(`No conflict-free slot found for ${ev.title} within 14 days.`); continue; }
    handled.add(targetId);
    moved.push({ ...alt.event, source: "assistant", label: `Moved from ${fmtDay(ev.start)} ${fmtTime(ev.start)}` });
    scratch.events = scratch.events.map((e) => (e.id === ev.id ? alt.event : e));
    explanation.push(`${ev.title}: ${c.title.toLowerCase()}. Proposed ${fmtDay(alt.event.start)} ${fmtTime(alt.event.start)} at ${data.venues.find((v) => v.id === alt.event.venueId)?.site}. ${alt.reasons.slice(0, 2).join("; ")}.`);
  }
  if (!conflicts.length) explanation.push("No blocking conflicts found. Nothing to change.");
  explanation.push("Only blocking conflicts (errors) are changed automatically. Warnings such as player availability are left for a human to decide.");
  return {
    events: moved, explanation, warnings,
    stats: [
      { label: "Blocking conflicts", value: String(conflicts.length) },
      { label: "Events moved", value: String(moved.length) },
      { label: "Unresolved", value: String(Math.max(0, conflicts.length - moved.length)) },
    ],
  };
}

export const EXAMPLE_PROMPTS = [
  "Create a basketball tournament schedule for eight teams over three weekends. Avoid overlapping games and schedule each team only once per day.",
  "Schedule soccer practices twice a week on weekday evenings between 4:30pm and 7pm for all U10 teams.",
  "Fix all blocking conflicts in the current schedule.",
  "Create a basketball tournament for 8 teams over two weekends, 50-minute games, no games before 10am, at Summit Sports Dome and Riverbend.",
];

