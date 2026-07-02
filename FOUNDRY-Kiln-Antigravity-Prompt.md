# FOUNDRY — "Kiln"
### A completely different business, on completely different visual terms
### The senior-architect build prompt for Antigravity IDE — v2, engineered to look nothing like Iroko Court

---

## 0. What actually went wrong last time, stated plainly

Looking at your screenshots honestly: Iroko Court and REOL Nexus are the same site wearing two different name tags. Same forest-green-and-gold palette, same warm serif headline over a dark hero, same rounded-corner soft-shadow cards, same centered hero-with-pill-badge layout, same "three services as three cards" homepage grammar. Renaming REOL → Iroko Court and Event Center → The Hall changed the *words*. It didn't change a single *design decision*. That's on the brief I gave Antigravity, not on the execution — I told it to be "premium and editorial," which is one aesthetic lane, and it stayed in that lane no matter what name was on the door.

So this time the fix is two-layered, and both layers matter on their own:

1. **The services themselves have to be structurally different businesses**, not three re-skinned service categories. Booking a photo studio by the hour, ordering custom-printed merch by the unit with a bulk-discount calculator, and managing a recurring coffee-bag subscription are three *functionally* different transaction types — different forms, different pricing logic, different data shapes. If the underlying business logic is different, the pages can't help but look and behave differently, because they're not lorem-ipsum reskins of the same three form patterns.
2. **The design system has to be built in deliberate opposition to Iroko Court's**, decision by decision, not just "different colors." Below is a literal old-vs-new contrast table I'm handing straight to Antigravity so there's no ambiguity about what "different" means here.

---

## 1. The new business: FOUNDRY

**Concept:** A creative-economy production floor in Lagos — a place where independent creators, small brands, and businesses come to *make* things: record a podcast, print a run of merch, or get their coffee sourced and roasted properly. Three functionally distinct units under one roof, none of them hospitality, none of them a service you "enquire" about in the same soft way — these are things people *book*, *order*, and *subscribe to*.

| Layer | Identity |
|---|---|
| **Company (legal)** | Foundry Collective Limited |
| **Public-facing brand** | Foundry |
| **Internal platform product name** | Kiln |
| **Private ops module** | Kiln Ops |
| **Public storefront module** | Kiln Floor |
| **Tagline** | "Raw talent. Real output. One floor." |
| **Business Unit 1** | **The Booth** — podcast, music, and photo/video studio rentals — accent: electric violet |
| **Business Unit 2** | **The Line** — custom print & merch production (apparel, stickers, business cards, posters) — accent: ink red |
| **Business Unit 3** | **The Roast** — specialty coffee roastery, café bar, and subscription bags — accent: caramel/espresso |
| **Business Unit 4+ (roadmap)** | **The Deck** (skate/BMX park), **The Crate** (vinyl & record shop), **The Bay** (bike repair co-op) — teased under "Maker's Row" |
| **Unifying spine color** | Off-black `#121212` + raw concrete `#EDEBE6` + signal orange `#FF4B12` |

The metaphor is the foundry itself: raw material goes in (an idea, a voice, a bean, a blank shirt), heat and craft are applied, a finished product comes out. "Kiln" is the internal engine name — the thing that does the transforming — which gives you the same clean naming split as before (**Kiln Ops** for the private financial/operations core, **Kiln Floor** for the public storefront) without borrowing a single word, color, or metaphor from Iroko Court.

---

## 2. Design System — built as the deliberate opposite of Iroko Court

This table goes straight into the Antigravity prompt below, verbatim, because the fastest way to guarantee two genuinely different-looking products is to name the previous decisions and reverse them on purpose.

