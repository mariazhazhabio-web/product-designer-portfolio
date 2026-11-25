# User stories & acceptance criteria

Format: As a … I want … so that … · Acceptance criteria in Given / When / Then. IDs map to the traceability matrix.

## Epic A: Event management
**US-01** As a league admin, I want to create a game with teams, venue and time, so that it appears on everyone's schedule.
- Given I'm an admin, when I click Quick create or an empty calendar slot, then the form opens (pre-filled with that slot's time and venue).
- Given required fields are missing, when I save, then each missing field shows a specific inline error and focus stays in the form.
- When I save with "Notify" on, then a new-event notification is created using each recipient's channel preferences.

**US-02** As a coach, I want to set up weekly practices once, so that I don't re-enter them every week.
- Given I tick Repeat weekly and pick Tue/Thu until a date, then one event per matching date is created in one series.
- Given I edit an occurrence, then I must choose This event / This and following / All events.
- Choosing "This event only" never changes other dates.

**US-03** As an admin, I want to postpone a game with a reason, so that families aren't confused and it doesn't get lost.
- Postponed events keep RSVPs, show a "Postponed" badge with the reason, and appear in Conflicts → Needs a new date.
- "Find a new date" offers conflict-free options from today onwards.

**US-04** As an admin, I want to cancel or delete events safely.
- Cancel shows a confirmation describing who will be notified; cancelled events remain visible struck through and can be restored.
- Delete is admin-only, requires confirmation and can be undone from the toast.

## Epic B: Conflicts
**US-05** As an admin, I want conflicts flagged while I edit, so that I don't publish mistakes.
- Given a venue already booked 17:00–18:30, when I choose 17:30 at that venue, then a blocking conflict naming both events appears within 300 ms.
- The panel offers "Find conflict-free times"; choosing a suggestion fills the form.

**US-06** As a facility manager, I want maintenance windows to block bookings.
- Given maintenance 16:00–19:00 on Field 1, any event overlapping it shows a "Scheduled maintenance" blocking conflict.

**US-07** As an admin, I want to compare alternatives before changing an event.
- Up to 3 options, each with date, time, venue, reasons and trade-offs; none has blocking conflicts.
- Confirm shows before → after and who will be notified; applying is undoable.

**US-08** As an admin, I want repeated clashes between two weekly series shown once.
- Two series overlapping on ≥2 dates appear as one "Conflicting recurring events" item listing the dates.

## Epic C: AI-assisted scheduling
**US-09** As an admin, I want to describe a tournament in plain language, so that I get a draft in minutes.
- The proposal lists "What I understood" (sport, teams, weekends, window, constraints) before results.
- With "once per day", no team appears twice on the same date.
- "Why this schedule" explains format choice, fairness and skipped slots.

**US-10** As an admin, I want to edit and approve the proposal, so that I stay accountable.
- Editing a row re-validates it; rows with blocking conflicts are highlighted and disable Approve.
- Approve publishes all events as one revision; Undo restores the previous state.
- Coaches can generate drafts but Approve is disabled with an explanation.

## Epic D: RSVP & attendance
**US-11** As a parent of two children, I want to RSVP per child.
- One RSVP control per child on events involving their teams; changes update the coach's counts immediately.

**US-12** As a coach, I want expected attendance before an event.
- Counts for yes/maybe/no/pending, roster with availability notes, low-attendance warning, "Remind N pending" action.

## Epic E: Calendar, import & share
**US-13** As a parent, I want events in my own calendar.
- "Add to calendar" offers Google, Outlook and .ics; the .ics validates against RFC 5545 (CRLF, folded lines ≤75 octets, UID, DTSTAMP).

**US-14** As an admin, I want to import a CSV.
- Missing required columns → one clear error naming them. Invalid rows are listed with reasons and skipped; valid rows import; rows that will conflict are warned.

**US-15** As a coach, I want a read-only link for my team's schedule.
- The link opens a schedule view without sign-in, with "Add all to calendar".

## Epic F: Access & resilience
**US-16** As any user, I want to understand why I can't do something.
- Restricted screens show the permission, my role and a path forward instead of a blank page.

**US-17** As a user with poor connectivity, I want to keep working.
- Offline banner appears; changes are saved locally and a sync confirmation appears on reconnect.
