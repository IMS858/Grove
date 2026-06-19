// ============================================================
// taskEngine.ts — 9B GrowOS reactive daily task engine
// The core of `generate-tasks`. Pure functions: feed it the garden
// state + forecast, get back today's prioritized task list.
//
// Tuned for USDA Zone 9b + Vego-style raised metal beds. The thing
// Seedtime structurally can't do: tasks that REACT to weather.
//
// Run:  node --experimental-strip-types taskEngine.ts
// ============================================================

// ---------- Types ----------
type Category = 'water' | 'feed' | 'prune' | 'pest' | 'harvest' | 'soil' | 'observe' | 'ph';
type Priority = 'low' | 'medium' | 'high' | 'urgent';
type Sun = 'full_sun' | 'part_sun' | 'part_shade' | 'full_shade';
type Stage = 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest' | 'dormant';
type CropCat = 'leafy' | 'fruiting_veg' | 'root' | 'herb' | 'citrus' | 'stone_fruit' | 'berry' | 'flower';

interface Bed {
  id: string; name: string; sun: Sun;
  color: string;            // 'pearl_white' reflects heat (albedo)
  bottomless: boolean;      // metal raised beds dry faster
  irrigationZone: string;
}
interface Plant {
  id: string; name: string; bedId: string | null;
  crop: CropCat; stage: Stage; sun: Sun;
  expectedHarvest?: string; // ISO date
}
interface DayForecast { date: string; hi: number; lo: number; precipProb: number; windMph: number; }
interface OpenPest { plantId: string; pest: string; severity: Priority; observedAt: string; }

interface GardenState {
  today: string;            // ISO
  beds: Bed[];
  plants: Plant[];
  forecast: DayForecast[];  // next 7 days, [0] = today
  lastWater: Record<string, string>;  // targetId -> ISO date
  lastFeed: Record<string, string>;
  lastPhOutOfBand: Record<string, string>; // plantId/bedId -> ISO if last reading bad
  openPests: OpenPest[];
  existingPending: { category: Category; targetId: string; due: string }[]; // for dedup
}

interface Task {
  title: string; category: Category; priority: Priority;
  targetId: string; targetName: string; due: string;
  estMinutes: number; source: 'engine'; why: string;
}

// ---------- 9b knobs ----------
const HEAT = { warm: 90, hot: 95, extreme: 100, frost: 36 } as const;

// Base days between waterings by crop + stage (in-ground, mild weather).
const WATER_BASE: Record<CropCat, number> = {
  leafy: 2, fruiting_veg: 3, root: 3, herb: 4,
  berry: 3, citrus: 7, stone_fruit: 7, flower: 3,
};
const STAGE_WATER_MULT: Partial<Record<Stage, number>> = {
  seedling: 0.6, flowering: 0.85, fruiting: 0.9, dormant: 1.6,
};

const daysBetween = (a: string, b: string) =>
  Math.round((+new Date(b) - +new Date(a)) / 86_400_000);
const addDays = (iso: string, n: number) =>
  new Date(+new Date(iso) + n * 86_400_000).toISOString().slice(0, 10);
const monthOf = (iso: string) => new Date(iso).getUTCMonth() + 1;

// Raised metal beds dry faster; white reflects heat so soil stays cooler
// (less heat STRESS) but still loses water fast in sun. Net drying factor:
function bedDryFactor(bed: Bed | undefined, sun: Sun): number {
  let f = 1;
  if (bed?.bottomless) f *= 1.2;                 // raised + open bottom
  if (sun === 'full_sun') f *= 1.15;
  else if (sun === 'part_shade' || sun === 'full_shade') f *= 0.8;
  return f;
}
// Heat-stress factor is LOWER for white beds (albedo) vs dark — the 9b detail.
function heatStressFactor(bed: Bed | undefined): number {
  return bed?.color === 'pearl_white' ? 0.85 : 1.0;
}

