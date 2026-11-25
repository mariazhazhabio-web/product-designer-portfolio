import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { EmpathyMap, Honesty, PageHeader, PersonaCard, Section } from "@/components/site/blocks";
import { competitorFramework, hypotheses, interviewGuide, journey, moscow, objectives, opportunities, personas, problemStatement, researchQuestions, rice, survey } from "@/content/research";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "UX research", description: "SportSync research plan, hypotheses, personas, JTBD, journeys, opportunity map and prioritisation." };

export default function ResearchPage() {
  return (
    <>
      <PageHeader eyebrow="SportSync · UX research" title="A research kit, ready to run"
        intro="Everything needed to validate SportSync with real people: plan, questions, interview guide, survey, synthesis templates and provisional artifacts to replace with evidence.">
        <Honesty><strong>No research has been conducted yet.</strong> Personas, empathy maps, journeys and pain points below are <em>hypotheses</em> from desk research and domain reasoning. There are no participants, quotes or findings. Templates are provided so results can replace these later.</Honesty>
      </PageHeader>
      <div className="container-page">
        <Section id="problem" title="Product problem statement"><blockquote className="rounded-xl border-l-4 border-primary bg-primary-soft p-5">{problemStatement}</blockquote></Section>
        <Section id="objectives" title="Research objectives & questions">
          <ol className="mb-6 list-decimal space-y-1.5 pl-5 text-muted">{objectives.map((o) => <li key={o}>{o}</li>)}</ol>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{researchQuestions.map((r) => <div key={r.theme} className="card p-5"><p className="font-semibold">{r.theme}</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">{r.qs.map((q) => <li key={q}>{q}</li>)}</ul></div>)}</div>
        </Section>
        <Section id="hypotheses" title="Customer pain-point hypotheses">
          <div className="grid gap-3 md:grid-cols-2">{hypotheses.map((h) => <div key={h.id} className="card p-4 text-sm"><div className="flex items-center justify-between"><p className="font-semibold">{h.id} · {h.who}</p><Badge tone="warning">{h.status}</Badge></div><p className="mt-1">{h.text}</p><p className="mt-2 text-xs text-muted">Validate via: {h.measure}</p></div>)}</div>
        </Section>
        <Section id="competitors" title="Competitor analysis framework" intro={competitorFramework.note}>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">Criterion</th>{competitorFramework.categories.map((c) => <th key={c} className="p-3">{c}</th>)}</tr></thead>
              <tbody>{competitorFramework.criteria.map((c) => <tr key={c} className="border-t border-border"><td className="p-3 font-medium">{c}</td>{competitorFramework.categories.map((k) => <td key={k} className="p-3 text-subtle">To evaluate</td>)}</tr>)}</tbody>
            </table>
          </div>
        </Section>
        <Section id="interview" title="User interview guide" intro="60-minute semi-structured interview. Adapt per role.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{interviewGuide.map((s) => <div key={s.section} className="card p-5"><p className="font-semibold">{s.section}</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">{s.items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}</div>
        </Section>
        <Section id="survey" title="Customer survey questionnaire">
          <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[640px] text-sm"><thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">#</th><th className="p-3">Question</th><th className="p-3">Type</th><th className="p-3">Options</th></tr></thead>
            <tbody>{survey.map((s, i) => <tr key={s.q} className="border-t border-border align-top"><td className="p-3 tabular-nums text-muted">{i + 1}</td><td className="p-3">{s.q}</td><td className="p-3 text-muted">{s.type}</td><td className="p-3 text-muted">{s.options}</td></tr>)}</tbody></table></div>
        </Section>
        <Section id="personas" title="Provisional personas" intro="Five roles SportSync must serve. Replace with evidence-based personas after interviews.">
          <div className="grid gap-5 lg:grid-cols-2">{personas.map((p) => <PersonaCard key={p.id} p={p} />)}</div>
        </Section>
        <Section id="empathy" title="Empathy maps (hypotheses)">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{personas.map((p) => <EmpathyMap key={p.id} p={p} />)}</div>
        </Section>
        <Section id="jtbd" title="Jobs-to-be-Done">
          <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[640px] text-sm"><thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">Role</th><th className="p-3">Job statement (When… I want to… so I can…)</th><th className="p-3">Success</th></tr></thead>
            <tbody>{personas.map((p) => <tr key={p.id} className="border-t border-border align-top"><td className="p-3 font-medium">{p.role}</td><td className="p-3">{p.jtbd}</td><td className="p-3 text-muted">{p.success}</td></tr>)}</tbody></table></div>
        </Section>
        <Section id="journey" title="User journey map" intro={journey.persona}>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[900px] text-sm">
              <tbody>
                {(["stage", "actions", "thoughts", "emotion", "opportunity"] as const).map((row) => (
                  <tr key={row} className="border-t border-border first:border-0 align-top">
                    <th className="w-28 bg-surface-2 p-3 text-left text-xs font-semibold uppercase text-muted">{row === "emotion" ? "Emotion (1–5)" : row}</th>
                    {journey.stages.map((s) => <td key={s.stage} className={row === "stage" ? "p-3 font-semibold" : row === "opportunity" ? "p-3 text-primary" : "p-3 text-muted"}>{row === "emotion" ? "●".repeat(s.emotion) + "○".repeat(5 - s.emotion) : row === "thoughts" ? `“${s[row]}”` : s[row]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
        <Section id="opportunities" title="Opportunity map">
          <div className="grid gap-4 md:grid-cols-5">{opportunities.map((o) => <div key={o.area} className="card p-4"><p className="font-semibold">{o.area}</p><ul className="mt-2 space-y-1.5 text-sm text-muted">{o.ideas.map((i) => <li key={i} className="rounded-md bg-surface-2 px-2 py-1">{i}</li>)}</ul></div>)}</div>
        </Section>
        <Section id="prioritisation" title="Feature prioritisation: RICE & MoSCoW" intro="Reach (1–10), Impact (0.25–3), Confidence (0–1), Effort (person-weeks). Scores are my estimates, to recalibrate with research.">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[460px] text-sm"><thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">Feature</th><th className="p-3">R</th><th className="p-3">I</th><th className="p-3">C</th><th className="p-3">E</th><th className="p-3">Score</th></tr></thead>
              <tbody>{rice.map((r) => <tr key={r.feature} className="border-t border-border"><td className="p-3">{r.feature}</td><td className="p-3">{r.reach}</td><td className="p-3">{r.impact}</td><td className="p-3">{r.confidence}</td><td className="p-3">{r.effort}</td><td className="p-3 font-semibold">{r.score}</td></tr>)}</tbody></table></div>
            <div className="grid gap-3 sm:grid-cols-2">{(Object.entries(moscow) as [string, string[]][]).map(([k, v]) => <div key={k} className="card p-4"><p className="font-semibold capitalize">{k === "wont" ? "Won't have (now)" : `${k} have`}</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">{v.map((x) => <li key={x}>{x}</li>)}</ul></div>)}</div>
          </div>
        </Section>
        <Section id="templates" title="Templates to run the research">
          <div className="flex flex-wrap gap-3">
            {[["Research plan", "research-plan"], ["Interview guide & notes template", "interview-guide"], ["Survey questionnaire", "survey"], ["Synthesis & persona update template", "research-synthesis-template"]].map(([l, s]) => <ButtonLink key={s} href={`/docs/${s}/`} variant="outline"><Download aria-hidden />{l}</ButtonLink>)}
          </div>
          <p className="mt-3 text-sm text-muted">Each document is also in the repository&apos;s <code>docs/</code> folder as Markdown so it can be copied into Notion, Google Docs or Word. See all in the <Link className="text-info underline" href="/docs/">documents library</Link>.</p>
        </Section>
      </div>
    </>
  );
}
