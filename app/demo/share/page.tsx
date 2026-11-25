"use client";

import { Eye } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import { useQuery } from "@/lib/use-query";
import { dateKey, fmtLongDay, fmtRange, fromDateKey } from "@/lib/sportsync/dates";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/primitives";
import { AddToCalendar } from "@/components/demo/event-detail";
import { StatusBadge, TypeBadge } from "@/components/demo/meta";

export default function SharedSchedule() {
  const { state } = useDemo();
  const q = useQuery();
  if (!q) return null;
  const team = state.teams.find((t) => t.id === q.get("team"));
  if (!team) return <EmptyState title="This shared link isn't valid" body="The team may have been removed, or the link was copied incompletely." />;
  const events = state.events.filter((e) => e.teamIds.includes(team.id) && new Date(e.end) > new Date()).sort((a, b) => a.start.localeCompare(b.start)).slice(0, 30);
  const days = Array.from(new Set(events.map((e) => dateKey(e.start))));
  return (
    <div className="mx-auto max-w-3xl">
      <Badge tone="info" className="mb-3"><Eye aria-hidden />Read-only shared schedule</Badge>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold"><span aria-hidden className="size-3 rounded-full" style={{ background: team.color }} />{team.name}</h1>
          <p className="text-sm text-muted">{team.ageGroup} {team.sport} · Riverbend Youth Sports League · updates automatically</p>
        </div>
        <AddToCalendar events={events.filter((e) => e.status !== "cancelled")} label="Add all to calendar" filename={`${team.name.replace(/\W+/g, "-").toLowerCase()}.ics`} />
      </div>
      <div className="mt-6 space-y-5">
        {days.map((d) => (
          <section key={d} aria-label={fmtLongDay(fromDateKey(d))}>
            <h2 className="mb-2 text-sm font-semibold text-muted">{fmtLongDay(fromDateKey(d))}</h2>
            <ul className="card divide-y divide-border">
              {events.filter((e) => dateKey(e.start) === d).map((e) => {
                const v = state.venues.find((x) => x.id === e.venueId);
                return (
                  <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className={e.status === "cancelled" ? "opacity-60" : ""}>
                      <p className={`font-semibold ${e.status === "cancelled" ? "line-through" : ""}`}>{e.title}</p>
                      <p className="text-sm text-muted">{fmtRange(e.start, e.end)} · {v?.site} · {v?.name}</p>
                      <div className="mt-1 flex gap-2"><TypeBadge type={e.type} /><StatusBadge status={e.status} /></div>
                    </div>
                    {e.status === "scheduled" && <AddToCalendar events={[e]} label="Add" />}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
