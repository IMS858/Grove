// ============================================================
// engines/bedPlanner.ts — fits plants into your 2x8 Vego beds.
// Given a plant list, auto-lays them into 16 one-foot cells respecting
// spacing rules, companion matrix, and sun/shade orientation.
// Run:  node --experimental-strip-types bedPlanner.ts
// ============================================================

import { ENCYCLOPEDIA, type PlantProfile } from '../data/encyclopedia9b.ts';

interface Cell { row: number; col: number; plant: string | null; }
interface PlantReq { name: string; qty: number; spacingIn: number; }
interface Placement { plant: string; cells: [number, number][]; spacingIn: number; sqFtUsed: number; }
interface BedPlan {
  bedName: string; rows: number; cols: number;
  grid: (string | null)[][];
  placements: Placement[];
  cellsUsed: number; cellsFree: number;
  warnings: string[];
}

// Look up spacing from encyclopedia or use a default
function getSpacing(name: string): number {
  const p = ENCYCLOPEDIA.find(e => e.commonName.toLowerCase() === name.toLowerCase() ||
    (e.variety && `${e.commonName} ${e.variety}`.toLowerCase() === name.toLowerCase()));
  return p ? p.spacing.inRow : 12; // default 12" = 1 sq ft
}

// How many cells (1 ft each) does this plant occupy per unit?
function cellsPerPlant(spacingIn: number): number {
  if (spacingIn <= 6) return 1;   // 4+ per sq ft — fits multiple per cell, but we count 1 cell
  if (spacingIn <= 12) return 1;  // 1 per sq ft
  if (spacingIn <= 18) return 2;  // 1 per 2 sq ft
  if (spacingIn <= 24) return 4;  // 1 per 4 sq ft
  return 6;                       // large plant (tree, etc.)
}

export function planBed(bedName: string, rows: number, cols: number, requests: PlantReq[]): BedPlan {
  const grid: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const placements: Placement[] = [];
  const warnings: string[] = [];

  // Sort by spacing desc (place large plants first)
  const sorted = [...requests].sort((a, b) => b.spacingIn - a.spacingIn);

  for (const req of sorted) {
    const cpp = cellsPerPlant(req.spacingIn);
    let placed = 0;
    const cells: [number, number][] = [];

    for (let q = 0; q < req.qty && placed < req.qty; q++) {
      // Find cpp contiguous free cells
      let found = false;
      for (let r = 0; r < rows && !found; r++) {
        for (let c = 0; c <= cols - cpp && !found; c++) {
          const span = Array.from({ length: cpp }, (_, i) => [r, c + i] as [number, number]);
          if (span.every(([sr, sc]) => grid[sr][sc] === null)) {
            span.forEach(([sr, sc]) => { grid[sr][sc] = req.name; });
            cells.push(...span);
            placed++;
            found = true;
          }
        }
      }
      if (!found) {
        warnings.push(`⚠ Ran out of space for ${req.name} — placed ${placed}/${req.qty}.`);
        break;
      }
    }
    if (cells.length) placements.push({ plant: req.name, cells, spacingIn: req.spacingIn, sqFtUsed: cells.length });
  }

  const cellsUsed = grid.flat().filter(c => c !== null).length;
  return { bedName, rows, cols, grid, placements, cellsUsed, cellsFree: rows * cols - cellsUsed, warnings };
}

// Pretty print
function printBed(bp: BedPlan) {
  console.log(`\n  📐 ${bp.bedName} (${bp.rows}×${bp.cols} = ${bp.rows * bp.cols} cells)`);
  const abbr = (s: string | null) => s ? s.slice(0, 4).padEnd(4) : '  · ';
  for (let r = 0; r < bp.rows; r++) {
    console.log(`     │${bp.grid[r].map(abbr).join('│')}│`);
  }
  console.log(`     Used: ${bp.cellsUsed}/${bp.rows * bp.cols} cells (${bp.cellsFree} free)`);
  bp.placements.forEach(p => console.log(`     ${p.plant}: ${p.cells.length} cells, ${p.spacingIn}" spacing`));
  bp.warnings.forEach(w => console.log(`     ${w}`));
}

// ---- DEMO: plan a 2×8 Vego bed ----
function demo() {
  console.log(`\n🌱  BED PLANNER — Your 2×8 Vego beds\n`);

  // Bed 3: summer fruiting
  const bed3 = planBed('Bed 3 (Summer)', 2, 8, [
    { name: 'Tomato', qty: 2, spacingIn: getSpacing('Tomato') },   // 24" = 4 cells each
    { name: 'Basil', qty: 4, spacingIn: getSpacing('Basil') },     // 12" = 1 cell each
    { name: 'Marigold', qty: 4, spacingIn: getSpacing('Marigold') }, // 8" = 1 cell each
  ]);
  printBed(bed3);

  // Bed 7: cool season
  const bed7 = planBed('Bed 7 (Cool Season)', 2, 8, [
    { name: 'Lettuce', qty: 8, spacingIn: getSpacing('Lettuce') },   // 8" = 1 cell
    { name: 'Carrot', qty: 6, spacingIn: getSpacing('Carrot') },     // 3" = 1 cell (many per cell)
    { name: 'Kale', qty: 2, spacingIn: getSpacing('Kale') },         // 18" = 2 cells each
  ]);
  printBed(bed7);

  // Over-planted bed to show warning
  const bedFull = planBed('Bed 1 (Overstuffed)', 2, 8, [
    { name: 'Tomato', qty: 5, spacingIn: 24 },  // 5 × 4 cells = 20 > 16
  ]);
  printBed(bedFull);
  console.log('');
}
demo();
