import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, Section } from "@/components/site/blocks";
import { traceability } from "@/content/delivery";

export const metadata: Metadata = { title: "Engineering handoff & QA", description: "SportSync requirements, user stories, API and data model, QA and traceability." };

const fr = [
  ["FR-1", "Event management", "Create, edit, duplicate, delete, cancel, postpone and restore events of type game, practice, tournament and meeting."],
  ["FR-2", "Recurring events", "Weekly recurrence by weekday with end date; edit scope this / following / all."],
  ["FR-3", "Conflict detection", "Detect venue double-booking, team overlap, coach/player unavailability, insufficient rest, closures, hours, maintenance, capacity and recurring conflicts on every change."],
  ["FR-4", "Alternatives", "Suggest ≥3 ranked conflict-free slots with reasons and trade-offs; confirm before applying."],
  ["FR-5", "AI-assisted generation", "Natural-language instruction → parsed constraints → proposal with explanation and stats."],
  ["FR-6", "Review & undo", "Edit rows, revise, approve, reject; undo and restorable revision history."],
  ["FR-7", "RSVP & attendance", "Yes / maybe / no / pending per player; guardians respond per child; expected attendance; reminders; attendance tracking."],
  ["FR-8", "Calendar", ".ics export (RFC 5545); add-to-calendar links; OAuth two-way sync (future)."],
  ["FR-9", "Import / export / share", "CSV import with row validation; CSV/.ics export; read-only share links."],
  ["FR-10", "Venues", "Directory, hours, capacity, equipment, restrictions, closures, maintenance, booking calendar."],
  ["FR-11", "Roles & permissions", "Six roles with action-level permissions and team scoping."],
  ["FR-12", "Notifications", "Typed notifications, per-type channel preferences, history."],
];
const nfr = [
  ["NFR-1", "Accessibility", "WCAG 2.2 AA: contrast, keyboard, focus visible, target size, labels, reduced motion."],
  ["NFR-2", "Performance", "Conflict check < 50 ms for a 300-event season on mid-range devices; LCP < 2.5 s."],
  ["NFR-3", "Responsiveness", "320 px → 1920 px without horizontal page scroll; mobile-first navigation below 1024 px."],
  ["NFR-4", "Reliability", "Offline read access; queued writes with conflict re-check on sync."],
  ["NFR-5", "Privacy & security", "Least-privilege roles; minors' data visible only to team staff and guardians; no PII in analytics."],
  ["NFR-6", "Explainability", "Every automated change shows its reason; nothing auto-publishes."],
  ["NFR-7", "Internationalisation", "Locale-aware dates/times, time zone stored per league, 24h/12h formats."],
];
const api = [
  ["GET", "/v1/leagues/{id}/events?from&to&team&venue&type&status", "List events (role-scoped)"],
  ["POST", "/v1/events", "Create event (returns conflicts[])"],
  ["PATCH", "/v1/events/{id}?scope=this|following|all", "Update event or series"],
  ["POST", "/v1/events/{id}/cancel | /postpone | /restore", "Lifecycle transitions with reason"],
  ["POST", "/v1/conflicts/check", "Validate a draft event without saving"],
  ["GET", "/v1/events/{id}/alternatives?days=14&limit=3", "Ranked alternative slots"],
  ["POST", "/v1/schedule-proposals", "Generate proposal from instruction"],
  ["POST", "/v1/schedule-proposals/{id}/approve | /reject", "Publish or discard"],
  ["PUT", "/v1/events/{id}/rsvps/{personId}", "Set RSVP (guardian or self)"],
  ["POST", "/v1/imports/csv (multipart)", "Validate & import"],
  ["GET", "/v1/calendars/{token}.ics", "Subscribable calendar feed"],
  ["GET", "/v1/revisions · POST /v1/revisions/{id}/restore", "History & restore"],
];
const tables = [
  ["leagues", "id, name, timezone, settings jsonb (min_rest_hours, availability_threshold)"],
  ["teams", "id, league_id, name, sport, age_group, color, coach_id"],
  ["people", "id, league_id, kind (coach|player|guardian|staff), name, user_id?"],
  ["team_members", "team_id, person_id, role (player|coach|assistant)"],
  ["guardianships", "guardian_id, player_id"],
  ["availability", "id, person_id, starts_at, ends_at, reason"],
  ["venues", "id, league_id, site, name, address, sports[], capacity, open_time, close_time, equipment[], restrictions[]"],
  ["venue_blocks", "id, venue_id, kind (closure|maintenance), starts_at, ends_at, reason"],
  ["series", "id, rule (RRULE), starts_on, until"],
  ["events", "id, league_id, series_id?, type, title, venue_id, starts_at, ends_at, status, status_reason, source, label, expected_attendance"],
  ["event_teams", "event_id, team_id"],
  ["rsvps", "event_id, person_id, status, responded_by, responded_at"],
  ["attendance", "event_id, person_id, present"],
  ["proposals", "id, league_id, prompt, parsed jsonb, events jsonb, explanation[], status, version, created_by"],
  ["notifications", "id, user_id, type, title, body, event_id?, channels[], sent_at, read_at"],
  ["notification_prefs", "user_id, type, channels[]"],
  ["revisions", "id, league_id, actor_id, label, diff jsonb, created_at"],
];

