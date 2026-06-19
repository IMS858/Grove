// ============================================================
// engines/successionPlanner.ts — keeps beds producing year-round.
// Given what's in a bed and today's date, tells you what to sow next
// so the bed is never empty. 9b-specific: we can grow year-round.
// Run:  node --experimental-strip-types successionPlanner.ts
// ============================================================
import { ENCYCLOPEDIA, type PlantProfile } from '../data/encyclopedia9b.ts';

interface CurrentPlant { name: string; expectedEnd: string; cropCat: string; } // end = harvest end date ISO
interface Suggestion { plant: string; variety?: string; sowBy: string; reason: string; }

const monthOf = (iso: string) => new Date(iso).getUTCMonth() + 1;
const addMonths = (iso: string, n: number) => {
  const d = new Date(iso); d.setUTCMonth(d.getUTCMonth() + n); return d.toISOString().slice(0, 10);
};

// Crop family grouping for rotation (don't follow same family)
const FAMILY_MAP: Record<string, string> = {
  fruiting_veg: 'Solanaceae', nightshade: 'Solanaceae',
  leafy: 'varies', brassica: 'Brassicaceae', root: 'varies',
  legume: 'Fabaceae', herb: 'varies', cucurbit: 'Cucurbitaceae',
  berry: 'varies', citrus: 'Rutaceae', stone_fruit: 'Rosaceae',
  allium: 'Amaryllidaceae', flower: 'varies',
};

export function suggestSuccession(current: CurrentPlant, today: string): Suggestion[] {
  const endMonth = monthOf(current.expectedEnd);
  const sowMonth = endMonth <= 12 ? endMonth : endMonth - 12; // month to start next crop
  const transitionDate = current.expectedEnd;
  const currentFamily = FAMILY_MAP[current.cropCat] ?? 'unknown';

  // Find in-season candidates that are NOT the same family
  const candidates = ENCYCLOPEDIA.filter(p => {
    if (p.commonName.toLowerCase() === current.name.toLowerCase()) return false;
    const pFamily = FAMILY_MAP[p.cropCat] ?? 'unknown';
    if (pFamily !== 'varies' && pFamily === currentFamily && currentFamily !== 'unknown') return false;
    return p.sowMonths.includes(sowMonth) || p.sowMonths.includes(sowMonth + 1 > 12 ? 1 : sowMonth + 1);
  });

  const suggestions: Suggestion[] = candidates.map(c => ({
    plant: c.commonName, variety: c.variety,
    sowBy: addMonths(transitionDate, 0),
    reason: buildReason(current, c),
  }));

  // Sort: nitrogen fixers first (after heavy feeders), then by sow-window fit
  suggestions.sort((a, b) => {
    const aLeg = a.plant.toLowerCase().includes('bean') || a.plant.toLowerCase().includes('pea') ? -1 : 0;
    const bLeg = b.plant.toLowerCase().includes('bean') || b.plant.toLowerCase().includes('pea') ? -1 : 0;
    return aLeg - bLeg;
  });

  return suggestions.slice(0, 5);
}

function buildReason(current: CurrentPlant, next: PlantProfile): string {
  const parts: string[] = [];
  const curCat = current.cropCat;
  if (curCat === 'fruiting_veg' || curCat === 'nightshade') {
    if (next.cropCat === 'legume') parts.push('Legume fixes nitrogen depleted by heavy-feeding tomatoes/peppers.');
    if (next.cropCat === 'leafy' || next.cropCat === 'root') parts.push('Light feeder lets the soil recover.');
    if (next.cropCat === 'brassica') parts.push('Different family breaks pest/disease cycle.');
  }
  if (curCat === 'brassica') {
    if (next.cropCat === 'legume') parts.push('Follows heavy-feeding brassicas with N-fixer.');
    if (next.cropCat === 'fruiting_veg') parts.push('Nightshades use different nutrients and break brassica pest cycle.');
  }
  if (curCat === 'legume') {
    parts.push('Soil now has extra nitrogen — follow with a heavy feeder to use it.');
  }
  if (!parts.length) parts.push('Different family; in season now.');
  if (next.zone9b) parts.push(next.zone9b.bestSeason.split('.')[0] + '.');
  return parts.join(' ');
}

// Year-round rotation plan for a single bed
export function yearPlan(bedName: string): { month: number; action: string; plants: string[] }[] {
  return [
    { month: 2, action: 'Prep + transplant', plants: ['Tomato (Sungold)', 'Basil', 'Marigold (edges)'] },
    { month: 5, action: 'Fruiting — harvest + feed', plants: ['Tomato (Sungold)', 'Basil'] },
    { month: 8, action: 'Pull spent summer crops; amend soil', plants: [] },
    { month: 9, action: 'Sow cool season', plants: ['Kale (Lacinato)', 'Carrot (Nantes)', 'Lettuce (Jericho)'] },
    { month: 11, action: 'Begin cool-season harvest', plants: ['Kale', 'Carrot', 'Lettuce'] },
    { month: 1, action: 'Continue harvest; plan spring transplants', plants: ['Kale (still producing)', 'Carrot'] },
  ];
}

// ---- DEMO ----
function demo() {
  console.log(`\n🔄  SUCCESSION PLANNER — Keep beds producing year-round\n`);

  const cases: CurrentPlant[] = [
    { name: 'Tomato', expectedEnd: '2026-08-15', cropCat: 'fruiting_veg' },
    { name: 'Kale', expectedEnd: '2026-03-01', cropCat: 'brassica' },
    { name: 'Bush bean', expectedEnd: '2026-06-15', cropCat: 'legume' },
  ];
  for (const c of cases) {
    console.log(`  After ${c.name} (ends ~${c.expectedEnd}):`);
    const sugg = suggestSuccession(c, '2026-07-01');
    sugg.forEach(s => console.log(`    → ${s.plant}${s.variety ? ` '${s.variety}'` : ''} — sow by ${s.sowBy}`));
    if (sugg[0]) console.log(`      Why: ${sugg[0].reason}`);
    console.log('');
  }

  console.log(`  📅 YEAR-ROUND ROTATION for one 2×8 bed:`);
  yearPlan('Bed 3').forEach(p => console.log(`    Month ${String(p.month).padStart(2)}: ${p.action} — [${p.plants.join(', ') || '—'}]`));
  console.log('');
}
demo();
