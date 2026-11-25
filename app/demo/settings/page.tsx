"use client";

import { useState } from "react";
import { History, RotateCcw, Undo2, WifiOff } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import type { Role } from "@/lib/sportsync/types";
import { ROLE_LABEL, PERMISSIONS, ACTION_LABEL, type Action } from "@/lib/sportsync/permissions";
import { fmtDateTime } from "@/lib/sportsync/dates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog, Field, Input, Select, Switch } from "@/components/ui/primitives";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/demo/shell";

export default function SettingsPage() {
  const { state, update, commit, revisions, restore, undo, canUndo, reset, offlineSim, setOfflineSim, user } = useDemo();
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="Settings & revision history" sub="Scheduling rules, demo controls, the permissions matrix and a full, restorable change history." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardBody className="space-y-3 text-sm">
              <p><span className="font-semibold">{user.name}</span> · {user.title}</p>
              <Field label="View the demo as" htmlFor="set-role">
                <Select id="set-role" value={state.role} onChange={(e) => update((s) => ({ ...s, role: e.target.value as Role }))}>{(Object.keys(ROLE_LABEL) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</Select>
              </Field>
              <p className="text-xs text-muted">Time zone: {state.settings.timezone} (from your device). All demo times are local.</p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader><CardTitle>Scheduling rules</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <Field label="Minimum rest between games (hours)" htmlFor="rest" hint="Games for the same team closer than this are flagged as insufficient rest.">
                <Input id="rest" type="number" min={0} max={48} value={state.settings.minRestHours} onChange={(e) => commit(`Set minimum rest to ${e.target.value}h`, (s) => ({ ...s, settings: { ...s.settings, minRestHours: Math.max(0, Math.min(48, Number(e.target.value) || 0)) } }))} className="w-28" />
              </Field>
              <Field label="Treat player unavailability as blocking above (%)" htmlFor="thr" hint="Below this share of the roster it is a warning; above, an error.">
                <Input id="thr" type="number" min={10} max={100} step={5} value={Math.round(state.settings.playerUnavailableThreshold * 100)} onChange={(e) => commit("Changed player availability threshold", (s) => ({ ...s, settings: { ...s.settings, playerUnavailableThreshold: Math.max(0.1, Math.min(1, (Number(e.target.value) || 40) / 100)) } }))} className="w-28" />
              </Field>
            </CardBody>
          </Card>
          <Card>
            <CardHeader><CardTitle>Demo controls</CardTitle></CardHeader>
            <CardBody className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3"><div><p className="flex items-center gap-1.5 font-medium"><WifiOff className="size-4" aria-hidden />Simulate offline mode</p><p className="text-xs text-muted">Shows the offline banner; changes are queued then “synced”.</p></div><Switch checked={offlineSim} onChange={setOfflineSim} label="Simulate offline mode" /></div>
              <div className="flex items-center justify-between gap-3"><div><p className="font-medium">Show onboarding banner again</p></div><Button size="sm" variant="outline" onClick={() => update((s) => ({ ...s, onboarded: false }))}>Show</Button></div>
              <div className="flex items-center justify-between gap-3"><div><p className="font-medium">Reset all demo data</p><p className="text-xs text-muted">Restores the original sample league, including planted conflicts.</p></div><Button size="sm" variant="danger" onClick={() => setConfirmReset(true)}><RotateCcw aria-hidden />Reset</Button></div>
            </CardBody>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><History className="size-4" aria-hidden />Revision history</CardTitle>{canUndo && <Button size="sm" variant="outline" onClick={undo}><Undo2 aria-hidden />Undo last</Button>}</CardHeader>
            <CardBody>
              <ol className="max-h-96 space-y-1 overflow-y-auto">
                {revisions.map((r, i) => (
                  <li key={r.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-2">
                    <span aria-hidden className={`size-2 rounded-full ${i === 0 ? "bg-primary" : "bg-border-strong"}`} />
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm">{r.label}</span><span className="text-xs text-muted">{fmtDateTime(r.at)}</span></span>
                    {i === 0 ? <Badge tone="primary">Current</Badge> : <Button size="sm" variant="ghost" onClick={() => restore(r.id)}>Restore</Button>}
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-xs text-muted">History is kept for this browser tab session (last 40 changes). Restoring is itself recorded, so nothing is lost.</p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader><CardTitle>Role-based access</CardTitle></CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-xs">
                  <thead><tr className="border-b border-border text-left text-muted"><th className="py-2 font-medium">Permission</th>{(Object.keys(ROLE_LABEL) as Role[]).map((r) => <th key={r} className="px-1 py-2 text-center font-medium">{ROLE_LABEL[r].split(" ")[0]}</th>)}</tr></thead>
                  <tbody>
                    {(Object.keys(PERMISSIONS) as Action[]).map((a) => (
                      <tr key={a} className="border-b border-border last:border-0">
                        <td className="py-1.5 capitalize">{ACTION_LABEL[a]}</td>
                        {(Object.keys(ROLE_LABEL) as Role[]).map((r) => <td key={r} className="text-center">{PERMISSIONS[a].includes(r) ? <span className="text-success" aria-label="Allowed">●</span> : <span className="text-subtle" aria-label="Not allowed">–</span>}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-muted">Coaches can edit only their own teams&apos; events. Parents RSVP on behalf of their children.</p>
            </CardBody>
          </Card>
        </div>
      </div>
      <ConfirmDialog open={confirmReset} onClose={() => setConfirmReset(false)} onConfirm={reset} tone="danger" confirmLabel="Reset demo" title="Reset all demo data?" body="All changes made in this browser (events, RSVPs, imports, approvals) will be replaced with the original sample league." />
    </div>
  );
}
