import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Honesty, PageHeader, Section } from "@/components/site/blocks";
import { usability } from "@/content/delivery";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Usability testing plan", description: "SportSync usability testing package: objectives, recruitment, script, scenarios, SUS, observation sheet and severity matrix." };

export default function UsabilityPage() {
  return (
    <>
      <PageHeader eyebrow="SportSync · Validation" title="Usability testing package"
        intro="A complete, moderated test plan for the prototype. It's ready to run; every result field is marked pending until sessions happen.">
        <Honesty><strong>No tests have been conducted.</strong> There are no participants, completion rates or SUS scores yet. The tables below are templates.</Honesty>
      </PageHeader>
      <div className="container-page">
        <Section id="objectives" title="Testing objectives"><ol className="grid gap-3 md:grid-cols-2">{usability.objectives.map((o, i) => <li key={o} className="card flex gap-3 p-4 text-sm"><span className="font-semibold text-accent">O{i + 1}</span>{o}</li>)}</ol></Section>
        <Section id="recruitment" title="Participant recruitment criteria"><ul className="card list-disc space-y-1.5 p-5 pl-9 text-sm text-muted">{usability.recruitment.map((r) => <li key={r}>{r}</li>)}</ul></Section>
        <Section id="script" title="Moderator script (summary)" intro="Full script with timings is in the downloadable document.">
          <div className="grid gap-3 md:grid-cols-4 text-sm">
            {[["Welcome (5 min)", "Consent, recording, “we're testing the design, not you”, think aloud practice."], ["Background (5 min)", "Role, sport, current tools, last schedule change."], ["Tasks (35 min)", "Six scenarios in randomized order; no help unless stuck >2 min; post-task ease rating (SEQ 1–7)."], ["Wrap-up (15 min)", "SUS questionnaire, overall impressions, what they'd change, thank you."]].map(([t, d]) => <div key={t} className="card p-4"><p className="font-semibold">{t}</p><p className="mt-1 text-muted">{d}</p></div>)}
          </div>
        </Section>
        <Section id="scenarios" title="Testing scenarios & completion criteria">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">ID</th><th className="p-3">Scenario prompt (read aloud)</th><th className="p-3">Success criteria</th><th className="p-3">Target</th><th className="p-3">Result</th></tr></thead>
              <tbody>{usability.scenarios.map((s) => <tr key={s.id} className="border-t border-border align-top"><td className="p-3 font-semibold">{s.id}<span className="block text-xs font-normal text-muted">{s.title}</span></td><td className="p-3">“{s.prompt}”</td><td className="p-3 text-muted">{s.success}</td><td className="p-3">{s.target}</td><td className="p-3"><Badge>Pending</Badge></td></tr>)}</tbody>
            </table>
          </div>
        </Section>
        <Section id="observation" title="Observation sheet (per participant, per task)">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted"><tr>{["Task", "Completed (Y / N / With help)", "Time", "Errors / wrong paths", "Quotes (verbatim)", "SEQ (1–7)", "Severity"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
              <tbody>{usability.scenarios.map((s) => <tr key={s.id} className="border-t border-border"><td className="p-3 font-medium">{s.id}</td>{[1, 2, 3, 4, 5, 6].map((i) => <td key={i} className="p-3 text-subtle">—</td>)}</tr>)}</tbody>
            </table>
          </div>
        </Section>
        <Section id="sus" title="System Usability Scale (SUS)" intro="Standard 10-item questionnaire, 1 (strongly disagree) to 5 (strongly agree). Score = ((Σ odd − 5) + (25 − Σ even)) × 2.5.">
          <ol className="card divide-y divide-border">{usability.sus.map((q, i) => <li key={q} className="flex flex-wrap items-center justify-between gap-3 p-3 text-sm"><span><span className="mr-2 font-semibold tabular-nums">{i + 1}.</span>{q}</span><span className="flex gap-1" aria-hidden>{[1, 2, 3, 4, 5].map((n) => <span key={n} className="flex size-7 items-center justify-center rounded-md border border-border-strong text-xs">{n}</span>)}</span></li>)}</ol>
          <p className="mt-2 text-sm text-muted">Mean SUS: <Badge>Pending</Badge> · Benchmark: 68 is average; target ≥ 75.</p>
        </Section>
        <Section id="severity" title="Issue severity matrix">
          <div className="grid gap-3 md:grid-cols-4">{usability.severity.map((s, i) => <div key={s.level} className="card p-4 text-sm" style={{ borderTop: `4px solid var(${["--danger", "--accent", "--warning", "--info"][i]})` }}><p className="font-semibold">{s.level}</p><p className="mt-1 text-muted">{s.def}</p><p className="mt-2 text-xs font-medium">{s.action}</p></div>)}</div>
          <p className="mt-3 text-sm text-muted">Priority = severity × frequency (number of participants affected ÷ total).</p>
        </Section>
        <Section id="feedback" title="Feedback collection form & iteration report">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card p-5 text-sm"><p className="font-semibold">Post-session feedback form</p><ul className="mt-2 list-disc space-y-1 pl-5 text-muted"><li>What was the easiest thing you did today?</li><li>What was the most confusing?</li><li>Would you trust SportSync to publish a schedule? Why / why not? (1–5)</li><li>Which feature would you use first?</li><li>Anything missing for your role?</li></ul></div>
            <div className="card p-5 text-sm"><p className="font-semibold">Iteration report template</p><ul className="mt-2 list-disc space-y-1 pl-5 text-muted"><li>Round, dates, participants (roles only)</li><li>Task metrics table (completion, time, SEQ)</li><li>Top issues with severity, evidence and recommendation</li><li>Before / after screens for each change</li><li>Decisions & next round plan</li></ul></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href="/docs/usability-test-plan/" variant="outline"><Download aria-hidden />Full test plan & moderator script</ButtonLink>
            <ButtonLink href="/docs/iteration-report-template/" variant="outline"><Download aria-hidden />Iteration report template</ButtonLink>
          </div>
        </Section>
      </div>
    </>
  );
}
