# Aldofa — Tech Stack

> The committed technology choices for the MVP.
> Product/business decisions live in [general-doc.md](general-doc.md) · System design in [architecture.md](architecture.md).

| | |
|---|---|
| **Status** | Locked (core stack) — 2026-06-13 |
| **Supersedes** | The "OR" menu in general-doc §15.1 |

---

## Decision summary

**A single Next.js application backed by Supabase, deployed on Vercel. No separate backend.**

All server-side work runs inside the Next.js app (API routes / server actions). Supabase is the backend platform for data, auth, realtime, and file storage.

---

## The stack (MVP)

| Layer | Choice | Role | Notes |
|---|---|---|---|
| Framework | **Next.js** (App Router) | UI + server (API routes / server actions) | Matches the existing prototype |
| Language | **TypeScript** | Everything | |
| Styling | **Tailwind CSS** | UI | Theme generated from design tokens — see [design.md](design.md) |
| Database | **Supabase Postgres** | Relational data | Strong consistency for transactions |
| Auth | **Supabase Auth** | Sign-in | Email at MVP; Google + phone later |
| Realtime | **Supabase Realtime** | Buyer↔seller chat | Decided real-time for MVP |
| Storage | **Supabase Storage** | Listing images | Real image upload is in the MVP core loop |
| Hosting / CI | **Vercel** | Deploy | Git-based deploys, preview URLs |

---

## Why this stack

- **No rewrite.** The prototype is already Next.js + Tailwind + TypeScript.
- **One backend vendor.** Supabase covers DB + Auth + Realtime + Storage — fewer moving parts for a small team.
- **One deployable.** Single app on Vercel keeps ops simple.
- **Relational integrity.** Postgres fits the transaction/state-machine core.

---

## Deferred / payment-era components

These are **not** in the first test release (see the *Pilot Payment & Build Sequencing* decision in [general-doc.md](general-doc.md)), but the stack is chosen so they can be added without re-architecting:

| Component | Choice / leaning | When |
|---|---|---|
| Payments | **Stripe Connect** (Express) — destination charges / delayed transfer | Payment module, after the legal spike |
| Background jobs | **Vercel Cron** (leaning) for timeout sweeps + webhook handling; revisit Inngest if event-driven needs grow | Payment module |
| Email | Resend or SendGrid (transactional) | Post-core-loop |
| SMS | Twilio (phone verification) | Post-core-loop |

---

## Environments & secrets (to fill as we build)

- **Local:** `.env.local` — Supabase URL + anon key (client), service-role key (server only).
- **Vercel:** environment variables per environment (preview / production).
- Secrets are never committed.

---

## Open stack sub-decisions

- Background-job tool (Vercel Cron vs Inngest) — decide with the payment module.
- Image-handling pipeline (resize/compress on upload, CDN delivery) — design in [architecture.md](architecture.md).
