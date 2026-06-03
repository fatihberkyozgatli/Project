# [APP_NAME]

Charity-enabled peer-to-peer marketplace where every sale becomes a donation.
> "Facebook Marketplace, but every sale becomes a donation."

## Project Status

**Pre-MVP.** A clickable **frontend prototype** now lives alongside the planning
docs (Next.js App Router + Tailwind + TypeScript, mock data only, no backend).
Decisions live in the docs below; update them there first, then reflect anything
durable here.

## Repository Layout

- `prototype/` — the Next.js prototype (run from here). Inside: `app/(site)/*`
  (marketplace + nonprofit pages), `app/(auth)/*` (login/register/verify),
  `app/admin/*` (moderation); shared UI in `components/ui/*`; mock data in
  `lib/mock.ts`; domain types in `types/`. The Tailwind theme in
  `prototype/tailwind.config.ts` is generated from the design tokens.
- `Documentation/` — all specs (see below).
- `CLAUDE.md` — stays at repo root so Claude Code auto-loads it.

## Key Documents

- `Documentation/projectplanning1.md` — main planning & architecture doc (source of truth)
- `Documentation/design.md` — design system (tokens, components)
- `Documentation/UI.md` — prototype page inventory & workflows

## Tech Stack (planned — see `projectplanning1.md` §15)

- **Frontend:** React + Next.js
- **Backend:** Next.js API routes (or Node/Express)
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (Google OAuth, email, phone)
- **Realtime/chat:** Supabase Realtime
- **Payments:** Stripe Connect (Express)
- **Storage:** Supabase Storage or Cloudflare R2
- **Background jobs:** Inngest or BullMQ (timeouts, webhook retries)
- **Hosting:** Vercel (frontend) + Railway/Fly.io (backend)

Nothing is installed yet; treat the stack as the agreed target, not the current state.

## Conventions

- **Money:** store and compute amounts in integer cents — never floats.
- **Source of truth:** don't duplicate business/legal/architecture detail here;
  link to `Documentation/projectplanning1.md` instead.
- **No emojis:** never use emojis anywhere — not in the product UI, copy, docs,
  commit messages, or chat. Use real icons (line/SVG) in the UI instead.
- **No comments:** do not write code comments. Write self-explanatory code with
  clear names instead. (Exception: a comment is allowed only when it explains
  genuinely non-obvious *why* — e.g. a legal/compliance constraint or a workaround
  — never to restate *what* the code does.)

## Commands

Run from `prototype/`:

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — lint
