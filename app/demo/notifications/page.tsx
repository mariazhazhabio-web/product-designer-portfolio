"use client";

import { useState } from "react";
import { Bell, CheckCheck, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useDemo, DEFAULT_PREFS } from "@/lib/sportsync/store";
import type { AppNotification, Channel, NotificationType } from "@/lib/sportsync/types";
import { fmtDateTime, relativeTime } from "@/lib/sportsync/dates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState, Switch, Tabs } from "@/components/ui/primitives";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/demo/shell";
import { cn } from "@/lib/utils";

const NOTIF_LABEL: Record<NotificationType, string> = {
  new_event: "New events", schedule_change: "Schedule changes", cancellation: "Cancellations", venue_change: "Venue changes",
  upcoming_game: "Upcoming game reminders", rsvp_reminder: "RSVP reminders", conflict: "Schedule conflicts", ai_recommendation: "AI recommendations",
};
const CH: { id: Channel; label: string; Icon: typeof Mail }[] = [{ id: "push", label: "Push", Icon: Smartphone }, { id: "sms", label: "SMS", Icon: MessageSquare }, { id: "email", label: "Email", Icon: Mail }];

function Previews({ n }: { n: AppNotification }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <figure>
        <figcaption className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Push (lock screen)</figcaption>
        <div className="rounded-[1.6rem] bg-gradient-to-br from-slate-700 to-slate-900 p-3">
          <div className="rounded-2xl bg-white/85 p-3 text-slate-900 backdrop-blur">
            <p className="flex items-center justify-between text-[11px] font-semibold uppercase text-slate-500"><span>SportSync</span><span>now</span></p>
            <p className="mt-1 text-sm font-semibold">{n.title}</p>
            <p className="text-xs">{n.body}</p>
          </div>
        </div>
      </figure>
      <figure>
        <figcaption className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">SMS</figcaption>
        <div className="rounded-2xl border border-border bg-surface-2 p-3">
          <p className="mb-2 text-center text-[11px] text-muted">Text message · SportSync</p>
          <p className="max-w-[90%] rounded-2xl rounded-bl-sm bg-surface-3 px-3 py-2 text-xs">{n.title}: {n.body.slice(0, 120)} Reply STOP to opt out.</p>
        </div>
      </figure>
      <figure>
        <figcaption className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Email</figcaption>
        <div className="overflow-hidden rounded-xl border border-border bg-white text-slate-900">
          <div className="bg-[#0b6e5b] px-3 py-2 text-xs font-semibold text-white">SportSync · Riverbend YSL</div>
          <div className="space-y-2 p-3 text-xs">
            <p className="text-sm font-semibold">{n.title}</p>
            <p>{n.body}</p>
            <span className="inline-block rounded-md bg-[#0b6e5b] px-3 py-1.5 font-semibold text-white">View in SportSync</span>
            <p className="text-[10px] text-slate-500">Manage notification preferences · Unsubscribe</p>
          </div>
        </div>
      </figure>
    </div>
  );
}

export default function NotificationsPage() {
  const { state, update, commit } = useDemo();
  const [tab, setTab] = useState("all");
  const [sel, setSel] = useState<string | null>(state.notifications[0]?.id ?? null);
  const list = state.notifications.filter((n) => tab === "all" || (tab === "unread" ? !n.read : n.type === tab));
  const selected = state.notifications.find((n) => n.id === sel);
  const unread = state.notifications.filter((n) => !n.read).length;
  const markAll = () => update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  const open = (n: AppNotification) => { setSel(n.id); if (!n.read) update((s) => ({ ...s, notifications: s.notifications.map((x) => (x.id === n.id ? { ...x, read: true } : x)) })); };
  const togglePref = (t: NotificationType, c: Channel) => commit(`Changed ${NOTIF_LABEL[t].toLowerCase()} via ${c}`, (s) => {
    const cur = s.prefs[t] ?? [];
    return { ...s, prefs: { ...s.prefs, [t]: cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c] } };
  });

  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="Notifications" sub="History of everything SportSync sent, previews per channel, and your delivery preferences. Delivery is simulated; no real email, SMS or push is sent."
        actions={unread > 0 ? <Button variant="outline" onClick={markAll}><CheckCheck aria-hidden />Mark all read</Button> : undefined} />
      <Tabs label="Filter notifications" value={tab} onChange={setTab} className="mb-4" size="sm"
        tabs={[{ id: "all", label: "All", count: state.notifications.length }, { id: "unread", label: "Unread", count: unread }, { id: "schedule_change", label: "Changes" }, { id: "cancellation", label: "Cancellations" }, { id: "conflict", label: "Conflicts" }, { id: "rsvp_reminder", label: "RSVP" }, { id: "ai_recommendation", label: "AI" }]} />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card>
          {list.length === 0 ? <CardBody><EmptyState icon={<Bell />} title="You're all caught up" body="New notifications appear here." /></CardBody> : (
            <ul className="max-h-[560px] divide-y divide-border overflow-y-auto">
              {list.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => open(n)} className={cn("flex w-full gap-3 p-3.5 text-left hover:bg-surface-2", sel === n.id && "bg-primary-soft")}>
                    <span aria-hidden className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-accent")} />
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate text-sm", !n.read && "font-semibold")}>{n.title}</span>
                      <span className="line-clamp-2 text-xs text-muted">{n.body}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-subtle">{relativeTime(n.at)} · <Badge className="px-1.5 py-0 text-[10px]">{NOTIF_LABEL[n.type]}</Badge>{!n.read && <span className="sr-only">Unread</span>}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <div className="space-y-6">
          {selected && (
            <Card>
              <CardHeader><div><CardTitle>{selected.title}</CardTitle><p className="text-xs text-muted">{fmtDateTime(selected.at)} · sent via {selected.channels.length ? selected.channels.join(", ") : "in-app only (all channels off)"}</p></div></CardHeader>
              <CardBody><Previews n={selected} /></CardBody>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle>Notification preferences</CardTitle><Button size="sm" variant="ghost" onClick={() => commit("Reset notification preferences", (s) => ({ ...s, prefs: DEFAULT_PREFS }))}>Reset</Button></CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-sm">
                  <thead><tr className="border-b border-border text-left text-xs text-muted"><th className="py-2 font-medium">Notify me about</th>{CH.map(({ id, label, Icon }) => <th key={id} className="py-2 text-center font-medium"><span className="inline-flex items-center gap-1"><Icon className="size-3.5" aria-hidden />{label}</span></th>)}</tr></thead>
                  <tbody>
                    {(Object.keys(NOTIF_LABEL) as NotificationType[]).map((t) => (
                      <tr key={t} className="border-b border-border last:border-0">
                        <td className="py-2.5">{NOTIF_LABEL[t]}</td>
                        {CH.map(({ id, label }) => <td key={id} className="py-2.5 text-center"><span className="inline-flex"><Switch checked={state.prefs[t]?.includes(id) ?? false} onChange={() => togglePref(t, id)} label={`${NOTIF_LABEL[t]} by ${label}`} /></span></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted">Cancellations and same-day changes default to every channel because missing them has the highest cost for families.</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
