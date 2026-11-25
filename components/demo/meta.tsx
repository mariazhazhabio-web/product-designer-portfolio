import { Ban, CalendarClock, CalendarDays, Dumbbell, Trophy, Users } from "lucide-react";
import type { EventStatus, EventType, RsvpStatus } from "@/lib/sportsync/types";
import { Badge } from "@/components/ui/badge";

export const TYPE_META: Record<EventType, { label: string; dot: string; bar: string; Icon: typeof Trophy }> = {
  game: { label: "Game", dot: "bg-ev-game", bar: "border-l-ev-game", Icon: CalendarDays },
  practice: { label: "Practice", dot: "bg-ev-practice", bar: "border-l-ev-practice", Icon: Dumbbell },
  tournament: { label: "Tournament", dot: "bg-ev-tournament", bar: "border-l-ev-tournament", Icon: Trophy },
  meeting: { label: "Meeting", dot: "bg-ev-meeting", bar: "border-l-ev-meeting", Icon: Users },
};

export function TypeBadge({ type }: { type: EventType }) {
  const m = TYPE_META[type];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
      <span aria-hidden className={`size-2 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: EventStatus }) {
  if (status === "scheduled") return null;
  return status === "cancelled"
    ? <Badge tone="danger"><Ban aria-hidden />Cancelled</Badge>
    : <Badge tone="warning"><CalendarClock aria-hidden />Postponed</Badge>;
}

export const RSVP_META: Record<RsvpStatus, { label: string; tone: "success" | "danger" | "warning" | "neutral"; short: string }> = {
  yes: { label: "Attending", tone: "success", short: "Yes" },
  no: { label: "Not attending", tone: "danger", short: "No" },
  maybe: { label: "Maybe", tone: "warning", short: "Maybe" },
  pending: { label: "No response", tone: "neutral", short: "Pending" },
};
