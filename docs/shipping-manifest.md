# 9B GrowOS — Shipping Manifest
### Everything built. How it fits. What to do first.

---

## Files (27 total)

### 📋 Strategy & Docs
| File | What it is |
|---|---|
| `9B-GrowOS-Blueprint.md` | Complete startup blueprint — all 18 deliverables (PRD, UX flows, wireframes, screens, nav, DB schema, SQL, API, folder structure, components, design system, user stories, MVP roadmap, V2 roadmap, monetization, launch, architecture, build plan) |
| `9B-GrowOS-PMA.md` | Product-Market Analysis — market sizing, competitive teardown, positioning, GTM, revenue projections, SWOT, investment ask |
| `GrowOS-PMA-Pitch.jsx` | Interactive pitch page — swipeable on your phone, show investors from your pocket |

### 🖥️ Interactive UI
| File | What it is |
|---|---|
| `GrowOS-v2.jsx` | Full app prototype — 43 plants, dashboard, garden map + bed planner, library (plants/pests/companions), calendar, coach, photo diagnostics. Dark mode, your palette, runs on phone now. |

### ⚙️ Engines (standalone TypeScript, runs with `node --experimental-strip-types`)
| File | What it is |
|---|---|
| `taskEngine.ts` | Reactive daily task engine — weather + crop + bed-physics → prioritized task list |
| `diagnose.ts` | AI diagnostics pipeline — photo + context → structured diagnosis → tasks |
| `engines/healthScore.ts` | Garden Health Score — weighted 0–100 with breakdown and "fix first" |
| `engines/yieldAnalytics.ts` | Yield per plant/bed/crop/season, records, trends, insights |
| `engines/coach.ts` | Zone 9B Coach — context assembler + prompt builder + task extraction |
| `engines/cimis.ts` | Real CIMIS ET0 fetcher — makes irrigation accurate |
| `engines/companionMatrix.ts` | 60+ pairings with reasons + bed conflict checker + suggestions |
| `engines/bedPlanner.ts` | Fits plants into 2×8 beds respecting spacing rules |
| `engines/successionPlanner.ts` | What to plant next + year-round rotation plan |

### 💧 Irrigation Package (`irrigation/`)
| File | What it is |
|---|---|
| `adapters/base.ts` | Universal adapter interface + mock transport |
| `adapters/vendors.ts` | 5 controllers: Rachio, B-hyve, RainMachine, OpenSprinkler, Netro |
| `adapters/registry.ts` | "Click your controller" catalog + factory |
| `controller.ts` | Orchestrator — plan → propose → execute with fail-safe |
| `planner.ts` | Vendor-agnostic decision engine (ET + guardrails → runtimes) |
| `et.ts` | Pluggable evapotranspiration (heuristic + CIMIS slot) |
| `types.ts` | Shared types + adjustable DEFAULT_CONFIG |
| `calibrate.ts` | Emitter rate from flow test + Kc/emitter presets |
| `demo.ts` | Full demo: pick controller, plan, execute, swap, trip safety |

### 🌱 Knowledge Base (`data/`)
| File | What it is |
|---|---|
| `encyclopedia9b.ts` | 43 plant profiles — growing, 9b tips, pros/cons, health, medicinal, culinary, companions, pests |
| `pests9b.ts` | 8 pest profiles — ID, lifecycle, organic treatments, 9b notes |
| `seed9b.ts` | Varieties, feeding windows, 12-month seasonal calendar |

### 🗃️ Database & Backend
| File | What it is |
|---|---|
| `011_seed_user_beds.sql` | Your 14 Vego 2×8 beds, pre-named, with physical attributes |
| `bootstrap.sh` | One-command project scaffold for Mac Mini (Expo + Supabase + Edge Functions) |

---

## Mac Mini Session Playbook

### Before you start
```bash
brew install node supabase/tap/supabase
npm install -g eas-cli
supabase login
```
Get your keys ready: Supabase project URL + anon key, OpenAI API key, OpenWeather API key.

