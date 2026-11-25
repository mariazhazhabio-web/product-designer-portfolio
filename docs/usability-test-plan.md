# Usability test plan & moderator script

**Status:** Ready to run. **Results:** pending (none collected yet). Prototype: `/demo/` (reset demo data before each session: Settings → Reset demo data).

## 1. Objectives
1. Can first-time admins create a game without conflicts in under 2 minutes?
2. Do users understand conflict messages well enough to choose a fix?
3. Can parents RSVP for a child in under 30 seconds?
4. Do admins trust and approve an AI-generated tournament after review?
5. Can coaches reschedule a single practice without changing the series?
6. Can coaches book a venue while respecting facility rules?

## 2. Participants
- Round 1: 5–6 · Round 2: 5–6 (after fixes)
- 2 admins, 2 coaches, 2 parents (≥1 with multiple children), 1 facility staff
- Include ≥1 keyboard-only or screen-reader user and ≥1 non-native English speaker
- Exclude anyone involved in designing SportSync
- Remote (video + screen share) or in person, 60 minutes

## 3. Moderator script

### Welcome (5 min)
"Thanks for helping. We're testing a design, not you. If something is confusing, that's our problem to fix. Please think aloud: say what you're looking at, trying and expecting. I may not answer questions during tasks, but I'll note them. May I record the screen and audio?"

Practice think-aloud: "Find tomorrow's weather on this phone and talk me through it."

### Background (5 min)
- Your role in sports? Tools you use for schedules? Last time a schedule changed?

### Tasks (35 min)
Randomise T1–T6 order between participants. Set the role as noted. After each task ask the **SEQ**: "Overall, how easy or difficult was that task?" (1 very difficult – 7 very easy).

| ID | Role | Scenario (read aloud) | Success criteria | Target |
|---|---|---|---|---|
| T1 | League admin | "Your team plays the Comets next Saturday at 9 am at Riverbend Court A. Add the game." | Saved with correct teams, venue, time; notices conflict warning if any | < 2 min, unassisted |
| T2 | League admin | "You've heard Court A is double-booked on Tuesday. Fix it." | Opens conflict, compares alternatives, confirms; can say who gets notified | < 3 min |
| T3 | Parent | "You're Sam. Tell the coach Maya can make Saturday's game but Leo can't." | Correct RSVP per child | < 30 s |
| T4 | League admin | "Create a schedule for 8 basketball teams over three weekends, one game per team per day. Publish it if you're happy." | Generates, reviews, publishes or explains why not; finds undo | < 5 min; confidence ≥ 4/5 |
| T5 | Coach | "Thursday's Hawks practice must move because you're away. Move it to another day this week." | Only that date changes (scope "This event only") | < 2 min |
| T6 | Coach | "Book Lakeside Field 1 for a 1-hour scrimmage next Monday afternoon." | Avoids maintenance window; saved | < 2 min |

Probing (only after the task): "What did you expect to happen there?" "What does this message mean to you?"

### Wrap-up (15 min)
- SUS questionnaire (10 items, see below)
- "What was the easiest / most confusing thing?" "Would you trust it to publish a schedule? Why?" "What's missing for your role?"
- Thank and explain incentive (if any).

## 4. Metrics
Task completion (unassisted / assisted / fail) · time on task · errors · SEQ · SUS · confidence in AI proposal (1–5).

## 5. SUS questionnaire
1 = strongly disagree … 5 = strongly agree.
1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person to be able to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

**Scoring:** for odd items subtract 1; for even items subtract from 5; sum × 2.5 → 0–100. 68 ≈ average.

## 6. Observation sheet (copy per participant)
| Task | Completed (Y / Assisted / N) | Time | Errors / wrong paths | Verbatim quotes | SEQ | Severity |
|---|---|---|---|---|---|---|
| T1 | | | | | | |
| T2 | | | | | | |
| T3 | | | | | | |
| T4 | | | | | | |
| T5 | | | | | | |
| T6 | | | | | | |

## 7. Issue severity matrix
| Severity | Definition | Action |
|---|---|---|
| 4 Critical | Prevents completion, data loss, or wrong schedule published | Fix before next round |
| 3 Major | Significant delay or errors; needs help | Fix this iteration |
| 2 Minor | Hesitation or minor error; recovers alone | Backlog by frequency |
| 1 Cosmetic | Noticed, no impact | Fix when convenient |

Priority = severity × (participants affected ÷ total).

## 8. Results
| Metric | Round 1 | Round 2 |
|---|---|---|
| Mean task completion | Pending | Pending |
| Mean SEQ | Pending | Pending |
| Mean SUS | Pending | Pending |
| AI approval confidence | Pending | Pending |
