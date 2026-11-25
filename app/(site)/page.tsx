import Link from "next/link";
import { ArrowRight, BookOpen, CalendarCheck2, FlaskConical, Layers, PenTool, Sparkles, Workflow } from "lucide-react";
import { profile } from "@/lib/site";
import { withBase } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/content/projects";

const proof = [
  ["28", "screens & states in lo / mid / hi-fi"],
  ["9", "end-to-end user flows"],
  ["10", "conflict types detected"],
  ["5", "provisional personas + research kit"],
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_85%_-10%,var(--primary-soft),transparent),radial-gradient(40rem_20rem_at_0%_110%,var(--accent-soft),transparent)]" />
        <div className="container-page relative grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="animate-rise">
            <div className="flex items-center gap-4">
              <img src={withBase("/profile/maria-bio-headshot-square.jpg")} alt={`Portrait of ${profile.name}`} width={72} height={72} className="size-16 rounded-full border-2 border-surface object-cover shadow-card sm:size-[72px]" />
              <Badge tone="primary" className="whitespace-normal">{profile.availability}</Badge>
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-6xl">
              I design calm, explainable tools for <span className="text-primary">messy real-world schedules</span>.
            </h1>
            <p className="mt-5 text-lg text-muted">
              I&apos;m <strong className="text-text">{profile.name}</strong>: {profile.title.replaceAll("|", "·")}. {profile.positioning}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projects/sportsync/" size="lg">Read the SportSync case study<ArrowRight aria-hidden /></ButtonLink>
              <ButtonLink href="/demo/" size="lg" variant="outline"><Sparkles aria-hidden />Open live prototype</ButtonLink>
            </div>
            <p className="mt-4 text-sm text-muted">No sign-up needed: the demo runs in your browser with fictional data.</p>
          </div>
          <div className="animate-rise [animation-delay:120ms]">
            <Link href="/demo/" className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-1.5 border-b border-border bg-surface-2 px-3 py-2" aria-hidden>
                <span className="size-2.5 rounded-full bg-danger/60" /><span className="size-2.5 rounded-full bg-warning/60" /><span className="size-2.5 rounded-full bg-success/60" />
                <span className="ml-2 text-[11px] text-muted">sportsync · dashboard</span>
              </div>
              <img src={withBase("/screens/dashboard-desktop.png")} alt="SportSync dashboard showing upcoming events, scheduling alerts, pending RSVPs and venue availability" className="aspect-[16/10] w-full object-cover object-top" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map(([n, l]) => <div key={l} className="card p-5"><dt className="sr-only">{l}</dt><dd className="font-[family-name:var(--font-display)] text-4xl font-semibold text-primary">{n}</dd><p className="mt-1 text-sm text-muted">{l}</p></div>)}
        </dl>
        <p className="mt-3 text-xs text-subtle">Counts describe deliverables in this portfolio, not user outcomes. User research and usability testing are planned and marked pending.</p>
      </section>

      <section className="container-page py-10" aria-labelledby="featured-h">
        <div className="card grid overflow-hidden lg:grid-cols-[1fr_1.1fr]">
          <div className="p-8 sm:p-10">
            <p className="eyebrow">Featured project</p>
            <h2 id="featured-h" className="mt-3 text-3xl font-semibold">SportSync <span className="text-muted">· Smarter Scheduling. Stronger Teams.</span></h2>
            <p className="mt-4 text-muted">An original, AI-assisted sports scheduling and team management concept for league administrators, coaches, parents, athletes and facility managers, designed and built end to end as an independent portfolio project.</p>
            <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              {[
                [CalendarCheck2, "Full scheduling lifecycle"],
                [Sparkles, "Explainable AI scheduling (simulated)"],
                [Workflow, "Conflict detection & side-by-side fixes"],
                [Layers, "Token-based design system"],
                [FlaskConical, "Research & usability kit"],
                [BookOpen, "PRD, API, schema & QA handoff"],
              ].map(([Icon, l]) => { const I = Icon as typeof Sparkles; return <li key={l as string} className="flex items-center gap-2"><I className="size-4 text-primary" aria-hidden />{l as string}</li>; })}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/projects/sportsync/">Case study<ArrowRight aria-hidden /></ButtonLink>
              <ButtonLink href="/role-alignment/" variant="outline">How it maps to the role</ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-surface-2 p-5">
            {[["assistant-desktop", "AI assistant proposal with explanation"], ["conflicts-desktop", "Conflict list with suggested fixes"], ["calendar-day-desktop", "Day calendar by venue with conflict highlights"], ["dashboard-mobile", "Mobile dashboard"]].map(([f, alt]) => (
              <img key={f} src={withBase(`/screens/${f}.png`)} alt={alt} className="aspect-[4/3] w-full rounded-lg border border-border object-cover object-top" loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14" aria-labelledby="more-h">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">More work</p><h2 id="more-h" className="mt-2 text-3xl font-semibold">Products I&apos;m building</h2></div>
          <ButtonLink href="/projects/" variant="link">All projects<ArrowRight aria-hidden /></ButtonLink>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {projects.filter((p) => p.slug !== "sportsync").map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}/`} className="card group flex flex-col p-6 transition-colors hover:border-border-strong">
              <span aria-hidden className="flex size-11 items-center justify-center rounded-xl font-[family-name:var(--font-display)] text-lg font-bold text-white" style={{ background: p.color }}>{p.name[0]}</span>
              <h3 className="mt-4 text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{p.summary}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-info">Case study<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden /></p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-14" aria-labelledby="how-h">
        <div className="card grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">How I work</p>
            <h2 id="how-h" className="mt-2 text-3xl font-semibold">Engineer&apos;s rigor, teacher&apos;s empathy, investigator&apos;s curiosity.</h2>
            <p className="mt-4 text-muted">Chemical engineering taught me systems and constraints. Criminology taught me to ask what really happened. Public administration taught me how services fail people. Teaching taught me to explain clearly. I bring all four to product design.</p>
            <ButtonLink href="/process/" variant="outline" className="mt-6"><PenTool aria-hidden />My design process</ButtonLink>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {[["Frame", "Problem statements, hypotheses and what we'd need to believe."], ["Research", "Plans, guides and surveys before solutions."], ["Structure", "IA, flows and decision trees that make edge cases visible."], ["Design", "Lo → mid → hi-fi, with states designed, not discovered."], ["Build", "Working prototypes that engineers can trust."], ["Measure", "Metrics tied to decisions, tests that drive iteration."]].map(([t, d], i) => (
              <li key={t} className="rounded-xl bg-surface-2 p-4"><p className="text-xs font-semibold text-accent">0{i + 1}</p><p className="mt-1 font-semibold">{t}</p><p className="mt-1 text-sm text-muted">{d}</p></li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
