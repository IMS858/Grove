// ============================================================
// calibrate.ts — solves the "users don't know their emitter rate" problem
// with a dead-simple one-time test, plus crop-coefficient presets.
// ============================================================

// One-time setup: "Run the zone N minutes, tell us gallons used (from a
// flow meter or your water bill delta), and the area it covers."
export function calibrateEmitterRate(args: { gallons: number; areaSqFt: number; minutes: number }): number {
  const GAL_PER_SQFT_IN = 0.623;
  const inchesApplied = args.gallons / (args.areaSqFt * GAL_PER_SQFT_IN);
  const rateInHr = inchesApplied / (args.minutes / 60);
  return Math.round(rateInHr * 100) / 100; // in/hr
}

// Even simpler fallback: pick the emitter type and we estimate the rate.
export const EMITTER_PRESETS: Record<string, number> = {
  'drip_line_low': 0.4,     // 0.5 GPH emitters, 12" spacing
  'drip_line_med': 0.6,     // 0.9 GPH emitters, 12" spacing
  'drip_line_high': 0.9,    // 1.0+ GPH, closer spacing
  'soaker_hose': 0.5,
  'micro_spray': 1.2,
};

// Crop coefficients (Kc) by category for a planted, mid-season raised bed.
export const KC_PRESETS: Record<string, number> = {
  leafy: 0.9, fruiting_veg: 1.05, root: 0.95, herb: 0.85,
  berry: 1.0, citrus: 0.6, stone_fruit: 0.7, flower: 0.9, mixed: 0.95,
};
