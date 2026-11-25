import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarPlus, ChevronLeft, MapPin, MoreVertical, Plus, Share, Sparkles } from "lucide-react";
import { Honesty, PageHeader, Section } from "@/components/site/blocks";
import { ButtonLink } from "@/components/ui/button";
import { withBase } from "@/lib/utils";

export const metadata: Metadata = { title: "Interactive prototypes", description: "Guide to the SportSync interactive prototype and its cross-platform conventions." };

const tour = [
  ["/demo/", "Dashboard", "Role-aware overview: alerts, pending RSVPs, venue availability."],
  ["/demo/calendar/", "Calendar", "Day (by venue), week, month and list views with filters; click an empty slot to create."],
  ["/demo/assistant/", "AI assistant", "Natural-language scheduling with explanation, editing, approval and undo (simulated AI)."],
  ["/demo/conflicts/", "Conflicts", "Ten conflict types, compare alternatives, postponed-game queue."],
  ["/demo/attendance/", "RSVP & attendance", "Expected attendance, reminders, attendance tracking; switch to Parent to RSVP."],
  ["/demo/teams/", "Teams", "Rosters, availability and share links."],
  ["/demo/venues/", "Venues", "Directory, booking calendar, maintenance and closures."],
  ["/demo/schedule-tools/", "Import / export / share", "CSV import with validation, CSV and .ics export."],
  ["/demo/sync/", "Calendar sync", "Real .ics + add-to-calendar links; simulated OAuth sync."],
  ["/demo/notifications/", "Notifications", "History, push/SMS/email previews, preferences."],
  ["/demo/settings/", "Settings & history", "Rules, revision history with restore, offline simulation, permissions matrix."],
  ["/demo/onboarding/", "Onboarding", "Five-step setup."],
  ["/demo/states/", "UI states", "Loading, empty, error, offline, permission and confirmation states."],
];

function Phone({ os, children }: { os: string; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col items-center">
      <div className={`relative w-[260px] overflow-hidden border-[10px] border-[#1c2129] bg-white text-slate-900 shadow-xl ${os === "iOS" ? "rounded-[2.6rem]" : "rounded-[1.8rem]"}`} style={{ height: 520 }}>
        {os === "iOS" ? <div className="mx-auto mt-1.5 h-5 w-24 rounded-full bg-[#1c2129]" aria-hidden /> : <div className="mx-auto mt-2 size-3 rounded-full bg-[#1c2129]" aria-hidden />}
        {children}
      </div>
      <figcaption className="mt-3 text-sm font-semibold">{os}</figcaption>
    </figure>
  );
}

function EventBody({ fab }: { fab?: boolean }) {
  return (
    <div className="px-4 text-[12px]">
      <p className="mt-2 inline-block rounded-full bg-[#e1f2ec] px-2 py-0.5 text-[10px] font-semibold text-[#0b6e5b]">Game</p>
      <p className="mt-1.5 text-[18px] font-bold leading-tight">Hawks vs Comets</p>
      <p className="mt-1 text-slate-600">Saturday · 9:00 – 10:15 AM</p>
      <p className="flex items-center gap-1 text-slate-600"><MapPin className="size-3" aria-hidden />Riverbend CC · Court A</p>
      <div className="mt-3 rounded-xl bg-[#fdeceb] p-2.5 text-[11px] text-[#b42318]"><strong>Coach unavailable.</strong> Jordan Reyes: work shift until 11:00.</div>
      <p className="mt-3 font-semibold">Your RSVP</p>
      <div className="mt-1 grid grid-cols-3 gap-1.5">{["Going", "Maybe", "Can't go"].map((l, i) => <span key={l} className={`rounded-lg border py-1.5 text-center font-semibold ${i === 0 ? "border-[#15803d] bg-[#15803d] text-white" : "border-slate-300"}`}>{l}</span>)}</div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><span className="block h-full w-3/5 bg-[#15803d]" /></div>
      <p className="mt-1 text-[10px] text-slate-500">9 attending · 2 maybe · 5 pending</p>
      {fab && <span className="absolute bottom-16 right-4 flex size-12 items-center justify-center rounded-2xl bg-[#0b6e5b] text-white shadow-lg"><CalendarPlus className="size-5" aria-hidden /></span>}
    </div>
  );
}

