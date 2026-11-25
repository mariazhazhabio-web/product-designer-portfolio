"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarX2, Link2, Plus, Trash2 } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import { addDays, combine, dateKey, fmtDay, fmtRange } from "@/lib/sportsync/dates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, Field, Input, Select } from "@/components/ui/primitives";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/demo/shell";
import { EventRow } from "@/components/demo/event-row";
import { AddToCalendar } from "@/components/demo/event-detail";
import { cn } from "@/lib/utils";

export default function TeamsPage() {
  const { state, myTeamIds, can, commit, user, toast } = useDemo();
  const teams = state.teams.filter((t) => !myTeamIds || myTeamIds.includes(t.id));
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const team = state.teams.find((t) => t.id === teamId) ?? teams[0];
  const [personId, setPersonId] = useState("");
  const [date, setDate] = useState(dateKey(addDays(new Date(), 3)));
  const [from, setFrom] = useState("16:00");
  const [to, setTo] = useState("20:00");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");
  if (!team) return null;
  const coach = state.people.find((p) => p.id === team.coachId);
  const players = team.playerIds.map((id) => state.people.find((p) => p.id === id)!);
  const editablePeople = [coach!, ...players].filter((p) => p && (can("manageTeams") || p.guardianId === user.id || p.id === user.id));
  const upcoming = state.events.filter((e) => e.teamIds.includes(team.id) && new Date(e.end) > new Date()).sort((a, b) => a.start.localeCompare(b.start));
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname.replace(/teams\/?$/, "")}share/?team=${team.id}` : "";

  const addBlock = () => {
    const pid = personId || editablePeople[0]?.id;
    if (!pid) return;
    if (to <= from) { setErr("End time must be after start time."); return; }
    setErr("");
    const p = state.people.find((x) => x.id === pid)!;
    commit(`Marked ${p.name} unavailable on ${fmtDay(date + "T12:00")}`, (s) => ({
      ...s, people: s.people.map((x) => (x.id === pid ? { ...x, unavailable: [...x.unavailable, { start: combine(date, from), end: combine(date, to), reason: reason || "Unavailable" }] } : x)),
    }), { toast: "Availability saved. Conflicts re-checked" });
    setReason("");
  };
  const removeBlock = (pid: string, i: number) => commit("Removed an unavailability", (s) => ({ ...s, people: s.people.map((x) => (x.id === pid ? { ...x, unavailable: x.unavailable.filter((_, j) => j !== i) } : x)) }));

  return (
    <div className="mx-auto max-w-7xl">
      <PageTitle title="Teams & availability" sub="Rosters, coaches and player availability. Unavailability feeds straight into conflict detection and the scheduling assistant." />
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Teams">
        {teams.map((t) => (
          <button key={t.id} role="tab" aria-selected={t.id === team.id} type="button" onClick={() => setTeamId(t.id)}
            className={cn("flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium", t.id === team.id ? "border-primary bg-primary-soft text-primary" : "border-border hover:border-border-strong")}>
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: t.color }} />{t.name}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div><CardTitle>{team.name}</CardTitle><p className="text-sm text-muted">{team.sport === "basketball" ? "Basketball" : "Soccer"} · {team.ageGroup} · Coach {coach?.name}</p></div>
              <Badge tone="primary">{players.length} players</Badge>
            </CardHeader>
            <CardBody>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[coach!, ...players].map((p) => (
                  <li key={p.id} className="flex items-start gap-3 rounded-lg border border-border p-2.5">
                    <Avatar name={p.name} color={p.kind === "coach" ? "#0b6e5b" : team.color} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{p.name} {p.kind === "coach" && <Badge tone="primary" className="ml-1">Coach</Badge>}</p>
                      {p.guardian && <p className="text-xs text-muted">Guardian: {p.guardian}</p>}
                      {p.unavailable.map((u, i) => (
                        <p key={i} className="mt-1 flex items-center gap-1 text-xs text-warning"><CalendarX2 className="size-3" aria-hidden />{fmtDay(u.start)} {fmtRange(u.start, u.end)}: {u.reason}
                          {editablePeople.some((x) => x.id === p.id) && <button type="button" aria-label={`Remove unavailability for ${p.name}`} onClick={() => removeBlock(p.id, i)} className="ml-1 text-muted hover:text-danger"><Trash2 className="size-3" /></button>}</p>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader><CardTitle>Team schedule</CardTitle><AddToCalendar events={upcoming} label="Subscribe (.ics)" filename={`${team.name.replace(/\W+/g, "-").toLowerCase()}.ics`} /></CardHeader>
            <CardBody className="pt-2"><ul className="divide-y divide-border">{upcoming.slice(0, 8).map((e) => <EventRow key={e.id} ev={e} />)}</ul></CardBody>
          </Card>
        </div>
        <div className="space-y-6">
          {editablePeople.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Add unavailability</CardTitle></CardHeader>
              <CardBody>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); addBlock(); }}>
                  <Field label="Person" htmlFor="ua-person"><Select id="ua-person" value={personId || editablePeople[0]?.id} onChange={(e) => setPersonId(e.target.value)}>{editablePeople.map((p) => <option key={p.id} value={p.id}>{p.name}{p.kind === "coach" ? " (coach)" : ""}</option>)}</Select></Field>
                  <Field label="Date" htmlFor="ua-date"><Input id="ua-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="From" htmlFor="ua-from"><Input id="ua-from" type="time" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
                    <Field label="To" htmlFor="ua-to" error={err}><Input id="ua-to" type="time" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
                  </div>
                  <Field label="Reason (optional)" htmlFor="ua-reason"><Input id="ua-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Family trip" /></Field>
                  <Button type="submit" className="w-full"><Plus aria-hidden />Save availability</Button>
                </form>
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle>Share this team&apos;s schedule</CardTitle></CardHeader>
            <CardBody className="space-y-2 text-sm">
              <p className="text-muted">A read-only link for families, grandparents and referees. No account needed.</p>
              <div className="flex gap-2"><Input readOnly value={shareUrl} aria-label="Share link" onFocus={(e) => e.target.select()} /><Button variant="outline" onClick={() => { navigator.clipboard?.writeText(shareUrl).then(() => toast("Link copied", "info"), () => toast("Copy failed. Select the text instead", "warning")); }}><Link2 aria-hidden />Copy</Button></div>
              <Link className="text-xs font-medium text-info hover:underline" href={`/demo/share/?team=${team.id}`}>Preview shared view</Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
