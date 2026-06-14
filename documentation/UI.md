# Aldofa — UI & Pages

> What's built in the prototype (`/prototype`) and how the pages connect.
> Stack: Next.js (App Router) + Tailwind + TypeScript, mock data only.
> Related: [general-doc.md](general-doc.md) · [tech-stack.md](tech-stack.md) · [architecture.md](architecture.md) · [design.md](design.md)

---

## Roles & Access

Mock auth with a role cookie, enforced by `middleware.ts`. Three roles, three demo logins:

| Role | Demo login | Home after login | Can access |
|---|---|---|---|
| **Member** (`user`) | `user / user` | `/` | Everything except nonprofit dashboard & admin |
| **Nonprofit** | `nonprofit / nonprofit` (separate login) | `/nonprofits/dashboard` | Nonprofit area + browsing |
| **Admin** | `admin / admin` | `/admin` | Everywhere |

- **Public (no login):** landing, browse, listing detail, nonprofit browse/profile,
  nonprofit register, about/contact/terms/privacy, login pages.
- **Login required:** sell, edit listing, messages, checkout, transactions, profile,
  settings (member/admin) · nonprofit dashboard/sponsor/settings (nonprofit/admin) ·
  admin/* (admin).
- Gated **in-app actions** (e.g. "I'm interested") show a **"Log in to continue" modal**
  rather than a hard redirect; direct URL access is still guarded by middleware.

---

## Page Inventory

### Auth — `app/(auth)/*`
| Route | Page | Purpose |
|---|---|---|
| `/login` | Member/Admin login | Username + password (+ Google mock), show/hide password, demo-login hints, link to nonprofit login |
| `/login/nonprofit` | Nonprofit login | Separate branded login for nonprofit accounts |
| `/register` | Register | Create account + Terms checkbox, then phone verify |
| `/verify-phone` | Verify phone | 6-digit OTP; sets member session |

### Marketplace — `app/(site)/*`
| Route | Page | Purpose |
|---|---|---|
| `/` | Landing | **Dedicated mobile hero** + desktop hero, "How it works", fresh listings (real photos), "Why us?", featured nonprofits, nonprofit CTA |
| `/browse` | Browse | Listing grid with live search + category / condition / city / **distance (miles)** filters |
| `/listings/[id]` | Listing detail | Photo gallery, price, seller, charity recipient, "I'm interested" (login-gated modal), report; **sticky action bar on mobile** |
| `/sell` | Create listing | 5-step wizard (details → photos → pickup → nonprofit → review) in a card + Terms checkbox |
| `/listings/[id]/edit` | Edit listing | Edit fields, delete (confirm modal) |
| `/messages` | Inbox | List of buyer/seller chats |
| `/messages/[chatId]` | Chat thread | Negotiate, "Pay now" CTA, report |
| `/checkout/[id]` | Checkout | Order summary, optional donation split, mock card form + Terms checkbox |
| `/transactions` | Transactions | All of the user's deals with status badges |
| `/transactions/[id]` | Confirm meetup | Share **your** code, enter the **other party's** code → auto-completes; dispute / cancel; completion + rating |
| `/profile` | My profile | Trust badges, stats, my listings |
| `/profile/[id]` | Public profile | Same view for any user |
| `/settings` | Settings | Profile, notifications, security, account |

### Nonprofit — `app/(site)/nonprofits/*`
| Route | Page | Purpose |
|---|---|---|
| `/nonprofits` | Nonprofit browse | Verified orgs, sponsored on top |
| `/nonprofits/[id]` | Nonprofit profile | Header, **impact band** (raised / supporters / items / avg gift), about, supported listings |
| `/nonprofits/register` | Onboarding | 4-step (org → EIN + docs → Stripe → review) in a card + Terms checkbox |
| `/nonprofits/dashboard` | Analytics | Stat cards, donations-over-time bar chart, recent donations |
| `/nonprofits/settings` | Edit profile | Name, mission, about, impact statement, website, category, location |
| `/nonprofits/sponsor` | Sponsorships | Tier selection (spotlight / category / homepage) + checkout |

### Company & Legal — `app/(site)/*`
| Route | Page | Purpose |
|---|---|---|
| `/about` | About us | Mission, impact banner, values, team band |
| `/contact` | Contact us | Contact form + channels |
| `/terms` | Terms of Service | Placeholder legal copy |
| `/privacy` | Privacy Policy | Placeholder legal copy |

### Admin — `app/admin/*`
| Route | Page | Purpose |
|---|---|---|
| `/admin` | Overview | Platform metrics + "needs attention" queues |
| `/admin/nonprofits` | Approvals | Verify / approve / reject nonprofit applications |
| `/admin/listings` | Moderation | Dismiss / take down listings |
| `/admin/reports` | Reports | Dismiss / warn / remove / suspend |
| `/admin/transactions` | Transactions | Resolve disputes (refund / release), monitor all |
| `/admin/users` | Users | Warn / flag / ban |

### Global
- **Role-aware sticky header** — search, chats icon, notifications dropdown, profile
  dropdown (menu adapts per role: member / nonprofit / admin), logout; "Log in" when
  signed out.
- **Role-aware mobile bottom nav** — member (Home/Browse/Sell/Chats/You),
  nonprofit (Dashboard/Browse/Sponsor), guest (Home/Browse/Causes/Log in).
- **Dedicated mobile hero** on landing; desktop hero is the two-column version.
- Dark footer (Marketplace / Nonprofits / Company links), 404 page.
- Reusable modals/sheets: **report**, **rating**, **login-required** (bottom-sheet on
  mobile with grab handle). Terms checkbox on register, nonprofit register, checkout, sell.

---

## Workflows

### Buyer (member)
1. `/browse` — find an item (search / category / condition / city / distance)
2. `/listings/[id]` — review, click **I'm interested** (prompts login if needed)
3. `/messages/[chatId]` — agree on price, click **Pay now**
4. `/checkout/[id]` — accept Terms, pay (funds held), optional donation split
5. `/transactions/[id]` — meet, **share your code + enter the seller's code**
6. Meetup confirmed → donation sent (auto) → **rate** the seller

### Seller (member)
1. `/sell` — create listing, choose the nonprofit, accept Terms, publish
2. `/messages/[chatId]` — respond to interested buyers
3. `/transactions/[id]` — meet, **share your code + enter the buyer's code**
4. Meetup confirmed → proceeds donated → **rate** the buyer

### Nonprofit
1. `/login/nonprofit` (or `/nonprofits/register` to apply) — onboarding + Terms
2. (admin approves at `/admin/nonprofits`)
3. `/nonprofits/[id]` — public profile with impact band
4. `/nonprofits/dashboard` — track donations and supporters
5. `/nonprofits/settings` — edit the public profile
6. `/nonprofits/sponsor` — optionally buy promoted placement

### Admin
1. `/admin` — see what needs attention
2. `/admin/nonprofits` — approve / reject applications
3. `/admin/reports` — act on user reports
4. `/admin/transactions` — resolve disputes (refund or release)
5. `/admin/listings`, `/admin/users` — moderate content and accounts

---

## State Models (as built)

- **Listing:** active → interested → reserved → pending_meetup → completed / cancelled
- **Transaction:** payment_held → (both codes exchanged) → completed / cancelled / disputed
- **Nonprofit:** pending → approved / rejected / suspended

---

## Notes / Known prototype limits

- Mock data only (`lib/mock.ts`); form submissions update local state, not the data store.
- Logged-in identity on server pages currently maps to a single mock persona.
- Listing photos use `picsum.photos`; distances are simulated. See
  [lastsessionrev.md](../prototype/lastsessionrev.md) for the full review & next steps.