// ---------- Watering interval, weather-adjusted ----------
function wateringInterval(plant: Plant, bed: Bed | undefined, forecast: DayForecast[]): number {
  let interval = WATER_BASE[plant.crop] * (STAGE_WATER_MULT[plant.stage] ?? 1);
  const next3Hi = Math.max(...forecast.slice(0, 3).map(d => d.hi));
  if (next3Hi >= HEAT.extreme) interval *= 0.5;
  else if (next3Hi >= HEAT.hot) interval *= 0.65;
  else if (next3Hi >= HEAT.warm) interval *= 0.8;
  // recent/expected rain relaxes it
  const rainSoon = forecast.slice(0, 2).some(d => d.precipProb >= 0.6);
  if (rainSoon) interval *= 1.4;
  interval /= bedDryFactor(bed, plant.sun);
  return Math.max(1, Math.round(interval));
}

// ---------- Dedup ----------
function alreadyQueued(s: GardenState, cat: Category, targetId: string, due: string): boolean {
  return s.existingPending.some(p => p.category === cat && p.targetId === targetId && p.due === due);
}

const RANK: Record<Priority, number> = { urgent: 3, high: 2, medium: 1, low: 0 };

// ---------- The engine ----------
export function generateTasks(s: GardenState): Task[] {
  const tasks: Task[] = [];
  const bedById = new Map(s.beds.map(b => [b.id, b]));
  const push = (t: Task) => {
    if (alreadyQueued(s, t.category, t.targetId, t.due)) return;
    // also dedup within this run (e.g. 2 plants in one bed -> 1 water task)
    const dupe = tasks.find(x => x.category === t.category && x.targetId === t.targetId && x.due === t.due);
    if (dupe) { if (RANK[t.priority] > RANK[dupe.priority]) dupe.priority = t.priority; return; }
    tasks.push(t);
  };

  // --- Per-plant: watering, feeding, harvest, pruning ---
  for (const p of s.plants) {
    const bed = p.bedId ? bedById.get(p.bedId) : undefined;
    const target = bed ?? { name: p.name } as any;

    // WATER
    const interval = wateringInterval(p, bed, s.forecast);
    const last = s.lastWater[p.bedId ?? p.id] ?? s.lastWater[p.id];
    const since = last ? daysBetween(last, s.today) : 99;
    if (since >= interval) {
      const next3Hi = Math.max(...s.forecast.slice(0, 3).map(d => d.hi));
      const urgent = next3Hi >= HEAT.extreme && since >= interval;
      push({
        category: 'water',
        title: `Water ${target.name}`,
        priority: urgent ? 'urgent' : since > interval + 1 ? 'high' : 'medium',
        targetId: p.bedId ?? p.id, targetName: target.name, due: s.today,
        estMinutes: 4, source: 'engine',
        why: `${p.crop}/${p.stage}, ~${interval}d interval (heat-adjusted), ${since}d since last.`,
      });
    }

    // FEED — 9b citrus & stone-fruit month windows + interval fallback
    const m = monthOf(s.today);
    const lastFeed = s.lastFeed[p.id] ?? s.lastFeed[p.bedId ?? ''];
    const feedGap = lastFeed ? daysBetween(lastFeed, s.today) : 99;
    if (p.crop === 'citrus' && [2, 5, 8].includes(m) && feedGap > 20) {
      push({ category: 'feed', title: `Feed citrus — ${p.name}`, priority: 'high',
        targetId: p.id, targetName: p.name, due: s.today, estMinutes: 8, source: 'engine',
        why: `9b citrus feed window (Feb/May/Aug); ${feedGap}d since last feed.` });
    } else if (['fruiting_veg', 'berry'].includes(p.crop) && p.stage === 'fruiting' && feedGap > 14) {
      push({ category: 'feed', title: `Feed ${p.name} (fruiting)`, priority: 'medium',
        targetId: p.id, targetName: p.name, due: s.today, estMinutes: 5, source: 'engine',
        why: `Heavy feeder in fruiting stage; ${feedGap}d since last feed.` });
    }

    // PRUNE — stone fruit dormant pruning Dec–Jan
    if (p.crop === 'stone_fruit' && [12, 1].includes(m) && p.stage === 'dormant') {
      push({ category: 'prune', title: `Dormant prune ${p.name}`, priority: 'medium',
        targetId: p.id, targetName: p.name, due: s.today, estMinutes: 25, source: 'engine',
        why: `9b stone-fruit dormant pruning window.` });
    }

    // HARVEST ready
    if (p.stage === 'harvest' ||
        (p.expectedHarvest && daysBetween(s.today, p.expectedHarvest) <= 3 &&
         daysBetween(s.today, p.expectedHarvest) >= -7)) {
      push({ category: 'harvest', title: `Harvest ${p.name}`, priority: 'high',
        targetId: p.id, targetName: p.name, due: s.today, estMinutes: 10, source: 'engine',
        why: p.stage === 'harvest' ? 'Marked ready to harvest.' : 'Expected harvest window now.' });
    }

    // pH recheck if last reading was out of band (plant- or bed-keyed)
    const phBad = s.lastPhOutOfBand[p.id] ?? (p.bedId ? s.lastPhOutOfBand[p.bedId] : undefined);
    if (phBad) {
      push({ category: 'ph', title: `Recheck pH — ${p.name}`, priority: 'medium',
        targetId: p.id, targetName: p.name, due: addDays(s.today, 0), estMinutes: 3, source: 'engine',
        why: 'Last reading was out of target band.' });
    }
  }

  // --- Open pests: follow-up if unresolved > 3 days ---
  for (const pest of s.openPests) {
    if (daysBetween(pest.observedAt, s.today) >= 3) {
      const plant = s.plants.find(p => p.id === pest.plantId);
      push({ category: 'pest', title: `Re-check ${pest.pest} on ${plant?.name ?? 'plant'}`,
        priority: pest.severity === 'urgent' ? 'urgent' : 'high',
        targetId: pest.plantId, targetName: plant?.name ?? 'plant', due: s.today,
        estMinutes: 6, source: 'engine',
        why: `${pest.pest} (${pest.severity}) logged ${daysBetween(pest.observedAt, s.today)}d ago, not resolved.` });
    }
  }

  // --- Garden-level weather reactions (the Seedtime-killer) ---
  const heatDays = s.forecast.slice(0, 3).filter(d => d.hi >= HEAT.hot);
  if (heatDays.length) {
    const sunWhiteBeds = s.beds.filter(b => b.sun === 'full_sun' && b.color === 'pearl_white');
    const peak = Math.max(...heatDays.map(d => d.hi));
    push({ category: 'water',
      title: `Heat ${Math.round(peak)}°F coming — extra evening water for full-sun beds`,
      priority: peak >= HEAT.extreme ? 'urgent' : 'high',
      targetId: 'garden', targetName: 'Garden',
      due: s.today, estMinutes: 15, source: 'engine',
      why: `${heatDays.length} day(s) ≥${HEAT.hot}°F in next 3. Your white Vego beds reflect heat ` +
           `(${(heatStressFactor(sunWhiteBeds[0]) * 100).toFixed(0)}% stress factor) but the raised, ` +
           `bottomless build still dries fast — water ${sunWhiteBeds.length} full-sun beds in the evening.` });
  }
  const frostDay = s.forecast.find(d => d.lo <= HEAT.frost);
  if (frostDay) {
    push({ category: 'observe', title: `Frost risk ${frostDay.date} — protect tender plants`,
      priority: 'high', targetId: 'garden', targetName: 'Garden', due: s.today,
      estMinutes: 20, source: 'engine', why: `Low of ${frostDay.lo}°F forecast (rare in 9b).` });
  }
  const windDay = s.forecast.slice(0, 2).find(d => d.windMph >= 25);
  if (windDay) {
    push({ category: 'observe', title: `Wind ${windDay.windMph}mph — stake/secure tall plants`,
      priority: 'medium', targetId: 'garden', targetName: 'Garden', due: s.today,
      estMinutes: 10, source: 'engine', why: `Gusts ${windDay.windMph}mph forecast.` });
  }

  // --- Prioritize ---
  return tasks.sort((a, b) =>
    RANK[b.priority] - RANK[a.priority] || a.estMinutes - b.estMinutes);
}

