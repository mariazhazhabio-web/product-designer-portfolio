import type { Metadata } from "next";
import { withBase } from "@/lib/utils";
import { CaseHero, FeatureTable, Honesty, Section, type FeatureRow } from "@/components/site/case-study";
import { StatusPill } from "@/components/site/blocks";

export const metadata: Metadata = { title: "ZC Smart Digital case study", description: "ZC Smart Digital: digital solutions and automation services, shown through six working demos." };

const demos = [
  { img: "demo-real-estate-listing", title: "Real Estate Listing Website", body: "Property search, listing pages and inquiry forms connected to a lead tracker.", shows: "Responsive web design · lead management" },
  { img: "demo-lead-to-crm", title: "Lead-to-CRM Workflow", body: "Website inquiries routed automatically to a CRM, email follow-up and team alerts.", shows: "Automation & integrations · CRM setup" },
  { img: "demo-marketing-dashboard", title: "Marketing Report Dashboard", body: "A simple monthly dashboard that brings campaign data into one view.", shows: "Data analytics & business reporting" },
  { img: "demo-booking-app", title: "Booking App Interface", body: "A mobile-friendly appointment booking experience for a service business.", shows: "Web/app development · client-facing flows" },
  { img: "demo-social-media-campaign", title: "Social Media Ad Campaign Set", body: "A coordinated set of ad creatives and captions for a product launch.", shows: "Marketing creative" },
  { img: "demo-ai-explainer-video", title: "AI Explainer Video", body: "A short AI-assisted video introducing a service, with captions and a narration script.", shows: "AI-assisted content" },
];

const rows: FeatureRow[] = [
  { area: "Web development", feature: "Six demo pages with shared “Back to Demos” frame", status: "done", note: "Built and tested locally" },
  { area: "Responsive website design", feature: "Real estate listing site; booking app (mobile-friendly)", status: "done", note: "Demos built" },
  { area: "Lead management", feature: "Inquiry forms → lead tracker (browser storage)", status: "done", note: "Demo shares storage between listing site and CRM view" },
  { area: "Automation & integrations", feature: "n8n workflow: webhook → HubSpot upsert → deal → note → emails", status: "wip", note: "11-node JSON generated and structurally checked; not yet imported into a running n8n" },
  { area: "CRM setup", feature: "Live HubSpot integration (private app, custom deal properties)", status: "proposed", note: "Step-by-step handover written; needs client credentials" },
  { area: "Workflow automation", feature: "Repeat-inquiry handling (1 contact, 1 deal, many notes)", status: "done", note: "Implemented in demo logic; mirrored in n8n design" },
  { area: "Data analytics & reporting", feature: "Marketing dashboard with sample CSV", status: "done", note: "Demo with sample data" },
  { area: "Client onboarding", feature: "Discovery → proposal → kickoff → handover flow for ZC clients", status: "proposed", note: "Service blueprint below" },
  { area: "Publishing", feature: "Demos live on zcsmartdigital.com/#portfolio", status: "pending", note: "Upload steps documented; site source access needed" },
];

export default function ZCSmartDigital() {
  return (
    <>
      <CaseHero eyebrow="Case study · Founder brand" name="ZC Smart Digital" tagline="Digital solutions & automation services" color="#0b1f3a"
        intro="A services brand helping small businesses get a modern website, automate lead handling, set up a CRM and see their numbers, demonstrated with six working client-style demos."
        facts={[["Role", "Founder · service design, web dev, automation"], ["Tools", "HTML/CSS/JS · n8n · HubSpot (planned)"], ["Deliverables", "6 demos + n8n handover"], ["Status", "Built & tested locally · publishing pending"]]} />
      <div className="container-page pt-16">
        <Honesty>The demos use fictional businesses (e.g. “Harbor &amp; Home Realty”, “Lumi Beauty Studio”) and sample data. They are not client work and no business results are claimed. Preview images are the originals from the ZC Smart Digital demo package (unchanged).</Honesty>
        <Section id="demos" title="Six demos">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {demos.map((d) => (
              <figure key={d.img} className="overflow-hidden rounded-2xl border border-[#1D4E89]/40 bg-[#0b1f3a] text-white">
                <img src={withBase(`/projects/zc/${d.img}.webp`)} alt={`${d.title} demo preview`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                <figcaption className="p-4"><p className="font-semibold">{d.title}</p><p className="mt-1 text-sm text-white/75">{d.body}</p><p className="mt-3 text-xs font-medium text-[#F5D27A]">{d.shows}</p></figcaption>
              </figure>
            ))}
          </div>
        </Section>
        <Section id="automation" title="Workflow automation: lead to CRM" intro="Designed so repeat inquiries never create duplicate contacts or deals.">
          <ol className="grid gap-2 md:grid-cols-4 lg:grid-cols-8 text-xs">
            {["Website form POST (webhook)", "Normalize email; deal key = email + property", "Upsert contact by email", "Find deal for contact + property", "Exists? reuse : create deal “New Inquiry”", "Log inquiry as a note", "Acknowledge prospect by email", "Alert sales team"].map((s, i) => <li key={s} className="card p-3"><span className="font-bold text-accent">{i + 1}</span><p className="mt-1">{s}</p></li>)}
          </ol>
          <p className="mt-3 text-sm text-muted">Test plan from the handover: same email twice for the same property → 1 contact, 1 deal, 2 notes; different property → second deal. Credentials stay in n8n&apos;s credential store only.</p>
        </Section>
        <Section id="onboarding" title="Client onboarding (service blueprint)" intro={<span className="inline-flex items-center gap-2"><StatusPill status="proposed" />A proposed flow for ZC Smart Digital&apos;s own clients.</span>}>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="p-3">Lane</th>{["Discover", "Propose", "Kickoff", "Build", "Handover"].map((s) => <th key={s} className="p-3">{s}</th>)}</tr></thead>
              <tbody>
                {[["Client does", "Books a call via site", "Reviews scope & price", "Shares access & brand assets", "Reviews demo links", "Receives docs & training"], ["ZC does", "Discovery questions", "Fixed-scope proposal", "Access checklist, timeline", "Weekly preview + changelog", "Handover pack, 30-day support"], ["Tools", "Booking form → CRM", "Proposal template", "Secure credential sharing", "Staging site", "README, n8n export, videos"]].map((r) => <tr key={r[0]} className="border-t border-border"><th className="bg-surface-2 p-3 text-left text-xs font-semibold">{r[0]}</th>{r.slice(1).map((c) => <td key={c} className="p-3 text-muted">{c}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
        </Section>
        <Section id="brand" title="Brand (preserved)" intro="Navy, blue and gold from the existing demo frame.">
          <div className="flex flex-wrap gap-3">{[["Navy", "#0B1F3A"], ["Blue", "#1D4E89"], ["Gold", "#D4A63A"], ["Light gold", "#F5D27A"], ["Mist", "#E6EEFB"]].map(([n, h]) => <div key={n} className="w-32 overflow-hidden rounded-xl border border-border"><div className="h-14" style={{ background: h }} /><div className="p-2 text-xs"><p className="font-semibold">{n}</p><p className="font-mono text-muted">{h}</p></div></div>)}</div>
        </Section>
        <Section id="status" title="Completed, in progress & proposed"><FeatureTable rows={rows} /></Section>
      </div>
    </>
  );
}
