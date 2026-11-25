"use client";

import { useState } from "react";
import { CalendarCheck, Calendar, CheckCircle2, Download, ExternalLink, KeyRound, Loader2, Mail, RefreshCw } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import { buildICS, downloadText, googleCalendarUrl, outlookCalendarUrl } from "@/lib/sportsync/ics";
import { fmtDay, fmtRange } from "@/lib/sportsync/dates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, Dialog, Select } from "@/components/ui/primitives";
import { PageTitle } from "@/components/demo/shell";

type Provider = "google" | "apple" | "outlook";
const PROVIDERS: { id: Provider; name: string; Icon: typeof Calendar; desc: string }[] = [
  { id: "google", name: "Google Calendar", Icon: Calendar, desc: "Two-way sync via Google Calendar API (OAuth 2.0)" },
  { id: "apple", name: "Apple Calendar", Icon: CalendarCheck, desc: "Subscribe to a webcal:// feed or import .ics" },
  { id: "outlook", name: "Outlook Calendar", Icon: Mail, desc: "Two-way sync via Microsoft Graph (OAuth 2.0)" },
];

export default function SyncPage() {
  const { visibleEvents, state, toast } = useDemo();
  const [connected, setConnected] = useState<Provider[]>([]);
  const [flow, setFlow] = useState<{ p: Provider; step: number } | null>(null);
  const [scope, setScope] = useState("mine");
  const upcoming = visibleEvents.filter((e) => new Date(e.end) > new Date() && e.status !== "cancelled").sort((a, b) => a.start.localeCompare(b.start));
  const events = scope === "games" ? upcoming.filter((e) => e.type === "game" || e.type === "tournament") : upcoming;
  const sample = upcoming[0];

  const startFlow = (p: Provider) => {
    setFlow({ p, step: 0 });
    setTimeout(() => setFlow((f) => (f ? { ...f, step: 1 } : f)), 900);
  };
  const finish = () => {
    if (!flow) return;
    setConnected((c) => [...new Set([...c, flow.p])]);
    toast(`${PROVIDERS.find((x) => x.id === flow.p)!.name} connected (simulated)`, "info");
    setFlow(null);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle title="Calendar sync" sub="Keep SportSync events in the calendars families already use." />
      <Alert tone="warning" title="What's real and what's simulated" className="mb-6">
        <p><strong>Real:</strong> .ics file downloads (RFC 5545) and one-click “add event” links for Google Calendar and Outlook.com.</p>
        <p><strong>Simulated:</strong> continuous two-way sync. It needs OAuth client credentials (Google Cloud / Microsoft Entra), a backend to store tokens, and a hosted feed URL. None of these are configured in this portfolio demo, and no account data is requested.</p>
      </Alert>

      <section aria-labelledby="ics-h" className="card mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 id="ics-h" className="flex items-center gap-2 font-semibold"><Download className="size-4" aria-hidden />Download an .ics file <Badge tone="success">Works now</Badge></h2>
            <p className="text-sm text-muted">Import into Apple Calendar, Google Calendar, Outlook, Proton, Fastmail and others.</p></div>
          <div className="flex flex-wrap gap-2">
            <Select aria-label="Events to include" value={scope} onChange={(e) => setScope(e.target.value)} className="w-auto"><option value="mine">All my upcoming events</option><option value="games">Games & tournaments only</option></Select>
            <Button onClick={() => { downloadText("sportsync.ics", buildICS(events, state, "SportSync · Riverbend YSL"), "text/calendar;charset=utf-8"); toast(`${events.length} events exported to .ics`, "info"); }}>Download ({events.length})</Button>
          </div>
        </div>
      </section>

      {sample && (
        <section aria-labelledby="one-h" className="card mb-6 p-5">
          <h2 id="one-h" className="font-semibold">Add a single event <Badge tone="success">Works now</Badge></h2>
          <p className="mt-1 text-sm text-muted">Example: {sample.title}, {fmtDay(sample.start)} {fmtRange(sample.start, sample.end)}. Opens the provider&apos;s own page in a new tab.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="inline-flex h-9 items-center gap-2 rounded-lg border border-border-strong px-3 text-sm font-medium hover:bg-surface-2" href={googleCalendarUrl(sample, state.venues.find((v) => v.id === sample.venueId))} target="_blank" rel="noreferrer">Google Calendar<ExternalLink className="size-3.5" aria-hidden /></a>
            <a className="inline-flex h-9 items-center gap-2 rounded-lg border border-border-strong px-3 text-sm font-medium hover:bg-surface-2" href={outlookCalendarUrl(sample, state.venues.find((v) => v.id === sample.venueId))} target="_blank" rel="noreferrer">Outlook.com<ExternalLink className="size-3.5" aria-hidden /></a>
            <Button variant="outline" size="sm" className="h-9" onClick={() => downloadText("event.ics", buildICS([sample], state), "text/calendar;charset=utf-8")}>Apple (.ics)</Button>
          </div>
        </section>
      )}

      <h2 className="mb-3 font-semibold">Continuous sync <Badge tone="warning">Simulated · requires credentials</Badge></h2>
      <div className="grid gap-3 md:grid-cols-3">
        {PROVIDERS.map(({ id, name, Icon, desc }) => {
          const on = connected.includes(id);
          return (
            <div key={id} className="card flex flex-col p-4">
              <Icon className="size-6" aria-hidden />
              <p className="mt-2 font-semibold">{name}</p>
              <p className="flex-1 text-sm text-muted">{desc}</p>
              {on ? (
                <div className="mt-3 space-y-2">
                  <p className="flex items-center gap-1.5 text-sm text-success"><CheckCircle2 className="size-4" aria-hidden />Connected (simulated) · {events.length} events</p>
                  <Button size="sm" variant="outline" onClick={() => { setConnected((c) => c.filter((x) => x !== id)); toast(`${name} disconnected`, "info"); }}>Disconnect</Button>
                </div>
              ) : <Button className="mt-3" variant="outline" onClick={() => startFlow(id)}><RefreshCw aria-hidden />Connect</Button>}
            </div>
          );
        })}
      </div>

      <Dialog open={!!flow} onClose={() => setFlow(null)} size="sm" title={`Connect ${PROVIDERS.find((p) => p.id === flow?.p)?.name ?? ""}`} description="Simulated OAuth consent flow">
        {flow?.step === 0 ? (
          <p className="flex items-center gap-2 text-sm"><Loader2 className="size-4 animate-spin" aria-hidden />Redirecting to the provider&apos;s sign-in page…</p>
        ) : (
          <div className="space-y-3 text-sm">
            <Alert tone="info" title="In production">You would now sign in on {flow?.p === "outlook" ? "login.microsoftonline.com" : flow?.p === "google" ? "accounts.google.com" : "appleid.apple.com"} and grant SportSync permission to create events in one dedicated “SportSync” calendar. SportSync never sees your password.</Alert>
            <p className="flex items-start gap-2 text-muted"><KeyRound className="mt-0.5 size-4 shrink-0" aria-hidden />Requested scope: <code>{flow?.p === "outlook" ? "Calendars.ReadWrite" : flow?.p === "google" ? "calendar.events" : "webcal subscription (read-only)"}</code></p>
            <div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={() => setFlow(null)}>Cancel</Button><Button onClick={finish}>Simulate “Allow”</Button></div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
