# 🌱 Grove

**Your garden, running.**

A garden operating system that tells you exactly what to do every day — and learns from every harvest.

## Stack
- **Frontend:** Next.js + React (Vercel)
- **Backend:** Supabase (Postgres + Auth + Storage + Edge Functions)
- **AI:** Anthropic Claude (diagnostics + coach)
- **Weather:** OpenWeather API
- **Irrigation:** Rachio · B-hyve · RainMachine · OpenSprinkler · Netro

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your keys
npx supabase start           # local Supabase
npx supabase db push          # run migrations
npx supabase functions serve  # edge functions
npm run dev                   # Next.js dev server
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Edge Function secrets (set via `supabase secrets set`):
```
ANTHROPIC_API_KEY=sk-ant-...
OPENWEATHER_API_KEY=...
```

## Deploy
- Push to `main` → Vercel auto-deploys
- `supabase db push` → migrations run on cloud
- `supabase functions deploy` → edge functions go live

## Docs
- `docs/blueprint.md` — Full product + engineering spec
- `docs/pma.md` — Product-Market Analysis
- `docs/shipping-manifest.md` — File inventory + build plan
