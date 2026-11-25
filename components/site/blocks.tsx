import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, CircleDot, Diamond, Flag, Play, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Flow, SiteNode } from "@/content/architecture";
import type { Persona } from "@/content/research";
import { Badge } from "@/components/ui/badge";

export function PageHeader({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="container-page py-14 sm:py-20">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold sm:text-5xl">{title}</h1>
        {intro && <div className="mt-5 max-w-3xl text-lg text-muted">{intro}</div>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export function Section({ id, eyebrow, title, intro, children, className }: { id?: string; eyebrow?: string; title: string; intro?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-12 sm:py-16", className)} aria-labelledby={id ? `${id}-h` : undefined}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id ? `${id}-h` : undefined} className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
      {intro && <div className="mt-3 max-w-3xl text-muted">{intro}</div>}
      {children && <div className="mt-8">{children}</div>}
    </section>
  );
}

export function Honesty({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning-soft p-4 text-sm">
      <Flag className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
      <div className="text-text">{children}</div>
    </div>
  );
}

export function StatusPill({ status }: { status: "done" | "wip" | "proposed" | "pending" }) {
  const map = { done: ["success", "Completed"], wip: ["warning", "In progress"], proposed: ["info", "Proposed"], pending: ["neutral", "Pending"] } as const;
  return <Badge tone={map[status][0]}>{map[status][1]}</Badge>;
}

const KIND = {
  start: { Icon: Play, cls: "border-primary bg-primary-soft text-primary" },
  step: { Icon: CircleDot, cls: "border-border bg-surface" },
  system: { Icon: Settings2, cls: "border-info/40 bg-info-soft" },
  decision: { Icon: Diamond, cls: "border-accent/50 bg-accent-soft" },
  end: { Icon: Flag, cls: "border-success/50 bg-success-soft" },
};

export function FlowDiagram({ flow }: { flow: Flow }) {
  return (
    <figure id={`flow-${flow.id}`} className="card scroll-mt-24 p-5">
      <figcaption className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div><p className="font-semibold">{flow.title}</p><p className="text-sm text-muted">{flow.actor} · Goal: {flow.goal}</p></div>
        <Link href={flow.demo} className="inline-flex items-center gap-1 text-sm font-medium text-info hover:underline">Try it<ArrowRight className="size-3.5" aria-hidden /></Link>
      </figcaption>
      <ol className="space-y-0">
        {flow.steps.map((s, i) => {
          const k = KIND[s.kind ?? "step"];
          return (
            <li key={i}>
              <div className={cn("flex items-start gap-2.5 rounded-lg border px-3 py-2 text-sm", k.cls, s.kind === "decision" && "font-medium")}>
                <k.Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span className="sr-only">{s.kind ?? "step"}: </span>
                <span>{s.label}</span>
              </div>
              {s.branches && (
                <ul className="ml-6 mt-1.5 grid gap-1.5 border-l-2 border-dashed border-accent/50 pl-4 sm:grid-cols-2">
                  {s.branches.map((b) => <li key={b.label} className="rounded-md bg-surface-2 px-2.5 py-1.5 text-xs"><span className="font-semibold text-accent">{b.label} →</span> {b.to}</li>)}
                </ul>
              )}
              {i < flow.steps.length - 1 && <ArrowDown className="mx-auto my-1 size-4 text-subtle" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

export function FlowLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted">
      {(Object.keys(KIND) as (keyof typeof KIND)[]).map((k) => { const { Icon, cls } = KIND[k]; return <span key={k} className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-1", cls)}><Icon className="size-3.5" aria-hidden />{k === "system" ? "System action" : k[0].toUpperCase() + k.slice(1)}</span>; })}
    </div>
  );
}

export function SitemapTree({ node, depth = 0 }: { node: SiteNode; depth?: number }) {
  return (
    <div className={cn(depth === 0 && "card overflow-x-auto p-5")}>
      <div className={cn("inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm", depth === 0 ? "border-primary bg-primary text-primary-fg font-semibold" : depth === 1 ? "border-border-strong bg-surface font-medium" : "border-border bg-surface-2 text-muted")}>
        {node.href ? <Link href={node.href} className="hover:underline">{node.label}</Link> : node.label}
        {node.roles && <span className="text-[11px] font-normal text-muted">({node.roles})</span>}
      </div>
      {node.children && (
        <ul className={cn("mt-2 space-y-2 border-l border-border pl-5", depth === 0 && "grid gap-x-6 gap-y-3 border-0 pl-0 sm:grid-cols-2 lg:grid-cols-3 sm:space-y-0")}>
          {node.children.map((c) => <li key={c.label} className={cn(depth === 0 && "rounded-xl bg-surface-2/50 p-3")}><SitemapTree node={c} depth={depth + 1} /></li>)}
        </ul>
      )}
    </div>
  );
}

export function PersonaCard({ p }: { p: Persona }) {
  return (
    <article className="card overflow-hidden" aria-labelledby={`persona-${p.id}`}>
      <div className="flex items-center gap-3 border-b border-border bg-surface-2 p-4">
        <span aria-hidden className="flex size-12 items-center justify-center rounded-full bg-primary font-[family-name:var(--font-display)] text-lg font-bold text-primary-fg">{p.name[0]}</span>
        <div className="min-w-0">
          <h3 id={`persona-${p.id}`} className="font-semibold">{p.name} · {p.role}</h3>
          <p className="text-xs text-muted">{p.age} · {p.tech}</p>
        </div>
        <Badge tone="warning" className="ml-auto">Provisional</Badge>
      </div>
      <div className="space-y-4 p-4 text-sm">
        <p className="text-muted">{p.context}</p>
        <blockquote className="border-l-2 border-accent pl-3 italic">{p.quote}</blockquote>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><p className="mb-1 font-semibold">Goals</p><ul className="list-disc space-y-0.5 pl-4 text-muted">{p.goals.map((g) => <li key={g}>{g}</li>)}</ul></div>
          <div><p className="mb-1 font-semibold">Assumed pain points</p><ul className="list-disc space-y-0.5 pl-4 text-muted">{p.pains.map((g) => <li key={g}>{g.replace("Assumed: ", "")}</li>)}</ul></div>
        </div>
        <div><p className="mb-1 font-semibold">Job to be done</p><p className="text-muted">{p.jtbd}</p></div>
        <p className="rounded-lg bg-primary-soft px-3 py-2 text-xs"><span className="font-semibold text-primary">Success looks like: </span>{p.success}</p>
      </div>
    </article>
  );
}

export function EmpathyMap({ p }: { p: Persona }) {
  const q: [string, string[]][] = [["Says", p.empathy.says], ["Thinks", p.empathy.thinks], ["Does", p.empathy.does], ["Feels", p.empathy.feels]];
  return (
    <figure className="card p-4">
      <figcaption className="mb-3 flex items-center justify-between text-sm font-semibold">{p.name} · {p.role}<Badge tone="warning">Hypothesis</Badge></figcaption>
      <div className="grid grid-cols-2 gap-2">
        {q.map(([t, items]) => (
          <div key={t} className="rounded-lg bg-surface-2 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">{t}</p>
            <ul className="mt-1 space-y-1 text-xs text-muted">{items.map((i) => <li key={i}>“{i}”</li>)}</ul>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function TOC({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="no-print">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">On this page</p>
      <ol className="space-y-1 text-sm">
        {items.map((i, n) => <li key={i.id}><a href={`#${i.id}`} className="flex gap-2 rounded px-2 py-1 text-muted hover:bg-surface-2 hover:text-text"><span className="w-5 shrink-0 tabular-nums text-subtle">{n + 1}</span>{i.label}</a></li>)}
      </ol>
    </nav>
  );
}

export function KeyValue({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([k, v]) => <div key={k} className="bg-surface p-4"><dt className="text-xs font-medium uppercase tracking-wide text-muted">{k}</dt><dd className="mt-1 text-sm font-medium">{v}</dd></div>)}
    </dl>
  );
}