| Design decision | Iroko Court (v1) | Foundry (v2) |
|---|---|---|
| **Base palette** | Warm cream `#FAF6EE` + forest green `#0F3D2E` + gold `#C89B3C` | Raw concrete `#EDEBE6` + off-black `#121212` + signal orange `#FF4B12` |
| **Display typeface** | Fraunces — warm, editorial serif | Space Grotesk — bold, geometric grotesk sans, all-caps for major headlines |
| **Body typeface** | Inter / General Sans | IBM Plex Sans, with IBM Plex Mono for every price, timestamp, and label ("ticket-stub" typography) |
| **Corners** | Soft, generously rounded (12–24px radii) | Hard, mostly square (0–4px radii) — this reads industrial, not soft |
| **Shadows** | Soft, diffuse elevation shadows | Hard offset shadows (like a stamped ticket or sticker — a flat 4px black offset, no blur) or a solid 2px border instead of a shadow at all |
| **Card borders** | None, elevation does the work | Visible 1–2px solid borders on nearly everything |
| **Hero layout** | Centered text over full-bleed photography, pill-shaped eyebrow badge | Asymmetric split hero (large type left, real photo/texture right, or a diagonal-cut image), rectangular tag/badge with a cut corner, not a pill |
| **Homepage unit-cards section** | Three centered, evenly-sized cards | An offset, staggered grid — cards at slightly different vertical positions, not perfectly aligned, like items laid out on a workbench |
| **Photography treatment** | Warm, full-color, lifestyle-lit | High-contrast duotone or halftone-processed images (think screen-print texture) — color arrives only through the accent, not the photo |
| **Motion** | Gentle scroll-reveal fades, smooth ease-out | Hard-cut slide-ins (150ms linear, no easing bounce), a marquee/ticker strip scrolling site activity ("NOW BOOKING · FRESH ROAST DROPS FRIDAY · NEW PRINT RUN OPEN"), brief glitch/RGB-split flicker on interactive hover states |
| **Loading/skeleton states** | Simple pulse | An animated waveform bar (audio-meter style) — reinforces "studio" identity even in a loading spinner |
| **Iconography** | Line icons, soft fills | Bold, chunky stroke icons, stencil/stamp style |
| **Section dividers** | Whitespace only | Visible horizontal rules, sometimes a dashed "tear line" (perforation motif, nodding to ticket stubs and receipts) |
| **CTA button style** | Rounded pill/rect, soft hover lift | Sharp rectangle, signal-orange fill, hard 2px black border, text in uppercase mono, hover state inverts fill/text rather than lifting |
| **Overall emotional register** | Warm, editorial, hospitality-premium | Industrial, kinetic, maker-economy-confident — closer to a record label or print studio's site than a hotel's |

Nothing above is decoration for its own sake — every reversal also does real communicative work for a *studio-and-production* brand instead of a *hospitality* brand: hard edges and stamped shadows read "printed material," mono type reads "receipt/ticket," the ticker strip reads "live production floor," the waveform loader reads "audio." The aesthetic is derived from what the business actually does, which is exactly the discipline that was missing the first time.

---

## 3. Monorepo & Route Architecture

Same correct underlying shape as before (one repo, two faces, one Supabase backend) — only the names and content change:

```
foundry-kiln/                         ← Turborepo root
│
├── apps/
│   ├── web/                          ← Next.js 14+ App Router, ONE app, TWO faces
│   │   └── app/
│   │       ├── (floor)/              ← PUBLIC · unauthenticated · SEO-indexed
│   │       │   ├── page.tsx                    Homepage
│   │       │   ├── the-booth/                  Studio rentals
│   │       │   │   ├── page.tsx
│   │       │   │   └── [slug]/page.tsx         Individual studio space detail
│   │       │   ├── the-line/page.tsx           Print & merch
│   │       │   ├── the-roast/page.tsx          Coffee & subscriptions
│   │       │   ├── makers-row/page.tsx         Coming-soon teaser (Deck/Crate/Bay)
│   │       │   ├── about/page.tsx
│   │       │   └── contact/page.tsx
│   │       │
│   │       ├── (ops)/                ← PRIVATE · role-gated · the operations core
│   │       │   ├── overview/page.tsx           Owner Dashboard
│   │       │   ├── record/page.tsx             Daily financial entry
│   │       │   ├── budgets/page.tsx
│   │       │   ├── leads/page.tsx               ← public_enquiries surfaces here
│   │       │   ├── modules/
│   │       │   │   ├── the-booth/                Studio bookings calendar
│   │       │   │   ├── the-line/                 Print production pipeline
│   │       │   │   └── the-roast/                Subscriptions + café sales
│   │       │   ├── reports/page.tsx
│   │       │   └── admin/                        Users, roles, units, branding
│   │       │
│   │       └── (auth)/
│   │           └── login/page.tsx                Shared login, only (ops) routes require it
│   │
│   └── mobile/                        ← Reserved for Phase 2 Expo app
│
├── packages/
│   ├── database/                      ← Supabase types, SQL migrations, seed scripts
│   ├── ui/                            ← Shared shadcn/ui component library + design tokens
│   ├── config/                        ← Shared eslint, tsconfig, tailwind config
│   └── shared/                        ← Shared business logic, Zod schemas, types
│
└── turbo.json
```

**Non-negotiable rule, unchanged from v1's correct reasoning:** `(floor)` and `(ops)` never share layout, header, or navigation components — only the token layer (colors as CSS variables, spacing scale) and the Supabase client are shared.

