// SportSync UX research framework.
// IMPORTANT: personas, pain points and journeys are PROVISIONAL HYPOTHESES built from desk research
// and domain reasoning. No interviews, surveys or usability tests have been conducted yet.

export const problemStatement =
  "Volunteer coaches, busy parents and league administrators spend too much time building, changing and communicating sports schedules across spreadsheets, group chats and calendar apps. Changes (weather, venue issues, double-bookings) cascade into confusion, missed games and last-minute scrambling. We believe a scheduling experience that detects conflicts before they happen, proposes fair schedules automatically, and pushes changes to everyone's existing calendar will reduce scheduling effort and missed events.";

export const objectives = [
  "Understand how league administrators currently build season and tournament schedules, and where the most time is lost.",
  "Identify which scheduling changes cause the most downstream confusion for coaches and families.",
  "Learn how families receive, trust and act on schedule information (calendar apps, chat, email, SMS).",
  "Evaluate whether people trust automatically generated schedules, and what explanation they need to approve them.",
  "Understand facility managers' constraints (hours, maintenance, booking rules) and how they communicate them.",
];

export const researchQuestions = [
  { theme: "Schedule creation", qs: ["How do admins build a season schedule today, step by step?", "Which constraints are hardest to satisfy (venues, coach availability, fairness)?", "How long does a typical tournament schedule take to create and verify?"] },
  { theme: "Change management", qs: ["What happens, step by step, when a game must be moved?", "Who needs to know, and how do they find out?", "Which changes cause the most errors or no-shows?"] },
  { theme: "Families & athletes", qs: ["Where do parents look first for 'where do we need to be?'", "How do multi-child families handle overlapping schedules?", "What makes a parent ignore or miss an RSVP request?"] },
  { theme: "Trust in automation", qs: ["Would an admin publish a computer-generated schedule? What would they check first?", "Which explanations increase confidence: rules followed, alternatives considered, fairness stats?", "What level of control (edit, regenerate, undo) is the minimum acceptable?"] },
  { theme: "Facilities", qs: ["How are opening hours, closures and maintenance communicated to leagues today?", "What booking mistakes are most costly for facility staff?"] },
];

export const hypotheses = [
  { id: "H1", who: "League admins", text: "Building a multi-weekend tournament schedule by hand takes several hours and still contains conflicts that are discovered late.", measure: "Time-on-task and error count in a baseline task", status: "Assumption, to validate" },
  { id: "H2", who: "Volunteer coaches", text: "Coaches learn about venue or time changes from informal channels (group chats) before the official system, which erodes trust in the schedule.", measure: "Interview: source of last change learned", status: "Assumption, to validate" },
  { id: "H3", who: "Parents", text: "Parents with children on several teams struggle most with overlapping events and want a single combined family view.", measure: "Survey: # children, # missed/late events", status: "Assumption, to validate" },
  { id: "H4", who: "Parents", text: "RSVP response rates drop when the request requires opening a separate app or logging in.", measure: "Survey + analytics: response channel", status: "Assumption, to validate" },
  { id: "H5", who: "Admins", text: "Admins will accept AI-generated schedules only when the reasoning is explained and every change can be reviewed and undone.", measure: "Usability test: approval rate, confidence rating", status: "Assumption, to validate" },
  { id: "H6", who: "Facility managers", text: "Most venue double-bookings happen because maintenance windows and closures aren't visible to the people scheduling.", measure: "Interview: last 3 booking incidents", status: "Assumption, to validate" },
  { id: "H7", who: "Athletes", text: "Teen athletes want schedule information pushed to their own phone calendar rather than checking an app.", measure: "Survey: preferred channel by age", status: "Assumption, to validate" },
];

export const competitorFramework = {
  note: "A framework for a competitive review to be completed. Cells are criteria to evaluate, not findings. No competitor was evaluated for this portfolio.",
  categories: ["Team & league management apps", "General scheduling tools (spreadsheets, shared calendars)", "Facility booking systems", "Group messaging used as a scheduling channel"],
  criteria: [
    "Schedule creation speed (season, tournament, single event)",
    "Constraint handling: venues, coach/player availability, rest periods",
    "Conflict detection: proactive vs. reactive",
    "Change communication: channels, targeting, confirmation",
    "Calendar sync: one-way export vs. two-way",
    "RSVP & attendance flow friction (taps to respond)",
    "Multi-child / multi-team family view",
    "Accessibility (WCAG conformance statements)",
    "Mobile parity across web, iOS and Android",
    "Pricing model for volunteer-run organizations",
  ],
};

