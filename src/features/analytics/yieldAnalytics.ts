// ============================================================
// engines/yieldAnalytics.ts — closes the feedback loop. Turns harvest
// logs into yield per plant / bed / crop / season, records, trend, and
// a "worth growing" ranking (yield per sq ft when area is known).
// Run:  node --experimental-strip-types yieldAnalytics.ts
// ============================================================

export interface Harvest {
  plantId: string; plantName: string; bedId: string; crop: string;
  date: string;            // ISO
  weightLb: number;
  quantity?: number;
  qualityScore?: number;   // 1–5
}
export interface BedMeta { bedId: string; name: string; areaSqFt: number; }

interface Agg { weightLb: number; count: number; quality: number; qn: number; }
const seasonOf = (iso: string) => {
  const m = new Date(iso).getUTCMonth() + 1;
  return m <= 2 || m === 12 ? 'Winter' : m <= 5 ? 'Spring' : m <= 8 ? 'Summer' : 'Fall';
};
const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

function group<T>(rows: Harvest[], key: (h: Harvest) => string): Map<string, Agg> {
  const m = new Map<string, Agg>();
  for (const h of rows) {
    const k = key(h);
    const a = m.get(k) ?? { weightLb: 0, count: 0, quality: 0, qn: 0 };
    a.weightLb += h.weightLb; a.count += h.quantity ?? 1;
    if (h.qualityScore) { a.quality += h.qualityScore; a.qn += 1; }
    m.set(k, a);
  }
  return m;
}

export function analyzeYield(harvests: Harvest[], beds: BedMeta[]) {
  const bedArea = new Map(beds.map(b => [b.bedId, b]));
  const totalLb = round(harvests.reduce((s, h) => s + h.weightLb, 0));
  const totalCount = harvests.reduce((s, h) => s + (h.quantity ?? 1), 0);

  const byCrop = [...group(harvests, h => h.crop)].map(([crop, a]) => ({
    crop, weightLb: round(a.weightLb), count: a.count, avgQuality: a.qn ? round(a.quality / a.qn, 1) : null,
  })).sort((x, y) => y.weightLb - x.weightLb);

  const byBed = [...group(harvests, h => h.bedId)].map(([bedId, a]) => {
    const meta = bedArea.get(bedId);
    const area = meta?.areaSqFt ?? 0;
    return {
      bed: meta?.name ?? bedId, weightLb: round(a.weightLb),
      lbPerSqFt: area ? round(a.weightLb / area, 2) : null,
    };
  }).sort((x, y) => y.weightLb - x.weightLb);

  const byPlant = [...group(harvests, h => h.plantId)].map(([plantId, a]) => ({
    plant: harvests.find(h => h.plantId === plantId)!.plantName, weightLb: round(a.weightLb),
  })).sort((x, y) => y.weightLb - x.weightLb);

  const bySeason = [...group(harvests, h => seasonOf(h.date))].map(([season, a]) => ({
    season, weightLb: round(a.weightLb),
  }));

  // record single harvest per crop
  const records = byCrop.map(c => {
    const best = harvests.filter(h => h.crop === c.crop).sort((a, b) => b.weightLb - a.weightLb)[0];
    return { crop: c.crop, bestLb: round(best.weightLb), date: best.date };
  });

  // weekly trend
  const weekly = new Map<string, number>();
  for (const h of harvests) {
    const d = new Date(h.date); const onejan = new Date(d.getUTCFullYear(), 0, 1);
    const wk = `${d.getUTCFullYear()}-W${Math.ceil(((+d - +onejan) / 86400000 + 1) / 7)}`;
    weekly.set(wk, round((weekly.get(wk) ?? 0) + h.weightLb));
  }

  // insights
  const insights: string[] = [];
  if (byBed.length >= 2 && byBed[0].weightLb > 0) {
    const top = byBed[0], bottom = byBed[byBed.length - 1];
    if (bottom.weightLb > 0)
      insights.push(`${top.bed} out-yielded ${bottom.bed} by ${round((top.weightLb / bottom.weightLb - 1) * 100, 0)}% by weight.`);
  }
  const bestPerArea = byBed.filter(b => b.lbPerSqFt != null).sort((a, b) => (b.lbPerSqFt! - a.lbPerSqFt!))[0];
  if (bestPerArea) insights.push(`Best space efficiency: ${bestPerArea.bed} at ${bestPerArea.lbPerSqFt} lb/sq ft — worth replicating.`);
  if (byCrop[0]) insights.push(`Top producer: ${byCrop[0].crop} (${byCrop[0].weightLb} lb).`);

  return { totalLb, totalCount, byCrop, byBed, byPlant, bySeason, records, weekly: [...weekly], insights };
}

// ---------------- DEMO ----------------
function demo() {
  const beds: BedMeta[] = [
    { bedId: 'bed-3', name: 'Bed 3', areaSqFt: 16 },
    { bedId: 'bed-7', name: 'Bed 7', areaSqFt: 16 },
  ];
  const harvests: Harvest[] = [
    { plantId: 'pl-1', plantName: "'Sungold' tomato", bedId: 'bed-3', crop: 'Tomato', date: '2026-06-20', weightLb: 1.8, qualityScore: 5 },
    { plantId: 'pl-1', plantName: "'Sungold' tomato", bedId: 'bed-3', crop: 'Tomato', date: '2026-06-27', weightLb: 2.4, qualityScore: 5 },
    { plantId: 'pl-1', plantName: "'Sungold' tomato", bedId: 'bed-3', crop: 'Tomato', date: '2026-07-04', weightLb: 3.1, qualityScore: 4 },
    { plantId: 'pl-4', plantName: 'Albion strawberry', bedId: 'bed-7', crop: 'Strawberry', date: '2026-06-21', weightLb: 0.6, qualityScore: 4 },
    { plantId: 'pl-4', plantName: 'Albion strawberry', bedId: 'bed-7', crop: 'Strawberry', date: '2026-07-05', weightLb: 0.5, qualityScore: 3 },
    { plantId: 'pl-9', plantName: 'Shishito pepper', bedId: 'bed-7', crop: 'Pepper', date: '2026-07-10', weightLb: 0.9, qualityScore: 5 },
  ];

  const r = analyzeYield(harvests, beds);
  console.log(`\n📊  YIELD ANALYTICS\n`);
  console.log(`   Total: ${r.totalLb} lb across ${r.totalCount} harvests\n`);
  console.log(`   By crop:`);
  r.byCrop.forEach(c => console.log(`     ${c.crop.padEnd(12)} ${String(c.weightLb).padStart(5)} lb   q${c.avgQuality ?? '-'}`));
  console.log(`\n   By bed:`);
  r.byBed.forEach(b => console.log(`     ${b.bed.padEnd(8)} ${String(b.weightLb).padStart(5)} lb   ${b.lbPerSqFt ?? '-'} lb/sq ft`));
  console.log(`\n   Records:`);
  r.records.forEach(rec => console.log(`     ${rec.crop}: best single ${rec.bestLb} lb (${rec.date})`));
  console.log(`\n   Insights:`);
  r.insights.forEach(i => console.log(`     • ${i}`));
  console.log('');
}
demo();
