"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { demoSeries } from "@/content/delivery";

const axis = { stroke: "var(--subtle)", fontSize: 12 };
const tip = { contentStyle: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 12 } };

function ChartCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <figure className="card p-5">
      <figcaption className="mb-3"><p className="font-semibold">{title}</p><p className="text-xs text-muted">{desc}</p></figcaption>
      <div className="h-64">{children}</div>
    </figure>
  );
}

export function MetricsCharts() {
  const w = demoSeries.weekly;
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ChartCard title="Schedule creation completion & RSVP response rate (%)" desc="Weekly, demonstration data">
        <ResponsiveContainer><LineChart data={w} margin={{ left: -16, right: 8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="week" {...axis} /><YAxis domain={[40, 100]} {...axis} /><Tooltip {...tip} /><Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="completion" name="Creation completion" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="rsvp" name="RSVP response" stroke="var(--info)" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 3 }} />
          <Line type="monotone" dataKey="aiAccept" name="AI acceptance" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="2 3" dot={{ r: 3 }} />
        </LineChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Conflict rate (%) & median time to build a tournament (min)" desc="Lower is better · demonstration data">
        <ResponsiveContainer><LineChart data={w} margin={{ left: -16, right: 8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="week" {...axis} /><YAxis yAxisId="l" {...axis} /><YAxis yAxisId="r" orientation="right" {...axis} /><Tooltip {...tip} /><Legend wrapperStyle={{ fontSize: 12 }} />
          <Line yAxisId="l" type="monotone" dataKey="conflictRate" name="Conflict rate %" stroke="var(--danger)" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line yAxisId="r" type="monotone" dataKey="timeMin" name="Time to schedule (min)" stroke="var(--ev-meeting)" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 3 }} />
        </LineChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Conflicts detected vs resolved within 48h" desc="By type · demonstration data">
        <ResponsiveContainer><BarChart data={demoSeries.conflicts} layout="vertical" margin={{ left: 40, right: 8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" /><XAxis type="number" {...axis} /><YAxis type="category" dataKey="kind" width={110} {...axis} /><Tooltip {...tip} cursor={{ fill: "var(--surface-2)" }} /><Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="detected" name="Detected" fill="var(--border-strong)" radius={[0, 4, 4, 0]} /><Bar dataKey="resolved" name="Resolved" fill="var(--primary)" radius={[0, 4, 4, 0]} />
        </BarChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Calendar sync adoption (% of active users)" desc="By method · demonstration data">
        <ResponsiveContainer><BarChart data={demoSeries.sync} margin={{ left: -16, right: 8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="name" {...axis} /><YAxis {...axis} /><Tooltip {...tip} cursor={{ fill: "var(--surface-2)" }} />
          <Bar dataKey="value" name="% of users" fill="var(--info)" radius={[4, 4, 0, 0]} />
        </BarChart></ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Retention by role (% active, weeks 1–4)" desc="Demonstration data">
        <ResponsiveContainer><LineChart data={["w1", "w2", "w3", "w4"].map((k) => ({ week: k.toUpperCase(), ...Object.fromEntries(demoSeries.retention.map((r) => [r.role, r[k as "w1"]])) }))} margin={{ left: -16, right: 8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="week" {...axis} /><YAxis domain={[40, 100]} {...axis} /><Tooltip {...tip} /><Legend wrapperStyle={{ fontSize: 12 }} />
          <Line dataKey="Admins" stroke="var(--primary)" strokeWidth={2.5} /><Line dataKey="Coaches" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="6 3" /><Line dataKey="Parents" stroke="var(--info)" strokeWidth={2.5} strokeDasharray="2 3" />
        </LineChart></ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
