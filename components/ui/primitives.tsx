"use client";

import { useEffect, useId, useRef, useState, type ComponentProps, type ReactNode, type KeyboardEvent } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/* ---------------- Dialog (native <dialog>: focus trap, Esc, inert background built in) ---------------- */
export function Dialog({
  open, onClose, title, description, children, footer, size = "md", className,
}: {
  open: boolean; onClose: () => void; title: string; description?: ReactNode; children?: ReactNode; footer?: ReactNode; size?: "sm" | "md" | "lg" | "xl"; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className={cn("m-auto w-[calc(100%-2rem)] rounded-2xl border border-border bg-surface p-0 text-text shadow-2xl", widths[size], className)}
    >
      {open && (
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
              {description && <div className="mt-1 text-sm text-muted">{description}</div>}
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close dialog"><X /></Button>
          </div>
          <div className="overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-3">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, body, confirmLabel = "Confirm", tone = "primary" }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; body: ReactNode; confirmLabel?: string; tone?: "primary" | "danger";
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} size="sm"
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button variant={tone} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button></>}>
      <div className="text-sm text-muted">{body}</div>
    </Dialog>
  );
}

/* ---------------- Tabs (WAI-ARIA tabs pattern with arrow-key navigation) ---------------- */
export function Tabs({ tabs, value, onChange, label, className, size = "md" }: {
  tabs: { id: string; label: ReactNode; count?: number }[]; value: string; onChange: (id: string) => void; label: string; className?: string; size?: "sm" | "md";
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[n].id);
    refs.current[n]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className={cn("inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-surface-2 p-1", className)}>
      {tabs.map((t, i) => (
        <button key={t.id} ref={(el) => { refs.current[i] = el; }} role="tab" type="button" aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1}
          onKeyDown={(e) => onKey(e, i)} onClick={() => onChange(t.id)}
          className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors cursor-pointer", size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
            value === t.id ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text")}>
          {t.label}
          {t.count !== undefined && <span className="rounded-full bg-surface-3 px-1.5 text-[11px] tabular-nums">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Form controls ---------------- */
export function Field({ label, hint, error, children, htmlFor, required }: { label: string; hint?: string; error?: string; children: ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium">{label}{required && <span className="text-danger" aria-hidden> *</span>}</label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs font-medium text-danger" role="alert">{error}</p>}
    </div>
  );
}

const control = "w-full rounded-lg border border-border-strong bg-surface px-3 text-sm text-text placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-ring aria-[invalid=true]:border-danger";
export function Input({ className, ...p }: ComponentProps<"input">) { return <input className={cn(control, "h-10", className)} {...p} />; }
export function Select({ className, ...p }: ComponentProps<"select">) { return <select className={cn(control, "h-10 pr-8", className)} {...p} />; }
export function Textarea({ className, ...p }: ComponentProps<"textarea">) { return <textarea className={cn(control, "min-h-24 py-2", className)} {...p} />; }

export function Switch({ checked, onChange, label, id, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; id?: string; disabled?: boolean }) {
  return (
    <button id={id} type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)}
      className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors disabled:opacity-50", checked ? "border-primary bg-primary" : "border-border-strong bg-surface-3")}>
      <span className={cn("inline-block h-4.5 w-4.5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5.5" : "translate-x-0.5")} />
    </button>
  );
}

export function Checkbox({ label, className, ...p }: ComponentProps<"input"> & { label: ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-2 text-sm", className)}>
      <input type="checkbox" className="h-4 w-4 accent-[var(--primary)]" {...p} />
      <span>{label}</span>
    </label>
  );
}

/* ---------------- Feedback ---------------- */
const alertTone = {
  info: { cls: "border-info/30 bg-info-soft text-info", Icon: Info },
  success: { cls: "border-success/30 bg-success-soft text-success", Icon: CheckCircle2 },
  warning: { cls: "border-warning/30 bg-warning-soft text-warning", Icon: AlertTriangle },
  danger: { cls: "border-danger/30 bg-danger-soft text-danger", Icon: XCircle },
};
export function Alert({ tone = "info", title, children, action, className }: { tone?: keyof typeof alertTone; title?: ReactNode; children?: ReactNode; action?: ReactNode; className?: string }) {
  const { cls, Icon } = alertTone[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex gap-3 rounded-xl border p-3.5", cls, className)}>
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1 text-sm">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-text/85 dark:text-text/90 [&_p]:mt-0.5">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong px-6 py-10 text-center">
      {icon && <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-surface-2 text-muted [&_svg]:size-6">{icon}</div>}
      <p className="font-semibold">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton h-4", className)} />;
}

export function Tooltip({ content, children }: { content: string; children: ReactNode }) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)}
      onKeyDown={(e) => { if (e.key === "Escape") setShow(false); }} aria-describedby={id}>
      {children}
      <span id={id} role="tooltip" className={cn("pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-56 -translate-x-1/2 rounded-md bg-text px-2 py-1 text-xs text-bg shadow transition-opacity", show ? "block" : "hidden")}>
        {content}
      </span>
    </span>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: "danger" | "warning" | "success" }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={cn("mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums", tone === "danger" && "text-danger", tone === "warning" && "text-warning", tone === "success" && "text-success")}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function Avatar({ name, color, size = 32 }: { name: string; color?: string; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <span aria-hidden className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white" style={{ width: size, height: size, fontSize: size * 0.38, background: color ?? "#475569" }}>
      {initials}
    </span>
  );
}
