// ============================================================
// et.ts — evapotranspiration. The "how thirsty is the garden today"
// number. Pluggable: swap the heuristic for a real CIMIS/OpenET feed
// without touching the planner.
// ============================================================
import type { DayWx } from './types.ts';

export interface ETProvider {
  // reference ET (inches/day) for a forecast day
  et0(day: DayWx): number;
}

// Transparent heuristic — defensible, but a stand-in. Calibrated so a
// 103/74°F windy day ≈ 0.30"/day (typical SoCal summer peak ET0).
export class HeuristicET implements ETProvider {
  et0(d: DayWx): number {
    const tmean = (d.hi + d.lo) / 2;
    let et = 0.00619 * Math.max(0, tmean - 40);
    et *= 1 + Math.max(0, d.windMph - 5) * 0.01;
    return Math.max(0, et);
  }
}

// Production: pull station ET0 from California's free CIMIS network (or
// OpenET). Inject the day's value; falls back to heuristic if missing.
export class CimisET implements ETProvider {
  byDate: Record<string, number>;
  fallback: ETProvider;
  constructor(byDate: Record<string, number>, fallback: ETProvider = new HeuristicET()) {
    this.byDate = byDate; this.fallback = fallback;
  }
  et0(d: DayWx): number {
    const v = this.byDate[d.date];
    return v !== undefined ? v : this.fallback.et0(d);
  }
}
