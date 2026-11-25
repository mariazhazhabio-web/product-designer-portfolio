import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/site/blocks";
import { DOC_GROUPS, listDocs, readDoc } from "@/lib/docs";

export const metadata: Metadata = { title: "Documents library", description: "Research, testing, engineering, QA and job application documents for the portfolio." };

export default function DocsIndex() {
  const all = new Set(listDocs());
  const grouped = new Set(DOC_GROUPS.flatMap((g) => g.slugs));
  const extra = [...all].filter((s) => !grouped.has(s));
  const groups = [...DOC_GROUPS, ...(extra.length ? [{ group: "Other", slugs: extra }] : [])];
  return (
    <>
      <PageHeader eyebrow="Documents" title="Documents library" intro="Every planning, research, testing, engineering and application document. Each is a Markdown file in the repository's docs/ folder, so it can be copied into Notion, Google Docs or Word." />
      <div className="container-page space-y-10 py-12">
        {groups.map((g) => (
          <section key={g.group} aria-labelledby={g.group}>
            <h2 id={g.group} className="mb-3 text-lg font-semibold">{g.group}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.slugs.filter((s) => all.has(s)).map((s) => {
                const d = readDoc(s)!;
                return (
                  <li key={s}><Link href={`/docs/${s}/`} className="card flex h-full gap-3 p-4 hover:border-border-strong">
                    <FileText className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <span><span className="block font-semibold">{d.title}</span><span className="line-clamp-2 text-sm text-muted">{d.summary}</span></span>
                  </Link></li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
