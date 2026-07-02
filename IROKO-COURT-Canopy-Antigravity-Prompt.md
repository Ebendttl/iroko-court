# IROKO COURT — "Canopy"
### One property. Four crafts. One trunk holding it all up.
### The complete, unified, senior-architect build prompt for Antigravity IDE

---

## 0. Before anything else: the rename, and why it matters

Your two source documents did excellent thinking but shipped it under a name — **"REOL Global Solutions Limited"** — that's generic in exactly the way that undermines everything else being proposed. You can't ask Antigravity to build a "premium, editorial, award-winning" brand experience on top of a name that reads like a shell company on a CAC registration form. The name is the first design decision, and it was skipped.

So here's the reframe, and it isn't cosmetic — it changes how the product is *named*, how the *codebase* is structured, and how the *public site's copy voice* should sound.

**New company name: `Iroko Court Limited`**

The **iroko tree** is one of West Africa's most culturally loaded symbols — a hardwood giant that can live for centuries, is treated with reverence in Yoruba and Igbo tradition, and is the literal, physical thing people mean when they say "meet me under the big tree" for markets, disputes, and gatherings. A "**court**" is simultaneously an event space, a gathering place, and — in the "food court" sense — exactly the multi-vendor-under-one-roof structure this business actually has: an event hall, an eatery, a laundry, and more units to come. The metaphor does real work: it's not decoration, it's the *organizing idea* for a business that keeps adding rooms under one address.

**Internal platform name: `Canopy`**

Everything a tree's canopy does — shelters multiple things at once, is one connected structure fed by one trunk, and visibly grows new branches over time — is exactly what this software needs to communicate. "Canopy" is short, ownable as a product name (not just "REOL's dashboard"), sounds credible on a pitch deck if this ever gets licensed to other multi-unit property owners, and gives you a clean naming convention: **Canopy Nexus** (the private ops core) and **Canopy Court** (the public storefront) — two faces, one root system, one repo.

**Brand line:** *"One Court. Every Craft. One Canopy over it all."*

Wherever the source prompts said "REOL," "REOL GLOBAL SOLUTIONS LIMITED," or "REOL Nexus," substitute **Iroko Court Limited** and **Canopy** respectively — this is threaded through the final Antigravity prompt at the bottom so you don't have to do any find-and-replace yourself.

---

## 1. The architectural thesis (unifying both source documents into one correct shape)

Your two documents independently arrived at good but *separately reasoned* conclusions — one about the private operations core, one about the public storefront — without quite stating the thing that makes them one system instead of two: **a multi-tenant-shaped property business is a tree, not a filing cabinet.** One trunk (auth, org, ledger, people), branches that can be added without disturbing the trunk (business unit modules), and leaves that the public actually sees and touches (the storefront pages, menus, packages, galleries) — all photosynthesizing back into the same trunk via one signal: `public_enquiries` and `transactions` both roll up into the same root system.

Concretely, this means:

- **One Next.js 14+ App Router codebase**, inside a **Turborepo monorepo**, with two route groups wearing completely different clothes but sharing one Supabase backend, one design token system at the CSS-variable level (even though the *values* differ per surface), and one deploy pipeline.
- **`(court)`** route group — public, unauthenticated, SEO-indexed, data-driven, fast. This is what a customer in Lagos finds on Google.
- **`(canopy)`** route group — private, role-gated, the financial and operational command center. This is what the owner and unit managers live in daily.
- Both are fed by **one unified Postgres schema** in Supabase, with RLS as the actual security boundary (not a UI convention), so a leaked public route can never expose a Naira of financial data, and a public form submission always, automatically, becomes a lead the owner can act on without a second system.

This is the single correct shape. Building these as two separate repos (as an inexperienced team might default to) means duplicating the brand tokens, duplicating the Supabase client, and drifting the two "faces" out of sync within two sprints. One repo, two faces, one trunk.

---

## 2. Brand & Business Unit Identity

| Layer | Identity |
|---|---|
| **Company (legal)** | Iroko Court Limited |
| **Public-facing brand** | Iroko Court |
| **Internal platform product name** | Canopy |
| **Private ops module** | Canopy Nexus |
| **Public storefront module** | Canopy Court |
| **Tagline** | "One Court. Every Craft. One Canopy over it all." |
| **Business Unit 1** | **The Hall** — Event Center (weddings, corporate, conferences) — accent: warm amber/gold |
| **Business Unit 2** | **The Table** — Eatery (Nigerian & continental menu) — accent: terracotta/burnt sienna |
| **Business Unit 3** | **The Press** — Laundry & dry cleaning — accent: cool slate blue |
| **Business Unit 4+ (roadmap)** | **The Yard** (car wash), **The Stay** (shortlet rooms), **The Corner** (mini-mart) — teased, not built, in MVP |
| **Unifying spine color** | Deep forest green `#0F3D2E` + charcoal `#1C1C1E` + warm gold `#C89B3C` |

