"use client";

// Local demonstration database: React state persisted to this browser's localStorage.
// No account, server or paid service is needed. Every change is a named revision so it can be undone.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { AppNotification, Channel, Conflict, NotificationType, Proposal, Revision, Role, Settings, SportEvent } from "./types";
import { createSeed, DEMO_USERS, type DemoData } from "./seed";
import { detectConflicts, type EngineData } from "./conflicts";
import { can as canDo, canEditEvent, type Action } from "./permissions";

const STORAGE_KEY = "sportsync-demo-v1";

export interface DemoState extends DemoData {
  role: Role;
  settings: Settings;
  proposals: Proposal[];
  prefs: Record<NotificationType, Channel[]>;
  onboarded: boolean;
  acknowledged: string[];
}

type Snapshot = Pick<DemoState, "events" | "series" | "rsvps" | "attendance" | "venues" | "people" | "proposals" | "acknowledged">;

export interface Toast {
  id: number;
  message: string;
  tone?: "success" | "info" | "warning" | "danger";
  undo?: boolean;
}

export const DEFAULT_PREFS: Record<NotificationType, Channel[]> = {
  new_event: ["push", "email"],
  schedule_change: ["push", "sms", "email"],
  cancellation: ["push", "sms", "email"],
  venue_change: ["push", "email"],
  upcoming_game: ["push"],
  rsvp_reminder: ["push", "email"],
  conflict: ["push", "email"],
  ai_recommendation: ["push"],
};

function initialState(now = new Date()): DemoState {
  return {
    ...createSeed(now),
    role: "league_admin",
    settings: { minRestHours: 12, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, playerUnavailableThreshold: 0.4 },
    proposals: [],
    prefs: DEFAULT_PREFS,
    onboarded: false,
    acknowledged: [],
  };
}

const snap = (s: DemoState): Snapshot => ({
  events: s.events, series: s.series, rsvps: s.rsvps, attendance: s.attendance, venues: s.venues, people: s.people, proposals: s.proposals, acknowledged: s.acknowledged,
});

interface Ctx {
  state: DemoState;
  hydrated: boolean;
  online: boolean;
  offlineSim: boolean;
  setOfflineSim: (v: boolean) => void;
  queued: number;
  conflicts: Conflict[];
  openConflicts: Conflict[];
  engine: EngineData;
  user: { id: string; name: string; title: string };
  myTeamIds: string[] | null;
  visibleEvents: SportEvent[];
  can: (a: Action) => boolean;
  canEdit: (ev: SportEvent) => boolean;
  commit: (label: string, fn: (s: DemoState) => DemoState, opts?: { toast?: string; notify?: Omit<AppNotification, "id" | "at" | "read" | "channels"> }) => void;
  update: (fn: (s: DemoState) => DemoState) => void;
  undo: () => void;
  canUndo: boolean;
  revisions: Revision[];
  restore: (revisionId: string) => void;
  reset: () => void;
  toasts: Toast[];
  toast: (message: string, tone?: Toast["tone"], undo?: boolean) => void;
  dismissToast: (id: number) => void;
}

const DemoContext = createContext<Ctx | null>(null);

