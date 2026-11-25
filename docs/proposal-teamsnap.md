# Proposal: How I would approach the Product Designer, Scheduling role at TeamSnap

**Prepared by:** Maria Zha-Zha Cornillez Bio, Product Designer candidate · mariazhazhabio@gmail.com · linkedin.com/in/zha-zha-bio-56824a195

**Portfolio:** product-designer-portfolio-alpha.vercel.app · **Case study:** product-designer-portfolio-alpha.vercel.app/projects/sportsync/

> **Read this as a starting point, not an audit.** I have no access to TeamSnap's data, research or roadmap, and I haven't evaluated TeamSnap's product for this document. Every idea below is a hypothesis drawn from my independent SportSync project, to be tested against TeamSnap's real users and metrics. SportSync is not affiliated with or endorsed by TeamSnap.

## 1. Summary

Scheduling is where sports organizations feel the most pain and the most trust risk: one change (a closed gym, a coach's shift, weather) ripples through dozens of families. I propose to focus my first 90 days on three outcomes:

1. **Fewer conflicts reach families.** Catch problems while schedules are built, not after they're published.
2. **Changes land with less effort and less confusion.** Make rescheduling a guided, explainable decision with clear notification.
3. **Automation people trust.** Design AI-assisted scheduling that shows its reasoning and keeps humans in control.

## 2. What I bring

| Need | What I've shown |
|---|---|
| End-to-end scheduling design | SportSync: full lifecycle prototype for six roles (live demo, no sign-up) |
| Explainable AI scheduling | Assistant that shows "what I understood", explains format and fairness choices, and requires approval with undo |
| Conflict resolution | 10 conflict types; plain-language causes; side-by-side alternatives before confirming |
| Cross-platform consistency | One token system; documented web, iOS and Android conventions |
| Working with engineering | PRD, stories with acceptance criteria, API and data specs, QA plan, traceability, automated tests |
| Understanding non-technical users | 15+ years in public administration, research and policy management; customer service and teaching experience |

## 3. The role, as posted, and where my portfolio shows it

| What the posting asks for | Where to see it |
|---|---|
| Design the scheduling experience end to end, consistent across web, iOS and Android | SportSync prototype and platform conventions |
| Full lifecycle: creating and importing schedules, RSVP and availability, conflict detection, venue and facility constraints, recurring events, calendar sync, change notifications | Live demo: every one of these is a working screen |
| Flows for volunteer coaches, parents and league administrators, often on a phone | Role switcher, mobile-first navigation, per-child RSVP |
| Learn from customers through prototypes, interviews and usability tests | Research kit and usability plan, ready to run with the PM |
| AI-assisted scheduling, and AI in my own process | Explainable assistant; AI-assisted research planning, ideation and prototyping |
| Flows, wireframes and high-fidelity designs that cover edge cases | 9 flows, 28 screens, 30 documented edge cases |
| Ship with engineering through QA; contribute to the design system; define success metrics | Handoff docs, tests, component library, metrics dashboard |

## 4. Hypotheses to test first

These come from SportSync's research plan. Each needs validation with TeamSnap data and users before any design work is committed.

| # | Hypothesis | How we'd learn |
|---|---|---|
| H1 | Admins find conflicts late, after a schedule is shared | Support-ticket tagging; interviews with 5 league admins |
| H2 | Coaches hear about changes through informal channels before the app | Interview question: "How did you learn of the last change?" |
| H3 | Families with several children struggle most with overlapping events | Survey segmented by number of children/teams |
| H4 | RSVP response drops when responding takes more than one step | Funnel analysis of RSVP flows by entry point |
| H5 | Admins will adopt generated schedules only with explanations and undo | Concept test with the SportSync assistant as a probe |

## 5. Design opportunities (to prioritise with the team)

1. **Live conflict checking while creating or editing events.** Show the cause, who's affected and one-click free slots inside the form.
2. **"Compare alternatives" for rescheduling.** Three ranked options with reasons and trade-offs, then a before/after confirmation that says who will be notified.
3. **Postponed-games queue.** Postponed events stay visible and actionable until they get a new date.
4. **Explainable schedule generation.** Constraints shown back to the admin, fairness stats, editable rows, approval and undo; coaches can draft, admins publish.
5. **Family-first RSVP.** One-tap response per child from the notification; coaches see expected attendance and can remind non-responders.
6. **Facility rules as first-class data.** Opening hours, closures and maintenance windows that block bookings automatically.

Each opportunity would be scored with RICE using TeamSnap's real reach and effort data, not my estimates.

## 6. 30-60-90 day plan

### Days 1–30: Learn
- Meet product, engineering, support and customer success; learn the scheduling roadmap, constraints and design system, and get set up in the team's Figma and Jira workflows.
- Learn how scheduling appears across web, iOS, Android and TeamSnap ONE with the PM.
- Review analytics and support tickets for scheduling flows; map the current end-to-end journey for admins, coaches and parents across web, iOS and Android.
- Run 5–8 user interviews (admins, coaches, parents) using an interview guide adapted from SportSync.
- **Deliverable:** journey map with pain points ranked by evidence; agreed problem statement and success metrics.

### Days 31–60: Design & test
- Pick one high-impact opportunity with the team (likely conflict prevention or rescheduling).
- Flows, decision trees and edge cases first; then wireframes and a high-fidelity prototype using the existing design system.
- Moderated usability test with 5–6 participants; iterate once.
- **Deliverable:** tested prototype, iteration report with before/after, engineering-ready specs and acceptance criteria.

### Days 61–90: Ship & measure
- Pair with engineering through build; review implementation against specs and accessibility requirements; support QA.
- Define instrumentation and a launch dashboard for the agreed metrics.
- Propose the next opportunity using what we learned.
- **Deliverable:** shipped (or release-ready) improvement, metrics baseline, next-quarter design proposal.

## 7. How success would be measured

| Metric | Why it matters |
|---|---|
| Scheduling conflict rate (published events with a blocking conflict) | Shows whether prevention works |
| Conflict resolution rate within 48h | Shows whether fixes are actionable |
| Median time to build or change a schedule | Core effort saving for admins and coaches |
| RSVP response rate 24h before events | Coaches need reliable attendance |
| AI recommendation acceptance rate (if AI is in scope) | Proxy for trust and output quality |
| Task completion and SUS in usability tests | Direct evidence for iteration |

Targets would be set from TeamSnap's current baselines.

## 8. Working style

- Evidence over opinion: hypotheses are labeled as hypotheses until tested.
- States before screens: errors, empty, offline and permission states are designed, not discovered.
- Accessible by default: WCAG 2.2 AA as a baseline.
- Close to engineering: shared acceptance criteria early, and readable prototypes.
- Remote-friendly: based in the Philippines (UTC+8), comfortable working across time zones, with overlap with US hours by agreed schedule.

## 9. Next step

I'd welcome a conversation to walk through the SportSync prototype and hear which scheduling problems matter most to the team right now.

Maria Zha-Zha Cornillez Bio