---

## 4. Tech Stack

Identical stack to the previous document — this part of the original reasoning was correct and doesn't need to change just because the brand did:

Next.js 14+ App Router (TypeScript strict, mobile-first, PWA-installable) · Supabase (Postgres, Auth, RLS, Storage, Realtime, Edge Functions, `pg_cron`) · Tailwind CSS + shadcn/ui · TanStack Query + Supabase JS client · React Hook Form + Zod · Tremor/Recharts for dashboard charts · Web Push for MVP notifications · `@react-pdf/renderer` + `exceljs` + CSV for exports · Vercel + Supabase Cloud hosting.

---

## 5. Unified Data Model — genuinely different operational shape this time

This is the part that makes the two sites *functionally*, not just cosmetically, distinguishable. Each unit's operational tables model a different kind of transaction entirely: a **time-slot booking** (The Booth), a **quantity-and-tier priced production order** (The Line), and a **recurring subscription** (The Roast). None of these map onto "event booking / menu item / laundry order" — they require different forms, different UI controls, and different admin pipelines.

```
── CORE / TRUNK (structurally unchanged — this reasoning was correct) ─
organizations            id, name, logo_url, branding_color, created_at
                          → seeded row: "Foundry Collective Limited"

business_units           id, org_id, key (the_booth | the_line | the_roast | custom),
                          display_name, slug, icon, color, is_active, created_at

users / roles / permissions / role_permissions / user_roles   (same shape as before)

transactions              ← THE UNIFIED LEDGER, every unit posts here
                          id, org_id, business_unit_id, type (income|expense),
                          category_id, subcategory_id, amount, currency, description,
                          transaction_date, recorded_by, source (manual|booking|order|subscription),
                          source_ref_id, attachment_url, created_at, updated_at

categories / subcategories / budgets / budget_line_items / daily_summaries /
audit_logs / notification_preferences / device_tokens        (same shape as before)

── BRANCH: THE BOOTH (studio rentals — TIME-SLOT booking model) ───────
studio_spaces              name (Podcast Room, Music Suite, Photo/Video Cyc Wall),
                            capacity, hourly_rate, day_rate, equipment_included (jsonb),
                            image_url, is_active
studio_packages             name, description, base_hours, price_from, inclusions (jsonb)
studio_bookings              client_name, client_contact, studio_space_id, booking_date,
                              start_time, end_time, package_type, addons (jsonb — engineer,
                              extra_mic, lighting_kit), deposit_amount, total_quoted,
                              status (inquiry→confirmed→completed→cancelled)

── BRANCH: THE LINE (print & merch — QUANTITY/TIER pricing model) ─────
merch_products                name, category (tshirt|hoodie|sticker|business_card|poster),
                                base_price, price_breaks (jsonb — qty-tier discount ladder),
                                image_url, is_active
merch_orders                   customer_name, customer_contact, product_id, quantity,
                                design_file_url, notes, amount_charged,
                                status (quote_requested→in_production→ready→delivered)

── BRANCH: THE ROAST (coffee — RECURRING SUBSCRIPTION model) ──────────
roast_menu_items                name, origin, roast_level, price,
                                  category (bag|espresso_drink|pour_over|cold_brew),
                                  image_url, is_featured
coffee_subscriptions             customer_name, customer_contact, plan (weekly|biweekly|
                                  monthly), bag_size, grind_type, next_delivery_date,
                                  status (active|paused|cancelled)

── LEAVES: PUBLIC STOREFRONT CONTENT (Kiln Floor) ──────────────────────
public_services / testimonials / gallery_images / deals_promotions
coming_soon_units                name (The Deck | The Crate | The Bay), description, icon,
                                  expected_launch_label

public_enquiries                 ← THE BRIDGE BETWEEN LEAVES AND TRUNK
                                  id, business_unit_id (nullable), type (studio_booking|
                                  merch_quote|coffee_subscription|wholesale_coffee|contact|
                                  notify_me), full_name, phone, email, message,
                                  metadata (jsonb), status (new|contacted|converted|closed),
                                  created_at → surfaces live inside (ops)/leads
```

**RLS posture:** identical logic to before — anonymous `SELECT` only on `is_active` leaf-table rows, anonymous `INSERT` only on `public_enquiries`, zero anonymous access to any financial or operational table, Unit Managers scoped to their `business_unit_id` via `user_roles` unless granted `view_all_units`.

