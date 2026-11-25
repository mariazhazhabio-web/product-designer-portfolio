# Deployment guide

The portfolio is a **static site** (`next build` with `output: "export"` → `out/`). No server, database or paid service is required. All options below have free tiers.

## 0. Prerequisites (Windows)
- Node.js 20.9 or newer (`node -v`)
- Git (`git --version`)
- A GitHub account (for Vercel / Netlify / Cloudflare Pages / GitHub Pages)

## 1. Run locally
```powershell
cd C:\Users\maria\PROJECTS\product-designer-portfolio
npm install
npm run dev
```
Open http://localhost:3000. Production preview:
```powershell
npm run build
npm start
```
(`npm start` serves the `out/` folder at http://localhost:3000.)

## 2. Push to GitHub
```powershell
git add .
git commit -m "Portfolio"
gh repo create product-designer-portfolio --public --source . --push
```
(Or create the repository on github.com and follow its "push an existing repository" commands.)

## 3a. Vercel (recommended, free Hobby plan)
1. Sign in at vercel.com with GitHub → **Add New → Project** → import the repository.
2. Framework: Next.js (auto). Build command `npm run build`, output directory `out`.
3. Deploy. Every push to `main` redeploys.

## 3b. Netlify
1. app.netlify.com → **Add new site → Import from Git**.
2. Build command `npm run build`, publish directory `out`.

## 3c. Cloudflare Pages
1. dash.cloudflare.com → Workers & Pages → **Create → Pages → Connect to Git**.
2. Framework preset: *Next.js (Static HTML Export)*; build `npm run build`; output `out`.

## 3d. GitHub Pages (project site at `/<repo>/`)
The site supports a base path. A ready workflow is in `docs/github-pages-workflow.yml`; copy it to `.github/workflows/pages.yml` (pushing workflows needs `gh auth refresh -s workflow`):
1. Repository → Settings → Pages → Source: **GitHub Actions**.
2. Push to `main`. The workflow builds with `NEXT_PUBLIC_BASE_PATH=/product-designer-portfolio` and publishes `out/`.

## 4. Custom domain (optional)
Add the domain in your host's dashboard and create the DNS record it shows (usually a CNAME). Hosts provide free HTTPS.

## 5. Regenerate assets after changes
```powershell
npx playwright install chromium
npm run screens
npm run pdf
```
`screens` captures prototype screenshots into `public/screens/`; `pdf` creates `public/downloads/sportsync-case-study.pdf` and `maria-bio-resume.pdf`. Both need a local build (`npm run build`) first; the scripts start a local server automatically.

## 6. Things that need credentials (not configured)
| Feature | What's needed |
|---|---|
| Two-way Google Calendar sync | Google Cloud project, OAuth client, backend to store tokens |
| Outlook sync | Microsoft Entra app registration, Graph permissions, backend |
| Email / SMS / push delivery | Provider accounts (e.g. Resend, Twilio, FCM/APNs) + backend |
| Live AI | LLM API key + cost approval; replace `parseInstruction()` |
| Multi-user data, real share links | Database (e.g. Supabase) using `docs/database-schema.md` |
None of these are required for the portfolio to work.
