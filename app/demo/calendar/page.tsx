"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import type { EventStatus, EventType } from "@/lib/sportsync/types";
import { addDays, dateKey, fmtDay, fmtLongDay, fmtMonth, fromDateKey, startOfWeek } from "@/lib/sportsync/dates";
import { useQuery, setQueryParam } from "@/lib/use-query";
import { Button } from "@/components/ui/button";
import { Checkbox, EmptyState, Select, Tabs } from "@/components/ui/primitives";
import { PageTitle, useEditor } from "@/components/demo/shell";
import { DayView, MonthView, WeekView } from "@/components/demo/calendar";
import { TYPE_META } from "@/components/demo/meta";
import { EventRow } from "@/components/demo/event-row";
import { AddToCalendar } from "@/components/demo/event-detail";

type View = "month" | "week" | "day" | "list";

export default function CalendarPage() {
  const { state, visibleEvents, conflicts, can, myTeamIds } = useDemo();
  const { openEvent, openCreate } = useEditor();
  const q = useQuery();
  const [view, setView] = useState<View>("week");
  const [anchor, setAnchor] = useState(() => new Date());
  const [team, setTeam] = useState("all");
  const [venue, setVenue] = useState("all");
  const [types, setTypes] = useState<EventType[]>(["game", "practice", "tournament", "meeting"]);
  const [statuses, setStatuses] = useState<EventStatus[]>(["scheduled", "postponed", "cancelled"]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!q) return;
    const v = q.get("view") as View | null;
    if (v && ["month", "week", "day", "list"].includes(v)) setView(v);
    else if (window.innerWidth < 640) setView("list");
    const d = q.get("date");
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) setAnchor(fromDateKey(d));
    const t = q.get("team");
    if (t) setTeam(t);
  }, [q]);

  const conflictIds = useMemo(() => new Set(conflicts.filter((c) => c.severity === "error").flatMap((c) => c.eventIds)), [conflicts]);
  const events = useMemo(() => visibleEvents.filter((e) => types.includes(e.type) && statuses.includes(e.status) && (team === "all" || e.teamIds.includes(team)) && (venue === "all" || e.venueId === venue)), [visibleEvents, types, statuses, team, venue]);
  const teams = state.teams.filter((t) => !myTeamIds || myTeamIds.includes(t.id));

  const step = (dir: number) => {
    const d = new Date(anchor);
    if (view === "month") d.setMonth(d.getMonth() + dir);
    else if (view === "day") d.setDate(d.getDate() + dir);
    else d.setDate(d.getDate() + 7 * dir);
    setAnchor(d);
    setQueryParam("date", dateKey(d));
  };
  const changeView = (v: View) => { setView(v); setQueryParam("view", v); };
  const title = view === "month" ? fmtMonth(anchor) : view === "day" ? fmtLongDay(anchor) : `Week of ${fmtDay(startOfWeek(anchor))}`;
  const listStart = view === "list" ? startOfWeek(anchor) : startOfWeek(anchor);
  const listEvents = events.filter((e) => new Date(e.start) >= listStart && new Date(e.start) < addDays(listStart, 14)).sort((a, b) => a.start.localeCompare(b.start));
  const onCreate = can("createEvent") ? (start: string, venueId?: string) => openCreate({ start, end: new Date(new Date(start).getTime() + 90 * 60000).toISOString(), venueId }) : undefined;
  const scoped = view === "list" ? listEvents : events;

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle title="Schedule" sub="Daily, weekly and monthly views of games, practices, tournaments and meetings. Click any empty slot to create an event."
        actions={<>
          <AddToCalendar events={scoped.filter((e) => e.status !== "cancelled")} label="Export view (.ics)" filename="sportsync-schedule.ics" />
          {can("createEvent") && <Button onClick={() => openCreate()}><Plus aria-hidden />Create event</Button>}
        </>} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" onClick={() => step(-1)} aria-label="Previous"><ChevronLeft /></Button>
          <Button variant="outline" size="sm" onClick={() => { setAnchor(new Date()); setQueryParam("date", null); }}>Today</Button>
          <Button variant="outline" size="icon-sm" onClick={() => step(1)} aria-label="Next"><ChevronRight /></Button>
        </div>
        <h2 className="mr-auto text-lg font-semibold" aria-live="polite">{title}</h2>
        <Tabs label="Calendar view" value={view} onChange={(v) => changeView(v as View)} size="sm" tabs={[{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }, { id: "list", label: "List" }]} />
        <Button variant={showFilters ? "secondary" : "outline"} size="sm" aria-expanded={showFilters} onClick={() => setShowFilters((s) => !s)}><Filter aria-hidden />Filters</Button>
      </div>

      {showFilters && (
        <div className="card mb-4 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm"><span className="mb-1 block font-medium">Team</span>
            <Select value={team} onChange={(e) => setTeam(e.target.value)}><option value="all">All teams</option>{teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
          </label>
          <label className="text-sm"><span className="mb-1 block font-medium">Venue</span>
            <Select value={venue} onChange={(e) => setVenue(e.target.value)}><option value="all">All venues</option>{state.venues.map((v) => <option key={v.id} value={v.id}>{v.site} · {v.name}</option>)}</Select>
          </label>
          <fieldset className="text-sm"><legend className="mb-1 font-medium">Event types</legend>
            <div className="grid grid-cols-2 gap-1">{(Object.keys(TYPE_META) as EventType[]).map((t) => <Checkbox key={t} checked={types.includes(t)} onChange={(e) => setTypes(e.target.checked ? [...types, t] : types.filter((x) => x !== t))} label={TYPE_META[t].label} />)}</div>
          </fieldset>
          <fieldset className="text-sm"><legend className="mb-1 font-medium">Status</legend>
            <div className="grid grid-cols-2 gap-1">{(["scheduled", "postponed", "cancelled"] as EventStatus[]).map((s) => <Checkbox key={s} checked={statuses.includes(s)} onChange={(e) => setStatuses(e.target.checked ? [...statuses, s] : statuses.filter((x) => x !== s))} label={s[0].toUpperCase() + s.slice(1)} />)}</div>
          </fieldset>
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted" aria-label="Legend">
        {(Object.keys(TYPE_META) as EventType[]).map((t) => <span key={t} className="inline-flex items-center gap-1.5"><span className={`size-2.5 rounded-sm ${TYPE_META[t].dot}`} aria-hidden />{TYPE_META[t].label}</span>)}
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm ring-2 ring-danger" aria-hidden />Conflict</span>
        {view === "day" && <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[repeating-linear-gradient(135deg,var(--surface-3)_0_3px,transparent_3px_6px)] ring-1 ring-border" aria-hidden />Venue closed</span>}
      </div>

      {view === "month" && <MonthView anchor={anchor} events={events} conflictIds={conflictIds} onSelect={openEvent} onCreate={onCreate} venues={state.venues} teams={state.teams} onDrill={(d) => { setAnchor(d); changeView("day"); }} />}
      {view === "week" && <WeekView anchor={anchor} events={events.filter((e) => new Date(e.start) >= startOfWeek(anchor) && new Date(e.start) < addDays(startOfWeek(anchor), 7))} conflictIds={conflictIds} onSelect={openEvent} onCreate={onCreate} venues={state.venues} teams={state.teams} />}
      {view === "day" && <DayView anchor={anchor} events={events} conflictIds={conflictIds} onSelect={openEvent} onCreate={onCreate} venues={venue === "all" ? state.venues : state.venues.filter((v) => v.id === venue)} teams={state.teams} />}
      {view === "list" && (
        listEvents.length === 0 ? <EmptyState title="No events in these two weeks" body="Change the filters or move to another week." /> : (
          <div className="card">
            {Array.from(new Set(listEvents.map((e) => dateKey(e.start)))).map((day) => (
              <section key={day} aria-label={fmtLongDay(fromDateKey(day))} className="border-b border-border last:border-0">
                <h3 className="sticky top-14 bg-surface-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{fmtLongDay(fromDateKey(day))}</h3>
                <ul className="divide-y divide-border px-2">{listEvents.filter((e) => dateKey(e.start) === day).map((e) => <EventRow key={e.id} ev={e} />)}</ul>
              </section>
            ))}
          </div>
        )
      )}
    </div>
  );
}
