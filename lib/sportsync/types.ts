// SportSync domain model. All data in the demo is fictional sample data.

export type Role = "league_admin" | "org_manager" | "coach" | "parent" | "athlete" | "facility_manager";
export type EventType = "game" | "practice" | "tournament" | "meeting";
export type EventStatus = "scheduled" | "postponed" | "cancelled";
export type RsvpStatus = "yes" | "no" | "maybe" | "pending";
export type Sport = "basketball" | "soccer";

export interface TimeRange {
  start: string; // ISO datetime
  end: string; // ISO datetime
  reason: string;
}

export interface Venue {
  id: string;
  name: string;
  site: string;
  address: string;
  sports: Sport[];
  capacity: number;
  open: string; // "HH:MM"
  close: string; // "HH:MM"
  equipment: string[];
  restrictions: string[];
  closures: { date: string; reason: string }[]; // date = YYYY-MM-DD
  maintenance: TimeRange[];
}

export interface Team {
  id: string;
  name: string;
  sport: Sport;
  ageGroup: string;
  coachId: string;
  color: string;
  playerIds: string[];
}

export interface Person {
  id: string;
  name: string;
  kind: "coach" | "player";
  teamIds: string[];
  guardian?: string; // parent / guardian name for players
  guardianId?: string;
  unavailable: TimeRange[];
}

export interface SportEvent {
  id: string;
  title: string;
  type: EventType;
  teamIds: string[];
  venueId: string;
  start: string;
  end: string;
  status: EventStatus;
  notes?: string;
  seriesId?: string;
  statusReason?: string;
  expectedAttendance?: number;
  source?: "manual" | "assistant" | "import" | "seed";
  label?: string; // e.g. "Semifinal 1: A1 vs B2" for placeholder brackets
}

export interface Series {
  id: string;
  title: string;
  byDay: number[]; // 0 = Sunday
  startTime: string;
  endTime: string;
  from: string; // YYYY-MM-DD
  until: string; // YYYY-MM-DD
}

export type ConflictKind =
  | "venue_double_booked"
  | "team_overlap"
  | "coach_unavailable"
  | "player_unavailable"
  | "insufficient_rest"
  | "facility_closed"
  | "outside_hours"
  | "maintenance"
  | "capacity"
  | "recurring_conflict";

export interface Conflict {
  id: string;
  kind: ConflictKind;
  severity: "error" | "warning";
  eventIds: string[];
  title: string;
  message: string;
  fix: string; // short actionable recommendation
}

export type NotificationType =
  | "new_event"
  | "schedule_change"
  | "cancellation"
  | "venue_change"
  | "upcoming_game"
  | "rsvp_reminder"
  | "conflict"
  | "ai_recommendation";

export type Channel = "email" | "sms" | "push";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  at: string;
  read: boolean;
  eventId?: string;
  channels: Channel[];
}

export interface Revision {
  id: string;
  label: string;
  at: string;
}

export interface Proposal {
  id: string;
  version: number;
  prompt: string;
  understood: string[];
  events: SportEvent[];
  explanation: string[];
  warnings: string[];
  stats: { label: string; value: string }[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface Settings {
  minRestHours: number;
  timezone: string;
  playerUnavailableThreshold: number; // share of roster that turns a warning into an error
}