Giving each business unit its own evocative one-word name ("The Hall," "The Table," "The Press") rather than the generic "Event Center / Eatery / Laundry" labels the original documents used is what turns this from a listings page into a *brand*. It also future-proofs the copy: "The Yard" and "The Stay" slot into the same naming pattern the day they launch, with zero rebranding required.

---

## 3. Monorepo & Route Architecture

```
iroko-court/                          ← Turborepo root
│
├── apps/
│   ├── web/                          ← Next.js 14+ App Router, the ONE app, TWO faces
│   │   └── app/
│   │       ├── (court)/              ← PUBLIC · unauthenticated · SEO-indexed
│   │       │   ├── page.tsx                    Homepage
│   │       │   ├── the-hall/                   Event Center
│   │       │   │   ├── page.tsx
│   │       │   │   └── [slug]/page.tsx         Individual package/hall detail
│   │       │   ├── the-table/page.tsx          Eatery
│   │       │   ├── the-press/page.tsx          Laundry
│   │       │   ├── whats-next/page.tsx         Coming-soon teaser (The Yard, The Stay, The Corner)
│   │       │   ├── about/page.tsx
│   │       │   └── contact/page.tsx
│   │       │
│   │       ├── (canopy)/             ← PRIVATE · role-gated · the operations core
│   │       │   ├── overview/page.tsx           Owner Dashboard
│   │       │   ├── record/page.tsx             Daily financial entry
│   │       │   ├── budgets/page.tsx
│   │       │   ├── leads/page.tsx               ← public_enquiries surfaces here
│   │       │   ├── modules/
│   │       │   │   ├── the-hall/                Event bookings
│   │       │   │   ├── the-table/                Eatery daily sales
│   │       │   │   └── the-press/                Laundry orders
│   │       │   ├── reports/page.tsx
│   │       │   └── admin/                        Users, roles, units, branding
│   │       │
│   │       └── (auth)/
│   │           └── login/page.tsx                Shared login, only (canopy) routes require it
│   │
│   └── mobile/                        ← Reserved for Phase 2 Expo app (empty scaffold now)
│
├── packages/
│   ├── database/                      ← Supabase types, SQL migrations, seed scripts
│   ├── ui/                            ← Shared shadcn/ui component library + design tokens
│   ├── config/                        ← Shared eslint, tsconfig, tailwind config
│   └── shared/                        ← Shared business logic, Zod schemas, types (for future Expo reuse)
│
└── turbo.json
```

**Non-negotiable rule:** `(court)` and `(canopy)` never share layout, header, or navigation components — they share only the design *token* layer (colors-as-CSS-variables, spacing scale, radii) and the Supabase client. A visitor moving from the homepage to `/overview` should hit the auth gate cleanly, with zero private content ever rendering unauthenticated, and zero public brochure-chrome leaking into the operations console.

---

## 4. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14+ App Router, TypeScript strict, mobile-first, PWA-installable | SSR for fast public pages *and* fast dashboards; one framework, two personalities |
| Backend/DB | Supabase (Postgres, Auth, Storage, Realtime, Edge Functions, `pg_cron`) | Financial reporting is relational at its core — sums, joins, group-bys across bookings/orders/ledger. RLS gives real database-layer tenant isolation, not just a UI check |
| Auth | Supabase Auth — email/password + Google OAuth, optional phone OTP for staff | Native `auth.uid()` integration with RLS |
| Data/state | TanStack Query + Supabase JS client | Caching, optimistic updates — essential for a dashboard checked daily |
| UI kit | Tailwind CSS + shadcn/ui | Fully ownable components, not a black-box library — required for a genuinely distinctive, non-templated feel |
| Charts | Tremor (dashboard KPIs) / Recharts (trend detail views) | Clean financial visualization |
| Forms | React Hook Form + Zod | Type-safe validation on every financial and public lead-capture form |
| Notifications | Web Push (service worker) for MVP; architected for OneSignal or Expo push later | Stack-agnostic, no Firebase dependency |
| Exports | `@react-pdf/renderer` (PDF), `exceljs` (Excel), native CSV | All edge/client-runnable, branded with Iroko Court's logo and palette |
| Storage | Supabase Storage, RLS-protected buckets | Logos, receipts, gallery images, menu photography |
| Hosting | Vercel (web) + Supabase Cloud (backend) | Zero-DevOps at this team size, scales without a rewrite |
| Future native app | Expo (React Native), reusing `packages/shared` and `packages/database` | Supabase + Expo is a first-class, well-trodden combination — this is *why* Supabase was chosen at MVP |

---

## 5. Unified Data Model

The core insight from your original Nexus document is exactly right and is preserved here without dilution: **every business unit is structurally the same financial object.** It has income, expenses, an operational record (booking / order / sale), and a daily close. So one ledger, fed by three thin operational modules — plus, new in this unified version, one public-facing content layer that feeds the storefront *and* writes leads straight back into that same ledger's owner-facing dashboard.

