import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/blocks";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Technical skills" };

const groups: { title: string; items: string[]; evidence: [string, string][] }[] = [
  { title: "Product & UX design", items: ["Problem framing & hypotheses", "Research planning (interviews, surveys)", "Personas, JTBD, journey & opportunity mapping", "Information architecture", "User flows & decision trees", "Wireframing (lo / mid / hi-fi)", "Interaction & state design", "Usability test planning"], evidence: [["SportSync research", "/research/"], ["IA & flows", "/architecture/"], ["Wireframes", "/wireframes/"]] },
  { title: "UI & design systems", items: ["Semantic design tokens (light/dark)", "Component APIs with variants & states", "Typography & layout grids", "WCAG 2.2 AA accessibility", "Cross-platform conventions (web, iOS, Android)"], evidence: [["Design system", "/design-system/"], ["Platforms", "/prototypes/#platforms"]] },
  { title: "Front-end development", items: ["HTML, CSS, JavaScript", "TypeScript", "React & Next.js (App Router)", "Tailwind CSS", "Recharts data visualisation", "Responsive & accessible UI"], evidence: [["SportSync prototype", "/demo/"], ["WideKonek", "/projects/widekonek/"]] },
  { title: "Back-end & data", items: ["Supabase (Auth, Postgres, Storage)", "Row Level Security policies", "Relational data modelling", "REST API design", "CSV / iCalendar formats", "Data analysis & reporting"], evidence: [["WideKonek", "/projects/widekonek/"], ["API & schema", "/engineering/"]] },
  { title: "Automation & AI", items: ["AI-assisted software development", "Explainable rule-based scheduling engine", "n8n workflow design", "CRM workflow design (HubSpot handover)", "Transparent labeling of simulated AI"], evidence: [["AI assistant", "/demo/assistant/"], ["ZC Smart Digital", "/projects/zc-smart-digital/"]] },
  { title: "Quality & delivery", items: ["Requirements, user stories, acceptance criteria", "Traceability matrices", "Unit testing (node:test)", "End-to-end testing (Playwright)", "QA checklists, release checklists", "Static hosting & deployment (Vercel, Cloudflare)"], evidence: [["Engineering handoff", "/engineering/"], ["Documents", "/docs/"]] },
  { title: "Transferable strengths", items: ["Systems thinking (chemical engineering)", "Evidence-based inquiry (criminology)", "Process improvement & public service design (public administration)", "Instructional design & clear communication (teaching)", "Research & data analysis"], evidence: [["About me", "/about/"]] },
];

export default function Skills() {
  return (
    <>
      <PageHeader eyebrow="Skills" title="Technical skills" intro="Listed with links to where you can see each skill used. No self-rated proficiency bars, just evidence." />
      <div className="container-page grid gap-5 py-12 md:grid-cols-2">
        {groups.map((g) => (
          <section key={g.title} className="card p-6" aria-labelledby={g.title.replace(/\W+/g, "-")}>
            <h2 id={g.title.replace(/\W+/g, "-")} className="text-lg font-semibold">{g.title}</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">{g.items.map((i) => <Badge key={i} tone="outline" className="whitespace-normal text-[13px]">{i}</Badge>)}</div>
            <p className="mt-4 text-sm text-muted">Evidence: {g.evidence.map(([l, h], i) => <span key={h}>{i > 0 && " · "}<Link href={h} className="font-medium text-info hover:underline">{l}</Link></span>)}</p>
          </section>
        ))}
      </div>
    </>
  );
}
