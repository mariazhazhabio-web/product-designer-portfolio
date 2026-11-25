# QA checklist & test cases

Automated: `npm run test:unit` (scheduling engine) and `npm run test:e2e` (Playwright, Chromium desktop + mobile). Manual cases below cover what automation doesn't.

## QA checklist
### Functional
- [ ] Create / edit / duplicate / delete / cancel / postpone / restore events
- [ ] Recurring create; edit scopes this / following / all
- [ ] All 10 conflict types appear in Conflicts with correct severity
- [ ] Compare alternatives → confirm → event moved → conflict cleared → notification created
- [ ] Assistant: each example prompt generates a proposal; edit / remove / revise / approve / reject / undo
- [ ] RSVP as parent (per child) and athlete; coach sees counts; reminders create notifications
- [ ] Attendance tracking on past events
- [ ] Venues: maintenance and closure creation flags affected events
- [ ] CSV: template download, sample with bad row, file type and size errors, import
- [ ] Export CSV and .ics; .ics imports into Google Calendar / Apple Calendar / Outlook
- [ ] Share link opens read-only view; invalid link message
- [ ] Notifications: filters, mark read, previews, preferences persist
- [ ] Settings: rules change conflict results; revision restore; reset demo data
- [ ] Role switcher changes visible events and permissions
### Accessibility
- [ ] Keyboard-only run through all screens; visible focus everywhere
- [ ] Dialogs trap focus, close with Esc, return focus
- [ ] Tabs operable with arrow keys
- [ ] Screen reader: calendar events announce title, time, conflict; toasts announced
- [ ] Contrast table all AA; dark mode checked
- [ ] 200% zoom and 320 px width: no loss of content or function
- [ ] Reduced motion respected
### Cross-browser / device
- [ ] Chrome, Edge, Firefox, Safari (latest)
- [ ] iOS Safari and Android Chrome
- [ ] Light and dark mode
### Content
- [ ] All simulated features labeled; demo data labeled
- [ ] No placeholder text on portfolio pages (except fields to be completed in docs)
- [ ] Links resolve (no 404s)

## Manual test cases
| ID | Title | Steps | Expected |
|---|---|---|---|
| QA-TC-01 | Create game with validation | Quick create → Save empty → fill name, Game, 2 teams, Court A, date, 09:00–10:15 → Save | Errors name each missing field; then event appears in calendar; toast with Undo |
| QA-TC-02 | Edit one occurrence of a series | Open Hawks practice → Edit → change time → This event only | Only that date changes |
| QA-TC-03 | Live conflict in editor | Create event Court A on the Tuesday after the league finale 17:30–18:30 | Venue double-booked alert within the form; "Find conflict-free times" fills a free slot |
| QA-TC-04 | Resolve via alternatives | Conflicts → Court A double-booked → Compare → pick option → Review → Confirm | Before/after shown; conflict disappears; notification "Rescheduled" |
| QA-TC-05 | Tournament generation | Assistant → example 1 → Generate | 24 games over 6 days; no team twice per day; explanation mentions pool play |
| QA-TC-06 | Approve & undo | Approve proposal → Undo in banner | Events added then removed; revision history shows both |
| QA-TC-07 | Proposal row edit conflict | Edit a row to a slot already booked | Row turns red; Approve disabled |
| QA-TC-08 | Parent RSVP | Role Parent → RSVPs → Maya Going, Leo Can't go → Role Coach → Attendance | Coach view reflects both |
| QA-TC-09 | CSV import | Import → Load sample | 4 ready, 1 error with 4+ reasons; Import 4 → events in list view |
| QA-TC-10 | ICS | Calendar → Export view | File `sportsync-schedule.ics` imports in a calendar app with correct times |
| QA-TC-11 | Maintenance blocks | Facility manager → Venues → Field 2 → add maintenance over a practice | Conflict appears for that practice |
| QA-TC-12 | Permissions | Role Parent → open /demo/assistant/ | Permission notice with Switch role |
| QA-TC-13 | Offline | Settings → Simulate offline → create event → turn off | Offline banner; toast "saved offline"; "Back online: 1 queued change synced" |
| QA-TC-14 | Responsive | 375 px width on each portfolio page and demo screen | No horizontal page scroll; bottom nav in demo |
| QA-TC-15 | Theme | Toggle dark mode on portfolio and demo | All text legible; preference remembered |

## Automated coverage (current)
- Unit (8): conflict categories, dedupe, alternatives validity, round robin, tournament constraints, practice & resolver, ICS format, CSV parsing/validation.
- E2E: see `tests/e2e/` (home & navigation, theme, case study, create event, conflict resolution, AI approve + undo, parent RSVP, CSV import, ICS download, permissions, mobile overflow).
