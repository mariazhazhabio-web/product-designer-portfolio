"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Repeat, Sparkles } from "lucide-react";
import type { EventType, SportEvent } from "@/lib/sportsync/types";
import { useDemo, upsertEvents } from "@/lib/sportsync/store";
import { checkEvent, suggestAlternatives } from "@/lib/sportsync/conflicts";
import { addDays, combine, dateKey, fmtDay, fmtRange, fromDateKey, timeOf, WEEKDAYS_SHORT } from "@/lib/sportsync/dates";
import { Button } from "@/components/ui/button";
import { Alert, Checkbox, Dialog, Field, Input, Select, Switch, Textarea } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/badge";

export type Scope = "this" | "following" | "all";

interface Draft {
  title: string;
  type: EventType;
  teamIds: string[];
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  expectedAttendance: string;
  repeat: boolean;
  byDay: number[];
  until: string;
  notify: boolean;
}

function toDraft(ev: Partial<SportEvent> | undefined, fallbackDate: string): Draft {
  const date = ev?.start ? dateKey(ev.start) : fallbackDate;
  return {
    title: ev?.title ?? "",
    type: ev?.type ?? "practice",
    teamIds: ev?.teamIds ?? [],
    venueId: ev?.venueId ?? "",
    date,
    startTime: ev?.start ? timeOf(ev.start) : "17:00",
    endTime: ev?.end ? timeOf(ev.end) : "18:30",
    notes: ev?.notes ?? "",
    expectedAttendance: ev?.expectedAttendance ? String(ev.expectedAttendance) : "",
    repeat: false,
    byDay: [fromDateKey(date).getDay()],
    until: dateKey(addDays(fromDateKey(date), 42)),
    notify: true,
  };
}

