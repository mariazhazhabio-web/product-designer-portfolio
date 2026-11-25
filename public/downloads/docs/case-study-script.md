# Case study presentation script (≈20 minutes)

For a portfolio review panel. Screen: the SportSync case study page, with the live demo open in a second tab. Timings in brackets.

## 1. Opening [1 min]
"Thanks for having me. I'll walk through SportSync, an independent project I designed and built to explore scheduling for youth and community sports. Up front: it isn't affiliated with any company, the research is planned rather than completed, and the AI is a rule-based simulation. I'll point out where that matters."

## 2. The challenge [2 min]
- Read the problem statement. Emphasise the ripple effect: one change, many people.
- "My how-might-we: prevent conflicts before publishing, make automation trustworthy, and reach families in the channels they already use."

## 3. Research plan & hypotheses [3 min]
- Objectives and the five themes of questions.
- Two hypotheses I'd test first: H1 (manual tournament scheduling takes hours and still has late conflicts) and H5 (admins approve AI schedules only with explanation and undo).
- "Personas are provisional. They're scaffolding until interviews replace them."

## 4. Structure [3 min]
- Sitemap: schedule as the spine; things that feed it vs carry it outward.
- Show the conflict-resolution flow: the decision "blocking or warning" and "which event moves".

## 5. Design walkthrough [6 min] (switch to the demo)
1. Dashboard: "First question for an admin: what needs my attention?" Point to conflicts and pending RSVPs.
2. Create an event at Court A, Tuesday 17:30 → the conflict appears live → "Find conflict-free times".
3. Conflicts page → Compare alternatives → reasons and trade-offs → confirm with before/after.
4. AI assistant → run the 8-team example → "What I understood" → the format switch to pool play, and why → approve → undo.
5. Switch role to Parent → RSVP for two children.
6. Calendar sync → download a real .ics.

## 6. Design system & platforms [2 min]
- Semantic tokens, contrast table, components with states.
- Platform table: same structure, native navigation and controls.

## 7. Validation & handoff [2 min]
- Six usability scenarios with targets; SUS; severity matrix. Results pending.
- Traceability: need → requirement → screen → code → test.

## 8. Reflection [1 min]
- "The biggest lesson: if I couldn't explain an automated choice, the rule was wrong."
- "Next: five interviews and two usability rounds, then replace personas and publish real before/after iterations."

## Likely follow-ups (have these ready)
- Why a rule-based engine instead of an LLM? (Explainability, repeatability, no paid API; LLM could replace the parser.)
- How would you prioritise if you had one sprint? (RICE: conflict detection + .ics + RSVP.)
- What would you measure first? (Conflict rate and resolution rate.)
