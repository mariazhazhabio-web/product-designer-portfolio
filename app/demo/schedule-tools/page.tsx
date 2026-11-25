"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Download, FileSpreadsheet, FileUp, Link2, XCircle } from "lucide-react";
import { useDemo } from "@/lib/sportsync/store";
import { sampleCSV, toCSV, validateImport, type ImportRow, CSV_HEADERS } from "@/lib/sportsync/csv";
import { buildICS, downloadText } from "@/lib/sportsync/ics";
import { checkEvent } from "@/lib/sportsync/conflicts";
import { dateKey, fmtDay, fmtRange } from "@/lib/sportsync/dates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, Input, Select, Textarea } from "@/components/ui/primitives";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle, PermissionNotice } from "@/components/demo/shell";

export default function ScheduleTools() {
  const { state, engine, commit, can, visibleEvents, toast } = useDemo();
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ rows: ImportRow[]; headerError?: string } | null>(null);
  const [imported, setImported] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [scope, setScope] = useState("all");
  const [shareTeam, setShareTeam] = useState(state.teams[0].id);

  const preview = (t: string) => { setText(t); setImported(null); setResult(validateImport(t, state)); };
  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!/\.csv$/i.test(f.name) && f.type !== "text/csv") { setResult({ rows: [], headerError: `“${f.name}” isn't a CSV file. Export your spreadsheet as CSV (comma-separated) and try again.` }); return; }
    if (f.size > 1_000_000) { setResult({ rows: [], headerError: "File is larger than 1 MB. Split it into smaller files." }); return; }
    f.text().then(preview);
  };
  const valid = result?.rows.filter((r) => r.event) ?? [];
  const invalid = result?.rows.filter((r) => r.errors.length) ?? [];
  const warn = useMemo(() => new Map(valid.map((r) => [r.line, checkEvent(r.event!, engine).filter((i) => i.severity === "error").map((i) => i.title)])), [valid, engine]);
  const doImport = () => {
    const evs = valid.map((r) => r.event!);
    commit(`Imported ${evs.length} events from CSV`, (s) => ({ ...s, events: [...s.events, ...evs] }), { toast: `${evs.length} events imported`, notify: { type: "new_event", title: `${evs.length} events imported`, body: "A schedule was imported from a CSV file." } });
    setImported(evs.length);
    setResult(null);
    setText("");
  };

  const exportEvents = (scope === "all" ? visibleEvents : visibleEvents.filter((e) => e.teamIds.includes(scope))).filter((e) => new Date(e.end) > new Date()).sort((a, b) => a.start.localeCompare(b.start));
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname.replace(/schedule-tools\/?$/, "")}share/?team=${shareTeam}` : "";

  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="Import, export & share" sub="Bring in schedules from spreadsheets, export them anywhere, and share read-only links." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          {!can("importSchedule") ? <PermissionNotice action="importSchedule" /> : (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileUp className="size-4" aria-hidden />Import from CSV</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => downloadText("sportsync-template.csv", CSV_HEADERS.join(",") + "\n", "text/csv")}><Download aria-hidden />Template</Button></CardHeader>
              <CardBody className="space-y-4">
                <div className="rounded-xl border-2 border-dashed border-border-strong p-6 text-center"
                  onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}>
                  <FileSpreadsheet className="mx-auto size-8 text-muted" aria-hidden />
                  <p className="mt-2 text-sm font-medium">Drop a CSV file here</p>
                  <p className="text-xs text-muted">Columns: {CSV_HEADERS.join(", ")}. Teams separated by “;”.</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>Choose file</Button>
                    <Button size="sm" variant="outline" onClick={() => preview(sampleCSV(state, dateKey(new Date())))}>Load sample (with 1 bad row)</Button>
                  </div>
                  <input ref={fileRef} type="file" accept=".csv,text/csv" className="sr-only" aria-label="Choose CSV file" onChange={(e) => onFile(e.target.files?.[0])} />
                </div>
                <details>
                  <summary className="cursor-pointer text-sm font-medium">Or paste CSV text</summary>
                  <Textarea aria-label="CSV text" value={text} onChange={(e) => setText(e.target.value)} className="mt-2 font-mono text-xs" />
                  <Button size="sm" className="mt-2" onClick={() => preview(text)} disabled={!text.trim()}>Validate</Button>
                </details>
                {imported !== null && <Alert tone="success" title={`${imported} events imported`} action={<Link className="text-sm font-medium underline" href="/demo/calendar/?view=list">View</Link>}>They are now checked for conflicts like any other event. You can undo from the toast or Settings.</Alert>}
                {result?.headerError && <Alert tone="danger" title="We couldn't read this file">{result.headerError}</Alert>}
                {result && !result.headerError && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2"><Badge tone="success"><CheckCircle2 aria-hidden />{valid.length} ready</Badge>{invalid.length > 0 && <Badge tone="danger"><XCircle aria-hidden />{invalid.length} with errors (will be skipped)</Badge>}</div>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <table className="w-full min-w-[640px] text-sm">
                        <thead className="bg-surface-2 text-left text-xs text-muted"><tr><th className="px-3 py-2 font-medium">Row</th><th className="px-3 py-2 font-medium">Event</th><th className="px-3 py-2 font-medium">When / where</th><th className="px-3 py-2 font-medium">Status</th></tr></thead>
                        <tbody>
                          {result.rows.map((r) => (
                            <tr key={r.line} className="border-t border-border align-top">
                              <td className="px-3 py-2 tabular-nums text-muted">{r.line}</td>
                              <td className="px-3 py-2 font-medium">{r.raw.title || "(no title)"}<span className="block text-xs font-normal text-muted">{r.raw.type}</span></td>
                              <td className="px-3 py-2 text-xs">{r.event ? <>{fmtDay(r.event.start)} · {fmtRange(r.event.start, r.event.end)}<br />{r.raw.venue}</> : `${r.raw.date} ${r.raw.start}–${r.raw.end}`}</td>
                              <td className="px-3 py-2 text-xs">
                                {r.errors.length ? <ul className="space-y-0.5 text-danger">{r.errors.map((e) => <li key={e}>✕ {e}</li>)}</ul>
                                  : (warn.get(r.line)?.length ? <span className="text-warning">⚠ Imports with conflict: {warn.get(r.line)!.join(", ")}</span> : <span className="text-success">✓ Ready</span>)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setResult(null)}>Cancel</Button><Button onClick={doImport} disabled={!valid.length}>Import {valid.length} events</Button></div>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Download className="size-4" aria-hidden />Export</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              <Select aria-label="What to export" value={scope} onChange={(e) => setScope(e.target.value)}><option value="all">All upcoming events I can see</option>{state.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
              <p className="text-xs text-muted">{exportEvents.length} upcoming events</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => { downloadText("sportsync-schedule.csv", toCSV(exportEvents, state), "text/csv;charset=utf-8"); toast("CSV downloaded", "info"); }}>CSV</Button>
                <Button variant="outline" onClick={() => { downloadText("sportsync-schedule.ics", buildICS(exportEvents, state), "text/calendar;charset=utf-8"); toast(".ics downloaded", "info"); }}>.ics calendar</Button>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="size-4" aria-hidden />Share a schedule</CardTitle></CardHeader>
            <CardBody className="space-y-3 text-sm">
              <Select aria-label="Team to share" value={shareTeam} onChange={(e) => setShareTeam(e.target.value)}>{state.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</Select>
              <div className="flex gap-2"><Input readOnly aria-label="Share link" value={shareUrl} onFocus={(e) => e.target.select()} /><Button variant="outline" onClick={() => navigator.clipboard?.writeText(shareUrl).then(() => toast("Link copied", "info"), () => toast("Copy failed", "warning"))}>Copy</Button></div>
              <Link className="text-xs font-medium text-info hover:underline" href={`/demo/share/?team=${shareTeam}`}>Open the shared view</Link>
              <p className="text-xs text-muted">Demo limitation: without a server, the link shows the sample schedule plus changes saved in the browser that opens it.</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
