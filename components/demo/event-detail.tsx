"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarPlus, Check, Clock, Copy, Download, MapPin, Pencil, RotateCcw, Trash2, Users, XCircle, CalendarClock, ExternalLink, Sparkles } from "lucide-react";
import type { RsvpStatus, SportEvent } from "@/lib/sportsync/types";
import { useDemo, upsertEvents } from "@/lib/sportsync/store";
import { fmtDay, fmtLongDay, fmtRange, fmtTime, dateKey, addDays } from "@/lib/sportsync/dates";
import { suggestAlternatives, type Alternative } from "@/lib/sportsync/conflicts";
import { buildICS, downloadText, googleCalendarUrl, outlookCalendarUrl } from "@/lib/sportsync/ics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, ConfirmDialog, Dialog, Field, Input } from "@/components/ui/primitives";
import { RSVP_META, StatusBadge, TypeBadge } from "./meta";
import { cn } from "@/lib/utils";

export function rsvpCounts(rsvps: Record<string, RsvpStatus> | undefined) {
  const c = { yes: 0, no: 0, maybe: 0, pending: 0 };
  for (const v of Object.values(rsvps ?? {})) c[v]++;
  return c;
}

export function AttendanceBar({ rsvps, className }: { rsvps?: Record<string, RsvpStatus>; className?: string }) {
  const c = rsvpCounts(rsvps);
  const total = c.yes + c.no + c.maybe + c.pending;
  if (!total) return null;
  const seg = (n: number, cls: string, label: string) => n > 0 && <span className={cls} style={{ width: `${(n / total) * 100}%` }} title={`${label}: ${n}`} />;
  return (
    <div className={className}>
      <div className="flex h-2 overflow-hidden rounded-full bg-surface-3" role="img" aria-label={`${c.yes} attending, ${c.maybe} maybe, ${c.no} not attending, ${c.pending} no response`}>
        {seg(c.yes, "bg-success", "Attending")}{seg(c.maybe, "bg-warning", "Maybe")}{seg(c.no, "bg-danger", "Not attending")}
      </div>
      <p className="mt-1 text-xs text-muted tabular-nums">{c.yes} yes · {c.maybe} maybe · {c.no} no · {c.pending} pending</p>
    </div>
  );
}

export function RsvpControl({ eventId, personId, name, compact }: { eventId: string; personId: string; name?: string; compact?: boolean }) {
  const { state, commit } = useDemo();
  const current = state.rsvps[eventId]?.[personId] ?? "pending";
  const set = (v: RsvpStatus) =>
    commit(`RSVP ${RSVP_META[v].short} for ${name ?? "you"}`, (s) => ({ ...s, rsvps: { ...s.rsvps, [eventId]: { ...(s.rsvps[eventId] ?? {}), [personId]: v } } }), { toast: `${name ? name + ": " : ""}${RSVP_META[v].label}` });
  const opts: [RsvpStatus, string, string][] = [["yes", "Going", "data-[on=true]:bg-success data-[on=true]:text-white data-[on=true]:border-success"], ["maybe", "Maybe", "data-[on=true]:bg-warning data-[on=true]:text-white data-[on=true]:border-warning"], ["no", "Can't go", "data-[on=true]:bg-danger data-[on=true]:text-white data-[on=true]:border-danger"]];
  return (
    <div role="group" aria-label={`RSVP${name ? ` for ${name}` : ""}`} className="inline-flex gap-1">
      {opts.map(([v, l, cls]) => (
        <button key={v} type="button" data-on={current === v} aria-pressed={current === v} onClick={() => set(v)}
          className={cn("rounded-md border border-border-strong font-medium transition-colors dark:data-[on=true]:text-bg", compact ? "h-7 px-2 text-xs" : "h-8 px-3 text-sm", cls)}>{l}</button>
      ))}
    </div>
  );
}

