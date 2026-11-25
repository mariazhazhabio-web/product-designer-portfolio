export interface SiteNode { label: string; href?: string; children?: SiteNode[]; roles?: string }

export const sitemap: SiteNode = {
  label: "SportSync",
  children: [
    { label: "Dashboard", href: "/demo/", roles: "All roles (content adapts)", children: [{ label: "Alerts & conflicts summary" }, { label: "Pending RSVPs" }, { label: "Venue availability" }, { label: "Family view (parents)" }] },
    { label: "Schedule", href: "/demo/calendar/", children: [{ label: "Day (by venue)" }, { label: "Week" }, { label: "Month" }, { label: "List" }, { label: "Event detail → edit / duplicate / reschedule / postpone / cancel" }] },
    { label: "AI assistant", href: "/demo/assistant/", roles: "Admin, org manager, coach (draft only)", children: [{ label: "Instruction → proposal" }, { label: "Explanation & stats" }, { label: "Edit rows / revise / approve / reject" }, { label: "Proposal history" }] },
    { label: "Conflicts", href: "/demo/conflicts/", children: [{ label: "Blocking" }, { label: "Warnings" }, { label: "Needs a new date (postponed)" }, { label: "Acknowledged" }, { label: "Compare alternatives → confirm" }] },
    { label: "RSVP & attendance", href: "/demo/attendance/", children: [{ label: "My RSVPs (parents / athletes)" }, { label: "Expected attendance (coaches)" }, { label: "Attendance tracking" }] },
    { label: "Teams", href: "/demo/teams/", children: [{ label: "Roster" }, { label: "Availability" }, { label: "Team schedule & share link" }] },
    { label: "Venues", href: "/demo/venues/", children: [{ label: "Directory" }, { label: "Booking calendar" }, { label: "Maintenance & closures" }] },
    { label: "Import, export & share", href: "/demo/schedule-tools/", children: [{ label: "CSV import + validation" }, { label: "CSV / .ics export" }, { label: "Share links" }] },
    { label: "Calendar sync", href: "/demo/sync/", children: [{ label: ".ics download" }, { label: "Add-to-calendar links" }, { label: "Google / Apple / Outlook (OAuth, simulated)" }] },
    { label: "Notifications", href: "/demo/notifications/", children: [{ label: "History" }, { label: "Channel previews" }, { label: "Preferences" }] },
    { label: "Settings", href: "/demo/settings/", children: [{ label: "Scheduling rules" }, { label: "Revision history & restore" }, { label: "Permissions matrix" }] },
    { label: "Onboarding", href: "/demo/onboarding/" },
  ],
};

export const featureHierarchy = [
  { tier: "Core (MVP)", items: ["Event CRUD", "Calendar views", "Conflict detection", "RSVP", ".ics export", "Roles & permissions"] },
  { tier: "Differentiators", items: ["Explainable AI scheduling", "Compare alternatives", "Recurring edit scopes", "Venue rules engine"] },
  { tier: "Reach", items: ["Two-way calendar sync", "Multi-channel notifications", "Share links", "CSV import"] },
  { tier: "Resilience", items: ["Undo & revision history", "Offline queue", "Empty / error / permission states"] },
];

export type FlowStep = { label: string; kind?: "start" | "step" | "system" | "decision" | "end"; branches?: { label: string; to: string }[] };
export interface Flow { id: string; title: string; actor: string; goal: string; steps: FlowStep[]; demo: string }

