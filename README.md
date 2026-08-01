# Dovroyn

Dovroyn is a React + Vite application for private AI marketing pods, with:

- Dedicated pod-first landing and navigation experience
- Login and signup with Supabase Auth
- A lean outer pod library and a rich workspace inside each pod
- Website/photo intake, AI direction approval and overrides, assets, social content, calendars, campaigns, analytics, collaborations, coming-soon pages, and budget/ad review
- Server-side OpenAI Responses API routes for the public assistant and authenticated pod analysis
- Dovroyn's responsive cream, navy, and gold interface with charts, modals, motion, and a command palette
- Supabase Auth, private storage, row-level ownership policies, and pod persistence
- Four recurring Stripe subscription tiers with monthly allowance windows

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Add the required browser and server values listed in `.env.example`. Keep `OPENAI_API_KEY` server-only and never prefix it with `VITE_`.
4. Run locally:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

Run the rule tests with:

```bash
npm test
```

## Supabase

Review and run the SQL files in order:

1. `supabase-migration.sql`
2. `supabase-pod-workspace-migration.sql`

The second migration adds the internal pod features, hardens ownership policies, creates a private `pod-assets` bucket, and separates encrypted social-provider credentials into a non-exposed schema. It is not applied automatically.

## Release gate

Do not deploy solely because the build passes. First validate Stripe links and webhooks, run both migrations in the intended Supabase project, configure server-only API variables, complete each social provider's OAuth approval, and perform the landing/pod button audit described in `DOVROYN_PRODUCT_SPEC.md`.
