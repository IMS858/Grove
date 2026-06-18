// ============================================================
// planner.ts — vendor-agnostic decision engine. Decides WHETHER and
// HOW LONG to water each zone. Knows nothing about brands.
// ============================================================
import type { Zone, DayWx, ControlConfig, ZonePlan } from './types.ts';
import type { ETProvider } from './et.ts';

const GAL_PER_SQFT_IN = 0.623;
const dow = (iso: string) => new Date(iso + 'T12:00:00Z').getUTCDay();
const skip = (z: Zone, reason: string): ZonePlan => ({
  zoneId: z.id, zoneName: z.name, vendorZoneId: z.vendorZoneId,
  action: 'skip', runtimeSec: 0, startTime: '-', gallons: 0, reason,
});

export interface PlanInputs {
  zones: Zone[];
  forecast: DayWx[];           // [0] = today
  today: string;
  recentRainIn: number;
  soilMoisture?: Record<string, number>;  // zoneId -> 0..1
  deviceRainSensorActive?: boolean;
}

export function planIrrigation(et: ETProvider, cfg: ControlConfig, input: PlanInputs): { plans: ZonePlan[]; summary: string } {
  const today = input.forecast.find(f => f.date === input.today) ?? input.forecast[0];
  const tomorrow = input.forecast[1];
  const plans: ZonePlan[] = [];

  if (!today) return { plans: input.zones.map(z => skip(z, 'No forecast — holding (fail-safe).')), summary: 'No weather data; all skipped.' };
  if (cfg.respectDeviceRainSensor && input.deviceRainSensorActive)
    return { plans: input.zones.map(z => skip(z, 'Controller rain sensor active.')), summary: 'Rain sensor active; all skipped.' };

  for (const z of input.zones) {
    if (!z.allowedDays.includes(dow(input.today))) { plans.push(skip(z, 'Not an allowed watering day here.')); continue; }
    if (input.recentRainIn >= cfg.postRainLockoutIn) { plans.push(skip(z, `${input.recentRainIn}" recent rain — lockout.`)); continue; }
    const wetProb = Math.max(today.precipProb, tomorrow?.precipProb ?? 0);
    if (wetProb >= cfg.rainSkipProb) { plans.push(skip(z, `Rain likely (${Math.round(wetProb * 100)}%) — rain skip.`)); continue; }
    const moisture = input.soilMoisture?.[z.id];
    if (moisture !== undefined && moisture >= 0.6) { plans.push(skip(z, `Soil ${Math.round(moisture * 100)}% wet.`)); continue; }

    const etc = et.et0(today) * z.cropKc;
    let depth = Math.max(0, etc - Math.min(today.precipIn, etc));
    if (moisture !== undefined) depth *= (1 - moisture);
    if (depth < cfg.minDepthIn) { plans.push(skip(z, `Deficit ${depth.toFixed(2)}" below threshold.`)); continue; }

    const runtimeSec = Math.min(cfg.maxRuntimeMin * 60, Math.round((depth / z.emitterRateInHr) * 3600));
    plans.push({
      zoneId: z.id, zoneName: z.name, vendorZoneId: z.vendorZoneId, action: 'run',
      runtimeSec, startTime: z.windowStart, gallons: Math.round(depth * z.areaSqFt * GAL_PER_SQFT_IN),
      reason: `ETc ${etc.toFixed(2)}"/day (Kc ${z.cropKc}); applying ${depth.toFixed(2)}".`,
    });
  }

  // whole-garden budget cap
  const runs = plans.filter(p => p.action === 'run');
  const total = runs.reduce((s, p) => s + p.gallons, 0);
  if (total > cfg.dailyBudgetGal && total > 0) {
    const scale = cfg.dailyBudgetGal / total;
    runs.forEach(p => {
      p.runtimeSec = Math.round(p.runtimeSec * scale);
      p.gallons = Math.round(p.gallons * scale);
      p.reason += ` Scaled ${Math.round(scale * 100)}% to budget (${cfg.dailyBudgetGal} gal/day).`;
    });
  }

  const ran = plans.filter(p => p.action === 'run');
  const summary = `${ran.length}/${input.zones.length} zones, ~${ran.reduce((s, p) => s + p.gallons, 0)} gal, ${plans.length - ran.length} skipped.`;
  return { plans, summary };
}
