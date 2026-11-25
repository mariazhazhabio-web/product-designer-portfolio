# Traceability matrix

User need → requirement → design → implementation → QA. Test IDs refer to `tests/unit/engine.test.ts` (unit), `tests/e2e/*.spec.ts` (E2E) and QA-TC-* in the QA test plan.

| User need (hypothesis) | Requirement | Design screen(s) | Implementation | QA tests |
|---|---|---|---|---|
| Admins need conflict-free schedules (H1, H6) | FR-3, FR-4 | Event editor, Conflicts, Compare alternatives | `lib/sportsync/conflicts.ts`, `components/demo/event-detail.tsx` | unit: *seed plants every conflict category*, *alternatives are conflict-free*; E2E: *resolve a conflict*; QA-TC-03, 04 |
| Admins need fast, fair tournaments (H1, H5) | FR-5, FR-6 | AI assistant | `lib/sportsync/assistant.ts`, `app/demo/assistant/page.tsx` | unit: *example prompt…once per day*, *round robin*; E2E: *generate and approve*; QA-TC-05, 06 |
| Admins must stay in control (H5) | FR-6, NFR-6 | Proposal review, Settings → revision history | `lib/sportsync/store.tsx` (commit/undo/restore) | E2E: *undo after approve*; QA-TC-06 |
| Coaches need expected attendance (H2) | FR-7 | Attendance, Event detail | `app/demo/attendance/page.tsx` | E2E: *parent RSVP*; QA-TC-08 |
| Multi-child families (H3) | FR-7 | Dashboard family card, My RSVPs | `RsvpControl` per child | QA-TC-08 |
| Families live in their calendar (H3, H7) | FR-8 | Calendar sync, Add to calendar | `lib/sportsync/ics.ts` | unit: *ICS output is RFC 5545 shaped*; E2E: *ics download*; QA-TC-10 |
| Admins import spreadsheets | FR-9 | Import, export & share | `lib/sportsync/csv.ts` | unit: *CSV round trip*; E2E: *import sample*; QA-TC-09 |
| Facility rules respected (H6) | FR-10 | Venues | `facilityIssues()` | unit (closure, maintenance, hours detected); QA-TC-11 |
| Recurring practices change often | FR-2 | Editor scope dialog | `components/demo/event-form.tsx` | QA-TC-02 |
| Right people see/change the right things | FR-11, NFR-5 | Role switcher, Permission notices | `lib/sportsync/permissions.ts` | E2E: *parent cannot create events*; QA-TC-12 |
| Everyone can use it | NFR-1, NFR-3 | All | tokens, focus styles, ARIA patterns | E2E: *mobile layout has no horizontal scroll*; QA §Accessibility |
| Poor connectivity | NFR-4 | Offline banner | store `online`/`queued` | QA-TC-13 |
