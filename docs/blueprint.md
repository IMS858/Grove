# 9B GrowOS — Complete Startup Blueprint
### *Grow Smarter. Harvest More.*

> A build-ready product, design, and engineering specification for the ultimate Zone 9B garden management platform. This document is intended to hand directly to a founding team (Product, Design, Engineering) and begin building immediately.

**Document version:** 1.0
**Stack:** React Native (Expo) · Supabase (Postgres / Auth / Storage / Edge Functions) · OpenAI · OpenWeather
**Target user:** Home, raised-bed, fruit-tree, herb, and flower gardeners — anchored on USDA Zone 9b / Southern California.

---

## Table of Contents

1. [Product Requirements Document (PRD)](#1-product-requirements-document-prd)
2. [UX Flows](#2-ux-flows)
3. [Wireframes](#3-wireframes)
4. [Screen Inventory](#4-screen-inventory)
5. [Navigation Structure](#5-navigation-structure)
6. [Database Schema (logical)](#6-database-schema-logical)
7. [Supabase SQL (DDL + RLS)](#7-supabase-sql-ddl--rls)
8. [API Architecture](#8-api-architecture)
9. [Folder Structure](#9-folder-structure)
10. [React Native Component Architecture](#10-react-native-component-architecture)
11. [Design System](#11-design-system)
12. [User Stories](#12-user-stories)
13. [MVP Roadmap](#13-mvp-roadmap)
14. [V2 Roadmap](#14-v2-roadmap)
15. [Monetization Strategy](#15-monetization-strategy)
16. [Launch Strategy](#16-launch-strategy)
17. [Technical Architecture Diagram](#17-technical-architecture-diagram)
18. [Full Build Plan](#18-full-build-plan)

---

# 1. Product Requirements Document (PRD)

## 1.1 Problem

Gardeners — especially in Zone 9b's unusual climate (long hot summers, mild frost-light winters, year-round growing, citrus + stone fruit + warm-season vegetables all at once) — drown in fragmented advice. National planting calendars are wrong for them. They forget when they last watered or fed, lose track of which variety is in which bed, can't tell a nitrogen deficiency from spider mite damage, and never learn from their own data year to year. Existing apps are either dumbed-down plant ID toys or overcomplicated grow-room loggers built for indoor cannabis.

## 1.2 Vision

9B GrowOS is the operating system for a garden. It ingests everything a gardener does (watering, feeding, pH/EC, photos, harvests, pests) plus the local environment (weather) and turns it into one clear answer every morning: **"Here's exactly what to do today."** Over time it becomes a personalized, location-aware coach that predicts problems before they happen and helps every harvest beat the last.

## 1.3 Positioning

| Analogy | What we borrow |
|---|---|
| WHOOP for gardening | A single daily health score + recovery-style guidance |
| Strava for growing | Streaks, history, progress you want to return to |
| MyFitnessPal for plants | Frictionless logging that compounds into insight |
| Apple Health for gardens | One trusted hub aggregating many data streams |
| Notion for garden records | Flexible, structured, durable records |
| Duolingo for gardening habits | Habit loop, streaks, gentle nudges |

## 1.4 Goals & Non-Goals

**Goals (v1):**
- Make daily logging take < 15 seconds per action.
- Deliver a credible, explainable **Garden Health Score**.
- Generate a correct, Zone-9b-aware **daily task list**.
- Provide **AI photo diagnostics** with confidence + actions.
- Provide a conversational **Zone 9B Coach**.
- Track plants, beds, water, feed, pH/EC, harvests, pests.

**Non-Goals (v1):**
- Commercial farm / multi-acre operations management.
- Marketplace / e-commerce for seeds & supplies (consider v2+).
- Social network / public feeds (lightweight only in v2).
- Hardware sensors integration (v2 — design schema to allow it now).
- Regions far outside Zone 9b (the coach is intentionally specialized first, generalized later).

## 1.5 Target Personas

**Persona A — "Weekend Renee" (primary).** Owns 4–8 raised beds + a few citrus trees in San Diego. Gardens Saturdays, checks in on weekdays. Wants to stop killing plants and actually harvest. Not technical. Will pay for confidence.

**Persona B — "Optimizer Omar."** Has 20+ plants, a soil pH meter, an EC meter, a notebook full of feeding logs. Wants charts, trends, and yield-per-bed. Power user; drives retention and word of mouth.

**Persona C — "Fruit-tree Frank."** 6 citrus + stone fruit trees, minimal beds. Cares about pruning windows, citrus feeding schedules, pest pressure (leaf miner, scale). Seasonal-but-loyal.

## 1.6 Core Differentiators (the moat)

1. **Hyper-local intelligence.** Every recommendation is filtered through Zone 9b + the user's exact weather, microclimate, and plant history — not a generic database.
2. **Closed feedback loop.** The app's advice gets graded by the user's own outcomes (harvest yield, pest recurrence), so the coach personalizes.
3. **The daily answer.** Competitors give data; we give a decision.

## 1.7 Success Metrics (North Star + supporting)

- **North Star:** Weekly Active Logging Gardeners (WALG) — users who log ≥1 action in a 7-day window.
- D1 / D7 / D30 retention. Target D30 ≥ 35% (habit category benchmark).
- Tasks completed / tasks generated (task trust).
- Diagnostics submitted per active user.
- Harvest logs per user per season (proof of outcome).
- Free→Pro conversion ≥ 5% of MAU.
- Garden Health Score trend per cohort (does using the app improve gardens?).

## 1.8 Functional Requirements (the 16 core features)

Summarized for traceability; full behavior in UX Flows + User Stories.

| # | Feature | v1 | Notes |
|---|---|---|---|
| F1 | Dashboard ("what to do today") | ✅ | Health score, weather, tasks, alerts, streak |
| F2 | Garden Map | ✅ (grid) | Drag/drop beds & plants; sun/shade; irrigation zones |
| F3 | Plant Profiles | ✅ | Full profile + unified timeline |
| F4 | Photo Journal | ✅ | Auto date/plant/bed/season; before-after slider |
| F5 | AI Diagnostics | ✅ | Photo → problem, confidence, actions, severity |
| F6 | Water Tracking | ✅ | Logs + trend + predicted next water |
| F7 | Feeding Tracker | ✅ | Product/dose/method + schedule + recs |
| F8 | pH / EC / PPM | ✅ | Input + runoff; charts; alerts |
| F9 | Pest Management | ✅ | Pest/severity/treatment/outcome + history |
| F10 | Harvest Tracking | ✅ | Qty/weight/quality + yield analytics |
| F11 | Zone 9B AI Coach | ✅ | Conversational, context-aware |
| F12 | Calendar | ✅ | Plant/harvest/feed/prune/spray — 9b specific |
| F13 | Task Engine | ✅ | Auto-generated, prioritized tasks |
| F14 | Weather Intelligence | ✅ | Forecast + auto recommendations |
| F15 | Analytics | ✅ (core) | Totals, yield, health, streaks |
| F16 | Knowledge Library | ✅ (read) | Curated + user-saved techniques |

## 1.9 Non-Functional Requirements

- **Performance:** Dashboard interactive < 1.5s on a mid-tier phone over 4G; logging actions optimistic-update instantly.
- **Offline-first:** All logging works offline and syncs (local cache + queued mutations).
- **Reliability:** RLS enforced on every table; no client can read another user's rows.
- **Privacy:** Photos are private by default; AI calls strip EXIF GPS unless user opts in.
- **Cost control:** AI diagnostics and coach calls are rate-limited and cached; free tier capped.
- **Accessibility:** WCAG AA contrast in both themes; dynamic type; VoiceOver/TalkBack labels.

---

# 2. UX Flows

Notation: `→` next step, `⟳` background job, `⊕` creates record, `⚡` triggers task generation.

## 2.1 Onboarding (first run)
```
Launch → Value carousel (3 slides) → Sign up (email / Apple / Google)
  → Location permission (for weather + zone) ⟳ reverse-geocode → confirm "Zone 9b ✓"
  → "What do you grow?" multi-select (veg / fruit trees / herbs / flowers)
  → Create first Garden ⊕ (auto-named, location set)
  → Quick-add first Bed ⊕ (or "skip, I'll do it later")
  → Quick-add first Plant ⊕ (search variety → confirm)
  → Notifications permission (framed: "so we can warn you before a heat wave")
  → Land on Dashboard (seeded with starter tasks) ⚡
```

## 2.2 Daily core loop (the habit)
```
Open app → Dashboard
  → "Tasks Due Today" card
  → Tap task "Water Bed 2"
  → One-tap "Mark watered" ⊕ WaterLog (defaults: today, last amount, last source)
     ↳ optional: tweak amount → save
  → Streak increments, task checks off, health score recalculates ⟳
  → Return to dashboard, next task surfaces
```

## 2.3 Log watering (manual)
```
+ FAB → "Water" → pick Bed or Plant (recent pinned)
  → amount (stepper, remembers last) → source (rain/hose/drip/can) → notes (optional)
  → Save ⊕ → predicted-next-water recomputed ⟳ → toast "Logged. Next water ~ in 3 days."
```

## 2.4 Log feeding
```
+ FAB → "Feed" → pick Plant/Bed → product (autocomplete from your products + catalog)
  → type (organic/synthetic/amendment) → dose + unit → method (foliar/soil drench/granular)
  → Save ⊕ → updates feeding schedule + next-feed rec ⟳
```

## 2.5 Log pH / EC / PPM
```
+ FAB → "Reading" → pick target → input pH, runoff pH, input EC, runoff EC, PPM (any subset)
  → Save ⊕ → if out-of-range → alert created ⚡ + chart annotated
```

## 2.6 AI Diagnostics
```
+ FAB → "Diagnose" → camera or library (1–3 photos)
  → attach to plant (optional but improves accuracy) → describe symptom (optional)
  → Submit ⟳ (upload to Storage → Edge Function → OpenAI Vision)
  → Result card: likely problem · confidence % · severity · causes · recommended actions
  → "Create tasks from this" ⚡ (e.g., apply cal-mag, reduce watering)
  → saved to plant timeline ⊕ AIDiagnosis
```

## 2.7 Harvest
```
+ FAB → "Harvest" → pick plant → quantity / weight / quality (1–5) / flavor notes
  → Save ⊕ → confetti + "Best lemon harvest yet 🎉" if record → yield analytics update ⟳
```

## 2.8 Ask the Coach
```
Coach tab → type or pick suggested prompt ("What should I prune now?")
  → ⟳ assemble context (zone, month, weather, user's plants & recent logs)
  → streamed answer + cited actions → "Add to tasks" / "Save to library"
```

## 2.9 Build/edit the Garden Map
```
Map tab → "+ Add area" → choose type (raised bed / container / tree area / greenhouse / indoor / custom)
  → name, size (rows×cols for beds), sun exposure tag
  → drag to position → tap bed → "add plant" → drag plant chips into cells
  → companion-planting hint appears inline (green ✓ / amber ⚠ with reason)
```

## 2.10 Error/empty/edge states (designed, not afterthoughts)
- **No plants yet:** Dashboard shows "Add your first plant" hero + 3 sample tasks ("Set up a bed").
- **No weather (offline / denied):** Show last cached forecast with a "stale" chip; tasks still generate from history.
- **AI low confidence (<50%):** Card reframes to "Not sure — here are 2 possibilities + how to tell them apart," never a false certainty.
- **Diagnostic quota hit (free):** Soft paywall explaining Pro limit, with one "watch to unlock" or upgrade.

---

# 3. Wireframes

Low-fidelity text wireframes for the key screens. Dimensions assume a mobile viewport (~390pt wide).

## 3.1 Dashboard
```
┌─────────────────────────────────────┐
│  9B GrowOS            ☀ 78°  🔔  ⚙   │
├─────────────────────────────────────┤
│   ╭───────────────╮                  │
│   │   GARDEN      │   Health 86      │
│   │   HEALTH      │   ▲ +3 this wk   │
│   │     86        │   🔥 Streak 12   │
│   ╰───────────────╯                  │
├─────────────────────────────────────┤
│  TODAY                      3 tasks  │
│  ┌─────────────────────────────────┐ │
│  │ 💧 Water Bed 2          [ Done ]│ │
│  │ 🌿 Feed citrus          [ Done ]│ │
│  │ 🐛 Check aphids on roses[ Done ]│ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  ⚠ Heat wave Thu–Sat. Containers    │
│     will dry fast — +1 watering.     │
├─────────────────────────────────────┤
│  WEEK   M  T  W  T  F  S  S          │
│         78 80 82 95 96 94 88 °F      │
├─────────────────────────────────────┤
│ 🍅 Harvest ready (2)   📸 New photos │
├─────────────────────────────────────┤
│ [Home] [Map] [ ➕ ] [Coach] [Stats] │
└─────────────────────────────────────┘
```

## 3.2 Plant Profile
```
┌─────────────────────────────────────┐
│ ‹ Back        Cherry Tomato     ⋯    │
├─────────────────────────────────────┤
│  [ hero photo ]      Stage: Fruiting │
│  'Sungold' · Solanum lycopersicum    │
│  Bed 2 · Planted Mar 3 · Harvest ~Jun│
├─────────────────────────────────────┤
│  ☀ Full sun   💧 High   🌱 Loam      │
├─────────────────────────────────────┤
│  [ Water ] [ Feed ] [ Photo ] [ + ] │
├─────────────────────────────────────┤
│  TIMELINE                            │
│  ● Jun 14  💧 Watered 2 gal          │
│  ● Jun 12  📸 Photo                  │
│  ● Jun 10  🌿 Fed (fish emulsion)    │
│  ● Jun 08  🧪 pH 6.4 runoff          │
│  ● Jun 05  🐛 Aphids — treated       │
├─────────────────────────────────────┤
│  🤖 AI: Leaves slightly cupping —    │
│     likely heat stress, not disease. │
└─────────────────────────────────────┘
```

## 3.3 AI Diagnostics result
```
┌─────────────────────────────────────┐
│ ‹  Diagnosis                          │
├─────────────────────────────────────┤
│  [ uploaded photo ]                  │
├─────────────────────────────────────┤
│  Likely: Magnesium deficiency        │
│  Confidence  ▓▓▓▓▓▓▓░░  72%          │
│  Severity   ● Moderate                │
│  Priority   ▲ High                    │
├─────────────────────────────────────┤
│  WHY                                  │
│  • Interveinal yellowing on older    │
│    leaves, veins stay green          │
│  • Common in sandy 9b soils + heat   │
├─────────────────────────────────────┤
│  DO THIS                              │
│  1. Foliar Epsom salt 1 tbsp/gal     │
│  2. Recheck in 7 days                 │
│  3. Avoid over-watering               │
│  [ + Add 2 tasks ]   [ Save ]        │
└─────────────────────────────────────┘
```

## 3.4 Garden Map
```
┌─────────────────────────────────────┐
│  Map               ☀ exposure  +Add │
├─────────────────────────────────────┤
│   ┌─────┐  ┌─────┐     🍋            │
│   │Bed 1│  │Bed 2│    citrus         │
│   │▦▦▦▦ │  │▦▦▦  │    area           │
│   └─────┘  └─────┘                   │
│   ┌──────────┐     🌳 stone fruit    │
│   │ Greenhouse│                       │
│   └──────────┘   ▒ shade (PM)        │
├─────────────────────────────────────┤
│  Tap a bed to view · drag to move    │
└─────────────────────────────────────┘
```

## 3.5 Analytics
```
┌─────────────────────────────────────┐
│  Stats                  Season ▾     │
├─────────────────────────────────────┤
│  Harvest weight (lbs)                │
│   ▁▂▃▅▆█  trending up                │
├─────────────────────────────────────┤
│  12 plants · 4 beds · 38 harvests    │
│  Water 240 gal · Task done 92%       │
├─────────────────────────────────────┤
│  Yield per bed                       │
│  Bed1 ███████ 8.2 lb                 │
│  Bed2 ████ 4.1 lb                    │
└─────────────────────────────────────┘
```

---

# 4. Screen Inventory

Grouped by navigation stack. (Modals marked **M**, tabs **T**.)

**Auth stack**
1. Splash
2. Value carousel / Welcome
3. Sign in / Sign up
4. Location + zone confirm
5. Grow-type selection
6. First garden/bed/plant setup
7. Notifications permission

**Home (T)**
8. Dashboard
9. Health Score detail
10. Task list (all)
11. Task detail / complete **M**
12. Alerts inbox

**Map (T)**
13. Garden map (canvas)
14. Area editor **M**
15. Bed detail (cell grid)
16. Companion-planting helper **M**

**Plants (reachable from Map/Home/Search)**
17. Plant list / search
18. Plant profile
19. Plant timeline (full)
20. Add/edit plant **M**
21. Variety picker **M**

**Capture (➕ FAB) — quick-log modals**
22. Quick-log hub (water/feed/reading/photo/harvest/pest/diagnose)
23. Water log **M**
24. Feed log **M**
25. pH/EC/PPM reading **M**
26. Photo capture + journal **M**
27. Harvest log **M**
28. Pest log **M**
29. AI Diagnose flow **M**

**Coach (T)**
30. Coach chat
31. Suggested-prompts / topics
32. Saved answers

**Stats (T)**
33. Analytics dashboard
34. Metric detail (yield, water, health, streaks)

**Library**
35. Knowledge library home
36. Article / technique detail
37. My saved techniques
38. Add custom technique **M**

**Calendar**
39. Calendar (month)
40. Day detail
41. Seasonal recommendations

**Photo Journal**
42. Journal grid (by plant/bed/season)
43. Photo detail + before/after slider

**Settings/Profile**
44. Profile
45. Settings (theme, units, notifications)
46. Subscription / paywall **M**
47. Garden settings (location, microclimate)

**Total: ~47 screens** (≈30 are v1 critical; calendar detail, saved answers, custom-technique add can ship in late-MVP).

---

# 5. Navigation Structure

```
RootNavigator
├── AuthStack (unauthenticated)
│   └── Splash → Welcome → SignIn/SignUp → Onboarding(Location→GrowType→Setup→Notif)
│
└── AppTabs (authenticated)         ← bottom tab bar, 5 items
    ├── Home (Stack)
    │   ├── Dashboard
    │   ├── HealthScoreDetail
    │   ├── AllTasks
    │   └── AlertsInbox
    ├── Map (Stack)
    │   ├── GardenMap
    │   ├── BedDetail
    │   └── PlantProfile → PlantTimeline
    ├── ➕ Capture (modal launcher, not a screen — opens action sheet)
    │   └── [Water | Feed | Reading | Photo | Harvest | Pest | Diagnose]
    ├── Coach (Stack)
    │   ├── CoachChat
    │   └── SavedAnswers
    └── Stats (Stack)
        ├── Analytics
        └── MetricDetail

Cross-cutting (presented modally from anywhere):
  Settings, Profile, Subscription/Paywall, Calendar, KnowledgeLibrary, PhotoJournal
```

**Rules**
- The center **➕** is the highest-value action (logging). It's a launcher, never a buried menu item.
- Plant Profile is reachable from Home, Map, Search, and any timeline entry (deep-linkable).
- Paywall is a modal that can be triggered by any gated action and returns the user to where they were.
- Deep links: `9bgrowos://plant/{id}`, `9bgrowos://task/{id}`, `9bgrowos://diagnose`.

---

# 6. Database Schema (logical)

Postgres on Supabase. Conventions: `snake_case`, UUID PKs (`gen_random_uuid()`), `created_at`/`updated_at` timestamps on every table, soft tenancy via `user_id` (owner) for RLS. Logs are append-mostly; analytics read from them.

## 6.1 Entity overview

```
auth.users (Supabase managed)
   │
   └─< profiles (1:1)
         │
         └─< gardens ─< beds ─< bed_cells
                │         │
                │         └─< plants >── plant_varieties (catalog, shared)
                │                 │
                │                 ├─< water_logs
                │                 ├─< feed_logs        >── products (catalog/user)
                │                 ├─< ph_logs
                │                 ├─< ec_logs
                │                 ├─< harvest_logs
                │                 ├─< pest_logs ─< treatment_logs
                │                 ├─< photos
                │                 ├─< plant_notes
                │                 ├─< growth_metrics
                │                 └─< ai_diagnoses
                │
                ├─< tasks ─< reminders
                ├─< weather_data
                └─< health_scores (daily snapshots)

techniques / knowledge_articles (shared catalog) >── user_saved_techniques
seasonal_calendars (zone-keyed, shared)
subscriptions / entitlements
```

## 6.2 Key relationships & rules

- A **plant** belongs to exactly one garden and optionally one bed (a potted plant may have no bed but a location string). Many logs reference a plant; some logs (water/feed/reading) can target a **bed** instead of a single plant (`target_type` + `target_id` pattern OR nullable `plant_id`/`bed_id`). We use explicit nullable FKs for query clarity.
- **plant_varieties**, **products**, **techniques**, **knowledge_articles**, **seasonal_calendars** are catalog tables: globally readable, write-restricted (admin/service role). Users may create *private* products/varieties (`owner_id` set, `is_public=false`).
- **ai_diagnoses** stores model output + the source photo reference + structured result JSON.
- **health_scores** are computed daily by an Edge Function (cron) and stored for trend charts.
- **growth_metrics** holds measured values (height_cm, leaf_count, brix, etc.) — generic `metric_type`/`value` for extensibility (and future sensor ingestion).

## 6.3 Column-level notes (selected)

- Money/units: store amounts numeric + unit enum; never assume gallons vs liters — respect profile `unit_system`.
- pH stored as `numeric(4,2)`; EC as `numeric(6,2)` (mS/cm); PPM as integer.
- `quality_score` 1–5 smallint; `severity` enum `low|moderate|high|critical`.
- All photos live in Supabase Storage; DB stores `storage_path`, never the binary.
- Enums implemented as Postgres `enum` types for integrity + small index size.

---

# 7. Supabase SQL (DDL + RLS)

Run as ordered migrations. This is production-grade: extensions, enums, tables, indexes, triggers, and Row Level Security on every user-owned table.

```sql
-- ============================================================
-- 000_extensions.sql
-- ============================================================
create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "postgis";        -- optional: spatial map/sun calc (can defer)

-- ============================================================
-- 001_enums.sql
-- ============================================================
create type unit_system      as enum ('imperial','metric');
create type theme_pref        as enum ('system','light','dark');
create type area_type         as enum ('raised_bed','container','tree_area','greenhouse','indoor','custom');
create type sun_exposure      as enum ('full_sun','part_sun','part_shade','full_shade');
create type growth_stage      as enum ('seed','seedling','vegetative','flowering','fruiting','harvest','dormant','done');
create type water_source      as enum ('rain','hose','drip','watering_can','reservoir','other');
create type feed_type         as enum ('organic','synthetic','amendment','compost_tea','foliar');
create type feed_method       as enum ('soil_drench','foliar','granular','fertigation','top_dress');
create type severity_level    as enum ('low','moderate','high','critical');
create type task_status       as enum ('pending','done','skipped','snoozed');
create type task_priority     as enum ('low','medium','high','urgent');
create type task_category     as enum ('water','feed','prune','pest','harvest','soil','observe','ph','other');
create type diagnosis_source  as enum ('ai_photo','ai_text','manual');
create type sub_tier          as enum ('free','pro','pro_annual');

-- ============================================================
-- 002_profiles.sql
-- ============================================================
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_path   text,
  unit_system   unit_system not null default 'imperial',
  theme         theme_pref  not null default 'system',
  zone          text        not null default '9b',
  lat           double precision,
  lon           double precision,
  microclimate  text,                      -- free text: "coastal", "inland valley"...
  grow_types    text[]      not null default '{}',  -- ['vegetables','fruit_trees',...]
  onboarded     boolean     not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- 003_catalog.sql  (globally readable, service-writable)
-- ============================================================
create table plant_varieties (
  id            uuid primary key default gen_random_uuid(),
  common_name   text not null,
  variety       text,
  species       text,
  category      text,                       -- vegetable/fruit_tree/herb/flower/berry
  sun_req       sun_exposure,
  water_req     text,                        -- low/medium/high
  soil_type     text,
  days_to_harvest int,
  zone9b_notes  text,
  is_public     boolean not null default true,
  owner_id      uuid references auth.users(id) on delete cascade, -- null = official
  created_at    timestamptz not null default now()
);
create index on plant_varieties (common_name);
create index on plant_varieties (owner_id);

create table products (
  id            uuid primary key default gen_random_uuid(),
  brand         text,
  name          text not null,
  feed_type     feed_type,
  npk           text,                        -- "5-1-1"
  default_dose  numeric,
  default_unit  text,
  is_public     boolean not null default true,
  owner_id      uuid references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now()
);

create table knowledge_articles (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  category      text,
  body_md       text not null,
  zone_specific boolean not null default true,
  created_at    timestamptz not null default now()
);

create table techniques (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  category      text,                        -- composting/pruning/irrigation...
  body_md       text not null,
  is_public     boolean not null default true,
  owner_id      uuid references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now()
);

create table seasonal_calendars (
  id            uuid primary key default gen_random_uuid(),
  zone          text not null default '9b',
  month         smallint not null check (month between 1 and 12),
  category      task_category not null,      -- plant/harvest/feed/prune/spray...
  crop          text,                        -- "citrus", "tomato", "stone_fruit"
  action        text not null,               -- "Fertilize citrus", "Prune peaches"
  notes         text
);
create index on seasonal_calendars (zone, month);

-- ============================================================
-- 004_gardens_beds_plants.sql
-- ============================================================
create table gardens (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null default 'My Garden',
  lat           double precision,
  lon           double precision,
  zone          text not null default '9b',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on gardens (user_id);

create table beds (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  garden_id     uuid not null references gardens(id) on delete cascade,
  name          text not null,
  area_type     area_type not null default 'raised_bed',
  rows          smallint default 1,
  cols          smallint default 1,
  pos_x         real default 0,              -- map canvas coordinates
  pos_y         real default 0,
  width         real default 100,
  height        real default 100,
  sun_exposure  sun_exposure,
  irrigation_zone text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on beds (garden_id);
create index on beds (user_id);

create table plants (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  garden_id     uuid not null references gardens(id) on delete cascade,
  bed_id        uuid references beds(id) on delete set null,
  variety_id    uuid references plant_varieties(id) on delete set null,
  name          text not null,               -- user nickname / label
  species       text,
  plant_date    date,
  expected_harvest date,
  stage         growth_stage not null default 'seedling',
  sun_req       sun_exposure,
  water_req     text,
  soil_type     text,
  location_text text,                         -- for potted/no-bed
  cell_row      smallint,                     -- position within bed grid
  cell_col      smallint,
  hero_photo_id uuid,                          -- set after first photo (FK added later, nullable)
  is_archived   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on plants (garden_id);
create index on plants (bed_id);
create index on plants (user_id);

-- ============================================================
-- 005_logs.sql
-- ============================================================
create table photos (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plant_id      uuid references plants(id) on delete cascade,
  bed_id        uuid references beds(id) on delete set null,
  storage_path  text not null,
  taken_at      timestamptz not null default now(),
  season        text,                         -- derived: spring/summer/fall/winter
  caption       text,
  created_at    timestamptz not null default now()
);
create index on photos (plant_id, taken_at desc);
create index on photos (user_id);

create table water_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plant_id      uuid references plants(id) on delete cascade,
  bed_id        uuid references beds(id) on delete cascade,
  watered_at    timestamptz not null default now(),
  amount        numeric,
  unit          text default 'gal',
  source        water_source default 'hose',
  notes         text,
  created_at    timestamptz not null default now(),
  check (plant_id is not null or bed_id is not null)
);
create index on water_logs (plant_id, watered_at desc);
create index on water_logs (bed_id, watered_at desc);

create table feed_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plant_id      uuid references plants(id) on delete cascade,
  bed_id        uuid references beds(id) on delete cascade,
  product_id    uuid references products(id) on delete set null,
  product_text  text,                          -- fallback if not in catalog
  feed_type     feed_type,
  dose          numeric,
  unit          text,
  method        feed_method,
  fed_at        timestamptz not null default now(),
  notes         text,
  created_at    timestamptz not null default now(),
  check (plant_id is not null or bed_id is not null)
);
create index on feed_logs (plant_id, fed_at desc);

create table ph_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plant_id      uuid references plants(id) on delete cascade,
  bed_id        uuid references beds(id) on delete cascade,
  input_ph      numeric(4,2),
  runoff_ph     numeric(4,2),
  measured_at   timestamptz not null default now(),
  notes         text,
  created_at    timestamptz not null default now()
);
create index on ph_logs (plant_id, measured_at desc);

create table ec_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plant_id      uuid references plants(id) on delete cascade,
  bed_id        uuid references beds(id) on delete cascade,
  input_ec      numeric(6,2),
  runoff_ec     numeric(6,2),
  ppm           integer,
  measured_at   timestamptz not null default now(),
  notes         text,
  created_at    timestamptz not null default now()
);
create index on ec_logs (plant_id, measured_at desc);

create table harvest_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plant_id      uuid not null references plants(id) on delete cascade,
  harvested_at  date not null default current_date,
  quantity      numeric,
  quantity_unit text default 'count',
  weight        numeric,
  weight_unit   text default 'lb',
  quality_score smallint check (quality_score between 1 and 5),
  flavor_notes  text,
  created_at    timestamptz not null default now()
);
create index on harvest_logs (plant_id, harvested_at desc);

create table pest_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plant_id      uuid references plants(id) on delete cascade,
  bed_id        uuid references beds(id) on delete cascade,
  pest_type     text not null,
  severity      severity_level not null default 'low',
  photo_id      uuid references photos(id) on delete set null,
  observed_at   timestamptz not null default now(),
  resolved      boolean not null default false,
  notes         text,
  created_at    timestamptz not null default now()
);
create index on pest_logs (plant_id, observed_at desc);

create table treatment_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  pest_log_id   uuid references pest_logs(id) on delete cascade,
  plant_id      uuid references plants(id) on delete cascade,
  treatment     text not null,                 -- "neem oil", "BT", "insecticidal soap"
  applied_at    timestamptz not null default now(),
  outcome       text,                          -- "resolved", "improved", "no change"
  notes         text,
  created_at    timestamptz not null default now()
);
create index on treatment_logs (pest_log_id);

create table plant_notes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plant_id      uuid not null references plants(id) on delete cascade,
  body          text not null,
  created_at    timestamptz not null default now()
);
create index on plant_notes (plant_id, created_at desc);

create table growth_metrics (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plant_id      uuid not null references plants(id) on delete cascade,
  metric_type   text not null,                 -- height_cm, leaf_count, brix, trunk_dia
  value         numeric not null,
  measured_at   timestamptz not null default now(),
  source        text default 'manual',         -- manual | sensor | ai_estimate
  created_at    timestamptz not null default now()
);
create index on growth_metrics (plant_id, metric_type, measured_at);

create table ai_diagnoses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plant_id      uuid references plants(id) on delete set null,
  photo_id      uuid references photos(id) on delete set null,
  source        diagnosis_source not null default 'ai_photo',
  likely_problem text,
  confidence    numeric(4,3),                  -- 0.000–1.000
  severity      severity_level,
  priority      task_priority,
  causes        jsonb,                         -- ["heat stress","low cal"]
  actions       jsonb,                         -- [{step, detail}]
  raw_result    jsonb,                         -- full model payload for audit
  model         text,                          -- "gpt-4o" etc.
  created_at    timestamptz not null default now()
);
create index on ai_diagnoses (plant_id, created_at desc);

-- ============================================================
-- 006_tasks_weather_health.sql
-- ============================================================
create table tasks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  garden_id     uuid references gardens(id) on delete cascade,
  plant_id      uuid references plants(id) on delete cascade,
  bed_id        uuid references beds(id) on delete cascade,
  title         text not null,
  category      task_category not null default 'other',
  priority      task_priority not null default 'medium',
  status        task_status not null default 'pending',
  due_date      date,
  est_minutes   smallint,
  source        text default 'engine',         -- engine | ai | user | calendar
  source_ref    uuid,                          -- e.g. ai_diagnosis id
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on tasks (user_id, due_date, status);
create index on tasks (plant_id);

create table reminders (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  task_id       uuid references tasks(id) on delete cascade,
  remind_at     timestamptz not null,
  push_sent     boolean not null default false,
  created_at    timestamptz not null default now()
);
create index on reminders (remind_at) where push_sent = false;

create table weather_data (
  id            uuid primary key default gen_random_uuid(),
  garden_id     uuid not null references gardens(id) on delete cascade,
  observed_at   timestamptz not null,
  type          text not null,                 -- 'current' | 'forecast'
  temp_f        numeric,
  temp_min_f    numeric,
  temp_max_f    numeric,
  humidity      numeric,
  wind_mph      numeric,
  precip_prob   numeric,
  condition     text,
  raw           jsonb,
  created_at    timestamptz not null default now()
);
create index on weather_data (garden_id, observed_at);

create table health_scores (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  garden_id     uuid not null references gardens(id) on delete cascade,
  score         smallint not null check (score between 0 and 100),
  breakdown     jsonb,                         -- {watering:90, pests:70, ...}
  for_date      date not null default current_date,
  created_at    timestamptz not null default now(),
  unique (garden_id, for_date)
);
create index on health_scores (garden_id, for_date desc);

create table user_saved_techniques (
  user_id       uuid not null references auth.users(id) on delete cascade,
  technique_id  uuid not null references techniques(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (user_id, technique_id)
);

create table subscriptions (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  tier          sub_tier not null default 'free',
  store         text,                          -- 'app_store' | 'play' | 'stripe'
  expires_at    timestamptz,
  rc_app_user_id text,                         -- RevenueCat id
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- 007_triggers.sql  (updated_at maintenance)
-- ============================================================
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array['profiles','gardens','beds','plants','tasks','subscriptions']
  loop
    execute format(
      'create trigger trg_%1$s_updated before update on %1$s
       for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- auto-create profile on signup
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'name','Gardener'));
  insert into subscriptions (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- 008_rls.sql  (Row Level Security)
-- ============================================================
-- Enable RLS on every user-owned table
alter table profiles            enable row level security;
alter table gardens             enable row level security;
alter table beds                enable row level security;
alter table plants              enable row level security;
alter table photos              enable row level security;
alter table water_logs          enable row level security;
alter table feed_logs           enable row level security;
alter table ph_logs             enable row level security;
alter table ec_logs             enable row level security;
alter table harvest_logs        enable row level security;
alter table pest_logs           enable row level security;
alter table treatment_logs      enable row level security;
alter table plant_notes         enable row level security;
alter table growth_metrics      enable row level security;
alter table ai_diagnoses        enable row level security;
alter table tasks               enable row level security;
alter table reminders           enable row level security;
alter table weather_data        enable row level security;
alter table health_scores       enable row level security;
alter table user_saved_techniques enable row level security;
alter table subscriptions       enable row level security;
alter table products            enable row level security;
alter table plant_varieties     enable row level security;
alter table techniques          enable row level security;

-- Owner policy generator: full CRUD where user_id = auth.uid()
do $$
declare t text;
begin
  foreach t in array array[
    'gardens','beds','plants','photos','water_logs','feed_logs','ph_logs',
    'ec_logs','harvest_logs','pest_logs','treatment_logs','plant_notes',
    'growth_metrics','ai_diagnoses','tasks','reminders','health_scores'
  ]
  loop
    execute format($f$
      create policy "%1$s_owner_select" on %1$s for select using (user_id = auth.uid());
      create policy "%1$s_owner_insert" on %1$s for insert with check (user_id = auth.uid());
      create policy "%1$s_owner_update" on %1$s for update using (user_id = auth.uid());
      create policy "%1$s_owner_delete" on %1$s for delete using (user_id = auth.uid());
    $f$, t);
  end loop;
end $$;

-- profiles: self only
create policy "profile_self" on profiles for all
  using (id = auth.uid()) with check (id = auth.uid());

-- subscriptions: read self; writes via service role (store webhooks)
create policy "sub_self_read" on subscriptions for select using (user_id = auth.uid());

-- weather_data tied to a garden the user owns
create policy "weather_owner" on weather_data for all
  using (exists (select 1 from gardens g where g.id = weather_data.garden_id and g.user_id = auth.uid()))
  with check (exists (select 1 from gardens g where g.id = weather_data.garden_id and g.user_id = auth.uid()));

-- saved techniques: self
create policy "saved_self" on user_saved_techniques for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- catalog tables: public read; user can write their own private rows
create policy "varieties_read"  on plant_varieties for select using (is_public or owner_id = auth.uid());
create policy "varieties_write" on plant_varieties for insert with check (owner_id = auth.uid());
create policy "products_read"   on products        for select using (is_public or owner_id = auth.uid());
create policy "products_write"  on products        for insert with check (owner_id = auth.uid());
create policy "techniques_read" on techniques       for select using (is_public or owner_id = auth.uid());
create policy "techniques_write" on techniques      for insert with check (owner_id = auth.uid());

-- knowledge_articles & seasonal_calendars: public read only (no RLS needed if you prefer,
-- but if enabled:)
alter table knowledge_articles enable row level security;
alter table seasonal_calendars enable row level security;
create policy "kb_read"  on knowledge_articles for select using (true);
create policy "cal_read" on seasonal_calendars for select using (true);

-- ============================================================
-- 009_storage.sql  (Supabase Storage policies)
-- ============================================================
-- Bucket 'plant-photos' (private). Path convention: {user_id}/{plant_id}/{uuid}.jpg
insert into storage.buckets (id, name, public) values ('plant-photos','plant-photos', false)
  on conflict do nothing;

create policy "photos_read_own" on storage.objects for select
  using (bucket_id = 'plant-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos_write_own" on storage.objects for insert
  with check (bucket_id = 'plant-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos_delete_own" on storage.objects for delete
  using (bucket_id = 'plant-photos' and (storage.foldername(name))[1] = auth.uid()::text);
```

> **Migration ordering:** run files 000→009 in sequence. Catalog seed data (varieties, products, knowledge_articles, seasonal_calendars for Zone 9b) ships as `010_seed.sql` populated by the content team.

---

# 8. API Architecture

Supabase gives us a Postgres REST/Realtime layer for free; we use **Edge Functions** for anything requiring secrets (OpenAI, OpenWeather), heavy computation (health score, task generation), or third-party webhooks (RevenueCat).

## 8.1 Access patterns

- **CRUD (plants, logs, tasks):** client → `supabase-js` (PostgREST) directly, protected by RLS. No custom backend needed.
- **Realtime:** subscribe to `tasks`, `health_scores` for live dashboard updates.
- **Secrets / AI / external:** client → Edge Function (verifies JWT) → external API → DB.

## 8.2 Edge Functions (Deno)

| Function | Trigger | Responsibility |
|---|---|---|
| `diagnose` | POST (client) | Receives photo path(s)+context → OpenAI Vision → parse to structured JSON → insert `ai_diagnoses` → return result |
| `coach` | POST (client, streaming) | Assemble context (zone, month, weather, user plants & recent logs) → OpenAI chat (stream) → return; optional tool-calls create tasks |
| `generate-tasks` | Cron (daily 5am local) + on-demand | Run task rules engine per garden → upsert `tasks` for the day |
| `compute-health` | Cron (daily) | Compute `health_scores` per garden from log recency/ranges/pest state |
| `sync-weather` | Cron (every 3h) | OpenWeather One Call → upsert `weather_data` → derive weather alerts → create weather tasks |
| `send-reminders` | Cron (every 15m) | Query due `reminders` → Expo Push → mark sent |
| `rc-webhook` | Webhook (RevenueCat) | Update `subscriptions` tier/expiry |
| `predict-watering` | On insert (water_log) or on-demand | Recompute predicted next-water per plant/bed |

## 8.3 Representative contracts

**POST /functions/v1/diagnose**
```jsonc
// request
{ "photo_paths": ["{uid}/{plant}/abc.jpg"], "plant_id": "uuid", "symptom_text": "yellow lower leaves" }
// response
{
  "diagnosis_id": "uuid",
  "likely_problem": "Magnesium deficiency",
  "confidence": 0.72,
  "severity": "moderate",
  "priority": "high",
  "causes": ["sandy soil leaching", "heat + heavy fruiting"],
  "actions": [
    { "step": "Foliar Epsom salt", "detail": "1 tbsp/gal, spray AM" },
    { "step": "Recheck in 7 days", "detail": "look for new growth greening" }
  ]
}
```

**POST /functions/v1/coach** (SSE stream)
```jsonc
{ "message": "When should I fertilize my citrus?", "thread_id": "uuid?" }
// streams tokens; final event includes structured "suggested_tasks":[...]
```

**Task rules engine (inside generate-tasks)** — deterministic rules + calendar + AI fallback:
```
For each plant:
  - if days since last water_log > variety.water_interval(adjusted for weather) → WATER task
  - if days since last feed_log > schedule_for(stage, category) → FEED task
  - if seasonal_calendars matches (zone, month, crop) → calendar task (prune/spray/plant)
  - if open pest_log unresolved > 3 days → follow-up CHECK task
  - if expected_harvest within 3 days OR stage='harvest' → HARVEST READY
For garden weather:
  - heat_max_f >= 95 next 72h → "Increase watering for containers" task + alert
  - frost (min_f <= 36) → "Protect frost-sensitive plants" task
Dedup against existing pending tasks; assign priority by (severity, time-sensitivity).
```

**Health score formula (compute-health)** — weighted 0–100:
```
score = round(
  0.30 * watering_consistency +   // % plants watered within their interval
  0.20 * feeding_adherence +      // recent feeds vs schedule
  0.20 * pest_pressure_inverse +  // (1 - open/severe pests ratio)
  0.15 * ph_ec_in_range +         // % readings within target band
  0.15 * task_completion_rate     // last 14 days
)
breakdown stored as jsonb for the radial detail screen.
```

## 8.4 Security & cost controls
- All Edge Functions verify the Supabase JWT (`Authorization` header) and derive `user_id` server-side — never trust client-sent ids.
- OpenAI/OpenWeather keys live in Edge secrets only.
- Per-user rate limits stored in a lightweight `usage_counters` table or KV; free tier: e.g. 5 diagnoses + 10 coach msgs/month.
- Photo uploads go straight to Storage via signed URL; the diagnose function reads from Storage, never proxies the binary through the client twice.

---

# 9. Folder Structure

Expo (managed) + TypeScript + Expo Router (file-based). Feature-first organization.

```
9b-growos/
├── app.json / app.config.ts        # Expo config (icons, splash, deep links, EAS)
├── eas.json                        # build profiles: development / preview / production
├── package.json
├── tsconfig.json
├── .env / .env.local               # SUPABASE_URL, SUPABASE_ANON_KEY (public)
├── supabase/
│   ├── migrations/                 # 000..010 SQL from section 7
│   ├── functions/                  # Edge Functions
│   │   ├── diagnose/index.ts
│   │   ├── coach/index.ts
│   │   ├── generate-tasks/index.ts
│   │   ├── compute-health/index.ts
│   │   ├── sync-weather/index.ts
│   │   ├── send-reminders/index.ts
│   │   ├── predict-watering/index.ts
│   │   ├── rc-webhook/index.ts
│   │   └── _shared/                # auth, openai client, supabase admin client
│   └── seed/                       # zone-9b catalog seed data
└── src/
    ├── app/                        # Expo Router routes
    │   ├── _layout.tsx             # RootNavigator + providers
    │   ├── (auth)/
    │   │   ├── welcome.tsx
    │   │   ├── sign-in.tsx
    │   │   └── onboarding/[step].tsx
    │   └── (tabs)/
    │       ├── _layout.tsx         # bottom tabs + center FAB
    │       ├── index.tsx           # Dashboard
    │       ├── map.tsx
    │       ├── coach.tsx
    │       ├── stats.tsx
    │       ├── plant/[id].tsx
    │       ├── bed/[id].tsx
    │       ├── calendar.tsx
    │       ├── library/index.tsx
    │       └── library/[slug].tsx
    ├── features/                   # feature modules (vertical slices)
    │   ├── dashboard/  { components/, hooks/, queries.ts }
    │   ├── plants/
    │   ├── map/
    │   ├── logging/    # water/feed/ph/ec/harvest/pest quick-logs
    │   ├── photos/
    │   ├── diagnostics/
    │   ├── coach/
    │   ├── tasks/
    │   ├── weather/
    │   ├── analytics/
    │   ├── calendar/
    │   ├── knowledge/
    │   └── subscription/
    ├── components/                 # shared UI primitives (design system)
    │   ├── ui/  { Button, Card, Sheet, Stat, Chip, Ring, Toast, Field }
    │   ├── charts/ { LineChart, BarChart, Sparkline, RadialScore }
    │   └── layout/ { Screen, Header, TabBarFab }
    ├── lib/
    │   ├── supabase.ts             # configured client + typed Database
    │   ├── queryClient.ts          # TanStack Query + offline persistence
    │   ├── notifications.ts        # Expo push registration
    │   ├── storage.ts              # photo upload (signed url) helpers
    │   ├── units.ts                # imperial/metric conversion
    │   └── analytics.ts            # event tracking (PostHog/Amplitude)
    ├── hooks/                      # cross-feature hooks (useSession, useGarden)
    ├── store/                      # zustand stores (ui state, draft logs, offline queue)
    ├── theme/                      # tokens, light/dark palettes, typography
    ├── types/                      # generated supabase types + domain types
    └── utils/                      # date, season, formatting
```

**Why this shape:** feature folders keep a vertical slice (UI + data + logic) together so a contributor can own "diagnostics" end-to-end; `components/ui` is the only place visual primitives live; `supabase/` is colocated so migrations + functions version with the app.

---

# 10. React Native Component Architecture

## 10.1 Layering
```
Screens (routes)                ← compose features, own navigation params
   └─ Feature components         ← e.g. <TodayTasks/>, <HealthRing/>, <DiagnoseFlow/>
        └─ UI primitives         ← <Card/>, <Button/>, <Stat/>, <Chip/>, <RadialScore/>
             └─ Theme tokens     ← colors, spacing, type, radius
Data: TanStack Query hooks (queries.ts per feature) → supabase-js → Postgres (RLS)
State: server state = Query cache; ephemeral UI = Zustand; forms = react-hook-form
```

## 10.2 Key components

| Component | Props (sketch) | Notes |
|---|---|---|
| `<RadialScore value breakdown/>` | 0–100 + segments | Dashboard hero; animated (Reanimated) |
| `<TodayTasks/>` | — (reads useTasks) | Swipe-to-complete, optimistic |
| `<WeatherStrip/>` | forecast[] | 7-day temps + alert chips |
| `<QuickLogSheet kind/>` | water/feed/... | Bottom sheet, remembers last values |
| `<PlantTimeline plantId/>` | unified feed | Merges logs/photos/diagnoses by date |
| `<BeforeAfterSlider a b/>` | two photo uris | Pan gesture reveal |
| `<DiagnoseResult data/>` | diagnosis | Confidence bar, action list, add-tasks |
| `<CoachChat threadId/>` | — | Streamed messages, suggested prompts |
| `<MapCanvas/>` | beds, plants | Reanimated/Gesture drag-drop, snap grid |
| `<YieldBarChart/>` | series | Recharts (web) / victory-native (native) |
| `<Paywall trigger/>` | gated action | RevenueCat offerings |

## 10.3 Data-fetching pattern (example)
```ts
// features/tasks/queries.ts
export const useTodayTasks = () => {
  const { user } = useSession();
  return useQuery({
    queryKey: ['tasks', 'today', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .lte('due_date', today())
        .order('priority', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
};

export const useCompleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      supabase.from('tasks').update({ status: 'done', completed_at: nowISO() }).eq('id', id),
    onMutate: async (id) => { /* optimistic: flip status in cache */ },
    onSettled: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
};
```

## 10.4 Offline-first
- TanStack Query persisted to MMKV; mutations queued via a Zustand `offlineQueue` and flushed on reconnect (NetInfo).
- Photo uploads: write file to local FS + create a pending `photos` row marker; background-upload then patch `storage_path`.

---

# 11. Design System

Inspired by WHOOP / Oura (data-as-hero), Linear/Arc (crisp surfaces), Apple Health (calm aggregation).

## 11.1 Color tokens

```
Brand
  forest        #1B4332   (primary — deep forest green)
  forest-600    #2D6A4F
  sage          #95D5B2   (secondary)
  sage-200      #D8F3DC
  citrus        #FF8C42   (accent — calls to action, alerts-positive)
  citrus-600    #E8722B

Neutrals (charcoal / off-white spine)
  ink           #14181A   (charcoal — dark bg base)
  surface-dark  #1C2124
  surface-dark2 #232A2E
  paper         #FAF8F3   (off-white — light bg base)
  surface-light #FFFFFF
  line          #E4E6E2 / dark #2A3135

Semantic
  success       #40916C
  warning       #F4A62A   (heat)
  danger        #E5484D   (frost/pest critical)
  info          #4C8DAE
```

**Dark mode** (default for the "OS" feel): `ink` background, `surface-dark` cards, sage/citrus accents pop. **Light mode**: `paper` background, white cards, forest text.

## 11.2 Typography
- Display/UI: **Inter** (or SF Pro on iOS) — tight, modern.
- Numerals/metrics: tabular figures, slightly heavier weight for scores.
- Scale: `display 34/40`, `title 22/28`, `headline 17/22 semibold`, `body 15/21`, `caption 13/18`, `mono` for pH/EC values.

## 11.3 Spacing, radius, elevation
- Spacing scale (pt): 4, 8, 12, 16, 20, 24, 32, 48.
- Radius: cards 20, chips 999 (pill), inputs 12, sheets 28 top.
- Elevation: subtle — dark mode uses border + faint inner glow rather than heavy shadows; light mode uses soft shadow (y2, blur 12, 6% black).

## 11.4 Components spec (visual)
- **Cards:** rounded-20, 1px hairline border in dark, soft shadow in light, 16 padding.
- **Health Ring:** thick radial, sage→citrus gradient by score band (0–59 danger, 60–79 warning, 80–100 success).
- **Buttons:** primary = forest fill / off-white text; accent = citrus fill; ghost = border only. 48pt min height.
- **FAB (center tab):** citrus circle, elevated, opens quick-log action sheet.
- **Chips:** category-colored, pill, used for tags/alerts/companion hints.
- **Charts:** thin 2px lines, gridlines at 8% opacity, single accent per series, no chartjunk.

## 11.5 Motion
- Reanimated springs (stiffness ~180, damping ~20). Score ring counts up on load. Task complete = check + subtle haptic. Harvest record = confetti + medium haptic. Sheets slide with overshoot.

## 11.6 Iconography & illustration
- Line icons (Lucide / Phosphor), 1.75 stroke. Custom plant/leaf glyphs for categories. Empty states use simple sage line illustrations, never clip-art.

---

# 12. User Stories

Format: *As a [persona], I want [capability] so that [outcome].* Grouped by epic; each has acceptance criteria (AC).

**Epic: Daily guidance**
- As Renee, I want to open the app and see what to do today so that I don't have to remember or research. *AC: Dashboard shows ≤5 prioritized tasks within 1.5s; completing one updates score + streak instantly.*
- As Renee, I want to complete a task in one tap so that logging isn't a chore. *AC: "Water Bed 2" → one tap marks done and writes a water_log with sensible defaults.*

**Epic: Plants & beds**
- As Omar, I want each plant to have a profile with a full timeline so that I can see its whole history. *AC: timeline merges water/feed/ph/photo/harvest/pest/diagnosis chronologically.*
- As Renee, I want to lay out my beds visually and drag plants in so that the app matches my real garden. *AC: drag-drop persists pos + cell; companion hint shows on placement.*

**Epic: Logging**
- As any user, I want to log watering/feeding/readings in <15s so that I'll actually keep doing it. *AC: each quick-log sheet pre-fills last values; saves offline.*
- As Omar, I want to record pH/EC/PPM (input + runoff) and see charts so that I can dial in my soil. *AC: out-of-range reading raises an alert + annotates chart.*

**Epic: AI**
- As Renee, I want to photograph a sick leaf and get a likely diagnosis with what to do so that I can fix it fast. *AC: result shows problem, confidence, severity, ranked actions; "add tasks" creates tasks.*
- As Frank, I want to ask the coach "when do I prune my peaches" and get a Zone-9b answer so that I time it right. *AC: answer references his location/month; offers to add a pruning task.*

**Epic: Harvest & analytics**
- As Omar, I want yield per plant/bed/season so that I know what's worth growing. *AC: stats screen shows yield bars + trend; records trigger celebration.*

**Epic: Weather**
- As Renee, I want to be warned before a heat wave or frost so that I can protect my plants. *AC: push + dashboard alert when forecast crosses thresholds; auto-creates a protective task.*

**Epic: Habit & retention**
- As Renee, I want a streak and weekly progress so that I stay motivated. *AC: streak increments on any logging day; weekly recap surfaces Sundays.*

**Epic: Knowledge**
- As any user, I want a library of 9b techniques and to save my own so that I can learn and reference. *AC: read curated articles; create/save personal techniques.*

**Epic: Account & monetization**
- As a free user, I want to try core features and understand what Pro adds so that upgrading feels fair. *AC: free caps on diagnoses/coach; paywall explains value, restores purchases.*

---

# 13. MVP Roadmap

**Goal:** ship a daily-habit product that delivers the "what to do today" promise + the AI hooks, in ~12–14 weeks with a small team (2 mobile, 1 backend/AI, 1 designer, 1 PM).

**Phase 0 — Foundations (Weeks 1–2)**
- Expo + TS + Expo Router scaffold, theme/design system primitives.
- Supabase project, migrations 000–009, RLS, Storage bucket, generated types.
- Auth (email + Apple + Google), profile auto-creation, onboarding skeleton.

**Phase 1 — Core data + logging (Weeks 3–5)**
- Gardens/Beds/Plants CRUD + variety picker + catalog seed.
- Quick-log: water, feed, pH/EC, photo, harvest, pest. Offline queue.
- Plant profile + unified timeline.

**Phase 2 — The daily answer (Weeks 6–8)**
- Weather sync function + weather strip + alerts.
- Task rules engine (`generate-tasks`) + dashboard + one-tap complete + streaks.
- Health score function + radial ring + breakdown.

**Phase 3 — AI (Weeks 9–11)**
- `diagnose` Edge Function + capture flow + result UI + add-tasks.
- `coach` Edge Function (streaming) + chat UI + context assembly + suggested prompts.

**Phase 4 — Map, analytics, library, polish (Weeks 12–14)**
- Garden map drag-drop + companion hints.
- Analytics (totals, yield, water, streaks) + charts.
- Knowledge library (read) + calendar (9b seasonal).
- Push notifications, paywall + RevenueCat, empty/error states, accessibility pass.
- TestFlight / internal track → beta.

**MVP definition of done:** a user can onboard, build a garden, log everything in seconds, get a correct daily task list + health score, diagnose a photo, ask the coach, and see their harvests add up — all offline-tolerant, both themes, with a working subscription.

---

# 14. V2 Roadmap

Themes: deepen intelligence, add light social, open the platform.

- **Personalized coach (closed loop):** grade past recommendations against outcomes (yield, pest recurrence) to tune advice per user/microclimate.
- **Predictive engine:** forecast pest pressure and deficiencies from history + weather ("aphid risk high next week").
- **Hardware sensors:** Bluetooth soil moisture/EC/temperature probes → `growth_metrics`/sensor ingestion (schema already supports `source`).
- **Companion-planting & succession planner:** "what to plant after tomatoes" with bed-aware rotation.
- **Photo growth AI:** auto-estimate growth stage and size from journal photos; auto before/after.
- **Light social:** follow neighbors in your zone, share gardens, anonymized local "what's thriving now."
- **Marketplace (curated):** seed/amendment recommendations with affiliate links tied to your plan.
- **Web app / iPad layout:** large-screen analytics + map editing.
- **Multi-garden & shared gardens:** community plots, household sharing (roles).
- **Smart irrigation integration:** Rachio/B-hyve to act on watering tasks automatically.
- **Geo-expansion:** generalize the coach beyond 9b (zone-parameterized knowledge base).

---

# 15. Monetization Strategy

**Model:** freemium subscription (consumer prosumer), with optional future affiliate revenue.

**Free (acquisition + habit):**
- Up to ~2 beds / ~10 plants, all manual logging, basic dashboard + tasks, weather, streaks.
- Limited AI: e.g. 5 diagnoses + 10 coach messages / month.
- Read-only knowledge library.

**Pro — $7.99/mo or $49.99/yr (~48% off):**
- Unlimited beds/plants, unlimited AI diagnostics + coach.
- Advanced analytics (yield per plant/bed/season, trends, comparisons).
- Photo journal comparisons (seasonal/monthly), before/after.
- Predictive alerts, priority push, custom techniques, data export.
- Map advanced (sun/shade + irrigation zones), calendar full.

**Pricing rationale:** WHOOP/Oura-style "operating system for X" products sustain $5–10/mo when they deliver a daily decision. Annual anchors LTV; the AI cost (OpenAI per call) is bounded by free-tier caps and amortized across Pro's flat fee.

**Future revenue (v2+):**
- Curated affiliate (seeds, amendments, sensors) — recommendation-driven, never ad clutter.
- Hardware bundle (branded soil probe) → recurring data into the app.
- One-time "Garden Setup" expert pack / regional packs.

**Unit economics guardrails:** track AI cost per active user; keep blended AI COGS < 25% of Pro revenue via caching, smaller models for routine coach turns, and vision calls only on explicit diagnose. Target CAC payback < 6 months via organic/content-led acquisition.

---

# 16. Launch Strategy

**Positioning:** "The garden operating system for Southern California." Win the niche first (Zone 9b is large, affluent, plant-obsessed: SoCal, parts of AZ/TX/FL), then generalize.

**Pre-launch (4–6 weeks):**
- Landing page + waitlist; capture zone + crops for cohorting.
- Build in public on gardening TikTok/Instagram/YouTube/Reddit (r/gardening, r/citrus, local FB groups).
- Partner with 5–10 SoCal gardening creators for early access + content.

**Beta (TestFlight / Play internal):**
- 200–500 hand-picked 9b gardeners; weekly feedback loops; tune the task engine + coach on real gardens (the riskiest quality bar).

**Public launch:**
- Product Hunt + App Store/Play, timed to **early spring** (peak planting intent in 9b).
- Creator content blitz: "I let an app run my garden for 30 days."
- ASO around "garden planner," "plant care tracker," "Zone 9b," "citrus care."
- Seed the knowledge library with genuinely useful 9b content as an SEO/discovery moat.

**Growth loops:**
- Habit loop (daily tasks + streaks) drives retention.
- Harvest celebration + shareable "season recap" cards drive referral.
- Free AI taste → Pro conversion at the moment of value (a real diagnosis).

**Metrics gates before scaling spend:** D30 ≥ 35%, task-trust (completed/generated) ≥ 60%, free→Pro ≥ 5%. Hit these on the niche before paid acquisition or geo-expansion.

---

# 17. Technical Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         MOBILE CLIENT (Expo / RN / TS)                 │
│  Expo Router · TanStack Query (+MMKV persist) · Zustand · Reanimated   │
│  Design system · Offline queue · Expo Notifications · RevenueCat SDK   │
└───────────┬───────────────────────────────────────────┬───────────────┘
            │ supabase-js (JWT, RLS)                      │ HTTPS (JWT)
            ▼                                             ▼
┌───────────────────────────┐               ┌──────────────────────────────┐
│   SUPABASE PLATFORM        │               │   EDGE FUNCTIONS (Deno)        │
│  ┌──────────────────────┐  │   invoke      │  diagnose · coach              │
│  │ Postgres + RLS        │◀─┼───────────────│  generate-tasks · compute-     │
│  │  profiles, gardens,   │  │   read/write  │  health · sync-weather ·       │
│  │  beds, plants, logs,  │──┼──────────────▶│  send-reminders · predict-     │
│  │  tasks, weather,      │  │   (service)   │  watering · rc-webhook         │
│  │  health_scores, subs  │  │               └───────┬───────────┬──────────┘
│  └──────────────────────┘  │                        │           │
│  ┌──────────────────────┐  │              secrets ▼ │           ▼ secrets
│  │ Auth (email/Apple/    │  │            ┌───────────────┐  ┌──────────────┐
│  │  Google)              │  │            │  OpenAI API    │  │ OpenWeather  │
│  └──────────────────────┘  │            │ (Vision + chat)│  │   One Call   │
│  ┌──────────────────────┐  │            └───────────────┘  └──────────────┘
│  │ Storage (plant-photos,│  │
│  │  private, RLS by uid) │  │            ┌───────────────┐  ┌──────────────┐
│  └──────────────────────┘  │            │  Expo Push     │  │ RevenueCat   │
│  ┌──────────────────────┐  │            │  (notifs)      │  │ (subs)       │
│  │ Realtime (tasks,score)│  │            └───────────────┘  └──────────────┘
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │            ┌───────────────────────────────┐
│  │ pg_cron → schedules   │──┼───────────▶│ Analytics: PostHog/Amplitude  │
│  │ edge functions        │  │            │ Errors: Sentry                │
│  └──────────────────────┘  │            └───────────────────────────────┘
└───────────────────────────┘

Data flow highlights:
• CRUD/logging: client ↔ Postgres directly, guarded by RLS (no middle tier).
• AI/secrets/weather/webhooks: client → Edge Function → external API → DB.
• Scheduled intelligence: pg_cron → generate-tasks / compute-health / sync-weather.
• Photos: client → signed upload → Storage; diagnose reads from Storage.
```

---

# 18. Full Build Plan

End-to-end execution plan: team, environments, sequencing, quality gates, and ops.

## 18.1 Team & roles
- **PM/Founder:** spec, prioritization, content (9b knowledge + seed data), beta wrangling.
- **Designer:** design system, screens, motion, marketing assets.
- **Mobile Eng x2:** Expo app, features, offline, charts, map.
- **Backend/AI Eng:** Supabase schema, Edge Functions, prompts, cost controls.
- (Fractional) **Horticulturist/content** for the knowledge base & calendar accuracy.

## 18.2 Environments & CI/CD
- Supabase projects: `dev`, `staging`, `prod` (migrations via Supabase CLI in CI).
- EAS build profiles: development (dev client), preview (internal), production.
- GitHub Actions: lint + typecheck + test on PR; deploy Edge Functions + run migrations on merge to `main` (staging) and tag (prod).
- OTA updates via EAS Update for JS-only fixes.

## 18.3 Build sequence (maps to roadmap, with dependencies)
1. **Infra & auth** (Phase 0) — unblock everyone; types generated from schema.
2. **Catalog + CRUD** (Phase 1) — seed varieties/products; everything downstream needs plants/beds.
3. **Logging + offline** (Phase 1) — the data that feeds every intelligence feature.
4. **Weather + task engine + health** (Phase 2) — the core promise; depends on logs.
5. **AI diagnose + coach** (Phase 3) — depends on photos + context (logs/weather).
6. **Map + analytics + library + calendar** (Phase 4) — depends on data + harvests.
7. **Monetization + notifications + polish** (Phase 4) — gate features, retention, ship-readiness.

## 18.4 Quality gates
- **Per PR:** typecheck, lint, unit tests for utils/rules engine, RLS policy test (a user cannot read another user's rows — automated with two test JWTs).
- **Per phase:** internal dogfood on a real seeded garden; performance check (dashboard < 1.5s); offline scenario test (airplane mode log → reconnect sync).
- **AI quality:** a labeled eval set of ~100 plant-problem photos; track diagnose precision/recall and calibration (does 70% confidence mean ~70% correct?); coach answers reviewed by horticulturist for 9b accuracy before launch.
- **Pre-launch:** accessibility audit (contrast, dynamic type, screen reader labels), both themes, store assets, privacy policy + data export, crash-free sessions ≥ 99.5%.

## 18.5 Observability & ops
- Sentry (crashes + Edge Function errors), PostHog/Amplitude (funnels: onboarding completion, first log, first diagnose, upgrade), Supabase logs + slow-query alerts.
- AI cost dashboard: tokens + vision calls per user; alert if blended COGS > target.
- On-call runbook for: weather API outage (serve cached + degrade gracefully), OpenAI outage (queue diagnoses, inform user), Storage upload failures (retry queue).

## 18.6 Risks & mitigations
| Risk | Mitigation |
|---|---|
| Task engine gives wrong/annoying advice → trust collapse | Conservative rules first, AI as augmentation; track task-trust metric; let users snooze/disable categories |
| AI hallucination in diagnoses | Confidence calibration, "not sure" reframing < 50%, horticulturist eval set, never prescribe regulated chemicals |
| AI cost blowout | Free caps, caching, small models for routine coach, vision only on explicit diagnose |
| Logging fatigue | One-tap completion, smart defaults, offline; streaks + recap for motivation |
| Niche too small | 9b is large & affluent; schema is zone-parameterized for fast geo-expansion in v2 |
| Seasonality of engagement | Year-round 9b growing + indoor/herb features keep winter active; calendar nudges |

## 18.7 First two-week sprint backlog (concrete kickoff)
- [ ] Repo, Expo + Expo Router + TS + theme tokens.
- [ ] Supabase project + migrations 000–009 + RLS test harness.
- [ ] Generated DB types wired into `supabase.ts`.
- [ ] Auth (email/Apple/Google) + profile trigger + onboarding shell.
- [ ] Design-system primitives: Button, Card, Stat, Chip, RadialScore, Screen/Header, TabBar+FAB.
- [ ] Dashboard shell with mock data; bottom-tab navigation working.
- [ ] CI: lint/typecheck/test + Supabase migration deploy to staging.

---

*End of blueprint. This document is intended to be executable: a team can clone the repo structure (§9), run the migrations (§7), stand up the Edge Functions (§8), and build screens (§3–5, §10–11) against the roadmap (§13–14, §18) starting today.*
