// Usability testing plan, product metrics, engineering traceability and role alignment.

export const usability = {
  objectives: [
    "Can first-time admins create a game without conflicts in under 2 minutes?",
    "Do users understand conflict messages well enough to choose a fix?",
    "Can parents RSVP for a child in under 15 seconds from a notification?",
    "Do admins trust and approve an AI-generated tournament after review?",
    "Can coaches reschedule a practice and know who was notified?",
    "Can coaches book a venue while respecting facility rules?",
  ],
  recruitment: [
    "5–8 participants per round (two rounds planned)",
    "Mix: 2 league admins, 2 volunteer coaches, 2–3 parents (≥1 with multiple children), 1 facility staff",
    "Include ≥1 participant who uses a screen reader or keyboard only, and ≥1 non-native English speaker",
    "Exclude anyone involved in designing SportSync",
    "Incentive: to be decided by Maria (e.g. gift card); budget not yet approved",
  ],
  scenarios: [
    { id: "T1", title: "Create a game", prompt: "Your team plays the Comets next Saturday at 9 am at Riverbend Court A. Add the game.", success: "Game saved with correct teams, venue and time; participant notices any conflict warning.", target: "< 2 min, no help" },
    { id: "T2", title: "Resolve a schedule conflict", prompt: "You've been told Court A is double-booked on Tuesday. Fix it.", success: "Opens the conflict, compares alternatives, confirms one; can say who gets notified.", target: "< 3 min" },
    { id: "T3", title: "Respond to an RSVP", prompt: "You're Sam. Let the coach know Maya can make Saturday's game but Leo can't.", success: "Correct RSVP recorded for each child.", target: "< 30 s" },
    { id: "T4", title: "Generate a tournament schedule", prompt: "Create a schedule for 8 basketball teams over three weekends, one game per team per day. Publish it if you're happy.", success: "Generates, reviews explanation, publishes or explains why not; can find undo.", target: "< 5 min; confidence ≥ 4/5" },
    { id: "T5", title: "Reschedule a practice", prompt: "Thursday's Hawks practice needs to move because the coach is away. Move it to another day this week.", success: "Practice moved for that date only (not the whole series).", target: "< 2 min; correct scope" },
    { id: "T6", title: "Book a venue", prompt: "Book Lakeside Field 1 for a 1-hour scrimmage next Monday afternoon.", success: "Avoids the maintenance window; booking saved.", target: "< 2 min" },
  ],
  severity: [
    { level: "4: Critical", def: "Prevents task completion or causes data loss / wrong schedule published", action: "Fix before next round" },
    { level: "3: Major", def: "Causes significant delay or errors; user needs help", action: "Fix in current iteration" },
    { level: "2: Minor", def: "Causes hesitation or minor errors; user recovers alone", action: "Backlog, prioritise by frequency" },
    { level: "1: Cosmetic", def: "Noticed but no impact on task", action: "Fix when convenient" },
  ],
  sus: [
    "I think that I would like to use this system frequently.",
    "I found the system unnecessarily complex.",
    "I thought the system was easy to use.",
    "I think that I would need the support of a technical person to be able to use this system.",
    "I found the various functions in this system were well integrated.",
    "I thought there was too much inconsistency in this system.",
    "I would imagine that most people would learn to use this system very quickly.",
    "I found the system very cumbersome to use.",
    "I felt very confident using the system.",
    "I needed to learn a lot of things before I could get going with this system.",
  ],
};