### Step 1: Bootstrap (5 min)
```bash
chmod +x bootstrap.sh
./bootstrap.sh
cd 9b-growos
```
This creates the Expo project, installs deps, creates all 9 Edge Functions with the shared OpenAI/Supabase utilities, sets up the folder structure, and creates `.env.local`.

### Step 2: Database (10 min)
Copy the SQL from `9B-GrowOS-Blueprint.md` sections 000–009 into `supabase/migrations/` as numbered files:
```
20260618000000_extensions.sql
20260618000001_enums.sql
20260618000002_profiles.sql
20260618000003_catalog.sql
20260618000004_gardens_beds_plants.sql
20260618000005_logs.sql
20260618000006_tasks_weather_health.sql
20260618000007_triggers.sql
20260618000008_rls.sql
20260618000009_storage.sql
```
Then:
```bash
supabase start          # local Supabase
supabase db push        # run migrations
```
Run `011_seed_user_beds.sql` to seed your 14 beds.

### Step 3: Secrets (2 min)
```bash
# .env.local (client-side, public)
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Edge Function secrets (server-side, private)
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set OPENWEATHER_API_KEY=...
```

### Step 4: Wire engines into Edge Functions (30 min)
The engines (`taskEngine.ts`, `diagnose.ts`, `healthScore.ts`, `coach.ts`, etc.) are pure functions. Import them into the corresponding Edge Functions:

```
taskEngine.ts      → supabase/functions/generate-tasks/
diagnose.ts        → supabase/functions/diagnose/        (already scaffolded)
healthScore.ts     → supabase/functions/compute-health/
coach.ts           → supabase/functions/coach/            (already scaffolded)
irrigationController → supabase/functions/irrigate/
cimis.ts           → supabase/functions/sync-weather/     (add to weather sync)
```

The `diagnose` and `coach` Edge Functions are already written in the bootstrap — they have real OpenAI calls and DB writes. The others need the engine logic dropped in.

### Step 5: Run (2 min)
```bash
supabase functions serve   # Edge Functions locally
npx expo start             # App
```

### Step 6: First real test
1. Sign up in the app
2. Create a garden + first bed
3. Add a plant
4. Log watering → see task update
5. Upload a photo → diagnose → see result
6. Ask the coach a question → get 9b answer
7. Check the health score

---

## What's production-ready vs. needs finishing

### ✅ Production-ready (logic complete, tested)
- Database schema + RLS + all migrations
- Task engine (reactive, weather-aware, 9b-tuned)
- Diagnostics pipeline (prompt, parse, validate, tasks)
- Irrigation controller (5 vendors, safety, supervised/auto)
- Health score computation
- Yield analytics
- Companion planting matrix
- Plant encyclopedia (43 plants)
- Pest encyclopedia (8 pests)
- Seasonal calendar

### 🔧 Needs wiring (logic exists, needs DB/API connection)
- Edge Functions: `generate-tasks`, `compute-health`, `irrigate` need engine imports
- `sync-weather`: add OpenWeather API call + CIMIS fetch
- `send-reminders`: add Expo Push
- `rc-webhook`: add RevenueCat verification
- `predict-watering`: add interval learning from log history

### 🎨 Needs building (design exists, code doesn't yet)
- React Native screens (the JSX prototype has the design; translate to RN components)
- Offline queue (MMKV + mutation queue pattern is designed, not built)
- RevenueCat paywall integration
- Photo upload to Supabase Storage (signed URL flow)
- Expo Push registration + handling
- App Store / Play Store assets

---

## Architecture reminder
```
Phone (Expo/RN) ←→ Supabase (Postgres + RLS + Storage + Auth)
                         ↕
                    Edge Functions → OpenAI / OpenWeather / RevenueCat
                         ↕
                    pg_cron → generate-tasks / compute-health / sync-weather
```
All CRUD goes direct to Postgres via supabase-js (RLS enforced). AI/secrets/webhooks go through Edge Functions. Photos go to Storage via signed URL. Scheduled intelligence runs on cron.

---

*9B GrowOS · Grow Smarter. Harvest More.*