**Automatic ledger posting:** a `studio_bookings` row marked "completed and paid," a `merch_orders` row marked "delivered and paid," or a `coffee_subscriptions` successful billing-cycle charge, each fires a trigger/Edge Function that writes the matching `transactions` row — same discipline as before, applied to genuinely different source events.

---

## 6. Page-by-Page Requirements (Kiln Floor — public)

**Homepage** — Asymmetric hero (large Space Grotesk headline left, halftone-processed photo or texture right), a scrolling marquee ticker under the header ("NOW BOOKING THE BOOTH · FRESH ROAST DROPS FRIDAY · NEW PRINT RUN OPEN"). A staggered, offset "Three Units, One Floor" grid for The Booth / The Line / The Roast, each card with a hard-edged border and stamped-shadow, not a soft rounded card. Testimonials as a horizontal ticket-stub strip, not a centered carousel. "Maker's Row" coming-soon teaser. Footer with map, WhatsApp, socials, per-unit hours.

**The Booth** (`/the-booth`) — Hero with a real (or tastefully placeholder) studio photo, duotone-processed. Studio space cards (capacity, hourly/day rate, equipment included) pulled from `studio_spaces`. An **interactive time-slot booking calendar** — not a generic date field, an actual slot picker showing available hours per day — plus package tiers (`studio_packages`) and toggleable add-ons (engineer, extra mic, lighting kit) with a running price total, mirroring the "interactive estimator" pattern that worked well in the Iroko Court hall page but applied to hourly time-slots instead of guest-count sliders. Gallery of past sessions. Booking form writing to `public_enquiries` with `type='studio_booking'`. Optional `/the-booth/[slug]` detail page per space.

**The Line** (`/the-line`) — Hero communicating "production floor," not "boutique shop." Product grid (apparel, stickers, business cards, posters) from `merch_products`. A **live quantity-based pricing calculator**: person selects a product and a quantity, sees the bulk-discount tier ladder update in real time from `price_breaks`, uploads a design file, and submits — this is a fundamentally different interaction than anything on the Iroko Court site (no other page there does live bulk-tier math). Gallery of past print runs. Quote form writing to `public_enquiries` with `type='merch_quote'`.

**The Roast** (`/the-roast`) — Hero communicating craft and warmth against the industrial base palette (this is where the caramel/espresso accent gets to be genuinely warm within an otherwise cool, hard-edged system — the one deliberate softening, because coffee should feel inviting). Café menu grid from `roast_menu_items` by category. A **subscription builder**: frequency selector (weekly/biweekly/monthly), bag size, grind type, live price preview, writing to `coffee_subscriptions` on submit and a corresponding `public_enquiries` row with `type='coffee_subscription'`. A separate, clearly distinct wholesale/office-account enquiry block writing `type='wholesale_coffee'`.

**Maker's Row** (`/makers-row`) — Coming-soon cards for The Deck, The Crate, The Bay from `coming_soon_units`, each with a "Notify Me" capture writing `type='notify_me'`.

**About** (`/about`) — The Foundry story: raw material, real craft, one floor — told through what actually happens on the floor (session logs, print runs, roast batches), not brand-philosophy prose alone.

**Contact** (`/contact`) — Map, click-to-call, click-to-WhatsApp, general enquiry form (`type='contact'`), per-unit hours (a studio keeps very different hours than a café).

---

## 7. Page-by-Page Requirements (Kiln Ops — private)

Structurally the same discipline as the previous document's Nexus/Canopy dashboard — Owner Dashboard, daily entry, leads queue, budgets, reports, admin, audit log — but the three module screens under `/modules` now reflect the genuinely different operational shapes:

- **`/modules/the-booth`** — a real booking **calendar** view (not a table-only list) showing studio spaces as rows/columns against time slots, with a status pipeline (inquiry → confirmed → completed → cancelled); marking "completed and paid" auto-posts to the ledger.
- **`/modules/the-line`** — a **production pipeline board** (quote_requested → in_production → ready → delivered), closer to a kanban view than a form list, since print jobs move through physical production stages.
- **`/modules/the-roast`** — a **subscription management view**: active/paused/cancelled subscriber list, upcoming delivery dates, churn at a glance, plus a simple daily café sales entry for walk-in orders.

This variety in the private dashboard is itself part of the differentiation — Iroko Court's three modules were all "table + status dropdown"; Foundry's three modules are a calendar, a kanban board, and a subscription roster, because that's what these three businesses actually require to run.

---

## 8. Roles & Permissions

