// ============================================================
// engines/companionMatrix.ts — companion planting intelligence.
// A full pairing matrix with reasons, plus a bed-planning tool that
// takes a bed's plants and flags conflicts / suggests additions.
// Run:  node --experimental-strip-types companionMatrix.ts
// ============================================================

type Rel = 'great' | 'good' | 'neutral' | 'bad';

interface Pairing { a: string; b: string; rel: Rel; reason: string; }

// --- The matrix (lowercase canonical names) ---
const PAIRINGS: Pairing[] = [
  { a: 'tomato', b: 'basil', rel: 'great', reason: 'Basil repels aphids/whitefly; may improve flavor.' },
  { a: 'tomato', b: 'marigold', rel: 'great', reason: 'Marigold roots suppress nematodes; flowers attract beneficials.' },
  { a: 'tomato', b: 'carrot', rel: 'good', reason: 'Carrots loosen soil around tomato roots; different root zones.' },
  { a: 'tomato', b: 'parsley', rel: 'good', reason: 'Attracts hoverflies that eat aphids.' },
  { a: 'tomato', b: 'pepper', rel: 'good', reason: 'Same family, same needs; rotate together. No allelopathy.' },
  { a: 'tomato', b: 'fennel', rel: 'bad', reason: 'Fennel secretes compounds that inhibit tomato growth.' },
  { a: 'tomato', b: 'brassica', rel: 'bad', reason: 'Heavy feeders compete; brassicas stunt nightshade growth.' },
  { a: 'tomato', b: 'corn', rel: 'bad', reason: 'Both attract tomato hornworm / corn earworm (same pest).' },
  { a: 'tomato', b: 'dill', rel: 'bad', reason: 'Mature dill inhibits tomato growth (young dill is fine).' },
  { a: 'pepper', b: 'basil', rel: 'great', reason: 'Same benefits as with tomato.' },
  { a: 'pepper', b: 'carrot', rel: 'good', reason: 'Different root zones; carrots break compaction.' },
  { a: 'pepper', b: 'fennel', rel: 'bad', reason: 'Fennel inhibits most garden plants.' },
  { a: 'lettuce', b: 'carrot', rel: 'great', reason: 'Shallow lettuce + deep carrot = perfect space use. Lettuce shades carrot soil.' },
  { a: 'lettuce', b: 'radish', rel: 'great', reason: 'Radish matures fast and marks rows; loosens soil for lettuce.' },
  { a: 'lettuce', b: 'strawberry', rel: 'great', reason: 'Lettuce as living mulch around strawberry crowns.' },
  { a: 'lettuce', b: 'onion', rel: 'good', reason: 'Onion scent deters slugs.' },
  { a: 'kale', b: 'onion', rel: 'great', reason: 'Alliums confuse cabbage moths seeking brassicas.' },
  { a: 'kale', b: 'garlic', rel: 'great', reason: 'Same moth-confusing benefit; garlic also deters aphids.' },
  { a: 'kale', b: 'nasturtium', rel: 'great', reason: 'Nasturtium acts as a trap crop for aphids — they prefer it.' },
  { a: 'kale', b: 'dill', rel: 'good', reason: 'Dill attracts parasitic wasps that control cabbage worm.' },
  { a: 'kale', b: 'strawberry', rel: 'bad', reason: 'Both are heavy feeders competing for the same nutrients.' },
  { a: 'carrot', b: 'onion', rel: 'great', reason: 'Onion repels carrot rust fly; carrot repels onion fly. Classic pairing.' },
  { a: 'carrot', b: 'rosemary', rel: 'great', reason: 'Rosemary scent masks carrot from carrot fly.' },
  { a: 'carrot', b: 'leek', rel: 'great', reason: 'Same mutual pest confusion as carrot/onion.' },
  { a: 'carrot', b: 'dill', rel: 'bad', reason: 'Same family (Apiaceae); attracts carrot fly and cross-pollinates.' },
  { a: 'bean', b: 'corn', rel: 'great', reason: 'Three Sisters: bean fixes N, corn provides support, squash mulches.' },
  { a: 'bean', b: 'squash', rel: 'great', reason: 'Three Sisters classic. Squash shades soil; bean fixes N.' },
  { a: 'bean', b: 'marigold', rel: 'good', reason: 'Marigold deters bean beetles.' },
  { a: 'bean', b: 'onion', rel: 'bad', reason: 'Alliums inhibit legume nitrogen fixation.' },
  { a: 'bean', b: 'garlic', rel: 'bad', reason: 'Same allium inhibition of N fixation.' },
  { a: 'strawberry', b: 'borage', rel: 'great', reason: 'Borage attracts pollinators; may improve strawberry yield and flavor.' },
  { a: 'strawberry', b: 'thyme', rel: 'good', reason: 'Thyme groundcover deters slugs around berries.' },
  { a: 'strawberry', b: 'brassica', rel: 'bad', reason: 'Heavy feeders competing in the same root zone.' },
  { a: 'basil', b: 'sage', rel: 'bad', reason: 'Different water needs; sage prefers dry, basil likes moisture.' },
  { a: 'rosemary', b: 'sage', rel: 'great', reason: 'Both Mediterranean; same water/soil needs; beautiful together.' },
  { a: 'rosemary', b: 'lavender', rel: 'great', reason: 'Same drought-tolerant Mediterranean needs.' },
  { a: 'rosemary', b: 'basil', rel: 'bad', reason: 'Rosemary needs dry; basil needs moisture. Don\'t share a bed.' },
  { a: 'marigold', b: 'squash', rel: 'great', reason: 'Repels squash vine borer and whitefly.' },
  { a: 'marigold', b: 'cucumber', rel: 'great', reason: 'Deters cucumber beetles and aphids.' },
  { a: 'citrus', b: 'nasturtium', rel: 'good', reason: 'Attracts beneficial insects; trap crop for aphids.' },
  { a: 'citrus', b: 'lavender', rel: 'good', reason: 'Attracts pollinators; drought-tolerant companion under drip line.' },
  { a: 'citrus', b: 'comfrey', rel: 'great', reason: 'Chop-and-drop dynamic accumulator — feeds the tree with potassium-rich mulch.' },
];

