# Figma handoff package & import instructions

**Status:** No Figma file has been created. This package contains everything needed to build the SportSync library in Figma with Variables, components and auto layout.

## Contents (in `design-handoff/`)
| File | What it is |
|---|---|
| `tokens.json` | All color (light + dark), typography, spacing, radius, shadow and breakpoint tokens in W3C Design Tokens format (also at `/downloads/tokens.json`) |
| `icons/*.svg` | The 18 Lucide icons used in the product (ISC license), 24×24, 2px stroke, `currentColor` |
| `component-specs.md` → see [Component specifications](/docs/component-specs/) | Variants, sizes, states and accessibility rules for every component |
| Screen layouts | `/wireframes/` (lo/mid/hi-fi) and `public/screens/*.png` (hi-fi screenshots, 1440×900 desktop, 390×844 mobile) |

## Step-by-step import
1. **Create file:** in Figma create a design file "SportSync Design System" with pages: Foundations, Components, Patterns, Screens.
2. **Fonts:** install Inter and Space Grotesk (both free on Google Fonts).
3. **Variables:** install the free *Tokens Studio for Figma* plugin (or *Variables Import*), load `tokens.json`, and create two collections:
   - `Color` with modes **Light** and **Dark** (from `color-light` / `color-dark`)
   - `Spacing`, `Radius` (number variables)
   Then create **Text styles** from `typography` and **Effect styles** from `shadow`.
4. **Icons:** drag `design-handoff/icons/*.svg` into Foundations; select all → *Create multiple components*; set stroke color to a color variable.
5. **Layout grids:** create grid styles: Mobile 4 col / 16 gutter / 16 margin; Tablet 8 / 24 / 24; Desktop 12 / 24 / 24 (max 1200).
6. **Components (auto layout):** for each component in the specs, build a component set with properties:
   - Button: `variant` (primary…link) × `size` (sm, md, lg, icon) × `state` (default, hover, focus, disabled, loading); horizontal auto layout, padding 16/12, gap 8, `icon` boolean + instance swap.
   - Input / Select / Textarea: `state` (default, focus, error, disabled); label + control + hint/error in vertical auto layout, gap 6.
   - Badge, Alert, Tabs, Switch, Checkbox, Card, Stat, Dialog, Tooltip, EmptyState, Skeleton.
   - Scheduling: EventPill (`type` × `state`: default, conflict, cancelled, postponed), EventRow, ConflictCard (`severity`), AlternativeOption (`selected`), RsvpControl (`value`), AttendanceBar, NotificationItem (`read`).
   - Navigation: Sidebar item (`active`, `count`), Mobile tab bar (5 items, `active`), Top bar.
7. **Screens:** recreate the 28 screens from `/wireframes/` using the components; use the hi-fi screenshots as reference layers (lock and set 30% opacity).
8. **Prototype:** link the flows from `/architecture/#flows` (create event, resolve conflict, AI schedule, RSVP).
9. **Accessibility annotations:** add a layer "A11y notes" per screen: focus order, labels for icon buttons, live regions (toasts, conflict panel).
10. **Publish** the library and enable it in product files.

## If using the Figma MCP/API later
The connected Figma integration can create files and variables programmatically. Run that only after confirming the target team/project in Figma. This package is the input it would use.
