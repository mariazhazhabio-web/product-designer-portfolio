import type { ReactNode } from "react";
import { Honesty, KeyValue, Section, StatusPill } from "./blocks";
import type { FeatureStatus } from "@/content/projects";

export interface FeatureRow { area: string; feature: string; status: FeatureStatus; note: string }

export function CaseHero({ eyebrow, name, tagline, intro, color, facts, children }: { eyebrow: string; name: string; tagline: string; intro: string; color: string; facts: [string, ReactNode][]; children?: ReactNode }) {
  return (
    <header className="border-b border-border" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}e6 60%, ${color}cc 100%)` }}>
      <div className="container-page py-14 text-white sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">{name}</h1>
        <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-white/85">{tagline}</p>
        <p className="mt-5 max-w-2xl text-lg text-white/85">{intro}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
      <div className="container-page -mb-10 translate-y-0 pb-10"><KeyValue items={facts} /></div>
    </header>
  );
}

export function FeatureTable({ rows }: { rows: FeatureRow[] }) {
  const counts = { done: 0, wip: 0, proposed: 0, pending: 0 } as Record<FeatureStatus, number>;
  rows.forEach((r) => counts[r.status]++);
  return (
    <>
      <div className="mb-3 flex flex-wrap gap-2 text-sm">{(Object.keys(counts) as FeatureStatus[]).filter((k) => counts[k]).map((k) => <span key={k} className="inline-flex items-center gap-1.5"><StatusPill status={k} /><span className="tabular-nums text-muted">×{counts[k]}</span></span>)}</div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">Area</th><th className="p-3">Feature</th><th className="p-3">Status</th><th className="p-3">Evidence / notes</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.area + r.feature} className="border-t border-border align-top"><td className="p-3 font-medium">{r.area}</td><td className="p-3">{r.feature}</td><td className="p-3"><StatusPill status={r.status} /></td><td className="p-3 text-muted">{r.note}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}

export function Showcase({ items }: { items: { title: string; body: string; points: string[]; status: FeatureStatus }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <div key={i.title} className="card flex flex-col p-5">
          <div className="flex items-start justify-between gap-2"><p className="font-semibold">{i.title}</p><StatusPill status={i.status} /></div>
          <p className="mt-2 text-sm text-muted">{i.body}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{i.points.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

export { Honesty, Section };
