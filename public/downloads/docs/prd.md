# SportSync product requirements document (PRD)

| | |
|---|---|
| Author | Maria Bio |
| Status | Draft v1, prototype implemented; research pending |
| Last updated | 2026-11-25 |

## 1. Summary
SportSync helps sports organisations create, change and communicate schedules without conflicts. It combines a rule-based conflict engine, an explainable scheduling assistant, RSVP and attendance, venue management and calendar sync for six roles.

## 2. Problem
See the research page. Primary hypotheses: manual scheduling is slow and error-prone (H1), changes reach people late through informal channels (H2), multi-child families struggle with overlaps (H3), and admins need explanation and control to trust automation (H5).

## 3. Goals & non-goals
**Goals:** reduce blocking conflicts in published schedules; reduce time to create a tournament; raise RSVP response rates; keep families' own calendars up to date.
**Non-goals (v1):** registration and payments; messaging; live scoring; native app builds.

## 4. Users & roles
League administrator · Organization manager · Volunteer coach · Parent/guardian · Athlete · Facility manager. Permissions: see `lib/sportsync/permissions.ts` and the Role-based access map.

## 5. Functional requirements
| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Create, edit, duplicate, delete, cancel, postpone, restore events (game, practice, tournament, meeting); assign teams (coaches and rosters via team) and venue | Must |
| FR-2 | Weekly recurring events with end date; edit scope this / following / all | Should |
| FR-3 | Detect venue double-booking, team overlap, coach unavailability, player unavailability (warning → error over threshold), insufficient rest (configurable), facility closure, outside opening hours, maintenance windows, capacity, recurring-series conflicts | Must |
| FR-4 | Suggest ≥3 ranked conflict-free alternatives within 14 days with reasons and trade-offs; confirm with before/after and notification summary | Must |
| FR-5 | Natural-language scheduling assistant: show parsed constraints, generate tournament / practice plan / conflict fixes, explain decisions and stats | Should |
| FR-6 | Proposals can be edited row by row (re-validated), revised, approved (admins), rejected; approvals undoable; proposal and revision history | Should |
| FR-7 | RSVP yes/maybe/no/pending per person; guardians respond per child; coaches see expected attendance and send reminders; attendance tracking after events | Must |
| FR-8 | Export .ics (RFC 5545) for any filtered view; per-event Google/Outlook add links; two-way OAuth sync (future) | Must / Could |
| FR-9 | CSV import with header and row validation, preview and partial import; CSV export; read-only share links | Should |
| FR-10 | Venue directory: hours, capacity, equipment, restrictions, closures, maintenance; booking calendar | Must |
| FR-11 | Role-based permissions and team scoping, with explanatory permission states | Must |
| FR-12 | Notifications for new events, changes, cancellations, venue changes, upcoming games, RSVP reminders, conflicts, AI recommendations; per-type channel preferences; history | Should |
| FR-13 | Onboarding: role, teams, calendar, notification channels | Could |

## 6. Non-functional requirements
| ID | Requirement |
|---|---|
| NFR-1 | WCAG 2.2 AA (contrast, keyboard, focus visible, target size, labels, error identification, reduced motion) |
| NFR-2 | Conflict check < 50 ms for a 300-event season; LCP < 2.5 s on 4G mid-range phones |
| NFR-3 | Responsive 320–1920 px with no horizontal page scroll |
| NFR-4 | Offline read; queued writes with re-check on reconnect |
| NFR-5 | Least privilege; minors' data visible only to team staff and guardians; no PII in analytics |
| NFR-6 | Explainability: every automated change shows reasons; nothing auto-publishes |
| NFR-7 | Locale-aware dates/times; league time zone |

## 7. User experience
Flows: create event, generate AI schedule, resolve conflict, import, reschedule, RSVP, book venue, share, sync (see Architecture page). Screens: 28 (see Wireframes).

## 8. Success metrics
See Metrics page: conflict rate, resolution rate, time to schedule, completion rate, RSVP rate, sync adoption, AI adoption and acceptance, retention, SUS, task completion.

## 9. Dependencies & risks
| Item | Notes |
|---|---|
| OAuth credentials (Google Cloud, Microsoft Entra) | Needed for two-way sync; not configured |
| Email/SMS/push providers | Delivery simulated in prototype |
| LLM provider (optional) | Rule-based parser today; any LLM needs evaluation set + cost approval |
| Trust in automation | Mitigated by explanation, approval, undo |
| Minors' privacy | Guardian-mediated RSVP; data minimisation |

## 10. Release plan
1. MVP: FR-1, 3, 4, 7, 8 (.ics), 10, 11
2. Next: FR-2, 5, 6, 9, 12
3. Later: OAuth sync, offline queue on server, referee assignment, travel-time rules

## 11. Open questions
- Should coaches be able to publish (not just draft) schedules for their own teams?
- Default minimum rest per sport and age group?
- How should cross-league venue sharing work?
