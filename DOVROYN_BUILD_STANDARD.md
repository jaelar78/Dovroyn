# Dovroyn Build Standard

Operating standard for future Cursor agents working on Dovroyn. Follow it unless the user explicitly overrides.

## Workflow
- Always start from the latest `main` (pull/fast-forward) unless told otherwise.
- Only merge **one** selected branch / change set at a time — never batch multiple candidates.
- Run `npm run build` before every push and report the result.
- Commit and push to `origin/main` (Vercel deploys automatically); do not open PRs unless asked.
- After pushing, report the **commit hash** and the **Vercel deployment status**.

## UI review
- For any UI work, compare against screenshots / references before merging.
- Check **mobile separately from desktop** — a change that looks right on desktop must be verified on a mobile viewport too.
- For the public landing UI, maintain the premium **cream / navy / gold** executive style.

## Do not touch (unless specifically asked)
- Supabase integration and config
- Stripe / payment logic
- Auth flows
- Routes
- Waitlist logic
- Pricing logic

Keep changes scoped to what was requested; do not refactor or "improve" these areas opportunistically.
