// ============================================================
// engines/healthScore.ts — the WHOOP-style daily garden number.
// Weighted 0–100 from log recency, ranges, pest state, task follow-through.
// Run:  node --experimental-strip-types healthScore.ts
// ============================================================

interface PlantWater { id: string; intervalDays: number; lastWaterDaysAgo: number; }
interface FeedState { plantId: string; daysSinceFeed: number; expectedIntervalDays: number; }
interface PestState { severity: 'low' | 'moderate' | 'high' | 'critical'; resolved: boolean; }
interface Reading { inBand: boolean; }
interface TaskState { status: 'done' | 'pending' | 'skipped' | 'missed'; }

export interface HealthInput {
  water: PlantWater[];
  feeds: FeedState[];
  pests: PestState[];
  readings: Reading[];           // pH/EC readings, last 14d
  tasks: TaskState[];            // last 14d
}

export interface HealthResult {
  score: number;                 // 0–100
  band: 'critical' | 'needs work' | 'good' | 'thriving';
  breakdown: Record<string, number>;
  topDrag: { factor: string; value: number } | null;
}

const WEIGHTS = { watering: 0.30, feeding: 0.20, pests: 0.20, ph_ec: 0.15, tasks: 0.15 } as const;
const clamp = (n: number) => Math.max(0, Math.min(100, n));
const pct = (num: number, den: number) => (den === 0 ? 100 : (num / den) * 100);

function wateringScore(w: PlantWater[]): number {
  if (!w.length) return 100;
  // 100 if within interval; decays as it goes overdue (0 at 2x interval).
  const per = w.map(p => {
    const over = p.lastWaterDaysAgo - p.intervalDays;
    if (over <= 0) return 100;
    return clamp(100 - (over / Math.max(1, p.intervalDays)) * 100);
  });
  return per.reduce((a, b) => a + b, 0) / per.length;
}
function feedingScore(f: FeedState[]): number {
  if (!f.length) return 100;
  const per = f.map(x => {
    const over = x.daysSinceFeed - x.expectedIntervalDays;
    if (over <= 0) return 100;
    return clamp(100 - (over / Math.max(1, x.expectedIntervalDays)) * 80);
  });
  return per.reduce((a, b) => a + b, 0) / per.length;
}
function pestScore(p: PestState[]): number {
  const open = p.filter(x => !x.resolved);
  if (!open.length) return 100;
  const penalty: Record<PestState['severity'], number> = { low: 8, moderate: 18, high: 32, critical: 50 };
  return clamp(100 - open.reduce((s, x) => s + penalty[x.severity], 0));
}
function phEcScore(r: Reading[]): number {
  if (!r.length) return 90; // no data = mild unknown, not a failure
  return pct(r.filter(x => x.inBand).length, r.length);
}
function taskScore(t: TaskState[]): number {
  const counted = t.filter(x => x.status === 'done' || x.status === 'missed');
  if (!counted.length) return 100;
  return pct(counted.filter(x => x.status === 'done').length, counted.length);
}

export function computeHealth(input: HealthInput): HealthResult {
  const breakdown = {
    watering: Math.round(wateringScore(input.water)),
    feeding: Math.round(feedingScore(input.feeds)),
    pests: Math.round(pestScore(input.pests)),
    ph_ec: Math.round(phEcScore(input.readings)),
    tasks: Math.round(taskScore(input.tasks)),
  };
  const score = Math.round(
    breakdown.watering * WEIGHTS.watering +
    breakdown.feeding * WEIGHTS.feeding +
    breakdown.pests * WEIGHTS.pests +
    breakdown.ph_ec * WEIGHTS.ph_ec +
    breakdown.tasks * WEIGHTS.tasks,
  );
  const band: HealthResult['band'] =
    score >= 85 ? 'thriving' : score >= 70 ? 'good' : score >= 50 ? 'needs work' : 'critical';

  // biggest weighted drag on the score = what to fix first
  const drags = Object.entries(breakdown)
    .map(([factor, value]) => ({ factor, value, impact: (100 - value) * (WEIGHTS as any)[factor] }))
    .sort((a, b) => b.impact - a.impact);
  const topDrag = drags[0] && drags[0].impact > 0 ? { factor: drags[0].factor, value: drags[0].value } : null;

  return { score, band, breakdown, topDrag };
}

// ---------------- DEMO ----------------
function demo() {
  const input: HealthInput = {
    water: [
      { id: 'bed-3', intervalDays: 2, lastWaterDaysAgo: 1 },
      { id: 'bed-7', intervalDays: 3, lastWaterDaysAgo: 5 },   // overdue
      { id: 'bed-11', intervalDays: 2, lastWaterDaysAgo: 2 },
    ],
    feeds: [
      { plantId: 'pl-1', daysSinceFeed: 30, expectedIntervalDays: 14 }, // way behind
      { plantId: 'pl-4', daysSinceFeed: 17, expectedIntervalDays: 21 },
    ],
    pests: [
      { severity: 'high', resolved: false },   // spider mites still open
      { severity: 'low', resolved: true },
    ],
    readings: [{ inBand: true }, { inBand: true }, { inBand: false }, { inBand: true }],
    tasks: [
      { status: 'done' }, { status: 'done' }, { status: 'done' },
      { status: 'missed' }, { status: 'done' }, { status: 'pending' },
    ],
  };

  const r = computeHealth(input);
  console.log(`\n🌿  GARDEN HEALTH SCORE\n`);
  console.log(`   ${r.score}/100  —  ${r.band.toUpperCase()}\n`);
  for (const [k, v] of Object.entries(r.breakdown)) {
    const bar = '█'.repeat(Math.round(v / 5)) + '░'.repeat(20 - Math.round(v / 5));
    console.log(`   ${k.padEnd(8)} ${bar} ${v}`);
  }
  if (r.topDrag) console.log(`\n   👉 Fix first: ${r.topDrag.factor} (${r.topDrag.value}) — biggest drag on your score.\n`);
}
demo();
