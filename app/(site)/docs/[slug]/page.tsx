import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Download } from "lucide-react";
import { listDocs, readDoc } from "@/lib/docs";
import { withBase } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return listDocs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = readDoc(slug);
  return { title: d?.title ?? "Document", description: d?.summary };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = readDoc(slug);
  if (!d) notFound();
  return (
    <div className="container-page py-10">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/docs/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-text"><ArrowLeft className="size-4" aria-hidden />All documents</Link>
        <a href={withBase(`/downloads/docs/${slug}.md`)} download className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium hover:bg-surface-2"><Download className="size-4" aria-hidden />Download .md</a>
      </div>
      <article className="card prose-doc mx-auto max-w-4xl p-6 sm:p-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => {
              const h = href ?? "";
              if (h.startsWith("/")) return <Link href={h}>{children}</Link>;
              return <a href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a>;
            },
          }}>{d.body}</ReactMarkdown>
      </article>
    </div>
  );
}
