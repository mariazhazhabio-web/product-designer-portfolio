"use client";

import { AlertTriangle, ChevronRight } from "lucide-react";
import type { SportEvent } from "@/lib/sportsync/types";
import { useDemo } from "@/lib/sportsync/store";
import { fmtRange, WEEKDAYS_SHORT } from "@/lib/sportsync/dates";
import { cn } from "@/lib/utils";
import { StatusBadge, TYPE_META, TypeBadge } from "./meta";
import { useEditor } from "./shell";
import type { ReactNode } from "react";

export function EventRow({ ev, right, compact }: { ev: SportEvent; right?: ReactNode; compact?: boolean }) {
  const { state, conflicts } = useDemo();
  const { openEvent } = useEditor();
  const venue = state.venues.find((v) => v.id === ev.venueId);
  const d = new Date(ev.start);
  const conflict = conflicts.some((c) => c.eventIds.includes(ev.id) && c.severity === "error");
  return (
    <li className={cn("flex items-center gap-3 border-l-4 py-2.5 pl-3 pr-2", TYPE_META[ev.type].bar, ev.status === "cancelled" && "opacity-60")}>
      <div className="w-11 shrink-0 text-center leading-tight" aria-hidden>
        <p className="text-[11px] font-medium uppercase text-muted">{WEEKDAYS_SHORT[d.getDay()]}</p>
        <p className="font-[family-name:var(--font-display)] text-lg font-semibold tabular-nums">{d.getDate()}</p>
      </div>
      <button type="button" onClick={() => openEvent(ev.id)} className="group min-w-0 flex-1 text-left">
        <p className={cn("flex items-center gap-1.5 truncate text-sm font-semibold group-hover:underline", ev.status === "cancelled" && "line-through")}>
          {conflict && <AlertTriangle className="size-3.5 shrink-0 text-danger" aria-label="Has a conflict" />}
          <span className="truncate">{ev.title}</span>
        </p>
        <p className="truncate text-xs text-muted">{fmtRange(ev.start, ev.end)} · {venue ? `${venue.site} · ${venue.name}` : "TBD"}</p>
        {!compact && <div className="mt-1 flex flex-wrap items-center gap-2"><TypeBadge type={ev.type} /><StatusBadge status={ev.status} /></div>}
      </button>
      {right ?? <ChevronRight className="size-4 shrink-0 text-subtle" aria-hidden />}
    </li>
  );
}
