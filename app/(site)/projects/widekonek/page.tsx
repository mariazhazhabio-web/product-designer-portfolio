import type { Metadata } from "next";
import { CaseHero, FeatureTable, Honesty, Section, Showcase, type FeatureRow } from "@/components/site/case-study";

export const metadata: Metadata = { title: "WideKonek case study", description: "WideKonek: professional networking, recruitment and freelance marketplace platform." };

// Status sourced from WideKonek's own docs/ARCHITECTURE.md and commit history (Nov 2026).
const rows: FeatureRow[] = [
  { area: "Onboarding", feature: "Register with role choice, email verification, login, password reset", status: "done", note: "Implemented; workflow tests with simulated Supabase Auth" },
  { area: "Profiles", feature: "Professional profile (skills, experience, education) and public profile page", status: "done", note: "Implemented; workflow tests" },
  { area: "Profiles", feature: "Profile photos and post images", status: "proposed", note: "Storage buckets exist; UI labeled “coming”" },
  { area: "Talent discovery", feature: "Professionals directory; unverified sign-ups hidden until email confirmed", status: "done", note: "Implemented" },
  { area: "Job posting", feature: "Company profile, job posting, search, filters, pagination", status: "done", note: "Implemented; workflow tests" },
  { area: "Recruitment", feature: "Applications with PDF resume; employer pipeline Applied → Hired / Not selected; status notifications", status: "done", note: "Implemented; 196 database security tests incl. employer isolation" },
  { area: "Freelance marketplace", feature: "Services (gigs), client inquiries, gig orders with milestones", status: "done", note: "Implemented without payments" },
  { area: "Freelance marketplace", feature: "Freelancer dashboard: verified badges, profile and gig analytics", status: "done", note: "Phases 1–5 committed" },
  { area: "Freelance marketplace", feature: "Client projects and proposals", status: "proposed", note: "Phase 3 freelance roadmap" },
  { area: "Networking", feature: "Posts, chronological feed, likes, follow, network list", status: "done", note: "Implemented" },
  { area: "Networking", feature: "Connection requests, comments UI", status: "proposed", note: "Phase 2 social roadmap" },
  { area: "Messaging", feature: "Direct messaging", status: "proposed", note: "Page scaffold exists; not built" },
  { area: "Trust & safety", feature: "Report content, block members, privacy settings, deactivate/reactivate; admin moderation & audit log", status: "done", note: "Implemented; RLS on every table" },
  { area: "Identity verification", feature: "Government ID / liveness verification workflow", status: "wip", note: "Options researched (docs/ID-VERIFICATION-OPTIONS.md); provider not chosen" },
  { area: "Monetization", feature: "Admin commission setting; payments & withdrawals", status: "wip", note: "Commission setting built; payment providers researched, not integrated. Pending Maria's approval of prices/providers" },
  { area: "Integrations", feature: "VAspire Academy credentials integration", status: "wip", note: "WideKonek side built and security-reviewed; not yet connected" },
  { area: "Responsive UI", feature: "Mobile navigation, no horizontal overflow 320–1024 px", status: "done", note: "Verified on public pages; dashboard pages need Supabase to view" },
  { area: "Hosting", feature: "Private Cloudflare preview behind Access", status: "wip", note: "Real Supabase email delivery and production deploy still to be verified" },
];

