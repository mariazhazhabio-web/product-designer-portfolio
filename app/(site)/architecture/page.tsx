import type { Metadata } from "next";
import { FlowDiagram, FlowLegend, PageHeader, Section, SitemapTree } from "@/components/site/blocks";
import { decisionTrees, featureHierarchy, flows, sitemap } from "@/content/architecture";
import { ACTION_LABEL, PERMISSIONS, ROLE_LABEL, type Action } from "@/lib/sportsync/permissions";
import type { Role } from "@/lib/sportsync/types";

export const metadata: Metadata = { title: "Information architecture & flows", description: "SportSync sitemap, navigation, role-based access, feature hierarchy, user flows and decision trees." };

export default function ArchitecturePage() {
  const roles = Object.keys(ROLE_LABEL) as Role[];
  return (
    <>
      <PageHeader eyebrow="SportSync · Structure" title="Information architecture, flows & decisions"
        intro="How SportSync is organised, who can do what, and how people move through the nine critical tasks. Every flow links to the screen where you can try it." />
      <div className="container-page">
        <Section id="sitemap" title="Application sitemap & IA diagram"><SitemapTree node={sitemap} /></Section>
        <Section id="navigation" title="Navigation structure">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card p-5 text-sm"><p className="font-semibold">Web (≥1024px)</p><ul className="mt-2 list-disc space-y-1 pl-5 text-muted"><li>Persistent left sidebar, 13 destinations with counts</li><li>Top bar: role switcher, quick create, notifications</li><li>Dialogs for create/edit/detail keep context</li></ul></div>
            <div className="card p-5 text-sm"><p className="font-semibold">iOS pattern</p><ul className="mt-2 list-disc space-y-1 pl-5 text-muted"><li>Tab bar: Home, Calendar, Create, Conflicts, More</li><li>Large titles; sheets for create/edit</li><li>Swipe-back navigation; action sheets for destructive choices</li></ul></div>
            <div className="card p-5 text-sm"><p className="font-semibold">Android pattern</p><ul className="mt-2 list-disc space-y-1 pl-5 text-muted"><li>Navigation bar with same five destinations</li><li>Top app bar; FAB-style create</li><li>Bottom sheets; system back closes dialogs</li></ul></div>
          </div>
        </Section>
        <Section id="roles" title="Role-based access map">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">Capability</th>{roles.map((r) => <th key={r} className="p-3 text-center">{ROLE_LABEL[r]}</th>)}</tr></thead>
              <tbody>{(Object.keys(PERMISSIONS) as Action[]).map((a) => <tr key={a} className="border-t border-border"><td className="p-3 capitalize">{ACTION_LABEL[a]}</td>{roles.map((r) => <td key={r} className="p-3 text-center">{PERMISSIONS[a].includes(r) ? <span className="font-bold text-success" aria-label="Allowed">✓</span> : <span className="text-subtle" aria-label="Not allowed">–</span>}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted">Scope rules: coaches edit only their teams&apos; events; parents see and RSVP for their children&apos;s teams; athletes see their own team; facility managers see all bookings. The same matrix drives the live prototype (<code>lib/sportsync/permissions.ts</code>).</p>
        </Section>
        <Section id="hierarchy" title="Feature hierarchy">
          <div className="grid gap-4 md:grid-cols-4">{featureHierarchy.map((t, i) => <div key={t.tier} className="card p-5" style={{ borderTop: `4px solid var(${["--primary", "--accent", "--info", "--ev-meeting"][i]})` }}><p className="font-semibold">{t.tier}</p><ul className="mt-2 space-y-1 text-sm text-muted">{t.items.map((x) => <li key={x}>{x}</li>)}</ul></div>)}</div>
        </Section>
        <Section id="flows" title="Task flows & user flow diagrams" intro="Nine critical flows. Decisions show the branches the interface must handle.">
          <FlowLegend />
          <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">{flows.map((f) => <FlowDiagram key={f.id} flow={f} />)}</div>
        </Section>
        <Section id="decisions" title="Decision trees">
          <div className="grid gap-5 lg:grid-cols-2">
            {decisionTrees.map((t) => (
              <figure key={t.title} className="card p-5">
                <figcaption className="mb-4 font-semibold">{t.title}</figcaption>
                <ol className="space-y-3">
                  {t.nodes.map((n, i) => (
                    <li key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr]">
                      <div className="rounded-lg border border-accent/50 bg-accent-soft p-3 text-sm font-medium">◆ {n.q}</div>
                      <div className="space-y-1 text-sm">
                        <p className="rounded-md bg-success-soft px-3 py-1.5"><strong>Yes →</strong> {n.yes}</p>
                        {n.no && <p className="rounded-md bg-surface-2 px-3 py-1.5"><strong>No →</strong> {n.no}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </figure>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
