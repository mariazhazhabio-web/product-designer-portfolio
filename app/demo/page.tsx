"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, BellRing, CalendarRange, Compass, Plus, Sparkles, X } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import type { EventType } from "@/lib/sportsync/types";
import { addDays, dateKey, durationMin, fmtDay, fmtLongDay, minutesOf, minutesOfDay, sameDay, startOfDay, WEEKDAYS_SHORT } from "@/lib/sportsync/dates";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, EmptyState, Select, Stat, Tabs } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/badge";
import { PageTitle, useEditor } from "@/components/demo/shell";
import { EventRow } from "@/components/demo/event-row";
import { AttendanceBar, RsvpControl, rsvpCounts } from "@/components/demo/event-detail";
import { CONFLICT_LABEL } from "@/lib/sportsync/conflicts";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { state, visibleEvents, openConflicts, can, user, update, commit, myTeamIds } = useDemo();
  const { openCreate } = useEditor();
  const [team, setTeam] = useState("all");
  const [type, setType] = useState<"all" | EventType>("all");
  const now = new Date();
  const today = startOfDay(now);
  const weekEnd = addDays(today, 7);

  const filtered = useMemo(() => visibleEvents.filter((e) => (team === "all" || e.teamIds.includes(team)) && (type === "all" || e.type === type)), [visibleEvents, team, type]);
  const upcoming = filtered.filter((e) => new Date(e.end) > now).sort((a, b) => a.start.localeCompare(b.start));
  const thisWeek = upcoming.filter((e) => new Date(e.start) < weekEnd && e.status === "scheduled");
  const pendingEvents = thisWeek
    .map((e) => ({ e, c: rsvpCounts(state.rsvps[e.id]) }))
    .filter((x) => x.c.pending > 0)
    .sort((a, b) => b.c.pending - a.c.pending);
  const pendingTotal = pendingEvents.reduce((n, x) => n + x.c.pending, 0);
  const postponed = visibleEvents.filter((e) => e.status === "postponed");
  const teams = state.teams.filter((t) => !myTeamIds || myTeamIds.includes(t.id));
  const myConflicts = openConflicts.filter((c) => !myTeamIds || c.eventIds.some((id) => visibleEvents.some((e) => e.id === id)));

  // Venue utilization today
  const util = state.venues.map((v) => {
    const open = minutesOf(v.close) - minutesOf(v.open);
    const booked = state.events.filter((e) => e.venueId === v.id && e.status === "scheduled" && sameDay(new Date(e.start), now));
    const mins = booked.reduce((n, e) => n + durationMin(e.start, e.end), 0);
    return { v, booked, pct: Math.min(100, Math.round((mins / open) * 100)), closed: v.closures.some((c) => c.date === dateKey(now)) };
  });
  const avgUtil = Math.round(util.reduce((n, u) => n + u.pct, 0) / util.length);
  const children = state.role === "parent" ? state.people.filter((p) => p.guardianId === user.id) : [];
  const hour = now.getHours();

  const remind = (eventId: string, title: string, n: number) =>
    commit(`Sent RSVP reminder for “${title}”`, (s) => s, { toast: `Reminder sent to ${n} families (simulated)`, notify: { type: "rsvp_reminder", title: `RSVP reminder: ${title}`, body: `${n} families haven't responded yet.`, eventId } });

  return (
    <div className="mx-auto max-w-7xl">
      {!state.onboarded && (
        <div className="mb-6 flex flex-wrap items-start gap-3 rounded-2xl border border-primary/30 bg-primary-soft p-4 sm:items-center sm:gap-4">
          <Compass className="mt-0.5 size-6 shrink-0 text-primary sm:mt-0" aria-hidden />
          <div className="min-w-0 flex-1 basis-56"><p className="font-semibold">Welcome to the SportSync demo</p><p className="text-sm text-muted">No sign-up needed. Explore as any role, or take the 60-second onboarding first. Every change can be undone.</p></div>
          <ButtonLink href="/demo/onboarding/" size="sm">Start onboarding</ButtonLink>
          <Button size="icon-sm" variant="ghost" aria-label="Dismiss welcome" onClick={() => update((s) => ({ ...s, onboarded: true }))}><X /></Button>
        </div>
      )}
      <PageTitle title={`Good ${hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}, ${user.name.split(" ")[0]}`} sub={<>{fmtLongDay(now)} · {user.title}</>}
        actions={<>
          {can("useAssistant") && <ButtonLink href="/demo/assistant/" variant="outline"><Sparkles aria-hidden />Generate a schedule</ButtonLink>}
          {can("createEvent") && <Button onClick={() => openCreate()}><Plus aria-hidden />Create event</Button>}
        </>} />

      <div className="mb-5 flex flex-wrap items-center gap-3" role="search" aria-label="Schedule filters">
        <Select aria-label="Filter by team" value={team} onChange={(e) => setTeam(e.target.value)} className="w-auto">
          <option value="all">All {myTeamIds ? "my " : ""}teams</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </Select>
        <Tabs label="Filter by event type" value={type} onChange={(v) => setType(v as typeof type)} size="sm"
          tabs={[{ id: "all", label: "All" }, { id: "game", label: "Games" }, { id: "practice", label: "Training" }, { id: "tournament", label: "Tournaments" }, { id: "meeting", label: "Meetings" }]} />
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat label="Events in the next 7 days" value={thisWeek.length} sub={`${thisWeek.filter((e) => e.type === "game").length} games · ${thisWeek.filter((e) => e.type === "practice").length} practices`} />
        <Stat label="Pending RSVPs (7 days)" value={pendingTotal} sub={`across ${pendingEvents.length} events`} tone={pendingTotal > 20 ? "warning" : undefined} />
        <Stat label="Open scheduling conflicts" value={myConflicts.length} sub={`${myConflicts.filter((c) => c.severity === "error").length} blocking · ${postponed.length} postponed`} tone={myConflicts.length ? "danger" : "success"} />
        <Stat label="Venue utilization today" value={`${avgUtil}%`} sub="booked share of opening hours" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-6">
          {children.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Your family this week</CardTitle><Badge tone="primary">{children.length} athletes</Badge></CardHeader>
              <CardBody>
                <ul className="divide-y divide-border">
                  {children.flatMap((c) => upcoming.filter((e) => e.teamIds.some((t) => c.teamIds.includes(t)) && new Date(e.start) < weekEnd).slice(0, 3).map((e) => (
                    <li key={c.id + e.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                      <div><p className="text-sm font-semibold">{c.name.split(" ")[0]}: {e.title}</p><p className="text-xs text-muted">{fmtDay(e.start)}</p></div>
                      {e.status === "scheduled" ? <RsvpControl eventId={e.id} personId={c.id} name={c.name.split(" ")[0]} compact /> : <Badge tone="warning">{e.status}</Badge>}
                    </li>
                  )))}
                </ul>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>This week at a glance</CardTitle><ButtonLink href="/demo/calendar/" variant="link" size="sm">Open calendar<ArrowRight aria-hidden /></ButtonLink></CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {Array.from({ length: 7 }, (_, i) => addDays(today, i)).map((d, i) => {
                  const list = filtered.filter((e) => sameDay(new Date(e.start), d) && e.status === "scheduled");
                  return (
                    <Link key={d.toISOString()} href={`/demo/calendar/?view=day&date=${dateKey(d)}`} className={cn("min-w-0 rounded-lg border border-border px-0.5 py-2 text-center hover:border-primary sm:p-2", i === 0 && "border-primary bg-primary-soft")}>
                      <p className="text-[11px] font-medium uppercase text-muted">{WEEKDAYS_SHORT[d.getDay()]}</p>
                      <p className="font-[family-name:var(--font-display)] text-lg font-semibold tabular-nums">{d.getDate()}</p>
                      <p className="text-[11px] text-muted tabular-nums">{list.length}<span className="hidden sm:inline"> ev.</span></p>
                    </Link>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Upcoming</CardTitle><span className="text-xs text-muted">{upcoming.length} events</span></CardHeader>
            <CardBody className="pt-3">
              {upcoming.length === 0 ? (
                <EmptyState icon={<CalendarRange />} title="Nothing scheduled for this filter" body="Try another team or event type, or create the first event." action={can("createEvent") ? <Button size="sm" onClick={() => openCreate()}><Plus aria-hidden />Create event</Button> : undefined} />
              ) : (
                <ul className="divide-y divide-border">{upcoming.slice(0, 10).map((e) => <EventRow key={e.id} ev={e} />)}</ul>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader><CardTitle>Scheduling alerts</CardTitle><ButtonLink href="/demo/conflicts/" variant="link" size="sm">All</ButtonLink></CardHeader>
            <CardBody className="space-y-2">
              {myConflicts.length === 0 && postponed.length === 0 && <Alert tone="success" title="All clear">No conflicts in your schedule.</Alert>}
              {postponed.length > 0 && <Alert tone="warning" title={`${postponed.length} postponed game${postponed.length > 1 ? "s" : ""} need a new date`} action={<ButtonLink size="sm" variant="outline" href="/demo/conflicts/?tab=postponed">Fix</ButtonLink>} />}
              {myConflicts.slice(0, 4).map((c) => (
                <Link key={c.id} href={`/demo/conflicts/?focus=${encodeURIComponent(c.id)}`} className="flex gap-2.5 rounded-lg border border-border p-2.5 hover:border-danger">
                  <AlertTriangle className={cn("mt-0.5 size-4 shrink-0", c.severity === "error" ? "text-danger" : "text-warning")} aria-hidden />
                  <span className="min-w-0"><span className="block text-sm font-semibold">{CONFLICT_LABEL[c.kind]}</span><span className="line-clamp-2 text-xs text-muted">{c.message}</span></span>
                </Link>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pending RSVPs</CardTitle><ButtonLink href="/demo/attendance/" variant="link" size="sm">Attendance</ButtonLink></CardHeader>
            <CardBody className="space-y-3">
              {pendingEvents.length === 0 ? <p className="text-sm text-muted">Everyone has responded. 🎉</p> : pendingEvents.slice(0, 4).map(({ e, c }) => (
                <div key={e.id} className="rounded-lg border border-border p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><p className="truncate text-sm font-semibold">{e.title}</p><p className="text-xs text-muted">{fmtDay(e.start)}</p></div>
                    {can("sendReminders") && <Button size="sm" variant="outline" onClick={() => remind(e.id, e.title, c.pending)}><BellRing aria-hidden />Remind {c.pending}</Button>}
                  </div>
                  <AttendanceBar rsvps={state.rsvps[e.id]} className="mt-2" />
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Venue availability today</CardTitle><ButtonLink href="/demo/venues/" variant="link" size="sm">Venues</ButtonLink></CardHeader>
            <CardBody className="space-y-3">
              {util.map(({ v, booked, pct, closed }) => {
                const open = minutesOf(v.open), total = minutesOf(v.close) - open;
                return (
                  <div key={v.id}>
                    <div className="flex justify-between text-xs"><span className="font-medium">{v.site} · {v.name}</span><span className="text-muted tabular-nums">{closed ? "Closed" : `${pct}% booked`}</span></div>
                    <div className="relative mt-1 h-2.5 overflow-hidden rounded-full bg-success-soft" role="img" aria-label={`${v.name}: ${closed ? "closed today" : `${booked.length} bookings, ${pct}% of opening hours`}`}>
                      {closed ? <div className="absolute inset-0 bg-danger-soft" /> : booked.map((e) => (
                        <span key={e.id} className="absolute inset-y-0 bg-primary" style={{ left: `${((minutesOfDay(e.start) - open) / total) * 100}%`, width: `${(durationMin(e.start, e.end) / total) * 100}%` }} />
                      ))}
                    </div>
                  </div>
                );
              })}
              <p className="text-[11px] text-muted">Green = free · dark = booked · from opening to closing time</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
