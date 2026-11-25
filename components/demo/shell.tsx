"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, ArrowLeft, Bell, Building2, CalendarDays, FileUp, Layers, LayoutDashboard, Menu, Plus, RefreshCw, Settings, Sparkles, Undo2, UserCheck, Users, WifiOff, X, Compass, Lock } from "lucide-react";
import type { Role, SportEvent } from "@/lib/sportsync/types";
import { useDemo } from "@/lib/sportsync/store";
import { ROLE_LABEL, ACTION_LABEL, type Action } from "@/lib/sportsync/permissions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, Skeleton } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/site/header";
import { EventFormDialog } from "./event-form";
import { EventDetailDialog } from "./event-detail";

interface EditorApi {
  openCreate: (prefill?: Partial<SportEvent>) => void;
  openEvent: (id: string) => void;
  openEdit: (ev: SportEvent) => void;
}
const EditorContext = createContext<EditorApi | null>(null);
export const useEditor = () => {
  const c = useContext(EditorContext);
  if (!c) throw new Error("useEditor must be used inside DemoShell");
  return c;
};

const NAV = [
  { href: "/demo/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/demo/calendar/", label: "Calendar", Icon: CalendarDays },
  { href: "/demo/assistant/", label: "AI assistant", Icon: Sparkles },
  { href: "/demo/conflicts/", label: "Conflicts", Icon: AlertTriangle },
  { href: "/demo/attendance/", label: "RSVP & attendance", Icon: UserCheck },
  { href: "/demo/teams/", label: "Teams & availability", Icon: Users },
  { href: "/demo/venues/", label: "Venues", Icon: Building2 },
  { href: "/demo/schedule-tools/", label: "Import, export & share", Icon: FileUp },
  { href: "/demo/sync/", label: "Calendar sync", Icon: RefreshCw },
  { href: "/demo/notifications/", label: "Notifications", Icon: Bell },
  { href: "/demo/settings/", label: "Settings & history", Icon: Settings },
  { href: "/demo/onboarding/", label: "Onboarding", Icon: Compass },
  { href: "/demo/states/", label: "UI states gallery", Icon: Layers },
];

export function PermissionNotice({ action, children }: { action: Action; children?: ReactNode }) {
  const { update, state } = useDemo();
  return (
    <div className="card flex flex-col items-center gap-3 p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-muted"><Lock className="size-6" aria-hidden /></span>
      <p className="font-semibold">You don&apos;t have permission to {ACTION_LABEL[action]}</p>
      <p className="max-w-md text-sm text-muted">You&apos;re viewing SportSync as a <strong>{ROLE_LABEL[state.role].toLowerCase()}</strong>. {children ?? "Ask a league administrator for access, or switch roles to explore this screen."}</p>
      <Button variant="outline" onClick={() => update((s) => ({ ...s, role: "league_admin" }))}>Switch to League administrator</Button>
    </div>
  );
}