// ============================================================
// DEMO — your real setup: 14 white Vego 2x8 beds + a heat wave
// ============================================================
function demo() {
  const today = '2026-07-15';
  const beds: Bed[] = Array.from({ length: 14 }, (_, i) => ({
    id: `bed-${i + 1}`, name: `Bed ${i + 1}`,
    sun: i < 9 ? 'full_sun' : 'part_shade',   // back row gets PM shade
    color: 'pearl_white', bottomless: true,
    irrigationZone: i < 7 ? 'Zone 1' : 'Zone 2',
  }));

  const plants: Plant[] = [
    { id: 'pl-1', name: "'Sungold' tomato", bedId: 'bed-3', crop: 'fruiting_veg', stage: 'fruiting', sun: 'full_sun', expectedHarvest: '2026-07-17' },
    { id: 'pl-2', name: 'Genovese basil',   bedId: 'bed-3', crop: 'herb',         stage: 'vegetative', sun: 'full_sun' },
    { id: 'pl-3', name: 'Romaine lettuce',  bedId: 'bed-11', crop: 'leafy',       stage: 'vegetative', sun: 'part_shade' },
    { id: 'pl-4', name: 'Albion strawberry',bedId: 'bed-7', crop: 'berry',        stage: 'fruiting',   sun: 'full_sun' },
    { id: 'pl-5', name: 'Improved Meyer lemon', bedId: null, crop: 'citrus',      stage: 'vegetative', sun: 'full_sun' },
  ];

  const forecast: DayForecast[] = [
    { date: '2026-07-15', hi: 94, lo: 68, precipProb: 0.0, windMph: 8 },
    { date: '2026-07-16', hi: 99, lo: 71, precipProb: 0.0, windMph: 10 },
    { date: '2026-07-17', hi: 103, lo: 74, precipProb: 0.0, windMph: 12 }, // heat wave
    { date: '2026-07-18', hi: 97, lo: 72, precipProb: 0.0, windMph: 9 },
    { date: '2026-07-19', hi: 90, lo: 68, precipProb: 0.1, windMph: 7 },
    { date: '2026-07-20', hi: 88, lo: 66, precipProb: 0.2, windMph: 6 },
    { date: '2026-07-21', hi: 86, lo: 65, precipProb: 0.1, windMph: 6 },
  ];

  const state: GardenState = {
    today, beds, plants, forecast,
    lastWater: { 'bed-3': '2026-07-13', 'bed-7': '2026-07-12', 'bed-11': '2026-07-13', 'pl-5': '2026-07-10' },
    lastFeed:  { 'pl-4': '2026-06-28' },
    lastPhOutOfBand: { 'bed-7': '2026-07-12' },
    openPests: [{ plantId: 'pl-4', pest: 'spider mites', severity: 'high', observedAt: '2026-07-11' }],
    existingPending: [],
  };

  const tasks = generateTasks(state);
  console.log(`\n🌱  9B GrowOS — Today (${today}), 14 white Vego beds\n`);
  const icon: Record<Category, string> = { water:'💧', feed:'🌿', prune:'✂️', pest:'🐛', harvest:'🍅', soil:'🪴', observe:'👀', ph:'🧪' };
  tasks.forEach((t, i) => {
    console.log(`${String(i + 1).padStart(2)}. ${icon[t.category]} [${t.priority.toUpperCase()}] ${t.title}  (${t.estMinutes}m)`);
    console.log(`      ↳ ${t.why}`);
  });
  console.log(`\n${tasks.length} tasks · ${tasks.filter(t => t.priority === 'urgent').length} urgent\n`);
}

demo();
