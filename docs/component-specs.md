# Component specifications

Source of truth: `components/ui/*` and `components/demo/*`. Tokens: `app/globals.css` (mirrored in `design-handoff/tokens.json`). All components are keyboard operable and have visible focus (2px `--ring`, 2px offset).

## Button
| Prop | Values |
|---|---|
| variant | primary · secondary · outline · ghost · danger · accent · link |
| size | sm (32px) · md (40px) · lg (48px) · icon (40×40) · icon-sm (32×32) |
| states | default · hover · focus-visible · active · disabled (50% opacity, no pointer) · loading (spinner + verb-ing label, disabled) |
Rules: one primary per view region; destructive actions use `danger` and always confirm; icon-only buttons require `aria-label`.

## Badge
Tones: neutral · primary · accent · info · success · warning · danger · outline. 12px text, pill. Never the only status signal: pair with an icon or text.

## Alert
Tones info/success/warning/danger; optional title, body, action. `role="alert"` for danger, `role="status"` otherwise. Icon + color + text.

## Form field (Field + Input / Select / Textarea)
Label always visible above control; required marked with `*` (aria-hidden) and validated on submit; hint below in muted text; error replaces hint, `role="alert"`, control gets `aria-invalid`. Height 40px. Error copy says how to fix ("Choose a venue.").

## Switch / Checkbox
Switch: `role="switch"`, `aria-checked`, 44×24 track. Checkbox: native input with accent color, label clickable.

## Tabs
WAI-ARIA tabs: `role=tablist/tab`, `aria-selected`, roving tabindex, ←/→/Home/End. Optional count pill. Sizes sm/md.

## Dialog / ConfirmDialog
Native `<dialog>` with `showModal()`: focus trapped, Esc closes (`onCancel`), backdrop click closes, title linked via `aria-labelledby`. Sizes sm 448 / md 576 / lg 768 / xl 1024. Footer right-aligned, primary last. ConfirmDialog states the consequence and names the action ("Delete permanently").

## Tooltip
Shows on hover and focus, hides on Esc and blur; `role="tooltip"` linked by `aria-describedby`. Never contains essential info.

## EmptyState
Icon, title, explanation of why it's empty, one next action.

## Skeleton
Matches final layout dimensions; `aria-hidden`; container has `aria-busy="true"`. Shimmer disabled with reduced motion.

## Stat
Label (uppercase 12px), value (display 24px, tabular), optional sub text; tones danger/warning/success for value color.

## Scheduling components
| Component | Spec |
|---|---|
| EventPill (calendar chip) | 4px left border in event-type color; time (tabular) + title; conflict → red ring + alert icon; cancelled → strikethrough 60% opacity; postponed → dashed border. Accessible name includes title, date, time, conflict and status. |
| Time grid block | Absolute position by start/duration (52px/hour, 07:00–22:00); overlapping events split into lanes; empty hour cells are buttons "Create event … at 17:00". Venue columns hatch closed hours. |
| EventRow | Date block (weekday + day), title, time · venue, type + status badges; whole row opens detail. |
| ConflictCard | Header tinted by severity, kind badge, plain-language message, suggested fix; affected events with "Move this" radios; actions Acknowledge (warnings) / Edit / Compare alternatives. |
| CompareAlternatives | Radiogroup of ≤3 option cards: badge (Best match / Option n), fit score, date, time, venue, ✓ reasons, → trade-offs; then Confirm step with before (struck) → after and notification summary. |
| RsvpControl | Group of 3 toggle buttons (Going / Maybe / Can't go), `aria-pressed`, success/warning/danger fills; compact size 28px. |
| AttendanceBar | Stacked bar yes/maybe/no on track; text summary below; `role="img"` with full counts. |
| AddToCalendar | Menu: Google, Outlook (external links), .ics download; note that no sign-in is shared. |
| Proposal table | Time, venue, match, stage, actions (Edit inline, Remove); conflict rows tinted danger with reason. |

## Navigation
Desktop sidebar 240px with icon + label + count pills; top bar with role switcher, quick create, notifications (unread badge). Mobile: bottom bar (Home, Calendar, Create, Conflicts, More) with safe-area padding; More opens a bottom sheet with all destinations.

## Notification item
Unread dot (accent), bold title when unread, two-line body clamp, relative time + type badge. Previews: push (lock-screen card), SMS (bubble + opt-out), email (branded header + CTA + unsubscribe).