// Normalize to bidirectional lookup
const idx = new Map<string, Map<string, { rel: Rel; reason: string }>>();
for (const p of PAIRINGS) {
  for (const [x, y] of [[p.a, p.b], [p.b, p.a]]) {
    if (!idx.has(x)) idx.set(x, new Map());
    idx.get(x)!.set(y, { rel: p.rel, reason: p.reason });
  }
}

export function lookup(a: string, b: string): { rel: Rel; reason: string } | null {
  return idx.get(a.toLowerCase())?.get(b.toLowerCase()) ?? null;
}

export function allCompanionsFor(plant: string): { plant: string; rel: Rel; reason: string }[] {
  const m = idx.get(plant.toLowerCase());
  return m ? [...m.entries()].map(([p, v]) => ({ plant: p, ...v })).sort((a, b) => relRank(a.rel) - relRank(b.rel)) : [];
}
const relRank = (r: Rel) => ({ great: 0, good: 1, neutral: 2, bad: 3 })[r];

// Plan a bed: given what's planted, flag conflicts and suggest additions.
export function planBed(plants: string[]): { conflicts: string[]; suggestions: string[]; matrix: string[][] } {
  const lc = plants.map(p => p.toLowerCase());
  const conflicts: string[] = [];
  const matrix: string[][] = [];

  for (let i = 0; i < lc.length; i++) {
    const row = [plants[i]];
    for (let j = 0; j < lc.length; j++) {
      if (i === j) { row.push('—'); continue; }
      const r = lookup(lc[i], lc[j]);
      row.push(r ? r.rel : '?');
      if (r?.rel === 'bad') conflicts.push(`⚠ ${plants[i]} + ${plants[j]}: ${r.reason}`);
    }
    matrix.push(row);
  }
  // Dedupe symmetric conflicts
  const seen = new Set<string>();
  const uniq = conflicts.filter(c => { const k = c.split(':')[0].split(' + ').sort().join('+'); if (seen.has(k)) return false; seen.add(k); return true; });

  // Suggest: find plants that are "great" with multiple current plants and "bad" with none.
  const candidates = new Set<string>();
  lc.forEach(p => allCompanionsFor(p).filter(c => c.rel === 'great').forEach(c => candidates.add(c.plant)));
  const suggestions = [...candidates].filter(c => !lc.includes(c) && !lc.some(p => lookup(p, c)?.rel === 'bad'))
    .slice(0, 5).map(c => {
      const supporters = lc.filter(p => { const r = lookup(p, c); return r?.rel === 'great' || r?.rel === 'good'; });
      return `✅ Add ${c} — great with ${supporters.join(', ')}`;
    });

  return { conflicts: uniq, suggestions, matrix };
}

// ---- DEMO ----
function demo() {
  console.log(`\n🌿  COMPANION PLANTING ENGINE — ${PAIRINGS.length} pairings\n`);

  console.log('  All companions for Tomato:');
  allCompanionsFor('tomato').forEach(c => console.log(`    ${c.rel === 'great' ? '💚' : c.rel === 'good' ? '✅' : '❌'} ${c.plant}: ${c.reason}`));

  console.log('\n  — Plan a bed: [Tomato, Basil, Carrot, Kale] —');
  const plan = planBed(['Tomato', 'Basil', 'Carrot', 'Kale']);
  if (plan.conflicts.length) { console.log('  Conflicts:'); plan.conflicts.forEach(c => console.log(`    ${c}`)); }
  else console.log('  No conflicts!');
  console.log('  Suggestions:');
  plan.suggestions.forEach(s => console.log(`    ${s}`));
  console.log(`\n  Matrix: [${plan.matrix.map(r => r.join(' | ')).join(']\n           [')}]\n`);

  console.log('  — Plan a bed: [Bean, Garlic, Strawberry] —');
  const plan2 = planBed(['Bean', 'Garlic', 'Strawberry']);
  plan2.conflicts.forEach(c => console.log(`    ${c}`));
  plan2.suggestions.forEach(s => console.log(`    ${s}`));
  console.log('');
}
demo();
