import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Download } from "lucide-react";
import { Honesty, PageHeader, Section } from "@/components/site/blocks";
import { LiveComponents } from "@/components/site/ds-live";
import { breakpoints, color, contrast, elevation, grid, radius, spacing, typography } from "@/content/tokens";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Design system", description: "SportSync design foundations, tokens and components with states, built for WCAG 2.2 AA." };

const pairs: [string, string, string][] = [
  ["text", "bg", "Body text"], ["muted", "bg", "Secondary text"], ["subtle", "surface", "Tertiary text"], ["primary", "surface", "Primary / links"], ["primary-fg", "primary", "Text on primary"],
  ["accent", "surface", "Accent text"], ["danger", "danger-soft", "Error alert"], ["warning", "warning-soft", "Warning alert"], ["success", "success-soft", "Success alert"], ["info", "info-soft", "Info alert"],
];

const ICONS = ["CalendarDays", "Sparkles", "AlertTriangle", "UserCheck", "Users", "Building2", "Bell", "RefreshCw", "FileUp", "Trophy", "Dumbbell", "Clock", "MapPin", "Repeat", "Undo2", "Lock", "WifiOff", "Settings"] as const;

export default function DesignSystemPage() {
  const groups: [string, string[]][] = [
    ["Neutrals", ["bg", "surface", "surface-2", "surface-3", "border", "border-strong", "text", "muted", "subtle"]],
    ["Brand", ["primary", "primary-hover", "primary-soft", "accent", "accent-soft"]],
    ["Status", ["info", "info-soft", "success", "success-soft", "warning", "warning-soft", "danger", "danger-soft"]],
    ["Event types", ["ev-game", "ev-practice", "ev-tournament", "ev-meeting"]],
  ];
  const L = color.light as Record<string, string>;
  const Dk = color.dark as Record<string, string>;
  return (
    <>
      <PageHeader eyebrow="SportSync · Design system" title="Foundations, tokens & components"
        intro="One semantic token layer powers light and dark themes, the portfolio and the prototype. Components are documented with their states and accessibility behaviour.">
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/downloads/tokens.json" download variant="outline"><Download aria-hidden />tokens.json (W3C format)</ButtonLink>
          <ButtonLink href="/docs/figma-handoff/" variant="outline">Figma handoff package & import steps</ButtonLink>
          <ButtonLink href="/docs/component-specs/" variant="outline">Component specifications</ButtonLink>
        </div>
      </PageHeader>
      <div className="container-page">
        <div className="pt-10"><Honesty><strong>About Figma:</strong> no Figma file has been created yet. This page plus the <Link className="underline" href="/docs/figma-handoff/">handoff package</Link> (tokens JSON, SVG icons, component specs and screen layouts) is structured so the library can be rebuilt in Figma with Variables and auto layout. See the import steps.</Honesty></div>

        <Section id="color" title="Color palette" intro="Semantic names describe purpose, not hue, so themes can change without touching components.">
          <div className="space-y-6">
            {groups.map(([g, keys]) => (
              <div key={g}>
                <p className="mb-2 text-sm font-semibold">{g}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
                  {keys.map((k) => (
                    <div key={k} className="overflow-hidden rounded-xl border border-border">
                      <div className="flex h-16"><span className="flex-1" style={{ background: L[k] }} /><span className="flex-1" style={{ background: Dk[k] }} /></div>
                      <div className="p-2 text-xs"><p className="font-semibold">{k}</p><p className="break-all font-mono text-muted">{L[k]} / {Dk[k]}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">Each swatch: light value (left), dark value (right).</p>
        </Section>

        <Section id="contrast" title="Contrast checks (WCAG 2.2 AA)" intro="Calculated from the token values at build time. AA requires 4.5:1 for normal text and 3:1 for large text and UI components.">
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">Pair</th><th className="p-3">Use</th><th className="p-3">Light</th><th className="p-3">Dark</th></tr></thead>
              <tbody>{pairs.map(([fg, bgk, use]) => {
                const l = contrast(L[fg], L[bgk]); const d = contrast(Dk[fg], Dk[bgk]);
                const cell = (v: number, f: string, b: string) => <span className="inline-flex items-center gap-2"><span className="rounded px-2 py-0.5 text-xs font-semibold" style={{ color: f, background: b }}>Aa</span><span className="tabular-nums">{v}:1</span><Badge tone={v >= 4.5 ? "success" : v >= 3 ? "warning" : "danger"}>{v >= 7 ? "AAA" : v >= 4.5 ? "AA" : v >= 3 ? "AA large" : "Fail"}</Badge></span>;
                return <tr key={fg + bgk} className="border-t border-border"><td className="p-3 font-mono text-xs">{fg} on {bgk}</td><td className="p-3">{use}</td><td className="p-3">{cell(l, L[fg], L[bgk])}</td><td className="p-3">{cell(d, Dk[fg], Dk[bgk])}</td></tr>;
              })}</tbody>
            </table>
          </div>
        </Section>

        <Section id="type" title="Typography" intro="Space Grotesk for display (friendly, sporty, legible numerals); Inter for UI text. Minimum body size 14px; tabular numerals for times and scores.">
          <div className="card divide-y divide-border">
            {typography.map((t) => (
              <div key={t.token} className="grid items-baseline gap-2 p-4 sm:grid-cols-[10rem_1fr_12rem]">
                <p className="font-mono text-xs text-muted">{t.token}</p>
                <p className="truncate" style={{ fontSize: Math.min(t.size, 48), lineHeight: t.line, fontWeight: t.weight, fontFamily: t.family === "Inter" ? "var(--font-sans)" : "var(--font-display)" }}>Smarter scheduling</p>
                <p className="text-xs text-muted">{t.family} {t.weight} · {t.size}/{Math.round(t.size * t.line)} · {t.use}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="spacing" title="Spacing, radius, elevation & grids">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="card p-5"><p className="mb-3 font-semibold">Spacing scale (4px base)</p><div className="space-y-1.5">{spacing.filter(Boolean).map((s) => <div key={s} className="flex items-center gap-3 text-xs"><span className="w-10 font-mono text-muted">{s}px</span><span className="h-3 rounded bg-primary" style={{ width: s * 2 }} /></div>)}</div></div>
            <div className="space-y-5">
              <div className="card p-5"><p className="mb-3 font-semibold">Radius</p><div className="flex flex-wrap gap-3">{Object.entries(radius).map(([k, v]) => <div key={k} className="text-center text-xs"><div className="size-14 border-2 border-primary bg-primary-soft" style={{ borderRadius: Math.min(v, 28) }} /><p className="mt-1 font-mono">{k}</p></div>)}</div></div>
              <div className="card p-5"><p className="mb-3 font-semibold">Elevation</p><div className="flex flex-wrap gap-5">{Object.entries(elevation).map(([k, v]) => <div key={k} className="flex size-24 items-center justify-center rounded-xl bg-surface text-xs" style={{ boxShadow: v }}>{k}</div>)}</div></div>
              <div className="card overflow-x-auto p-5"><p className="mb-3 font-semibold">Layout grids & breakpoints</p>
                <table className="w-full min-w-[380px] text-xs"><thead className="text-left text-muted"><tr><th className="py-1">Context</th><th>Cols</th><th>Gutter</th><th>Margin</th><th>Max width</th></tr></thead><tbody>{grid.map((g) => <tr key={g.name} className="border-t border-border"><td className="py-1.5">{g.name}</td><td>{g.columns}</td><td>{g.gutter}</td><td>{g.margin}</td><td>{g.max}</td></tr>)}</tbody></table>
                <p className="mt-2 text-xs text-muted">Breakpoints: {Object.entries(breakpoints).map(([k, v]) => `${k} ${v}px`).join(" · ")}</p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="icons" title="Icons" intro="Lucide (open source, ISC license). 16px in dense UI, 20px in navigation, 1.5–2px stroke. Decorative icons are aria-hidden; icon-only buttons always have an accessible name.">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
            {ICONS.map((n) => { const I = Icons[n] as Icons.LucideIcon; return <div key={n} className="card flex flex-col items-center gap-2 p-3 text-center"><I className="size-5" aria-hidden /><span className="text-[10px] text-muted">{n}</span></div>; })}
          </div>
        </Section>

        <Section id="components" title="Components & interactive states" intro="Live components from the prototype's own library. Tab through them to see focus states; toggle dark mode in the header.">
          <LiveComponents />
        </Section>

        <Section id="a11y" title="Accessibility principles (WCAG 2.2 AA)">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {[["Contrast", "Token pairs checked above; status never conveyed by color alone."], ["Keyboard", "Every action reachable by keyboard; tabs use arrow keys; dialogs trap focus and close on Esc."], ["Focus visible (2.4.7 / 2.4.11)", "2px high-contrast ring with offset on every interactive element; sticky headers don't obscure focus."], ["Target size (2.5.8)", "Interactive targets ≥ 24×24px; primary actions 40px; mobile tab bar 48px+."], ["Labels & names", "Visible labels on every input; icon buttons have aria-labels; calendar events announce time and conflict state."], ["Motion", "Animations respect prefers-reduced-motion."], ["Errors (3.3)", "Inline, specific messages that say how to fix; no reliance on placeholder text."], ["Consistent help (3.2.6)", "Help and status banners appear in the same place on every screen."], ["Redundant entry (3.3.7)", "Duplicate, recurring events and suggestions avoid re-typing."]].map(([t, d]) => <div key={t} className="card p-4"><p className="font-semibold">{t}</p><p className="mt-1 text-muted">{d}</p></div>)}
          </div>
        </Section>
      </div>
    </>
  );
}
