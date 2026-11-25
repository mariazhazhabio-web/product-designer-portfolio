"use client";

import { AlertTriangle } from "lucide-react";
import type { SportEvent, Team, Venue } from "@/lib/sportsync/types";
import { addDays, dateKey, fmtDay, fmtRange, fmtTime, minutesOfDay, durationMin, sameDay, startOfMonth, startOfWeek, WEEKDAYS_SHORT, combine, pad } from "@/lib/sportsync/dates";
import { cn } from "@/lib/utils";
import { TYPE_META } from "./meta";

interface ViewProps {
  anchor: Date;
  events: SportEvent[];
  conflictIds: Set<string>;
  onSelect: (id: string) => void;
  onCreate?: (start: string, venueId?: string) => void;
  venues: Venue[];
  teams: Team[];
}

const HOUR_START = 7;
const HOUR_END = 22;
const HOUR_PX = 52;

function chipClass(ev: SportEvent) {
  return cn("border-l-4 bg-surface-2 text-left text-text hover:bg-surface-3", TYPE_META[ev.type].bar, ev.status === "cancelled" && "line-through opacity-60", ev.status === "postponed" && "opacity-70 [border-left-style:dashed]");
}

export function EventPill({ ev, conflict, onSelect, showTime = true }: { ev: SportEvent; conflict: boolean; onSelect: (id: string) => void; showTime?: boolean }) {
  return (
    <button type="button" onClick={() => onSelect(ev.id)} aria-label={`${ev.title}, ${fmtDay(ev.start)} ${fmtRange(ev.start, ev.end)}${conflict ? ", has a conflict" : ""}${ev.status !== "scheduled" ? `, ${ev.status}` : ""}`}
      className={cn("flex w-full items-center gap-1 truncate rounded px-1.5 py-0.5 text-[11px] leading-tight", chipClass(ev))}>
      {conflict && <AlertTriangle className="size-3 shrink-0 text-danger" aria-hidden />}
      {showTime && <span className="shrink-0 tabular-nums text-muted">{fmtTime(ev.start).replace(":00", "").replace(" ", "").toLowerCase()}</span>}
      <span className="truncate">{ev.title}</span>
    </button>
  );
}

