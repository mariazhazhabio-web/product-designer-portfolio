export type FeatureStatus = "done" | "wip" | "proposed" | "pending";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  color: string;
  role: string;
  stack: string[];
  status: string;
}

export const projects: Project[] = [
  {
    slug: "sportsync", name: "SportSync", tagline: "Smarter Scheduling. Stronger Teams.", color: "#0b6e5b",
    summary: "AI-assisted sports scheduling and team management concept with a working prototype, research kit, design system and engineering handoff.",
    role: "Independent project: research planning, UX/UI, design system, front-end prototype", stack: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "Playwright"], status: "Prototype complete · research & testing pending",
  },
  {
    slug: "widekonek", name: "WideKonek", tagline: "Connect Beyond Borders", color: "#0b1f4d",
    summary: "Professional networking, recruitment and freelance marketplace for the Philippines and beyond, built on Next.js and Supabase.",
    role: "Founder: product, UX, and AI-assisted full-stack development", stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Cloudflare"], status: "Phase 1 implemented · further phases planned",
  },
  {
    slug: "frendora", name: "Frendora", tagline: "Social networking and communication", color: "#7c3aed",
    summary: "Mobile-first social networking and communication concept: feed, connections, moments, chat and calling, with privacy and safety at the core.",
    role: "Founder: product concept and UX", stack: ["Concept / design phase"], status: "Status to be confirmed by Maria",
  },
  {
    slug: "zc-smart-digital", name: "ZC Smart Digital", tagline: "Digital solutions and automation services", color: "#0b1f3a",
    summary: "Digital solutions brand: websites, automation and integrations, CRM workflows and reporting dashboards, showcased through six working demos.",
    role: "Founder: service design, web development, automation", stack: ["HTML/CSS/JS", "n8n", "HubSpot (planned)", "Dashboards"], status: "Six demos built and tested locally · publishing pending",
  },
];