```
── CORE / TRUNK ──────────────────────────────────────────────────────
organizations            id, name, logo_url, branding_color, created_at
                          → seeded row: "Iroko Court Limited"

business_units           id, org_id, key (the_hall | the_table | the_press | custom),
                          display_name, slug, icon, color, is_active, created_at

users (profile)          id, org_id, full_name, phone, avatar_url,
                          default_business_unit_id, created_at

roles                    id, org_id, name, is_system_role
permissions              id, code, description
role_permissions         (join)
user_roles               id, user_id, role_id, business_unit_id (nullable = org-wide)

transactions              ← THE UNIFIED LEDGER, every unit posts here
                          id, org_id, business_unit_id, type (income|expense),
                          category_id, subcategory_id, amount, currency, description,
                          transaction_date, recorded_by, source (manual|booking|order|sale),
                          source_ref_id, attachment_url, created_at, updated_at

categories / subcategories
budgets / budget_line_items
daily_summaries           materialized per-unit-per-day rollup for sub-second dashboard loads
audit_logs                every financial mutation: actor, before/after diff, timestamp
notification_preferences / device_tokens

── BRANCH: THE HALL (Event Center) ───────────────────────────────────
event_bookings            client_name, client_contact, event_date, package_type, hall_name,
                          deposit_amount, total_quoted, status (inquiry→confirmed→completed→cancelled)
event_packages            name, hall_name, capacity, price_from, inclusions (jsonb), image_url
event_terms               deposit policy, cancellation policy, inclusions/exclusions, damage policy

── BRANCH: THE TABLE (Eatery) ─────────────────────────────────────────
menu_items                name, description, price, category, image_url,
                          dietary_tags (jsonb), is_featured, display_order
eatery_daily_sales        sale_date, total_covers, total_revenue, recorded_by

── BRANCH: THE PRESS (Laundry) ────────────────────────────────────────
laundry_orders            customer_name, customer_contact, items_description,
                          drop_off_date, pickup_date, status (received→in_progress→ready→collected),
                          amount_charged
laundry_services           name, description, turnaround_time, price_from, display_order

── LEAVES: PUBLIC STOREFRONT CONTENT (Canopy Court) ───────────────────
public_services            generic featured-offering rows, any unit
testimonials                author_name, content, rating, image_url, business_unit_id (nullable)
gallery_images              image_url, caption, business_unit_id, display_order
deals_promotions            title, discount_label, valid_from, valid_until, is_active
coming_soon_units            name (The Yard | The Stay | The Corner), description, icon,
                              expected_launch_label, notify_email_capture

public_enquiries            ← THE BRIDGE BETWEEN LEAVES AND TRUNK
                            id, business_unit_id (nullable), type (event_enquiry|laundry_pickup|
                            eatery_order|contact|notify_me), full_name, phone, email, message,
                            metadata (jsonb), status (new|contacted|converted|closed), created_at
                            → surfaces live inside (canopy)/leads as an actionable queue
```

