# 9B GrowOS — Irrigation Control Package

A universal, weather-reactive drip irrigation brain. One decision engine; any controller plugs in behind a single adapter interface. Pick your controller, calibrate once, and the app waters by evapotranspiration with hard safety rails.

## Run the demo
```bash
node --experimental-strip-types demo.ts
```
(Node ≥ 22.6. Same TypeScript runs unchanged in Deno / Supabase Edge Functions.)

## Architecture
```
weather + ET ─▶ planner.ts ─▶ ZonePlan[] ──▶ controller.ts ──▶ adapter ──▶ device
 (et.ts)        (guardrails,                  (supervised |     (vendors.ts)
                 budget, runtimes)             auto, safety)
```
- **planner.ts** — vendor-agnostic. Decides *whether* and *how long* per zone. Knows nothing about brands.
- **adapters/** — the universal `IrrigationAdapter` contract (`base.ts`), five concrete vendors (`vendors.ts`), and the picker catalog + factory (`registry.ts`).
- **controller.ts** — orchestrator: reads device status, honors its rain sensor, proposes (supervised) or executes (auto), sequences zones, and **stop-alls on any fault**.
- **et.ts** — pluggable evapotranspiration. Heuristic now; swap in CIMIS/OpenET with zero planner changes.
- **calibrate.ts** — turns a one-time flow test into each zone's emitter rate, plus Kc/emitter presets.

## Supported controllers
| Vendor | Connection | Auth | One-zone stop |
|---|---|---|---|
| Rachio | cloud | API key | device-level |
| Orbit B-hyve | cloud | account/session | yes |
| RainMachine | local | access token | yes |
| OpenSprinkler | local | md5 password | yes |
| Netro | cloud | device key | device-level |

> API request shapes are modeled from each vendor's public docs. **Verify endpoints against current vendor docs before production** — they drift, and a few (B-hyve) are unofficial.

## Plug in real credentials
Swap the `MockTransport` for the real one and pass creds from the catalog fields:
```ts
import { createAdapter } from './adapters/registry.ts';
import { FetchTransport } from './adapters/base.ts';

const adapter = createAdapter('rachio',
  { apiKey: process.env.RACHIO_KEY, deviceId: '...' },
  new FetchTransport());            // <- real HTTP
```

## Adjustable knobs (`types.ts` → `DEFAULT_CONFIG`)
- `mode`: `supervised` (propose, tap to confirm) vs `auto`.
- `maxRuntimeMin`: per-zone anti-flood cap.
- `dailyBudgetGal`: whole-garden cap; runs scale down proportionally.
- `postRainLockoutIn`, `rainSkipProb`: rain skip behavior.
- `minDepthIn`: ignore trivial deficits.
- `respectDeviceRainSensor`, `zoneGapSec`.
- Per **zone**: `cropKc`, `emitterRateInHr`, `allowedDays`, `windowStart`, `areaSqFt`.

## Add a new controller (≈15 minutes)
1. Implement `IrrigationAdapter` in `vendors.ts`.
2. Add a `CatalogEntry` + a `case` in `registry.ts`.
That's it — it's instantly selectable in the picker and works with the unchanged brain.

## Safety model (read before enabling auto)
- Ships in **supervised** mode; earn trust before auto.
- Hard per-zone runtime cap + whole-garden gallon budget.
- Local watering-day/window restrictions per zone.
- Honors the controller's own rain sensor.
- Fail-safe: status/offline/fault → **stop-all**, never leave water running.
- Replace the ET heuristic with CIMIS/OpenET before relying on auto in production.