export interface Persona {
  id: string;
  name: string;
  role: string;
  age: string;
  context: string;
  goals: string[];
  pains: string[];
  behaviors: string[];
  quote: string;
  tech: string;
  success: string;
  empathy: { says: string[]; thinks: string[]; does: string[]; feels: string[] };
  jtbd: string;
}

export const personas: Persona[] = [
  {
    id: "coach", name: "Jordan", role: "Volunteer coach", age: "30s", context: "Coaches two youth teams (basketball and soccer) around a full-time job with shift work.",
    goals: ["Know exactly where each team needs to be", "Have enough players for every game", "Spend coaching time coaching, not messaging"],
    pains: ["Assumed: learns about changes late, via group chat", "Assumed: chasing RSVPs one parent at a time", "Assumed: two teams' schedules clash with no warning"],
    behaviors: ["Checks schedule on phone between shifts", "Relies on a group chat for reminders", "Copies events into a personal calendar manually"],
    quote: "Hypothetical: “I just need to know who's coming before I drive to the gym.”", tech: "Smartphone-first, moderate", success: "Expected attendance visible 24h before every event",
    empathy: { says: ["Who's actually coming Saturday?", "Can someone confirm the court?"], thinks: ["Am I double-booked again?", "I don't want to nag parents"], does: ["Scrolls chat history for updates", "Texts parents individually"], feels: ["Stretched thin", "Responsible for kids' experience"] },
    jtbd: "When the schedule changes, I want my team and their families to know automatically, so I can focus on coaching instead of messaging.",
  },
  {
    id: "parent", name: "Sam", role: "Busy parent", age: "40s", context: "Two children on different teams and sports; shares driving with another family.",
    goals: ["One view of every child's events", "Respond to RSVPs in one tap", "Get only the notifications that matter"],
    pains: ["Assumed: overlapping events across kids found too late", "Assumed: notification overload from multiple apps", "Assumed: RSVP links that require logging in"],
    behaviors: ["Lives in the phone calendar", "Reads notifications on the lock screen", "Coordinates carpools by text"],
    quote: "Hypothetical: “Just put it in my calendar and tell me if it changes.”", tech: "Smartphone, calendar-centric", success: "Zero missed or late events in a month",
    empathy: { says: ["Is it still on with this rain?", "Which field is it at?"], thinks: ["Did I already RSVP?", "Who's driving?"], does: ["Screenshots schedules", "Sets own reminders"], feels: ["Overloaded", "Guilty when a child misses an event"] },
    jtbd: "When I plan my family's week, I want every child's events in my own calendar with changes pushed instantly, so I never miss or double-book.",
  },
  {
    id: "admin", name: "Alex", role: "League administrator", age: "40s–50s", context: "Runs scheduling for a 12-team youth league with shared facilities; part-paid, part-volunteer role.",
    goals: ["Produce a fair, conflict-free season in hours, not days", "Handle postponements without chaos", "Prove fairness to coaches"],
    pains: ["Assumed: spreadsheet scheduling with manual conflict checks", "Assumed: late discovery of venue closures", "Assumed: complaints about unfair early/late slots"],
    behaviors: ["Builds schedules on a laptop", "Keeps a master spreadsheet", "Emails PDFs to coaches"],
    quote: "Hypothetical: “I'd use automation if I can see why it made each choice.”", tech: "Desktop power user", success: "Season published with zero blocking conflicts",
    empathy: { says: ["Who changed the spreadsheet?", "Is Court B free at 10?"], thinks: ["One change breaks five other games", "Coaches will say it's unfair"], does: ["Cross-checks venue emails", "Rebuilds schedules after closures"], feels: ["Accountable", "Anxious before publishing"] },
    jtbd: "When I build a season or tournament, I want the system to respect every constraint and explain its choices, so I can publish confidently and defend the schedule.",
  },
  {
    id: "athlete", name: "Ava", role: "Athlete", age: "12–17", context: "Plays on a club team; balances school, homework and practice; uses a phone with parental controls.",
    goals: ["Know practice and game times without asking parents", "See team updates in one place", "Plan homework around games"],
    pains: ["Assumed: relies on parents relaying information", "Assumed: notifications buried in parent accounts"],
    behaviors: ["Uses messaging and social apps heavily", "Rarely opens email", "Checks phone calendar widget"],
    quote: "Hypothetical: “I just want it on my phone.”", tech: "Mobile-native", success: "Can answer “when's my next game?” in under 5 seconds",
    empathy: { says: ["What time is practice?", "Which jersey?"], thinks: ["Will I have time for homework?"], does: ["Asks teammates", "Checks parent's phone"], feels: ["Dependent on others for info"] },
    jtbd: "When I plan my week, I want my own simple schedule view and reminders, so I don't depend on my parents to tell me where to be.",
  },
  {
    id: "facility", name: "Dana", role: "Facility manager", age: "30s–50s", context: "Manages courts and fields shared by schools, clubs and community programs.",
    goals: ["No double-bookings", "Maintenance done without displacing events", "Clear booking rules everyone follows"],
    pains: ["Assumed: leagues book over maintenance windows", "Assumed: closure notices sent by email get missed", "Assumed: phone calls to resolve every clash"],
    behaviors: ["Maintains a booking calendar", "Emails closure notices", "Negotiates time swaps by phone"],
    quote: "Hypothetical: “If they could see the maintenance window, they wouldn't book it.”", tech: "Desktop, calendar tools", success: "Zero bookings during closures or maintenance",
    empathy: { says: ["That court is closed Sunday", "We need 48 hours' notice"], thinks: ["Who booked this without asking?"], does: ["Blocks time manually", "Calls league admins"], feels: ["Unheard", "Responsible for safety"] },
    jtbd: "When I schedule maintenance or closures, I want leagues to see and respect them automatically, so bookings never collide with facility work.",
  },
];

