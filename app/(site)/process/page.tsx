import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/blocks";

export const metadata: Metadata = { title: "Product design process" };

const phases = [
  { n: "01", t: "Frame", q: "What problem, for whom, and what would we need to believe?", out: ["Problem statement", "Hypotheses with measures", "Success metrics draft"], ex: ["/research/#hypotheses", "SportSync hypotheses"] },
  { n: "02", t: "Discover", q: "What's actually happening today?", out: ["Research plan & questions", "Interview guide, survey", "Competitive framework"], ex: ["/research/", "Research kit"] },
  { n: "03", t: "Define", q: "Who are we designing for, and what jobs matter most?", out: ["Personas, empathy maps, JTBD", "Journey & opportunity maps", "RICE / MoSCoW"], ex: ["/research/#personas", "Personas & JTBD"] },
  { n: "04", t: "Structure", q: "How is it organised and how do people move through it?", out: ["Sitemap & IA", "Role access map", "User flows & decision trees"], ex: ["/architecture/", "IA & flows"] },
  { n: "05", t: "Design", q: "What does each screen and state look like?", out: ["Lo → mid → hi-fi", "Design tokens & components", "Loading, empty, error, offline & permission states"], ex: ["/wireframes/", "28 screens"] },
  { n: "06", t: "Prototype", q: "Does it work when you actually use it?", out: ["Interactive prototype", "Real logic where it matters", "Platform conventions"], ex: ["/demo/", "Live prototype"] },
  { n: "07", t: "Validate", q: "Can real people do the important things?", out: ["Usability plan & script", "SUS, observation sheet", "Severity matrix, iteration report"], ex: ["/usability/", "Test package"] },
  { n: "08", t: "Deliver & measure", q: "Can engineers build it, and is it working?", out: ["PRD, stories, API, schema", "QA plan & traceability", "Metrics dashboard"], ex: ["/engineering/", "Handoff"] },
];

export default function Process() {
  return (
    <>
      <PageHeader eyebrow="How I work" title="Product design process" intro="A loop, not a line. Each phase ends with an artifact someone else can use, and every SportSync artifact is linked below." />
      <div className="container-page py-12">
        <ol className="grid gap-5 md:grid-cols-2">
          {phases.map((p) => (
            <li key={p.n} className="card p-6">
              <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-primary">{p.n}</p>
              <h2 className="mt-2 text-xl font-semibold">{p.t}</h2>
              <p className="mt-1 text-muted">{p.q}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">{p.out.map((o) => <li key={o} className="rounded-md bg-surface-2 px-2 py-1 text-xs">{o}</li>)}</ul>
              <Link href={p.ex[0]} className="mt-4 inline-block text-sm font-medium text-info hover:underline">See it in SportSync: {p.ex[1]} →</Link>
            </li>
          ))}
        </ol>
        <div className="card mt-8 p-6 text-sm text-muted"><strong className="text-text">Where AI fits:</strong> I use AI tools to accelerate implementation, drafting and exploration. Decisions, research ethics, accessibility and final quality checks stay human, and anything simulated is labeled.</div>
      </div>
    </>
  );
}