export default function PrototypesPage() {
  return (
    <>
      <PageHeader eyebrow="SportSync · Prototype" title="Interactive prototypes"
        intro="The high-fidelity prototype is a working web app with fictional data. No account needed: open it, switch roles, and break things. Everything can be undone.">
        <div className="flex flex-wrap gap-3"><ButtonLink href="/demo/" size="lg"><Sparkles aria-hidden />Open the prototype</ButtonLink><ButtonLink href="/demo/onboarding/" size="lg" variant="outline">Start with onboarding</ButtonLink></div>
      </PageHeader>
      <div className="container-page">
        <Section id="tour" title="Guided tour" intro="Suggested five-minute path: Dashboard → AI assistant (approve the example) → Conflicts (compare alternatives) → switch role to Parent → RSVP → Calendar sync (.ics).">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tour.map(([h, t, d], i) => (
              <li key={h}><Link href={h} className="card flex h-full gap-3 p-4 hover:border-border-strong"><span className="font-[family-name:var(--font-display)] text-lg font-semibold text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span><span><span className="flex items-center gap-1 font-semibold">{t}<ArrowUpRight className="size-3.5 text-muted" aria-hidden /></span><span className="text-sm text-muted">{d}</span></span></Link></li>
            ))}
          </ol>
        </Section>

        <Section id="mobile" title="Mobile prototype" intro="The same app, running at phone width below. It uses the bottom tab bar, list-first calendar and stacked cards.">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
            <div className="overflow-hidden rounded-[2.6rem] border-[10px] border-[#1c2129] shadow-2xl">
              <iframe src={withBase("/demo/")} title="SportSync mobile prototype" className="block h-[760px] w-[375px] max-w-[calc(100vw-4rem)] bg-bg" loading="lazy" />
            </div>
            <div className="max-w-md space-y-3 text-sm text-muted">
              <p><strong className="text-text">Tip:</strong> tap <em>More</em> for every screen, or the round <em>+</em> to create an event.</p>
              <p>Data entered here is shared with the full-size prototype in this browser.</p>
              <ButtonLink href="/demo/" variant="outline">Open full screen</ButtonLink>
            </div>
          </div>
        </Section>

        <Section id="platforms" title="One product, three platforms" intro="Shared structure, content and tokens; platform-appropriate navigation, controls and gestures. Shown with the same Event detail + RSVP screen.">
          <div className="grid justify-items-center gap-8 md:grid-cols-3">
            <Phone os="iOS">
              <div className="flex items-center justify-between px-3 pt-2 text-[13px] text-[#0b6e5b]"><span className="flex items-center"><ChevronLeft className="size-4" aria-hidden />Schedule</span><Share className="size-4" aria-hidden /></div>
              <EventBody />
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-5 border-t border-slate-200 bg-white/95 pb-4 pt-1.5 text-center text-[9px] text-slate-500">{["Home", "Calendar", "+", "Conflicts", "More"].map((l) => <span key={l} className={l === "Calendar" ? "font-semibold text-[#0b6e5b]" : ""}>{l === "+" ? <span className="mx-auto flex size-7 items-center justify-center rounded-full bg-[#0b6e5b] text-white"><Plus className="size-4" aria-hidden /></span> : l}</span>)}</div>
            </Phone>
            <Phone os="Android">
              <div className="flex items-center gap-3 bg-[#f0f1ec] px-3 py-3 text-[14px]"><ChevronLeft className="size-5" aria-hidden /><span className="flex-1 font-medium">Event</span><MoreVertical className="size-4" aria-hidden /></div>
              <EventBody fab />
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-4 bg-[#f0f1ec] pb-3 pt-2 text-center text-[9px] text-slate-600">{["Home", "Calendar", "Conflicts", "More"].map((l) => <span key={l} className="flex flex-col items-center gap-0.5"><span className={`h-6 w-12 rounded-full ${l === "Calendar" ? "bg-[#c9e8de]" : ""}`} aria-hidden />{l}</span>)}</div>
            </Phone>
            <figure className="flex w-full max-w-[320px] flex-col items-center">
              <div className="w-full overflow-hidden rounded-xl border border-border bg-white text-slate-900 shadow-xl" style={{ height: 520 }}>
                <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2"><span className="size-2 rounded-full bg-slate-300" /><span className="size-2 rounded-full bg-slate-300" /><span className="size-2 rounded-full bg-slate-300" /></div>
                <div className="relative m-4 rounded-xl border border-slate-200 shadow"><div className="border-b border-slate-200 px-4 py-2 text-[13px] font-semibold">Event detail <span className="float-right text-slate-400">✕</span></div><EventBody /><div className="flex justify-end gap-1.5 p-3 text-[10px]"><span className="rounded-md border border-slate-300 px-2 py-1">Reschedule</span><span className="rounded-md bg-[#0b6e5b] px-2 py-1 text-white">Edit</span></div></div>
              </div>
              <figcaption className="mt-3 text-sm font-semibold">Web</figcaption>
            </figure>
          </div>
          <div className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">Pattern</th><th className="p-3">Shared</th><th className="p-3">iOS</th><th className="p-3">Android</th><th className="p-3">Web</th></tr></thead>
              <tbody>{[
                ["Primary navigation", "Same 5 destinations & order", "Tab bar, central create", "Navigation bar with active indicator", "Left sidebar + top bar"],
                ["Create event", "Same form fields & validation", "Modal sheet with Cancel / Add", "FAB → full-screen dialog", "Centered dialog"],
                ["Back / dismiss", "Unsaved-change protection", "Swipe back, chevron + title", "System back, up arrow", "Esc, close button"],
                ["Destructive actions", "Same copy & consequence", "Action sheet", "Dialog with text buttons", "Confirm dialog"],
                ["Date & time input", "Same constraints (15-min steps)", "Wheel / inline picker", "Material date & time pickers", "Native inputs"],
                ["Notifications", "Same types & preferences", "APNs, grouped by team", "FCM channels per type", "In-app + email"],
                ["Typography", "Same scale & tokens", "SF Pro rendering allowed", "Roboto rendering allowed", "Inter / Space Grotesk"],
              ].map((r) => <tr key={r[0]} className="border-t border-border">{r.map((c, i) => <td key={i} className={`p-3 ${i === 0 ? "font-medium" : "text-muted"}`}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="mt-6"><Honesty><strong>Native apps not built.</strong> The mobile experience is the responsive web prototype plus these platform specifications. A separate Expo / React Native prototype is listed as pending in TASKS.md.</Honesty></div>
        </Section>
      </div>
    </>
  );
}
