# TASKS

Status of every deliverable. ✅ done · 🟡 partial / simulated · ⏳ pending (needs Maria, credentials or real participants).
Last updated: 2026-11-25.

## Phase 1: Portfolio architecture & SportSync requirements
- ✅ Next.js + TypeScript + Tailwind project, static export, light/dark mode, responsive layout
- ✅ Site map: Home, About, Selected Projects, Process, UX Research, Design Systems, Interactive Prototypes, Skills, Resume, Contact, Role Alignment, Documents
- ✅ PRD with functional & non-functional requirements (`docs/prd.md`, `/engineering/`)

## Phase 2: UX research, personas, IA, flows
- ✅ Problem statement, objectives, research questions, 7 pain-point hypotheses
- ✅ Competitor analysis framework (criteria only; review not performed)
- ✅ Interview guide, survey questionnaire, synthesis template
- ✅ 5 provisional personas, empathy maps, JTBD, journey map, opportunity map, RICE + MoSCoW
- ✅ Sitemap/IA diagram, navigation structure, role-based access map, feature hierarchy
- ✅ 9 user flows + 2 decision trees
- ⏳ Conduct interviews and survey; replace provisional personas (Maria)

## Phase 3: Wireframes, design system, hi-fi
- ✅ 28 screens/states in low, mid and high fidelity (`/wireframes/`)
- ✅ Loading, empty, error, offline, permission and confirmation states
- ✅ Design tokens, contrast checks, typography, spacing, grids, icons, components with states (`/design-system/`)
- ✅ Cross-platform conventions: web, iOS, Android (`/prototypes/#platforms`)
- 🟡 Figma: handoff package (tokens.json, SVG icons, component specs, import steps). **No Figma file created.**

## Phase 4: Functional scheduling platform & AI demo
- ✅ Dashboard (daily/weekly/monthly calendars, upcoming games, training, tournaments, filters, venue availability, pending RSVPs, alerts, quick create)
- ✅ Create / edit / duplicate / delete / cancel / postpone / restore; games, practices, tournaments, meetings; teams & venues
- ✅ Recurring events with this / following / all edits
- ✅ CSV import (validation) and export; .ics export; share links (read-only)
- ✅ Conflict detection: venue, team, coach, player, rest, closure, hours, maintenance, capacity, recurring
- ✅ Compare alternatives before confirming; postponed-games queue
- 🟡 AI assistant: natural language → proposal, explanations, edit/approve/reject/revise, undo & history (**simulated, rule-based; no live AI**)
- ✅ RSVP (attending / not / maybe / pending), parent confirmation per child, expected attendance, reminders, attendance tracking
- ✅ Venue directory, booking calendar, hours, capacity, equipment, maintenance, restrictions
- 🟡 Calendar sync: .ics + Google/Outlook add-event links work; two-way OAuth sync simulated (needs credentials)
- 🟡 Notifications: history, preferences, email/SMS/push previews (delivery simulated)
- ✅ Six roles with permissions; onboarding; revision history; offline simulation
- ⏳ Expo / React Native prototype (not built; responsive web + platform specs instead)
- ⏳ Server database (Supabase schema documented, not provisioned)

## Phase 5: Supporting case studies
- ✅ WideKonek (statuses from its ARCHITECTURE.md and commits)
- ✅ ZC Smart Digital (original demo images, statuses from its PUBLISH-STEPS and n8n README)
- 🟡 Frendora: no source files found; shown as proposed concept. ⏳ Maria to confirm actual status

## Phase 6: Usability, QA, engineering docs
- ✅ Usability package: objectives, recruitment, moderator script, 6 scenarios, completion criteria, feedback form, SUS, observation sheet, severity matrix, iteration report template
- ⏳ Run usability sessions; results marked **Pending**
- ✅ Product metrics dashboard (labeled demonstration data) + metric definitions
- ✅ User stories & acceptance criteria, component specs, API spec, DB schema, responsive & a11y specs, edge cases, QA checklist & test cases, bug template, release checklist, backlog, traceability matrix
- ✅ Unit tests (8, engine) and Playwright E2E (15, desktop + mobile)

## Phase 7: Application materials & deployment
- ✅ ATS resume (bracketed fields for Maria to complete), web resume, resume PDF
- ✅ TeamSnap cover letter (bracketed fields), portfolio introduction, SportSync one-pager
- ✅ Interview prep guide, case study presentation script, 5-minute walkthrough script
- ✅ README, deployment guide, GitHub Pages workflow
- ✅ Case study PDF (`/downloads/sportsync-case-study.pdf`)
- ⏳ Fill in `lib/site.ts` contact details (email/LinkedIn/GitHub) if they should be public
- ⏳ Push to GitHub and deploy (needs Maria's accounts)

## Known limitations
- Prototype time zone = viewer's device; no DST-aware server recurrence.
- Week view becomes dense on very busy days (day-by-venue view recommended).
- Share links show sample data + the opening browser's saved changes (no server).