export function PageTitle({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

function Toaster() {
  const { toasts, dismissToast, undo, canUndo } = useDemo();
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-20 left-1/2 z-[60] flex w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 flex-col gap-2 lg:bottom-6">
      {toasts.map((t) => (
        <div key={t.id} className={cn("pointer-events-auto flex items-center gap-3 rounded-xl border bg-text px-4 py-3 text-sm text-bg shadow-xl animate-rise", t.tone === "warning" && "border-warning")}>
          <span className="flex-1">{t.message}</span>
          {t.undo && canUndo && <button type="button" onClick={() => { undo(); dismissToast(t.id); }} className="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline"><Undo2 className="size-4" aria-hidden />Undo</button>}
          <button type="button" aria-label="Dismiss" onClick={() => dismissToast(t.id)}><X className="size-4" aria-hidden /></button>
        </div>
      ))}
    </div>
  );
}

function RoleSwitcher({ className }: { className?: string }) {
  const { state, update, toast } = useDemo();
  return (
    <label className={cn("flex items-center gap-2 text-sm", className)}>
      <span className="hidden whitespace-nowrap text-muted xl:inline">View as</span>
      <Select aria-label="View the demo as role" value={state.role} className="h-9 w-auto min-w-0 max-w-[11rem] sm:max-w-none"
        onChange={(e) => { const r = e.target.value as Role; update((s) => ({ ...s, role: r })); toast(`Now viewing as ${ROLE_LABEL[r].toLowerCase()}`, "info"); }}>
        {(Object.keys(ROLE_LABEL) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
      </Select>
    </label>
  );
}

export function DemoShell({ children }: { children: ReactNode }) {
  const { hydrated, openConflicts, state, online, can, user, queued } = useDemo();
  const path = usePathname();
  const [createOpen, setCreateOpen] = useState(false);
  const [prefill, setPrefill] = useState<Partial<SportEvent> | undefined>();
  const [editing, setEditing] = useState<SportEvent | undefined>();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [more, setMore] = useState(false);
  useEffect(() => setMore(false), [path]);

  const api: EditorApi = {
    openCreate: (p) => { setEditing(undefined); setPrefill(p); setCreateOpen(true); },
    openEvent: (id) => setDetailId(id),
    openEdit: (ev) => { setEditing(ev); setPrefill(undefined); setCreateOpen(true); },
  };
  const unread = state.notifications.filter((n) => !n.read).length;
  const active = (href: string) => (href === "/demo/" ? path === "/demo" || path === "/demo/" : path.startsWith(href.replace(/\/$/, "")));
  const count = (href: string) => (href === "/demo/conflicts/" ? openConflicts.length : href === "/demo/notifications/" ? unread : 0);

  return (
    <EditorContext.Provider value={api}>
      <div className="min-h-dvh bg-bg">
        <div className="no-print bg-text px-4 py-1.5 text-center text-xs text-bg">
          <strong>SportSync prototype</strong> · fictional sample data saved in this browser · AI features are <strong>simulated</strong> with a rule-based engine ·{" "}
          <Link href="/projects/sportsync/" className="underline underline-offset-2">Read the case study</Link>
        </div>
        <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
          <div className="flex h-14 items-center gap-2 px-3 sm:px-4">
            <Link href="/" className="hidden items-center gap-1 rounded-md px-2 py-1 text-sm text-muted hover:bg-surface-2 hover:text-text md:inline-flex"><ArrowLeft className="size-4" aria-hidden />Portfolio</Link>
            <Link href="/demo/" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              <span aria-hidden className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-fg"><RefreshCw className="size-4" /></span>
              SportSync
            </Link>
            <span className="hidden text-xs text-muted 2xl:inline">Riverbend Youth Sports League</span>
            <div className="ml-auto flex items-center gap-1.5">
              <RoleSwitcher />
              {can("createEvent") && <Button size="sm" onClick={() => api.openCreate()} className="hidden sm:inline-flex"><Plus aria-hidden />Quick create</Button>}
              <Link href="/demo/notifications/" aria-label={`Notifications, ${unread} unread`} className="relative inline-flex size-9 items-center justify-center rounded-lg hover:bg-surface-2">
                <Bell className="size-4" aria-hidden />
                {unread > 0 && <span className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">{unread}</span>}
              </Link>
              <ThemeToggle className="hidden sm:inline-flex" />
            </div>
          </div>
          {!online && (
            <div role="status" className="flex items-center justify-center gap-2 border-t border-warning/40 bg-warning-soft px-4 py-1.5 text-xs font-medium text-warning">
              <WifiOff className="size-3.5" aria-hidden />You&apos;re offline. Changes are saved on this device and will sync when you reconnect{queued ? ` (${queued} queued)` : ""}.
            </div>
          )}
        </header>

        <div className="flex">
          <aside className="no-print sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border bg-surface p-3 lg:block" aria-label="SportSync navigation">
            <div className="mb-3 rounded-lg bg-surface-2 p-2.5 text-xs">
              <p className="font-semibold">{user.name}</p>
              <p className="text-muted">{user.title}</p>
            </div>
            <nav className="space-y-0.5">
              {NAV.map(({ href, label, Icon }) => (
                <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}
                  className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors", active(href) ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-2 hover:text-text")}>
                  <Icon className="size-4" aria-hidden />{label}
                  {href === "/demo/assistant/" && <Badge tone="accent" className="ml-auto px-1.5 py-0 text-[10px]">Simulated</Badge>}
                  {count(href) > 0 && <span className={cn("ml-auto rounded-full px-1.5 text-[11px] font-bold tabular-nums", href === "/demo/conflicts/" ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent")}>{count(href)}</span>}
                </Link>
              ))}
            </nav>
          </aside>
          <main id="main" className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
            {hydrated ? children : (
              <div aria-busy="true" aria-label="Loading schedule" className="space-y-4">
                <Skeleton className="h-8 w-64" /><Skeleton className="h-4 w-96 max-w-full" />
                <div className="grid gap-3 sm:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>
                <Skeleton className="h-72" />
              </div>
            )}
          </main>
        </div>

        {/* Mobile bottom navigation (iOS tab bar / Android navigation bar pattern) */}
        <nav aria-label="SportSync mobile navigation" className="no-print fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
          {[NAV[0], NAV[1]].map(({ href, label, Icon }) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} className={cn("flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium", active(href) ? "text-primary" : "text-muted")}><Icon className="size-5" aria-hidden />{label}</Link>
          ))}
          <button type="button" onClick={() => (can("createEvent") ? api.openCreate() : setMore(true))} className="flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium text-muted" aria-label="Create event">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-fg shadow"><Plus className="size-5" aria-hidden /></span>
          </button>
          <Link href="/demo/conflicts/" aria-current={active("/demo/conflicts/") ? "page" : undefined} className={cn("relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium", active("/demo/conflicts/") ? "text-primary" : "text-muted")}>
            <AlertTriangle className="size-5" aria-hidden />Conflicts
            {openConflicts.length > 0 && <span className="absolute right-[22%] top-1 rounded-full bg-danger px-1 text-[10px] font-bold text-white">{openConflicts.length}</span>}
          </Link>
          <button type="button" onClick={() => setMore(true)} aria-expanded={more} className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted"><Menu className="size-5" aria-hidden />More</button>
        </nav>
        {more && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="All SportSync screens">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={() => setMore(false)} />
            <div className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-2xl bg-surface p-4 pb-8 shadow-2xl">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border-strong" aria-hidden />
              <div className="mb-3 flex items-center justify-between"><p className="font-semibold">All screens</p><ThemeToggle /></div>
              <nav className="grid grid-cols-2 gap-1.5">
                {NAV.map(({ href, label, Icon }) => (
                  <Link key={href} href={href} className={cn("flex items-center gap-2 rounded-lg border border-border p-2.5 text-sm", active(href) && "border-primary bg-primary-soft text-primary")}><Icon className="size-4" aria-hidden />{label}</Link>
                ))}
                <Link href="/" className="col-span-2 flex items-center justify-center gap-2 rounded-lg p-2.5 text-sm text-muted"><ArrowLeft className="size-4" aria-hidden />Back to portfolio</Link>
              </nav>
            </div>
          </div>
        )}

        <EventFormDialog open={createOpen} onClose={() => setCreateOpen(false)} editing={editing} prefill={prefill} />
        <EventDetailDialog eventId={detailId} open={!!detailId} onClose={() => setDetailId(null)} onEdit={(ev) => api.openEdit(ev)} />
        <Toaster />
      </div>
    </EditorContext.Provider>
  );
}
