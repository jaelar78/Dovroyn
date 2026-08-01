# Dovroyn Product Scope

This file is the working product contract for the Dovroyn merge. It records only the decisions approved in the project chat. It contains no secrets and does not authorise deployment.

## Canonical build

- `Dovroyn` is the product that remains.
- `dovroynmpv2` is a design and component reference only.
- Keep Dovroyn's cream, navy, and gold colour system.
- Bring the richer motion, charts, modals, command palette, and reusable interface patterns into Dovroyn.
- Do not push or deploy as part of this merge. Test locally first.

## Product structure

The signed-in outer dashboard is intentionally lean: it shows the user's pods and a create-pod action. Marketing tools live inside a pod.

The approved pod journey is:

1. Open or create a pod.
2. Add a website, notes, and photos.
3. Run the pod's AI analysis.
4. Review, approve, or override the proposed brand direction.
5. Generate platform-specific content into the pod's tabs.
6. Open Socials and connect each recommended account through that provider's authorised sign-in flow.
7. Review, schedule, and—where the paid tier and provider integration allow it—publish during the active paid period.

Each pod owns its own analysis, brand memory, assets, social connections, posts, calendar, campaigns, analytics, collaborators, coming-soon pages, email captures, AI notes, and budget/ad information. A user's override becomes a preference for that pod and future AI output must adapt to it.

## Billing and generation periods

- The four products are recurring monthly or yearly Stripe subscriptions.
- A monthly subscription that starts on 10 July runs to 10 August, then renews if payment succeeds.
- A yearly subscription remains active for the paid year, while content-generation allowances reset monthly on the subscription anniversary day.
- Failed, cancelled, expired, or unpaid access must not generate or publish content outside its paid period.
- `weeklyPostingDays` means distinct campaign posting days in a week, not the total number of posts or the number of platforms.

Confirmed plan limits:

| Plan | Monthly | Yearly | Pods | Content days per allowance month | Posting days per week |
| --- | ---: | ---: | ---: | ---: | ---: |
| Starter | $89 | $855 | 1 | 10 | 2 |
| Growth | $249 | $2,390 | 3 | 20 | 3 |
| Pro | $599 | $5,750 | 7 | 30 | 6 |
| Scale | $1,299 | $12,470 | 12 | 30 | 7 |

Platform-connection counts per tier have not been confirmed, so the product must not invent a quota. Provider availability, app approval, permissions, and region still apply. Advertising spend changes always require explicit user approval. The Scale tier includes the most complete budget and real-ad-spend view when provider APIs are connected.

## Social and calendar rules

- Dovroyn may analyse and recommend more than 30 platforms.
- “Supported for planning” is not the same as “connected for publishing.” The interface must state the real capability.
- Content follows each platform's format. For example, Instagram can use relevant hashtags; Facebook copy should not be padded with hashtags.
- Content can use public holidays for the pod's region.
- Religious-calendar content is opt-in and must use the user's selected observances rather than guessing religion.
- Account tokens stay server-side or in a purpose-built encrypted secret store. They are never returned in public pod records.

## Data privacy

- Supabase is Dovroyn's private operational datastore. It is not an admin screen exposed to customers.
- Supabase Auth identifies users. Row Level Security isolates every user's rows.
- Browser code receives only a publishable/anon key; the service-role or secret key is server-only.
- Dovroyn may use de-identified, consented product insights for future improvements, but must not silently repurpose private customer content or credentials.

## AI boundaries

- OpenAI credentials are server-only.
- The public landing assistant answers genuine general marketing and Dovroyn product questions with strict request limits.
- A pod assistant is grounded in that authenticated user's pod data only.
- AI output is a proposal until the user approves it. No ad-budget change is automatic.

## Release gate

Before any deployment: run automated tests, create a production build, test all public calls to action, test every visible pod control, verify access boundaries, and clearly label unavailable provider integrations.
