"use client";

import { useState } from "react";
import { AlertTriangle, Bell, CalendarDays, CalendarPlus, Check, Loader2, Menu, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, Checkbox, ConfirmDialog, Dialog, EmptyState, Field, Input, Select, Skeleton, Stat, Switch, Tabs, Textarea, Tooltip } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

function Spec({ name, children, note }: { name: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-baseline justify-between gap-2"><p className="font-semibold">{name}</p>{note && <p className="text-xs text-muted">{note}</p>}</div>
      {children}
    </div>
  );
}

export function LiveComponents() {
  const [tab, setTab] = useState("week");
  const [sw, setSw] = useState(true);
  const [dlg, setDlg] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "maybe" | "no" | null>("yes");
  const [loading, setLoading] = useState(false);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Spec name="Buttons" note="primary · secondary · outline · ghost · danger · accent · link">
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button><Button variant="accent">Accent</Button><Button variant="link">Link</Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button size="sm"><Plus aria-hidden />Small</Button><Button size="lg">Large</Button><Button size="icon" variant="outline" aria-label="Notifications"><Bell /></Button><Button disabled>Disabled</Button>
          <Button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }} disabled={loading}>{loading ? <><Loader2 className="animate-spin" aria-hidden />Saving…</> : "Click: loading"}</Button>
        </div>
        <p className="mt-3 text-xs text-muted">States: default, hover, focus-visible (2px ring), active, disabled (50% opacity, no pointer), loading (spinner + label). Min target 32px (sm) / 40px (md).</p>
      </Spec>

      <Spec name="Form elements" note="label · hint · error · disabled">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Event name" htmlFor="ds-1" hint="Shown to families"><Input id="ds-1" placeholder="Hawks vs Comets" /></Field>
          <Field label="Venue" htmlFor="ds-2" error="Choose a venue."><Select id="ds-2" aria-invalid defaultValue=""><option value="">Choose…</option><option>Court A</option></Select></Field>
          <Field label="Date" htmlFor="ds-3"><Input id="ds-3" type="date" /></Field>
          <Field label="Disabled" htmlFor="ds-4"><Input id="ds-4" disabled value="Read only" /></Field>
        </div>
        <div className="mt-3"><Field label="Notes" htmlFor="ds-5"><Textarea id="ds-5" className="min-h-16" /></Field></div>
        <div className="mt-3 flex flex-wrap items-center gap-5"><Checkbox label="Repeat weekly" defaultChecked /><label className="flex items-center gap-2 text-sm"><Switch checked={sw} onChange={setSw} label="Notify families" />Notify families</label></div>
      </Spec>

      <Spec name="Tabs / segmented control" note="Arrow keys move between tabs">
        <Tabs label="Calendar view" value={tab} onChange={setTab} tabs={[{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }, { id: "list", label: "List", count: 12 }]} />
      </Spec>

      <Spec name="Badges & status indicators">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge><Badge tone="primary">Primary</Badge><Badge tone="info">Recurring</Badge><Badge tone="success"><Check aria-hidden />Confirmed</Badge><Badge tone="warning">Postponed</Badge><Badge tone="danger">Cancelled</Badge><Badge tone="accent"><Sparkles aria-hidden />Simulated AI</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
          {[["bg-ev-game", "Game"], ["bg-ev-practice", "Practice"], ["bg-ev-tournament", "Tournament"], ["bg-ev-meeting", "Meeting"]].map(([c, l]) => <span key={l} className="inline-flex items-center gap-1.5"><span className={`size-2.5 rounded-full ${c}`} aria-hidden />{l}</span>)}
        </div>
        <p className="mt-3 text-xs text-muted">Color is never the only signal: every status pairs color with an icon or label.</p>
      </Spec>

      <Spec name="Alerts">
        <div className="space-y-2">
          <Alert tone="info" title="Simulated AI">Proposals come from a rule-based engine.</Alert>
          <Alert tone="success" title="No conflicts found" />
          <Alert tone="warning" title="3 of 8 players unavailable">Confirm the team still has enough players.</Alert>
          <Alert tone="danger" title="Court A double-booked" action={<Button size="sm" variant="outline">Fix</Button>}>Clinic overlaps Hawks practice.</Alert>
        </div>
      </Spec>

      <Spec name="Calendar components" note="Event chip · time block · conflict state">
        <div className="space-y-1.5">
          {[["border-l-ev-game", "9 am", "Hawks vs Comets", false], ["border-l-ev-practice", "5 pm", "Lynx practice", false], ["border-l-ev-tournament", "10 am", "Semifinal 1", false], ["border-l-ev-game", "12 pm", "Comets vs Vipers", true]].map(([c, t, l, conflict]) => (
            <div key={l as string} className={cn("flex items-center gap-1.5 rounded border-l-4 bg-surface-2 px-2 py-1 text-xs", c as string, conflict && "ring-2 ring-danger")}>
              {conflict && <AlertTriangle className="size-3 text-danger" aria-label="Conflict" />}<span className="tabular-nums text-muted">{t as string}</span><span className="font-medium">{l as string}</span>
            </div>
          ))}
          <div className="rounded border-l-4 border-l-ev-practice bg-surface-2 px-2 py-1 text-xs line-through opacity-60">5 pm Herons practice (cancelled)</div>
          <div className="rounded border-l-4 border-dashed border-l-ev-game bg-surface-2 px-2 py-1 text-xs opacity-70">10:30 Storm vs Herons (postponed)</div>
        </div>
      </Spec>

      <Spec name="Scheduling components" note="Conflict card · RSVP control · attendance bar">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex gap-2 bg-danger-soft p-3 text-sm"><AlertTriangle className="size-4 shrink-0 text-danger" aria-hidden /><div><p className="font-semibold">Insufficient rest</p><p className="text-xs">Comets get 1.8 hours between games. League minimum: 12 hours.</p></div></div>
          <div className="flex justify-end gap-2 p-2"><Button size="sm" variant="ghost">Acknowledge</Button><Button size="sm"><Sparkles aria-hidden />Compare alternatives</Button></div>
        </div>
        <div role="group" aria-label="RSVP" className="mt-4 inline-flex gap-1">
          {(["yes", "maybe", "no"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={rsvp === v} onClick={() => setRsvp(v)} className={cn("h-8 rounded-md border border-border-strong px-3 text-sm font-medium", rsvp === v && (v === "yes" ? "border-success bg-success text-white" : v === "maybe" ? "border-warning bg-warning text-white" : "border-danger bg-danger text-white"), "dark:aria-pressed:text-bg")}>{v === "yes" ? "Going" : v === "maybe" ? "Maybe" : "Can't go"}</button>
          ))}
        </div>
        <div className="mt-4"><div className="flex h-2 overflow-hidden rounded-full bg-surface-3"><span className="w-[55%] bg-success" /><span className="w-[12%] bg-warning" /><span className="w-[10%] bg-danger" /></div><p className="mt-1 text-xs text-muted">5 yes · 1 maybe · 1 no · 1 pending</p></div>
      </Spec>

      <Spec name="Cards & stats">
        <div className="grid grid-cols-2 gap-3"><Stat label="Open conflicts" value={7} tone="danger" sub="5 blocking" /><Stat label="RSVP rate" value="72%" tone="success" sub="next 7 days" /></div>
      </Spec>

      <Spec name="Table">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm"><thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-2">Player</th><th className="p-2">Availability</th><th className="p-2">RSVP</th></tr></thead>
            <tbody>{[["Ava Thompson", "Available", "success", "Attending"], ["Maya Patel", "Dentist", "warning", "Maybe"], ["Noah Garcia", "Available", "neutral", "No response"]].map(([n, a, t, r]) => <tr key={n} className="border-t border-border"><td className="p-2 font-medium">{n}</td><td className="p-2 text-muted">{a}</td><td className="p-2"><Badge tone={t as "success"}>{r}</Badge></td></tr>)}</tbody></table>
        </div>
      </Spec>

      <Spec name="Modals, confirmation & tooltip" note="Native <dialog>: focus trap, Esc to close">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setDlg(true)}>Open modal</Button>
          <Button variant="danger" onClick={() => setConfirm(true)}><Trash2 aria-hidden />Delete event</Button>
          <Tooltip content="Exports the current view as an .ics file"><Button variant="ghost" size="icon" aria-label="Export"><CalendarPlus /></Button></Tooltip>
        </div>
        <Dialog open={dlg} onClose={() => setDlg(false)} title="Example dialog" description="Titles are announced; focus returns to the trigger." footer={<><Button variant="outline" onClick={() => setDlg(false)}>Cancel</Button><Button onClick={() => setDlg(false)}>Save</Button></>}>
          <p className="text-sm text-muted">Dialogs are used for create/edit and comparisons so people keep their place in the calendar.</p>
        </Dialog>
        <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={() => undefined} tone="danger" confirmLabel="Delete" title="Delete this event?" body="This can be undone right after." />
      </Spec>

      <Spec name="Notification components">
        <ul className="divide-y divide-border rounded-lg border border-border">
          {[["Court A double-booked", "Clinic overlaps two practices.", false], ["Practice cancelled", "Harbor Herons practice is cancelled.", true]].map(([t, b, read]) => (
            <li key={t as string} className="flex gap-3 p-3"><span aria-hidden className={cn("mt-1.5 size-2 rounded-full", read ? "bg-transparent" : "bg-accent")} /><div><p className={cn("text-sm", !read && "font-semibold")}>{t as string}</p><p className="text-xs text-muted">{b as string}</p></div></li>
          ))}
        </ul>
      </Spec>

      <Spec name="Empty & loading">
        <EmptyState icon={<CalendarDays />} title="No games yet" body="Create one or import a CSV." />
        <div className="mt-3 space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-10" /></div>
      </Spec>

      <Spec name="Mobile components" note="Bottom navigation · FAB-style create · sheet handle">
        <div className="mx-auto w-64 overflow-hidden rounded-2xl border border-border">
          <div className="h-24 bg-surface-2 p-3 text-xs text-muted">Content</div>
          <div className="grid grid-cols-5 border-t border-border bg-surface text-[10px] font-medium text-muted">
            {["Home", "Calendar", "", "Conflicts", "More"].map((l, i) => i === 2 ? <span key={i} className="flex justify-center py-1"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-fg"><Plus className="size-4" aria-hidden /></span></span> : <span key={l} className={cn("flex flex-col items-center gap-0.5 py-2", i === 0 && "text-primary")}>{i === 4 ? <Menu className="size-4" aria-hidden /> : <CalendarDays className="size-4" aria-hidden />}{l}</span>)}
          </div>
        </div>
      </Spec>
    </div>
  );
}