export const flows: Flow[] = [
  { id: "create-event", title: "Create a sports event", actor: "Coach / admin", goal: "Add a game or practice without creating conflicts", demo: "/demo/calendar/", steps: [
    { label: "Tap Quick create or an empty calendar slot", kind: "start" },
    { label: "Enter name, type, teams, venue, date and time" },
    { label: "System checks venue, teams, coaches, players, hours", kind: "system" },
    { label: "Any blocking conflict?", kind: "decision", branches: [{ label: "Yes", to: "Show conflict + “Find conflict-free times” → pick suggestion" }, { label: "No", to: "Show “No conflicts found”" }] },
    { label: "Optional: repeat weekly (days + end date)" },
    { label: "Choose whether to notify families" },
    { label: "Save → event on calendar, notifications sent, undo available", kind: "end" },
  ]},
  { id: "ai-schedule", title: "Generate an AI-assisted schedule", actor: "League admin", goal: "Produce a fair tournament schedule and publish it confidently", demo: "/demo/assistant/", steps: [
    { label: "Open AI assistant and describe the schedule", kind: "start" },
    { label: "System parses constraints and shows “What I understood”", kind: "system" },
    { label: "Scheduler builds rounds, assigns slots, validates each game", kind: "system" },
    { label: "Review proposal, explanation and fairness stats" },
    { label: "Happy with it?", kind: "decision", branches: [{ label: "Tweak rows", to: "Edit time/venue or remove a game (re-validated live)" }, { label: "Change rules", to: "Revise in plain language → new version" }, { label: "No", to: "Reject: nothing is published" }] },
    { label: "Approve & publish → events added, teams notified", kind: "end" },
    { label: "Undo available from toast or revision history", kind: "system" },
  ]},
  { id: "resolve-conflict", title: "Resolve a scheduling conflict", actor: "Admin / facility manager", goal: "Fix a clash with the least disruption", demo: "/demo/conflicts/", steps: [
    { label: "See alert on dashboard or Conflicts page", kind: "start" },
    { label: "Read plain-language cause and suggested fix" },
    { label: "Blocking or warning?", kind: "decision", branches: [{ label: "Warning", to: "Acknowledge as known risk, or fix" }, { label: "Blocking", to: "Choose which event should move" }] },
    { label: "Compare 3 ranked alternatives (reasons + trade-offs)" },
    { label: "Review before → after and who will be notified" },
    { label: "Confirm → event moved, conflict cleared, families notified", kind: "end" },
  ]},
  { id: "import", title: "Import a schedule", actor: "League admin", goal: "Bring a spreadsheet schedule in without bad data", demo: "/demo/schedule-tools/", steps: [
    { label: "Download template or export spreadsheet as CSV", kind: "start" },
    { label: "Drop file / choose file / paste text" },
    { label: "Valid CSV with required columns?", kind: "decision", branches: [{ label: "No", to: "Explain what's missing and how to fix" }, { label: "Yes", to: "Row-by-row preview" }] },
    { label: "Rows with errors are flagged and will be skipped", kind: "system" },
    { label: "Rows that import with conflicts are warned", kind: "system" },
    { label: "Import N valid events → conflict engine runs", kind: "end" },
  ]},
  { id: "reschedule", title: "Reschedule a game", actor: "Admin / coach (own team)", goal: "Move a postponed or clashing game", demo: "/demo/conflicts/?tab=postponed", steps: [
    { label: "Open event → Reschedule, or Postponed queue → Find a new date", kind: "start" },
    { label: "System searches 14 days × suitable venues × 30-min slots", kind: "system" },
    { label: "Compare best match and alternatives" },
    { label: "Any acceptable option?", kind: "decision", branches: [{ label: "No", to: "Edit manually or adjust rules" }, { label: "Yes", to: "Select option" }] },
    { label: "Confirm and notify", kind: "end" },
  ]},
  { id: "rsvp", title: "Confirm attendance", actor: "Parent / athlete", goal: "Respond in one tap", demo: "/demo/attendance/", steps: [
    { label: "Receive RSVP reminder (push / SMS / email)", kind: "start" },
    { label: "Open event or My RSVPs" },
    { label: "Several children on this event?", kind: "decision", branches: [{ label: "Yes", to: "One row per child" }, { label: "No", to: "Single RSVP control" }] },
    { label: "Tap Going / Maybe / Can't go" },
    { label: "Coach's expected attendance updates instantly", kind: "end" },
  ]},
  { id: "book-venue", title: "Book a venue", actor: "Coach / admin / facility manager", goal: "Reserve a facility within its rules", demo: "/demo/venues/", steps: [
    { label: "Open Venues → pick site and court/field", kind: "start" },
    { label: "Check booking calendar, hours, capacity, restrictions" },
    { label: "Click a free slot or “Book this venue”" },
    { label: "Inside hours, no closure/maintenance, no double booking?", kind: "decision", branches: [{ label: "No", to: "Explain rule + suggest free times" }, { label: "Yes", to: "Proceed" }] },
    { label: "Save booking as an event", kind: "end" },
  ]},
  { id: "share", title: "Share a schedule", actor: "Coach / admin", goal: "Give non-members a read-only view", demo: "/demo/schedule-tools/", steps: [
    { label: "Open Teams or Import & share", kind: "start" },
    { label: "Pick a team" },
    { label: "Copy link (read-only, no account)" },
    { label: "Recipient opens link → can add all to calendar", kind: "end" },
  ]},
  { id: "sync", title: "Synchronize a calendar", actor: "Parent / athlete / coach", goal: "See events in the calendar they already use", demo: "/demo/sync/", steps: [
    { label: "Open Calendar sync (or onboarding step 3)", kind: "start" },
    { label: "Which calendar?", kind: "decision", branches: [{ label: "Any app", to: "Download .ics (works now)" }, { label: "Google / Outlook", to: "One-click add event (works now) or OAuth two-way sync (simulated)" }, { label: "Apple", to: ".ics / webcal subscription" }] },
    { label: "OAuth: consent on provider's page; SportSync never sees the password", kind: "system" },
    { label: "Events appear and stay updated", kind: "end" },
  ]},
];

export const decisionTrees = [
  {
    title: "Which event moves when two events clash?",
    nodes: [
      { q: "Is one event a game/tournament and the other a practice?", yes: "Move the practice (fewer people affected)", no: "Next question" },
      { q: "Does one event belong to a recurring series?", yes: "Move the one-off event, or edit the series for all future dates", no: "Next question" },
      { q: "Was one event created more recently?", yes: "Suggest moving the newer event (default selection)", no: "Ask the admin to choose" },
    ],
  },
  {
    title: "Which notification channels to use?",
    nodes: [
      { q: "Is it a cancellation or a change within 24 hours?", yes: "All channels the person has enabled, including SMS", no: "Next question" },
      { q: "Is it an RSVP reminder?", yes: "Push first; email if no response after 24h", no: "Next question" },
      { q: "Otherwise", yes: "Respect per-type preferences; default push + email", no: "" },
    ],
  },
];
