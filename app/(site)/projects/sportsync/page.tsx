import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Download, Sparkles } from "lucide-react";
import { withBase } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmpathyMap, FlowDiagram, Honesty, KeyValue, PersonaCard, Section, SitemapTree, TOC } from "@/components/site/blocks";
import { hypotheses, journey, moscow, objectives, personas, problemStatement, researchQuestions, rice } from "@/content/research";
import { flows, sitemap } from "@/content/architecture";
import { metrics, usability } from "@/content/delivery";

export const metadata: Metadata = { title: "SportSync case study", description: "End-to-end product design case study for SportSync, an AI-assisted sports scheduling concept." };

const toc = [
  ["overview", "Project overview"], ["challenge", "Product challenge"], ["role", "My role and contributions"], ["scope", "Project scope"], ["research", "Research plan"],
  ["hypotheses", "Pain-point hypotheses"], ["personas", "Personas"], ["journey", "User journey"], ["strategy", "Product strategy"], ["ia", "Information architecture"],
  ["flows", "User flows"], ["wireframes", "Wireframes"], ["exploration", "Design exploration"], ["hifi", "High-fidelity designs"], ["ai", "AI-assisted scheduling"],
  ["system", "Design system"], ["prototype", "Interactive prototype"], ["testing", "Usability testing plan"], ["handoff", "Engineering handoff"], ["metrics", "Proposed success metrics"],
  ["lessons", "Lessons learned"], ["future", "Future improvements"],
].map(([id, label]) => ({ id, label }));

