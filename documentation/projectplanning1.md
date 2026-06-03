# [APP_NAME] — Charity-Enabled Peer-to-Peer Marketplace
## Startup Planning & Architecture Document
**Status:** Pre-MVP / Planning Phase
**Last Updated:** June 2026
**Authors:** [Your Names]

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Business Model](#2-business-model)
3. [Entity Structure & Legal Positioning](#3-entity-structure--legal-positioning)
4. [User Types & Roles](#4-user-types--roles)
5. [User Flows](#5-user-flows)
6. [Functional Requirements](#6-functional-requirements)
7. [Listing System](#7-listing-system)
8. [Payment & Transaction Architecture](#8-payment--transaction-architecture)
9. [Nonprofit System](#9-nonprofit-system)
10. [Messaging System](#10-messaging-system)
11. [Authentication & Security](#11-authentication--security)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Trust & Safety](#13-trust--safety)
14. [Legal & Compliance](#14-legal--compliance)
15. [Technical Architecture Overview](#15-technical-architecture-overview)
16. [MVP Scope](#16-mvp-scope)
17. [Go-To-Market Strategy](#17-go-to-market-strategy)
18. [Future Scaling Considerations](#18-future-scaling-considerations)
19. [Research & Open Questions](#19-research--open-questions)

---

## 1. Product Vision

### Mission Statement
[APP_NAME] is a charity-enabled peer-to-peer marketplace where people exchange secondhand goods — not for personal profit, but to support the causes they care about. Every completed transaction becomes a donation.

### Core Value Proposition
- **For Sellers:** Declutter with purpose. Your unwanted items become real donations to nonprofits you choose.
- **For Buyers:** Shop locally and ethically. Every purchase you make funds a nonprofit cause.
- **For Nonprofits:** Receive donations from everyday marketplace activity without requiring your community to fundraise directly.

### What This Platform Is NOT
- Not a traditional resale marketplace (no seller profit)
- Not a pure donation platform (items have value, buyers pay)
- Not a nonprofit itself (commercial entity enabling nonprofit impact)

### One-Line Pitch
> "Facebook Marketplace, but every sale becomes a donation."

---

## 2. Business Model

### Revenue Streams (Prioritized)

#### Primary (MVP Era)
- **Nonprofit Sponsorships / Promoted Visibility**
  - Nonprofits pay to be featured on the platform
  - Category sponsorships ("Sponsored by [Nonprofit] in Books & Education")
  - Local campaign placements
  - Featured nonprofit placement on homepage or browse page

#### Secondary (Post-Scale)
- **Platform transaction fees** (deferred — damages trust in early stage)
- **Premium seller tools** (deferred)
- **Featured listings** (deferred)

### Why No Transaction Fees at MVP?
- Platform positioning is mission-driven and trust-first
- Early users must feel the platform is "on their side"
- Fees create friction and reduce perceived integrity
- Revenue from nonprofit sponsorships aligns incentives: nonprofits benefit from platform growth

### Unit Economics (Rough Projections — Pre-Revenue)
| Metric | Target (6 months) |
|---|---|
| Registered Users | 500–1,000 |
| Active Listings | 200–500 |
| Completed Transactions | 100–300 |
| Total Donations Facilitated | $2,000–$10,000 |
| Nonprofit Partners | 10–25 |

---

## 3. Entity Structure & Legal Positioning

### Recommendation: Texas LLC

Form a **for-profit Texas LLC** operating as a technology platform that facilitates charitable giving through commerce.

### LLC vs. Nonprofit Comparison

| Dimension | Texas LLC | 501(c)(3) Nonprofit |
|---|---|---|
| **Formation Speed** | Fast (days) | Slow (months, IRS approval) |
| **Operational Flexibility** | High | Restricted by mission |
| **Revenue Generation** | Unrestricted | Must align with exempt purpose |
| **Investor Compatibility** | Standard equity/venture | Very limited |
| **Tax on Revenue** | Standard corporate tax | Tax-exempt on qualifying income |
| **Fundraising** | Limited (crowdfunding, revenue) | Grants, donations, tax-deductible gifts |
| **Platform Fees Allowed** | Yes | Complex — must not benefit private parties |
| **Ownership** | Founders retain equity | No ownership — board governed |
| **Mission Lock** | Optional (benefit corp possible) | Legally required |
| **Complexity** | Low | High (annual IRS filings, Form 990) |

### Verdict
Form a **Texas LLC**. Optionally elect **Public Benefit Corporation (PBC)** status if Texas law supports it, to signal mission alignment without legal restrictions of a 501(c)(3). This preserves:
- Founder equity and control
- Ability to raise investment
- Flexibility to evolve revenue model
- Operational speed

### Platform Positioning Statement
> "[APP_NAME] is a commercial technology platform. We are not a nonprofit. We build tools that make it easy for everyday people to direct real money to real nonprofits through the things they already do — buying and selling locally."

---

## 4. User Types & Roles

### 4.1 Regular Users (Buyers & Sellers)
- Same account can act as buyer or seller
- Must verify email at minimum
- Optional: phone verification, future government ID

### 4.2 Nonprofit Organizations
- Separate registration and onboarding flow
- Must pass verification before receiving donations
- Have a public-facing profile page

### 4.3 Admin / Platform Operators
- Internal dashboard for moderation
- Nonprofit approval workflow
- Dispute resolution tools
- Listing review and takedown
- User banning / flagging

---

## 5. User Flows

### 5.1 Seller Flow
```
Register / Login
    → Create Listing (title, description, category, images, condition, city, pickup area)
    → Choose Nonprofit(s) to receive proceeds
    → Listing goes live
    → Buyer expresses interest
    → Seller receives notification
    → Private chat opens
    → Negotiate price and meetup details
    → Agree on final price
    → Buyer initiates payment
    → Both receive confirmation codes
    → Meetup in person
    → Seller enters code after receiving buyer's code confirmation
    → Transaction completes → Donation sent to nonprofit
```

### 5.2 Buyer Flow
```
Register / Login
    → Browse listings (filtered by city/location)
    → View listing detail
    → Express interest (click "I'm Interested")
    → Chat opens with seller
    → Negotiate privately
    → Agree on price
    → Buyer pays through platform (payment held)
    → Buyer receives confirmation code
    → Meetup in person
    → Receive item
    → Buyer enters code to confirm receipt
    → Both codes confirmed → Donation distributed
    → Optional: choose a nonprofit to split donation with seller's choice
```

### 5.3 Nonprofit Registration Flow
```
Register as Nonprofit
    → Fill profile (name, mission, EIN, website, about, logo)
    → Upload verification documents (IRS determination letter, EIN confirmation)
    → Submit for admin review
    → Admin approves or requests more info
    → Nonprofit listed on platform
    → Eligible to receive donations
    → Optional: purchase sponsored placement
```

### 5.4 Transaction Cancellation Flow
```
Payment held
    → Meetup never happens
    → Either party initiates cancellation
        OR codes are not entered within expiry window
    → System auto-cancels after timeout
    → Payment refunded to buyer
    → Listing status reset or cancelled
```

---

## 6. Functional Requirements

### 6.1 User Account Management
- [ ] Email/password registration
- [ ] Google OAuth login
- [ ] Phone number verification (SMS)
- [ ] Profile page (name, city, bio, listing history, completed donations)
- [ ] Account settings and notification preferences
- [ ] Account deactivation / deletion (GDPR-aware)

### 6.2 Listing Management
- [ ] Create, edit, delete listings
- [ ] Upload multiple images per listing
- [ ] Set category, condition, location, description
- [ ] Choose nonprofit(s) for donation routing
- [ ] Listing status management (see Listing System section)
- [ ] Mark listing as sold / cancel listing

### 6.3 Browse & Discovery
- [ ] Browse all active listings
- [ ] Filter by city / approximate location
- [ ] Filter by category
- [ ] Filter by item condition
- [ ] Search by keyword
- [ ] View listing detail page

### 6.4 Interest & Chat
- [ ] "Express Interest" button on listings
- [ ] Private chat opens between buyer and seller
- [ ] Negotiate price and meetup details in chat
- [ ] Chat notifications (in-app + email)

### 6.5 Payment Flow
- [ ] Buyer initiates payment after price agreement
- [ ] Platform holds payment (via Stripe Connect or equivalent)
- [ ] Both parties receive unique confirmation codes
- [ ] Buyer enters code after receiving item
- [ ] Seller enters code after handoff
- [ ] Both codes confirmed → transaction completes → donation distributed
- [ ] Timeout-based auto-cancellation if codes not entered
- [ ] Refund processing on cancellation
- [ ] Dispute initiation flow

### 6.6 Nonprofit System
- [ ] Nonprofit registration and profile
- [ ] Admin verification workflow
- [ ] Public nonprofit listing page
- [ ] Donation routing to verified nonprofits
- [ ] Donation history/reporting for nonprofits (future)
- [ ] Sponsorship / promoted placement system

### 6.7 Admin Dashboard
- [ ] View and manage all listings
- [ ] Review and approve nonprofit registrations
- [ ] View all transactions and statuses
- [ ] Handle disputes
- [ ] Ban / warn / flag users
- [ ] View donation totals and platform metrics

---

## 7. Listing System

### 7.1 Listing Data Model

```
Listing {
  id: UUID
  seller_id: UUID (ref: User)
  title: string
  description: text
  category: enum
  images: string[] (URLs)
  city: string
  pickup_area: string (neighborhood or general area — NOT exact address)
  condition: enum (new, like_new, good, fair, poor)
  nonprofit_id: UUID (ref: Nonprofit)
  status: enum
  created_at: timestamp
  updated_at: timestamp
  expires_at: timestamp (optional)
}
```

### 7.2 Listing Statuses

| Status | Description |
|---|---|
| `active` | Listing is live and browsable |
| `interested` | At least one buyer has expressed interest |
| `reserved` | Seller has agreed to a specific buyer |
| `pending_meetup` | Payment made, awaiting in-person confirmation |
| `completed` | Both codes confirmed, donation sent |
| `cancelled` | Transaction cancelled, payment refunded |

### 7.3 Category List (Initial)
- Electronics
- Furniture
- Clothing & Accessories
- Books & Education
- Toys & Games
- Sports & Outdoors
- Home & Garden
- Vehicles & Parts
- Musical Instruments
- Art & Collectibles
- Other

### 7.4 Item Condition Options
- New (unused, original packaging)
- Like New (used once or twice, no visible wear)
- Good (minor wear, fully functional)
- Fair (visible wear, may have minor issues)
- Poor (significant wear — listed for parts or project use)

---

## 8. Payment & Transaction Architecture

>This is the most legally and technically complex part of the platform. Requires dedicated legal and technical research before implementation.

### 8.1 Overview

The platform must hold buyer payment temporarily and release it only upon dual confirmation. This is functionally similar to escrow but must be implemented through a licensed payment infrastructure provider to avoid money transmitter license requirements.

### 8.2 Recommended Solution: Stripe Connect

**Stripe Connect** (specifically the **Destination Charges** model) is the most viable option for MVP:

- Stripe holds the funds as a platform intermediary
- Platform is NOT classified as a money transmitter because Stripe handles the holding
- Funds can be released (paid out) to a connected Stripe account (nonprofit) on a delayed basis
- Refunds are handled natively by Stripe
- Stripe is already compliant with money transmission regulations across US states

#### Stripe Connect Account Types

| Type | Use Case |
|---|---|
| Standard | Nonprofits manage their own Stripe account |
| Express | Platform controls more of the experience |
| Custom | Full control, most complexity |

**Recommendation:** Use **Express** accounts for nonprofits in MVP. Easier onboarding, Stripe handles compliance, platform controls UX.

### 8.3 Payment State Machine

```
[initiated]
    → Buyer agrees on price in chat
    → Buyer clicks "Pay Now"

[payment_pending]
    → Payment form opens
    → Buyer enters card info

[payment_held]
    → Stripe charges buyer
    → Funds held (not yet released to nonprofit)
    → Both parties receive unique confirmation codes
    → Listing status → pending_meetup

[meetup_occurring]
    → Parties meet in person
    → Buyer receives item

[buyer_confirmed]
    → Buyer enters their code in app

[seller_confirmed]
    → Seller enters their code in app

[completed]
    → Both codes matched and confirmed
    → Stripe releases funds to nonprofit's account
    → Listing status → completed
    → Donation receipt generated (future)
    → Thank-you notification sent to both parties

[cancelled]
    → Either party initiates cancellation
    OR timeout reached (e.g., 72 hours after payment)
    → Stripe refund issued to buyer
    → Listing status → cancelled

[disputed]
    → Either party flags an issue
    → Admin review triggered
    → Payment held until resolution
    → Resolution: refund OR release
```

### 8.4 Confirmation Code System

- Two unique codes generated per transaction (one per party)
- Codes are alphanumeric, random, non-sequential
- Codes are delivered via in-app notification and optionally SMS
- **Both** codes must be submitted to complete the transaction
- Neither code alone completes the transaction
- Codes expire after a configurable window (e.g., 72 hours)
- System should detect if only one code is entered and prompt for the other

### 8.5 Refund Policy (MVP)
| Scenario | Resolution |
|---|---|
| Seller never shows | Buyer cancels → full refund |
| Buyer never shows | Seller cancels → full refund to buyer (seller keeps item) |
| Both agree to cancel | Full refund |
| Item not as described | Admin-mediated dispute |
| Both codes entered incorrectly | Transaction cancelled |
| System error | Admin override + refund |

### 8.6 Dispute Handling (MVP)
- Either party can open a dispute via the chat interface
- Dispute flags the transaction for admin review
- Payment remains held during dispute
- Admin has override capability to refund or release
- No automated dispute resolution in MVP — manual admin review only

### 8.7 Legal Notes on Payment Holding

> **Critical:** Do NOT hold funds in a company bank account without legal review. Using Stripe Connect means Stripe is the money transmitter, not you. This is the safest approach for a startup without a Money Transmitter License (MTL).

Key concerns to validate with a lawyer:
- **Money Transmitter Laws:** Varies by state. Texas has its own MTL requirements (Texas Money Services Act).
- **Charitable Solicitation Registration:** Some states require registration before soliciting charitable donations. Investigate whether the platform's model triggers this.
- **Donor-Advised Fund Model:** Could the platform function as a donor-advised fund intermediary? This has tax and legal implications.
- **Charitable Intermediary Laws:** Platform is collecting money on behalf of nonprofits. Some states regulate this even for tech platforms.

---

## 9. Nonprofit System

### 9.1 Nonprofit Profile Data Model

```
Nonprofit {
  id: UUID
  name: string
  ein: string (EIN — Employer Identification Number)
  mission: text
  about: text
  website_url: string
  logo_url: string
  category: enum (education, environment, health, animals, community, etc.)
  city: string
  state: string
  stripe_account_id: string (connected Stripe Express account)
  verification_status: enum (pending, approved, rejected, suspended)
  irs_doc_url: string (IRS determination letter)
  admin_notes: text
  is_sponsored: boolean
  sponsored_until: timestamp
  created_at: timestamp
}
```

### 9.2 Nonprofit Verification Flow

1. Nonprofit submits registration with EIN, mission, and IRS determination letter
2. Platform cross-references IRS Tax Exempt Organization database (public API available: `apps.irs.gov/app/eos/`)
3. Admin manually reviews submitted documents
4. Admin approves or requests additional information
5. Upon approval: nonprofit appears on platform and can receive donations
6. Upon approval: nonprofit completes Stripe Express onboarding to receive payouts

### 9.3 Verification Checklist
- [ ] Valid EIN (cross-referenced with IRS database)
- [ ] 501(c)(3) determination letter uploaded
- [ ] Active IRS status confirmed (not revoked)
- [ ] Website domain matches submitted organization
- [ ] Mission statement is coherent and legitimate
- [ ] No prior fraudulent activity flagged
- [ ] Admin manually approves before activation

### 9.4 Nonprofit Sponsorship System
- Nonprofits can pay for promoted visibility
- Sponsored nonprofits appear at top of browse lists, homepage, or category pages
- Sponsorship tiers (to be defined post-MVP):
  - Local spotlight (city-level)
  - Category sponsorship
  - Homepage feature

---

## 10. Messaging System

### 10.1 Requirements
- Real-time private chat between buyer and seller
- Triggered when buyer expresses interest in a listing
- Supports text messages
- Supports sharing meetup location suggestions (text-based in MVP)
- Notifications: in-app and email

### 10.2 Technical Options

| Option | Pros | Cons |
|---|---|---|
| **Supabase Realtime** | Easy integration, PostgreSQL-backed | Less scalable at extreme volume |
| **Firebase Firestore** | Battle-tested realtime | Vendor lock-in, separate from main DB |
| **WebSockets (custom)** | Full control | More infrastructure complexity |
| **Stream Chat SDK** | Production-ready, moderation tools | Cost at scale |

**Recommendation for MVP:** Supabase Realtime if using Supabase stack. Firebase if using a separate frontend-focused stack. Avoid custom WebSocket server for MVP.

### 10.3 Chat Data Model

```
Message {
  id: UUID
  chat_id: UUID
  sender_id: UUID
  content: text
  type: enum (text, system_notification)
  created_at: timestamp
  read_at: timestamp (nullable)
}

Chat {
  id: UUID
  listing_id: UUID
  buyer_id: UUID
  seller_id: UUID
  status: enum (active, archived, locked)
  created_at: timestamp
}
```

### 10.4 Chat Safety
- No external links clickable by default (prevent phishing)
- Report button within chat
- Admin can view chats in moderation context (disclosed in Terms of Service)
- Auto-lock chat after transaction completes or is cancelled

---

## 11. Authentication & Security

### 11.1 Authentication Methods (MVP)
- Email + password (hashed with bcrypt or argon2)
- Google OAuth 2.0
- Phone number verification via SMS (Twilio or equivalent)
- Government ID verification (Persona, Stripe Identity, or Jumio) — post-MVP
- Two-factor authentication (TOTP)

### 11.2 Session Management
- JWT tokens with short expiry (15–60 min) + refresh tokens
- Refresh token rotation
- Secure, HttpOnly cookies for web clients
- Token invalidation on logout / password change

### 11.3 Security Baseline
- All API endpoints require authentication except browse/search
- HTTPS enforced everywhere
- CORS configured strictly
- Rate limiting on auth endpoints (brute force protection)
- Passwords never stored in plaintext
- API keys and secrets stored in environment variables / secrets manager (not in code)

---

## 12. Non-Functional Requirements

### 12.1 Security
- All data encrypted at rest and in transit (TLS 1.2+)
- Passwords hashed with bcrypt or argon2
- HTTPS enforced (HSTS)
- CSRF protection on all state-changing endpoints
- Rate limiting on login, registration, payment endpoints
- Input validation and sanitization (prevent XSS, SQL injection)
- Secure image upload validation (MIME type, size limits, virus scanning consideration)

### 12.2 Scalability
- Stateless backend services (horizontal scaling ready)
- CDN for image delivery (Cloudflare, AWS CloudFront)
- Database connection pooling
- Object storage for images (AWS S3, Cloudflare R2, Supabase Storage)
- Pagination on all list endpoints

### 12.3 Reliability
- Payment webhooks must be idempotent (Stripe webhook deduplication)
- Webhook retry handling (Stripe retries automatically — system must handle duplicates)
- Database transactions for critical operations (payment state changes)
- Graceful error handling — no raw errors exposed to users

### 12.4 Privacy
- Exact addresses never stored or displayed publicly
- Chat messages stored but access controlled
- User data export capability (GDPR consideration)
- User deletion cascade (remove personal data on account deletion)
- Privacy policy clearly discloses data storage and chat monitoring

### 12.5 Performance
- Listing browse page loads < 2 seconds
- Image uploads < 5 seconds for standard photos
- Chat message delivery < 500ms (realtime)
- API response times < 300ms for standard queries

### 12.6 Audit Logging
- All payment state transitions logged with timestamps and actor
- Admin actions logged (who approved what, when)
- Dispute actions logged
- Failed login attempts logged
- Logs stored separately from application database

### 12.7 Payment Integrity
- Stripe webhook signature verification required
- No payment state change without corresponding Stripe event
- Idempotency keys on all Stripe API calls
- Transaction state machine enforced server-side (never client-side)

### 12.8 Fault Tolerance
- Payment webhook failures must retry (Stripe handles this, but system must be ready)
- If confirmation code submission fails, allow retry
- If chat goes down, transaction state is preserved
- Timeout-based auto-cancellation runs as a background job (not user-triggered)

---

## 13. Trust & Safety

### 13.1 Why Trust is Everything
Marketplaces don't typically fail from bad code. They fail from bad trust. A single high-profile scam or fraud incident, especially in early days, can kill user adoption permanently.

**Our structural advantage:** Sellers are not personally profiting. This fundamentally reduces seller-side financial fraud incentive. However, it does not eliminate all risk.

### 13.2 Prohibited Items Policy

The following items are strictly prohibited from listing:

- Weapons, firearms, ammunition, or accessories
- Drugs, controlled substances, or drug paraphernalia
- Alcohol or tobacco products
- Stolen or counterfeit goods
- Animals or live creatures
- Human remains or body parts
- Hazardous materials
- Adult content or sexual items
- Recalled or safety-hazardous products
- Medical devices or prescription items
- Items with fraudulent provenance claims
- Items that are clearly illegal in Texas or the United States

### 13.3 Reporting System

Users can report:

| Report Type | Target |
|---|---|
| Fake listing | Listing |
| Item not as described | Listing |
| Prohibited item | Listing |
| Scam attempt | User |
| Harassment in chat | User / Chat |
| No-show | Transaction |
| Fake nonprofit | Nonprofit |
| Stolen item | Listing / User |

All reports go to an admin queue for review. High-volume reporters are deprioritized (fraud detection). All reported items are flagged but not auto-removed in MVP.

### 13.4 Scam & Fraud Prevention

| Threat | Mitigation |
|---|---|
| Fake listings | Image review, report system, admin moderation |
| Stolen items | Policy prohibition, user reporting, law enforcement cooperation policy |
| Fake nonprofits | Strict EIN + IRS document verification, manual admin approval |
| Payment fraud | Stripe handles card fraud; platform never stores card data |
| No-shows | Dual confirmation code system; auto-refund on timeout |
| Seller keeps payment without delivering | Payment held until BOTH codes confirmed |
| Buyer enters code before receiving item | Education + UX flow warns against this |
| Fake dual confirmation | Both codes must be unique and system-generated |
| Account takeover | Strong password policy, OAuth, rate limiting on auth |

### 13.5 Reputation & Trust Signals (MVP)

- **Verified email badge**
- **Verified phone badge**
- **Completed transactions count** (visible on profile)
- **Donation total** (amount donated through the platform — social proof)
- **User rating system** — buyers and sellers rate each other after a completed transaction (included in MVP)

### 13.6 Moderation Workflow (MVP)

1. Report submitted by user
2. Report enters admin queue
3. Admin reviews (listing, chat logs, user history)
4. Admin takes action:
   - Dismiss report
   - Warn user
   - Remove listing
   - Suspend user
   - Ban user permanently
   - Escalate to law enforcement (if criminal activity suspected)

### 13.7 Terms of Service & Liability

Key provisions needed in ToS:
- Platform is not responsible for item quality or transaction disputes beyond provided tools
- Platform is not responsible for verifying item ownership (stolen goods)
- Dual-code system is a trust mechanism, not a legal guarantee
- Users agree not to list prohibited items
- Platform reserves right to suspend or ban accounts
- Platform may review chat messages for safety purposes
- Donation amounts are subject to processing timing
- Platform is not a nonprofit and donations are not tax-deductible from platform itself

> Have a licensed attorney draft or review the Terms of Service before launch.

---

## 14. Legal & Compliance

### 14.1 Charitable Solicitation Laws

Many US states require organizations to register before soliciting charitable donations. Key questions:

- Does our model constitute "solicitation" if we are routing payments from buyer to nonprofit?
- Texas registration requirements for charitable solicitation
- Multi-state implications if users in other states use the platform

**Action required:** Consult with a nonprofit/charity law attorney on whether the platform's transaction model triggers charitable solicitation registration requirements in Texas and other states.

### 14.2 Money Transmitter Licenses (MTL)

Operating as a money transmitter requires state-level licenses. By using **Stripe Connect**, we avoid holding funds ourselves — Stripe is the licensed money transmitter. This is the primary reason to use Stripe Connect rather than a raw bank-account-based escrow model.

**Do NOT:**
- Hold buyer payments in a company bank account
- Build a manual escrow without legal clearance
- Distribute funds to nonprofits from company accounts without payment processor intermediary

**DO:**
- Route all fund flows through Stripe Connect
- Ensure nonprofit payouts go directly from Stripe to nonprofit's Stripe account
- Document all fund flows for legal review

### 14.3 Donation Receipts & Tax Implications

- **Who issues the receipt?** The nonprofit — not the platform. Platform can trigger and send the receipt on behalf of the nonprofit, but the legal receipt comes from the 501(c)(3).
- **Are donations tax-deductible?** Only if the buyer can be identified as the donor. The current model (buyer pays, payment routes to nonprofit) may or may not qualify as a tax-deductible donation depending on IRS interpretation.
- **Quid pro quo rules:** If a buyer receives something of value (the item) in exchange for their "donation," the IRS has quid pro quo rules that affect deductibility.

**Action required:** Consult a tax attorney or CPA specializing in charitable giving on the donation receipt model before marketing any tax-deduction benefit.

### 14.4 Data Privacy (CCPA / GDPR Basics)

- Disclose what data is collected and why
- Allow users to request data deletion
- Do not sell user data
- Secure storage of personal data
- If serving EU users: GDPR compliance is required (start with CCPA-compatible practices as a baseline)

### 14.5 Intellectual Property

- Sellers warrant they have the right to sell listed items
- Platform disclaims liability for IP-infringing items
- DMCA takedown process should be established

---

## 15. Technical Architecture Overview

### 15.1 Recommended Stack (MVP)

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React + Next.js | SEO-friendly, good ecosystem |
| **Backend** | Node.js + Express OR Next.js API routes | JavaScript consistency |
| **Database** | PostgreSQL (via Supabase) | Relational, strong consistency for transactions |
| **Realtime / Chat** | Supabase Realtime | Built-in with Supabase stack |
| **Auth** | Supabase Auth | Google OAuth, email, phone support |
| **Payments** | Stripe Connect (Express) | Legal, reliable, widely supported |
| **Image Storage** | Supabase Storage OR Cloudflare R2 | Cost-effective, CDN-ready |
| **SMS / Phone** | Twilio | SMS verification |
| **Email** | Resend or SendGrid | Transactional emails |
| **Hosting** | Vercel (frontend) + Railway or Fly.io (backend) | Simple deployment |
| **Background Jobs** | Inngest or BullMQ | Timeout-based cancellation, webhook retries |

### 15.2 High-Level System Diagram

```
[User Browser]
      |
      v
[Next.js Frontend] ← → [Supabase Realtime (Chat)]
      |
      v
[API Layer (Next.js API / Express)]
      |
      ├── [PostgreSQL DB (Supabase)]
      ├── [Stripe Connect API]
      ├── [Supabase Storage (Images)]
      ├── [Twilio (SMS)]
      ├── [Email Provider (Resend)]
      └── [Background Job Queue (Inngest)]
            |
            └── [Stripe Webhook Handler]
```

### 15.3 Key State Transitions (Summary)

**Listing States:**
`active → interested → reserved → pending_meetup → completed / cancelled`

**Transaction States:**
`initiated → payment_pending → payment_held → meetup_pending → buyer_confirmed → seller_confirmed → completed / cancelled / disputed`

**Payment States (Stripe):**
`payment_intent_created → payment_intent_succeeded → transfer_created → payout_sent / refund_issued`

### 15.4 Database Schema (Simplified)

**Core Tables:**
- `users` (id, email, phone, name, city, verified_*, created_at)
- `listings` (id, seller_id, title, description, category, images[], city, pickup_area, condition, nonprofit_id, status, created_at)
- `nonprofits` (id, name, ein, mission, website, logo, stripe_account_id, verification_status, created_at)
- `transactions` (id, listing_id, buyer_id, seller_id, nonprofit_id, amount, status, buyer_code, seller_code, payment_intent_id, created_at)
- `chats` (id, listing_id, buyer_id, seller_id, status, created_at)
- `messages` (id, chat_id, sender_id, content, type, created_at)
- `reports` (id, reporter_id, target_type, target_id, reason, status, created_at)
- `ratings` (id, transaction_id, rater_id, ratee_id, score, comment, created_at)
- `admin_logs` (id, admin_id, action, target_type, target_id, notes, created_at)

---

## 16. MVP Scope

### In Scope (MVP)
- [ ] User registration (email + Google OAuth)
- [ ] Phone verification
- [ ] Create, edit, delete listings
- [ ] Image upload (max 5 per listing)
- [ ] Browse listings by city/location
- [ ] Filter by category and condition
- [ ] Keyword search
- [ ] Express interest in listing
- [ ] Private buyer-seller chat
- [ ] Nonprofit selection on listing creation
- [ ] Nonprofit browse page (verified only)
- [ ] Payment flow (Stripe Connect)
- [ ] Dual confirmation code system
- [ ] Auto-cancellation timeout (background job)
- [ ] Refund processing
- [ ] Basic admin dashboard (moderation, nonprofit approval)
- [ ] Report system (listings, users)
- [ ] Email notifications (interest, payment, confirmation, cancellation)
- [ ] User reputation / rating system
- [ ] Analytics dashboard for nonprofits

### Explicitly Out of Scope (MVP)
- Government ID verification
- Donation tax receipts
- AI recommendations
- Delivery or shipping options
- Bidding or auction system
- Blockchain or crypto
- Native mobile app (web-first)
- Nonprofit sponsorship payments
- Multi-currency support

---

## 17. Go-To-Market Strategy

### 17.1 Phase 0 — Before Launch
- Lock in legal structure (Texas LLC)
- Consult attorney on payment/donation compliance
- Onboard 5–10 verified local nonprofits before public launch
- Recruit 20–50 early adopter users (friends, family, community)

### 17.2 Phase 1 — Hyper-Local Launch (Months 1–3)
- Target a single community ecosystem (e.g., SMU campus, a specific Dallas neighborhood, or a local community group)
- Leverage personal and social networks
- Partner with 2–3 anchor nonprofits who will promote the platform to their existing communities
- Focus: get first 50 completed transactions

### 17.3 Phase 2 — City-Level Growth (Months 4–8)
- Expand to Dallas-Fort Worth area
- Content marketing (mission-driven social media)
- Nonprofit partnerships as distribution channel
- Target eco-conscious, Gen Z, and community-oriented users
- Press outreach to local Dallas media

### 17.4 Phase 3 — State and Multi-City (Month 9+)
- Expand to other Texas cities (Austin, Houston, San Antonio)
- Consider paid acquisition if unit economics support it
- Introduce nonprofit sponsorship revenue
- Build nonprofit self-service tools

### 17.5 Target Audience Profile (Initial)
- **Primary:** College students and young professionals (18–30) in Dallas/DFW
- **Secondary:** Eco-conscious, social-impact-minded consumers
- **Platform side:** Local nonprofits (education, environment, community services)

### 17.6 Success Metrics (MVP Phase)
| Metric | 3-Month Target |
|---|---|
| Registered users | 300+ |
| Verified nonprofits | 10+ |
| Active listings | 100+ |
| Completed transactions | 50+ |
| Total donations facilitated | $1,000+ |

---

## 18. Future Scaling Considerations

### 18.1 Product Features (Post-MVP)
- Donation receipts and tax documentation
- Government ID verification
- Promoted / sponsored listings
- Nonprofit-hosted fundraising campaigns
- Mobile app (React Native)
- Delivery option (third-party logistics integration)
- Wish list / saved listings
- Social sharing of completed donations

### 18.2 Technical Scaling
- Move to dedicated database cluster as traffic grows
- CDN for all static assets and images
- Add read replicas for browse queries
- Background job queue scaling (multiple workers)
- Fraud detection ML model (long term)
- Advanced search (Elasticsearch or Algolia)

### 18.3 Business Scaling
- Multi-state charitable solicitation registration
- Expand nonprofit verification to include Candid/GuideStar integration
- Enterprise nonprofit partnerships
- Platform transaction fee introduction (carefully, with trust-first messaging)
- International expansion (long term — significant legal complexity)

---

## 19. Research & Open Questions

> Structured research agenda: the highest-priority open questions and decisions to resolve before development begins. Legal substance lives in [Section 14](#14-legal--compliance) and payment substance in [Section 8](#8-payment--transaction-architecture); this section tracks what still needs answers and in what order, without repeating those details.

### 19.1 Biggest Questions to Answer Now

1. **"Charity marketplace" or "donation infrastructure"?**
   This distinction directly shapes the legal structure, the pitch, and the product strategy.

2. **Do we ever hold the money ourselves?**
   **Decided: No.** Route everything through Stripe Connect. Holding funds ourselves would dramatically increase legal complexity (MTL). Stripe-as-intermediary is the safer, recommended path.

3. **Who is the first target audience?**
   College students? Gen Z? Eco-conscious users? Local Dallas communities? This determines everything: marketing, tone, product priorities.

4. **What is the first launch scope?**
   One city? All of Texas? A single campus/community ecosystem? **Recommendation: start small — one city, one community.**

5. **What is the primary success metric?**
   Total donations? Active users? Completed transactions? Nonprofit count? Progress can't be measured without choosing this.

### 19.2 Core Positioning Decision (Settled)

The platform's primary user-facing promise is **social impact + sustainability** — "your stuff becomes a cause you care about" — **not** tax-deductibility.

> **Note (needs research, not yet certain):** Whether a buyer's payment can be marketed as a "tax-deductible donation" is unresolved. Under IRS quid pro quo rules, receiving an item of value in exchange likely limits or eliminates deductibility. Do **not** use tax-deduction messaging until a tax attorney/CPA confirms it (see [Section 14.3](#143-donation-receipts--tax-implications)).

### 19.3 Legal & Compliance Research (Most Critical)

The wrong legal setup can sink the entire system. Priority research items:

- **Intermediary donation platforms** — how are they structured? (e.g., PayPal Giving Fund, Benevity, Chariot)
- **Donor-advised fund (DAF) flow** — does the platform function as a DAF intermediary? Tax/legal implications.
- **Charitable solicitation laws** — which states require registration? (Texas first, then high-volume states.)
- **Money transmitter laws** — confirm Stripe Connect keeps us out of MTL scope (Texas Money Services Act and equivalents).
- **Peer-to-peer marketplace payment precedent** — how comparable platforms handle buyer→nonprofit flows.
- **Donation receipts** — who issues (nonprofit, not platform)? Quid pro quo rule; IRS Publication 1771 (charitable contribution substantiation).
- **LLC vs. nonprofit** — can a 501(c)(3) operate a marketplace? Confirms the Texas-LLC decision in [Section 3](#3-entity-structure--legal-positioning).

### 19.4 Product / UX Open Questions

**Why would a seller use this?** (They earn money on a normal marketplace — what's our incentive?)
- Social impact / mission alignment
- Decluttering without guilt
- Sustainability
- Community
- *(Tax-deductible "feeling" — only if legally cleared; see 19.2.)*

**Why would a buyer use this?** (They still pay — what's their incentive?)
- Potentially cheaper items
- Ethical purchasing
- Local community support
- Confidence from verified nonprofits

**Meetup UX**
- In-app meetup scheduler?
- Safe meetup location suggestions (coffee shops, police stations, etc.)?
- A curated public-meetup-spot list?

### 19.5 Nonprofit-Side Questions

**Why would a nonprofit join?**
- Free, passive donation stream
- Exposure to a younger audience
- Local community reach
- New donor base

**Sponsorship structure** (post-MVP) — featured placement, local campaign sponsorship, category sponsorship. See [Section 9.4](#94-nonprofit-sponsorship-system).

**Onboarding requirements** — EIN, IRS determination letter, mission, website, logo, Stripe Express connection. See [Section 9.2](#92-nonprofit-verification-flow).

### 19.6 Technical / System Design Questions

This is system design, not yet code.

- **State machines** — finalize listing, transaction, payment, and chat state machines (see Sections 7, 8, 15).
- **Event-driven needs** — consider an event-driven approach for: payment success → trigger meetup flow; webhook arrival → update transaction state; refund event → update listing + notify; both codes confirmed → trigger donation.
- **Realtime architecture** — Supabase Realtime is the MVP recommendation (see [Section 10](#10-messaging-system)).
- **Image handling** — optimization (resize/compress on upload), CDN delivery, and (future) explicit-content moderation.

### 19.7 Recommended Research & Build Order

**Phase 1 — Research (Now)**
- [ ] Charitable solicitation law research (Texas + federal)
- [ ] Stripe Connect deep-dive (destination charges, delayed payouts)
- [ ] Money transmitter laws (Texas Money Services Act)
- [ ] Competitor analysis (Sharetribe, Kindrid, OfferUp, Facebook Marketplace)
- [ ] Nonprofit-flow research (how PayPal Giving Fund works)
- [ ] Consult a nonprofit/charity attorney (1-hour consultation minimum)

**Phase 2 — Product Definition**
- [ ] User flow diagrams (Figma or similar)
- [ ] UX wireframes
- [ ] State diagrams for listing, transaction, payment
- [ ] Trust & safety policy draft
- [ ] Terms of Service draft (with attorney)

**Phase 3 — Architecture**
- [ ] Database schema design
- [ ] API endpoint design
- [ ] Payment architecture finalized
- [ ] Auth design finalized
- [ ] Background job architecture

**Phase 4 — MVP Scope Locked**
- [ ] Final feature list frozen
- [ ] "Minimum Lovable Product" defined
- [ ] Success metrics defined

**Phase 5 — Build**

### 19.8 Honest Note: Operational Complexity

The most under-considered area right now is **operational complexity.**

Running a marketplace means: moderation, disputes, refunds, fraud, support, nonprofit verification. It is not just "building an app" — it is **operating a mini ecosystem.** That is why this planning document matters: think first, then build.

---

## Decision Log

### Why Stripe Connect (Not Direct Bank Escrow)

Using Stripe Connect is not merely convenient — it is the **legally mandated approach** for a marketplace handling buyer-seller fund flows:

- **Money Transmitter License avoidance:** Stripe holds funds as a licensed intermediary; the platform never touches buyer funds directly, avoiding MTL requirements under the Texas Money Services Act and equivalent multi-state regulations.
- **Compliance by design:** Stripe handles PCI-DSS compliance, fraud monitoring, and state-level regulatory reporting. A custom escrow or direct bank-account holding would require MTL registration and create a massive compliance burden.
- **Precedent:** PayPal, Stripe, Square, and all modern payment platforms use this model specifically to avoid becoming money transmitters themselves.

**Decision:** Do NOT hold funds in a company bank account. Route all payments through Stripe Connect. This is non-negotiable from a legal standpoint.

### Entity Structure: Texas LLC (+ Optional PBC)

Texas LLC with an optional Public Benefit Corporation election. Preserves founder equity, investment ability, and revenue flexibility while signaling mission alignment — without the restrictions of a 501(c)(3). Full rationale in [Section 3](#3-entity-structure--legal-positioning).

### Core Positioning: Social Impact First

Primary promise is social impact + sustainability, not tax-deductibility (see [Section 19.2](#192-core-positioning-decision-settled)).

### Action Required (Legal — Before Launch)

| # | Item | Key Question | Jurisdictions | Urgency |
|---|---|---|---|---|
| 1 | Charitable solicitation registration | Does facilitating payments to nonprofits trigger registration? | TX (primary); CA, NY, IL (high-volume); multi-state | HIGH — gates go-to-market timeline |
| 2 | Donation receipt handling | Who issues the receipt? (Platform triggers, nonprofit issues.) IRS Pub 1771. | Federal | MEDIUM — affects nonprofit onboarding UX |
| 3 | Buyer-side tax-deductibility | Is a buyer's payment deductible given quid pro quo (item received)? | Federal | HIGH — gates buyer messaging |
| 4 | Platform 501(c)(3) status (optional) | Could [APP_NAME] itself qualify? (Decided against — LLC + PBC.) | Federal | LOW — decision already made |

---

*Document version: 0.3-alpha | Status: Planning Phase | Consolidated & translated to English | Not for public distribution*
