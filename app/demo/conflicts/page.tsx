"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, Eye, EyeOff, Pencil, Repeat, Sparkles } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import type { Conflict, SportEvent } from "@/lib/sportsync/types";
import { CONFLICT_LABEL } from "@/lib/sportsync/conflicts";
import { useQuery } from "@/lib/use-query";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, EmptyState, Tabs } from "@/components/ui/primitives";
import { PageTitle, useEditor } from "@/components/demo/shell";
import { EventRow } from "@/components/demo/event-row";
import { CompareAlternativesDialog } from "@/components/demo/event-detail";
import { cn } from "@/lib/utils";

export default function ConflictsPage() {
  const { state, conflicts, can, commit, visibleEvents } = useDemo();
  const { openEdit } = useEditor();
  const q = useQuery();
  const [tab, setTab] = useState("blocking");
  const [focus, setFocus] = useState<string | null>(null);
  const [moving, setMoving] = useState<{ ev: SportEvent; reason: string } | null>(null);
  const [choice, setChoice] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!q) return;
    const f = q.get("focus");
    const t = q.get("tab");
    if (t) setTab(t);
    if (f) {
      setFocus(f);
      const c = conflicts.find((x) => x.id === f);
      if (c) setTab(state.acknowledged.includes(c.id) ? "acknowledged" : c.severity === "error" ? "blocking" : "warnings");
      setTimeout(() => document.getElementById(`c-${f}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    }
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleIds = new Set(visibleEvents.map((e) => e.id));
  const mine = conflicts.filter((c) => c.eventIds.some((id) => visibleIds.has(id)));
  const open = mine.filter((c) => !state.acknowledged.includes(c.id));
  const blocking = open.filter((c) => c.severity === "error");
  const warnings = open.filter((c) => c.severity === "warning");
  const acknowledged = mine.filter((c) => state.acknowledged.includes(c.id));
  const postponed = visibleEvents.filter((e) => e.status === "postponed");
  const list = tab === "blocking" ? blocking : tab === "warnings" ? warnings : tab === "acknowledged" ? acknowledged : [];

  const ack = (c: Conflict, on: boolean) => commit(on ? `Acknowledged warning: ${CONFLICT_LABEL[c.kind]}` : `Reopened warning: ${CONFLICT_LABEL[c.kind]}`,
    (s) => ({ ...s, acknowledged: on ? [...s.acknowledged, c.id] : s.acknowledged.filter((x) => x !== c.id) }), { toast: on ? "Warning acknowledged" : "Warning reopened" });

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle title="Scheduling conflicts" sub="Detected automatically across venues, teams, coaches, players, rest periods, facility hours, closures and recurring series. Compare fixes before anything changes."
        actions={can("useAssistant") && blocking.length > 1 ? <ButtonLink href="/demo/assistant/" variant="outline"><Sparkles aria-hidden />Fix all with assistant</ButtonLink> : undefined} />

      <Tabs label="Conflict categories" value={tab} onChange={setTab} className="mb-5"
        tabs={[{ id: "blocking", label: "Blocking", count: blocking.length }, { id: "warnings", label: "Warnings", count: warnings.length }, { id: "postponed", label: "Needs a new date", count: postponed.length }, { id: "acknowledged", label: "Acknowledged", count: acknowledged.length }]} />

      {tab === "postponed" ? (
        postponed.length === 0 ? <EmptyState icon={<CheckCircle2 />} title="No postponed games" body="Postponed events appear here until they get a new date." /> : (
          <div className="space-y-3">
            {postponed.map((e) => (
              <div key={e.id} className="card p-4">
                <Alert tone="warning" title="Postponed: needs a new date">{e.statusReason}</Alert>
                <ul className="mt-2"><EventRow ev={e} /></ul>
                {can("editEvent") && <div className="mt-3 flex justify-end"><Button onClick={() => setMoving({ ev: e, reason: `${e.title} was postponed (${e.statusReason}). Choose a new date.` })}><CalendarClock aria-hidden />Find a new date</Button></div>}
              </div>
            ))}
          </div>
        )
      ) : list.length === 0 ? (
        <EmptyState icon={<CheckCircle2 />} title={tab === "acknowledged" ? "Nothing acknowledged" : "No conflicts here"} body={tab === "blocking" ? "Every upcoming event passes the scheduling rules." : "Warnings you accept as known risks show up under Acknowledged."} />
      ) : (
        <ul className="space-y-3">
          {list.map((c) => {
            const evs = c.eventIds.map((id) => state.events.find((e) => e.id === id)).filter(Boolean) as SportEvent[];
            const unique = evs.filter((e, i) => evs.findIndex((x) => x.id === e.id) === i);
            const shown = c.kind === "recurring_conflict" ? unique.slice(0, 4) : unique;
            const target = choice[c.id] ?? unique[unique.length - 1]?.id;
            const targetEv = unique.find((e) => e.id === target);
            return (
              <li key={c.id} id={`c-${c.id}`} className={cn("card overflow-hidden", focus === c.id && "ring-2 ring-primary")}>
                <div className={cn("flex items-start gap-3 border-b border-border p-4", c.severity === "error" ? "bg-danger-soft" : "bg-warning-soft")}>
                  {c.kind === "recurring_conflict" ? <Repeat className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden /> : <AlertTriangle className={cn("mt-0.5 size-5 shrink-0", c.severity === "error" ? "text-danger" : "text-warning")} aria-hidden />}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{c.title}</p><Badge tone={c.severity === "error" ? "danger" : "warning"}>{c.severity === "error" ? "Blocking" : "Warning"}</Badge><Badge>{CONFLICT_LABEL[c.kind]}</Badge></div>
                    <p className="mt-1 text-sm">{c.message}</p>
                    <p className="mt-1.5 text-sm font-medium">Suggested fix: {c.fix}</p>
                  </div>
                </div>
                <div className="p-4">
                  {unique.length > 1 && c.kind !== "recurring_conflict" && (
                    <fieldset className="mb-2"><legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Which event should move?</legend></fieldset>
                  )}
                  <ul className="divide-y divide-border">
                    {shown.map((e) => (
                      <EventRow key={e.id} ev={e} compact right={unique.length > 1 && c.kind !== "recurring_conflict" ? (
                        <label className="flex items-center gap-1.5 text-xs"><input type="radio" name={`move-${c.id}`} checked={target === e.id} onChange={() => setChoice((x) => ({ ...x, [c.id]: e.id }))} className="accent-[var(--primary)]" />Move this</label>
                      ) : undefined} />
                    ))}
                  </ul>
                  {c.kind === "recurring_conflict" && unique.length > 4 && <p className="mt-1 text-xs text-muted">+ {unique.length - 4} more occurrences</p>}
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    {c.severity === "warning" && !state.acknowledged.includes(c.id) && <Button variant="ghost" size="sm" onClick={() => ack(c, true)}><EyeOff aria-hidden />Acknowledge</Button>}
                    {state.acknowledged.includes(c.id) && <Button variant="ghost" size="sm" onClick={() => ack(c, false)}><Eye aria-hidden />Reopen</Button>}
                    {targetEv && can("editEvent") && <Button variant="outline" size="sm" onClick={() => openEdit(targetEv)}><Pencil aria-hidden />{c.kind === "recurring_conflict" ? "Edit series" : "Edit manually"}</Button>}
                    {targetEv && c.kind !== "recurring_conflict" && <Button size="sm" onClick={() => setMoving({ ev: targetEv, reason: c.message })}><Sparkles aria-hidden />Compare alternatives</Button>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <CompareAlternativesDialog event={moving?.ev ?? null} open={!!moving} onClose={() => setMoving(null)} reason={moving?.reason} />
    </div>
  );
}