export default function WideKonek() {
  return (
    <>
      <CaseHero eyebrow="Case study · Founder project" name="WideKonek" tagline="Connect Beyond Borders" color="#0b1f4d"
        intro="A professional networking, recruitment and freelance marketplace for the Philippines and beyond: one place to build a profile, get hired, hire, and sell services."
        facts={[["Role", "Founder · product, UX, AI-assisted full-stack"], ["Stack", "Next.js 16 · TypeScript · Supabase · Tailwind"], ["Security", "Row Level Security on every table"], ["Status", "Phase 1 implemented · private preview"]]} />
      <div className="container-page pt-16">
        <Honesty>Statuses below come from WideKonek&apos;s own architecture document and commit history. “Completed” means implemented and covered by automated tests in the development environment; some flows still need verification on a production Supabase project. No user numbers or business results are claimed.</Honesty>
        <Section id="problem" title="The problem" intro="Filipino professionals and freelancers often juggle separate sites for networking, job hunting and selling services, while employers struggle to verify who they're hiring. WideKonek combines all three with trust and safety built in from the database up." />
        <Section id="showcase" title="Experience highlights">
          <Showcase items={[
            { title: "Professional networking", status: "done", body: "Profiles, posts, a chronological feed, likes and follows, kept deliberately calm and professional.", points: ["Chronological feed (no engagement ranking)", "Follow + network list", "Saved posts"] },
            { title: "Talent discovery & job posting", status: "done", body: "Employers create company pages, post jobs and search professionals with filters.", points: ["Search, filters, pagination", "Unverified accounts hidden", "Company profiles"] },
            { title: "Recruitment workflow", status: "done", body: "A visible pipeline for both sides: applicants always know where they stand.", points: ["Applied → … → Hired / Not selected pipeline", "Progress tracker for applicants", "Status notifications"] },
            { title: "Freelance service marketplace", status: "done", body: "Freelancers publish gigs; clients send inquiries and place milestone-based orders.", points: ["Gig listings and editing", "Orders with milestones (no payments yet)", "Gig and profile analytics"] },
            { title: "Onboarding & profile management", status: "done", body: "Role choice at sign-up shapes the dashboard: professional, employer, freelancer.", points: ["Email verification", "Guided professional profile", "Privacy settings and data export"] },
            { title: "Messaging", status: "proposed", body: "Planned direct messaging between members, employers and clients, with rate limits and reporting.", points: ["Conversation list + thread", "Block/report from any message", "Safety nudges for off-platform payment requests"] },
            { title: "Identity verification", status: "wip", body: "Researching ID + liveness providers to issue verified badges without storing ID images.", points: ["Provider comparison done", "Verified badge UI exists", "Provider not selected"] },
            { title: "Monetization design", status: "wip", body: "Commission on completed gig orders; admin-configurable rate. Payments only after price and provider approval.", points: ["Admin commission setting built", "Payment/withdrawal options researched", "No ₱0 gigs allowed"] },
            { title: "Responsive interfaces", status: "done", body: "Mobile-first layouts tested at 320, 375, 390, 768 and 1024 px.", points: ["Mobile header and dashboard menu", "No horizontal overflow on public pages"] },
          ]} />
        </Section>
        <Section id="brand" title="Brand system (preserved)" intro="WideKonek's existing tokens: Deep Navy, Royal Blue and Teal. Teal is used for fills only because it fails contrast as text on white (≈1.9:1), a decision documented in the codebase.">
          <div className="flex flex-wrap gap-3">{[["Deep Navy", "#0B1F4D"], ["Royal Blue", "#2563EB"], ["Cyan/Teal", "#06D6A0"], ["Soft Gray", "#E5E7EB"], ["White", "#FFFFFF"]].map(([n, h]) => <div key={n} className="w-36 overflow-hidden rounded-xl border border-border"><div className="h-16" style={{ background: h }} /><div className="p-2 text-xs"><p className="font-semibold">{n}</p><p className="font-mono text-muted">{h}</p></div></div>)}</div>
        </Section>
        <Section id="status" title="Completed, in progress & proposed"><FeatureTable rows={rows} /></Section>
        <Section id="learned" title="What I learned">
          <ul className="grid gap-3 md:grid-cols-3 text-sm">
            {["Security is a UX feature: putting access rules in the database meant a page bug can't leak another employer's applicants.", "Two-sided marketplaces need two journeys designed together; the applicant progress tracker came from mapping the employer pipeline.", "Labeling unfinished features as “coming” keeps trust higher than hiding them or shipping half-working screens."].map((x) => <li key={x} className="card p-4">{x}</li>)}
          </ul>
        </Section>
      </div>
    </>
  );
}
