import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Honesty, PageHeader } from "@/components/site/blocks";
import { alignment } from "@/content/delivery";
import { withBase } from "@/lib/utils";

export const metadata: Metadata = { title: "Role alignment", description: "How the SportSync project demonstrates the responsibilities of a Product Designer for sports scheduling experiences." };

export default function RoleAlignment() {
  return (
    <>
      <PageHeader eyebrow="For the hiring team" title="Role alignment"
        intro="How SportSync provides evidence for each responsibility in TeamSnap's Product Designer posting for scheduling experiences, with a link to the proof for each.">
        <Honesty>SportSync is an independent portfolio project created to show how I would approach this work. It is not affiliated with or endorsed by TeamSnap and does not use TeamSnap&apos;s interface, branding or assets. Where evidence is a plan rather than a result (research, testing), it is labeled as such.</Honesty>
      </PageHeader>
      <div className="container-page py-12">
        <ol className="space-y-4">
          {alignment.map((a, i) => (
            <li key={a.resp} className="card grid gap-4 p-5 md:grid-cols-[2.5rem_1fr_1.4fr_auto] md:items-start">
              <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-semibold">{a.resp}</p>
              <p className="flex gap-2 text-sm text-muted"><Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />{a.evidence}</p>
              <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                {a.links.map(([l, h]) => <Link key={h} href={h} className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary">{l}<ArrowUpRight className="size-3.5" aria-hidden /></Link>)}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={withBase("/downloads/maria-bio-resume-teamsnap.pdf")} download className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-fg hover:bg-primary-hover">Download tailored resume (PDF)</a>
          <a href={withBase("/downloads/maria-bio-proposal-teamsnap.pdf")} download className="rounded-lg border border-border-strong px-4 py-2.5 text-sm font-medium hover:bg-surface-2">Download proposal (PDF)</a>
          <Link href="/docs/proposal-teamsnap/" className="rounded-lg border border-border-strong px-4 py-2.5 text-sm font-medium hover:bg-surface-2">Read the proposal online</Link>
        </div>
        <div className="card mt-10 p-6 text-sm">
          <p className="font-semibold">What I bring beyond the project</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {["Systems thinking from chemical engineering: constraints, optimisation, process flow", "Investigative interviewing and evidence standards from criminology", "Public-service design and stakeholder management from public administration", "Clear explanation and learning design from teaching", "Hands-on building of real products (WideKonek, ZC Smart Digital demos)", "Comfort using AI tools responsibly, with transparency about what's simulated"].map((x) => <li key={x} className="flex gap-2 text-muted"><Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />{x}</li>)}
          </ul>
        </div>
      </div>
    </>
  );
}
