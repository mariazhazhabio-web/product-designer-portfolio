import type { Block, Screen } from "@/content/screens";
import { cn, withBase } from "@/lib/utils";

export type Fidelity = "lo" | "mid" | "hi";

function BlockView({ b, f }: { b: Block; f: Fidelity }) {
  const [kind, x, y, w, h, label] = b;
  const style = { gridColumn: `${x + 1} / span ${w}`, gridRow: `${y + 1} / span ${h}` };
  const lo = f === "lo";
  const base = lo ? "border border-dashed border-[#9aa1ab] bg-transparent" : "border border-transparent";
  const text = <span className={cn("truncate px-1", lo ? "text-[7px] uppercase tracking-wide text-[#7a828d]" : "text-[8px] text-[#3b4250]")}>{label}</span>;
  switch (kind) {
    case "top": return <div style={style} className={cn("flex items-center rounded-sm", lo ? base : "bg-[#d5d8dd]")}>{text}</div>;
    case "nav": return <div style={style} className={cn("flex flex-col gap-1 rounded-sm p-1", lo ? base : "bg-[#e3e5e8]")}>{Array.from({ length: 9 }, (_, i) => <span key={i} className={cn("h-1 rounded-full", lo ? "bg-[#c4c8ce]" : i === 0 ? "bg-[#6b7280]" : "bg-[#b9bdc4]")} style={{ width: `${55 + ((i * 17) % 35)}%` }} />)}</div>;
    case "h": return <div style={style} className="flex items-center">{lo ? <span className="h-2 w-2/3 rounded bg-[#b9bdc4]" /> : <span className="truncate text-[10px] font-bold text-[#1f2430]">{label}</span>}</div>;
    case "t": return <div style={style} className="flex flex-col justify-center gap-0.5">{lo ? [80, 60].map((p) => <span key={p} className="h-1 rounded bg-[#c4c8ce]" style={{ width: `${p}%` }} />) : <span className="text-[8px] leading-tight text-[#4b5260]">{label}</span>}</div>;
    case "btn": return <div style={style} className={cn("flex items-center justify-center rounded", lo ? base : "border border-[#8b919b] bg-white")}>{text}</div>;
    case "btnp": return <div style={style} className={cn("flex items-center justify-center rounded", lo ? "border-2 border-dashed border-[#6b7280]" : "bg-[#3b4250]")}><span className={cn("truncate px-1 text-[8px]", lo ? "uppercase text-[#6b7280]" : "font-semibold text-white")}>{label}</span></div>;
    case "stat": return <div style={style} className={cn("flex flex-col justify-center gap-0.5 rounded p-1", lo ? base : "bg-white")}>{text}<span className={cn("ml-1 h-2.5 w-1/3 rounded", lo ? "bg-[#d5d8dd]" : "bg-[#6b7280]")} /></div>;
    case "list": return <div style={style} className={cn("flex flex-col gap-1 overflow-hidden rounded p-1", lo ? base : "bg-white")}>{!lo && text}{Array.from({ length: Math.max(2, h * 1.2) | 0 }, (_, i) => <div key={i} className="flex items-center gap-1"><span className={cn("h-2.5 w-2.5 shrink-0 rounded-sm", lo ? "border border-[#b9bdc4]" : "bg-[#9aa1ab]")} /><span className={cn("h-1 flex-1 rounded", lo ? "bg-[#d5d8dd]" : "bg-[#c4c8ce]")} /></div>)}</div>;
    case "cal": return <div style={style} className={cn("grid grid-cols-7 gap-px overflow-hidden rounded", lo ? base : "bg-[#c4c8ce]")}>{Array.from({ length: 35 }, (_, i) => <span key={i} className={cn("p-0.5", lo ? "border border-dotted border-[#d5d8dd]" : "bg-white")}>{!lo && i % 3 === 0 && <span className="block h-1 rounded bg-[#9aa1ab]" />}</span>)}</div>;
    case "week": return <div style={style} className={cn("relative grid grid-cols-7 gap-px overflow-hidden rounded", lo ? base : "bg-[#c4c8ce]")}>{Array.from({ length: 7 }, (_, i) => <span key={i} className={cn("relative", lo ? "border-l border-dotted border-[#d5d8dd]" : "bg-white")}>{[18, 50].map((t) => <span key={t} className={cn("absolute inset-x-0.5 rounded-sm", lo ? "border border-dashed border-[#9aa1ab]" : "bg-[#9aa1ab]")} style={{ top: `${t + ((i * 7) % 15)}%`, height: "14%" }} />)}</span>)}{!lo && <span className="absolute left-1 top-0.5 text-[7px] text-[#4b5260]">{label}</span>}</div>;
    case "chart": return <div style={style} className={cn("flex items-end gap-0.5 rounded p-1", lo ? base : "bg-white")}>{[40, 70, 55, 85, 60, 75].map((v, i) => <span key={i} className={cn("flex-1 rounded-t-sm", lo ? "border border-dashed border-[#b9bdc4]" : "bg-[#9aa1ab]")} style={{ height: `${v}%` }} />)}</div>;
    case "input": return <div style={style} className={cn("flex items-center rounded", lo ? base : "border border-[#9aa1ab] bg-white")}>{text}</div>;
    case "table": return <div style={style} className={cn("flex flex-col overflow-hidden rounded", lo ? base : "bg-white")}>{Array.from({ length: Math.max(3, h + 1) }, (_, i) => <div key={i} className={cn("flex gap-1 border-b px-1 py-0.5", lo ? "border-dotted border-[#d5d8dd]" : i === 0 ? "border-[#c4c8ce] bg-[#e3e5e8]" : "border-[#e3e5e8]")}>{[25, 30, 25, 20].map((wd, j) => <span key={j} className={cn("h-1 rounded", lo ? "bg-[#d5d8dd]" : "bg-[#c4c8ce]")} style={{ width: `${wd}%` }} />)}</div>)}</div>;
    case "tabs": return <div style={style} className={cn("flex items-center gap-1 rounded p-0.5", lo ? base : "bg-[#e3e5e8]")}>{lo ? [1, 2, 3, 4].map((i) => <span key={i} className="h-1.5 flex-1 rounded border border-dashed border-[#b9bdc4]" />) : text}</div>;
    case "modal": return <div style={style} className={cn("relative z-10 rounded-md p-1 shadow", lo ? "border-2 border-dashed border-[#6b7280] bg-[#f7f7f4]" : "border border-[#9aa1ab] bg-[#f1f2f4]")}><span className={cn("block border-b px-1 pb-0.5 text-[9px] font-semibold", lo ? "border-dashed border-[#b9bdc4] text-[#6b7280]" : "border-[#c4c8ce] text-[#1f2430]")}>{label}</span></div>;
    case "alert": return <div style={style} className={cn("z-20 flex items-start gap-1 rounded p-1", lo ? "border border-dashed border-[#6b7280]" : "border-l-4 border-[#4b5260] bg-[#e3e5e8]")}><span className={cn("mt-0.5 size-2 shrink-0 rounded-full", lo ? "border border-[#6b7280]" : "bg-[#4b5260]")} />{text}</div>;
    case "img": return <div style={style} className={cn("relative z-20 flex items-center justify-center overflow-hidden rounded", lo ? base : "bg-[#d5d8dd]")}>{lo && <svg className="absolute inset-0 h-full w-full text-[#c4c8ce]" preserveAspectRatio="none" viewBox="0 0 10 10" aria-hidden><path d="M0 0L10 10M10 0L0 10" stroke="currentColor" strokeWidth="0.15" /></svg>}{text}</div>;
    case "tabbar": return <div style={style} className={cn("flex items-center justify-around rounded-sm", lo ? base : "bg-[#d5d8dd]")}>{[1, 2, 3, 4, 5].map((i) => <span key={i} className={cn("rounded-full", i === 3 ? "size-3" : "size-2", lo ? "border border-[#9aa1ab]" : i === 3 ? "bg-[#3b4250]" : "bg-[#9aa1ab]")} />)}</div>;
    case "chip": return <div style={style} className="flex items-center gap-1">{lo ? [1, 2, 3].map((i) => <span key={i} className="h-2 w-8 rounded-full border border-dashed border-[#9aa1ab]" />) : <span className="truncate rounded-full bg-[#e3e5e8] px-1.5 py-0.5 text-[8px] text-[#3b4250]">{label}</span>}</div>;
    case "toggle": return <div style={style} className="flex items-center gap-1"><span className={cn("h-2 w-4 rounded-full", lo ? "border border-dashed border-[#9aa1ab]" : "bg-[#6b7280]")} />{text}</div>;
    case "skel": return <div style={style} className={cn("rounded", lo ? base : "bg-[#e3e5e8]")} />;
    case "card": default: return <div style={style} className={cn("flex flex-col rounded p-1", lo ? base : "bg-white")}>{text}{!lo && <span className="mx-1 mt-1 h-1 w-2/3 rounded bg-[#d5d8dd]" />}</div>;
  }
}

