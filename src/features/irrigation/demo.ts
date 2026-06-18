// ============================================================
// demo.ts — the full "click your controller and boom" walkthrough.
// Run:  node --experimental-strip-types demo.ts
// ============================================================
import { CONTROLLER_CATALOG, createAdapter } from './adapters/registry.ts';
import { MockTransport } from './adapters/base.ts';
import type { Vendor } from './adapters/base.ts';
import { HeuristicET } from './et.ts';
import { IrrigationController } from './controller.ts';
import { DEFAULT_CONFIG, type Zone, type DayWx, type RunReport } from './types.ts';
import { calibrateEmitterRate, KC_PRESETS } from './calibrate.ts';

// Your 14 white Vego beds on two drip valves (vendorZoneId matches the device).
const zones: Zone[] = [
  { id: 'z1', name: 'Zone 1 (Beds 1–7, full sun)', beds: [], areaSqFt: 7 * 16,
    cropKc: KC_PRESETS.fruiting_veg, emitterRateInHr: calibrateEmitterRate({ gallons: 12, areaSqFt: 112, minutes: 20 }),
    allowedDays: [1, 3, 6], windowStart: '19:00', vendorZoneId: '1' },
  { id: 'z2', name: 'Zone 2 (Beds 8–14, PM shade)', beds: [], areaSqFt: 7 * 16,
    cropKc: KC_PRESETS.leafy, emitterRateInHr: 0.6,
    allowedDays: [1, 3, 6], windowStart: '19:20', vendorZoneId: '2' },
];

const heat: DayWx[] = [
  { date: '2026-07-15', hi: 103, lo: 74, windMph: 12, precipProb: 0.0, precipIn: 0 }, // Wed (allowed)
  { date: '2026-07-16', hi: 99, lo: 72, windMph: 10, precipProb: 0.0, precipIn: 0 },
];
const conditions = { forecast: heat, today: '2026-07-15', recentRainIn: 0, soilMoisture: { z1: 0.25, z2: 0.3 } };
const et = new HeuristicET();

function printReport(r: RunReport) {
  for (const p of r.plans) {
    if (p.action === 'run') console.log(`   ✅ ${p.zoneName}: ${Math.round(p.runtimeSec / 60)} min @ ${p.startTime} (~${p.gallons} gal) — ${p.reason}`);
    else console.log(`   ⏭️  ${p.zoneName}: SKIP — ${p.reason}`);
  }
  if (r.results.length) r.results.forEach(x => console.log(`      → ${x.vendor}.${x.action}: ${x.ok ? 'OK' : 'FAIL'} (${x.detail})`));
  console.log(`   — ${r.summary}\n`);
}

async function pick(vendor: Vendor, opts?: { failOn?: (req: any) => boolean }) {
  const transport = new MockTransport({ failOn: opts?.failOn });
  const adapter = createAdapter(vendor, { apiKey: 'demo', token: 'demo', deviceId: 'dev1', baseUrl: 'http://192.168.1.50', password: 'md5demo' }, transport);
  return { adapter, transport };
}

async function main() {
  console.log('\n========== PICK YOUR CONTROLLER ==========');
  CONTROLLER_CATALOG.forEach((c, i) =>
    console.log(`  ${i + 1}. ${c.label.padEnd(24)} [${c.connType}]  ${c.setupHint.slice(0, 52)}…`));
  console.log(`\n  Zone 1 calibrated emitter rate: ${zones[0].emitterRateInHr} in/hr (from a 20-min, 12-gal test)\n`);

  // --- User taps "Rachio", supervised (default) ---
  console.log('========== TAP: Rachio · supervised (heat wave) ==========');
  let { adapter } = await pick('rachio');
  let ctrl = new IrrigationController(adapter, et, DEFAULT_CONFIG);
  const v = await ctrl.verifyZones(zones);
  console.log(`   Detected ${v.deviceZones.length} device zones; missing: ${v.missing.length ? v.missing.join(', ') : 'none'}`);
  printReport(await ctrl.runDay(zones, conditions));

  // --- User taps "Confirm" -> auto mode executes on the SAME device ---
  console.log('========== TAP: Confirm · auto (executes on Rachio) ==========');
  ctrl = new IrrigationController(adapter, et, { ...DEFAULT_CONFIG, mode: 'auto' });
  printReport(await ctrl.runDay(zones, conditions));

  // --- Same plan, different controller: OpenSprinkler (local). Boom. ---
  console.log('========== SWAP: OpenSprinkler · auto (same brain, local device) ==========');
  ({ adapter } = await pick('opensprinkler'));
  ctrl = new IrrigationController(adapter, et, { ...DEFAULT_CONFIG, mode: 'auto' });
  printReport(await ctrl.runDay(zones, conditions));

  // --- Safety: device faults on the 2nd zone -> orchestrator stop-alls ---
  console.log('========== SAFETY: Netro faults mid-run -> auto stop-all ==========');
  let calls = 0;
  ({ adapter } = await pick('netro', { failOn: (req) => /water\.txt/.test(req.url) && ++calls === 2 }));
  ctrl = new IrrigationController(adapter, et, { ...DEFAULT_CONFIG, mode: 'auto' });
  printReport(await ctrl.runDay(zones, conditions));
}
main();
