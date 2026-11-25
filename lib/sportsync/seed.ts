// Fictional sample data for the SportSync demo ("Riverbend Youth Sports League").
// Dates are generated relative to the visitor's current date so the demo always looks current.
// Several scheduling conflicts are planted on purpose so the conflict engine has something to find.

import type { AppNotification, Person, RsvpStatus, Series, SportEvent, Team, Venue } from "./types";
import { addDays, combine, dateKey, nextWeekday, startOfWeek } from "./dates";

export interface DemoData {
  teams: Team[];
  people: Person[];
  venues: Venue[];
  events: SportEvent[];
  series: Series[];
  rsvps: Record<string, Record<string, RsvpStatus>>;
  attendance: Record<string, string[]>;
  notifications: AppNotification[];
  seededAt: string;
}

export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Ava", "Noah", "Mia", "Ethan", "Zoe", "Lucas", "Isla", "Mateo", "Chloe", "Kai", "Nora", "Owen", "Lena", "Ravi", "Sofia", "Eli", "Hana", "Theo", "Amara", "Jonah", "Iris", "Felix", "Leah", "Omar", "Ruby", "Arjun", "Nina", "Caleb", "Tessa", "Malik", "Yuki", "Gabe"];
const LAST = ["Thompson", "Garcia", "Chen", "Okafor", "Silva", "Novak", "Haddad", "Larsen", "Mendoza", "Park", "Rossi", "Ibrahim", "Walsh", "Dubois", "Kowalski", "Tanaka", "Moreau", "Singh", "Alvarez", "Brooks"];

export const DEMO_USERS = {
  league_admin: { id: "u-admin", name: "Alex Morgan", title: "League Administrator" },
  org_manager: { id: "u-org", name: "Riley Chen", title: "Sports Organization Manager" },
  coach: { id: "c-jordan", name: "Jordan Reyes", title: "Volunteer Coach · Hawks & Rovers" },
  parent: { id: "g-sam", name: "Sam Patel", title: "Parent of Maya (Hawks) & Leo (Rovers)" },
  athlete: { id: "p-hawks-0", name: "Ava Thompson", title: "Athlete · Riverbend Hawks" },
  facility_manager: { id: "u-fac", name: "Dana Brooks", title: "Facility Manager · Riverbend CC" },
} as const;