export const metrics = [
  { name: "Schedule creation completion rate", def: "Events/schedules saved ÷ create flows started", why: "Low completion signals friction or confusing validation in the editor.", target: "≥ 85%" },
  { name: "Average time to create a schedule", def: "Median time from opening the assistant/editor to publish", why: "Core value proposition; tracks whether automation saves time.", target: "Tournament < 10 min" },
  { name: "Scheduling conflict rate", def: "Published events with ≥1 blocking conflict ÷ all published", why: "Shows whether prevention works; spikes point to missing rules.", target: "< 2%" },
  { name: "Conflict resolution rate", def: "Conflicts resolved within 48h ÷ conflicts detected", why: "Measures if fixes are actionable; low rate means messages or alternatives aren't helping.", target: "≥ 80%" },
  { name: "RSVP response rate", def: "Responses ÷ RSVP requests, 24h before event", why: "Coaches need attendance; low rates suggest channel or friction issues.", target: "≥ 75%" },
  { name: "Calendar sync adoption", def: "Active users with ≥1 connected/exported calendar", why: "Families living in their own calendar are less likely to miss changes.", target: "≥ 50%" },
  { name: "AI scheduling adoption", def: "Schedules created via assistant ÷ all multi-event schedules", why: "Shows whether the assistant is discoverable and useful.", target: "≥ 30%" },
  { name: "AI recommendation acceptance rate", def: "Proposals approved (with or without edits) ÷ generated", why: "Proxy for trust and quality; heavy edits reveal rule gaps.", target: "≥ 60%" },
  { name: "User retention (W4)", def: "Users active in week 4 ÷ new users in week 0", why: "Season-based product: retention should follow the season calendar.", target: "Track by role" },
  { name: "User satisfaction (SUS / CSAT)", def: "SUS score from tests; in-app CSAT after key tasks", why: "Balances speed metrics with perceived ease.", target: "SUS ≥ 75" },
  { name: "Task completion rate", def: "Usability tasks completed without assistance", why: "Direct evidence from testing for design iteration.", target: "≥ 90%" },
];

// Clearly labeled DEMONSTRATION data for the analytics dashboard (not real usage).
export const demoSeries = {
  weekly: [
    { week: "W1", completion: 71, conflictRate: 6.1, rsvp: 58, aiAccept: 44, timeMin: 38 },
    { week: "W2", completion: 74, conflictRate: 5.2, rsvp: 61, aiAccept: 49, timeMin: 31 },
    { week: "W3", completion: 78, conflictRate: 4.0, rsvp: 66, aiAccept: 55, timeMin: 24 },
    { week: "W4", completion: 81, conflictRate: 3.1, rsvp: 69, aiAccept: 58, timeMin: 19 },
    { week: "W5", completion: 83, conflictRate: 2.6, rsvp: 72, aiAccept: 61, timeMin: 15 },
    { week: "W6", completion: 86, conflictRate: 1.9, rsvp: 76, aiAccept: 64, timeMin: 12 },
  ],
  sync: [
    { name: ".ics download", value: 34 },
    { name: "Google", value: 27 },
    { name: "Apple", value: 22 },
    { name: "Outlook", value: 9 },
    { name: "None", value: 8 },
  ],
  conflicts: [
    { kind: "Venue double-booked", detected: 42, resolved: 39 },
    { kind: "Team overlap", detected: 18, resolved: 17 },
    { kind: "Coach unavailable", detected: 15, resolved: 11 },
    { kind: "Insufficient rest", detected: 12, resolved: 9 },
    { kind: "Facility closed", detected: 9, resolved: 9 },
    { kind: "Outside hours", detected: 7, resolved: 7 },
  ],
  retention: [
    { role: "Admins", w1: 100, w2: 92, w3: 88, w4: 85 },
    { role: "Coaches", w1: 100, w2: 81, w3: 74, w4: 70 },
    { role: "Parents", w1: 100, w2: 68, w3: 59, w4: 55 },
  ],
};