export function AddToCalendar({ events, label = "Add to calendar", filename = "sportsync-event.ics" }: { events: SportEvent[]; label?: string; filename?: string }) {
  const { state } = useDemo();
  const [open, setOpen] = useState(false);
  const one = events.length === 1 ? events[0] : null;
  const venue = one ? state.venues.find((v) => v.id === one.venueId) : undefined;
  return (
    <div className="relative">
      <Button variant="outline" size="sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}><CalendarPlus aria-hidden />{label}</Button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-60 rounded-xl border border-border bg-surface p-1.5 shadow-lg" onMouseLeave={() => setOpen(false)}>
          {one && <a className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm hover:bg-surface-2" href={googleCalendarUrl(one, venue)} target="_blank" rel="noreferrer">Google Calendar <ExternalLink className="ml-auto size-3.5" aria-hidden /></a>}
          {one && <a className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm hover:bg-surface-2" href={outlookCalendarUrl(one, venue)} target="_blank" rel="noreferrer">Outlook.com <ExternalLink className="ml-auto size-3.5" aria-hidden /></a>}
          <button type="button" className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-surface-2"
            onClick={() => { downloadText(filename, buildICS(events, state), "text/calendar;charset=utf-8"); setOpen(false); }}>
            Apple Calendar / .ics file <Download className="ml-auto size-3.5" aria-hidden />
          </button>
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] text-muted">Opens the provider&apos;s own “add event” page. No sign-in is shared with this demo.</p>
        </div>
      )}
    </div>
  );
}

/** Side-by-side comparison of alternative slots, then a confirmation step. */
export function CompareAlternativesDialog({ event, open, onClose, reason }: { event: SportEvent | null; open: boolean; onClose: () => void; reason?: string }) {
  const { state, engine, commit, can } = useDemo();
  const [pick, setPick] = useState<Alternative | null>(null);
  const [confirm, setConfirm] = useState(false);
  const alts = useMemo(() => (open && event ? suggestAlternatives(event, engine, { limit: 3, from: event.status === "postponed" ? new Date() : undefined }) : []), [open, event, engine]);
  if (!event) return null;
  const venueOf = (id: string) => state.venues.find((v) => v.id === id);
  const apply = () => {
    if (!pick) return;
    const moved: SportEvent = { ...pick.event, status: "scheduled", statusReason: undefined };
    const v = venueOf(moved.venueId);
    commit(`Rescheduled “${event.title}” to ${fmtDay(moved.start)} ${fmtTime(moved.start)}`, (s) => upsertEvents(s, [moved]), {
      toast: "Event rescheduled. Families notified",
      notify: { type: moved.venueId !== event.venueId ? "venue_change" : "schedule_change", title: `Rescheduled: ${event.title}`, body: `Now ${fmtDay(moved.start)}, ${fmtRange(moved.start, moved.end)} at ${v?.site} · ${v?.name}.`, eventId: event.id },
    });
    setConfirm(false); setPick(null); onClose();
  };
  const ov = venueOf(event.venueId);
  const teamCount = state.teams.filter((t) => event.teamIds.includes(t.id)).reduce((n, t) => n + t.playerIds.length, 0);
  return (
    <>
      <Dialog open={open && !confirm} onClose={onClose} size="xl" title="Compare alternatives" description={reason ?? `Pick a new time for ${event.title}. Every option has been checked against all scheduling rules.`}
        footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!pick || !can("editEvent")} onClick={() => setConfirm(true)}>Review change<ArrowRight aria-hidden /></Button></>}>
        <div className="mb-4 rounded-xl border border-dashed border-border-strong bg-surface-2 p-3 text-sm">
          <span className="font-semibold">Current: </span>{fmtDay(event.start)} · {fmtRange(event.start, event.end)} · {ov?.site} · {ov?.name}{event.status !== "scheduled" && <> · <StatusBadge status={event.status} /></>}
        </div>
        {!can("editEvent") && <Alert tone="warning" className="mb-3" title="View only">Your current role can compare options but not apply them. Switch to League administrator to apply.</Alert>}
        {alts.length === 0 ? (
          <Alert tone="warning" title="No conflict-free alternatives in the next 14 days">Try another venue, shorten the event, or relax the rest-period rule in Settings.</Alert>
        ) : (
          <div role="radiogroup" aria-label="Alternative times" className="grid gap-3 md:grid-cols-3">
            {alts.map((a, i) => {
              const v = venueOf(a.event.venueId)!;
              const on = pick?.id === a.id;
              return (
                <button key={a.id} type="button" role="radio" aria-checked={on} onClick={() => setPick(a)}
                  className={cn("flex flex-col rounded-xl border-2 p-4 text-left transition-colors", on ? "border-primary bg-primary-soft" : "border-border hover:border-border-strong")}>
                  <div className="flex items-center justify-between">
                    <Badge tone={i === 0 ? "primary" : "neutral"}>{i === 0 ? "Best match" : `Option ${i + 1}`}</Badge>
                    <span className="text-xs text-muted tabular-nums">Fit score {Math.round(a.score)}</span>
                  </div>
                  <p className="mt-3 font-semibold">{fmtDay(a.event.start)}</p>
                  <p className="text-sm">{fmtRange(a.event.start, a.event.end)}</p>
                  <p className="mt-0.5 text-sm text-muted">{v.site} · {v.name}</p>
                  <ul className="mt-3 space-y-1 text-xs">
                    {a.reasons.map((r) => <li key={r} className="flex gap-1.5"><Check className="size-3.5 shrink-0 text-success" aria-hidden />{r}</li>)}
                    {a.tradeoffs.map((r) => <li key={r} className="flex gap-1.5 text-warning"><ArrowRight className="size-3.5 shrink-0" aria-hidden />{r}</li>)}
                    {a.warnings.map((r) => <li key={r} className="text-muted">⚠ {r}</li>)}
                  </ul>
                </button>
              );
            })}
          </div>
        )}
      </Dialog>
      <Dialog open={open && confirm} onClose={() => setConfirm(false)} size="sm" title="Confirm reschedule"
        footer={<><Button variant="outline" onClick={() => setConfirm(false)}>Back</Button><Button onClick={apply}>Confirm and notify</Button></>}>
        {pick && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[4rem_1fr] gap-2">
              <span className="text-muted">Before</span><span className="line-through decoration-danger/60">{fmtDay(event.start)}, {fmtRange(event.start, event.end)} · {ov?.name}</span>
              <span className="text-muted">After</span><span className="font-semibold">{fmtDay(pick.event.start)}, {fmtRange(pick.event.start, pick.event.end)} · {venueOf(pick.event.venueId)?.site} · {venueOf(pick.event.venueId)?.name}</span>
            </div>
            <p className="text-muted">{teamCount > 0 ? `${teamCount} players and their families` : "Attendees"} will be notified using their preferences. You can undo this change afterwards.</p>
          </div>
        )}
      </Dialog>
    </>
  );
}