Unchanged in structure from the previous document (Owner/Admin, Unit Manager, Finance Viewer, Report Generator, Staff) with the same granular permission set (`view_financial_data`, `manage_financial_data`, `export_reports`, `manage_users`, `manage_business_units`, `set_budgets`, `approve_expenses`, `view_all_units`) — this layer was correct before and doesn't need reinvention.

---

## 9. Non-Functional Requirements

Same bar as the previous document — SEO (metadata, Open Graph, sitemap, robots.txt), Lighthouse 90+ mobile, RLS on every table without exception, NDPR-aware data handling, PWA-installable, TypeScript strict with tests on ledger-posting logic, and every module architected behind a consistent interface so The Deck/The Crate/The Bay can be added later via configuration, not a rewrite.

---

## 10. GitHub Repository

**Repository name:**
```
foundry-kiln
```

**Full path:**
```
github.com/<your-username>/foundry-kiln
```

**Creation command:**
```bash
gh repo create <your-username>/foundry-kiln \
  --public \
  --description "Foundry — Kiln: a creative-economy production floor (studio rentals, custom print, specialty coffee) with a unified ops & storefront platform (Next.js + Supabase)" \
  --clone
```

**Suggested internal package scope, if publishing shared packages later:** `@foundry-kiln/*`

---

## 11. THE ANTIGRAVITY IDE PROMPT
### (copy everything inside the fenced block below, paste it into Antigravity as the build instruction)