**RLS posture (database-layer, not UI-layer):**
- `public_services`, `event_packages`, `event_terms`, `menu_items`, `laundry_services`, `testimonials`, `gallery_images`, `coming_soon_units`, `deals_promotions` → anonymous `SELECT` allowed on `is_active = true` rows only; `INSERT`/`UPDATE`/`DELETE` restricted to authenticated Admin or the relevant Unit Manager.
- `public_enquiries` → anonymous `INSERT` allowed (that's the whole point — a stranger can submit a form); `SELECT`/`UPDATE` restricted to authenticated Admin/Owner and the relevant Unit Manager.
- `transactions`, `budgets`, `audit_logs`, and every financial table → zero anonymous access whatsoever; Unit Managers see only rows matching a `business_unit_id` they're assigned via `user_roles`, unless granted `view_all_units`.

**Automatic ledger posting:** marking an `event_bookings` row "completed and paid," or a `laundry_orders` row "collected and paid," fires a Postgres trigger (or Edge Function) that writes the matching `transactions` row automatically — managers never double-enter a Naira.

---

## 6. Design System — the actual differentiator

This is where "way more stunning" has to be earned, not asserted. Specifics, not adjectives:

**Typography**
- Display/headline: **Fraunces** (or Canela/Freight Display if licensed) — a warm, slightly editorial serif with real personality, used large and confident on hero sections and section headers.
- Body/UI: **Inter** or **General Sans** — clean, highly legible, used at 16px+ base on mobile, never below WCAG AA contrast against any background.
- Numerals in the Canopy dashboard: tabular figures (`font-variant-numeric: tabular-nums`) so financial totals never jitter as digits change.

**Color tokens** (CSS variables, shared root, different emphasis per surface)
```
--iroko-forest:   #0F3D2E   /* primary spine, dashboard chrome, dark sections */
--iroko-charcoal: #1C1C1E   /* text, dark surfaces */
--iroko-gold:     #C89B3C   /* profit figures, primary CTAs, The Hall accent */
--iroko-terracotta: #B85C38 /* The Table accent */
--iroko-slate:    #4A6FA5   /* The Press accent */
--iroko-cream:    #FAF6EE   /* warm off-white background, public site */
--iroko-mist:     #F4F6F5   /* cool off-white background, Canopy dashboard */
```

**Motion**
- Scroll-reveal on section entry: 400ms, ease-out, 12px translate — restrained, not bouncy.
- Card hover: subtle image scale (1.0 → 1.04) + shadow lift, 250ms.
- Header: transparent-over-hero → solid-on-scroll transition, 200ms opacity/backdrop-blur crossfade.
- Dashboard KPI numbers: count-up animation on load (600ms, ease-out) — makes checking the daily numbers feel satisfying, per the original brief's instinct, executed precisely rather than left vague.
- Nothing loops indefinitely, nothing autoplays with sound, nothing blocks interaction while animating.

**Spacing & layout**
- 8px base spacing scale throughout both surfaces (`4, 8, 12, 16, 24, 32, 48, 64, 96`).
- Public site: generous, editorial whitespace, full-bleed photography sections up to 100vh on hero.
- Canopy dashboard: denser, card-based KPI grid with subtle elevation (`shadow-sm` → `shadow-md` on hover), information-dense but never cluttered — this is fintech-grade software, not a marketing page pretending to be a dashboard.

**Photography direction**
Large, warm, full-bleed imagery of The Hall in actual use (lit, decorated, full of people — never sterile stock photography); mouth-watering close-up food photography for The Table in a clean grid with warm earthy tones; crisp, almost clinical-clean imagery for The Press — folded linens, clear turnaround badges — communicating trust and speed. Use tasteful, realistic placeholder imagery where real photography isn't yet available; never generic corporate stock.

**Mobile-first non-negotiables**
A persistent, thumb-reachable primary CTA on every public page (varies: "Enquire Now" on The Hall, "View Menu / Order via WhatsApp" on The Table, "Schedule Pickup" on The Press); a floating WhatsApp button site-wide (the dominant, expected contact pattern in the Nigerian market); Lighthouse mobile performance target of 90+; `next/image` throughout with lazy-loading below the fold.

---

## 7. Page-by-Page Requirements (Canopy Court — public)

**Homepage** — Full-bleed hero (single striking image or short looping video of the property) with a one-line brand promise + primary CTA. A "**Four Crafts, One Court**" section: large visual cards for The Hall / The Table / The Press (plus a visually distinct fourth "coming soon" card), each with its own accent color and one-line hook. Testimonials carousel. "What's Next at Iroko Court" teaser strip near the footer. Footer with embedded map, phone, WhatsApp, social links, per-unit opening hours.

**The Hall** (`/the-hall`) — Hero imagery of the hall in full, decorated use. Hall/space-type cards (capacity, ideal use case) and package tiers (inclusions, starting price or "Request a Quote") pulled live from `event_packages`. An accordion-style Terms & Conditions section (deposit, cancellation, inclusions/exclusions, damage policy) pulled from `event_terms`. A gallery grid. An enquiry form (event date, event type, estimated guests, contact) writing to `public_enquiries` with `type='event_enquiry'`. Optional `/the-hall/[slug]` detail page per package.

**The Table** (`/the-table`) — Hero with signature-dish photography. Menu grid by category (Starters, Mains, Drinks, Desserts, Specials) pulled from `menu_items` with name, description, price in Naira, dietary/spice tags. A "Today's Special" highlight block. WhatsApp/phone order-ahead CTA for MVP, with a clear placeholder path to full online ordering later.

**The Press** (`/the-press`) — Hero communicating speed and trust. Service pricing tiers (Wash & Fold, Dry Cleaning, Express/Same-Day, Bulk/Corporate) pulled from `laundry_services` with turnaround-time badges. A simple 3-step "Drop off → We clean → Pick up or Deliver" iconography section. Active deals block from `deals_promotions`. A pickup/delivery request form writing to `public_enquiries` with `type='laundry_pickup'`.

**What's Next** (`/whats-next`) — Visually exciting cards for The Yard, The Stay, The Corner, pulled from `coming_soon_units`, each with a "Notify Me" email capture writing to `public_enquiries` with `type='notify_me'` — expansion framed as anticipation-building marketing, not an apology for what's missing yet.

**About** (`/about`) — The Iroko Court story: the building, the "one trunk, many branches" philosophy, made concrete rather than left as metaphor.

**Contact** (`/contact`) — Embedded map, click-to-call, click-to-WhatsApp, a general enquiry form (`type='contact'`), and opening hours per business unit (since The Hall / The Table / The Press may keep different hours).

---

## 8. Page-by-Page Requirements (Canopy Nexus — private)

**Auth & onboarding** — Email/password + Google OAuth via Supabase Auth. Onboarding flow creates the `organizations` row for Iroko Court Limited, seeds The Hall / The Table / The Press as `business_units`, and creates the first Admin/Owner user.

**Owner Dashboard (`/overview`)** — The centerpiece screen: today's org-wide totals (income, expense, net profit) readable in under 10 seconds on a phone; a per-business-unit breakdown grid; percentage change vs. previous day; key KPIs (profit margin, ROI); count-up number animation on load.

**Daily entry (`/record`)** — Fast, mobile-friendly per-unit form for income/expense with category/subcategory, optional receipt photo upload, Zod validation preventing negative or garbage amounts.

**Leads (`/leads`)** — Every `public_enquiries` submission surfaced as an actionable queue with a status pipeline (new → contacted → converted → closed), filterable by business unit and type — this is the literal seam where the public storefront becomes real business, not a brochure.

**Budgets (`/budgets`)** — Per-unit budgets with category line items; real-time actual-vs-budget with absolute and percentage variance; automatic in-app + push alert at 80% budget threshold; mid-cycle revisions with visible history.

**Modules (`/modules/the-hall`, `/the-table`, `/the-press`)** — Bookings calendar with status pipeline; eatery daily sales quick-entry; laundry orders with status pipeline — each auto-posting to `transactions` on completion.

**Reports (`/reports`)** — Custom date-range picker, line/bar charts (zoom, tooltips), filterable by unit and category, year-over-year comparison, CSV/PDF/Excel export branded with the Iroko Court logo.

**Admin (`/admin`)** — CRUD for business units, categories, users, roles/permissions, organization branding (logo upload, palette).

**Audit log (`/admin/audit`)** — Searchable, filterable log of every financial mutation, Admin-only.

---

## 9. Roles & Permissions (seed these)

| Role | Scope |
|---|---|
| **Owner/Admin** | Full org access, all units, all financial data, user & role management |
| **Unit Manager** | Scoped to their assigned business unit(s) only, unless granted `view_all_units`; records income/expense/bookings/orders, views own reports/budgets |
| **Finance Viewer** | Read-only across permitted units, never writes financial data |
| **Report Generator** | View + export, no edit rights |
| **Staff** (Phase 2) | Minimal data-entry only — "record a sale," "record a booking" — no financial visibility |

Granular permissions to seed: `view_financial_data`, `manage_financial_data`, `export_reports`, `manage_users`, `manage_business_units`, `set_budgets`, `approve_expenses`, `view_all_units`.

---

## 10. Non-Functional Requirements

- **SEO** (public surface only): per-page metadata, Open Graph images, `sitemap.xml`, `robots.txt`, semantic HTML, accessible alt text throughout.
- **Performance**: Lighthouse 90+ mobile on the public surface; dashboard initial load under ~1.5s on 4G via the `daily_summaries` cache table rather than aggregating raw `transactions` on every load.
- **Accessibility**: proper heading hierarchy, sufficient contrast even with accent colors layered on the spine palette, fully keyboard-navigable forms and menus on both surfaces.
- **Security**: RLS on every table without exception, encrypted-at-rest via Supabase defaults, sane password policy, optional MFA for Admin/Owner, no financial data ever reachable via an unauthenticated route, signed/expiring URLs for exported files.
- **Compliance**: Nigeria's NDPR (Nigeria Data Protection Act/Regulation) — the actually-relevant regime here, not GDPR boilerplate — informing data retention and consent handling.
- **PWA**: installable manifest + service worker + offline-friendly shell on both surfaces, as a stand-in for a native app until the Expo build exists.
- **Code quality**: TypeScript strict throughout, ESLint + Prettier, feature-based folder structure (not a flat "components" dumping ground), unit tests for ledger-posting logic and RLS-sensitive queries, a README with setup steps, environment variables, and a schema ERD.
- **Extensibility**: every module (`event_bookings`, `eatery_daily_sales`, `laundry_orders`) built behind a consistent internal interface so The Yard, The Stay, or The Corner can be added primarily via configuration and a new module folder — not a rewrite of the shared dashboard, ledger, or notification logic.

---

## 11. GitHub Repository

**Repository name:**
```
iroko-court
```

**Full path:**
```
github.com/<your-username>/iroko-court
```

**Creation command (once you've decided on `<your-username>` or an org):**
```bash
gh repo create <your-username>/iroko-court \
  --public \
  --description "Iroko Court — Canopy: one property, four crafts, one unified operations & storefront platform (Next.js + Supabase)" \
  --clone
```

**Suggested internal package scope, if you ever publish shared packages:** `@iroko-court/*`

Why `iroko-court` and not `canopy` alone: the repo should name the *business*, not the internal product codename — this mirrors how you'd never name a company's main repo after their internal tool's nickname. "Canopy" stays the product/module name inside the README and the UI; "iroko-court" is what shows up in the URL, in `git clone`, and on your resume in five years.

---

## 12. THE ANTIGRAVITY IDE PROMPT
### (copy everything inside the fenced block below, paste it into Antigravity as the build instruction)

```
You are acting as a senior full-stack engineer and product architect with 30+ years of experience.
Build "Canopy" — the unified operations-and-storefront platform for IROKO COURT LIMITED, a Nigerian
company operating multiple business units inside one property: an event hall ("The Hall"), a
restaurant ("The Table"), and a laundry service ("The Press") — with the schema and codebase
architected so additional units (a car wash "The Yard," shortlet rooms "The Stay," a mini-mart
"The Corner") can be added later purely via configuration, never a rewrite.

GOAL: Ship ONE Next.js codebase with TWO completely distinct experiences sharing one Supabase
backend and one design-token system:
  1. Canopy Court — a public, unauthenticated, SEO-indexed, award-winning marketing storefront
     that makes a first-time visitor in Lagos immediately understand and want to book The Hall,
     order from The Table, or schedule a pickup with The Press.
  2. Canopy Nexus — a private, role-gated operations and financial command center giving the
     owner one daily, trustworthy answer: "did we make money today, across everything, and where
     did it leak?" — while letting each unit's manager record their own scoped data securely.

=== BRAND ===
Company (legal): Iroko Court Limited. Public brand: Iroko Court. Platform name: Canopy.
Tagline: "One Court. Every Craft. One Canopy over it all."
Business units and their public-facing names: The Hall (event center, accent #C89B3C warm gold),
The Table (eatery, accent #B85C38 terracotta), The Press (laundry, accent #4A6FA5 slate blue) —
all layered on a shared spine identity of deep forest green (#0F3D2E), charcoal (#1C1C1E), and
warm gold, on a warm cream background (#FAF6EE) for the public surface and a cooler off-white
(#F4F6F5) for the dashboard surface. Do not use generic SaaS-blue. This must read as premium,
editorial, and distinctly West African-hospitality in tone — not a templated admin panel wearing
a green skin.

=== ARCHITECTURE ===
Turborepo monorepo. apps/web is the one Next.js 14+ App Router application (TypeScript strict,
mobile-first, PWA-installable) containing:
- A `(court)` route group: `/`, `/the-hall`, `/the-hall/[slug]`, `/the-table`, `/the-press`,
  `/whats-next`, `/about`, `/contact`. No auth. Full SEO (metadata, Open Graph, sitemap.xml,
  robots.txt). Its own distinct marketing layout, header, and footer — never shared with the
  dashboard.
- A `(canopy)` route group: `/overview`, `/record`, `/leads`, `/budgets`, `/modules/the-hall`,
  `/modules/the-table`, `/modules/the-press`, `/reports`, `/admin`, `/admin/audit`. Fully
  role-gated via Supabase Auth + RLS.
- A shared `(auth)` group with `/login` — only `(canopy)` routes require it.
Reserve apps/mobile (empty scaffold) for a future Expo app. packages/database holds Supabase
migrations and generated types. packages/ui holds shared shadcn/ui components and the shared
design-token CSS variables (the ONLY thing the two route groups share visually). packages/config
holds shared eslint/tsconfig/tailwind config. packages/shared holds Zod schemas and business
logic reusable by the future Expo app.

=== DATA MODEL ===
Implement as versioned Supabase SQL migrations, with RLS enforced at the database level on every
table without exception:
- Trunk: organizations (seed: "Iroko Court Limited"); business_units (key: the_hall | the_table |
  the_press | custom — configurable, never a hardcoded application-level enum); user profiles
  linked to Supabase auth; roles, permissions, role_permissions, and user_roles (a role assignment
  can be scoped to one business_unit_id or be org-wide); a single unified `transactions` ledger
  (income/expense, category, subcategory, amount, business_unit_id, recorded_by, source,
  source_ref_id) as the sole source of truth for every Naira in the system; categories and
  subcategories; budgets and budget_line_items with variance tracking; daily_summaries as a
  materialized per-unit-per-day rollup for fast dashboard loads; audit_logs capturing every
  financial mutation with actor and before/after diff; notification_preferences and device_tokens
  (the latter ready for future Expo push).
- Branch (The Hall): event_bookings (client, date, hall, package, deposit, status: inquiry →
  confirmed → completed → cancelled), event_packages, event_terms.
- Branch (The Table): menu_items (extended with description, image_url, dietary_tags jsonb,
  is_featured, display_order), eatery_daily_sales.
- Branch (The Press): laundry_orders (customer, items, drop-off/pickup dates, status: received →
  in_progress → ready → collected, amount_charged), laundry_services.
- Leaves (public storefront content, editable later from an admin CMS screen without code
  changes): public_services, testimonials, gallery_images, deals_promotions, coming_soon_units
  (seed with The Yard, The Stay, The Corner).
- The bridge: public_enquiries — captures every public form submission (event_enquiry,
  laundry_pickup, eatery_order, contact, notify_me) with a status pipeline (new → contacted →
  converted → closed), surfaced live inside (canopy)/leads.
Write a Postgres trigger (or Edge Function) so that marking an event_booking "completed and paid"
or a laundry_order "collected and paid" automatically creates the corresponding `transactions`
row — managers never double-enter data.

RLS rules: anonymous SELECT allowed only on is_active/published rows of the public content tables
listed above; anonymous INSERT allowed ONLY on public_enquiries; every financial table
(transactions, budgets, audit_logs, and all module operational tables) has zero anonymous access
and is scoped so a Unit Manager's queries can only ever return rows for business_unit_id values
they are assigned to via user_roles, unless their role includes view_all_units. Admins/Owners see
everything in the organization. Finance Viewer roles can read but never write financial data.

=== ROLES (seed these) ===
Owner/Admin (full access), Unit Manager (scoped to assigned unit(s)), Finance Viewer (read-only,
permitted units), Report Generator (view + export, no edit), Staff (Phase 2 — data entry only, no
financial visibility). Seed permissions: view_financial_data, manage_financial_data,
export_reports, manage_users, manage_business_units, set_budgets, approve_expenses,
view_all_units.

=== TECH STACK ===
Next.js 14+ App Router, TypeScript strict; Supabase (Postgres, Auth, RLS, Storage, Realtime, Edge
Functions, pg_cron); Tailwind CSS + shadcn/ui; TanStack Query + Supabase JS client; React Hook
Form + Zod on every form on both surfaces; Tremor/Recharts for KPI cards and trend charts; Web
Push (service worker) for the MVP daily digest, architected so Expo push can be added later
without rewriting the trigger logic; @react-pdf/renderer + exceljs + native CSV for branded
exports; Vercel + Supabase Cloud hosting.

=== CANOPY COURT (PUBLIC) — PAGES & CONTENT ===
1. Homepage: full-bleed hero (brand promise + primary CTA); a "Four Crafts, One Court" section
   with large distinct cards for The Hall / The Table / The Press plus a "coming soon" fourth
   card; testimonials carousel; a "What's Next at Iroko Court" teaser strip; footer with map,
   phone, WhatsApp, social links, per-unit opening hours.
2. The Hall (`/the-hall`): hero imagery; hall/space cards (capacity, ideal use) and package tiers
   from event_packages (inclusions, starting price or "Request a Quote"); accordion-style Terms &
   Conditions from event_terms (deposit, cancellation, inclusions/exclusions, damage policy);
   gallery grid; enquiry form (event date, type, guest count, contact) writing to
   public_enquiries with type='event_enquiry'. Optional `/the-hall/[slug]` detail page.
3. The Table (`/the-table`): hero with signature-dish photography; menu grid by category from
   menu_items (name, description, price in Naira, dietary/spice tags); "Today's Special"
   highlight block; WhatsApp/phone order-ahead CTA for MVP.
4. The Press (`/the-press`): hero communicating speed/trust; service pricing tiers from
   laundry_services with turnaround-time badges; 3-step "Drop off → We clean → Pick up/Deliver"
   iconography; active deals from deals_promotions; pickup/delivery form writing to
   public_enquiries with type='laundry_pickup'.
5. What's Next (`/whats-next`): cards for The Yard, The Stay, The Corner from coming_soon_units,
   each with a "Notify Me" email-capture form writing to public_enquiries with type='notify_me' —
   frame growth as anticipation, not apology.
6. About (`/about`): the Iroko Court story, the building, the "one trunk, many branches"
   philosophy made concrete.
7. Contact (`/contact`): embedded map, click-to-call, click-to-WhatsApp, general enquiry form
   (type='contact'), per-unit opening hours.

=== DESIGN DIRECTION FOR CANOPY COURT (this is the differentiator — take it seriously) ===
Reference the FEEL, never the literal layout, of: premium Nigerian/African hospitality sites
(warm, photography-led event energy) for The Hall; clean, appetite-driving food-delivery menu
grids for The Table; crisp, trustworthy, transparent-pricing laundry-app patterns for The Press.
Typography: a confident display serif (Fraunces or equivalent) for headlines, paired with a clean
modern sans-serif (Inter or General Sans) for body copy — editorial, not generic-SaaS. Imagery:
large, full-bleed, realistic (tasteful placeholders where real photography is unavailable) —
halls in full use, food close-ups, clean-linen visuals — never sterile stock photography. Motion:
subtle scroll-reveal on section entry (~400ms ease-out), smooth card hover (image scale + shadow
lift), a header transitioning from transparent-over-hero to solid-on-scroll, restrained
micro-interactions on CTAs — polish without gimmickry. Mobile-first: a persistent thumb-reachable
primary CTA per page (varies by unit), a floating site-wide WhatsApp button (the dominant contact
pattern in this market), Lighthouse mobile score 90+, next/image throughout, lazy-loaded
below-the-fold sections.

=== CANOPY NEXUS (PRIVATE) — FEATURES, IN BUILD ORDER ===
1. Auth (email/password + Google OAuth) with an onboarding flow that creates the organization
   (Iroko Court Limited), seeds The Hall / The Table / The Press as business_units, and creates
   the first Admin/Owner user.
2. Admin console: CRUD for business units, categories/subcategories, users, roles and
   role-permission assignments; branding settings (logo upload to Supabase Storage, palette).
3. Daily financial entry: fast, mobile-friendly per-unit form for income/expense with
   category/subcategory, optional receipt photo upload, Zod validation against negative/garbage
   amounts.
4. Owner Dashboard (`/overview`, the centerpiece screen): today's org-wide totals (income,
   expense, net profit) readable in under 10 seconds on a phone; per-unit breakdown grid;
   percentage change vs. previous day; profit margin and ROI KPIs; count-up number animation on
   load.
5. Historical & trend view: custom date-range picker, line/bar charts with zoom and tooltips,
   filterable by unit and category, year-over-year comparison.
6. Budgets: per-unit budgets with category line items; real-time actual-vs-budget variance
   (absolute + percentage); automatic in-app + push alert at 80% budget threshold; mid-cycle
   revisions with visible history.
7. The Hall module: bookings table/calendar with status pipeline (inquiry → confirmed →
   completed/cancelled); marking "completed and paid" auto-posts to transactions.
8. The Table module: daily sales quick-entry posting to the ledger.
9. The Press module: orders with status pipeline (received → in_progress → ready → collected);
   marking "collected and paid" auto-posts to the ledger.
10. Leads (`/leads`): every public_enquiries row surfaced as an actionable queue with status
    pipeline (new → contacted → converted → closed), filterable by unit and enquiry type.
11. Notifications: a Supabase Edge Function on a cron schedule computing the daily summary per
    organization and sending a Web Push notification (optionally email via Resend) based on
    notification_preferences; tapping it deep-links into the relevant dashboard view.
12. Exports: CSV, branded PDF, and Excel export of any report view, filterable by unit and
    category, including the Iroko Court logo and palette.
13. Audit log viewer (Admin only): searchable, filterable log of every financial mutation.

=== NON-FUNCTIONAL REQUIREMENTS ===
Mobile-first responsive at every breakpoint on both surfaces, genuinely pleasant one-handed on a
mid-range Android phone. Installable as a PWA (manifest, service worker, offline-friendly shell).
Dashboard initial load under ~1.5s on 4G via the daily_summaries cache table, never aggregating
raw transactions on every load. Public surface: Lighthouse mobile performance 90+, full SEO
metadata, sitemap.xml, robots.txt, semantic HTML, accessible alt text throughout. RLS on every
table with no exceptions, encrypted-at-rest via Supabase defaults, sane password policy, optional
MFA for Admin/Owner, no financial data ever reachable via an unauthenticated route, signed/
expiring URLs for exported files. Design with Nigeria's NDPR (not GDPR boilerplate) in mind for
data retention and consent. TypeScript strict, ESLint + Prettier, feature-based folder structure,
unit tests for ledger-posting logic and RLS-sensitive queries, a README documenting setup,
environment variables, and the schema ERD. Architect every module (event_bookings,
eatery_daily_sales, laundry_orders, and every public content table) behind a consistent internal
interface so a future business unit (The Yard, The Stay, The Corner) can be added primarily
through configuration and a new module folder, never a rewrite of shared ledger, dashboard, or
notification logic.

=== GITHUB REPOSITORY ===
Repository name: iroko-court
Full path: github.com/<your-username>/iroko-court
Description: "Iroko Court — Canopy: one property, four crafts, one unified operations & storefront
platform (Next.js + Supabase)."
Suggested internal package scope if publishing shared packages later: @iroko-court/*

=== DELIVERABLE FOR THIS SESSION ===
First scaffold the Turborepo (apps/web, packages/database, packages/ui, packages/config,
packages/shared), initialize the Next.js app with the stack above, and write the full unified
Supabase schema (trunk + all three branches + all leaf/public tables + public_enquiries) as
versioned SQL migrations with RLS policies. Seed the organization, the three business units,
roles/permissions, and a handful of realistic placeholder rows for event_packages, menu_items,
laundry_services, testimonials, and coming_soon_units so both surfaces have real-looking content
to render against from day one. Then build, in this order: the shared design-token layer in
packages/ui; the (canopy) Auth flow and Owner Dashboard end-to-end and working; then the (court)
marketing layout (header/footer/WhatsApp button) plus the Homepage and The Hall page end-to-end
and working. Confirm the schema and the visual direction of both the dashboard and the homepage
with me before proceeding to Budgets, the remaining Canopy modules, and the remaining Canopy
Court pages (The Table, The Press, What's Next, About, Contact) in that priority order.
```

---

## 13. A few calls worth flagging, stated plainly

- **The rename is doing real work, not just branding polish.** "Iroko Court" gives you a naming pattern (The Hall, The Table, The Press, and the future The Yard/The Stay/The Corner) that both source documents lacked — they were calling the units by their generic category names, which is fine for a database enum but flat for a brand a customer is supposed to fall in love with.
- **One repo, two route groups, one Supabase backend — confirmed correct** from your original Nexus document's reasoning, and now made explicit as the unifying thesis of this entire document rather than something the public-site prompt had to re-derive independently.
- **`public_enquiries` remains the quiet hero.** Without it, Canopy Court is a brochure. With it, every WhatsApp-avoiding visitor who fills out a form becomes a tracked lead the owner sees inside the same dashboard he checks daily — the actual seam between marketing and operations.
- **Firebase → Supabase, unchanged from your original reasoning:** financial reporting lives and dies on relational queries (sum by category, join bookings to ledger, group by date range) — Postgres + RLS is the correct tool for money, and Firestore would fight you on every report.
- **NDPR, not GDPR:** since Iroko Court operates in Nigeria, the Nigeria Data Protection Act/Regulation is the actually-relevant compliance regime — this is threaded into the final prompt above so it doesn't get silently dropped during implementation.