export default function EngineeringPage() {
  return (
    <>
      <PageHeader eyebrow="SportSync · Engineering collaboration" title="Engineering handoff & QA"
        intro="Requirements, data and API contracts, QA and a traceability matrix connecting user needs to screens, code and tests. Full documents are in the library." />
      <div className="container-page">
        <Section id="docs" title="Handoff documents">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[["Product requirements (PRD)", "prd"], ["User stories & acceptance criteria", "user-stories"], ["Component specifications", "component-specs"], ["API specification", "api-spec"], ["Database schema (SQL)", "database-schema"], ["Responsive & accessibility specs", "responsive-a11y-specs"], ["Edge cases", "edge-cases"], ["QA checklist & test cases", "qa-test-plan"], ["Bug report template", "bug-report-template"], ["Release checklist", "release-checklist"], ["Product backlog", "backlog"], ["Traceability matrix", "traceability"]].map(([t, s]) => <Link key={s} href={`/docs/${s}/`} className="card flex items-center justify-between gap-2 p-4 text-sm font-medium hover:border-border-strong">{t}<ArrowRight className="size-4 shrink-0 text-muted" aria-hidden /></Link>)}
          </div>
        </Section>
        <Section id="functional" title="Functional requirements">
          <div className="grid gap-3 md:grid-cols-2">{fr.map(([id, t, d]) => <div key={id} className="card p-4 text-sm"><p className="font-semibold"><span className="mr-2 font-mono text-xs text-accent">{id}</span>{t}</p><p className="mt-1 text-muted">{d}</p></div>)}</div>
        </Section>
        <Section id="nonfunctional" title="Non-functional requirements">
          <div className="grid gap-3 md:grid-cols-2">{nfr.map(([id, t, d]) => <div key={id} className="card p-4 text-sm"><p className="font-semibold"><span className="mr-2 font-mono text-xs text-accent">{id}</span>{t}</p><p className="mt-1 text-muted">{d}</p></div>)}</div>
        </Section>
        <Section id="stories" title="Sample user stories">
          <div className="grid gap-4 lg:grid-cols-3">
            {[["As a league admin, I want to see conflicts while I create an event, so that I never publish a double-booking.", ["Given a venue already booked 17:00–18:30, when I choose 17:30 at that venue, then a blocking conflict names both events within 300 ms.", "When I click “Find conflict-free times”, then 1–3 suggestions appear, each passing all rules.", "I can still save; the event then appears in Conflicts."]],
              ["As a parent of two children, I want to RSVP for each child separately, so that coaches know exactly who's coming.", ["Given Maya and Leo are on teams in the event, then I see one RSVP control per child.", "When I tap Going for Maya, then only Maya's RSVP changes and the coach's count updates.", "A toast confirms the change and offers Undo."]],
              ["As a league admin, I want to review an AI-generated tournament before publishing, so that I stay accountable for the schedule.", ["The proposal shows parsed constraints, stats and an explanation.", "Editing a row re-validates it; conflicting rows are highlighted and block approval.", "Approve adds all events in one revision that can be undone."]]].map(([s, ac]) => (
              <div key={s as string} className="card p-5 text-sm"><p className="font-semibold">{s as string}</p><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Acceptance criteria</p><ul className="mt-1 list-disc space-y-1 pl-5 text-muted">{(ac as string[]).map((a) => <li key={a}>{a}</li>)}</ul></div>
            ))}
          </div>
        </Section>
        <Section id="api" title="API specification (REST, summary)">
          <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[680px] text-sm"><thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">Method</th><th className="p-3">Endpoint</th><th className="p-3">Purpose</th></tr></thead>
            <tbody>{api.map(([m, e, p]) => <tr key={e} className="border-t border-border"><td className="p-3 font-mono text-xs font-semibold text-primary">{m}</td><td className="p-3 font-mono text-xs">{e}</td><td className="p-3 text-muted">{p}</td></tr>)}</tbody></table></div>
        </Section>
        <Section id="schema" title="Database schema (relational, summary)">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{tables.map(([t, c]) => <div key={t} className="card p-3"><p className="font-mono text-sm font-semibold">{t}</p><p className="mt-1 font-mono text-[11px] text-muted">{c}</p></div>)}</div>
        </Section>
        <Section id="traceability" title="Traceability matrix" intro="User need → requirement → design screen → implementation → QA test.">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[960px] text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">User need</th><th className="p-3">Requirement</th><th className="p-3">Design screen</th><th className="p-3">Implementation</th><th className="p-3">QA test</th></tr></thead>
              <tbody>{traceability.map((t) => <tr key={t.need} className="border-t border-border align-top"><td className="p-3 font-medium">{t.need}</td><td className="p-3">{t.req}</td><td className="p-3 text-muted">{t.screen}</td><td className="p-3 font-mono text-xs">{t.impl}</td><td className="p-3 text-muted">{t.test}</td></tr>)}</tbody>
            </table>
          </div>
        </Section>
      </div>
    </>
  );
}
