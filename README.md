# Maria Zha-Zha C. Bio · Product Designer Portfolio

**Live site:** https://product-designer-portfolio-alpha.vercel.app · **Prototype:** https://product-designer-portfolio-alpha.vercel.app/demo/

Portfolio of **Maria Zha-Zha Cornillez Bio**, Product Designer | UI/UX Designer | AI-Assisted Digital Product Developer.

Featured project: **SportSync: Smarter Scheduling. Stronger Teams.**, an original, AI-assisted sports scheduling and team management concept with a working prototype, research kit, design system and engineering handoff. Also includes case studies for **WideKonek**, **Frendora** and **ZC Smart Digital**.

> SportSync is an independent portfolio project. It is not affiliated with, commissioned by, or endorsed by TeamSnap or any other company. All people, teams and data in the demo are fictional. AI features are simulated with a deterministic rule-based engine.

## Quick start (Windows PowerShell)
```powershell
cd C:\Users\maria\PROJECTS\product-designer-portfolio
npm install
npm run dev
```
Open http://localhost:3000 (if port 3000 is busy: `npx next dev -p 3100`).

## What's inside
| Area | Where |
|---|---|
| Portfolio pages (Home, About, Projects, Process, Research, Design System, Prototypes, Skills, Resume, Contact, Role Alignment, …) | `app/(site)/` |
| SportSync live prototype (no sign-up) | `app/demo/` · open `/demo/` |
| Scheduling & conflict engine, simulated AI assistant, ICS & CSV | `lib/sportsync/` |
| UI components (shadcn/ui-style API, authored locally) | `components/ui/` |
| Research, personas, flows, metrics, traceability content | `content/` |
| Documents (PRD, API, schema, QA, research kit, resume, cover letter, scripts…) | `docs/` (also rendered at `/docs/`) |
| Design tokens, SVG icons, Figma import guide | `design-handoff/`, `docs/figma-handoff.md` |
| Unit tests (engine) | `tests/unit/` |
| End-to-end tests (Playwright) | `tests/e2e/` |

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Exports docs/tokens/icons, type-checks and builds the static site into `out/` |
| `npm start` | Serves `out/` at http://localhost:3000 |
| `npm run typecheck` | TypeScript check |
| `npm run test:unit` | Scheduling engine unit tests (node:test) |
| `npm run test:e2e` | Playwright tests on desktop + mobile (uses installed Google Chrome; builds must exist) |
| `npm run screens` | Captures prototype screenshots into `public/screens/` |
| `npm run pdf` | Generates `public/downloads/sportsync-case-study.pdf` and `maria-bio-resume.pdf` |

No Chrome? `npx playwright install chromium` then set `$env:PW_CHANNEL = "chromium"`.

## Tech stack
Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · class-variance-authority (shadcn/ui-style components) · Lucide icons · Recharts · react-markdown · Playwright. Data: local demo database in the browser (localStorage). No paid services.

**Calendar:** a custom, accessible calendar (day-by-venue, week, month, list) was built instead of FullCalendar to support venue columns, conflict states and keyboard-accessible empty slots without a heavy dependency.

## What's real vs simulated
| Real | Simulated / needs credentials |
|---|---|
| Conflict detection (10 types), alternatives ranking, tournament/practice generation | "AI" language understanding (rule-based parser, no LLM) |
| .ics export (RFC 5545), Google/Outlook add-event links | Two-way Google/Outlook sync (OAuth) |
| CSV import/export with validation | Email / SMS / push delivery |
| Undo, revision history, roles & permissions | Multi-user data and server share links |

## Deployment
See [`docs/deployment-guide.md`](docs/deployment-guide.md): Vercel, Netlify, Cloudflare Pages or GitHub Pages (workflow template in `docs/github-pages-workflow.yml`).

## Personal details
Edit `lib/site.ts` (email, LinkedIn, GitHub, location). Empty fields are hidden. Complete the bracketed fields in `docs/resume.md` and `docs/cover-letter.md` before sending.

## License
Code © Maria Zha-Zha Cornillez Bio. Lucide icons: ISC license. Fonts: Inter and Space Grotesk (SIL Open Font License).
