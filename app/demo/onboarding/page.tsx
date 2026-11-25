"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bell, Building2, Calendar, CheckCircle2, ClipboardList, Shield, User, Users, Whistle } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import type { Role } from "@/lib/sportsync/types";
import { ROLE_LABEL } from "@/lib/sportsync/permissions";
import { DEMO_USERS } from "@/lib/sportsync/seed";
import { Button } from "@/components/ui/button";
import { Checkbox, Switch } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const ROLE_INFO: Record<Role, { Icon: typeof User; blurb: string }> = {
  league_admin: { Icon: Shield, blurb: "Build season and tournament schedules, resolve conflicts, approve changes." },
  org_manager: { Icon: ClipboardList, blurb: "Coordinate teams, venues and staff across your club." },
  coach: { Icon: Whistle, blurb: "See your teams' schedules, track attendance, request changes." },
  parent: { Icon: Users, blurb: "Know where your kids need to be and RSVP in one tap." },
  athlete: { Icon: User, blurb: "Your games, practices and team updates in one place." },
  facility_manager: { Icon: Building2, blurb: "Manage bookings, opening hours and maintenance." },
};
const STEPS = ["Your role", "Your teams", "Calendar", "Notifications", "Done"];

export default function Onboarding() {
  const { state, update, toast } = useDemo();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>(state.role);
  const [teams, setTeams] = useState<string[]>(["t-hawks"]);
  const [cal, setCal] = useState<string>("skip");
  const [push, setPush] = useState(true);
  const [sms, setSms] = useState(false);
  const [email, setEmail] = useState(true);

  const finish = () => {
    update((s) => ({ ...s, role, onboarded: true }));
    toast(`You're set up as ${ROLE_LABEL[role].toLowerCase()}`, "success");
    router.push("/demo/");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-8 flex items-center gap-2" aria-label="Onboarding progress">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col gap-1.5" aria-current={i === step ? "step" : undefined}>
            <span className={cn("h-1.5 rounded-full", i <= step ? "bg-primary" : "bg-surface-3")} />
            <span className={cn("hidden text-xs sm:block", i === step ? "font-semibold" : "text-muted")}>{s}</span>
          </li>
        ))}
      </ol>
      <p className="text-sm text-muted">Step {step + 1} of {STEPS.length}</p>

      {step === 0 && (
        <section aria-labelledby="ob-0">
          <h1 id="ob-0" className="mt-1 text-2xl font-semibold">How will you use SportSync?</h1>
          <p className="mt-1 text-sm text-muted">This tailors your home screen. You can switch roles any time.</p>
          <div role="radiogroup" aria-label="Role" className="mt-5 grid gap-3 sm:grid-cols-2">
            {(Object.keys(ROLE_INFO) as Role[]).map((r) => {
              const { Icon, blurb } = ROLE_INFO[r];
              return (
                <button key={r} type="button" role="radio" aria-checked={role === r} onClick={() => setRole(r)}
                  className={cn("flex gap-3 rounded-xl border-2 p-4 text-left", role === r ? "border-primary bg-primary-soft" : "border-border hover:border-border-strong")}>
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <span><span className="block font-semibold">{ROLE_LABEL[r]}</span><span className="text-sm text-muted">{blurb}</span></span>
                </button>
              );
            })}
          </div>
        </section>
      )}
      {step === 1 && (
        <section aria-labelledby="ob-1">
          <h1 id="ob-1" className="mt-1 text-2xl font-semibold">{role === "parent" ? "Which teams are your kids on?" : role === "facility_manager" ? "Which facilities do you manage?" : "Which teams do you follow?"}</h1>
          <p className="mt-1 text-sm text-muted">Demo accounts come with sample memberships ({DEMO_USERS[role].title}).</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {role === "facility_manager"
              ? Array.from(new Set(state.venues.map((v) => v.site))).map((s) => <Checkbox key={s} defaultChecked={s.startsWith("Riverbend")} label={s} className="rounded-lg border border-border p-3" />)
              : state.teams.map((t) => <Checkbox key={t.id} checked={teams.includes(t.id)} onChange={(e) => setTeams(e.target.checked ? [...teams, t.id] : teams.filter((x) => x !== t.id))} label={<>{t.name} <span className="text-xs text-muted">{t.ageGroup}</span></>} className="rounded-lg border border-border p-3" />)}
          </div>
        </section>
      )}
      {step === 2 && (
        <section aria-labelledby="ob-2">
          <h1 id="ob-2" className="mt-1 text-2xl font-semibold">Put the schedule in your calendar</h1>
          <p className="mt-1 text-sm text-muted">Most families already live in their phone calendar. Pick one now or later.</p>
          <div role="radiogroup" aria-label="Calendar" className="mt-5 space-y-2">
            {[["google", "Google Calendar", "Two-way sync (requires sign-in: simulated in this demo)"], ["apple", "Apple Calendar", "Subscribe to a feed or download .ics"], ["outlook", "Outlook", "Two-way sync (requires sign-in: simulated in this demo)"], ["skip", "Not now", "You can connect from Calendar sync later"]].map(([id, l, h]) => (
              <button key={id} type="button" role="radio" aria-checked={cal === id} onClick={() => setCal(id)} className={cn("flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left", cal === id ? "border-primary bg-primary-soft" : "border-border")}>
                <Calendar className="size-5 text-primary" aria-hidden /><span><span className="block font-semibold">{l}</span><span className="text-sm text-muted">{h}</span></span>
              </button>
            ))}
          </div>
        </section>
      )}
      {step === 3 && (
        <section aria-labelledby="ob-3">
          <h1 id="ob-3" className="mt-1 text-2xl font-semibold">How should we reach you?</h1>
          <p className="mt-1 text-sm text-muted">Cancellations always use every channel you enable. Fine-tune per notification type later.</p>
          <div className="mt-5 space-y-2">
            {[["Push notifications", push, setPush], ["Text messages (SMS)", sms, setSms], ["Email", email, setEmail]].map(([l, v, set]) => (
              <div key={l as string} className="flex items-center justify-between rounded-xl border border-border p-3.5"><span className="flex items-center gap-2 font-medium"><Bell className="size-4 text-muted" aria-hidden />{l as string}</span><Switch checked={v as boolean} onChange={set as (b: boolean) => void} label={l as string} /></div>
            ))}
          </div>
        </section>
      )}
      {step === 4 && (
        <section aria-labelledby="ob-4" className="py-6 text-center">
          <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
          <h1 id="ob-4" className="mt-3 text-2xl font-semibold">You&apos;re all set</h1>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">Signed in as the demo {ROLE_LABEL[role].toLowerCase()} <strong>{DEMO_USERS[role].name}</strong>. {cal !== "skip" && "Calendar connection is simulated. "}Try creating an event or asking the assistant for a tournament schedule.</p>
        </section>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}><ArrowLeft aria-hidden />Back</Button>
        {step < STEPS.length - 1 ? <Button onClick={() => setStep((s) => s + 1)}>Continue<ArrowRight aria-hidden /></Button> : <Button onClick={finish}>Go to my dashboard<ArrowRight aria-hidden /></Button>}
      </div>
    </div>
  );
}
