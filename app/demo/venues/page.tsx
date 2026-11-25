"use client";

import { useState } from "react";
import { Ban, Clock, Plus, Users, Wrench, ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import { addDays, combine, dateKey, fmtDay, fmtRange, startOfWeek } from "@/lib/sportsync/dates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/primitives";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle, useEditor } from "@/components/demo/shell";
import { WeekView } from "@/components/demo/calendar";
import { cn } from "@/lib/utils";

export default function VenuesPage() {
  const { state, can, commit, conflicts } = useDemo();
  const { openEvent, openCreate } = useEditor();
  const [venueId, setVenueId] = useState(state.venues[0].id);
  const [anchor, setAnchor] = useState(new Date());
  const [kind, setKind] = useState<"maintenance" | "closure">("maintenance");
  const [date, setDate] = useState(dateKey(addDays(new Date(), 5)));
  const [from, setFrom] = useState("08:00");
  const [to, setTo] = useState("12:00");
  const [reason, setReason] = useState("");
  const v = state.venues.find((x) => x.id === venueId)!;
  const ws = startOfWeek(anchor);
  const weekEvents = state.events.filter((e) => e.venueId === v.id && new Date(e.start) >= ws && new Date(e.start) < addDays(ws, 7));
  const conflictIds = new Set(conflicts.filter((c) => c.severity === "error").flatMap((c) => c.eventIds));
  const venueConflicts = conflicts.filter((c) => c.eventIds.some((id) => state.events.find((e) => e.id === id)?.venueId === v.id) && ["venue_double_booked", "facility_closed", "outside_hours", "maintenance", "capacity", "recurring_conflict"].includes(c.kind));
  const sites = Array.from(new Set(state.venues.map((x) => x.site)));

  const addRule = () => {
    if (kind === "maintenance" && to <= from) return;
    commit(kind === "maintenance" ? `Added maintenance at ${v.name}` : `Added closure at ${v.site}`, (s) => ({
      ...s, venues: s.venues.map((x) => (kind === "closure" ? x.site === v.site : x.id === v.id)
        ? kind === "maintenance" ? { ...x, maintenance: [...x.maintenance, { start: combine(date, from), end: combine(date, to), reason: reason || "Maintenance" }] } : { ...x, closures: [...x.closures, { date, reason: reason || "Closed" }] }
        : x),
    }), { toast: "Saved. Affected events appear in Conflicts", notify: { type: "venue_change", title: `${kind === "maintenance" ? "Maintenance" : "Closure"} scheduled: ${v.site}`, body: `${fmtDay(date + "T12:00")}${kind === "maintenance" ? `, ${from}–${to}` : ""}. ${reason}` } });
    setReason("");
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle title="Venues & facilities" sub="Directory, booking calendar, operating hours, capacity, equipment, maintenance and restrictions. All checked automatically when events are scheduled." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sites.map((site) => (
          <div key={site} className="card p-4">
            <p className="font-semibold">{site}</p>
            <p className="text-xs text-muted">{state.venues.find((x) => x.site === site)!.address}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {state.venues.filter((x) => x.site === site).map((x) => (
                <button key={x.id} type="button" onClick={() => setVenueId(x.id)} aria-pressed={x.id === v.id}
                  className={cn("rounded-lg border px-3 py-1.5 text-sm font-medium", x.id === v.id ? "border-primary bg-primary text-primary-fg" : "border-border hover:border-border-strong")}>{x.name}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-xl font-semibold">{v.site} · {v.name}</h2>
            <Button variant="outline" size="icon-sm" aria-label="Previous week" onClick={() => setAnchor(addDays(anchor, -7))}><ChevronLeft /></Button>
            <span className="text-sm font-medium">Week of {fmtDay(ws)}</span>
            <Button variant="outline" size="icon-sm" aria-label="Next week" onClick={() => setAnchor(addDays(anchor, 7))}><ChevronRight /></Button>
            {can("bookVenue") && <Button size="sm" onClick={() => openCreate({ venueId: v.id })}><CalendarPlus aria-hidden />Book this venue</Button>}
          </div>
          <WeekView anchor={anchor} events={weekEvents} conflictIds={conflictIds} onSelect={openEvent} onCreate={can("bookVenue") ? (start) => openCreate({ venueId: v.id, start, end: new Date(new Date(start).getTime() + 90 * 60000).toISOString() }) : undefined} venues={state.venues} teams={state.teams} />
          {venueConflicts.length > 0 && <p className="text-sm text-danger">{venueConflicts.length} facility conflict{venueConflicts.length > 1 ? "s" : ""} at this venue. See the Conflicts page.</p>}
        </div>
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-3 text-sm">
              <p className="flex items-center gap-2"><Clock className="size-4 text-muted" aria-hidden />Open {v.open}–{v.close} daily</p>
              <p className="flex items-center gap-2"><Users className="size-4 text-muted" aria-hidden />Capacity {v.capacity}</p>
              <div><p className="mb-1 font-semibold">Sports</p><div className="flex gap-1">{v.sports.map((s) => <Badge key={s} tone="primary">{s}</Badge>)}</div></div>
              <div><p className="mb-1 font-semibold">Equipment</p><ul className="list-disc pl-5 text-muted">{v.equipment.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><p className="mb-1 font-semibold">Booking restrictions</p><ul className="list-disc pl-5 text-muted">{v.restrictions.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><p className="mb-1 font-semibold">Maintenance & closures</p>
                <ul className="space-y-1">
                  {v.maintenance.map((m, i) => <li key={i} className="flex gap-1.5 text-warning"><Wrench className="mt-0.5 size-3.5 shrink-0" aria-hidden />{fmtDay(m.start)} {fmtRange(m.start, m.end)}: {m.reason}</li>)}
                  {v.closures.map((c) => <li key={c.date} className="flex gap-1.5 text-danger"><Ban className="mt-0.5 size-3.5 shrink-0" aria-hidden />{fmtDay(c.date + "T12:00")}: {c.reason}</li>)}
                  {!v.maintenance.length && !v.closures.length && <li className="text-muted">None scheduled</li>}
                </ul>
              </div>
            </CardBody>
          </Card>
          {can("manageVenues") ? (
            <Card>
              <CardHeader><CardTitle>Block time</CardTitle></CardHeader>
              <CardBody>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); addRule(); }}>
                  <Field label="Type" htmlFor="blk-kind"><Select id="blk-kind" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}><option value="maintenance">Maintenance window ({v.name})</option><option value="closure">Full-day closure (whole site)</option></Select></Field>
                  <Field label="Date" htmlFor="blk-date"><Input id="blk-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
                  {kind === "maintenance" && <div className="grid grid-cols-2 gap-2"><Field label="From" htmlFor="blk-from"><Input id="blk-from" type="time" value={from} onChange={(e) => setFrom(e.target.value)} /></Field><Field label="To" htmlFor="blk-to" error={to <= from ? "Must be after start" : undefined}><Input id="blk-to" type="time" value={to} onChange={(e) => setTo(e.target.value)} /></Field></div>}
                  <Field label="Reason" htmlFor="blk-reason"><Input id="blk-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. HVAC repair" /></Field>
                  <Button type="submit" className="w-full"><Plus aria-hidden />Save</Button>
                </form>
              </CardBody>
            </Card>
          ) : <p className="text-xs text-muted">Facility managers and league administrators can add maintenance windows and closures.</p>}
        </div>
      </div>
    </div>
  );
}
