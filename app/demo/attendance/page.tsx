"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, CalendarCheck, Users } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import type { RsvpStatus } from "@/lib/sportsync/types";
import { fmtDay, fmtRange, overlaps } from "@/lib/sportsync/dates";
import { useQuery } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, EmptyState, Select, Stat, Tabs } from "@/components/ui/primitives";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/demo/shell";
import { AttendanceBar, RsvpControl, rsvpCounts } from "@/components/demo/event-detail";
import { RSVP_META } from "@/components/demo/meta";

export default function AttendancePage() {
  const { state, can, visibleEvents, user, commit } = useDemo();
  const q = useQuery();
  const now = new Date();
  const teamEvents = visibleEvents.filter((e) => e.teamIds.length > 0 && e.status === "scheduled");
  const upcoming = teamEvents.filter((e) => new Date(e.end) > now).sort((a, b) => a.start.localeCompare(b.start)).slice(0, 30);
  const past = teamEvents.filter((e) => new Date(e.end) <= now && state.rsvps[e.id]).sort((a, b) => b.start.localeCompare(a.start)).slice(0, 15);
  const [mode, setMode] = useState("upcoming");
  const [eventId, setEventId] = useState<string>("");
  const [filter, setFilter] = useState<"all" | RsvpStatus>("all");

  useEffect(() => {
    const id = q?.get("event");
    if (id && state.events.some((e) => e.id === id)) { setEventId(id); setMode(new Date(state.events.find((e) => e.id === id)!.end) < now ? "past" : "upcoming"); }
    else if (!eventId && upcoming[0]) setEventId(upcoming[0].id);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const ev = state.events.find((e) => e.id === eventId);
  const roster = useMemo(() => (ev ? state.teams.filter((t) => ev.teamIds.includes(t.id)).flatMap((t) => t.playerIds.map((pid) => ({ team: t, p: state.people.find((x) => x.id === pid)! }))) : []), [ev, state.teams, state.people]);

  // Families / athletes: respond to RSVPs
  if (!can("viewAttendance")) {
    const people = state.role === "parent" ? state.people.filter((p) => p.guardianId === user.id) : state.people.filter((p) => p.id === user.id);
    return (
      <div className="mx-auto max-w-3xl">
        <PageTitle title="My RSVPs" sub="Let coaches know who's coming. You can change your answer any time before the event." />
        {people.map((p) => {
          const evs = upcoming.filter((e) => e.teamIds.some((t) => p.teamIds.includes(t)));
          const pending = evs.filter((e) => (state.rsvps[e.id]?.[p.id] ?? "pending") === "pending").length;
          return (
            <Card key={p.id} className="mb-5">
              <CardHeader><CardTitle>{p.name}</CardTitle>{pending > 0 ? <Badge tone="warning">{pending} awaiting your answer</Badge> : <Badge tone="success">All answered</Badge>}</CardHeader>
              <CardBody>
                {evs.length === 0 ? <EmptyState icon={<CalendarCheck />} title="No upcoming events" /> : (
                  <ul className="divide-y divide-border">
                    {evs.slice(0, 10).map((e) => {
                      const unavailable = p.unavailable.find((u) => overlaps(e.start, e.end, u.start, u.end));
                      return (
                        <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                          <div className="min-w-0"><p className="text-sm font-semibold">{e.title}</p><p className="text-xs text-muted">{fmtDay(e.start)} · {fmtRange(e.start, e.end)} · {state.venues.find((v) => v.id === e.venueId)?.site}</p>
                            {unavailable && <p className="mt-0.5 text-xs text-warning">Marked unavailable: {unavailable.reason}</p>}</div>
                          <RsvpControl eventId={e.id} personId={p.id} name={state.role === "parent" ? p.name.split(" ")[0] : undefined} />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardBody>
            </Card>
          );
        })}
        <p className="text-xs text-muted">Parents confirm on behalf of their children. Answers are visible to the coach and league staff only.</p>
      </div>
    );
  }

  const c = rsvpCounts(ev ? state.rsvps[ev.id] : undefined);
  const attended = ev ? state.attendance[ev.id] ?? [] : [];
  const isPast = ev ? new Date(ev.end) < now : false;
  const shown = roster.filter((r) => filter === "all" || (state.rsvps[ev!.id]?.[r.p.id] ?? "pending") === filter);
  const remind = () => ev && commit(`Sent RSVP reminder for “${ev.title}”`, (s) => s, { toast: `Reminder sent to ${c.pending} families (simulated email, SMS & push)`, notify: { type: "rsvp_reminder", title: `RSVP reminder: ${ev.title}`, body: `${c.pending} families haven't responded yet.`, eventId: ev.id } });
  const toggleAttended = (pid: string) => ev && commit(`Updated attendance for “${ev.title}”`, (s) => {
    const cur = s.attendance[ev.id] ?? [];
    return { ...s, attendance: { ...s.attendance, [ev.id]: cur.includes(pid) ? cur.filter((x) => x !== pid) : [...cur, pid] } };
  });

  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="RSVP & attendance" sub="See expected attendance before each event, chase missing responses, and record who actually showed up." />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Tabs label="Event timeframe" value={mode} onChange={(m) => { setMode(m); const list = m === "past" ? past : upcoming; if (list[0]) setEventId(list[0].id); }} tabs={[{ id: "upcoming", label: "Upcoming" }, { id: "past", label: "Attendance tracking" }]} />
        <Select aria-label="Choose event" value={eventId} onChange={(e) => setEventId(e.target.value)} className="w-auto max-w-full">
          {(mode === "past" ? past : upcoming).map((e) => <option key={e.id} value={e.id}>{fmtDay(e.start)} · {e.title}</option>)}
        </Select>
      </div>
      {!ev ? <EmptyState icon={<Users />} title="No events with rosters" /> : (
        <>
          <div className="grid gap-3 sm:grid-cols-4">
            <Stat label="Attending" value={c.yes} tone="success" />
            <Stat label="Maybe" value={c.maybe} tone="warning" />
            <Stat label="Not attending" value={c.no} tone="danger" />
            <Stat label={isPast ? "Actually attended" : "No response"} value={isPast ? `${attended.length}/${roster.length}` : c.pending} />
          </div>
          {!isPast && c.yes + c.maybe < Math.max(5, roster.length * 0.6) && <Alert tone="warning" className="mt-4" title="Attendance may be too low">Only {c.yes} confirmed and {c.maybe} maybe. Consider a reminder or check whether the event should be rescheduled.</Alert>}
          <Card className="mt-5">
            <CardHeader>
              <div><CardTitle>{ev.title}</CardTitle><p className="text-sm text-muted">{fmtDay(ev.start)} · {fmtRange(ev.start, ev.end)}</p></div>
              {!isPast && c.pending > 0 && can("sendReminders") && <Button size="sm" onClick={remind}><BellRing aria-hidden />Remind {c.pending} pending</Button>}
            </CardHeader>
            <CardBody>
              <AttendanceBar rsvps={state.rsvps[ev.id]} className="mb-4" />
              <Tabs label="Filter roster" size="sm" value={filter} onChange={(f) => setFilter(f as typeof filter)} className="mb-3"
                tabs={[{ id: "all", label: "All", count: roster.length }, { id: "yes", label: "Yes", count: c.yes }, { id: "maybe", label: "Maybe", count: c.maybe }, { id: "no", label: "No", count: c.no }, { id: "pending", label: "Pending", count: c.pending }]} />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="text-left text-xs text-muted"><tr className="border-b border-border"><th className="py-2 font-medium">Player</th><th className="py-2 font-medium">Team</th><th className="py-2 font-medium">Parent / guardian</th><th className="py-2 font-medium">Availability</th><th className="py-2 font-medium">RSVP</th>{isPast && <th className="py-2 font-medium">Attended</th>}</tr></thead>
                  <tbody>
                    {shown.map(({ p, team }) => {
                      const r = state.rsvps[ev.id]?.[p.id] ?? "pending";
                      const un = p.unavailable.find((u) => overlaps(ev.start, ev.end, u.start, u.end));
                      return (
                        <tr key={p.id} className="border-b border-border last:border-0">
                          <td className="py-2 font-medium">{p.name}</td>
                          <td className="py-2 text-muted">{team.name}</td>
                          <td className="py-2 text-muted">{p.guardian}</td>
                          <td className="py-2">{un ? <Badge tone="warning">{un.reason}</Badge> : <span className="text-xs text-muted">Available</span>}</td>
                          <td className="py-2"><Badge tone={RSVP_META[r].tone}>{RSVP_META[r].label}</Badge></td>
                          {isPast && <td className="py-2"><input type="checkbox" aria-label={`${p.name} attended`} checked={attended.includes(p.id)} onChange={() => toggleAttended(p.id)} className="size-4 accent-[var(--primary)]" /></td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
