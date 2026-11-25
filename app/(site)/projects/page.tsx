import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/content/projects";
import { PageHeader } from "@/components/site/blocks";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Selected projects" };

export default function Projects() {
  return (
    <>
      <PageHeader eyebrow="Work" title="Selected projects" intro="One deep product design case study and three products I founded. Each page separates completed, in-progress and proposed work." />
      <div className="container-page grid gap-6 py-12 md:grid-cols-2">
        {projects.map((p, i) => (
          <Link key={p.slug} href={`/projects/${p.slug}/`} className={`card group flex flex-col overflow-hidden transition-colors hover:border-border-strong ${i === 0 ? "md:col-span-2" : ""}`}>
            <div className="h-2" style={{ background: p.color }} />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">{i === 0 && <Badge tone="accent">Featured</Badge>}<Badge>{p.status}</Badge></div>
              <h2 className="mt-3 text-2xl font-semibold">{p.name} <span className="text-base font-normal text-muted">· {p.tagline}</span></h2>
              <p className="mt-2 flex-1 text-muted">{p.summary}</p>
              <p className="mt-4 text-sm"><span className="font-medium">Role:</span> <span className="text-muted">{p.role}</span></p>
              <div className="mt-3 flex flex-wrap gap-1.5">{p.stack.map((s) => <Badge key={s} tone="outline">{s}</Badge>)}</div>
              <p className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-info">Read case study<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