function Shot({ src, alt, caption, notes }: { src: string; alt: string; caption: string; notes?: string[] }) {
  return (
    <figure className="card overflow-hidden">
      <img src={withBase(`/screens/${src}.png`)} alt={alt} loading="lazy" className="w-full border-b border-border bg-surface-2" />
      <figcaption className="p-4 text-sm">
        <p className="font-semibold">{caption}</p>
        {notes && <ol className="mt-2 space-y-1 text-muted">{notes.map((n, i) => <li key={n} className="flex gap-2"><span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">{i + 1}</span>{n}</li>)}</ol>}
      </figcaption>
    </figure>
  );
}

export default function SportSyncCaseStudy() {
  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Case study · Independent portfolio project</p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">SportSync</h1>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-primary">Smarter Scheduling. Stronger Teams.</p>
            <p className="mt-5 max-w-xl text-lg text-muted">Designing an explainable, AI-assisted scheduling experience that helps leagues publish conflict-free schedules and keeps every coach, parent and athlete in sync.</p>
            <div className="no-print mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/demo/" size="lg"><Sparkles aria-hidden />Try the prototype</ButtonLink>
              <ButtonLink href="/downloads/sportsync-case-study.pdf" size="lg" variant="outline" download><Download aria-hidden />PDF version</ButtonLink>
            </div>
          </div>
          <img src={withBase("/screens/assistant-desktop.png")} alt="SportSync AI assistant showing a generated tournament proposal with explanation" className="rounded-2xl border border-border shadow-card" />
        </div>
      </header>

      <div className="container-page grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto py-12"><TOC items={toc} /></div></aside>
        <article className="min-w-0">
          <Section id="overview" eyebrow="01" title="Project overview">
            <KeyValue items={[["Type", "Independent concept + working prototype"], ["Timeline", "Self-directed portfolio project, 2026"], ["Platforms", "Responsive web; iOS & Android patterns"], ["Status", "Prototype complete · research & testing pending"]]} />
            <p className="mt-6 max-w-3xl text-muted">SportSync is an original product concept I designed and built to demonstrate how I approach scheduling-heavy products. It covers the whole scheduling lifecycle (creating, generating, checking, changing, communicating and syncing schedules) with a working rule-based scheduling engine behind the interface.</p>
            <div className="mt-6"><Honesty><strong>Transparency note.</strong> SportSync is not affiliated with, commissioned by, or endorsed by any company, and does not use any company&apos;s proprietary interface or assets. Personas and pain points are hypotheses; no interviews or usability tests have been run yet. The AI is simulated with a deterministic engine. All data is fictional.</Honesty></div>
          </Section>

          <Section id="challenge" eyebrow="02" title="Product challenge">
            <blockquote className="rounded-xl border-l-4 border-primary bg-primary-soft p-5 text-lg">{problemStatement}</blockquote>
            <p className="mt-5 font-semibold">How might we…</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {["…prevent conflicts before a schedule is published, not after?", "…let admins trust a generated schedule enough to publish it?", "…make every change reach the right people in the channel they actually use?", "…give families a single, reliable answer to “where do we need to be?”"].map((x) => <li key={x} className="card p-4 text-sm">{x}</li>)}
            </ul>
          </Section>

          <Section id="role" eyebrow="03" title="My role and contributions">
            <div className="grid gap-4 md:grid-cols-3">
              {[["Product & UX", ["Problem framing and hypotheses", "Research plan, interview guide, survey", "Personas, journeys, JTBD, opportunity map", "IA, 9 user flows, decision trees"]], ["UI & systems", ["Visual identity and design tokens", "Component library with states", "28 screens across three fidelities", "Accessibility (WCAG 2.2 AA targets)"]], ["Build & handoff", ["Next.js + TypeScript prototype", "Rule-based scheduling & conflict engine", "PRD, API spec, DB schema, QA plan", "Unit + end-to-end tests"]]].map(([t, l]) => (
                <div key={t as string} className="card p-5"><p className="font-semibold">{t as string}</p><ul className="mt-2 space-y-1.5 text-sm text-muted">{(l as string[]).map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />{x}</li>)}</ul></div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">I worked solo, using AI coding assistance for implementation speed. Design decisions, content and verification are mine.</p>
          </Section>

          <Section id="scope" eyebrow="04" title="Project scope">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="card p-5"><p className="font-semibold">In scope</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted"><li>Scheduling dashboard, day/week/month/list calendars</li><li>Event lifecycle incl. recurring events and postponements</li><li>AI-assisted generation (simulated) with review & undo</li><li>Conflict detection & resolution</li><li>RSVP & attendance, venues, calendar sync, notifications</li><li>Six roles with permissions</li></ul></div>
              <div className="card p-5"><p className="font-semibold">Out of scope (for now)</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted"><li>Registration & payments</li><li>Messaging / chat</li><li>Live scoring & stats</li><li>Real OAuth calendar sync and real message delivery (require credentials)</li><li>Native iOS/Android builds (responsive web + platform guidelines instead)</li></ul></div>
            </div>
          </Section>

          <Section id="research" eyebrow="05" title="Research plan" intro="Research is planned and fully templated, ready to run. Nothing below is a finding yet.">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="card p-5"><p className="font-semibold">Objectives</p><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">{objectives.map((o) => <li key={o}>{o}</li>)}</ol></div>
              <div className="card p-5"><p className="font-semibold">Methods</p><ul className="mt-2 space-y-2 text-sm text-muted"><li><strong className="text-text">Semi-structured interviews</strong>: 10–12 across five roles (guide ready)</li><li><strong className="text-text">Survey</strong>: 10 questions, distributed via local leagues (questionnaire ready)</li><li><strong className="text-text">Competitive review</strong>: framework with 10 criteria</li><li><strong className="text-text">Concept testing</strong>: the prototype itself, then two usability rounds</li></ul></div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-5">{researchQuestions.map((r) => <div key={r.theme} className="rounded-xl bg-surface-2 p-4 text-sm"><p className="font-semibold">{r.theme}</p><p className="mt-1 text-muted">{r.qs[0]}</p></div>)}</div>
            <ButtonLink href="/research/" variant="link" className="mt-4">Full research kit<ArrowRight aria-hidden /></ButtonLink>
          </Section>

          <Section id="hypotheses" eyebrow="06" title="Customer pain-point hypotheses">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">ID</th><th className="p-3">Who</th><th className="p-3">We believe…</th><th className="p-3">How we&apos;ll know</th><th className="p-3">Status</th></tr></thead>
                <tbody>{hypotheses.map((h) => <tr key={h.id} className="border-t border-border align-top"><td className="p-3 font-semibold">{h.id}</td><td className="p-3">{h.who}</td><td className="p-3">{h.text}</td><td className="p-3 text-muted">{h.measure}</td><td className="p-3"><Badge tone="warning">{h.status}</Badge></td></tr>)}</tbody>
              </table>
            </div>
          </Section>

          <Section id="personas" eyebrow="07" title="Personas" intro="Five provisional personas to guide design until interviews replace them with evidence. Quotes are illustrative, not from real people.">
            <div className="grid gap-5 lg:grid-cols-2">{personas.slice(0, 2).map((p) => <PersonaCard key={p.id} p={p} />)}</div>
            <div className="mt-5 grid gap-5 lg:grid-cols-3">{personas.slice(2).map((p) => <EmpathyMap key={p.id} p={p} />)}</div>
            <ButtonLink href="/research/#personas" variant="link" className="mt-4">All personas, empathy maps & JTBD<ArrowRight aria-hidden /></ButtonLink>
          </Section>

          <Section id="journey" eyebrow="08" title="User journey" intro={`${journey.persona}. Emotion is scored 1 (frustrated) to 5 (confident).`}>
            <div className="overflow-x-auto">
              <div className="grid min-w-[760px] grid-cols-6 gap-2">
                {journey.stages.map((s) => (
                  <div key={s.stage} className="flex flex-col rounded-xl border border-border bg-surface p-3 text-xs">
                    <p className="font-semibold text-sm">{s.stage}</p>
                    <p className="mt-2 text-muted">{s.actions}</p>
                    <p className="mt-2 italic">“{s.thoughts}”</p>
                    <div className="mt-3 flex gap-0.5" role="img" aria-label={`Emotion ${s.emotion} of 5`}>{[1, 2, 3, 4, 5].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= s.emotion ? (s.emotion <= 2 ? "bg-danger" : "bg-warning") : "bg-surface-3"}`} />)}</div>
                    <p className="mt-3 rounded-md bg-primary-soft p-2 text-primary"><strong>Opportunity:</strong> {s.opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="strategy" eyebrow="09" title="Product strategy">
            <div className="grid gap-4 md:grid-cols-3">
              {[["Prevent, don't repair", "Every save runs the conflict engine. Problems surface while editing, with a one-click way to a free slot."], ["Explain every automated decision", "The assistant shows what it understood, why it chose each slot, fairness stats and what it skipped. Nothing publishes without approval, and everything can be undone."], ["Meet families where they are", "Push changes to the calendars and channels people already use; one-tap RSVP per child."]].map(([t, d]) => <div key={t} className="card p-5"><p className="font-semibold">{t}</p><p className="mt-2 text-sm text-muted">{d}</p></div>)}
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="card overflow-x-auto p-5"><p className="mb-3 font-semibold">RICE prioritisation (estimates, to validate)</p>
                <table className="w-full min-w-[420px] text-xs"><thead className="text-left text-muted"><tr><th className="py-1">Feature</th><th>R</th><th>I</th><th>C</th><th>E</th><th>Score</th></tr></thead><tbody>{rice.map((r) => <tr key={r.feature} className="border-t border-border"><td className="py-1.5 pr-2">{r.feature}</td><td>{r.reach}</td><td>{r.impact}</td><td>{r.confidence}</td><td>{r.effort}</td><td className="font-semibold">{r.score}</td></tr>)}</tbody></table>
              </div>
              <div className="card p-5"><p className="mb-3 font-semibold">MoSCoW</p>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">{(Object.entries(moscow) as [string, string[]][]).map(([k, v]) => <div key={k} className="rounded-lg bg-surface-2 p-3"><p className="font-semibold capitalize">{k === "wont" ? "Won't (now)" : k}</p><ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted">{v.map((x) => <li key={x}>{x}</li>)}</ul></div>)}</div>
              </div>
            </div>
          </Section>

          <Section id="ia" eyebrow="10" title="Information architecture" intro="Twelve top-level areas. The schedule is the spine; everything else either feeds it (assistant, import, venues, teams) or carries it outward (notifications, sync, sharing).">
            <SitemapTree node={sitemap} />
            <ButtonLink href="/architecture/" variant="link" className="mt-4">Navigation, role access map & feature hierarchy<ArrowRight aria-hidden /></ButtonLink>
          </Section>

          <Section id="flows" eyebrow="11" title="User flows" intro="Nine flows were mapped before UI design. Three are shown here; all nine, plus decision trees, are on the architecture page.">
            <div className="grid gap-5 xl:grid-cols-3">{flows.filter((f) => ["ai-schedule", "resolve-conflict", "rsvp"].includes(f.id)).map((f) => <FlowDiagram key={f.id} flow={f} />)}</div>
          </Section>

          <Section id="wireframes" eyebrow="12" title="Wireframes" intro="Each screen was sketched at low fidelity (structure only), refined at mid fidelity (real content, hierarchy), then built at high fidelity.">
            <div className="grid gap-4 md:grid-cols-3">
              {[["wf-lo", "Low fidelity", "Layout & priority. What must be visible without scrolling?"], ["wf-mid", "Mid fidelity", "Real copy, states and hierarchy, still grayscale"], ["dashboard-desktop", "High fidelity", "Tokens, color semantics, interaction"]].map(([s, t, d]) => (
                <figure key={t} className="card overflow-hidden"><img src={withBase(`/screens/${s}.png`)} alt={`${t} dashboard`} loading="lazy" className="aspect-[16/10] w-full border-b border-border object-cover object-top" /><figcaption className="p-4 text-sm"><p className="font-semibold">{t}</p><p className="text-muted">{d}</p></figcaption></figure>
              ))}
            </div>
            <ButtonLink href="/wireframes/" variant="link" className="mt-4">All 28 screens in three fidelities<ArrowRight aria-hidden /></ButtonLink>
          </Section>

          <Section id="exploration" eyebrow="13" title="Design exploration" intro="Real iterations from my own design reviews while building. These are self-review changes, not usability findings.">
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                ["Recurring conflicts", "Before: every overlapping occurrence of two weekly series listed separately, so one root cause produced 6+ alerts.", "After: grouped into one “Conflicting recurring events” card with the affected dates and an “Edit series” fix."],
                ["Practice planner behaviour", "Before: the assistant added practices alongside teams' existing practices, producing duplicated training days.", "After: it plans the next training block after the current series ends and explains that choice."],
                ["Conflict-check speed", "Before: checking every save against the whole season took ~300 ms, too slow for live validation while typing.", "After: a time-window pre-filter and string-based overlap test cut it to ~25 ms, so checks run on every keystroke."],
              ].map(([t, b, a]) => (
                <div key={t} className="card p-5 text-sm"><p className="font-semibold">{t}</p><p className="mt-3 rounded-lg bg-danger-soft p-3"><Badge tone="danger" className="mb-1">Before</Badge><br />{b}</p><p className="mt-2 rounded-lg bg-success-soft p-3"><Badge tone="success" className="mb-1">After</Badge><br />{a}</p></div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">Before/after comparisons from real users will be added after usability round 1 using the <Link className="text-info underline" href="/docs/iteration-report-template/">iteration report template</Link>.</p>
          </Section>

          <Section id="hifi" eyebrow="14" title="High-fidelity designs">
            <div className="grid gap-5 lg:grid-cols-2">
              <Shot src="dashboard-desktop" alt="Dashboard" caption="Dashboard: what needs attention first" notes={["Role-aware greeting and quick create", "Stats lead with open conflicts and pending RSVPs", "Venue availability bars show free vs booked time at a glance"]} />
              <Shot src="calendar-day-desktop" alt="Day calendar by venue" caption="Day view by venue, doubling as an availability board" notes={["One column per court or field; hatched areas show when a venue is closed", "Conflicts get a red ring and icon, announced to screen readers", "Click any empty slot to book that venue at that time"]} />
              <Shot src="conflicts-desktop" alt="Conflicts list" caption="Conflicts: cause, impact, fix" notes={["Plain-language message names the people, place and time", "User chooses which event should move", "Warnings can be acknowledged as known risks"]} />
              <Shot src="compare-desktop" alt="Compare alternatives dialog" caption="Compare alternatives before confirming" notes={["Three ranked, conflict-free options", "Reasons and trade-offs for each", "Confirmation shows before → after and who gets notified"]} />
            </div>
          </Section>

          <Section id="ai" eyebrow="15" title="AI-assisted scheduling experience" intro="The hardest design problem: making automation trustworthy enough to publish.">
            <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
              <Shot src="assistant-desktop" alt="AI assistant" caption="From instruction to reviewed proposal" notes={["“What I understood” chips expose the parsed constraints, so misreads are visible immediately", "“Why this schedule” explains format, fairness, and skipped slots", "Every row is editable and re-validated; approve, reject or revise in plain language"]} />
              <div className="space-y-3 text-sm">
                <div className="card p-5"><p className="font-semibold">Worked example (try it)</p><p className="mt-2 text-muted">“Create a basketball tournament schedule for eight teams over three weekends. Avoid overlapping games and schedule each team only once per day.”</p><p className="mt-2">A full round robin needs 7 match days but three weekends give 6, so the engine switches to <strong>two pools + crossover + semifinals + placement finals</strong>: 24 games, every team playing exactly once per day, and says why.</p></div>
                <div className="card p-5"><p className="font-semibold">Trust principles</p><ul className="mt-2 space-y-1.5 text-muted">{["Show understanding before results", "Explain trade-offs in the user's terms", "Human approval required; coaches can draft, admins publish", "Undo + revision history for every approval", "Label simulated AI clearly"].map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />{x}</li>)}</ul></div>
                <Honesty>The assistant is a <strong>rule-based simulation</strong>: a transparent parser plus a constraint-satisfaction scheduler. No language model or paid API is called. A live LLM could replace the parser while keeping the explainable scheduler.</Honesty>
              </div>
            </div>
          </Section>

          <Section id="system" eyebrow="16" title="Design system" intro="Semantic tokens (surface, text, primary, status, event types) drive light and dark themes. Components ship with hover, focus, disabled, error and loading states.">
            <img src={withBase("/screens/design-system.png")} alt="Design system page with color tokens and components" loading="lazy" className="w-full rounded-2xl border border-border" />
            <ButtonLink href="/design-system/" variant="link" className="mt-4">Explore the live design system<ArrowRight aria-hidden /></ButtonLink>
          </Section>

          <Section id="prototype" eyebrow="17" title="Interactive prototype">
            <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
              <img src={withBase("/screens/dashboard-mobile.png")} alt="Mobile dashboard" loading="lazy" className="mx-auto w-48 rounded-2xl border border-border" />
              <div>
                <p className="text-lg font-semibold">Everything in this case study works in the browser.</p>
                <p className="mt-2 text-sm text-muted">Switch between six roles, create and reschedule events, generate a tournament, resolve conflicts, RSVP as a parent, import a CSV, download real .ics files and undo any change. Data is saved in your browser only.</p>
                <div className="mt-4 flex flex-wrap gap-2"><ButtonLink href="/demo/"><Sparkles aria-hidden />Open prototype</ButtonLink><ButtonLink href="/prototypes/" variant="outline">Prototype guide & platform conventions</ButtonLink></div>
              </div>
            </div>
          </Section>

          <Section id="testing" eyebrow="18" title="Usability testing plan" intro="Ready to run. Results are pending until sessions take place.">
            <div className="grid gap-3 md:grid-cols-3">{usability.scenarios.map((s) => <div key={s.id} className="card p-4 text-sm"><p className="font-semibold">{s.id} · {s.title}</p><p className="mt-1 text-muted">{s.prompt}</p><p className="mt-2 text-xs"><strong>Target:</strong> {s.target}</p><Badge className="mt-2">Result: pending</Badge></div>)}</div>
            <ButtonLink href="/usability/" variant="link" className="mt-4">Moderator script, SUS, observation sheet<ArrowRight aria-hidden /></ButtonLink>
          </Section>

          <Section id="handoff" eyebrow="19" title="Engineering handoff">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[["PRD", "/docs/prd/"], ["User stories & acceptance criteria", "/docs/user-stories/"], ["API specification", "/docs/api-spec/"], ["Database schema", "/docs/database-schema/"], ["Component specs", "/docs/component-specs/"], ["QA checklist & test cases", "/docs/qa-test-plan/"], ["Traceability matrix", "/engineering/#traceability"], ["Product backlog", "/docs/backlog/"]].map(([t, h]) => <Link key={t} href={h} className="card flex items-center justify-between p-4 text-sm font-medium hover:border-border-strong">{t}<ArrowRight className="size-4 text-muted" aria-hidden /></Link>)}
            </div>
            <p className="mt-4 text-sm text-muted">The prototype includes automated unit tests for the scheduling engine and Playwright end-to-end tests for the main workflows.</p>
          </Section>

          <Section id="metrics" eyebrow="20" title="Proposed success metrics">
            <div className="grid gap-3 md:grid-cols-2">{metrics.slice(0, 6).map((m) => <div key={m.name} className="card p-4 text-sm"><div className="flex items-start justify-between gap-2"><p className="font-semibold">{m.name}</p><Badge tone="primary">{m.target}</Badge></div><p className="mt-1 text-muted">{m.why}</p></div>)}</div>
            <ButtonLink href="/metrics/" variant="link" className="mt-4">Analytics dashboard (demonstration data)<ArrowRight aria-hidden /></ButtonLink>
          </Section>

          <Section id="lessons" eyebrow="21" title="Lessons learned">
            <ul className="grid gap-3 md:grid-cols-2">
              {["Explainability is a feature, not a footnote. Designing the “why” panel changed the scheduler itself: if a choice couldn't be explained, the rule was wrong.", "States are where scheduling products break. Postponed, cancelled, recurring-but-edited and offline states needed as much design as the happy path.", "Role-based design is mostly about what to hide. A parent's dashboard and an admin's share components but answer different first questions.", "Building the prototype exposed design gaps that static mockups would have hidden, such as performance during live validation.", "What I'd do differently: run five quick interviews before high fidelity. The research kit is ready; the evidence isn't yet."].map((x) => <li key={x} className="card p-4 text-sm">{x}</li>)}
            </ul>
          </Section>

          <Section id="future" eyebrow="22" title="Future improvements">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              {["Run interviews and survey; replace provisional personas", "Two usability rounds; publish real before/after iterations", "Live LLM parser behind the explainable scheduler (with evaluation set)", "Real two-way calendar sync via OAuth", "Server-backed share links and multi-user data (e.g. Supabase)", "Native Expo/React Native prototype", "Referee and volunteer assignment", "Travel-time aware scheduling between venues", "Automated accessibility testing (axe) in CI"].map((x) => <li key={x} className="card flex gap-2 p-4"><ArrowRight className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />{x}</li>)}
            </ul>
          </Section>
        </article>
      </div>
    </>
  );
}
