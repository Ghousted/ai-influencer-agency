# AI Influencer Agency

A creator agency home base where a student runs the AI talents they made: numbers from each talent's
social accounts, plus three agents (Grow, Scout, Pitch). Product rules are in the PRD
(`ai-influencer-agency-prd.md`, sections 5 and 6).

## Stack

Next.js 15 (App Router), React 19, TypeScript. App data is mock data kept in the browser
(`localStorage` keys `aia-state-v1` and `aia-accounts-v1`). The screens still use simulated agents.

The agents also have a real API through OpenRouter (not wired into the screens yet):

- `src/server/openrouter.ts` — server-only client. Asks for JSON that matches a schema, with a timeout.
- `src/server/agents.ts` — the Grow, Scout, Content and Pitch prompts, schemas and input checks.
- `POST /api/agents/{grow|scout|content|pitch}` — body `{ talent, avoid?, brand?, sender? }`.
  Errors: 400 `bad_request`, 409 `needs_account`, 503 `no_key`, 504 `timeout`, 502 `upstream` / `bad_output`.
- `GET /api/health` — whether `OPENROUTER_API_KEY` is set, the model, and which platforms the server reads.
- `src/agency/api.ts` — typed browser helpers (`agents.grow(talent)`, `accounts.read(platform, …)`).

Social accounts are read on the server (PRD features 3–4):

- `src/server/accounts.ts` — `readAccount` sends each platform to its reader. `src/server/youtube.ts` finds a
  channel by handle with `YOUTUBE_API_KEY` (public numbers, no watch time).
- `POST /api/accounts/read` — body `{ platform, handle?, ref? }`, returns `{ handle, ref, stats, few }`.
  Errors: 400 `bad_request`, 404 `not_found`, 503 `not_configured`, 504 `timeout`, 502 `upstream`.
- Each account keeps its own numbers (`Account.stats`, `ref`, `readAt`); `combineStats` in `logic.ts` adds them
  up into the talent's stats. A platform the server cannot read yet falls back to the simulated connect.

Supabase is the backend for sign-in, data and pictures:

- `supabase/migrations/*.sql` — schema. Apply with `npm run db:migrate` (reads `.env.local`, verifies TLS
  with `certs/supabase-ca.crt`). Never edit an applied migration; add a new numbered file.
- Tables `agencies`, `talents`, `pitches`, `posts`, one row set per student (`user_id`). Talents, pitches
  and posts keep the app's shape in a `data` jsonb column, so `src/agency/types.ts` stays the source of truth.
- Row-level security on every table: a student only reads and writes their own rows. Pictures go in the
  storage bucket under `<user_id>/`.
- `src/agency/supabase.ts` — browser client (publishable key). `src/server/supabase.ts` — admin client
  (secret key) and `userFromRequest` for API routes. Never import `src/server/*` from client code.

Environment: copy `.env.example` to `.env.local`. Keys stay on the server; never import `src/server/*`
from a client component.

## Layout

- `src/agency/AgencyApp.tsx` — the app controller (one client component). Holds all state and actions.
  Routing is state-based (`state.route`), not URL-based.
- `src/agency/views/*.ts` — view-model builders. Each turns state into the flat values a screen reads.
- `src/agency/screens/*Screen.tsx` — the screens, generated from the Claude Design file
  "AI Influencer Agency.dc.html". Markup and inline styles match the design.
- `src/agency/design-states.css` — hover, focus and active rules generated from the same design file.
- `src/agency/logic.ts` — demo data and the text generators that stand in for the agents.
- `src/agency/types.ts` — domain types (Talent, Account, Idea, ContentIdea, Brand, Pitch, ScheduledPost).
- `public/assets/` — images from the design project.

## Conventions

- Say "AI talent", never "avatar".
- Keep the design's visual language: blue `#006AFF`, ink `#18181b`, Plus Jakarta Sans.
- Screens only read from the view model. Put behaviour in `AgencyApp.tsx` or a view builder, not in markup.
- The product never posts, sends pitches or contacts brands. The student copies and sends.

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build (also type-checks)
- `npm run lint`

Prototype switches: `?demo` starts signed in with the demo agency. `?simulate=slow|fails|stalls`
shows the loading, failed and stalled states.
