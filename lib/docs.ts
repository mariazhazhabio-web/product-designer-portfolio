import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "docs");

export const DOC_GROUPS: { group: string; slugs: string[] }[] = [
  { group: "Job application", slugs: ["resume", "portfolio-introduction", "sportsync-one-pager", "interview-prep", "case-study-script", "walkthrough-script"] },
  { group: "UX research", slugs: ["research-plan", "interview-guide", "survey", "research-synthesis-template"] },
  { group: "Usability testing", slugs: ["usability-test-plan", "iteration-report-template"] },
  { group: "Engineering handoff", slugs: ["prd", "user-stories", "component-specs", "api-spec", "database-schema", "responsive-a11y-specs", "edge-cases", "traceability", "backlog"] },
  { group: "QA & release", slugs: ["qa-test-plan", "bug-report-template", "release-checklist"] },
  { group: "Design system & project", slugs: ["figma-handoff", "deployment-guide"] },
];

/** Application-specific documents: built and reachable by direct link, but not listed in the library. */
export const UNLISTED_DOCS = ["resume-teamsnap", "proposal-teamsnap", "cover-letter"];

export function listDocs() {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export function readDoc(slug: string) {
  const file = path.join(DIR, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const title = raw.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? slug;
  const summary = raw.split("\n").find((l) => l.trim() && !l.startsWith("#") && !l.startsWith(">") && !l.startsWith("|") && !l.startsWith("-"))?.trim() ?? "";
  return { slug, title, summary, body: raw };
}
