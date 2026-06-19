// ============================================================
// types.ts — shared planning types. Everything adjustable lives here.
// ============================================================

export interface DayWx { date: string; hi: number; lo: number; windMph: number; precipProb: number; precipIn: number; }

// A drip valve. Maps app beds -> a physical controller zone.
export interface Zone {
  id: string;                  // app zone id
  name: string;
  beds: string[];              // bed ids on this valve
  areaSqFt: number;            // planted area served
  cropKc: number;              // crop coefficient (fruiting veg ~1.05, leafy ~0.9, citrus ~0.6)
  emitterRateInHr: number;     // effective drip application rate (in/hr) — calibrate per zone
  allowedDays: number[];       // 0=Sun..6=Sat — local watering-day restriction
  windowStart: string;         // 'HH:MM' earliest legal/desired start
  vendorZoneId: string;        // id on the physical controller
}

export type Mode = 'supervised' | 'auto';

export interface ControlConfig {
  mode: Mode;
  maxRuntimeMin: number;       // per-zone hard cap (anti-flood)
  dailyBudgetGal: number;      // whole-garden cap (bill / drought ordinance)
  postRainLockoutIn: number;   // skip if >= this much rain recently
  rainSkipProb: number;        // skip if precip prob today/tomorrow >= this
  minDepthIn: number;          // don't run below this deficit
  respectDeviceRainSensor: boolean;
  zoneGapSec: number;          // delay between sequential zones
}

export interface ZonePlan {
  zoneId: string; zoneName: string; vendorZoneId: string;
  action: 'run' | 'skip';
  runtimeSec: number; startTime: string; gallons: number;
  reason: string;
}

export const DEFAULT_CONFIG: ControlConfig = {
  mode: 'supervised',
  maxRuntimeMin: 45,
  dailyBudgetGal: 80,
  postRainLockoutIn: 0.25,
  rainSkipProb: 0.6,
  minDepthIn: 0.05,
  respectDeviceRainSensor: true,
  zoneGapSec: 30,
};
