import type { Role, SportEvent } from "./types";

export const ROLE_LABEL: Record<Role, string> = {
  league_admin: "League administrator",
  org_manager: "Organization manager",
  coach: "Volunteer coach",
  parent: "Parent",
  athlete: "Athlete",
  facility_manager: "Facility manager",
};

export type Action =
  | "createEvent"
  | "editEvent"
  | "deleteEvent"
  | "useAssistant"
  | "approveSchedule"
  | "resolveConflicts"
  | "importSchedule"
  | "manageVenues"
  | "bookVenue"
  | "rsvp"
  | "viewAttendance"
  | "sendReminders"
  | "manageTeams";

export const PERMISSIONS: Record<Action, Role[]> = {
  createEvent: ["league_admin", "org_manager", "coach"],
  editEvent: ["league_admin", "org_manager", "coach"],
  deleteEvent: ["league_admin", "org_manager"],
  useAssistant: ["league_admin", "org_manager", "coach"],
  approveSchedule: ["league_admin", "org_manager"],
  resolveConflicts: ["league_admin", "org_manager", "facility_manager"],
  importSchedule: ["league_admin", "org_manager"],
  manageVenues: ["league_admin", "facility_manager"],
  bookVenue: ["league_admin", "org_manager", "coach", "facility_manager"],
  rsvp: ["parent", "athlete", "coach"],
  viewAttendance: ["league_admin", "org_manager", "coach"],
  sendReminders: ["league_admin", "org_manager", "coach"],
  manageTeams: ["league_admin", "org_manager", "coach"],
};

export const ACTION_LABEL: Record<Action, string> = {
  createEvent: "create events",
  editEvent: "edit events",
  deleteEvent: "delete events",
  useAssistant: "use the scheduling assistant",
  approveSchedule: "approve generated schedules",
  resolveConflicts: "resolve conflicts",
  importSchedule: "import schedules",
  manageVenues: "manage venues",
  bookVenue: "book venues",
  rsvp: "respond to RSVPs",
  viewAttendance: "view expected attendance",
  sendReminders: "send reminders",
  manageTeams: "manage teams",
};

export function can(role: Role, action: Action) {
  return PERMISSIONS[action].includes(role);
}

/** Coaches may only edit events that involve one of their teams. */
export function canEditEvent(role: Role, ev: SportEvent, myTeamIds: string[] | null) {
  if (!can(role, "editEvent")) return false;
  if (role !== "coach") return true;
  return ev.teamIds.some((t) => myTeamIds?.includes(t));
}