export function EventDetailDialog({ eventId, open, onClose, onEdit }: { eventId: string | null; open: boolean; onClose: () => void; onEdit: (ev: SportEvent) => void }) {
  const { state, commit, can, canEdit, conflicts, myTeamIds, user } = useDemo();
  const ev = state.events.find((e) => e.id === eventId) ?? null;
  const [compare, setCompare] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [postpone, setPostpone] = useState(false);
  const [reason, setReason] = useState("");
  if (!ev) return null;
  const venue = state.venues.find((v) => v.id === ev.venueId);
  const teams = state.teams.filter((t) => ev.teamIds.includes(t.id));
  const mine = conflicts.filter((c) => c.eventIds.includes(ev.id));
  const editable = canEdit(ev);
  const series = ev.seriesId ? state.events.filter((e) => e.seriesId === ev.seriesId) : [];

  const setStatus = (status: SportEvent["status"], statusReason?: string, scope: "this" | "series" = "this") => {
    const targets = scope === "series" ? series.filter((e) => e.start >= ev.start) : [ev];
    commit(`${status === "cancelled" ? "Cancelled" : status === "postponed" ? "Postponed" : "Restored"} “${ev.title}”${targets.length > 1 ? ` (${targets.length} events)` : ""}`,
      (s) => upsertEvents(s, targets.map((t) => ({ ...t, status, statusReason }))),
      { toast: status === "scheduled" ? "Event restored" : `Event ${status}. Families notified`, notify: { type: status === "scheduled" ? "schedule_change" : status === "cancelled" ? "cancellation" : "schedule_change", title: `${status === "cancelled" ? "Cancelled" : status === "postponed" ? "Postponed" : "Back on"}: ${ev.title}`, body: `${fmtDay(ev.start)} ${fmtRange(ev.start, ev.end)}${statusReason ? `. Reason: ${statusReason}` : ""}.`, eventId: ev.id } });
  };
  const duplicate = () => {
    const copy: SportEvent = { ...ev, id: `e-dup-${Date.now().toString(36)}`, seriesId: undefined, title: `${ev.title} (copy)`, start: addDays(new Date(ev.start), 7).toISOString(), end: addDays(new Date(ev.end), 7).toISOString(), status: "scheduled", statusReason: undefined, source: "manual" };
    commit(`Duplicated “${ev.title}”`, (s) => ({ ...s, events: [...s.events, copy] }), { toast: "Duplicated to the same time next week" });
    onClose();
    setTimeout(() => onEdit(copy), 50);
  };
  const del = () => {
    commit(`Deleted “${ev.title}”`, (s) => ({ ...s, events: s.events.filter((e) => e.id !== ev.id) }), { toast: "Event deleted" });
    onClose();
  };

  const children = state.role === "parent" ? state.people.filter((p) => p.guardianId === user.id && p.teamIds.some((t) => ev.teamIds.includes(t))) : [];
  const selfCanRsvp = (state.role === "athlete" && myTeamIds?.some((t) => ev.teamIds.includes(t))) || (state.role === "coach" && myTeamIds?.some((t) => ev.teamIds.includes(t)));
  const past = new Date(ev.end) < new Date();

  return (
    <>
      <Dialog open={open && !compare && !confirmCancel && !confirmDelete && !postpone} onClose={onClose} size="md" title={ev.title}
        description={<span className="flex flex-wrap items-center gap-2"><TypeBadge type={ev.type} /><StatusBadge status={ev.status} />{ev.seriesId && <Badge tone="info">Recurring</Badge>}{ev.source === "assistant" && <Badge tone="accent"><Sparkles aria-hidden />Assistant-generated</Badge>}{ev.label && <Badge>{ev.label}</Badge>}</span>}>
        <div className="space-y-4 text-sm">
          <dl className="grid grid-cols-[1.5rem_1fr] gap-x-2 gap-y-2.5">
            <Clock className="size-4 text-muted" aria-label="When" /><dd>{fmtLongDay(ev.start)} · {fmtRange(ev.start, ev.end)}</dd>
            <MapPin className="size-4 text-muted" aria-label="Where" /><dd>{venue ? <>{venue.site} · {venue.name}<span className="block text-xs text-muted">{venue.address}</span></> : "No venue"}</dd>
            <Users className="size-4 text-muted" aria-label="Teams" /><dd>{teams.length ? teams.map((t) => t.name).join(" · ") : "Open to all teams"}</dd>
          </dl>
          {ev.statusReason && <Alert tone={ev.status === "cancelled" ? "danger" : "warning"} title={ev.status === "cancelled" ? "Cancelled" : "Postponed"}>{ev.statusReason}</Alert>}
          {ev.notes && <p className="rounded-lg bg-surface-2 p-3">{ev.notes}</p>}
          {mine.length > 0 && (
            <div className="space-y-2">
              {mine.map((c) => (
                <Alert key={c.id} tone={c.severity === "error" ? "danger" : "warning"} title={c.title} action={can("resolveConflicts") ? <Button size="sm" variant="outline" onClick={() => setCompare(true)}>Fix</Button> : undefined}>{c.message}</Alert>
              ))}
            </div>
          )}
          {ev.teamIds.length > 0 && (
            <div className="rounded-xl border border-border p-3">
              <div className="mb-2 flex items-center justify-between"><p className="font-semibold">Expected attendance</p>{can("viewAttendance") && <Link className="text-xs font-medium text-info hover:underline" href={`/demo/attendance/?event=${ev.id}`}>Open roster</Link>}</div>
              <AttendanceBar rsvps={state.rsvps[ev.id]} />
              {!past && children.map((c) => (
                <div key={c.id} className="mt-3 flex flex-wrap items-center justify-between gap-2"><span>RSVP for <strong>{c.name.split(" ")[0]}</strong></span><RsvpControl eventId={ev.id} personId={c.id} name={c.name.split(" ")[0]} /></div>
              ))}
              {!past && selfCanRsvp && <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><span>Your RSVP</span><RsvpControl eventId={ev.id} personId={user.id} /></div>}
            </div>
          )}
          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            {editable && <Button size="sm" onClick={() => { onClose(); onEdit(ev); }}><Pencil aria-hidden />Edit</Button>}
            {editable && <Button size="sm" variant="outline" onClick={duplicate}><Copy aria-hidden />Duplicate</Button>}
            {editable && <Button size="sm" variant="outline" onClick={() => setCompare(true)}><CalendarClock aria-hidden />Reschedule</Button>}
            {editable && ev.status === "scheduled" && <Button size="sm" variant="outline" onClick={() => { setReason(""); setPostpone(true); }}>Postpone</Button>}
            {editable && ev.status === "scheduled" && <Button size="sm" variant="outline" onClick={() => setConfirmCancel(true)}><XCircle aria-hidden />Cancel event</Button>}
            {editable && ev.status !== "scheduled" && <Button size="sm" variant="outline" onClick={() => setStatus("scheduled")}><RotateCcw aria-hidden />Restore</Button>}
            {can("deleteEvent") && <Button size="sm" variant="ghost" className="text-danger" onClick={() => setConfirmDelete(true)}><Trash2 aria-hidden />Delete</Button>}
            <div className="ml-auto"><AddToCalendar events={[ev]} filename={`${dateKey(ev.start)}-${ev.title.replace(/\W+/g, "-").toLowerCase()}.ics`} /></div>
          </div>
          {!editable && <p className="text-xs text-muted">You are viewing as <strong>{user.title}</strong>. Editing is limited to {state.role === "coach" ? "your own teams' events" : "league staff"}.</p>}
        </div>
      </Dialog>
      <CompareAlternativesDialog event={ev} open={open && compare} onClose={() => setCompare(false)} reason={mine[0]?.message} />
      <Dialog open={open && confirmCancel} onClose={() => setConfirmCancel(false)} size="sm" title="Cancel this event?"
        footer={<>
          <Button variant="outline" onClick={() => setConfirmCancel(false)}>Keep event</Button>
          {ev.seriesId && <Button variant="outline" onClick={() => { setStatus("cancelled", "Cancelled by organizer", "series"); setConfirmCancel(false); }}>Cancel this & following</Button>}
          <Button variant="danger" onClick={() => { setStatus("cancelled", "Cancelled by organizer"); setConfirmCancel(false); }}>Cancel event</Button>
        </>}>
        <p className="text-sm text-muted">{ev.title} on {fmtDay(ev.start)} will be marked cancelled and everyone on the roster will be notified. It stays visible (struck through) so families aren&apos;t confused, and you can restore it later.</p>
      </Dialog>
      <Dialog open={open && postpone} onClose={() => setPostpone(false)} size="sm" title="Postpone event"
        footer={<><Button variant="outline" onClick={() => setPostpone(false)}>Back</Button><Button onClick={() => { setStatus("postponed", reason || "Postponed by organizer"); setPostpone(false); }}>Postpone and notify</Button></>}>
        <div className="space-y-3 text-sm">
          <p className="text-muted">Postponed events keep their roster and RSVPs. They appear under <strong>Needs a new date</strong> on the Conflicts page until rescheduled.</p>
          <Field label="Reason (shown to families)" htmlFor="pp-reason"><Input id="pp-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Weather: lightning in the area" /></Field>
        </div>
      </Dialog>
      <ConfirmDialog open={open && confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={del} tone="danger" confirmLabel="Delete permanently"
        title="Delete this event?" body={<>This removes <strong>{ev.title}</strong> and its RSVPs. Prefer <em>Cancel</em> if families should still see it. You can undo right after deleting.</>} />
    </>
  );
}
