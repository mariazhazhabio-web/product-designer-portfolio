"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Monitor, Smartphone } from "lucide-react";
import { screens } from "@/content/screens";
import { Tabs } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/badge";
import { Wireframe, type Fidelity } from "./wireframe";

export function WireframeGallery() {
  const [f, setF] = useState<Fidelity>("mid");
  const [group, setGroup] = useState("All");
  const [focus, setFocus] = useState<string | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const ff = q.get("f");
    if (ff === "lo" || ff === "mid" || ff === "hi") setF(ff);
    setFocus(q.get("focus"));
  }, []);
  const focused = screens.find((s) => s.id === focus);
  if (focused) return <div className="mx-auto max-w-5xl" data-testid="wf-focus"><Wireframe screen={focused} fidelity={f} /></div>;

  const groups = ["All", ...Array.from(new Set(screens.map((s) => s.group)))];
  const list = screens.filter((s) => group === "All" || s.group === group);
  return (
    <>
      <div className="sticky top-16 z-20 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur">
        <Tabs label="Fidelity" value={f} onChange={(v) => setF(v as Fidelity)} tabs={[{ id: "lo", label: "Low fidelity" }, { id: "mid", label: "Mid fidelity" }, { id: "hi", label: "High fidelity" }]} />
        <label className="flex items-center gap-2 text-sm"><span className="text-muted">Area</span>
          <select value={group} onChange={(e) => setGroup(e.target.value)} className="h-9 rounded-lg border border-border-strong bg-surface px-2">{groups.map((g) => <option key={g}>{g}</option>)}</select>
        </label>
        <span className="ml-auto text-sm text-muted">{list.length} screens</span>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((s, i) => (
          <li key={s.id} className="card flex flex-col p-3">
            <div className={s.device === "mobile" ? "mx-auto w-1/2" : ""}><Wireframe screen={s} fidelity={f} /></div>
            <div className="mt-3 flex flex-1 flex-col px-1">
              <div className="flex items-center gap-2"><span className="text-xs font-semibold tabular-nums text-subtle">{String(i + 1).padStart(2, "0")}</span><p className="font-semibold">{s.title}</p></div>
              <p className="mt-1 flex-1 text-sm text-muted">{s.note}</p>
              <div className="mt-3 flex items-center justify-between">
                <Badge>{s.device === "mobile" ? <Smartphone aria-hidden /> : <Monitor aria-hidden />}{s.device} · {s.group}</Badge>
                <Link href={s.demo} className="inline-flex items-center gap-1 text-sm font-medium text-info hover:underline">Live<ArrowUpRight className="size-3.5" aria-hidden /></Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
