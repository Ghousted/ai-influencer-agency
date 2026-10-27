# AI Influencer Agency

A home base for students who run AI talents: every talent's social numbers in one place, plus the
Grow, Scout and Pitch agents.

The UI is built from the Claude Design file "AI Influencer Agency". Data is mock data kept in the
browser for now, and the agents are simulated.

```bash
npm install
cp .env.example .env.local   # add your OPENROUTER_API_KEY
npm run dev
```

The agents call OpenRouter (`OPENROUTER_MODEL`, default `anthropic/claude-sonnet-5.5`).
Check the setup at http://localhost:3000/api/health.

Open http://localhost:3000. Sign up to start with an empty agency, or log in with any email and
password to load the demo agency (three AI talents). Add `?demo` to the URL to skip straight in.

See `AGENTS.md` for how the code is organised.
