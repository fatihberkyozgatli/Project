# Aldofa

Charity-enabled peer-to-peer marketplace where every sale becomes a donation.

> "Facebook Marketplace, but every sale becomes a donation."

People exchange secondhand goods not for personal profit, but to support the
causes they care about. Sellers declutter with purpose, buyers shop locally and
ethically, and nonprofits receive donations from everyday marketplace activity.
Aldofa is a commercial platform that enables nonprofit impact — it is not itself
a nonprofit.

## Status

**Pre-MVP.** A clickable frontend prototype (Next.js, mock data, no backend)
lives alongside the planning docs and the database layer. The first build target
is the core loop: list → browse → chat → meetup → dual-code → simulated
donation. Real payments come last, after the legal spike clears.

## Repository layout

| Path | Contents |
|---|---|
| `frontend/` | The Next.js prototype (App Router + TypeScript + Tailwind, mock data). Run from here. |
| `documentation/` | All specs — product, architecture, tech stack, database, design, UI. |
| `database/` | Runnable SQL for the Supabase Postgres schema (migrations, RLS, functions, storage, seed). |
| `CLAUDE.md` | Repo conventions and project guide (auto-loaded by Claude Code). |

Inside `frontend/`: `app/(site)/*` (marketplace + nonprofit pages),
`app/(auth)/*` (login/register/verify), `app/admin/*` (moderation); shared UI in
`components/`; mock data in `lib/`; domain types in `types/`. The Tailwind theme
in `tailwind.config.ts` is generated from the design tokens.

## Tech stack

A single Next.js app backed by Supabase, deployed on Vercel — no separate
backend. See [documentation/tech-stack.md](documentation/tech-stack.md).

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase Postgres |
| Auth | Supabase Auth (email at MVP) |
| Realtime | Supabase Realtime (chat) |
| Storage | Supabase Storage (listing images) |
| Hosting | Vercel |

Deferred to the payment era: Stripe Connect (payments) and Vercel Cron
(timeouts/webhooks).

## Getting started

Requires Node 20+. Run the prototype from `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. The prototype uses mock data, so no backend or
environment variables are needed yet.

Other scripts:

```bash
npm run build   # production build
npm run lint    # lint
```

## Database

The schema is plain SQL in [`database/`](database), applied in numeric order
(`0001` → `0008`) in the Supabase SQL Editor. Nothing is deployed yet. The
runbook — migrations, RLS policies, security-definer functions, storage, seed,
and a verification script — is [documentation/database.md](documentation/database.md);
the folder's own guide is [database/README.md](database/README.md).

## Documentation

- [general-doc.md](documentation/general-doc.md) — product, business, legal, trust & GTM; master Decision Log (source of truth)
- [tech-stack.md](documentation/tech-stack.md) — the committed tech stack (locked)
- [architecture.md](documentation/architecture.md) — system design: data model, API, state machines, subsystems
- [database.md](documentation/database.md) — database runbook
- [plan.md](documentation/plan.md) — MVP build plan (milestones, build order)
- [design.md](documentation/design.md) — design system (tokens, components)
- [UI.md](documentation/UI.md) — prototype page inventory & workflows

## Conventions

Money is stored and computed in integer cents (never floats). No emojis anywhere
(use line/SVG icons in the UI). See [CLAUDE.md](CLAUDE.md) for the full set.