export const journey = {
  persona: "Alex, league administrator: rescheduling a postponed game (current state, hypothesized)",
  stages: [
    { stage: "Trigger", actions: "Venue reports a power outage on game morning", thoughts: "Which games are affected?", emotion: 2, opportunity: "Facility managers mark closures that instantly flag affected events" },
    { stage: "Assess", actions: "Opens spreadsheet, finds affected games, checks coach list", thoughts: "Who do I need to tell first?", emotion: 1, opportunity: "Auto-generated impact list: teams, families, officials" },
    { stage: "Find a new slot", actions: "Emails venues and coaches for availability", thoughts: "This will take days of back-and-forth", emotion: 1, opportunity: "Ranked conflict-free alternatives in one click" },
    { stage: "Communicate", actions: "Posts in group chats and emails PDFs", thoughts: "Did everyone see it?", emotion: 2, opportunity: "One confirmation triggers targeted notifications on preferred channels" },
    { stage: "Confirm", actions: "Chases RSVPs from coaches", thoughts: "Will both teams have enough players?", emotion: 2, opportunity: "Live expected attendance and automatic reminders" },
    { stage: "Wrap-up", actions: "Updates the master spreadsheet", thoughts: "I hope nothing else broke", emotion: 3, opportunity: "Revision history and undo; calendars update everywhere" },
  ],
};

export const opportunities = [
  { area: "Prevent conflicts", ideas: ["Real-time conflict checks while creating events", "Venue hours, closures and maintenance as first-class rules", "Rest-period and availability rules"] },
  { area: "Generate schedules", ideas: ["Natural-language schedule requests", "Explainable, fair tournament generator", "Review, edit, approve, undo"] },
  { area: "Handle change", ideas: ["Compare alternatives side by side", "Postponed-games queue", "Edit this / following / all for recurring events"] },
  { area: "Reach families", ideas: ["One-tap RSVP for each child", "Push changes to Google, Apple and Outlook calendars", "Channel preferences per notification type"] },
  { area: "Run facilities", ideas: ["Booking calendar per venue", "Maintenance windows block scheduling", "Capacity checks"] },
];