export function MonthView({ anchor, events, conflictIds, onSelect, onCreate, onDrill }: ViewProps & { onDrill: (d: Date) => void }) {
  const first = startOfWeek(startOfMonth(anchor));
  const days = Array.from({ length: 42 }, (_, i) => addDays(first, i));
  const today = new Date();
  const byDay = new Map<string, SportEvent[]>();
  for (const e of [...events].sort((a, b) => a.start.localeCompare(b.start))) {
    const k = dateKey(e.start);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(e);
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border" role="grid" aria-label="Month view">
      <div className="grid grid-cols-7 border-b border-border bg-surface-2 text-xs font-medium text-muted" role="row">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d} role="columnheader" className="px-2 py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d) => {
          const list = byDay.get(dateKey(d)) ?? [];
          const inMonth = d.getMonth() === anchor.getMonth();
          const hasConflict = list.some((e) => conflictIds.has(e.id));
          return (
            <div key={d.toISOString()} role="gridcell" className={cn("group min-h-20 border-b border-r border-border p-1 sm:min-h-28 [&:nth-child(7n)]:border-r-0", !inMonth && "bg-surface-2/60")}>
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => onDrill(d)} aria-label={`${fmtDay(d)}, ${list.length} events. Open day view`}
                  className={cn("flex size-7 items-center justify-center rounded-full text-xs font-medium hover:bg-surface-3", sameDay(d, today) && "bg-primary text-primary-fg hover:bg-primary-hover", !inMonth && "text-subtle")}>{d.getDate()}</button>
                {onCreate && <button type="button" onClick={() => onCreate(combine(dateKey(d), "17:00"))} className="hidden rounded px-1 text-xs text-muted hover:bg-surface-3 group-hover:block focus:block" aria-label={`Create event on ${fmtDay(d)}`}>+</button>}
              </div>
              <div className="mt-0.5 hidden space-y-0.5 sm:block">
                {list.slice(0, 3).map((e) => <EventPill key={e.id} ev={e} conflict={conflictIds.has(e.id)} onSelect={onSelect} />)}
                {list.length > 3 && <button type="button" onClick={() => onDrill(d)} className="px-1.5 text-[11px] font-medium text-info hover:underline">+{list.length - 3} more</button>}
              </div>
              <div className="mt-1 flex flex-wrap gap-0.5 sm:hidden" aria-hidden>
                {list.slice(0, 6).map((e) => <span key={e.id} className={cn("size-1.5 rounded-full", TYPE_META[e.type].dot)} />)}
                {hasConflict && <span className="size-1.5 rounded-full bg-danger ring-1 ring-surface" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function layoutLanes(list: SportEvent[]) {
  const sorted = [...list].sort((a, b) => a.start.localeCompare(b.start));
  const pos = new Map<string, { lane: number; lanes: number }>();
  const ends: number[] = [];
  let cluster: SportEvent[] = [];
  let clusterEnd = 0;
  const flush = () => { const n = Math.max(1, ...cluster.map((e) => pos.get(e.id)!.lane + 1)); cluster.forEach((e) => (pos.get(e.id)!.lanes = n)); cluster = []; ends.length = 0; };
  for (const e of sorted) {
    const s = new Date(e.start).getTime();
    if (cluster.length && s >= clusterEnd) flush();
    let lane = ends.findIndex((end) => end <= s);
    if (lane === -1) { lane = ends.length; ends.push(0); }
    ends[lane] = new Date(e.end).getTime();
    pos.set(e.id, { lane, lanes: 1 });
    cluster.push(e);
    clusterEnd = Math.max(clusterEnd, new Date(e.end).getTime());
  }
  if (cluster.length) flush();
  return pos;
}

function TimeGrid({ columns, events, conflictIds, onSelect, onCreate, colOf, venues }: {
  columns: { key: string; label: React.ReactNode; date: Date; sub?: string }[]; events: SportEvent[]; conflictIds: Set<string>; onSelect: (id: string) => void; onCreate?: (start: string, colKey: string) => void; colOf: (e: SportEvent) => string; venues: Venue[];
}) {
  const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
  const now = new Date();
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <div style={{ minWidth: Math.max(columns.length * 110 + 56, 320) }}>
        <div className="sticky top-0 z-10 grid border-b border-border bg-surface-2" style={{ gridTemplateColumns: `56px repeat(${columns.length}, minmax(0,1fr))` }}>
          <div />
          {columns.map((c) => (
            <div key={c.key} className={cn("border-l border-border px-2 py-2 text-xs font-medium", sameDay(c.date, now) && columns.length === 7 && "text-primary")}>
              {c.label}{c.sub && <span className="block font-normal text-muted">{c.sub}</span>}
            </div>
          ))}
        </div>
        <div className="relative grid" style={{ gridTemplateColumns: `56px repeat(${columns.length}, minmax(0,1fr))` }}>
          <div>
            {hours.map((h) => <div key={h} style={{ height: HOUR_PX }} className="pr-2 pt-0.5 text-right text-[11px] leading-none text-muted tabular-nums">{h === 12 ? "12 pm" : h > 12 ? `${h - 12} pm` : `${h} am`}</div>)}
          </div>
          {columns.map((c) => {
            const list = events.filter((e) => colOf(e) === c.key);
            const pos = layoutLanes(list);
            const venue = venues.find((v) => v.id === c.key);
            return (
              <div key={c.key} className="relative border-l border-border" style={{ height: hours.length * HOUR_PX }}>
                {hours.map((h) => (
                  <button key={h} type="button" tabIndex={onCreate ? 0 : -1} aria-label={onCreate ? `Create event ${c.sub ?? fmtDay(c.date)} at ${h}:00` : undefined} disabled={!onCreate}
                    onClick={() => onCreate?.(combine(dateKey(c.date), `${pad(h)}:00`), c.key)}
                    className="block w-full border-b border-border/60 hover:bg-primary-soft/40 disabled:hover:bg-transparent" style={{ height: HOUR_PX }} />
                ))}
                {venue && (
                  <>
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 bg-[repeating-linear-gradient(135deg,var(--surface-3)_0_6px,transparent_6px_12px)] opacity-70" style={{ height: Math.max(0, (Number(venue.open.slice(0, 2)) - HOUR_START) * HOUR_PX) }} />
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 bg-[repeating-linear-gradient(135deg,var(--surface-3)_0_6px,transparent_6px_12px)] opacity-70" style={{ height: Math.max(0, (HOUR_END - Number(venue.close.slice(0, 2))) * HOUR_PX) }} />
                  </>
                )}
                {list.map((e) => {
                  const top = ((minutesOfDay(e.start) - HOUR_START * 60) / 60) * HOUR_PX;
                  const h = Math.max(22, (durationMin(e.start, e.end) / 60) * HOUR_PX - 2);
                  const p = pos.get(e.id)!;
                  const v = venues.find((x) => x.id === e.venueId);
                  const conflict = conflictIds.has(e.id);
                  return (
                    <button key={e.id} type="button" onClick={() => onSelect(e.id)} title={`${e.title} · ${fmtRange(e.start, e.end)}${v ? ` · ${v.name}` : ""}`}
                      aria-label={`${e.title}, ${fmtRange(e.start, e.end)}${conflict ? ", has a conflict" : ""}`}
                      className={cn("absolute overflow-hidden rounded-md px-1.5 py-1 text-[11px] leading-tight shadow-sm", chipClass(e), conflict && "ring-2 ring-danger")}
                      style={{ top: Math.max(0, top), height: h, left: `calc(${(p.lane / p.lanes) * 100}% + 2px)`, width: `calc(${100 / p.lanes}% - 4px)` }}>
                      <span className="flex items-center gap-1 font-semibold">{conflict && <AlertTriangle className="size-3 shrink-0 text-danger" aria-hidden />}<span className="truncate">{e.title}</span></span>
                      <span className="block truncate text-muted">{fmtRange(e.start, e.end)}</span>
                      {columns.length === 7 && v && <span className="block truncate text-muted">{v.name}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function WeekView({ anchor, events, conflictIds, onSelect, onCreate, venues }: ViewProps) {
  const start = startOfWeek(anchor);
  const columns = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(start, i);
    return { key: dateKey(d), date: d, label: <>{WEEKDAYS_SHORT[d.getDay()]} <span className="tabular-nums">{d.getDate()}</span></> };
  });
  return <TimeGrid columns={columns} events={events} conflictIds={conflictIds} onSelect={onSelect} onCreate={onCreate ? (s) => onCreate(s) : undefined} colOf={(e) => dateKey(e.start)} venues={[]} />;
}

/** Day view with one column per venue: doubles as a venue availability board. */
export function DayView({ anchor, events, conflictIds, onSelect, onCreate, venues }: ViewProps) {
  const dayEvents = events.filter((e) => sameDay(new Date(e.start), anchor));
  const columns = venues.map((v) => ({ key: v.id, date: anchor, label: v.name, sub: v.site }));
  return <TimeGrid columns={columns} events={dayEvents} conflictIds={conflictIds} onSelect={onSelect} onCreate={onCreate ? (s, k) => onCreate(s, k) : undefined} colOf={(e) => e.venueId} venues={venues} />;
}
