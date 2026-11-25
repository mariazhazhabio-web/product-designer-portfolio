import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { profile } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { Honesty } from "@/components/site/blocks";

export const metadata: Metadata = { title: "Resume" };

export default function Resume() {
  return (
    <div className="container-page py-12">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Resume</h1>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/downloads/maria-bio-resume.pdf" download><Download aria-hidden />Download PDF</ButtonLink>
          <ButtonLink href="/docs/resume/" variant="outline"><FileText aria-hidden />ATS plain-text version</ButtonLink>
        </div>
      </div>
      <div className="no-print mb-6"><Honesty>This web version lists only verified information. Employment history and dates are added by Maria in the ATS version (<code>docs/resume.md</code>) before sending. Nothing here overstates UI/UX experience: design work shown is from independent and founder projects.</Honesty></div>
      <article className="card mx-auto max-w-3xl p-8 sm:p-12">
        <header className="border-b border-border pb-5">
          <h2 className="text-3xl font-semibold">{profile.name}</h2>
          <p className="mt-1 text-primary">{profile.title}</p>
          {(profile.location || profile.contactEmail || profile.linkedin) && <p className="mt-2 text-sm text-muted">{[profile.location, profile.contactEmail, profile.linkedin].filter(Boolean).join(" · ")}</p>}
        </header>
        <section className="mt-6"><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Summary</h3>
          <p className="mt-2 text-sm leading-relaxed">Product designer with a multidisciplinary background in digital product development, systems management, process improvement, instructional design, research and data analysis. Designs and builds end-to-end digital products using AI-assisted development, with a focus on explainable automation, accessible interfaces and clear engineering handoff. Portfolio: SportSync (AI-assisted sports scheduling concept with working prototype), WideKonek, Frendora and ZC Smart Digital.</p></section>
        <section className="mt-6"><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Product design & development projects</h3>
          <div className="mt-3 space-y-4 text-sm">
            <div><p className="font-semibold">SportSync: AI-assisted sports scheduling (independent portfolio project)</p><ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted"><li>Designed the end-to-end scheduling lifecycle for six roles: research plan, 5 provisional personas, 9 user flows, 28 screens in three fidelities.</li><li>Built a working Next.js/TypeScript prototype with a rule-based scheduling and conflict engine (10 conflict types, ranked alternatives, explainable tournament generation).</li><li>Created a token-based design system targeting WCAG 2.2 AA, plus PRD, API/DB specs, QA plan, traceability matrix, unit and Playwright tests.</li></ul></div>
            <div><p className="font-semibold">WideKonek: networking, recruitment & freelance marketplace (founder)</p><ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted"><li>Designed and developed onboarding, profiles, job posting, applicant pipeline, freelance services and orders, feed, and admin moderation.</li><li>Implemented database-level security (Row Level Security) covered by 196 automated database tests.</li></ul></div>
            <div><p className="font-semibold">ZC Smart Digital: digital solutions & automation (founder)</p><ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted"><li>Built six client-style demos (listing site, lead-to-CRM workflow, booking app, marketing dashboard, ad set, explainer video) and an n8n/HubSpot handover design.</li></ul></div>
            <div><p className="font-semibold">Frendora: social networking & communication (founder)</p><ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted"><li>Product concept for a privacy-first, mobile-first social and messaging platform.</li></ul></div>
          </div></section>
        <section className="mt-6"><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Skills</h3>
          <p className="mt-2 text-sm text-muted"><strong className="text-text">UX:</strong> research planning, personas, JTBD, journey mapping, IA, user flows, wireframing, prototyping, usability test planning, accessibility (WCAG 2.2). <strong className="text-text">UI:</strong> design systems, design tokens, responsive and cross-platform design. <strong className="text-text">Build:</strong> TypeScript, React, Next.js, Tailwind CSS, Supabase/PostgreSQL, Recharts, Playwright, n8n. <strong className="text-text">Other:</strong> data analysis, process improvement, instructional design, AI-assisted development.</p></section>
        <section className="mt-6"><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Education</h3>
          <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm">{profile.education.map((e) => <li key={e}>{e}</li>)}</ul></section>
      </article>
      <p className="no-print mt-6 text-center text-sm text-muted">Also see the <Link href="/docs/cover-letter/" className="text-info underline">tailored cover letter</Link> and <Link href="/docs/portfolio-introduction/" className="text-info underline">portfolio introduction</Link>.</p>
    </div>
  );
}