export const rice = [
  { feature: "Real-time conflict detection", reach: 9, impact: 3, confidence: 0.8, effort: 3 },
  { feature: "Compare alternative slots", reach: 7, impact: 2, confidence: 0.8, effort: 2 },
  { feature: "One-tap RSVP + reminders", reach: 10, impact: 2, confidence: 0.8, effort: 2 },
  { feature: "Calendar export (.ics) + add-to-calendar links", reach: 10, impact: 2, confidence: 1, effort: 1 },
  { feature: "AI tournament generator (explainable)", reach: 4, impact: 3, confidence: 0.5, effort: 5 },
  { feature: "Two-way calendar sync (OAuth)", reach: 8, impact: 2, confidence: 0.5, effort: 5 },
  { feature: "CSV import with validation", reach: 5, impact: 2, confidence: 0.8, effort: 2 },
  { feature: "Venue maintenance & closures", reach: 4, impact: 2, confidence: 0.8, effort: 2 },
  { feature: "Offline mode with queued changes", reach: 6, impact: 1, confidence: 0.5, effort: 4 },
].map((r) => ({ ...r, score: Math.round(((r.reach * r.impact * r.confidence) / r.effort) * 10) / 10 })).sort((a, b) => b.score - a.score);

export const moscow = {
  must: ["Create / edit / cancel / reschedule events", "Conflict detection with actionable fixes", "RSVP & expected attendance", "Calendar export (.ics)", "Role-based permissions", "Accessible web + responsive mobile"],
  should: ["AI-assisted schedule generation with explanations", "Recurring events with this/following/all edits", "CSV import/export", "Notification preferences", "Venue booking calendar"],
  could: ["Two-way calendar sync", "Offline queueing", "Share links for non-members", "Fairness analytics"],
  wont: ["Payments and registration (out of scope for scheduling)", "Live game scoring", "Chat/messaging (covered by other tools)"],
};

export const interviewGuide = [
  { section: "Intro (5 min)", items: ["Thank you + consent to record", "Explain: we're testing ideas, not you; no wrong answers", "Role, sport, how many teams/children/venues"] },
  { section: "Current process (15 min)", items: ["Walk me through the last time you created or changed a schedule.", "What tools did you use? Show me if you can.", "What was the hardest part? Why?", "How long did it take, roughly?"] },
  { section: "Changes & communication (10 min)", items: ["Tell me about the last time a game or practice moved.", "How did you find out / tell others?", "Did anyone miss it? What happened?"] },
  { section: "Calendars & RSVPs (10 min)", items: ["Where do you look first to know where to be?", "How do you respond when asked if you're coming?", "Which notifications do you ignore? Why?"] },
  { section: "Automation & trust (10 min)", items: ["If software proposed a full schedule, what would you check before publishing?", "What would make you trust or distrust it?", "Concept probe: show the SportSync proposal screen; think aloud."] },
  { section: "Wrap-up (5 min)", items: ["If you could fix one thing about sports scheduling, what would it be?", "Anything we didn't ask that we should have?", "Permission to follow up for usability testing"] },
];

export const survey = [
  { q: "What is your main role in youth/community sports?", type: "Single choice", options: "League admin · Club/org manager · Coach · Parent/guardian · Athlete · Facility staff · Other" },
  { q: "How many teams or children do you manage schedules for?", type: "Single choice", options: "1 · 2 · 3–4 · 5+" },
  { q: "Where do you check schedules most often?", type: "Multiple choice", options: "Team app · Phone calendar · Email · Group chat · Website · Printed/PDF · Other" },
  { q: "In the last month, how many times did you miss or arrive at the wrong time/place for an event?", type: "Numeric", options: "0–10+" },
  { q: "How do you usually learn about schedule changes?", type: "Multiple choice", options: "Push notification · SMS · Email · Group chat · Word of mouth · Other" },
  { q: "How easy is it to RSVP for events today?", type: "Likert 1–5", options: "Very difficult → Very easy" },
  { q: "(Admins) How long does it take to build a tournament schedule?", type: "Single choice", options: "<1h · 1–3h · 3–8h · >1 day" },
  { q: "(Admins) How comfortable would you be publishing a computer-generated schedule after review?", type: "Likert 1–5", options: "Not at all → Completely" },
  { q: "Which would most improve your experience?", type: "Rank top 3", options: "Fewer conflicts · Faster changes · Calendar sync · Easier RSVP · Fewer notifications · Better venue info" },
  { q: "Anything else you want to tell us about scheduling?", type: "Open text", options: "" },
];