```
You are acting as a senior full-stack engineer and product architect with 30+ years of experience.
Build "Kiln" — the unified operations-and-storefront platform for FOUNDRY COLLECTIVE LIMITED, a
Lagos creative-economy company operating three functionally distinct production units under one
roof: a studio-rental business ("The Booth" — podcast, music, and photo/video studio hours), a
custom print and merch production business ("The Line" — apparel, stickers, business cards,
posters), and a specialty coffee roastery and subscription business ("The Roast") — with the
schema and codebase architected so additional units (a skate/BMX park "The Deck," a vinyl shop
"The Crate," a bike-repair co-op "The Bay") can be added later purely via configuration.

CRITICAL CONTEXT — READ BEFORE DESIGNING ANYTHING: this platform must NOT resemble a warm,
editorial, hospitality-style site (forest green + gold + serif headlines + soft rounded cards +
centered hero + gentle fades). That aesthetic belongs to a different, unrelated product and must
be actively avoided. Foundry's design system is built in deliberate opposition to it — see the
DESIGN DIRECTION section below, which is not optional flavor text but a literal set of contrasts
to build against.

GOAL: Ship ONE Next.js codebase with TWO completely distinct experiences sharing one Supabase
backend and one design-token system:
  1. Kiln Floor — a public, unauthenticated, SEO-indexed storefront that makes a first-time
     visitor in Lagos immediately understand and want to book a studio session at The Booth,
     order a custom print run from The Line, or subscribe to a coffee bag from The Roast.
  2. Kiln Ops — a private, role-gated operations and financial command center giving the owner
     one daily, trustworthy answer: "did we make money today, across everything, and where did
     it leak?" — while letting each unit's manager run their own scoped operational workflow.

=== BRAND ===
Company (legal): Foundry Collective Limited. Public brand: Foundry. Platform name: Kiln.
Tagline: "Raw talent. Real output. One floor."
Business units: The Booth (studio rentals, accent electric violet #7B2FF7), The Line (print &
merch, accent ink red #E4002B), The Roast (coffee, accent caramel/espresso #C08A3E on a deep
espresso-brown #3B2314 base for this unit only). Shared spine: off-black (#121212), raw concrete
(#EDEBE6), signal orange (#FF4B12) as the primary CTA and cross-site accent color.

=== DESIGN DIRECTION (mandatory, not optional — build every one of these contrasts) ===
Typography: Space Grotesk (bold, geometric grotesk, frequently uppercase) for all major headlines
— NOT a warm serif. IBM Plex Sans for body copy. IBM Plex Mono for every price, timestamp,
status label, and form field label, giving a "ticket stub / receipt" texture throughout.
Corners: hard, mostly square (0–4px radius) everywhere — no soft, generously rounded cards.
Elevation: hard offset shadows (flat 4px black offset, no blur) or a visible 1–2px solid border
instead of soft diffuse shadows.
Hero layout: asymmetric split (large type on one side, a duotone/halftone-processed photo or
texture on the other) or a diagonal-cut image — never a centered-text-over-full-bleed-photo hero
with a pill-shaped eyebrow badge.
Homepage unit cards: an offset, staggered grid (cards sit at slightly different vertical
positions, like items on a workbench) — never three perfectly aligned, evenly-sized cards.
Photography: high-contrast duotone or halftone-processed images — color should arrive mainly
through the accent palette, not through warm full-color lifestyle photography.
Motion: hard-cut slide-ins (150ms, linear easing, no bounce), a scrolling marquee/ticker strip
under the header showing live-feeling activity ("NOW BOOKING THE BOOTH · FRESH ROAST DROPS
FRIDAY · NEW PRINT RUN OPEN"), and a brief glitch/RGB-split flicker on interactive hover states
— never gentle scroll-reveal fades with soft ease-out easing.
Loading states: an animated audio-waveform/VU-meter bar, not a generic pulse skeleton.
Iconography: bold chunky stroke icons with a stencil/stamp quality, not thin soft-fill line icons.
Dividers: visible horizontal rules, occasionally a dashed "tear line" perforation motif (ticket
stub / receipt callback) instead of relying purely on whitespace.
Buttons: sharp rectangles, signal-orange fill, 2px black border, uppercase mono label text; hover
inverts fill/text rather than lifting with a shadow.
Mobile-first non-negotiables still apply: a persistent thumb-reachable primary CTA per page
(varies by unit — "Book a Session" on The Booth, "Get a Quote" on The Line, "Start Subscription"
on The Roast), a floating WhatsApp button site-wide, Lighthouse mobile 90+, next/image throughout.

=== ARCHITECTURE ===
Turborepo monorepo. apps/web is the one Next.js 14+ App Router application (TypeScript strict,
mobile-first, PWA-installable) containing:
- A `(floor)` route group: `/`, `/the-booth`, `/the-booth/[slug]`, `/the-line`, `/the-roast`,
  `/makers-row`, `/about`, `/contact`. No auth. Full SEO (metadata, Open Graph, sitemap.xml,
  robots.txt). Its own distinct marketing layout, header, and footer — never shared with the
  dashboard.
- An `(ops)` route group: `/overview`, `/record`, `/leads`, `/budgets`, `/modules/the-booth`,
  `/modules/the-line`, `/modules/the-roast`, `/reports`, `/admin`, `/admin/audit`. Fully
  role-gated via Supabase Auth + RLS.
- A shared `(auth)` group with `/login` — only `(ops)` routes require it.
Reserve apps/mobile (empty scaffold) for a future Expo app. packages/database holds Supabase
migrations and generated types. packages/ui holds shared shadcn/ui components and the shared
design-token CSS variables (the ONLY thing the two route groups share visually). packages/config
holds shared eslint/tsconfig/tailwind config. packages/shared holds Zod schemas and business
logic reusable by a future Expo app.

=== DATA MODEL ===
Implement as versioned Supabase SQL migrations, with RLS enforced at the database level on every
table without exception:
- Trunk (unchanged shape from a standard multi-unit operations core): organizations (seed:
  "Foundry Collective Limited"); business_units (key: the_booth | the_line | the_roast | custom
  — configurable, never a hardcoded application-level enum); user profiles linked to Supabase
  auth; roles, permissions, role_permissions, and user_roles (role assignment can be scoped to
  one business_unit_id or be org-wide); a single unified `transactions` ledger (income/expense,
  category, subcategory, amount, business_unit_id, recorded_by, source, source_ref_id) as the
  sole source of truth for every Naira in the system; categories/subcategories; budgets and
  budget_line_items with variance tracking; daily_summaries as a materialized per-unit-per-day
  rollup; audit_logs capturing every financial mutation; notification_preferences and
  device_tokens.
- Branch (The Booth — a TIME-SLOT booking model, distinct from a simple date-based booking):
  studio_spaces (name, capacity, hourly_rate, day_rate, equipment_included jsonb, image_url),
  studio_packages (base_hours, price_from, inclusions jsonb), studio_bookings (studio_space_id,
  booking_date, start_time, end_time, package_type, addons jsonb, deposit_amount, total_quoted,
  status: inquiry → confirmed → completed → cancelled).
- Branch (The Line — a QUANTITY/TIER pricing model, distinct from flat per-item pricing):
  merch_products (category: tshirt|hoodie|sticker|business_card|poster, base_price, price_breaks
  jsonb — a bulk-discount tier ladder, image_url), merch_orders (product_id, quantity,
  design_file_url, amount_charged, status: quote_requested → in_production → ready → delivered).
- Branch (The Roast — a RECURRING SUBSCRIPTION model, distinct from a one-off order): roast_menu_
  items (origin, roast_level, price, category: bag|espresso_drink|pour_over|cold_brew,
  image_url), coffee_subscriptions (plan: weekly|biweekly|monthly, bag_size, grind_type,
  next_delivery_date, status: active|paused|cancelled).
- Leaves (public storefront content, editable later from an admin CMS screen without code
  changes): public_services, testimonials, gallery_images, deals_promotions, coming_soon_units
  (seed with The Deck, The Crate, The Bay).
- The bridge: public_enquiries — captures every public form submission (studio_booking,
  merch_quote, coffee_subscription, wholesale_coffee, contact, notify_me) with a status pipeline
  (new → contacted → converted → closed), surfaced live inside (ops)/leads.
Write a Postgres trigger (or Edge Function) so that marking a studio_booking "completed and
paid," a merch_order "delivered and paid," or a successful coffee_subscriptions billing-cycle
charge, automatically creates the corresponding `transactions` row — managers never double-enter
data.

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
Push (service worker) for the MVP daily digest; @react-pdf/renderer + exceljs + native CSV for
branded exports; Vercel + Supabase Cloud hosting.

=== KILN FLOOR (PUBLIC) — PAGES & CONTENT ===
1. Homepage: asymmetric hero with a scrolling activity ticker below the header; a staggered,
   offset "Three Units, One Floor" grid for The Booth / The Line / The Roast; a testimonials
   strip styled as ticket stubs; a "Maker's Row" coming-soon teaser; footer with map, WhatsApp,
   socials, per-unit hours.
2. The Booth (`/the-booth`): hero with duotone studio photography; studio_space cards (capacity,
   hourly/day rate, equipment); an INTERACTIVE TIME-SLOT BOOKING CALENDAR showing real
   available hours per day (not a plain date field); package tiers with toggleable add-ons
   (engineer, extra mic, lighting kit) updating a running price total live; a gallery of past
   sessions; a booking form writing to public_enquiries with type='studio_booking'. Optional
   `/the-booth/[slug]` detail page per space.
3. The Line (`/the-line`): hero communicating a working production floor; a product grid from
   merch_products; a LIVE QUANTITY-BASED PRICING CALCULATOR where selecting a product and
   quantity updates the bulk-discount tier total in real time from price_breaks, plus a design
   file upload; a gallery of past print runs; a quote form writing to public_enquiries with
   type='merch_quote'.
4. The Roast (`/the-roast`): hero with the one deliberately warmer accent treatment on the site
   (caramel/espresso against the industrial base); café menu grid from roast_menu_items by
   category; a SUBSCRIPTION BUILDER (frequency, bag size, grind type, live price preview) writing
   to coffee_subscriptions and public_enquiries with type='coffee_subscription'; a clearly
   separate wholesale/office-account enquiry block writing type='wholesale_coffee'.
5. Maker's Row (`/makers-row`): cards for The Deck, The Crate, The Bay from coming_soon_units,
   each with a "Notify Me" form writing to public_enquiries with type='notify_me'.
6. About (`/about`): the Foundry story told through what actually happens on the floor (sessions,
   print runs, roast batches), not abstract brand philosophy alone.
7. Contact (`/contact`): map, click-to-call, click-to-WhatsApp, general enquiry form
   (type='contact'), per-unit hours.

=== KILN OPS (PRIVATE) — FEATURES, IN BUILD ORDER ===
1. Auth (email/password + Google OAuth) with an onboarding flow that creates the organization
   (Foundry Collective Limited), seeds The Booth / The Line / The Roast as business_units, and
   creates the first Admin/Owner user.
2. Admin console: CRUD for business units, categories/subcategories, users, roles and
   role-permission assignments; branding settings (logo upload, palette).
3. Daily financial entry: fast, mobile-friendly per-unit form for income/expense with
   category/subcategory, optional receipt photo upload, Zod validation against negative/garbage
   amounts.
4. Owner Dashboard (`/overview`): today's org-wide totals (income, expense, net profit) readable
   in under 10 seconds on a phone; per-unit breakdown grid; percentage change vs. previous day;
   profit margin and ROI KPIs; a waveform-styled count-up animation on number load.
5. Historical & trend view: custom date-range picker, line/bar charts, filterable by unit and
   category, year-over-year comparison.
6. Budgets: per-unit budgets with category line items; real-time actual-vs-budget variance;
   automatic alert at 80% budget threshold; mid-cycle revisions with visible history.
7. The Booth module (`/modules/the-booth`): a real CALENDAR view of studio spaces against time
   slots with a status pipeline (inquiry → confirmed → completed → cancelled); marking
   "completed and paid" auto-posts to transactions.
8. The Line module (`/modules/the-line`): a PRODUCTION PIPELINE KANBAN BOARD (quote_requested →
   in_production → ready → delivered), since print jobs move through physical stages.
9. The Roast module (`/modules/the-roast`): a SUBSCRIPTION MANAGEMENT VIEW (active/paused/
   cancelled subscribers, upcoming delivery dates, churn at a glance) plus simple daily café
   sales entry.
10. Leads (`/leads`): every public_enquiries row surfaced as an actionable queue with status
    pipeline (new → contacted → converted → closed), filterable by unit and enquiry type.
11. Notifications: a Supabase Edge Function on a cron schedule computing the daily summary per
    organization and sending a Web Push notification based on notification_preferences.
12. Exports: CSV, branded PDF, and Excel export of any report view, filterable by unit and
    category.
13. Audit log viewer (Admin only): searchable, filterable log of every financial mutation.

=== NON-FUNCTIONAL REQUIREMENTS ===
Mobile-first responsive at every breakpoint on both surfaces. Installable as a PWA. Dashboard
initial load under ~1.5s on 4G via the daily_summaries cache table. Public surface: Lighthouse
mobile performance 90+, full SEO metadata, sitemap.xml, robots.txt, semantic HTML, accessible
alt text throughout. RLS on every table with no exceptions, encrypted-at-rest via Supabase
defaults, sane password policy, optional MFA for Admin/Owner, no financial data ever reachable
via an unauthenticated route, signed/expiring URLs for exported files. Design with Nigeria's
NDPR in mind for data retention and consent. TypeScript strict, ESLint + Prettier, feature-based
folder structure, unit tests for ledger-posting logic and RLS-sensitive queries, a README
documenting setup, environment variables, and the schema ERD. Architect every module
(studio_bookings, merch_orders, coffee_subscriptions, and every public content table) behind a
consistent internal interface so a future unit (The Deck, The Crate, The Bay) can be added
primarily through configuration and a new module folder, never a rewrite of shared ledger,
dashboard, or notification logic.

=== GITHUB REPOSITORY ===
Repository name: foundry-kiln
Full path: github.com/<your-username>/foundry-kiln
Description: "Foundry — Kiln: a creative-economy production floor (studio rentals, custom print,
specialty coffee) with a unified ops & storefront platform (Next.js + Supabase)."
Suggested internal package scope if publishing shared packages later: @foundry-kiln/*

=== DELIVERABLE FOR THIS SESSION ===
First scaffold the Turborepo (apps/web, packages/database, packages/ui, packages/config,
packages/shared), initialize the Next.js app with the stack above, and write the full unified
Supabase schema (trunk + all three branches + all leaf/public tables + public_enquiries) as
versioned SQL migrations with RLS policies. Seed the organization, the three business units,
roles/permissions, and realistic placeholder rows for studio_spaces, studio_packages,
merch_products, roast_menu_items, testimonials, and coming_soon_units. Then build, in this
order: the shared design-token layer in packages/ui implementing every contrast listed in the
DESIGN DIRECTION section above; the (ops) Auth flow and Owner Dashboard end-to-end and working;
then the (floor) marketing layout (header/footer/ticker/WhatsApp button) plus the Homepage and
The Booth page — including the interactive time-slot booking calendar — end-to-end and working.
Confirm the schema and the visual direction of both the dashboard and the homepage with me
before proceeding to Budgets, the remaining Kiln Ops modules, and the remaining Kiln Floor pages
(The Line, The Roast, Maker's Row, About, Contact) in that priority order.
```

---

## 12. A few calls worth flagging, stated plainly

- **The design-contrast table in Section 5 is the actual fix, not the new color values on their own.** If I'd only swapped forest-green-and-gold for off-black-and-orange while keeping the same rounded cards, centered hero, and soft-fade motion, you'd have gotten a differently-colored version of the same site again. The contrast table forces Antigravity to reconsider *layout grammar and motion*, not just palette.
- **The services had to change in kind, not just in name, for the same reason.** A time-slot calendar, a bulk-tier pricing calculator, and a subscription builder are three different UI problems with three different natural solutions — that variety is what keeps the two sites from converging back toward the same three-form-pattern template even under time pressure during the build.
- **What's staying identical on purpose:** the trunk data model (organizations, business_units, the unified ledger, roles/RLS), the monorepo shape, and the tech stack. That reasoning was sound in the original document and rebuilding it from scratch for a new brand would just reintroduce the same architecture with different names — the goal here was visual and functional distinctiveness, not architectural novelty for its own sake.
