import type { Metadata } from "next";
import { Honesty, PageHeader, Section } from "@/components/site/blocks";
import { MetricsCharts } from "@/components/site/metrics-charts";
import { metrics, demoSeries } from "@/content/delivery";
import { Stat } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Product metrics", description: "Proposed SportSync success metrics and a sample analytics dashboard with demonstration data." };

export default function MetricsPage() {
  const last = demoSeries.weekly[demoSeries.weekly.length - 1];
  return (
    <>
      <PageHeader eyebrow="SportSync · Measurement" title="Proposed success metrics"
        intro="What I would measure after launch, why each metric matters, and how it would drive the next design decision.">
        <Honesty><strong>Demonstration data.</strong> Every number and chart on this page is invented to show the dashboard design. SportSync has no real users or analytics.</Honesty>
      </PageHeader>
      <div className="container-page">
        <Section id="dashboard" title="Sample analytics dashboard" intro={<span className="inline-flex items-center gap-2"><Badge tone="warning">DEMO DATA</Badge>Week 6 snapshot</span>}>
          <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label="Creation completion" value={`${last.completion}%`} sub="demo" />
            <Stat label="Conflict rate" value={`${last.conflictRate}%`} sub="demo" />
            <Stat label="RSVP response" value={`${last.rsvp}%`} sub="demo" />
            <Stat label="AI acceptance" value={`${last.aiAccept}%`} sub="demo" />
            <Stat label="Time to schedule" value={`${last.timeMin} min`} sub="demo" />
          </div>
          <MetricsCharts />
        </Section>
        <Section id="definitions" title="Metric definitions & how they guide improvements">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">Metric</th><th className="p-3">Definition</th><th className="p-3">How it supports improvement</th><th className="p-3">Proposed target</th></tr></thead>
              <tbody>{metrics.map((m) => <tr key={m.name} className="border-t border-border align-top"><td className="p-3 font-medium">{m.name}</td><td className="p-3 text-muted">{m.def}</td><td className="p-3">{m.why}</td><td className="p-3"><Badge tone="primary">{m.target}</Badge></td></tr>)}</tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted">Instrumentation plan: product events (event_created, conflict_detected, conflict_resolved, proposal_generated, proposal_approved, rsvp_submitted, calendar_connected) with role and platform properties, no personal data in event payloads. Targets are starting hypotheses to recalibrate after the first season.</p>
        </Section>
      </div>
    </>
  );
}