export function Wireframe({ screen, fidelity }: { screen: Screen; fidelity: Fidelity }) {
  const mobile = screen.device === "mobile";
  if (fidelity === "hi") {
    return <img src={withBase(`/screens/${screen.shot}.png`)} alt={`High-fidelity: ${screen.title}`} loading="lazy" className={cn("w-full rounded-md border border-border bg-surface-2 object-cover object-top", mobile ? "aspect-[9/19]" : "aspect-[16/10]")} />;
  }
  return (
    <div role="img" aria-label={`${fidelity === "lo" ? "Low" : "Mid"}-fidelity wireframe: ${screen.title}`}
      className={cn("grid gap-0.5 overflow-hidden rounded-md border p-1", fidelity === "lo" ? "border-[#c4c8ce] bg-[#fbfbf9]" : "border-[#c4c8ce] bg-[#eef0f2]", mobile ? "aspect-[9/19]" : "aspect-[16/10]")}
      style={{ gridTemplateColumns: `repeat(${mobile ? 8 : 24}, minmax(0,1fr))`, gridTemplateRows: `repeat(${mobile ? 18 : 14}, minmax(0,1fr))` }}>
      {screen.blocks.map((b, i) => <BlockView key={i} b={b} f={fidelity} />)}
    </div>
  );
}
