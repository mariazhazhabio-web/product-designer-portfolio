# Release checklist

## Before release
- [ ] `npm run typecheck` passes
- [ ] `npm run test:unit` passes
- [ ] `npm run build` succeeds (static export to `out/`)
- [ ] `npm run test:e2e` passes (desktop + mobile projects)
- [ ] `npm run pdf` regenerated case study and resume PDFs if content changed
- [ ] `npm run screens` regenerated screenshots if UI changed
- [ ] Manual QA checklist (qa-test-plan.md) for changed areas
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on home, case study, demo dashboard
- [ ] `lib/site.ts` contact fields filled (or intentionally empty)
- [ ] All simulated features and demo data still labeled
- [ ] TASKS.md updated
- [ ] No secrets in the repo (`git grep -i "api_key\|secret\|token"` reviewed)

## Release
- [ ] Merge to `main`; hosting provider builds automatically (Vercel / Netlify / Cloudflare Pages) or run the GitHub Pages workflow
- [ ] Smoke test production URL: home, case study, demo create event, assistant, .ics download, a docs page
- [ ] Check 404 page and a deep link (e.g. `/demo/conflicts/`)

## After release
- [ ] Share links updated in resume / cover letter / LinkedIn
- [ ] Note release in TASKS.md with date
- [ ] Log any issues with the bug report template
