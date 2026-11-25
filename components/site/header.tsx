"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, Moon, Sun, X } from "lucide-react";
import { allPages, primaryNav, profile } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* ignore */ }
  };
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} className={className}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-[family-name:var(--font-display)] font-semibold tracking-tight" aria-label={`${profile.name}, home`}>
      <span aria-hidden className="flex size-8 items-center justify-center rounded-lg bg-text text-sm font-bold text-bg">MB</span>
      <span className="hidden whitespace-nowrap sm:inline">Maria Bio</span>
      <span className="hidden whitespace-nowrap text-sm font-normal text-muted lg:inline">· Product Designer</span>
    </Link>
  );
}

export function SiteHeader() {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [path]);
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2">Skip to content</a>
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />
        <nav aria-label="Primary" className="ml-auto hidden items-center gap-0.5 xl:flex">
          {primaryNav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}
              className={cn("whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors", active(n.href) ? "bg-surface-2 text-text" : "text-muted hover:text-text")}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 xl:ml-2">
          <ButtonLink href="/role-alignment/" variant="outline" size="sm" className="hidden sm:inline-flex">Role alignment</ButtonLink>
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-expanded={menu} aria-controls="all-pages" aria-label="All pages" onClick={() => setMenu((m) => !m)}>
            {menu ? <X /> : <LayoutGrid />}
          </Button>
        </div>
      </div>
      {menu && (
        <div id="all-pages" className="border-t border-border bg-surface shadow-lg">
          <nav aria-label="All pages" className="container-page grid max-h-[75vh] gap-6 overflow-y-auto py-6 sm:grid-cols-2 lg:grid-cols-4">
            {allPages.map((g) => (
              <div key={g.group}>
                <p className="eyebrow mb-2">{g.group}</p>
                <ul className="space-y-1">
                  {g.items.map((i) => (
                    <li key={i.href}>
                      <Link href={i.href} className={cn("block rounded-md px-2 py-1.5 text-sm hover:bg-surface-2", active(i.href) && i.href !== "/" ? "font-semibold text-primary" : "text-text")}>{i.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-24 border-t border-border">
      <div className="container-page grid gap-8 py-10 text-sm md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-muted">{profile.title}</p>
          <p className="mt-3 max-w-md text-xs text-subtle">
            SportSync is an independent product design and development portfolio project. It is not affiliated with, commissioned by, or endorsed by TeamSnap or any other company. All people, teams and data in the demo are fictional.
          </p>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <ul className="mt-2 space-y-1.5 text-muted">
            <li><Link className="hover:text-text" href="/projects/sportsync/">SportSync case study</Link></li>
            <li><Link className="hover:text-text" href="/demo/">Live prototype</Link></li>
            <li><Link className="hover:text-text" href="/design-system/">Design system</Link></li>
            <li><Link className="hover:text-text" href="/docs/">Documents</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Get in touch</p>
          <ul className="mt-2 space-y-1.5 text-muted">
            <li><Link className="hover:text-text" href="/contact/">Contact</Link></li>
            <li><Link className="hover:text-text" href="/resume/">Resume</Link></li>
            <li><Link className="hover:text-text" href="/role-alignment/">Role alignment</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-page border-t border-border py-5 text-xs text-subtle">© {new Date().getFullYear()} {profile.name}. Built with Next.js, TypeScript and Tailwind CSS.</div>
    </footer>
  );
}
