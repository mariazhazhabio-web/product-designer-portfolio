import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-semibold">This page isn&apos;t on the schedule</h1>
        <p className="mt-3 max-w-md text-muted">The link may be outdated. Try the home page, the SportSync case study or the live prototype.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-fg">Home</Link>
          <Link href="/projects/sportsync/" className="rounded-lg border border-border-strong px-4 py-2.5 text-sm font-medium">Case study</Link>
          <Link href="/demo/" className="rounded-lg border border-border-strong px-4 py-2.5 text-sm font-medium">Prototype</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
