import type { Metadata } from "next";
import { BookOpen, FlaskConical, Landmark, Scale, Sparkles } from "lucide-react";
import { profile } from "@/lib/site";
import { PageHeader, Section } from "@/components/site/blocks";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "About", description: `About ${profile.name}, Product Designer.` };

const lenses = [
  { Icon: FlaskConical, t: "Chemical Engineering", d: "Systems, constraints and optimisation. Scheduling is a constraint-satisfaction problem, and I enjoy modelling it honestly." },
  { Icon: Scale, t: "Criminology", d: "Evidence standards and careful questioning. I separate what we know from what we assume, which is why my research artifacts are labeled as hypotheses." },
  { Icon: Landmark, t: "Public Administration (MM)", d: "How services succeed or fail real people, stakeholder management and process improvement at scale." },
  { Icon: BookOpen, t: "Teaching", d: "Instructional design and clear explanation. It shapes how I write UI copy, onboarding and explanations for automated decisions." },
];

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About me" title={profile.name} intro={<>{profile.title.replaceAll("|", "·")}<span className="mt-3 block">{profile.positioning}</span></>} />
      <div className="container-page">
        <Section title="How my background shapes my design work">
          <div className="grid gap-4 md:grid-cols-2">{lenses.map(({ Icon, t, d }) => <div key={t} className="card flex gap-4 p-5"><Icon className="size-6 shrink-0 text-primary" aria-hidden /><div><p className="font-semibold">{t}</p><p className="mt-1 text-sm text-muted">{d}</p></div></div>)}</div>
        </Section>
        <Section title="What I build" intro="I design and develop digital products end to end, using AI-assisted development to move from idea to working software quickly, while keeping design decisions, content and verification my own.">
          <ul className="grid gap-3 text-sm md:grid-cols-3">
            <li className="card p-5"><p className="font-semibold">WideKonek</p><p className="mt-1 text-muted">Professional networking, recruitment and freelance marketplace.</p></li>
            <li className="card p-5"><p className="font-semibold">Frendora</p><p className="mt-1 text-muted">Social networking and communication platform.</p></li>
            <li className="card p-5"><p className="font-semibold">ZC Smart Digital</p><p className="mt-1 text-muted">Digital solutions and automation services brand.</p></li>
          </ul>
        </Section>
        <Section title="Professional experience" intro="More than 15 years in the Philippine public sector, plus teaching and customer service.">
          <ol className="space-y-3">{profile.experience.map((x) => <li key={x.title} className="card flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-5"><span><span className="block font-semibold">{x.title}</span><span className="text-sm text-muted">{x.org}</span></span><span className="text-sm tabular-nums text-muted">{x.years}</span></li>)}</ol>
        </Section>
        <Section title="Education">
          <ul className="grid gap-3 sm:grid-cols-2">{profile.education.map((e) => { const [deg, school] = e.split(" · "); return <li key={e} className="card p-4 text-sm"><span className="block font-medium">{deg}</span><span className="text-muted">{school}</span></li>; })}</ul>
        </Section>
        <Section title="Licenses & eligibility">
          <ul className="grid gap-3 sm:grid-cols-2">{profile.licenses.map((e) => { const [l, by] = e.split(" · "); return <li key={e} className="card p-4 text-sm"><span className="block font-medium">{l}</span><span className="text-muted">{by}</span></li>; })}</ul>
        </Section>
        <Section title="Working principles">
          <ul className="grid gap-3 text-sm md:grid-cols-3">{["Be honest about evidence: label hypotheses, simulations and demo data.", "Design the states, not just the screens: errors, empty, offline, permissions.", "Make automation explainable and reversible.", "Accessibility is a baseline, not a feature.", "Ship working prototypes engineers can read.", "Measure what changes decisions."].map((x) => <li key={x} className="card flex gap-2 p-4"><Sparkles className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />{x}</li>)}</ul>
          <div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/resume/">View resume</ButtonLink><ButtonLink href="/contact/" variant="outline">Get in touch</ButtonLink></div>
        </Section>
      </div>
    </>
  );
}