let revN = 0;
const newRev = (label: string): Revision => ({ id: `r-${Date.now()}-${++revN}`, label, at: new Date().toISOString() });

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => initialState());
  const [hydrated, setHydrated] = useState(false);
  const [history, setHistory] = useState<{ rev: Revision; snap: Snapshot }[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [netOnline, setNetOnline] = useState(true);
  const [offlineSim, setOfflineSim] = useState(false);
  const [queued, setQueued] = useState(0);
  const toastId = useRef(0);

  const toast = useCallback((message: string, tone: Toast["tone"] = "success", undo = false) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-3), { id, message, tone, undo }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), undo ? 7000 : 4500);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  // Load from localStorage after mount (avoids hydration mismatches with relative dates)
  useEffect(() => {
    let loaded: DemoState | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DemoState;
        const ageDays = (Date.now() - new Date(parsed.seededAt).getTime()) / 86_400_000;
        if (parsed.events && ageDays < 10) loaded = { ...initialState(), ...parsed, prefs: { ...DEFAULT_PREFS, ...parsed.prefs } };
      }
    } catch {
      /* storage unavailable: run in memory */
    }
    const s = loaded ?? initialState();
    setState(s);
    setHistory([{ rev: newRev(loaded ? "Restored saved demo session" : "Sample data loaded"), snap: snap(s) }]);
    setHydrated(true);
    setNetOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    const on = () => setNetOnline(true);
    const off = () => setNetOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private mode */
    }
  }, [state, hydrated]);

  const online = netOnline && !offlineSim;
  const prevOnline = useRef(online);
  useEffect(() => {
    if (!prevOnline.current && online && queued > 0) {
      toast(`Back online: ${queued} queued change${queued > 1 ? "s" : ""} synced`, "info");
      setQueued(0);
    }
    prevOnline.current = online;
  }, [online, queued, toast]);

  const stateRef = useRef(state);
  stateRef.current = state;
  const historyRef = useRef(history);
  historyRef.current = history;

  const commit: Ctx["commit"] = useCallback((label, fn, opts) => {
    let next = fn(stateRef.current);
    if (opts?.notify) {
      const n: AppNotification = { ...opts.notify, id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), read: false, channels: next.prefs[opts.notify.type] ?? [] };
      next = { ...next, notifications: [n, ...next.notifications] };
    }
    stateRef.current = next;
    setState(next);
    const entry = { rev: newRev(label), snap: snap(next) };
    historyRef.current = [...historyRef.current.slice(-39), entry];
    setHistory(historyRef.current);
    if (!online) setQueued((q) => q + 1);
    if (opts?.toast) toast(online ? opts.toast : `${opts.toast} (saved offline, will sync)`, online ? "success" : "warning", true);
  }, [online, toast]);

  const update: Ctx["update"] = useCallback((fn) => {
    stateRef.current = fn(stateRef.current);
    setState(stateRef.current);
  }, []);

  const undo = useCallback(() => {
    const h = historyRef.current;
    if (h.length < 2) return;
    const prev = h[h.length - 2];
    stateRef.current = { ...stateRef.current, ...prev.snap };
    setState(stateRef.current);
    historyRef.current = h.slice(0, -1);
    setHistory(historyRef.current);
    toast(`Undid: ${h[h.length - 1].rev.label}`, "info");
  }, [toast]);

  const restore = useCallback((id: string) => {
    const h = historyRef.current;
    const entry = h.find((x) => x.rev.id === id);
    if (!entry) return;
    stateRef.current = { ...stateRef.current, ...entry.snap };
    setState(stateRef.current);
    historyRef.current = [...h, { rev: newRev(`Restored to “${entry.rev.label}”`), snap: entry.snap }];
    setHistory(historyRef.current);
    toast(`Restored to: ${entry.rev.label}`, "info");
  }, [toast]);

  const reset = useCallback(() => {
    const s = initialState();
    stateRef.current = s;
    setState(s);
    historyRef.current = [{ rev: newRev("Demo data reset"), snap: snap(s) }];
    setHistory(historyRef.current);
    toast("Demo data reset to the original sample", "info");
  }, [toast]);

  const engine: EngineData = useMemo(() => ({ events: state.events, teams: state.teams, people: state.people, venues: state.venues, settings: state.settings }), [state.events, state.teams, state.people, state.venues, state.settings]);
  const conflicts = useMemo(() => (hydrated ? detectConflicts(engine) : []), [engine, hydrated]);
  const openConflicts = useMemo(() => conflicts.filter((c) => !state.acknowledged.includes(c.id)), [conflicts, state.acknowledged]);

  const user = DEMO_USERS[state.role];
  const myTeamIds = useMemo(() => {
    switch (state.role) {
      case "coach": return state.teams.filter((t) => t.coachId === user.id).map((t) => t.id);
      case "parent": return state.people.filter((p) => p.guardianId === user.id).flatMap((p) => p.teamIds);
      case "athlete": return state.people.find((p) => p.id === user.id)?.teamIds ?? [];
      default: return null;
    }
  }, [state.role, state.teams, state.people, user.id]);

  const visibleEvents = useMemo(() => {
    if (!myTeamIds) return state.events;
    return state.events.filter((e) => e.teamIds.some((t) => myTeamIds.includes(t)) || (e.teamIds.length === 0 && (e.type === "practice" || (state.role === "coach" && e.type === "meeting"))));
  }, [state.events, myTeamIds, state.role]);

  const value: Ctx = {
    state, hydrated, online, offlineSim, setOfflineSim, queued, conflicts, openConflicts, engine, user, myTeamIds, visibleEvents,
    can: (a) => canDo(state.role, a),
    canEdit: (ev) => canEditEvent(state.role, ev, myTeamIds),
    commit, update, undo, canUndo: history.length > 1, revisions: history.map((h) => h.rev).reverse(), restore, reset,
    toasts, toast, dismissToast,
  };
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}

/** Helpers used by several screens */
export function upsertEvents(s: DemoState, evs: SportEvent[]): DemoState {
  const ids = new Set(evs.map((e) => e.id));
  return { ...s, events: [...s.events.filter((e) => !ids.has(e.id)), ...evs] };
}
