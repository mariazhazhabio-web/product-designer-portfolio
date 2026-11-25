import { test } from "node:test";
import assert from "node:assert/strict";
import { createSeed } from "../../lib/sportsync/seed";
import { detectConflicts, suggestAlternatives, checkEvent, type EngineData } from "../../lib/sportsync/conflicts";
import { generateProposal, parseInstruction, roundRobin, EXAMPLE_PROMPTS } from "../../lib/sportsync/assistant";
import { buildICS, fold } from "../../lib/sportsync/ics";
import { parseCSV, validateImport, sampleCSV, toCSV } from "../../lib/sportsync/csv";
import { dateKey } from "../../lib/sportsync/dates";

const NOW = new Date(2026, 10, 25, 12, 0); // Wed 25 Nov 2026, noon
const engine = (): EngineData => {
  const s = createSeed(NOW);
  return { events: s.events, teams: s.teams, people: s.people, venues: s.venues, settings: { minRestHours: 12, timezone: "UTC", playerUnavailableThreshold: 0.4 } };
};

test("seed plants every conflict category", () => {
  const kinds = new Set(detectConflicts(engine(), NOW).map((c) => c.kind));
  for (const k of ["venue_double_booked", "team_overlap", "coach_unavailable", "player_unavailable", "insufficient_rest", "facility_closed", "outside_hours", "maintenance", "recurring_conflict"]) {
    assert.ok(kinds.has(k as never), `expected ${k}, got ${[...kinds].join(", ")}`);
  }
});

test("conflicts are not duplicated", () => {
  const ids = detectConflicts(engine(), NOW).map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("alternatives are conflict-free", () => {
  const e = engine();
  const clash = detectConflicts(e, NOW).find((c) => c.kind === "venue_double_booked")!;
  const ev = e.events.find((x) => x.id === clash.eventIds[0])!;
  const alts = suggestAlternatives(ev, e, { now: NOW });
  assert.ok(alts.length > 0);
  for (const a of alts) {
    const issues = checkEvent(a.event, { ...e, events: e.events.filter((x) => x.id !== ev.id) });
    assert.equal(issues.filter((i) => i.severity === "error").length, 0);
  }
});

test("round robin pairs every team once", () => {
  const rounds = roundRobin(8);
  assert.equal(rounds.length, 7);
  const pairs = new Set(rounds.flat().map(([a, b]) => [a, b].sort().join("-")));
  assert.equal(pairs.size, 28);
  for (const r of rounds) assert.equal(new Set(r.flat()).size, 8);
});

test("example prompt: 8 teams, 3 weekends, once per day", () => {
  const e = engine();
  const parsed = parseInstruction(EXAMPLE_PROMPTS[0], e, NOW);
  assert.equal(parsed.teamCount, 8);
  assert.equal(parsed.weekends, 3);
  assert.equal(parsed.oncePerDay, true);
  const p = generateProposal(EXAMPLE_PROMPTS[0], e, 1, NOW);
  assert.ok(p.events.length >= 20, `only ${p.events.length} games`);
  // each team at most once per day
  const seen = new Set<string>();
  for (const ev of p.events) for (const t of ev.teamIds) {
    const k = `${t}@${dateKey(ev.start)}`;
    assert.ok(!seen.has(k), `team twice on a day: ${k}`);
    seen.add(k);
  }
  // no blocking conflicts against the existing schedule or each other
  const all = { ...e, events: [...e.events, ...p.events] };
  for (const ev of p.events) {
    const errs = checkEvent(ev, all).filter((i) => i.severity === "error");
    assert.equal(errs.length, 0, `${ev.title}: ${errs.map((x) => x.message).join("; ")}`);
  }
  assert.ok(p.explanation.length >= 4);
});

test("practice planner and conflict resolver produce output", () => {
  const e = engine();
  const pr = generateProposal(EXAMPLE_PROMPTS[1], e, 1, NOW);
  assert.ok(pr.events.length > 0);
  const fix = generateProposal(EXAMPLE_PROMPTS[2], e, 1, NOW);
  assert.ok(fix.events.length > 0);
  const after = { ...e, events: e.events.map((x) => fix.events.find((m) => m.id === x.id) ?? x) };
  const before = detectConflicts(e, NOW).filter((c) => c.severity === "error").length;
  const remaining = detectConflicts(after, NOW).filter((c) => c.severity === "error").length;
  assert.ok(remaining < before, `resolver did not reduce conflicts (${before} -> ${remaining})`);
});

test("ICS output is RFC 5545 shaped", () => {
  const s = createSeed(NOW);
  const ics = buildICS(s.events.slice(0, 3), s, "Test", NOW);
  assert.match(ics, /^BEGIN:VCALENDAR\r\nVERSION:2.0\r\n/);
  assert.equal((ics.match(/BEGIN:VEVENT/g) ?? []).length, 3);
  assert.match(ics, /DTSTART:\d{8}T\d{6}Z/);
  for (const line of ics.split("\r\n")) assert.ok(new TextEncoder().encode(line).length <= 75, `line too long: ${line}`);
  assert.equal(fold("x".repeat(100)).split("\r\n ").join(""), "x".repeat(100));
});

test("CSV round trip and validation", () => {
  const s = createSeed(NOW);
  assert.deepEqual(parseCSV('a,"b,c","d ""q"""\n1,2,3'), [["a", "b,c", 'd "q"'], ["1", "2", "3"]]);
  const { rows } = validateImport(sampleCSV(s, dateKey(NOW)), s);
  assert.equal(rows.filter((r) => r.event).length, 4);
  assert.ok(rows[4].errors.length >= 4);
  const csv = toCSV(s.events.slice(0, 5), s);
  const back = validateImport(csv, s);
  assert.equal(back.rows.filter((r) => r.event).length, 5);
});