export function createSeed(now = new Date()): DemoData {
  const rand = mulberry32(20261125);
  const S1 = nextWeekday(now, 6, true); // upcoming Saturday: league finale
  const S2 = addDays(S1, 7); // first open tournament weekend
  const histStart = addDays(startOfWeek(now), -7);
  const seriesEnd = addDays(S1, 35);
  const k = (offset: number) => dateKey(addDays(S1, offset));

  const venues: Venue[] = [
    {
      id: "v-ca", name: "Court A", site: "Riverbend Community Center", address: "120 River Rd, Riverbend",
      sports: ["basketball"], capacity: 150, open: "08:00", close: "21:00",
      equipment: ["Electronic scoreboard", "Shot clocks", "Retractable bleachers", "First-aid station"],
      restrictions: ["Indoor non-marking shoes only", "No food or drink on court"], closures: [], maintenance: [],
    },
    {
      id: "v-cb", name: "Court B", site: "Riverbend Community Center", address: "120 River Rd, Riverbend",
      sports: ["basketball"], capacity: 150, open: "08:00", close: "21:00",
      equipment: ["Electronic scoreboard", "Portable hoops (youth height)", "Bleachers"],
      restrictions: ["Indoor non-marking shoes only"], closures: [],
      maintenance: [{ start: combine(dateKey(S2), "08:00"), end: combine(dateKey(S2), "12:00"), reason: "Floor refinishing" }],
    },
    {
      id: "v-ng", name: "Main Gym", site: "Northgate High School", address: "45 Northgate Ave",
      sports: ["basketball"], capacity: 300, open: "07:00", close: "22:00",
      equipment: ["Scoreboard", "PA system", "Locker rooms", "Bleachers (300)"],
      restrictions: ["Weekday community use after 16:00 only", "Custodian sign-off required for weekend events"],
      closures: [
        { date: k(1), reason: "Campus closed: district holiday" },
        { date: dateKey(addDays(S2, 8)), reason: "Campus closed: facilities inspection" },
      ],
      maintenance: [],
    },
    {
      id: "v-sd", name: "Arena", site: "Summit Sports Dome", address: "9 Summit Way",
      sports: ["basketball", "soccer"], capacity: 500, open: "06:00", close: "23:00",
      equipment: ["Convertible turf/court", "Video board", "Concessions", "Meeting room (40)"],
      restrictions: ["Bookings require 48 hours' notice", "Max 4-hour block per organization per day"], closures: [], maintenance: [],
    },
    {
      id: "v-f1", name: "Field 1", site: "Lakeside Park", address: "300 Lakeshore Dr",
      sports: ["soccer"], capacity: 80, open: "07:00", close: "20:00",
      equipment: ["Small-sided goals", "Corner flags", "Floodlights until 20:00"],
      restrictions: ["No cleats with metal studs", "Field closes during lightning alerts"], closures: [],
      maintenance: [{ start: combine(k(2), "16:00"), end: combine(k(2), "19:00"), reason: "Line painting and irrigation" }],
    },
    {
      id: "v-f2", name: "Field 2", site: "Lakeside Park", address: "300 Lakeshore Dr",
      sports: ["soccer"], capacity: 80, open: "07:00", close: "20:00",
      equipment: ["Small-sided goals", "Corner flags", "Floodlights until 20:00"],
      restrictions: ["No cleats with metal studs"], closures: [], maintenance: [],
    },
  ];

  const teamDefs: [string, string, "basketball" | "soccer", string, string, string][] = [
    ["t-hawks", "Riverbend Hawks", "basketball", "U12", "c-jordan", "#0b6e5b"],
    ["t-comets", "Northside Comets", "basketball", "U12", "c-priya", "#1d4ed8"],
    ["t-falcons", "Eastwood Falcons", "basketball", "U12", "c-marcus", "#b45309"],
    ["t-lynx", "Lakeview Lynx", "basketball", "U12", "c-elena", "#7c3aed"],
    ["t-storm", "Summit Storm", "basketball", "U12", "c-tom", "#0e7490"],
    ["t-vipers", "Valley Vipers", "basketball", "U12", "c-grace", "#be123c"],
    ["t-herons", "Harbor Herons", "basketball", "U12", "c-diego", "#4d7c0f"],
    ["t-panthers", "Pinecrest Panthers", "basketball", "U12", "c-hannah", "#334155"],
    ["t-rovers", "Riverbend Rovers", "soccer", "U10", "c-jordan", "#15803d"],
    ["t-maple", "Maple United", "soccer", "U10", "c-liam", "#c2410c"],
    ["t-oakridge", "Oakridge FC", "soccer", "U10", "c-aisha", "#6d28d9"],
    ["t-wolves", "Westfield Wolves", "soccer", "U10", "c-noah", "#0369a1"],
  ];
  const coachNames: Record<string, string> = {
    "c-jordan": "Jordan Reyes", "c-priya": "Priya Nair", "c-marcus": "Marcus Bell", "c-elena": "Elena Ruiz",
    "c-tom": "Tom Okafor", "c-grace": "Grace Kim", "c-diego": "Diego Santos", "c-hannah": "Hannah Weiss",
    "c-liam": "Liam O'Connor", "c-aisha": "Aisha Rahman", "c-noah": "Noah Fischer",
  };

  const people: Person[] = Object.entries(coachNames).map(([id, name]) => ({
    id, name, kind: "coach", teamIds: teamDefs.filter((t) => t[4] === id).map((t) => t[0]), unavailable: [],
  }));
  const teams: Team[] = [];
  let nameIdx = 0;
  for (const [id, name, sport, ageGroup, coachId, color] of teamDefs) {
    const playerIds: string[] = [];
    for (let i = 0; i < 8; i++) {
      const pid = `p-${id.slice(2)}-${i}`;
      let pname = `${FIRST[nameIdx % FIRST.length]} ${LAST[(nameIdx * 7) % LAST.length]}`;
      let guardian = `${["Pat", "Chris", "Morgan", "Jamie", "Taylor", "Casey", "Robin", "Drew"][i]} ${pname.split(" ")[1]}`;
      let guardianId: string | undefined;
      if (id === "t-hawks" && i === 0) { pname = "Ava Thompson"; guardian = "Kim Thompson"; }
      if (id === "t-hawks" && i === 1) { pname = "Maya Patel"; guardian = "Sam Patel"; guardianId = "g-sam"; }
      if (id === "t-rovers" && i === 1) { pname = "Leo Patel"; guardian = "Sam Patel"; guardianId = "g-sam"; }
      nameIdx++;
      people.push({ id: pid, name: pname, kind: "player", teamIds: [id], guardian, guardianId, unavailable: [] });
      playerIds.push(pid);
    }
    teams.push({ id, name, sport, ageGroup, coachId, color, playerIds });
  }

  const person = (id: string) => people.find((p) => p.id === id)!;
  // Planted availability problems
  person("c-jordan").unavailable.push({ start: combine(dateKey(S1), "08:00"), end: combine(dateKey(S1), "11:00"), reason: "Work shift" });
  for (const i of [0, 1, 2]) {
    person(`p-lynx-${i}`).unavailable.push({ start: combine(dateKey(S1), "00:00"), end: combine(dateKey(S1), "23:59"), reason: "School trip" });
  }
  person("p-hawks-1").unavailable.push({ start: combine(k(5), "16:00"), end: combine(k(5), "19:00"), reason: "Dentist appointment" });

  // ---------- Recurring practices ----------
  const series: Series[] = [];
  const events: SportEvent[] = [];
  let evN = 0;
  const id = () => `e-${++evN}`;

  const practice = (teamId: string, venueId: string, byDay: number[], startTime: string, endTime: string) => {
    const team = teams.find((t) => t.id === teamId)!;
    const sid = `s-${teamId.slice(2)}-${series.length + 1}`;
    series.push({ id: sid, title: `${team.name} practice`, byDay, startTime, endTime, from: dateKey(histStart), until: dateKey(seriesEnd) });
    for (let d = new Date(histStart); d <= seriesEnd; d = addDays(d, 1)) {
      if (!byDay.includes(d.getDay())) continue;
      events.push({
        id: id(), title: `${team.name} practice`, type: "practice", teamIds: [teamId], venueId,
        start: combine(dateKey(d), startTime), end: combine(dateKey(d), endTime), status: "scheduled", seriesId: sid, source: "seed",
      });
    }
  };
  practice("t-hawks", "v-ca", [2, 4], "17:00", "18:30");
  practice("t-comets", "v-cb", [2, 4], "17:00", "18:30");
  practice("t-falcons", "v-ca", [2, 4], "18:30", "20:00");
  practice("t-lynx", "v-cb", [2, 4], "18:30", "20:00");
  practice("t-storm", "v-ca", [1, 3], "17:00", "18:30");
  practice("t-vipers", "v-cb", [1, 3], "17:00", "18:30");
  practice("t-herons", "v-ca", [1, 3], "18:30", "20:00");
  practice("t-panthers", "v-ng", [1, 3], "18:00", "19:30");
  practice("t-rovers", "v-f2", [1, 5], "17:00", "18:15");
  practice("t-maple", "v-f1", [1, 3], "17:00", "18:30");
  practice("t-oakridge", "v-f1", [3], "17:30", "19:00"); // planted recurring conflict with Maple United (Wednesdays)
  practice("t-oakridge", "v-f2", [2], "17:00", "18:30");
  practice("t-wolves", "v-f2", [2, 4], "18:30", "19:45");

  // ---------- Games ----------
  const tn = (tid: string) => teams.find((t) => t.id === tid)!.name;
  const game = (a: string, b: string, venueId: string, day: string, start: string, end: string, extra: Partial<SportEvent> = {}) => {
    const ev: SportEvent = {
      id: id(), title: `${tn(a)} vs ${tn(b)}`, type: "game", teamIds: [a, b], venueId,
      start: combine(day, start), end: combine(day, end), status: "scheduled", source: "seed", ...extra,
    };
    events.push(ev);
    return ev;
  };
  const last = k(-7);
  game("t-hawks", "t-falcons", "v-ca", last, "09:00", "10:15");
  game("t-comets", "t-lynx", "v-cb", last, "09:00", "10:15");
  game("t-storm", "t-herons", "v-ca", last, "10:30", "11:45", { status: "postponed", statusReason: "Power outage at the venue. Needs a new date." });
  game("t-vipers", "t-panthers", "v-cb", last, "10:30", "11:45");
  game("t-rovers", "t-oakridge", "v-f1", last, "10:30", "11:30");
  game("t-maple", "t-wolves", "v-f2", last, "10:30", "11:30");

  const s1 = dateKey(S1);
  game("t-hawks", "t-comets", "v-ca", s1, "09:00", "10:15", { expectedAttendance: 120 });
  game("t-falcons", "t-lynx", "v-cb", s1, "09:00", "10:15");
  game("t-storm", "t-vipers", "v-ca", s1, "10:30", "11:45");
  game("t-herons", "t-panthers", "v-cb", s1, "10:30", "11:45");
  game("t-comets", "t-vipers", "v-ca", s1, "12:00", "13:15", { title: "Northside Comets vs Valley Vipers (make-up game)" });
  game("t-rovers", "t-maple", "v-f1", s1, "10:30", "11:30");
  game("t-oakridge", "t-wolves", "v-f2", s1, "10:30", "11:30");
  game("t-herons", "t-panthers", "v-ng", k(1), "14:00", "15:15", { title: "Harbor Herons vs Pinecrest Panthers (exhibition)" });
  for (const w of [7, 14]) {
    game("t-rovers", "t-wolves", "v-f1", k(w), "09:00", "10:00");
    game("t-maple", "t-oakridge", "v-f2", k(w), "09:00", "10:00");
  }

  // ---------- Other events ----------
  events.push({ id: id(), title: "Riverbend Hawks team photo day", type: "meeting", teamIds: ["t-hawks"], venueId: "v-sd", start: combine(s1, "09:30"), end: combine(s1, "10:30"), status: "scheduled", source: "seed" });
  events.push({ id: id(), title: "Open skills clinic", type: "practice", teamIds: [], venueId: "v-ca", start: combine(k(3), "17:30"), end: combine(k(3), "19:00"), status: "scheduled", source: "seed", notes: "Drop-in clinic run by league volunteers." });
  events.push({ id: id(), title: "Coaches' pre-tournament meeting", type: "meeting", teamIds: [], venueId: "v-sd", start: combine(k(3), "19:30"), end: combine(k(3), "20:30"), status: "scheduled", source: "seed", notes: "Agenda: Winter Classic format, referee rota, volunteer sign-up." });
  events.push({ id: id(), title: "Westfield Wolves evening scrimmage", type: "practice", teamIds: ["t-wolves"], venueId: "v-f2", start: combine(k(5), "19:45"), end: combine(k(5), "21:00"), status: "scheduled", source: "seed" });

  const herons = events.find((e) => e.seriesId?.startsWith("s-herons") && dateKey(e.start) === k(4));
  if (herons) { herons.status = "cancelled"; herons.statusReason = "Coach unavailable (illness)"; }

  // ---------- RSVPs & attendance ----------
  const rsvps: DemoData["rsvps"] = {};
  const attendance: DemoData["attendance"] = {};
  const windowStart = addDays(now, -8).getTime();
  const windowEnd = addDays(now, 21).getTime();
  for (const ev of events) {
    const t = new Date(ev.start).getTime();
    if (t < windowStart || t > windowEnd || ev.teamIds.length === 0) continue;
    const map: Record<string, RsvpStatus> = {};
    const players = teams.filter((tm) => ev.teamIds.includes(tm.id)).flatMap((tm) => tm.playerIds);
    for (const pid of players) {
      const blocked = person(pid).unavailable.some((u) => new Date(u.start) < new Date(ev.end) && new Date(ev.start) < new Date(u.end));
      const r = rand();
      map[pid] = blocked ? "no" : r < 0.55 ? "yes" : r < 0.65 ? "maybe" : r < 0.74 ? "no" : "pending";
    }
    rsvps[ev.id] = map;
    if (t < now.getTime() && ev.status === "scheduled") {
      attendance[ev.id] = players.filter((pid) => map[pid] === "yes" || (map[pid] === "maybe" && rand() > 0.5));
    }
  }

  const ago = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString();
  const meeting = events.find((e) => e.title.startsWith("Coaches'"))!;
  const notifications: AppNotification[] = [
    { id: "n-1", type: "conflict", title: "Court A double-booked", body: "Open skills clinic overlaps two team practices on Court A. Review suggested fixes.", at: ago(1), read: false, channels: ["push", "email"] },
    { id: "n-2", type: "ai_recommendation", title: "Suggested fix for a postponed game", body: "Summit Storm vs Harbor Herons can move to an open slot. 3 options are ready to compare.", at: ago(3), read: false, channels: ["push"] },
    { id: "n-3", type: "cancellation", title: "Practice cancelled", body: "Harbor Herons practice is cancelled (coach unavailable).", at: ago(6), read: false, channels: ["push", "sms", "email"], eventId: herons?.id },
    { id: "n-4", type: "new_event", title: "New event: Coaches' pre-tournament meeting", body: `${meeting.title} at Summit Sports Dome.`, at: ago(20), read: true, channels: ["email"], eventId: meeting.id },
    { id: "n-5", type: "rsvp_reminder", title: "RSVP reminder sent", body: "12 families haven't responded for Saturday's games.", at: ago(26), read: true, channels: ["push", "sms"] },
    { id: "n-6", type: "schedule_change", title: "Game postponed", body: "Summit Storm vs Harbor Herons was postponed (power outage).", at: ago(150), read: true, channels: ["push", "sms", "email"] },
  ];

  return { teams, people, venues, events, series, rsvps, attendance, notifications, seededAt: now.toISOString() };
}