export function EventFormDialog({ open, onClose, editing, prefill }: { open: boolean; onClose: () => void; editing?: SportEvent; prefill?: Partial<SportEvent> }) {
  const { state, engine, commit, myTeamIds, can } = useDemo();
  const [d, setD] = useState<Draft>(() => toDraft(editing ?? prefill, dateKey(addDays(new Date(), 1))));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [scopeAsk, setScopeAsk] = useState(false);
  const [suggestions, setSuggestions] = useState<SportEvent[] | null>(null);

  useEffect(() => {
    if (open) {
      setD(toDraft(editing ?? prefill, dateKey(addDays(new Date(), 1))));
      setErrors({});
      setSuggestions(null);
      setScopeAsk(false);
    }
  }, [open, editing, prefill]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  const teams = state.teams.filter((t) => !myTeamIds || myTeamIds.includes(t.id) || state.role !== "coach");

  const candidate: SportEvent | null = useMemo(() => {
    if (!d.venueId || !/^\d{4}-\d{2}-\d{2}$/.test(d.date) || !d.startTime || !d.endTime || d.endTime <= d.startTime) return null;
    return {
      ...(editing ?? {}), id: editing?.id ?? "draft", title: d.title || "New event", type: d.type, teamIds: d.teamIds, venueId: d.venueId,
      start: combine(d.date, d.startTime), end: combine(d.date, d.endTime), status: "scheduled", notes: d.notes || undefined,
      expectedAttendance: d.expectedAttendance ? Number(d.expectedAttendance) : undefined,
    } as SportEvent;
  }, [d, editing]);

  const issues = useMemo(() => (candidate ? checkEvent(candidate, engine) : []), [candidate, engine]);
  const blocking = issues.filter((i) => i.severity === "error");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!d.title.trim()) e.title = "Give the event a name, for example “Hawks vs Comets”.";
    if (!d.venueId) e.venueId = "Choose a venue.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date)) e.date = "Choose a date.";
    if (d.endTime <= d.startTime) e.endTime = "End time must be after the start time.";
    if ((d.type === "game" || d.type === "tournament") && d.teamIds.length < 1) e.teamIds = "Assign at least one team to a game.";
    if (d.repeat && !d.byDay.length) e.byDay = "Pick at least one weekday.";
    if (d.repeat && d.until <= d.date) e.until = "The repeat end date must be after the first date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const build = (base: Partial<SportEvent>, date: string): SportEvent => ({
    ...(base as SportEvent), title: d.title.trim(), type: d.type, teamIds: d.teamIds, venueId: d.venueId,
    start: combine(date, d.startTime), end: combine(date, d.endTime), notes: d.notes || undefined,
    expectedAttendance: d.expectedAttendance ? Number(d.expectedAttendance) : undefined, status: base.status ?? "scheduled",
  });

  const save = (scope: Scope = "this") => {
    if (!validate()) return;
    const venueName = state.venues.find((v) => v.id === d.venueId)?.site;
    if (editing) {
      const venueChanged = editing.venueId !== d.venueId;
      let targets: SportEvent[] = [editing];
      if (editing.seriesId && scope !== "this") {
        targets = state.events.filter((e) => e.seriesId === editing.seriesId && (scope === "all" || e.start >= editing.start));
      }
      const updated = targets.map((t) => build(t, t.id === editing.id ? d.date : dateKey(t.start)));
      commit(
        scope === "this" ? `Edited “${d.title}”` : `Edited ${updated.length} events in “${editing.title}” series (${scope})`,
        (s) => upsertEvents(s, updated),
        {
          toast: scope === "this" ? "Event updated" : `${updated.length} events updated`,
          notify: d.notify ? { type: venueChanged ? "venue_change" : "schedule_change", title: venueChanged ? `Venue changed: ${d.title}` : `Schedule change: ${d.title}`, body: `${fmtDay(combine(d.date, d.startTime))}, ${d.startTime}–${d.endTime} at ${venueName}${scope !== "this" ? ` (${updated.length} occurrences)` : ""}.`, eventId: editing.id } : undefined,
        },
      );
    } else if (d.repeat) {
      const sid = `s-new-${Date.now().toString(36)}`;
      const occ: SportEvent[] = [];
      for (let day = fromDateKey(d.date); dateKey(day) <= d.until; day = addDays(day, 1)) {
        if (d.byDay.includes(day.getDay())) occ.push(build({ id: `e-${sid}-${occ.length}`, seriesId: sid, source: "manual" }, dateKey(day)));
      }
      commit(`Created recurring “${d.title}” (${occ.length} events)`, (s) => ({
        ...s, events: [...s.events, ...occ],
        series: [...s.series, { id: sid, title: d.title, byDay: d.byDay, startTime: d.startTime, endTime: d.endTime, from: d.date, until: d.until }],
      }), { toast: `${occ.length} recurring events created`, notify: d.notify ? { type: "new_event", title: `New recurring event: ${d.title}`, body: `${occ.length} sessions, ${d.byDay.map((x) => WEEKDAYS_SHORT[x]).join("/")} ${d.startTime}–${d.endTime} at ${venueName}.`, eventId: occ[0]?.id } : undefined });
    } else {
      const ev = build({ id: `e-new-${Date.now().toString(36)}`, source: "manual" }, d.date);
      commit(`Created “${d.title}”`, (s) => ({ ...s, events: [...s.events, ev] }), {
        toast: "Event created",
        notify: d.notify ? { type: "new_event", title: `New event: ${d.title}`, body: `${fmtDay(ev.start)}, ${fmtRange(ev.start, ev.end)} at ${venueName}.`, eventId: ev.id } : undefined,
      });
    }
    onClose();
  };

  const onSubmit = () => {
    if (!validate()) return;
    if (editing?.seriesId) setScopeAsk(true);
    else save("this");
  };

  const findSlots = () => {
    if (!candidate) { validate(); return; }
    setSuggestions(suggestAlternatives(candidate, engine, { limit: 3 }).map((a) => a.event));
  };

  if (!can("createEvent") && !editing) return null;
  const sites = Array.from(new Set(state.venues.map((v) => v.site)));

  return (
    <>
      <Dialog open={open && !scopeAsk} onClose={onClose} size="xl" title={editing ? "Edit event" : "Create event"}
        description={editing?.seriesId ? <span className="inline-flex items-center gap-1"><Repeat className="size-3.5" aria-hidden /> Part of a recurring series</span> : "Conflicts are checked as you type."}
        footer={<>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} >{editing ? "Save changes" : d.repeat ? "Create series" : "Create event"}</Button>
        </>}>
        <form className="grid gap-4 md:grid-cols-[1.25fr_1fr]" onSubmit={(e) => { e.preventDefault(); onSubmit(); }} noValidate>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
              <Field label="Event name" htmlFor="ev-title" error={errors.title} required>
                <Input id="ev-title" value={d.title} onChange={(e) => set("title", e.target.value)} aria-invalid={!!errors.title} placeholder="e.g. Hawks vs Comets" autoFocus />
              </Field>
              <Field label="Type" htmlFor="ev-type">
                <Select id="ev-type" value={d.type} onChange={(e) => set("type", e.target.value as EventType)}>
                  <option value="game">Game</option><option value="practice">Practice</option><option value="tournament">Tournament</option><option value="meeting">Meeting</option>
                </Select>
              </Field>
            </div>
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium">Teams {errors.teamIds && <span className="ml-1 text-xs font-medium text-danger" role="alert">{errors.teamIds}</span>}</legend>
              <div className="grid max-h-40 grid-cols-1 gap-1.5 overflow-y-auto rounded-lg border border-border p-2 sm:grid-cols-2">
                {teams.map((t) => (
                  <Checkbox key={t.id} checked={d.teamIds.includes(t.id)} onChange={(e) => set("teamIds", e.target.checked ? [...d.teamIds, t.id] : d.teamIds.filter((x) => x !== t.id))}
                    label={<span className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full" style={{ background: t.color }} />{t.name}<span className="text-xs text-muted">{t.ageGroup}</span></span>} />
                ))}
              </div>
              <p className="mt-1 text-xs text-muted">Coaches and rosters are assigned through the team.</p>
            </fieldset>
            <Field label="Venue" htmlFor="ev-venue" error={errors.venueId} required>
              <Select id="ev-venue" value={d.venueId} onChange={(e) => set("venueId", e.target.value)} aria-invalid={!!errors.venueId}>
                <option value="">Choose a venue…</option>
                {sites.map((s) => (
                  <optgroup key={s} label={s}>
                    {state.venues.filter((v) => v.site === s).map((v) => <option key={v.id} value={v.id}>{v.name} · {v.open}–{v.close} · cap. {v.capacity}</option>)}
                  </optgroup>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Date" htmlFor="ev-date" error={errors.date}><Input id="ev-date" type="date" value={d.date} onChange={(e) => set("date", e.target.value)} /></Field>
              <Field label="Start" htmlFor="ev-start"><Input id="ev-start" type="time" step={900} value={d.startTime} onChange={(e) => set("startTime", e.target.value)} /></Field>
              <Field label="End" htmlFor="ev-end" error={errors.endTime}><Input id="ev-end" type="time" step={900} value={d.endTime} onChange={(e) => set("endTime", e.target.value)} aria-invalid={!!errors.endTime} /></Field>
            </div>
            {!editing && (
              <div className="rounded-lg border border-border p-3">
                <Checkbox checked={d.repeat} onChange={(e) => set("repeat", e.target.checked)} label={<span className="font-medium">Repeat weekly</span>} />
                {d.repeat && (
                  <div className="mt-3 space-y-3">
                    <div role="group" aria-label="Repeat on" className="flex flex-wrap gap-1.5">
                      {WEEKDAYS_SHORT.map((w, i) => (
                        <button key={w} type="button" aria-pressed={d.byDay.includes(i)} onClick={() => set("byDay", d.byDay.includes(i) ? d.byDay.filter((x) => x !== i) : [...d.byDay, i])}
                          className={`h-8 min-w-11 rounded-md border px-2 text-xs font-medium ${d.byDay.includes(i) ? "border-primary bg-primary text-primary-fg" : "border-border-strong"}`}>{w}</button>
                      ))}
                    </div>
                    {errors.byDay && <p className="text-xs text-danger">{errors.byDay}</p>}
                    <Field label="Repeat until" htmlFor="ev-until" error={errors.until}><Input id="ev-until" type="date" value={d.until} onChange={(e) => set("until", e.target.value)} /></Field>
                  </div>
                )}
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
              <Field label="Notes for families" htmlFor="ev-notes"><Textarea id="ev-notes" value={d.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Jerseys, arrival time, carpools…" className="min-h-16" /></Field>
              <Field label="Expected crowd" htmlFor="ev-crowd" hint="Checked against capacity"><Input id="ev-crowd" inputMode="numeric" value={d.expectedAttendance} onChange={(e) => set("expectedAttendance", e.target.value.replace(/\D/g, ""))} /></Field>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-2 p-3">
              <div><p className="text-sm font-medium">Notify teams and families</p><p className="text-xs text-muted">Uses each person&apos;s notification preferences (simulated delivery)</p></div>
              <Switch checked={d.notify} onChange={(v) => set("notify", v)} label="Notify teams and families" />
            </div>
          </div>

          <aside aria-live="polite" className="space-y-3">
            <p className="text-sm font-semibold">Schedule check</p>
            {!candidate ? (
              <p className="rounded-lg border border-dashed border-border-strong p-3 text-sm text-muted">Choose a venue, date and time to check for conflicts.</p>
            ) : issues.length === 0 ? (
              <Alert tone="success" title="No conflicts found">Venue, teams, coaches, players and facility hours all check out.</Alert>
            ) : (
              <div className="space-y-2">
                {issues.map((i, n) => (
                  <Alert key={n} tone={i.severity === "error" ? "danger" : "warning"} title={i.title}>
                    <p>{i.message}</p><p className="mt-1 font-medium">{i.fix}</p>
                  </Alert>
                ))}
              </div>
            )}
            {candidate && issues.length > 0 && (
              <Button variant="outline" className="w-full" onClick={findSlots}><Sparkles aria-hidden />Find conflict-free times</Button>
            )}
            {suggestions && (
              <div className="space-y-2">
                {suggestions.length === 0 && <p className="text-sm text-muted">No free slot found in the next 14 days.</p>}
                {suggestions.map((s) => {
                  const v = state.venues.find((x) => x.id === s.venueId)!;
                  return (
                    <button key={s.start + s.venueId} type="button" onClick={() => { setD((x) => ({ ...x, date: dateKey(s.start), startTime: timeOf(s.start), endTime: timeOf(s.end), venueId: s.venueId })); setSuggestions(null); }}
                      className="flex w-full items-center gap-3 rounded-lg border border-border p-2.5 text-left text-sm hover:border-primary hover:bg-primary-soft">
                      <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
                      <span><span className="font-medium">{fmtDay(s.start)} · {fmtRange(s.start, s.end)}</span><br /><span className="text-muted">{v.site} · {v.name}</span></span>
                    </button>
                  );
                })}
              </div>
            )}
            {blocking.length > 0 && (
              <p className="flex gap-1.5 text-xs text-muted"><AlertTriangle className="size-3.5 shrink-0 text-warning" aria-hidden />You can still save. The event will appear in the Conflicts list until it is resolved.</p>
            )}
            {d.repeat && <Badge tone="info"><Repeat aria-hidden />Conflicts are checked for the first date; the full series is checked after saving</Badge>}
          </aside>
        </form>
      </Dialog>

      <Dialog open={open && scopeAsk} onClose={() => setScopeAsk(false)} size="sm" title="Edit recurring event"
        description="This event is part of a weekly series. Which events should change?">
        <div className="space-y-2">
          {([["this", "This event only", "Other dates stay the same."], ["following", "This and following events", "Future dates in the series change; past ones stay."], ["all", "All events in the series", "Every date changes, including past ones."]] as [Scope, string, string][]).map(([s, l, h]) => (
            <button key={s} type="button" onClick={() => save(s)} className="w-full rounded-lg border border-border p-3 text-left hover:border-primary hover:bg-primary-soft">
              <span className="block text-sm font-semibold">{l}</span><span className="text-xs text-muted">{h}</span>
            </button>
          ))}
          <p className="pt-1 text-xs text-muted">Date changes apply only to this event; time, venue, teams and notes can apply to the series.</p>
        </div>
      </Dialog>
    </>
  );
}