export const traceability = [
  { need: "Admins need conflict-free schedules (H1, H6)", req: "FR-3 Conflict detection; FR-4 Alternatives", screen: "Event editor, Conflicts, Compare dialog", impl: "lib/sportsync/conflicts.ts", test: "unit: seed plants every conflict category; alternatives are conflict-free · e2e: resolve conflict" },
  { need: "Admins need fast, fair tournaments (H1, H5)", req: "FR-5 AI-assisted generation; FR-6 Review/approve/undo", screen: "AI assistant", impl: "lib/sportsync/assistant.ts", test: "unit: example prompt once-per-day · e2e: generate & approve" },
  { need: "Coaches need expected attendance (H2)", req: "FR-7 RSVP & attendance", screen: "Attendance, Event detail", impl: "app/demo/attendance", test: "e2e: parent RSVP updates coach view" },
  { need: "Families live in their own calendar (H3, H7)", req: "FR-8 Calendar export & sync", screen: "Calendar sync, Add to calendar", impl: "lib/sportsync/ics.ts", test: "unit: ICS RFC 5545 · e2e: .ics download" },
  { need: "Admins import existing spreadsheets", req: "FR-9 CSV import/export", screen: "Import, export & share", impl: "lib/sportsync/csv.ts", test: "unit: CSV round trip · e2e: import sample" },
  { need: "Facility rules must be respected (H6)", req: "FR-10 Venue management", screen: "Venues", impl: "Venue model + facilityIssues()", test: "unit: facility_closed, maintenance, outside_hours detected" },
  { need: "Everyone sees only what they may change", req: "FR-11 Role-based access", screen: "Role switcher, Permission notices", impl: "lib/sportsync/permissions.ts", test: "e2e: parent cannot create events" },
  { need: "Recurring practices change often", req: "FR-2 Recurring events with edit scopes", screen: "Event editor scope dialog", impl: "components/demo/event-form.tsx", test: "QA-TC-07 (manual)" },
  { need: "Accessible to all users", req: "NFR-1 WCAG 2.2 AA", screen: "All", impl: "Tokens, focus styles, ARIA patterns", test: "QA checklist §Accessibility (manual + axe recommended)" },
];

export const alignment = [
  { resp: "Designing end-to-end scheduling experiences", evidence: "Full lifecycle in the live demo: create → detect conflicts → reschedule → notify → RSVP → sync.", links: [["Live demo", "/demo/"], ["User flows", "/architecture/#flows"]] },
  { resp: "Maintaining consistency across web, iOS and Android", evidence: "One token-based design system; platform comparison showing shared structure with native conventions (tab bar vs. navigation bar, sheets, FAB).", links: [["Platform conventions", "/prototypes/#platforms"], ["Design system", "/design-system/"]] },
  { resp: "Designing the complete scheduling lifecycle", evidence: "Recurring series with this/following/all edits, postponements queue, cancellations, restore, duplicate, undo and revision history.", links: [["Case study §15", "/projects/sportsync/#ai"], ["Conflicts", "/demo/conflicts/"]] },
  { resp: "Supporting coaches, parents and league administrators", evidence: "Role switcher with six roles; dashboards, permissions and RSVP flows adapt per role. Five provisional personas.", links: [["Personas", "/research/#personas"], ["Role access map", "/architecture/#roles"]] },
  { resp: "Prototyping and usability testing", evidence: "Interactive hi-fi prototype plus a complete test package (script, 6 scenarios, SUS, observation sheet, severity matrix). Results pending real sessions.", links: [["Usability plan", "/usability/"], ["Prototype", "/prototypes/"]] },
  { resp: "AI-assisted schedule generation", evidence: "Natural-language assistant that shows what it understood, explains each decision and fairness stats, and requires human approval with undo. Clearly labeled as simulated (rule-based).", links: [["AI assistant", "/demo/assistant/"], ["Case study §15", "/projects/sportsync/#ai"]] },
  { resp: "Conflict detection and resolution", evidence: "Ten conflict types with plain-language causes, suggested fixes and side-by-side alternatives with trade-offs before confirming.", links: [["Conflicts", "/demo/conflicts/"], ["Resolve flow", "/architecture/#flow-resolve-conflict"]] },
  { resp: "Creating user flows and high-fidelity designs", evidence: "Nine user flows, two decision trees, sitemap, and 28 screens in low, mid and high fidelity.", links: [["Flows & IA", "/architecture/"], ["Wireframes", "/wireframes/"]] },
  { resp: "Engineering collaboration and QA", evidence: "PRD, user stories with acceptance criteria, API and database specs, QA checklist, test cases, traceability matrix, automated unit and E2E tests.", links: [["Engineering handoff", "/engineering/"], ["Documents", "/docs/"]] },
  { resp: "Building reusable design system components", evidence: "Token-driven components (buttons, forms, tabs, dialogs, alerts, scheduling components) used across the portfolio and prototype, plus a Figma handoff package.", links: [["Design system", "/design-system/"]] },
  { resp: "Defining success metrics and product improvements", evidence: "Eleven proposed metrics with definitions, targets and how each informs iteration. Dashboard uses labeled demonstration data.", links: [["Metrics", "/metrics/"]] },
];
