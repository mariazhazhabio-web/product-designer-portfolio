"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Bot, Check, CheckCircle2, History, Lightbulb, Loader2, RotateCcw, Send, Sparkles, Trash2, Undo2, X } from "lucide-react";
import { useDemo, upsertEvents } from "@/lib/sportsync/store";
import type { Proposal, SportEvent } from "@/lib/sportsync/types";
import { EXAMPLE_PROMPTS, generateProposal } from "@/lib/sportsync/assistant";
import { checkEvent } from "@/lib/sportsync/conflicts";
import { combine, dateKey, fmtLongDay, fmtRange, fromDateKey, timeOf } from "@/lib/sportsync/dates";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, Input, Select, Textarea } from "@/components/ui/primitives";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle, PermissionNotice } from "@/components/demo/shell";
import { cn } from "@/lib/utils";

const STEPS = ["Reading your instruction", "Checking teams, coaches and player availability", "Checking venue hours, closures and maintenance", "Building rounds and assigning slots", "Validating every game for conflicts"];

export default function AssistantPage() {
  const { state, engine, update, commit, can, undo, canUndo } = useDemo();
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPTS[0]);
  const [busy, setBusy] = useState(-1);
  const [activeId, setActiveId] = useState<string | null>(state.proposals.find((p) => p.status === "pending")?.id ?? null);
  const [approvedId, setApprovedId] = useState<string | null>(null);
  const [revise, setRevise] = useState("");
  const [editRow, setEditRow] = useState<string | null>(null);

  const proposal = state.proposals.find((p) => p.id === activeId) ?? null;
  const resultsRef = useRef<HTMLDivElement>(null);
  const [justGenerated, setJustGenerated] = useState(false);
  useEffect(() => {
    if (justGenerated && busy < 0) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setJustGenerated(false);
    }
  }, [justGenerated, busy]);
  const thread = proposal ? state.proposals.filter((p) => p.prompt.split("\n\nRevision: ")[0] === proposal.prompt.split("\n\nRevision: ")[0]) : [];

  const run = (text: string) => {
    if (!text.trim()) return;
    setApprovedId(null);
    let i = 0;
    setBusy(0);
    const tick = setInterval(() => {
      i++;
      if (i < STEPS.length) { setBusy(i); return; }
      clearInterval(tick);
      const base = text.split("\n\nRevision: ")[0];
      const version = state.proposals.filter((p) => p.prompt.split("\n\nRevision: ")[0] === base).length + 1;
      const p = generateProposal(text, engine, version);
      update((s) => ({ ...s, proposals: [...s.proposals, p] }));
      setActiveId(p.id);
      setBusy(-1);
      setJustGenerated(true);
    }, 380);
  };

  const setProposal = (fn: (p: Proposal) => Proposal) => update((s) => ({ ...s, proposals: s.proposals.map((p) => (p.id === activeId ? fn(p) : p)) }));

  const rowIssues = useMemo(() => {
    const m = new Map<string, string[]>();
    if (!proposal) return m;
    for (const ev of proposal.events) {
      const others = { ...engine, events: [...engine.events.filter((e) => e.id !== ev.id), ...proposal.events.filter((e) => e.id !== ev.id)] };
      m.set(ev.id, checkEvent(ev, others).filter((i) => i.severity === "error").map((i) => i.title));
    }
    return m;
  }, [proposal, engine]);
  const blocking = [...rowIssues.values()].filter((x) => x.length).length;

  const approve = () => {
    if (!proposal) return;
    const evs = proposal.events.map((e) => ({ ...e, source: "assistant" as const }));
    commit(`Approved assistant schedule v${proposal.version} (${evs.length} events)`, (s) => ({
      ...upsertEvents(s, evs),
      proposals: s.proposals.map((p) => (p.id === proposal.id ? { ...p, status: "approved" } : p.status === "pending" && thread.some((t) => t.id === p.id) ? { ...p, status: "rejected" } : p)),
    }), { toast: `${evs.length} events published to the calendar`, notify: { type: "ai_recommendation", title: `Schedule published (${evs.length} events)`, body: `Assistant proposal v${proposal.version} was reviewed and approved. Teams have been notified.` } });
    setApprovedId(proposal.id);
  };
  const reject = () => { setProposal((p) => ({ ...p, status: "rejected" })); };

  if (!can("useAssistant")) return <div className="mx-auto max-w-5xl"><PageTitle title="AI scheduling assistant" /><PermissionNotice action="useAssistant">The assistant is available to league staff and coaches.</PermissionNotice></div>;

  const days = proposal ? Array.from(new Set(proposal.events.map((e) => dateKey(e.start)))).sort() : [];
  const venueOf = (id: string) => state.venues.find((v) => v.id === id);

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle title="AI scheduling assistant" sub="Describe what you need in plain language. The assistant proposes a schedule, explains its reasoning, and nothing is published until you approve it." />
      <Alert tone="info" title="Simulated AI: rule-based engine, no live model" className="mb-6">
        This demo does not call an AI API. A transparent parser extracts constraints and a deterministic scheduler builds the proposal, so results are explainable and repeatable. A live language model could replace the parser later. See the case study for the design rationale.
      </Alert>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardBody>
              <form onSubmit={(e) => { e.preventDefault(); run(prompt); }} className="space-y-3">
                <label htmlFor="ai-prompt" className="text-sm font-semibold">Instruction</label>
                <Textarea id="ai-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-36" />
                <Button type="submit" className="w-full" disabled={busy >= 0 || !prompt.trim()}>{busy >= 0 ? <Loader2 className="animate-spin" aria-hidden /> : <Sparkles aria-hidden />}Generate proposal</Button>
              </form>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">Try an example</p>
              <div className="mt-2 space-y-1.5">
                {EXAMPLE_PROMPTS.map((p) => (
                  <button key={p} type="button" onClick={() => setPrompt(p)} className={cn("w-full rounded-lg border p-2 text-left text-xs hover:border-primary", prompt === p ? "border-primary bg-primary-soft" : "border-border")}>{p}</button>
                ))}
              </div>
            </CardBody>
          </Card>
          {state.proposals.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><History className="size-4" aria-hidden />Proposal history</CardTitle></CardHeader>
              <CardBody>
                <ul className="space-y-1.5">
                  {[...state.proposals].reverse().map((p) => (
                    <li key={p.id}>
                      <button type="button" onClick={() => setActiveId(p.id)} className={cn("w-full rounded-lg border p-2 text-left text-xs", p.id === activeId ? "border-primary bg-primary-soft" : "border-border hover:border-border-strong")}>
                        <span className="flex items-center justify-between gap-2"><span className="font-semibold">v{p.version} · {p.understood[0]}</span>
                          <Badge tone={p.status === "approved" ? "success" : p.status === "rejected" ? "neutral" : "info"}>{p.status}</Badge></span>
                        <span className="mt-0.5 line-clamp-1 text-muted">{p.prompt.replace("\n\nRevision: ", " → ")}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </div>

        <div ref={resultsRef} className="min-w-0 scroll-mt-24 space-y-4" aria-live="polite">
          {busy >= 0 && (
            <Card><CardBody>
              <p className="mb-3 flex items-center gap-2 font-semibold"><Bot className="size-5 text-primary" aria-hidden />Working on it…</p>
              <ol className="space-y-2 text-sm">
                {STEPS.map((s, i) => (
                  <li key={s} className={cn("flex items-center gap-2", i > busy && "text-subtle")}>
                    {i < busy ? <CheckCircle2 className="size-4 text-success" aria-hidden /> : i === busy ? <Loader2 className="size-4 animate-spin text-primary" aria-hidden /> : <span className="size-4 rounded-full border border-border-strong" aria-hidden />}{s}
                  </li>
                ))}
              </ol>
            </CardBody></Card>
          )}

          {busy < 0 && !proposal && (
            <div className="card flex flex-col items-center p-10 text-center">
              <Sparkles className="size-8 text-accent" aria-hidden />
              <p className="mt-3 font-semibold">No proposal yet</p>
              <p className="mt-1 max-w-md text-sm text-muted">Choose an example or write your own instruction, then press <strong>Generate proposal</strong>. You can review, edit, approve or reject the result.</p>
            </div>
          )}

          {busy < 0 && proposal && (
            <>
              {approvedId === proposal.id && (
                <Alert tone="success" title="Published to the calendar" action={<div className="flex gap-2">{canUndo && <Button size="sm" variant="outline" onClick={() => { undo(); setApprovedId(null); }}><Undo2 aria-hidden />Undo</Button>}<ButtonLink size="sm" href={`/demo/calendar/?view=week&date=${days[0] ?? ""}`}>View calendar</ButtonLink></div>}>
                  {proposal.events.length} events were added. Families get notified based on their preferences.
                </Alert>
              )}
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle className="flex flex-wrap items-center gap-2">Proposal v{proposal.version}<Badge tone={proposal.status === "approved" ? "success" : proposal.status === "rejected" ? "neutral" : "info"}>{proposal.status === "pending" ? "Awaiting review" : proposal.status}</Badge><Badge tone="accent"><Sparkles aria-hidden />Simulated AI</Badge></CardTitle>
                    <p className="mt-1 text-sm text-muted">“{proposal.prompt.replace("\n\nRevision: ", "” → revision: “")}”</p>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">What I understood</p>
                    <div className="flex flex-wrap gap-1.5">{proposal.understood.map((u) => <Badge key={u} tone="outline">{u}</Badge>)}</div>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {proposal.stats.map((s) => <div key={s.label} className="rounded-lg bg-surface-2 p-3"><dt className="text-xs text-muted">{s.label}</dt><dd className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums">{s.value}</dd></div>)}
                  </dl>
                  <div className="rounded-xl border border-border p-4">
                    <p className="mb-2 flex items-center gap-2 font-semibold"><Lightbulb className="size-4 text-accent" aria-hidden />Why this schedule</p>
                    <ul className="space-y-1.5 text-sm">{proposal.explanation.map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />{x}</li>)}</ul>
                  </div>
                  {proposal.warnings.map((w) => <Alert key={w} tone="warning">{w}</Alert>)}
                  {blocking > 0 && <Alert tone="danger" title={`${blocking} game${blocking > 1 ? "s" : ""} now conflict after your edits`}>Fix or remove the highlighted rows before approving.</Alert>}
                </CardBody>
              </Card>

              {proposal.events.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Proposed events ({proposal.events.length})</CardTitle><span className="text-xs text-muted">Edit or remove any row before approving</span></CardHeader>
                  <CardBody className="space-y-5">
                    {days.map((day) => (
                      <section key={day}>
                        <h3 className="mb-2 text-sm font-semibold">{fmtLongDay(fromDateKey(day))}</h3>
                        <div className="overflow-x-auto rounded-lg border border-border">
                          <table className="w-full min-w-[620px] text-sm">
                            <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="px-3 py-2 font-medium">Time</th><th className="px-3 py-2 font-medium">Venue</th><th className="px-3 py-2 font-medium">Match</th><th className="px-3 py-2 font-medium">Stage</th><th className="px-3 py-2"><span className="sr-only">Actions</span></th></tr></thead>
                            <tbody>
                              {proposal.events.filter((e) => dateKey(e.start) === day).sort((a, b) => a.start.localeCompare(b.start) || a.venueId.localeCompare(b.venueId)).map((e) => {
                                const iss = rowIssues.get(e.id) ?? [];
                                return editRow === e.id ? (
                                  <EditProposalRow key={e.id} ev={e} onCancel={() => setEditRow(null)} onSave={(ne) => { setProposal((p) => ({ ...p, events: p.events.map((x) => (x.id === e.id ? ne : x)) })); setEditRow(null); }} />
                                ) : (
                                  <tr key={e.id} className={cn("border-t border-border", iss.length && "bg-danger-soft")}>
                                    <td className="whitespace-nowrap px-3 py-2 tabular-nums">{fmtRange(e.start, e.end)}</td>
                                    <td className="px-3 py-2">{venueOf(e.venueId)?.site} · {venueOf(e.venueId)?.name}</td>
                                    <td className="px-3 py-2 font-medium">{e.title}{iss.length > 0 && <span className="mt-0.5 flex items-center gap-1 text-xs text-danger"><AlertTriangle className="size-3" aria-hidden />{iss.join(", ")}</span>}</td>
                                    <td className="px-3 py-2 text-muted">{e.label}</td>
                                    <td className="whitespace-nowrap px-2 py-1 text-right">
                                      {proposal.status === "pending" && <>
                                        <Button size="sm" variant="ghost" onClick={() => setEditRow(e.id)}>Edit</Button>
                                        <Button size="icon-sm" variant="ghost" aria-label={`Remove ${e.title}`} onClick={() => setProposal((p) => ({ ...p, events: p.events.filter((x) => x.id !== e.id) }))}><Trash2 /></Button>
                                      </>}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    ))}
                  </CardBody>
                </Card>
              )}

              {proposal.status === "pending" && (
                <Card>
                  <CardBody className="space-y-4">
                    <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); if (revise.trim()) { run(`${proposal.prompt.split("\n\nRevision: ")[0]}\n\nRevision: ${revise}`); setRevise(""); } }}>
                      <label htmlFor="revise" className="sr-only">Ask for a revision</label>
                      <Input id="revise" value={revise} onChange={(e) => setRevise(e.target.value)} placeholder="Ask for changes, e.g. “no games before 10am” or “use Summit Sports Dome only”" />
                      <Button type="submit" variant="outline" disabled={!revise.trim()}><Send aria-hidden />Revise</Button>
                    </form>
                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
                      {!can("approveSchedule") && <p className="mr-auto text-xs text-muted">Coaches can draft schedules. A league administrator must approve them.</p>}
                      <Button variant="outline" onClick={reject}><X aria-hidden />Reject</Button>
                      <Button onClick={approve} disabled={!can("approveSchedule") || blocking > 0 || proposal.events.length === 0}><Check aria-hidden />Approve & publish {proposal.events.length} events</Button>
                    </div>
                  </CardBody>
                </Card>
              )}
              {proposal.status === "rejected" && <Alert tone="info" title="Proposal rejected" action={<Button size="sm" variant="outline" onClick={() => setProposal((p) => ({ ...p, status: "pending" }))}><RotateCcw aria-hidden />Reopen</Button>}>Nothing was added to the calendar.</Alert>}
              {thread.length > 1 && <p className="text-xs text-muted">This request has {thread.length} versions. Switch between them in <em>Proposal history</em> to compare stats.</p>}
            </>
          )}
          <p className="text-xs text-muted">Approvals are recorded in <Link className="underline" href="/demo/settings/">revision history</Link> and can be undone.</p>
        </div>
      </div>
    </div>
  );
}

function EditProposalRow({ ev, onSave, onCancel }: { ev: SportEvent; onSave: (e: SportEvent) => void; onCancel: () => void }) {
  const { state } = useDemo();
  const [venueId, setVenueId] = useState(ev.venueId);
  const [start, setStart] = useState(timeOf(ev.start));
  const dur = new Date(ev.end).getTime() - new Date(ev.start).getTime();
  const save = () => {
    const s = combine(dateKey(ev.start), start);
    onSave({ ...ev, venueId, start: s, end: new Date(new Date(s).getTime() + dur).toISOString() });
  };
  return (
    <tr className="border-t border-border bg-info-soft">
      <td className="px-3 py-2"><Input aria-label="Start time" type="time" step={900} value={start} onChange={(e) => setStart(e.target.value)} className="h-8 w-28" /></td>
      <td className="px-3 py-2"><Select aria-label="Venue" value={venueId} onChange={(e) => setVenueId(e.target.value)} className="h-8">{state.venues.map((v) => <option key={v.id} value={v.id}>{v.site} · {v.name}</option>)}</Select></td>
      <td className="px-3 py-2 font-medium">{ev.title}</td>
      <td className="px-3 py-2 text-muted">{ev.label}</td>
      <td className="whitespace-nowrap px-2 py-1 text-right"><Button size="sm" onClick={save}>Save</Button><Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button></td>
    </tr>
  );
}
