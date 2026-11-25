"use client";

import { useState } from "react";
import { CalendarRange, Loader2, RefreshCw, WifiOff } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import type { Action } from "@/lib/sportsync/permissions";
import { ACTION_LABEL } from "@/lib/sportsync/permissions";
import { Button } from "@/components/ui/button";
import { Alert, ConfirmDialog, EmptyState, Field, Input, Select, Skeleton, Switch } from "@/components/ui/primitives";
import { PageTitle, PermissionNotice } from "@/components/demo/shell";

function Section({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="card p-5" aria-label={title}>
      <h2 className="font-semibold">{title}</h2>
      <p className="mb-4 text-sm text-muted">{note}</p>
      {children}
    </section>
  );
}

export default function StatesPage() {
  const { offlineSim, setOfflineSim, toast } = useDemo();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [perm, setPerm] = useState<Action>("approveSchedule");
  const [failed, setFailed] = useState(true);
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle title="UI states gallery" sub="Every core screen handles these states. They are shown live here so reviewers can inspect them without hunting for edge cases." />
      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Loading" note="Skeletons match the final layout to avoid layout shift. Buttons show progress inline.">
          <div className="space-y-2" aria-busy="true"><Skeleton className="h-5 w-1/2" /><Skeleton className="h-14" /><Skeleton className="h-14" /></div>
          <Button className="mt-4" onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); toast("Schedule saved", "success"); }, 1400); }} disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" aria-hidden />Saving…</> : "Save schedule"}
          </Button>
        </Section>
        <Section title="Empty" note="Explains why it's empty and offers the next step.">
          <EmptyState icon={<CalendarRange />} title="No games scheduled yet" body="Create your first game, import a spreadsheet, or let the assistant draft a season." action={<Button size="sm">Create event</Button>} />
        </Section>
        <Section title="Error" note="Says what happened, why, and how to recover, without blaming the user.">
          {failed ? (
            <Alert tone="danger" title="We couldn't load the schedule" action={<Button size="sm" variant="outline" onClick={() => { setFailed(false); setTimeout(() => setFailed(true), 4000); }}><RefreshCw aria-hidden />Retry</Button>}>
              The connection timed out. Your saved changes are safe on this device.
            </Alert>
          ) : <Alert tone="success" title="Loaded">Schedule refreshed. (This example resets in a few seconds.)</Alert>}
          <div className="mt-4">
            <Field label="Event name" htmlFor="st-name" required error={touched && !name.trim() ? "Give the event a name, for example “Hawks vs Comets”." : undefined}>
              <Input id="st-name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={touched && !name.trim()} />
            </Field>
          </div>
        </Section>
        <Section title="Offline" note="Read-only data stays available; edits queue and sync on reconnect.">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <span className="flex items-center gap-2 text-sm font-medium"><WifiOff className="size-4" aria-hidden />Simulate offline</span>
            <Switch checked={offlineSim} onChange={setOfflineSim} label="Simulate offline" />
          </div>
          <p className="mt-2 text-xs text-muted">Turn it on, make a change anywhere, then turn it off to see the sync confirmation. The real browser offline event is also handled.</p>
        </Section>
        <Section title="Permission restriction" note="Explains who can do this and offers a path forward instead of hiding the feature.">
          <Select aria-label="Restricted action" value={perm} onChange={(e) => setPerm(e.target.value as Action)} className="mb-3">
            {(Object.keys(ACTION_LABEL) as Action[]).map((a) => <option key={a} value={a}>{ACTION_LABEL[a]}</option>)}
          </Select>
          <PermissionNotice action={perm} />
        </Section>
        <Section title="Confirmation" note="Destructive or high-impact actions confirm with a clear consequence and an undo afterwards.">
          <Button variant="danger" onClick={() => setConfirm(true)}>Cancel Saturday&apos;s games</Button>
          <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={() => toast("Example only: nothing was cancelled", "info")} tone="danger" confirmLabel="Cancel 5 games"
            title="Cancel 5 games on Saturday?" body="All 5 games will be marked cancelled and 80 families will be notified by push, SMS and email. You can restore them afterwards." />
        </Section>
      </div>
    </div>
  );
}
