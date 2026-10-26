# AI Influencer Agency

A creator agency home base where a student runs the AI talents they made: numbers from each talent's
social accounts, plus three agents (Grow, Scout, Pitch). Product rules are in the PRD
(`ai-influencer-agency-prd.md`, sections 5 and 6).

## Stack

Next.js 15 (App Router), React 19, TypeScript. No backend yet: all data is mock data kept in the
browser (`localStorage` key `aia-state-v1`). The agents are simulated with timers.

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
